import type { Metadata } from "next";
import Link from "next/link";
import { ArtFrame, Seam } from "@/components/Art";
import { Botanical, Icon } from "@/components/Icon";
import { waLink } from "@/lib/data";
import { ScrubWords } from "@/components/motion/ScrubWords";
import { SplitText } from "@/components/motion/SplitText";

export const metadata: Metadata = {
  title: "About the Artist",
  description: "The story behind Arty Affairs: a Hyderabad art studio making Arabic calligraphy, resin art, kintsugi and custom gifts by hand. Events, pop-ups and collaborations.",
  alternates: { canonical: "/about" },
};

const PROCESS = [
  { title: "Sketch", body: "Wording and layout drawn by hand.", art: { type: "letter", tone: "cream", seed: "proc-1", label: "Sketching wording on paper" } },
  { title: "Letter", body: "Qalam and ink on primed canvas.", art: { type: "calligraphy", tone: "emerald", text: "بسم الله", seed: "proc-2", label: "Lettering on canvas" } },
  { title: "Gild", body: "Gold leaf, laid and burnished.", art: { type: "kintsugi", tone: "emerald", seed: "proc-3", label: "Applying gold to a seam" } },
  { title: "Wrap", body: "Packed by hand, with a note.", art: { type: "hamper", tone: "emerald", seed: "proc-4", label: "Wrapping a finished gift" } },
];

// Sample history — replace with the studio's real events and collaborations.
const EVENTS = [
  ["2026", "Makers’ markets & fests", "Live calligraphy stall: names lettered on the spot while you wait."],
  ["2026", "Founders’ meetups", "Exhibiting handmade corporate gifting for Hyderabad startups."],
  ["2025", "Food festival pop-ups", "Resin coasters and kintsugi demos between the food stalls."],
  ["2025", "Wedding planner collaborations", "Nikah pens and trousseau styling for Hyderabad weddings."],
  ["2024", "The first workshop", "Eight people, one table, a lot of gold."],
];

export default function AboutPage() {
  return (
    <main id="main">
      <section className="hero" aria-labelledby="about-title">
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="eyebrow" style={{ ["--i" as string]: 0 }}>About the artist</span>
            <SplitText as="h1" id="about-title" style={{ ["--i" as string]: 1 }} text="Shaping what you *dream* *of*." />
            <p className="lede" style={{ ["--i" as string]: 2 }}>Arty Affairs began at a dining table in Hyderabad with a single calligraphy pen and a stack of borrowed canvases. Today it’s a small studio in Banjara Hills where every piece is still made by hand.</p>
          </div>
          <figure className="hero-art">
            <ArtFrame className="frame frame--arch ratio-45" spec={{ type: "calligraphy", tone: "emerald", text: "الحمد لله", seed: "about-hero", label: "An Alhamdulillah calligraphy canvas in progress on the studio wall" }} />
            <figcaption><b>In the studio</b>Banjara Hills, Hyderabad</figcaption>
          </figure>
        </div>
      </section>

      <Seam seed="about-1" />

      <section className="section" aria-labelledby="story-title">
        <div className="container" style={{ maxWidth: "48rem" }}>
          <h2 id="story-title" className="visually-hidden">The story</h2>
          <div className="stack prose" style={{ fontSize: "var(--text-md)" }}>
            <p>I started lettering the names of friends for their weddings, one nikah pen at a time. Word spread the way it does in Hyderabad: an aunty at a mehendi, a cousin in Dubai, a colleague’s wedding in London. Soon the dining table wasn’t big enough.</p>
            <ScrubWords className="pull" text="Kintsugi taught me that the cracks are where the gold goes. It’s how I think about every gift: it should hold a story, not just fill a box." />
            <p>Every piece still passes through my hands. I sketch it, letter it, pour it or paint it, and I send you a proof on WhatsApp before anything is final. Then we wrap it the way we’d want to receive it: no prices, a handwritten note, a little gold.</p>
            <p className="signature">With love, from the studio</p>
          </div>
        </div>
      </section>

      <section className="section section--surface" aria-labelledby="process-title">
        <div className="container">
          <div className="section-head reveal"><span className="eyebrow">The process</span><h2 id="process-title">From sketch to gold</h2></div>
          <div className="process">
            {PROCESS.map((s, i) => (
              <figure className="reveal" key={s.title} style={{ ["--i" as string]: i }}>
                <ArtFrame className="frame frame--arch ratio-34 clip clip--left" style={{ ["--cd" as string]: `${i * 110}ms` }} spec={s.art} />
                <figcaption><b>{s.title}</b>{s.body}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="events-title">
        <div className="container split" style={{ alignItems: "start" }}>
          <div className="split-copy reveal">
            <span className="eyebrow">Events, pop-ups &amp; collaborations</span>
            <h2 id="events-title">Find us <em>in person</em>.</h2>
            <p className="lede">We pop up at food fests, founders’ meetups and makers’ markets across Hyderabad, and collaborate with wedding planners, cafés and brands.</p>
            <p><a className="link-arrow" href={waLink("Hi Arty Affairs! We'd love to collaborate on an event.")} target="_blank" rel="noopener"><span>Invite us to your event</span><Icon name="arrow" className="" /></a></p>
          </div>
          <ol className="timeline reveal">
            {EVENTS.map(([year, title, body]) => <li key={title}><time>{year}</time><div><b>{title}</b><span>{body}</span></div></li>)}
          </ol>
        </div>
      </section>

      <section className="cta-band on-dark" aria-labelledby="about-cta">
        <Seam seed="about-cta" variant="dark" />
        <div className="container inner"><span className="eyebrow">Create · Curate · Celebrate</span><h2 id="about-cta">Let’s make something <em>worth keeping</em>.</h2>
          <div className="actions"><Link className="btn btn--light" href="/commissions">Commission a piece</Link><Link className="btn btn--ghost-light" href="/workshops">Join a workshop</Link></div></div>
        <Botanical className="botanical" />
      </section>
    </main>
  );
}
