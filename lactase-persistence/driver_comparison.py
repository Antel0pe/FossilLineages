"""
Re-run Evershed et al. 2022's selection-driver comparison from their own public data,
and add the baseline they never ran.

Their test: does letting selection strength follow an archaeological time series beat
a null of constant selection? They report the LP data being 689x / 284x / 34x more
probable under population fluctuations / settlement density / wild animals.

What they never show on shared axes: whether the winning models' PREDICTED CURVES are
actually distinguishable from each other, or from constant selection. And they never
fit the obvious intermediate — selection constant in time but DIFFERENT PER REGION —
which is what you'd expect to win if the signal is a spatial gradient rather than
episodic crises. Insolation is already a hint: their own file notes it is constant
through time, varying only between regions, and it still beats the null.

Model (their Methods, reimplemented):
    s(t) = b * m(t)^(1/a - 1)          a = 1 collapses to constant selection s = b
    y(t) = y0 / (y0 + (1-y0) e^(-s t)) additive fitness, 28-yr generations
    lnL  = sum_ancestral ln(1-y) + sum_derived ln(y), summed over the four regions
           with ONE shared parameter set

Data:
    aDNA        data/lactase/adna/AADRv44.all.mpileups.tsv   (local)
    proxies     github.com/AdrianTimpson/2020-03-03523A      (--repo, cloned)

Run:  python3 lactase-persistence/driver_comparison.py --repo /tmp/timpson
"""

import argparse
import csv
import os
import re
import sys

import matplotlib
import numpy as np

if not os.environ.get("DISPLAY") and sys.platform != "win32":
    matplotlib.use("Agg")
import matplotlib.pyplot as plt
from scipy.optimize import differential_evolution
from scipy.stats import beta, chi2

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
ADNA_TSV = os.path.join(ROOT, "data", "lactase", "adna", "AADRv44.all.mpileups.tsv")
OUT_PNG = os.path.join(HERE, "driver_comparison.png")

REGIONS = ["British Isles", "Baltic region", "Rhine Danube axis", "Mediterranean Europe"]
GEN = 28.0
WIN_START_BP, WIN_END_BP = 8000.0, 2500.0

RAMP = ["#cde2fb", "#9ec5f4", "#6da7ec", "#3987e5", "#1665be", "#0b4587", "#05264e"]
INK, MUTED, SURFACE, GRID = "#0b0b0b", "#6b6a66", "#fcfcfb", "#e4e2dc"
ACCENT, ACCENT2 = "#b4451f", "#1a7f6b"


# ---------------------------------------------------------------- geometry
def parse_kml_polygons(path):
    """Map region name -> list of (lon, lat) rings. KML nests <name> then <coordinates>."""
    with open(path, encoding="utf-8") as fh:
        text = fh.read()
    polys = {}
    for block in re.split(r"<Placemark[^>]*>", text)[1:]:
        name_m = re.search(r"<name>([^<]*)</name>", block)
        coord_m = re.search(r"<coordinates>([^<]*)</coordinates>", block, re.S)
        if not name_m or not coord_m:
            continue
        name = name_m.group(1).strip()
        pts = []
        for tok in coord_m.group(1).split():
            parts = tok.split(",")
            if len(parts) >= 2:
                pts.append((float(parts[0]), float(parts[1])))
        if pts:
            polys.setdefault(name, []).append(pts)
    return polys


def point_in_ring(lon, lat, ring):
    """Standard ray-casting test."""
    inside = False
    n = len(ring)
    for i in range(n):
        x1, y1 = ring[i]
        x2, y2 = ring[(i + 1) % n]
        if (y1 > lat) != (y2 > lat):
            xin = (x2 - x1) * (lat - y1) / (y2 - y1) + x1
            if lon < xin:
                inside = not inside
    return inside


def assign_region(lon, lat, polys):
    for name in REGIONS:
        for ring in polys.get(name, []):
            if point_in_ring(lon, lat, ring):
                return name
    return None


