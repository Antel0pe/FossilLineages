"""
Two map series from the public data behind Evershed et al. 2022 (Nature):

  1. milk_over_time.png  — where dairy fat residues turn up in pottery, by period
  2. lp_ancient_over_time.png — where and when the rs4988235 derived (LP) allele
     turns up in ancient genomes, over the same periods

Both are dots only. No interpolation: the public milk table is a SUBSET of the
paper's 554-site database, so a smooth surface would imply coverage that does not
exist. Absence on these maps means "nobody sampled here", not "no milk".

Run:  python3 lactase-persistence/time_series_maps.py
"""

import csv
import io
import json
import os
import sys
from collections import Counter

import matplotlib
import numpy as np

if not os.environ.get("DISPLAY") and sys.platform != "win32":
    matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.colors import LinearSegmentedColormap
from matplotlib.lines import Line2D

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
MILK_CSV = os.path.join(ROOT, "data", "lactase", "milk", "lipid_residue_summary.csv")
ADNA_TSV = os.path.join(ROOT, "data", "lactase", "adna", "AADRv44.all.mpileups.tsv")
GEO_PATH = os.path.join(HERE, "data", "ne_110m_admin_0_countries.json")

# same ramp as lp_map.py so the two artefacts read as one family
RAMP = ["#cde2fb", "#b7d3f6", "#9ec5f4", "#86b6ef", "#6da7ec", "#5598e7", "#3987e5",
        "#2176d6", "#1665be", "#0f55a3", "#0b4587", "#08356a", "#05264e"]
OCEAN = "#f3f2f0"
LAND = "#e4e2dc"
COAST = "#c9c6bd"
INK = "#0b0b0b"
MUTED = "#6b6a66"
SURFACE = "#fcfcfb"
CARRIER = "#08356a"     # has at least one LP allele
NONCARRIER = "#d8d5cd"  # sampled, no LP allele

# Time slices copied from the paper's own Figure 2, so the milk panels are
# directly comparable to the published figure. Years: negative = BC, positive = AD.
SLICES = [
    ("7000–6500 BC", -7000, -6500),
    ("6500–5500 BC", -6500, -5500),
    ("5500–5000 BC", -5500, -5000),
    ("5000–4500 BC", -5000, -4500),
    ("4500–3500 BC", -4500, -3500),
    ("3500–2000 BC", -3500, -2000),
    ("2000 BC – AD 1500", -2000, 1500),
]

# Frame. Chosen to keep Europe legible; anything outside is COUNTED AND REPORTED
# on the figure rather than silently dropped.
EXTENT = (-12.0, 60.0, 32.0, 63.0)  # lon_min, lon_max, lat_min, lat_max


# ----------------------------------------------------------------- geography
def load_land():
    feats = json.load(io.open(GEO_PATH, encoding="utf-8"))["features"]
    rings = []
    for f in feats:
        g = f.get("geometry") or {}
        if g.get("type") == "Polygon":
            polys = [g["coordinates"]]
        elif g.get("type") == "MultiPolygon":
            polys = g["coordinates"]
        else:
            continue
        for poly in polys:
            for ring in poly:
                arr = np.asarray(ring, dtype=float)
                if arr.ndim == 2 and len(arr) >= 3:
                    rings.append(arr)
    return rings


def draw_base(ax, rings):
    lo0, lo1, la0, la1 = EXTENT
    ax.set_facecolor(OCEAN)
    for r in rings:
        # cheap bbox reject so we don't stroke the whole planet 7 times
        if r[:, 0].max() < lo0 - 5 or r[:, 0].min() > lo1 + 5:
            continue
        if r[:, 1].max() < la0 - 5 or r[:, 1].min() > la1 + 5:
            continue
        ax.fill(r[:, 0], r[:, 1], facecolor=LAND, edgecolor=COAST, linewidth=0.35, zorder=1)
    ax.set_xlim(lo0, lo1)
    ax.set_ylim(la0, la1)
    ax.set_aspect(1.0 / np.cos(np.radians((la0 + la1) / 2)))
    ax.set_xticks([])
    ax.set_yticks([])
    for s in ax.spines.values():
        s.set_color(COAST)
        s.set_linewidth(0.6)


