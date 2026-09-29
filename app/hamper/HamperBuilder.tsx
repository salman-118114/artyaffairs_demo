"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArtFrame } from "@/components/Art";
import { Icon } from "@/components/Icon";
import { Price, useStore } from "@/components/StoreProvider";
import { addDays, isoDate } from "@/lib/format";
import { waLink } from "@/lib/site";

/* Boxes and pieces for the builder. Prices in INR. */
const BOXES = [
  { id: "kraft", name: "Kraft keepsake chest", price: 600, capacity: 3, tone: "cream", note: "Holds up to 3 pieces" },
  { id: "linen", name: "Linen memory box", price: 950, capacity: 5, tone: "blush", note: "Holds up to 5 pieces" },
  { id: "velvet", name: "Emerald velvet trunk", price: 1800, capacity: 8, tone: "emerald", note: "Holds up to 8 · our signature" },
];
const ITEMS = [
  { id: "mini-name", name: "Mini name canvas", price: 900, art: "name", tone: "cream" },
  { id: "mini-callig", name: "Mini calligraphy", price: 850, art: "calligraphy", tone: "emerald" },
  { id: "resin-coaster", name: "Resin keepsake coaster", price: 550, art: "coasters", tone: "ivory" },
  { id: "diary", name: "Foil-initial diary", price: 1200, art: "diary", tone: "emerald" },
  { id: "posy", name: "Dried flower posy", price: 700, art: "bouquet", tone: "cream" },
  { id: "letter", name: "Handwritten letter", price: 650, art: "letter", tone: "cream" },
  { id: "nikah-pen", name: "Hand-painted pen", price: 1450, art: "pen", tone: "emerald" },
  { id: "card", name: "Painted greeting card", price: 250, art: "card", tone: "cream" },
];
const STEPS = ["Box", "Pieces", "Personalise", "Note", "Review"];
const OCCASIONS = ["Birthday", "Anniversary", "Wedding / Nikah", "Eid", "Diwali", "Thank you", "Just because"];

