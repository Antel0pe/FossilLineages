/**
 * Runs the REAL simulation core in a worker and streams snapshots to the viewer.
 *
 * This imports core/world.mjs directly rather than reimplementing anything, so the
 * page can never drift from what run.mjs and verify.mjs actually execute.
 */
import { World } from './core/world.mjs';
import { resolveEye, nilssonClass } from './core/optics.mjs';
import { eyeGenes } from './core/genome.mjs';
import * as C from './core/constants.mjs';

let world = null;
let running = false;
let generation = 0;
let targetGenerations = 400;
// Steps between position samples during an episode. 0 disables the live arena view.
let liveEvery = 0;

/** Median of a weighted sample, matching how world.snapshot() summarises genes. */
function weightedMedian(values, weights) {
  if (!values.length) return null;
  const pairs = values.map((v, i) => [v, weights[i]]).sort((a, b) => a[0] - b[0]);
  const total = pairs.reduce((s, p) => s + p[1], 0);
  let acc = 0;
  for (const [v, w] of pairs) { acc += w; if (acc >= total / 2) return v; }
  return pairs[pairs.length - 1][0];
}

/** The median genome, so the viewer can draw a representative eye. */
function medianGenome(w) {
  const agents = w.focal.filter(a => a.count > 0);
  if (!agents.length) return null;
  const weights = agents.map(a => a.count);
  const keys = ['patchWidthMm', 'invagination', 'apertureRatio', 'lensIndexGradient',
    'membraneLayers', 'screeningPigment', 'receptorCount', 'receptorDiameterUm',
    'integrationTimeS', 'fieldOfViewSr', 'rhoBodyDorsal', 'rhoBodyVentral',
    'preferredDepthDay', 'preferredDepthNight'];
  const g = {};
  for (const k of keys) g[k] = weightedMedian(agents.map(a => a.genome[k]), weights);
  return g;
}

/**
 * Generations to run per macrotask. Yielding after every generation leaves the
 * loop at the mercy of timer throttling when the page is hidden — browsers clamp
 * setTimeout hard in backgrounded tabs, which dropped throughput by ~10x. Doing a
 * few generations per yield keeps pause responsive without paying that every time.
 */
const GENS_PER_YIELD = 4;

function step() {
  if (!running || !world) return;
  const stepsPerEpisode = Math.round(world.cfg.episodeDays * C.SEC_PER_DAY / world.cfg.dtS);

  for (let i = 0; i < GENS_PER_YIELD; i++) {
    if (!running || !world) return;
    if (i > 0) {
      if (world.focal.length === 0 || generation >= targetGenerations) break;
      world.reproduce();
    }
    if (!runOneGeneration(stepsPerEpisode)) return;
  }
  setTimeout(step, 0);
}

const SPECIES_ID = { anomalocaris: 0, isoxys: 1, chaetognath: 2 };

/**
 * Pack current agent positions into transferable arrays.
 * Prey: [x, y, z, count] per agent. Predators: [x, y, z, count, speciesId].
 */
function packPositions() {
  const focal = world.focal.filter(a => a.alive && a.count > 0);
  const preds = world.predators.filter(p => p.alive && p.count > 0);
  const prey = new Float32Array(focal.length * 4);
  for (let i = 0; i < focal.length; i++) {
    const a = focal[i];
    prey[i * 4] = a.x; prey[i * 4 + 1] = a.y; prey[i * 4 + 2] = a.z; prey[i * 4 + 3] = a.count;
  }
  const pred = new Float32Array(preds.length * 5);
  for (let i = 0; i < preds.length; i++) {
    const p = preds[i];
    pred[i * 5] = p.x; pred[i * 5 + 1] = p.y; pred[i * 5 + 2] = p.z;
    pred[i * 5 + 3] = p.count; pred[i * 5 + 4] = SPECIES_ID[p.spec.name] ?? 3;
  }
  return { prey, pred };
}

/** Returns false when the run has ended (extinct or complete). */
function runOneGeneration(stepsPerEpisode) {
  world.generation = generation;

  const onStep = liveEvery > 0 ? (s) => {
    if (s % liveEvery !== 0) return;
    const { prey, pred } = packPositions();
    self.postMessage({
      type: 'positions', prey, pred,
      arenaM: world.cfg.arenaM, depthM: world.cfg.depthMaxM,
      hourOfDay: world.light.hourOfDay, isDay: world.light.isDay,
      generation,
    }, [prey.buffer, pred.buffer]);
  } : undefined;

  world.runEpisode(stepsPerEpisode, onStep);
  const snap = world.snapshot();
  const genome = medianGenome(world);

  let eye = null;
  if (genome) {
    const e = resolveEye(eyeGenes(genome));
    eye = {
      deltaRho: e.deltaRho, pixels: e.pixels, sensitivity: e.sensitivity,
      lensQuality: e.lensQuality, apertureUm: e.apertureUm, focalUm: e.focalUm,
      nilssonClass: nilssonClass(e),
    };
  }

  self.postMessage({ type: 'gen', snap, genome, eye, generation });

  const extinct = world.focal.length === 0;
  generation++;
  if (extinct || generation >= targetGenerations) {
    running = false;
    self.postMessage({ type: 'done', reason: extinct ? 'extinct' : 'complete', generation });
    return false;
  }
  return true;
}

self.onmessage = (ev) => {
  const m = ev.data;
  if (m.type === 'start') {
    world = new World(m.config);
    generation = 0;
    targetGenerations = m.config.generations ?? 400;
    liveEvery = m.liveEvery ?? 0;
    running = true;
    self.postMessage({ type: 'started', config: m.config,
      initialPopulation: world.focal.reduce((s, a) => s + a.count, 0) });

    step();
  } else if (m.type === 'pause') {
    running = false;
  } else if (m.type === 'resume') {
    if (world && !running) { running = true; step(); }
  } else if (m.type === 'live') {
    liveEvery = m.every | 0;
  } else if (m.type === 'stop') {
    running = false; world = null; generation = 0;
  }
};
