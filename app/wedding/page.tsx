import type { Metadata } from "next";
import Link from "next/link";
import { ArtFrame, Seam } from "@/components/Art";
import { ProductCard } from "@/components/Cards";
import { Icon } from "@/components/Icon";
import { InquiryForm } from "@/components/InquiryForm";
import { products } from "@/lib/data";
import { Parallax } from "@/components/motion/Parallax";
import { SplitText } from "@/components/motion/SplitText";

export const metadata: Metadata = {
  title: "Nikah Pens, Wedding Hampers & Calligraphy Frames in Hyderabad",
  description: "Custom nikah pens with names and date, wedding trousseau hampers, calligraphy frames and bulk wedding favours, handmade in Hyderabad and shipped worldwide.",
  alternates: { canonical: "/wedding" },
};

const PILLARS = [
  { title: "Nikah pens", body: "Hand-painted florals, your names and date in gold, a velvet-lined box. Singles, pairs, and sets with a certificate tray.", href: "/product/nikah-pen-floral", from: "From ₹1,450", art: { type: "pen", tone: "emerald", text: "Sara &amp; Adil", seed: "f-pen" } },
  { title: "Trousseau & hampers", body: "We pack the bride’s trousseau in lettered boxes matched to her outfits, or build hampers for mehendi, haldi and the families.", href: "/product/trousseau-hamper", from: "From ₹4,800", art: { type: "hamper", tone: "cream", seed: "f-hamper" } },
  { title: "Calligraphy frames", body: "A verse, a dua, or the couple’s names in Arabic and English, gilded for the first wall of the new home.", href: "/product/bismillah-gold-canvas", from: "From ₹3,200", art: { type: "calligraphy", tone: "emerald", text: "ما شاء الله", seed: "f-callig" } },
];

