import Link from "next/link";
import { ArtSvg } from "@/components/Art";
import { ProductCard } from "@/components/Cards";
import { Icon } from "@/components/Icon";
import { InquiryForm } from "@/components/InquiryForm";
import { HorizontalRail } from "@/components/motion/HorizontalRail";
import { HoverList, type HoverItem } from "@/components/motion/HoverList";
import { Magnetic } from "@/components/motion/Magnetic";
import { Marquee } from "@/components/motion/Marquee";
import { Parallax } from "@/components/motion/Parallax";
import { ParallaxColumns } from "@/components/motion/ParallaxColumns";
import { ScrubWords } from "@/components/motion/ScrubWords";
import { SeamScrub } from "@/components/motion/SeamScrub";
import { SplitText } from "@/components/motion/SplitText";
import { StackCards, type StackCard } from "@/components/motion/StackCards";
import { StickySteps, type Step } from "@/components/motion/StickySteps";
import { Testimonials } from "@/components/motion/Testimonials";
import { Price } from "@/components/StoreProvider";
import { products, reviews, site, waLink, workshops } from "@/lib/data";
import { shortDate } from "@/lib/format";

const OCCASIONS: HoverItem[] = [
  { href: "/wedding", title: "Wedding & Nikah", sub: "Pens, trousseau, frames", art: { type: "pen", tone: "emerald", text: "Qubool Hai", seed: "occ-wed" } },
  { href: "/shop?occasion=anniversary", title: "Anniversary", sub: "Keepsakes & letters", art: { type: "letter", tone: "cream", seed: "occ-ann" } },
  { href: "/shop?occasion=birthday", title: "Birthday", sub: "Same-day in Hyderabad", art: { type: "bouquet", tone: "cream", seed: "occ-bday" } },
  { href: "/shop?occasion=eid", title: "Eid", sub: "Calligraphy & Eidi boxes", art: { type: "calligraphy", tone: "emerald", text: "عيد مبارك", seed: "occ-eid" } },
  { href: "/shop?occasion=diwali", title: "Diwali", sub: "Diyas & resin platters", art: { type: "diya", tone: "emerald", seed: "occ-diwali" } },
  { href: "/corporate", title: "Corporate", sub: "Branded, from 25 pieces", art: { type: "diary", tone: "ivory", text: "Your logo", seed: "occ-corp" } },
];

const HAMPER_STEPS: Step[] = [
  { title: "Choose a box", body: "An emerald velvet trunk, a linen memory box or a kraft keepsake chest, each lettered by hand on the lid.", art: { type: "hamper", tone: "emerald", seed: "hs-1", label: "An emerald velvet hamper trunk" } },
  { title: "Fill it with pieces", body: "A mini name canvas, a resin keepsake, a foiled diary, dried flowers, a handwritten letter. The price updates as you go.", art: { type: "name", tone: "cream", text: "Aarav", arabic: "آرو", seed: "hs-2", label: "A mini name canvas" } },
  { title: "Add their name and your note", body: "We letter the lid, write your note by hand and wrap it without prices, ready to hand over.", art: { type: "letter", tone: "cream", seed: "hs-3", label: "A handwritten note sealed with gold wax" } },
];

const PROCESS: StackCard[] = [
  { title: "Sketch", body: "Every commission starts on paper: the wording, the layout, where the gold will fall.", note: "Proof sent on WhatsApp", art: { type: "letter", tone: "cream", seed: "pc-1", label: "A sketch of the layout" } },
  { title: "Letter", body: "Qalam and ink on primed canvas, stroke by stroke. Thuluth, Diwani, Naskh or your own hand.", note: "Two rounds of changes included", art: { type: "calligraphy", tone: "emerald", text: "بسم الله", seed: "pc-2", label: "Lettering a Bismillah canvas" } },
  { title: "Gild", body: "Gold leaf laid and burnished. Where something cracks, we mend it with gold, the kintsugi way.", note: "Sealed to keep its glow", art: { type: "kintsugi", tone: "emerald", seed: "pc-3", label: "A seam filled with gold" } },
  { title: "Wrap", body: "Packed by hand with a written note and no prices inside, then sent across the city or the world.", note: "Same-day in Hyderabad", art: { type: "hamper", tone: "emerald", seed: "pc-4", label: "A wrapped gift box" } },
];

const INSTA = [
  [{ type: "kintsugi", tone: "emerald", seed: "ig1", label: "A kintsugi bowl mended with gold" }, { type: "pen", tone: "ivory", seed: "ig5", text: "Sara &amp; Adil", label: "Nikah pens for Sara and Adil" }],
  [{ type: "resin", tone: "emerald", seed: "ig2", label: "An emerald resin tray" }, { type: "coasters", tone: "ivory", seed: "ig6", label: "Kintsugi resin coasters" }],
  [{ type: "calligraphy", tone: "emerald", seed: "ig3", text: "الحمد لله", label: "Alhamdulillah calligraphy canvas" }, { type: "hamper", tone: "cream", seed: "ig4", label: "An anniversary hamper" }],
];

