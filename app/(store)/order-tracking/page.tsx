"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Check, MapPin, Package, Search, Truck } from "lucide-react";
import { useStore } from "@/lib/store";
import { formatBDT, formatDate } from "@/lib/format";
import type { Order } from "@/lib/types";

export default function OrderTrackingPage() {
  const { orders, user } = useStore();
  const [query, setQuery] = useState("");
  const [searched, setSearched] = useState(false);
  const [result, setResult] = useState<Order | undefined>();

  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("order");
    if (q) { setQuery(q); setResult(orders.find((o) => o.trackingNumber.toLowerCase() === q.toLowerCase())); setSearched(true); }
  }, [orders]);

  const search = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim().toLowerCase();
    setResult(orders.find((o) => o.trackingNumber.toLowerCase() === q || o.id.toLowerCase() === q));
    setSearched(true);
  };

  const myOrders = user ? orders.filter((o) => o.userId === user.id) : [];

  return (
    <>
      <section className="relative h-[260px] overflow-hidden bg-ink">
        <img src="/images/lifestyle-2.jpg" alt="" className="absolute inset-0 h-full w-full object-cover opacity-50" />
        <div className="absolute inset-0 bg-black/50" />
        <div className="site-container relative flex h-full flex-col justify-center text-white">
          <p className="text-[11px] font-semibold uppercase tracking-wide2 text-sand">Stay in the loop</p>
          <h1 className="mt-3 font-display text-4xl font-extrabold uppercase tracking-tight sm:text-5xl">Track Your Order</h1>
          <p className="mt-3 max-w-lg text-sm text-white/70">Enter the tracking number from your order confirmation to see exactly where your parcel is.</p>
        </div>
      </section>

      <div className="site-container py-12 lg:py-16">
        <form onSubmit={search} className="mx-auto flex max-w-2xl flex-col gap-3 sm:flex-row">
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Enter tracking number (e.g. RV123456789)" className="field flex-1" />
          <button type="submit" className="btn-dark sm:w-auto"><Search size={15} /> Track Order</button>
        </form>

        {searched && (
          <div className="mx-auto mt-8 max-w-2xl">
            {result ? (
              <OrderCard order={result} />
            ) : (
              <div className="border border-dashed border-neutral-300 p-10 text-center">
                <p className="font-display text-xl font-bold">No order found</p>
                <p className="mt-2 text-sm text-neutral-500">Double-check the tracking number, or log in to see your order history.</p>
                <Link href="/login" className="btn-outline mt-5">Log In</Link>
              </div>
            )}
          </div>
        )}

        {myOrders.length > 0 && (
          <div className="mx-auto mt-14 max-w-4xl">
            <h2 className="font-display text-xl font-bold uppercase">Your Recent Orders</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {myOrders.map((o) => (
                <button key={o.id} onClick={() => { setQuery(o.trackingNumber); setResult(o); setSearched(true); window.scrollTo({ top: 300, behavior: "smooth" }); }} className="flex items-center justify-between border border-neutral-200 p-5 text-left transition-colors hover:border-ink">
                  <div><p className="text-[13px] font-bold">{o.trackingNumber}</p><p className="mt-1 text-xs text-neutral-500">{formatDate(o.createdAt)} · {o.lines.length} item(s)</p></div>
                  <div className="text-right"><p className="text-sm font-bold">{formatBDT(o.total)}</p><p className="mt-1 text-[10px] font-bold uppercase tracking-wide text-sand">{o.status}</p></div>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mx-auto mt-16 grid max-w-4xl gap-4 border-t border-neutral-200 pt-10 sm:grid-cols-3">
          {[
            { icon: Check, t: "Order Confirmed", d: "We call you to confirm size, address and payment." },
            { icon: Package, t: "Packed & Shipped", d: "Your parcel leaves our Dhaka studio with a courier." },
            { icon: MapPin, t: "At Your Door", d: "Delivery across all 64 districts of Bangladesh." },
          ].map(({ icon: Icon, t, d }) => (
            <div key={t} className="text-center"><Icon size={24} strokeWidth={1.3} className="mx-auto text-sand" /><p className="mt-3 text-[13px] font-bold uppercase tracking-wide">{t}</p><p className="mt-1.5 text-xs leading-relaxed text-neutral-500">{d}</p></div>
          ))}
        </div>
      </div>
    </>
  );
}

function OrderCard({ order }: { order: Order }) {
  const steps = order.timeline;
  return (
    <div className="border border-neutral-200">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200 bg-cream px-6 py-5">
        <div><p className="text-[10px] font-bold uppercase tracking-wide2 text-neutral-500">Tracking Number</p><p className="mt-1 font-display text-lg font-extrabold">{order.trackingNumber}</p></div>
        <span className={`px-4 py-2 text-[10px] font-bold uppercase tracking-wide2 ${order.status === "Delivered" ? "bg-green-100 text-green-800" : "bg-ink text-white"}`}>{order.status}</span>
      </div>
      <div className="px-6 py-7">
        <div className="relative space-y-7 pl-8">
          <div className="absolute bottom-2 left-[9px] top-2 w-px bg-neutral-200" />
          {steps.map((step) => (
            <div key={step.label} className="relative">
              <span className={`absolute -left-8 top-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 ${step.done ? "border-ink bg-ink text-white" : "border-neutral-300 bg-white"}`}>
                {step.done && <Check size={11} />}
              </span>
              <p className={`text-[13px] font-bold ${step.done ? "text-ink" : "text-neutral-400"}`}>{step.label}</p>
              <p className="mt-1 text-[11px] text-neutral-500">{step.date ? formatDate(step.date) : "Pending"}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 flex items-center gap-3 border-t border-neutral-200 pt-6 text-xs text-neutral-600">
          <Truck size={16} className="text-sand" />
          <span>{order.address.division === "Dhaka" ? "Inside Dhaka" : "Outside Dhaka"} delivery · {order.lines.length} item(s) · {formatBDT(order.total)}</span>
        </div>
      </div>
    </div>
  );
}
