import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ProductCard } from "@/components/Cards";
import { products } from "@/lib/data";
import { ShopClient } from "./ShopClient";
import { SplitText } from "@/components/motion/SplitText";

export const metadata: Metadata = {
  title: "Shop Custom Gifts Hyderabad | Calligraphy, Resin Art, Hampers",
  description: "Shop handmade custom gifts from Hyderabad: Arabic calligraphy paintings, resin trays and coasters, nikah pens, gift hampers, name canvases and diaries. Ready to ship or made to order.",
  alternates: { canonical: "/shop" },
};

export default function ShopPage() {
  return (
    <main id="main">
      <div className="container">
        <header className="page-head">
          <nav className="breadcrumbs" aria-label="Breadcrumb"><ol><li><Link href="/">Home</Link></li><li aria-current="page">Shop</li></ol></nav>
          <SplitText as="h1" id="shop-title" text="The *shop*" />
          <p className="lede">Every piece is painted, poured or packed by hand in Hyderabad. <b>Ready to ship</b> pieces leave the studio in 1–2 days; <b>made to order</b> pieces are created for you.</p>
        </header>
        {/* The full catalogue renders on the server (for search engines and no-JS); filters take over in the browser. */}
        <Suspense fallback={<div className="products" style={{ paddingBottom: "var(--section)" }}>{products.map((p, i) => <ProductCard key={p.id} p={p} i={i} />)}</div>}>
          <ShopClient products={products} />
        </Suspense>
      </div>
    </main>
  );
}