def in_frame(lon, lat):
    lo0, lo1, la0, la1 = EXTENT
    return lo0 <= lon <= lo1 and la0 <= lat <= la1


# ---------------------------------------------------------------- milk data
def load_milk(verbose=True):
    """One record per site-phase: lon, lat, dairy fraction, sherd count, year span."""
    with io.open(MILK_CSV, encoding="utf-8", errors="replace", newline="") as f:
        rows = list(csv.DictReader(f))

    cols = list(rows[0].keys())
    # header text contains a mangled per-mille glyph, so match by prefix
    c_dairy = next(c for c in cols if c.startswith("N sherds below"))
    c_other = next(c for c in cols if c.startswith("N sherds above"))
    if verbose:
        print(f"[milk] {len(rows)} rows, {len(cols)} columns")
        print(f"[milk] dairy column  = {c_dairy!r}")
        print(f"[milk] non-dairy col = {c_other!r}")

    out, drops = [], Counter()
    for r in rows:
        if len(r) != len(cols) or None in r.values():
            drops["ragged row"] += 1
            continue
        try:
            lat = float(r["Latitude"])
            lon = float(r["Longitude"])
            # "Start BCE" is the OLDER bound in years BCE; negative values are AD.
            y0 = -float(r["Start BCE"])
            y1 = -float(r["End BCE"])
            d = int(float(r[c_dairy]))
            o = int(float(r[c_other]))
        except (TypeError, ValueError):
            drops["unparseable field"] += 1
            continue
        if d + o <= 0:
            drops["zero sherds with animal fat"] += 1
            continue
        assert -90 <= lat <= 90 and -180 <= lon <= 180, (lat, lon)
        frac = d / (d + o)
        assert 0.0 <= frac <= 1.0
        out.append(dict(site=r["Name of site"], country=r["Country"], lon=lon, lat=lat,
                        y0=min(y0, y1), y1=max(y0, y1), n=d + o, dairy=d, frac=frac))

    if verbose:
        print(f"[milk] kept {len(out)} site-phases, {sum(x['n'] for x in out)} sherds with animal fat")
        for k, v in drops.items():
            print(f"[milk] dropped {v}: {k}")
        names_with_commas = [x["site"] for x in out if "," in x["site"]]
        print(f"[milk] site names containing commas parsed intact: {len(names_with_commas)}"
              + (f" e.g. {names_with_commas[0]!r}" if names_with_commas else ""))
        off = [x for x in out if not in_frame(x["lon"], x["lat"])]
        print(f"[milk] outside map frame: {len(off)} "
              f"({sorted(set(x['country'].strip() for x in off))})")
    return out


# ---------------------------------------------------------------- aDNA data
# rs4988235: G = ancestral (lactase non-persistent), A = derived (LP).
GENO = {
    "GG": (0, 2),
    "GA": (1, 2),
    "AG": (1, 2),
    "AA": (2, 2),
    "G": (0, 1),   # single read — one allele observed
    "A": (1, 1),
}


