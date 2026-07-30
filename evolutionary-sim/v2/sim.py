import math
import random

WORLD_SIZE = 50
MIN_SPEED = 0.95
MAX_SPEED = 1.05
SPEED_CAP = 5
CATCH_DISTANCE = 0.5
MUTATION = 0.05
POPULATION = 10  # starting count only — populations are unbounded now
GENERATION_LENGTH = 100
TOTAL_GENERATIONS = 10
TOTAL_STEPS = GENERATION_LENGTH * TOTAL_GENERATIONS

PREY_REPRODUCE_STEPS = 15  # every living prey spawns a child this often
CATCHES_TO_REPRODUCE = 9  # a predator spawns a child every Nth catch
PREDATOR_STARVE_STEPS = 65  # a predator dies after this many steps with no catch


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


def living(animals):
    return [a for a in animals if a.alive]


def average_speed(animals):
    alive = living(animals)
    return sum(a.speed for a in alive) / len(alive) if alive else 0.0


_name_counts = {}


def reset_names():
    _name_counts.clear()


def next_name(prefix):
    """Names have to keep counting up — populations grow past POPULATION now."""
    _name_counts[prefix] = _name_counts.get(prefix, 0) + 1
    return f"{prefix} {_name_counts[prefix]}"


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
        """Snapshot THIS prey for the next step — not a new animal.

        Every field has to carry over or the individual loses its history each
        step. A newborn is made by breed(), which starts all of this from zero.
        """
        clone = Prey(self.name, self.speed, self.x, self.y)
        clone.alive = self.alive
        clone.survival_time = self.survival_time
        return clone

    def breed(self, name, speed):
        # a newborn starts fresh: alive, survival_time 0 — see __init__
        return Prey(name, mutate(speed), self.x, self.y)  # spawns on the parent

    def move(self, predators):
        threats = living(predators)
        if not threats:
            return
        threat = min(threats, key=lambda p: distance(self, p))
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
        self.alive = True
        self.steps_without_catch = 0

    @classmethod
    def init(cls, name):
        return cls(
            name,
            random.uniform(MIN_SPEED, MAX_SPEED),
            random_position(),
            random_position(),
        )

    def copy(self):
        """Snapshot THIS predator for the next step — not a new animal.

        Every field has to carry over or the individual loses its history each
        step. A newborn is made by breed(), which starts all of this from zero.
        """
        clone = Predator(self.name, self.speed, self.x, self.y)
        clone.catches = self.catches
        clone.alive = self.alive
        clone.steps_without_catch = self.steps_without_catch
        return clone

    def breed(self, name, speed):
        # a newborn starts fresh: alive, catches 0, steps_without_catch 0 — see __init__
        return Predator(name, mutate(speed), self.x, self.y)  # spawns on the parent

    def move(self, prey_list):
        targets = living(prey_list)
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

    for prey in living(new_prey):
        prey.move(old_predators)
    for predator in living(new_predators):
        predator.move(old_prey)

    catches = []
    newborns = []
    for predator in living(new_predators):
        for prey in living(new_prey):
            if distance(predator, prey) <= CATCH_DISTANCE:
                prey.alive = False
                predator.catches += 1
                predator.steps_without_catch = 0
                catches.append(f"{predator.name} caught {prey.name}")
                if predator.catches % CATCHES_TO_REPRODUCE == 0:
                    child = predator.breed(next_name("predator"), predator.speed)
                    newborns.append(child)
                    catches.append(f"{predator.name} spawned {child.name}")
                break

    for prey in living(new_prey):
        prey.survival_time += 1
    for predator in living(new_predators):
        predator.steps_without_catch += 1

    # appended last so newborns do not hunt or age on the step they are born
    new_predators.extend(newborns)

    return new_prey, new_predators, catches


def reproduce_prey(prey_list):
    """Spawn a child for each prey that has survived another full interval.

    The clock is per animal, not global: a prey born on step 37 breeds on 47,
    57, and so on, independently of everyone else.
    """
    events = []
    for prey in living(prey_list):
        if prey.survival_time and prey.survival_time % PREY_REPRODUCE_STEPS == 0:
            child = prey.breed(next_name("prey"), prey.speed)
            prey_list.append(child)
            events.append(f"{prey.name} spawned {child.name}")
    return events


def starve_predators(predators):
    """Kill any predator that has gone too long without a catch."""
    events = []
    for predator in living(predators):
        if predator.steps_without_catch >= PREDATOR_STARVE_STEPS:
            predator.alive = False
            events.append(f"{predator.name} starved")
    return events


def main():
    reset_names()
    prey_list = [Prey.init(next_name("prey")) for _ in range(POPULATION)]
    predators = [Predator.init(next_name("predator")) for _ in range(POPULATION)]

    predator_speeds = []
    prey_speeds = []

    step = 0
    while step < TOTAL_STEPS:
        prey_list, predators, catches = sim_step(prey_list, predators)
        for line in catches:
            print(line)

        step += 1

        for line in reproduce_prey(prey_list):
            print(line)
        for line in starve_predators(predators):
            print(line)

        prey_speeds.append(average_speed(prey_list))
        predator_speeds.append(average_speed(predators))

        if not living(prey_list) or not living(predators):
            print(f"simulation ended at step {step}: ", end="")
            print(f"{len(living(prey_list))} prey, {len(living(predators))} predators")
            break

    print("predator speed progression: " + ", ".join(f"{s:.3f}" for s in predator_speeds))
    print("prey speed progression: " + ", ".join(f"{s:.3f}" for s in prey_speeds))


if __name__ == "__main__":
    main()
