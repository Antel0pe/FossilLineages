/**
 * Physical and biological constants, transcribed from eye-sim-build-spec.md.
 *
 * Everything in this file is SET — a fact about bodies, water, chemistry or light.
 * Nothing here is a decision an animal makes; those live in genome.mjs.
 */

/* ------------------------------ units / physics ------------------------------ */
export const J_PER_ML_O2 = 20.1;
export const KJ_PER_G_C = 45;
export const E_SOFT_PELAGIC = 3600;      // J per g wet
export const E_SOFT_BENTHIC = 2600;
export const E_CARRION = 2900;
export const TISSUE_DENSITY = 1.05;      // g cm^-3
export const LAMBDA = 0.50;              // um, design wavelength
export const K_ABSORB = 0.0067;          // um^-1, visual pigment
export const MEMBRANE_LAYER_THICKNESS = 0.030; // um
export const SNR_THRESHOLD = 2.0;        // Rose criterion
export const Q10 = 2.25;
export const T_REF = 28;                 // degC

/* --------------------------------- time --------------------------------- */
export const DAY_LENGTH_H = 21.0;        // Cambrian solar day
export const DAYLIGHT_H = 10.5;
export const TWILIGHT_H = 0.67;
export const LUNAR_PERIOD_DAYS = 31.0;
export const SEC_PER_DAY = DAY_LENGTH_H * 3600;

/* ------------------------------ light field ------------------------------ */
// quanta um^-2 sr^-1 s^-1 (the Land-equation-compatible column of spec 4.1)
export const L_NOON = 2.0e8;
export const L_OVERCAST = 2.0e7;
export const L_TWILIGHT_DEEP = 3.2e4;
export const L_FULL_MOON = 1.0e4;
export const L_STARLIGHT = 1.0e2;

export const T_WATER = 0.95;
export const T_OCULAR = 0.85;

export const KD_UVB_RATIO = 3.0;         // Kd(UV-B) / Kd(PAR)
export const C_BEAM_RATIO = 3.5;         // beam attenuation / Kd(PAR)
export const SUBSTRATE_REFLECTANCE = 0.15;
export const BG_HORIZONTAL_FRACTION = 0.30;

export const TURBIDITY_STORM_MULT = 2.9;

/* -------------------------------- metabolism -------------------------------- */
export const SMR_COEFF = 148.0;          // J/day at 1 g, 28 degC
export const SMR_EXPONENT = 0.70;
export const FMR_MULT = 2.75;
export const ASSIM_CARNIVORE = 0.66;
export const ASSIM_SUSPENSION = 0.45;
export const SDA_FRACTION = 0.12;
export const CRUISE_COST_MULT = 1.8;
export const BURST_COST_MULT = 12.0;

/* --------------------------- starvation and gut --------------------------- */
export const RESERVE_FRACTION = 0.25;
export const STARVATION_DOWNREG = 1.15;
export const IMPAIRMENT_THRESHOLD = 0.35;
export const GUT_CAPACITY_FRACTION = 0.06;
/**
 * Gut passage half-life, 14 h anchored on a 250 g predator and scaled
 * allometrically. A 0.2 g suspension feeder eating ~40% of its body mass per day
 * cannot have a 14 h gut — the spec's flat 14 h is a large-animal figure and using
 * it unscaled makes small animals starve with full guts.
 */
export const GUT_EVACUATION_HALFLIFE_H_AT_250G = 14;
export const gutHalfLifeH = (massG, mode = 'carnivore') => {
  // A carnivore's gut is a batch reservoir; a suspension feeder's is a flow-through
  // tube. Small filter feeders (copepods, larvaceans, ascidians) clear their gut in
  // 20-60 min, and using the carnivore figure for them makes them starve with a
  // full gut at any realistic ration.
  if (mode === 'suspension') return 0.6;
  return GUT_EVACUATION_HALFLIFE_H_AT_250G * Math.pow(massG / 250, 0.25);
};

/**
 * Fraction of a predator's ration taken from prey OUTSIDE the modelled focal
 * population (mesozooplankton, other nekton). The focal species is a minority of
 * every predator's diet; without this the predators are forced to over-harvest it
 * or starve, neither of which is what the Cambrian food web looked like.
 */
export const ALTERNATIVE_PREY_FRACTION = 0.75;
/** Once reserves hit zero, a cohort is wiped out over about half a day. */
export const STARVATION_COLLAPSE_DAYS = 0.5;

/* ------------------------------ burst pools ------------------------------ */
export const FAST_POOL_CAPACITY = 8;         // bursts
export const FAST_POOL_TAU_S = 600;          // 10 min
export const SLOW_POOL_CAPACITY = 30;        // bursts/day at aerobic_scope = 1
export const SLOW_POOL_TAU_S = 18000;        // 5 h
export const SLOW_POOL_IMPAIR = 0.30;
export const EXHAUSTION_HAZARD_PER_DAY = 0.02;

