import type { Metadata } from "next";
import Link from "next/link";
import { SplitText } from "@/components/motion/SplitText";

export const metadata: Metadata = {
  title: "Shipping & Delivery: Hyderabad, India & International",
  description: "Same-day gift delivery in Hyderabad, 3–6 day delivery across India, and 7–12 day international shipping to the UAE, UK, USA and more. Timelines, rates and packaging.",
  alternates: { canonical: "/shipping" },
};

// Sample rates — confirm with the studio's courier contracts before launch.
const ZONES = [
  ["Hyderabad & Secunderabad", "Same / next day", "₹150 · free over ₹3,000", "Choose a delivery date at checkout"],
  ["Metro cities (Bengaluru, Mumbai, Delhi, Chennai)", "2–4 days", "Free · express ₹350", "Tracking by WhatsApp"],
  ["Rest of India", "4–6 days", "Free · express ₹350", "Remote PIN codes may take longer"],
  ["UAE, Saudi Arabia, Qatar, Oman", "5–8 days", "From ₹2,400", "Popular for Eid and nikah gifts"],
  ["UK & Europe", "7–10 days", "From ₹2,900", "Import VAT may be charged on arrival"],
  ["USA, Canada, Australia", "8–12 days", "From ₹3,400", "Duties may apply above local limits"],
];

export default function ShippingPage() {
  return (
    <main id="main">
      <div className="container" style={{ paddingBottom: "var(--section)" }}>
        <header className="page-head">
          <nav className="breadcrumbs" aria-label="Breadcrumb"><ol><li><Link href="/">Home</Link></li><li aria-current="page">Shipping</li></ol></nav>
          <SplitText as="h1" text="From our studio *to* *their* *door*" />
          <p className="lede">Delivery time = making time + shipping time. Ready-to-ship pieces leave within 1–2 days; made-to-order lead times are on every product page.</p>
        </header>

        <div className="ship-cards" style={{ marginBottom: "var(--space-7)" }}>
          <div className="ship-card reveal"><h3>Hyderabad</h3><b>Same day</b><p>For ready pieces ordered before 2 pm. Hand-delivered by our team or courier partner. ₹150, free over ₹3,000.</p></div>
          <div className="ship-card reveal" style={{ ["--i" as string]: 1 }}><h3>Rest of India</h3><b>3–6 days</b><p>Tracked via Blue Dart / Delhivery after dispatch. Free standard shipping; express for ₹350.</p></div>
          <div className="ship-card reveal" style={{ ["--i" as string]: 2 }}><h3>International</h3><b>7–12 days</b><p>DHL / Aramex, tracked door to door. From ₹2,400; calculated at checkout by weight.</p></div>
        </div>

        <section className="faq-section" aria-labelledby="zones"><h2 id="zones">Timelines by destination</h2>
          <div className="table-wrap"><table>
            <thead><tr><th scope="col">Destination</th><th scope="col">After dispatch</th><th scope="col">Rate</th><th scope="col">Notes</th></tr></thead>
            <tbody>{ZONES.map((z) => <tr key={z[0]}>{z.map((c) => <td key={c}>{c}</td>)}</tr>)}</tbody>
          </table></div>
        </section>

        <section className="faq-section details-list" aria-labelledby="pack" style={{ marginTop: "var(--space-7)" }}><h2 id="pack">Packaging, customs &amp; damage</h2>
          <details open><summary>How are pieces packed?</summary><div className="details-body"><p>Canvases are corner-guarded and double-boxed; resin is wrapped in foam and crated for international shipments. Gifts arrive wrapped, with a handwritten card and no prices inside.</p></div></details>
          <details><summary>Who pays customs duties?</summary><div className="details-body"><p>International duties and import taxes are set by the destination country and paid by the recipient on arrival. We declare gifts accurately and can advise on typical costs.</p></div></details>
          <details><summary>What if something arrives damaged?</summary><div className="details-body"><p>Send us a photo within 48 hours of delivery and we’ll remake or refund it. We’ve kept the kintsugi spirit, but we won’t make you glue it.</p></div></details>
        </section>
      </div>
    </main>
  );
}
