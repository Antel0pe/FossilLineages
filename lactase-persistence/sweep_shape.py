"""
What does a selected allele's frequency curve actually look like?

Three panels, answering the question directly rather than taking Evershed et al.'s
word for the shape:

  A. Deterministic logistic sweeps at several selection coefficients, using the
     paper's own parameterisation (28-yr generations, y0 at 8,000 BP, additive
     fitness). Shows that "nothing, then all at once" is what CONSTANT selection
     predicts — no episodic pressure required.
  B. The same thing with drift (Wright-Fisher, several Ne), 40 replicates each.
     Real trajectories are jagged and a good share of them die out entirely.
  C. The actual ancient DNA, binned. Shows how little of the curve is observed:
     ~96 derived alleles in ~3,100, almost all of them late.

Run:  python3 lactase-persistence/sweep_shape.py
"""

import csv
import os
import sys

import matplotlib
import numpy as np

if not os.environ.get("DISPLAY") and sys.platform != "win32":
    matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.lines import Line2D
from scipy import stats

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
ADNA_TSV = os.path.join(ROOT, "data", "lactase", "adna", "AADRv44.all.mpileups.tsv")
OUT = os.path.join(HERE, "sweep_shape.png")

# same family as lp_map.py / time_series_maps.py
RAMP = ["#cde2fb", "#9ec5f4", "#6da7ec", "#3987e5", "#1665be", "#0b4587", "#05264e"]
INK = "#0b0b0b"
MUTED = "#6b6a66"
SURFACE = "#fcfcfb"
GRID = "#e4e2dc"
ACCENT = "#b4451f"

# --- the paper's model ------------------------------------------------------
GEN = 28            # years per generation (their Methods)
T0_BP = 8000        # start of their modelled window
Y0 = 0.005          # initial LP frequency; their power analysis centres on this


def logistic_sweep(y0, s, generations):
    """Additive-fitness deterministic sweep, exactly their equation:
    y(t) = y0 / (y0 + (1 - y0) * exp(-s*t))"""
    t = np.arange(generations + 1)
    return t, y0 / (y0 + (1.0 - y0) * np.exp(-s * t))


def wright_fisher(y0, s, generations, ne, rng):
    """Same selection, but finite population: binomial resampling each generation."""
    y = y0
    out = np.empty(generations + 1)
    out[0] = y
    for g in range(1, generations + 1):
        # additive fitness 1+2s / 1+s / 1 -> post-selection allele frequency
        w = y * (1.0 + s) + (1.0 - y) * 1.0
        y_sel = y * (1.0 + s) / w if w > 0 else 0.0
        y = rng.binomial(2 * ne, min(max(y_sel, 0.0), 1.0)) / (2.0 * ne)
        out[g] = y
    return out


def bp_to_calendar(bp):
    """Years before present (AADR convention, present = 1950) -> calendar year."""
    return 1950.0 - np.asarray(bp, dtype=float)


# --- observed ancient DNA ---------------------------------------------------
def load_adna():
    """Return (calendar_year, n_derived, n_total) per individual with a call."""
    rows = []
    with open(ADNA_TSV, newline="", encoding="utf-8") as fh:
        for rec in csv.DictReader(fh, delimiter="\t"):
            gt = (rec.get("genotype") or "").strip()
            if gt not in ("GG", "GA", "AG", "AA", "G", "A"):
                continue
            try:
                date_bp = float(rec["mean_date"])
                lat = float(rec["lat"])
                lon = float(rec["long"])
            except (TypeError, ValueError):
                continue
            if date_bp <= 0:
                continue
            derived = gt.count("A")
            total = len(gt)          # 1 for single-read calls, 2 for diploid
            rows.append((bp_to_calendar(date_bp), lat, lon, derived, total))
    return rows


def bin_frequencies(rows, edges):
    """Jeffreys-interval LP frequency per time bin (the paper's prior choice)."""
    out = []
    for lo, hi in zip(edges[:-1], edges[1:]):
        d = sum(r[3] for r in rows if lo <= r[0] < hi)
        n = sum(r[4] for r in rows if lo <= r[0] < hi)
        if n == 0:
            out.append((lo, hi, np.nan, np.nan, np.nan, 0))
            continue
        mid = 0.5 * (lo + hi)
        lo_ci = stats.beta.ppf(0.025, d + 0.5, n - d + 0.5)
        hi_ci = stats.beta.ppf(0.975, d + 0.5, n - d + 0.5)
        out.append((mid, hi, d / n, lo_ci, hi_ci, n))
    return out


