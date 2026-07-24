/**
 * Ecology balance probe.
 *
 * A world where everything starves, or where nothing ever does, cannot select for
 * anything. This searches for parameter sets where BOTH populations persist and
 * turn over enough generations to be worth running an evolution experiment in.
 * It scores persistence and generation count ONLY — never eye quality — so it
 * cannot bias the outcome of the experiments it is setting up.
 *
 *   single point:  bun balance.mjs --json '{"nPatches":60}' --ticks 40000
 *   search:        bun balance.mjs --search --n 48 --ticks 40000 --par 6
 */
import { runSim } from './core/sim.mjs';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';

const argv = process.argv.slice(2);
const arg = (k, d) => { const i = argv.indexOf('--' + k); return i >= 0 ? argv[i + 1] : d; };
const has = k => argv.includes('--' + k);
const SELF = fileURLToPath(import.meta.url);

function score(over, ticks, seed = 1) {
  const t0 = Date.now();
  const r = runSim({ ...over, seed, ticks });
  const g = k => { const v = [...r.stats.gen[k].values()].filter(x => x.n >= 3);
    return v.length ? Math.max(...v.map(x => x.gen)) : 0; };
  const preyGens = g('prey'), predGens = g('pred');
  const nPrey = r.prey.length, nPred = r.preds.length;
  const survived = r.tick >= ticks;
  // both alive, both turning over. A world where one side is pinned at its cap
  // is as dead as one where it went extinct, so cap-pinning is penalised.
  const capPin = (nPrey >= (over.preyCap ?? 700) * 0.97 ? 1 : 0) + (nPred >= (over.predCap ?? 140) * 0.97 ? 1 : 0);
  const ok = survived && nPrey >= 25 && nPred >= 4;
  const s = ok ? Math.min(preyGens, predGens) - 4 * capPin : -100 + Math.min(nPrey, 25) * 0.1;
  return { score: s, preyGens, predGens, nPrey, nPred, survived, capPin,
           foodEaten: r.stats.counters.foodEaten, preyEaten: r.stats.counters.preyEaten,
           preyStarved: r.stats.counters.preyStarved, predStarved: r.stats.counters.predStarved,
           ms: Date.now() - t0 };
}

/* ---- the search space: ecology only. No optics, no detection, no eye terms. ---- */
const SPACE = {
  nPatches:   [30, 45, 60, 85, 120],
  patchR:     [55, 75, 95],
  patchStock: [40, 70, 110],
  foodE:      [22, 30, 40],
  preyBodyE:  [220, 340, 480],
  predBreedE: [420, 620, 900],
  nPrey0:     [120, 200, 300],
  nPred0:     [12, 22, 36],
  bmr:        [0.018, 0.030],
};

function sampleSpace(rng) {
  const o = {};
  for (const [k, vals] of Object.entries(SPACE)) o[k] = vals[Math.floor(rng() * vals.length)];
  return o;
}
function mulberry32(a) { return function () { a |= 0; a = (a + 0x6D2B79F5) | 0;
  let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

if (has('json')) {
  const over = JSON.parse(arg('json'));
  const r = score(over, +arg('ticks', 40000), +arg('seed', 1));
  console.log(JSON.stringify({ over, ...r }));
} else if (has('search')) {
  const n = +arg('n', 48), ticks = +arg('ticks', 40000), par = +arg('par', 6);
  const rng = mulberry32(+arg('searchSeed', 7));
  const cands = []; const seen = new Set();
  while (cands.length < n) { const c = sampleSpace(rng); const k = JSON.stringify(c);
    if (!seen.has(k)) { seen.add(k); cands.push(c); } }
  console.error(`searching ${n} ecologies × ${ticks} ticks, ${par} at a time\n`);
  const results = [];
  let idx = 0, active = 0, done = 0;
  await new Promise(resolve => {
    const pump = () => {
      while (active < par && idx < cands.length) {
        const c = cands[idx++]; active++;
        const p = spawn(process.execPath, [SELF, '--json', JSON.stringify(c), '--ticks', String(ticks)],
                        { stdio: ['ignore', 'pipe', 'inherit'] });
        let buf = '';
        p.stdout.on('data', d => buf += d);
        p.on('close', () => {
          active--; done++;
          try { const r = JSON.parse(buf.trim()); results.push(r);
            console.error(`[${done}/${cands.length}] score ${String(r.score).padStart(5)}  ` +
              `prey ${String(r.nPrey).padStart(4)}/g${String(r.preyGens).padStart(3)}  ` +
              `pred ${String(r.nPred).padStart(4)}/g${String(r.predGens).padStart(3)}  ${JSON.stringify(r.over)}`);
          } catch { console.error(`[${done}/${cands.length}] FAILED`); }
          if (done === cands.length) resolve(); else pump();
        });
      }
    };
    pump();
  });
  results.sort((a, b) => b.score - a.score);
  console.error(`\n===== top 8 =====`);
  for (const r of results.slice(0, 8))
    console.error(`score ${String(r.score).padStart(4)}  prey ${r.nPrey}/g${r.preyGens}  pred ${r.nPred}/g${r.predGens}  ${JSON.stringify(r.over)}`);
  console.log(JSON.stringify(results.slice(0, 8), null, 1));
} else {
  console.error('use --json <overrides> or --search');
}