def load_adna(verbose=True):
    with io.open(ADNA_TSV, encoding="utf-8", errors="replace", newline="") as f:
        rows = list(csv.DictReader(f, delimiter="\t"))

    seen, out, drops = Counter(), [], Counter()
    for r in rows:
        g = (r.get("genotype") or "").strip()
        if not g:
            drops["no call at rs4988235"] += 1
            continue
        seen[g] += 1
        if g not in GENO:
            drops[f"genotype not mapped: {g}"] += 1
            continue
        try:
            lat = float(r["lat"])
            lon = float(r["long"])
            bp = float(r["mean_date"])
        except (TypeError, ValueError):
            drops["unparseable coords/date"] += 1
            continue
        if bp <= 0:
            drops["present-day reference (BP=0)"] += 1
            continue
        derived, total = GENO[g]
        # AADR mean_date is years BP (before 1950). Calendar year = 1950 - BP.
        year = 1950.0 - bp
        out.append(dict(lon=lon, lat=lat, year=year, geno=g,
                        derived=derived, alleles=total))

    if verbose:
        print(f"[aDNA] {len(rows)} rows in file")
        print(f"[aDNA] distinct genotypes observed: {dict(seen)}")
        print(f"[aDNA] kept {len(out)} ancient individuals with a call")
        for k, v in drops.items():
            print(f"[aDNA] dropped {v}: {k}")
        print(f"[aDNA] total alleles {sum(x['alleles'] for x in out)}, "
              f"derived {sum(x['derived'] for x in out)}")
        off = [x for x in out if not in_frame(x["lon"], x["lat"])]
        print(f"[aDNA] outside map frame: {len(off)}")
    return out


def overlaps(y0, y1, s0, s1):
    return y0 < s1 and y1 > s0


# ------------------------------------------------------------------ figures
def panel_grid(title, subtitle, caption):
    fig = plt.figure(figsize=(15.5, 8.4), facecolor=SURFACE)
    axes = []
    for i in range(8):
        ax = fig.add_subplot(2, 4, i + 1)
        ax.set_facecolor(SURFACE)
        axes.append(ax)
    fig.suptitle(title, x=0.045, y=0.972, ha="left", fontsize=19,
                 fontweight="bold", color=INK)
    fig.text(0.045, 0.921, subtitle, ha="left", fontsize=10.5, color=MUTED)
    fig.text(0.045, 0.025, caption, ha="left", va="bottom", fontsize=8.2, color=MUTED)
    fig.subplots_adjust(left=0.035, right=0.985, top=0.865, bottom=0.135,
                        wspace=0.09, hspace=0.42)
    return fig, axes


