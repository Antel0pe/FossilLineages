"""
Allele-routed distance model.

Earlier maps made the two centres compete on distance alone, which fails because a
single monotonic decay cannot describe a two-peaked world. Here the allele decides
which centre a place belongs to, and distance only decides how much:

    which centre?  whichever allele the population actually carries
                   (-13910 -> Britain,  -13915 -> Arabia)
    how much LP?   0.5 ** (distance to THAT centre / 2000 km)

Nothing is fitted. Same fixed halving distance as simple_maps.py, so the two are
directly comparable.

  1. Britain falloff everywhere        (for reference)
  2. Arabia falloff everywhere         (for reference)
  3. Allele-routed: each place predicted from ITS OWN centre
  4. Observed modern LP

Populations carrying neither allele have no source to route to; they are assigned to
the geographically nearer centre and counted, which is the conservative choice —
it gives the model its best shot.

Run:  python3 lactase-persistence/allele_routed_maps.py
"""

import os
import sys

import matplotlib
import numpy as np

if not os.environ.get("DISPLAY") and sys.platform != "win32":
    matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.colors import BoundaryNorm, LinearSegmentedColormap, ListedColormap

from allele_source_maps import pheno_from_allele
from distance_interpolation import haversine, load
from interpolation_maps import EXTENT, NX, draw_panel, idw_observed
from lp_map import INK, RAMP, SURFACE, land_mask, load_land

HERE = os.path.dirname(os.path.abspath(__file__))
OUT_PNG = os.path.join(HERE, "allele_routed_maps.png")
MUTED = "#6b6a66"

BRITAIN = (54.0, -2.0)
ARABIA = (23.0, 45.0)
HALVING_KM = 2000.0


def falloff(d):
    return 0.5 ** (d / HALVING_KM)


