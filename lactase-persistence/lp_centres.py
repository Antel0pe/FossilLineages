"""
Which populations are actually LP centres, and which are too small to trust?

Reads the GLAD supplementary table (Liebert et al. 2017 / Itan et al. lineage) and
ranks populations by calculated LP phenotype frequency, reporting the sample size
behind each estimate and which of the four functional alleles carries it.

Two different bars matter and get conflated:
  - GENOTYPING SAMPLE SIZE  -> is the frequency estimate statistically reliable?
  - POPULATION SIZE         -> is this a demographic centre or a local curiosity?
Only the first is in this file. The second has to come from elsewhere.

Run:  python3 lactase-persistence/lp_centres.py
"""

import csv
import os
from collections import defaultdict

HERE = os.path.dirname(os.path.abspath(__file__))
CSV_PATH = os.path.join(HERE, "data", "LP_genotype_frequencies_2017.csv")

ALLELES = {
    6: "-14010 (E.Afr)",
    7: "-14009",
    8: "-13915 (ME)",
    9: "-13910 (Eur)",
    10: "-13907 (Afr)",
}
PHENO_BAR = 0.60
N_BAR = 25


def load():
    rows = []
    with open(CSV_PATH, encoding="utf-8-sig", newline="") as fh:
        for i, rec in enumerate(csv.reader(fh)):
            if i < 3 or len(rec) < 13:
                continue
            try:
                chroms = int(float(rec[5]))
                pheno = float(rec[12])
            except (ValueError, TypeError):
                continue

            def num(j):
                try:
                    return float(rec[j])
                except (ValueError, TypeError):
                    return 0.0

            freqs = {name: num(j) for j, name in ALLELES.items()}
            top = max(freqs, key=freqs.get)
            rows.append({
                "cont": rec[0].strip(), "country": rec[1].strip(),
                "pop": rec[2].strip(), "n": chroms // 2,
                "pheno": pheno, "top": top, "topf": freqs[top],
            })
    return rows


def table(rows, title):
    print(f"\n=== {title} ({len(rows)} populations) ===")
    print(f"{'population':<32}{'country':<16}{'n':>5}{'LP':>6}   main allele")
    print("-" * 84)
    for r in rows:
        print(f"{r['pop'][:31]:<32}{r['country'][:15]:<16}{r['n']:>5}"
              f"{100*r['pheno']:>5.0f}%   {r['top']} ({r['topf']:.2f})")


def main():
    rows = load()
    print(f"{len(rows)} populations parsed from GLAD")

    passing = sorted([r for r in rows if r["pheno"] >= PHENO_BAR and r["n"] >= N_BAR],
                     key=lambda r: -r["pheno"])
    table(passing, f"CENTRES: LP >= {PHENO_BAR:.0%} and n >= {N_BAR} genotyped")

    fragile = sorted([r for r in rows if r["pheno"] >= PHENO_BAR and r["n"] < N_BAR],
                     key=lambda r: -r["pheno"])
    table(fragile, f"HIGH LP BUT FRAGILE: n < {N_BAR} — estimate may be noise")

    print("\n=== passing centres grouped by carrying allele ===")
    by_allele = defaultdict(list)
    for r in passing:
        by_allele[r["top"]].append(r)
    for allele, group in sorted(by_allele.items(), key=lambda kv: -len(kv[1])):
        countries = sorted({g["country"] for g in group})
        print(f"\n{allele}: {len(group)} populations")
        print(f"   countries: {', '.join(countries)}")

    print("\n=== regional summary, all populations (sample-size weighted) ===")
    agg = defaultdict(lambda: [0, 0])
    for r in rows:
        a = agg[r["cont"]]
        a[0] += r["pheno"] * r["n"]
        a[1] += r["n"]
    for cont, (num, den) in sorted(agg.items(), key=lambda kv: -kv[1][0] / max(kv[1][1], 1)):
        if den:
            print(f"  {cont[:28]:<30} weighted LP = {100*num/den:>5.1f}%  "
                  f"(n = {den:,} individuals)")


if __name__ == "__main__":
    main()
