Goal: Select for speed

Barriers
- the world was too big. predator speed wasnt allowed enough time to catch up
- random location is a far bigger factor in prey catch than speed
- static population for prey/predators
    - alternative means dealing with extinction, wildly oscilating numbers, unrealistic numbers
        - 

Assumptions
- perfect vision for predator and prey
- no cost to higher speed
- no hiding/stalking
- 1% mutation rate is enough difference in outcome

Learnings
- 1 max randomly sampled speed repopulates every generation
    - I used to have 1 speed value be chosen to populate all rest with 1% mutation
    - Because more than 1 speed could last, that meant had to sample randomly and pick 1. Cannot explicitly pick max speed because that wouldn't make sense from evolutionary view
    - This meant that 1 speed dominated everything even if it wasn't selected for
    - Instead made them pair up and average speed with mutation. This averages out the speed rather than favoring fittest. 
    - Central problem here is that even the fastest can only survive 1 generation and leave 1 kid. They need to be able to leave more offspring behind. 
    - Problem with breeding on demand is initializing static number of prey/predators and needing to fill up that cap every time/keep under it


Untested Ideas
- some sort of counter parameter to unchecked growth like a parameter of how they monopolize food source
    - constant amount of plants/base energy available. prey have specific values and from highest to lowest they get the energy they need otherwise they starve. does add another parameter to evolve and muddy effect of speed trait. whats different from saying a hard cap or dying on some timer? purpose is to allow successful prey to survive longer