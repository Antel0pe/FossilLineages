"""
The simplest possible version. No fitting, no estimated parameters.

Assume LP starts at 100% in Britain and 100% in Arabia and simply falls off with
straight-line distance, halving every 2,000 km. Identical rule for both centres.

  p(d) = 0.5 ** (d / 2000 km)        d = great-circle distance

  1. Britain only
  2. Arabia only
  3. Both        -> whichever centre is closer wins:  p = max(p_britain, p_arabia)
  4. Observed modern LP, for comparison

That is the whole model. Any difference between panel 3 and panel 4 is something
distance cannot explain.

Run:  python3 lactase-persistence/simple_maps.py
"""

import os
import sys

import matplotlib
import numpy as np

if not os.environ.get("DISPLAY") and sys.platform != "win32":
    matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.colors import BoundaryNorm, LinearSegmentedColormap, ListedColormap

from distance_interpolation import haversine, load
from interpolation_maps import EXTENT, NX, draw_panel, idw_observed
from lp_map import INK, RAMP, SURFACE, land_mask, load_land

HERE = os.path.dirname(os.path.abspath(__file__))
OUT_PNG = os.path.join(HERE, "simple_maps.png")
MUTED = "#6b6a66"

BRITAIN = (54.0, -2.0)        # central Britain
ARABIA = (23.0, 45.0)         # central Arabian peninsula
HALVING_KM = 2000.0           # LP halves every this many km. Chosen, not fitted.


def falloff(dist_km):
    return 0.5 ** (dist_km / HALVING_KM)


def main():
    rows = load()
    lat = np.array([r["lat"] for r in rows])
    lon = np.array([r["lon"] for r in rows])
    obs = np.array([r["pheno"] for r in rows])
    n = np.array([r["n"] for r in rows], dtype=float)

    ny = int(NX * (EXTENT[3] - EXTENT[2]) / (EXTENT[1] - EXTENT[0]))
    lon_grid, lat_grid = np.meshgrid(np.linspace(EXTENT[0], EXTENT[1], NX),
                                     np.linspace(EXTENT[3], EXTENT[2], ny))
    rings = load_land()
    mask = land_mask(lon_grid, lat_grid, rings)

    d_brit = haversine(lat_grid, lon_grid, *BRITAIN)
    d_arab = haversine(lat_grid, lon_grid, *ARABIA)
    f_brit = falloff(d_brit)
    f_arab = falloff(d_arab)
    f_both = np.maximum(f_brit, f_arab)
    f_obs = idw_observed(lon_grid, lat_grid, lon, lat, obs)

    # how well does this untuned rule do at the real populations?
    pb = falloff(haversine(lat, lon, *BRITAIN))
    pa = falloff(haversine(lat, lon, *ARABIA))
    for label, pred in [("Britain only", pb), ("Arabia only", pa),
                        ("both (max)", np.maximum(pb, pa))]:
        err = obs - pred
        rmse = np.sqrt(np.average(err ** 2, weights=n))
        ss = 1 - np.sum(n * err ** 2) / np.sum(n * (obs - np.average(obs, weights=n)) ** 2)
        print(f"{label:<16} weighted RMSE = {rmse:.3f}   R² = {ss:+.3f}")

    levels = np.arange(0.0, 1.01, 0.10)
    base = LinearSegmentedColormap.from_list("lp_blue", RAMP)
    cmap = ListedColormap([base(i / (len(levels) - 2)) for i in range(len(levels) - 1)])
    norm = BoundaryNorm(levels, cmap.N)

    fig, axes = plt.subplots(2, 2, figsize=(17, 12.4))
    fig.patch.set_facecolor(SURFACE)

    panels = [
        (f_brit, "1.  Britain only", "100% at Britain, halving every 2,000 km"),
        (f_arab, "2.  Arabia only", "100% at Arabia, halving every 2,000 km"),
        (f_both, "3.  Both", "whichever centre is closer"),
        (f_obs, "4.  OBSERVED modern LP",
         "GLAD, 434 populations · grey land = nobody genotyped within 1,500 km"),
    ]
    for ax, (field, title, sub) in zip(axes.ravel(), panels):
        draw_panel(ax, field, mask, rings, cmap, norm, title, sub)

    for ax, centres in zip(axes.ravel(),
                           [[BRITAIN], [ARABIA], [BRITAIN, ARABIA], []]):
        for clat, clon in centres:
            ax.plot(clon, clat, marker="*", ms=20, color="#ffffff",
                    markeredgecolor=INK, markeredgewidth=1.2, zorder=7)

    axes.ravel()[3].scatter(lon, lat, s=4 + 26 * np.sqrt(n / n.max()), c=obs,
                            cmap=cmap, norm=norm, edgecolors="#ffffff",
                            linewidths=0.45, zorder=6)

    cax = fig.add_axes([0.25, 0.055, 0.5, 0.017])
    cb = fig.colorbar(matplotlib.cm.ScalarMappable(norm=norm, cmap=cmap),
                      cax=cax, orientation="horizontal")
    cb.set_label("lactase persistence frequency (10% bands)", fontsize=10, color=MUTED)
    cb.set_ticks(levels)
    cb.ax.set_xticklabels([f"{100*v:.0f}%" for v in levels])
    cb.ax.tick_params(colors=MUTED, labelsize=9)
    cb.outline.set_visible(False)

    fig.suptitle("Simplest version: 100% LP at Britain and Arabia, halving every 2,000 km",
                 fontsize=18, color=INK, fontweight="bold", x=0.015, ha="left", y=0.985)
    fig.text(0.015, 0.958, "No fitting. No estimated parameters. Straight-line distance only. "
             "Panel 4 is the real data.", fontsize=10.5, color=MUTED, ha="left")
    fig.subplots_adjust(left=0.01, right=0.99, top=0.895, bottom=0.095,
                        wspace=0.03, hspace=0.20)
    fig.savefig(OUT_PNG, dpi=140, facecolor=SURFACE)
    print(f"wrote {OUT_PNG}")


if __name__ == "__main__":
    main()
