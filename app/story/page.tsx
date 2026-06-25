import Image from "next/image";
import Link from "next/link";
import styles from "./story-home.module.css";

type Scene = {
  slug: string;
  kicker: string;
  title: string;
  teaser: string;
  image: string;
  alt: string;
};

const scenes: Scene[] = [
  {
    slug: "bipedalism",
    kicker: "~6 million years ago",
    title: "The forest is running out of trees.",
    teaser:
      "A shrinking canopy forces an ape onto two legs — a clumsy, half-breath attempt that, generations later, becomes a way of life.",
    image: "/images/lineage/afarensis-model.jpg",
    alt: "Reconstruction of an early bipedal hominin, modeled after Australopithecus afarensis",
  },
  {
    slug: "endurance-running",
    kicker: "~1.8 million years ago",
    title: "By midday, the chase always gives out before the prey does.",
    teaser:
      "Heat ends every hunt before it finishes — until a hairless, sweating runner learns to outlast the animal she's chasing.",
    image: "/images/lineage/erectus-body.jpg",
    alt: "Reconstruction of Homo erectus, a tall, long-legged early human",
  },
  {
    slug: "hands-and-grip",
    kicker: "~2 million years ago",
    title: "There's meat in that bone, and no way in.",
    teaser:
      "A clumsy, glancing strike against a found stone gives way to a deliberate, practiced grip — and a carcass nothing else can open.",
    image: "/images/lineage/habilis-recon.png",
    alt: "Forensic facial reconstruction of Homo habilis",
  },
];

export default function StoryHome() {
  return (
    <main className={styles.page}>
      <Link href="/" className={styles.back}>
        ← back to the graph
      </Link>

      <section className={styles.intro}>
        <p className={styles.kicker}>Turning points</p>
        <h1 className={styles.title}>The story of how we got here.</h1>
        <p className={styles.subtitle}>
          Each scene dramatizes one real evolutionary turning point — a moment when a
          pressure on survival or reproduction tipped a lineage toward a lasting change.
        </p>
      </section>

      <section className={styles.grid} aria-label="Turning-point scenes">
        {scenes.map((scene) => (
          <Link key={scene.slug} href={`/story/${scene.slug}`} className={styles.card}>
            <div className={styles.cardImageWrap}>
              <Image
                src={scene.image}
                alt={scene.alt}
                fill
                className={styles.cardImage}
                sizes="(max-width: 600px) 100vw, 33vw"
              />
            </div>
            <div className={styles.cardBody}>
              <p className={styles.cardKicker}>{scene.kicker}</p>
              <h2 className={styles.cardTitle}>{scene.title}</h2>
              <p className={styles.cardTeaser}>{scene.teaser}</p>
              <span className={styles.cardCta}>Read the scene →</span>
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}
