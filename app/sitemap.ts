import type { MetadataRoute } from "next";
import { products, SITE_URL } from "@/lib/data";

const PAGES = ["", "/shop", "/hamper", "/wedding", "/workshops", "/commissions", "/corporate", "/gallery", "/about", "/reviews", "/faq", "/shipping"];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...PAGES.map((p) => ({ url: `${SITE_URL}${p}`, changeFrequency: "weekly" as const, priority: p === "" ? 1 : 0.7 })),
    ...products.map((p) => ({ url: `${SITE_URL}/product/${p.id}`, changeFrequency: "weekly" as const, priority: 0.8 })),
  ];
}
