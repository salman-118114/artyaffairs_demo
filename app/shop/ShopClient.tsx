"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef } from "react";
import { ProductCard } from "@/components/Cards";
import { Icon } from "@/components/Icon";
import { CATEGORIES, OCCASIONS } from "@/lib/data";
import type { Product } from "@/lib/types";

const PRICES: [string, string][] = [["0-1000", "Under ₹1,000"], ["1000-3000", "₹1,000 – ₹3,000"], ["3000-7000", "₹3,000 – ₹7,000"], ["7000-999999", "₹7,000 and above"]];
const QUICK: [string, string, string][] = [["avail", "ready", "Ready to ship"], ["category", "calligraphy", "Calligraphy"], ["category", "hampers", "Hampers"], ["category", "resin", "Resin"], ["category", "nikah", "Nikah pens"], ["price", "0-1000", "Under ₹1,000"]];
const MULTI = ["category", "occasion", "price"] as const;

export function ShopClient({ products }: { products: Product[] }) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const drawer = useRef<HTMLDialogElement>(null);

  // Filter state lives in the URL, so filtered views can be shared and bookmarked.
  const state = {
    category: params.getAll("category"), occasion: params.getAll("occasion"), price: params.getAll("price"),
    avail: params.get("avail") || "", sort: params.get("sort") || "featured",
  };

  function update(mut: (q: URLSearchParams) => void) {
    const q = new URLSearchParams(params.toString());
    mut(q);
    const s = q.toString();
    router.replace(s ? `${pathname}?${s}` : pathname, { scroll: false });
  }
  const toggle = (k: string, v: string) => update((q) => {
    if (k === "avail") { if (q.get("avail") === v) q.delete("avail"); else q.set("avail", v); return; }
    const vals = q.getAll(k); q.delete(k);
    (vals.includes(v) ? vals.filter((x) => x !== v) : [...vals, v]).forEach((x) => q.append(k, x));
  });
  const isOn = (k: string, v: string) => (k === "avail" ? state.avail === v : (state[k as (typeof MULTI)[number]] as string[]).includes(v));
  const clearAll = () => update((q) => { [...MULTI, "avail"].forEach((k) => q.delete(k)); });

  const counts = useMemo(() => {
    const c: Record<string, Record<string, number>> = { category: {}, occasion: {} };
    products.forEach((p) => { c.category[p.category] = (c.category[p.category] || 0) + 1; p.occasions.forEach((o) => (c.occasion[o] = (c.occasion[o] || 0) + 1)); });
    return c;
  }, [products]);

  const list = useMemo(() => {
    const l = products.filter((p) =>
      (!state.category.length || state.category.includes(p.category)) &&
      (!state.occasion.length || state.occasion.some((o) => p.occasions.includes(o))) &&
      (!state.avail || p.availability === state.avail) &&
      (!state.price.length || state.price.some((r) => { const [a, b] = r.split("-").map(Number); return p.price >= a && p.price < b; })));
    if (state.sort === "price-asc") l.sort((a, b) => a.price - b.price);
    else if (state.sort === "price-desc") l.sort((a, b) => b.price - a.price);
    else if (state.sort === "rating") l.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
    else l.sort((a, b) => Number(b.bestseller) - Number(a.bestseller));
    return l;
  }, [products, params]); // eslint-disable-line react-hooks/exhaustive-deps

  const pills = [
    ...state.category.map((v) => ["category", v, CATEGORIES[v]]), ...state.occasion.map((v) => ["occasion", v, OCCASIONS[v]]),
    ...state.price.map((v) => ["price", v, PRICES.find(([k]) => k === v)?.[1] ?? v]),
    ...(state.avail ? [["avail", state.avail, state.avail === "ready" ? "Ready to ship" : "Made to order"]] : []),
  ] as [string, string, string][];

  // Retitle the page for single-facet views ("Eid gifts", "Gift hampers gifts").
  useEffect(() => {
    const h = document.getElementById("shop-title"); if (!h) return;
    const occ = state.occasion.length === 1 && !state.category.length ? OCCASIONS[state.occasion[0]] : "";
    const cat = state.category.length === 1 && !state.occasion.length ? CATEGORIES[state.category[0]] : "";
    h.innerHTML = occ ? `${occ} <em>gifts</em>` : cat ? `<em>${cat}</em>` : "The <em>shop</em>";
  }, [params]); // eslint-disable-line react-hooks/exhaustive-deps

  const filters = (where: "side" | "drawer") => (
    <div className="filters-form" style={{ display: "grid", gap: "var(--space-6)" }}>
      <fieldset className="filter-group"><legend>Availability</legend>
        {[["", "All pieces"], ["ready", "Ready to ship"], ["made", "Made to order"]].map(([v, t]) => (
          <label className="check" key={v}><input type="radio" name={`avail-${where}`} checked={state.avail === v}
            onChange={() => update((q) => (v ? q.set("avail", v) : q.delete("avail")))} /> {t}</label>
        ))}
      </fieldset>
      <fieldset className="filter-group"><legend>Category</legend>
        {Object.entries(CATEGORIES).filter(([k]) => counts.category[k]).map(([k, t]) => (
          <label className="check" key={k}><input type="checkbox" checked={isOn("category", k)} onChange={() => toggle("category", k)} /> {t}<span className="count">{counts.category[k]}</span></label>
        ))}
      </fieldset>
      <fieldset className="filter-group"><legend>Occasion</legend>
        {Object.entries(OCCASIONS).filter(([k]) => counts.occasion[k]).map(([k, t]) => (
          <label className="check" key={k}><input type="checkbox" checked={isOn("occasion", k)} onChange={() => toggle("occasion", k)} /> {t}<span className="count">{counts.occasion[k]}</span></label>
        ))}
      </fieldset>
      <fieldset className="filter-group"><legend>Price</legend>
        {PRICES.map(([k, t]) => <label className="check" key={k}><input type="checkbox" checked={isOn("price", k)} onChange={() => toggle("price", k)} /> {t}</label>)}
      </fieldset>
      <button type="button" className="btn btn--outline btn--sm" onClick={clearAll}>Clear all</button>
    </div>
  );

  return (
    <>
      <div className="chips" role="toolbar" aria-label="Quick filters">
        {QUICK.map(([k, v, t]) => <button key={k + v} type="button" className="chip" aria-pressed={isOn(k, v)} onClick={() => toggle(k, v)}>{t}</button>)}
      </div>

      <div className="shop-layout" style={{ paddingBottom: "var(--section)" }}>
        <aside className="filters" aria-label="Filters">{filters("side")}</aside>
        <section aria-labelledby="shop-title">
          <div className="shop-toolbar">
            <p className="count" aria-live="polite">{list.length} piece{list.length === 1 ? "" : "s"}</p>
            <div style={{ display: "flex", gap: "var(--space-2)", alignItems: "center" }}>
              <button className="btn btn--outline btn--sm filter-open" type="button" onClick={() => drawer.current?.showModal()}>Filters {pills.length ? `(${pills.length})` : ""}</button>
              <label className="visually-hidden" htmlFor="sort">Sort by</label>
              <select id="sort" value={state.sort} onChange={(e) => update((q) => (e.target.value === "featured" ? q.delete("sort") : q.set("sort", e.target.value)))}>
                <option value="featured">Featured</option><option value="price-asc">Price: low to high</option>
                <option value="price-desc">Price: high to low</option><option value="rating">Top rated</option>
              </select>
            </div>
          </div>
          {pills.length > 0 && (
            <div className="active-filters" style={{ marginBottom: "var(--space-5)" }}>
              {pills.map(([k, v, t]) => <button key={k + v} type="button" aria-label={`Remove filter ${t}`} onClick={() => toggle(k, v)}>{t} <span aria-hidden="true">×</span></button>)}
            </div>
          )}
          {list.length > 0 ? (
            <div className="products">{list.map((p, i) => <ProductCard key={p.id} p={p} i={i} clip />)}</div>
          ) : (
            <div className="empty">
              <h2>Nothing matches those filters.</h2>
              <p className="muted">Most pieces can be made to order in your colours. Tell us what you’re looking for.</p>
              <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap", justifyContent: "center" }}>
                <button className="btn btn--outline" type="button" onClick={clearAll}>Clear filters</button>
                <Link className="btn" href="/commissions">Request a custom piece</Link>
              </div>
            </div>
          )}
        </section>
      </div>

      <dialog className="drawer drawer--left" ref={drawer} aria-labelledby="fd-title" onClick={(e) => { if (e.target === drawer.current) drawer.current?.close(); }}>
        <div className="drawer-inner">
          <div className="drawer-head"><h2 id="fd-title">Filters</h2>
            <button className="icon-btn" type="button" aria-label="Close filters" onClick={() => drawer.current?.close()}><Icon name="close" className="" /></button></div>
          <div className="drawer-body">{filters("drawer")}</div>
          <div className="drawer-foot"><button className="btn btn--block" type="button" onClick={() => drawer.current?.close()}>Show {list.length} piece{list.length === 1 ? "" : "s"}</button></div>
        </div>
      </dialog>
    </>
  );
}
