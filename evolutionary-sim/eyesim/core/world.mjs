/**
 * The simulation.
 *
 * Structure: each generation is one evaluation episode of `episodeDays` simulated
 * days. Agents forage, are hunted, spend energy and die during the episode; at the
 * end, survivors reproduce in proportion to accumulated surplus and offspring
 * inherit mutated genomes. A "generation" is therefore one lifetime-equivalent,
 * not a calendar year — see REPORT.md for what that means for the N&P comparison.
 *
 * Timestep is coarse (default 30 s) for movement, with detection and strike
 * outcomes resolved analytically within the step rather than by stepping a chase.
 * That keeps every physical dependency (optics, contrast, light, reaction
 * asymmetry) while making thousands of generations affordable.
 */
import * as C from './constants.mjs';
import { LightField } from './light.mjs';
import { ResourceField } from './resources.mjs';
import { makeRng } from './rng.mjs';
import { SpatialHash } from './spatial.mjs';
import { foundingGenome, mutate, eyeGenes } from './genome.mjs';
import {
  resolveEye, photonCatch, inherentContrast, effectiveContrast,
  detects, snr, detectionRange, nilssonClass, eyeParameter,
} from './optics.mjs';

const SEC_PER_METABOLIC_DAY = 86400;
// Handling time makes prey below this fraction of predator mass unprofitable
// (build spec 9.5: a 250 g Anomalocaris ignores prey under 0.75 g).
const MIN_PREY_MASS_FRACTION = 0.003;
// Per-generation fraction of the shortfall a predator population makes up when
// in good condition. Predators are environment; this keeps their abundance set
// by carrying capacity instead of letting them ratchet to zero.
const PREDATOR_RECOVERY_RATE = 0.25;
// Escape curve: capture probability decays e-fold per ESCAPE_SCALE_M of warning.
const CAPTURE_BASE = 0.75;
const ESCAPE_SCALE_M = 0.5;
const PI = Math.PI;

export const DEFAULTS = {
  seed: 1,
  arenaM: 120,
  cellM: 4,
  depthMaxM: 40,
  dtS: 30,
  episodeDays: 2,   // must match run.mjs --days default
  generations: 2000,
  epoch: 'visual_arms_race',
  kdOverride: null,
  mutationSigma: 0.15,
  eyeCostMultiplier: 1.0,
  eyeCostExponent: 0.33,
  handlingTimeCoeff: C.HANDLING_TIME_COEFF,
  predationEnabled: true,
  blindFounders: false,
  mutationEnabled: true,
  bearingErrorEnabled: true,
  zooFraction: C.ZOO_FRACTION_OF_FLUX,
  advectionEnabled: true,
  focalK: 100,           // individuals per focal super-individual
  initialDensityFraction: 1.0,   // spec density; 0.5 was a workaround for bugs since fixed
  predK: { anomalocaris: 1, isoxys: 100, chaetognath: 100 },
  maxFocalAgents: 400,
  logEvery: 25,
};

/* ------------------------- perception-derived quantities ------------------------- */

/**
 * Uncertainty in the animal's own depth, in metres.
 *
 * A single undirected receptor cannot separate "deep" from "dusk" — both just look
 * dim — so its depth estimate carries the whole diel ambiguity. Two or more
 * resolved directions let it compare upwelling against downwelling radiance, and
 * that *ratio* is independent of surface brightness, so the error collapses to
 * photon noise. This is the class I -> II payoff and it is derived, not assigned.
 */
const DEPTH_AMBIGUITY_M = 12.0;   // spread of the water column an unresolved eye cannot narrow

export function depthUncertainty(eye, photons, kd, blind) {
  if (blind || photons < 4) return DEPTH_AMBIGUITY_M;   // no usable light signal at all

  // Directionality: the fraction of the eye's signal that can be attributed to a
  // direction rather than pooled. Continuous in `pixels`, zero for a single
  // omnidirectional receptor. Whatever fraction stays undifferentiated still
  // carries the depth/time-of-day confound.
  const directionality = (eye.pixels - 1) / eye.pixels;

  const ambiguityErr = DEPTH_AMBIGUITY_M * (1 - directionality);
  const photonErr = Math.sqrt(2 / Math.max(photons, 1)) / Math.max(kd, 1e-3);
  return Math.max(0.05, Math.hypot(ambiguityErr, photonErr));
}

/** Can the animal tell day from night at all? Needed to use the nocturnal refuge. */
export const knowsTimeOfDay = (photons, blind) => !blind && photons >= 4;

/* --------------------------------- the world --------------------------------- */

export class World {
  constructor(opts = {}) {
    this.cfg = { ...DEFAULTS, ...opts };
    const cfg = this.cfg;
    this.rng = makeRng(cfg.seed);
    this.epoch = C.EPOCHS[cfg.epoch];

    this.kdBase = cfg.kdOverride ?? this.epoch.kdBase;
    this.temperatureC = this.epoch.temperatureC;
    this.light = new LightField({ kdBase: this.kdBase });
    this.resources = new ResourceField({
      sizeM: cfg.arenaM, cellM: cfg.cellM, depthM: cfg.depthMaxM, zooFraction: cfg.zooFraction,
      advectionEnabled: cfg.advectionEnabled,
      productionGCm2Yr: this.epoch.primaryProductionGCm2Yr, rng: this.rng,
    });

    this.arenaArea = cfg.arenaM * cfg.arenaM;
    this.arenaVolume = this.arenaArea * cfg.depthMaxM;
    this.generation = 0;
    this.timeS = 0;
    this.history = [];

    this.initFocal();
    this.initPredators();
  }

  /* ------------------------------- setup ------------------------------- */

  initFocal() {
    const cfg = this.cfg;
    const spec = C.SPECIES.myllokunmingid;
    // Seed at the spec's density and let resource competition find the real
    // equilibrium. This was 50% for a long time as a workaround for two bugs (the
    // gut-fraction error and the non-recovering resource); with those fixed, a
    // sweep of 0.5/1.0/1.5 gives the same evolved eye, so the workaround is gone.
    const individuals = Math.round(spec.densityPerM2 * this.arenaArea * cfg.initialDensityFraction);
    const nAgents = Math.round(individuals / cfg.focalK);
    this.focal = [];
    for (let i = 0; i < nAgents; i++) {
      this.focal.push(this.makeFocal(foundingGenome(this.rng), cfg.focalK));
    }
    this.focalMassG = this.epoch.founderMassG;
  }

