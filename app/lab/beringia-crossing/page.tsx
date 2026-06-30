import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";

export default function BeringiaCrossingPage() {
  return (
    <main className={styles.page}>
      <Link href="/lab" className={styles.back}>
        ← back to the lab
      </Link>

      <section className={styles.section}>
        <p className={styles.kicker}>Bering Land Bridge National Preserve, Alaska</p>
        <h1 className={styles.headline}>
          A 9,000-year-old hunting cache, still sitting on the open tundra
        </h1>
      </section>

      <section className={styles.imageBeat}>
        <Image
          src="/images/lab/beringia-cache.jpg"
          alt="An ancient stone hunting cache on the open tundra in Bering Land Bridge National Preserve, Alaska"
          width={3248}
          height={2160}
          className={styles.heroImage}
          priority
        />
        <p className={styles.caption}>
          Hunters once stood right here, stacking stones to mark a spot they returned to year
          after year, waiting for caribou to pass. Credit: Bering Land Bridge National
          Preserve (NPS), CC BY 2.0, via Wikimedia Commons.
        </p>
      </section>

      <section className={styles.section}>
        <p className={styles.body}>
          The cache is real, and so is the date, but it&rsquo;s only the most recent layer of a
          much older story. The ground underneath it — and underneath the Bering Strait that
          now separates Alaska from Siberia — was once a vast, habitable subcontinent. The
          people who eventually built that cache descend from a population that spent
          thousands of years stranded there, going nowhere, before any of their descendants
          ever set foot in the rest of the Americas.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.subhead}>A pause that left no fossils, only a pattern</h2>
        <p className={styles.body}>
          For a long time, the question of how people first reached the Americas was framed
          as a route problem: which path did they walk, and when did they arrive? Routes and
          arrival dates can&rsquo;t explain a strange pattern that turned up once geneticists
          started sequencing mitochondrial DNA — passed down, almost unchanged, from mother to
          child — in living Indigenous peoples across North and South America.
        </p>
        <p className={styles.body}>
          Nearly everyone sampled, from the Arctic to the tip of South America, traced back to
          the same narrow set of founding lineages. That part fit a single migration. What
          didn&rsquo;t fit was the branching pattern inside those lineages. Mutations defining
          haplogroups like A2a, A2b, D2a, and D4b1a2a1 — distinct, datable branches on the
          family tree — appeared to have formed before any dispersal into the Americas, yet
          they weren&rsquo;t present in the source populations back in Siberia either.
        </p>
        <p className={styles.body}>
          New lineages don&rsquo;t diversify in a population that&rsquo;s actively moving
          through new territory and mixing with new neighbors; they need an isolated
          population sitting still, generation after generation, accumulating mutations with
          no one to mix them back out. The genetic clock on these branches pointed to a pause
          of several thousand years, between the time a founding population would have left
          Siberia and the time their descendants show up south of the great ice sheets.
          Geneticists named it the Beringian standstill. Nobody had to find a single artifact
          to know it happened — the evidence was already sitting in people alive today.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.subhead}>Land enough to live on, ice enough to trap you</h2>
        <p className={styles.body}>
          The mechanism behind the standstill is a story about two ice-age facts pulling in
          opposite directions. During the Last Glacial Maximum, so much of the world&rsquo;s
          water was locked up in continental ice sheets that global sea levels dropped roughly
          120 meters below where they sit today. That drop exposed Beringia — the seafloor
          between Siberia and Alaska that the Bering Strait now covers — not as a thin
          causeway but as a wide subcontinent of its own, with tundra, river valleys, and
          enough large game to support people for generations.
        </p>
        <p className={styles.body}>
          So a founding population could walk out of Siberia into Beringia without much
          difficulty. The problem was getting any further. Through the same glacial maximum,
          the Cordilleran and Laurentide ice sheets sat fused together across most of North
          America, a wall of ice running from the Pacific coast into the interior with no real
          way through. Beringia was open at one end and sealed at the other — a population
          could arrive, and then simply have nowhere left to go, for as long as the ice held
          the door shut.
        </p>
      </section>

      <section className={styles.speculative}>
        <p className={styles.speculativeLabel}>
          Imagining it — not a historical record, no individual like this is documented
        </p>
        <p className={styles.speculativeBody}>
          Picture one person born many generations into the standstill, on land their parents
          were also born on, who were in turn born on it. They have never met anyone from
          beyond their own small band, never heard of a person who has. As far as they know —
          as far as anyone they will ever meet knows — this stretch of tundra between two dark
          seas is simply the whole of the world; there is no elsewhere to imagine missing. They
          have no way to know that two entire continents lie open and empty to the south,
          waiting on the far side of an ice wall they will never see in their lifetime, or that
          when the ice finally breaks open, their own descendants will be among those who walk
          through it — and that within a few hundred generations, tens of millions of people
          scattered across both continents will be able to trace a line back through that
          pause, to them.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.subhead}>You can still read it in people alive this year</h2>
        <p className={styles.body}>
          Around 15,000 to 16,000 years ago, ice-free corridors finally opened — along the
          Pacific coast, and eventually through the interior — and descendants of the
          standstill population began moving south, into a hemisphere no human had ever
          reached. The haplogroups that branched off during the long pause in Beringia
          didn&rsquo;t stay behind with it. They went south too, and they are still carried
          today by Indigenous peoples from the Arctic down through Tierra del Fuego — a
          multi-thousand-year-old isolation event you can trace directly in DNA sequenced from
          people alive this year, not just inferred from old bones.
        </p>
        <p className={styles.body}>
          The land itself hasn&rsquo;t entirely vanished either. Bering Land Bridge National
          Preserve protects a surviving piece of Beringia on the Alaska side, and the tundra
          there still holds traces of the people who eventually moved through and across it —
          like the 9,000-year-old stone hunting cache at the top of this page, built by people
          who, generations earlier, had a homeland with nowhere further to go.
        </p>
      </section>

      <section className={styles.sourceNote}>
        <p>
          This page summarizes the Beringian standstill hypothesis as developed from
          mitochondrial DNA studies of Indigenous American populations (notably Tamm et al.,
          2007, and subsequent ancient-DNA work consistent with a Beringian-era population
          bottleneck), combined with paleoclimate evidence for Last Glacial Maximum sea levels
          (~120 m below present) and the extent of the coalesced Laurentide and Cordilleran ice
          sheets. The standstill&rsquo;s end date (~15,000&ndash;16,000 years ago) and the named
          haplogroups (A2a, A2b, D2a, D4b1a2a1) reflect the genetics literature on this topic.
          The passage marked &ldquo;Imagining it&rdquo; is an imagined vignette, not a
          documented individual or event.
        </p>
      </section>
    </main>
  );
}
