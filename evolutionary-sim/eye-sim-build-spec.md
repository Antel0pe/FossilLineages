# Eye evolution simulator — build spec

Numbers only. Derivations, evidence and reasoning live in
[eye-evolution-real-conditions.md](eye-evolution-real-conditions.md); section refs like `[R §9.3]`
point there.

**Two columns run through this document:**

- **SET** — a fact about bodies, water, chemistry or light. Hard-code it.
- **EVOLVED** — a choice an animal makes. **Put it in the genome. Never hard-code it.** Where a
  seed value is given, it is a starting point for generation 0 only; mutation acts on it from the
  first generation.

If a value is missing, that is a bug in this spec — do not invent one.

---

## 1. Units and global constants

| Symbol | Value | Unit | Meaning |
|---|---|---|---|
| `J_PER_ML_O2` | 20.1 | J mL⁻¹ | oxycalorific equivalent |
| `KJ_PER_G_C` | 45 | kJ g⁻¹ | energy per gram of organic carbon |
| `E_SOFT_PELAGIC` | 3600 | J g⁻¹ wet | energy density, soft-bodied pelagic tissue |
| `E_SOFT_BENTHIC` | 2600 | J g⁻¹ wet | energy density, benthic tissue |
| `E_CARRION` | 2900 | J g⁻¹ wet | decayed tissue |
| `E_DETRITUS` | 8000 | J g⁻¹ dry | refractory detritus |
| `TISSUE_DENSITY` | 1.05 | g cm⁻³ | for mass-from-length |
| `LAMBDA` | 0.50 | µm | design wavelength (blue-green) |
| `K_ABSORB` | 0.0067 | µm⁻¹ | visual pigment absorption coefficient |
| `MEMBRANE_LAYER_THICKNESS` | 0.030 | µm | per stacked layer |
| `SNR_THRESHOLD` | 2.0 | — | Rose criterion for detection |
| `Q10` | 2.25 | — | metabolic temperature coefficient |
| `T_REF` | 28 | °C | reference temperature for all metabolic constants |
| `DAY_LENGTH` | 21.0 | h | Cambrian solar day |
| `DAYLIGHT_HOURS` | 10.5 | h | low latitude |
| `TWILIGHT_DURATION` | 0.67 | h | each end |
| `LUNAR_PERIOD` | 31.0 | days of 21 h | synodic month |
| `TICK` | 0.1 | s | recommended simulation timestep |

Temperature scaling applied to every metabolic rate: `rate(T) = rate(T_REF) * Q10^((T - T_REF)/10)`

---

## 2. Epoch schedule [R §4.1]

Run epochs in order. Advance when the population's median eye reaches the target class or the
generation cap is hit, whichever first.

| Parameter | Epoch 1 | Epoch 2 | Epoch 3 |
|---|---|---|---|
| `epoch_name` | pre_predation | predation_begins | visual_arms_race |
| `target_eye_class` | III | IV | IV (refine) |
| `generation_cap` | 40,000 | 30,000 | 30,000 |
| `pO2_PAL` | 0.05 → 0.16 | 0.16 → 0.25 | 0.24 → 0.48 |
| `dissolved_O2_mg_L` | 0.7 | 1.6 | 2.25 |
| `temperature_C` | 22.5 | 27.5 | 28.0 |
| `Kd_PAR_base` | 0.12 | 0.25 | 0.55 |
| `primary_production_gC_m2_yr` | 30 | 60 | 100 |
| `predator_species_active` | none | `chaetognath` only | `anomalocaris`, `isoxys`, `chaetognath` |
| `predation_mortality_target` | 0.00 | 0.15 | 0.45 |
| `nekton_present` | false | rare | true |
| `founder_body_mass_g` | 0.10 | 0.15 | 0.20 |

`pO2_PAL` ramps linearly across the epoch with multiplicative noise, σ = 0.15, autocorrelation
τ = 500 generations.

**Aerobic scope** (gates burst availability): `aerobic_scope = clamp(pO2_PAL / 0.30, 0.15, 1.0)`.
Multiplies `slow_pool_capacity` in §12.

---

## 3. Arena

