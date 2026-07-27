/**
 * The genome: every EVOLVED value in the model.
 *
 * Two blocks — eye morphology and behaviour. Nothing here is a constant anywhere
 * else in the codebase; if a decision parameter appears outside this file as a
 * literal, that is invariant I4 failing.
 */

/** [min, max, generation-0 seed]. Seeds are starting points, not settings. */
export const GENE_SPEC = {
  /* ---------------------------- eye morphology ---------------------------- */
  patchWidthMm:        [0.05, 3.0, 0.10],
  invagination:        [0.0, 1.0, 0.0],
  apertureRatio:       [0.02, 1.0, 1.0],
  lensIndexGradient:   [0.0, 0.35, 0.0],
  membraneLayers:      [1, 4000, 1],
  screeningPigment:    [0.0, 1.0, 0.0],
  receptorCount:       [1, 1e6, 4],
  receptorDiameterUm:  [1.0, 10.0, 2.0],
  integrationTimeS:    [0.01, 600, 600],
  fieldOfViewSr:       [0.5, 6.28, 6.28],
  eyeAxisDorsal:       [0.0, 1.0, 0.5],

  /* ------------------------------ behaviour ------------------------------ */
  wFood:               [-5, 5, null],   // null seed => random N(0, 0.5)
  wPredator:           [-5, 5, null],
  wConspecific:        [-5, 5, null],
  wSubstrate:          [-5, 5, null],
  wCarrion:            [-5, 5, null],
  wNoise:              [0, 2, 0.5],
  shapeExpFood:        [0.5, 3, 1.0],
  shapeExpPredator:    [0.5, 3, 1.0],
  gateHunger:          [-2, 2, 0.0],
  gateEnergy:          [-2, 2, 0.0],
  preferredDepthDay:   [0, 40, 15],
  preferredDepthNight: [0, 40, 15],
  depthGain:           [0, 2, 0.5],
  fleeDriveThreshold:  [0, 5, 1.0],
  freezeDurationS:     [0, 30, 10],
  activityStartH:      [0, 21, 0],
  activityLengthH:     [0, 21, 10.5],
  foragingTrigger:     [0, 1, 0.30],
  satiationThreshold:  [0, 1, 0.90],
  spawnEnergyThreshold:[0, 1, 0.60],
  aggregationWeight:   [0, 3, 0.2],
  rhoBodyDorsal:       [0.15, 0.95, 0.50],
  rhoBodyVentral:      [0.15, 0.95, 0.50],
  clutchSize:          [20, 2000, 400],
};

export const GENE_NAMES = Object.keys(GENE_SPEC);
const INTEGER_GENES = new Set(['membraneLayers', 'receptorCount', 'clutchSize']);
/** Genes whose useful range spans orders of magnitude; mutate multiplicatively. */
export const LOG_GENES = new Set(['membraneLayers', 'receptorCount', 'integrationTimeS', 'patchWidthMm']);

export function foundingGenome(rng) {
  const g = {};
  for (const name of GENE_NAMES) {
    const [lo, hi, seed] = GENE_SPEC[name];
    g[name] = seed === null ? clamp(rng.normal() * 0.5, lo, hi) : seed;
  }
  return g;
}

/**
 * Mutate a genome. sigma is a fraction of each gene's range (or of its log range
 * for the multiplicative genes), applied every generation to every gene.
 */
export function mutate(g, rng, sigma) {
  const out = {};
  for (const name of GENE_NAMES) {
    const [lo, hi] = GENE_SPEC[name];
    let v = g[name];
    if (LOG_GENES.has(name)) {
      const logLo = Math.log(Math.max(lo, 1e-6)), logHi = Math.log(hi);
      const step = rng.normal() * sigma * (logHi - logLo);
      v = Math.exp(clamp(Math.log(Math.max(v, 1e-6)) + step, logLo, logHi));
    } else {
      v = clamp(v + rng.normal() * sigma * (hi - lo), lo, hi);
    }
    out[name] = INTEGER_GENES.has(name) ? Math.max(lo, Math.round(v)) : v;
  }
  return out;
}

export const clamp = (v, lo, hi) => (v < lo ? lo : v > hi ? hi : v);

/** Split the eye block out for optics.resolveEye(). */
export function eyeGenes(g) {
  return {
    patchWidthMm: g.patchWidthMm,
    invagination: g.invagination,
    apertureRatio: g.apertureRatio,
    lensIndexGradient: g.lensIndexGradient,
    membraneLayers: g.membraneLayers,
    screeningPigment: g.screeningPigment,
    receptorCount: g.receptorCount,
    receptorDiameterUm: g.receptorDiameterUm,
    integrationTimeS: g.integrationTimeS,
    fieldOfViewSr: g.fieldOfViewSr,
  };
}
