/**
 * Headless experiment runner for the eye-evolution core.
 *
 *   bun evolutionary-sim/run-exp.mjs --config baseline --seeds 3 --ticks 200000
 *   bun evolutionary-sim/run-exp.mjs --sweep density --seeds 3
 *
 * Writes a markdown report + CSVs into evolutionary-sim/logs/ (gitignored) and
 * prints a one-line-per-run table so a sweep is readable in the terminal.
 */
import { runSim, DEFAULTS, degOf, nilssonClass, sharpness } from './core/sim.mjs';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = fileURLToPath(new URL('.', import.meta.url));
const LOGS = join(HERE, 'logs');
mkdirSync(LOGS, { recursive: true });

/* ----------------------------- arg parsing ----------------------------- */
const argv = process.argv.slice(2);
const arg = (k, d) => { const i = argv.indexOf('--' + k); return i >= 0 ? argv[i + 1] : d; };
const has = k => argv.includes('--' + k);

/* ------------------------------ analysis ------------------------------- */
const mean = a => a.length ? a.reduce((s, x) => s + x, 0) / a.length : null;
const sd = a => { if (a.length < 2) return null; const m = mean(a);
  return Math.sqrt(a.reduce((t, x) => t + (x - m) ** 2, 0) / a.length); };
const median = a => { if (!a.length) return null; const s = [...a].sort((x, y) => x - y);
  return s.length % 2 ? s[(s.length - 1) / 2] : (s[s.length / 2 - 1] + s[s.length / 2]) / 2; };

function analyse(res) {
  const { stats, P } = res;
  const out = { ticks: res.tick, counters: stats.counters };
  for (const kind of ['prey', 'pred']) {
    const gens = [...stats.gen[kind].values()].sort((a, b) => a.gen - b.gen).filter(g => g.n >= 3);
    const first = gens[0], last = gens[gens.length - 1];
    // Price term per generation, averaged over generations that had enough ended lives
    const price = gens.filter(g => g.nEnded >= 5 && g.sumW > 0).map(g => {
      const wbar = g.sumW / g.nEnded, zbar = g.sumEndZ / g.nEnded;
      return (g.sumWZ / g.nEnded - wbar * zbar) / wbar;   // Cov(w,z)/w̄
    });
    const md = stats.mutDelta[kind];
    out[kind] = {
      maxGen: last ? last.gen : 0,
      nGensTracked: gens.length,
      z0: first ? first.sumZ / first.n : null,
      zEnd: last ? last.sumZ / last.n : null,
      drDeg0: first ? degOf(first.sumDr / first.n) : null,
      drDegEnd: last ? degOf(last.sumDr / last.n) : null,
      classEnd: last ? nilssonClass(last.sumDr / last.n) : '–',
      A: last ? last.sumA / last.n : null,
      f: last ? last.sumF / last.n : null,
      L: last ? last.sumL / last.n : null,
      priceMean: mean(price), priceN: price.length,
      mutBias: mean(md), mutN: md.length,
      zSdEnd: last ? Math.sqrt(Math.max(0, last.sumZ2 / last.n - (last.sumZ / last.n) ** 2)) : null,
      alive: kind === 'prey' ? res.prey.length : res.preds.length,
      gens,
    };
  }
  return out;
}

/* ------------------------------ configs -------------------------------- */
// predCap 400 everywhere: at the stock 140 the predator population sits pinned at its
// ceiling, which truncates variance in reproductive success and weakens selection for a
// reason that has nothing to do with eyes.
const ROOM = { predCap: 400, preyCap: 1200 };
const CONFIGS = {
  baseline: { ...ROOM },
  // control: no predators at all — food alone still rewards seeing, but weakly
  noPredators: { ...ROOM, predatorsOn: false },
  // FALSIFIER: food everywhere and dense enough that a random walk feeds you.
  // If eyes sharpen here too, the whole "the environment did it" claim is dead.
  glutFood: { ...ROOM, nPatches: 900, patchR: 130, patchStock: 200, patchRegen: 0.5 },
  // scarcer, patchier: longer trips between meals
  scarce: { ...ROOM, nPatches: 45, patchR: 70, patchStock: 70 },
  // clear vs murky water — the medium, not the eye
  clearWater: { ...ROOM, atten: 900 },
  murkyWater: { ...ROOM, atten: 70 },
};

