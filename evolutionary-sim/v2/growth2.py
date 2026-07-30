import random
import time

import gui
import sim

print("full default run (TOTAL_STEPS=1000), one row per seed, 45s budget each:")
print(f"{'seed':>4} {'end step':>8} {'peak prey':>10} {'peak pred':>9} {'secs':>7}")

for seed in range(1, 13):
    random.seed(seed)
    state = gui.Sim()
    t0 = time.time()
    peak_prey = peak_pred = 0
    hit_budget = False
    while not state.done():
        f = state.advance()
        peak_prey = max(peak_prey, len(f["prey"]))
        peak_pred = max(peak_pred, len(f["predators"]))
        if time.time() - t0 > 45:
            hit_budget = True
            break
    secs = time.time() - t0
    flag = "  <-- still running, gave up" if hit_budget else ""
    print(f"{seed:>4} {state.step:>8} {peak_prey:>10} {peak_pred:>9} {secs:>7.1f}{flag}")
