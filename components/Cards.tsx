import Link from "next/link";
import { products as allProducts, waLink } from "@/lib/data";
import { shortDate } from "@/lib/format";
import type { Product, Review, Workshop } from "@/lib/types";
import { ArtFrame, ProductMedia } from "./Art";
import { Icon } from "./Icon";
import { Price } from "./StoreProvider";

export function Stars({ p }: { p: Pick<Product, "rating" | "reviewCount"> }) {
  return (
    <span className="stars"><Icon name="star" className="" />
      <span>{p.rating.toFixed(1)} <span className="visually-hidden">out of 5,</span>({p.reviewCount})</span></span>
  );
}

export function Availability({ p }: { p: Product }) {
  return p.availability === "ready"
    ? <span className="avail avail--ready">Ready to ship</span>
    : <span className="avail">Made to order · {p.leadDays} days</span>;
}

export function Badges({ p }: { p: Product }) {
  const low = p.stock != null && p.stock > 0 && p.stock <= 3;
  if (!p.badge && !low) return null;
  return (
    <div className="badges">
      {p.badge && <span className={`badge${/Limited|Original/.test(p.badge) ? " badge--gold" : ""}`}>{p.badge}</span>}
      {low && <span className="badge badge--low">Only {p.stock} left</span>}
    </div>
  );
}

export function ProductCard({ p, i = 0, clip = false }: { p: Product; i?: number; clip?: boolean }) {
  return (
    <article className="card reveal" style={{ ["--i" as string]: i % 4 }}>
      <div className={`frame${clip ? " clip" : ""}`} style={clip ? { ["--cd" as string]: `${(i % 4) * 90}ms` } : undefined}><Badges p={p} /><ProductMedia product={p} /></div>
      <div className="card-meta"><Availability p={p} /><Stars p={p} /></div>
      <h3><Link href={`/product/${p.id}`}>{p.name}</Link></h3>
      <div className="card-meta"><Price inr={p.price} /></div>
    </article>
  );
}

export function WorkshopCard({ w, i = 0, large = false }: { w: Workshop; i?: number; large?: boolean }) {
  const date = shortDate(w.date);
  const filled = (w.seats - w.seatsLeft) / w.seats;
  const sold = w.seatsLeft === 0;
  return (
    <article className={`ws${large ? " ws--lg" : ""} reveal`} style={{ ["--i" as string]: i }}>
      <ArtFrame spec={{ type: w.art, tone: "emerald", seed: w.id }} />
      <div className="ws-body">
        <span className="ws-date"><time dateTime={w.date}>{date}</time> · {w.time}</span>
        <h3>{w.title}</h3>
        {large && <p className="muted" style={{ fontSize: "var(--text-sm)" }}>{w.blurb}</p>}
        <span className="ws-meta">{w.venue} · {w.level}{large ? ` · Includes ${w.includes.toLowerCase()}` : ""}</span>
        <div className="seats">
          <div className="seats-bar"><i style={{ ["--fill" as string]: filled.toFixed(2) }} /></div>
          <span className={`seats-label${w.seatsLeft <= 3 ? " low" : ""}`}>
            {sold ? "Fully booked, join the waitlist" : `${w.seatsLeft} of ${w.seats} seats left`}
          </span>
        </div>
        <div className="ws-foot">
          <Price inr={w.price} />
          {sold
            ? <a className="btn btn--sm btn--outline" href={waLink(`Hi! Please add me to the waitlist for ${w.title} on ${date}.`)} target="_blank" rel="noopener">Join waitlist</a>
            : <Link className="btn btn--sm" href={`/workshops?book=${w.id}#book`}>Book a seat</Link>}
        </div>
      </div>
    </article>
  );
}

export function ReviewCard({ r, i = 0 }: { r: Review; i?: number }) {
  const p = allProducts.find((x) => x.id === r.product);
  return (
    <article className="review reveal" style={{ ["--i" as string]: i % 3 }}>
      <blockquote>
        <span className="stars" role="img" aria-label={`${r.rating} out of 5 stars`}>
          {Array.from({ length: r.rating }, (_, k) => <Icon key={k} name="star" className="" />)}
        </span>
        <p>“{r.text}”</p>
        <footer><b>{r.name}</b> · {r.city}{p && <> · <Link href={`/product/${p.id}`}>{p.name}</Link></>}</footer>
      </blockquote>
      <ArtFrame spec={{ type: r.photo, tone: r.photo === "name" ? "cream" : "emerald", seed: `rv${i}${r.name}`, label: `Customer photo of ${p ? p.name : "their order"}` }} />
    </article>
  );
}
