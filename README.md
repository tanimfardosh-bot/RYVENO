# RYVENO — Wear Your Identity

A complete, premium fashion e-commerce platform for a Bangladeshi fashion brand. Built with **Next.js 14 (App Router), React 18, TypeScript and Tailwind CSS**, with a local-first demo backend that runs with zero configuration and an integration-ready Supabase layer.

---

## Quick start

This project includes a portable Node.js runtime in `.tools/` so it works even if Node is not installed system-wide.

```powershell
# from the project root
$env:PATH = "$PWD\.tools\node-v20.18.1-win-x64;" + $env:PATH
npm install
npm run dev
```

Open **http://localhost:3000**.

To use your own Node installation instead, just make sure `node` and `npm` are on your PATH and run `npm run dev`.

Production build:

```powershell
npm run build
npm start
```

---

## Using your photo as the campaign model

Drop your portrait into:

```
public/models/pose.jpg
```

The homepage hero and brand-story sections automatically use it. If the file is missing, a curated editorial photograph is shown instead. No code changes needed. See `public/models/README.md`.

---

## What's included

### Storefront (24 pages)
- Home (11 sections: announcement, sticky header + mega menus, **5-slide editorial campaign slider**, categories, new arrivals, best sellers, editorial, brand story, reviews, newsletter, footer)
  - Slider autoplays every 5s, with fade + horizontal slide animations, side arrows, progress pagination, touch swipe and keyboard navigation
  - Slide copy, images and CTAs are centralised in `lib/slides.ts`
  - Your campaign portraits live in `public/models/` (`pose.jpg`, `pose-1.jpg`, `pose-2.jpg`)
- Men, Women, New Arrivals, Best Sellers, T-Shirts, Shirts, Jeans & Trousers, Hoodies & Sweatshirts, Accessories, Dresses & Kurtis, Outerwear, Sale
- Product details (gallery + zoom, size guide modal, colours, sizes, quantity, add to cart, buy now, wishlist, delivery/returns, reviews, related products, Product JSON-LD)
- Cart (quantities, remove, coupon codes, shipping estimate, totals)
- Checkout (Bangladesh divisions/districts/area, COD / bKash / Nagad / SSLCommerz-ready)
- Order confirmation + tracking with timeline
- Login / register, My Account, Wishlist, Search
- About, Contact, FAQ, Shipping, Returns, Privacy, Terms

### Admin dashboard (`/admin`)
Demo credentials: **admin@ryveno.com / admin123** (or click *Enter Admin Demo*).
- Overview with sales, orders, customers, product stats and charts
- Product management: add, edit, delete, image upload / library picker, stock
- Order management with status updates and detail view
- Customers, coupons, reviews moderation, homepage banners, analytics

### Bangladesh-specific
BDT currency (৳), +880 phone format, Dhaka vs outside-Dhaka delivery, nationwide reach, COD, bKash, Nagad, SSLCommerz architecture, WhatsApp support, order tracking, Bengali/English-ready structure.

### UX / technical
- Fully responsive, mobile-first navigation and drawers
- Working search, filters (category/size/colour/price) and sorting
- Cart + wishlist persisted in localStorage
- Toast notifications, scroll reveals, hover transitions, image zoom
- Semantic HTML, SEO metadata, Open Graph, structured data, accessible labels
- All imagery is stored locally in `public/images/` — no broken external links

---

## Configuration / external credentials

Copy `.env.example` to `.env.local`. The site works without any of these — they are for going live.

| Integration | Where to configure |
|---|---|
| Supabase DB + Auth | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_USE_SUPABASE=true`, then run `supabase/schema.sql`. Swap the localStorage calls in `lib/store.tsx` for the helpers in `lib/supabase.ts`. |
| bKash | `NEXT_PUBLIC_BKASH_ENABLED`, `NEXT_PUBLIC_BKASH_NUMBER` + merchant API keys server-side |
| Nagad | `NEXT_PUBLIC_NAGAD_ENABLED`, `NEXT_PUBLIC_NAGAD_NUMBER` + merchant API keys server-side |
| SSLCommerz | `SSLCOMMERZ_STORE_ID`, `SSLCOMMERZ_STORE_PASSWORD` (server-side only), `SSLCOMMERZ_ENVIRONMENT`. Create `app/api/payment/sslcommerz/route.ts` to initialise a session and verify the IPN callback. |
| Contact details | `lib/supabase.ts` → `storeContact` (WhatsApp, email, phone, social links) |
| Coupons / reviews / banners | Seeded in `lib/data.ts`; editable at runtime via the admin dashboard |

> **Never expose secret keys** (Supabase service role, SSLCommerz store password, bKash/Nagad secrets) in `NEXT_PUBLIC_*` variables.

---

## Project structure

```
app/
  (store)/               # Storefront route group (header/footer shell)
    page.tsx             # Homepage
    collections/[slug]/  # All collection/listing pages
    product/[slug]/      # Product detail
    cart, checkout, order-confirmation, order-tracking
    login, account, wishlist, search
    about, contact, faq, policies/[slug]
  admin/                 # Separate admin shell (no storefront header/footer)
  api/payment/sslcommerz/ # Integration-ready payment endpoint
components/              # Header, Footer, ProductCard, CartDrawer, etc.
lib/                     # types, products, data, store, supabase, i18n (BN/EN scaffold)
public/images/           # Locally stored fashion photography
public/models/           # Drop your photo here
supabase/schema.sql      # Database schema + RLS policies
scripts/download-images.ps1  # Re-fetch the curated image set
```

---

## Demo notes

- State (cart, wishlist, orders, products, coupons, reviews, banners, users) persists in `localStorage` under the `ryveno:v1:` prefix. Clear site data to reset the demo.
- Product data is realistic demo content in `lib/products.ts` — replace with your catalogue or connect Supabase.
- All buttons and flows are functional in demo mode. Payment providers are integration-ready scaffolds rather than live transactions.