  makeFocal(genome, count) {
    const cfg = this.cfg;
    const eye = resolveEye(eyeGenes(genome));
    const massG = this.epoch.founderMassG;
    const smr = C.smrJPerDay(massG, this.temperatureC);
    // reserveMaxJ and gutMaxJ are PER INDIVIDUAL; the agent's pools are
    // per-individual * count. Conflating the two starves every super-individual.
    const reserveMax = C.RESERVE_FRACTION * massG * C.E_SOFT_PELAGIC;
    const gutMax = C.GUT_CAPACITY_FRACTION * massG * C.E_SOFT_PELAGIC;
    return {
      genome, eye, count,
      x: this.rng.range(0, cfg.arenaM),
      y: this.rng.range(0, cfg.arenaM),
      z: this.rng.range(2, cfg.depthMaxM * 0.6),
      massG,
      smrJDay: smr,
      reserveJ: reserveMax * count,
      reserveMaxJ: reserveMax,
      gutJ: gutMax * count * 0.3,
      gutMaxJ: gutMax,
      gutEvacRate: Math.LN2 / (C.gutHalfLifeH(massG, C.SPECIES.myllokunmingid.feedingMode) * 3600),
      surplusJ: 0,
      intakeJ: 0,
      patchRangeM: 0,
      patchRangeStale: 0,
      zooRanges: [0, 0, 0],
      zooRangeStale: 0,
      zooIntakeJ: 0,
      cachedPatch: null,
      patchCacheStale: 0,
      threatCacheStale: 0,
      cachedThreat: null,
      alive: true,
      eyeCostJDay: this.eyeCost(genome, eye, smr),
    };
  }

  initPredators() {
    const cfg = this.cfg;
    this.predators = [];
    if (!cfg.predationEnabled) return;
    for (const name of this.epoch.predators) {
      const spec = C.SPECIES[name];
      const K = cfg.predK[name] ?? 1;
      const individuals = Math.max(1, Math.round(spec.densityPerM2 * this.arenaArea));
      const nAgents = Math.max(1, Math.round(individuals / K));
      for (let i = 0; i < nAgents; i++) this.predators.push(this.makePredator(spec, K));
    }
  }

  makePredator(spec, count) {
    const cfg = this.cfg;
    const smr = C.smrJPerDay(spec.massG, this.temperatureC);
    // Anomalocaris hunts the well-lit column above the benthos; the others are
    // distributed through it. This is what gives prey two different viewing
    // geometries to hide from (see countershading, V22).
    const z = spec.name === 'anomalocaris'
      ? this.rng.range(2, cfg.depthMaxM * 0.4)
      : this.rng.range(2, cfg.depthMaxM * 0.8);
    const reserveMax = C.RESERVE_FRACTION * spec.massG * C.E_SOFT_PELAGIC;
    const gutMax = C.GUT_CAPACITY_FRACTION * spec.massG * C.E_SOFT_PELAGIC;
    return {
      spec, count,
      x: this.rng.range(0, cfg.arenaM),
      y: this.rng.range(0, cfg.arenaM),
      z,
      smrJDay: smr,
      reserveJ: reserveMax * count,
      reserveMaxJ: reserveMax,
      gutJ: gutMax * count * 0.3,
      gutMaxJ: gutMax,
      gutEvacRate: Math.LN2 / (C.gutHalfLifeH(spec.massG) * 3600),
      fastPool: C.FAST_POOL_CAPACITY,
      slowPool: C.SLOW_POOL_CAPACITY,
      lockoutUntilS: -1,
      eye: spec.fixedEye ? this.predatorEye(spec) : null,
      attacks: 0, captures: 0, dietJ: 0, dietItems: [], dietItemsAll: [],
      alive: true,
    };
  }

  /**
   * Build a sensitivity for a fixed-eye predator consistent with its measured
   * interommatidial angle and facet diameter. We reconstruct focal length from
   * f = d / dPhi so the same Land equation applies to predators and prey alike —
   * no special-casing of the perception pipeline.
   */
  predatorEye(spec) {
    const { deltaRho, receptorDiameterUm, fovSr, integrationS } = spec.fixedEye;
    const focal = receptorDiameterUm / deltaRho;
    const apertureUm = spec.name === 'anomalocaris' ? 20000 : 1200;
    const absorbed = 0.5;
    const dOverF = receptorDiameterUm / focal;
    const sensitivity = (PI / 4) ** 2 * apertureUm * apertureUm * dOverF * dOverF * absorbed;
    return { deltaRho, sensitivity, pixels: fovSr / (deltaRho * deltaRho),
             integrationTimeS: integrationS, fovSr };
  }

  /* ------------------------------ eye cost ------------------------------ */

  /**
   * Tissue term plus a superlinear processing term in information rate.
   * Calibrated so a focused high-resolution eye costs ~10% of SMR and a bare
   * patch ~0.1%. The exponent is the load-bearing part (falsifier V10).
   */
  eyeCost(genome, eye, smrJDay) {
    const cfg = this.cfg;
    const tissueMassG = eye.receptorTissueUm3 * 1e-12 * C.TISSUE_DENSITY;
    const tissueTerm = C.EYE_COST_TISSUE_COEFF * tissueMassG;
    const infoTerm = C.EYE_COST_INFO_COEFF
      * Math.pow(Math.max(eye.infoRate, 1e-6), cfg.eyeCostExponent);
    return cfg.eyeCostMultiplier * smrJDay * (tissueTerm + infoTerm);
  }

  /* -------------------------------- run -------------------------------- */

  run(onGeneration) {
    const cfg = this.cfg;
    const stepsPerEpisode = Math.round(cfg.episodeDays * C.SEC_PER_DAY / cfg.dtS);
    for (let g = 0; g < cfg.generations; g++) {
      this.generation = g;
      this.runEpisode(stepsPerEpisode);
      const snap = this.snapshot();
      if (g % cfg.logEvery === 0 || g === cfg.generations - 1) {
        this.history.push(snap);
        if (onGeneration) onGeneration(snap, this);
      }
      if (this.focal.length === 0) break;
      this.reproduce();
    }
    return this;
  }

