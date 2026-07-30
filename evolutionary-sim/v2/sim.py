import math
import random

WORLD_SIZE = 50
MIN_SPEED = 0.95
MAX_SPEED = 1.05
SPEED_CAP = 5
CATCH_DISTANCE = 0.5
MUTATION = 0.05
POPULATION = 10
GENERATION_LENGTH = 100
TOTAL_GENERATIONS = 10
TOTAL_STEPS = GENERATION_LENGTH * TOTAL_GENERATIONS


def wrapped_delta(start, end):
    """Shortest signed distance from start to end on a wrapping axis."""
    delta = (end - start) % WORLD_SIZE
    if delta > WORLD_SIZE / 2:
        delta -= WORLD_SIZE
    return delta


def distance(a, b):
    return math.hypot(wrapped_delta(a.x, b.x), wrapped_delta(a.y, b.y))


def wrap_position(value):
    # wrap first, then round — rounding first leaves float dust on negatives.
    # the outer modulo catches 99.999 rounding up to a full 100.0
    return round(value % WORLD_SIZE, 2) % WORLD_SIZE


def random_position():
    return wrap_position(random.uniform(0, WORLD_SIZE))


def living_prey(prey_list):
    return [p for p in prey_list if p.alive]


def mutate(speed):
    new_speed = speed * random.uniform(1 - MUTATION, 1 + MUTATION)
    return min(new_speed, SPEED_CAP)


class Prey:
    def __init__(self, name, speed, x, y):
        self.name = name
        self.speed = min(speed, SPEED_CAP)
        self.x = x
        self.y = y
        self.alive = True
        self.survival_time = 0

    @classmethod
    def init(cls, name):
        return cls(
            name,
            random.uniform(MIN_SPEED, MAX_SPEED),
            random_position(),
            random_position(),
        )

    def copy(self):
        clone = Prey(self.name, self.speed, self.x, self.y)
        clone.alive = self.alive
        clone.survival_time = self.survival_time
        return clone

    def breed(self, name, speed):
        return Prey(
            name,
            mutate(speed),
            random_position(),
            random_position(),
        )

    def move(self, predators):
        if not predators:
            return
        threat = min(predators, key=lambda p: distance(self, p))
        dx = wrapped_delta(threat.x, self.x)
        dy = wrapped_delta(threat.y, self.y)
        length = math.hypot(dx, dy)
        if length == 0:
            dx, dy = random.uniform(-1, 1), random.uniform(-1, 1)
            length = math.hypot(dx, dy)
        self.x = wrap_position(self.x + self.speed * dx / length)
        self.y = wrap_position(self.y + self.speed * dy / length)


class Predator:
    def __init__(self, name, speed, x, y):
        self.name = name
        self.speed = min(speed, SPEED_CAP)
        self.x = x
        self.y = y
        self.catches = 0

    @classmethod
    def init(cls, name):
        return cls(
            name,
            random.uniform(MIN_SPEED, MAX_SPEED),
            random_position(),
            random_position(),
        )

    def copy(self):
        clone = Predator(self.name, self.speed, self.x, self.y)
        clone.catches = self.catches
        return clone

    def breed(self, name, speed):
        return Predator(
            name,
            mutate(speed),
            random_position(),
            random_position(),
        )

    def move(self, prey_list):
        targets = living_prey(prey_list)
        if not targets:
            return
        target = min(targets, key=lambda p: distance(self, p))
        dx = wrapped_delta(self.x, target.x)
        dy = wrapped_delta(self.y, target.y)
        length = math.hypot(dx, dy)
        if length == 0:
            return
        self.x = wrap_position(self.x + self.speed * dx / length)
        self.y = wrap_position(self.y + self.speed * dy / length)


def sim_step(prey_list, predators):
    # snapshot: everyone decides based on last step's positions
    old_prey = [p.copy() for p in prey_list]
    old_predators = [p.copy() for p in predators]

    new_prey = [p.copy() for p in prey_list]
    new_predators = [p.copy() for p in predators]

    for prey in living_prey(new_prey):
        prey.move(old_predators)
    for predator in new_predators:
        predator.move(old_prey)

    catches = []
    for predator in new_predators:
        for prey in living_prey(new_prey):
            if distance(predator, prey) <= CATCH_DISTANCE:
                prey.alive = False
                predator.catches += 1
                catches.append(f"{predator.name} caught {prey.name}")
                break

    for prey in living_prey(new_prey):
        prey.survival_time += 1

    return new_prey, new_predators, catches


def pair_up(animals):
    """Pair animals two at a time at random. An odd one out is left unpaired."""
    if len(animals) == 1:  # nobody to pair with, so it breeds with itself
        return [(animals[0], animals[0])]
    shuffled = list(animals)  # a copy, so the caller's list keeps its order
    random.shuffle(shuffled)
    return list(zip(shuffled[::2], shuffled[1::2]))


def breed_pairs(pairs, prefix):
    """Fill a population from the pairs, cycling through them in turn.

    Returns the children and each pair's averaged speed.
    """
    pair_speeds = [(a.speed + b.speed) / 2 for a, b in pairs]
    children = []
    for i in range(POPULATION):
        parent = pairs[i % len(pairs)][0]
        children.append(parent.breed(f"{prefix} {i + 1}", pair_speeds[i % len(pairs)]))
    return children, pair_speeds


def repopulate(prey_list, predators, predator_speeds, prey_speeds):
    prey_pairs = pair_up(living_prey(prey_list))
    predator_pairs = pair_up(predators)

    if not prey_pairs:  # everything got eaten, so start the prey over
        new_prey = [Prey.init(f"prey {i + 1}") for i in range(POPULATION)]
        prey_pair_speeds = [p.speed for p in new_prey]
    else:
        new_prey, prey_pair_speeds = breed_pairs(prey_pairs, "prey")

    new_predators, predator_pair_speeds = breed_pairs(predator_pairs, "predator")

    prey_speeds.append(sum(prey_pair_speeds) / len(prey_pair_speeds))
    predator_speeds.append(sum(predator_pair_speeds) / len(predator_pair_speeds))
    return new_prey, new_predators


def main():
    prey_list = [Prey.init(f"prey {i + 1}") for i in range(POPULATION)]
    predators = [Predator.init(f"predator {i + 1}") for i in range(POPULATION)]

    predator_speeds = []
    prey_speeds = []

    step = 0
    while step < TOTAL_STEPS:
        prey_list, predators, catches = sim_step(prey_list, predators)
        for line in catches:
            print(line)

        step += 1
        if step % GENERATION_LENGTH == 0:
            prey_list, predators = repopulate(
                prey_list, predators, predator_speeds, prey_speeds
            )

    print("predator speed progression: " + ", ".join(f"{s:.3f}" for s in predator_speeds))
    print("prey speed progression: " + ", ".join(f"{s:.3f}" for s in prey_speeds))


if __name__ == "__main__":
    main()
