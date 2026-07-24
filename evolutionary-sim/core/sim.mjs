/**
 * Headless eye-evolution core.
 *
 * Design rule for this file: the OPTICS and the DETECTION LAW are physics, the
 * ECOLOGY is a world, and NOTHING anywhere rewards a sharp eye directly. There is
 * no fitness function, no "sight range" slider, no acuity term in any survival or
 * breeding rule. An animal lives if it eats and does not get eaten. That is all.
 *
 * The three equations that matter:
 *
 *   Δρ  = min(π, sqrt( (2·atan(A/2f)·(1−lens))² + (λ/A)² ))       resolution
 *   S   = (θ/Δρ)² · exp(−d/atten),   θ = targetDiameter / d        signal strength
 *   p   = S / (1 + S)                                              chance of resolving it
 *
 * There is no "sight range". You resolve an object when its angular size θ beats
 * your acceptance angle Δρ; below that the contrast is diluted across the cone as
 * (θ/Δρ)², and water absorbs the rest (Beer–Lambert). p = S/(1+S) is just the
 * saturating read of that signal: p = ½ exactly when θ = Δρ, in clear water.
 *
 * Consequences that come for free and were NOT put in by hand:
 *   - detection is graded, so EVERY reduction in Δρ pays at EVERY distance.
 *     There is no threshold to cross and no flat valley to drift across.
 *   - big things are visible from further away than small things
 *   - halving Δρ quadruples the signal, forever — no ceiling, no baseline, no slider
 *   - encounter rate rises with Δρ⁻¹, so a 1% sharper eye is worth ~1% more food
 *     at every scale. That is the Nilsson & Pelger gradient, arrived at honestly.
 *   - water clarity (`atten`) is an ENVIRONMENTAL variable, not an eye property.
 *     A perfect eye in soup sees nothing. This is the sweepable Cambrian knob.
 *
 * And the second half of resolution, which matters as much as range:
 *   a detected target's bearing is known only to ±Δρ. A blind animal that senses
 *   a predator has no idea which way to run. Direction accuracy improves with the
 *   eye automatically — that is Nilsson class I → II, not coded as a stage.
 */

