# Arty Affairs

Storefront for Arty Affairs, a handmade art and gifting studio in Hyderabad.
**Create. Curate. Celebrate.**

Next.js 16 (App Router, TypeScript), React 19, [Motion](https://motion.dev) for scroll and
interaction animation. Pages are pre-rendered at build time from the JSON files in `data/`.

## Run locally
```bash
npm install
npm run dev              # http://localhost:3000
```

## Deploy on Dokploy
1. Push this repo to GitHub/GitLab.
2. Dokploy → **Create Service → Application** → connect the repo and branch.
3. **Build type:** Dockerfile · **Dockerfile path:** `Dockerfile` · **Context:** `.`
4. **Build arguments:** `NEXT_PUBLIC_SITE_URL=https://your-domain`
5. **Environment:** `INQUIRY_WEBHOOK_URL=…` (optional, see below)
6. **Domains:** add your domain, **container port 3000**, enable HTTPS.
7. Deploy. Turn on auto-deploy so content edits from `/admin` publish on their own.

## Structure
| Path | What |
|---|---|
| `app/` | Routes: `/`, `/shop`, `/product/[id]`, `/hamper`, `/checkout`, `/wedding`, `/workshops`, `/commissions`, `/corporate`, `/gallery`, `/about`, `/reviews`, `/faq`, `/shipping`, `/event`, plus `sitemap.xml`, `robots.txt`, `api/inquiry` |
| `app/tokens.css` | Design tokens: colour, type, spacing, motion |
| `app/site.css`, `app/sections.css` | Components; section layouts and motion states |
| `components/motion/` | Split-text headlines, marquee, hover-preview list, pinned horizontal rail, scrollytelling steps, stacked cards, scrubbed statement, testimonial slider, parallax, magnetic button, scroll-drawn seam |
| `components/` | Header/drawers, footer, cards, artwork, forms, `StoreProvider` (bag, currency, toast) |
| `lib/` | Data loading, types, price formatting, artwork engine (placeholder art until photos are uploaded) |
| `data/` | Products, workshops, reviews, site settings (banner, WhatsApp number, currency rates, offers) |
| `public/admin/` | Decap CMS so the owner can edit `data/` without code |

## Motion & accessibility
All animation respects **prefers-reduced-motion** (Motion's `reducedMotion="user"` plus CSS
media queries). Hidden start states only apply once JavaScript is running, so content is never
stuck invisible. Animations use transform, opacity and clip-path only.

## Environment
| Variable | When | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | build | Canonical links, sitemap, structured data |
| `INQUIRY_WEBHOOK_URL` | runtime | Forward form submissions; without it they go to the server log |

## Before launch
- Set the real WhatsApp number in `data/site.json`.
- Payments are simulated (`app/checkout/CheckoutClient.tsx → startPayment`). Add a server route that creates a Razorpay order, then open Razorpay Checkout.
- Replace sample reviews, founder story, event history and shipping rates.
- `/admin` uses Netlify Identity by default; on Dokploy switch `public/admin/config.yml` to the `github` backend with an OAuth provider.
