"""
Thermoregulation evolutionary sim: selection pressure on surface-area-to-volume (SA:V)
ratio as ambient temperature oscillates around a fixed ideal body temperature.
See ../verification-criteria/2026-07-14-thermoregulation-evolution-sim.md for the spec.
"""

import math
import os

import matplotlib.pyplot as plt
import numpy as np

SEED = 42

IDEAL_TEMP = 30.0
TEMP_AMPLITUDE = 10.0
TEMP_PERIOD = 400  # generations for one full hot-cold-hot cycle
GENERATIONS = 1000

STARTING_POPULATION = 300
CARRYING_CAPACITY = 300

RATIO_MEAN_START = 1.0
RATIO_STD_START = 0.15
RATIO_MIN = 0.3
RATIO_MAX = 3.0

CALORIE_MEAN = 100.0
CALORIE_STD = 25.0

BASE_METABOLIC_RATE = 3.0

MUTATION_STD = 0.15
MUTATION_CAP = 0.3

LITTER_LEFTOVER_DIVISOR = 45.5
LITTER_MIN = 1
LITTER_MAX = 4

OUTPUT_PNG = os.path.join(os.path.dirname(__file__), "thermo_sim_result.png")


def ambient_temperature(generation):
    return IDEAL_TEMP + TEMP_AMPLITUDE * math.cos(2 * math.pi * generation / TEMP_PERIOD)


def thermoregulation_cost(ratios, temp):
    temp_gap = abs(temp - IDEAL_TEMP)
    if temp < IDEAL_TEMP:
        ratio_factor = ratios
    else:
        ratio_factor = 1.0 / ratios
    return BASE_METABOLIC_RATE * temp_gap * ratio_factor


def breed(survivor_ratios, survivor_leftover, rng):
    n = len(survivor_ratios)
    order = rng.permutation(n)
    children = []
    for i in range(0, n - 1, 2):
        a, b = order[i], order[i + 1]
        parent_avg_ratio = 0.5 * (survivor_ratios[a] + survivor_ratios[b])
        pair_leftover = 0.5 * (survivor_leftover[a] + survivor_leftover[b])

        litter_size = int(np.clip(1 + math.floor(pair_leftover / LITTER_LEFTOVER_DIVISOR), LITTER_MIN, LITTER_MAX))

        for _ in range(litter_size):
            mutation = np.clip(rng.normal(0, MUTATION_STD), -MUTATION_CAP, MUTATION_CAP)
            child_ratio = np.clip(parent_avg_ratio + mutation, RATIO_MIN, RATIO_MAX)
            children.append(child_ratio)

    return np.array(children)


def run_simulation():
    rng = np.random.default_rng(SEED)

    population = np.clip(
        rng.normal(RATIO_MEAN_START, RATIO_STD_START, STARTING_POPULATION), RATIO_MIN, RATIO_MAX
    )

    log_generations = []
    log_temps = []
    log_avg_ratios = []
    log_population_sizes = []

    extinction_generation = None

    for gen in range(GENERATIONS):
        temp = ambient_temperature(gen)
        n = len(population)

        log_generations.append(gen)
        log_temps.append(temp)
        log_avg_ratios.append(float(np.mean(population)))
        log_population_sizes.append(n)

        if n < 2:
            extinction_generation = gen
            break

        calories = np.clip(rng.normal(CALORIE_MEAN, CALORIE_STD, n), 0, None)
        cost = thermoregulation_cost(population, temp)
        survived = calories >= cost

        survivor_ratios = population[survived]
        survivor_leftover = calories[survived] - cost[survived]

        if len(survivor_ratios) < 2:
            population = np.array([])
            continue

        population = breed(survivor_ratios, survivor_leftover, rng)

        if len(population) > CARRYING_CAPACITY:
            keep_idx = rng.choice(len(population), size=CARRYING_CAPACITY, replace=False)
            population = population[keep_idx]

    return {
        "generations": np.array(log_generations),
        "temps": np.array(log_temps),
        "avg_ratios": np.array(log_avg_ratios),
        "population_sizes": np.array(log_population_sizes),
        "extinction_generation": extinction_generation,
    }


def normalize(series):
    lo, hi = series.min(), series.max()
    if hi - lo < 1e-9:
        return np.full_like(series, 0.5, dtype=float)
    return (series - lo) / (hi - lo)


def plot_results(result):
    generations = result["generations"]
    temps = result["temps"]
    avg_ratios = result["avg_ratios"]
    population_sizes = result["population_sizes"]

    fig, ax = plt.subplots(figsize=(12, 6))

    ax.plot(generations, normalize(temps), color="tab:red", label="Ambient temperature (normalized)")
    ax.plot(generations, normalize(avg_ratios), color="tab:blue", label="Avg SA:V ratio (normalized)")
    ax.plot(
        generations,
        normalize(population_sizes),
        color="tab:green",
        label="Population size (normalized)",
    )

    ax.set_xlabel("Generation")
    ax.set_ylabel("Normalized value (0-1, min-max per series)")
    title = "Thermoregulation selection pressure on SA:V ratio"
    if result["extinction_generation"] is not None:
        title += f" (population extinct at generation {result['extinction_generation']})"
    ax.set_title(title)
    ax.legend(loc="upper right")
    fig.tight_layout()
    fig.savefig(OUTPUT_PNG, dpi=150)
    print(f"Saved plot to {OUTPUT_PNG}")


def main():
    result = run_simulation()

    print(f"Generations completed: {len(result['generations'])}")
    print(f"Final population size: {result['population_sizes'][-1]}")
    print(f"Final avg SA:V ratio: {result['avg_ratios'][-1]:.4f}")
    if result["extinction_generation"] is not None:
        print(f"Population went extinct at generation {result['extinction_generation']}")

    correlation = np.corrcoef(result["temps"], result["avg_ratios"])[0, 1]
    print(f"Correlation(temp, avg_ratio), zero lag = {correlation:.4f}")

    best_lag, best_corr = 0, correlation
    for lag in range(1, TEMP_PERIOD // 2):
        if lag >= len(result["temps"]):
            break
        c = np.corrcoef(result["temps"][:-lag], result["avg_ratios"][lag:])[0, 1]
        if abs(c) > abs(best_corr):
            best_lag, best_corr = lag, c
    print(f"Strongest correlation at lag={best_lag} generations: {best_corr:.4f}")
    print("(positive correlation expected: ratio should rise with temp and fall with it,")
    print(" with a lag since selection needs a few generations to shift the trait)")

    print(f"Ratio range observed: [{result['avg_ratios'].min():.4f}, {result['avg_ratios'].max():.4f}]")
    print(f"Temp range observed: [{result['temps'].min():.4f}, {result['temps'].max():.4f}]")
    print(f"Population size range observed: [{result['population_sizes'].min()}, {result['population_sizes'].max()}]")

    plot_results(result)


if __name__ == "__main__":
    main()