  /**
   * @param {number} steps
   * @param {(stepIndex:number)=>void} [onStep] optional per-step hook, used by the
   *   viewer to sample agent positions mid-episode. Omitting it leaves behaviour
   *   byte-for-byte unchanged for run.mjs and verify.mjs.
   */
  runEpisode(steps, onStep) {
    const cfg = this.cfg;
    this.episodeStats = {
      capturesByPred: {}, attacksByPred: {}, dietByPred: {},
      attacksFocal: 0, capturesFocal: 0,
      focalDeaths: { starvation: 0, predation: 0, uv: 0, exhaustion: 0 },
      depthByHour: new Array(22).fill(0), depthCountByHour: new Array(22).fill(0),
      capturesByHour: new Array(22).fill(0),
      patchTimeDetected: 0, patchTimeTotal: 0,
    };
    for (const a of this.focal) { a.surplusJ = 0; a.intakeJ = 0; a.zooIntakeJ = 0; }
    this.resources.producedJ = 0; this.resources.consumedJ = 0;

    this.focalHash ??= new SpatialHash(cfg.arenaM, 10);
    this.predHash ??= new SpatialHash(cfg.arenaM, 10);

    for (let s = 0; s < steps; s++) {
      this.timeS += cfg.dtS;
      this.light.setTime(this.timeS);
      this.stepIndex = s;
      this.focalHash.rebuild(this.focal.filter(a => a.alive && a.count > 0));
      this.predHash.rebuild(this.predators.filter(p => p.alive && p.count > 0));
      this.stepFocal(cfg.dtS);
      if (cfg.predationEnabled) this.stepPredators(cfg.dtS);
      this.resources.step(cfg.dtS);
      this.resources.maybeReseed(cfg.dtS);
      if (onStep) onStep(s);
    }
    this.focal = this.focal.filter(a => a.alive && a.count > 0);
    this.predators = this.predators.filter(p => p.alive && p.count > 0);
  }

  /* ----------------------------- focal agents ----------------------------- */

