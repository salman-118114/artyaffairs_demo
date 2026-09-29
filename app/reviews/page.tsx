import type { Metadata } from "next";
import Link from "next/link";
import { ReviewCard } from "@/components/Cards";
import { Icon } from "@/components/Icon";
import { reviews, waLink } from "@/lib/data";
import { SplitText } from "@/components/motion/SplitText";

export const metadata: Metadata = {
  title: "Customer Reviews & Photos",
  description: "Reviews and customer photos of Arty Affairs nikah pens, calligraphy paintings, gift hampers and workshops, from Hyderabad, Dubai, London and beyond.",
  alternates: { canonical: "/reviews" },
};

export default function ReviewsPage() {
  const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
  return (
    <main id="main">
      <div className="container">
        <header className="page-head">
          <nav className="breadcrumbs" aria-label="Breadcrumb"><ol><li><Link href="/">Home</Link></li><li aria-current="page">Reviews</li></ol></nav>
          <SplitText as="h1" text="Kind words, *real* *photos*" />
          <div className="rating-summary"><strong>{avg.toFixed(1)}</strong>
            <span><span className="stars" role="img" aria-label={`Average ${avg.toFixed(1)} out of 5`}>{Array.from({ length: 5 }, (_, k) => <Icon key={k} name="star" className="" />)}</span><br />
              <span className="muted" style={{ fontSize: "var(--text-sm)" }}>Average across verified orders</span></span></div>
        </header>
        <div className="reviews reviews--3" style={{ paddingBottom: "var(--space-7)" }}>{reviews.map((r, i) => <ReviewCard key={r.name} r={r} i={i} />)}</div>
        <div className="reminder" style={{ marginBottom: "var(--section)" }}>
          <div className="stack"><span className="eyebrow">Gifted something from us?</span><h2 style={{ fontSize: "var(--text-xl)" }}>Send us a photo of it in its new home.</h2></div>
          <div><a className="btn btn--wa" href={waLink("Hi Arty Affairs! Here's a photo and a few words about my order:")} target="_blank" rel="noopener"><Icon name="wa" className="" /> Share on WhatsApp</a></div>
        </div>
      </div>
    </main>
  );
}