const SWEEPS = {
  // THE reachability question. Nilsson & Pelger's own estimate for patch → lens eye is
  // ~364,000 generations at 1%-per-step. This sim gets ~13 generations per 30k ticks, so
  // simulating that honestly is impossible. Either the steps get bigger or the climb never
  // happens for reasons that have nothing to do with whether the environment selects for it.
  // Mutation is symmetric in log space, so a larger sigma cannot bias the DIRECTION of
  // change — it only sets how fast the axis can be traversed. Each rung is "one sim
  // generation ≈ N Nilsson-generations".
  mutation: [
    ['sigma0.03', { ...ROOM, mut: 0.03 }],
    ['sigma0.08', { ...ROOM, mut: 0.08 }],
    ['sigma0.15', { ...ROOM, mut: 0.15 }],
    ['sigma0.25', { ...ROOM, mut: 0.25 }],
  ],
  // the medium, not the eye — the Cambrian "clearing water" knob
  clarity: [
    ['murky-70',   { ...ROOM, mut: 0.15, atten: 70 }],
    ['normal-250', { ...ROOM, mut: 0.15, atten: 250 }],
    ['clear-900',  { ...ROOM, mut: 0.15, atten: 900 }],
  ],
  // how patchy the world is: the reason distance vision pays at all
  patchiness: [
    ['glut',    { ...ROOM, mut: 0.15, nPatches: 900, patchR: 130, patchStock: 200, patchRegen: 0.5 }],
    ['rich',    { ...ROOM, mut: 0.15, nPatches: 200, patchR: 110, patchStock: 150 }],
    ['normal',  { ...ROOM, mut: 0.15 }],
    ['sparse',  { ...ROOM, mut: 0.15, nPatches: 45, patchR: 70, patchStock: 70 }],
  ],
  predation: [
    ['none',   { ...ROOM, mut: 0.15, predatorsOn: false }],
    ['light',  { ...ROOM, mut: 0.15, nPred0: 6 }],
    ['normal', { ...ROOM, mut: 0.15, nPred0: 16 }],
    ['heavy',  { ...ROOM, mut: 0.15, nPred0: 40 }],
  ],
};

/* -------------------------------- runner -------------------------------- */
function runOne(name, over, seed, ticks) {
  const t0 = Date.now();
  const res = runSim({ ...over, seed, ticks });
  const a = analyse(res);
  a.name = name; a.seed = seed; a.wallMs = Date.now() - t0; a.res = res;
  return a;
}

function fmt(x, d = 2) { return x == null || !isFinite(x) ? '   –' : (+x).toFixed(d); }
function line(a) {
  const p = a.prey, q = a.pred;
  return `${a.name.padEnd(12)} s${a.seed}  ` +
    `prey Δρ ${fmt(p.drDeg0, 0).padStart(4)}°→${fmt(p.drDegEnd, 2).padStart(7)}°  z ${fmt(p.z0).padStart(5)}→${fmt(p.zEnd).padStart(5)}  ` +
    `g${String(p.maxGen).padStart(3)} n${String(p.alive).padStart(4)}  |  ` +
    `pred Δρ ${fmt(q.drDeg0, 0).padStart(4)}°→${fmt(q.drDegEnd, 2).padStart(7)}°  z ${fmt(q.zEnd).padStart(5)}  ` +
    `g${String(q.maxGen).padStart(3)} n${String(q.alive).padStart(4)}  ` +
    `[${(a.wallMs / 1000).toFixed(0)}s]`;
}

