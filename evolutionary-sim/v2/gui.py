"""Views of the sim.

    python gui.py                  live tkinter window (needs a working display)
    python gui.py --html out.html  self-contained scrubbable page (no display needed)
    python gui.py --png out/       one PNG per step
"""

import argparse
import json
import os

import sim

BOARD_PX = 700  # board is always this wide, whatever WORLD_SIZE is
SCALE = BOARD_PX / sim.WORLD_SIZE  # pixels per world unit
DOT = 4  # dot radius in pixels
PANEL = 110  # pixels of text below the board
MAX_SPEEDS_SHOWN = 12  # populations grow, so the speed lines have to stop somewhere
FRAME_DELAY_MS = 300

BACKGROUND = "#111418"
GRID_LINE = "#232830"
PREY_COLOR = "#4ade80"
PREDATOR_COLOR = "#f87171"
TEXT_COLOR = "#d8dee9"
DEAD_COLOR = "#6b7280"
CATCH_COLOR = "#fbbf24"


class Sim:
    """Owns the same loop as sim.main(), one step at a time."""

    def __init__(self):
        sim.reset_names()
        self.prey = [sim.Prey.init(sim.next_name("prey")) for _ in range(sim.POPULATION)]
        self.predators = [
            sim.Predator.init(sim.next_name("predator")) for _ in range(sim.POPULATION)
        ]
        self.predator_speeds = []
        self.prey_speeds = []
        self.step = 0
        self.extinct = False

    def advance(self):
        """Run one step; return a plain-data frame describing it."""
        self.prey, self.predators, catches = sim.sim_step(self.prey, self.predators)
        self.step += 1

        catches += sim.reproduce_prey(self.prey)
        catches += sim.starve_predators(self.predators)

        live_prey = sim.living(self.prey)
        live_predators = sim.living(self.predators)
        self.prey_speeds.append(sim.average_speed(self.prey))
        self.predator_speeds.append(sim.average_speed(self.predators))
        self.extinct = not live_prey or not live_predators

        return {
            "step": self.step - 1,
            "prey": [
                {"x": p.x, "y": p.y, "speed": round(p.speed, 2), "alive": True}
                for p in live_prey
            ],
            "predators": [
                {"x": p.x, "y": p.y, "speed": round(p.speed, 2), "alive": True}
                for p in live_predators
            ],
            "catches": catches,
            "breed_prey": f"{sim.average_speed(self.prey):.2f}",
            "breed_predator": f"{sim.average_speed(self.predators):.2f}",
        }

    def done(self):
        return self.extinct or self.step >= sim.TOTAL_STEPS

    def collect(self):
        frames = []
        while not self.done():
            frames.append(self.advance())
        return frames

    def report(self):
        print(
            "predator speed progression: "
            + ", ".join(f"{s:.3f}" for s in self.predator_speeds)
        )
        print(
            "prey speed progression: " + ", ".join(f"{s:.3f}" for s in self.prey_speeds)
        )


# ---------------------------------------------------------------- PIL rendering


