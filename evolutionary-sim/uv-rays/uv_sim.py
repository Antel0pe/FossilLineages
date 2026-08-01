"""UV / light sim on an x-z grid.

The world is a 10x10 column of water (or air): x is horizontal, z is HEIGHT.
Surface UV and surface light both ride the same 10-second sine wave, 0 -> 1.
Both fade linearly on the way down: 10% per z unit, so the top row keeps 100%
and the bottom row keeps 0%.

Each organism sits at a fixed x and only ever moves on z. It has two genes:

    dz = (light_at(z) - pref_light) * move_gene

`pref_light` is the light level it wants to be sitting in; `move_gene` is how
hard it swims to get there. The point of the subtraction is that standing still
means "the light here is what I want", a DECISION, instead of "the light here
happens to be zero", a coordinate. Earlier versions multiplied light directly
and froze every organism solid wherever the multiplier hit 0 — first at the dark
bottom, then (after remapping light onto -1..+1) at a fixed mid-water isolume no
gene could move.

The trade-off that makes pref_light worth evolving: at night light is 0
everywhere, so dz = -pref_light * move_gene — the ONLY thing driving the climb
to the food is how much light the organism wishes it had. A low pref_light buys
a dark, safe daytime depth but a slow night climb; a high one climbs fast but
parks shallow in the UV. pref_light = 0 never moves at all and starves.

UV at whatever height it lands on is added to its damage. At MAX_DAMAGE it
dies, and a random survivor's gene — mutated by 5% — is used to initialize a
replacement at the dead one's z.

Food is the counter-pressure. A column grows `1 - surface_intensity` worth of
food — nothing at noon, a full unit at midnight — and all of it sits in the top
three layers, split 70 / 25 / 5. Everything below layer 8 is always barren. An
organism eats whatever is in the layer it is standing in; hunger climbs a flat
0.01 a step and kills at 1.0. So the surface is where the food is AND where the
UV is, and the two clocks are opposed: food peaks exactly when UV is gone.
"""

import math
import random

GRID = 10  # world is GRID x GRID, x in [0, GRID], z in [0, GRID]
POPULATION = 10  # one organism per x increment: 0, 1, ... 9
CYCLE_SECONDS = 10  # a full 0 -> 1 -> 0 sine cycle of surface intensity
STEPS_PER_SECOND = 10
STEP_DT = 1 / STEPS_PER_SECOND
TOTAL_STEPS = 1000  # 10 full day/night cycles

DECAY_PER_UNIT = 0.10  # 10% of the surface value lost per z unit going down
MAX_DAMAGE = 50.0
FOOD_LAYERS = [0.70, 0.25, 0.05]  # share of the column's food, topmost layer first
HUNGER_PER_STEP = 0.01
MAX_HUNGER = 1.0
MOVE_LIMIT = 2.0  # move_gene is clamped to [-MOVE_LIMIT, +MOVE_LIMIT]
INIT_MOVE = 0.5  # move_gene starts uniform in [-INIT_MOVE, +INIT_MOVE]
MUTATION = 0.05


def surface_intensity(t):
    """Surface UV (and light) at time t seconds — one 0..1 sine cycle per 10s.

    Phase-shifted so the run starts at 0 (night) instead of mid-day.
    """
    return round((1 - math.cos(2 * math.pi * t / CYCLE_SECONDS)) / 2, 2)


def depth_factor(z):
    """Fraction of the surface value that survives down to height z.

    10% is lost per z unit, so z=GRID keeps 1.0 and z=0 keeps 0.0.
    """
    return round(max(0.0, min(1.0, z * DECAY_PER_UNIT)), 2)


def uv_at(z, t):
    return round(surface_intensity(t) * depth_factor(z), 2)


def light_at(z, t):
    # light is the same wave with the same decay — same numbers, different use
    return round(surface_intensity(t) * depth_factor(z), 2)


def layer_from_top(z):
    """Which band z is standing in, 0 = topmost layer, GRID-1 = the floor band."""
    return min(GRID - 1, max(0, GRID - math.ceil(z) if z > 0 else GRID - 1))


def column_food(t):
    """Food grown in a whole column this step — the inverse of surface light."""
    return round(1 - surface_intensity(t), 2)


def food_at(z, t):
    """Food sitting in the layer at height z. Only the top three layers have any."""
    layer = layer_from_top(z)
    if layer >= len(FOOD_LAYERS):
        return 0.0
    return round(column_food(t) * FOOD_LAYERS[layer], 2)


def light_error(z, t, pref_light):
    """How far the light here is from the light the organism wants.

    Positive means "brighter than I like" — with a negative move_gene that
    pushes it down. This is the term that used to be plain light, and moving it
    onto a gene is what turns a standstill into a choice.
    """
    return round(light_at(z, t) - pref_light, 2)


