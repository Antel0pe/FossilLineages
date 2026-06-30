import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";

export default function MarathonMythPage() {
  return (
    <main className={styles.page}>
      <Link href="/lab" className={styles.back}>
        ← back to the lab
      </Link>

      <section className={styles.section}>
        <p className={styles.kicker}>490 BCE, the coastal plain of Marathon, Greece</p>
        <h1 className={styles.headline}>
          A mound of earth, and a run that probably never happened
        </h1>
      </section>

      <section className={styles.section}>
        <p className={styles.body}>
          In 490 BCE, an Athenian army — joined by a small allied force from Plataea —
          met a much larger invading Persian force on the plain of Marathon, about 40
          kilometers northeast of Athens, and won. It was a startling result: a young
          city-state&rsquo;s citizen militia had turned back an army sent by the largest
          empire of the age.
        </p>
        <p className={styles.body}>
          Herodotus, writing his history several decades after the battle, is the
          earliest detailed source we have for it. He records that about 192 Athenians
          died. Their bodies were not sent home for burial, as was the more usual Greek
          practice — instead they were buried together in a mound, a tumulus, raised
          on the battlefield itself. That mound still stands today near the modern town
          of Marathon: roughly 10 meters tall, and open to visitors.
        </p>
      </section>

      <section className={styles.imageBeat}>
        <Image
          src="/images/lab/marathon-tumulus.jpg"
          alt="The burial mound (tumulus) at Marathon, Greece, as it stands today"
          width={800}
          height={545}
          className={styles.heroImage}
          priority
        />
        <p className={styles.caption}>
          The tumulus at Marathon today — a burial mound raised over the Athenian dead,
          on the battlefield where they fell. Photo by Flickr user &ldquo;amanderson2,&rdquo;
          CC BY 2.0, via Wikimedia Commons.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.subhead}>The myth, and what Herodotus actually says</h2>
        <p className={styles.body}>
          The story most people associate with Marathon today is this: a messenger
          named Pheidippides ran roughly 40 kilometers from the battlefield to Athens
          to announce the victory, gasped out the news, and dropped dead on the spot.
        </p>
        <p className={styles.body}>
          That story does not appear in Herodotus. It shows up centuries later, in
          writers like Plutarch and Lucian — a long gap for a detail that dramatic to
          have gone unmentioned by the historian closest to the event.
        </p>
        <p className={styles.body}>
          What Herodotus does describe is a different, real long-distance run, tied to
          the same campaign but happening before the battle, not after it. As the
          Persian force approached, Athens sent a courier — Herodotus names him
          Philippides, though some manuscripts give Pheidippides — running from Athens
          to Sparta, roughly 240 kilometers, to beg the Spartans for military help. The
          Spartans agreed to send aid, but said their religious calendar required them
          to wait several days before marching; by the time their army arrived, the
          battle was already over.
        </p>
        <p className={styles.body}>
          The later legend looks like a conflation: a real, documented 240-kilometer
          run before the battle, reattached — with a dying messenger and a shorter
          distance — to the battle&rsquo;s outcome instead.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.subhead}>Why Athens had reason to embellish this one</h2>
        <p className={styles.body}>
          Marathon was not just a win — it was, in Athenian self-understanding, proof
          of something. A small, young democracy had stopped the army of the Persian
          Empire, the great imperial superpower of the era. Free citizens fighting for
          their own city, the story went, had outperformed a vast force of imperial
          conscripts. That framing became central to how Athens talked about itself for
          generations: it surfaces repeatedly in funeral-oration rhetoric honoring the
          city&rsquo;s war dead, and the battle was given pride of place in public art —
          a famous painted depiction of Marathon hung in the Stoa Poikile, a public
          colonnade in the Athens agora.
        </p>
        <p className={styles.body}>
          A victory that important tends to attract a story to match it. A messenger
          who runs himself to death delivering the news of an outnumbered underdog
          triumph is exactly the kind of capstone that self-mythologizing produces — not
          a record of what happened, but a fitting ending for a story Athens already
          wanted to tell about itself.
        </p>
      </section>

      <section className={styles.speculative}>
        <p className={styles.speculativeLabel}>Imagining it — not a historical record</p>
        <p className={styles.speculativeBody}>
          Nothing below is attested by any source; it is one writer&rsquo;s imagined
          scene, included to make the real run concrete, not to add to the historical
          record. Picture the courier setting out from Athens at a dead run, the city
          gates falling behind him, 240 kilometers of road ahead and the Persian fleet
          already standing off the coast. He does not know, as his legs give out hour
          after hour, whether Sparta will say yes or no — only that if he is slow, or if
          he fails, there may be no city left to defend by the time anyone else can be
          asked.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.subhead}>The myth that outlived the history</h2>
        <p className={styles.body}>
          The modern Olympic marathon is a direct descendant of the legend, not of the
          documented history. Its standardized distance — 26.2 miles, 42.195 kilometers
          — was not fixed until the 1908 London Olympics, and even then it was set by a
          specific course: start at Windsor Castle, finish in front of the royal box at
          the White City Stadium. That distance has no special connection to the actual
          route from Marathon to Athens, which is closer to 40 kilometers depending on
          the path taken, and none at all to ancient Greece.
        </p>
        <p className={styles.body}>
          Today, millions of people train for and run a ritual reenactment of a story
          whose most famous detail — the dying messenger — probably never happened as
          told. Meanwhile the real burial mound, holding the real dead from the battle
          that started it all, still stands a short drive from the modern course,
          waiting for far fewer visitors than the myth it never asked to inspire.
        </p>
      </section>

      <section className={styles.sourceNote}>
        <p>
          Primary source for the battle, the casualty count, the burial mound, and the
          pre-battle run to Sparta: Herodotus, <em>Histories</em>, Book 6, written
          several decades after 490 BCE. The post-battle &ldquo;ran from the battlefield
          and died&rdquo; story appears only in much later writers, including Plutarch
          (1st&ndash;2nd century CE) and Lucian (2nd century CE) — centuries after
          Herodotus, and absent from his account entirely. The Stoa Poikile&rsquo;s
          Marathon painting and the battle&rsquo;s role in Athenian funeral-oration
          rhetoric are well-attested features of later Athenian civic culture. The
          modern marathon&rsquo;s 26.2-mile distance was standardized at the 1908 London
          Olympics, fixed by that Games&rsquo; specific start and finish points rather
          than by any measurement of the ancient route. The &ldquo;why Athens
          mythologized this&rdquo; section is this writer&rsquo;s causal reading of those
          facts, not a claim found verbatim in any ancient source. The passage marked
          &ldquo;Imagining it&rdquo; is explicitly fictional and not part of the
          historical record.
        </p>
      </section>
    </main>
  );
}