  stepFocal(dt) {
    const cfg = this.cfg;
    const light = this.light;
    const kd = light.kdPar;
    const cBeam = light.cBeam;
    const hour = Math.floor(light.hourOfDay);
    const dtDays = dt / SEC_PER_METABOLIC_DAY;
    const st = this.episodeStats;

    for (const a of this.focal) {
      if (!a.alive) continue;
      const g = a.genome;
      const eye = a.eye;

      /* --- perception ------------------------------------------------- */
      const Lup = light.backgroundRadiance(a.z, 'up');
      const photons = cfg.blindFounders ? 0
        : photonCatch(eye.sensitivity, Lup, g.integrationTimeS);
      const sigmaZ = depthUncertainty(eye, photons, kd, cfg.blindFounders);
      const knowsDay = knowsTimeOfDay(photons, cfg.blindFounders);

      // Active window. An animal that cannot tell day from night cannot time it.
      const isDay = light.isDay;
      const perceivedDay = knowsDay ? isDay : (this.rng.next() < 0.5);
      const wantsActive = this.inActivityWindow(g, light.hourOfDay, knowsDay);

      /* --- depth control (class I / II payoff) ------------------------- */
      const targetZ = perceivedDay ? g.preferredDepthDay : g.preferredDepthNight;
      const perceivedZ = a.z + this.rng.normal() * sigmaZ;
      const dz = (targetZ - perceivedZ) * g.depthGain;
      a.z = Math.min(cfg.depthMaxM, Math.max(0,
        a.z + Math.max(-0.5, Math.min(0.5, dz)) * (dt / 30)));

      /* --- patch finding (class III payoff) ---------------------------- */
      // A food patch is a large, low-contrast feature of the substrate/water.
      // Recomputed periodically: it depends on the eye (constant) and ambient
      // light (slow), so a per-step bisection would dominate runtime.
      if (a.patchRangeStale <= 0) {
        a.patchRangeM = cfg.blindFounders ? 0 : detectionRange(
          0.30, 10.0, eye.deltaRho, cBeam, eye.sensitivity,
          light.backgroundRadiance(a.z, 'down'), g.integrationTimeS, 40);
        a.patchRangeStale = 20;
      }
      a.patchRangeStale--;
      const patchRange = a.patchRangeM;
      let moveX = 0, moveY = 0;
      if (a.patchCacheStale <= 0) {
        a.cachedPatch = patchRange > 0.5 ? this.nearestPatch(a.x, a.y, patchRange) : null;
        a.patchCacheStale = 10;
      }
      a.patchCacheStale--;
      const patch = a.cachedPatch;
      st.patchTimeTotal++;
      if (patch) {
        st.patchTimeDetected++;
        const d = Math.hypot(patch.cx - a.x, patch.cy - a.y) || 1;
        const w = g.wFood * Math.pow(Math.max(patchRange / Math.max(d, 0.5), 0.05),
                                     g.shapeExpFood);
        // Bearing error. Localisation precision is one receptor's acceptance
        // angle, improved by the square root of how many receptors view the
        // target. This is what makes resolution beyond "detected / not detected"
        // worth anything: a coarse eye knows something is there but not where.
        const [bx, by] = this.bearingWithError(patch.cx - a.x, patch.cy - a.y, eye);
        moveX += w * bx;
        moveY += w * by;
      }

      /* --- predator avoidance (class II / IV payoff) -------------------- */
      if (cfg.predationEnabled && !cfg.blindFounders) {
        if (a.threatCacheStale <= 0) {
          a.cachedThreat = this.nearestPredatorSeen(a, eye, g, cBeam);
          a.threatCacheStale = 3;
        }
        a.threatCacheStale--;
        const threat = a.cachedThreat;
        if (threat) {
          const d = Math.max(threat.dist, 0.1);
          const w = -g.wPredator * Math.pow(Math.min(3, 2.0 / d), g.shapeExpPredator);
          const [bx, by] = this.bearingWithError(threat.p.x - a.x, threat.p.y - a.y, eye);
          moveX += w * bx;
          moveY += w * by;
          a.lastThreatRange = threat.dist;
        } else {
          a.lastThreatRange = 0;
        }
      }

      moveX += g.wNoise * this.rng.normal();
      moveY += g.wNoise * this.rng.normal();
      const mag = Math.hypot(moveX, moveY);
      const spec = C.SPECIES.myllokunmingid;
      const speed = wantsActive ? spec.cruiseMs : spec.cruiseMs * 0.2;
      if (mag > 1e-6) {
        a.x = wrap(a.x + (moveX / mag) * speed * dt, cfg.arenaM);
        a.y = wrap(a.y + (moveY / mag) * speed * dt, cfg.arenaM);
      }

      /* --- feeding ------------------------------------------------------ */
      const gutFrac = a.gutJ / (a.gutMaxJ * a.count);
      const feeding = wantsActive && gutFrac < g.satiationThreshold;
      if (feeding) {
        const requiredJPerS = (a.smrJDay * C.FMR_MULT / spec.assimilation)
          / SEC_PER_METABOLIC_DAY;
        const gutRoom = Math.max(0, a.gutMaxJ * a.count - a.gutJ);
        const avail = this.resources.availableAt(a.x, a.y, a.z);
        // Never remove more from the field than the animal can actually swallow.
        const want = Math.min(requiredJPerS * 2.5 * dt * a.count, gutRoom, avail * 0.05);
        if (want > 0) {
          const got = this.resources.consume(a.x, a.y, want);
          a.gutJ += got;
          a.intakeJ += got;
        }
      }
      /* --- visual particulate feeding (the class IV foraging task) ------- */
      // Discrete zooplankton must be seen individually to be taken. Encounter is
      // a swept-volume kernel using the detection range the optics give for that
      // particle size; intake saturates by handling time (Holling type II).
      // A blind animal simply gets none of this and lives on the field alone.
      if (feeding && !cfg.blindFounders && this.resources.zooEnabled) {
        if (a.zooRangeStale <= 0) {
          const bg = light.backgroundRadiance(a.z, 'horizontal');
          a.zooRanges = C.ZOO_SIZE_CLASSES.map(zc => detectionRange(
            C.ZOO_CONTRAST, zc.sizeM, eye.deltaRho, cBeam, eye.sensitivity,
            bg, g.integrationTimeS, 8));
          a.zooRangeStale = 20;
        }
        a.zooRangeStale--;
        const vRel = spec.cruiseMs;
        let denom = 1, encounters = [];
        for (let c = 0; c < C.ZOO_SIZE_CLASSES.length; c++) {
          const r = a.zooRanges[c];
          const kernel = Math.PI * r * r * vRel;                  // m^3 per second
          const density = this.resources.zooDensityAt(a.x, a.y, a.z, c);
          const enc = kernel * density;                            // per second
          encounters.push(enc);
          denom += enc * C.ZOO_SIZE_CLASSES[c].handlingS;
        }
        const gutRoomZoo = Math.max(0, a.gutMaxJ * a.count - a.gutJ);
        let zooEnergy = 0;
        for (let c = 0; c < encounters.length && gutRoomZoo > 0; c++) {
          const zc = C.ZOO_SIZE_CLASSES[c];
          const wanted = (encounters[c] / denom) * dt * a.count;
          if (wanted <= 0) continue;
          const affordable = Math.min(wanted, (gutRoomZoo - zooEnergy) / zc.energyJ);
          if (affordable <= 0) continue;
          const taken = this.resources.consumeZoo(a.x, a.y, c, affordable);
          zooEnergy += taken * zc.energyJ;
        }
        if (zooEnergy > 0) { a.gutJ += zooEnergy; a.intakeJ += zooEnergy; a.zooIntakeJ += zooEnergy; }
      }

      // Carrion is findable without eyes; it is part of the baseline vision must beat.
      if (g.wCarrion > 0.5 && gutFrac < g.satiationThreshold) {
        const room = Math.max(0, a.gutMaxJ * a.count - a.gutJ);
        const got = this.resources.consumeCarrion(a.x, a.y,
          Math.min(room, 0.02 * a.gutMaxJ * a.count));
        a.gutJ += got; a.intakeJ += got;
      }

      /* --- digestion and metabolism ------------------------------------- */
      const digested = a.gutJ * (1 - Math.exp(-a.gutEvacRate * dt));
      a.gutJ -= digested;
      const assimilated = digested * spec.assimilation * (1 - C.SDA_FRACTION);

      const activityMult = wantsActive ? C.CRUISE_COST_MULT : 1.0;
      const costJ = (a.smrJDay * activityMult + a.eyeCostJDay) * dtDays * a.count;
      const net = assimilated - costJ;
      a.reserveJ += net;
      a.surplusJ += net;
      const reserveCap = a.reserveMaxJ * a.count;
      if (a.reserveJ > reserveCap) a.reserveJ = reserveCap;

      /* --- hazards ------------------------------------------------------- */
      // Starvation is a graded hazard, not a cliff: condition declines, then
      // mortality rises with the square of how far below the impairment
      // threshold the reserve has fallen. A hard cliff makes the whole
      // population die in lockstep and produces boom-bust oscillation that has
      // nothing to do with the biology.
      if (a.reserveJ < 0) a.reserveJ = 0;
      const reserveFrac = a.reserveJ / (a.reserveMaxJ * a.count + 1e-9);
      if (reserveFrac < C.IMPAIRMENT_THRESHOLD) {
        const severity = 1 - reserveFrac / C.IMPAIRMENT_THRESHOLD;
        const hazard = (severity * severity) / C.STARVATION_COLLAPSE_DAYS;
        const killed = this.rng.binomial(a.count, Math.min(0.5, hazard * dtDays));
        if (killed > 0) {
          a.count -= killed;
          st.focalDeaths.starvation += killed;
          this.resources.addCarrion(a.x, a.y, killed * a.massG * C.E_CARRION);
          if (a.count <= 0) { a.alive = false; continue; }
        }
      }

      // UV, from *actual* depth. A bad depth estimate means real exposure.
      const uvHaz = C.UV_SURFACE_HAZARD_PER_DAY * light.uvRelativeAt(a.z)
        * (1 - C.UV_PIGMENT_PROTECTION * g.screeningPigment)
        * (light.isDay ? 1 : 0);
      const uvDead = this.rng.binomial(a.count, Math.min(0.5, uvHaz * dtDays));
      if (uvDead > 0) {
        a.count -= uvDead; st.focalDeaths.uv += uvDead;
        this.resources.addCarrion(a.x, a.y, uvDead * a.massG * C.E_CARRION);
        if (a.count <= 0) { a.alive = false; continue; }
      }

      st.depthByHour[hour] += a.z * a.count;
      st.depthCountByHour[hour] += a.count;
    }
  }

