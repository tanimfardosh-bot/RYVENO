"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, ChevronRight, ShieldCheck, Tag, Trash2, Truck } from "lucide-react";
import { useStore } from "@/lib/store";
import { formatBDT } from "@/lib/format";
import { useToast } from "@/components/Toast";

export default function CartPage() {
  const { cart, updateQty, removeFromCart, subtotal, appliedCoupon, applyCoupon, removeCoupon } = useStore();
  const { notify } = useToast();
  const [code, setCode] = useState("");

  const shipping = subtotal >= 3000 ? 0 : subtotal === 0 ? 0 : 60;
  const total = Math.max(0, subtotal + shipping - (appliedCoupon?.discount ?? 0));

  const submitCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const res = applyCoupon(code);
    notify(res.message, res.ok ? "success" : "error");
    if (res.ok) setCode("");
  };

  return (
    <div className="site-container py-10 lg:py-14">
      <nav className="mb-8 flex items-center gap-2 text-[11px] text-neutral-500">
        <Link href="/" className="hover:text-ink">Home</Link><ChevronRight size={12} /><span className="text-ink">Shopping Bag</span>
      </nav>

      <h1 className="font-display text-3xl font-extrabold uppercase tracking-tight sm:text-4xl">Shopping Bag <span className="text-neutral-300">({cart.length})</span></h1>

      {cart.length === 0 ? (
        <div className="my-16 flex flex-col items-center text-center">
          <div className="flex h-24 w-24 items-center justify-center bg-cream"><Trash2 size={32} strokeWidth={1} className="text-neutral-400" /></div>
          <h2 className="mt-7 font-display text-2xl font-bold">Your bag is empty</h2>
          <p className="mt-2 max-w-sm text-sm text-neutral-500">Looks like you haven&apos;t added anything yet. Let&apos;s change that.</p>
          <Link href="/collections/all" className="btn-dark mt-7">Start Shopping <ArrowRight size={14} /></Link>
        </div>
      ) : (
        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_380px] lg:gap-14">
          {/* Items */}
          <div>
            <div className="hidden grid-cols-[1fr_120px_130px_120px_40px] border-b border-neutral-200 pb-3 text-[10px] font-bold uppercase tracking-wide2 text-neutral-500 sm:grid">
              <span>Product</span><span className="text-center">Size / Colour</span><span className="text-center">Quantity</span><span className="text-right">Total</span><span />
            </div>
            {cart.map((line) => (
              <div key={line.key} className="grid gap-4 border-b border-neutral-200 py-6 sm:grid-cols-[1fr_120px_130px_120px_40px] sm:items-center">
                <div className="flex gap-4">
                  <Link href={`/product/${line.slug}`} className="h-28 w-22 shrink-0 bg-cream"><img src={line.image} alt={line.name} className="h-full w-full object-cover" /></Link>
                  <div>
                    <Link href={`/product/${line.slug}`} className="text-sm font-bold leading-snug hover:text-sand">{line.name}</Link>
                    <p className="mt-1 text-xs text-neutral-500">{formatBDT(line.price)} each</p>
                    <button onClick={() => { removeFromCart(line.key); notify("Item removed."); }} className="mt-3 text-[11px] font-semibold text-neutral-400 hover:text-red-600 sm:hidden">Remove</button>
                  </div>
                </div>
                <div className="text-xs text-neutral-600 sm:text-center"><span className="sm:hidden">Size / Colour: </span><span className="font-semibold">{line.size}</span><br /><span className="text-neutral-500">{line.color}</span></div>
                <div className="flex items-center border border-neutral-300 sm:mx-auto sm:w-fit">
                  <button onClick={() => updateQty(line.key, line.quantity - 1)} className="px-3 py-2.5 hover:bg-cream" aria-label="Decrease">−</button>
                  <span className="w-8 text-center text-xs font-bold">{line.quantity}</span>
                  <button onClick={() => updateQty(line.key, line.quantity + 1)} className="px-3 py-2.5 hover:bg-cream" aria-label="Increase">+</button>
                </div>
                <p className="text-sm font-bold sm:text-right">{formatBDT(line.price * line.quantity)}</p>
                <button onClick={() => { removeFromCart(line.key); notify("Item removed."); }} className="hidden text-neutral-400 hover:text-red-600 sm:block" aria-label="Remove"><Trash2 size={16} /></button>
              </div>
            ))}

            <Link href="/collections/all" className="mt-6 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-wide2 hover:text-sand">← Continue Shopping</Link>
          </div>

          {/* Summary */}
          <aside className="h-fit border border-neutral-200 bg-cream p-6 lg:sticky lg:top-28">
            <h2 className="font-display text-lg font-bold uppercase">Order Summary</h2>

            <form onSubmit={submitCoupon} className="mt-6">
              <label className="text-[11px] font-bold uppercase tracking-wide2">Discount Code</label>
              {appliedCoupon ? (
                <div className="mt-2 flex items-center justify-between border border-ink bg-white px-4 py-3">
                  <span className="flex items-center gap-2 text-xs font-bold"><Tag size={14} className="text-sand" />{appliedCoupon.code}</span>
                  <button type="button" onClick={() => { removeCoupon(); notify("Coupon removed."); }} className="text-xs text-neutral-400 hover:text-red-600">Remove</button>
                </div>
              ) : (
                <div className="mt-2 flex">
                  <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Enter code" className="field flex-1 border-r-0" />
                  <button type="submit" className="bg-ink px-4 text-[11px] font-bold uppercase tracking-wide text-white hover:bg-coal">Apply</button>
                </div>
              )}
              <p className="mt-2 text-[10px] text-neutral-500">Try RYVENO10 or WELCOME200</p>
            </form>

            <div className="mt-7 space-y-3 border-t border-neutral-300 pt-6 text-sm">
              <div className="flex justify-between"><span className="text-neutral-600">Subtotal</span><span className="font-semibold">{formatBDT(subtotal)}</span></div>
              <div className="flex justify-between"><span className="text-neutral-600">Delivery (est. Dhaka)</span><span className="font-semibold">{shipping === 0 ? "Free" : formatBDT(shipping)}</span></div>
              {appliedCoupon && <div className="flex justify-between text-[#a4343f]"><span>Discount</span><span className="font-semibold">−{formatBDT(appliedCoupon.discount)}</span></div>}
            </div>
            <div className="mt-5 flex items-center justify-between border-t border-neutral-300 pt-5">
              <span className="text-sm font-bold uppercase tracking-wide">Total</span>
              <span className="font-display text-2xl font-extrabold">{formatBDT(total)}</span>
            </div>
            <p className="mt-1 text-[10px] text-neutral-500">VAT included. Final delivery calculated at checkout.</p>

            <Link href="/checkout" className="btn-dark mt-6 w-full">Proceed to Checkout <ArrowRight size={14} /></Link>

            <div className="mt-6 space-y-3 border-t border-neutral-300 pt-5 text-[11px] text-neutral-600">
              <p className="flex items-center gap-2"><Truck size={14} className="text-sand" /> Nationwide delivery across Bangladesh</p>
              <p className="flex items-center gap-2"><ShieldCheck size={14} className="text-sand" /> Secure checkout & cash on delivery</p>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