| Parameter | Value | Unit | Affects |
|---|---|---|---|
| `arena_x`, `arena_y` | 150 × 150 | m | world size; **must be ≥100 m per side** or apex predators are non-viable [R §9.6] |
| `arena_depth_min` | 0 | m | surface |
| `arena_depth_max` | 40 | m | seafloor |
| `modal_depth` | 15 | m | |
| `boundary` | toroidal in x,y; reflecting in z | — | |
| `resource_grid_cell` | 1.0 × 1.0 | m | resolution of all resource fields |
| `water_column_layers` | 1.0 | m | vertical resolution of light and phytoplankton |
| `superindividual_K[myllokunmingid]` | 10 | — | one agent represents 10 real individuals |
| `superindividual_K[others]` | 1 | — | |
| `current_speed_background` | 0.02–0.10 | m s⁻¹ | station-holding cost, drift |
| `current_speed_storm` | 0.3–1.0 | m s⁻¹ | |
| `storm_interval` | 20–60 | days | turbidity spike trigger |
| `storm_duration` | 1–4 | days | |
| `salinity` | 25–35 | PSU | cosmetic; no mechanical effect |
| `substrate_reflectance` | 0.15 | — | background radiance when looking down |
| `patch_thicket_diameter` | 1–8 | m | class-III habitat structure |
| `patch_thicket_cover` | 0.05–0.15 | fraction of seafloor | |

---

## 4. Light field [R §6]

### 4.1 Surface radiance

| Condition | `L_surface` (quanta m⁻² sr⁻¹ s⁻¹) | in quanta µm⁻² sr⁻¹ s⁻¹ |
|---|---|---|
| Direct sun, noon | 2.0 × 10²⁰ | 2.0 × 10⁸ |
| Overcast day | 2.0 × 10¹⁹ | 2.0 × 10⁷ |
| Sunrise / sunset | 3.2 × 10¹⁷ | 3.2 × 10⁵ |
| Deep twilight | 3.2 × 10¹⁶ | 3.2 × 10⁴ |
| Full moon | 1.0 × 10¹⁶ | 1.0 × 10⁴ |
| Quarter moon | 1.6 × 10¹⁵ | 1.6 × 10³ |
| Starlight, moonless | 1.0 × 10¹⁴ | 1.0 × 10² |

**Use the µm⁻² column** — it matches the Land equation's units.

Diel curve: sinusoidal between `sunrise` and `sunset` peaking at `L_noon`; twilight ramps over
`TWILIGHT_DURATION`; night floor set by lunar phase from `LUNAR_PERIOD`.

### 4.2 Attenuation

```
L(z) = L_surface * exp(-Kd * z)
Kd_PAR   = Kd_PAR_base * turbidity_multiplier
Kd_UVB   = 3.0 * Kd_PAR
c_beam   = 3.5 * Kd_PAR                       # beam attenuation, for contrast loss
```

| Parameter | Value | Affects |
|---|---|---|
| `Kd_PAR_base` | per epoch, §2 | everything optical |
| `Kd_PAR_sweep_values` | 0.12, 0.18, 0.35, 0.55, 1.00 | **primary sweep axis** [R §4.2] |
| `turbidity_multiplier` normal | 1.0 | |
| `turbidity_multiplier` storm | 2.9 | |
| `UVB_surface_multiplier` | 2.0 × modern | UV damage |

### 4.3 Background radiance by viewing direction

| Direction | `L_background` |
|---|---|
| looking up | `L(z)` (full downwelling) |
| looking horizontal | `0.30 * L(z)` |
| looking down | `substrate_reflectance * L(z)` = `0.15 * L(z)` |

---

## 5. Perception [R §3A]

**Invariant: no code outside logging may branch on a Nilsson "class". Classes are output labels.**

### 5.1 Optics from morphology

```
A  = aperture_ratio * cup_diameter                    # µm
f  = focal_length(invagination, lens_index_gradient)  # µm
d  = receptor_diameter                                # µm
l  = membrane_layers * MEMBRANE_LAYER_THICKNESS       # µm
```

### 5.2 Angular resolution

```
dp_sampling    = d / f
dp_diffraction = LAMBDA / A
dp_defocus     = (A / f) * (1 - lens_quality)
dp_motion      = omega * integration_time             # omega = target angular velocity, rad/s

delta_rho = sqrt(dp_sampling^2 + dp_diffraction^2 + dp_defocus^2 + dp_motion^2)   # radians
delta_rho = min(delta_rho, PI)                                                    # hard cap
```

`lens_quality = clamp(lens_index_gradient / 0.33, 0, 1)`.
For a flat patch (`invagination = 0`) set `delta_rho = PI` directly.

`dp_motion` is what gives `integration_time` a real cost: long integration collects photons but
blurs anything moving, and sets response latency (§5.6).

