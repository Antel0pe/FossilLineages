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
          The sweet, soft food runs out long before the rains do.
        </h1>
      </section>

      <section className={styles.beat}>
        <p className={styles.body}>
          The rains in this part of the rift used to come twice a year, reliable enough
          that the marula and fig groves never really emptied out. Now there are long
          stretches where they don&rsquo;t come at all. When the trees go quiet, what&rsquo;s
          left covering the ground is sedge, papyrus root, and wiry tubers — plants built to
          survive the dry months by being nearly impossible to get much out of.
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
          The fig trees go quiet for whole seasons at a stretch, and what&rsquo;s left when
          they do is the stuff nobody wants. By the end of one bad dry season there are four
          of us crouched at the mud flat where there had been five.
        </p>
        <p className={styles.body}>
          I tear off a sedge stalk and work it between my back teeth, jaw grinding
          side to side, again and again, until the muscle along my cheek twitches on its
          own. Most of it I give up on half-chewed, spit out, swallow what little softens.
          But on the worst day, with nothing else left to try, I keep at one stalk long
          after my jaw wants to quit — and grind enough of it down to get something into my
          stomach, instead of going to sleep on empty again.
        </p>
      </section>

      <section className={styles.beat}>
        <p className={styles.kicker}>two hundred thousand years later</p>
        <p className={styles.body}>
          Same sedge bed, same dry crackle underfoot, and I&rsquo;m three stalks in before
          the others nearby have managed one. My jaw works wide and easy, side to side, the
          muscle along the side of my skull pulling tight with every bite instead of
          burning out. Off to my left, some of the others keep pace stalk for stalk, jaws
          holding up well enough; a couple fall further behind on the toughest stems,
          working the same mouthful over and over, spitting out more than they swallow.
        </p>
        <p className={styles.body}>
          Out past the mud flat, where the dry season has stripped a different stretch of
          ground bare, another struggles longest of all at a root too tough to get
          through — I hear the grinding, on and on, longer than it should take, and then
          nothing, just wind through the sedge.
        </p>
        <p className={styles.body}>
          By the time most of the others give up and wander off toward the trees, hoping
          for something better, I&rsquo;m still working through the stand in front of me,
          stalk after stalk, jaw barely tired.
        </p>
      </section>

      <section className={styles.beat}>
        <p className={styles.kicker}>the name it got</p>
        <p className={styles.body}>
          When the first skull turned up at Olduvai Gorge in 1959, its massive jaw and bony
          crest earned it the nickname &ldquo;Nutcracker Man.&rdquo; Decades later,
          microscopic scratches on its teeth told a different story: the wear pattern
          doesn&rsquo;t match hard-shelled nuts at all. Carbon signatures locked into the
          enamel point the same way — toward grasses and sedges, the same low-quality,
          fibrous fallback food the jaw evolved to grind through, not crack open. The most
          famous jaw in human evolution got famous for the wrong reason.
        </p>
      </section>

      <section className={styles.sourceNote}>
        <p>
          This scene dramatizes the emergence of <em>Paranthropus boisei</em>, the most
          extreme of the &ldquo;robust&rdquo; australopiths, known from fossils including the
          1959 &ldquo;Zinjanthropus&rdquo; skull (OH 5) discovered by Mary Leakey at Olduvai
          Gorge, Tanzania. Its massive molars, thick enamel, and sagittal crest are real,
          well-documented adaptations (Smithsonian Human Origins Program). The diet dramatized above is tough, fibrous,
          low-quality vegetation rather than hard nuts. This is grounded in two studies:
          dental microwear analysis (Ungar et al., 2008) found
          wear patterns inconsistent with habitual hard-object feeding, and carbon-isotope
          analysis (Cerling et al., 2011) found a diet dominated by C4 plants such as
          grasses and sedges. <em>P. boisei</em> lived roughly 2.3 to 1.2 million years ago,
          alongside early <em>Homo</em>, which met similar food scarcity with stone tools
          instead — a parallel strategy that, unlike <em>P. boisei</em>&rsquo;s, didn&rsquo;t
          end in extinction.
        </p>
      </section>
    </main>
  );
}
