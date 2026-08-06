#!/usr/bin/env python3
"""Map of adult lactase persistence across the Old World.

Colours the map by the share of adults predicted to digest lactose, interpolating
between sampled populations; dots mark the populations actually sampled, so the
measured is never confused with the guessed.

    python3 lp_map.py              # opens a window
    python3 lp_map.py --save out.png --no-show

Data: GLAD (Global Lactase Persistence Association Database), UCL, 2017 suppl. table.
"""

import argparse
import csv
import json
import os

import numpy as np
import matplotlib
import matplotlib.pyplot as plt
from matplotlib.colors import LinearSegmentedColormap, Normalize
from matplotlib.path import Path as MplPath

HERE = os.path.dirname(os.path.abspath(__file__))
CSV_PATH = os.path.join(HERE, "data", "LP_genotype_frequencies_2017.csv")
GEO_PATH = os.path.join(HERE, "data", "ne_110m_admin_0_countries.json")

R_EARTH = 6371.0   # km
INFLUENCE = 2000.0  # km — past this a sample contributes nothing
CUTOFF = 1500.0     # km — past this from the NEAREST sample we render "no data"
GRID = 700          # grid cells across

# single-hue sequential blue ramp, light -> dark
RAMP = ["#cde2fb", "#b7d3f6", "#9ec5f4", "#86b6ef", "#6da7ec", "#5598e7", "#3987e5",
        "#2a78d6", "#256abf", "#1c5cab", "#184f95", "#104281", "#0d366b"]
OCEAN = "#f3f2f0"    # recedes; the sea carries no value
NODATA = "#bab8af"   # distinctly darker + warmer than the sea, so "unknown land" reads
INK = "#0b0b0b"
INK2 = "#52514e"
SURFACE = "#fcfcfb"

LON_C, LAT_C, NCHR_C, PHEN_C = 3, 4, 5, 12
CONT_C, COUNTRY_C, POP_C = 0, 1, 2


# ---------------------------------------------------------------- data

def _num(v):
    try:
        return float(str(v).strip())
    except (TypeError, ValueError):
        return None


def load_points(verbose=True):
    """Rows with usable coordinates and a phenotype value. Everything dropped is reported."""
    rows = list(csv.reader(open(CSV_PATH, encoding="utf-8")))[3:]
    lon, lat, phen, nchr, pop, country, cont = [], [], [], [], [], [], []
    dropped, blank = [], 0
    for i, r in enumerate(rows):
        if len(r) < 14 or not any(c.strip() for c in r[:13]):
            blank += 1                      # trailing blanks / footnote lines
            continue
        lo, la, ph = _num(r[LON_C]), _num(r[LAT_C]), _num(r[PHEN_C])
        if lo is None or la is None:
            dropped.append((i, r[POP_C].strip() or r[CONT_C].strip()[:40], "no coordinates"))
            continue
        if ph is None:
            dropped.append((i, r[POP_C].strip(), "no phenotype"))
            continue
        assert -180 <= lo <= 180 and -90 <= la <= 90, f"bad coords row {i}: {lo},{la}"
        assert 0.0 <= ph <= 1.0, f"phenotype out of range row {i}: {ph}"
        n = _num(r[NCHR_C])
        lon.append(lo); lat.append(la); phen.append(ph)
        nchr.append(int(n) if n else 0)
        pop.append(r[POP_C].strip()); country.append(r[COUNTRY_C].strip())
        cont.append(r[CONT_C].strip())
    if verbose:
        print(f"{len(lon)} populations mapped; {len(dropped)} rows dropped, "
              f"{blank} blank/footnote rows skipped")
        for d in dropped:
            print(f"   dropped row {d[0]}: {d[1]!r} — {d[2]}")
    return dict(lon=np.array(lon), lat=np.array(lat), phen=np.array(phen),
                n=np.array(nchr), pop=pop, country=country, cont=cont)