export function HamperBuilder() {
  const store = useStore();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [boxId, setBoxId] = useState("velvet");
  const [items, setItems] = useState<string[]>([]);
  const [info, setInfo] = useState({ For: "", Occasion: OCCASIONS[0], Lid: "English script", Palette: "Emerald & gold", Note: "", HidePrices: true, Delivery: "" });
  const [minDate, setMinDate] = useState<string>();
  const [bump, setBump] = useState(0);
  const panelRef = useRef<HTMLElement>(null);
  const firstRender = useRef(true);

  useEffect(() => setMinDate(isoDate(addDays(3))), []);

  const box = BOXES.find((b) => b.id === boxId)!;
  const chosen = ITEMS.filter((i) => items.includes(i.id));
  const lidExtra = info.Lid === "Both" ? 300 : 0;
  const total = box.price + chosen.reduce((s, i) => s + i.price, 0) + lidExtra;

  useEffect(() => { setBump((b) => b + 1); }, [total]);

  // Move focus to the new step's heading so screen readers announce it.
  useEffect(() => {
    if (firstRender.current) { firstRender.current = false; return; }
    panelRef.current?.querySelector("h2")?.focus({ preventScroll: true });
    const top = document.querySelector(".stepper")!.getBoundingClientRect().top + window.scrollY - 90;
    if (window.scrollY > top) window.scrollTo({ top, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  }, [step]);

  function valid(): boolean {
    if (step === 2 && !chosen.length) { store.toast("Add at least one piece to your hamper"); return false; }
    const els = panelRef.current?.querySelectorAll<HTMLInputElement>("input, select, textarea") ?? [];
    for (const el of els) if (!el.checkValidity()) { el.reportValidity(); return false; }
    return true;
  }
  function next() {
    if (!valid()) return;
    if (step < 5) return setStep(step + 1);
    store.add({ id: `hamper-${box.id}`, name: `Custom hamper: ${box.name}`, price: total, art: { type: "hamper", tone: box.tone },
      options: { Pieces: chosen.map((i) => i.name).join(", "), For: info.For, Occasion: info.Occasion, Lid: info.Lid, Palette: info.Palette, Note: info.Note, Delivery: info.Delivery } });
    setTimeout(() => router.push("/checkout"), 500);
  }
  const label = step === 5 ? "Add to bag & checkout" : "Continue";
  const set = (k: keyof typeof info) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setInfo({ ...info, [k]: e.target.value });

  return (
    <>
      <ol className="stepper" style={{ ["--steps" as string]: 5 }} aria-label="Hamper steps">
        {STEPS.map((s, i) => <li key={s} className={i + 1 < step ? "done" : undefined} aria-current={i + 1 === step ? "step" : undefined}><b>{i + 1}</b> <span>{s}</span></li>)}
      </ol>

      <div className="builder" style={{ paddingBottom: "var(--section)" }}>
        <form noValidate onSubmit={(e) => { e.preventDefault(); next(); }}>
          <section className="builder-panel is-entering" key={step} ref={panelRef} aria-labelledby={`h-s${step}`}>
            {step === 1 && (<>
              <h2 id="h-s1" tabIndex={-1}>Choose a box</h2>
              <div className="box-options">
                {BOXES.map((b) => (
                  <label className="pick" key={b.id}>
                    <input type="radio" name="box" checked={boxId === b.id} onChange={() => { setBoxId(b.id); setItems((it) => it.slice(0, b.capacity)); }} />
                    <span className="tick"><Icon name="check" className="" /></span>
                    <ArtFrame as="span" className="frame frame--arch" spec={{ type: "hamper", tone: b.tone, seed: `box-${b.id}` }} />
                    <b>{b.name}</b><small>{b.note} · <Price inr={b.price} className="" /></small>
                  </label>
                ))}
              </div>
            </>)}

            {step === 2 && (<>
              <h2 id="h-s2" tabIndex={-1}>Add the pieces</h2>
              <p className="muted">{box.name} holds up to {box.capacity} pieces. {chosen.length} of {box.capacity} chosen.</p>
              <div className="item-options">
                {ITEMS.map((it) => {
                  const on = items.includes(it.id);
                  return (
                    <label className="pick" key={it.id}>
                      <input type="checkbox" checked={on} disabled={!on && items.length >= box.capacity}
                        onChange={() => setItems(on ? items.filter((x) => x !== it.id) : [...items, it.id])} />
                      <span className="tick"><Icon name="check" className="" /></span>
                      <ArtFrame as="span" className="frame" spec={{ type: it.art, tone: it.tone, seed: `item-${it.id}` }} />
                      <b>{it.name}</b><small><Price inr={it.price} className="" /></small>
                    </label>
                  );
                })}
              </div>
            </>)}

            {step === 3 && (<>
              <h2 id="h-s3" tabIndex={-1}>Personalise it</h2>
              <div className="form-row form-row--2">
                <div className="field"><label htmlFor="h-for">Who is it for?</label><input id="h-for" placeholder="e.g. Ammi, Sara & Adil" maxLength={40} required value={info.For} onChange={set("For")} /></div>
                <div className="field"><label htmlFor="h-occ">Occasion</label><select id="h-occ" value={info.Occasion} onChange={set("Occasion")}>{OCCASIONS.map((o) => <option key={o}>{o}</option>)}</select></div>
              </div>
              <fieldset className="field"><legend className="label" style={{ marginBottom: "var(--space-2)" }}>Lettering on the lid</legend>
                <div className="choices">{["English script", "Arabic calligraphy", "Both"].map((v) => (
                  <label className="choice" key={v}><input type="radio" name="Lid" checked={info.Lid === v} onChange={() => setInfo({ ...info, Lid: v })} /><span>{v}{v === "Both" && <small> +₹300</small>}</span></label>
                ))}</div></fieldset>
              <fieldset className="field"><legend className="label" style={{ marginBottom: "var(--space-2)" }}>Colour palette</legend>
                <div className="choices">{["Emerald & gold", "Ivory & sage", "Blush & cream"].map((v) => (
                  <label className="choice" key={v}><input type="radio" name="Palette" checked={info.Palette === v} onChange={() => setInfo({ ...info, Palette: v })} /><span>{v}</span></label>
                ))}</div></fieldset>
            </>)}

            {step === 4 && (<>
              <h2 id="h-s4" tabIndex={-1}>Add a note</h2>
              <div className="field"><label htmlFor="h-note">Your note, handwritten on a card</label>
                <textarea id="h-note" maxLength={300} placeholder="Happy anniversary, my love. Here’s to the next ten…" value={info.Note} onChange={set("Note")} />
                <span className="hint">{300 - info.Note.length} characters left</span></div>
              <label className="check"><input type="checkbox" checked={info.HidePrices} onChange={(e) => setInfo({ ...info, HidePrices: e.target.checked })} /> Hide prices inside (it’s a gift)</label>
              <div className="field"><label htmlFor="h-date">Deliver on</label>
                <input id="h-date" type="date" required min={minDate} value={info.Delivery} onChange={set("Delivery")} />
                <span className="hint">Hampers need 3 days. Same-day in Hyderabad for ready boxes: WhatsApp us.</span></div>
            </>)}

            {step === 5 && (<>
              <h2 id="h-s5" tabIndex={-1}>Review your hamper</h2>
              <div className="split" style={{ gap: "var(--space-5)", alignItems: "start" }}>
                <ArtFrame className="frame frame--arch ratio-45" spec={{ type: "hamper", tone: box.tone, seed: `preview-${box.id}${chosen.length}`, label: `Preview of your ${box.name}` }} />
                <div className="stack">
                  <ul className="summary-lines">
                    {[["Box", box.name], ["Pieces", chosen.map((i) => i.name).join(", ")], ["For", info.For], ["Occasion", info.Occasion], ["Lid", info.Lid], ["Palette", info.Palette], ["Note", info.Note || "No note"], ["Deliver on", info.Delivery]].map(([k, v]) => (
                      <li key={k}><span>{k}</span><span style={{ textAlign: "right" }}>{v}</span></li>
                    ))}
                  </ul>
                  <div className="summary-total"><span>Total</span><strong>{store.fmt(total)}</strong></div>
                </div>
              </div>
            </>)}
          </section>

          <div className="builder-nav">
            {step > 1 ? <button className="btn btn--outline" type="button" onClick={() => setStep(step - 1)}>Back</button> : <span />}
            <span />
            <button className="btn" type="submit">{label}</button>
          </div>
        </form>

        <aside className="builder-summary" aria-label="Hamper summary">
          <div className="summary-card">
            <h2>Your hamper</h2>
            <ul className="summary-lines">
              <li><span>{box.name}</span><Price inr={box.price} className="" /></li>
              {chosen.map((i) => <li key={i.id}><span>{i.name}</span><Price inr={i.price} className="" /></li>)}
              {lidExtra > 0 && <li><span>Bilingual lid lettering</span><Price inr={300} className="" /></li>}
              <li><span>Hand-lettering &amp; wrap</span><span>Included</span></li>
            </ul>
            <div className="summary-total"><span>Total</span><strong key={bump} className="bump" aria-live="polite">{store.fmt(total)}</strong></div>
            <p className="fine">Includes hand-lettering and gift wrap. Shipping at checkout.</p>
            <a className="btn btn--outline btn--block" href={waLink("Hi Arty Affairs! I'd like help putting together a hamper.")} target="_blank" rel="noopener"><Icon name="wa" className="" /> Need help? WhatsApp us</a>
          </div>
        </aside>
      </div>

      <div className="sticky-bar">
        <div className="mobile-total"><span className="fine">Hamper total</span><strong>{store.fmt(total)}</strong></div>
        <button className="btn" type="button" onClick={next}>{label}</button>
      </div>
    </>
  );
}
