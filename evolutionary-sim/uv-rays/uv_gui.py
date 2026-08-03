"""View of the UV sim.

    python uv_gui.py --html uv_sim.html   self-contained scrubbable page
    python uv_gui.py                      same thing, writes uv_sim.html

The board is an x-z slice, not a map: x runs left to right, z is HEIGHT, so the
top of the canvas is z=GRID (full sun, full UV) and the bottom is z=0 (dark and
safe). Each row of the board is tinted by the UV that reaches it this step.

Every number the page shows is computed here, in Python, against uv_sim. The
page only looks values up and draws them — it never re-derives any of the sim,
so there is no second copy of the physics to drift out of sync.

What made the old page 170MB at 100k steps was writing that per frame as JSON.
Two things fix it without moving any computation into the browser:

  * the environment (surface, uv/light/food rows) repeats exactly once per
    day/night cycle, so identical env frames are written once into ENV and each
    frame just stores an index into it.
  * the per-organism numbers are written as fixed-point integer columns — one
    contiguous run per organism per field, so a lineage's slowly drifting values
    sit next to each other — then gzipped and base64'd into the page. The
    browser inflates it once with DecompressionStream and reads it as typed
    arrays, so a frame costs an array index instead of a parsed object.
"""

import argparse
import array
import base64
import gzip
import json
import sys

import uv_sim as sim

BOARD_PX = 600
SCALE = BOARD_PX / sim.GRID  # pixels per world unit
DOT = 7

BACKGROUND = "#0c0f14"
GRID_LINE = "#232830"
ORG_COLOR = "#4ade80"
HURT_COLOR = "#ffffff"  # white, not red — red is the uv bands now
STARVE_COLOR = "#fbbf24"
UV_RGB = "239,68,68"  # red bands: uv, top three layers only
FOOD_RGB = "166,124,82"  # brown strip down the left edge: food
LIGHT_RGB = "120,150,200"  # pale wash over the whole column: light
TEXT_COLOR = "#d8dee9"
EVENT_COLOR = "#fbbf24"

# fixed-point scales: value * SCALE_x, rounded, stored as an integer
Z_SCALE = 100  # z in [0, 10]        -> 0..1000        uint16
DAMAGE_SCALE = 100  # damage in [0, 10]   -> 0..1000        uint16
HUNGER_SCALE = 100  # hunger in [0, 1]    -> 0..100         uint8
UV_SCALE = 100  # uv in [0, 0.7]      -> 0..70          uint8
FOOD_SCALE = 100  # food in [0, 0.7]    -> 0..70          uint8
GENE_SCALE = 1000  # dive up to 64.0     -> 0..64000       uint16
AVG_SCALE = 100  # averaged genes      -> 0..6400        uint16
DZ_SCALE = 100  # dz in [-45, +5]     -> signed          int16
T_SCALE = 100  # t in seconds         -> 0..1_000_000   uint32


class Columns:
    """One integer column per organism slot, concatenated at the end.

    Laid out slot-major (all of slot 0's steps, then slot 1's, ...) rather than
    frame-major, because consecutive values are then the same organism one step
    apart — nearly identical, which is what gzip is good at. Frame-major would
    interleave ten unrelated organisms and compress far worse.
    """

    def __init__(self, typecode):
        self.typecode = typecode
        self.slots = [array.array(typecode) for _ in range(sim.POPULATION)]

    def append(self, slot, value):
        self.slots[slot].append(value)

    def tobytes(self):
        out = array.array(self.typecode)
        for slot in self.slots:
            out.extend(slot)
        return to_bytes(out)


def to_bytes(a):
    if sys.byteorder == "big":
        a = array.array(a.typecode, a)
        a.byteswap()  # the reader is always little-endian
    return a.tobytes()


