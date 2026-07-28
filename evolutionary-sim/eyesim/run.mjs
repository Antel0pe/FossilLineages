/**
 * Headless runner.
 *
 *   bun evolutionary-sim/eyesim/run.mjs --generations 1500 --epoch visual_arms_race
 *   bun evolutionary-sim/eyesim/run.mjs --sweep kd --seeds 3
 *
 * Writes a CSV trace and a JSON summary per run into eyesim/logs/ and prints a
 * one-line-per-generation table so a run is readable while it happens.
 */
import { World, DEFAULTS } from './core/world.mjs';
import * as C from './core/constants.mjs';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = fileURLToPath(new URL('.', import.meta.url));
const LOGS = join(HERE, 'logs');
mkdirSync(LOGS, { recursive: true });

const argv = process.argv.slice(2);
const arg = (k, d) => { const i = argv.indexOf('--' + k); return i >= 0 ? argv[i + 1] : d; };
const num = (k, d) => { const v = arg(k, null); return v === null ? d : Number(v); };
const has = k => argv.includes('--' + k);

const TRACE_COLUMNS = [
  'generation', 'nAgents', 'nIndividuals', 'deltaRhoDeg', 'pixels', 'eyeParameter',
  'nilssonClass', 'attacks', 'captures', 'captureSuccess', 'nightCaptureFraction',
  'meanDepthDay', 'meanDepthNight', 'patchDetectFraction', 'phytoTotal', 'phytoFracOfCapacity', 'grazingFractionOfAllocation', 'grazingFractionOfPP', 'zooTotal',
  'zooIntakeFraction', 'pO2',
];
const GENE_COLUMNS = ['patchWidthMm', 'invagination', 'apertureRatio', 'lensIndexGradient',
  'membraneLayers', 'screeningPigment', 'receptorCount', 'integrationTimeS',
  'preferredDepthDay', 'preferredDepthNight', 'rhoBodyDorsal', 'rhoBodyVentral',
  'clutchSize', 'wPredator', 'wFood', 'activityStartH', 'activityLengthH'];

export function runOne(opts, { quiet = false } = {}) {
  const t0 = Date.now();
  const world = new World(opts);
  const trace = [];
  world.run((snap) => {
    trace.push(snap);
    if (!quiet && snap.generation % (opts.printEvery ?? 100) === 0) {
      console.log(fmtLine(snap));
    }
  });
  const wall = (Date.now() - t0) / 1000;
  const last = trace[trace.length - 1];
  return { world, trace, wall, last, opts };
}

function fmtLine(s) {
  const f = (v, n = 2) => (v === null || v === undefined || Number.isNaN(v) ? '  -  ' : v.toFixed(n));
  return [
    `g=${String(s.generation).padStart(5)}`,
    `N=${String(s.nIndividuals).padStart(6)}`,
    `dRho=${f(s.deltaRhoDeg, 2).padStart(7)}deg`,
    `px=${f(s.pixels, 1).padStart(9)}`,
    `cls=${s.nilssonClass}`,
    `inv=${f(s.genes.invagination, 3)}`,
    `ap=${f(s.genes.apertureRatio, 3)}`,
    `lens=${f(s.genes.lensIndexGradient, 3)}`,
    `pig=${f(s.genes.screeningPigment, 3)}`,
    `mem=${String(Math.round(s.genes.membraneLayers)).padStart(5)}`,
    `rec=${String(Math.round(s.genes.receptorCount)).padStart(7)}`,
    `dt=${f(s.genes.integrationTimeS, 2).padStart(7)}`,
    `cap=${f(s.captureSuccess, 3)}`,
  ].join(' ');
}

function writeTrace(name, trace) {
  const header = [...TRACE_COLUMNS, ...GENE_COLUMNS.map(g => 'gene_' + g),
    'death_starvation', 'death_predation', 'death_uv'].join(',');
  const rows = trace.map(s => [
    ...TRACE_COLUMNS.map(k => fmtCsv(s[k])),
    ...GENE_COLUMNS.map(k => fmtCsv(s.genes[k])),
    s.deaths.starvation, s.deaths.predation, s.deaths.uv,
  ].join(','));
  writeFileSync(join(LOGS, name + '.csv'), [header, ...rows].join('\n'));
}

