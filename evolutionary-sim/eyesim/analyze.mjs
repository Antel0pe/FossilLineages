/**
 * Read run traces and say what actually happened.
 *
 *   bun evolutionary-sim/eyesim/analyze.mjs                     # every trace in logs/
 *   bun evolutionary-sim/eyesim/analyze.mjs base-arms_s1
 *
 * Prints, per run: the eye trajectory with the generation each threshold was
 * crossed, which genes moved and in what order, ecosystem stability, and a
 * sparkline for the quantities worth eyeballing.
 */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = fileURLToPath(new URL('.', import.meta.url));
const LOGS = join(HERE, 'logs');

const SPARK = '▁▂▃▄▅▆▇█';

function loadTrace(file) {
  const text = readFileSync(join(LOGS, file), 'utf8').trim().split('\n');
  const header = text[0].split(',');
  return text.slice(1).map(line => {
    const cells = line.split(',');
    const row = {};
    header.forEach((h, i) => {
      const v = cells[i];
      row[h] = v === '' ? null : (Number.isNaN(Number(v)) ? v : Number(v));
    });
    return row;
  });
}

function sparkline(values, { log = false } = {}) {
  const v = values.filter(x => x !== null && Number.isFinite(x));
  if (!v.length) return '(no data)';
  const t = log ? v.map(x => Math.log10(Math.max(x, 1e-6))) : v;
  const lo = Math.min(...t), hi = Math.max(...t);
  if (hi - lo < 1e-12) return SPARK[0].repeat(Math.min(t.length, 60));
  const step = Math.max(1, Math.floor(t.length / 60));
  let out = '';
  for (let i = 0; i < t.length; i += step) {
    const f = (t[i] - lo) / (hi - lo);
    out += SPARK[Math.min(SPARK.length - 1, Math.floor(f * SPARK.length))];
  }
  return out;
}

/** First generation at which `pred` becomes true and stays true for 3 samples. */
function crossing(trace, pred) {
  for (let i = 0; i < trace.length - 2; i++) {
    if (pred(trace[i]) && pred(trace[i + 1]) && pred(trace[i + 2])) return trace[i].generation;
  }
  return null;
}

/** Pearson correlation, ignoring nulls. */
function corr(a, b) {
  const pairs = a.map((x, i) => [x, b[i]]).filter(([x, y]) =>
    x !== null && y !== null && Number.isFinite(x) && Number.isFinite(y));
  if (pairs.length < 5) return null;
  const n = pairs.length;
  const mx = pairs.reduce((s, p) => s + p[0], 0) / n;
  const my = pairs.reduce((s, p) => s + p[1], 0) / n;
  let sxy = 0, sxx = 0, syy = 0;
  for (const [x, y] of pairs) {
    sxy += (x - mx) * (y - my); sxx += (x - mx) ** 2; syy += (y - my) ** 2;
  }
  return sxx && syy ? sxy / Math.sqrt(sxx * syy) : null;
}

const GENE_ORDER = [
  ['gene_screeningPigment', 'screening pigment', 3],
  ['gene_invagination', 'cup invagination', 3],
  ['gene_apertureRatio', 'aperture ratio', 3],
  ['gene_membraneLayers', 'membrane layers', 0],
  ['gene_lensIndexGradient', 'lens index gradient', 4],
  ['gene_receptorCount', 'receptor count', 0],
  ['gene_patchWidthMm', 'patch width (mm)', 3],
  ['gene_integrationTimeS', 'integration time (s)', 3],
];

