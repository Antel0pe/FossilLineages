import math
import random

WORLD_SIZE = 100
MIN_SPEED = 0.75
MAX_SPEED = 1.25
SPEED_CAP = 5
CATCH_DISTANCE = 0.5
MUTATION = 0.01
POPULATION = 10
GENERATION_LENGTH = 10
TOTAL_STEPS = 100


def wrapped_delta(start, end):
    """Shortest signed distance from start to end on a wrapping axis."""
    delta = (end - start) % WORLD_SIZE
    if delta > WORLD_SIZE / 2:
        delta -= WORLD_SIZE
    return delta


def distance(a, b):
    return math.hypot(wrapped_delta(a.x, b.x), wrapped_delta(a.y, b.y))


def wrap_position(value):
    return round(value, 2) % WORLD_SIZE


def random_position():
    return wrap_position(random.uniform(0, WORLD_SIZE))


def living_prey(prey_list):
    return [p for p in prey_list if p.alive]


def print_population(prey_list, predators):
    for prey in prey_list:
        print(f"  {prey.name}: {prey.speed:.3f}")
    for predator in predators:
        print(f"  {predator.name}: {predator.speed:.3f}")


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

    def breed(self, name):
        return Prey(
            name,
            mutate(self.speed),
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

    def breed(self, name):
        return Predator(
            name,
            mutate(self.speed),
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

    # for prey in living_prey(new_prey):
    #     prey.move(old_predators)
    for predator in new_predators:
        predator.move(old_prey)

    for predator in new_predators:
        for prey in living_prey(new_prey):
            if distance(predator, prey) <= CATCH_DISTANCE:
                prey.alive = False
                predator.catches += 1
                print(f"  {predator.name} caught {prey.name}")
                break

    for prey in living_prey(new_prey):
        prey.survival_time += 1

    return new_prey, new_predators


def repopulate(prey_list, predators, predator_speeds, prey_speeds):
    best_predator = max(predators, key=lambda p: p.catches)
    best_prey = max(prey_list, key=lambda p: p.survival_time)

    predator_speeds.append(best_predator.speed)
    prey_speeds.append(best_prey.speed)

    print(
        f"new breed population started "
        f"(predator base: {best_predator.name} speed {best_predator.speed:.3f}, "
        f"{best_predator.catches} catches | "
        f"prey base: {best_prey.name} speed {best_prey.speed:.3f}, "
        f"survived {best_prey.survival_time} steps)"
    )

    new_predators = [best_predator.breed(f"predator {i + 1}") for i in range(POPULATION)]
    new_prey = [best_prey.breed(f"prey {i + 1}") for i in range(POPULATION)]
    print_population(new_prey, new_predators)
    return new_prey, new_predators


def main():
    prey_list = [Prey.init(f"prey {i + 1}") for i in range(POPULATION)]
    predators = [Predator.init(f"predator {i + 1}") for i in range(POPULATION)]

    print("starting population")
    print_population(prey_list, predators)

    predator_speeds = []
    prey_speeds = []

    step = 0
    while step < TOTAL_STEPS:
        print(f"step {step}")
        prey_list, predators = sim_step(prey_list, predators)

        step += 1
        if step % GENERATION_LENGTH == 0:
            prey_list, predators = repopulate(
                prey_list, predators, predator_speeds, prey_speeds
            )

    print("predator speed progression: " + ", ".join(f"{s:.3f}" for s in predator_speeds))
    print("prey speed progression: " + ", ".join(f"{s:.3f}" for s in prey_speeds))


if __name__ == "__main__":
    main()