### 5.3 Photon catch — Land sensitivity equation

```
S = (PI/4)^2 * A^2 * (d/f)^2 * (1 - exp(-K_ABSORB * l))          # µm^2 sr
N = S * L_background * integration_time * T_water * T_ocular      # photons per receptor
```

| Parameter | Value |
|---|---|
| `T_water` | 0.95 |
| `T_ocular` | 0.85 |

### 5.4 Object contrast

```
C_inherent   = (rho_body * L_ambient(z) - L_background) / L_background     # signed
C_apparent   = C_inherent * exp(-c_beam * r)
theta        = object_size / r                                            # radians
C_effective  = C_apparent * (theta / delta_rho)^2   if theta < delta_rho
             = C_apparent                           otherwise
```

Reference values for `C_inherent` at `rho_body = 0.15` (opaque dark animal), for validation only:
looking up −0.85, horizontal −0.30, looking down +0.20.

### 5.5 Detection

```
DETECTED  if  abs(C_effective) * sqrt(N) >= SNR_THRESHOLD
```

That is the whole detection rule. No range thresholds, no class checks, no visibility flags.

### 5.6 Percept produced

For each detected object:

| Field | Value | Error |
|---|---|---|
| `bearing` | direction vector | σ = `delta_rho / SNR` where `SNR = abs(C_effective)*sqrt(N)` |
| `angular_size` | `theta` | σ = `delta_rho / SNR` |
| `estimated_mass` | from `angular_size` and `range` | propagated |
| `contrast_sign` | sign of `C_effective` | — |
| `range` | from `angular_size` if size class known, else unresolved | σ ∝ `delta_rho / SNR` |
| `motion` | frame-to-frame bearing delta | needs ≥2 integration periods |

Also produced every tick regardless of morphology:

| Field | Value |
|---|---|
| `intensity` | `N` summed over all receptors, relative error `1/sqrt(N_total)` |
| `resolvable_directions` | `field_of_view / delta_rho` |
| `response_latency` | `integration_time` |

If `resolvable_directions <= 1`, the percept list is empty and only `intensity` is available.

### 5.7 Non-visual senses — always active, all species

| Sense | Range | Latency | Provides |
|---|---|---|---|
| `mechanosensory` | 1–3 body lengths | 0.020 s | bearing to moving objects, no identity |
| `chemosensory` | 0.5–5.0 m, downstream only | 2–10 s | presence + rough gradient, no bearing precision |

**Founder animals must be viable using only these** (see invariant I5).

---

## 6. Eye genome — EVOLVED [R §12.3]

Only taxon 1 (`myllokunmingid`) evolves. Taxa 2–4 use fixed values (§9.2).

| Gene | Range | Gen-0 value | Affects |
|---|---|---|---|
| `patch_width` | 0.05–3.0 mm | 0.10 | receptor count ceiling, tissue cost |
| `invagination` | 0.0–1.0 | **0.0** | `f`; 0 = flat, 0.5 = hemisphere, 1.0 = sphere+pinhole |
| `aperture_ratio` | 0.02–1.0 | **1.0** | `A`; photon catch and `dp_defocus`/`dp_diffraction` |
| `lens_index_gradient` | 0.0–0.35 | **0.0** | `lens_quality`; 0.33 = Matthiessen ideal |
| `lens_diameter` | 0–3.0 mm | 0 | |
| `membrane_layers` | 1–4000 | **1** | `l`, photon absorption, tissue cost |
| `screening_pigment` | 0.0–1.0 | **0.0** | directionality; also small non-optical antioxidant benefit (§6.1) |
| `receptor_count` | 1–1,000,000 | **4** | `resolvable_directions`, information rate, cost |
| `receptor_diameter` | 1.0–10.0 µm | 2.0 | `d` |
| `integration_time` | 0.01–600 s | **600** | photon catch ↑, `dp_motion` ↑, latency ↑ |
| `field_of_view` | 0.5–6.28 sr | 6.28 | coverage |
| `eye_axis_dorsal` | 0.0–1.0 | 0.5 | fraction of receptors aimed up vs laterally |

### 6.1 Non-optical benefits (required — prevents ladder gaps) [R §3, corollary]

| Gene | Non-optical benefit | Magnitude |
|---|---|---|
| `screening_pigment` | photodamage / antioxidant protection | reduces UV mortality hazard by `0.4 * screening_pigment` |
| `membrane_layers` | none | — |
| `lens_index_gradient` | debris exclusion + retinal scaffold | reduces eye-damage hazard by `0.3 * lens_quality` |