  inActivityWindow(g, hour, knowsDay) {
    if (!knowsDay) return true;              // cannot time anything: always on
    const start = g.activityStartH;
    const end = start + g.activityLengthH;
    const h = hour;
    return (h >= start && h <= end) || (end > C.DAY_LENGTH_H && h <= end - C.DAY_LENGTH_H);
  }

  /**
   * Unit vector toward (dx, dy), rotated by the eye's bearing error.
   * sigma = deltaRho / sqrt(pixels): a single wide receptor gives a direction no
   * better than its own acceptance angle; more resolved directions sharpen it.
   */
  bearingWithError(dx, dy, eye) {
    if (!this.cfg.bearingErrorEnabled) {
      const m = Math.hypot(dx, dy) || 1;
      return [dx / m, dy / m];
    }
    const sigma = eye.deltaRho / Math.sqrt(Math.max(eye.pixels, 1));
    const theta = Math.atan2(dy, dx) + this.rng.normal() * sigma;
    return [Math.cos(theta), Math.sin(theta)];
  }

  nearestPatch(x, y, range) {
    let best = null, bestD = range;
    for (const p of this.resources.patches) {
      const d = Math.hypot(p.cx - x, p.cy - y) - p.radius;
      if (d < bestD) { bestD = d; best = p; }
    }
    return best;
  }

  /** The nearest predator this prey can actually see, using the Rose criterion. */
  nearestPredatorSeen(a, eye, g, cBeam) {
    const light = this.light;
    let best = null, bestD = Infinity;
    this.predHash.forEachNear(a.x, a.y, 12, (p) => {
      if (!p.alive) return;
      const d = Math.hypot(p.x - a.x, p.y - a.y);
      if (d > 12 || d >= bestD) return;
      // Geometry: a predator above is silhouetted against the surface (easy);
      // one below is seen against the dark seafloor (hard).
      const dir = p.z < a.z ? 'up' : 'down';
      const rho = dir === 'up' ? 0.35 : 0.35;      // predator body radiance
      const cInh = inherentContrast(rho, dir);
      const size = p.spec.bodyLengthMm / 1000;
      const bg = light.backgroundRadiance(a.z, dir);
      const photons = photonCatch(eye.sensitivity, bg, g.integrationTimeS);
      const cEff = effectiveContrast(cInh, Math.max(d, 0.05), size, eye.deltaRho, cBeam);
      if (detects(cEff, photons)) { best = p; bestD = d; }
    });
    return best ? { p: best, dist: bestD } : null;
  }

  /* ------------------------------- predators ------------------------------- */

  stepPredators(dt) {
    const cfg = this.cfg;
    const light = this.light;
    const cBeam = light.cBeam;
    const dtDays = dt / SEC_PER_METABOLIC_DAY;
    const st = this.episodeStats;
    const aerobicScope = Math.min(1, Math.max(0.15, this.currentPO2() / 0.30));

    for (const p of this.predators) {
      if (!p.alive) continue;
      const spec = p.spec;

      // Burst pools recover exponentially. With tau in tens of minutes there is
      // no way to grind out free bursts by resting for a second.
      p.slowPool += (C.SLOW_POOL_CAPACITY * aerobicScope - p.slowPool) * (dt / C.SLOW_POOL_TAU_S);
      p.fastPool += (C.FAST_POOL_CAPACITY - p.fastPool) * (dt / C.FAST_POOL_TAU_S)
        * Math.max(0, p.slowPool / C.SLOW_POOL_CAPACITY);

      // Move: drift with a bias toward prey-dense cells.
      p.x = wrap(p.x + (this.rng.next() - 0.5) * spec.cruiseMs * dt * 2, cfg.arenaM);
      p.y = wrap(p.y + (this.rng.next() - 0.5) * spec.cruiseMs * dt * 2, cfg.arenaM);

      const gutFrac = p.gutJ / (p.gutMaxJ * p.count);
      const canAttack = this.timeS > p.lockoutUntilS && p.fastPool >= 1 && gutFrac < 0.9;

      if (canAttack) {
        const target = this.findPrey(p, cBeam);
        if (target) {
          // Focal agents carry massG directly; a smaller predator species carries
          // it on its spec.
          const tgtMass = target.agent.massG ?? target.agent.spec.massG;

          // Digestive capacity throttles how many individuals in this
          // super-individual actually STRIKE, not how many of their strikes
          // succeed. Truncating the catch instead made satiated predators look
          // like they were missing, so capture success measured the gut rather
          // than the chase — and, before that, let one strike kill dozens of prey
          // and waste all but a gut-full, which drove the focal species extinct.
          const perPreyJ = tgtMass * C.E_SOFT_PELAGIC * spec.assimilation;
          const gutRoomJ = Math.max(0, p.gutMaxJ * p.count - p.gutJ);
          const attackers = Math.min(p.count,
            Math.floor(gutRoomJ / Math.max(perPreyJ, 1e-9)));
          if (attackers <= 0) { p.lockoutUntilS = this.timeS + 60; continue; }

          if (target.agent.genome) st.attacksFocal += attackers;
          p.attacks += attackers;
          st.attacksByPred[spec.name] = (st.attacksByPred[spec.name] || 0) + attackers;
          const pCapture = this.captureProbability(p, target, cBeam);
          const caught = this.rng.binomial(attackers, pCapture);
          if (caught > 0) {
            const taken = Math.min(target.agent.count, caught);
            target.agent.count -= taken;
            if (target.agent.genome) { st.focalDeaths.predation += taken; st.capturesFocal += taken; }
            st.capturesByHour[Math.floor(light.hourOfDay)] += taken;
            const energy = taken * tgtMass * C.E_SOFT_PELAGIC * spec.assimilation;
            p.gutJ = Math.min(p.gutMaxJ * p.count, p.gutJ + energy);
            p.captures += taken;
            p.dietJ += energy;
            p.dietItems.push(tgtMass);
            p.dietItemsAll.push(tgtMass);
            st.capturesByPred[spec.name] = (st.capturesByPred[spec.name] || 0) + taken;
            st.dietByPred[spec.name] = (st.dietByPred[spec.name] || 0) + energy;
            if (target.agent.count <= 0) target.agent.alive = false;
          }
          p.fastPool -= 1; p.slowPool -= 1;
          const handling = cfg.handlingTimeCoeff *
            Math.pow(tgtMass / spec.massG, C.HANDLING_TIME_EXPONENT);
          p.lockoutUntilS = this.timeS + handling + C.POST_CAPTURE_LOCKOUT_S;
          p.reserveJ -= C.BURST_COST_MULT * p.smrJDay * (spec.burstDurationS / SEC_PER_METABOLIC_DAY) * p.count;
        }
      }

      // Most of a predator's ration comes from prey outside the modelled focal
      // population. Without this subsidy the predators must over-harvest the focal
      // species or starve, and neither matches the Cambrian food web.
      // The subsidy must arrive as FOOD, into the gut, not as free reserve energy.
      // Routing it straight to reserves left the predator permanently unhungry yet
      // never satiated, so nothing throttled its kill rate: Isoxys was killing ~35x
      // more focal prey than it needed and wiping the population out in one episode.
      const requiredJ = p.smrJDay * C.FMR_MULT * dtDays * p.count;
      const gutRoom = Math.max(0, p.gutMaxJ * p.count - p.gutJ);
      p.gutJ += Math.min(gutRoom, C.ALTERNATIVE_PREY_FRACTION * requiredJ / p.spec.assimilation);

      const digested = p.gutJ * (1 - Math.exp(-p.gutEvacRate * dt));
      p.gutJ -= digested;
      p.reserveJ += digested * (1 - C.SDA_FRACTION)
        - p.smrJDay * C.CRUISE_COST_MULT * dtDays * p.count;
      const cap = p.reserveMaxJ * p.count;
      if (p.reserveJ > cap) p.reserveJ = cap;

      if (p.reserveJ <= 0) {
        const killed = Math.max(1, Math.ceil(p.count * 0.2));
        p.count -= killed;
        p.reserveJ = Math.max(0, p.count) * p.reserveMaxJ * 0.2;
        if (p.count <= 0) p.alive = false;
      }
    }
  }