def to_sites(pts, verbose=True):
    """Collapse populations that share a coordinate into one sampling site.

    65 coordinates in GLAD carry several populations (eight distinct Israeli
    populations sit on one point, spanning 7%–50%). Left un-aggregated they would
    stack invisibly under one dot and would weight that spot several times over in
    the interpolation. A site's value is the chromosome-weighted mean of the
    populations sampled there.
    """
    groups = {}
    for i in range(len(pts["lon"])):
        groups.setdefault((pts["lon"][i], pts["lat"][i]), []).append(i)
    lon, lat, phen, n, label, country, members = [], [], [], [], [], [], []
    for (lo, la), idx in groups.items():
        w = np.array([max(pts["n"][i], 1) for i in idx], dtype=float)
        v = np.array([pts["phen"][i] for i in idx])
        lon.append(lo); lat.append(la)
        phen.append(float((w * v).sum() / w.sum()))
        n.append(int(sum(pts["n"][i] for i in idx)))
        country.append(pts["country"][idx[0]])
        label.append(pts["pop"][idx[0]] if len(idx) == 1
                     else f"{len(idx)} populations")
        members.append([(pts["pop"][i], pts["phen"][i], pts["n"][i]) for i in idx])
    if verbose:
        multi = sum(1 for m in members if len(m) > 1)
        print(f"{len(lon)} sampling sites ({multi} of them pool several populations "
              f"recorded at the same coordinate)")
    return dict(lon=np.array(lon), lat=np.array(lat), phen=np.array(phen),
                n=np.array(n), pop=label, country=country, members=members)


def load_land():
    """Country polygons as lists of (lon, lat) rings — the land mask and the outlines."""
    feats = json.load(open(GEO_PATH, encoding="utf-8"))["features"]
    rings = []
    for f in feats:
        g = f["geometry"]
        polys = g["coordinates"] if g["type"] == "MultiPolygon" else [g["coordinates"]]
        for poly in polys:
            for ring in poly:
                if len(ring) > 3:
                    rings.append(np.asarray(ring, dtype=float))
    return rings


# ------------------------------------------------------- interpolation

def _unit(lon, lat):
    a, b = np.radians(lon), np.radians(lat)
    c = np.cos(b)
    return np.stack([c * np.cos(a), c * np.sin(a), np.sin(b)], axis=-1)


def idw(lon_grid, lat_grid, pts):
    """Inverse-distance weighting (1/d^2, tapered to zero at INFLUENCE) on
    great-circle distance. NaN wherever the nearest real sample is past CUTOFF."""
    P = _unit(pts["lon"], pts["lat"])              # (n, 3)
    vals = pts["phen"]
    out = np.full(lon_grid.shape, np.nan)
    for j in range(lon_grid.shape[0]):             # row at a time, keeps memory small
        G = _unit(lon_grid[j], lat_grid[j])        # (W, 3)
        dot = np.clip(G @ P.T, -1.0, 1.0)
        d = R_EARTH * np.sqrt(np.maximum(0.0, 2.0 - 2.0 * dot))   # chord ≈ arc at <2000 km
        taper = np.clip(1.0 - d / INFLUENCE, 0.0, None)
        w = taper ** 2 / (d ** 2 + 1e-4)
        den = w.sum(axis=1)
        v = (w @ vals) / np.where(den == 0, 1.0, den)
        v[(d.min(axis=1) > CUTOFF) | (den == 0)] = np.nan
        out[j] = v
    return out


def land_mask(lon_grid, lat_grid, rings):
    """True where a grid cell falls inside any country polygon."""
    pts = np.column_stack([lon_grid.ravel(), lat_grid.ravel()])
    verts, codes = [], []
    for r in rings:
        verts.append(r)
        codes.append(np.r_[MplPath.MOVETO, np.full(len(r) - 1, MplPath.LINETO)])
    compound = MplPath(np.vstack(verts), np.concatenate(codes))
    return compound.contains_points(pts).reshape(lon_grid.shape)


# ------------------------------------------------------------- drawing

