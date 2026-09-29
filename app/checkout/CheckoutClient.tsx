"use client";

/* Checkout in three steps: details → delivery → payment.
 * Payments: Razorpay Checkout (UPI, cards, netbanking, wallets) for INR; Razorpay International
 * or PayPal for foreign cards. `startPayment()` is simulated here — wire it to a server route that
 * creates the Razorpay order (never trust client totals), then open Razorpay's checkout window. */
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArtSvg } from "@/components/Art";
import { Icon } from "@/components/Icon";
import { useStore } from "@/components/StoreProvider";
import type { SiteSettings } from "@/lib/types";

const SHIP_IN = [
  { id: "hyd", title: "Hyderabad same-day / next-day", sub: "Order by 2 pm for ready pieces", price: 150 },
  { id: "std", title: "India standard", sub: "3–6 working days after dispatch", price: 0 },
  { id: "exp", title: "India express", sub: "1–3 working days after dispatch", price: 350 },
];
const SHIP_INTL = [{ id: "intl", title: "International tracked (DHL / Aramex)", sub: "7–12 working days after dispatch. Duties may apply", price: 2400 }];
const COUNTRIES: [string, string][] = [["IN", "India"], ["AE", "United Arab Emirates"], ["GB", "United Kingdom"], ["US", "United States"], ["SA", "Saudi Arabia"], ["QA", "Qatar"], ["CA", "Canada"], ["AU", "Australia"], ["OT", "Other"]];
const STEP_TITLES = ["Your details", "Delivery", "Payment"];