export default function HomePage() {
  const best = products.filter((p) => p.bestseller).slice(0, 8);
  const upcoming = workshops.slice(0, 4);
  const productNames = Object.fromEntries(products.map((p) => [p.id, p.name]));
  const ig = `https://instagram.com/${site.instagram}`;

  return (
    <main id="main">
      {/* 1 · Hero — split-text headline, arch artwork wiped in with parallax depth */}
      <section className="hero2" aria-labelledby="hero-title">
        <div className="container">
          <div className="hero2-grid">
            <div className="hero2-copy">
              <span className="eyebrow rise" style={{ ["--rd" as string]: "0ms" }}>Handmade in Hyderabad · Shipped worldwide</span>
              <SplitText as="h1" id="hero-title" text="Art & gifts, *shaped* around your story." delay={120} />
              <p className="lede rise" style={{ ["--rd" as string]: "700ms" }}>Arabic calligraphy, resin art, nikah pens and hand-filled hampers, made one at a time in our Banjara Hills studio.</p>
              <div className="hero2-meta rise" style={{ ["--rd" as string]: "850ms" }}>
                <Link className="btn" href="/shop">Shop the studio</Link>
                <Link className="btn btn--text" href="/commissions">Commission a piece →</Link>
              </div>
            </div>
            <figure className="hero2-art">
              <div className="frame frame--arch clip" style={{ ["--cd" as string]: "200ms" }}>
                <Parallax className="parallax-inner" distance={36}>
                  <ArtSvg spec={{ type: "abstract", tone: "emerald", seed: "mended-garden-hero", label: "Mended Garden, an original emerald canvas crossed with gold-leaf kintsugi seams" }} />
                </Parallax>
              </div>
              <figcaption><span><b>Mended Garden</b>, 2026</span><Link href="/product/emerald-abstract-canvas">Acrylic &amp; gold leaf · View</Link></figcaption>
            </figure>
          </div>
          <ul className="hero2-facts">
            <li className="reveal"><b>Made by hand</b>Sketched, lettered and poured in Hyderabad.</li>
            <li className="reveal" style={{ ["--i" as string]: 1 }}><b>Proof before paint</b>Approve every name and verse on WhatsApp.</li>
            <li className="reveal" style={{ ["--i" as string]: 2 }}><b>Sent anywhere</b>Same-day in the city, tracked to UAE, UK &amp; USA.</li>
          </ul>
        </div>
      </section>

      {/* 2 · Marquee — a slow ticker of what the studio makes */}
      <Marquee items={["Wedding & Nikah", "Arabic calligraphy", "Resin art", "Gift hampers", "Kintsugi workshops", "Nikah pens", "Name canvases", "Handwritten letters"]} speed={48} />

      {/* 3 · Occasions — editorial index with a pointer-following preview */}
      <section className="section" aria-labelledby="occ-title">
        <div className="container occ2">
          <div className="occ2-intro">
            <span className="eyebrow">Shop by occasion</span>
            <SplitText id="occ-title" text="What are we *celebrating?*" />
            <p className="lede">From a nikah table to a Diwali desk, pick the moment and we’ll show you what we make for it.</p>
            <div><Link className="btn btn--text" href="/shop">See everything →</Link></div>
          </div>
          <HoverList items={OCCASIONS} />
        </div>
      </section>

      {/* 4 · Statement — words ink in as you scroll */}
      <section className="statement" aria-label="Our promise">
        <div className="container">
          <span className="kicker">The studio</span>
          <ScrubWords text="Every piece is sketched, lettered, poured and wrapped by one pair of hands in Hyderabad, then sent to wherever your people are." />
          <p className="statement-sig">Create. Curate. Celebrate.</p>
        </div>
      </section>

      {/* 5 · Bestsellers — pinned horizontal gallery */}
      <HorizontalRail header={
        <div className="section-head section-head--split">
          <div className="stack"><span className="eyebrow">Bestsellers</span><SplitText text="Most *gifted* this month" /></div>
          <Link className="btn btn--text" href="/shop">Shop all pieces →</Link>
        </div>
      }>
        {best.map((p, i) => <ProductCard key={p.id} p={p} i={i} />)}
      </HorizontalRail>

      {/* 6 · Hamper — scrollytelling with a sticky arch */}
      <section aria-labelledby="hamper-title">
        <StickySteps steps={HAMPER_STEPS}
          intro={<div className="stack"><span className="eyebrow">Build your hamper</span><SplitText id="hamper-title" text="A box of *exactly* what they love." /></div>}
          footer={<div><Link className="btn" href="/hamper">Start building · from <Price inr={1500} className="" /></Link></div>} />
      </section>

      {/* 7 · Process — stacked cards on a dark band */}
      <section className="band-dark on-dark" aria-labelledby="process-title">
        <div className="container">
          <div className="section-head"><span className="eyebrow">From sketch to gold</span><SplitText id="process-title" text="How a piece is *made*" />
            <p>Four steps, one pair of hands. Nothing is final until you’ve seen it.</p></div>
          <StackCards cards={PROCESS} />
        </div>
      </section>

      {/* 8 · Workshops — ticket rows with a sweeping fill and image peek */}
      <section className="section" aria-labelledby="ws-title">
        <div className="container">
          <div className="section-head section-head--split">
            <div className="stack"><span className="eyebrow">Workshops</span><SplitText id="ws-title" text="Make something with your *hands*" /></div>
            <Link className="btn btn--text" href="/workshops">All dates →</Link>
          </div>
          <ul className="ws-rows">
            {upcoming.map((w) => {
              const [, , dd] = w.date.split("-");
              const sold = w.seatsLeft === 0;
              return (
                <li key={w.id} className="ws-row reveal">
                  <div className="ws-day">{Number(dd)}<small>{shortDate(w.date, { month: "short", weekday: "short" })}</small></div>
                  <div className="ws-main"><h3>{w.title}</h3><p>{w.time} · {w.venue} · {w.level}</p></div>
                  <div className="ws-side">
                    <span className={`ws-seats${w.seatsLeft <= 3 ? " low" : ""}`}>{sold ? "Fully booked" : `${w.seatsLeft} of ${w.seats} seats left`}</span>
                    <Price inr={w.price} />
                    {sold
                      ? <a className="btn btn--sm btn--outline" href={waLink(`Hi! Please add me to the waitlist for ${w.title}.`)} target="_blank" rel="noopener">Waitlist</a>
                      : <Link className="btn btn--sm" href={`/workshops?book=${w.id}#book`}>Book</Link>}
                  </div>
                  <span className="ws-img" aria-hidden="true"><ArtSvg spec={{ type: w.art, tone: "emerald", seed: `wsi-${w.id}` }} /></span>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* 9 · Reviews — one quote at a time */}
      <section className="section section--surface" aria-labelledby="rev-title">
        <div className="container">
          <div className="section-head"><span className="eyebrow">Kind words</span><h2 id="rev-title" className="visually-hidden">Customer reviews</h2></div>
          <Testimonials reviews={reviews} productNames={productNames} />
        </div>
      </section>

      {/* 10 · Reminder — a quiet inline strip */}
      <section className="section section--tight" id="reminder" aria-labelledby="remind-title">
        <div className="container">
          <div className="reminder reveal">
            <div className="stack">
              <span className="eyebrow">Occasion reminders</span>
              <h2 id="remind-title" style={{ fontSize: "var(--text-xl)" }}>Remind me before the day that <em>matters</em>.</h2>
              <p className="muted">Three weeks’ notice, in time for a made-to-order piece.</p>
            </div>
            <InquiryForm kind="reminder" title="occasion reminder" className="form-row" waLabel="Save it on WhatsApp too"
              success={<p><b>Saved.</b> We’ll message you three weeks before.</p>}>
              <div className="form-row form-row--2">
                <div className="field"><label htmlFor="r-occ">Occasion</label>
                  <select id="r-occ" name="Occasion" required defaultValue=""><option value="">Choose one</option><option>Anniversary</option><option>Birthday</option><option>Wedding / Nikah</option><option>Eid</option><option>Diwali</option><option>Other</option></select></div>
                <div className="field"><label htmlFor="r-date">Date</label><input id="r-date" name="Date" type="date" required /></div>
              </div>
              <div className="form-row form-row--inline">
                <div className="field"><label htmlFor="r-contact">WhatsApp or email</label><input id="r-contact" name="Contact" type="text" autoComplete="email" placeholder="+91 98xxx xxxxx or you@example.com" required /></div>
                <button className="btn" type="submit"><Icon name="bell" className="" />Remind me</button>
              </div>
            </InquiryForm>
          </div>
        </div>
      </section>

      {/* 11 · Instagram — drifting columns */}
      <section className="section" aria-labelledby="ig-title" style={{ paddingTop: "var(--space-7)", overflow: "hidden" }}>
        <div className="container">
          <div className="section-head section-head--split">
            <div className="stack"><span className="eyebrow">On Instagram</span><SplitText id="ig-title" text="From the studio *table*" /></div>
            <a className="btn btn--text" href={ig} rel="noopener">@{site.instagram} →</a>
          </div>
          <ParallaxColumns columns={INSTA} href={ig} />
        </div>
      </section>

      {/* 12 · Finale — seam drawn by scroll, magnetic CTA */}
      <section className="finale on-dark" aria-labelledby="cta-title">
        <div className="container">
          <SeamScrub seed="finale" />
          <span className="eyebrow">Custom orders</span>
          <SplitText id="cta-title" className="display" text="Something only *you* could give." style={{ marginTop: "var(--space-5)" }} />
          <p>A verse for a new home, a couple’s names in gold, a resin piece in their wedding colours. Tell us the idea; we’ll reply with a sketch and a price within a day.</p>
          <div className="finale-actions">
            <Magnetic><Link className="btn btn--light" href="/commissions">Request a commission</Link></Magnetic>
            <a className="btn btn--text" href={waLink("Hi Arty Affairs! I have an idea for a custom piece.")} target="_blank" rel="noopener">WhatsApp the studio →</a>
          </div>
        </div>
      </section>
    </main>
  );
}
