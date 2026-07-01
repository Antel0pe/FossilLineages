import Link from "next/link";
import styles from "./page.module.css";

export default function DeepSeaVentsPage() {
  return (
    <main className={styles.page}>
      <Link href="/lab" className={styles.back}>
        ← back to the lab
      </Link>

      <section className={styles.intro}>
        <p className={styles.kicker}>
          Galapagos Rift, Pacific Ocean &middot; February 1977
        </p>
        <h1 className={styles.title}>
          Scientists sent a submersible to the deep ocean floor expecting
          a cold, barren desert. They found an entire ecosystem thriving
          in total darkness on volcanic heat.
        </h1>
        <p className={styles.subtitle}>
          Until 1977, biologists assumed that all substantial ecosystems on
          Earth were ultimately powered by sunlight — directly through
          photosynthesis, or indirectly through things that ate photosynthesisers.
          The deep ocean floor, 2,500 metres below the surface, received no
          sunlight. The discovery at the Galapagos Rift changed this completely:
          dense communities of giant tubeworms, clams, shrimp, crabs, and
          fish, thriving in complete darkness around cracks in the ocean floor
          where superheated water poured out. The energy source was not the Sun.
          It was the Earth.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionHeading}>What they expected to find</h2>
        <p className={styles.body}>
          The expedition to the Galapagos Rift in 1977 was led by oceanographers
          from Woods Hole Oceanographic Institution and the Scripps Institution
          of Oceanography. They were looking for evidence of hydrothermal
          activity — the hypothesis that seawater percolating through cracks
          in the ocean crust near spreading ridges would be heated by magma
          and expelled. This had geophysical interest: the heated water would
          carry dissolved minerals from the rock. The chemistry of the deep ocean
          near spreading ridges might differ from the open deep ocean.
        </p>
        <p className={styles.body}>
          No one expected biology. The deep ocean floor is cold (2-4°C), dark,
          and under enormous pressure. The nutrients from surface photosynthesis
          that fall as marine snow — dead organisms, faecal material, detritus —
          take a long time to reach the bottom and arrive in small quantities.
          Life at depth was expected to be sparse: a few worms, sea cucumbers,
          brittle stars, the scattered detritivores of an impoverished desert.
        </p>
        <p className={styles.body}>
          The expedition used the research submersible <em>Alvin</em>, operated
          by Woods Hole. On February 17, 1977, the geologist Jack Corliss and
          two colleagues descended to the Galapagos Rift, following the trail
          of warm water they had detected with temperature sensors towed from
          the surface. They found the warm water. They also found something else.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionHeading}>The ecosystem</h2>
        <p className={styles.body}>
          The vents were surrounded by dense biological communities. Giant
          tube worms (<em>Riftia pachyptila</em>) up to 2 metres long clustered
          around the vent openings, their bright red plumes extended into the
          water — they had no mouths, no digestive system in the conventional
          sense. Large white clams (<em>Calyptogena magnifica</em>) several
          centimetres across. White crabs. Mussels. Shrimp with no eyes.
          Fish.
        </p>
        <p className={styles.body}>
          The density was striking. On a deep ocean floor where organisms
          might be separated by metres or tens of metres, here were communities
          as dense as any shallow-water reef. Corliss reportedly radioed back
          to the surface ship: &ldquo;Isn&rsquo;t the deep ocean supposed
          to be like a desert? Well, there&rsquo;s all this stuff down here.&rdquo;
          Biologist Kathy Crane, on the surface ship listening to the radio
          communications, reportedly burst into tears.
        </p>
        <p className={styles.body}>
          The mechanism was chemosynthesis. The vent water is rich in hydrogen
          sulphide (H₂S), methane, and other reduced compounds produced by the
          reaction of hot water with the basaltic rock. Bacteria at the vents
          use the chemical energy released by oxidising these compounds —
          particularly hydrogen sulphide — to fix carbon dioxide into organic
          matter. This is chemosynthesis: the same basic logic as photosynthesis
          (use an energy source to build organic carbon) but with chemical
          energy instead of light energy.
        </p>
        <p className={styles.body}>
          The tube worms and clams host these bacteria as endosymbionts — inside
          their tissues, in specialised organs. The bacteria do the chemosynthesis;
          the host provides the infrastructure and exposure to vent water; the
          host is fed by the bacterial output. The worm has no gut because it
          does not need one. The bacteria feed it directly. The clam&rsquo;s
          blood is bright red with a specialised haemoglobin that binds hydrogen
          sulphide — normally toxic to most life — and carries it to the bacterial
          endosymbionts.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionHeading}>What this changed</h2>
        <p className={styles.body}>
          Before 1977, the assumption was that all substantial life on Earth
          ultimately depended on the Sun. The deep-sea vent discovery established
          that an entire biosphere could run on geothermal energy, completely
          independently of photosynthesis. This had three immediate consequences
          for how biologists thought about life.
        </p>
        <p className={styles.body}>
          First, the definition of the habitable zone expanded dramatically.
          If life needs sunlight, the habitable zone for life around a star
          is a narrow ring where liquid water can exist at the surface.
          If life can run on geothermal heat, then any body with a liquid water
          ocean and geological activity — regardless of distance from a star —
          is potentially habitable. Icy moons become interesting.
        </p>
        <p className={styles.body}>
          Second, the origin of life became easier to imagine. Hydrothermal
          vents provide continuous chemical energy gradients and mineral surfaces.
          Many origin-of-life researchers now consider alkaline hydrothermal
          vents — a slightly different type from the black smokers at the
          Galapagos Rift — to be the most plausible location for the emergence
          of the first self-replicating chemistry. The conditions are right:
          chemical gradients, proton motive force, mineral catalysts, liquid water.
        </p>
        <p className={styles.body}>
          Third, extremophiles — organisms living at the limits of what was
          considered physically possible — became a serious field of study.
          The vent bacteria that thrive at 80-100°C near the hottest vents
          are hyperthermophiles. The search for life at the edges of chemical
          and physical possibility accelerated in the years after 1977.
        </p>
      </section>

      <section className={styles.echoSection}>
        <h2 className={styles.sectionHeading}>
          Europa and Enceladus
        </h2>
        <p className={styles.body}>
          Europa is a moon of Jupiter with a global ocean of liquid water beneath
          a surface of ice, estimated at 100-200 kilometres deep. The ocean is
          kept liquid by tidal heating — the gravitational flexing of the moon
          by Jupiter&rsquo;s gravity generates heat in its interior. Europa&rsquo;s
          ocean floor likely has geological activity and hydrothermal vents.
          If the Galapagos Rift discovery taught us anything, it is that
          life does not need surface sunlight to exist — it needs chemical
          energy gradients and liquid water. Europa has both.
        </p>
        <p className={styles.body}>
          Enceladus, a moon of Saturn, actively erupts water vapour and ice
          particles from its south polar region. The Cassini spacecraft flew
          through these plumes and detected hydrogen gas — a sign of water-rock
          reactions at hydrothermal vents on the ocean floor. Organic compounds
          were detected in the plume material. If microbial life exists in
          Enceladus&rsquo;s ocean, some of it is almost certainly being
          ejected into space right now, past the rings of Saturn.
        </p>
        <p className={styles.body}>
          The tube worms at the Galapagos Rift live for 200-300 years —
          among the longest-lived animals known. They grow slowly in the cold,
          feeding on the bacteria that feed on the hydrogen sulphide that rises
          from the Earth&rsquo;s interior. The species was unknown to science
          until 1977. No sunlight has ever touched them.
        </p>
      </section>
    </main>
  );
}
