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
        <p className={styles.kicker}>~2 million years ago, East African savanna, near midday</p>
        <h1 className={styles.headline}>
          The antelope is always faster than we are.
        </h1>
      </section>

      <section className={styles.beat}>
        <p className={styles.body}>
          By late morning the grass empties out. The big cats have already dragged themselves
          into whatever shade still holds together, flanks heaving, done for hours. The
          antelope herds thin too, drifting toward the tree line, until the open ground sits
          empty under the sun, baked hard and shimmering. Thick-coated, breathing hard within
          minutes of any real effort, no one from the troop has ever managed to bring
          anything back from out there.
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
          Another of us breaks first today, folding over her own knees in the open grass and
          staying down, the rest of the band moving on without her into the heat-shimmer
          ahead.
        </p>
        <p className={styles.body}>
          When the herd scatters at midday, one stumbles, favoring a foreleg, and I run at
          it, breath coming quick from the first stride, legs pumping, ground blurring past
          while the gap between us is still short. Most days the limp isn&rsquo;t enough of a
          head start: my legs give out long before the sun is even straight overhead, and the
          gap opens again with every stride I lose. This time my legs hold a little longer,
          heavy, breath sawing, fur soaked through and clinging, my whole body cooking under
          it, the antelope ahead of me slowing in the same stride, head low, sides working
          like a bellows, and the gap keeps closing instead of opening. I push past where my
          legs usually quit, close what&rsquo;s left of the ground between us, and bring it
          down in the dirt, both of us too spent to do anything but lie there.
        </p>
      </section>

      <section className={styles.beat}>
        <p className={styles.kicker}>five hundred thousand years later</p>
        <p className={styles.body}>
          When the herd scatters at midday this time, one favors a foreleg the same way, and
          I&rsquo;m after it before it&rsquo;s gone twenty strides. Around me the band thins out as the heat climbs,
          one after another dropping to a walk. I keep moving. Off to my left, another
          runner&rsquo;s stride is already shortening, breath ragged, falling back from the
          same antelope I&rsquo;m still closing on.
        </p>
        <p className={styles.body}>
          The antelope&rsquo;s legs give out under it at last, mouth foaming, flanks heaving
          against ground hot enough to blister bare skin. I&rsquo;m barely breathing hard.
          Sweat runs freely down my bare arms and drips off my chin into the dust. My hands
          close around a foreleg before it can find the strength to rise again.
        </p>
      </section>

      <section className={styles.beat}>
        <p className={styles.kicker}>what&rsquo;s still with us</p>
        <p className={styles.body}>
          Per kilogram of muscle, no other land mammal sheds heat through sweat as efficiently
          as a human. A horse, run hard enough for long enough in the heat of the day, will
          eventually have to stop and cool down — a sweating human, on the same hot ground,
          often doesn&rsquo;t have to. In Wales&rsquo;s annual Man versus Horse Marathon, on hot
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
          Liebenberg (2006) documented modern San hunters in the Kalahari running game down to
          heat exhaustion without weapons, the same way described above, as a real-world
          analog for how the ancestral behavior likely worked. No single hypothesis is
          proven beyond debate, but these are credible, evidence-backed traits and behaviors,
          not invented mechanism.
        </p>
      </section>
    </main>
  );
}
