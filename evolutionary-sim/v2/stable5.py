"""The window is narrow: prey must out-breed predation without exploding."""

import itertools
import random
import statistics

import sim

STEPS = 500
EXPLODE = 8000


def run(seed, speed, dist, rep, catches, starve):
    sim.CATCH_DISTANCE = dist
    sim.PREY_REPRODUCE_STEPS, sim.CATCHES_TO_REPRODUCE = rep, catches
    sim.PREDATOR_STARVE_STEPS = starve
    random.seed(seed)
    sim.reset_names()
    prey = [sim.Prey(sim.next_name("prey"), 1.0,
                     sim.random_position(), sim.random_position())
            for _ in range(sim.POPULATION)]
    preds = [sim.Predator(sim.next_name("predator"), speed,
                          sim.random_position(), sim.random_position())
             for _ in range(sim.POPULATION)]
    ps, qs = [], []
    for _ in range(STEPS):
        prey, preds, _ = sim.sim_step(prey, preds)
        sim.reproduce_prey(prey)
        sim.starve_predators(preds)
        prey, preds = sim.living(prey), sim.living(preds)
        ps.append(len(prey))
        qs.append(len(preds))
        if not prey or not preds or len(prey) > EXPLODE:
            return False, ps, qs
    return True, ps, qs


best = []
for speed, dist, rep, catches, starve in itertools.product(
    [1.1, 1.25, 1.5], [1.0, 2.0], [3, 5, 8, 12], [1, 2, 3], [25, 50]
):
    rows = [run(s, speed, dist, rep, catches, starve) for s in (1, 2)]
    if all(r[0] for r in rows):
        tail = [v for _, ps, _ in rows for v in ps[STEPS // 2:]]
        ptail = [v for _, _, qs in rows for v in qs[STEPS // 2:]]
        swing = max(tail) / max(1, min(tail))
        best.append((swing, speed, dist, rep, catches, starve,
                     statistics.median(tail), statistics.median(ptail),
                     min(tail), max(tail), min(ptail), max(ptail)))
        print(f"  OK speed={speed} dist={dist} rep={rep} cat={catches} "
              f"starve={starve}: prey {min(tail)}-{max(tail)}, "
              f"pred {min(ptail)}-{max(ptail)}, swing {swing:.1f}x")

best.sort()
print(f"\n{len(best)} configs survived 500 steps without exploding")
for row in best[:5]:
    (swing, speed, dist, rep, catches, starve, pmed, qmed,
     pmin, pmax, qmin, qmax) = row
    print(f"  BEST speed={speed} dist={dist} rep={rep} cat={catches} starve={starve}"
          f" -> prey med {pmed:.0f} ({pmin}-{pmax}), "
          f"pred med {qmed:.0f} ({qmin}-{qmax}), swing {swing:.2f}x")
