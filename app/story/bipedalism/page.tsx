import Image from "next/image";
import Link from "next/link";
import styles from "./scene.module.css";

export default function BipedalismScene() {
  return (
    <main className={styles.scene}>
      <Link href="/" className={styles.back}>
        ← back to the graph
      </Link>

      <section className={styles.beat}>
        <p className={styles.kicker}>~6 million years ago, somewhere in East Africa</p>
        <h1 className={styles.headline}>
          The forest is running out of trees.
        </h1>
      </section>

      <section className={styles.beat}>
        <p className={styles.body}>
          For millions of years, the climate has been drying. The unbroken canopy your
          ancestors moved through — branch to branch, never touching the ground — is
          breaking into islands: patches of fig and fruit trees separated by open,
          sun-scorched woodland.
        </p>
      </section>

      <section className={styles.imageBeat}>
        <Image
          src="/images/lineage/afarensis-model.jpg"
          alt="Reconstruction of an early bipedal hominin, modeled after Australopithecus afarensis"
          width={1200}
          height={1500}
          className={styles.heroImage}
          priority
        />
      </section>

      <section className={styles.beat}>
        <p className={styles.body}>
          We crawled through it the way we always do — the grass closing in over our backs,
          the trail ahead nothing but green for the next few strides and then nothing at
          all. Something moved wrong in it, once, off to the side. By the time any of us
          looked up, there were three of us where there had been four.
        </p>
        <p className={styles.body}>
          The next time we crossed it, I tried standing up partway every few strides, just to
          see — straining up onto my back legs, slow, every muscle in my hips fighting where
          it isn&rsquo;t built to go, for half a breath before it gives out. Most strides that&rsquo;s all
          it is, half a breath of nothing. But once it was enough: a shape low and pale at the
          treeline, and something in my chest dropped — I was down and bolting away from it as
          fast as my legs would carry me.
        </p>
      </section>

      <section className={styles.beat}>
        <p className={styles.kicker}>two million years later</p>
        <p className={styles.body}>
          When the troop fans out across the next stretch of grass, I rise onto two legs
          without thinking about it, the way I always do, and keep going. To my left, some of
          the others are still down on their knuckles, already falling behind in the green.
        </p>
        <p className={styles.body}>
          Off to my right, where the grass dips low, I catch movement before the others do —
          something quick and low, cutting through it. I move away from that side myself, and
          it isn&rsquo;t until a few minutes later that one of the knuckle-walkers near that same
          dip jerks upright, shrieks, and goes quiet. Whichever of them that was, they never
          saw it coming the way I did.
        </p>
        <p className={styles.body}>
          At the fig tree we stay for hours, gorging until I can&rsquo;t fit another one in my
          mouth. When the troop finally turns back, I carry a last handful home as well, both
          hands free the whole way, while the others make do with what they can hold between
          their teeth, dropping pieces with every stride.
        </p>
      </section>

      <section className={styles.beat}>
        <p className={styles.kicker}>what&rsquo;s still with us</p>
        <p className={styles.body}>
          The same narrowing of the pelvis that made upright walking efficient also narrowed
          the birth canal — one reason human childbirth is markedly longer, harder, and more
          dangerous than in any other living ape, who give birth quickly and largely
          unassisted. Anthropologists call this trade-off the &ldquo;obstetric
          dilemma.&rdquo;
        </p>
      </section>

      <section className={styles.sourceNote}>
        <p>
          This scene dramatizes a real, debated transition. The fossil record (a bipedally
          loaded femur from <em>Orrorin tugenensis</em>, ~6 Ma; an upright-adapted pelvis and
          foot in <em>Ardipithecus ramidus</em>, ~4.4 Ma; a fully committed biped in{" "}
          <em>Australopithecus afarensis</em>, ~3.7–3 Ma) shows upright walking emerging
          gradually in increasingly open, patchy woodland. The advantages dramatized above
          draw on two leading, named hypotheses: Lovejoy&rsquo;s provisioning hypothesis
          (1981) — carrying food to mates/offspring — and Rodman &amp; McHenry&rsquo;s
          locomotor-energetics hypothesis (1980) — bipedal walking&rsquo;s lower energy cost
          over distance. The improved predator-detection from standing taller is a
          longstanding, widely discussed companion idea, though harder to test directly than
          the other two. The childbirth trade-off is Washburn&rsquo;s obstetric dilemma
          hypothesis (1960). No single cause is proven; these are credible, evidence-backed
          candidates, not invented mechanism.
        </p>
      </section>
    </main>
  );
}
