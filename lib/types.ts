export type ArtType =
  | "calligraphy" | "roundel" | "name" | "abstract" | "resin" | "coasters" | "pen"
  | "hamper" | "diary" | "letter" | "bouquet" | "card" | "kintsugi" | "diya";
export type Tone = "emerald" | "ivory" | "cream" | "blush" | "gold";

export interface ArtSpec {
  type: ArtType | string;
  tone?: Tone | string;
  text?: string;
  arabic?: string;
  seed?: string;
  label?: string;
}

export type PersonalizeField = "name" | "date" | "wording" | "letter";

export interface Product {
  id: string;
  name: string;
  category: string;
  occasions: string[];
  price: number;
  availability: "ready" | "made";
  leadDays: number;
  stock: number | null;
  badge: string | null;
  bestseller: boolean;
  rating: number;
  reviewCount: number;
  art: ArtSpec;
  images: string[];
  short: string;
  description: string;
  sizes: { label: string; add: number }[];
  personalize: PersonalizeField[];
}

export interface Workshop {
  id: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  price: number;
  seats: number;
  seatsLeft: number;
  level: string;
  art: string;
  blurb: string;
  includes: string;
}

export interface Review {
  name: string;
  city: string;
  product: string;
  rating: number;
  text: string;
  photo: string;
}

export type Currency = "INR" | "USD" | "AED" | "GBP";

export interface SiteSettings {
  whatsapp: string;
  instagram: string;
  email: string;
  city: string;
  banner: { active: boolean; theme: string; text: string; link: string; cta: string };
  rates: Record<Currency, number>;
  firstOrderCode: string;
  eventOffer: { code: string; percent: number; event: string; until: string };
}

export interface BagItem {
  key: string;
  id: string;
  name: string;
  price: number;
  qty: number;
  options: Record<string, string>;
  art?: ArtSpec;
}
