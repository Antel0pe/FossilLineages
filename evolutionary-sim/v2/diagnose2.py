import random

import sim

STEPS = 400
EXPLODE = 60000  # generous, to see whether an equilibrium exists higher up


def run(seed, rep, catches, starve):
    sim.PREY_REPRODUCE_STEPS, sim.CATCHES_TO_REPRODUCE = rep, catches
    sim.PREDATOR_STARVE_STEPS = starve
    random.seed(seed)
    sim.reset_names()
    prey = [sim.Prey.init(sim.next_name("prey")) for _ in range(sim.POPULATION)]
    preds = [sim.Predator.init(sim.next_name("predator")) for _ in range(sim.POPULATION)]
    total_catches = 0
    pred_steps = 0
    for step in range(1, STEPS + 1):
        prey, preds, ev = sim.sim_step(prey, preds)
        total_catches += sum(1 for e in ev if "caught" in e)
        pred_steps += len(sim.living(preds))
        sim.reproduce_prey(prey)
        sim.starve_predators(preds)
        prey, preds = sim.living(prey), sim.living(preds)
        if not preds:
            return "predators died", step, len(prey), total_catches, pred_steps
        if not prey:
            return "prey died", step, 0, total_catches, pred_steps
        if len(prey) > EXPLODE:
            return "prey exploded", step, len(prey), total_catches, pred_steps
    return "STABLE", STEPS, len(prey), total_catches, pred_steps


print(f"{'rep':>4}{'cat':>4}{'starve':>7}  {'outcome':>15}{'@step':>7}{'prey':>8}"
      f"  catches/predator/step")
for rep, catches, starve in [
    (15, 1, 45), (15, 1, 60), (15, 1, 100), (30, 1, 45), (30, 1, 100),
    (60, 1, 100), (10, 1, 30), (5, 1, 20), (20, 1, 60), (40, 1, 80),
]:
    outcome, step, n, tc, ps = run(1, rep, catches, starve)
    rate = tc / ps if ps else 0
    print(f"{rep:>4}{catches:>4}{starve:>7}  {outcome:>15}{step:>7}{n:>8}"
          f"  {rate:.4f}")

print("\nWhat rate would be needed to hold prey steady?")
for rep in [15, 30, 60]:
    print(f"  prey_rep={rep}: prey grow {100 / rep:.1f}%/step, so predators must kill "
          f"{100 / rep:.1f}% of the prey every step")
