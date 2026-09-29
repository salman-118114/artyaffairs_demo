import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard, ReviewCard } from "@/components/Cards";
import { Icon } from "@/components/Icon";
import { getProduct, products, reviews, SITE_URL, waLink } from "@/lib/data";
import { ProductBuy } from "./ProductBuy";
import { ProductGallery } from "./ProductGallery";

type Props = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return products.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = getProduct((await params).id);
  if (!p) return {};
  return {
    title: `${p.name}, Handmade in Hyderabad`,
    description: `${p.short} Handmade in Hyderabad by Arty Affairs, shipped worldwide.`,
    alternates: { canonical: `/product/${p.id}` },
    openGraph: { title: p.name, description: p.short, images: p.images.length ? [p.images[0]] : undefined },
  };
}

export default async function ProductPage({ params }: Props) {
  const p = getProduct((await params).id);
  if (!p) notFound();

  const upsells = ["painted-card", "dried-bouquet", "handwritten-letter"].filter((x) => x !== p.id).map((x) => getProduct(x)!).filter(Boolean);
  const productReviews = [...reviews.filter((r) => r.product === p.id), ...reviews.filter((r) => r.product !== p.id)].slice(0, 4);
  const also = products.filter((x) => x.id !== p.id && x.occasions.some((o) => p.occasions.includes(o)))
    .sort((a, b) => Number(a.category === p.category) - Number(b.category === p.category)).slice(0, 4);

  const ld = {
    "@context": "https://schema.org", "@type": "Product", name: p.name, description: p.description,
    url: `${SITE_URL}/product/${p.id}`, brand: { "@type": "Brand", name: "Arty Affairs" },
    aggregateRating: { "@type": "AggregateRating", ratingValue: p.rating, reviewCount: p.reviewCount },
    offers: { "@type": "Offer", priceCurrency: "INR", price: p.price,
      availability: p.stock === 0 ? "https://schema.org/OutOfStock" : p.availability === "ready" ? "https://schema.org/InStock" : "https://schema.org/PreOrder" },
  };

  return (
    <main id="main">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <div className="container">
        <nav className="breadcrumbs" aria-label="Breadcrumb" style={{ paddingTop: "var(--space-5)" }}>
          <ol><li><Link href="/">Home</Link></li><li><Link href="/shop">Shop</Link></li><li aria-current="page">{p.name}</li></ol>
        </nav>
        <div className="pdp">
          <ProductGallery product={p} />
          <ProductBuy product={p} upsells={upsells} />
        </div>
      </div>

      <section className="section" id="reviews" aria-labelledby="rv-title">
        <div className="container">
          <div className="section-head section-head--split">
            <div className="stack"><span className="eyebrow">Reviews &amp; photos</span><h2 id="rv-title">What gift-givers said</h2></div>
            <div className="rating-summary"><strong>{p.rating.toFixed(1)}</strong>
              <span><span className="stars">{Array.from({ length: 5 }, (_, k) => <Icon key={k} name="star" className="" />)}</span><br />
                <span className="muted" style={{ fontSize: "var(--text-sm)" }}>{p.reviewCount} reviews</span></span></div>
          </div>
          <div className="reviews">{productReviews.map((r, i) => <ReviewCard key={r.name} r={r} i={i} />)}</div>
          <p style={{ marginTop: "var(--space-5)" }}>
            <a className="link-arrow" href={waLink("Hi Arty Affairs! Here's a photo of the gift I received from you:")} target="_blank" rel="noopener"><span>Share your photo on WhatsApp</span><Icon name="arrow" className="" /></a>
          </p>
        </div>
      </section>

      <section className="section section--surface" aria-labelledby="also-title">
        <div className="container">
          <div className="section-head"><span className="eyebrow">Customers also loved</span><h2 id="also-title">Pairs beautifully with</h2></div>
          <div className="rail">{also.map((x, i) => <ProductCard key={x.id} p={x} i={i} />)}</div>
        </div>
      </section>
    </main>
  );
}