const fmtCsv = v => (v === null || v === undefined || Number.isNaN(v) ? '' : String(v));

/* --------------------------------- sweeps --------------------------------- */

const SWEEPS = {
  kd: { key: 'kdOverride', values: [0.12, 0.18, 0.35, 0.55, 1.00] },
  sigma: { key: 'mutationSigma', values: [0.03, 0.08, 0.15, 0.25] },
  eyecost: { key: 'eyeCostMultiplier', values: [0.0, 0.5, 1.0, 1.5, 2.0] },
  eyeexp: { key: 'eyeCostExponent', values: [0.33, 1.0] },
  handling: { key: 'handlingTimeCoeff', values: [15, 30, 60] },
  epoch: { key: 'epoch', values: ['pre_predation', 'predation_begins', 'visual_arms_race'] },
  episode: { key: 'episodeDays', values: [0.5, 1, 2, 4] },
  advection: { key: 'advectionEnabled', values: [true, false] },
  density: { key: 'initialDensityFraction', values: [0.5, 1.0, 1.5] },
  arena: { key: 'arenaM', values: [120, 150] },
  predation: { key: 'predationEnabled', values: [true, false] },
  bearing: { key: 'bearingErrorEnabled', values: [true, false] },
  zoo: { key: 'zooFraction', values: [0, 0.15, 0.30, 0.50, 0.70] },
};

async function main() {
  const base = {
    seed: num('seed', 1),
    generations: num('generations', 1500),
    epoch: arg('epoch', 'visual_arms_race'),
    mutationSigma: num('sigma', 0.15),
    eyeCostMultiplier: num('eyecost', 1.0),
    eyeCostExponent: num('eyeexp', 0.33),
    handlingTimeCoeff: num('handling', C.HANDLING_TIME_COEFF),
    episodeDays: num('days', 2),
    dtS: num('dt', 30),
    arenaM: num('arena', 120),
    logEvery: num('logEvery', 10),
    printEvery: num('printEvery', 100),
    predationEnabled: !has('nopredation'),
    blindFounders: has('blind'),
    bearingErrorEnabled: !has('nobearing'),
    initialDensityFraction: num('density', 1.0),
    zooFraction: num('zoo', C.ZOO_FRACTION_OF_FLUX),
    advectionEnabled: !has('noadvection'),
    mutationEnabled: !has('nomutation'),
  };
  if (has('kd')) base.kdOverride = num('kd', null);

  const sweepName = arg('sweep', null);
  const seeds = num('seeds', 1);
  const tag = arg('tag', sweepName ? `sweep-${sweepName}` : `run-${base.epoch}`);

  const results = [];
  if (sweepName) {
    const sweep = SWEEPS[sweepName];
    if (!sweep) throw new Error(`unknown sweep: ${sweepName}. Options: ${Object.keys(SWEEPS)}`);
    for (const value of sweep.values) {
      for (let s = 0; s < seeds; s++) {
        const opts = { ...base, [sweep.key]: value, seed: base.seed + s };
        console.log(`\n=== ${sweep.key}=${value} seed=${opts.seed} ===`);
        const r = runOne(opts, { quiet: false });
        writeTrace(`${tag}_${sweep.key}-${value}_s${opts.seed}`, r.trace);
        results.push(summarise(r, { [sweep.key]: value, seed: opts.seed }));
        console.log(summaryLine(results[results.length - 1]));
      }
    }
  } else {
    for (let s = 0; s < seeds; s++) {
      const opts = { ...base, seed: base.seed + s };
      console.log(`\n=== ${base.epoch} seed=${opts.seed} ===`);
      const r = runOne(opts);
      writeTrace(`${tag}_s${opts.seed}`, r.trace);
      results.push(summarise(r, { seed: opts.seed }));
      console.log(summaryLine(results[results.length - 1]));
    }
  }

  writeFileSync(join(LOGS, `${tag}_summary.json`), JSON.stringify(results, null, 2));
  console.log('\n' + table(results));
  console.log(`\nwrote ${LOGS}/${tag}_summary.json`);
}

