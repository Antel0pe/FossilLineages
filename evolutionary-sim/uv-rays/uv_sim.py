"""UV / light sim on an x-z grid.

The world is a 10x10 column of water (or air): x is horizontal, z is HEIGHT.
Surface UV and surface light both ride the same 10-second sine wave, 0 -> 1.
Both fade linearly on the way down: 10% per z unit, so the top row keeps 100%
and the bottom row keeps 0%.

Each organism sits at a fixed x and only ever moves on z. Its one gene,
`move_gene`, says how strongly it swims toward (or away from) light:

    dz = light_at(z) * move_gene

UV at whatever height it lands on is added to its damage. At MAX_DAMAGE it
dies, and a random survivor's gene — mutated by 5% — is used to initialize a
replacement at the dead one's x.
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
MAX_DAMAGE = 5.0
MOVE_LIMIT = 2.0  # move_gene is clamped to [-MOVE_LIMIT, +MOVE_LIMIT]
INIT_MOVE = 0.5  # genes start uniform in [-INIT_MOVE, +INIT_MOVE]
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


def clamp_z(z):
    # hard walls: the world does not wrap on z
    return round(max(0.0, min(float(GRID), z)), 2)


def clamp_gene(gene):
    return round(max(-MOVE_LIMIT, min(MOVE_LIMIT, gene)), 4)


def living(organisms):
    return [o for o in organisms if o.alive]


def average_gene(organisms):
    alive = living(organisms)
    return sum(o.move_gene for o in alive) / len(alive) if alive else 0.0


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


class Organism:
    def __init__(self, name, x, z, move_gene):
        self.name = name
        self.x = x  # fixed for life — organisms only move on z
        self.z = clamp_z(z)
        self.move_gene = clamp_gene(move_gene)
        self.damage = 0.0
        self.alive = True
        self.age = 0

    @classmethod
    def init(cls, x, move_gene=None, z=None):
        if move_gene is None:
            move_gene = random.uniform(-INIT_MOVE, INIT_MOVE)
        if z is None:
            z = random.uniform(0, GRID)
        return cls(next_name(), x, z, move_gene)

    def sense_and_move(self, t):
        """One step: read the light here, swim, then soak up the UV there."""
        light = light_at(self.z, t)
        self.z = clamp_z(self.z + light * self.move_gene)
        uv = uv_at(self.z, t)
        self.damage = round(self.damage + uv, 2)
        self.age += 1
        return light, uv


def sim_step(organisms, step):
    """Advance every living organism one step; replace anyone who dies."""
    t = step * STEP_DT
    events = []

    for org in living(organisms):
        org.sense_and_move(t)

    for i, org in enumerate(organisms):
        if not org.alive or org.damage < MAX_DAMAGE:
            continue
        org.alive = False
        events.append(f"{org.name} died at z={org.z:.2f} (damage {org.damage:.2f})")

        survivors = living(organisms)
        if not survivors:
            events.append("everyone is dead")
            break
        parent = random.choice(survivors)
        # newborn starts at its parent's height, not a random one
        child = Organism.init(org.x, mutate(parent.move_gene), z=parent.z)
        organisms[i] = child  # the x slot is reused by the newborn
        events.append(
            f"{parent.name} (gene {parent.move_gene:+.2f}) seeded "
            f"{child.name} (gene {child.move_gene:+.2f}) at z={child.z:.2f}"
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
    print(
        "final genes: "
        + ", ".join(f"{o.move_gene:+.2f}" for o in organisms if o.alive)
    )


if __name__ == "__main__":
    main()