def load_font(size):
    from PIL import ImageFont

    for path in [
        "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    ]:
        if os.path.exists(path):
            return ImageFont.truetype(path, size)
    return ImageFont.load_default()


def draw_speeds(d, x, y, label, animals, font):
    d.text((x, y), label, font=font, fill=TEXT_COLOR)
    x += d.textlength(label, font=font)
    for a in animals[:MAX_SPEEDS_SHOWN]:
        text = f"{a['speed']:.2f} "
        d.text((x, y), text, font=font, fill=TEXT_COLOR if a["alive"] else DEAD_COLOR)
        width = d.textlength(text, font=font)
        if not a["alive"]:  # strike it through
            mid = y + font.size / 2
            d.line([(x, mid), (x + width - 4, mid)], fill=DEAD_COLOR, width=1)
        x += width
    if len(animals) > MAX_SPEEDS_SHOWN:
        d.text((x, y), f"+{len(animals) - MAX_SPEEDS_SHOWN}", font=font, fill=DEAD_COLOR)


def render(frame):
    from PIL import Image, ImageDraw

    font = load_font(14)
    board = BOARD_PX
    img = Image.new("RGB", (board, board + PANEL), BACKGROUND)
    d = ImageDraw.Draw(img)

    for g in range(0, sim.WORLD_SIZE + 1, 10):
        d.line([(g * SCALE, 0), (g * SCALE, board)], fill=GRID_LINE)
        d.line([(0, g * SCALE), (board, g * SCALE)], fill=GRID_LINE)

    for a in frame["prey"]:
        if a["alive"]:
            cx, cy = a["x"] * SCALE, a["y"] * SCALE
            d.ellipse([cx - DOT, cy - DOT, cx + DOT, cy + DOT], fill=PREY_COLOR)
    for a in frame["predators"]:
        cx, cy = a["x"] * SCALE, a["y"] * SCALE
        d.ellipse([cx - DOT, cy - DOT, cx + DOT, cy + DOT], fill=PREDATOR_COLOR)

    y = board + 8
    d.text((8, y), f"step {frame['step']}", font=font, fill=TEXT_COLOR)
    d.text(
        (90, y),
        f"avg speed. prey: {frame['breed_prey']} "
        f"predator: {frame['breed_predator']}",
        font=font,
        fill=TEXT_COLOR,
    )
    draw_speeds(d, 8, y + 22, "prey:     ", frame["prey"], font)
    draw_speeds(d, 8, y + 42, "predator: ", frame["predators"], font)
    for i, line in enumerate(frame["catches"][:2]):
        d.text((8, y + 64 + i * 18), line, font=font, fill=CATCH_COLOR)

    return img


# ------------------------------------------------------------------ HTML output

HTML = """<!doctype html>
<meta charset="utf-8"><title>predator / prey</title>
<style>
 body{background:%(bg)s;color:%(text)s;font:14px ui-monospace,Menlo,Consolas,monospace;
      margin:0;padding:16px;display:flex;flex-direction:column;gap:10px;align-items:flex-start}
 canvas{border:1px solid %(grid)s;image-rendering:pixelated}
 .row{display:flex;gap:10px;align-items:center;flex-wrap:wrap}
 .dead{color:%(dead)s;text-decoration:line-through}
 .catch{color:%(catch)s;min-height:1.2em}
 button{background:#1e242c;color:%(text)s;border:1px solid %(grid)s;padding:4px 12px;
        border-radius:4px;cursor:pointer;font:inherit}
 input[type=range]{width:420px}
</style>
<div class="row">
  <button id="play">pause</button>
  <input type="range" id="slider" min="0" max="%(last)d" value="0">
  <span id="stepLabel"></span>
</div>
<canvas id="c" width="%(board)d" height="%(board)d"></canvas>
<div id="breed"></div>
<div>prey:&nbsp;&nbsp;&nbsp;&nbsp;<span id="preySpeeds"></span></div>
<div>predator:&nbsp;<span id="predSpeeds"></span></div>
<div class="catch" id="catches"></div>
<script>
const FRAMES = %(frames)s;
const SCALE = %(scale)s, DOT = %(dot)d, WORLD = %(world)d;
const ctx = document.getElementById('c').getContext('2d');
let i = 0, playing = true;

function speeds(list){
  return list.map(a => `<span class="${a.alive?'':'dead'}">${a.speed.toFixed(2)}</span>`)
             .join(' ');
}

function paint(){
  const f = FRAMES[i];
  ctx.fillStyle = '%(bg)s';
  ctx.fillRect(0, 0, WORLD*SCALE, WORLD*SCALE);
  ctx.strokeStyle = '%(grid)s'; ctx.lineWidth = 1;
  for (let g = 0; g <= WORLD; g += 10){
    ctx.beginPath(); ctx.moveTo(g*SCALE, 0); ctx.lineTo(g*SCALE, WORLD*SCALE); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, g*SCALE); ctx.lineTo(WORLD*SCALE, g*SCALE); ctx.stroke();
  }
  for (const a of f.prey){
    if (!a.alive) continue;
    ctx.fillStyle = '%(prey)s';
    ctx.beginPath(); ctx.arc(a.x*SCALE, a.y*SCALE, DOT, 0, 7); ctx.fill();
  }
  for (const a of f.predators){
    ctx.fillStyle = '%(pred)s';
    ctx.beginPath(); ctx.arc(a.x*SCALE, a.y*SCALE, DOT, 0, 7); ctx.fill();
  }
  document.getElementById('stepLabel').textContent = 'step ' + f.step;
  document.getElementById('breed').textContent =
    'avg speed. prey: ' + f.breed_prey + ' predator: ' + f.breed_predator
    + '   |   alive  prey: ' + f.prey.length + '  predators: ' + f.predators.length;
  document.getElementById('preySpeeds').innerHTML = speeds(f.prey);
  document.getElementById('predSpeeds').innerHTML = speeds(f.predators);
  document.getElementById('catches').textContent = f.catches.join('   ');
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
    state.report()
    with open(path, "w") as f:
        f.write(
            HTML
            % {
                "frames": json.dumps(frames),
                "board": BOARD_PX,
                "scale": SCALE,
                "dot": DOT,
                "world": sim.WORLD_SIZE,
                "last": len(frames) - 1,
                "delay": FRAME_DELAY_MS,
                "bg": BACKGROUND,
                "grid": GRID_LINE,
                "prey": PREY_COLOR,
                "pred": PREDATOR_COLOR,
                "text": TEXT_COLOR,
                "dead": DEAD_COLOR,
                "catch": CATCH_COLOR,
            }
        )
    print(f"wrote {len(frames)} frames to {path}")


# ------------------------------------------------------------------- PNG output


def run_png(out_dir):
    os.makedirs(out_dir, exist_ok=True)
    state = Sim()
    while not state.done():
        frame = state.advance()
        render(frame).save(os.path.join(out_dir, f"step_{frame['step']:03d}.png"))
    state.report()
    print(f"wrote {sim.TOTAL_STEPS} frames to {out_dir}/")


# ---------------------------------------------------------------- tkinter window


def run_window():
    import tkinter

    from PIL import ImageTk

    state = Sim()
    root = tkinter.Tk()
    root.title("predator / prey")
    root.configure(bg=BACKGROUND)
    label = tkinter.Label(root, bd=0, bg=BACKGROUND)
    label.pack()

    def tick():
        if state.done():
            state.report()
            return
        photo = ImageTk.PhotoImage(render(state.advance()))
        label.configure(image=photo)
        label.image = photo  # keep a reference or it gets garbage collected
        root.after(FRAME_DELAY_MS, tick)

    tick()
    root.mainloop()


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--html", metavar="FILE", help="write a scrubbable HTML page")
    parser.add_argument("--png", metavar="DIR", help="write frames as PNGs")
    args = parser.parse_args()
    if args.html:
        run_html(args.html)
    elif args.png:
        run_png(args.png)
    else:
        try:
            run_window()
        except Exception as e:
            raise SystemExit(
                f"could not open a window ({e}).\n"
                f"Your display is not reachable — try 'wsl --shutdown' from Windows, "
                f"or use:  python gui.py --html sim.html"
            )