class Recorder:
    """Owns the same loop as uv_sim.main(), one step at a time."""

    def __init__(self):
        sim.reset_names()
        self.organisms = [sim.Organism.init(x) for x in range(sim.POPULATION)]
        self.step = 0
        self.dead = False

        self.z = Columns("H")
        self.damage = Columns("H")
        self.hunger = Columns("B")
        self.uv = Columns("B")
        self.food = Columns("B")
        self.climb = Columns("H")
        self.dive = Columns("H")
        self.dz = Columns("h")
        self.alive = array.array("H")  # one bit per slot, one entry per frame
        self.times = array.array("I")
        self.avg_climb = array.array("H")
        self.avg_dive = array.array("H")
        self.phase = array.array("H")  # index into self.env for this frame
        self.env = []  # the distinct environment states, in first-seen order
        self._env_index = {}
        self.events = []  # (frame index, text) — only on the steps that have any

    def environment(self, t):
        """Everything about the world at time t — nothing organism-specific."""
        return {
            "surface": sim.surface_intensity(t),
            # uv reaching each z row, top row first — used to tint the board
            "rows": [sim.uv_at(z, t) for z in range(sim.GRID, 0, -1)],
            # light reaching each z row — unlike uv, this goes all the way down
            "light_rows": [sim.light_at(z, t) for z in range(sim.GRID, 0, -1)],
            # food sitting in each z row, top row first
            "food_rows": [sim.food_at(z, t) for z in range(sim.GRID, 0, -1)],
            "column_food": sim.column_food(t),
        }

    def phase_index(self, t):
        """The environment repeats every cycle, so store each state only once."""
        env = self.environment(t)
        key = json.dumps(env, sort_keys=True)
        if key not in self._env_index:
            self._env_index[key] = len(self.env)
            self.env.append(env)
        return self._env_index[key]

    def advance(self):
        step = self.step
        t = step * sim.STEP_DT
        events = sim.sim_step(self.organisms, step)
        self.step += 1
        self.dead = not sim.living(self.organisms)

        mask = 0
        for slot, o in enumerate(self.organisms):
            if o.alive:
                mask |= 1 << slot
            self.z.append(slot, int(round(o.z * Z_SCALE)))
            self.damage.append(slot, int(round(o.damage * DAMAGE_SCALE)))
            self.hunger.append(slot, min(255, int(round(o.hunger * HUNGER_SCALE))))
            self.uv.append(slot, int(round(sim.uv_at(o.z, t) * UV_SCALE)))
            self.food.append(slot, int(round(sim.food_at(o.z, t) * FOOD_SCALE)))
            self.climb.append(slot, int(round(o.climb_gene * GENE_SCALE)))
            self.dive.append(slot, int(round(o.dive_gene * GENE_SCALE)))
            self.dz.append(slot, int(round(o.drive(t) * DZ_SCALE)))

        self.alive.append(mask)
        self.times.append(int(round(t * T_SCALE)))
        self.avg_climb.append(int(round(sim.average_climb(self.organisms) * AVG_SCALE)))
        self.avg_dive.append(int(round(sim.average_dive(self.organisms) * AVG_SCALE)))
        self.phase.append(self.phase_index(t))

        for line in events:
            self.events.append((step, line))

    def done(self):
        return self.dead or self.step >= sim.TOTAL_STEPS

    def collect(self):
        while not self.done():
            self.advance()
        if len(self.env) > 65535:
            raise ValueError("too many distinct environment states for a uint16 index")
        return self.step

    def blob(self):
        """All the columns, in the order the page reads them back out."""
        return b"".join(
            [
                self.z.tobytes(),
                self.damage.tobytes(),
                self.hunger.tobytes(),
                self.uv.tobytes(),
                self.food.tobytes(),
                self.climb.tobytes(),
                self.dive.tobytes(),
                self.dz.tobytes(),
                to_bytes(self.alive),
                to_bytes(self.times),
                to_bytes(self.avg_climb),
                to_bytes(self.avg_dive),
                to_bytes(self.phase),
            ]
        )


def pack(payload):
    return base64.b64encode(gzip.compress(payload, 6)).decode("ascii")