Without these, the II→III and III→IV transitions have flat intervals and the climb stalls.

---

## 7. Eye cost [R §9.8]

```
information_rate = resolvable_directions / integration_time            # bit/s proxy
tissue_mass      = receptor_count * receptor_volume * TISSUE_DENSITY
eye_cost_J_day   = a_tissue * tissue_mass + b_info * information_rate^0.33
```

Calibrate `a_tissue`, `b_info` so that eye cost as a fraction of SMR is:

| Morphology grade | Fraction of SMR |
|---|---|
| bare patch | 0.001 |
| pigmented directional | 0.006 |
| cup / low-res | 0.030 |
| focused lens, high-res | 0.100 (sweep 0.05–0.15) |

`receptor_volume = PI/4 * receptor_diameter^2 * l` (µm³).

**The 0.33 exponent is load-bearing** — it creates the optimum. Falsifier run V10 sets it to 1.0.

| Sweep | Values |
|---|---|
| `eye_cost_multiplier` | **0.0**, 0.5, 1.0, 1.5, 2.0 |

---

## 8. Metabolism and energy [R §9]

### 8.1 Rates

```
SMR_J_day  = 148.0 * mass_g^0.70 * Q10^((T - 28)/10)
FMR_J_day  = SMR_J_day * FMR_MULT
intake_required_J_day = FMR_J_day / assimilation_efficiency
```

| Parameter | Value | Range |
|---|---|---|
| `SMR_COEFF` | 148.0 | 120–190 |
| `SMR_EXPONENT` | 0.70 | 0.67–0.75 |
| `FMR_MULT` | 2.75 | 2.5–3.0 |
| `assimilation_carnivore` | 0.66 | 0.60–0.75 |
| `assimilation_suspension` | 0.45 | 0.35–0.60 |
| `SDA_fraction` | 0.12 | — |
| `cruise_cost_mult` | 1.8 × SMR | — |
| `burst_cost_mult` | 12 × SMR | during burst only |
| `station_holding_cost` | ∝ `flow_speed^3` | — |

Derived (validation targets, not inputs):

| Species | mass g | SMR J/d | FMR J/d | intake J/d | % body mass/d |
|---|---|---|---|---|---|
| `anomalocaris` | 250 | 7,065 | 19,429 | 29,438 | 3.3% |
| `isoxys` | 1.0 | 148 | 407 | 617 | 17% |
| `myllokunmingid` | 0.20 | 48 | 132 | 293 | 41% |
| `chaetognath` | 0.05 | 18.2 | 50 | 76 | 42% |

### 8.2 Starvation and gut

```
reserve_J          = 0.25 * mass_g * E_SOFT_PELAGIC
starving_cost_J_day = 1.15 * SMR_J_day        # after 24 h without food
days_to_death      = reserve_J / starving_cost_J_day
```

| Parameter | Value | Range | Affects |
|---|---|---|---|
| `reserve_fraction` | 0.25 | 0.15–0.35 | starvation clock |
| `starvation_downreg` | 1.15 | — | |
| `impairment_threshold` | 0.35 of reserve | — | below this, burst power scales linearly with reserve to 0 |
| `gut_capacity` | 0.06 × body mass | 0.04–0.10 | max meal |
| `gut_evacuation_half_life` | 14 h | 8–24 | digestion rate |
| `foraging_trigger` (gut fullness) | **EVOLVED**, seed 0.30 | 0–1 | |
| `satiation_threshold` (gut fullness) | **EVOLVED**, seed 0.90 | 0–1 | |

Derived days-to-death: `anomalocaris` 27.7, `isoxys` 5.3, `myllokunmingid` 3.3, `chaetognath` 2.1.

---

## 9. Agents

### 9.1 Species table [R §7.2]

| Field | `myllokunmingid` | `anomalocaris` | `isoxys` | `chaetognath` |
|---|---|---|---|---|
| `role` | **focal, eye evolves** | apex visual predator | visual mesopredator + prey | **non-visual control predator** |
| `body_length_mm` | 20–28 | 300–500 | 20–40 | 10–30 |
| `body_mass_g` | 0.20 | 250 (100–700) | 1.0 | 0.05 |
| `habitat` | nektobenthic, 5–25 m | nektonic, above benthos | nektonic | pelagic |
| `diet` | phytoplankton, detritus, mesozooplankton, carrion | soft-bodied nekton only | small nekton, mesozooplankton | small nekton, mesozooplankton |
| `assimilation` | 0.45 | 0.66 | 0.66 | 0.66 |
| `eye_evolves` | **true** | false | false | **n/a — no eye** |
| `superindividual_K` | 10 | 1 | 1 | 1 |
| `initial_density_m2` | 2.1 | 0.00085 | 0.15 | 0.40 |