/* -------------------------------- report -------------------------------- */
function report(title, runs) {
  const p = n => String(n).padStart(2, '0');
  const d = new Date();
  const stamp = `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}`;
  const byName = new Map();
  for (const r of runs) { if (!byName.has(r.name)) byName.set(r.name, []); byName.get(r.name).push(r); }

  let md = `# Eye-evolution experiment — ${title}\n\ngenerated \`${d.toISOString()}\`\n\n`;
  md += `Optics: \`Δρ = min(π, √((2·atan(A/2f)·(1−lens))² + (λ/A)²))\`.\n`;
  md += `Detection: \`S = (θ/Δρ)²·exp(−d/atten)\`, \`p = S/(1+S)\`, \`θ = targetDiameter/d\`. Bearing error ±Δρ.\n`;
  md += `No rule anywhere rewards acuity directly; animals eat, breed on stored energy, and are eaten.\n\n`;

  md += `## Outcome per condition (median over seeds)\n\n`;
  md += `| condition | seeds | prey Δρ start | **prey Δρ end** | prey class end | prey z gain | prey gens | pred Δρ end | pred class end | pred gens | prey alive | pred alive |\n`;
  md += `|---|---|---|---|---|---|---|---|---|---|---|---|\n`;
  for (const [name, rs] of byName) {
    const m = k => median(rs.map(k).filter(v => v != null));
    md += `| ${name} | ${rs.length} | ${fmt(m(r => r.prey.drDeg0), 1)}° | **${fmt(m(r => r.prey.drDegEnd), 3)}°** | ${rs[0].prey.classEnd} | ${fmt(m(r => r.prey.zEnd - r.prey.z0))} | ${fmt(m(r => r.prey.maxGen), 0)} | ${fmt(m(r => r.pred.drDegEnd), 3)}° | ${rs[0].pred.classEnd} | ${fmt(m(r => r.pred.maxGen), 0)} | ${fmt(m(r => r.prey.alive), 0)} | ${fmt(m(r => r.pred.alive), 0)} |\n`;
  }

  md += `\n## Is it selection or drift?\n\n`;
  md += `\`Price\` = mean over generations of Cov(w,z)/w̄, the per-generation change in sharpness predicted by selection alone.\n`;
  md += `\`mutBias\` = mean(child z − parent z). If mutBias ≥ Price, the trend is a random walk, not selection.\n\n`;
  md += `| condition | side | Price/gen | mutBias/gen | ratio | sd(z) at end | verdict |\n|---|---|---|---|---|---|---|\n`;
  for (const [name, rs] of byName) for (const side of ['prey', 'pred']) {
    const pr = median(rs.map(r => r[side].priceMean).filter(v => v != null));
    const mb = median(rs.map(r => r[side].mutBias).filter(v => v != null));
    const ratio = (pr != null && mb != null && Math.abs(mb) > 1e-9) ? pr / Math.abs(mb) : null;
    const verdict = pr == null ? 'no data' : (ratio != null && ratio > 3 ? '**selection**' : (ratio != null && ratio > 1 ? 'weak selection' : 'drift'));
    md += `| ${name} | ${side} | ${fmt(pr, 4)} | ${fmt(mb, 4)} | ${fmt(ratio, 1)} | ${fmt(median(rs.map(r => r[side].zSdEnd).filter(v => v != null)), 3)} | ${verdict} |\n`;
  }

  md += `\n## Evolved morphology (median over seeds, final generation)\n\n`;
  md += `| condition | side | aperture A | depth f | lens L | Δρ | Nilsson class |\n|---|---|---|---|---|---|---|\n`;
  for (const [name, rs] of byName) for (const side of ['prey', 'pred']) {
    const m = k => median(rs.map(k).filter(v => v != null));
    md += `| ${name} | ${side} | ${fmt(m(r => r[side].A), 3)} | ${fmt(m(r => r[side].f), 3)} | ${fmt(m(r => r[side].L), 3)} | ${fmt(m(r => r[side].drDegEnd), 3)}° | ${rs[0][side].classEnd} |\n`;
  }

  md += `\n## Ecology counters (seed 1 of each condition)\n\n`;
  md += `| condition | food eaten | prey eaten | prey starved | pred starved | prey forage% | prey flee% | pred hunt% |\n|---|---|---|---|---|---|---|---|\n`;
  for (const [name, rs] of byName) {
    const c = rs[0].counters, pt = c.preyTicks || 1, dt = c.predTicks || 1;
    md += `| ${name} | ${c.foodEaten} | ${c.preyEaten} | ${c.preyStarved} | ${c.predStarved} | ${(100 * c.preyForageTicks / pt).toFixed(1)}% | ${(100 * c.preyFleeTicks / pt).toFixed(1)}% | ${(100 * c.predHuntTicks / dt).toFixed(1)}% |\n`;
  }

  // per-generation trajectory of the first seed of each condition
  md += `\n## Δρ trajectory by generation (seed 1)\n\n`;
  for (const [name, rs] of byName) {
    md += `### ${name}\n\n| gen | prey n | prey Δρ | prey class | pred n | pred Δρ | pred class |\n|---|---|---|---|---|---|---|\n`;
    const pg = rs[0].prey.gens, dg = rs[0].pred.gens;
    const maxg = Math.max(pg.length ? pg[pg.length - 1].gen : 0, dg.length ? dg[dg.length - 1].gen : 0);
    const stepg = Math.max(1, Math.ceil(maxg / 25));
    for (let g = 0; g <= maxg; g += stepg) {
      const a = pg.find(x => x.gen === g), b = dg.find(x => x.gen === g);
      md += `| ${g} | ${a ? a.n : '–'} | ${a ? fmt(degOf(a.sumDr / a.n), 3) + '°' : '–'} | ${a ? nilssonClass(a.sumDr / a.n) : '–'} | ${b ? b.n : '–'} | ${b ? fmt(degOf(b.sumDr / b.n), 3) + '°' : '–'} | ${b ? nilssonClass(b.sumDr / b.n) : '–'} |\n`;
    }
    md += `\n`;
  }

  const file = join(LOGS, `${stamp}-exp-${title.replace(/[^\w]+/g, '-')}.md`);
  writeFileSync(file, md);

  // machine-readable trajectory for plotting
  const rows = [];
  for (const r of runs) for (const side of ['prey', 'pred'])
    for (const g of r[side].gens)
      rows.push([r.name, r.seed, side, g.gen, g.n, g.nEnded, (g.sumDr / g.n), degOf(g.sumDr / g.n),
                 g.sumZ / g.n, g.sumA / g.n, g.sumF / g.n, g.sumL / g.n].join(','));
  writeFileSync(join(LOGS, `${stamp}-exp-${title.replace(/[^\w]+/g, '-')}-gens.csv`),
    ['condition,seed,side,gen,nBorn,nEnded,drhoRad,drhoDeg,z,A,f,L', ...rows].join('\n'));

  console.log(`\nreport -> ${file}`);
  return file;
}

/* --------------------------------- main --------------------------------- */
const seeds = +arg('seeds', 3);
const ticks = +arg('ticks', 200000);
const runs = [];

if (has('sweep')) {
  const name = arg('sweep');
  const sw = SWEEPS[name];
  if (!sw) { console.error(`unknown sweep "${name}". have: ${Object.keys(SWEEPS).join(', ')}`); process.exit(1); }
  console.log(`sweep "${name}" · ${sw.length} conditions × ${seeds} seeds × ${ticks} ticks\n`);
  for (const [cname, over] of sw)
    for (let s = 1; s <= seeds; s++) { const a = runOne(cname, over, s, ticks); runs.push(a); console.log(line(a)); }
  report(`sweep-${name}`, runs);
} else {
  const name = arg('config', 'baseline');
  const over = CONFIGS[name];
  if (!over) { console.error(`unknown config "${name}". have: ${Object.keys(CONFIGS).join(', ')}`); process.exit(1); }
  console.log(`config "${name}" · ${seeds} seeds × ${ticks} ticks\n`);
  for (let s = 1; s <= seeds; s++) { const a = runOne(name, over, s, ticks); runs.push(a); console.log(line(a)); }
  report(`config-${name}`, runs);
}