HTML = """<!doctype html>
<meta charset="utf-8"><title>uv / light</title>
<style>
 body{background:%(bg)s;color:%(text)s;font:14px ui-monospace,Menlo,Consolas,monospace;
      margin:0;padding:16px;display:flex;flex-direction:column;gap:10px;align-items:flex-start}
 canvas{border:1px solid %(grid)s}
 .row{display:flex;gap:10px;align-items:center;flex-wrap:wrap}
 .event{color:%(event)s;min-height:3.6em;white-space:pre-line}
 button,select{background:#1e242c;color:%(text)s;border:1px solid %(grid)s;padding:4px 12px;
        border-radius:4px;cursor:pointer;font:inherit}
 input[type=range]{width:420px}
 table{border-collapse:collapse}
 td,th{padding:1px 10px 1px 0;text-align:left;font-weight:normal}
 th{color:#8b95a5}
 #legend{gap:16px;color:#8b95a5;font-size:13px}
 #legend span{display:flex;align-items:center;gap:5px}
 #legend i{width:12px;height:12px;display:inline-block}
 #loading{color:#8b95a5}
</style>
<div class="row">
  <button id="play">pause</button>
  <input type="range" id="slider" min="0" max="%(last)d" value="0">
  <select id="speed">
    <option value="1">1x</option>
    <option value="5">5x</option>
    <option value="25" selected>25x</option>
    <option value="100">100x</option>
    <option value="500">500x</option>
  </select>
  <span id="stepLabel"></span>
</div>
<canvas id="c" width="%(board)d" height="%(board)d"></canvas>
<div class="row" id="legend">
  <span><i style="background:rgba(%(uvrgb)s,.85)"></i>uv &mdash; top 3 layers only</span>
  <span><i style="background:rgba(%(foodrgb)s,.95)"></i>food &mdash; left edge, top 3 layers</span>
  <span><i style="background:rgba(%(lightrgb)s,.30)"></i>light &mdash; all depths</span>
  <span><i style="background:%(org)s;border-radius:50%%"></i>alive</span>
  <span><i style="background:%(hurt)s;border-radius:50%%"></i>uv damage &gt; 60%%</span>
  <span><i style="background:none;border:2px solid %(starve)s;border-radius:50%%"></i>hunger &gt; 60%%</span>
</div>
<div id="loading">inflating %(nframes)d frames&hellip;</div>
<div id="summary"></div>
<table id="table"></table>
<div class="event" id="events"></div>
<script>
const N = %(nframes)d, POP = %(pop)d, GRID = %(grid_n)d, BOARD = %(board)d;
const SCALE = %(scale)s, DOT = %(dot)d, MAX_DAMAGE = %(maxdmg)s;
const ENV = %(env)s;                 // the distinct world states, deduped
const EVENTS = %(events)s;           // [[frame, text], ...] — sparse
let Z, DMG, HUNGER, UV, FOOD, CLIMB, DIVE, DZ;
let ALIVE, TIMES, AVGCLIMB, AVGDIVE, PHASE;

function b64bytes(s){
  const bin = atob(s), out = new Uint8Array(bin.length);
  for (let k = 0; k < bin.length; k++) out[k] = bin.charCodeAt(k);
  return out;
}

async function gunzip(s){
  const stream = new Blob([b64bytes(s)]).stream()
    .pipeThrough(new DecompressionStream('gzip'));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

function unpack(bytes){
  const n = N * POP;
  let off = 0;
  const take = (Type, count) => {
    // .slice() so each view is aligned — the uint8 columns leave an odd offset
    const a = new Type(bytes.buffer.slice(off, off + count * Type.BYTES_PER_ELEMENT));
    off += count * Type.BYTES_PER_ELEMENT;
    return a;
  };
  Z = take(Uint16Array, n);
  DMG = take(Uint16Array, n);
  HUNGER = take(Uint8Array, n);
  UV = take(Uint8Array, n);
  FOOD = take(Uint8Array, n);
  CLIMB = take(Uint16Array, n);
  DIVE = take(Uint16Array, n);
  DZ = take(Int16Array, n);
  ALIVE = take(Uint16Array, N);
  TIMES = take(Uint32Array, N);
  AVGCLIMB = take(Uint16Array, N);
  AVGDIVE = take(Uint16Array, N);
  PHASE = take(Uint16Array, N);
}

// slot-major: slot s at frame i lives at s*N + i
const at = (col, s, i) => col[s * N + i];

const ctx = document.getElementById('c').getContext('2d');
let i = 0, playing = true, speed = 25, painted = -1;

// z is height: z=GRID is the top of the canvas, z=0 the bottom
function py(z){ return BOARD - z * SCALE; }

// EVENTS is sorted by frame, so walk it with a cursor instead of scanning
let evCursor = 0;
function eventsUpTo(from, to){
  while (evCursor > 0 && EVENTS[evCursor - 1][0] >= from) evCursor--;
  while (evCursor < EVENTS.length && EVENTS[evCursor][0] < from) evCursor++;
  const out = [];
  for (let k = evCursor; k < EVENTS.length && EVENTS[k][0] <= to; k++)
    out.push(EVENTS[k][1]);
  return out;
}

function paint(){
  const env = ENV[PHASE[i]];
  ctx.fillStyle = '%(bg)s';
  ctx.fillRect(0, 0, BOARD, BOARD);

  // light: a pale wash over the WHOLE column, thinning with depth
  env.light_rows.forEach((light, r) => {
    ctx.fillStyle = 'rgba(%(lightrgb)s,' + (light * 0.30) + ')';
    ctx.fillRect(0, r * SCALE, BOARD, SCALE);
  });

  // uv: red, and only ever in the top three bands
  env.rows.forEach((uv, r) => {
    if (uv <= 0) return;
    ctx.fillStyle = 'rgba(%(uvrgb)s,' + Math.min(0.85, uv * 1.1) + ')';
    ctx.fillRect(0, r * SCALE, BOARD, SCALE);
  });

  // food: lives in the same three bands as uv, so it gets its own brown
  // strip down the left edge rather than fighting the red for the same pixels
  env.food_rows.forEach((food, r) => {
    if (food <= 0) return;
    ctx.fillStyle = 'rgba(%(foodrgb)s,' + Math.min(0.95, 0.3 + food) + ')';
    ctx.fillRect(0, r * SCALE, BOARD * 0.07, SCALE);
  });

  ctx.strokeStyle = '%(grid)s'; ctx.lineWidth = 1;
  for (let g = 0; g <= GRID; g++){
    ctx.beginPath(); ctx.moveTo(g*SCALE, 0); ctx.lineTo(g*SCALE, BOARD); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, g*SCALE); ctx.lineTo(BOARD, g*SCALE); ctx.stroke();
  }

  const mask = ALIVE[i];
  let alive = 0;
  // pull apart the two halves of dz so you can see which pressure is winning
  let html = '<tr><th>x</th><th>z</th><th>uv</th><th>food</th><th>hunger</th>'
           + '<th>climb</th><th>dive</th><th>up</th><th>down</th><th>dz</th>'
           + '<th>damage</th></tr>';

  for (let s = 0; s < POP; s++){
    if (!(mask & (1 << s))) continue;
    const z = at(Z, s, i) / %(zscale)d;
    const damage = at(DMG, s, i) / %(dmgscale)d;
    const hunger = at(HUNGER, s, i) / %(hungerscale)d;
    const uv = at(UV, s, i) / %(uvscale)d;
    const food = at(FOOD, s, i) / %(foodscale)d;
    const climb = at(CLIMB, s, i) / %(genescale)d;
    const dive = at(DIVE, s, i) / %(genescale)d;
    const dz = at(DZ, s, i) / %(dzscale)d;
    alive++;

    // fill = uv damage, ring = hunger. either one alone can kill you.
    ctx.fillStyle = (damage / MAX_DAMAGE) > 0.6 ? '%(hurt)s' : '%(org)s';
    ctx.beginPath();
    ctx.arc(s*SCALE + SCALE/2, py(z), DOT, 0, 7);
    ctx.fill();
    if (hunger > 0.6){
      ctx.strokeStyle = '%(starve)s'; ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(s*SCALE + SCALE/2, py(z), DOT + 3, 0, 7);
      ctx.stroke();
      ctx.lineWidth = 1;
    }

    html += '<tr><td>' + s + '</td><td>' + z.toFixed(2) + '</td><td>'
          + uv.toFixed(2) + '</td><td>'
          + food.toFixed(2) + '</td><td>'
          + hunger.toFixed(2) + '</td><td>'
          + climb.toFixed(2) + '</td><td>'
          + dive.toFixed(2) + '</td><td>'
          + (climb * hunger).toFixed(2) + '</td><td>'
          + (dive * uv).toFixed(2) + '</td><td>'
          + (dz >= 0 ? '+' : '') + dz.toFixed(2) + '</td><td>'
          + damage.toFixed(2) + '</td></tr>';
  }

  document.getElementById('stepLabel').textContent =
    'step ' + i + ' / ' + (N - 1) + '   t=' + (TIMES[i] / %(tscale)d).toFixed(1) + 's';
  document.getElementById('summary').textContent =
    'surface uv/light: ' + env.surface.toFixed(2)
    + '   column food: ' + env.column_food.toFixed(2)
    + '   alive: ' + alive
    + '   avg climb: ' + (AVGCLIMB[i] / %(avgscale)d).toFixed(2)
    + '   avg dive: ' + (AVGDIVE[i] / %(avgscale)d).toFixed(2);
  document.getElementById('table').innerHTML = html;

  // at >1x a tick covers a span of steps, so show every event inside it
  const from = painted >= 0 && painted < i ? painted + 1 : i;
  const lines = eventsUpTo(from, i);
  document.getElementById('events').textContent =
    lines.length > 4
      ? lines.slice(-4).join('\\n') + '\\n(+' + (lines.length - 4) + ' more)'
      : lines.join('\\n');
  document.getElementById('slider').value = i;
  painted = i;
}

document.getElementById('slider').oninput = e => {
  playing = false; document.getElementById('play').textContent = 'play';
  i = +e.target.value; painted = -1; paint();
};
document.getElementById('play').onclick = e => {
  playing = !playing; e.target.textContent = playing ? 'pause' : 'play';
};
document.getElementById('speed').onchange = e => { speed = +e.target.value; };

function tick(){
  if (playing){ i = (i + speed) %% N; paint(); }
  requestAnimationFrame(tick);
}

gunzip(BLOB).then(bytes => {
  unpack(bytes);
  document.getElementById('loading').remove();
  paint();
  requestAnimationFrame(tick);
});
</script>
"""


