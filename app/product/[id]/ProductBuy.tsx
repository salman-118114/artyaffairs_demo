"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { ProductMedia } from "@/components/Art";
import { Icon } from "@/components/Icon";
import { Price, useStore } from "@/components/StoreProvider";
import { addDays, isoDate, shortDate } from "@/lib/format";
import { waLink } from "@/lib/site";
import type { Product } from "@/lib/types";

const SCRIPTS = ["Arabic: Thuluth", "Arabic: Diwani", "Arabic: Naskh", "English: copperplate", "Urdu: Nastaliq"];

export function ProductBuy({ product: p, upsells }: { product: Product; upsells: Product[] }) {
  const store = useStore();
  const [size, setSize] = useState(0);
  const [pz, setPz] = useState({ Name: "", Date: "", Script: SCRIPTS[0], Wording: "", Message: "" });
  const [delivery, setDelivery] = useState("");
  const [addons, setAddons] = useState<string[]>([]);
  const [url, setUrl] = useState("");
  const [dates, setDates] = useState<{ min: string; max: string; label: string } | null>(null);
  const deliveryRef = useRef<HTMLInputElement>(null);
  const has = (f: Product["personalize"][number]) => p.personalize.includes(f);

  // Dates depend on "today", so compute them in the browser only.
  useEffect(() => {
    const earliest = addDays(p.leadDays + 1);
    setDates({ min: isoDate(earliest), max: isoDate(addDays(180)), label: shortDate(isoDate(earliest)) });
    setUrl(window.location.href);
  }, [p.leadDays]);

  const unit = p.price + (p.sizes[size]?.add ?? 0);
  const total = unit + addons.reduce((s, id) => s + (upsells.find((u) => u.id === id)?.price ?? 0), 0);

  const waHref = useMemo(() => {
    const details = Object.entries(pz).filter(([k, v]) => v && k !== "Script").map(([k, v]) => `${k}: ${v}`).join(", ");
    const sizeTxt = p.sizes.length > 1 ? ` (${p.sizes[size].label})` : "";
    return waLink(`Hi Arty Affairs! I'm interested in the ${p.name}${sizeTxt}.\n${url}\n${details ? details + "\n" : ""}Could you tell me more?`);
  }, [pz, size, url, p]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const el = deliveryRef.current!;
    const fail = (msg: string) => { el.setCustomValidity(msg); el.reportValidity(); el.addEventListener("input", () => el.setCustomValidity(""), { once: true }); };
    if (!delivery) return fail("Choose a delivery date so we can plan the making.");
    if (dates && delivery < dates.min) return fail(`The earliest we can deliver this is ${dates.label}.`);

    const options: Record<string, string> = {};
    if (p.sizes.length > 1) options.Size = p.sizes[size].label;
    if (has("name") && pz.Name) options.Name = pz.Name;
    if (has("date") && pz.Date) options.Date = pz.Date;
    if (has("wording") && pz.Wording) { options.Wording = pz.Wording; options.Script = pz.Script; }
    if (has("letter") && pz.Message) options.Message = pz.Message;
    options.Delivery = delivery;
    store.add({ id: p.id, name: p.name, price: unit, options, art: p.art });
    addons.forEach((id) => { const u = upsells.find((x) => x.id === id)!; store.add({ id: u.id, name: u.name, price: u.price, options: { With: p.name }, art: u.art }, { silent: true }); });
    setAddons([]);
  }

  const lowStock = p.stock != null && p.stock > 0 && p.stock <= 3;

  return (
    <>
      <form className="pdp-info" id="buy" noValidate onSubmit={onSubmit}>
        <div className="pdp-title">
          <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
            {p.badge && <span className={`badge${/Limited|Original/.test(p.badge) ? " badge--gold" : ""}`}>{p.badge}</span>}
            {p.availability === "ready" ? <span className="avail avail--ready">Ready to ship</span> : <span className="avail">Made to order · {p.leadDays} days</span>}
          </div>
          <h1>{p.name}</h1>
          <a href="#reviews" style={{ textDecoration: "none", width: "max-content" }}>
            <span className="stars"><Icon name="star" className="" /><span>{p.rating.toFixed(1)} ({p.reviewCount})</span></span>{" "}
            <span className="muted" style={{ fontSize: "var(--text-xs)", textDecoration: "underline", textUnderlineOffset: 3 }}>Read reviews</span>
          </a>
        </div>
        <div className="pdp-price"><Price inr={unit} /><small>Inclusive of taxes. Shipping calculated at checkout.</small></div>
        {lowStock && <p className="scarcity">{p.stock === 1 ? "Only 1 left. Each piece is one of a kind, so this exact piece won’t return." : `Only ${p.stock} left in this edition.`}</p>}
        <p className="muted">{p.short}</p>

        {p.sizes.length > 1 && (
          <fieldset className="field"><legend className="label" style={{ marginBottom: "var(--space-2)" }}>Size</legend>
            <div className="choices">{p.sizes.map((s, i) => (
              <label className="choice" key={s.label}><input type="radio" name="Size" checked={size === i} onChange={() => setSize(i)} />
                <span>{s.label}{s.add ? <small> +{store.fmt(s.add)}</small> : null}</span></label>
            ))}</div>
          </fieldset>
        )}

        {p.personalize.length > 0 && (
          <div className="personalise">
            <h2>Make it theirs</h2>
            {has("name") && <div className="field"><label htmlFor="pz-name">Name(s) to letter</label>
              <input id="pz-name" maxLength={40} placeholder="e.g. Ayesha & Imran" autoComplete="off" value={pz.Name} onChange={(e) => setPz({ ...pz, Name: e.target.value })} />
              <span className="hint">Up to 40 characters. We’ll send a proof on WhatsApp before we paint.</span></div>}
            {has("date") && <div className="field"><label htmlFor="pz-date">Date to include <span className="opt">(optional)</span></label>
              <input id="pz-date" type="date" value={pz.Date} onChange={(e) => setPz({ ...pz, Date: e.target.value })} /></div>}
            {has("wording") && <div className="field"><label htmlFor="pz-wording">Calligraphy wording</label>
              <select aria-label="Script style" value={pz.Script} onChange={(e) => setPz({ ...pz, Script: e.target.value })}>{SCRIPTS.map((s) => <option key={s}>{s}</option>)}</select>
              <input id="pz-wording" maxLength={80} placeholder="e.g. Bismillah, Ayat al-Kursi, a name or a verse" value={pz.Wording} onChange={(e) => setPz({ ...pz, Wording: e.target.value })} />
              <span className="hint">Not sure? Leave it blank and we’ll suggest wording on WhatsApp.</span></div>}
            {has("letter") && <div className="field"><label htmlFor="pz-letter">Your message <span className="opt">(handwritten inside)</span></label>
              <textarea id="pz-letter" maxLength={250} placeholder="Dear Ammi, …" value={pz.Message} onChange={(e) => setPz({ ...pz, Message: e.target.value })} />
              <span className="hint">{250 - pz.Message.length} characters left</span></div>}
          </div>
        )}

        <div className="field"><label htmlFor="p-delivery">Delivery date</label>
          <input id="p-delivery" ref={deliveryRef} type="date" required min={dates?.min} max={dates?.max} value={delivery} onChange={(e) => setDelivery(e.target.value)} />
          <span className="hint">{dates ? `Earliest in Hyderabad: ${dates.label}. Allow 3–6 extra days elsewhere in India, 7–12 abroad.` : " "}</span></div>

        {upsells.length > 0 && (
          <fieldset className="upsells"><legend className="label" style={{ marginBottom: "var(--space-2)" }}>Complete the gift</legend>
            {upsells.map((u) => (
              <label className="upsell" key={u.id}>
                <input type="checkbox" checked={addons.includes(u.id)} onChange={(e) => setAddons(e.target.checked ? [...addons, u.id] : addons.filter((x) => x !== u.id))} />
                <span className="frame"><ProductMedia product={u} alt="" /></span>
                <span><b>Add {u.name.toLowerCase()}</b><small>{u.short}</small></span>
                <Price inr={u.price} />
              </label>
            ))}
          </fieldset>
        )}

        <div className="buy-row">
          <button className="btn btn--block" type="submit">Add to bag · <Price inr={total} className="" /></button>
          <a className="btn btn--outline btn--block" href={waHref} target="_blank" rel="noopener"><Icon name="wa" className="" /> Ask about this on WhatsApp</a>
        </div>

        <ul className="pdp-assure">
          <li><Icon name="brush" className="" />Made by hand in our Hyderabad studio</li>
          <li><Icon name="gift" className="" />Gift-wrapped, with no prices inside</li>
          <li><Icon name="globe" className="" /><span>Ships worldwide. <Link href="/shipping" style={{ display: "inline-block", minHeight: 24 }}>Delivery times</Link></span></li>
          <li><Icon name="lock" className="" />Razorpay: UPI, cards, netbanking. International cards accepted</li>
        </ul>

        <div className="details-list">
          <details open><summary>About this piece</summary><div className="details-body"><p>{p.description}</p></div></details>
          <details><summary>Made to order, by hand</summary><div className="details-body"><p>Because each piece is handmade, colours and strokes vary slightly. That’s the point. Made-to-order pieces begin once you approve the proof we send on WhatsApp.</p></div></details>
          <details><summary>Shipping &amp; returns</summary><div className="details-body"><p>Hyderabad: same-day or next-day. Rest of India: 3–6 working days after dispatch. International: 7–12 working days via DHL/Aramex. Personalised pieces can’t be returned, but if anything arrives damaged we’ll remake it.</p></div></details>
          <details><summary>Care</summary><div className="details-body"><p>Keep canvases out of direct sun. Wipe resin with a soft dry cloth; avoid hot pans on resin trays.</p></div></details>
        </div>
      </form>

      <div className="sticky-bar">
        <button className="btn" type="submit" form="buy">Add to bag · <Price inr={total} className="" /></button>
        <a className="btn btn--wa" href={waHref} target="_blank" rel="noopener" aria-label="Ask about this on WhatsApp"><Icon name="wa" className="" /></a>
      </div>
    </>
  );
}