### 9.2 Fixed eyes for non-focal predators

| Species | `delta_rho` | `field_of_view` | `integration_time` | Notes |
|---|---|---|---|---|
| `anomalocaris` | 0.0244 rad (1.4°) | 6.0 sr | 0.05 s | stalked, near-panoramic; acute zone forward/down |
| `isoxys` | 0.087 rad (5.0°) | 4.0 sr | 0.06 s | acute "bright zone" forward: `delta_rho * 0.5` within 0.5 sr |
| `chaetognath` | — | — | — | **no eye**; mechano + chemo only |

Compute their `N` and detection through the same §5 pipeline using these fixed values — do not
special-case them.

### 9.3 Locomotion [R §11.1]

| Species | `cruise_m_s` | `burst_m_s` | `burst_duration_s` | `accel_m_s2` | `turn_radius_BL` |
|---|---|---|---|---|---|
| `myllokunmingid` | 0.052 | 0.52 | 0.4 | 35 | 0.15 |
| `anomalocaris` | 0.40 | 0.90 | 3–8 | 4 | 0.50 |
| `isoxys` | 0.045 | 0.30 | 1.5 | 20 | 0.20 |
| `chaetognath` | 0.010 | 0.35 | 0.5 | 40 | 0.10 |

`turn_radius_m = turn_radius_BL * body_length`.

---

## 10. Predation mechanics [R §11.6]

| Parameter | Value | SET/EVOLVED |
|---|---|---|
| `strike_envelope_m` (`anomalocaris`) | 0.15 | SET (appendage reach 130 mm) |
| `strike_envelope_m` (`isoxys`) | 0.010 | SET |
| `strike_envelope_m` (`chaetognath`) | 0.005 | SET |
| `max_prey_mass_fraction` | 0.05 of predator mass | SET (appendage failure limit) |
| `strike_decision_latency` | 0.060 s | SET |
| `burst_commit_threshold` (strike initiation distance) | **EVOLVED**, seed 1.2 m | EVOLVED |
| `prey_selection` | **EVOLVED** (attack drive weights) | EVOLVED |
| `capture_success` | **EMERGENT — do not set** | — |

Handling time:

```
handling_time_s = 30 * (prey_mass / predator_mass)^0.4
post_capture_burst_lockout_s = handling_time_s + 30
```

| Reference | Value |
|---|---|
| `anomalocaris` / 3 g prey | 90 s |
| `anomalocaris` / 1 g prey | 45 s |
| `anomalocaris` / 0.2 g prey | 20 s |
| `isoxys` / 0.01 g prey | 8 s |

**Sweep required** (V19): `handling_time_coeff` ∈ {15, 30, 60}.

Expected emergent capture success for calibration only: **0.15–0.35**.

---

## 11. Resources and primary production [R §8]

### 11.1 Production

```
daily_energy_J_m2 = primary_production_gC_m2_yr / 365 * KJ_PER_G_C * 1000
```
Epoch 3: `100 gC/m²/yr` → **12,329 J m⁻² day⁻¹**.

| Parameter | Value | Range |
|---|---|---|
| `water_column_fraction` | 0.60 | 0.4–0.8 |
| `benthic_fraction` | 0.40 | |
| `detrital_rain_fraction` | 0.15 of water-column production | |
| `trophic_transfer_efficiency` | 0.10 | 0.05–0.15 |
| `consumer_accessible_fraction` | 0.20 | |
| `myllokunmingid_share_of_consumer_flux` | 0.25 | |

### 11.2 Fields

| Field | Standing stock | Growth | Patch structure |
|---|---|---|---|
| `phytoplankton` | 150 mg C m⁻³ (60–400) | logistic, `r = 1.2 doublings/day`, doubling time 14 h | patch diameter 5–50 m, concentration 3–8×, lifetime 2–10 days, area fraction 0.10–0.20 |
| `benthic_mat` | 2.5 g C m⁻² (1–5) | logistic, `r = 0.044 day⁻¹`, full regrowth ~23 days | patch scale 1–10 m |
| `mesozooplankton` | derived from phytoplankton | tracks phytoplankton with 2-day lag | patch scale 1–20 m, concentration 5–20× |
| `detritus` | accumulates on seafloor | 1,110 J m⁻² day⁻¹ input (epoch 3) | uniform + settling from plumes |
| `carrion` | from deaths | decay half-life 1.5 days at 28 °C | point sources at death location |

