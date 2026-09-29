import type { Metadata, Viewport } from "next";
import { Aref_Ruqaa, Cormorant_Garamond, Hanken_Grotesk, Marcellus } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { Reveal } from "@/components/Reveal";
import { StoreProvider } from "@/components/StoreProvider";
import { SITE_URL, site } from "@/lib/data";
import "./tokens.css";
import "./site.css";
import "./sections.css";

const marcellus = Marcellus({ subsets: ["latin"], weight: "400", variable: "--font-marcellus", display: "swap" });
const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["400", "500"], style: ["italic"], variable: "--font-cormorant", display: "swap" });
const hanken = Hanken_Grotesk({ subsets: ["latin"], weight: ["300", "400", "500", "600"], variable: "--font-hanken", display: "swap" });
const aref = Aref_Ruqaa({ subsets: ["arabic", "latin"], weight: ["400", "700"], variable: "--font-aref", display: "swap", preload: false });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Arty Affairs | Custom Gifts, Arabic Calligraphy & Gift Hampers in Hyderabad",
    template: "%s | Arty Affairs",
  },
  description: "Handmade custom gifts from Hyderabad: Arabic calligraphy paintings, resin art, nikah pens, personalised name canvases and gift hampers for weddings, Eid, Diwali and birthdays. Shipped worldwide.",
  openGraph: { type: "website", siteName: "Arty Affairs", title: "Arty Affairs: Create. Curate. Celebrate.", description: "Handmade art and custom gifting from Hyderabad, shipped worldwide." },
  icons: { icon: "/icon.svg" },
};

export const viewport: Viewport = { themeColor: "#0B3B2E", width: "device-width", initialScale: 1, viewportFit: "cover" };

const storeLd = {
  "@context": "https://schema.org", "@type": "Store", name: "Arty Affairs", slogan: "Create. Curate. Celebrate.",
  description: "Handmade art studio and gift shop in Hyderabad: Arabic calligraphy paintings, resin art, nikah pens, custom gift hampers and art workshops.",
  url: SITE_URL,
  address: { "@type": "PostalAddress", addressLocality: "Hyderabad", addressRegion: "Telangana", addressCountry: "IN" },
  areaServed: ["Hyderabad", "India", "United Arab Emirates", "United Kingdom", "United States"],
  sameAs: [`https://instagram.com/${site.instagram}`],
  knowsAbout: ["custom gifts Hyderabad", "nikah pen", "gift hampers Hyderabad", "Arabic calligraphy painting", "resin art", "kintsugi workshop"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${marcellus.variable} ${cormorant.variable} ${hanken.variable} ${aref.variable}`} suppressHydrationWarning>
      <head>
        {/* Marks JS as available before paint, so scroll reveals never hide content for no-JS visitors. */}
        <script dangerouslySetInnerHTML={{ __html: 'document.documentElement.classList.add("js")' }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(storeLd) }} />
      </head>
      <body>
        <MotionProvider>
          <StoreProvider rates={site.rates}>
            <Header site={site} />
            {children}
            <Footer site={site} />
            <Reveal />
          </StoreProvider>
        </MotionProvider>
      </body>
    </html>
  );
}
