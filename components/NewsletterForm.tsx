"use client";

import { useState } from "react";
import { submitInquiry } from "@/lib/submit";

export function NewsletterForm({ code }: { code: string }) {
  const [via, setVia] = useState<"email" | "whatsapp">("email");
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const isWa = via === "whatsapp";

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = e.currentTarget;
    if (!f.checkValidity()) { f.reportValidity(); return; }
    setBusy(true);
    await submitInquiry("newsletter", new FormData(f));
    setBusy(false); setDone(true); f.reset();
  }

  return (
    <form className="news-form" onSubmit={onSubmit} noValidate>
      <div className="seg" role="radiogroup" aria-label="Send updates by">
        <label><input type="radio" name="via" value="email" checked={!isWa} onChange={() => setVia("email")} /><span>Email</span></label>
        <label><input type="radio" name="via" value="whatsapp" checked={isWa} onChange={() => setVia("whatsapp")} /><span>WhatsApp</span></label>
      </div>
      <div className="row">
        <label className="visually-hidden" htmlFor="news-contact">{isWa ? "WhatsApp number" : "Email address"}</label>
        <input id="news-contact" name="contact" required type={isWa ? "tel" : "email"} autoComplete={isWa ? "tel" : "email"}
          placeholder={isWa ? "+91 98xxx xxxxx" : "you@example.com"} />
        <button className="btn btn--light" type="submit" disabled={busy}>Get 10% off</button>
      </div>
      <p className="fine" aria-live="polite">
        {done ? <>You’re in. Your code <b style={{ color: "var(--gold-300)" }}>{code}</b> is on its way.</> : "No spam. Unsubscribe any time."}
      </p>
    </form>
  );
}
