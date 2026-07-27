/**
 * Resource fields: phytoplankton (water column), benthic mat, mesozooplankton,
 * carrion. Stored as coarse grids with logistic regrowth and real depletion, so a
 * stationary animal starves and a crowded patch is exhausted.
 */
import {
  KJ_PER_G_C, WATER_COLUMN_FRACTION, CONSUMER_ACCESSIBLE_FRACTION,
  FOCAL_SHARE_OF_CONSUMER_FLUX, PHYTO_DOUBLINGS_PER_DAY, MAT_GROWTH_R_PER_DAY,
  CARRION_HALFLIFE_DAYS, PATCH_AREA_FRACTION, foodAtDepth,
  ZOO_SIZE_CLASSES, ZOO_FRACTION_OF_FLUX,
} from './constants.mjs';

const SEC_PER_METABOLIC_DAY = 86400;

export class ResourceField {
  /**
   * @param {{sizeM:number, cellM:number, productionGCm2Yr:number, rng:object}} opts
   */
  constructor({ sizeM, cellM, productionGCm2Yr, rng, depthM = 40, zooFraction = ZOO_FRACTION_OF_FLUX }) {
    this.depthM = depthM;
    this.sizeM = sizeM;
    this.cellM = cellM;
    this.n = Math.round(sizeM / cellM);
    this.cellArea = cellM * cellM;
    this.rng = rng;

    // Daily energy input per m^2 from primary production.
    this.dailyEnergyJPerM2 = (productionGCm2Yr / 365) * KJ_PER_G_C * 1000;

    // Energy per m^2 per day actually reachable by the focal consumer guild.
    this.focalFluxJPerM2Day =
      this.dailyEnergyJPerM2 * CONSUMER_ACCESSIBLE_FRACTION * FOCAL_SHARE_OF_CONSUMER_FLUX;

    // Standing stock is expressed directly in joules per cell so agents can eat it.
    // Carrying capacity ~ 4 days of production, a typical turnover for plankton.

    // Split the guild's energy flux between a smooth filterable field and
    // discrete particles. The field is findable without eyes; the particles are
    // not, and they are the only targets small enough for acuity to matter.
    this.zooFlux = this.focalFluxJPerM2Day * zooFraction;
    this.fieldFlux = this.focalFluxJPerM2Day * (1 - zooFraction);
    this.capacityPerCell = this.fieldFlux * 4 * this.cellArea;

    const cells = this.n * this.n;
    this.phyto = new Float64Array(cells).fill(this.capacityPerCell * 0.8);
    this.carrion = new Float64Array(cells);
    this.patchMult = new Float32Array(cells).fill(1);

    // Zooplankton: individuals per m^3 per size class, one grid per class.
    // Standing stock is 4 days of production, split equally by ENERGY across
    // classes, which puts far more small animals than large ones in the water.
    this.zooClasses = ZOO_SIZE_CLASSES;
    const columnVolumePerCell = this.cellArea * depthM;
    this.zooEnabled = zooFraction > 0;
    this.zooCapacity = this.zooClasses.map(c =>
      (this.zooFlux * 4 * this.cellArea / this.zooClasses.length) / c.energyJ
        / columnVolumePerCell);
    this.zoo = this.zooClasses.map((c, i) =>
      new Float64Array(cells).fill(this.zooCapacity[i] * 0.8));
    this.zooSupplyPerDay = this.zooClasses.map((c, i) =>
      (this.zooFlux * this.cellArea / this.zooClasses.length) / c.energyJ
        / columnVolumePerCell);

    this.phytoR = PHYTO_DOUBLINGS_PER_DAY * Math.LN2;   // per metabolic day
    this.matR = MAT_GROWTH_R_PER_DAY;
    this.carrionDecay = Math.LN2 / CARRION_HALFLIFE_DAYS;

    this.seedPatches();
    this.patchAgeDays = 0;
  }

  idx(x, y) {
    const i = Math.min(this.n - 1, Math.max(0, Math.floor(x / this.cellM)));
    const j = Math.min(this.n - 1, Math.max(0, Math.floor(y / this.cellM)));
    return j * this.n + i;
  }

  /** Lay down enriched patches: 3-8x background over ~15% of the area. */
  seedPatches() {
    this.patchMult.fill(1);
    const nPatches = Math.max(1, Math.round(
      (PATCH_AREA_FRACTION * this.sizeM * this.sizeM) / (Math.PI * 12 * 12)));
    this.patches = [];
    for (let p = 0; p < nPatches; p++) {
      const cx = this.rng.range(0, this.sizeM);
      const cy = this.rng.range(0, this.sizeM);
      const radius = this.rng.range(2.5, 25);
      const conc = this.rng.range(3, 8);
      this.patches.push({ cx, cy, radius, conc });
      const r2 = radius * radius;
      const i0 = Math.max(0, Math.floor((cx - radius) / this.cellM));
      const i1 = Math.min(this.n - 1, Math.floor((cx + radius) / this.cellM));
      const j0 = Math.max(0, Math.floor((cy - radius) / this.cellM));
      const j1 = Math.min(this.n - 1, Math.floor((cy + radius) / this.cellM));
      for (let j = j0; j <= j1; j++) {
        for (let i = i0; i <= i1; i++) {
          const dx = (i + 0.5) * this.cellM - cx, dy = (j + 0.5) * this.cellM - cy;
          if (dx * dx + dy * dy <= r2) this.patchMult[j * this.n + i] = conc;
        }
      }
    }
  }

