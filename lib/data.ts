/* Content lives in /data/*.json and is edited by the owner through /admin (Decap CMS).
 * Every edit commits to the repo, and the next build/deploy picks it up. */
import productsJson from "@/data/products.json";
import workshopsJson from "@/data/workshops.json";
import reviewsJson from "@/data/reviews.json";
import type { Product, Review, Workshop } from "./types";
export { site, waLink } from "./site";

export const products = productsJson.products as Product[];
export const workshops = workshopsJson.workshops as Workshop[];
export const reviews = reviewsJson.reviews as Review[];

export const getProduct = (id: string) => products.find((p) => p.id === id);

export const OCCASIONS: Record<string, string> = {
  wedding: "Wedding & Nikah", anniversary: "Anniversary", birthday: "Birthday", eid: "Eid",
  diwali: "Diwali", corporate: "Corporate", housewarming: "Housewarming", newborn: "New baby",
};

export const CATEGORIES: Record<string, string> = {
  calligraphy: "Arabic calligraphy", paintings: "Paintings & name canvases", resin: "Resin art & decor",
  hampers: "Gift hampers", nikah: "Nikah pens & sets", stationery: "Diaries, letters & cards", flowers: "Bouquets",
};

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://artyaffairs.in";
