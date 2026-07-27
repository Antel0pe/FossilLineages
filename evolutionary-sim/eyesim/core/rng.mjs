/** Seeded PRNG (mulberry32) so every run is reproducible from its seed. */

export function makeRng(seed) {
  let a = seed >>> 0;
  const next = () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  let spare = null;
  return {
    /** Uniform [0,1). */
    next,
    /** Uniform [lo,hi). */
    range: (lo, hi) => lo + next() * (hi - lo),
    /** Integer [0,n). */
    int: (n) => Math.floor(next() * n),
    /** Standard normal, Box-Muller with a cached spare. */
    normal() {
      if (spare !== null) { const v = spare; spare = null; return v; }
      let u, v, s;
      do { u = next() * 2 - 1; v = next() * 2 - 1; s = u * u + v * v; } while (s === 0 || s >= 1);
      const f = Math.sqrt(-2 * Math.log(s) / s);
      spare = v * f;
      return u * f;
    },
    /** Poisson sample; exact for small lambda, normal approximation above 30. */
    poisson(lambda) {
      if (lambda <= 0) return 0;
      if (lambda > 30) return Math.max(0, Math.round(lambda + Math.sqrt(lambda) * this.normal()));
      const L = Math.exp(-lambda);
      let k = 0, p = 1;
      do { k++; p *= next(); } while (p > L);
      return k - 1;
    },
    /** Binomial sample. */
    binomial(n, p) {
      if (p <= 0 || n <= 0) return 0;
      if (p >= 1) return n;
      if (n * p > 30 && n * (1 - p) > 30) {
        const m = n * p, s = Math.sqrt(n * p * (1 - p));
        return Math.min(n, Math.max(0, Math.round(m + s * this.normal())));
      }
      let k = 0;
      for (let i = 0; i < n; i++) if (next() < p) k++;
      return k;
    },
    pick(arr) { return arr[Math.floor(next() * arr.length)]; },
  };
}
