"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Icon } from "@/components/Icon";
import { InquiryForm } from "@/components/InquiryForm";
import { useStore } from "@/components/StoreProvider";
import { shortDate } from "@/lib/format";
import type { Workshop } from "@/lib/types";

/** Seat booking. Payment is simulated; in production, create a Razorpay order for `total` server-side. */
export function BookingForm({ workshops }: { workshops: Workshop[] }) {
  const { fmt } = useStore();
  const want = useSearchParams().get("book");
  const open = workshops.filter((w) => w.seatsLeft > 0);
  const [id, setId] = useState(open.find((w) => w.id === want)?.id ?? open[0]?.id ?? "");
  const [seats, setSeats] = useState(1);
  const w = workshops.find((x) => x.id === id);
  const total = (w?.price ?? 0) * seats;

  return (
    <InquiryForm kind="booking" title="workshop booking" waLabel="Message the studio" style={{ display: "grid", gap: "var(--space-4)" }}
      success={<><h2 style={{ fontSize: "var(--text-xl)" }}>Your seat is booked.</h2><p className="muted">A confirmation with directions is on its way to your WhatsApp.</p></>}>
      <div className="field"><label htmlFor="b-ws">Workshop</label>
        <select id="b-ws" name="Workshop" required value={id} onChange={(e) => { setId(e.target.value); setSeats(1); }}>
          {workshops.map((x) => (
            <option key={x.id} value={x.id} disabled={!x.seatsLeft}>{x.title}, {shortDate(x.date, { day: "numeric", month: "short" })}{x.seatsLeft ? "" : " (full)"}</option>
          ))}
        </select></div>
      <div className="form-row form-row--2">
        <div className="field"><label htmlFor="b-seats">Seats</label>
          <select id="b-seats" name="Seats" value={seats} onChange={(e) => setSeats(Number(e.target.value))}>
            {Array.from({ length: Math.min(w?.seatsLeft ?? 1, 6) }, (_, i) => <option key={i + 1} value={i + 1}>{i + 1}</option>)}
          </select></div>
        <div className="field"><span className="label">Total</span>
          <strong style={{ fontSize: "var(--text-xl)", fontWeight: 500, lineHeight: "48px" }}>{fmt(total)}</strong>
          <input type="hidden" name="Total (INR)" value={total} /></div>
      </div>
      <div className="field"><label htmlFor="b-name">Name</label><input id="b-name" name="Name" autoComplete="name" required /></div>
      <div className="form-row form-row--2">
        <div className="field"><label htmlFor="b-phone">WhatsApp number</label><input id="b-phone" name="WhatsApp" type="tel" autoComplete="tel" required /></div>
        <div className="field"><label htmlFor="b-email">Email</label><input id="b-email" name="Email" type="email" autoComplete="email" required /></div>
      </div>
      <button className="btn btn--block" type="submit"><Icon name="lock" className="" /> Pay &amp; confirm seat</button>
      <p className="fine">Payments by Razorpay. Cancellation within 72 hours is non-refundable, but you can send a friend in your place.</p>
    </InquiryForm>
  );
}
