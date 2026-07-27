goal: build a species lineage thing that shows how species evolved over time. it should show the change that happened and explain some portion of why that change happened too where possible. 

data needs to be factual and supported by evidence. mostly focusing on direct species ancestor evolution where possible and maybe sibling species where interesting. should show whole body fossils but also colored depictions of that animal in life

- fossil lineage for human and ancestor species + sibling
    - fossils + color depictions of animal during life
- map to see fossil distribution
    - have to take into account different positions of tectonic plates
- say what adaptations were different from species
    - why they adapted differently
    - evolutionary pressures
    - show areas of fossils or pictures where they were different
    - other fossils of animals to show evolutionary pressures
- show the change and also WHY the change

- evolutionary trees for
    - humans
    - whales from land animals
    - horses

- for cause and effect of change in species and evolutionary pressure
    - currently doing linked change -> pressure list but eventually doing a wikipedia style narrative would be cool too. generating mini wikipedia articles for myself would be kinda neat. 


- gene flow in terms of neanderthals to sapiens, etc
- traits lost not gained
    - kinda already included
- convergent evolution across several species showing similar problems and similar solutions?
    - would take me away from human focus
- ghost lineages that we know of but havent found fossils for
- climate events/other factors tied to evolution speed?
- individual fossil forensic story
    - died by falling due to fractures or had some bone disease etc
- additional context about why this change happened rather than some other, what changed in habitat/environment/ecology that gives additional context

- potentially time to experiment with taking the structure on humans and expanding it to more species and lineages
    - feel like im running into data bottlenecks focusing on just humans but the underlying idea and structure is good

fundamental issue of evolution is verifiability and testing truth is hard. theres no way to test it like physics - maybe theres something to be made here

- right now everything is species-first - here's an animal, here's what changed, and the global conditions/pressures are kind of tacked on as the explanation after the fact. what if instead you lead with the global conditions (climate cooling, grass spreading, CO2 dropping, land bridge closing, whatever) and THEN show the species changing as a downstream result. feels like it might make the causal chain clearer/more honest instead of me writing "why" as an afterthought bolted onto a species card. 

excitingly ambitious versions of this
- map out every human species like this
- map out every species like this
- unified map of all species reacting to climatic disasters/changes ***
- building something that verifies how evolution works or some theory or some reason
    - some contribution to the frontier, but well what is the frontier
- proving determinism in some way?
- being able to reconstruct some factor due to the visible changes?
- map of factors we know and unknown factors
    -  help predict where there are more factors than we understand?

- using blender models to show evolution of body structure
    - the model itself changes to show evolution and fitness is determined based on this for example for surface area to volume for heat retention
- for development of eye do something where multiple animals are developing them but with different selection pressures for example at different depths of ocean such that some animals will develop varying stages of eyes and be interesting
- simulate majority of evolutionary tree starting from single celled organisms or something basic
- calorie requirements and energy being related. for example 10%? of energy passes through each level of food chain. so sun gives some energy, grass translates it into 10% energy, cow gets 10% of energy. animals can evolve to exploit energy sources. can evolve to do it more efficiently too. 
- for evolving body shape, constraints need to be in place about motion, gravity

- SOURCES OF INFORMATION as an emergent design principle for the big sim. The world should
  contain latent channels of information — light (vision), pressure waves (hearing), diffusing
  chemicals (smell/pheromones) — that exist as a *side effect of things happening*, NOT as
  things I explicitly designate as "senses." Key constraint I care about: I must NOT hand-label
  "this is a source of information" or "pheromone = mating opportunity," because then the only
  reason a capability failed to evolve is that I forgot to designate it. Instead: things happen
  (an organism moves → makes a pressure wave; a receptive female's metabolism → emits a
  compound), and it is *possible but not guaranteed* for a lineage to evolve a sensor that reads
  that channel and a behavior that exploits it. I want to be surprised — e.g. a male evolving to
  detect a female's pheromone and seek her out — WITHOUT having encoded "detect pheromone,"
  "pheromone means mating," or even "seek mate." Caveat I already see: for a channel to be
  evolvable-into, the sim still has to actually generate the signal (sound has to be emitted for
  hearing to have anything to detect), so "acknowledging the channel exists" is unavoidable even
  if its *meaning* is never authored. The hard open problem underneath this is behavior/learning:
  the sensor→action mapping is where emergence lives, and I don't yet know how to encode that
  (this is the neuroevolution / evolvable-brain problem). Companion principle: emergent behavior
  over encoded rules — never write "prey flees predator"; the flee response should be discovered.

- how did early bacteria learn to swim towards food and away from toxins? what was the environment like to be able to model markers of toxins? were there like hotspots and then small bits of it floated away from the source? how were they able to swim towards food and detect food?

- claude when doing experiments often suggests we do multiple things to fix an issue whereas i prefer having a single experiment to understand its impact and prefer to have one really good solution rather than throw multiple things and have it fixed by multiple things.
- how to evolve behavior like learning to run away, or that certain fruit colors are better, or brightly colored prey are poisonous
    - if x then do y type behaviors where each x is an input and y is an action available
        - too binary, prioritization of if determines action, not able to modulate action like go to food but also stay away from predator
    - if x then add likelihood to action y
        - each input taken into account, able to follow multiple goals like get to food, stay away from predator
        - probability tuning needs to be accurate, another axis to tune. probability can change for example if there is 1 predator vs 2 predators in the area. 

- for static parameters that i set for simulation the problem is that they
    - encode my bias
    - often dont change so the whole simulation does weird things based on my bias
    - a solution might be to allow them to change and let simulation discover accurate values for them. but how is the big question