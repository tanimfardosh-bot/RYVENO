"use client";

import Link from "next/link";
import { Heart, Plus, Star } from "lucide-react";
import type { Product } from "@/lib/types";
import { formatBDT } from "@/lib/format";
import { useStore } from "@/lib/store";
import { useToast } from "./Toast";

export default function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { wishlist, toggleWishlist, addToCart } = useStore();
  const { notify } = useToast();
  const wished = wishlist.includes(product.id);
  const isNew = product.tags.includes("new");
  const isSale = Boolean(product.compareAtPrice) || product.tags.includes("sale");
  const discount = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  return (
    <article className="group" style={{ animationDelay: `${index * 60}ms` }}>
      <div className="relative aspect-[3/4] overflow-hidden bg-cream">
        <Link href={`/product/${product.slug}`} className="block h-full w-full">
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover img-hover"
          />
          {product.images[1] && (
            <img
              src={product.images[1]}
              alt=""
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            />
          )}
        </Link>

        {/* Badges */}
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {isNew && <span className="bg-ink px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide2 text-white">New</span>}
          {isSale && <span className="bg-[#a4343f] px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide2 text-white">-{discount || 10}%</span>}
          {product.tags.includes("best-seller") && !isNew && <span className="bg-white px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide2 text-ink">Bestseller</span>}
        </div>

        {/* Wishlist */}
        <button
          onClick={() => { toggleWishlist(product.id); notify(wished ? "Removed from wishlist." : "Added to wishlist."); }}
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
          className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center bg-white/90 shadow-sm transition-all hover:bg-white ${wished ? "text-[#a4343f]" : "text-ink"}`}
        >
          <Heart size={17} fill={wished ? "currentColor" : "none"} strokeWidth={1.6} />
        </button>

        {/* Quick add */}
        <button
          onClick={() => {
            addToCart(product, product.sizes[0], product.colors[0].name);
            notify(`${product.name} added to your bag.`);
          }}
          className="absolute inset-x-3 bottom-3 flex translate-y-3 items-center justify-center gap-2 bg-ink py-3 text-[10px] font-bold uppercase tracking-wide2 text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 hover:bg-sand max-md:translate-y-0 max-md:opacity-100"
        >
          <Plus size={14} /> Quick Add
        </button>
      </div>

      <div className="pt-4">
        <div className="flex items-start justify-between gap-2">
          <Link href={`/product/${product.slug}`} className="text-[13px] font-bold leading-snug transition-colors hover:text-sand">{product.name}</Link>
          <span className="flex shrink-0 items-center gap-1 pt-0.5 text-[10px] text-neutral-500"><Star size={11} fill="currentColor" className="text-sand" />{product.rating.toFixed(1)}</span>
        </div>

        <div className="mt-2 flex items-center gap-2">
          <span className="text-sm font-bold">{formatBDT(product.price)}</span>
          {product.compareAtPrice && <span className="text-xs text-neutral-400 line-through">{formatBDT(product.compareAtPrice)}</span>}
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {product.colors.slice(0, 4).map((c) => (
              <span key={c.name} title={c.name} className="h-3 w-3 rounded-full border border-black/10" style={{ background: c.hex }} />
            ))}
            {product.colors.length > 4 && <span className="text-[9px] text-neutral-500">+{product.colors.length - 4}</span>}
          </div>
          <span className="text-[10px] text-neutral-500">{product.sizes.slice(0, 4).join(" · ")}{product.sizes.length > 4 ? "…" : ""}</span>
        </div>
      </div>
    </article>
  );
}
