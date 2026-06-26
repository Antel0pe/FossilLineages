import Image from "next/image";
import Link from "next/link";
import styles from "./scene.module.css";

export default function HandsAndGripScene() {
  return (
    <main className={styles.scene}>
      <Link href="/" className={styles.back}>
        ← back to the graph
      </Link>

      <section className={styles.beat}>
        <p className={styles.kicker}>~2 million years ago, Olduvai Gorge, East Africa</p>
        <h1 className={styles.headline}>
          There&rsquo;s meat in that bone, and no way in.
        </h1>
      </section>

      <section className={styles.beat}>
        <p className={styles.body}>
          By the time the troop reaches a kill, the lions have already stripped what they
          could reach and dragged off to sleep in the shade, and the hyenas have crushed and
          licked clean everything their jaws can crack. What&rsquo;s left is bone gone pale
          and dry in the sun, ringed with flies — sealed behind walls no claw, no tooth, and
          no bare hand in the group has ever managed to break. The smell of it leaks out
          anyway, rich under the dust, enough to keep the troop circling long after
          there&rsquo;s nothing else left to scavenge.
        </p>
      </section>

      <section className={styles.imageBeat}>
        <Image
          src="/images/lineage/habilis-recon.png"
          alt="Forensic facial reconstruction of Homo habilis"
          width={1200}
          height={1500}
          className={styles.heroImage}
          priority
        />
      </section>

      <section className={styles.beat}>
        <p className={styles.body}>
          Another one of us spends half the morning hammering at the same femur and never
          gets past the surface — too many strikes glance off wide. By midday she leaves it
          in the dirt and goes looking for something else to chew.
        </p>
        <p className={styles.body}>
          I find one that sits better in my palm than most, wedge it crosswise against the
          heel of my hand, and bring it down on the leg bone in front of me, hard, again and
          again. My fingers keep sliding off the back of it mid-swing, the stone twisting
          loose, strike after strike that jars all the way up my arm and does nothing. Once,
          jamming it hard into the crook of my palm and forcing my thumb down flat over the
          top of it, the strike lands square. The stone catches the bone clean, and a piece
          comes away sharp enough that dragging it across the broken end leaves a smear of
          something soft on my fingers. My grip slips loose again on the next one, and the
          rest of the morning&rsquo;s strikes go nowhere.
        </p>
      </section>

      <section className={styles.beat}>
        <p className={styles.kicker}>four hundred thousand years later</p>
        <p className={styles.body}>
          Around me, some get a stone to crack eventually, slow and inexact, strike after
          strike before anything gives; a few still can&rsquo;t keep their grip on it at all,
          the edge slipping loose no matter how they hold it. I choose mine first,
          turning it until the best edge sits flush against the pad of my thumb, and bring
          the hammerstone down at the same low angle each time. The third strike sends a
          long, clean flake off the core, edge bright and even. It opens the shaft on the
          first real cut, and the marrow comes loose in one piece.
        </p>
        <p className={styles.body}>
          A short way off, another is still wedging an unshaped stone flat against his palm,
          missing his angle again and again, before giving up on the bone half-cracked and
          walking off hungry.
        </p>
      </section>

      <section className={styles.beat}>
        <p className={styles.kicker}>what&rsquo;s still with us</p>
        <p className={styles.body}>
          The human thumb is unusually long and strong relative to the fingers among living
          primates. Chimpanzees, despite sharing nearly all of our genes, cannot perform the
          same forceful, pad-to-pad pinch between thumb and forefinger that lets a human hand
          drive a hammerstone into a precise strike — their thumb muscles and proportions
          simply aren&rsquo;t built for it.
        </p>
      </section>

      <section className={styles.sourceNote}>
        <p>
          This scene dramatizes a real, debated transition. Hand bones from{" "}
          <em>Homo habilis</em> (OH 7, Olduvai Gorge, ~1.8 Ma) show a longer, more robust thumb
          and broader fingertips compared to earlier hominins — anatomy Susman (1994) argued
          was capable of the same forceful, pad-to-pad precision grip humans use today.
          Marzke&rsquo;s (1997) biomechanical studies of hominin hand morphology link this
          grip directly to the demands of striking and using stone tools. Toth&rsquo;s (1985)
          experimental replications of Oldowan technology (stone flakes made by controlled
          hammerstone percussion, from ~2.6 Ma) show how unreliable unskilled stone-on-stone
          strikes are compared to a deliberate, practiced one. Cut-marked and
          percussion-marked animal bones recovered alongside Oldowan tools at Olduvai sites
          such as FLK Zinj are widely read as direct evidence that early Homo used these tools
          to access meat and marrow. No single account is proven beyond debate, but these are
          credible, evidence-backed findings, not invented mechanism.
        </p>
      </section>
    </main>
  );
}