/* ----------------------------------- rng ---------------------------------- */
export function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* --------------------------------- defaults -------------------------------- */
export const DEFAULTS = {
  seed: 1,
  ticks: 200000,
  worldW: 3000, worldH: 2000,

  // --- optics constants (physics) ---
  lambda: 0.0005,               // wavelength in the same length unit as A
  aMin: 0.005, aMax: 2.0,
  fMin: 0.05,  fMax: 5.0,
  lensOn: 0.15, lensFull: 0.7,  // a lens can only form once the pit is deep enough
  mut: 0.03,                    // per-birth lognormal sigma on A,f and gaussian on L

  // --- bodies (diameters are what set angular size) ---
  // Visual size and reach are DIFFERENT things. A big animal is visible from far
  // away but still only catches at mouth range — so being large is not a free win.
  preyR: 5, predR: 16, foodR: 1.5,
  predBite: 3,                  // capture radius, NOT the predator's visual size
  preyBite: 4,                  // how close a prey must be to eat a particle

  // --- resources are patchy, which is the whole reason distance vision pays ---
  // A single 3px particle is invisible until you are nearly touching it. A 190px
  // drift of them is a big target a crude eye can steer toward. Real foragers
  // navigate to a patch, then search within it. Patches regrow (primary production)
  // and turn over, so foraging is never solved once and for all.
  nPatches: 85, patchR: 95, patchStock: 110,
  patchRegen: 0.02,             // particles regrown per patch per tick
  patchTurnover: 0.00004,       // chance per patch per tick of dying and reappearing elsewhere

  // --- locomotion ---
  preyCruise: 0.75, preySprint: 1.55,
  predCruise: 0.70, predSprint: 1.80,

  // --- energetics: cost of swimming ∝ v³ (drag power), the only "cost" in the model ---
  bmr: 0.030,
  dragK: 0.055, moveExp: 3,

  preyStartE: 70,  preyBreedE: 150,
  predStartE: 320, predBreedE: 700,
  foodE: 26,                    // energy in one food particle
  preyBodyE: 420,               // energy a predator gets from one prey

  // --- the medium: how far light carries. An environmental property, not an eye one. ---
  atten: 250,                   // Beer-Lambert attenuation length, px
  targetMemory: 30,             // ticks an animal keeps a target after losing the signal
  // Predator satiation knob. At ≥ ~2 it never triggers (a true no-op that preserves the
  // baseline exactly); lower it toward ~0.7 to make full predators rest. It is a real
  // stabiliser but, on its own, does NOT resolve the paradox-of-enrichment collapse — the
  // predator/prey system stays bistable (predators evolve eyes and crash prey, OR stay blind
  // and coexist). Documented as a lever, off by default. See CLAUDE-UNDERSTANDING 2026-07-23.
  predSatiated: 10,

  // --- the senses that are NOT eyes ---
  // Chemoreception and mechanoreception: reliable, cheap, and hopelessly short-range.
  // They are why a blind animal can make a living at all. They never improve with Δρ,
  // so everything the eye is worth is the distance BEYOND this radius. Setting these
  // to 0 makes a blind world uninhabitable, which would rig the experiment.
  preyTouch: 14, predTouch: 26,

  // --- when to spend the expensive gait ---
  // Sprinting costs ~7x cruising, so nothing sprints at a target it has merely spotted
  // on the horizon: predators close the distance at cruise and strike late, prey watch
  // and bolt late. Both distances are FIXED and eye-independent — otherwise a better eye
  // would be punished for burning energy on chases it started too early, which would be
  // an artefact of the gait rule rather than anything about vision.
  strikeDist: 55,               // predator sprints only inside this
  panicDist: 45,                // prey sprints only inside this

  // --- manoeuvrability ---
  // An animal cannot snap instantly onto a new heading; it turns at a bounded rate.
  // This is body mechanics, identical for everyone, and it is what makes a CRUDE eye
  // harmless rather than harmful: with a ±150° bearing error, successive estimates
  // disagree and the small turns cancel, so the animal keeps its heading and its
  // ballistic search. With a ±5° error the turns agree and accumulate into homing.
  // Without this, an animal steers instantly onto a wildly wrong bearing every tick,
  // which is WORSE than being blind — a property of instant steering, not of eyes.
  turnRate: 0.12,               // radians per tick

  // --- ecology ---
  nFood: 0, foodRespawn: 0,   // (legacy, unused: food now comes from patches)
  foodCap: 2000,
  nPrey0: 90, nPred0: 16,
  preyCap: 700, predCap: 140,

  // --- starting eye: everyone begins as a near-blind flat patch ---
  startA: 1.0, startF: 0.07, startL: 0.0,

  // --- invasion test: seed two fixed morphs and watch which one wins ---
  // With `mut: 0` this measures the selection coefficient on the eye directly,
  // with no confound from whether mutation can reach the better morph.
  morphs: null,                 // e.g. [{A,f,L},{A,f,L}] assigned round-robin to founders

  // --- experiment switches ---
  predatorsOn: true,
  histEvery: 500,
};

/* --------------------------------- optics ---------------------------------- */
export function makeOptics(P) {
  const lensGate = f => Math.min(1, Math.max(0, (f - P.lensOn) / (P.lensFull - P.lensOn)));
  const effLens = g => g.L * lensGate(g.f);
  // 2·atan(A/2f) is the true half-field of an open pit: it tends to π as the pit
  // flattens, so a flat patch is a hemisphere-accepting receptor and never worse.
  const drho = g => {
    const geom = 2 * Math.atan(g.A / (2 * g.f)) * (1 - effLens(g));
    const diff = P.lambda / g.A;                       // diffraction: punishes tiny apertures
    return Math.min(Math.PI, Math.sqrt(geom * geom + diff * diff));
  };
  return { lensGate, effLens, drho };
}

// sharpness in octaves above a blind hemisphere-accepting patch. z = 0 is blind.
export const sharpness = dr => Math.log2(Math.PI / dr);
export const degOf = dr => dr * 180 / Math.PI;

// Nilsson's functional classes, read off Δρ. Reported, never acted on.
export function nilssonClass(drRad) {
  const d = degOf(drRad);
  if (d > 100) return 'I non-directional';
  if (d > 20)  return 'II directional';
  if (d > 2)   return 'III low-res spatial';
  return 'IV high-res';
}

