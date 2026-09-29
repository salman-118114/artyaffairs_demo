/* Site settings only — safe to import from client components without pulling in the catalogue. */
import siteJson from "@/data/site.json";
import type { SiteSettings } from "./types";

export const site = siteJson as SiteSettings;

export const waLink = (msg: string, number = site.whatsapp) =>
  `https://wa.me/${number}?text=${encodeURIComponent(msg)}`;