export function summarise(r, extra = {}) {
  const { trace, last, wall, opts } = r;
  const first = trace[0];
  const gensRun = last ? last.generation + 1 : 0;
  return {
    ...extra,
    epoch: opts.epoch,
    generations: gensRun,
    wallSeconds: wall,
    survived: last ? last.nIndividuals > 0 : false,
    startDeltaRhoDeg: first?.deltaRhoDeg ?? null,
    endDeltaRhoDeg: last?.deltaRhoDeg ?? null,
    startPixels: first?.pixels ?? null,
    endPixels: last?.pixels ?? null,
    startClass: first?.nilssonClass ?? null,
    endClass: last?.nilssonClass ?? null,
    endEyeParameter: last?.eyeParameter ?? null,
    endGenes: last?.genes ?? null,
    endPopulation: last?.nIndividuals ?? null,
    captureSuccess: medianOf(trace.slice(-20).map(t => t.captureSuccess)),
    nightCaptureFraction: medianOf(trace.slice(-20).map(t => t.nightCaptureFraction)),
    meanDepthDay: medianOf(trace.slice(-20).map(t => t.meanDepthDay)),
    meanDepthNight: medianOf(trace.slice(-20).map(t => t.meanDepthNight)),
    patchDetectFraction: medianOf(trace.slice(-20).map(t => t.patchDetectFraction)),
    deathsLast: last?.deaths ?? null,
    compressionFactor: gensRun > 0 ? C.NP_TOTAL_GENERATIONS / gensRun : null,
  };
}

const medianOf = a => {
  const v = a.filter(x => x !== null && x !== undefined && !Number.isNaN(x)).sort((x, y) => x - y);
  return v.length ? v[Math.floor(v.length / 2)] : null;
};

function summaryLine(s) {
  const f = (v, n = 3) => (v === null || v === undefined ? '-' : Number(v).toFixed(n));
  return `  -> class ${s.startClass}->${s.endClass}  dRho ${f(s.startDeltaRhoDeg, 1)}deg -> ${f(s.endDeltaRhoDeg, 3)}deg` +
    `  px ${f(s.startPixels, 1)}->${f(s.endPixels, 0)}  N=${s.endPopulation}  ${f(s.wallSeconds, 1)}s`;
}

function table(rows) {
  if (!rows.length) return '';
  const cols = ['seed', 'epoch', 'generations', 'startClass', 'endClass',
    'endDeltaRhoDeg', 'endPixels', 'endPopulation', 'captureSuccess', 'wallSeconds'];
  const extra = Object.keys(rows[0]).filter(k => !cols.includes(k) &&
    ['kdOverride', 'mutationSigma', 'eyeCostMultiplier', 'eyeCostExponent',
     'handlingTimeCoeff', 'predationEnabled', 'bearingErrorEnabled', 'zooFraction',
     'episodeDays', 'advectionEnabled', 'initialDensityFraction', 'arenaM'].includes(k));
  const all = [...extra, ...cols];
  const fmt = v => (v === null || v === undefined ? '-' :
    typeof v === 'number' ? (Number.isInteger(v) ? String(v) : v.toFixed(3)) : String(v));
  const widths = all.map(c => Math.max(c.length, ...rows.map(r => fmt(r[c]).length)));
  const line = cells => cells.map((c, i) => String(c).padEnd(widths[i])).join('  ');
  return [line(all), line(widths.map(w => '-'.repeat(w))),
    ...rows.map(r => line(all.map(c => fmt(r[c]))))].join('\n');
}

if (import.meta.main) await main();