/* ------------------------------- spatial grid ------------------------------- */
class Grid {
  constructor(w, h, cell) {
    this.cell = cell; this.cols = Math.ceil(w / cell); this.rows = Math.ceil(h / cell);
    this.buckets = new Array(this.cols * this.rows); this.w = w; this.h = h;
    for (let i = 0; i < this.buckets.length; i++) this.buckets[i] = [];
  }
  clear() { for (let i = 0; i < this.buckets.length; i++) this.buckets[i].length = 0; }
  add(o) {
    const cx = Math.floor(o.x / this.cell) % this.cols, cy = Math.floor(o.y / this.cell) % this.rows;
    this.buckets[cy * this.cols + cx].push(o);
  }
  // nearest object to (px,py) within `range`, toroidal. Returns {o,dx,dy,d2} or null.
  // Expanding-ring search: once a hit is closer than the inner edge of the next ring,
  // no further ring can beat it, so stop. Identical results to a full box scan (and it
  // consumes no randomness, so the RNG stream is unaffected) but O(hit) not O(range²) —
  // which matters enormously once eyes get sharp and search radii reach 1000+ px.
  nearest(px, py, range) {
    const c = this.cell;
    const cx = Math.floor(px / c), cy = Math.floor(py / c);
    let best = null, bd = range * range;
    const maxR = Math.min(Math.ceil(range / c), Math.floor(Math.min(this.cols, this.rows) / 2));
    for (let r = 0; r <= maxR; r++) {
      // any object beyond this ring is at least (r-1)*cell away
      if (best && bd <= ((r - 1) * c) * ((r - 1) * c)) break;
      for (let iy = -r; iy <= r; iy++) {
        const onYEdge = (iy === -r || iy === r);
        const gy = ((cy + iy) % this.rows + this.rows) % this.rows;
        for (let ix = -r; ix <= r; ix++) {
          if (!onYEdge && ix !== -r && ix !== r) continue;   // interior already scanned
          const gx = ((cx + ix) % this.cols + this.cols) % this.cols;
          const b = this.buckets[gy * this.cols + gx];
          for (let k = 0; k < b.length; k++) {
            const o = b[k]; if (o.dead) continue;
            let dx = o.x - px, dy = o.y - py;
            if (dx > this.w / 2) dx -= this.w; else if (dx < -this.w / 2) dx += this.w;
            if (dy > this.h / 2) dy -= this.h; else if (dy < -this.h / 2) dy += this.h;
            const d2 = dx * dx + dy * dy;
            if (d2 < bd) { bd = d2; best = { o, dx, dy, d2 }; }
          }
        }
      }
    }
    return best;
  }
}

