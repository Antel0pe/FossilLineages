"""
Null model: is the modern LP map just distance from one or two origin centres?

Three fits, all naive great-circle distance (no land constraint, no sea crossings,
no tuning) against 434 Old World populations from the GLAD database:

  1. Northwest Europe alone as centre
  2. Arabia alone as centre
  3. Both, combined as P(at least one source contributes)

The point is NOT to fit well. It is to see WHERE distance fails, because a tuned
connectivity model on a single continental gradient has more free choices than the
data can support. The residual map is the output; R^2 is a footnote.

Decay form per centre:   p(d) = pmax * exp(-d / lambda)
Two centres combined:    p = 1 - (1 - p_eur)(1 - p_arab)

Fits are weighted by genotyping sample size, so a Maasai estimate from n=1 does not
carry the same weight as 1,168 genotyped English.

Run:  python3 lactase-persistence/distance_interpolation.py
"""

import csv
import os
import sys

import matplotlib
import numpy as np

if not os.environ.get("DISPLAY") and sys.platform != "win32":
    matplotlib.use("Agg")
import matplotlib.pyplot as plt
from scipy.optimize import curve_fit

HERE = os.path.dirname(os.path.abspath(__file__))
CSV_PATH = os.path.join(HERE, "data", "LP_genotype_frequencies_2017.csv")
OUT_PNG = os.path.join(HERE, "distance_interpolation.png")

INK, MUTED, SURFACE, GRID = "#0b0b0b", "#6b6a66", "#fcfcfb", "#e4e2dc"
COOL, WARM, ACCENT = "#1665be", "#b4451f", "#8a4fbd"
R_EARTH = 6371.0

# columns 6..10 in the GLAD sheet
EUR_ALLELE, ME_ALLELE = 9, 8
CENTRE_BAR = 0.85          # LP phenotype defining a "core" population
CENTRE_N_BAR = 25          # and it must be decently genotyped


def haversine(lat1, lon1, lat2, lon2):
    p1, p2 = np.radians(lat1), np.radians(lat2)
    dp = np.radians(lat2 - lat1)
    dl = np.radians(lon2 - lon1)
    a = np.sin(dp / 2) ** 2 + np.cos(p1) * np.cos(p2) * np.sin(dl / 2) ** 2
    return 2 * R_EARTH * np.arcsin(np.sqrt(a))


