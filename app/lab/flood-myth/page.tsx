import Link from "next/link";
import styles from "./page.module.css";

export default function FloodMythPage() {
  return (
    <main className={styles.page}>
      <Link href="/lab" className={styles.back}>
        ← back to the lab
      </Link>

      <section className={styles.section}>
        <p className={styles.kicker}>
          Roughly the 3rd millennium BCE onward, the Tigris-Euphrates valley, southern Iraq
        </p>
        <h1 className={styles.headline}>
          The flood that keeps showing up
        </h1>
      </section>

      <section className={styles.section}>
        <p className={styles.body}>
          Ancient Mesopotamia — the land between and around the Tigris and Euphrates rivers,
          roughly modern Iraq — was home to some of the first cities in the world. It was also
          a genuinely dangerous place to build one. The rivers there were prone to sudden,
          locally devastating floods, distinct from the ordinary seasonal flooding that
          farmers in the region planned their whole calendar around. Snowmelt from distant
          mountains, heavy rain, and the flat, low-lying floodplain could combine to put a
          city under water with little warning, sometimes catastrophically.
        </p>
        <p className={styles.body}>
          That recurring hazard is the most widely supported real-world basis for a story that
          shows up again and again in ancient Mesopotamian writing: a great flood, sent by the
          gods, that destroys nearly everyone.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.subhead}>One story, told more than once</h2>
        <p className={styles.body}>
          The Sumerians and Babylonians wrote down versions of this flood story more than
          once. It appears in the older Atrahasis epic, and again — in its most famous form —
          inserted into the Epic of Gilgamesh. In the Gilgamesh version, a man named
          Utnapishtim is warned in advance by a god, builds a boat, loads it with his family
          and with animals, and survives a flood sent to wipe out humanity. The boat eventually
          comes to rest on a mountain; the survivor sends out a bird to check whether the
          waters have receded.
        </p>
        <p className={styles.body}>
          Biblical scholars have long noted that this is, structurally, very close to the
          flood story told much later in Genesis: Noah, warned in advance, builds a boat,
          loads it with his family and with animals, survives a god-sent flood that destroys
          humanity, and sends out a bird to check the water. Divine warning, boat, animals,
          near-total destruction, a single family that survives — the same beats appear in
          both, in roughly the same order. That degree of overlap is generally read as
          evidence of a shared or influencing tradition between the two, not as coincidence.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.subhead}>1872: a discovery in a back room of the British Museum</h2>
        <p className={styles.body}>
          The connection became public knowledge through a specific, datable event. In 1872,
          George Smith, a self-taught Assyriologist working at the British Museum, was
          translating cuneiform tablets that had been excavated from the ruins of Nineveh. One
          of them turned out to contain a flood narrative strikingly similar to the biblical
          story of Noah — the tablet that preserves the flood episode within the Epic of
          Gilgamesh.
        </p>
        <p className={styles.body}>
          As the story is often told, Smith was so startled by what he was reading that he
          leapt up and began undressing in the middle of the museum&rsquo;s work room. The
          exact theatrics of that anecdote aren&rsquo;t independently verifiable, so it&rsquo;s
          worth holding loosely — but the underlying fact is real and well documented: Smith&rsquo;s
          1872 decipherment of the Gilgamesh flood tablet was a sensational, era-defining
          discovery, and it was the moment the wider public learned that the Bible&rsquo;s
          flood story had a much older Mesopotamian relative.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.subhead}>1929: &ldquo;I have found the flood&rdquo;</h2>
        <p className={styles.body}>
          Half a century later, the story seemed to get physical proof. In 1929, the
          archaeologist Leonard Woolley was excavating the ancient Sumerian city of Ur, in
          southern Iraq. Digging down through the site&rsquo;s layers of human occupation, his
          team hit something unusual: a thick band of water-laid silt, completely free of
          pottery, tools, or any other sign of human activity — sitting directly between layers
          that did contain those signs, above and below it.
        </p>
        <p className={styles.body}>
          Woolley announced that he had found physical proof of the flood — Noah&rsquo;s
          flood. It made headlines around the world. A real archaeologist, at a real and
          important ancient city, had apparently dug straight down into the very disaster the
          Bible and the Gilgamesh epic both describe.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.subhead}>The twist: even Woolley didn&rsquo;t claim that, exactly</h2>
        <p className={styles.body}>
          The headlines outran the evidence. In his own later report, Woolley himself was more
          careful than the press coverage suggested: what he had found, he wrote, was evidence
          of a serious local disaster in the lower Tigris-Euphrates valley — not proof of a
          single, literal, worldwide deluge.
        </p>
        <p className={styles.body}>
          Later researchers pushed the correction further. When archaeologists compared
          similar water-laid silt layers found at other Mesopotamian sites, the layers turned
          out to date to different centuries from each other — they were not all evidence of
          one shared event. And even at Ur itself, Woolley&rsquo;s flood layer doesn&rsquo;t
          cover the whole site; parts of the ancient city show no such layer at all. A single,
          single-event &ldquo;the flood&rdquo; doesn&rsquo;t survive contact with the fuller
          evidence — even though severe, real, local flooding clearly did happen, repeatedly,
          across this region&rsquo;s history.
        </p>
      </section>

      <section className={styles.speculative}>
        <p className={styles.speculativeLabel}>Imagining it — not a historical record</p>
        <p className={styles.speculativeBody}>
          Nothing below is attested by any source; it is one writer&rsquo;s imagined scene,
          meant only to make one ordinary version of this kind of moment concrete — not a
          claim about the origin of any specific text. Picture a survivor of one real
          Mesopotamian flood, years afterward, telling their children what the water did:
          how fast it came, which neighbors didn&rsquo;t get their animals out in time, how
          the roof of the house three doors down was the last thing visible before it wasn&rsquo;t.
          The children tell it to their own children later, a little larger each time, the
          real flood and the retelling slowly becoming two different things. This is not
          claimed as the origin of the Gilgamesh or Genesis flood stories specifically — only
          as one plausible, ordinary human moment behind how stories like them get started and
          carried forward at all.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.subhead}>What&rsquo;s still true, and still being read</h2>
        <p className={styles.body}>
          The best-supported explanation isn&rsquo;t &ldquo;one flood, one myth.&rdquo; It&rsquo;s
          that recurring, genuinely catastrophic river flooding across early Mesopotamian
          history left a deep cultural memory — one that crystallized, over generations, into a
          shared flood-survivor story template: warning, boat, animals, near-total destruction,
          one family spared. That template was then carried forward, directly or by influence,
          into the Genesis account of Noah.
        </p>
        <p className={styles.body}>
          From there it never really stopped traveling. The same story template is still read,
          taught, and believed today by a large fraction of the world&rsquo;s population,
          through Judaism, Christianity, and Islam. A multi-thousand-year-old response to a
          real, repeated regional disaster in one river valley is still sitting inside some of
          the most-read texts on Earth, right now.
        </p>
      </section>

      <section className={styles.sourceNote}>
        <p>
          The recurring, locally severe flooding of the Tigris-Euphrates valley is a
          well-documented environmental feature of the region and the leading real-world basis
          proposed for Mesopotamian flood narratives. The flood episode appears in the
          Atrahasis epic and, in its best-known form, within the Epic of Gilgamesh (the
          Utnapishtim narrative); structural parallels to the Genesis flood story (Noah) are
          widely discussed in biblical scholarship. George Smith&rsquo;s 1872 decipherment of
          the Gilgamesh flood tablet at the British Museum, and the public sensation it caused,
          are well documented; the specific detail of him undressing in excitement is a
          frequently repeated anecdote whose exact accuracy is not independently verifiable,
          hence &ldquo;as the story is often told&rdquo; above. Leonard Woolley&rsquo;s 1929
          excavation at Ur, his discovery of a water-laid silt layer, the resulting worldwide
          headlines, and his own more cautious published assessment of it as evidence of a
          serious local disaster (not a single worldwide deluge) are part of the historical
          record of the excavation; the later complication — that comparable silt layers at
          other Mesopotamian sites date to different periods, and that Woolley&rsquo;s layer
          does not cover the whole of Ur — reflects subsequent archaeological reassessment. The
          passage marked &ldquo;Imagining it&rdquo; is explicitly fictional and not part of the
          historical record.
        </p>
      </section>

      <section className={styles.related}>
        <Link href="/lab">More from the lab</Link>
        <Link href="/lab/etymology-fossils">Etymology fossils</Link>
      </section>
    </main>
  );
}
