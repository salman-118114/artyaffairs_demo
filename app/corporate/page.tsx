import type { Metadata } from "next";
import Link from "next/link";
import { ArtFrame } from "@/components/Art";
import { InquiryForm } from "@/components/InquiryForm";
import { Price } from "@/components/StoreProvider";
import { SplitText } from "@/components/motion/SplitText";

export const metadata: Metadata = {
  title: "Corporate Gifting & Bulk Custom Gifts in Hyderabad",
  description: "Handmade corporate gifts from Hyderabad: branded resin desk sets, foiled diaries, Diwali and Eid hampers and team workshops. Bulk pricing from 25 pieces, pan-India delivery.",
  alternates: { canonical: "/corporate" },
};

const RANGE = [
  { title: "Desk sets", body: "Resin pen stand in your brand colours with a logo-foiled diary.", from: 1800, unit: "a set", art: { type: "diary", tone: "ivory", text: "Your logo", seed: "corp-1" } },
  { title: "Festive hampers", body: "Diwali, Eid and New Year boxes with a branded card and ribbon.", from: 2500, unit: "a box", art: { type: "hamper", tone: "gold", seed: "corp-2" } },
  { title: "Team workshops", body: "Kintsugi or resin sessions at your office: a calm, hands-on offsite.", from: 1800, unit: "a person", art: { type: "kintsugi", tone: "emerald", seed: "corp-3" } },
];

export default function CorporatePage() {
  return (
    <main id="main">
      <div className="container">
        <header className="page-head">
          <nav className="breadcrumbs" aria-label="Breadcrumb"><ol><li><Link href="/">Home</Link></li><li aria-current="page">Corporate &amp; bulk gifting</li></ol></nav>
          <SplitText as="h1" text="Gifts your clients *keep* *on* *the* *desk*." />
          <p className="lede">Handmade, in your brand colours, lettered with each recipient’s name if you like. From 25 to 1,000 pieces, delivered to one office or a hundred addresses.</p>
        </header>
      </div>

      <section className="section" style={{ paddingTop: "var(--space-4)" }} aria-labelledby="range-title">
        <div className="container">
          <h2 id="range-title" className="visually-hidden">What we make for teams</h2>
          <div className="feature-list">
            {RANGE.map((r, i) => (
              <article className="feature reveal" key={r.title} style={{ ["--i" as string]: i }}>
                <ArtFrame spec={r.art} /><h3>{r.title}</h3><p>{r.body}</p>
                <span className="link-arrow">From&nbsp;<Price inr={r.from} className="" />&nbsp;{r.unit}</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--surface" aria-labelledby="corp-form-title">
        <div className="container split" style={{ alignItems: "start" }}>
          <div className="split-copy">
            <span className="eyebrow">Bulk pricing</span>
            <h2 id="corp-form-title">Tell us about <em>your order</em>.</h2>
            <div className="table-wrap"><table>
              <thead><tr><th scope="col">Quantity</th><th scope="col">Saving</th><th scope="col">Lead time</th></tr></thead>
              <tbody><tr><td>25 – 49</td><td>5% off</td><td>2–3 weeks</td></tr><tr><td>50 – 99</td><td>10% off</td><td>3–4 weeks</td></tr><tr><td>100 +</td><td>15% off + free branding</td><td>4–6 weeks</td></tr></tbody>
            </table></div>
            <p className="muted" style={{ fontSize: "var(--text-sm)" }}>GST invoices provided. A physical sample can be couriered before you confirm.</p>
          </div>
          <div className="form-card">
            <InquiryForm kind="corporate" title="corporate gifting enquiry" waLabel="Talk on WhatsApp now" style={{ display: "grid", gap: "var(--space-4)" }}
              success={<><h2 style={{ fontSize: "var(--text-xl)" }}>Thank you. A proposal is on its way.</h2><p className="muted">We’ll email options and pricing within two working days.</p></>}>
              <div className="form-row form-row--2">
                <div className="field"><label htmlFor="k-co">Company</label><input id="k-co" name="Company" autoComplete="organization" required /></div>
                <div className="field"><label htmlFor="k-occ">Occasion</label><select id="k-occ" name="Occasion"><option>Diwali</option><option>Eid / Ramadan</option><option>New Year</option><option>Client appreciation</option><option>Employee onboarding</option><option>Conference / event</option><option>Other</option></select></div>
              </div>
              <div className="form-row form-row--2">
                <div className="field"><label htmlFor="k-qty">Quantity</label><input id="k-qty" name="Quantity" type="number" min={25} inputMode="numeric" placeholder="Minimum 25" required /></div>
                <div className="field"><label htmlFor="k-budget">Budget per gift</label><select id="k-budget" name="Budget"><option>₹1,000 – ₹2,000</option><option>₹2,000 – ₹4,000</option><option>₹4,000 – ₹8,000</option><option>₹8,000 +</option></select></div>
              </div>
              <fieldset className="field"><legend className="label" style={{ marginBottom: "var(--space-2)" }}>Branding options</legend><div className="choices">
                {[["Logo foil", "Logo foiling"], ["Brand-colour resin", "Brand-colour resin"], ["Custom card", "Custom message card"], ["Branded packaging", "Branded box & ribbon"], ["Recipient names", "Each recipient’s name"]].map(([v, t]) => (
                  <label className="choice" key={v}><input type="checkbox" name="Branding" value={v} /><span>{t}</span></label>))}
              </div></fieldset>
              <div className="form-row form-row--2">
                <div className="field"><label htmlFor="k-ship">Delivery</label><select id="k-ship" name="Delivery"><option>One office address</option><option>Multiple addresses (we’ll send a sheet)</option><option>Hand-delivered in Hyderabad</option></select></div>
                <div className="field"><label htmlFor="k-date">Needed by</label><input id="k-date" name="Deadline" type="date" required /></div>
              </div>
              <div className="field"><label htmlFor="k-notes">Anything else? <span className="opt">(optional)</span></label><textarea id="k-notes" name="Notes" placeholder="Brand colours, logo files, a product you liked…" /></div>
              <div className="form-row form-row--2">
                <div className="field"><label htmlFor="k-name">Your name</label><input id="k-name" name="Name" autoComplete="name" required /></div>
                <div className="field"><label htmlFor="k-email">Work email</label><input id="k-email" name="Email" type="email" autoComplete="email" required /></div>
              </div>
              <div className="field"><label htmlFor="k-phone">Phone / WhatsApp</label><input id="k-phone" name="Phone" type="tel" autoComplete="tel" /></div>
              <button className="btn btn--block" type="submit">Request a proposal</button>
            </InquiryForm>
          </div>
        </div>
      </section>
    </main>
  );
}
