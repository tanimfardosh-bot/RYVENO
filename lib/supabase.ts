import { createClient } from "@supabase/supabase-js";

/**
 * SUPABASE INTEGRATION (integration-ready)
 * ---------------------------------------------------------------
 * The storefront ships with a local-first demo backend (localStorage)
 * so it runs with zero configuration. To switch to Supabase:
 *
 *  1. Copy .env.example -> .env.local
 *  2. Fill in NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
 *  3. Run the SQL schema in supabase/schema.sql
 *  4. Set NEXT_PUBLIC_USE_SUPABASE=true
 *  5. Swap the localStorage calls in lib/store.tsx for the helpers below.
 *
 * Recommended tables: products, profiles, orders, order_items, coupons,
 * reviews, banners, categories. Enable RLS and add policies for customers
 * (select own orders) and admins (full access via a role claim).
 */
const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const supabaseEnabled =
  process.env.NEXT_PUBLIC_USE_SUPABASE === "true" && Boolean(url && anonKey);

export const supabase = supabaseEnabled
  ? createClient(url, anonKey, {
      auth: { persistSession: true, autoRefreshToken: true },
    })
  : null;

// SSLCommerz: store store_id / store_passwd in server-side env vars only.
// Never expose the store password to the browser. Create an API route at
// app/api/payment/sslcommerz/route.ts that initialises a session and returns
// the GatewayPageURL, then verify the IPN callback server-side.
export const paymentConfig = {
  bkash: {
    enabled: Boolean(process.env.NEXT_PUBLIC_BKASH_ENABLED),
    merchantNumber: process.env.NEXT_PUBLIC_BKASH_NUMBER ?? "+880 1700-000000",
  },
  nagad: {
    enabled: Boolean(process.env.NEXT_PUBLIC_NAGAD_ENABLED),
    merchantNumber: process.env.NEXT_PUBLIC_NAGAD_NUMBER ?? "+880 1800-000000",
  },
  sslcommerz: {
    enabled: Boolean(process.env.NEXT_PUBLIC_SSLCOMMERZ_ENABLED),
    storeId: process.env.SSLCOMMERZ_STORE_ID ?? "",
    environment: process.env.SSLCOMMERZ_ENVIRONMENT ?? "sandbox",
  },
};

export const storeContact = {
  whatsapp: "+8801700000000",
  email: "hello@ryveno.com",
  phone: "+880 2 0000 0000",
  address: "House 00, Road 00, Dhaka 1200, Bangladesh",
  facebook: "https://facebook.com/ryveno",
  instagram: "https://instagram.com/ryveno",
};
