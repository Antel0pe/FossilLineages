"""
Four maps side by side: what each distance model predicts, and what is actually there.

  1. NW Europe as the only centre
  2. Arabia as the only centre
  3. Both centres combined
  4. Observed modern LP (GLAD populations, inverse-distance interpolated)

All four share one colour scale, so they can be read against each other directly.

One asymmetry is deliberate and worth knowing when comparing: the three model panels
are defined everywhere on land, because a distance model always has an answer. The
observed panel greys out anywhere further than CUTOFF km from a real sampled
population — grey means "nobody was genotyped here", not "no lactase persistence".

Run:  python3 lactase-persistence/interpolation_maps.py
"""

import os
import sys

import matplotlib
import numpy as np

if not os.environ.get("DISPLAY") and sys.platform != "win32":
    matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.colors import BoundaryNorm, LinearSegmentedColormap, ListedColormap

from distance_interpolation import (CENTRE_BAR, CENTRE_N_BAR, centroid, decay,
                                    fit_one, fit_two, haversine, load)
from lp_map import INK, NODATA, OCEAN, RAMP, SURFACE, land_mask, load_land

HERE = os.path.dirname(os.path.abspath(__file__))
OUT_PNG = os.path.join(HERE, "interpolation_maps.png")

EXTENT = (-25.0, 150.0, -36.0, 72.0)     # Old World, matching GLAD's span
NX = 620
INFLUENCE = 2000.0                        # km, IDW taper for the observed panel
CUTOFF = 1500.0                           # km, past this render "no data"
COAST = "#c9c6bd"
MUTED = "#6b6a66"


def unit(lon, lat):
    a, b = np.radians(lon), np.radians(lat)
    c = np.cos(b)
    return np.stack([c * np.cos(a), c * np.sin(a), np.sin(b)], axis=-1)


def idw_observed(lon_grid, lat_grid, lons, lats, vals):
    """Inverse-distance weighting on great-circle distance, NaN past CUTOFF."""
    P = unit(lons, lats)
    out = np.full(lon_grid.shape, np.nan)
    for j in range(lon_grid.shape[0]):
        G = unit(lon_grid[j], lat_grid[j])
        dot = np.clip(G @ P.T, -1.0, 1.0)
        d = 6371.0 * np.sqrt(np.maximum(0.0, 2.0 - 2.0 * dot))
        taper = np.clip(1.0 - d / INFLUENCE, 0.0, None)
        w = taper ** 2 / (d ** 2 + 1e-4)
        den = w.sum(axis=1)
        v = (w @ vals) / np.where(den == 0, 1.0, den)
        v[(d.min(axis=1) > CUTOFF) | (den == 0)] = np.nan
        out[j] = v
    return out


def draw_panel(ax, field, mask, rings, cmap, norm, title, subtitle):
    nodata = np.zeros(field.shape + (4,))
    nodata[..., :3] = matplotlib.colors.to_rgb(OCEAN)
    nodata[..., 3] = 1.0
    land_no_value = mask & ~np.isfinite(field)
    nodata[land_no_value, :3] = matplotlib.colors.to_rgb(NODATA)
    ax.imshow(nodata, extent=EXTENT, origin="upper", interpolation="nearest", zorder=1)

    shown = np.where(mask, field, np.nan)
    ax.imshow(shown, extent=EXTENT, origin="upper", cmap=cmap, norm=norm,
              interpolation="bilinear", zorder=2)

    on_land = field[mask & np.isfinite(field)]
    if on_land.size:
        ax.text(0.985, 0.035, f"range on land: {100*on_land.min():.0f}%–"
                f"{100*on_land.max():.0f}%", transform=ax.transAxes, fontsize=9,
                color=INK, ha="right", va="bottom", zorder=7,
                bbox=dict(facecolor="#ffffff", edgecolor="none", alpha=0.82,
                          boxstyle="round,pad=0.35"))

    for r in rings:
        ax.plot(r[:, 0], r[:, 1], color=COAST, lw=0.35, zorder=3)

    ax.set_xlim(EXTENT[0], EXTENT[1])
    ax.set_ylim(EXTENT[2], EXTENT[3])
    ax.set_aspect(1.0 / np.cos(np.radians((EXTENT[2] + EXTENT[3]) / 2)))
    ax.set_title(title, loc="left", fontsize=12.5, color=INK, fontweight="bold", pad=27)
    ax.text(0.0, 1.008, subtitle, transform=ax.transAxes, fontsize=9,
            color=MUTED, va="bottom")
    ax.set_xticks([])
    ax.set_yticks([])
    for sp in ax.spines.values():
        sp.set_visible(False)