Carrion: 100% of the wet mass of every non-predation death enters the field at `E_CARRION`.
Detectable by chemosensory only (0.5–5 m). All species scavenge opportunistically.

### 11.3 Vertical food and hazard profile

| Depth band | Phytoplankton relative | UV-B hazard (mortality/day at surface = 0.006) |
|---|---|---|
| 0–2 m | 1.00 | 0.006 → attenuates as `exp(-Kd_UVB * z)` |
| 2–6 m | 0.85 | |
| 6–12 m | 0.45 | |
| 12–25 m | 0.15 | |
| >25 m | 0.04 | |

```
uv_mortality_hazard_per_day = 0.006 * exp(-Kd_UVB * z) * (1 - 0.4 * screening_pigment)
uv_damage_accumulation_tau = 5 days
```

---

## 12. Burst / anaerobic model [R §3B.4]

Two pools per animal, both 0–1 normalised.

| Parameter | Value | Affects |
|---|---|---|
| `fast_pool_capacity` | 8 bursts | phosphagen; powers individual bursts |
| `fast_pool_tau` | 600 s (10 min) | exponential refill from slow pool |
| `slow_pool_capacity` | 30 bursts/day × `aerobic_scope` | glycogen; daily ceiling |
| `slow_pool_tau` | 18,000 s (5 h) | exponential refill from aerobic metabolism |
| `slow_pool_impair_threshold` | 0.30 | below this, burst power scales linearly with remaining |
| `exhaustion_mortality_hazard` | 0.02/day at slow_pool = 0 | |

```
burst_available = fast_pool >= 1 burst
on burst:  fast_pool -= 1;  slow_pool -= 1;  energy -= burst_cost_mult * SMR * duration
refill:    d(fast)/dt = (1 - fast_pool/capacity) / fast_pool_tau * slow_pool_availability
           d(slow)/dt = (1 - slow_pool/capacity) / slow_pool_tau
```

Resting 1 s returns 0.17% of one burst — no partial-recovery exploit.

---

## 13. Life history and reproduction [R §10]

| Parameter | `myllokunmingid` | `anomalocaris` | `isoxys` | `chaetognath` |
|---|---|---|---|---|
| `generation_time_yr` | **1.0** | 2.0 | 0.75 | 0.5 |
| `age_at_maturity_yr` | 0.5 | 1.2 | 0.4 | 0.25 |
| `max_lifespan_yr` | 3 | 6 | 2 | 1.5 |
| `clutch_size` | **EVOLVED**, seed 400 (range 20–2000) | 200 | 60 | 80 |
| `egg_diameter_mm` | derived from clutch (trade-off curve below) | 1.0 | 0.30 | 0.20 |
| `spawn_mode` | broadcast, external | broadcast | egg-carrying | broadcast |
| `spawns_per_year` | 2, lunar-triggered | 1 | 3 | 4 |
| `clutch_energy_cost` | 0.20 of body energy | 0.15 | 0.20 | 0.25 |
| `juvenile_mortality_to_maturity` | 0.995 | 0.990 | 0.993 | 0.992 |
| `adult_annual_mortality_nonpredation` | 0.40 | 0.25 | 0.50 | 0.60 |
| `growth` | indeterminate — mass increases until death | same | same | same |

Egg size ↔ number trade-off (SET curve; **where you sit on it is EVOLVED**):
```
egg_volume * clutch_size = clutch_energy_cost * body_energy / E_SOFT_PELAGIC
juvenile_survival_multiplier = (egg_diameter_mm / 0.35)^0.6
```

Fossil anchors: *Kunmingella* 50–80 eggs at 150–180 µm; *Waptia* ≤24 eggs at >2 mm. Both endpoints
must be reachable on this curve.

Mate finding:

| Parameter | Value |
|---|---|
| `pheromone_range` | 1–20 m |
| `visual_mate_recognition_range` | < 2 m, requires `resolvable_directions > 100` |
| `aggregation_size` | 20–200 |
| `aggregation_trigger` | lunar phase + local density |
| `fertilisation_success_base` | 0.35 at aggregation density, falls as density⁻¹ |
| `visual_recognition_bonus` | up to +0.25 |

