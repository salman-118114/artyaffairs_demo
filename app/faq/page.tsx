import type { Metadata } from "next";
import Link from "next/link";
import { waLink } from "@/lib/data";
import { SplitText } from "@/components/motion/SplitText";

export const metadata: Metadata = {
  title: "FAQ: Custom Orders, Nikah Pens, Payments & Delivery",
  description: "Answers about custom gifts, nikah pens, calligraphy proofs, Razorpay and international payments, delivery in Hyderabad and worldwide, and workshops at Arty Affairs.",
  alternates: { canonical: "/faq" },
};

// Plain-text answers (also used for the FAQPage structured data).
const SECTIONS: { id: string; title: string; items: [string, string][] }[] = [
  { id: "orders", title: "Orders & personalisation", items: [
    ["Do you make custom nikah pens?", "Yes. Every nikah pen is hand-painted with the couple’s names and date in gold and arrives in a velvet-lined box. Allow 5 working days, or WhatsApp us for rush orders."],
    ["Will I see my design before it’s made?", "Always. We send a digital proof of names, dates and wording on WhatsApp, and only begin once you approve. Two rounds of changes are included."],
    ["Can you write in Arabic, Urdu or Telugu?", "Arabic (Thuluth, Diwani, Naskh), Urdu Nastaliq and English scripts are our specialities. For other scripts, ask us. We’ll tell you honestly if we can do it justice."],
    ["How far ahead should I order?", "Ready-to-ship pieces leave in 1–2 days. Made-to-order pieces take 4–12 days (shown on each product). Commissions take 2–3 weeks. Wedding orders: 4–6 weeks."],
  ] },
  { id: "payments", title: "Payments & currency", items: [
    ["How can I pay?", "In India: UPI, cards (Visa, Mastercard, RuPay, Amex), netbanking and wallets via Razorpay. From abroad: international cards and PayPal."],
    ["Why do prices show in USD, AED or GBP?", "Pick your currency at the top of any page to see approximate prices. Orders are charged in Indian rupees, and your bank converts at its rate."],
    ["Do you have a first-order discount?", "Yes. Sign up to our studio letter (email or WhatsApp) at the bottom of any page for 10% off your first order."],
  ] },
  { id: "delivery", title: "Delivery", items: [
    ["Do you deliver gift hampers in Hyderabad the same day?", "Yes, ready-to-ship hampers ordered before 2 pm are delivered the same day across Hyderabad."],
    ["Do you ship internationally?", "Yes. We ship to the UAE, UK, USA, Canada, Australia and more by DHL or Aramex, usually 7–12 working days after dispatch."],
  ] },
  { id: "workshops", title: "Workshops", items: [
    ["Do I need any experience?", "No. Beginner workshops assume you’ve never held a qalam or mixed resin. We provide aprons and all materials."],
    ["Can I reschedule?", "Free up to 72 hours before. After that, you can send a friend in your place."],
  ] },
  { id: "care", title: "Care", items: [
    ["How do I look after resin and gold leaf?", "Wipe with a soft dry cloth. Keep out of direct sun and away from hot pans. Gold leaf is sealed, but avoid harsh cleaners."],
  ] },
];

export default function FaqPage() {
  const ld = { "@context": "https://schema.org", "@type": "FAQPage",
    mainEntity: SECTIONS.flatMap((s) => s.items).map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) };
  return (
    <main id="main">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <div className="container">
        <header className="page-head">
          <nav className="breadcrumbs" aria-label="Breadcrumb"><ol><li><Link href="/">Home</Link></li><li aria-current="page">FAQ</li></ol></nav>
          <SplitText as="h1" text="Questions, *answered*" />
          <p className="lede">Can’t find it here? <a href={waLink("Hi Arty Affairs! I have a question:")} target="_blank" rel="noopener">WhatsApp the studio</a>. We usually reply within the hour.</p>
        </header>
        <div className="faq-layout" style={{ paddingBottom: "var(--section)" }}>
          <nav className="faq-nav" aria-label="FAQ topics"><ul>
            {SECTIONS.map((s) => <li key={s.id}><a className="chip" href={`#${s.id}`}>{s.title}</a></li>)}
          </ul></nav>
          <div>
            {SECTIONS.map((s) => (
              <section className="faq-section details-list" id={s.id} key={s.id} aria-labelledby={`fq-${s.id}`}>
                <h2 id={`fq-${s.id}`}>{s.title}</h2>
                {s.items.map(([q, a]) => (
                  <details key={q}><summary>{q}</summary><div className="details-body"><p>{a}
                    {q === "Do you ship internationally?" && <> <Link href="/shipping">Full shipping details</Link>.</>}</p></div></details>
                ))}
              </section>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
