import Image from "next/image";
import Link from "next/link";
import styles from "./scene.module.css";

export default function MegadontJawScene() {
  return (
    <main className={styles.scene}>
      <Link href="/" className={styles.back}>
        ← back to the graph
      </Link>

      <section className={styles.beat}>
        <p className={styles.kicker}>~2.5 million years ago, somewhere in East Africa</p>
        <h1 className={styles.headline}>
          The fruit runs out long before the rain does.
        </h1>
      </section>

      <section className={styles.beat}>
        <p className={styles.body}>
          This stretch of the rift used to get rain twice a year, often enough that the fig
          and marula groves never fully stopped fruiting. Now the gaps between rains stretch
          wider, and for long runs there&rsquo;s nothing sweet left at all — only the sedge,
          papyrus, and knotted tuber that make it through the dry months by being almost
          worthless to anything that tries to eat them.
        </p>
      </section>

      <section className={styles.imageBeat}>
        <Image
          src="/images/human-lineage/paranthropus-boisei.jpg"
          alt="Facial reconstruction of Paranthropus boisei, showing its heavy jaw and pronounced sagittal crest"
          width={1200}
          height={1500}
          className={styles.heroImage}
          priority
        />
      </section>

      <section className={styles.beat}>
        <p className={styles.body}>
          By the worst stretch of one dry season, our group has gone from five down to
          four — no warning, no explanation, just one morning with one less set of teeth
          working the reeds beside me.
        </p>
        <p className={styles.body}>
          I pull a stalk and set it between my back teeth anyway, working it side to side
          past the point where the muscle in my cheek starts to burn, then past the point
          where it stops answering at all. Most of what I manage comes apart in ragged,
          half-chewed strings I spit back out, swallowing only the soft scraps that finally
          gave. On the morning hunger gets bad enough that quitting isn&rsquo;t an option, I
          stay on a single stalk long past where my jaw wants out, grinding past the burn
          until my back teeth feel like they&rsquo;re wearing down faster than the stalk
          is — and enough finally goes down to settle the ache for one more night.
        </p>
      </section>

      <section className={styles.beat}>
        <p className={styles.kicker}>two hundred thousand years later</p>
        <p className={styles.body}>
          Same dry stretch, same brittle stalks underfoot, and I&rsquo;m already on my third
          before the ones nearest me finish their first. Each one breaks down in a few quick
          pulls, more pulp than fiber by the time it reaches the back of my mouth, gone
          almost as fast as I can reach for the next. Down the line, a few keep close to my
          pace; others fall back stalk by stalk, still working the same mouthful long after
          I&rsquo;ve moved on to the next clump.
        </p>
        <p className={styles.body}>
          Further off, past where the ground opens into bare, cracked mud, one of the others
          has stopped moving altogether, jaw still working at a root that won&rsquo;t break
          down — the sound carries for a while, on and on, and then it doesn&rsquo;t.
        </p>
        <p className={styles.body}>
          By the time most of the group gives up on this patch and scatters toward the
          treeline, I&rsquo;m three clumps deep into a stand nobody else has touched yet, jaw
          no more tired than when I started.
        </p>
      </section>

      <section className={styles.beat}>
        <p className={styles.kicker}>the name it got</p>
        <p className={styles.body}>
          The first skull surfaced at Olduvai Gorge in 1959, its jaw and crest pronounced
          enough to earn it the name &ldquo;Nutcracker Man&rdquo; on sight. The actual
          evidence took decades to catch up: microscopic wear across the tooth surface
          doesn&rsquo;t match the pattern of cracking anything hard at all, and carbon traces
          locked into the enamel point instead toward grass and sedge — the same low-grade,
          fibrous fallback the jaw was built to grind through, not crack open.
        </p>
      </section>

      <section className={styles.sourceNote}>
        <p>
          This scene dramatizes the emergence of <em>Paranthropus boisei</em>, the most
          extreme of the &ldquo;robust&rdquo; australopiths, known largely from the 1959
          &ldquo;Zinjanthropus&rdquo; skull (OH 5) that Mary Leakey found at Olduvai Gorge,
          Tanzania. The massive molars, thick enamel, and sagittal crest are real,
          well-documented features (Smithsonian Human Origins Program). The diet dramatized
          here is tough, fibrous, low-quality vegetation, not hard nuts — grounded in dental
          microwear analysis (Ungar et al., 2008), which found wear patterns inconsistent
          with habitual hard-object feeding, and carbon-isotope analysis (Cerling et al.,
          2011), which found a diet dominated by C4 plants such as grasses and sedges.{" "}
          <em>P. boisei</em> lived roughly 2.3 to 1.2 million years ago, alongside early{" "}
          <em>Homo</em>, which met the same food scarcity with stone tools instead — a
          different strategy that, unlike <em>P. boisei</em>&rsquo;s, didn&rsquo;t end in
          extinction.
        </p>
      </section>
    </main>
  );
}
