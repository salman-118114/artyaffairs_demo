import Image from "next/image";
import type { CSSProperties, ElementType } from "react";
import { artSvg, seamSvg } from "@/lib/art";
import type { ArtSpec, Product } from "@/lib/types";

type FrameProps = { spec: ArtSpec; className?: string; style?: CSSProperties; as?: ElementType; children?: React.ReactNode };

/** A frame filled with generated artwork. Children render before the art (e.g. badges). */
export function ArtFrame({ spec, className = "frame", style, as: Tag = "div", children }: FrameProps) {
  return (
    <Tag className={className} style={style}>
      {children}
      <ArtSvg spec={spec} />
    </Tag>
  );
}

/** Bare SVG artwork (fills its parent). */
export function ArtSvg({ spec }: { spec: ArtSpec }) {
  return <span className="art-fill" dangerouslySetInnerHTML={{ __html: artSvg(spec) }} />;
}

/** Product image: the uploaded photo when present, otherwise generated artwork. */
export function ProductMedia({ product, index = 0, alt, priority = false }: { product: Product; index?: number; alt?: string; priority?: boolean }) {
  const label = alt ?? product.name;
  if (product.images?.length) {
    return (
      <Image src={product.images[Math.min(index, product.images.length - 1)]} alt={label} width={800} height={1000}
        sizes="(min-width: 56rem) 33vw, 50vw" priority={priority} />
    );
  }
  return <ArtSvg spec={{ ...product.art, seed: product.id + (index ? index : ""), label }} />;
}

/** Gold kintsugi divider; draws itself in when scrolled into view (see <Reveal />). */
export function Seam({ seed, variant, style }: { seed: string; variant?: "dark" | "surface"; style?: CSSProperties }) {
  return (
    <div className={`seam${variant ? ` seam--${variant}` : ""}`} aria-hidden="true" style={style}
      dangerouslySetInnerHTML={{ __html: seamSvg(seed) }} />
  );
}