  /** Energy density available to a filter feeder at (x, y, z), in J per cell. */
  availableAt(x, y, z) {
    const k = this.idx(x, y);
    return this.phyto[k] * foodAtDepth(z);
  }

  /** Local quality signal in 0..1, what a class-III eye can see as a "good patch". */
  qualityAt(x, y) {
    const k = this.idx(x, y);
    return Math.min(1, this.phyto[k] / (this.capacityPerCell * this.patchMult[k]));
  }

  patchConcAt(x, y) { return this.patchMult[this.idx(x, y)]; }

  consume(x, y, joules) {
    const k = this.idx(x, y);
    const taken = Math.min(this.phyto[k], joules);
    this.phyto[k] -= taken;
    return taken;
  }

  addCarrion(x, y, joules) { this.carrion[this.idx(x, y)] += joules; }

  consumeCarrion(x, y, joules) {
    const k = this.idx(x, y);
    const taken = Math.min(this.carrion[k], joules);
    this.carrion[k] -= taken;
    return taken;
  }

  /**
   * Regrowth, plus carrion decay.
   *
   * Production is SUPPLY-limited (light and nutrients), not stock-limited. A pure
   * logistic term collapses to zero growth once grazers strip the stock, which
   * traps the whole system in a dead state it can never leave — an artefact of the
   * growth model, not of the ecology. Phytoplankton standing stock is replenished
   * from continuous production plus a stock-proportional term for local division.
   */
  step(dtS) {
    const dtDays = dtS / SEC_PER_METABOLIC_DAY;
    const supply = this.fieldFlux * this.cellArea * dtDays;
    const r = this.phytoR * dtDays;
    const decay = Math.exp(-this.carrionDecay * dtDays);
    for (let k = 0; k < this.phyto.length; k++) {
      const cap = this.capacityPerCell * this.patchMult[k];
      const v = this.phyto[k];
      const headroom = Math.max(0, 1 - v / cap);
      this.phyto[k] = v + (supply + r * v) * headroom;
      if (this.phyto[k] < 0) this.phyto[k] = 0;
      this.carrion[k] *= decay;
    }
    for (let c = 0; c < this.zoo.length; c++) {
      const grid = this.zoo[c];
      const cap = this.zooCapacity[c];
      const add = this.zooSupplyPerDay[c] * dtDays;
      for (let k = 0; k < grid.length; k++) {
        const headroom = Math.max(0, 1 - grid[k] / cap);
        grid[k] += (add + r * grid[k]) * headroom;
        if (grid[k] < 0) grid[k] = 0;
      }
    }
  }

  /** Zooplankton density (individuals per m^3) of size class c at (x, y, z). */
  zooDensityAt(x, y, z, c) {
    return this.zoo[c][this.idx(x, y)] * foodAtDepth(z);
  }

  /** Remove `count` individuals of class c; returns how many were actually there. */
  consumeZoo(x, y, c, count) {
    const k = this.idx(x, y);
    const perCell = this.cellArea * this.depthM;      // m^3 represented by one cell
    const availableIndividuals = this.zoo[c][k] * perCell;
    const taken = Math.min(availableIndividuals, count);
    this.zoo[c][k] -= taken / perCell;
    if (this.zoo[c][k] < 0) this.zoo[c][k] = 0;
    return taken;
  }

  totalZooEnergy() {
    let s = 0;
    const perCell = this.cellArea * this.depthM;
    for (let c = 0; c < this.zoo.length; c++) {
      const e = this.zooClasses[c].energyJ;
      for (let k = 0; k < this.zoo[c].length; k++) s += this.zoo[c][k] * perCell * e;
    }
    return s;
  }

  /** Patches drift and are reseeded on their 2-10 day lifetime. */
  maybeReseed(dtS) {
    this.patchAgeDays += dtS / SEC_PER_METABOLIC_DAY;
    if (this.patchAgeDays > this.rng.range(2, 10)) {
      this.seedPatches();
      this.patchAgeDays = 0;
    }
  }

  totalPhyto() {
    let s = 0;
    for (let k = 0; k < this.phyto.length; k++) s += this.phyto[k];
    return s;
  }
}