function analyseRun(name, trace) {
  const out = [];
  const first = trace[0], last = trace[trace.length - 1];
  const gens = last.generation;
  const push = s => out.push(s);

  push(`\n${'='.repeat(78)}\n${name}   (${trace.length} samples, ${gens} generations)\n${'='.repeat(78)}`);

  /* --- did it evolve? --- */
  push('\nEYE TRAJECTORY');
  push(`  deltaRho      ${first.deltaRhoDeg?.toFixed(2)}deg -> ${last.deltaRhoDeg?.toFixed(4)}deg`);
  push(`  pixels        ${first.pixels?.toFixed(1)} -> ${last.pixels?.toFixed(1)}`);
  push(`  Nilsson class ${first.nilssonClass} -> ${last.nilssonClass}`);
  push(`  eye parameter ${first.eyeParameter?.toFixed(3)} -> ${last.eyeParameter?.toFixed(4)} (fossil target <2 for bright-light acuity)`);
  push(`  deltaRho      ${sparkline(trace.map(t => t.deltaRhoDeg), { log: true })}  (log scale, high->low = improving)`);
  push(`  pixels        ${sparkline(trace.map(t => t.pixels), { log: true })}  (log scale)`);

  push('\n  class thresholds crossed at generation:');
  const marks = [
    ['directional  (>=2 resolvable directions)', t => t.pixels >= 2],
    ['low-res      (>=10 directions)', t => t.pixels >= 10],
    ['low-res      (deltaRho <= 40deg)', t => t.deltaRhoDeg <= 40],
    ['high-res     (deltaRho <= 5deg)', t => t.deltaRhoDeg <= 5],
    ['high-res     (deltaRho <= 1deg)', t => t.deltaRhoDeg <= 1],
  ];
  for (const [label, pred] of marks) {
    const g = crossing(trace, pred);
    push(`    ${label.padEnd(42)} ${g === null ? 'never' : 'gen ' + g}`);
  }

  /* --- gene order: what moved first --- */
  push('\nGENE TRAJECTORIES (median of the population)');
  const moves = [];
  for (const [key, label, dp] of GENE_ORDER) {
    if (!(key in first)) continue;
    const series = trace.map(t => t[key]);
    const v0 = first[key], v1 = last[key];
    const range = Math.max(...series.filter(Number.isFinite)) - Math.min(...series.filter(Number.isFinite));
    // Generation at which the gene first reaches 50% of its total excursion.
    const halfway = v0 + 0.5 * (v1 - v0);
    const g50 = crossing(trace, t => (v1 > v0 ? t[key] >= halfway : t[key] <= halfway));
    moves.push({ label, v0, v1, dp, g50, series });
  }
  moves.sort((a, b) => (a.g50 ?? Infinity) - (b.g50 ?? Infinity));
  for (const m of moves) {
    push(`  ${m.label.padEnd(24)} ${String(fmt(m.v0, m.dp)).padStart(9)} -> ${String(fmt(m.v1, m.dp)).padStart(10)}` +
      `  half at ${m.g50 === null ? '  -  ' : 'g' + String(m.g50).padStart(4)}  ${sparkline(m.series)}`);
  }

  /* --- ecosystem --- */
  push('\nECOSYSTEM');
  const pop = trace.map(t => t.nIndividuals);
  const popMin = Math.min(...pop), popMax = Math.max(...pop);
  push(`  population    ${first.nIndividuals} -> ${last.nIndividuals}  (min ${popMin}, max ${popMax})`);
  push(`  population    ${sparkline(pop)}`);
  push(`  phytoplankton ${sparkline(trace.map(t => t.phytoTotal))}`);
  const deathTotals = ['death_starvation', 'death_predation', 'death_uv']
    .map(k => [k.replace('death_', ''), trace.reduce((s, t) => s + (t[k] ?? 0), 0)]);
  const deathSum = deathTotals.reduce((s, [, v]) => s + v, 0) || 1;
  push(`  deaths        ${deathTotals.map(([k, v]) => `${k} ${(100 * v / deathSum).toFixed(1)}%`).join(', ')}`);
  push(`  extinct?      ${last.nIndividuals > 0 ? 'no' : 'YES at gen ' + last.generation}`);

  /* --- behaviour and criteria-relevant readouts --- */
  push('\nBEHAVIOUR AND CRITERIA');
  const tail = trace.slice(-Math.max(3, Math.floor(trace.length * 0.2)));
  const tailMean = k => {
    const v = tail.map(t => t[k]).filter(x => x !== null && Number.isFinite(x));
    return v.length ? v.reduce((a, b) => a + b, 0) / v.length : null;
  };
  push(`  capture success        ${fmt(tailMean('captureSuccess'), 3)}   (spec expects 0.15-0.35)`);
  push(`  night capture fraction ${fmt(tailMean('nightCaptureFraction'), 3)}   (V12: predator should be diurnal, expect <0.05)`);
  const dDay = tailMean('meanDepthDay'), dNight = tailMean('meanDepthNight');
  push(`  mean depth day/night   ${fmt(dDay, 2)} / ${fmt(dNight, 2)} m  -> DVM amplitude ${fmt(Math.abs((dDay ?? 0) - (dNight ?? 0)), 2)} m (V11: expect >3 m)`);
  push(`  patch detect fraction  ${fmt(tailMean('patchDetectFraction'), 3)}   (class III payoff: fraction of steps a food patch was visible)`);
  push(`  rho dorsal / ventral   ${fmt(tailMean('gene_rhoBodyDorsal'), 3)} / ${fmt(tailMean('gene_rhoBodyVentral'), 3)}` +
    `  -> countershading gap ${fmt(Math.abs((tailMean('gene_rhoBodyDorsal') ?? 0) - (tailMean('gene_rhoBodyVentral') ?? 0)), 3)} (V22: expect >0.15)`);
  push(`  preferred depth d/n    ${fmt(tailMean('gene_preferredDepthDay'), 2)} / ${fmt(tailMean('gene_preferredDepthNight'), 2)} m`);
  push(`  activity window        start ${fmt(tailMean('gene_activityStartH'), 2)} h, length ${fmt(tailMean('gene_activityLengthH'), 2)} h (day is 5.25-15.75)`);

  /* --- red queen --- */
  const rq = corr(trace.map(t => t.deltaRhoDeg), trace.map(t => t.gene_rhoBodyDorsal));
  push(`\n  V13 Red Queen: corr(deltaRho, rho_dorsal) = ${fmt(rq, 3)}  ` +
    `(prey should get harder to see as eyes improve; sign depends on which side is evolving)`);

  return out.join('\n');
}

const fmt = (v, dp = 3) =>
  (v === null || v === undefined || !Number.isFinite(v) ? '  -  ' : Number(v).toFixed(dp));

/* --------------------------------- main --------------------------------- */

const filter = process.argv[2];
const files = readdirSync(LOGS)
  .filter(f => f.endsWith('.csv'))
  .filter(f => !filter || f.includes(filter))
  .sort();

if (!files.length) {
  console.log(`no traces in ${LOGS}${filter ? ` matching "${filter}"` : ''}`);
  process.exit(0);
}

const chunks = [];
for (const f of files) {
  const trace = loadTrace(f);
  if (trace.length < 2) { chunks.push(`\n${f}: too short to analyse`); continue; }
  chunks.push(analyseRun(f.replace('.csv', ''), trace));
}
const text = chunks.join('\n');
console.log(text);
writeFileSync(join(LOGS, 'analysis.txt'), text);
console.log(`\nwrote ${join(LOGS, 'analysis.txt')}`);
