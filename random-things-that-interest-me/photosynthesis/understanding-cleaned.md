# Photosynthesis — my current understanding

    carbon dioxide + water + light  →  sugar + oxygen
    6 CO₂ + 6 H₂O + light  →  C₆H₁₂O₆ + 6 O₂

Underlying chemistry (orbitals, effective nuclear charge, redox potential) lives in
[general-chemistry-cleaned.md](general-chemistry-cleaned.md).

**Active section:** Photosystem II

<!--
How this doc works:
- The spine is declarative. Questions only ever live in an "Open:" block.
  So: what I know = the prose. What I don't = grep -n -A6 "Open:"
- When a question gets answered, the answer is folded into the prose above and the
  question is DELETED. Answers don't get stacked under dead questions.
- If an answer is too interesting to delete, it belongs in its own section or in the
  chemistry doc — not as a footnote under a dead question.
- [depth: sketch | working | solid]. solid = I could explain it out loud to someone.
- One section at a time. "Active section" above is the one being deepened. Going one
  layer deeper on that section beats another shallow pass over everything.
-->

---

## The big picture   [depth: working]

Photosynthesis uses photons to drag low-energy electrons out of oxygen and up into
carbon's higher-energy orbitals. That is what "storing energy" means here. Moving those
electrons back down into oxygen is what releasing it means.

Mechanically it runs as two factories:

    light  →  ATP + NADPH  →  sugar

ATP is a molecule with a phosphate group that releases a burst of energy when snapped
off. NADPH is a delivery van for high-energy electrons.

Open:
- is that description of ATP actually right, or just a slogan I've picked up

---

## Catching a photon   [depth: working]

When a photon hits chlorophyll, one of its electrons absorbs it and jumps to a higher
energy state. Energized means the electron is now orbiting in a bigger, looser shape.
Falling back down means returning to the earlier pattern.

The jump is all-or-nothing — an electron takes the whole photon or none of it.

There are three ways for it to shed the energy again:

- spit it out as light
- heat, by jiggling the molecules nearby
- let something take the electron away entirely — this is the photosynthesis route

In a working plant it's the third one: the electron is taken before it can fall back.
In a dead leaf or a chlorophyll extract there's nowhere to send it, so it falls back on
its own and dumps the energy as heat plus a faint red glow. This is visible at home:
blend spinach with rubbing alcohol, filter it, shine a light through.

Open:
- how is light actually created out of the orbit
- what happens if a photon has slightly *less* energy than the jump needs? where does
  that energy go — heat, light, nowhere?
- is all-or-nothing only about jumping to a higher orbit? can an electron that stays in
  the same orbit still give off heat or light?
- what happens if a photon carries too much energy
- does "bigger, looser shape" mean it gets physically shoved outward, or is that the
  wrong picture
- why rubbing alcohol specifically for the extraction

---

## Why chlorophyll is green   [depth: solid]

Chlorophyll absorbs red and blue strongly and bounces green back — which is why leaves
look green.

Colour is wavelength, and wavelength is energy per photon: blue is shortest and highest
energy, then green, then red. But every colour delivers the *same* usable energy,
because a higher-energy photon's excess is immediately dumped as heat and the electron
settles into the same excited state regardless.

So there was never much selection pressure to absorb green. Light isn't the bottleneck,
so catching more of it does nothing — and excess light is actively dangerous, because
an excited chlorophyll with nowhere to send its electron causes damage.

There is a hard floor, though. Past about 700nm, red shades into infrared and the
photons are simply too weak to run the reaction — the jump needs a minimum amount of
energy to happen at all. So there's a large supply of infrared light that plants can't
touch no matter how much of it arrives.

---

## The antenna funnel   [depth: working]

A single chlorophyll molecule doesn't get hit often, so chloroplasts group many of them
into a funnel. Any one of them can catch a photon and the *energy* hops molecule to
molecule toward a central reaction center.

The electron itself does not hop. The mechanism is FRET (Förster Resonance Energy
Transfer): the oscillating electron creates an electrical field, and a nearby electron
gets energized by that field.

The hops run downhill — outer molecules are tuned slightly wider and inner ones
slightly narrower, so downhill hops are far more likely and uphill hops have nowhere to
go. That's why the energy reliably ends up at the reaction center rather than anywhere
else.

Open:
- how do fields actually work — I still don't have a picture of this
- is transfer to the reaction center really ~95% efficient? where does the lost 5% go,
  and how much is lost at the other stages

---

## Photosystem II   [depth: sketch]

Named second because it was discovered second, but it runs first.

Energy arrives at the reaction center, an electron there gets excited, and a
neighbouring molecule yanks it away. The reaction center molecule — P680 — is now short
an electron, as P680+.

P680+ has a redox potential of 1.25V against water's 0.82V, so it can comfortably rip
electrons off water. It doesn't do it in one go; it uses an Oxygen Evolving Complex.

    2 H₂O  →  4 electrons + 4 H⁺ + O₂

Water is the electron source. The oxygen leaks out of the leaf as waste. The protons get
dumped inside the thylakoid sac.

Open:
- the Oxygen Evolving Complex — the capacitor / ratchet / states explanation did not
  land at all. this is the main thing I want to understand next
- which molecule actually accepts the electron from P680, and what's it called
- what would the efficiency cost be if that yank happened somewhere other than the
  reaction center
- is my "energy hops in, electron gets excited, neighbour yanks it" description even
  accurate

---

## The electron transport chain   [depth: sketch]

The stolen electron is passed down a series of molecules in the thylakoid membrane:
plastoquinone → cytochrome b6f → plastocyanin.