def build_figure(pts, rings, values, mask, extent, npop):
    NPOP = npop
    cmap = LinearSegmentedColormap.from_list("lp_blue", RAMP)
    norm = Normalize(0.0, 1.0)

    fig, ax = plt.subplots(figsize=(13.5, 8.6))
    fig.patch.set_facecolor(SURFACE)
    ax.set_facecolor(OCEAN)

    # land we refuse to guess at
    grey = np.ma.masked_where(~(mask & np.isnan(values)), np.ones_like(values))
    ax.imshow(grey, extent=extent, origin="upper", interpolation="nearest",
              cmap=LinearSegmentedColormap.from_list("nd", [NODATA, NODATA]), zorder=1)

    # the interpolated field, land only
    field = np.ma.masked_where(~mask | np.isnan(values), values)
    im = ax.imshow(field, extent=extent, origin="upper", cmap=cmap, norm=norm,
                   interpolation="bilinear", zorder=2)

    for r in rings:
        ax.plot(r[:, 0], r[:, 1], lw=0.45, color=SURFACE, alpha=0.75, zorder=3)

    # the measured points
    ax.scatter(pts["lon"], pts["lat"], c=pts["phen"], cmap=cmap, norm=norm,
               s=26, linewidths=1.1, edgecolors=SURFACE, zorder=4)

    ax.set_xlim(extent[0], extent[1])
    ax.set_ylim(extent[2], extent[3])
    ax.set_aspect(1.0 / np.cos(np.radians((extent[2] + extent[3]) / 2)))
    ax.set_xticks([]); ax.set_yticks([])
    for s in ax.spines.values():
        s.set_visible(False)

    ax.set_title("Who could still drink milk as an adult", fontsize=17, color=INK,
                 loc="left", pad=38, fontweight="semibold")
    ax.text(0, 1.010,
            "Share of adults predicted to be lactase persistent. Every dot is a place "
            "actually sampled — the colour between the dots is interpolated, not measured.",
            transform=ax.transAxes, fontsize=10.5, color=INK2, va="bottom")

    cb = fig.colorbar(im, ax=ax, fraction=0.026, pad=0.015)
    cb.set_ticks([0, .25, .5, .75, 1])
    cb.set_ticklabels(["0%", "25%", "50%", "75%", "100%"])
    cb.ax.tick_params(labelsize=9.5, colors=INK2, length=0)
    cb.outline.set_visible(False)
    cb.set_label("adults able to digest lactose", fontsize=9.5, color=INK2)

    handles = [
        plt.Line2D([], [], marker="o", ls="", markersize=7, markerfacecolor="#5598e7",
                   markeredgecolor=SURFACE, markeredgewidth=1.2, label="sampling site (measured)"),
        plt.Line2D([], [], marker="s", ls="", markersize=9, markerfacecolor=NODATA,
                   markeredgecolor=NODATA, label="no data — nearest sample >1,500 km"),
        plt.Line2D([], [], marker="s", ls="", markersize=9, markerfacecolor=OCEAN,
                   markeredgecolor="#dedcd6", label="sea"),
    ]
    ax.legend(handles=handles, loc="lower left", frameon=False, fontsize=9.5,
              labelcolor=INK2, handletextpad=0.6, borderpad=0.2)

    fig.text(0.012, 0.018,
             "Data: Global Lactase Persistence Association Database (GLAD), UCL, 2017 — "
             f"{NPOP} modern populations at {len(pts['lon'])} sites.  "
             "Interpolation: inverse-distance weighting "
             "(1/d², great-circle, tapered to 0 at 2,000 km), land only.",
             fontsize=8.5, color="#7a7975")
    fig.subplots_adjust(left=0.012, right=0.955, top=0.9, bottom=0.06)
    return fig, ax


def attach_hover(fig, ax, pts, values, mask, extent, lon_grid, lat_grid):
    """Nearest sampled population if the cursor is on one, otherwise the interpolated value —
    always labelled so a guess can't be mistaken for a measurement."""
    ann = ax.annotate("", xy=(0, 0), xytext=(12, 12), textcoords="offset points",
                      fontsize=9.5, color=INK, zorder=10, visible=False,
                      bbox=dict(boxstyle="round,pad=0.45", fc=SURFACE, ec="#dedcd6", lw=0.8))
    ny, nx = values.shape

    def on_move(ev):
        if ev.inaxes is not ax or ev.xdata is None:
            if ann.get_visible():
                ann.set_visible(False); fig.canvas.draw_idle()
            return
        # pixel-space distance to the nearest sample dot
        xy = ax.transData.transform(np.column_stack([pts["lon"], pts["lat"]]))
        d = np.hypot(xy[:, 0] - ev.x, xy[:, 1] - ev.y)
        i = int(d.argmin())
        if d[i] < 9:
            ann.xy = (pts["lon"][i], pts["lat"][i])
            head = (f"MEASURED\n{pts['pop'][i]} · {pts['country'][i]}\n"
                    f"{pts['phen'][i]*100:.0f}% lactase persistent\n"
                    f"{pts['n'][i]} chromosomes typed")
            mem = pts["members"][i]
            if len(mem) > 1:
                head += "\n" + "\n".join(f"  · {nm}: {v*100:.0f}%  (n={k})"
                                         for nm, v, k in sorted(mem, key=lambda t: -t[1]))
            ann.set_text(head)
        else:
            gx = int((ev.xdata - extent[0]) / (extent[1] - extent[0]) * nx)
            gy = int((extent[3] - ev.ydata) / (extent[3] - extent[2]) * ny)
            if not (0 <= gx < nx and 0 <= gy < ny) or not mask[gy, gx]:
                ann.set_visible(False); fig.canvas.draw_idle(); return
            v = values[gy, gx]
            ann.xy = (ev.xdata, ev.ydata)
            ann.set_text("NO DATA\nnearest sample >1,500 km away" if np.isnan(v)
                         else f"INTERPOLATED — not measured\n≈ {v*100:.0f}% lactase persistent")
        ann.set_visible(True)
        fig.canvas.draw_idle()

    fig.canvas.mpl_connect("motion_notify_event", on_move)


