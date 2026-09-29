"use client";

import { useRef, useState } from "react";
import { ProductMedia } from "@/components/Art";
import type { Product } from "@/lib/types";

/** Swipeable gallery on phones, thumbnails everywhere. Three generated views until photos are uploaded. */
export function ProductGallery({ product: p }: { product: Product }) {
  const views = p.images.length ? p.images.map((_, i) => i) : [0, 1, 2];
  const track = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);

  const go = (i: number) => {
    const t = track.current; if (!t) return;
    t.scrollTo({ left: t.clientWidth * i, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  };

  return (
    <div className="gallery">
      <div className="gallery-main" ref={track} tabIndex={0} aria-label="Product images, swipe for more"
        onScroll={(e) => setCurrent(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))}>
        {views.map((i) => (
          <div className="frame" key={i}><ProductMedia product={p} index={i} priority={i === 0} alt={`${p.name}, view ${i + 1} of ${views.length}`} /></div>
        ))}
      </div>
      <div className="gallery-thumbs">
        {views.map((i) => (
          <button type="button" key={i} aria-label={`Show view ${i + 1}`} aria-current={current === i} onClick={() => go(i)}>
            <ProductMedia product={p} index={i} alt="" />
          </button>
        ))}
      </div>
    </div>
  );
}