def main():
    rows = load()
    lat = np.array([r["lat"] for r in rows])
    lon = np.array([r["lon"] for r in rows])
    obs = np.array([r["pheno"] for r in rows])
    n = np.array([r["n"] for r in rows], dtype=float)
    ph_eur = pheno_from_allele(np.array([r["eur"] for r in rows]))
    ph_me = pheno_from_allele(np.array([r["me"] for r in rows]))

    d_b = haversine(lat, lon, *BRITAIN)
    d_a = haversine(lat, lon, *ARABIA)

    # route: which centre does this population's LP actually come from?
    has_allele = (ph_eur > 0) | (ph_me > 0)
    to_britain = np.where(has_allele, ph_eur >= ph_me, d_b <= d_a)
    routed_d = np.where(to_britain, d_b, d_a)
    pred_routed = falloff(routed_d)

    print(f"routed to Britain: {to_britain.sum():3d} populations")
    print(f"routed to Arabia : {(~to_britain).sum():3d} populations")
    print(f"  (of which {int((~has_allele).sum())} carry neither allele and were "
          f"routed by geography)\n")

    def score(pred, label):
        err = obs - pred
        rmse = np.sqrt(np.average(err ** 2, weights=n))
        r2 = 1 - np.sum(n * err ** 2) / np.sum(
            n * (obs - np.average(obs, weights=n)) ** 2)
        print(f"{label:<34} weighted RMSE = {rmse:.3f}   R² = {r2:+.3f}")
        return err

    score(falloff(d_b), "Britain only (plain distance)")
    score(falloff(d_a), "Arabia only (plain distance)")
    score(np.maximum(falloff(d_b), falloff(d_a)), "both, nearer centre (simple_maps)")
    err = score(pred_routed, "ALLELE-ROUTED")

    order = np.argsort(err)
    print("\n=== allele-routed model most UNDER-predicts (real LP is higher) ===")
    print(f"{'population':<28}{'country':<16}{'n':>5}{'obs':>7}{'pred':>7}{'err':>7}")
    shown = 0
    for i in order[::-1]:
        if n[i] < 25:
            continue
        c = "Britain" if to_britain[i] else "Arabia"
        print(f"{rows[i]['pop'][:27]:<28}{rows[i]['country'][:15]:<16}{n[i]:>5.0f}"
              f"{obs[i]:>7.2f}{pred_routed[i]:>7.2f}{err[i]:>+7.2f}   via {c}")
        shown += 1
        if shown >= 8:
            break

    print("\n=== allele-routed model most OVER-predicts (real LP is lower) ===")
    shown = 0
    for i in order:
        if n[i] < 25:
            continue
        c = "Britain" if to_britain[i] else "Arabia"
        print(f"{rows[i]['pop'][:27]:<28}{rows[i]['country'][:15]:<16}{n[i]:>5.0f}"
              f"{obs[i]:>7.2f}{pred_routed[i]:>7.2f}{err[i]:>+7.2f}   via {c}")
        shown += 1
        if shown >= 8:
            break

    # ---------------------------------------------------------------- maps
    ny = int(NX * (EXTENT[3] - EXTENT[2]) / (EXTENT[1] - EXTENT[0]))
    lon_grid, lat_grid = np.meshgrid(np.linspace(EXTENT[0], EXTENT[1], NX),
                                     np.linspace(EXTENT[3], EXTENT[2], ny))
    rings = load_land()
    mask = land_mask(lon_grid, lat_grid, rings)

    gd_b = haversine(lat_grid, lon_grid, *BRITAIN)
    gd_a = haversine(lat_grid, lon_grid, *ARABIA)

    # interpolate the OBSERVED allele identity, then route each grid cell by it
    g_eur = idw_observed(lon_grid, lat_grid, lon, lat, ph_eur)
    g_me = idw_observed(lon_grid, lat_grid, lon, lat, ph_me)
    known = np.isfinite(g_eur) & np.isfinite(g_me)
    prefer_britain = np.where(known & ((g_eur > 0) | (g_me > 0)),
                              np.nan_to_num(g_eur) >= np.nan_to_num(g_me),
                              gd_b <= gd_a)
    f_routed = np.where(prefer_britain, falloff(gd_b), falloff(gd_a))
    f_routed = np.where(known, f_routed, np.nan)     # honest: no allele data, no claim
    f_obs = idw_observed(lon_grid, lat_grid, lon, lat, obs)

    levels = np.arange(0.0, 1.01, 0.10)
    base = LinearSegmentedColormap.from_list("lp_blue", RAMP)
    cmap = ListedColormap([base(i / (len(levels) - 2)) for i in range(len(levels) - 1)])
    norm = BoundaryNorm(levels, cmap.N)

    fig, axes = plt.subplots(2, 2, figsize=(17, 12.4))
    fig.patch.set_facecolor(SURFACE)
    panels = [
        (falloff(gd_b), "1.  Britain only", "plain distance from Britain"),
        (falloff(gd_a), "2.  Arabia only", "plain distance from Arabia"),
        (f_routed, "3.  ALLELE-ROUTED",
         "each place predicted from the centre whose allele it actually carries"),
        (f_obs, "4.  OBSERVED modern LP", "grey = no population genotyped within 1,500 km"),
    ]
    for ax, (field, title, sub) in zip(axes.ravel(), panels):
        draw_panel(ax, field, mask, rings, cmap, norm, title, sub)

    for ax in axes.ravel()[:3]:
        for clat, clon in [BRITAIN, ARABIA]:
            ax.plot(clon, clat, marker="*", ms=19, color="#ffffff",
                    markeredgecolor=INK, markeredgewidth=1.1, zorder=7)
    axes.ravel()[3].scatter(lon, lat, s=3 + 22 * np.sqrt(n / n.max()), c=obs,
                            cmap=cmap, norm=norm, edgecolors="#ffffff",
                            linewidths=0.4, zorder=6)

    cax = fig.add_axes([0.25, 0.055, 0.5, 0.017])
    cb = fig.colorbar(matplotlib.cm.ScalarMappable(norm=norm, cmap=cmap),
                      cax=cax, orientation="horizontal")
    cb.set_label("share of people lactase persistent (10% bands)", fontsize=10, color=MUTED)
    cb.set_ticks(levels)
    cb.ax.set_xticklabels([f"{100*v:.0f}%" for v in levels])
    cb.ax.tick_params(colors=MUTED, labelsize=9)
    cb.outline.set_visible(False)

    fig.suptitle("Allele-routed model: the allele picks the centre, distance picks the amount",
                 fontsize=18, color=INK, fontweight="bold", x=0.015, ha="left", y=0.985)
    fig.text(0.015, 0.958, "100% at each centre, halving every 2,000 km. Nothing fitted. "
             "Panel 4 is the real data.", fontsize=10.5, color=MUTED, ha="left")
    fig.subplots_adjust(left=0.01, right=0.99, top=0.895, bottom=0.095,
                        wspace=0.03, hspace=0.20)
    fig.savefig(OUT_PNG, dpi=140, facecolor=SURFACE)
    print(f"\nwrote {OUT_PNG}")


if __name__ == "__main__":
    main()