# ---------------------------------------------------------------- data
def load_adna(polys):
    """region -> list of (date_bp, n_derived, n_total), restricted to the model window."""
    out = {r: [] for r in REGIONS}
    dropped_window = dropped_region = 0
    with open(ADNA_TSV, newline="", encoding="utf-8") as fh:
        for rec in csv.DictReader(fh, delimiter="\t"):
            gt = (rec.get("genotype") or "").strip()
            if gt not in ("GG", "GA", "AG", "AA", "G", "A"):
                continue
            try:
                d = float(rec["mean_date"])
                lat, lon = float(rec["lat"]), float(rec["long"])
            except (TypeError, ValueError):
                continue
            reg = assign_region(lon, lat, polys)
            if reg is None:
                dropped_region += 1
                continue
            if not (WIN_END_BP <= d <= WIN_START_BP):
                dropped_window += 1
                continue
            out[reg].append((d, gt.count("A"), len(gt)))
    return out, dropped_region, dropped_window


def load_proxy(repo, fname):
    path = os.path.join(repo, "ecological proxy variables", fname)
    rows = []
    with open(path, newline="", encoding="utf-8") as fh:
        for rec in csv.DictReader(fh):
            rows.append({
                "startBP": float(rec["startBP"]),
                "endBP": float(rec["endBP"]),
                **{r: float(rec[f"{r} MAP"]) for r in REGIONS},
            })
    rows.sort(key=lambda r: -r["startBP"])
    return rows


# ---------------------------------------------------------------- model
def logistic(y, s, gens):
    if y <= 0:
        return 0.0
    return y / (y + (1.0 - y) * np.exp(-s * gens))


def trajectory(y0, s_per_slice, slices):
    """Frequency at the START of each slice, walking forward from 8000 BP."""
    starts = np.empty(len(slices))
    y = y0
    for i, sl in enumerate(slices):
        starts[i] = y
        gens = (sl["startBP"] - sl["endBP"]) / GEN
        y = logistic(y, s_per_slice[i], gens)
    return starts, y


def freq_at(date_bp, starts, s_per_slice, slices):
    for i, sl in enumerate(slices):
        if sl["endBP"] <= date_bp <= sl["startBP"]:
            gens = (sl["startBP"] - date_bp) / GEN
            return logistic(starts[i], s_per_slice[i], gens)
    return starts[-1] if date_bp < slices[-1]["endBP"] else starts[0]


def selection_series(proxy_rows, region, a, b, invert):
    if proxy_rows is None:                       # constant model
        return np.full(len(SLICE_TEMPLATE), b)
    m = np.array([r[region] for r in proxy_rows])
    if invert:
        m = 1.0 - m
    expo = 1.0 / a - 1.0
    return b * np.power(np.clip(m, 0.0, 1.0), expo)


def neg_loglik(params, data, proxy_rows, invert, per_region_b):
    if per_region_b:
        y0, bs = params[0], params[1:]
    else:
        y0, a, b = params[0], params[1], params[2]
    total = 0.0
    for ri, region in enumerate(REGIONS):
        obs = data[region]
        if not obs:
            continue
        if per_region_b:
            s_series = np.full(len(SLICE_TEMPLATE), bs[ri])
        else:
            s_series = selection_series(proxy_rows, region, a, b, invert)
        starts, _ = trajectory(y0, s_series, SLICE_TEMPLATE)
        for date_bp, n_der, n_tot in obs:
            y = freq_at(date_bp, starts, s_series, SLICE_TEMPLATE)
            y = min(max(y, 1e-12), 1 - 1e-12)
            total += n_der * np.log(y) + (n_tot - n_der) * np.log(1.0 - y)
    return -total


