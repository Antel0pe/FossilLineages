"""UV / light sim on an x-z grid.

The world is a 10x10 column of water (or air): x is horizontal, z is HEIGHT.
Surface UV and surface light both ride the same 10-second sine wave, 0 -> 1,
but they do NOT reach down the same way.

Light fades linearly: 10% of the surface value per z unit, so the top row keeps
100% and the bottom row keeps 0% — light is present at every depth.

UV is absorbed near the surface instead, exactly like food: the surface value is
a budget split 70 / 25 / 5 across the top three layers and nothing below. So
z <= 7 is a UV refuge at any hour, and the whole fight happens in the top three
layers, which is also the only place there is anything to eat.

Each organism sits at a fixed x and only ever moves on z. It steers on the two
things that are actually killing it, not on a proxy:

    dz = climb_gene * hunger - dive_gene * uv_at(z)

Both genes are >= 0. Hunger pushes up toward the food; the UV it is standing in
pushes down toward the dark. Standing still means those two exactly balance —
"the meal is worth precisely this much burn" — which is a decision, and one that
cannot get stuck to a place in the world, because hunger keeps climbing and so
keeps moving the balance point.

Every earlier version steered on light and kept freezing at whatever coordinate
made the multiplier zero: first the dark bottom (dz = light * gene), then a
fixed mid-water isolume (after remapping light onto -1..+1), then wherever
light happened to equal pref_light. The root cause was physical, not algebraic —
surface light hits exactly 0 at night, so light stops carrying any depth
information at all and no controller reading it can see. Hunger and local UV
never both vanish, so this one always has something to steer by.

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
TOTAL_STEPS = 100_000  # 10 full day/night cycles

DECAY_PER_UNIT = 0.10  # 10% of the surface value lost per z unit going down
MAX_DAMAGE = 1.0
FOOD_LAYERS = [0.70, 0.25, 0.05]  # share of the column's food, topmost layer first
UV_LAYERS = [0.70, 0.25, 0.05]  # share of the surface uv absorbed by each top layer
HUNGER_PER_STEP = 0.1
MAX_HUNGER = 1.0
CLIMB_LIMIT = 5.0  # climb_gene is clamped to [GENE_FLOOR, CLIMB_LIMIT]
DIVE_LIMIT = 64.0  # dive_gene is clamped to [GENE_FLOOR, DIVE_LIMIT]
GENE_FLOOR = 0.01  # never exactly 0 — multiplicative mutation can't leave zero
INIT_GENE = 2.0  # both genes start uniform in [GENE_FLOOR, INIT_GENE]
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


def layer_from_top(z):
    """Which band z is standing in, 0 = topmost layer, GRID-1 = the floor band."""
    return min(GRID - 1, max(0, GRID - math.ceil(z) if z > 0 else GRID - 1))


def uv_at(z, t):
    """UV is absorbed in the top three layers and never reaches below them."""
    layer = layer_from_top(z)
    if layer >= len(UV_LAYERS):
        return 0.0
    return round(surface_intensity(t) * UV_LAYERS[layer], 2)


def light_at(z, t):
    # unlike uv, light thins out gradually and is present at every depth
    return round(surface_intensity(t) * depth_factor(z), 2)


def column_food(t):
    """Food grown in a whole column this step — the inverse of surface light."""
    return round(1 - surface_intensity(t), 2)


def food_at(z, t):
    """Food sitting in the layer at height z. Only the top three layers have any."""
    layer = layer_from_top(z)
    if layer >= len(FOOD_LAYERS):
        return 0.0
    return round(column_food(t) * FOOD_LAYERS[layer], 2)


def clamp_z(z):
    # hard walls: the world does not wrap on z
    return round(max(0.0, min(float(GRID), z)), 2)


def clamp_climb(gene):
    return round(max(GENE_FLOOR, min(CLIMB_LIMIT, gene)), 4)


def clamp_dive(gene):
    return round(max(GENE_FLOOR, min(DIVE_LIMIT, gene)), 4)


def living(organisms):
    return [o for o in organisms if o.alive]


def average_climb(organisms):
    alive = living(organisms)
    return sum(o.climb_gene for o in alive) / len(alive) if alive else 0.0


def average_dive(organisms):
    alive = living(organisms)
    return sum(o.dive_gene for o in alive) / len(alive) if alive else 0.0


_name_count = 0


def reset_names():
    global _name_count
    _name_count = 0


def next_name():
    global _name_count
    _name_count += 1
    return f"org {_name_count}"


def mutate(gene):
    """Multiplicative, so one 5% rule works across genes of different scale.

    Both genes are strictly positive, so this can never flip a sign — and the
    GENE_FLOOR clamp keeps 0 from being an absorbing state a lineage falls into
    and can never multiply its way back out of.
    """
    return gene * random.uniform(1 - MUTATION, 1 + MUTATION)


class Organism:
    def __init__(self, name, x, z, climb_gene, dive_gene):
        self.name = name
        self.x = x  # fixed for life — organisms only move on z
        self.z = clamp_z(z)
        self.climb_gene = clamp_climb(climb_gene)  # how hard hunger pushes it up
        self.dive_gene = clamp_dive(dive_gene)  # how hard uv pushes it down
        self.damage = 0.0
        self.hunger = 0.0
        self.alive = True
        self.age = 0

    @classmethod
    def init(cls, x, climb_gene=None, dive_gene=None, z=None):
        if climb_gene is None:
            climb_gene = random.uniform(GENE_FLOOR, INIT_GENE)
        if dive_gene is None:
            dive_gene = random.uniform(GENE_FLOOR, INIT_GENE)
        if z is None:
            z = random.uniform(0, GRID)
        return cls(next_name(), x, z, climb_gene, dive_gene)

    def drive(self, t):
        """How far it wants to move: hunger pulling up, the uv here pushing down."""
        return round(
            self.climb_gene * self.hunger - self.dive_gene * uv_at(self.z, t), 2
        )

    def sense_and_move(self, t):
        """One step: weigh hunger against the uv here, swim, then pay both bills."""
        dz = self.drive(t)
        self.z = clamp_z(self.z + dz)
        uv = uv_at(self.z, t)
        self.damage = round(self.damage + uv, 2)
        # hunger always ticks up; whatever food is in this layer pays it back down
        food = food_at(self.z, t)
        self.hunger = round(max(0.0, self.hunger + HUNGER_PER_STEP - food), 2)
        self.age += 1
        return dz, uv, food

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
            mutate(parent.climb_gene),
            mutate(parent.dive_gene),
            z=parent.z,
        )
        organisms[i] = child  # the x slot is reused by the newborn
        events.append(
            f"{parent.name} (climb {parent.climb_gene:.2f} dive {parent.dive_gene:.2f})"
            f" seeded {child.name} (climb {child.climb_gene:.2f}"
            f" dive {child.dive_gene:.2f}) at z={child.z:.2f}"
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

    print(f"average climb gene: {average_climb(organisms):.3f}")
    print(f"average dive gene:  {average_dive(organisms):.3f}")
    print(
        "final genes (climb, dive): "
        + ", ".join(
            f"({o.climb_gene:.2f}, {o.dive_gene:.2f})" for o in organisms if o.alive
        )
    )


if __name__ == "__main__":
    main()
