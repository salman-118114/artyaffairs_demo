import Link from "next/link";
import { waLink } from "@/lib/data";
import type { SiteSettings } from "@/lib/types";
import { Seam } from "./Art";
import { Icon } from "./Icon";
import { NewsletterForm } from "./NewsletterForm";
import { WaFab } from "./WaFab";

export function Footer({ site }: { site: SiteSettings }) {
  return (
    <>
      <footer className="site-footer on-dark">
        <Seam seed="footer" variant="dark" />
        <div className="container">
          <div className="footer-news">
            <div className="stack">
              <span className="eyebrow">The studio letter</span>
              <h2>New pieces, workshop dates, and <em>10% off</em> your first order.</h2>
              <p>One short note a month. Choose email or WhatsApp.</p>
            </div>
            <NewsletterForm code={site.firstOrderCode} />
          </div>
          <div className="footer-grid">
            <div className="footer-brand">
              <Link className="brand" href="/"><Icon name="mark" className="" /><span className="brand-word"><b>Arty Affairs</b><small>Shaping what you dream of</small></span></Link>
              <p>Handmade art, calligraphy, resin and custom gift hampers, made in our studio in Banjara Hills, Hyderabad and shipped worldwide.</p>
              <p><a href={`https://instagram.com/${site.instagram}`} className="link-arrow" rel="noopener" style={{ color: "var(--gold-300)" }}><Icon name="insta" className="" /><span>@{site.instagram}</span></a></p>
            </div>
            <div className="footer-col"><h3>Shop</h3><ul>
              <li><Link href="/shop?category=calligraphy">Arabic calligraphy</Link></li><li><Link href="/shop?category=resin">Resin art</Link></li>
              <li><Link href="/shop?category=hampers">Gift hampers</Link></li><li><Link href="/shop?category=nikah">Nikah pens</Link></li>
              <li><Link href="/hamper">Build a hamper</Link></li></ul></div>
            <div className="footer-col"><h3>Studio</h3><ul>
              <li><Link href="/about">About the artist</Link></li><li><Link href="/gallery">Gallery</Link></li><li><Link href="/workshops">Workshops</Link></li>
              <li><Link href="/commissions">Commissions</Link></li><li><Link href="/corporate">Corporate gifting</Link></li></ul></div>
            <div className="footer-col"><h3>Help</h3><ul>
              <li><Link href="/shipping">Shipping &amp; delivery</Link></li><li><Link href="/faq">FAQ</Link></li><li><Link href="/reviews">Reviews</Link></li>
              <li><a href={waLink("Hi Arty Affairs! I need help with an order.", site.whatsapp)} target="_blank" rel="noopener">WhatsApp us</a></li>
              <li><a href="/admin">Studio login</a></li></ul></div>
          </div>
          <div className="footer-base">
            <span>© {new Date().getFullYear()} Arty Affairs · Handmade gifts in Hyderabad, shipped to India, UAE, UK, USA &amp; beyond</span>
            <span>Secure payments via Razorpay (UPI, cards, netbanking) and international cards</span>
          </div>
        </div>
      </footer>
      <WaFab href={waLink("Hi Arty Affairs! I'd like to place an order.", site.whatsapp)} />
    </>
  );
}
