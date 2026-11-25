"use client";

import Link from "next/link";
import { ArrowRight, ShoppingBag, Trash2, X } from "lucide-react";
import { useStore } from "@/lib/store";
import { formatBDT } from "@/lib/format";
import { useToast } from "./Toast";

export default function CartDrawer() {
  const { cart, cartOpen, setCartOpen, updateQty, removeFromCart, subtotal } = useStore();
  const { notify } = useToast();

  if (!cartOpen) return null;

  return (
    <div className="fixed inset-0 z-[120]">
      <div className="drawer-backdrop absolute inset-0 bg-black/50" onClick={() => setCartOpen(false)} />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl animate-slideIn" aria-label="Shopping cart">
        <div className="flex items-center justify-between border-b px-6 py-5">
          <div>
            <h2 className="font-display text-lg font-bold uppercase tracking-wide">Shopping Bag</h2>
            <p className="mt-0.5 text-xs text-neutral-500">{cart.length} {cart.length === 1 ? "item" : "items"}</p>
          </div>
          <button onClick={() => setCartOpen(false)} aria-label="Close cart" className="p-1 hover:text-sand"><X size={22} strokeWidth={1.5} /></button>
        </div>

        {cart.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <ShoppingBag size={44} strokeWidth={1} className="text-neutral-300" />
            <h3 className="mt-5 font-display text-xl font-bold">Your bag is empty</h3>
            <p className="mt-2 text-sm text-neutral-500">Discover pieces that feel like you.</p>
            <Link href="/collections/all" onClick={() => setCartOpen(false)} className="btn-dark mt-7">Start Shopping</Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6">
              {cart.map((line) => (
                <div key={line.key} className="flex gap-4 border-b py-5">
                  <Link href={`/product/${line.slug}`} onClick={() => setCartOpen(false)} className="h-28 w-21 shrink-0 bg-cream">
                    <img src={line.image} alt={line.name} className="h-full w-full object-cover" />
                  </Link>
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <Link href={`/product/${line.slug}`} onClick={() => setCartOpen(false)} className="text-[13px] font-bold leading-snug hover:text-sand">{line.name}</Link>
                        <p className="mt-1 text-[11px] text-neutral-500">Size {line.size} · {line.color}</p>
                      </div>
                      <button onClick={() => { removeFromCart(line.key); notify("Item removed from bag."); }} className="text-neutral-400 hover:text-red-600" aria-label="Remove item"><Trash2 size={15} /></button>
                    </div>
                    <p className="mt-1.5 text-sm font-bold">{formatBDT(line.price)}</p>
                    <div className="mt-auto flex items-center justify-between pt-3">
                      <div className="flex items-center border border-neutral-300">
                        <button onClick={() => updateQty(line.key, line.quantity - 1)} className="px-2.5 py-1.5 text-sm hover:bg-cream" aria-label="Decrease">−</button>
                        <span className="w-7 text-center text-xs font-semibold">{line.quantity}</span>
                        <button onClick={() => updateQty(line.key, line.quantity + 1)} className="px-2.5 py-1.5 text-sm hover:bg-cream" aria-label="Increase">+</button>
                      </div>
                      <span className="text-xs font-semibold">{formatBDT(line.price * line.quantity)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t px-6 py-5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-600">Subtotal</span>
                <span className="font-display text-lg font-bold">{formatBDT(subtotal)}</span>
              </div>
              <p className="mt-1 text-[11px] text-neutral-500">Shipping and discounts calculated at checkout.</p>
              <Link href="/cart" onClick={() => setCartOpen(false)} className="btn-outline mt-4 w-full">View Bag</Link>
              <Link href="/checkout" onClick={() => setCartOpen(false)} className="btn-dark mt-2 w-full">Checkout <ArrowRight size={14} /></Link>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