def milk_figure(recs, rings, out_png):
    cmap = LinearSegmentedColormap.from_list("milk", RAMP)
    offr = [x for x in recs if not in_frame(x["lon"], x["lat"])]
    off = len(offr)
    off_where = ", ".join(sorted({x["country"].strip() for x in offr})) or "none"
    ledger = []

    fig, axes = panel_grid(
        "Milk in the pots, 7000 BC to AD 1500",
        "Each dot is one excavated site-phase. Colour = share of its animal-fat residues that are ruminant "
        "dairy fat. Size = number of sherds behind that share.",
        "Data: Evershed et al. 2022 (Nature), public site-phase summary — github.com/AdrianTimpson/2020-03-03523A. "
        "This table is the study's NEWLY-GENERATED subset, not all 554 sites in the paper's database; coverage is "
        "UK- and Germany-heavy.\nBlank map means NOBODY SAMPLED THERE — not that milk was absent. A site-phase is "
        "drawn in every slice its date range overlaps. The Δ¹³C proxy cannot detect mare's milk, so "
        "horse-pastoralist regions read as milk-free when they may not be.",
    )

    for i, (label, s0, s1) in enumerate(SLICES):
        ax = axes[i]
        draw_base(ax, rings)
        sel = [x for x in recs if overlaps(x["y0"], x["y1"], s0, s1)]
        drawn = [x for x in sel if in_frame(x["lon"], x["lat"])]
        if drawn:
            ax.scatter([x["lon"] for x in drawn], [x["lat"] for x in drawn],
                       c=[x["frac"] for x in drawn], cmap=cmap, vmin=0, vmax=1,
                       s=[14 + 5.2 * np.sqrt(x["n"]) for x in drawn],
                       edgecolors=SURFACE, linewidths=0.6, zorder=3, alpha=0.95)
        # stats describe exactly what is drawn, so the number and the picture agree
        nsherd = sum(x["n"] for x in drawn)
        mean = (sum(x["dairy"] for x in drawn) / nsherd * 100) if nsherd else float("nan")
        ax.set_title(label, fontsize=12, fontweight="bold", color=INK, pad=7, loc="left")
        note = (f"{len(drawn)} site-phases · {nsherd} sherds\n"
                f"{mean:.0f}% of animal fats are dairy" if nsherd else
                f"{len(drawn)} site-phases · no sherds sampled")
        ax.text(0.02, -0.055, note, transform=ax.transAxes, ha="left", va="top",
                fontsize=8.4, color=MUTED)
        ledger.append((label, len(drawn), nsherd, mean, bool(drawn)))

    # legend cell
    ax = axes[7]
    ax.set_facecolor(SURFACE)
    ax.set_xticks([])
    ax.set_yticks([])
    for s in ax.spines.values():
        s.set_visible(False)
    sm = plt.cm.ScalarMappable(cmap=cmap, norm=plt.Normalize(0, 1))
    cax = ax.inset_axes([0.06, 0.66, 0.72, 0.055])
    cb = fig.colorbar(sm, cax=cax, orientation="horizontal")
    cb.set_ticks([0, 0.25, 0.5, 0.75, 1.0])
    cb.set_ticklabels(["0%", "25%", "50%", "75%", "100%"])
    cb.ax.tick_params(labelsize=8.5, colors=MUTED, length=2)
    cb.outline.set_visible(False)
    ax.text(0.06, 0.80, "share of animal-fat residues that are dairy",
            transform=ax.transAxes, fontsize=8.8, color=INK)
    for j, n in enumerate([1, 10, 50, 120]):
        ax.scatter([0.11 + j * 0.19], [0.33], s=14 + 5.2 * np.sqrt(n),
                   transform=ax.transAxes, facecolor="#9ec5f4",
                   edgecolors=SURFACE, linewidths=0.6)
        ax.text(0.11 + j * 0.19, 0.21, str(n), transform=ax.transAxes,
                ha="center", fontsize=8.2, color=MUTED)
    ax.text(0.06, 0.45, "sherds with animal fat at that site-phase",
            transform=ax.transAxes, fontsize=8.8, color=INK)
    ax.text(0.06, 0.10, f"{off} site-phase(s) fall outside this frame\n({off_where}) and are not drawn.",
            transform=ax.transAxes, fontsize=8.2, color=MUTED, va="top")

    fig.savefig(out_png, dpi=170, facecolor=SURFACE)
    print(f"[milk] wrote {out_png}")
    return ledger