/* ------------------------------ the simulation ------------------------------ */
export function createSim(opts = {}, hooks = {}) {
  const P = { ...DEFAULTS, ...opts };
  const { drho, effLens } = makeOptics(P);
  const rnd = mulberry32(P.seed);
  const randn = () => {
    let u = 0, v = 0; while (u === 0) u = rnd(); while (v === 0) v = rnd();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  };
  const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
  const W = P.worldW, H = P.worldH;
  const rx = () => rnd() * W, ry = () => rnd() * H;

  const PREY_D = 2 * P.preyR, PRED_D = 2 * P.predR, FOOD_D = 2 * P.foodR;

  /* --- THE detection law. Nothing else in this file turns an eye into an advantage. --- */
  // How far to bother looking: where the signal has fallen to ~2% (p ≈ 0.02).
  const searchRadius = (dr, diam) => Math.min(diam / (dr * Math.sqrt(0.02)), 5 * P.atten);
  // Probability of resolving a target of `diam` at distance `d` with acceptance angle `dr`.
  const pResolve = (dr, diam, d) => {
    const theta = diam / Math.max(d, 1e-6);
    const S = (theta / dr) * (theta / dr) * Math.exp(-d / P.atten);
    return S / (1 + S);
  };
  // A VISUALLY resolved bearing is known only to ±Δρ. A blind animal that sees
  // something knows it is there but not where. Contact senses are not blurred this
  // way — an antenna or a lateral line gives a good bearing over its short reach —
  // so `felt` targets are steered to accurately. That is why blind animals can hunt
  // at all, and why the eye's entire contribution is distance.
  const blur = (dx, dy, dr, felt) => {
    if (felt) return [dx, dy];
    const a = Math.atan2(dy, dx) + randn() * dr, m = Math.hypot(dx, dy) || 1;
    return [Math.cos(a) * m, Math.sin(a) * m];
  };
  // Look for the nearest thing of a kind and try to actually resolve it.
  // `touch` is the eye-independent short-range sense; beyond it, only optics.
  function look(grid, x, y, dr, diam, touch = 0) {
    const cand = grid.nearest(x, y, Math.max(searchRadius(dr, diam), touch));
    if (!cand) return null;
    const d = Math.sqrt(cand.d2);
    if (d <= touch) { cand.felt = true; return cand; }  // felt, not seen
    if (rnd() >= pResolve(dr, diam, d)) return null;
    cand.felt = false; return cand;
  }

  const mutate = g => ({
    A: clamp(g.A * Math.exp(randn() * P.mut), P.aMin, P.aMax),
    f: clamp(g.f * Math.exp(randn() * P.mut), P.fMin, P.fMax),
    L: clamp(g.L + randn() * P.mut, 0, 1),
  });

  let nextId = 1;
  const stats = {
    // per-generation accumulators, so memory stays bounded on long runs
    gen: { prey: new Map(), pred: new Map() },
    hist: [],
    counters: {
      preyEaten: 0, preyStarved: 0, predStarved: 0,
      preyBirths: 0, predBirths: 0, foodEaten: 0,
      preyFleeTicks: 0, preyForageTicks: 0, preyWanderTicks: 0, preyTicks: 0,
      preyPatchVisibleTicks: 0,
      predHuntTicks: 0, predProwlTicks: 0, predWanderTicks: 0, predTicks: 0,
      preyFoodVisibleTicks: 0, predPreyVisibleTicks: 0,
      capturesWhileHunting: 0, capturesBlind: 0,
    },
    mutDelta: { prey: [], pred: [] },
  };
  const genBucket = (kind, gen) => {
    let m = stats.gen[kind].get(gen);
    if (!m) { m = { gen, n: 0, sumZ: 0, sumZ2: 0, sumDr: 0, nEnded: 0, sumW: 0, sumWZ: 0,
                    sumEndZ: 0, sumLife: 0, sumA: 0, sumF: 0, sumL: 0 };
      stats.gen[kind].set(gen, m); }
    return m;
  };

  const morphTally = { prey: {}, pred: {} };   // cumulative births per seeded morph
  function birth(kind, g, x, y, gen, E, morph = -1) {
    const dr = drho(g);
    const a = { id: nextId++, kind, g, dr, z: sharpness(dr), gen,
      x: (x + W) % W, y: (y + H) % H,
      vx: rnd() * 2 - 1, vy: rnd() * 2 - 1, E, born: tick, offspring: 0, dead: false,
      fleeMem: 0, huntMem: 0, lastThreat: null, lastSeen: null, morph };
    if (morph >= 0) { morphTally[kind][morph] = (morphTally[kind][morph] || 0) + 1; }
    const m = genBucket(kind, gen);
    m.n++; m.sumZ += a.z; m.sumZ2 += a.z * a.z; m.sumDr += dr;
    m.sumA += g.A; m.sumF += g.f; m.sumL += g.L;
    return a;
  }
  function death(a) {
    a.dead = true;
    const m = genBucket(a.kind, a.gen);
    m.nEnded++; m.sumW += a.offspring; m.sumWZ += a.offspring * a.z;
    m.sumEndZ += a.z; m.sumLife += (tick - a.born);
  }

  let tick = 0;
  let prey = [], preds = [], food = [], patches = [];
  const startG = () => ({ A: P.startA, f: P.startF, L: P.startL });

  const wrapx = v => (v % W + W) % W, wrapy = v => (v % H + H) % H;
  const norm = (dx, dy) => { const m = Math.hypot(dx, dy) || 1; return [dx / m, dy / m]; };
  // rotate the current heading toward the desired one by at most turnRate radians
  const steer = (vx, vy, dx, dy) => {
    const cur = Math.atan2(vy, vx), want = Math.atan2(dy, dx);
    let d = want - cur;
    while (d > Math.PI) d -= 2 * Math.PI;
    while (d < -Math.PI) d += 2 * Math.PI;
    const a = cur + Math.max(-P.turnRate, Math.min(P.turnRate, d));
    return [Math.cos(a), Math.sin(a)];
  };
  const moveCost = v => P.bmr + P.dragK * Math.pow(v, P.moveExp);

  const PATCH_D = 2 * P.patchR;
  function newPatch() {
    const p = { x: rx(), y: ry(), stock: P.patchStock, dead: false };
    for (let i = 0; i < p.stock; i++) {
      const a = rnd() * 2 * Math.PI, rr = P.patchR * Math.sqrt(rnd());
      food.push({ x: wrapx(p.x + Math.cos(a) * rr), y: wrapy(p.y + Math.sin(a) * rr), patch: p, dead: false });
    }
    return p;
  }
  for (let i = 0; i < P.nPatches; i++) patches.push(newPatch());
  // founders: either the single flat-patch genome, or the seeded morphs round-robin
  const founder = i => P.morphs ? { ...P.morphs[i % P.morphs.length] } : mutate(startG());
  const founderM = i => P.morphs ? (i % P.morphs.length) : -1;
  for (let i = 0; i < P.nPrey0; i++) prey.push(birth('prey', founder(i), rx(), ry(), 0, P.preyStartE, founderM(i)));
  if (P.predatorsOn) for (let i = 0; i < P.nPred0; i++) preds.push(birth('pred', founder(i), rx(), ry(), 0, P.predStartE, founderM(i)));

  const gFood = new Grid(W, H, 80), gPrey = new Grid(W, H, 80), gPred = new Grid(W, H, 80),
        gPatch = new Grid(W, H, 160);

  // ONE tick. Returns false once the prey line is extinct (nothing more can happen).
  // Batch runs (runSim) and the live browser viewer both drive the SAME step() — there
  // is no second copy of the physics.
  function step() {
    if (prey.length === 0) return false;
    tick++;

    gFood.clear(); for (const f of food) if (!f.dead) gFood.add(f);
    gPrey.clear(); for (const a of prey) gPrey.add(a);
    gPred.clear(); for (const a of preds) gPred.add(a);
    gPatch.clear(); for (const q of patches) if (!q.dead) gPatch.add(q);

    /* ---------------------------- prey ---------------------------- */
    const newPrey = [];
    for (const p of prey) {
      if (p.dead) continue;
      stats.counters.preyTicks++;
      let ax, ay, v = P.preyCruise;
      // --- what to move toward: food up close, a patch far off ---
      const bite = look(gFood, p.x, p.y, p.dr, FOOD_D, P.preyTouch);
      const clump = bite ? null : look(gPatch, p.x, p.y, p.dr, PATCH_D);
      const tgt = bite || clump;
      if (tgt) {
        const [bx, by] = blur(tgt.dx, tgt.dy, p.dr, tgt.felt);
        [ax, ay] = norm(bx, by);
        stats.counters.preyForageTicks++;
        if (bite) stats.counters.preyFoodVisibleTicks++; else stats.counters.preyPatchVisibleTicks++;
      } else {
        ax = p.vx; ay = p.vy; if (rnd() < 0.06) { ax += randn() * 0.7; ay += randn() * 0.7; }
        stats.counters.preyWanderTicks++;
      }
      // --- and what to move away from, blended in ---
      // Spotting a predator far off does not stop an animal feeding; it makes it drift
      // away and keep one eye out. Only a close one triggers real flight. The weight
      // falls off as (panicDist/d)², so the SAME rule gives gentle avoidance at range and
      // full panic at contact — no thresholds on eyesight, only on distance.
      const threat = preds.length ? look(gPred, p.x, p.y, p.dr, PRED_D, P.preyTouch) : null;
      if (threat) { p.fleeMem = P.targetMemory; p.lastThreat = { dx: threat.dx, dy: threat.dy, felt: threat.felt }; }
      else if (p.fleeMem > 0) p.fleeMem--;
      const src = threat || (p.fleeMem > 0 ? p.lastThreat : null);
      if (src) {
        const d = Math.hypot(src.dx, src.dy) || 1;
        const w = Math.min(4, (P.panicDist / d) ** 2);
        const [bx, by] = blur(src.dx, src.dy, p.dr, src.felt);
        const [tx, ty] = norm(bx, by);
        ax -= w * tx; ay -= w * ty;
        if (d <= P.panicDist) { v = P.preySprint; stats.counters.preyFleeTicks++; }
      }
      [ax, ay] = norm(ax, ay);
      const [dx, dy] = steer(p.vx, p.vy, ax, ay); p.vx = dx; p.vy = dy;
      p.x = wrapx(p.x + dx * v); p.y = wrapy(p.y + dy * v);
      p.E -= moveCost(v);

      const got = gFood.nearest(p.x, p.y, P.preyBite);
      if (got) { got.o.dead = true; if (got.o.patch) got.o.patch.stock--;
                 p.E += P.foodE; stats.counters.foodEaten++; }

      if (p.E <= 0) { death(p); stats.counters.preyStarved++; continue; }
      if (p.E >= P.preyBreedE && prey.length + newPrey.length < P.preyCap) {
        const kid = birth('prey', mutate(p.g), p.x + randn() * 4, p.y + randn() * 4, p.gen + 1, p.E / 2, p.morph);
        stats.mutDelta.prey.push(kid.z - p.z);
        p.E /= 2; p.offspring++; stats.counters.preyBirths++; newPrey.push(kid);
      }
      newPrey.push(p);
    }
    prey = newPrey;

    /* -------------------------- predators -------------------------- */
    if (preds.length) {
      gPrey.clear(); for (const a of prey) if (!a.dead) gPrey.add(a);
      const newPreds = [];
      for (const pr of preds) {
        if (pr.dead) continue;
        stats.counters.predTicks++;
        let ax, ay, v;
        // Satiation (handling/digestion): a full predator stops hunting and rests. Gated on
        // HUNGER, never on the eye — a hungry predator with a good eye still hunts hard, a
        // stuffed one ignores prey it could see. Without this, every predator kills on every
        // contact forever and overexploits the prey to extinction (paradox of enrichment).
        const hungry = pr.E < P.predSatiated * P.predBreedE;
        const seen = hungry ? look(gPrey, pr.x, pr.y, pr.dr, PREY_D, P.predTouch) : null;
        if (seen) { pr.huntMem = P.targetMemory; pr.lastSeen = { dx: seen.dx, dy: seen.dy, felt: seen.felt }; }
        else if (!hungry) pr.huntMem = 0;                 // rest: drop any chase
        if (seen || pr.huntMem > 0) {                     // strike: expensive sprint
          if (!seen) pr.huntMem--;
          const src = seen || pr.lastSeen;
          const [bx, by] = blur(src.dx, src.dy, pr.dr, src.felt);
          const [nx, ny] = norm(bx, by); ax = nx; ay = ny;
          v = Math.hypot(src.dx, src.dy) <= P.strikeDist ? P.predSprint : P.predCruise;
          stats.counters.predHuntTicks++; if (seen) stats.counters.predPreyVisibleTicks++;
        } else {
          // A single prey is a small target; the drift of food where prey gather is a
          // large one. Hunting where your prey feeds is the crude eye's version of hunting.
          const ground = look(gPatch, pr.x, pr.y, pr.dr, PATCH_D);
          if (ground) {
            const [bx, by] = blur(ground.dx, ground.dy, pr.dr, false);
            const [nx, ny] = norm(bx, by); ax = nx; ay = ny; v = P.predCruise;
            stats.counters.predProwlTicks++;
          } else {
            ax = pr.vx; ay = pr.vy; if (rnd() < 0.06) { ax += randn() * 0.7; ay += randn() * 0.7; }
            v = P.predCruise; stats.counters.predWanderTicks++;
          }
        }
        const [dx, dy] = steer(pr.vx, pr.vy, ax, ay); pr.vx = dx; pr.vy = dy;
        pr.x = wrapx(pr.x + dx * v); pr.y = wrapy(pr.y + dy * v);
        pr.E -= moveCost(v);

        // A satiated predator does not kill prey it bumps into — the check requires hunger.
        const hit = hungry ? gPrey.nearest(pr.x, pr.y, P.predBite) : null;
        if (hit) {
          death(hit.o); hit.o.dead = true; stats.counters.preyEaten++;
          if (seen) stats.counters.capturesWhileHunting++; else stats.counters.capturesBlind++;
          pr.E += P.preyBodyE;
        }

        if (pr.E <= 0) { death(pr); stats.counters.predStarved++; continue; }
        if (pr.E >= P.predBreedE && preds.length + newPreds.length < P.predCap) {
          const kid = birth('pred', mutate(pr.g), pr.x + randn() * 4, pr.y + randn() * 4, pr.gen + 1, pr.E / 2, pr.morph);
          stats.mutDelta.pred.push(kid.z - pr.z);
          pr.E /= 2; pr.offspring++; stats.counters.predBirths++; newPreds.push(kid);
        }
        newPreds.push(pr);
      }
      preds = newPreds.filter(a => !a.dead);
      prey = prey.filter(a => !a.dead);
    }

    /* ---------------------------- food ---------------------------- */
    // Patches deplete as they are grazed and reappear elsewhere. A prey that can
    // only find food by touch keeps eating out its current patch and then has to
    // random-walk to the next one; a prey that can see a patch goes straight there.
    for (const q of patches) {
      if (q.stock < P.patchStock && rnd() < P.patchRegen) {      // primary production
        const a = rnd() * 2 * Math.PI, rr = P.patchR * Math.sqrt(rnd());
        food.push({ x: wrapx(q.x + Math.cos(a) * rr), y: wrapy(q.y + Math.sin(a) * rr), patch: q, dead: false });
        q.stock++;
      }
      if (rnd() < P.patchTurnover) q.dead = true;                // patch dies, food with it
    }
    if (tick % 20 === 0) {
      for (const f of food) if (f.patch && f.patch.dead) f.dead = true;
      food = food.filter(f => !f.dead);
      patches = patches.filter(q => !q.dead);
      while (patches.length < P.nPatches) patches.push(newPatch());
    }

    /* --------------------------- history --------------------------- */
    if (tick % P.histEvery === 0) {
      const s = arr => {
        if (!arr.length) return { n: 0 };
        const z = arr.map(a => a.z), m = z.reduce((t, x) => t + x, 0) / z.length;
        const v = z.reduce((t, x) => t + (x - m) ** 2, 0) / z.length;
        const dr = arr.reduce((t, a) => t + a.dr, 0) / arr.length;
        return { n: arr.length, z: m, zsd: Math.sqrt(v), drDeg: degOf(dr),
                 gen: arr.reduce((t, a) => t + a.gen, 0) / arr.length,
                 A: arr.reduce((t, a) => t + a.g.A, 0) / arr.length,
                 f: arr.reduce((t, a) => t + a.g.f, 0) / arr.length,
                 L: arr.reduce((t, a) => t + a.g.L, 0) / arr.length,
                 // range at which p(resolve) = 0.5 in clear water: θ = Δρ ⇒ d = diam/Δρ
                 halfR: arr.reduce((t, a) => t + (arr === prey ? FOOD_D : PREY_D) / a.dr, 0) / arr.length };
      };
      const row = { tick, nFood: food.length, prey: s(prey), pred: s(preds) };
      stats.hist.push(row);
      if (hooks.onSample) hooks.onSample(row, { prey, preds, food });
    }
    return true;
  }

  // Live handle. `snapshot()` hands back the current arrays for rendering; `step()`
  // advances one tick. The headless runSim below just calls step() in a loop.
  return {
    P, stats, morphTally, optics: { drho, effLens }, pResolve, searchRadius,
    get tick() { return tick; },
    step,
    snapshot: () => ({ tick, prey, preds, food, patches }),
  };
}

// Headless driver: run to completion and return the final state, unchanged shape
// so run-exp / gradient / balance keep working exactly as before.
export function runSim(opts = {}, hooks = {}) {
  const sim = createSim(opts, hooks);
  const ticks = sim.P.ticks;
  while (sim.tick < ticks) { if (!sim.step()) break; }
  const s = sim.snapshot();
  return { P: sim.P, tick: s.tick, stats: sim.stats, prey: s.prey, preds: s.preds,
           food: s.food, morphTally: sim.morphTally,
           optics: sim.optics, pResolve: sim.pResolve, searchRadius: sim.searchRadius,
           finalPrey: s.prey.map(a => ({ z: a.z, dr: a.dr, g: a.g })),
           finalPred: s.preds.map(a => ({ z: a.z, dr: a.dr, g: a.g })) };
}