/* ------------------------------- predation ------------------------------- */
/**
 * Largest prey a predator can handle, as a fraction of its own mass.
 *
 * 0.05 is the FEA-derived limit for Anomalocaris SPECIFICALLY: its thin elongate
 * endites fail on anything bigger. Generalising that one number to every predator
 * was wrong — it left the 0.2 g focal animal in a predation gap, too small for
 * Anomalocaris's profitability floor and too large for every other predator's
 * ceiling, so nothing hunted it at all. Raptorial arthropods with grasping spines
 * take prey a large fraction of their own mass; chaetognaths are documented taking
 * prey close to their own size.
 */
export const MAX_PREY_MASS_FRACTION = 0.05;          // default / Anomalocaris
export const MAX_PREY_MASS_FRACTION_BY_SPECIES = {
  anomalocaris: 0.05,
  isoxys: 0.50,
  chaetognath: 1.00,
};
export const maxPreyFraction = (name) =>
  MAX_PREY_MASS_FRACTION_BY_SPECIES[name] ?? MAX_PREY_MASS_FRACTION;
export const STRIKE_DECISION_LATENCY_S = 0.060;
export const HANDLING_TIME_COEFF = 30;       // s; handling = coeff * (mp/mP)^0.4
export const HANDLING_TIME_EXPONENT = 0.4;
export const POST_CAPTURE_LOCKOUT_S = 30;

/* --------------------------- resources / production --------------------------- */
export const WATER_COLUMN_FRACTION = 0.60;
export const BENTHIC_FRACTION = 0.40;
export const DETRITAL_RAIN_FRACTION = 0.15;
export const TROPHIC_TRANSFER = 0.10;
export const CONSUMER_ACCESSIBLE_FRACTION = 0.20;
export const FOCAL_SHARE_OF_CONSUMER_FLUX = 0.25;

/**
 * Mesozooplankton, as DISCRETE PARTICLES rather than a smooth field.
 *
 * This matters for one reason: a smooth field is angularly enormous, so its
 * detection never depends on acceptance angle (verify with diagnose.mjs — the
 * detection range of a 10 m patch is identical at 20 deg and 2 deg). Real prey
 * particles are 0.5-4 mm and subtend fractions of a degree, which is the regime
 * where resolution is the binding constraint. Bradoriids are described as
 * microphagous suspension feeders taking items down to 0.5 mm, and
 * myllokunmingids as taking small mesozooplankton, so discrete particulate prey
 * is part of the real environment, not a device.
 *
 * Individual mass follows L^3 at ~10 ug for a 1 mm animal (copepod scale).
 */
export const ZOO_SIZE_CLASSES = [
  { lengthMm: 0.5, handlingS: 0.4 },
  { lengthMm: 1.5, handlingS: 0.8 },
  { lengthMm: 4.0, handlingS: 1.8 },
].map(c => {
  const massG = 10e-6 * Math.pow(c.lengthMm, 3);
  return { ...c, sizeM: c.lengthMm / 1000, massG, energyJ: massG * 3600 };
});

/** Share of the focal guild's energy flux that arrives as particles, not as field. */
export const ZOO_FRACTION_OF_FLUX = 0.5;
/** Inherent contrast of a zooplankter against the water, viewed horizontally. */
export const ZOO_CONTRAST = 0.60;

export const PHYTO_DOUBLINGS_PER_DAY = 1.2;
export const MAT_GROWTH_R_PER_DAY = 0.044;
export const CARRION_HALFLIFE_DAYS = 1.5;

export const PATCH_DIAMETER_M = [5, 50];
export const PATCH_CONCENTRATION = [3, 8];
export const PATCH_LIFETIME_DAYS = [2, 10];
export const PATCH_AREA_FRACTION = 0.15;

/* -------------------------------- eye cost --------------------------------
 * Calibrated so eye cost as a fraction of SMR is ~0.001 for a bare patch and
 * ~0.10 for a focused high-resolution eye (build spec section 7).
 */
export const EYE_COST_TISSUE_COEFF = 1.0e3;
export const EYE_COST_INFO_COEFF = 6.7e-4;

/* --------------------------------- UV --------------------------------- */
export const UV_SURFACE_HAZARD_PER_DAY = 0.006;
export const UV_PIGMENT_PROTECTION = 0.4;    // fraction removed at screening_pigment = 1

/* -------------------------- vertical food profile -------------------------- */
// depth (m) -> relative phytoplankton concentration
export const FOOD_PROFILE = [
  { z: 0, rel: 1.00 },
  { z: 2, rel: 1.00 },
  { z: 6, rel: 0.85 },
  { z: 12, rel: 0.45 },
  { z: 25, rel: 0.15 },
  { z: 40, rel: 0.04 },
];

/* ------------------------------ non-visual senses ------------------------------ */
export const MECHANO_RANGE_BL = 2.0;         // body lengths
export const MECHANO_LATENCY_S = 0.020;
export const CHEMO_RANGE_M = [0.5, 5.0];
export const CHEMO_LATENCY_S = 6.0;

