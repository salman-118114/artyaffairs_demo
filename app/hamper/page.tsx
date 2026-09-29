import type { Metadata } from "next";
import Link from "next/link";
import { HamperBuilder } from "./HamperBuilder";
import { SplitText } from "@/components/motion/SplitText";

export const metadata: Metadata = {
  title: "Build Your Own Gift Hamper | Gift Hampers Hyderabad",
  description: "Build a personalised gift hamper in Hyderabad: choose a box, add handmade pieces, add names and a handwritten note. Live pricing, delivered across India and worldwide.",
  alternates: { canonical: "/hamper" },
};

export default function HamperPage() {
  return (
    <main id="main">
      <div className="container">
        <header className="page-head">
          <nav className="breadcrumbs" aria-label="Breadcrumb"><ol><li><Link href="/">Home</Link></li><li aria-current="page">Build a hamper</li></ol></nav>
          <SplitText as="h1" text="Build your *hamper*" />
          <p className="lede">Five short steps. The price updates as you go, and nothing is charged until checkout.</p>
        </header>
        <HamperBuilder />
      </div>
    </main>
  );
}