def lp_figure(recs, rings, out_png):
    offr = [x for x in recs if not in_frame(x["lon"], x["lat"])]
    off = len(offr)
    off_car = sum(1 for x in offr if x["derived"] > 0)
    pre = sum(1 for x in recs if x["year"] < SLICES[0][1])
    pre_car = sum(1 for x in recs if x["year"] < SLICES[0][1] and x["derived"] > 0)
    print(f"[lp] off-frame individuals {off}, of which LP carriers {off_car}")
    print(f"[lp] pre-7000 BC individuals {pre}, of which LP carriers {pre_car}")
    ledger = []

    fig, axes = panel_grid(
        "When the lactase-persistence allele actually shows up",
        "Each dot is one ancient individual sequenced at rs4988235. Dark = carries at least one copy of the "
        "derived (LP) allele. Pale = sampled, no copy.",
        "Data: Evershed et al. 2022 (Nature), ancient-DNA call set — github.com/ydiekmann/Evershed_Nature_2022 "
        "(AADR v44 pileups at rs4988235). Dates are AADR mean_date in years BP, converted as calendar year = 1950 − BP.\n"
        "Allele frequency counts alleles, not people: a homozygote contributes 2, a heterozygote 1 of 2, a "
        "single-read call 1 of 1. Sampling is uneven in space and time — the per-panel n is the caveat.",
    )

    for i, (label, s0, s1) in enumerate(SLICES):
        ax = axes[i]
        draw_base(ax, rings)
        sel = [x for x in recs if s0 <= x["year"] < s1]
        drawn = [x for x in sel if in_frame(x["lon"], x["lat"])]
        non = [x for x in drawn if x["derived"] == 0]
        car = [x for x in drawn if x["derived"] > 0]
        if non:
            ax.scatter([x["lon"] for x in non], [x["lat"] for x in non], s=17,
                       facecolor=NONCARRIER, edgecolors="#b3b0a8", linewidths=0.4,
                       zorder=2, alpha=0.9)
        if car:
            ax.scatter([x["lon"] for x in car], [x["lat"] for x in car], s=78,
                       facecolor=CARRIER, edgecolors=SURFACE, linewidths=0.9,
                       zorder=4)
        # stats describe exactly what is drawn, so the number and the picture agree
        na = sum(x["alleles"] for x in drawn)
        nd = sum(x["derived"] for x in drawn)
        freq = (nd / na * 100) if na else float("nan")
        ax.set_title(label, fontsize=12, fontweight="bold", color=INK, pad=7, loc="left")
        note = (f"{len(drawn)} individuals · {na} alleles\n"
                f"{nd} derived — {freq:.1f}% LP" if na else
                f"{len(drawn)} individuals sampled")
        ax.text(0.02, -0.055, note, transform=ax.transAxes, ha="left", va="top",
                fontsize=8.4, color=MUTED)
        ledger.append((label, len(drawn), na, nd, freq, bool(drawn)))

    ax = axes[7]
    ax.set_xticks([])
    ax.set_yticks([])
    for s in ax.spines.values():
        s.set_visible(False)
    handles = [
        Line2D([], [], marker="o", linestyle="", markersize=10,
               markerfacecolor=CARRIER, markeredgecolor=SURFACE,
               label="carries ≥1 LP allele"),
        Line2D([], [], marker="o", linestyle="", markersize=5.5,
               markerfacecolor=NONCARRIER, markeredgecolor="#b3b0a8",
               label="sampled, no LP allele"),
    ]
    ax.legend(handles=handles, loc="upper left", bbox_to_anchor=(0.02, 0.92),
              frameon=False, fontsize=9.4, labelspacing=1.0,
              handletextpad=1.0, borderpad=0)
    ax.text(0.02, 0.45,
            f"{off} individual(s) fall outside this frame and are\n"
            f"not drawn — {off_car} of them carry an LP allele.\n\n"
            f"{pre} individual(s) predate 7000 BC and fall before\n"
            f"the first panel — {pre_car} of them carry an LP allele.\n\n"
            f"Panel percentages count ONLY the individuals drawn\nin that panel.",
            transform=ax.transAxes, fontsize=8.4, color=MUTED, va="top")

    fig.savefig(out_png, dpi=170, facecolor=SURFACE)
    print(f"[lp] wrote {out_png}")
    return ledger


def main():
    rings = load_land()
    print(f"[geo] {len(rings)} coastline rings")

    milk = load_milk()
    adna = load_adna()

    ml = milk_figure(milk, rings, os.path.join(HERE, "milk_over_time.png"))
    ll = lp_figure(adna, rings, os.path.join(HERE, "lp_ancient_over_time.png"))

    print("\n--- MILK LEDGER ---")
    print(f"{'slice':<20}{'phases':>8}{'sherds':>8}{'dairy%':>9}  drawn")
    for label, n, ns, mean, drawn in ml:
        m = "  n/a" if ns == 0 else f"{mean:8.1f}"
        print(f"{label:<20}{n:>8}{ns:>8}{m:>9}  {drawn}")

    print("\n--- ANCIENT LP LEDGER ---")
    print(f"{'slice':<20}{'indiv':>8}{'alleles':>9}{'derived':>9}{'LP%':>8}  drawn")
    for label, n, na, nd, freq, drawn in ll:
        f = "  n/a" if na == 0 else f"{freq:7.1f}"
        print(f"{label:<20}{n:>8}{na:>9}{nd:>9}{f:>8}  {drawn}")

    if matplotlib.get_backend().lower() != "agg":
        plt.show()


if __name__ == "__main__":
    main()
