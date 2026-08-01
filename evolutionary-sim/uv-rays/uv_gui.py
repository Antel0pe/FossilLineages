"""View of the UV sim.

    python uv_gui.py --html uv_sim.html   self-contained scrubbable page
    python uv_gui.py                      same thing, writes uv_sim.html

The board is an x-z slice, not a map: x runs left to right, z is HEIGHT, so the
top of the canvas is z=GRID (full sun, full UV) and the bottom is z=0 (dark and
safe). Each row of the board is tinted by the UV that reaches it this step.
"""

import argparse
import json

import uv_sim as sim

BOARD_PX = 600
SCALE = BOARD_PX / sim.GRID  # pixels per world unit
DOT = 7
FRAME_DELAY_MS = 80

BACKGROUND = "#0c0f14"
GRID_LINE = "#232830"
ORG_COLOR = "#4ade80"
HURT_COLOR = "#f87171"
STARVE_COLOR = "#fbbf24"
TEXT_COLOR = "#d8dee9"
EVENT_COLOR = "#fbbf24"


class Sim:
    """Owns the same loop as uv_sim.main(), one step at a time."""

    def __init__(self):
        sim.reset_names()
        self.organisms = [sim.Organism.init(x) for x in range(sim.POPULATION)]
        self.step = 0
        self.dead = False

    def advance(self):
        step = self.step
        events = sim.sim_step(self.organisms, step)
        self.step += 1
        self.dead = not sim.living(self.organisms)

        t = step * sim.STEP_DT
        return {
            "step": step,
            "t": round(t, 2),
            "surface": sim.surface_intensity(t),
            # uv reaching each z row, top row first — used to tint the board
            "rows": [sim.uv_at(z, t) for z in range(sim.GRID, 0, -1)],
            # food sitting in each z row, top row first
            "food_rows": [sim.food_at(z, t) for z in range(sim.GRID, 0, -1)],
            "column_food": sim.column_food(t),
            "orgs": [
                {
                    "name": o.name,
                    "x": o.x,
                    "z": o.z,
                    "gene": round(o.move_gene, 2),
                    "damage": round(o.damage, 2),
                    "hunger": round(o.hunger, 2),
                    "uv": sim.uv_at(o.z, t),
                    "light": sim.light_at(o.z, t),
                    "pref": round(o.pref_light, 2),
                    "error": sim.light_error(o.z, t, o.pref_light),
                    "food": sim.food_at(o.z, t),
                }
                for o in sim.living(self.organisms)
            ],
            "events": events,
            "avg_gene": f"{sim.average_gene(self.organisms):+.2f}",
            "avg_pref": f"{sim.average_pref(self.organisms):.2f}",
        }

    def done(self):
        return self.dead or self.step >= sim.TOTAL_STEPS

    def collect(self):
        frames = []
        while not self.done():
            frames.append(self.advance())
        return frames


