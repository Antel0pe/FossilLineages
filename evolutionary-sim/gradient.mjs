/**
 * Selection-gradient mapper (invasion test).
 *
 * The honest question is not "did the eye improve in one run" — that confounds
 * selection with whether mutation could reach the better morph. It is:
 *
 *     at a given Δρ, does a slightly sharper eye out-reproduce its neighbours?
 *
 * So: seed the world 50/50 with two FIXED genomes one step apart on the eye axis,
 * turn mutation OFF, run, and measure how the share of births shifts. That is the
 * selection coefficient s at that point on the axis. Sweep the axis and you get
 * the fitness gradient the environment actually provides — which is the thing the
 * whole exercise is trying to engineer.
 *
 *   bun gradient.mjs --steps 8 --seeds 4 --ticks 60000 --par 6
 *   bun gradient.mjs --point 2 --seeds 4          (one rung, verbose)
 */
import { runSim, makeOptics, DEFAULTS, degOf, nilssonClass } from './core/sim.mjs';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const HERE = fileURLToPath(new URL('.', import.meta.url));
const LOGS = join(HERE, 'logs');
mkdirSync(LOGS, { recursive: true });
const SELF = fileURLToPath(import.meta.url);
const argv = process.argv.slice(2);
const arg = (k, d) => { const i = argv.indexOf('--' + k); return i >= 0 ? argv[i + 1] : d; };
const has = k => argv.includes('--' + k);

const over = has('over') ? JSON.parse(arg('over')) : {};
const P = { ...DEFAULTS, ...over };
const { drho } = makeOptics(P);

/* The eye axis: a one-parameter family from flat patch to lens eye. This is only
   used to PICK the two morphs to compete; the sim never sees it. */
function eyeAt(s) {
  // s in [0,1]: deepen the pit, then grow a lens. Aperture is held constant — stopping
  // down makes Δρ WORSE here (diffraction λ/A), which is correct physics but makes the
  // axis non-monotonic, so the rung labelled "sharper" would not have been sharper.
  const f = 0.07 * Math.pow(5.0 / 0.07, Math.min(1, s * 1.35));
  const L = Math.max(0, Math.min(1, (s - 0.35) / 0.45));
  return { A: 1.0, f, L };
}

function runPoint(s0, ds, seed, ticks) {
  const gLo = eyeAt(s0), gHi = eyeAt(s0 + ds);
  const r = runSim({ ...over, seed, ticks, mut: 0, morphs: [gLo, gHi] });
  const bp = r.morphTally.prey, bd = r.morphTally.pred;
  const share = t => { const a = t[0] || 0, b = t[1] || 0; return (a + b) ? b / (a + b) : null; };
  const alive = (arr, m) => arr.filter(a => a.morph === m).length;
  return {
    s0, ds, seed,
    drLo: drho(gLo), drHi: drho(gHi),
    preyBirthsLo: bp[0] || 0, preyBirthsHi: bp[1] || 0, preyShareHi: share(bp),
    predBirthsLo: bd[0] || 0, predBirthsHi: bd[1] || 0, predShareHi: share(bd),
    preyAliveLo: alive(r.prey, 0), preyAliveHi: alive(r.prey, 1),
    predAliveLo: alive(r.preds, 0), predAliveHi: alive(r.preds, 1),
    ticks: r.tick,
  };
}

const mean = a => a.length ? a.reduce((x, y) => x + y, 0) / a.length : null;
const sdev = a => { if (a.length < 2) return null; const m = mean(a);
  return Math.sqrt(a.reduce((t, x) => t + (x - m) ** 2, 0) / (a.length - 1)); };
const f3 = x => x == null || !isFinite(x) ? '  –  ' : (+x).toFixed(3);

