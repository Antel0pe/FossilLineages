/**
 * Uniform-grid spatial hash. Detection ranges are metres and the arena is
 * hundreds of metres, so brute-force pair scans dominate runtime; this reduces
 * them to a handful of neighbouring buckets.
 */
export class SpatialHash {
  constructor(sizeM, cellM) {
    this.sizeM = sizeM;
    this.cellM = cellM;
    this.n = Math.max(1, Math.ceil(sizeM / cellM));
    this.buckets = Array.from({ length: this.n * this.n }, () => []);
  }

  clear() { for (const b of this.buckets) b.length = 0; }

  cellOf(x, y) {
    const i = Math.min(this.n - 1, Math.max(0, Math.floor(x / this.cellM)));
    const j = Math.min(this.n - 1, Math.max(0, Math.floor(y / this.cellM)));
    return j * this.n + i;
  }

  insert(item) { this.buckets[this.cellOf(item.x, item.y)].push(item); }

  rebuild(items) {
    this.clear();
    for (const it of items) this.insert(it);
  }

  /** Call fn for every item within `radius` of (x, y). Toroidal wrap ignored. */
  forEachNear(x, y, radius, fn) {
    const span = Math.ceil(radius / this.cellM);
    const ci = Math.min(this.n - 1, Math.max(0, Math.floor(x / this.cellM)));
    const cj = Math.min(this.n - 1, Math.max(0, Math.floor(y / this.cellM)));
    for (let j = cj - span; j <= cj + span; j++) {
      if (j < 0 || j >= this.n) continue;
      for (let i = ci - span; i <= ci + span; i++) {
        if (i < 0 || i >= this.n) continue;
        const b = this.buckets[j * this.n + i];
        for (let k = 0; k < b.length; k++) fn(b[k]);
      }
    }
  }
}
