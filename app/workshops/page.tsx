import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ArtFrame, Seam } from "@/components/Art";
import { WorkshopCard } from "@/components/Cards";
import { InquiryForm } from "@/components/InquiryForm";
import { workshops } from "@/lib/data";
import { BookingForm } from "./BookingForm";
import { SplitText } from "@/components/motion/SplitText";

export const metadata: Metadata = {
  title: "Art Workshops in Hyderabad: Kintsugi, Resin, Arabic Calligraphy",
  description: "Book kintsugi, resin art and Arabic calligraphy workshops in Banjara Hills, Hyderabad. Small groups, all materials included. Private and corporate workshops on request.",
  alternates: { canonical: "/workshops" },
};

export default function WorkshopsPage() {
  return (
    <main id="main">
      <div className="container">
        <header className="page-head">
          <nav className="breadcrumbs" aria-label="Breadcrumb"><ol><li><Link href="/">Home</Link></li><li aria-current="page">Workshops</li></ol></nav>
          <SplitText as="h1" text="Workshops, *mended* *with* *gold*" />
          <p className="lede">Three unhurried hours in our Banjara Hills studio. Groups of 8–16, every material included, and you take home what you make.</p>
        </header>
      </div>

      <section className="section" style={{ paddingTop: "var(--space-4)" }} aria-labelledby="up-title">
        <div className="container">
          <h2 id="up-title" className="visually-hidden">Upcoming dates</h2>
          <div className="workshops workshops--3">{workshops.map((w, i) => <WorkshopCard key={w.id} w={w} i={i % 3} large />)}</div>
        </div>
      </section>

      <Seam seed="ws-seam" variant="surface" />

      <section className="section section--surface" id="book" aria-labelledby="book-title" style={{ paddingTop: "var(--space-7)" }}>
        <div className="container split" style={{ alignItems: "start" }}>
          <div className="split-copy">
            <span className="eyebrow">Book a seat</span>
            <h2 id="book-title">Reserve and pay <em>online</em>.</h2>
            <p className="lede">Pay securely with UPI or card. Your seat is confirmed on WhatsApp instantly. Free reschedule up to 72 hours before.</p>
            <ol className="steps-inline">
              <li><div><b>Choose the date</b><span>Seats update live; the last ones go fast.</span></div></li>
              <li><div><b>Pay with Razorpay</b><span>UPI, cards and netbanking.</span></div></li>
              <li><div><b>Arrive and make</b><span>Wear clothes you don’t mind marking. We provide aprons.</span></div></li>
            </ol>
          </div>
          <div className="form-card">
            <Suspense fallback={<div style={{ minHeight: "34rem" }} />}><BookingForm workshops={workshops} /></Suspense>
          </div>
        </div>
      </section>

      <section className="section" id="private" aria-labelledby="priv-title">
        <div className="container split split--flip" style={{ alignItems: "start" }}>
          <div className="split-copy">
            <span className="eyebrow">Private &amp; corporate</span>
            <h2 id="priv-title">Your group, your date, <em>your craft</em>.</h2>
            <p className="lede">Birthdays, bridal showers, team offsites, school clubs. We host at the studio or bring everything to you, anywhere in Hyderabad.</p>
            <ArtFrame className="frame frame--arch ratio-32" spec={{ type: "kintsugi", tone: "emerald", seed: "private-ws", label: "A ceramic bowl mended with gold seams" }} />
          </div>
          <div className="form-card">
            <InquiryForm kind="private-workshop" title="private workshop request" style={{ display: "grid", gap: "var(--space-4)" }}
              success={<><h2 style={{ fontSize: "var(--text-xl)" }}>Request received.</h2><p className="muted">We’ll send dates and a per-person price within a day.</p></>}>
              <h3 style={{ fontSize: "var(--text-lg)" }}>Request a private workshop</h3>
              <fieldset className="field"><legend className="label" style={{ marginBottom: "var(--space-2)" }}>Type of group</legend><div className="choices">
                {["Private party", "Corporate team", "Bridal shower", "School / college"].map((v, i) => (
                  <label className="choice" key={v}><input type="radio" name="Type" value={v} defaultChecked={i === 0} /><span>{v}</span></label>))}
              </div></fieldset>
              <div className="form-row form-row--2">
                <div className="field"><label htmlFor="p-craft">Craft</label><select id="p-craft" name="Craft"><option>Kintsugi</option><option>Resin art</option><option>Arabic calligraphy</option><option>Canvas painting</option><option>Not sure yet</option></select></div>
                <div className="field"><label htmlFor="p-size">Group size</label><input id="p-size" name="Group size" type="number" min={4} inputMode="numeric" placeholder="e.g. 20" required /></div>
              </div>
              <div className="form-row form-row--2">
                <div className="field"><label htmlFor="p-date">Preferred date</label><input id="p-date" name="Date" type="date" /></div>
                <div className="field"><label htmlFor="p-venue">Venue</label><select id="p-venue" name="Venue"><option>At the Arty Affairs studio</option><option>Our office / home in Hyderabad</option><option>Online (kits shipped)</option></select></div>
              </div>
              <div className="form-row form-row--2">
                <div className="field"><label htmlFor="p-name">Your name</label><input id="p-name" name="Name" autoComplete="name" required /></div>
                <div className="field"><label htmlFor="p-phone">WhatsApp or email</label><input id="p-phone" name="Contact" required /></div>
              </div>
              <button className="btn btn--block" type="submit">Request a quote</button>
            </InquiryForm>
          </div>
        </div>
      </section>
    </main>
  );
}
