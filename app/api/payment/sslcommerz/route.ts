import { NextResponse } from "next/server";

/**
 * SSLCommerz integration-ready endpoint.
 *
 * To go live:
 *  1. Add SSLCOMMERZ_STORE_ID and SSLCOMMERZ_STORE_PASSWORD to .env.local
 *     (server-side only — never use NEXT_PUBLIC_ for the password).
 *  2. POST the order payload here. Replace the stub below with a server-side
 *     call to https://sandbox.sslcommerz.com/gwprocess/v4/api.php
 *     (or the live host) using `store_id`, `store_passwd`, `total_amount`,
 *     `currency=BDT`, `tran_id`, `success_url`, `fail_url`, `cancel_url`,
 *     `ipn_url`, and customer fields.
 *  3. Return the `GatewayPageURL` to the client for redirection.
 *  4. Verify the IPN callback server-side (validate_order / hash check)
 *     before marking the order as paid.
 */
export async function POST(request: Request) {
  let payload: Record<string, unknown> = {};
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  const storeId = process.env.SSLCOMMERZ_STORE_ID;
  const storePassword = process.env.SSLCOMMERZ_STORE_PASSWORD;

  if (!storeId || !storePassword) {
    return NextResponse.json(
      {
        configured: false,
        message:
          "SSLCommerz is in demo mode. Add SSLCOMMERZ_STORE_ID and SSLCOMMERZ_STORE_PASSWORD to .env.local, then wire the gateway call in app/api/payment/sslcommerz/route.ts.",
        received: {
          amount: payload.amount ?? null,
          currency: "BDT",
          orderId: payload.orderId ?? null,
        },
      },
      { status: 200 },
    );
  }

  // Real integration goes here. Never return store_passwd to the browser.
  return NextResponse.json({
    configured: true,
    message: "Credentials detected. Implement the gateway session call here.",
    environment: process.env.SSLCOMMERZ_ENVIRONMENT ?? "sandbox",
  });
}