  /** Predator's search: what it can see, using the same Rose criterion as prey. */
  findPrey(p, cBeam) {
    const light = this.light;
    const eye = p.eye;
    let best = null, bestD = Infinity;
    const searchRadius = eye ? 8 : C.MECHANO_RANGE_BL * p.spec.bodyLengthMm / 1000;

    // A large predator also hunts the smaller PREDATOR species. Isoxys is both a
    // visual mesopredator and Anomalocaris prey — the spec calls that three-level
    // structure the engine of the arms race, and modelling Isoxys as predator-only
    // left Anomalocaris hunting a 0.2 g focal animal at a 1250:1 mass ratio, far
    // outside the 20:1-330:1 the energy ledger predicts.
    this.predHash.forEachNear(p.x, p.y, searchRadius, (q) => {
      if (q === p || !q.alive || q.count <= 0) return;
      if (q.spec.massG > p.spec.massG * C.maxPreyFraction(p.spec.name)) return;
      if (q.spec.massG < p.spec.massG * MIN_PREY_MASS_FRACTION) return;
      const d = Math.hypot(q.x - p.x, q.y - p.y);
      if (d > searchRadius || d >= bestD) return;
      if (!eye) { best = q; bestD = d; return; }
      const lookingDown = p.z < q.z;
      const dir = lookingDown ? 'down' : 'up';
      const cInh = inherentContrast(0.35, dir);
      const bg = light.backgroundRadiance(p.z, dir);
      const photons = photonCatch(eye.sensitivity, bg, eye.integrationTimeS);
      const cEff = effectiveContrast(cInh, Math.max(d, 0.05),
        q.spec.bodyLengthMm / 1000, eye.deltaRho, cBeam);
      if (detects(cEff, photons)) { best = q; bestD = d; }
    });

    this.focalHash.forEachNear(p.x, p.y, searchRadius, (a) => {
      if (!a.alive || a.count <= 0) return;
      const d = Math.hypot(a.x - p.x, a.y - p.y);
      if (d > searchRadius || d >= bestD) return;
      if (a.massG > p.spec.massG * C.maxPreyFraction(p.spec.name)) return;
      // Same profitability floor as the predator-on-predator path above. Applying
      // it to only one of the two made a 250 g Anomalocaris hunt 0.2 g prey at a
      // 1184:1 mass ratio while ignoring the 1 g Isoxys it should prefer.
      if (a.massG < p.spec.massG * MIN_PREY_MASS_FRACTION) return;
      if (!eye) {                                    // blind predator: contact only
        best = a; bestD = d;
        return;
      }
      // Which face of the prey the predator sees, and against what background.
      const lookingDown = p.z < a.z;
      const dir = lookingDown ? 'down' : 'up';
      const rho = lookingDown ? a.genome.rhoBodyDorsal : a.genome.rhoBodyVentral;
      const cInh = inherentContrast(rho, dir);
      const bg = light.backgroundRadiance(p.z, dir);
      const photons = photonCatch(eye.sensitivity, bg, eye.integrationTimeS);
      const size = a.massG > 0 ? C.SPECIES.myllokunmingid.bodyLengthMm / 1000 : 0.02;
      const cEff = effectiveContrast(cInh, Math.max(d, 0.05), size, eye.deltaRho, cBeam);
      if (detects(cEff, photons)) { best = a; bestD = d; }
    });
    return best ? { agent: best, dist: bestD } : null;
  }

