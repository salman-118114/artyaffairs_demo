import type { Metadata } from "next";
import Link from "next/link";
import { ArtFrame } from "@/components/Art";
import { Icon } from "@/components/Icon";
import { InquiryForm } from "@/components/InquiryForm";
import { UploadField } from "@/components/UploadField";
import { SplitText } from "@/components/motion/SplitText";

export const metadata: Metadata = {
  title: "Custom Arabic Calligraphy Painting & Resin Art Commissions in Hyderabad",
  description: "Commission a bespoke Arabic calligraphy painting, name canvas or resin piece from Arty Affairs, Hyderabad. Upload references, choose size and budget, and get a sketch and quote within a day.",
  alternates: { canonical: "/commissions" },
};

const Choices = ({ name, legend, options, checked }: { name: string; legend: string; options: [string, string][]; checked: string }) => (
  <fieldset className="field"><legend className="label" style={{ marginBottom: "var(--space-2)" }}>{legend}</legend>
    <div className="choices">{options.map(([value, label]) => (
      <label className="choice" key={value}><input type="radio" name={name} value={value} defaultChecked={value === checked} /><span>{label}</span></label>
    ))}</div></fieldset>
);

export default function CommissionsPage() {
  return (
    <main id="main">
      <div className="container">
        <header className="page-head">
          <nav className="breadcrumbs" aria-label="Breadcrumb"><ol><li><Link href="/">Home</Link></li><li aria-current="page">Custom commissions</li></ol></nav>
          <SplitText as="h1" text="Tell us the dream. *We’ll* *shape* *it.*" />
          <p className="lede">Bespoke paintings, Arabic calligraphy and resin pieces, made once, for you. Share a few details and we’ll reply with a sketch direction and a fixed quote within one working day.</p>
        </header>
      </div>

      <section className="section" style={{ paddingTop: "var(--space-4)" }} aria-label="Commission request">
        <div className="container split" style={{ alignItems: "start" }}>
          <div className="form-card">
            <InquiryForm kind="commission" title="commission request" waLabel="Send reference photos on WhatsApp" style={{ display: "grid", gap: "var(--space-5)" }}
              success={<><h2 style={{ fontSize: "var(--text-xl)" }}>Your idea is with the studio.</h2><p className="muted">Expect a sketch direction and quote within one working day.</p></>}>
              <Choices name="Piece" legend="What would you like made?" checked="Arabic calligraphy"
                options={[["Arabic calligraphy", "Arabic calligraphy"], ["Painting", "Painting"], ["Resin art", "Resin art"], ["Name canvas", "Name canvas"], ["Something else", "Something else"]]} />
              <div className="field"><label htmlFor="c-idea">Describe your idea</label>
                <textarea id="c-idea" name="Idea" required placeholder="e.g. Ayat al-Kursi in gold on a deep green round canvas for our new living room, with a subtle floral border." /></div>
              <div className="field"><label htmlFor="c-wording">Wording or names <span className="opt">(for calligraphy)</span></label><input id="c-wording" name="Wording" placeholder="Bismillah, a dua, or names" /></div>
              <Choices name="Size" legend="Size" checked="45 × 60 cm"
                options={[["30 × 40 cm", "30 × 40 cm"], ["45 × 60 cm", "45 × 60 cm"], ["60 × 90 cm", "60 × 90 cm"], ["90 × 120 cm", "90 × 120 cm"], ["Custom", "Custom size"]]} />
              <Choices name="Budget" legend="Budget range" checked="₹6,000 – ₹12,000"
                options={[["₹3,000 – ₹6,000", "₹3k – 6k"], ["₹6,000 – ₹12,000", "₹6k – 12k"], ["₹12,000 – ₹25,000", "₹12k – 25k"], ["₹25,000+", "₹25k +"]]} />
              <div className="form-row form-row--2">
                <div className="field"><label htmlFor="c-deadline">Needed by</label><input id="c-deadline" name="Deadline" type="date" required /><span className="hint">Most pieces take 2–3 weeks.</span></div>
                <div className="field"><label htmlFor="c-colours">Colours <span className="opt">(optional)</span></label><input id="c-colours" name="Colours" placeholder="Emerald and gold" /></div>
              </div>
              <div className="field"><span className="label">Reference images <span className="opt">(optional)</span></span>
                <UploadField name="References" label="Add photos of your wall, inspiration or colours" hint="JPG or PNG, up to 6 images" /></div>
              <div className="form-row form-row--2">
                <div className="field"><label htmlFor="c-name">Your name</label><input id="c-name" name="Name" autoComplete="name" required /></div>
                <div className="field"><label htmlFor="c-phone">WhatsApp number</label><input id="c-phone" name="WhatsApp" type="tel" autoComplete="tel" required /></div>
              </div>
              <div className="form-row form-row--2">
                <div className="field"><label htmlFor="c-email">Email</label><input id="c-email" name="Email" type="email" autoComplete="email" /></div>
                <div className="field"><label htmlFor="c-country">Deliver to</label><select id="c-country" name="Country"><option>India</option><option>UAE</option><option>UK</option><option>USA</option><option>Other</option></select></div>
              </div>
              <button className="btn btn--block" type="submit">Send my commission request</button>
              <p className="fine">No payment now. A 50% advance confirms your slot after you approve the sketch.</p>
            </InquiryForm>
          </div>

          <aside className="split-copy" aria-label="How commissions work">
            <span className="eyebrow">How it works</span>
            <ol className="steps-inline">
              <li><div><b>Request</b><span>Share the idea, size, budget and deadline.</span></div></li>
              <li><div><b>Sketch &amp; quote</b><span>We reply with a direction and a fixed price, usually within a day.</span></div></li>
              <li><div><b>Proof</b><span>A digital proof on WhatsApp. Two rounds of changes included.</span></div></li>
              <li><div><b>Made &amp; delivered</b><span>Painted by hand, photographed for you, packed and shipped worldwide.</span></div></li>
            </ol>
            <div className="collage" style={{ marginTop: "var(--space-5)" }}>
              <ArtFrame className="frame frame--arch ratio-34" spec={{ type: "roundel", tone: "ivory", seed: "comm-1", label: "A past commission: gilded round calligraphy canvas" }} />
              <ArtFrame className="frame frame--arch ratio-34" spec={{ type: "resin", tone: "emerald", seed: "comm-2", label: "A past commission: emerald resin tray" }} />
            </div>
            <p><Link className="link-arrow" href="/gallery"><span>See past commissions</span><Icon name="arrow" className="" /></Link></p>
          </aside>
        </div>
      </section>
    </main>
  );
}
