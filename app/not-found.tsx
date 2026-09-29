import Link from "next/link";
import { ArtFrame } from "@/components/Art";

export default function NotFound() {
  return (
    <main id="main">
      <div className="container" style={{ paddingBlock: "var(--section)" }}>
        <div className="empty">
          <ArtFrame className="frame frame--arch ratio-45" style={{ width: "min(16rem, 70vw)" }} spec={{ type: "kintsugi", tone: "emerald", seed: "404", label: "A bowl mended with gold" }} />
          <h1 style={{ fontSize: "var(--text-2xl)" }}>This page is <em>broken</em>, beautifully.</h1>
          <p className="muted">The link may have moved. Let’s mend it with something handmade instead.</p>
          <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap", justifyContent: "center" }}>
            <Link className="btn" href="/shop">Browse the shop</Link>
            <Link className="btn btn--outline" href="/">Back home</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
