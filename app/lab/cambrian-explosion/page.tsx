import Link from "next/link";
import styles from "./page.module.css";

export default function CambrianExplosionPage() {
  return (
    <main className={styles.page}>
      <Link href="/lab" className={styles.back}>
        ← back to the lab
      </Link>

      <section className={styles.intro}>
        <p className={styles.kicker}>
          Burgess Shale, British Columbia &middot; ~508 million years ago
        </p>
        <h1 className={styles.title}>
          In 25 million years, evolution invented every body plan that has ever
          existed — then stopped
        </h1>
        <p className={styles.subtitle}>
          The Cambrian explosion is one of the strangest facts in the history
          of life: virtually every major animal body plan appears in the fossil
          record within a geologically short window, and in the 500 million
          years since, no fundamentally new ones have been invented. A quarry
          in British Columbia, and a theory about eyes, help explain why.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionHeading}>The quarry in the cliff</h2>
        <p className={styles.body}>
          In August 1909, an American palaeontologist named Charles Walcott was
          riding on horseback through the Canadian Rockies when his horse
          stumbled on a rock on the trail. Walcott picked it up. It contained
          what appeared to be a perfectly preserved soft-bodied marine animal
          from the Cambrian period — the kind of organism that almost never
          fossilises, because soft tissue decays before it can be preserved.
        </p>
        <p className={styles.body}>
          He found the source the following summer: a shale layer high on the
          slope of Mount Field in what is now Yoho National Park. He spent
          the next fifteen summers excavating it. The Burgess Shale, as it
          became known, contains thousands of specimens of Cambrian animals
          preserved in exceptional detail — internal organs visible,
          gut contents intact, eyes recorded in the rock. It is the best
          window we have into the world 508 million years ago.
        </p>
        <p className={styles.body}>
          What Walcott found was not a primitive world of simple blobs. It was
          a functioning marine ecosystem with predators, prey, filter feeders,
          swimmers, and bottom dwellers — all with distinct, elaborate
          body plans. There were animals with five eyes and a nozzle-like
          mouth (<em>Opabinia</em>). Animals with a circular jaw of radiating
          teeth surrounded by a ring of tentacles (<em>Anomalocaris</em>, then
          the largest predator in the ocean). Animals whose relationship to any
          living phylum is still debated. The diversity was not just rich —
          it was architecturally wider than anything alive today.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionHeading}>
          What the explosion actually was
        </h2>
        <p className={styles.body}>
          For most of Earth&rsquo;s history, life was microbial. Bacteria and
          archaea dominated for over 3 billion years. Complex multicellular
          life began appearing in the Ediacaran period, roughly 635 to 539
          million years ago — strange, flat organisms with no clear mouths or
          guts, growing by fractal subdivision, leaving no clear descendants.
        </p>
        <p className={styles.body}>
          Then, starting approximately 541 million years ago, something
          changed. In geological terms, &ldquo;explosion&rdquo; is
          the right word: within roughly 20 to 25 million years — fast by
          evolutionary standards, though still far longer than any human
          timescale — representatives of almost every major animal phylum
          appear in the fossil record. Not just new species, not just new
          genera. New phyla: fundamentally different ways of organising
          an animal body. Arthropods, molluscs, annelids, echinoderms,
          chordates (the phylum that eventually produced us), and dozens
          of others, all appearing in a geologically narrow window.
        </p>
        <p className={styles.body}>
          In the 500 million years since, with hundreds of millions of
          generations of evolution across billions of species, no new phylum
          has appeared. Evolution has been extraordinarily productive — it
          has generated every fish, insect, bird, plant, and mammal — but
          all of it has been variation within body plans that were established
          during the Cambrian. We have not invented a new fundamental animal
          architecture since.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionHeading}>
          Why it happened: the eye hypothesis
        </h2>
        <p className={styles.body}>
          The leading explanation for what triggered the Cambrian explosion
          was proposed by Andrew Parker, a zoologist then at Oxford, in a
          2003 book and a series of papers. His argument is called the
          Light Switch Theory.
        </p>
        <p className={styles.body}>
          In the late Proterozoic and early Cambrian, the ocean was full of
          life, but no organism could form a true image of its environment.
          Photoreceptors existed — sensitivity to light and dark is ancient —
          but the kind of eye that resolves spatial detail, that lets an
          organism locate and identify another organism at a distance, was
          absent. In a world with no predators that could see you, many costly
          adaptations became unnecessary: hard shells, spines, camouflage,
          rapid locomotion. If nothing can find you visually, there is no
          selection pressure to be hard to find.
        </p>
        <p className={styles.body}>
          Parker&rsquo;s argument is that image-forming eyes evolved in at
          least one predatory lineage at the start of the Cambrian — the
          fossil evidence suggests this happened in the trilobites, which
          appear at the very base of the Cambrian with compound eyes already
          fully formed. Once a predator could see, the world changed
          immediately and permanently. Prey that could be visually located
          had sudden and intense selection pressure to become harder to find,
          harder to catch, and harder to eat. This drove the development of
          hard shells, which drove better predator attack structures, which
          drove better defences, which drove the whole escalating arms race
          that characterises animal evolution ever since.
        </p>
        <p className={styles.body}>
          Eyes, on this account, did not emerge from the explosion. They
          caused it. The 25-million-year diversification of body plans was
          the evolutionary response to a world that had become visible.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionHeading}>
          Why it stopped
        </h2>
        <p className={styles.body}>
          The absence of new phyla after the Cambrian is almost as striking
          as their appearance during it. Evolution has been relentlessly
          creative for 500 million years — and yet the creativity has all
          been within the same set of architectures. Why?
        </p>
        <p className={styles.body}>
          The most likely answer involves the relationship between body plans
          and developmental biology. An animal body plan is not a single gene
          — it is an enormously complex developmental programme, a sequence
          of decisions encoded across hundreds of genes that collectively
          specify how a fertilised egg becomes a functioning organism. Once
          a body plan is established and working, the developmental genes
          that specify its fundamental features become deeply integrated into
          the whole developmental network. Changes to them are almost always
          lethal or catastrophically malforming, because so many other
          developmental decisions are predicated on them.
        </p>
        <p className={styles.body}>
          In the Cambrian, these constraints had not yet accumulated.
          Multicellular animals were new enough that the developmental
          networks were still relatively plastic — fundamental architectural
          choices could be made, tried, and if they worked, elaborated.
          Once a body plan succeeded and the species that carried it
          diversified, the developmental programme became entrenched over
          millions of generations of stabilising selection. The lock-in
          was progressive. By the end of the Cambrian, every viable
          major architecture had been tried, and the ones that survived
          were the ones too embedded in their own developmental logic
          to be fundamentally redesigned.
        </p>
        <p className={styles.body}>
          The Cambrian explosion was, in this reading, a one-time
          opportunity: the brief window between the invention of
          multicellularity and the hardening of developmental constraints,
          during which the fundamental options were still open. It closed,
          and it has stayed closed.
        </p>
      </section>

      <section className={styles.echoSection}>
        <h2 className={styles.sectionHeading}>What you are built on</h2>
        <p className={styles.body}>
          You are a chordate. The defining feature of your phylum — a notochord,
          which in you became a vertebral column — appears in the Cambrian
          fossil record in a small, filter-feeding animal called{" "}
          <em>Pikaia gracilens</em>, recovered from the Burgess Shale.{" "}
          <em>Pikaia</em> is about 5 centimetres long, vaguely eel-shaped,
          and appears to have lived by filter-feeding on the seafloor.
          It is probably not your direct ancestor, but it is the earliest
          fossil representative of the lineage that eventually produced
          fish, amphibians, reptiles, mammals, and you.
        </p>
        <p className={styles.body}>
          Every animal alive today — from a sea sponge to a blue whale —
          is a variation on a body plan that was established in a 25-million-year
          window that closed half a billion years ago. The diversity of
          life you see is real and staggering, but it is a diversity of
          elaboration, not of invention. The invention happened once.
        </p>
        <p className={styles.body}>
          This is what makes the Burgess Shale unsettling to look at closely.
          Many of the animals preserved there — <em>Opabinia</em>,{" "}
          <em>Hallucigenia</em> with its spines and tentacles,{" "}
          <em>Wiwaxia</em> covered in sclerites — belong to lineages that
          did not survive the Cambrian. These were real tries at the
          problem of being an animal. They failed, or rather their lineages
          ended, and the body plans they carried ended with them. We are
          what is left from a much wider experiment. The Cambrian was the
          experiment; everything since has been optimisation within its results.
        </p>
      </section>
    </main>
  );
}
