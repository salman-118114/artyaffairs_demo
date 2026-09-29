# Arty Affairs — storefront

Static HTML/CSS/JS, no build step. Content lives in `data/*.json` and is edited by the owner at `/admin` (Decap CMS).

- Run locally: `npm start` (or `python -m http.server 5173`), open http://localhost:5173
- Edit products, workshops, prices, reviews, festive banner, currency rates, WhatsApp number: `/admin` → see `admin/config.yml` (Netlify Identity + Git Gateway).
- Product photos: add them in the admin; until then each product shows generated on-brand artwork (`assets/js/art.js`).
- Event QR: print a QR to `event.html?src=<event>`; offer text is in `data/site.json → eventOffer`.

## Before launch
- Replace `whatsapp` in `data/site.json` (currently a placeholder 919000000000).
- Payments: `assets/js/checkout.js → startPayment()` is simulated. Create orders server-side, then open Razorpay Checkout (UPI/cards/netbanking; enable International Payments for foreign cards).
- Forms show a success state and a WhatsApp hand-off; connect them to Netlify Forms / Formspree.
- Reviews, founder story and event history are sample copy — replace with real content.