def run_html(path):
    state = Recorder()
    nframes = state.collect()
    blob = state.blob()

    compact = {"separators": (",", ":")}
    page = HTML % {
        "nframes": nframes,
        "pop": sim.POPULATION,
        "board": BOARD_PX,
        "scale": SCALE,
        "dot": DOT,
        "grid_n": sim.GRID,
        "maxdmg": sim.MAX_DAMAGE,
        "zscale": Z_SCALE,
        "dmgscale": DAMAGE_SCALE,
        "hungerscale": HUNGER_SCALE,
        "uvscale": UV_SCALE,
        "foodscale": FOOD_SCALE,
        "genescale": GENE_SCALE,
        "avgscale": AVG_SCALE,
        "dzscale": DZ_SCALE,
        "tscale": T_SCALE,
        "env": json.dumps(state.env, **compact),
        "events": json.dumps(state.events, **compact),
        "last": nframes - 1,
        "bg": BACKGROUND,
        "grid": GRID_LINE,
        "org": ORG_COLOR,
        "hurt": HURT_COLOR,
        "starve": STARVE_COLOR,
        "uvrgb": UV_RGB,
        "foodrgb": FOOD_RGB,
        "lightrgb": LIGHT_RGB,
        "text": TEXT_COLOR,
        "event": EVENT_COLOR,
    }
    # the blob is spliced in rather than %-formatted so a megabyte of base64
    # never gets copied through the format machinery
    page = page.replace("gunzip(BLOB)", 'gunzip("' + pack(blob) + '")')

    # utf-8 explicitly: the page declares it, and the default here is whatever
    # the platform's locale happens to be
    with open(path, "w", encoding="utf-8") as f:
        f.write(page)

    mb = len(page.encode()) / 1e6
    print(f"wrote {nframes} frames to {path} ({mb:.1f} MB, {len(state.events)} events)")
    print(f"  {len(state.env)} distinct environment states")
    print(f"  raw columns {len(blob) / 1e6:.1f} MB -> gzip+base64")
    print(f"average climb gene: {sim.average_climb(state.organisms):.3f}")
    print(f"average dive gene:  {sim.average_dive(state.organisms):.3f}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--html", metavar="FILE", default="uv_sim.html")
    args = parser.parse_args()
    run_html(args.html)