# ---------------------------------------------------------------- main

def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--save", metavar="PNG", default="lp_map.png",
                    help="where to write the PNG (default lp_map.png; --save '' to skip)")
    ap.add_argument("--no-show", action="store_true", help="don't open a window")
    ap.add_argument("--grid", type=int, default=GRID, help="grid cells across (default 700)")
    args = ap.parse_args()

    # An interactive window needs a working display. WSL without WSLg, or a plain SSH
    # session, has none — fall back to the PNG rather than dying on the last line.
    interactive = False
    if not args.no_show:
        for backend in ("TkAgg", "QtAgg", "MacOSX"):
            try:
                plt.switch_backend(backend)
                interactive = True
                break
            except Exception:
                continue
        if not interactive:
            plt.switch_backend("Agg")
            print("no usable display found — writing the PNG instead of opening a window")
    else:
        plt.switch_backend("Agg")

    pops = load_points()
    pts = to_sites(pops)
    rings = load_land()

    pad = 7.0
    extent = (max(-180, pts["lon"].min() - pad - 4), min(180, pts["lon"].max() + pad + 4),
              max(-90, pts["lat"].min() - pad), min(90, pts["lat"].max() + pad))
    nx = args.grid
    ny = int(nx * (extent[3] - extent[2]) / (extent[1] - extent[0]))
    lon_grid, lat_grid = np.meshgrid(np.linspace(extent[0], extent[1], nx),
                                     np.linspace(extent[3], extent[2], ny))

    print(f"interpolating {nx}×{ny} cells over {len(pts['lon'])} populations …")
    values = idw(lon_grid, lat_grid, pts)
    mask = land_mask(lon_grid, lat_grid, rings)

    # self-check 1: at an isolated sampling site the interpolation must return that
    # site's own measured value, not a smoothed one.
    at_site = idw(pts["lon"][None, :], pts["lat"][None, :], pts)[0]
    P = _unit(pts["lon"], pts["lat"])
    sep = R_EARTH * np.sqrt(np.maximum(0, 2 - 2 * np.clip(P @ P.T, -1, 1)))
    np.fill_diagonal(sep, np.inf)
    isolated = sep.min(axis=1) > 25          # km from any other site
    err = np.abs(at_site - pts["phen"])
    bad = np.where(isolated & (err >= 0.01))[0]
    print(f"   check: {isolated.sum()} sites are >25 km from any other; "
          f"interpolation reproduces the measured value at "
          f"{isolated.sum() - len(bad)}/{isolated.sum()} of them "
          f"({'ok' if len(bad) == 0 else 'FAIL'})")
    for i in bad:
        print(f"      FAIL {pts['pop'][i]}: measured {pts['phen'][i]:.3f} "
              f"→ {at_site[i]:.3f}")
    near = np.where(~isolated)[0]
    if len(near):
        print(f"   {len(near)} sites lie within 25 km of another site; there the value is "
              f"blended with its neighbour by design (max shift "
              f"{err[near].max():.3f})")

    # self-check 2: IDW is a weighted mean, so it must never leave [0, 1]
    fin = values[~np.isnan(values)]
    print(f"   raster range {fin.min():.3f}..{fin.max():.3f} over {fin.size} cells "
          f"({'ok, no overshoot' if fin.min() >= 0 and fin.max() <= 1 else 'FAIL'})")
    print(f"   land cells with a value: {(mask & ~np.isnan(values)).sum()}; "
          f"land cells left as no-data: {(mask & np.isnan(values)).sum()}")

    fig, ax = build_figure(pts, rings, values, mask, extent, len(pops["lon"]))
    attach_hover(fig, ax, pts, values, mask, extent, lon_grid, lat_grid)

    if args.save:
        fig.savefig(args.save, dpi=140, facecolor=SURFACE)
        print(f"wrote {os.path.abspath(args.save)}")
    if interactive:
        print("hover a dot for the populations sampled there, or anywhere else for the estimate")
        plt.show()


if __name__ == "__main__":
    main()