def main():
    rng = np.random.default_rng(20260807)
    n_gen = T0_BP // GEN
    start_year = bp_to_calendar(T0_BP)

    fig, axes = plt.subplots(3, 1, figsize=(11, 13.5), sharex=True)
    fig.patch.set_facecolor(SURFACE)

    # ---------- Panel A: constant selection, varying strength ----------
    ax = axes[0]
    coeffs = [0.005, 0.010, 0.015, 0.022, 0.030]
    for s, colour in zip(coeffs, RAMP[1:]):
        t, y = logistic_sweep(Y0, s, n_gen)
        ax.plot(start_year + t * GEN, y * 100, color=colour, lw=2.2,
                label=f"s = {s*100:.1f}% / generation")
    ax.set_title("A.  Constant selection alone produces \"nothing, then all at once\"",
                 loc="left", fontsize=13, color=INK, fontweight="bold")
    ax.legend(frameon=False, fontsize=9, loc="upper left")

    for yr, lab in [(-4650, "first LP\nindividual"), (-2000, "\"appreciable\nfrequencies\"")]:
        ax.axvline(yr, color=MUTED, ls=":", lw=1)
        ax.text(yr + 60, 78, lab, fontsize=8, color=MUTED, va="top")

    # ---------- Panel B: same selection, with drift ----------
    ax = axes[1]
    s_ref = 0.022
    for ne, colour, alpha in [(500, ACCENT, 0.30), (5000, RAMP[3], 0.30)]:
        lost = 0
        for i in range(40):
            traj = wright_fisher(Y0, s_ref, n_gen, ne, rng)
            if traj[-1] <= 0:
                lost += 1
            ax.plot(start_year + np.arange(n_gen + 1) * GEN, traj * 100,
                    color=colour, lw=0.7, alpha=alpha)
        ax.plot([], [], color=colour, lw=2,
                label=f"Ne = {ne:,} ({lost}/40 replicates lost the allele)")
    t, y = logistic_sweep(Y0, s_ref, n_gen)
    ax.plot(start_year + t * GEN, y * 100, color=INK, lw=2.2, ls="--",
            label="deterministic model (what the paper fits)")
    ax.set_title(f"B.  Add drift at the same s = {s_ref*100:.1f}%: trajectories scatter, many are lost",
                 loc="left", fontsize=13, color=INK, fontweight="bold")
    ax.legend(frameon=False, fontsize=9, loc="upper left")

    # ---------- Panel C: what was actually observed ----------
    ax = axes[2]
    rows = load_adna()
    edges = np.arange(-8000, 1001, 500.0)
    binned = bin_frequencies(rows, edges)

    for mid, _hi, freq, lo_ci, hi_ci, n in binned:
        if n == 0:
            continue
        ax.vlines(mid, lo_ci * 100, hi_ci * 100, color=GRID, lw=6)
        ax.plot(mid, freq * 100, "o", color=RAMP[4], ms=5, zorder=3)
        ax.text(mid, hi_ci * 100 + 1.5, f"{n}", fontsize=6.5, color=MUTED,
                ha="center", va="bottom")

    ax.plot(start_year + t * GEN, y * 100, color=INK, lw=2.0, ls="--",
            label=f"deterministic s = {s_ref*100:.1f}%")

    n_der = sum(r[3] for r in rows)
    n_tot = sum(r[4] for r in rows)
    ax.set_title(f"C.  What the ancient DNA constrains — {n_der} derived alleles "
                 f"in {n_tot:,} (bin sizes above bars)",
                 loc="left", fontsize=13, color=INK, fontweight="bold")
    ax.legend(frameon=False, fontsize=9, loc="upper left")
    ax.set_xlabel("year (negative = BC)", fontsize=10, color=MUTED)

    for ax in axes:
        ax.set_facecolor(SURFACE)
        ax.set_ylim(-3, 100)
        ax.set_xlim(-8000, 1200)
        ax.set_ylabel("LP allele frequency (%)", fontsize=10, color=MUTED)
        ax.grid(True, color=GRID, lw=0.6)
        ax.set_axisbelow(True)
        for spine in ("top", "right"):
            ax.spines[spine].set_visible(False)
        for spine in ("left", "bottom"):
            ax.spines[spine].set_color(GRID)
        ax.tick_params(colors=MUTED, labelsize=9)

    fig.suptitle("The shape of a selective sweep, and how little of it we observe",
                 fontsize=16, color=INK, fontweight="bold", x=0.02, ha="left", y=0.985)
    fig.tight_layout(rect=(0, 0, 1, 0.965))
    fig.savefig(OUT, dpi=150, facecolor=SURFACE)
    print(f"wrote {OUT}")

    # console summary — the crossing table
    print(f"\nConstant s = {s_ref*100:.1f}%, y0 = {Y0*100:.1f}%, from {abs(start_year):.0f} BC:")
    for target in (0.02, 0.05, 0.10, 0.25, 0.50, 0.75):
        idx = np.argmax(y >= target)
        if y[idx] < target:
            print(f"  {target*100:5.0f}%  never reached by AD 1950")
            continue
        yr = start_year + idx * GEN
        era = f"{abs(yr):.0f} {'BC' if yr < 0 else 'AD'}"
        print(f"  {target*100:5.0f}%  {era}")


if __name__ == "__main__":
    main()
