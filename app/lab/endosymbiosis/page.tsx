import Link from "next/link";
import styles from "./page.module.css";

export default function EndosymbiosisPage() {
  return (
    <main className={styles.page}>
      <Link href="/lab" className={styles.back}>
        ← back to the lab
      </Link>

      <section className={styles.intro}>
        <p className={styles.kicker}>
          Earth &middot; ~1.5–2 billion years ago
        </p>
        <h1 className={styles.title}>
          A bacterium got absorbed 2 billion years ago and never left
        </h1>
        <p className={styles.subtitle}>
          Your mitochondria have their own DNA, divide like bacteria, and are
          affected by the same antibiotics that kill bacterial infections.
          That&rsquo;s because they are bacteria — once free-living organisms
          that merged with a different cell and never came back out.
          All complex life on Earth exists because of that merger, which
          happened once.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionHeading}>How we know</h2>
        <p className={styles.body}>
          The evidence that mitochondria are bacteria is not circumstantial.
          It is a layered case in which each line of evidence confirms the
          others.
        </p>
        <p className={styles.body}>
          Mitochondria have their own DNA. Not shared with the cell&rsquo;s
          nucleus — their own separate genome, physically distinct, floating
          inside the mitochondrion. This DNA is circular. In every
          eukaryote&rsquo;s nucleus, chromosomal DNA is linear. Bacterial
          DNA is circular. Mitochondrial DNA is circular because mitochondria
          are bacteria.
        </p>
        <p className={styles.body}>
          Mitochondria divide by binary fission. When a cell divides, the
          nucleus undergoes mitosis — a complex choreography of chromosome
          separation with a dedicated molecular machinery. Mitochondria
          don&rsquo;t do this. They just split in two, the same way a
          bacterium splits in two, using different machinery.
        </p>
        <p className={styles.body}>
          Mitochondria contain 70S ribosomes — the smaller type found in
          bacteria — rather than the 80S ribosomes found in the eukaryotic
          cytoplasm. This is medically significant: certain antibiotics
          work by binding to the bacterial 70S ribosome and blocking protein
          synthesis. At high doses, these same antibiotics affect
          mitochondrial ribosomes, because those ribosomes are built on
          the same bacterial plan. Tetracyclines and aminoglycosides, used
          clinically to kill infections, can cause mitochondrial toxicity
          at high concentrations. A drug targeting bacteria targets
          mitochondria for the same reason.
        </p>
        <p className={styles.body}>
          When researchers sequenced mitochondrial DNA and built phylogenetic
          trees, the mitochondria fell inside the bacteria — specifically,
          they are most closely related to the alpha-proteobacteria, a
          group that includes modern relatives like <em>Rickettsia</em> (the
          cause of typhus) and <em>Agrobacterium</em>. The mitochondria are
          not just &ldquo;bacteria-like.&rdquo; They are bacteria, nested
          within a specific bacterial lineage.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionHeading}>What happened</h2>
        <p className={styles.body}>
          Roughly 1.5 to 2 billion years ago, a cell absorbed a bacterium.
          This was not unusual by itself — cells absorb things. What was
          unusual was that instead of digesting it, the host cell maintained
          it. The bacterium kept living inside the host. Over millions of
          years, the relationship stabilised into something different from
          either participant alone.
        </p>
        <p className={styles.body}>
          The absorbed bacterium had a capability the host lacked: it could
          use oxygen to generate energy efficiently. The early Earth&rsquo;s
          atmosphere had been progressively oxygenated by photosynthetic
          bacteria over the preceding billion years — what is called the
          Great Oxidation Event, roughly 2.4 billion years ago. By the time
          of the endosymbiosis, oxygen was available as a fuel source, and
          the alpha-proteobacteria had evolved to exploit it via aerobic
          respiration. The host cell, which could not do this, gained access
          to a dramatically more efficient energy metabolism.
        </p>
        <p className={styles.body}>
          Over deep time, most of the bacterium&rsquo;s genes migrated to the
          host&rsquo;s nucleus — or were lost — as the two organisms became
          increasingly interdependent. The modern human mitochondrial genome
          contains only 37 genes; the alpha-proteobacterial ancestor likely
          had several thousand. What remains is a minimal genome: just enough
          to handle the most critical local functions, with the rest handled
          by nuclear genes whose products are imported into the mitochondrion.
          The bacterium is still there, but it can no longer live independently.
          Neither can the cell survive without it.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionHeading}>
          Why it happened once
        </h2>
        <p className={styles.body}>
          The merger that produced the eukaryotic cell happened once. Every
          organism on Earth with a nucleus — every animal, plant, fungus,
          and protist — descends from that single fusion event. It is the
          most consequential biological event in the last 3 billion years,
          and it happened in a single cell, in a single moment, that was
          not repeated.
        </p>
        <p className={styles.body}>
          For approximately 2 billion years before the endosymbiosis, Earth
          had life. Bacteria and archaea — simple, small, extraordinarily
          successful. They have been here for 3.8 billion years. They will
          almost certainly outlast complex life. But for 2 billion years,
          that was all there was. No plants. No animals. No fungi. No
          organism with a nucleus or internal membrane systems. Half the
          age of the planet, just prokaryotes.
        </p>
        <p className={styles.body}>
          Then the merger happened. Within the eukaryotic lineage that
          resulted, multi-cellular life eventually evolved — not once, but
          independently multiple times: in animals, in plants, in fungi,
          in several algae lineages. Multi-cellularity is, evolutionarily,
          not that hard once you have the eukaryotic cell. The eukaryotic
          cell is what was hard. And it rests on one event.
        </p>
        <p className={styles.body}>
          This has implications for thinking about life elsewhere. Simple
          microbial life — the equivalent of bacteria — may be common
          throughout the universe wherever liquid water and energy sources
          exist. Complex life, by contrast, may require not just the right
          conditions but a specific and improbable merger. If the
          endosymbiosis happened once in 4 billion years on Earth, then
          even a planet that produces simple life might never produce
          complex life. The Great Filter of the Fermi Paradox — the reason
          we might not see other civilisations — may be this step.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionHeading}>The scientist who figured it out</h2>
        <p className={styles.body}>
          Lynn Margulis proposed the endosymbiotic theory in 1967. She was
          28 years old. Her paper was rejected by fifteen scientific journals
          before being published in the <em>Journal of Theoretical Biology</em>.
          The scientific consensus at the time held that organelles had
          arisen gradually within eukaryotic cells by internal differentiation.
          Margulis was arguing that they were captured bacteria — a claim
          that most biologists found either wrong or irrelevant.
        </p>
        <p className={styles.body}>
          The theory was vindicated within a decade, as molecular biology
          made it possible to sequence organelle genomes and compare them
          directly to bacterial genomes. By the early 1980s, what had been
          a fringe hypothesis was standard biology textbook. By the time of
          her death in 2011, it was taught in every introductory biology
          course on Earth.
        </p>
        <p className={styles.body}>
          What is less commonly noted is that Margulis was not simply
          proposing an interesting mechanism. She was arguing for a
          fundamentally different view of evolution — one in which
          cooperation and merger, not just competition and selection, drive
          biological innovation. Eukaryotes exist because of a symbiosis.
          The complex cell was not invented by any organism; it was
          assembled from organisms.
        </p>
      </section>

      <section className={styles.echoSection}>
        <h2 className={styles.sectionHeading}>What lives inside you</h2>
        <p className={styles.body}>
          A single human heart muscle cell contains approximately 2,500
          mitochondria. Each one is a living descendant of a bacterium
          that merged with a different cell roughly 2 billion years ago.
          Each one has its own circular genome. Each one divides
          independently of you.
        </p>
        <p className={styles.body}>
          Mitochondrial DNA is inherited maternally — it passes from mother
          to child without mixing with paternal DNA, because it sits outside
          the nucleus and the nucleus is the only part that gets combined
          during fertilisation. This is why &ldquo;mitochondrial Eve&rdquo;
          — the most recent common matrilineal ancestor of all living humans
          — can be traced through unbroken maternal lines. It is also why
          ancient DNA researchers can trace population movements by sequencing
          mitochondrial genomes from archaeological remains. The bacterium
          inside you preserves a genealogical record that the nuclear genome
          cannot.
        </p>
        <p className={styles.body}>
          The merger is what made you possible. Not just you as a species —
          you as an organism with more than a few dozen cells, with tissues,
          organs, a nervous system. All of that complexity rests on a single
          moment, 2 billion years ago, when a cell did not digest what it
          had just absorbed.
        </p>
      </section>
    </main>
  );
}