def main():
    rows = load()
    lat = np.array([r["lat"] for r in rows])
    lon = np.array([r["lon"] for r in rows])
    obs = np.array([r["pheno"] for r in rows])
    w = np.array([r["n"] for r in rows], dtype=float)

    eur_lat, eur_lon, eur_core = centroid(
        rows, lambda r: r["cont"] == "Europe" and r["pheno"] >= CENTRE_BAR
        and r["n"] >= CENTRE_N_BAR and r["eur"] >= r["me"])
    me_lat, me_lon, me_core = centroid(
        rows, lambda r: r["pheno"] >= CENTRE_BAR and r["n"] >= CENTRE_N_BAR
        and r["me"] > r["eur"])

    d_eur_pop = haversine(lat, lon, eur_lat, eur_lon)
    d_me_pop = haversine(lat, lon, me_lat, me_lon)
    p1 = fit_one(d_eur_pop, obs, w)
    p2 = fit_one(d_me_pop, obs, w)
    p3 = fit_two(d_eur_pop, d_me_pop, obs, w)
    print(f"NW Europe centre {eur_lat:.2f}N {eur_lon:.2f}E   Arabia centre "
          f"{me_lat:.2f}N {me_lon:.2f}E")

    ny = int(NX * (EXTENT[3] - EXTENT[2]) / (EXTENT[1] - EXTENT[0]))
    lon_grid, lat_grid = np.meshgrid(np.linspace(EXTENT[0], EXTENT[1], NX),
                                     np.linspace(EXTENT[3], EXTENT[2], ny))
    rings = load_land()
    mask = land_mask(lon_grid, lat_grid, rings)
    print(f"grid {NX}x{ny}, {mask.sum():,} land cells")

    d_eur = haversine(lat_grid, lon_grid, eur_lat, eur_lon)
    d_me = haversine(lat_grid, lon_grid, me_lat, me_lon)

    f_eur = decay(d_eur, *p1)
    f_me = decay(d_me, *p2)
    f_both = 1.0 - (1.0 - decay(d_eur, p3[0], p3[1])) * (1.0 - decay(d_me, p3[2], p3[3]))
    f_obs = idw_observed(lon_grid, lat_grid, lon, lat, obs)

    # discrete 10% bands: a continuous ramp lets the eye invent gradients that the
    # numbers do not support, and hides how narrow a model's actual range is
    levels = np.arange(0.0, 1.01, 0.10)
    base = LinearSegmentedColormap.from_list("lp_blue", RAMP)
    cmap = ListedColormap([base(i / (len(levels) - 2)) for i in range(len(levels) - 1)])
    norm = BoundaryNorm(levels, cmap.N)

    fig, axes = plt.subplots(2, 2, figsize=(17, 12.4))
    fig.patch.set_facecolor(SURFACE)

    panels = [
        (f_eur, "1.  NW Europe as the only centre",
         f"exponential decay, λ = {p1[1]:,.0f} km · weighted R² = 0.491"),
        (f_me, "2.  Arabia as the only centre",
         "fit degenerates to a near-constant · weighted R² = −0.023"),
        (f_both, "3.  Both centres combined",
         f"λ = {p3[1]:,.0f} km (Eur) and {p3[3]:,.0f} km (Arabia) · weighted R² = 0.655"),
        (f_obs, "4.  OBSERVED modern LP",
         "GLAD, 434 populations · grey land = nobody genotyped within 1,500 km"),
    ]

    for ax, (field, title, sub) in zip(axes.ravel(), panels):
        draw_panel(ax, field, mask, rings, cmap, norm, title, sub)

    for ax in axes.ravel()[:3]:
        ax.plot(eur_lon, eur_lat, marker="*", ms=19, color="#ffffff",
                markeredgecolor=INK, markeredgewidth=1.1, zorder=6)
        ax.plot(me_lon, me_lat, marker="*", ms=19, color="#ffffff",
                markeredgecolor=INK, markeredgewidth=1.1, zorder=6)

    ax_obs = axes.ravel()[3]
    ax_obs.scatter(lon, lat, s=4 + 26 * np.sqrt(w / w.max()), c=obs, cmap=cmap,
                   norm=norm, edgecolors="#ffffff", linewidths=0.45, zorder=6)

    cax = fig.add_axes([0.25, 0.055, 0.5, 0.017])
    cb = fig.colorbar(matplotlib.cm.ScalarMappable(norm=norm, cmap=cmap),
                      cax=cax, orientation="horizontal")
    cb.set_label("lactase persistence frequency (10% bands)", fontsize=10, color=MUTED)
    cb.set_ticks(levels)
    cb.ax.set_xticklabels([f"{100*v:.0f}%" for v in levels])
    cb.ax.tick_params(colors=MUTED, labelsize=9)
    cb.outline.set_visible(False)

    fig.suptitle("Distance from origin centres vs. the real lactase persistence map",
                 fontsize=18, color=INK, fontweight="bold", x=0.015, ha="left", y=0.985)
    fig.text(0.015, 0.958,
             "Stars mark the two fitted centres. Panels 1–3 are models; panel 4 is data. "
             "Compare panel 3 with panel 4 — the differences are ancestry, not geography.",
             fontsize=10.5, color=MUTED, ha="left")
    fig.subplots_adjust(left=0.01, right=0.99, top=0.895, bottom=0.095,
                        wspace=0.03, hspace=0.20)
    fig.savefig(OUT_PNG, dpi=140, facecolor=SURFACE)
    print(f"wrote {OUT_PNG}")


if __name__ == "__main__":
    main()