HTML = """<!doctype html>
<meta charset="utf-8"><title>uv / light</title>
<style>
 body{background:%(bg)s;color:%(text)s;font:14px ui-monospace,Menlo,Consolas,monospace;
      margin:0;padding:16px;display:flex;flex-direction:column;gap:10px;align-items:flex-start}
 canvas{border:1px solid %(grid)s}
 .row{display:flex;gap:10px;align-items:center;flex-wrap:wrap}
 .event{color:%(event)s;min-height:1.2em}
 button{background:#1e242c;color:%(text)s;border:1px solid %(grid)s;padding:4px 12px;
        border-radius:4px;cursor:pointer;font:inherit}
 input[type=range]{width:420px}
 table{border-collapse:collapse}
 td,th{padding:1px 10px 1px 0;text-align:left;font-weight:normal}
 th{color:#8b95a5}
</style>
<div class="row">
  <button id="play">pause</button>
  <input type="range" id="slider" min="0" max="%(last)d" value="0">
  <span id="stepLabel"></span>
</div>
<canvas id="c" width="%(board)d" height="%(board)d"></canvas>
<div id="summary"></div>
<table id="table"></table>
<div class="event" id="events"></div>
<script>
const FRAMES = %(frames)s;
const SCALE = %(scale)s, DOT = %(dot)d, GRID = %(grid_n)d, BOARD = %(board)d;
const MAX_DAMAGE = %(maxdmg)s;
const ctx = document.getElementById('c').getContext('2d');
let i = 0, playing = true;

// z is height: z=GRID is the top of the canvas, z=0 the bottom
function py(z){ return BOARD - z * SCALE; }

function paint(){
  const f = FRAMES[i];
  ctx.fillStyle = '%(bg)s';
  ctx.fillRect(0, 0, BOARD, BOARD);

  // one band per z unit, tinted by the uv that reaches it
  f.rows.forEach((uv, r) => {
    ctx.fillStyle = 'rgba(167,110,255,' + (0.08 + uv * 0.75) + ')';
    ctx.fillRect(0, r * SCALE, BOARD, SCALE);
  });

  // food is only ever in the top three bands — drawn as green stipple
  f.food_rows.forEach((food, r) => {
    if (food <= 0) return;
    ctx.fillStyle = 'rgba(74,222,128,' + Math.min(0.55, food * 0.7) + ')';
    ctx.fillRect(0, r * SCALE, BOARD, SCALE);
  });

  ctx.strokeStyle = '%(grid)s'; ctx.lineWidth = 1;
  for (let g = 0; g <= GRID; g++){
    ctx.beginPath(); ctx.moveTo(g*SCALE, 0); ctx.lineTo(g*SCALE, BOARD); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, g*SCALE); ctx.lineTo(BOARD, g*SCALE); ctx.stroke();
  }

  for (const o of f.orgs){
    // fill = uv damage, ring = hunger. either one alone can kill you.
    ctx.fillStyle = (o.damage / MAX_DAMAGE) > 0.6 ? '%(hurt)s' : '%(org)s';
    ctx.beginPath();
    ctx.arc(o.x*SCALE + SCALE/2, py(o.z), DOT, 0, 7);
    ctx.fill();
    if (o.hunger > 0.6){
      ctx.strokeStyle = '%(starve)s'; ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(o.x*SCALE + SCALE/2, py(o.z), DOT + 3, 0, 7);
      ctx.stroke();
      ctx.lineWidth = 1;
    }
  }

  document.getElementById('stepLabel').textContent =
    'step ' + f.step + '   t=' + f.t.toFixed(1) + 's';
  document.getElementById('summary').textContent =
    'surface uv/light: ' + f.surface.toFixed(2)
    + '   column food: ' + f.column_food.toFixed(2)
    + '   alive: ' + f.orgs.length
    + '   avg move gene: ' + f.avg_gene
    + '   avg pref light: ' + f.avg_pref;

  let html = '<tr><th>x</th><th>z</th><th>light</th><th>pref</th><th>error</th>'
           + '<th>uv</th><th>food</th><th>gene</th><th>dz</th>'
           + '<th>damage</th><th>hunger</th></tr>';
  for (const o of f.orgs){
    const dz = o.error * o.gene;
    html += '<tr><td>' + o.x + '</td><td>' + o.z.toFixed(2) + '</td><td>'
          + o.light.toFixed(2) + '</td><td>'
          + o.pref.toFixed(2) + '</td><td>'
          + (o.error >= 0 ? '+' : '') + o.error.toFixed(2) + '</td><td>'
          + o.uv.toFixed(2) + '</td><td>'
          + o.food.toFixed(2) + '</td><td>'
          + (o.gene >= 0 ? '+' : '') + o.gene.toFixed(2) + '</td><td>'
          + (dz >= 0 ? '+' : '') + dz.toFixed(2) + '</td><td>'
          + o.damage.toFixed(2) + '</td><td>' + o.hunger.toFixed(2) + '</td></tr>';
  }
  document.getElementById('table').innerHTML = html;
  document.getElementById('events').textContent = f.events.join('   |   ');
  document.getElementById('slider').value = i;
}

document.getElementById('slider').oninput = e => {
  playing = false; document.getElementById('play').textContent = 'play';
  i = +e.target.value; paint();
};
document.getElementById('play').onclick = e => {
  playing = !playing; e.target.textContent = playing ? 'pause' : 'play';
};
setInterval(() => { if (playing){ i = (i + 1) %% FRAMES.length; paint(); } }, %(delay)d);
paint();
</script>
"""


def run_html(path):
    state = Sim()
    frames = state.collect()
    with open(path, "w") as f:
        f.write(
            HTML
            % {
                "frames": json.dumps(frames),
                "board": BOARD_PX,
                "scale": SCALE,
                "dot": DOT,
                "grid_n": sim.GRID,
                "maxdmg": sim.MAX_DAMAGE,
                "last": len(frames) - 1,
                "delay": FRAME_DELAY_MS,
                "bg": BACKGROUND,
                "grid": GRID_LINE,
                "org": ORG_COLOR,
                "hurt": HURT_COLOR,
                "starve": STARVE_COLOR,
                "text": TEXT_COLOR,
                "event": EVENT_COLOR,
            }
        )
    print(f"wrote {len(frames)} frames to {path}")
    print(f"average move gene: {sim.average_gene(state.organisms):+.3f}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--html", metavar="FILE", default="uv_sim.html")
    args = parser.parse_args()
    run_html(args.html)
