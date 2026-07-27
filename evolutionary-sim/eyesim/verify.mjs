/**
 * Acceptance criteria and hard invariants from eye-sim-build-spec.md sections 17 and 20.
 *
 *   bun evolutionary-sim/eyesim/verify.mjs                # invariants + fast criteria
 *   bun evolutionary-sim/eyesim/verify.mjs --full         # includes the long evolution runs
 *   bun evolutionary-sim/eyesim/verify.mjs --only I1,V9
 *
 * Every check reports PASS / FAIL / SKIP with the observed value, never a bare
 * boolean — a criterion you cannot see the number behind is not verified.
 */
import { readFileSync, readdirSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { World, depthUncertainty } from './core/world.mjs';
import * as C from './core/constants.mjs';
import { makeRng } from './core/rng.mjs';
import { foundingGenome, mutate, eyeGenes, GENE_SPEC, GENE_NAMES, LOG_GENES } from './core/genome.mjs';
import { resolveEye, detects, effectiveContrast, photonCatch, detectionRange } from './core/optics.mjs';
import { runOne } from './run.mjs';

const HERE = fileURLToPath(new URL('.', import.meta.url));
const CORE = join(HERE, 'core');
const LOGS = join(HERE, 'logs');

const argv = process.argv.slice(2);
const has = k => argv.includes('--' + k);
const arg = (k, d) => { const i = argv.indexOf('--' + k); return i >= 0 ? argv[i + 1] : d; };
const only = arg('only', null)?.split(',').map(s => s.trim());

const results = [];
const record = (id, name, status, observed, note = '') =>
  results.push({ id, name, status, observed, note });

const shouldRun = id => !only || only.includes(id);

/* ============================ hard invariants ============================ */

function readCore() {
  const out = {};
  for (const f of readdirSync(CORE)) out[f] = readFileSync(join(CORE, f), 'utf8');
  return out;
}

function stripComments(src) {
  return src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
}

function invariants() {
  const src = readCore();
  const world = stripComments(src['world.mjs']);

  /* I1 — no survival/energy/birth/capture rule reads acuity */
  if (shouldRun('I1')) {
    // Everything after the perception block in stepFocal, plus the energy,
    // reproduction and capture paths.
    const guarded = [
      section(world, '--- feeding', '--- hazards'),
      section(world, '--- digestion and metabolism', '--- hazards'),
      section(world, '--- hazards', 'st.depthByHour'),
      section(world, 'reproduce() {', 'resample(agents'),
    ].join('\n');
    const banned = /\b(deltaRho|acuity|sharpness|nilssonClass|eye\.pixels)\b/;
    const hit = banned.exec(guarded);
    record('I1', 'No energy/birth/death/capture rule reads acuity',
      hit ? 'FAIL' : 'PASS', hit ? hit[0] : 'no matches in guarded sections');
  }

  /* I2 — no sight-range parameter anywhere */
  if (shouldRun('I2')) {
    const banned = /\b(sightRange|MAX_SIGHT|BASE_SIGHT|SIGHT_RANGE|visionRange)\b/;
    const hits = Object.entries(src).filter(([, s]) => banned.test(s)).map(([f]) => f);
    record('I2', 'No sight-range constant exists', hits.length ? 'FAIL' : 'PASS',
      hits.length ? hits.join(',') : 'none');
  }

  /* I3 — no code outside reporting branches on a Nilsson class */
  if (shouldRun('I3')) {
    // The test that matters is not "is the word present" but "does control flow
    // ever depend on it". Flag any line where a class value feeds a branch.
    const offenders = [];
    for (const [file, s] of Object.entries(src)) {
      const body = stripComments(s);
      for (const line of body.split('\n')) {
        if (!/nilssonClass|eyeClass|eye_class/.test(line)) continue;
        if (file === 'optics.mjs' && /export function nilssonClass/.test(line)) continue;
        const branches = /\b(if|while|for|return\s+\w+\s*[<>=!])\b|[<>]=?|===|!==|\?/;
        if (branches.test(line.replace(/=>/g, ''))) offenders.push(`${file}: ${line.trim()}`);
      }
    }
    record('I3', 'Control flow never depends on a Nilsson class',
      offenders.length ? 'FAIL' : 'PASS',
      offenders.length ? offenders.join(' | ')
        : 'class computed in optics.nilssonClass() and consumed only by snapshot()');
  }

  /* I4 — every decision parameter is a gene, not a constant */
  if (shouldRun('I4')) {
    const required = ['preferredDepthDay', 'preferredDepthNight', 'foragingTrigger',
      'satiationThreshold', 'activityStartH', 'activityLengthH', 'wPredator', 'wFood',
      'rhoBodyDorsal', 'rhoBodyVentral', 'clutchSize', 'spawnEnergyThreshold',
      'integrationTimeS'];
    const missing = required.filter(g => !(g in GENE_SPEC));
    record('I4', 'All decision parameters are genes', missing.length ? 'FAIL' : 'PASS',
      missing.length ? `missing: ${missing}` : `${GENE_NAMES.length} genes`);
  }

  /* ===================================================================
   * ANTI-RIGGING INVARIANTS (I9-I13)
   *
   * I1-I3 catch the obvious cheat: a fitness term that reads acuity. These catch
   * the subtle ones — ways the world or the machinery can be built so the desired
   * outcome is engineered rather than selected. The governing rule:
   *
   *   Nothing may reward a morphological milestone, bias a direction of change,
   *   or make the answer unreachable-except-one-way. The eye must improve ONLY
   *   because seeing better returns more energy or fewer deaths, through the
   *   same physics that applies to an eye that stays bad.
   * =================================================================== */

  /* I9 — no hand-set step in any perception -> fitness mapping.
   *
   * I1 only guards the energy/birth/death/capture blocks, so a discontinuous
   * reward sitting in the PERCEPTION block slips past it. Test the REAL exported
   * function, not a copy of it: it must be monotone with no jump between
   * neighbouring samples larger than a smooth curve would produce.
   */
  if (shouldRun('I9')) {
    const mk = px => ({ pixels: px });
    const xs = [];
    for (let lp = 0; lp <= 300; lp++) xs.push(Math.pow(10, lp / 100));
    let worstJump = 0, monotone = true, prev = Infinity;
    for (const px of xs) {
      const v = depthUncertainty(mk(px), 1e6, 0.25, false);
      if (v > prev + 1e-12) monotone = false;
      if (Number.isFinite(prev)) worstJump = Math.max(worstJump, (prev - v) / Math.max(prev, 1e-9));
      prev = v;
    }
    record('I9', 'Perception->fitness mapping is continuous (no milestone rewards)',
      monotone && worstJump < 0.08 ? 'PASS' : 'FAIL',
      `depthUncertainty() over 301 samples of pixels in [1, 1000]: monotone=${monotone}, ` +
      `largest single-step drop ${(worstJump * 100).toFixed(2)}%`);
  }

  /* I10 — mutation is unbiased. No hidden drift term pushing eyes toward better. */
  if (shouldRun('I10')) {
    const rng = makeRng(99);
    const base = foundingGenome(rng);
    // Start from mid-range so bounds cannot mask a bias.
    for (const k of GENE_NAMES) {
      const [lo, hi] = GENE_SPEC[k];
      base[k] = lo + 0.5 * (hi - lo);
    }
    const drift = {};
    const N = 20000;
    for (const k of GENE_NAMES) drift[k] = 0;
    for (let i = 0; i < N; i++) {
      const m = mutate(base, rng, 0.05);
      for (const k of GENE_NAMES) {
        drift[k] += LOG_GENES.has(k)
          ? Math.log(Math.max(m[k], 1e-9)) - Math.log(Math.max(base[k], 1e-9))
          : m[k] - base[k];
      }
    }
    let worst = null, worstZ = 0;
    for (const k of GENE_NAMES) {
      const [lo, hi] = GENE_SPEC[k];
      // Measure the bias in the metric the mutation operator actually works in.
      // A log-normal step is symmetric multiplicatively, so its LINEAR mean is
      // positive by Jensen even with zero bias — measuring linearly would flag a
      // bias that is not there, and hide one that is.
      const z = LOG_GENES.has(k)
        ? Math.abs(drift[k] / N) / (Math.log(hi) - Math.log(Math.max(lo, 1e-6)))
        : Math.abs(drift[k] / N) / (hi - lo);
      if (z > worstZ) { worstZ = z; worst = k; }
    }
    record('I10', 'Mutation is directionally unbiased (no hidden push toward better eyes)',
      worstZ < 0.005 ? 'PASS' : 'FAIL',
      `largest mean drift over ${N} mutations: ${worst} at ` +
      `${(worstZ * 100).toFixed(3)}% of its range per generation ` +
      `(log genes measured in log space, where their operator is symmetric)`);
  }

  /* I11 — the null control.
   *
   * THE decisive anti-rigging test. Disable perception entirely (blindFounders)
   * but leave mutation on. Nothing in the world can read the eye, so the eye
   * genes are neutral and must NOT systematically improve. If deltaRho still
   * falls, something other than selection-on-vision is driving it — a one-way
   * mutation street, a bounds artefact, or a hidden reward.
   */
  if (shouldRun('I11')) {
    const opts = { generations: 150, epoch: 'pre_predation', predationEnabled: false,
      bearingErrorEnabled: false, logEvery: 25, printEvery: 1e9 };
    const seeing = runOne({ ...opts }, { quiet: true });
    const blind = runOne({ ...opts, blindFounders: true }, { quiet: true });
    const sDr = seeing.last?.deltaRhoDeg, bDr = blind.last?.deltaRhoDeg;
    // Blind must stay coarse; seeing must improve by orders of magnitude.
    const pass = bDr > 60 && sDr < bDr / 10;
    record('I11', 'NULL CONTROL: with perception disabled the eye does NOT improve',
      pass ? 'PASS' : 'FAIL',
      `blind world ends at ${bDr?.toFixed(1)}deg (started 180); ` +
      `seeing world ends at ${sDr?.toFixed(3)}deg. Ratio ${(bDr / sDr).toFixed(0)}x`);
  }

  /* I12 — report which evolved genes finish pinned at bounds I chose.
   *
   * A gene that ends at its cap is NOT evidence the model found that value: the
   * cap was my choice, often taken from the same literature the result is being
   * compared against. This does not fail the build, but it must be surfaced so
   * no such gene is ever quoted as an independent match.
   */
  if (shouldRun('I12')) {
    const files = readdirSync(LOGS).filter(f => f.endsWith('.csv'));
    if (!files.length) { record('I12', 'Genes pinned at author-chosen bounds', 'SKIP', 'no traces'); }
    else {
      const f = files.sort().pop();
      const rows = readFileSync(join(LOGS, f), 'utf8').trim().split('\n');
      const head = rows[0].split(','), last = rows[rows.length - 1].split(',');
      const pinned = [], interior = [];
      for (const k of ['integrationTimeS', 'membraneLayers', 'lensIndexGradient',
        'patchWidthMm', 'receptorCount', 'apertureRatio', 'invagination', 'screeningPigment']) {
        const i = head.indexOf('gene_' + k);
        if (i < 0) continue;
        const v = Number(last[i]), [lo, hi] = GENE_SPEC[k];
        if (v >= hi * 0.999 || v <= lo * 1.02) pinned.push(`${k}=${v.toPrecision(4)}`);
        else interior.push(k);
      }
      record('I12', 'Genes pinned at author-chosen bounds (must not be quoted as matches)',
        'INFO', `pinned: ${pinned.join(', ') || 'none'} | interior: ${interior.join(', ')} ` +
        `(trace ${f})`);
    }
  }

  /* I6 — delta_rho <= PI for every genome in the search space */
  if (shouldRun('I6')) {
    const rng = makeRng(7);
    let worst = 0, violations = 0;
    for (let i = 0; i < 5000; i++) {
      const g = {};
      for (const name of GENE_NAMES) {
        const [lo, hi] = GENE_SPEC[name];
        g[name] = rng.range(lo, hi);
      }
      const eye = resolveEye(eyeGenes(g));
      worst = Math.max(worst, eye.deltaRho);
      if (eye.deltaRho > Math.PI + 1e-9 || !Number.isFinite(eye.deltaRho)) violations++;
    }
    record('I6', 'deltaRho <= PI across the search space', violations ? 'FAIL' : 'PASS',
      `max=${(worst * 180 / Math.PI).toFixed(2)}deg over 5000 genomes, ${violations} violations`);
  }

  /* I7 — detection is continuous and monotone in delta_rho, no flat interval */
  if (shouldRun('I7')) {
    const cBeam = 0.55 * C.C_BEAM_RATIO;
    const radiance = 5e4;
    const rows = [];
    let monotone = true;
    for (const dist of [0.25, 0.5, 1, 2, 4, 8]) {
      let prev = -Infinity, ok = true;
      for (const drDeg of [90, 30, 10, 3, 1, 0.3, 0.1]) {
        const dr = drDeg * Math.PI / 180;
        const cEff = Math.abs(effectiveContrast(-0.85, dist, 0.026, dr, cBeam));
        const s = cEff * Math.sqrt(photonCatch(1.0, radiance, 0.05));
        if (s < prev - 1e-12) ok = false;
        prev = s;
      }
      rows.push(`${dist}m:${ok ? 'mono' : 'NONMONO'}`);
      if (!ok) monotone = false;
    }
    record('I7', 'Detection strictly improves as deltaRho falls (no flat interval)',
      monotone ? 'PASS' : 'FAIL', rows.join(' '));
  }

  /* I8 — capture success is never an input */
  if (shouldRun('I8')) {
    const banned = /\b(captureSuccessRate|CAPTURE_SUCCESS|pCaptureConst)\b/;
    const hits = Object.entries(src).filter(([, s]) => banned.test(s)).map(([f]) => f);
    record('I8', 'capture success is not a settable parameter', hits.length ? 'FAIL' : 'PASS',
      hits.length ? hits.join(',') : 'computed in captureProbability() only');
  }
}

const section = (src, from, to) => {
  const i = src.indexOf(from), j = src.indexOf(to, i + 1);
  return i < 0 ? '' : src.slice(i, j < 0 ? src.length : j);
};

/* ======================= physics-level criteria ======================= */

function physicsChecks() {
  /* V9 — class IV unreachable without membrane stacking */
  if (shouldRun('V9')) {
    const rng = makeRng(11);
    let bestWithStacking = Infinity, bestWithout = Infinity;
    const radiance = 5e4;      // 15 m depth, epoch-3 clarity, noon
    for (let i = 0; i < 40000; i++) {
      const g = {};
      for (const name of GENE_NAMES) {
        const [lo, hi] = GENE_SPEC[name];
        g[name] = rng.range(lo, hi);
      }
      g.integrationTimeS = 0.05;
      for (const stacking of [true, false]) {
        const gg = { ...g, membraneLayers: stacking ? g.membraneLayers : 1 };
        const eye = resolveEye(eyeGenes(gg));
        const N = photonCatch(eye.sensitivity, radiance, gg.integrationTimeS);
        // A class-IV eye must resolve 1-5 deg AND have the photons to use it:
        // 5000 photons is Nilsson's sample size for high-resolution vision.
        if (N < 5000) continue;
        const deg = eye.deltaRho * 180 / Math.PI;
        if (stacking) bestWithStacking = Math.min(bestWithStacking, deg);
        else bestWithout = Math.min(bestWithout, deg);
      }
    }
    const pass = bestWithStacking <= 5 && bestWithout > bestWithStacking;
    record('V9', 'Class IV needs membrane stacking (with 5000-photon budget)',
      pass ? 'PASS' : 'FAIL',
      `best with stacking ${bestWithStacking.toFixed(3)}deg, without ${bestWithout === Infinity ? 'unreachable' : bestWithout.toFixed(3) + 'deg'}`);
  }

  /* V8 — acuity payoff flattens near the contrast horizon 4/c */
  if (shouldRun('V8')) {
    const kd = 0.55, cBeam = kd * C.C_BEAM_RATIO;
    const horizon = 4 / cBeam;
    // Detection range as a function of acuity, for a fixed photon budget.
    const pts = [];
    for (const drDeg of [90, 45, 20, 10, 5, 2, 1, 0.5, 0.25, 0.1]) {
      const dr = drDeg * Math.PI / 180;
      const r = detectionRange(-0.85, 0.026, dr, cBeam, 1.0, 5e4, 0.05, 30);
      pts.push({ drDeg, r });
    }
    const rMax = Math.max(...pts.map(p => p.r));
    // Where does the curve reach 90% of its asymptote?
    const knee = pts.find(p => p.r >= 0.9 * rMax);
    const ratio = rMax / horizon;
    const pass = ratio > 0.5 && ratio < 2.0;
    record('V8', 'Acuity payoff saturates near the 4/c contrast horizon',
      pass ? 'PASS' : 'FAIL',
      `asymptote ${rMax.toFixed(2)}m, 4/c = ${horizon.toFixed(2)}m, ratio ${ratio.toFixed(2)}, 90% reached at deltaRho ${knee?.drDeg}deg`);
  }

  /* Cross-check: the Rose criterion reproduces Nilsson's contrast thresholds */
  if (shouldRun('NILSSON')) {
    // The real claim is not "his numbers equal 2/sqrt(N)" but "his three
    // independently-stated class thresholds imply ONE signal-to-noise criterion".
    // Solve each class for its implied SNR and check they agree.
    const rows = [
      { cls: 'I', n: 50, contrast: 0.30 },
      { cls: 'II', n: 500, contrast: 0.10 },
      { cls: 'III/IV', n: 5000, contrast: 0.03 },
    ].map(r => ({ ...r, impliedSnr: r.contrast * Math.sqrt(r.n) }));
    const snrs = rows.map(r => r.impliedSnr);
    const spread = (Math.max(...snrs) - Math.min(...snrs)) / (snrs.reduce((a, b) => a + b) / 3);
    record('NILSSON', "Nilsson's three class thresholds imply a single SNR criterion",
      spread < 0.10 ? 'PASS' : 'FAIL',
      rows.map(r => `class ${r.cls} (N=${r.n}, C=${r.contrast}) -> SNR ${r.impliedSnr.toFixed(2)}`).join('; ')
      + ` | spread ${(spread * 100).toFixed(1)}%, model uses ${C.SNR_THRESHOLD}`);
  }

  /* Energy-budget self-consistency: derived daily rations vs measured bands */
  if (shouldRun('BUDGET')) {
    const rows = [];
    for (const name of ['anomalocaris', 'isoxys', 'myllokunmingid', 'chaetognath']) {
      const s = C.SPECIES[name];
      const smr = C.smrJPerDay(s.massG, 28);
      const intake = smr * C.FMR_MULT / s.assimilation;
      const pct = 100 * intake / (s.massG * C.E_SOFT_PELAGIC);
      rows.push(`${name} ${pct.toFixed(1)}%/d`);
    }
    const anomPct = 100 * (C.smrJPerDay(250, 28) * C.FMR_MULT / C.ASSIM_CARNIVORE)
      / (250 * C.E_SOFT_PELAGIC);
    record('BUDGET', 'Apex predator ration in the 1-15%/day measured band',
      anomPct >= 1 && anomPct <= 15 ? 'PASS' : 'FAIL', rows.join(', '));
  }

  /* Starvation clocks, derived */
  if (shouldRun('STARVE')) {
    const rows = [];
    for (const name of ['anomalocaris', 'isoxys', 'myllokunmingid', 'chaetognath']) {
      const s = C.SPECIES[name];
      const reserve = C.RESERVE_FRACTION * s.massG * C.E_SOFT_PELAGIC;
      const cost = C.STARVATION_DOWNREG * C.smrJPerDay(s.massG, 28);
      rows.push(`${name} ${(reserve / cost).toFixed(1)}d`);
    }
    const anom = (C.RESERVE_FRACTION * 250 * C.E_SOFT_PELAGIC)
      / (C.STARVATION_DOWNREG * C.smrJPerDay(250, 28));
    const mylo = (C.RESERVE_FRACTION * 0.2 * C.E_SOFT_PELAGIC)
      / (C.STARVATION_DOWNREG * C.smrJPerDay(0.2, 28));
    record('STARVE', 'Predator outlasts prey by ~an order of magnitude',
      anom / mylo > 5 ? 'PASS' : 'FAIL', rows.join(', ') + ` (ratio ${(anom / mylo).toFixed(1)}x)`);
  }
}

/* ===================== simulation-level criteria ===================== */

async function simChecks() {
  /* V15 — blind founders are viable */
  if (shouldRun('V15')) {
    const r = runOne({ generations: 60, blindFounders: true, mutationEnabled: false,
      logEvery: 10, printEvery: 1e9 }, { quiet: true });
    const alive = r.last && r.last.nIndividuals > 0;
    record('V15', 'Blind founders persist (non-visual senses are sufficient)',
      alive ? 'PASS' : 'FAIL',
      `N=${r.last?.nIndividuals ?? 0} after ${r.last?.generation ?? 0} generations, ` +
      `predators ${JSON.stringify(r.last?.predators ?? {})}`);
  }

  /* V7 — capture success is between 0 and 1 and failures are common */
  if (shouldRun('V7')) {
    const r = runOne({ generations: 60, logEvery: 5, printEvery: 1e9 }, { quiet: true });
    const cs = r.trace.map(t => t.captureSuccess).filter(v => v !== null);
    const med = cs.sort((a, b) => a - b)[Math.floor(cs.length / 2)];
    record('V7', 'Capture success < 1 with common failures',
      med !== undefined && med > 0 && med < 1 ? 'PASS' : 'FAIL',
      `median ${med?.toFixed(3)} over ${cs.length} generations (spec expects 0.15-0.35)`,
      med > 0.35 ? 'ABOVE the expected band' : '');
  }

  /* V2 — class IV is reached from a flat patch */
  if (shouldRun('V2')) {
    const r = runOne({ generations: 250, epoch: 'pre_predation', predationEnabled: false,
      bearingErrorEnabled: false, logEvery: 25, printEvery: 1e9 }, { quiet: true });
    const dr = r.last?.deltaRhoDeg;
    record('V2', 'Class IV reached (deltaRho <= 5 deg) from a flat 180 deg patch',
      dr !== undefined && dr <= 5 ? 'PASS' : 'FAIL',
      `${r.trace[0]?.deltaRhoDeg?.toFixed(1)}deg -> ${dr?.toFixed(3)}deg, ` +
      `pixels ${r.trace[0]?.pixels?.toFixed(1)} -> ${r.last?.pixels?.toFixed(0)}, ` +
      `class ${r.trace[0]?.nilssonClass} -> ${r.last?.nilssonClass}, N=${r.last?.nIndividuals}`);
  }

  /* V17 — the climb happens with no predators at all */
  if (shouldRun('V17')) {
    const r = runOne({ generations: 250, epoch: 'pre_predation', predationEnabled: false,
      bearingErrorEnabled: false, logEvery: 25, printEvery: 1e9 }, { quiet: true });
    const deaths = r.last?.deaths ?? {};
    record('V17', 'Eye climbs with ZERO predators in the world',
      (r.last?.deltaRhoDeg ?? 999) < 40 && (deaths.predation ?? 0) === 0 ? 'PASS' : 'FAIL',
      `deltaRho -> ${r.last?.deltaRhoDeg?.toFixed(3)}deg, class ${r.last?.nilssonClass}, ` +
      `predation deaths ${deaths.predation}, starvation ${deaths.starvation}, uv ${deaths.uv}`);
  }

  /* ZOOCTL — the mechanism test: remove small discrete targets, the climb stalls */
  if (shouldRun('ZOOCTL')) {
    const opts = { generations: 250, epoch: 'pre_predation', predationEnabled: false,
      bearingErrorEnabled: false, logEvery: 25, printEvery: 1e9 };
    const withZoo = runOne({ ...opts, zooFraction: 0.5 }, { quiet: true });
    const noZoo = runOne({ ...opts, zooFraction: 0 }, { quiet: true });
    const a = withZoo.last?.deltaRhoDeg, b = noZoo.last?.deltaRhoDeg;
    record('ZOOCTL', 'Class III->IV requires small discrete targets, not a smooth field',
      a < 5 && b > 15 ? 'PASS' : 'FAIL',
      `with particles ${a?.toFixed(3)}deg (class ${withZoo.last?.nilssonClass}); ` +
      `field only ${b?.toFixed(2)}deg (class ${noZoo.last?.nilssonClass})`);
  }

  /* V10 — linear eye cost should give runaway acuity relative to superlinear */
  if (shouldRun('V10') && has('full')) {
    const sup = runOne({ generations: 400, eyeCostExponent: 0.33, logEvery: 50, printEvery: 1e9 }, { quiet: true });
    const lin = runOne({ generations: 400, eyeCostExponent: 1.0, logEvery: 50, printEvery: 1e9 }, { quiet: true });
    record('V10', 'Superlinear eye cost creates an optimum; linear does not',
      'INFO', `superlinear end deltaRho ${sup.last?.deltaRhoDeg?.toFixed(2)}deg, ` +
      `linear end deltaRho ${lin.last?.deltaRhoDeg?.toFixed(2)}deg`);
  }
}

/* ============================== reporting ============================== */

function report() {
  const w = [4, 62, 6];
  const line = (a, b, c) => `${String(a).padEnd(w[0])}  ${String(b).padEnd(w[1])}  ${c}`;
  const out = [];
  out.push(line('ID', 'Criterion', 'Result'));
  out.push(line('-'.repeat(w[0]), '-'.repeat(w[1]), '------'));
  for (const r of results) {
    out.push(line(r.id, r.name, r.status));
    out.push(`      observed: ${r.observed}`);
    if (r.note) out.push(`      note: ${r.note}`);
  }
  const pass = results.filter(r => r.status === 'PASS').length;
  const fail = results.filter(r => r.status === 'FAIL').length;
  const info = results.filter(r => r.status === 'INFO').length;
  out.push('');
  out.push(`${pass} PASS, ${fail} FAIL, ${info} INFO of ${results.length} checks`);
  const text = out.join('\n');
  console.log(text);
  writeFileSync(join(LOGS, 'verification.txt'), text);
  writeFileSync(join(LOGS, 'verification.json'), JSON.stringify(results, null, 2));
  return fail === 0;
}

invariants();
physicsChecks();
await simChecks();
const ok = report();
process.exit(ok ? 0 : 1);