  /**
   * Capture probability. Base rate is high; warning from the prey's own senses is
   * what erodes it. Prey vision therefore pays through this term, and only here.
   */
  captureProbability(p, target, cBeam) {
    const a = target.agent;
    // A non-focal victim (a smaller predator species) has no evolved eye, so it
    // gets the mechanosensory warning only — but that warning is still DERIVED
    // from its body size through the same escape curve, not asserted. A bare
    // constant here silently became the dominant term in the measured capture
    // rate once Anomalocaris switched to eating Isoxys.
    if (!a.genome) {
      const warn = C.MECHANO_RANGE_BL * a.spec.bodyLengthMm / 1000;
      return Math.max(0.01, CAPTURE_BASE * Math.exp(-warn / ESCAPE_SCALE_M));
    }
    const spec = C.SPECIES.myllokunmingid;
    const mechanoWarning = C.MECHANO_RANGE_BL * spec.bodyLengthMm / 1000;   // ~0.05 m
    let warning = mechanoWarning;

    if (!this.cfg.blindFounders) {
      const dir = p.z < a.z ? 'up' : 'down';
      const cInh = inherentContrast(0.35, dir);
      const bg = this.light.backgroundRadiance(a.z, dir);
      const r = detectionRange(cInh, p.spec.bodyLengthMm / 1000, a.eye.deltaRho, cBeam,
        a.eye.sensitivity, bg, a.genome.integrationTimeS, 15);
      // Latency eats into the warning: a slow eye sees it and reacts too late.
      const closing = p.spec.burstMs + spec.cruiseMs;
      const latency = Math.min(a.genome.integrationTimeS, 2.0) + C.MECHANO_LATENCY_S;
      warning = Math.max(warning, r - closing * latency);
    }

    const impair = Math.max(0.3, Math.min(1, a.reserveJ / (a.reserveMaxJ * a.count + 1e-9)
      / C.IMPAIRMENT_THRESHOLD));
    return Math.max(0.01, CAPTURE_BASE * Math.exp(-Math.max(0, warning) / ESCAPE_SCALE_M) * impair);
  }

  currentPO2() {
    const t = this.cfg.generations > 1 ? this.generation / (this.cfg.generations - 1) : 0;
    return this.epoch.pO2Start + t * (this.epoch.pO2End - this.epoch.pO2Start);
  }

  /* ----------------------------- reproduction ----------------------------- */

  reproduce() {
    const cfg = this.cfg;
    const spec = C.SPECIES.myllokunmingid;
    const next = [];
    let totalIndividuals = 0;

    for (const a of this.focal) {
      if (!a.alive || a.count <= 0) continue;
      const g = a.genome;
      const reserveFrac = a.reserveJ / (a.reserveMaxJ * a.count + 1e-9);
      let recruits = 0;
      if (reserveFrac >= g.spawnEnergyThreshold && a.surplusJ > 0) {
        // Egg size / number trade-off: the curve is SET, where you sit on it is EVOLVED.
        const eggDiameterMm = 0.35 * Math.cbrt(400 / Math.max(g.clutchSize, 1));
        const juvSurvival = Math.min(0.5, 0.005 * Math.pow(eggDiameterMm / 0.35, 0.6));
        const energyPerEgg = 0.25 * Math.pow(eggDiameterMm / 0.35, 3);
        const invested = spec.clutchEnergyFraction * a.surplusJ;
        // Recruits are capped per individual: an animal cannot turn an
        // exceptional foraging episode into unbounded offspring.
        recruits = Math.min((invested / energyPerEgg) * juvSurvival, a.count * 1.5);
        a.reserveJ -= invested;
      }
      const survivors = Math.max(0, a.count);
      const offspring = this.rng.poisson(Math.max(0, recruits));
      next.push({ parent: a, survivors, offspring });
      totalIndividuals += survivors + offspring;
    }

    // Resource competition already regulates, but keep a hard ceiling so a runaway
    // generation cannot blow up memory.
    const ceiling = Math.round(spec.densityPerM2 * this.arenaArea * 1.5);
    const scale = totalIndividuals > ceiling ? ceiling / totalIndividuals : 1;

    const agents = [];
    for (const { parent, survivors, offspring } of next) {
      const s = Math.round(survivors * scale);
      const o = Math.round(offspring * scale);
      if (s > 0) {
        parent.count = s;
        parent.gutJ = 0; parent.surplusJ = 0;
        parent.reserveJ = Math.min(parent.reserveJ, parent.reserveMaxJ * s);
        if (parent.reserveJ <= 0) parent.reserveJ = parent.reserveMaxJ * s * 0.5;
        agents.push(parent);
      }
      let remaining = o;
      while (remaining > 0) {
        const n = Math.min(remaining, cfg.focalK);
        const genome = cfg.mutationEnabled
          ? mutate(parent.genome, this.rng, cfg.mutationSigma) : parent.genome;
        agents.push(this.makeFocal(genome, n));
        remaining -= n;
      }
    }
    this.focal = this.resample(agents, cfg.maxFocalAgents);

    // Predators are ENVIRONMENT, not the species under study, so their abundance
    // should be set by the shelf's carrying capacity. Previously they could only
    // ever decline (count was merely floored at 1), so once Anomalocaris began
    // taking Isoxys it ate the whole mesopredator population to extinction and
    // predation on the focal species stopped altogether.
    //
    // They now relax toward their spec density at a rate set by their own
    // condition, and a species wiped out locally recolonises from the surrounding
    // shelf — which for an open, well-connected Cambrian shelf is the realistic
    // boundary condition.
    if (cfg.predationEnabled) {
      for (const p of this.predators) {
        p.attacks = 0; p.captures = 0; p.dietJ = 0; p.dietItems = [];
      }
      for (const name of this.epoch.predators) {
        const spec = C.SPECIES[name];
        const target = Math.max(1, Math.round(spec.densityPerM2 * this.arenaArea));
        const members = this.predators.filter(p => p.spec.name === name && p.count > 0);
        const current = members.reduce((s, p) => s + p.count, 0);
        if (current >= target) continue;

        if (!members.length) {                       // recolonisation
          const K = cfg.predK[name] ?? 1;
          const seed = this.makePredator(spec, Math.max(1, Math.round(target * 0.1)));
          this.predators.push(seed);
          continue;
        }
        // Growth scales with mean body condition: well-fed predators recruit.
        const condition = members.reduce(
          (s, p) => s + p.reserveJ / (p.reserveMaxJ * p.count + 1e-9), 0) / members.length;
        const grow = Math.round((target - current)
          * PREDATOR_RECOVERY_RATE * Math.max(0, Math.min(1, condition)));
        if (grow <= 0) continue;
        const per = grow / members.length;
        for (const p of members) p.count = Math.round(p.count + per);
      }
      this.predators = this.predators.filter(p => p.count > 0);
      if (this.predators.length === 0) this.initPredators();
    }
  }

