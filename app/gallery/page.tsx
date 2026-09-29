import type { Metadata } from "next";
import Link from "next/link";
import { Seam } from "@/components/Art";
import { GalleryGrid, type Work } from "./GalleryGrid";
import { SplitText } from "@/components/motion/SplitText";

export const metadata: Metadata = {
  title: "Gallery: Arabic Calligraphy, Resin Art & Paintings",
  description: "A portfolio of original Arabic calligraphy paintings, resin art, kintsugi and wedding commissions by Arty Affairs, Hyderabad.",
  alternates: { canonical: "/gallery" },
};

const WORKS: Work[] = [
  { type: "abstract", tone: "emerald", title: "Mended Garden", meta: "Acrylic & gold leaf, 60 × 90 cm", cat: "painting", ratio: "4/5" },
  { type: "calligraphy", tone: "emerald", title: "Bismillah in Thuluth", meta: "Gold leaf on canvas, 45 × 60 cm", cat: "calligraphy", ratio: "3/4", text: "بسم الله" },
  { type: "resin", tone: "emerald", title: "Emerald Tide", meta: "Resin & gold rim, 35 cm", cat: "resin", ratio: "1/1" },
  { type: "pen", tone: "ivory", title: "Nikah pens for Sara & Adil", meta: "Hand-painted, commission", cat: "wedding", ratio: "4/5", text: "Sara &amp; Adil" },
  { type: "roundel", tone: "ivory", title: "Ayat al-Kursi Roundel", meta: "Limited edition of 5, 60 cm", cat: "calligraphy", ratio: "1/1" },
  { type: "kintsugi", tone: "emerald", title: "Golden Repair", meta: "Ceramic & gold, workshop piece", cat: "resin", ratio: "4/3" },
  { type: "name", tone: "cream", title: "Zoya", meta: "Name canvas, nursery commission", cat: "painting", ratio: "3/4", text: "Zoya" },
  { type: "hamper", tone: "emerald", title: "Trousseau for N.", meta: "Six lettered boxes, wedding commission", cat: "wedding", ratio: "4/5" },
  { type: "calligraphy", tone: "emerald", title: "Alhamdulillah", meta: "Diwani script, 30 × 40 cm", cat: "calligraphy", ratio: "4/5", text: "الحمد لله" },
  { type: "coasters", tone: "ivory", title: "Kintsugi Coasters", meta: "Resin, set of four", cat: "resin", ratio: "1/1" },
  { type: "abstract", tone: "emerald", title: "After the Rain", meta: "Acrylic on canvas, 90 × 120 cm", cat: "painting", ratio: "3/4" },
  { type: "resin", tone: "gold", title: "Diya Platter", meta: "Resin & gold, Diwali 2025", cat: "resin", ratio: "4/3" },
  { type: "calligraphy", tone: "emerald", title: "Masha'Allah", meta: "Commission for a new home", cat: "calligraphy", ratio: "3/4", text: "ما شاء الله" },
  { type: "letter", tone: "cream", title: "Letters for a Wedding", meta: "Handwritten, wax-sealed", cat: "wedding", ratio: "4/5" },
];

export default function GalleryPage() {
  return (
    <main id="main">
      <div className="container">
        <header className="page-head">
          <nav className="breadcrumbs" aria-label="Breadcrumb"><ol><li><Link href="/">Home</Link></li><li aria-current="page">Gallery</li></ol></nav>
          <SplitText as="h1" text="The *gallery*" />
          <p className="lede">Originals, commissions and pieces that found their homes. Tap any work to see it larger.</p>
        </header>
        <GalleryGrid works={WORKS} />
      </div>
      <section className="cta-band on-dark" aria-labelledby="g-cta">
        <Seam seed="g-cta" variant="dark" />
        <div className="container inner"><span className="eyebrow">Commissions open</span><h2 id="g-cta">Want one made <em>for your wall</em>?</h2>
          <div className="actions"><Link className="btn btn--light" href="/commissions">Start a commission</Link></div></div>
      </section>
    </main>
  );
}