---

## 14. Behaviour genome — ALL EVOLVED [R §3B.2]

Drive-vector controller. Every tick:

```
desired_velocity = SUM over percepts of
                     w_type * gate(internal_state) * shape(distance) * direction_unit
                 + w_depth * (preferred_depth(time_of_day) - z) * vertical_unit
                 + w_noise * random_unit

discrete actions fire when accumulated drive > their evolved threshold
```

| Gene | Range | Gen-0 seed | Affects |
|---|---|---|---|
| `w_food` | −5 … +5 | random N(0, 0.5) | attraction to food percepts |
| `w_predator` | −5 … +5 | random N(0, 0.5) | avoidance |
| `w_prey` | −5 … +5 | random N(0, 0.5) | pursuit |
| `w_conspecific` | −5 … +5 | random N(0, 0.5) | aggregation |
| `w_substrate` | −5 … +5 | random N(0, 0.5) | benthic association |
| `w_flow` | −5 … +5 | random N(0, 0.5) | station-holding / rheotaxis |
| `w_carrion` | −5 … +5 | random N(0, 0.5) | scavenging |
| `w_noise` | 0 … 2 | 0.5 | search tortuosity |
| `shape_exp_food` | 0.5 … 3 | 1.0 | distance falloff of each drive |
| `shape_exp_predator` | 0.5 … 3 | 1.0 | |
| `shape_exp_prey` | 0.5 … 3 | 1.0 | |
| `gate_hunger` | −2 … +2 | 0.0 | how gut fullness modulates food/prey drives |
| `gate_energy` | −2 … +2 | 0.0 | how reserve modulates risk-taking |
| `preferred_depth_day` | 0 … 40 m | 15 | |
| `preferred_depth_night` | 0 … 40 m | 15 | |
| `depth_gain` | 0 … 2 | 0.5 | how hard it corrects toward preferred depth |
| `attack_drive_threshold` | 0 … 5 | 1.0 | |
| `flee_drive_threshold` | 0 … 5 | 1.0 | |
| `burst_commit_threshold` | 0 … 5 m | 1.2 | strike initiation distance |
| `freeze_duration` | 0 … 30 s | 10 | post-escape immobility |
| `activity_window_start` | 0 … 21 h | 0 | |
| `activity_window_length` | 0 … 21 h | 10.5 | |
| `foraging_trigger` | 0 … 1 | 0.30 | gut fullness to resume feeding |
| `satiation_threshold` | 0 … 1 | 0.90 | gut fullness to stop |
| `spawn_energy_threshold` | 0 … 1 | 0.60 | reserve fraction required to spawn |
| `aggregation_weight` | 0 … 3 | 0.2 | |
| `rho_body_dorsal` | 0.15 … 0.95 | 0.50 | body radiance ratio, upward-facing surface |
| `rho_body_ventral` | 0.15 … 0.95 | 0.50 | downward-facing surface |

Transparency cost: `burst_power *= 1 - 0.15 * max(0, (rho - 0.85) / 0.10)`.

---

## 15. Collective behaviour [R §14]

Local aggregation only. **No migration of any kind.**

| Mechanism | Benefit | Requires |
|---|---|---|
| queue (single file) | follower drag reduction 0.15–0.25 | tactile contact < 1 body length, or chemosensory |
| school (3D group) | risk dilution 1/N; predator capture success × (1 − 0.20…0.40) | `resolvable_directions > 20` |
| group cost | group detection range × N^0.33; local food depletion | — |

Log which sensory channel any emergent aggregation depends on.

---

## 16. Mutation and selection [R §12.4]

| Parameter | Value |
|---|---|
| `mutation_sigma` | sweep **0.03, 0.08, 0.15, 0.25** (fraction of gene range per generation) |
| `heritability` | 0.50 |
| `coefficient_of_variation` | 0.01 |
| `mutation_rate_per_gene` | 1.0 (all genes perturbed each generation) |
| `NP_steps_total` | 1829 (1% steps, flat patch → focused camera eye) |
| `NP_generations_per_step` | 200 |
| `NP_total_generations` | 365,800 |

Every run must print:
```
compression_factor = NP_total_generations / generations_actually_run
```

---

## 17. Hard invariants — verify by grep/audit

