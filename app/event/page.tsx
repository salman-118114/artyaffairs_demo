import type { Metadata } from "next";
import { Seam } from "@/components/Art";
import { ProductCard } from "@/components/Cards";
import { Icon } from "@/components/Icon";
import { products, site, waLink } from "@/lib/data";
import { shortDate } from "@/lib/format";
import { CopyCode } from "./CopyCode";

/* Event QR landing. Print the QR to https://<domain>/event?src=<event-slug>.
 * Offer text lives in data/site.json → eventOffer (editable in /admin). */
export const metadata: Metadata = { title: "Welcome from the stall", robots: { index: false } };

export default function EventPage() {
  const o = site.eventOffer;
  return (
    <main id="main">
      <section className="event-hero on-dark" aria-labelledby="ev-title">
        <div className="container inner hero-copy">
          <span className="eyebrow" style={{ ["--i" as string]: 0 }}>Welcome from {o.event}</span>
          <h1 id="ev-title" className="big" style={{ ["--i" as string]: 1 }}><em>{o.percent}%</em> off,<br />just for you.</h1>
          <p style={{ ["--i" as string]: 2, color: "var(--color-on-dark-muted)", maxWidth: "30rem" }}>Loved something at the stall but couldn’t carry it home? Order online with this code and we’ll ship it anywhere in India or abroad.</p>
          <div className="coupon" style={{ ["--i" as string]: 3 }}><small>Your code</small><code>{o.code}</code>
            <small>Valid until {shortDate(o.until, { day: "numeric", month: "short", year: "numeric" })}</small></div>
          <CopyCode code={o.code} percent={o.percent} />
          <p style={{ ["--i" as string]: 5 }}><a className="link-arrow" href={waLink("Hi! I met you at the stall and I'd like to order.")} target="_blank" rel="noopener"><span>Or order on WhatsApp</span><Icon name="arrow" className="" /></a></p>
        </div>
        <Seam seed="event" style={{ position: "absolute", left: 0, right: 0, bottom: "12%" }} />
      </section>
      <section className="section" aria-labelledby="ev-more">
        <div className="container">
          <div className="section-head"><span className="eyebrow">Seen at the stall</span><h2 id="ev-more" style={{ fontSize: "var(--text-xl)" }}>Favourites from today</h2></div>
          <div className="rail">{products.filter((p) => p.availability === "ready").slice(0, 8).map((p, i) => <ProductCard key={p.id} p={p} i={i} />)}</div>
          <div className="reminder" style={{ marginTop: "var(--space-7)" }}>
            <div className="stack"><span className="eyebrow">Stay in touch</span><h2 style={{ fontSize: "var(--text-lg)" }}>Hear about our next pop-up first.</h2></div>
            <p className="muted">Join the studio letter at the bottom of this page. It adds 10% off your next order too.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
