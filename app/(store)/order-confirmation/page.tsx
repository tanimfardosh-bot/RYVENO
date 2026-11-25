"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Check, Copy, MessageCircle, Package } from "lucide-react";
import { useStore } from "@/lib/store";
import { formatBDT, formatDate } from "@/lib/format";
import type { Order } from "@/lib/types";
import { useToast } from "@/components/Toast";

export default function OrderConfirmationPage() {
  const { orders } = useStore();
  const { notify } = useToast();
  const [id, setId] = useState("");

  useEffect(() => {
    setId(new URLSearchParams(window.location.search).get("order") ?? "");
  }, []);

  const order: Order | undefined = orders.find((o) => o.id === id) ?? orders[0];

  if (!order) {
    return (
      <div className="site-container flex min-h-[60vh] flex-col items-center justify-center text-center">
        <h1 className="font-display text-3xl font-bold">No order found</h1>
        <p className="mt-3 text-sm text-neutral-500">Your order details will appear here after checkout.</p>
        <Link href="/collections/all" className="btn-dark mt-7">Continue Shopping</Link>
      </div>
    );
  }

  const paymentLabel: Record<string, string> = { cod: "Cash on Delivery", bkash: "bKash", nagad: "Nagad", sslcommerz: "Card / SSLCommerz" };

  return (
    <div className="site-container py-12 lg:py-16">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-50 text-green-700"><Check size={36} strokeWidth={1.5} /></div>
          <p className="eyebrow mt-7">Order Confirmed</p>
          <h1 className="mt-3 font-display text-3xl font-extrabold uppercase tracking-tight sm:text-4xl">Thank you for shopping with RYVENO.</h1>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-neutral-600">Your order has been received. Our team will call {order.address.phone} shortly to confirm the details before dispatch.</p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <InfoBox label="Order Number" value={order.id.toUpperCase().slice(0, 12)} />
          <InfoBox label="Tracking Number" value={order.trackingNumber} copy={() => { navigator.clipboard?.writeText(order.trackingNumber); notify("Tracking number copied."); }} />
          <InfoBox label="Order Date" value={formatDate(order.createdAt)} />
        </div>

        <div className="mt-6 border border-neutral-200">
          <div className="flex items-center gap-2 border-b border-neutral-200 bg-cream px-6 py-4">
            <Package size={17} className="text-sand" /><h2 className="text-sm font-bold uppercase tracking-wide">Order Details</h2>
          </div>
          <div className="divide-y divide-neutral-100 px-6">
            {order.lines.map((l) => (
              <div key={l.key} className="flex items-center gap-4 py-4">
                <img src={l.image} alt="" className="h-16 w-14 object-cover" />
                <div className="flex-1"><p className="text-[13px] font-bold">{l.name}</p><p className="mt-1 text-[11px] text-neutral-500">{l.size} · {l.color} · Qty {l.quantity}</p></div>
                <span className="text-sm font-bold">{formatBDT(l.price * l.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="space-y-2 border-t border-neutral-200 px-6 py-5 text-sm">
            <div className="flex justify-between"><span className="text-neutral-600">Subtotal</span><span>{formatBDT(order.subtotal)}</span></div>
            <div className="flex justify-between"><span className="text-neutral-600">Delivery</span><span>{order.shipping === 0 ? "Free" : formatBDT(order.shipping)}</span></div>
            {order.discount > 0 && <div className="flex justify-between text-[#a4343f]"><span>Discount</span><span>−{formatBDT(order.discount)}</span></div>}
            <div className="flex justify-between border-t border-neutral-200 pt-3 text-base font-bold"><span>Total</span><span>{formatBDT(order.total)}</span></div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="border border-neutral-200 p-5">
            <p className="text-[10px] font-bold uppercase tracking-wide2 text-sand">Delivery To</p>
            <p className="mt-3 text-[13px] font-bold">{order.address.fullName}</p>
            <p className="mt-1 text-xs leading-relaxed text-neutral-600">{order.address.address}, {order.address.area}, {order.address.district}, {order.address.division}</p>
            <p className="mt-2 text-xs text-neutral-500">{order.address.phone}</p>
          </div>
          <div className="border border-neutral-200 p-5">
            <p className="text-[10px] font-bold uppercase tracking-wide2 text-sand">Payment</p>
            <p className="mt-3 text-[13px] font-bold">{paymentLabel[order.payment] ?? order.payment}</p>
            <p className="mt-1 text-xs text-neutral-600">{order.payment === "cod" ? "Pay in cash when your parcel arrives." : "Payment details recorded with your order."}</p>
            <a href={`https://wa.me/8801700000000?text=${encodeURIComponent(`Hi RYVENO, I need help with order ${order.trackingNumber}`)}`} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide2 text-green-700 hover:underline"><MessageCircle size={14} /> WhatsApp Support</a>
          </div>
        </div>

        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Link href={`/order-tracking?order=${order.trackingNumber}`} className="btn-dark">Track Your Order</Link>
          <Link href="/collections/all" className="btn-outline">Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
}

function InfoBox({ label, value, copy }: { label: string; value: string; copy?: () => void }) {
  return (
    <div className="border border-neutral-200 bg-cream p-5 text-center">
      <p className="text-[10px] font-bold uppercase tracking-wide2 text-neutral-500">{label}</p>
      <div className="mt-2 flex items-center justify-center gap-2">
        <p className="font-display text-base font-extrabold">{value}</p>
        {copy && <button onClick={copy} aria-label="Copy" className="text-neutral-400 hover:text-ink"><Copy size={13} /></button>}
      </div>
    </div>
  );
}
