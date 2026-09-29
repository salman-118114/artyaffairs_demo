"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { waLink } from "@/lib/site";
import type { Currency, SiteSettings } from "@/lib/types";
import { ArtSvg } from "./Art";
import { Icon } from "./Icon";
import { useStore } from "./StoreProvider";

const NAV = [
  ["/shop", "Shop"], ["/hamper", "Build a Hamper"], ["/wedding", "Wedding & Nikah"],
  ["/commissions", "Commissions"], ["/workshops", "Workshops"], ["/gallery", "Gallery"],
] as const;

/** Opens/closes a native <dialog> from React state, and reports closes (Esc, backdrop) back. */
function useDialog(open: boolean, onClose: () => void) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current; if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);
  useEffect(() => {
    const d = ref.current; if (!d) return;
    const onCloseEvt = () => onClose();
    const onClick = (e: MouseEvent) => { if (e.target === d) d.close(); };
    d.addEventListener("close", onCloseEvt); d.addEventListener("click", onClick);
    return () => { d.removeEventListener("close", onCloseEvt); d.removeEventListener("click", onClick); };
  }, [onClose]);
  return ref;
}

export function Header({ site }: { site: SiteSettings }) {
  const pathname = usePathname();
  const store = useStore();
  const menuRef = useRef<HTMLDialogElement>(null);
  const bagRef = useDialog(store.bagOpen, () => store.setBagOpen(false));

  // Close drawers when navigating.
  useEffect(() => { menuRef.current?.close(); store.setBagOpen(false); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    const d = menuRef.current; if (!d) return;
    const onClick = (e: MouseEvent) => { if (e.target === d) d.close(); };
    d.addEventListener("click", onClick); return () => d.removeEventListener("click", onClick);
  }, []);

  // Hide the header while reading down the page; bring it back on any upward scroll.
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const yNow = window.scrollY;
      setScrolled(yNow > 40);
      if (Math.abs(yNow - last) > 6) { setHidden(yNow > last && yNow > 320); last = yNow; }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const b = site.banner;
  const waItems = store.bag.map((x) => `• ${x.name} × ${x.qty}`).join("\n");

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <div className="festive" data-theme={b.active ? b.theme : undefined} role="region" aria-label="Seasonal offer">
        {b.active ? (<><span>{b.text}</span>{b.link && <Link href={b.link}>{b.cta || "Shop now"}</Link>}</>)
          : <span>Handmade gifts from Hyderabad, shipped worldwide</span>}
      </div>
      <header className={`site-header${hidden && !store.bagOpen ? " is-hidden" : ""}${scrolled ? " is-scrolled" : ""}`}>
        <div className="container bar">
          <Link className="brand" href="/" aria-label="Arty Affairs, home">
            <Icon name="mark" className="" />
            <span className="brand-word"><b>Arty Affairs</b><small>Create · Curate · Celebrate</small></span>
          </Link>
          <nav className="main-nav" aria-label="Main">
            <ul>{NAV.map(([href, label]) => (
              <li key={href}><Link href={href} aria-current={pathname.startsWith(href) ? "page" : undefined}>{label}</Link></li>
            ))}</ul>
          </nav>
          <div className="header-actions">
            <label className="currency">
              <span className="visually-hidden">Currency</span>
              <select aria-label="Currency" value={store.currency} onChange={(e) => store.setCurrency(e.target.value as Currency)}>
                {(["INR", "USD", "AED", "GBP"] as const).map((c) => <option key={c}>{c}</option>)}
              </select>
            </label>
            <button className="icon-btn bag-btn" type="button" aria-haspopup="dialog" onClick={() => store.setBagOpen(true)}
              aria-label={`Bag, ${store.count} item${store.count === 1 ? "" : "s"}`}>
              <Icon name="bag" className="" />
              {store.count > 0 && <span className="bag-count" aria-hidden="true">{store.count}</span>}
            </button>
            <button className="icon-btn menu-toggle" type="button" aria-label="Menu" aria-haspopup="dialog" onClick={() => menuRef.current?.showModal()}>
              <Icon name="menu" className="" />
            </button>
          </div>
        </div>
      </header>

      <dialog className="drawer" ref={menuRef} aria-label="Menu">
        <div className="drawer-inner">
          <div className="drawer-head"><span className="eyebrow">Menu</span>
            <button className="icon-btn" type="button" aria-label="Close menu" onClick={() => menuRef.current?.close()}><Icon name="close" className="" /></button></div>
          <div className="drawer-body">
            <ul className="menu-list">
              <li><Link href="/shop">Shop all <small>Ready &amp; made to order</small></Link></li>
              <li><Link href="/hamper">Build a hamper <small>From ₹1,500</small></Link></li>
              <li><Link href="/wedding">Wedding &amp; Nikah</Link></li>
              <li><Link href="/commissions">Custom commissions</Link></li>
              <li><Link href="/workshops">Workshops <small>Kintsugi, resin</small></Link></li>
              <li><Link href="/corporate">Corporate gifting</Link></li>
              <li><Link href="/gallery">Gallery</Link></li>
            </ul>
            <ul className="menu-sub">
              <li><Link href="/about">About the artist</Link></li><li><Link href="/reviews">Reviews</Link></li>
              <li><Link href="/shipping">Shipping</Link></li><li><Link href="/faq">FAQ</Link></li>
              <li><Link href="/#reminder">Occasion reminders</Link></li><li><a href={`https://instagram.com/${site.instagram}`} rel="noopener">Instagram</a></li>
            </ul>
          </div>
          <div className="drawer-foot">
            <a className="btn btn--wa btn--block" href={waLink("Hi Arty Affairs! I have a question.", site.whatsapp)} target="_blank" rel="noopener"><Icon name="wa" className="" /> Chat on WhatsApp</a>
          </div>
        </div>
      </dialog>

      <dialog className="drawer" ref={bagRef} aria-labelledby="bag-title">
        <div className="drawer-inner">
          <div className="drawer-head"><h2 id="bag-title">Your bag</h2>
            <button className="icon-btn" type="button" aria-label="Close bag" onClick={() => store.setBagOpen(false)}><Icon name="close" className="" /></button></div>
          <div className="drawer-body">
            {store.bag.length === 0 ? (
              <div className="bag-empty"><Icon name="gift" className="" /><p>Your bag is waiting for something handmade.</p>
                <Link className="btn btn--outline" href="/shop">Browse the shop</Link></div>
            ) : store.bag.map((x) => {
              const opts = Object.entries(x.options || {}).filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`).join(" · ");
              return (
                <div className="line" key={x.key}>
                  <div className="line-media"><ArtSvg spec={{ ...(x.art || { type: "hamper" }), seed: x.id }} /></div>
                  <div>
                    <h3>{x.name}</h3>
                    {opts && <p className="line-meta">{opts}</p>}
                    <div className="line-actions">
                      <div className="qty">
                        <button type="button" aria-label="Decrease quantity" onClick={() => store.setQty(x.key, x.qty - 1)}>−</button>
                        <output aria-live="polite">{x.qty}</output>
                        <button type="button" aria-label="Increase quantity" onClick={() => store.setQty(x.key, x.qty + 1)}>+</button>
                      </div>
                      <button className="line-remove" type="button" onClick={() => store.setQty(x.key, 0)}>Remove</button>
                    </div>
                  </div>
                  <div className="line-price">{store.fmt(x.price * x.qty)}</div>
                </div>
              );
            })}
          </div>
          {store.bag.length > 0 && (
            <div className="drawer-foot">
              <div className="total-row"><span>Subtotal</span><strong>{store.fmt(store.total)}</strong></div>
              <p className="fine">Shipping and any gift note are added at checkout. First order? Use <b>{site.firstOrderCode}</b>.</p>
              <Link className="btn btn--block" href="/checkout"><Icon name="lock" className="" /> Checkout</Link>
              <a className="btn btn--outline btn--block" target="_blank" rel="noopener"
                href={waLink(`Hi Arty Affairs! I'd like to order:\n${waItems}\nTotal: ${store.fmt(store.total, "INR")}`, site.whatsapp)}>
                <Icon name="wa" className="" /> Order this bag on WhatsApp
              </a>
            </div>
          )}
        </div>
      </dialog>
    </>
  );
}
