import type { Currency } from "./types";

export const CURRENCIES: Record<Currency, string> = { INR: "en-IN", USD: "en-US", AED: "en-AE", GBP: "en-GB" };

export function formatPrice(inr: number, cur: Currency, rates: Record<Currency, number>): string {
  const v = inr * (rates[cur] ?? 1);
  const whole = cur === "INR";
  return new Intl.NumberFormat(CURRENCIES[cur] || "en-IN", {
    style: "currency", currency: cur, maximumFractionDigits: whole ? 0 : 2, minimumFractionDigits: whole ? 0 : 2,
  }).format(v);
}

export const isoDate = (d: Date) => d.toISOString().slice(0, 10);

export const addDays = (days: number) => { const d = new Date(); d.setDate(d.getDate() + days); return d; };

export const shortDate = (iso: string, opts: Intl.DateTimeFormatOptions = { weekday: "short", day: "numeric", month: "short" }) =>
  new Date(iso + "T00:00:00").toLocaleDateString("en-IN", opts);