export default function WeddingPage() {
  const wedding = products.filter((p) => p.occasions.includes("wedding")).slice(0, 8);
  return (
    <main id="main">
      <section className="wed-hero on-dark" aria-labelledby="wed-title">
        <div className="container inner">
          <div className="stack hero-copy" style={{ gap: "var(--space-5)" }}>
            <p className="arabic-mark" lang="ar" dir="rtl" style={{ ["--i" as string]: 0 }}>بارك الله لكما</p>
            <span className="eyebrow" style={{ ["--i" as string]: 1 }}>The Wedding &amp; Nikah Collection</span>
            <SplitText as="h1" id="wed-title" style={{ ["--i" as string]: 2 }} text="For the moment you say *Qubool* *Hai*." />
            <p style={{ ["--i" as string]: 3 }}>Hand-painted nikah pens, trousseau boxes lettered for the bride, calligraphy frames for the new home, and favours for every guest. Planned with you, down to the ribbon colour.</p>
            <div className="hero-actions" style={{ ["--i" as string]: 4 }}>
              <a className="btn btn--light" href="#collection">Shop the collection</a>
              <a className="btn btn--ghost-light" href="#inquiry">Plan a bridal or bulk order</a>
            </div>
          </div>
          {/* Two arches drifting at different speeds give the hero depth. */}
          <div className="wed-arches">
            <Parallax distance={50}><ArtFrame className="frame frame--arch ratio-34 clip" spec={{ type: "pen", tone: "emerald", text: "Ayesha &amp; Imran", seed: "wed-pen", label: "A pair of hand-painted nikah pens lettered Ayesha and Imran" }} /></Parallax>
            <Parallax distance={-30}><ArtFrame className="frame frame--arch ratio-34 clip" style={{ ["--cd" as string]: "180ms" }} spec={{ type: "hamper", tone: "emerald", seed: "wed-hamper", label: "An emerald trousseau hamper with a gold bow" }} /></Parallax>
          </div>
        </div>
        <Seam seed="wed-1" />
      </section>

      <section className="section" aria-labelledby="pillars">
        <div className="container">
          <div className="section-head reveal"><span className="eyebrow">What we make for weddings</span><h2 id="pillars">Three things couples ask for most</h2></div>
          <div className="feature-list">
            {PILLARS.map((f, i) => (
              <article className="feature reveal" key={f.title} style={{ ["--i" as string]: i }}>
                <ArtFrame className="frame frame--arch clip" style={{ ["--cd" as string]: `${i * 120}ms` }} spec={f.art} />
                <h3>{f.title}</h3><p>{f.body}</p>
                <Link className="link-arrow" href={f.href}><span>{f.from}</span><Icon name="arrow" className="" /></Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--surface" id="collection" aria-labelledby="coll-title">
        <div className="container">
          <div className="section-head section-head--split reveal"><div className="stack"><span className="eyebrow">The collection</span><h2 id="coll-title">Ready to personalise</h2></div>
            <Link className="link-arrow" href="/shop?occasion=wedding"><span>All wedding pieces</span><Icon name="arrow" className="" /></Link></div>
          <div className="products products--4">{wedding.map((p, i) => <ProductCard key={p.id} p={p} i={i} clip />)}</div>
        </div>
      </section>

      <section className="section" aria-labelledby="how-title">
        <div className="container split">
          <div className="split-copy reveal">
            <span className="eyebrow">Bridal &amp; bulk orders</span>
            <h2 id="how-title">From the first call to the <em>venue door</em>.</h2>
            <ol className="steps-inline">
              <li><div><b>Consultation</b><span>A 20-minute call or studio visit. Bring your outfit colours and guest count.</span></div></li>
              <li><div><b>Moodboard &amp; quote</b><span>Colours, wording and a fixed quote within 48 hours.</span></div></li>
              <li><div><b>Proofs on WhatsApp</b><span>Every name and verse approved by you before we paint.</span></div></li>
              <li><div><b>Delivered to your venue</b><span>Across Hyderabad, packed and labelled by family. Shipped anywhere else.</span></div></li>
            </ol>
            <p className="muted" style={{ fontSize: "var(--text-sm)" }}>Book 4–6 weeks ahead for trousseau and 50+ favours. Wedding-season dates (Nov–Feb) fill early.</p>
          </div>
          <div className="form-card reveal" id="inquiry">
            <InquiryForm kind="wedding" title="wedding enquiry" style={{ display: "grid", gap: "var(--space-4)" }}
              success={<><h2 style={{ fontSize: "var(--text-xl)" }}>Mubarak! We’ve got your details.</h2><p className="muted">We’ll be in touch within a working day with questions and a quote.</p></>}>
              <h2 style={{ fontSize: "var(--text-xl)" }}>Plan your order</h2>
              <div className="form-row form-row--2">
                <div className="field"><label htmlFor="w-names">Couple’s names</label><input id="w-names" name="Names" placeholder="Ayesha & Imran" required /></div>
                <div className="field"><label htmlFor="w-date">Wedding date</label><input id="w-date" name="Wedding date" type="date" required /></div>
              </div>
              <fieldset className="field"><legend className="label" style={{ marginBottom: "var(--space-2)" }}>What do you need?</legend><div className="choices">
                {["Nikah pens", "Trousseau packing", "Guest favours", "Calligraphy frames", "Mehendi / haldi hampers"].map((v) => (
                  <label className="choice" key={v}><input type="checkbox" name="Needs" value={v} /><span>{v}</span></label>))}
              </div></fieldset>
              <div className="form-row form-row--2">
                <div className="field"><label htmlFor="w-qty">Approx. quantity</label><input id="w-qty" name="Quantity" type="number" min={1} inputMode="numeric" placeholder="e.g. 120 favours" /></div>
                <div className="field"><label htmlFor="w-budget">Budget</label><select id="w-budget" name="Budget"><option>Under ₹25,000</option><option>₹25,000 – ₹75,000</option><option>₹75,000 – ₹1.5 lakh</option><option>₹1.5 lakh +</option></select></div>
              </div>
              <div className="field"><label htmlFor="w-colours">Colours or theme <span className="opt">(optional)</span></label><input id="w-colours" name="Colours" placeholder="Sage and gold, ivory florals…" /></div>
              <div className="form-row form-row--2">
                <div className="field"><label htmlFor="w-name">Your name</label><input id="w-name" name="Name" autoComplete="name" required /></div>
                <div className="field"><label htmlFor="w-phone">WhatsApp number</label><input id="w-phone" name="WhatsApp" type="tel" autoComplete="tel" required /></div>
              </div>
              <button className="btn btn--block" type="submit">Send enquiry</button>
              <p className="fine">We reply within one working day, usually on WhatsApp.</p>
            </InquiryForm>
          </div>
        </div>
      </section>

      <section className="cta-band on-dark" aria-label="Wedding reviews">
        <div className="container inner" style={{ textAlign: "center", justifyItems: "center" }}>
          <div className="quote-feature"><span className="eyebrow">From a bride</span>
            <p>“They built my sister’s trousseau box from scratch, matched to her lehenga colour. Worth every rupee.”</p>
            <span style={{ color: "var(--color-on-dark-muted)", fontSize: "var(--text-sm)" }}>Nida S., Hyderabad</span></div>
        </div>
      </section>
    </main>
  );
}