export function CheckoutClient({ firstOrderCode, eventOffer }: { firstOrderCode: string; eventOffer: SiteSettings["eventOffer"] }) {
  const store = useStore();
  const [step, setStep] = useState(1);
  const [country, setCountry] = useState("IN");
  const [ship, setShip] = useState("std");
  const [pay, setPay] = useState("upi");
  const [gift, setGift] = useState(false);
  const [code, setCode] = useState("");
  const [codeInput, setCodeInput] = useState("");
  const [promoMsg, setPromoMsg] = useState("");
  const [placing, setPlacing] = useState(false);
  const [orderNo, setOrderNo] = useState<string | null>(null);
  const panelRef = useRef<HTMLElement>(null);
  const first = useRef(true);

  const offers: Record<string, number> = { [firstOrderCode]: 0.1, [eventOffer.code]: eventOffer.percent / 100 };
  const india = country === "IN";
  const shipOpts = india ? SHIP_IN : SHIP_INTL;
  const shipPrice = shipOpts.find((s) => s.id === ship)?.price ?? shipOpts[0].price;
  const sub = store.total;
  const disc = Math.round(sub * (offers[code] ?? 0));
  const grand = sub + shipPrice - disc;
  const inrPay = india && store.currency === "INR";
  const payOpts = inrPay
    ? [["upi", "UPI", "GPay, PhonePe, Paytm, any UPI app", "UPI"], ["card", "Card", "Visa, Mastercard, RuPay, Amex", "VISA·MC·RUPAY"], ["nb", "Netbanking or wallet", "All major Indian banks", "RAZORPAY"]]
    : [["intl-card", "International card", `Charged in INR; your bank converts to ${store.currency}`, "VISA·MC·AMEX"], ["paypal", "PayPal", "Pay with your PayPal balance or card", "PAYPAL"], ["upi", "UPI (Indian accounts)", "If you have an Indian bank account", "UPI"]];

  // Apply a code carried over from the event QR page (or ?code=).
  useEffect(() => {
    let pre: string | null = new URLSearchParams(location.search).get("code");
    try { pre = pre || sessionStorage.getItem("aa-code"); } catch { /* ignore */ }
    if (pre) applyCode(pre);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { setShip(country === "IN" ? "std" : "intl"); }, [country]);
  useEffect(() => { setPay(payOpts[0][0]); }, [inrPay]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    panelRef.current?.querySelector("h2")?.focus();
  }, [step]);

  function applyCode(raw: string) {
    const c = raw.trim().toUpperCase();
    setCodeInput(c);
    if (offers[c]) { setCode(c); setPromoMsg(`${c} applied: ${Math.round(offers[c] * 100)}% off.`); }
    else { setCode(""); setPromoMsg(c ? "That code isn’t valid. Check the spelling, or WhatsApp us." : ""); }
  }

  function next() {
    const els = panelRef.current?.querySelectorAll<HTMLInputElement>("input, select") ?? [];
    for (const el of els) if (!el.checkValidity()) { el.reportValidity(); return; }
    if (step < 3) return setStep(step + 1);
    startPayment();
  }

  function startPayment() {
    setPlacing(true);
    setTimeout(() => { setOrderNo("AA-" + Math.floor(10000 + Math.random() * 89999)); store.clear(); setPlacing(false); }, 900);
  }

  if (!store.ready) return <div style={{ minHeight: "60vh" }} aria-busy="true" />;

  if (orderNo) {
    return (
      <div className="form-card"><div className="form-success">
        <Icon name="check" className="" />
        <h2 style={{ fontSize: "var(--text-xl)" }}>Thank you. Your order is in.</h2>
        <p className="muted">Order <b>{orderNo}</b>. We’ll WhatsApp your proof within one working day.</p>
        <Link className="btn" href="/shop">Keep browsing</Link>
      </div></div>
    );
  }

  if (!store.bag.length) {
    return (
      <div className="form-card"><div className="bag-empty">
        <Icon name="gift" className="" />
        <p>Your bag is empty. Every piece is waiting to be made for someone.</p>
        <Link className="btn" href="/shop">Browse the shop</Link>
      </div></div>
    );
  }

  return (
    <>
      <ol className="stepper" style={{ ["--steps" as string]: 3 }} aria-label="Checkout steps">
        {STEP_TITLES.map((t, i) => <li key={t} className={i + 1 < step ? "done" : undefined} aria-current={i + 1 === step ? "step" : undefined}><b>{i + 1}</b> <span>{t}</span></li>)}
      </ol>

      <div className="checkout">
        <form className="form-card" noValidate onSubmit={(e) => { e.preventDefault(); next(); }}>
          <section className="builder-panel is-entering" key={step} ref={panelRef} aria-labelledby={`c${step}`}>
            <h2 id={`c${step}`} tabIndex={-1} style={{ fontSize: "var(--text-lg)" }}>{STEP_TITLES[step - 1]}</h2>

            {/* Fields stay mounted across steps (hidden), so typed values persist when going back. */}
            <div hidden={step !== 1} style={{ display: step === 1 ? "grid" : "none", gap: "var(--space-5)" }}>
              <div className="form-row form-row--2">
                <div className="field"><label htmlFor="co-name">Full name</label><input id="co-name" name="name" autoComplete="name" required={step === 1} /></div>
                <div className="field"><label htmlFor="co-phone">WhatsApp number</label><input id="co-phone" name="phone" type="tel" autoComplete="tel" placeholder="+91 98xxx xxxxx" required={step === 1} /><span className="hint">We send your proof and tracking here.</span></div>
              </div>
              <div className="field"><label htmlFor="co-email">Email</label><input id="co-email" name="email" type="email" autoComplete="email" required={step === 1} /></div>
              <label className="check"><input type="checkbox" checked={gift} onChange={(e) => setGift(e.target.checked)} /> This is a gift, sending to someone else</label>
            </div>

            <div style={{ display: step === 2 ? "grid" : "none", gap: "var(--space-5)" }}>
              <div className="form-row form-row--2">
                {gift && <div className="field"><label htmlFor="co-rname">Recipient’s name</label><input id="co-rname" name="recipient" required={step === 2} /></div>}
                <div className="field"><label htmlFor="co-country">Country</label>
                  <select id="co-country" name="country" autoComplete="country" value={country} onChange={(e) => setCountry(e.target.value)}>
                    {COUNTRIES.map(([v, t]) => <option key={v} value={v}>{t}</option>)}</select></div>
              </div>
              <div className="field"><label htmlFor="co-addr">Address</label><input id="co-addr" name="address" autoComplete="street-address" required={step === 2} /></div>
              <div className="form-row form-row--2">
                <div className="field"><label htmlFor="co-city">City</label><input id="co-city" name="city" autoComplete="address-level2" required={step === 2} /></div>
                <div className="field"><label htmlFor="co-pin">{india ? "PIN code" : "Postcode / ZIP"}</label><input id="co-pin" name="pin" autoComplete="postal-code" inputMode={india ? "numeric" : "text"} required={step === 2} /></div>
              </div>
              <fieldset className="field"><legend className="label" style={{ marginBottom: "var(--space-2)" }}>Shipping</legend>
                <div className="pay-options">{shipOpts.map((s) => (
                  <label className="pay-option" key={s.id}><input type="radio" name="ship" checked={ship === s.id} onChange={() => setShip(s.id)} />
                    <span><b>{s.title}</b><small>{s.sub}</small></span><span>{s.price ? store.fmt(s.price) : "Free"}</span></label>
                ))}</div></fieldset>
            </div>

            <div style={{ display: step === 3 ? "grid" : "none", gap: "var(--space-5)" }}>
              <div className="pay-options">{payOpts.map(([v, t, s, m]) => (
                <label className="pay-option" key={v}><input type="radio" name="pay" checked={pay === v} onChange={() => setPay(v)} />
                  <span><b>{t}</b><small>{s}</small></span><span className="pay-marks">{m.split("·").map((x) => <span key={x}>{x}</span>)}</span></label>
              ))}</div>
              <p className="fine">{inrPay ? "You’ll complete payment in the secure Razorpay window." : "International payments are processed securely by Razorpay International / PayPal."}</p>
              <label className="check"><input type="checkbox" name="terms" required={step === 3} /> I understand personalised pieces are made for me and can’t be returned (damage is always remade).</label>
            </div>
          </section>

          <div className="builder-nav">
            {step > 1 ? <button className="btn btn--outline" type="button" onClick={() => setStep(step - 1)}>Back</button> : <span />}
            <span />
            <button className="btn" type="submit" disabled={placing}>
              {placing ? "Opening secure payment…" : step === 3 ? <><Icon name="lock" className="" /> Pay {store.fmt(grand)}</> : step === 1 ? "Continue to delivery" : "Continue to payment"}
            </button>
          </div>
        </form>

        <aside className="summary-card" aria-labelledby="sum-title">
          <h2 id="sum-title">Order summary</h2>
          <div>{store.bag.map((x) => (
            <div className="line" key={x.key} style={{ gridTemplateColumns: "56px 1fr auto" }}>
              <div className="line-media"><ArtSvg spec={{ ...(x.art || { type: "hamper" }), seed: x.id }} /></div>
              <div><h3>{x.name}</h3><p className="line-meta">Qty {x.qty}{x.options?.Delivery ? ` · Deliver ${x.options.Delivery}` : ""}</p></div>
              <div className="line-price">{store.fmt(x.price * x.qty)}</div>
            </div>
          ))}</div>
          <form className="form-row form-row--inline" noValidate onSubmit={(e) => { e.preventDefault(); applyCode(codeInput); }}>
            <div className="field"><label htmlFor="code">Discount code</label><input id="code" placeholder={firstOrderCode} autoCapitalize="characters" value={codeInput} onChange={(e) => setCodeInput(e.target.value)} /></div>
            <button className="btn btn--outline btn--sm" type="submit" style={{ minHeight: 48 }}>Apply</button>
          </form>
          <p className="fine" aria-live="polite">{promoMsg}</p>
          <ul className="summary-lines">
            <li><span>Subtotal</span><span>{store.fmt(sub)}</span></li>
            <li><span>Shipping</span><span>{step < 2 && !shipPrice ? "From step 2" : shipPrice ? store.fmt(shipPrice) : "Free"}</span></li>
            {disc > 0 && <li><span>Discount ({code})</span><span>−{store.fmt(disc)}</span></li>}
          </ul>
          <div className="summary-total"><span>Total</span><strong>{store.fmt(grand)}</strong></div>
          <p className="fine">{store.currency === "INR" ? "Prices in Indian rupees, inclusive of GST." : `Shown in ${store.currency} for reference. You’ll be charged ${store.fmt(grand, "INR")}.`}</p>
        </aside>
      </div>
    </>
  );
}
