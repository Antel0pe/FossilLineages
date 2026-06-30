import Link from "next/link";
import styles from "./page.module.css";

export default function EtymologyFossilsPage() {
  return (
    <main className={styles.page}>
      <Link href="/lab" className={styles.back}>
        ← back to the lab
      </Link>

      <section className={styles.section}>
        <p className={styles.kicker}>no excavation required</p>
        <h1 className={styles.headline}>
          Fossils you say out loud
        </h1>
        <p className={styles.body}>
          Most of the evidence on this site comes out of the ground: bone, rock, DNA.
          But some evidence never got buried at all — it&rsquo;s sitting in plain sight,
          in the words people use every day without a second thought. Ordinary English
          words can be traces of specific, real, datable historical events, worn smooth
          by centuries of use until the event behind them is forgotten and only the word
          survives. Here are three. Two are solid. One is a trap.
        </p>
      </section>

      <section className={styles.specimen}>
        <p className={styles.specimenLabel}>Specimen 1</p>
        <p className={styles.specimenWord}>Quarantine</p>
        <p className={styles.specimenRoot}>from Italian quaranta, &ldquo;forty&rdquo;</p>
        <p className={styles.body}>
          During the Black Death, ships arriving at the port of Venice were required to
          anchor offshore and wait before anyone aboard could come ashore, so officials
          could see whether plague would show up among the crew and passengers. A
          surviving document from 1377 records an initial 30-day waiting period for
          incoming ships, later extended to 40 days — giving the practice, and the
          word, its &ldquo;forty&rdquo; root — to allow more time for symptoms to
          appear before anyone was let in.
        </p>
        <p className={styles.body}>
          Every time someone says &ldquo;I&rsquo;m quarantining,&rdquo; they are reusing
          a word coined for one specific 14th-century Venetian anti-plague policy: forty
          days, riding at anchor, waiting to see who got sick.
        </p>
      </section>

      <section className={styles.specimen}>
        <p className={styles.specimenLabel}>Specimen 2</p>
        <p className={styles.specimenWord}>Deadline</p>
        <p className={styles.specimenRoot}>from a literal line, in a Civil War prison camp</p>
        <p className={styles.body}>
          At Confederate prison camps during the American Civil War — most infamously
          Andersonville, in Georgia, and also the Union&rsquo;s Rock Island camp in
          Illinois — a line was marked out some distance inside the outer wall, often by
          a fence or a row of stakes. Any prisoner who crossed it, even by a hair, could
          be shot on sight without warning, by standing order. This &ldquo;dead
          line&rdquo; is recorded in an 1864 Confederate inspector-general&rsquo;s
          report.
        </p>
        <p className={styles.body}>
          The word didn&rsquo;t pick up its modern meaning — a time limit, not a kill
          line — until the early 20th century, in the newspaper and printing world. The
          Oxford English Dictionary&rsquo;s first citation for that sense is from 1920,
          in a play about the newspaper business called <em>Deadline at Eleven</em>;
          printers had also separately used &ldquo;dead line&rdquo; for a line on a
          press plate beyond which text wouldn&rsquo;t print. So the word carries two
          real layers stacked on top of each other: a literal line that could get a
          prisoner shot, generalized decades later into the deadline waiting in
          everyone&rsquo;s inbox today.
        </p>
      </section>

      <section className={`${styles.specimen} ${styles.caution}`}>
        <p className={styles.cautionLabel}>Specimen 3 — handle with care</p>
        <p className={styles.specimenWord}>Salary</p>
        <p className={styles.specimenRoot}>from Latin salarium, tied to sal, &ldquo;salt&rdquo;</p>
        <p className={styles.body}>
          Here&rsquo;s the popular version of this story, the one you&rsquo;ll see
          repeated everywhere: Roman soldiers were paid in salt, because salt was
          valuable for preserving food, and that &ldquo;salt money&rdquo; — salarium —
          is where &ldquo;salary&rdquo; comes from.
        </p>
        <p className={styles.subBody}>
          The root connection is genuinely real: salary does derive from salarium,
          which does derive from sal, salt. That part holds up.
        </p>
        <p className={styles.subBody}>
          The &ldquo;paid in salt instead of money&rdquo; detail does not. There is no
          solid evidence from ancient sources that Roman soldiers were literally
          handed salt as wages rather than ordinary currency. It appears to be a
          popular embellishment, repeated so often and so confidently that it now reads
          as established fact — when historians are actually skeptical of that specific
          claim.
        </p>
        <p className={styles.body}>
          This is the same trap as the Marathon legend elsewhere on this site: a real
          event or a real root gets a vivid, satisfying detail bolted onto it later, and
          the detail outcompetes the truth because it&rsquo;s a better story. Spotting
          which part of an old story is solid and which part is embellishment is its own
          kind of detective work — the same work this whole site is trying to do with
          bones and rock instead of words.
        </p>
      </section>

      <section className={styles.sourceNote}>
        <p>
          Real evidence is everywhere, once you know to look for it — in rock, in DNA,
          in old shipwrecks, and apparently in your own vocabulary. Quarantine and
          deadline are well-evidenced fossils of real, datable events: a 1377 Venetian
          quarantine record later extended to 40 days, and an 1864 Confederate
          inspector-general&rsquo;s report describing the deadline at Andersonville.
          Salary&rsquo;s salt root is real; its &ldquo;paid in salt&rdquo; story is
          unverified folk etymology, included here on purpose, as a reminder that not
          every fossil-looking story is actually solid all the way through.
        </p>
      </section>

      <nav className={styles.nav}>
        <Link href="/lab">← back to the lab</Link>
        <Link href="/lab/flood-myth">see also: the flood myth →</Link>
      </nav>
    </main>
  );
}