/* --------------------------------- species --------------------------------- */
export const SPECIES = {
  myllokunmingid: {
    name: 'myllokunmingid',
    role: 'focal',
    bodyLengthMm: 26,
    massG: 0.20,
    assimilation: ASSIM_SUSPENSION,
    feedingMode: 'suspension',
    eyeEvolves: true,
    cruiseMs: 0.052,
    burstMs: 0.52,
    burstDurationS: 0.4,
    accelMs2: 35,
    turnRadiusBL: 0.15,
    densityPerM2: 2.1,
    generationTimeYr: 1.0,
    maxLifespanYr: 3,
    juvenileMortality: 0.995,
    adultAnnualMortality: 0.40,
    clutchEnergyFraction: 0.20,
  },
  anomalocaris: {
    name: 'anomalocaris',
    role: 'apex_visual_predator',
    bodyLengthMm: 350,
    massG: 250,
    assimilation: ASSIM_CARNIVORE,
    eyeEvolves: false,
    fixedEye: { deltaRho: 0.0244, fovSr: 6.0, integrationS: 0.05, receptorDiameterUm: 95 },
    cruiseMs: 0.40,
    burstMs: 0.90,
    burstDurationS: 5.0,
    accelMs2: 4,
    turnRadiusBL: 0.50,
    strikeEnvelopeM: 0.15,
    densityPerM2: 0.00085,
    adultAnnualMortality: 0.25,
  },
  isoxys: {
    name: 'isoxys',
    role: 'visual_mesopredator',
    bodyLengthMm: 30,
    massG: 1.0,
    assimilation: ASSIM_CARNIVORE,
    eyeEvolves: false,
    fixedEye: { deltaRho: 0.087, fovSr: 4.0, integrationS: 0.06, receptorDiameterUm: 40 },
    cruiseMs: 0.045,
    burstMs: 0.30,
    burstDurationS: 1.5,
    accelMs2: 20,
    turnRadiusBL: 0.20,
    strikeEnvelopeM: 0.010,
    densityPerM2: 0.15,
    adultAnnualMortality: 0.50,
  },
  chaetognath: {
    name: 'chaetognath',
    role: 'nonvisual_control_predator',
    bodyLengthMm: 20,
    massG: 0.05,
    assimilation: ASSIM_CARNIVORE,
    eyeEvolves: false,
    fixedEye: null,                        // blind by construction: the control
    cruiseMs: 0.010,
    burstMs: 0.35,
    burstDurationS: 0.5,
    accelMs2: 40,
    turnRadiusBL: 0.10,
    strikeEnvelopeM: 0.005,
    densityPerM2: 0.40,
    adultAnnualMortality: 0.60,
  },
};

/* --------------------------------- epochs --------------------------------- */
export const EPOCHS = {
  pre_predation: {
    name: 'pre_predation',
    targetClass: 3,
    pO2Start: 0.05, pO2End: 0.16,
    temperatureC: 22.5,
    kdBase: 0.12,
    primaryProductionGCm2Yr: 30,
    predators: [],
    founderMassG: 0.10,
  },
  predation_begins: {
    name: 'predation_begins',
    targetClass: 4,
    pO2Start: 0.16, pO2End: 0.25,
    temperatureC: 27.5,
    kdBase: 0.25,
    primaryProductionGCm2Yr: 60,
    predators: ['chaetognath'],
    founderMassG: 0.15,
  },
  visual_arms_race: {
    name: 'visual_arms_race',
    targetClass: 4,
    pO2Start: 0.24, pO2End: 0.48,
    temperatureC: 28.0,
    kdBase: 0.55,
    primaryProductionGCm2Yr: 100,
    predators: ['anomalocaris', 'isoxys', 'chaetognath'],
    founderMassG: 0.20,
  },
};

/* ------------------------- Nilsson & Pelger reference ------------------------- */
export const NP_STEPS_TOTAL = 1829;
export const NP_GENERATIONS_PER_STEP = 200;
export const NP_TOTAL_GENERATIONS = NP_STEPS_TOTAL * NP_GENERATIONS_PER_STEP;

/* --------------------------------- helpers --------------------------------- */
export const q10Factor = (tempC) => Math.pow(Q10, (tempC - T_REF) / 10);

/** Standard metabolic rate, J per day. */
export const smrJPerDay = (massG, tempC) =>
  SMR_COEFF * Math.pow(massG, SMR_EXPONENT) * q10Factor(tempC);

/** Relative phytoplankton concentration at depth z, linearly interpolated. */
export function foodAtDepth(z) {
  const p = FOOD_PROFILE;
  if (z <= p[0].z) return p[0].rel;
  for (let i = 1; i < p.length; i++) {
    if (z <= p[i].z) {
      const t = (z - p[i - 1].z) / (p[i].z - p[i - 1].z);
      return p[i - 1].rel + t * (p[i].rel - p[i - 1].rel);
    }
  }
  return p[p.length - 1].rel;
}
