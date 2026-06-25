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
          A carcass left behind by something bigger always draws a crowd before the meat is
          gone. Lions strip what they can reach and move on; hyenas crush what&rsquo;s left
          between their jaws and lick out the rest. By the time the troop reaches what
          remains, the soft parts are gone and all that&rsquo;s left is bone — full of marrow
          no claw or tooth in the group can reach, and no hand can break open by hand alone.
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
          She&rsquo;d been working at the femur with a stone for most of the morning by the
          time the hyenas circled back, and what was left of it when they were done
          wasn&rsquo;t worth crouching over anymore.
        </p>
        <p className={styles.body}>
          I found one that sat better in my palm than most and brought it down on the leg
          bone in front of me, hard, again and again. Most strikes skidded off sideways or
          did nothing at all, just a dull crack and my hand stinging from the jolt. On one
          strike the stone caught the edge wrong and a thin sliver of it snapped away on its
          own, sharp along one side — I dragged it once across the bone&rsquo;s broken end
          and came away with a smear of something soft on my fingers before the stone in my
          other hand split wrong and the rest of the morning&rsquo;s strikes went nowhere.
        </p>
      </section>

      <section className={styles.beat}>
        <p className={styles.kicker}>four hundred thousand years later</p>
        <p className={styles.body}>
          Around me a few others are still doing what I used to — slamming whatever stone is
          closest into a bone and hoping. I choose mine first, turning it until one edge sits
          right against my thumb, and bring the hammerstone down at the same low angle each
          time. The third strike sends a long, clean flake off the core, edge bright and even.
          It opens the shaft on the first real cut, and the marrow comes loose in one piece.
        </p>
        <p className={styles.body}>
          A short way off, a hyena that&rsquo;s been working the same kind of bone for a while
          gives up on it, dropping it half-cracked in the dirt, and trots away.
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
          and broader fingertips compared to earlier hominins — anatomy Randall Susman&rsquo;s
          analyses argued was capable of the same forceful, pad-to-pad precision grip humans
          use today. Mary Marzke&rsquo;s biomechanical studies of hominin hand morphology link
          this grip directly to the demands of striking and using stone tools. Nicholas
          Toth&rsquo;s experimental replications of Oldowan technology (stone flakes made by
          controlled hammerstone percussion, from ~2.6 Ma) show how unreliable unskilled
          stone-on-stone strikes are compared to a deliberate, practiced one. Cut-marked and
          percussion-marked animal bones recovered alongside Oldowan tools at Olduvai sites
          such as FLK Zinj are widely read as direct evidence that early Homo used these tools
          to access meat and marrow. No single account is proven beyond debate, but these are
          credible, evidence-backed findings, not invented mechanism.
        </p>
      </section>
    </main>
  );
}