| ID | Invariant | Check |
|---|---|---|
| I1 | No survival, energy, birth or capture rule reads `delta_rho`, `acuity`, `eye_class`, or `sharpness` | grep those identifiers in the energy/birth/death/capture blocks → empty |
| I2 | No `sight_range`, `MAX_SIGHT`, `detection_range` constant exists | grep → empty |
| I3 | No code outside logging branches on a Nilsson class | grep `class_I`, `classIV`, `nilsson_class`, `eye_class` → logging only |
| I4 | Every gene in §14 and §6 is a genome entry, not a constant | audit |
| I5 | Fully blind founders persist ≥ 100k ticks | run with `receptor_count = 1`, mutation off |
| I6 | `delta_rho <= PI` for every genome in the search space | sample 5000 genomes, assert |
| I7 | Detection is continuous in `delta_rho` — no flat interval | numeric check at 6 distances |
| I8 | `capture_success` appears nowhere as an input | grep |

---

## 18. Required sweeps

| Axis | Values | Reason |
|---|---|---|
| `Kd_PAR_base` | 0.12, 0.18, 0.35, 0.55, 1.00 | primary environmental axis |
| `mutation_sigma` | 0.03, 0.08, 0.15, 0.25 | reachability |
| `eye_cost_multiplier` | 0.0, 0.5, 1.0, 1.5, 2.0 | includes the free-eye run |
| `eye_cost_exponent` | **0.33**, 1.0 | falsifier — linear cost should produce runaway acuity |
| `handling_time_coeff` | 15, 30, 60 | mandatory tier-D sensitivity |
| `max_lifespan_yr` | ×0.5, ×1, ×2 | mandatory tier-D sensitivity |
| `trophic_transfer_efficiency` | 0.05, 0.10, 0.15 | predator density |
| `predation_enabled` (epoch 1) | true, **false** | the V17 test |

Seeds: ≥3 per cell.

---

## 19. Logging

Per generation: median and IQR of every gene; `delta_rho`; `eye_parameter = d * delta_rho`;
`resolvable_directions`; `N` at noon at median depth; population size per species; births; deaths
by cause (starvation, predation, UV, exhaustion, age); mean gut fullness; mean reserve fraction.

Per run: `compression_factor`; realised diet composition by prey mass; attacks / contacts /
captures; capture success; predator:prey mass ratio; mean depth by hour of day; mean
`rho_body_dorsal` and `rho_body_ventral`; aggregation events with sensory channel.

---

## 20. Acceptance criteria

| # | Criterion | Pass condition |
|---|---|---|
| V1 | Classes I–III climb with class-IV payoffs disabled | `resolvable_directions > 2` reached |
| V17 | Epoch 1 (zero predators) climbs I → III | same, with `predation_enabled = false` |
| V2 | Class IV reached in clear water | `delta_rho <= 0.087 rad`, `lens_quality > 0.8`, `membrane_layers >= 1500` |
| V3 | Eye stalls at II–III in turbid water | `delta_rho > 0.44 rad` at `Kd = 1.0` |
| V4 | Predator:prey mass ratio | 20:1 – 330:1 |
| V5 | Predator daily intake | 3–7% body mass/day |
| V6 | Small prey (<0.3% predator mass) is not a viable diet | <5% of diet by mass |
| V7 | Capture success < 1, failed contacts common | 0.15–0.35 |
| V8 | Acuity payoff flattens near the contrast horizon | knee within ±30% of `4/c_beam` |
| V9 | Class IV unreachable without stacking | disable stacking → no genome reaches `delta_rho < 0.087` |
| V10 | Linear eye cost → runaway acuity | `eye_cost_exponent = 1.0` gives monotone acuity increase to the range cap |
| V11 | Diel vertical migration emerges | mean depth differs day vs night by >3 m |
| V12 | Predator is diurnal by optics, not by rule | predator captures at night < 5% of total |
| V13 | Prey `rho_body` tracks predator acuity (Red Queen) | negative correlation over generations |
| V14 | Aggregations classified by sensory channel | reported |
| V15 | Blind founders viable | ≥100k ticks, both populations alive |
| V16 | Compression factor reported | printed |
| V18 | Controller discovers optimal foraging | realised diet within 20% of the profitability prediction |
| V19 | No headline result flips inside a tier-D sweep range | any that does is reported as contingent |
| V20 | No class branching in code | I3 passes |
| V21 | No decision constant in the SET column | I4 passes |
| V22 | Countershading emerges | `rho_body_dorsal` ≠ `rho_body_ventral` by >0.15 |