def fit(data, proxy_rows, invert=False, per_region_b=False, seed=7):
    if per_region_b:
        bounds = [(1e-6, 0.1)] + [(0.0, 0.1)] * len(REGIONS)
    elif proxy_rows is None:
        bounds = [(1e-6, 0.1), (1.0, 1.0), (0.0, 0.1)]      # a pinned to 1
    else:
        bounds = [(1e-6, 0.1), (0.01, 1.0), (0.0, 0.1)]
    res = differential_evolution(
        neg_loglik, bounds, args=(data, proxy_rows, invert, per_region_b),
        seed=seed, tol=1e-10, maxiter=1200, popsize=25, polish=True,
    )
    return res.x, -res.fun


# ---------------------------------------------------------------- reporting
def jeffreys(d, n):
    return beta.ppf(0.025, d + 0.5, n - d + 0.5), beta.ppf(0.975, d + 0.5, n - d + 0.5)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--repo", default="/tmp/timpson")
    args = ap.parse_args()

    polys = parse_kml_polygons(os.path.join(args.repo, "polygons", "polygons.model.6.kml"))
    data, drop_reg, drop_win = load_adna(polys)

    global SLICE_TEMPLATE
    SLICE_TEMPLATE = load_proxy(args.repo, "milk proportion.csv")

    print(f"aDNA in window {WIN_START_BP:.0f}-{WIN_END_BP:.0f} BP, inside the four polygons:")
    grand_d = grand_n = 0
    for r in REGIONS:
        d = sum(x[1] for x in data[r])
        n = sum(x[2] for x in data[r])
        grand_d += d
        grand_n += n
        print(f"  {r:<24} {n:5d} alleles, {d:3d} derived ({100*d/n if n else 0:.1f}%)")
    print(f"  {'TOTAL':<24} {grand_n:5d} alleles, {grand_d:3d} derived")
    print(f"  (dropped: {drop_reg} outside polygons, {drop_win} outside time window)\n")

    proxies = [
        ("milk proportion",        "milk proportion.csv",           False),
        ("pop fluctuations",       "pop fluctuations stat.csv",     False),
        ("pop fluctuations (inv)", "pop fluctuations stat.csv",     True),
        ("settlement density",     "cluster stat.csv",              False),
        ("settlement density (inv)", "cluster stat.csv",            True),
        ("domestic animals",       "domestic animal proportion.csv", False),
        ("wild animals (inv dom)", "domestic animal proportion.csv", True),
        ("insolation",             "midday insolation.csv",         False),
        ("insolation (inv)",       "midday insolation.csv",         True),
    ]

    par0, ll0 = fit(data, None)
    print(f"NULL  constant selection: lnL = {ll0:.3f}   "
          f"y0 = {par0[0]:.5f}, s = {par0[2]*100:.3f}%/gen\n")

    results = []
    for label, fname, inv in proxies:
        rows = load_proxy(args.repo, fname)
        par, ll = fit(data, rows, invert=inv)
        d_ll = ll - ll0
        p = chi2.sf(2 * max(d_ll, 0.0), df=1)
        results.append((label, ll, d_ll, np.exp(d_ll), par, p, rows, inv))

    par_pr, ll_pr = fit(data, None, per_region_b=True)
    d_pr = ll_pr - ll0
    p_pr = chi2.sf(2 * max(d_pr, 0.0), df=len(REGIONS) - 1)

    print(f"{'model':<26}{'lnL':>10}{'d lnL':>9}{'lik ratio':>13}{'p':>11}")
    print("-" * 69)
    for label, ll, d_ll, lr, par, p, _, _ in sorted(results, key=lambda r: -r[1]):
        print(f"{label:<26}{ll:>10.3f}{d_ll:>9.3f}{lr:>13,.1f}{p:>11.2}")
    print("-" * 69)
    print(f"{'PER-REGION constant s':<26}{ll_pr:>10.3f}{d_pr:>9.3f}"
          f"{np.exp(d_pr):>13,.1f}{p_pr:>11.2}   <- never run in the paper")
    print(f"   per-region s: " + ", ".join(
        f"{r.split()[0]}={par_pr[1+i]*100:.2f}%" for i, r in enumerate(REGIONS)))

    # -------------------------------------------------- overlay figure
    by_label = {r[0]: r for r in results}
    # (label, params, proxy_rows, invert, colour, linestyle)
    show = [("constant selection", par0, None, False, INK, "--")]
    for lab, colour in [("insolation (inv)", ACCENT2),
                        ("pop fluctuations", ACCENT),
                        ("settlement density", RAMP[4])]:
        rec = by_label[lab]
        show.append((lab, rec[4], rec[6], rec[7], colour, "-"))
    show.append(("per-region constant s", par_pr, None, False, "#8a4fbd", ":"))

    fig, axes = plt.subplots(2, 2, figsize=(13.5, 9), sharex=True, sharey=True)
    fig.patch.set_facecolor(SURFACE)

    for ax, region in zip(axes.ravel(), REGIONS):
        # observed, binned
        obs = data[region]
        edges = np.arange(WIN_END_BP, WIN_START_BP + 1, 750.0)[::-1]
        for hi, lo in zip(edges[:-1], edges[1:]):
            d = sum(x[1] for x in obs if lo <= x[0] < hi)
            n = sum(x[2] for x in obs if lo <= x[0] < hi)
            if n == 0:
                continue
            mid = 0.5 * (lo + hi)
            c_lo, c_hi = jeffreys(d, n)
            ax.vlines(mid, c_lo * 100, c_hi * 100, color=GRID, lw=7)
            ax.plot(mid, 100 * d / n, "o", color=MUTED, ms=4.5, zorder=4)

        ri = REGIONS.index(region)
        for label, par, rows, inv, colour, ls in show:
            y0 = par[0]
            if label == "per-region constant s":
                series = np.full(len(SLICE_TEMPLATE), par[1 + ri])
            elif rows is None:
                series = np.full(len(SLICE_TEMPLATE), par[2])
            else:
                series = selection_series(rows, region, par[1], par[2], inv)
            starts, _ = trajectory(y0, series, SLICE_TEMPLATE)
            xs = np.array([sl["startBP"] for sl in SLICE_TEMPLATE])
            ax.plot(xs, starts * 100, color=colour, lw=2.1, ls=ls, label=label)

        ax.set_title(region, loc="left", fontsize=12, color=INK, fontweight="bold")
        ax.set_facecolor(SURFACE)
        ax.invert_xaxis()
        ax.set_ylim(-1, 30)
        ax.grid(True, color=GRID, lw=0.6)
        ax.set_axisbelow(True)
        for sp in ("top", "right"):
            ax.spines[sp].set_visible(False)
        for sp in ("left", "bottom"):
            ax.spines[sp].set_color(GRID)
        ax.tick_params(colors=MUTED, labelsize=9)

    axes[0][0].legend(frameon=False, fontsize=9, loc="upper left")
    for ax in axes[1]:
        ax.set_xlabel("years BP", fontsize=10, color=MUTED)
    for ax in axes[:, 0]:
        ax.set_ylabel("LP allele frequency (%)", fontsize=10, color=MUTED)

    fig.suptitle("Competing selection drivers, same axes, same data — "
                 "the paper never overlays them",
                 fontsize=15, color=INK, fontweight="bold", x=0.02, ha="left", y=0.98)
    fig.text(0.02, 0.945,
             "Grey bars: observed aDNA, Jeffreys 95% CI. Model window ends at 2,500 BP "
             "(550 BC) — before most of the sweep.",
             fontsize=9.5, color=MUTED, ha="left")
    fig.tight_layout(rect=(0, 0, 1, 0.935))
    fig.savefig(OUT_PNG, dpi=150, facecolor=SURFACE)
    print(f"\nwrote {OUT_PNG}")


if __name__ == "__main__":
    main()