  /**
   * Keep the agent list bounded without biasing the gene pool: sample `limit`
   * agents with probability proportional to how many individuals they represent,
   * then rescale counts so total population is preserved exactly.
   */
  resample(agents, limit) {
    if (agents.length <= limit) return agents;
    const total = agents.reduce((s, a) => s + a.count, 0);
    const cumulative = [];
    let acc = 0;
    for (const a of agents) { acc += a.count; cumulative.push(acc); }

    const chosen = [];
    const stride = total / limit;
    let u = this.rng.next() * stride;      // systematic resampling: low variance
    let i = 0;
    for (let k = 0; k < limit; k++) {
      const target = u + k * stride;
      while (i < cumulative.length - 1 && cumulative[i] < target) i++;
      chosen.push(agents[i]);
    }
    const merged = new Map();
    for (const a of chosen) {
      const existing = merged.get(a);
      if (existing) existing.weight++;
      else merged.set(a, { agent: a, weight: 1 });
    }
    const out = [];
    const perSlot = total / limit;
    for (const { agent, weight } of merged.values()) {
      agent.count = Math.max(1, Math.round(perSlot * weight));
      agent.reserveJ = Math.min(agent.reserveJ, agent.reserveMaxJ * agent.count);
      if (agent.reserveJ <= 0) agent.reserveJ = agent.reserveMaxJ * agent.count * 0.5;
      agent.gutJ = Math.min(agent.gutJ, agent.gutMaxJ * agent.count);
      out.push(agent);
    }
    return out;
  }

  /* ------------------------------- reporting ------------------------------- */

  snapshot() {
    const st = this.episodeStats;
    const agents = this.focal.filter(a => a.count > 0);
    const weights = agents.map(a => a.count);
    const totalN = weights.reduce((s, x) => s + x, 0);

    const geneStats = {};
    for (const key of ['patchWidthMm', 'invagination', 'apertureRatio', 'lensIndexGradient',
      'membraneLayers', 'screeningPigment', 'receptorCount', 'integrationTimeS',
      'preferredDepthDay', 'preferredDepthNight', 'rhoBodyDorsal', 'rhoBodyVentral',
      'clutchSize', 'wPredator', 'wFood', 'activityStartH', 'activityLengthH']) {
      geneStats[key] = weightedMedian(agents.map(a => a.genome[key]), weights);
    }
    const deltaRho = weightedMedian(agents.map(a => a.eye.deltaRho), weights);
    const pixels = weightedMedian(agents.map(a => a.eye.pixels), weights);
    const eyeP = weightedMedian(agents.map(a => eyeParameter(a.genome, a.eye)), weights);
    const cls = weightedMedian(agents.map(a => nilssonClass(a.eye)), weights);

    const depthDay = [], depthNight = [];
    for (let h = 0; h < 21; h++) {
      if (!st.depthCountByHour[h]) continue;
      const mean = st.depthByHour[h] / st.depthCountByHour[h];
      (h >= 5.25 && h <= 15.75 ? depthDay : depthNight).push(mean);
    }
    const nightCaptures = st.capturesByHour.reduce(
      (s, v, h) => s + ((h < 5 || h > 16) ? v : 0), 0);
    const totalCaptures = st.capturesByHour.reduce((s, v) => s + v, 0);

    const attacks = Object.values(st.attacksByPred).reduce((s, x) => s + x, 0);
    const captures = Object.values(st.capturesByPred).reduce((s, x) => s + x, 0);

    return {
      generation: this.generation,
      nAgents: agents.length,
      nIndividuals: totalN,
      deltaRhoDeg: deltaRho * 180 / PI,
      pixels, eyeParameter: eyeP, nilssonClass: cls,
      genes: geneStats,
      deaths: { ...st.focalDeaths },
      attacks, captures,
      // Capture success ON THE FOCAL SPECIES. The all-victim figure is dominated
      // by Anomalocaris taking Isoxys and says nothing about prey vision.
      captureSuccess: st.attacksFocal > 0 ? st.capturesFocal / st.attacksFocal : null,
      captureSuccessAllPrey: attacks > 0 ? captures / attacks : null,
      nightCaptureFraction: totalCaptures > 0 ? nightCaptures / totalCaptures : null,
      meanDepthDay: mean(depthDay), meanDepthNight: mean(depthNight),
      patchDetectFraction: st.patchTimeTotal ? st.patchTimeDetected / st.patchTimeTotal : 0,
      predators: this.predators.reduce((acc, p) => {
        acc[p.spec.name] = (acc[p.spec.name] || 0) + p.count; return acc;
      }, {}),
      phytoTotal: this.resources.totalPhyto(),
      phytoFracOfCapacity: this.resources.totalPhyto() /
        (this.resources.capacityPerCell * this.resources.n * this.resources.n),
      // Fraction of the focal guild's own allocation that is eaten. At a
      // resource-limited equilibrium this is 1.0 by definition — the population
      // grazes down to R*, its break-even resource density.
      grazingFractionOfAllocation: this.resources.producedJ > 0
        ? this.resources.consumedJ / this.resources.producedJ : null,
      // The ecologically comparable number: share of TOTAL primary production.
      grazingFractionOfPP: this.resources.producedJ > 0
        ? (this.resources.consumedJ / this.resources.producedJ)
          * (this.resources.fieldFlux / this.resources.dailyEnergyJPerM2) : null,
      zooTotal: this.resources.totalZooEnergy(),
      zooIntakeFraction: (() => {
        let zi = 0, ti = 0;
        for (const a of agents) { zi += a.zooIntakeJ || 0; ti += a.intakeJ || 0; }
        return ti > 0 ? zi / ti : null;
      })(),
      pO2: this.currentPO2(),
    };
  }
}

/* -------------------------------- utilities -------------------------------- */

const wrap = (v, size) => ((v % size) + size) % size;
const mean = a => (a.length ? a.reduce((s, x) => s + x, 0) / a.length : null);

function weightedMedian(values, weights) {
  if (!values.length) return null;
  const pairs = values.map((v, i) => [v, weights[i]]).sort((p, q) => p[0] - q[0]);
  const total = pairs.reduce((s, p) => s + p[1], 0);
  let acc = 0;
  for (const [v, w] of pairs) { acc += w; if (acc >= total / 2) return v; }
  return pairs[pairs.length - 1][0];
}