def load():
    rows = []
    with open(CSV_PATH, encoding="utf-8-sig", newline="") as fh:
        for i, rec in enumerate(csv.reader(fh)):
            if i < 3 or len(rec) < 13:
                continue
            try:
                lon, lat = float(rec[3]), float(rec[4])
                chroms = int(float(rec[5]))
                pheno = float(rec[12])
            except (ValueError, TypeError):
                continue
            if not (-180 <= lon <= 180 and -90 <= lat <= 90):
                continue

            def num(j):
                try:
                    return float(rec[j])
                except (ValueError, TypeError):
                    return 0.0

            rows.append({
                "cont": rec[0].strip(), "country": rec[1].strip(), "pop": rec[2].strip(),
                "lat": lat, "lon": lon, "n": max(chroms // 2, 1),
                "pheno": min(max(pheno, 0.0), 1.0),
                "eur": num(EUR_ALLELE), "me": num(ME_ALLELE),
            })
    return rows


def centroid(rows, predicate):
    sel = [r for r in rows if predicate(r)]
    if not sel:
        raise ValueError("no populations matched centre definition")
    w = np.array([r["n"] for r in sel], dtype=float)
    lat = np.average([r["lat"] for r in sel], weights=w)
    lon = np.average([r["lon"] for r in sel], weights=w)
    return lat, lon, sel


def decay(d, pmax, lam):
    return pmax * np.exp(-d / lam)


def fit_one(dist, obs, w):
    popt, _ = curve_fit(decay, dist, obs, p0=[0.9, 3000.0], sigma=1.0 / np.sqrt(w),
                        bounds=([0.0, 100.0], [1.0, 30000.0]), maxfev=40000)
    return popt


def fit_two(d_eur, d_me, obs, w):
    def model(_x, pm1, l1, pm2, l2):
        return 1.0 - (1.0 - decay(d_eur, pm1, l1)) * (1.0 - decay(d_me, pm2, l2))
    popt, _ = curve_fit(model, np.zeros_like(obs), obs, p0=[0.9, 3000.0, 0.9, 2000.0],
                        sigma=1.0 / np.sqrt(w),
                        bounds=([0, 100, 0, 100], [1, 30000, 1, 30000]), maxfev=60000)
    return popt


def stats(obs, pred, w, k):
    resid = obs - pred
    ss_res = np.sum(w * resid ** 2)
    ss_tot = np.sum(w * (obs - np.average(obs, weights=w)) ** 2)
    r2 = 1 - ss_res / ss_tot
    rmse = np.sqrt(np.average(resid ** 2, weights=w))
    n = len(obs)
    aic = n * np.log(np.sum(resid ** 2) / n) + 2 * k
    return r2, rmse, aic


def main():
    rows = load()
    print(f"{len(rows)} georeferenced populations\n")

    eur_lat, eur_lon, eur_core = centroid(
        rows, lambda r: r["cont"] == "Europe" and r["pheno"] >= CENTRE_BAR
        and r["n"] >= CENTRE_N_BAR and r["eur"] >= r["me"])
    me_lat, me_lon, me_core = centroid(
        rows, lambda r: r["pheno"] >= CENTRE_BAR and r["n"] >= CENTRE_N_BAR
        and r["me"] > r["eur"])

    print(f"NW Europe centre: {eur_lat:.2f} N, {eur_lon:.2f} E  "
          f"(from {len(eur_core)} core populations)")
    print(f"   {', '.join(sorted({r['country'] for r in eur_core}))}")
    print(f"Arabia centre:    {me_lat:.2f} N, {me_lon:.2f} E  "
          f"(from {len(me_core)} core populations)")
    print(f"   {', '.join(sorted({r['country'] for r in me_core}))}\n")

    lat = np.array([r["lat"] for r in rows])
    lon = np.array([r["lon"] for r in rows])
    obs = np.array([r["pheno"] for r in rows])
    w = np.array([r["n"] for r in rows], dtype=float)

    d_eur = haversine(lat, lon, eur_lat, eur_lon)
    d_me = haversine(lat, lon, me_lat, me_lon)

    p1 = fit_one(d_eur, obs, w)
    pred1 = decay(d_eur, *p1)
    p2 = fit_one(d_me, obs, w)
    pred2 = decay(d_me, *p2)
    p3 = fit_two(d_eur, d_me, obs, w)
    pred3 = 1.0 - (1.0 - decay(d_eur, p3[0], p3[1])) * (1.0 - decay(d_me, p3[2], p3[3]))

    models = [
        ("NW Europe only", pred1, 2, f"pmax={p1[0]:.2f}, lambda={p1[1]:,.0f} km"),
        ("Arabia only", pred2, 2, f"pmax={p2[0]:.2f}, lambda={p2[1]:,.0f} km"),
        ("both centres", pred3, 4,
         f"Eur pmax={p3[0]:.2f}/lambda={p3[1]:,.0f} km; "
         f"Arab pmax={p3[2]:.2f}/lambda={p3[3]:,.0f} km"),
    ]

    print(f"{'model':<18}{'wR2':>8}{'RMSE':>9}{'AIC':>10}   parameters")
    print("-" * 96)
    for name, pred, k, desc in models:
        r2, rmse, aic = stats(obs, pred, w, k)
        print(f"{name:<18}{r2:>8.3f}{rmse:>9.3f}{aic:>10.1f}   {desc}")

    # ---- residuals of the two-centre model
    resid = obs - pred3
    order = np.argsort(resid)
    print("\n=== where distance MOST UNDER-predicts LP (observed >> predicted) ===")
    print(f"{'population':<30}{'country':<18}{'n':>5}{'obs':>7}{'pred':>7}{'resid':>8}")
    shown = 0
    for i in order[::-1]:
        if rows[i]["n"] < 25:
            continue
        print(f"{rows[i]['pop'][:29]:<30}{rows[i]['country'][:17]:<18}{rows[i]['n']:>5}"
              f"{obs[i]:>7.2f}{pred3[i]:>7.2f}{resid[i]:>+8.2f}")
        shown += 1
        if shown >= 10:
            break

    print("\n=== where distance MOST OVER-predicts LP (observed << predicted) ===")
    print(f"{'population':<30}{'country':<18}{'n':>5}{'obs':>7}{'pred':>7}{'resid':>8}")
    shown = 0
    for i in order:
        if rows[i]["n"] < 25:
            continue
        print(f"{rows[i]['pop'][:29]:<30}{rows[i]['country'][:17]:<18}{rows[i]['n']:>5}"
              f"{obs[i]:>7.2f}{pred3[i]:>7.2f}{resid[i]:>+8.2f}")
        shown += 1
        if shown >= 10:
            break

    # ---------------------------------------------------------------- figure
    fig = plt.figure(figsize=(14, 9.5))
    fig.patch.set_facecolor(SURFACE)
    gs = fig.add_gridspec(2, 3, height_ratios=[1, 1.15], hspace=0.32, wspace=0.25)

    sizes = 8 + 40 * np.sqrt(w / w.max())
    for col, (name, pred, k, _desc) in enumerate(models):
        ax = fig.add_subplot(gs[0, col])
        r2, rmse, _ = stats(obs, pred, w, k)
        ax.scatter(pred, obs, s=sizes, c=COOL, alpha=0.45, edgecolors="none")
        ax.plot([0, 1], [0, 1], color=INK, lw=1.2, ls="--")
        ax.set_title(f"{name}\nweighted R² = {r2:.3f}, RMSE = {rmse:.3f}",
                     loc="left", fontsize=11, color=INK, fontweight="bold")
        ax.set_xlabel("predicted LP", fontsize=9, color=MUTED)
        if col == 0:
            ax.set_ylabel("observed LP", fontsize=9, color=MUTED)
        ax.set_xlim(-0.03, 1.03)
        ax.set_ylim(-0.03, 1.03)
        ax.set_facecolor(SURFACE)
        ax.grid(True, color=GRID, lw=0.6)
        ax.set_axisbelow(True)
        for sp in ("top", "right"):
            ax.spines[sp].set_visible(False)
        for sp in ("left", "bottom"):
            ax.spines[sp].set_color(GRID)
        ax.tick_params(colors=MUTED, labelsize=8)

    ax = fig.add_subplot(gs[1, :])
    lim = np.abs(resid).max()
    sc = ax.scatter(lon, lat, c=resid, cmap="RdBu_r", vmin=-lim, vmax=lim,
                    s=sizes, edgecolors="#ffffff", linewidths=0.4)
    ax.plot(eur_lon, eur_lat, marker="*", ms=22, color=INK, zorder=5)
    ax.plot(me_lon, me_lat, marker="*", ms=22, color=INK, zorder=5)
    ax.annotate("NW Europe centre", (eur_lon, eur_lat), textcoords="offset points",
                xytext=(10, 8), fontsize=9, color=INK, fontweight="bold")
    ax.annotate("Arabia centre", (me_lon, me_lat), textcoords="offset points",
                xytext=(10, -14), fontsize=9, color=INK, fontweight="bold")
    cb = fig.colorbar(sc, ax=ax, fraction=0.025, pad=0.01)
    cb.set_label("observed − predicted LP", fontsize=9, color=MUTED)
    cb.ax.tick_params(colors=MUTED, labelsize=8)
    ax.set_title("Residuals of the two-centre distance model — red = distance under-predicts LP",
                 loc="left", fontsize=12, color=INK, fontweight="bold")
    ax.set_xlabel("longitude", fontsize=9, color=MUTED)
    ax.set_ylabel("latitude", fontsize=9, color=MUTED)
    ax.set_facecolor(SURFACE)
    ax.grid(True, color=GRID, lw=0.6)
    ax.set_axisbelow(True)
    for sp in ("top", "right"):
        ax.spines[sp].set_visible(False)
    for sp in ("left", "bottom"):
        ax.spines[sp].set_color(GRID)
    ax.tick_params(colors=MUTED, labelsize=8)

    fig.suptitle("Is the modern LP map just distance from its origin centres?",
                 fontsize=16, color=INK, fontweight="bold", x=0.02, ha="left", y=0.98)
    fig.text(0.02, 0.945, "Naive great-circle distance, no land constraint. "
             "Point size = genotyping sample size. Fits weighted by sample size.",
             fontsize=9.5, color=MUTED, ha="left")
    fig.savefig(OUT_PNG, dpi=150, facecolor=SURFACE, bbox_inches="tight")
    print(f"\nwrote {OUT_PNG}")


if __name__ == "__main__":
    main()