Each step drops the electron a little way instead of one big fall, which lets the energy
at each step be captured rather than wasted as heat. That captured energy is what drives
more protons into the thylakoid sac.

Open:
- what does each of those three molecules actually do, and why that order
- how much heat do plants emit overall
- I want a diagram placing all of these components relative to each other

---

## The proton gradient   [depth: working]

Two systems pump protons into the thylakoid: splitting water, and the transport chain.

"Pump" is the wrong picture for the transport chain — nothing is being forced. It's more
like a shuttle bus that's chemically only able to run one way, because each side of the
membrane has a different receiver. Something called vectorial chemistry.

The inside of the thylakoid becomes intensely positive — roughly a 1000× proton
concentration difference across the membrane, which is a 3 pH difference, since pH is
defined as −log₁₀ of proton concentration.

The membrane is greasy, so the protons can't escape even though they're all positive and
badly crowded.

Open:
- what does "greasy" mean physically, and how does greasiness stop a proton? is it
  sticky somehow

---

## ATP synthase   [depth: working]

The only way out for the protons is through ATP synthase, an enzyme that physically
spins as they rush through — about 100 rotations per second. The rotation mechanically
deforms the top of the enzyme, squeezing ADP and phosphate together into ATP.

---

## Photosystem I   [depth: working]

The electron arriving from photosystem II gets hit by another photon and kicked back up
to high energy. It's not literally the same electron that started in photosystem II, but
that doesn't matter — electrons are interchangeable.

From there it's passed to a carrier called ferredoxin and loaded onto NADP+ to make
NADPH.

That closes the first factory: light and water in; ATP, NADPH, and O₂ as waste out.

Open:
- is this the Krebs cycle or something different

---

## Calvin cycle: fixing the carbon   [depth: working]

In the stroma — the fluid around the thylakoid sacs — there's a 5-carbon molecule called
RuBP. Five carbon means five carbon *atoms*, not five molecules.

RuBisCO welds CO₂ onto RuBP. The resulting 6-carbon molecule is unstable, and RuBisCO
holds it and deliberately cleaves it into two 3-carbon molecules called 3-PGA.

No energy is necessarily lost in that break. Breaking a bond doesn't automatically mean
losing energy and making one doesn't automatically mean gaining it — that's a common
intuition trap. What matters is how much energy is available before versus after.

---

## Calvin cycle: charging up 3-PGA   [depth: sketch]

3-PGA is low energy — stable and unreactive. Two things charge it:

- **ATP** donates a phosphate, turning it into a loaded, twitchy intermediate.
- **NADPH** donates a high-energy electron and a hydrogen.

The result is G3P, a small energized 3-carbon sugar. Glucose is two G3P.

Open:
- turning something stable into something unstable should cost energy — what mechanism
  lets ATP do that, and how does donating a phosphate energize the molecule
- how does NADPH donate an electron and a hydrogen — is the hydrogen just a proton
- NADPH donating is described as "moving electrons away from oxygen". what does that
  actually mean
- do two G3P become glucose automatically, or does stitching them together cost energy

---

## Calvin cycle: the profit   [depth: solid]

Most G3P is recycled back into RuBP. Run the cycle 3 times and 6 G3P come out; 5 of them
are rearranged back into 3 RuBP.

That looks like it shouldn't divide, but the accounting is in atoms, not molecules:
5 molecules × 3 carbons = 15 carbons, and 3 molecules × 5 carbons = 15 carbons.

The 1 remaining G3P is profit, and becomes glucose, sucrose, starch, or cellulose.

Open:
- the atom count works, but I still don't know what the rearranging actually consists
  of — what the steps are

---

## RuBisCO's flaws   [depth: working]

A typical enzyme processes thousands of molecules per second. RuBisCO manages roughly
3–10.

It's slow because it's a multi-step process where every step has to complete properly —
a partial result is genuinely dangerous. And because telling CO₂ and O₂ apart is very
hard, since they're so similar. The plant's solution is to make the transition state
much more selective, which also makes it harder to reach. Plants compensate by producing
an enormous amount of RuBisCO.

Even so it confuses CO₂ with O₂ about 25% of the time, producing a toxic byproduct that
has to be cleaned up by photorespiration, wasting 20–30% of the plant's photosynthetic
output.

Why evolution hasn't fixed this, given that oxygen has been abundant for a very long
time: the photorespiration tax isn't universal — it gets much worse as temperature
rises, so in cooler conditions the pressure is weak. Where it does bite, C4 plants are
only ~3% of species but account for ~23% of land productivity.

Open:
- what is a transition state
- how is RuBisCO itself made? RuBP comes from G3P, but where does the enzyme come from
- how do enzymes hit thousands of molecules per second at all? my guess is they bind a
  starting material that fits badly and the end product that fits well, moulding it into
  shape — but then how do they release the product, and why don't they keep grabbing
  floating finished product instead of raw material

---

## C4 plants   [depth: working]

Maize, sugarcane. They route around RuBisCO's problem: a more discriminating enzyme,
PEP carboxylase, grabs carbon in the outer cells and pumps it into a sealed inner
chamber where RuBisCO lives, so RuBisCO rarely meets oxygen at all.

PEP carboxylase can discriminate because it works on bicarbonate — CO₂ partially
dissolved in water — and O₂ has no equivalent form. Once inside the inner chamber the
carrier is decarboxylated and the CO₂ dumped back out.

---

## CAM plants   [depth: working]

Pineapple, cactus. These live in hot places where open pores mean leaking water, which
is fatal in a desert. So they only open their pores at night, store the carbon as an
acid, and run the Calvin cycle by day with the pores shut.