if (has('json')) {
  const o = JSON.parse(arg('json'));
  console.log(JSON.stringify(runPoint(o.s0, o.ds, o.seed, o.ticks)));
} else {
  const steps = +arg('steps', 8), seeds = +arg('seeds', 4), ticks = +arg('ticks', 60000), par = +arg('par', 6);
  const ds = +arg('ds', 0.06);
  const jobs = [];
  for (let i = 0; i < steps; i++) {
    const s0 = i / steps * (1 - ds);
    for (let seed = 1; seed <= seeds; seed++) jobs.push({ s0, ds, seed, ticks });
  }
  console.error(`gradient: ${steps} rungs × ${seeds} seeds × ${ticks} ticks (${jobs.length} runs, ${par} at a time)`);
  console.error(`each run: 50/50 fixed morphs Δs=${ds}, mutation OFF. Share>0.5 means the sharper eye won.\n`);
  const out = [];
  let idx = 0, active = 0, done = 0;
  await new Promise(res => {
    const pump = () => {
      while (active < par && idx < jobs.length) {
        const j = jobs[idx++]; active++;
        const a = [SELF, '--json', JSON.stringify(j)];
        if (has('over')) a.push('--over', arg('over'));
        const p = spawn(process.execPath, a, { stdio: ['ignore', 'pipe', 'inherit'] });
        let buf = ''; p.stdout.on('data', d => buf += d);
        p.on('close', () => { active--; done++;
          try { out.push(JSON.parse(buf.trim())); } catch { console.error('run failed'); }
          if (done % par === 0 || done === jobs.length) console.error(`  ${done}/${jobs.length}`);
          if (done === jobs.length) res(); else pump();
        });
      }
    }; pump();
  });

  const byS = new Map();
  for (const r of out) { const k = r.s0.toFixed(4); if (!byS.has(k)) byS.set(k, []); byS.get(k).push(r); }
  const rows = [...byS.entries()].sort((a, b) => +a[0] - +b[0]).map(([k, rs]) => {
    const preyShare = rs.map(r => r.preyShareHi).filter(v => v != null);
    const predShare = rs.map(r => r.predShareHi).filter(v => v != null);
    return { s0: +k, drLo: rs[0].drLo, drHi: rs[0].drHi,
      preyShare: mean(preyShare), preySd: sdev(preyShare), preyN: preyShare.length,
      predShare: mean(predShare), predSd: sdev(predShare), predN: predShare.length,
      preyBirths: mean(rs.map(r => r.preyBirthsLo + r.preyBirthsHi)),
      predBirths: mean(rs.map(r => r.predBirthsLo + r.predBirthsHi)) };
  });

  console.error(`\n  Δρ(blunt)   Δρ(sharp)   class          prey share  ±sd     pred share  ±sd    births p/d`);
  for (const r of rows) {
    const flagP = r.preyShare != null && r.preySd != null && (r.preyShare - 0.5) > 2 * r.preySd / Math.sqrt(r.preyN) ? '  <= sharper wins' : '';
    console.error(`  ${degOf(r.drLo).toFixed(2).padStart(8)}°  ${degOf(r.drHi).toFixed(2).padStart(8)}°  ` +
      `${nilssonClass(r.drLo).padEnd(14)} ${f3(r.preyShare)}  ${f3(r.preySd)}   ${f3(r.predShare)}  ${f3(r.predSd)}  ` +
      `${Math.round(r.preyBirths)}/${Math.round(r.predBirths)}${flagP}`);
  }

  const d = new Date(), p2 = n => String(n).padStart(2, '0');
  const stamp = `${d.getFullYear()}${p2(d.getMonth() + 1)}${p2(d.getDate())}-${p2(d.getHours())}${p2(d.getMinutes())}${p2(d.getSeconds())}`;
  let md = `# Selection gradient on the eye — invasion test\n\ngenerated \`${d.toISOString()}\`\n\n`;
  md += `Method: seed the world 50/50 with two fixed genomes one step apart on the eye axis, mutation OFF, `;
  md += `run ${ticks} ticks × ${seeds} seeds. **Share of births going to the sharper morph.** 0.5 = neutral, `;
  md += `>0.5 = the environment selects for a better eye at that point on the axis.\n\n`;
  if (has('over')) md += `Overrides: \`${arg('over')}\`\n\n`;
  md += `| Δρ blunt | Δρ sharp | Nilsson class | prey share of births | ±sd | predator share | ±sd | total births prey/pred |\n|---|---|---|---|---|---|---|---|\n`;
  for (const r of rows)
    md += `| ${degOf(r.drLo).toFixed(2)}° | ${degOf(r.drHi).toFixed(2)}° | ${nilssonClass(r.drLo)} | **${f3(r.preyShare)}** | ${f3(r.preySd)} | **${f3(r.predShare)}** | ${f3(r.predSd)} | ${Math.round(r.preyBirths)}/${Math.round(r.predBirths)} |\n`;
  md += `\n## Reading this\n\nA share significantly above 0.5 at a rung means a sharper eye is favoured there. `;
  md += `A run of rungs all above 0.5 is a continuous ramp an evolving population can climb. `;
  md += `Any rung at 0.5 is a flat spot where only drift operates — evolution will stall there.\n`;
  const file = join(LOGS, `${stamp}-gradient.md`);
  writeFileSync(file, md);
  writeFileSync(join(LOGS, `${stamp}-gradient.csv`),
    ['s0,drhoLoDeg,drhoHiDeg,preyShareHi,preySd,predShareHi,predSd,preyBirths,predBirths',
     ...rows.map(r => [r.s0, degOf(r.drLo), degOf(r.drHi), r.preyShare, r.preySd, r.predShare, r.predSd, r.preyBirths, r.predBirths].join(','))].join('\n'));
  console.error(`\nreport -> ${file}`);
}
