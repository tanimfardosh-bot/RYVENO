"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { useStore } from "@/lib/store";
import { products as seedProducts } from "@/lib/products";
import ProductCard from "@/components/ProductCard";

export default function WishlistPage() {
  const { wishlist, products } = useStore();
  const source = products.length ? products : seedProducts;
  const items = source.filter((p) => wishlist.includes(p.id));

  return (
    <div className="site-container py-10 lg:py-14">
      <p className="eyebrow mb-3">Saved for later</p>
      <h1 className="font-display text-3xl font-extrabold uppercase tracking-tight sm:text-4xl">My Wishlist <span className="text-neutral-300">({items.length})</span></h1>
      <p className="mt-2 text-sm text-neutral-500">All the pieces you love, in one place.</p>

      {items.length === 0 ? (
        <div className="my-16 flex flex-col items-center text-center">
          <Heart size={44} strokeWidth={1} className="text-neutral-300" />
          <h2 className="mt-6 font-display text-2xl font-bold">Nothing saved yet</h2>
          <p className="mt-2 max-w-sm text-sm text-neutral-500">Tap the heart on any product to keep it here for later.</p>
          <Link href="/collections/all" className="btn-dark mt-7">Explore Collection</Link>
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
          {items.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
      )}
    </div>
  );
}
