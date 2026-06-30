import Image from "next/image";
import Link from "next/link";
import styles from "./lab-home.module.css";

type LabItem = {
  href: string;
  kicker: string;
  title: string;
  hook: string;
  image?: string;
  alt?: string;
  mode: "explorable" | "read";
};

const items: LabItem[] = [
  {
    href: "/explore/pt-boundary",
    kicker: "Frazer Beach, NSW, Australia",
    title: "A real cliff face, read layer by layer",
    hook: "Walk down it and you walk back 252 million years, straight into the worst extinction Earth has ever had.",
    image: "/images/explore/pt-boundary-frazer-beach.jpg",
    alt: "Cliff face at Frazer Beach, NSW showing the Permian-Triassic boundary layers",
    mode: "explorable",
  },
  {
    href: "/lab/lucy",
    kicker: "Hadar, Ethiopia · 3.2 million years ago",
    title: "The skeleton that proved walking came before brains",
    hook: "Click into the pelvis, the femur, the skull — the actual bones that flipped the story of how we became human.",
    image: "/images/lab/lucy-skeleton.jpg",
    alt: "The reconstructed cast of the Lucy (AL 288-1) Australopithecus afarensis skeleton",
    mode: "explorable",
  },
  {
    href: "/lab/denisovans",
    kicker: "Baishiya Karst Cave, Tibetan Plateau",
    title: "A species we know almost entirely from dirt and a half a jaw",
    hook: "The bone wouldn't give up its DNA. The dirt on the cave floor did — and a gene from it is still inside living Tibetans today.",
    image: "/images/lab/xiahe-mandible.jpg",
    alt: "The Xiahe mandible, a Denisovan jawbone fragment found at Baishiya Karst Cave",
    mode: "explorable",
  },
  {
    href: "/lab/antikythera",
    kicker: "Antikythera, Greece · ~70-60 BCE wreck",
    title: "A corroded lump that turned out to be a computer",
    hook: "It took X-rays, then CT scans, then better CT scans, to read what a Greek engineer built into bronze 2,000 years ago.",
    image: "/images/lab/antikythera-fragment-a.webp",
    alt: "Fragment A of the Antikythera mechanism, a corroded ancient bronze gear assembly",
    mode: "explorable",
  },
  {
    href: "/lab/marathon-myth",
    kicker: "490 BCE, Marathon, Greece",
    title: "The run that probably never happened",
    hook: "Herodotus never mentions a dying messenger. Here's the real run he does describe, and why Athens needed the myth anyway.",
    image: "/images/lab/marathon-tumulus.jpg",
    alt: "The burial mound (tumulus) at Marathon, Greece",
    mode: "read",
  },
  {
    href: "/lab/beringia-crossing",
    kicker: "Bering Land Bridge, Alaska",
    title: "A multi-thousand-year pause, written in living DNA",
    hook: "No fossils prove it — but the mitochondrial DNA of millions of people alive today does.",
    image: "/images/lab/beringia-cache.jpg",
    alt: "A 9,000-year-old stone hunting cache on the open tundra in Bering Land Bridge National Preserve",
    mode: "read",
  },
  {
    href: "/lab/flood-myth",
    kicker: "Ur, Mesopotamia · 1929 excavation",
    title: "An archaeologist announced he'd found Noah's flood",
    hook: "He hadn't, not quite — but the real, repeated disaster behind the myth is still more interesting than the headline.",
    mode: "read",
  },
  {
    href: "/lab/etymology-fossils",
    kicker: "Words you say today",
    title: "Quarantine, deadline, and one popular lie about salt",
    hook: "Two ordinary words are fossils of real historical horrors. A third 'fact' you've heard everywhere probably isn't true.",
    mode: "read",
  },
];

export default function LabHome() {
  return (
    <main className={styles.page}>
      <Link href="/" className={styles.back}>
        ← back to the graph
      </Link>

      <section className={styles.intro}>
        <p className={styles.kicker}>The lab</p>
        <h1 className={styles.title}>Small, real artifacts. Read closely.</h1>
        <p className={styles.subtitle}>
          Rough, fast pieces built around one real clue each — a myth, a genome, a gear, a
          rock face. Pick whichever one grabs you first.
        </p>
      </section>

      <section className={styles.grid} aria-label="Lab pieces">
        {items.map((item) => (
          <Link key={item.href} href={item.href} className={styles.card}>
            <div className={styles.cardImageWrap}>
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.alt ?? ""}
                  fill
                  className={styles.cardImage}
                  sizes="(max-width: 600px) 100vw, 33vw"
                />
              ) : (
                <div className={styles.cardNoImage} aria-hidden="true">
                  Aa
                </div>
              )}
              <span
                className={
                  item.mode === "explorable" ? styles.badgeExplorable : styles.badgeRead
                }
              >
                {item.mode === "explorable" ? "Click to explore" : "Short read"}
              </span>
            </div>
            <div className={styles.cardBody}>
              <p className={styles.cardKicker}>{item.kicker}</p>
              <h2 className={styles.cardTitle}>{item.title}</h2>
              <p className={styles.cardHook}>{item.hook}</p>
              <span className={styles.cardCta}>Take a look →</span>
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}