def clamp_z(z):
    # hard walls: the world does not wrap on z
    return round(max(0.0, min(float(GRID), z)), 2)


def clamp_gene(gene):
    return round(max(-MOVE_LIMIT, min(MOVE_LIMIT, gene)), 4)


def living(organisms):
    return [o for o in organisms if o.alive]


def clamp_pref(pref):
    return round(max(0.0, min(1.0, pref)), 4)


def average_gene(organisms):
    alive = living(organisms)
    return sum(o.move_gene for o in alive) / len(alive) if alive else 0.0


def average_pref(organisms):
    alive = living(organisms)
    return sum(o.pref_light for o in alive) / len(alive) if alive else 0.0


_name_count = 0


def reset_names():
    global _name_count
    _name_count = 0


def next_name():
    global _name_count
    _name_count += 1
    return f"org {_name_count}"


def mutate(gene):
    return clamp_gene(gene * random.uniform(1 - MUTATION, 1 + MUTATION))


def mutate_pref(pref):
    # additive, not multiplicative: pref_light lives near 0, and a x1.05 nudge on
    # 0.02 is no nudge at all — a lineage that drifted low could never climb back
    return clamp_pref(pref + random.uniform(-MUTATION, MUTATION))


class Organism:
    def __init__(self, name, x, z, move_gene, pref_light):
        self.name = name
        self.x = x  # fixed for life — organisms only move on z
        self.z = clamp_z(z)
        self.move_gene = clamp_gene(move_gene)
        self.pref_light = clamp_pref(pref_light)
        self.damage = 0.0
        self.hunger = 0.0
        self.alive = True
        self.age = 0

    @classmethod
    def init(cls, x, move_gene=None, pref_light=None, z=None):
        if move_gene is None:
            move_gene = random.uniform(-INIT_MOVE, INIT_MOVE)
        if pref_light is None:
            pref_light = random.uniform(0, 1)
        if z is None:
            z = random.uniform(0, GRID)
        return cls(next_name(), x, z, move_gene, pref_light)

    def sense_and_move(self, t):
        """One step: read the light here, swim, then take the UV and food there."""
        error = light_error(self.z, t, self.pref_light)
        self.z = clamp_z(self.z + error * self.move_gene)
        uv = uv_at(self.z, t)
        self.damage = round(self.damage + uv, 2)
        # hunger always ticks up; whatever food is in this layer pays it back down
        food = food_at(self.z, t)
        self.hunger = round(max(0.0, self.hunger + HUNGER_PER_STEP - food), 2)
        self.age += 1
        return error, uv, food

    def cause_of_death(self):
        if self.damage >= MAX_DAMAGE:
            return f"uv damage {self.damage:.2f}"
        if self.hunger >= MAX_HUNGER:
            return f"starved (hunger {self.hunger:.2f})"
        return None


def sim_step(organisms, step):
    """Advance every living organism one step; replace anyone who dies."""
    t = step * STEP_DT
    events = []

    for org in living(organisms):
        org.sense_and_move(t)

    for i, org in enumerate(organisms):
        if not org.alive:
            continue
        cause = org.cause_of_death()
        if cause is None:
            continue
        org.alive = False
        events.append(f"{org.name} died at z={org.z:.2f} — {cause}")

        survivors = living(organisms)
        if not survivors:
            events.append("everyone is dead")
            break
        parent = random.choice(survivors)
        # newborn starts at its parent's height, not a random one
        child = Organism.init(
            org.x,
            mutate(parent.move_gene),
            mutate_pref(parent.pref_light),
            z=parent.z,
        )
        organisms[i] = child  # the x slot is reused by the newborn
        events.append(
            f"{parent.name} (gene {parent.move_gene:+.2f} pref {parent.pref_light:.2f})"
            f" seeded {child.name} (gene {child.move_gene:+.2f}"
            f" pref {child.pref_light:.2f}) at z={child.z:.2f}"
        )

    return events


def main():
    reset_names()
    organisms = [Organism.init(x) for x in range(POPULATION)]

    for step in range(TOTAL_STEPS):
        for line in sim_step(organisms, step):
            print(line)
        if not living(organisms):
            print(f"simulation ended at step {step}")
            break

    print(f"average move gene: {average_gene(organisms):+.3f}")
    print(f"average pref light: {average_pref(organisms):.3f}")
    print(
        "final genes: "
        + ", ".join(
            f"({o.move_gene:+.2f}, {o.pref_light:.2f})" for o in organisms if o.alive
        )
    )


if __name__ == "__main__":
    main()
