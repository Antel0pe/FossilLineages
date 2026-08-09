"""
Whose lactase persistence is it?

The two-centre hypothesis says LP radiated out of Britain and out of Arabia. That
makes a prediction we can check without any ancestry data at all, because GLAD
reports each functional allele SEPARATELY:

  - if the hypothesis holds, Europe should be solid -13910 territory, Arabia solid
    -13915 territory, with a visible boundary where they meet
  - if the alleles are interleaved, or if regions have high LP from NEITHER, the
    two-pole picture is wrong

This is not circular. It does not use LP to predict LP; it asks which SOURCE a
population's LP came from, which is a different question from how much it has.

All four panels are in the same units — probability an individual is lactase
persistent — so they can be read against each other:

    phenotype from one allele = 1 - (1 - p)^2      (dominant, HWE)

  1. LP attributable to -13910  (the European allele)
  2. LP attributable to -13915  (the Arabian allele)
  3. Whichever is larger        (dominant source)
  4. Observed total LP

Run:  python3 lactase-persistence/allele_source_maps.py
"""

import os
import sys

import matplotlib
import numpy as np

if not os.environ.get("DISPLAY") and sys.platform != "win32":
    matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.colors import BoundaryNorm, LinearSegmentedColormap, ListedColormap

from distance_interpolation import load
from interpolation_maps import EXTENT, NX, draw_panel, idw_observed
from lp_map import INK, RAMP, SURFACE, land_mask, load_land

HERE = os.path.dirname(os.path.abspath(__file__))
OUT_PNG = os.path.join(HERE, "allele_source_maps.png")
MUTED = "#6b6a66"


def pheno_from_allele(p):
    """Dominant allele under Hardy-Weinberg: P(at least one copy)."""
    return 1.0 - (1.0 - p) ** 2


def main():
    rows = load()
    lat = np.array([r["lat"] for r in rows])
    lon = np.array([r["lon"] for r in rows])
    obs = np.array([r["pheno"] for r in rows])
    n = np.array([r["n"] for r in rows], dtype=float)

    ph_eur = pheno_from_allele(np.array([r["eur"] for r in rows]))
    ph_me = pheno_from_allele(np.array([r["me"] for r in rows]))
    ph_max = np.maximum(ph_eur, ph_me)

    # how much of the observed LP do the two named alleles account for?
    covered = ph_max
    gap = obs - covered
    print(f"{len(rows)} populations")
    print(f"weighted mean observed LP        : {np.average(obs, weights=n):.3f}")
    print(f"weighted mean from -13910/-13915 : {np.average(covered, weights=n):.3f}")
    print(f"unexplained by the two centres   : {np.average(gap, weights=n):+.3f}\n")

    big = [i for i in range(len(rows)) if n[i] >= 25]
    big.sort(key=lambda i: -gap[i])
    print("=== highest LP NOT accounted for by either centre's allele ===")
    print(f"{'population':<28}{'country':<16}{'n':>5}{'obs':>7}{'-13910':>8}{'-13915':>8}{'gap':>7}")
    for i in big[:12]:
        print(f"{rows[i]['pop'][:27]:<28}{rows[i]['country'][:15]:<16}{n[i]:>5.0f}"
              f"{obs[i]:>7.2f}{ph_eur[i]:>8.2f}{ph_me[i]:>8.2f}{gap[i]:>+7.2f}")

    ny = int(NX * (EXTENT[3] - EXTENT[2]) / (EXTENT[1] - EXTENT[0]))
    lon_grid, lat_grid = np.meshgrid(np.linspace(EXTENT[0], EXTENT[1], NX),
                                     np.linspace(EXTENT[3], EXTENT[2], ny))
    rings = load_land()
    mask = land_mask(lon_grid, lat_grid, rings)

    f_eur = idw_observed(lon_grid, lat_grid, lon, lat, ph_eur)
    f_me = idw_observed(lon_grid, lat_grid, lon, lat, ph_me)
    f_max = idw_observed(lon_grid, lat_grid, lon, lat, ph_max)
    f_obs = idw_observed(lon_grid, lat_grid, lon, lat, obs)

    levels = np.arange(0.0, 1.01, 0.10)
    base = LinearSegmentedColormap.from_list("lp_blue", RAMP)
    cmap = ListedColormap([base(i / (len(levels) - 2)) for i in range(len(levels) - 1)])
    norm = BoundaryNorm(levels, cmap.N)

    fig, axes = plt.subplots(2, 2, figsize=(17, 12.4))
    fig.patch.set_facecolor(SURFACE)

    panels = [
        (f_eur, ph_eur, "1.  LP from −13910", "the European allele — Britain's variant"),
        (f_me, ph_me, "2.  LP from −13915", "the Arabian allele"),
        (f_max, ph_max, "3.  Whichever is larger",
         "dominant source — what the two-centre hypothesis can explain"),
        (f_obs, obs, "4.  OBSERVED total LP",
         "all causes · grey land = nobody genotyped within 1,500 km"),
    ]
    for ax, (field, pts, title, sub) in zip(axes.ravel(), panels):
        draw_panel(ax, field, mask, rings, cmap, norm, title, sub)
        ax.scatter(lon, lat, s=3 + 22 * np.sqrt(n / n.max()), c=pts, cmap=cmap,
                   norm=norm, edgecolors="#ffffff", linewidths=0.4, zorder=6)

    cax = fig.add_axes([0.25, 0.055, 0.5, 0.017])
    cb = fig.colorbar(matplotlib.cm.ScalarMappable(norm=norm, cmap=cmap),
                      cax=cax, orientation="horizontal")
    cb.set_label("share of people lactase persistent (10% bands)", fontsize=10, color=MUTED)
    cb.set_ticks(levels)
    cb.ax.set_xticklabels([f"{100*v:.0f}%" for v in levels])
    cb.ax.tick_params(colors=MUTED, labelsize=9)
    cb.outline.set_visible(False)

    fig.suptitle("Whose lactase persistence is it? Each allele mapped separately",
                 fontsize=18, color=INK, fontweight="bold", x=0.015, ha="left", y=0.985)
    fig.text(0.015, 0.958,
             "Real data throughout — no model, no fitting. Compare panel 3 with panel 4: "
             "the difference is LP the two centres cannot account for.",
             fontsize=10.5, color=MUTED, ha="left")
    fig.subplots_adjust(left=0.01, right=0.99, top=0.895, bottom=0.095,
                        wspace=0.03, hspace=0.20)
    fig.savefig(OUT_PNG, dpi=140, facecolor=SURFACE)
    print(f"\nwrote {OUT_PNG}")


if __name__ == "__main__":
    main()
