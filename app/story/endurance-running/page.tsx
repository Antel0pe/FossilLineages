import Image from "next/image";
import Link from "next/link";
import styles from "./scene.module.css";

export default function EnduranceRunningScene() {
  return (
    <main className={styles.scene}>
      <Link href="/" className={styles.back}>
        ← back to the graph
      </Link>

      <section className={styles.beat}>
        <p className={styles.kicker}>~1.8 million years ago, East African savanna, near midday</p>
        <h1 className={styles.headline}>
          By midday, the chase always gives out before the prey does.
        </h1>
      </section>

      <section className={styles.beat}>
        <p className={styles.body}>
          By late morning the grass empties out. The big cats have already dragged themselves
          into whatever shade still holds together, flanks heaving, done for hours. The
          antelope herds thin too, drifting toward the tree line, leaving the open ground to
          whoever can stand to cross it. Thick-coated, breathing hard within minutes of any
          real effort, the troop has never been able to use that emptiness for anything.
        </p>
      </section>

      <section className={styles.imageBeat}>
        <Image
          src="/images/lineage/erectus-body.jpg"
          alt="Reconstruction of Homo erectus, a tall, long-legged early human"
          width={1200}
          height={1500}
          className={styles.heroImage}
          priority
        />
      </section>

      <section className={styles.beat}>
        <p className={styles.body}>
          One of us went down in the grass before the kudu did, folded over her own knees, and
          didn't get back up for the rest of the day. We left her in what shade we could find
          and kept moving without her, the gap between us and the kudu opening again with
          every stride.
        </p>
        <p className={styles.body}>
          The next time the herd scattered at midday, I went after the limping one myself,
          breath sawing, skin gone slick under matted hair that wouldn't let any of the heat
          out. My legs wanted to stop a hundred times before I let them. Twice I dropped to a
          walk, chest heaving, the edges of everything swimming — and twice the kudu ahead of
          me slowed to almost nothing in the same stride, head low, sides working like a
          bellows. The second time I closed half the gap before my own legs folded under me in
          the dirt, and the kudu staggered on into the trees without me.
        </p>
      </section>

      <section className={styles.beat}>
        <p className={styles.kicker}>two hundred thousand years later</p>
        <p className={styles.body}>
          Around me the rest of the band peels off into whatever shade the acacias offer,
          chests heaving, already done for the day. I keep moving. Off to the south, a jackal
          that's been pacing the same kudu falls out of the chase entirely, slinking into a
          thorn thicket, tongue lolling sideways out of its mouth.
        </p>
        <p className={styles.body}>
          By the time the kudu's legs give out under it, mouth foaming, flanks heaving against
          ground gone hot enough to blister bare skin, I'm barely breathing hard. Sweat runs
          freely down my bare arms and drips off my chin into the dust. My hands close around
          a foreleg before it can find the strength to rise again.
        </p>
      </section>

      <section className={styles.beat}>
        <p className={styles.kicker}>what's still with us</p>
        <p className={styles.body}>
          Per kilogram of muscle, no other land mammal sheds heat through sweat as efficiently
          as a human. A horse, run hard enough for long enough in the heat of the day, will
          eventually have to stop and cool down — a sweating human, on the same hot ground,
          often doesn't have to. In Wales&rsquo;s annual Man versus Horse Marathon, on hot
          years, human runners have beaten every horse in the field.
        </p>
      </section>

      <section className={styles.sourceNote}>
        <p>
          This scene dramatizes a real, debated hypothesis about why humans became such
          unusual long-distance runners. Lieberman and Bramble&rsquo;s endurance-running
          hypothesis (2004, <em>Nature</em>) identifies the specific traits that appear
          together in <em>Homo erectus</em> (~1.9&ndash;0.1 Ma) and persist in humans today: an
          enlarged gluteus maximus and a nuchal ligament that stabilize the trunk and head
          during running, a long Achilles tendon and arched foot that store and return
          elastic energy, and a dramatic increase in eccrine sweat glands paired with loss of
          body fur for evaporative cooling. Persistence hunting itself is not pure conjecture:
          Louis Liebenberg documented modern San hunters in the Kalahari running game down to
          heat exhaustion without weapons, the same way described above, as a real-world
          analog for how the ancestral behavior likely worked. No single hypothesis is
          proven beyond debate, but these are credible, evidence-backed traits and behaviors,
          not invented mechanism.
        </p>
      </section>
    </main>
  );
}
