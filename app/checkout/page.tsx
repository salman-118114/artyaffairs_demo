import type { Metadata } from "next";
import { Icon } from "@/components/Icon";
import { site } from "@/lib/data";
import { CheckoutClient } from "./CheckoutClient";
import { SplitText } from "@/components/motion/SplitText";

export const metadata: Metadata = { title: "Checkout", robots: { index: false } };

export default function CheckoutPage() {
  return (
    <main id="main">
      <div className="container" style={{ paddingBottom: "var(--section)" }}>
        <header className="page-head" style={{ paddingBottom: "var(--space-4)" }}>
          <SplitText as="h1" style={{ fontSize: "var(--text-2xl)" }} text="Checkout" />
          <p className="muted"><Icon name="lock" /> Secure payment. Three short steps.</p>
        </header>
        <CheckoutClient firstOrderCode={site.firstOrderCode} eventOffer={site.eventOffer} />
      </div>
    </main>
  );
}
