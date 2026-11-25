"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { useStore } from "@/lib/store";
import { formatBDT } from "@/lib/format";

export default function SearchOverlay() {
  const { searchOpen, setSearchOpen, products } = useStore();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen) setTimeout(() => inputRef.current?.focus(), 40);
    else setQuery("");
  }, [searchOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSearchOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setSearchOpen]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return products.filter((p) =>
      [p.name, p.category, p.gender, ...p.tags].join(" ").toLowerCase().includes(q),
    ).slice(0, 8);
  }, [query, products]);

  if (!searchOpen) return null;

  return (
    <div className="fixed inset-0 z-[130] bg-white/98 backdrop-blur-sm">
      <div className="site-container">
        <div className="flex h-20 items-center justify-between border-b">
          <span className="font-display text-xl font-extrabold tracking-brand">RYVENO</span>
          <button onClick={() => setSearchOpen(false)} aria-label="Close search" className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide2 hover:text-sand">
            Close <X size={22} strokeWidth={1.5} />
          </button>
        </div>

        <div className="mx-auto max-w-3xl pt-10 sm:pt-16">
          <div className="flex items-center gap-4 border-b-2 border-ink pb-4">
            <Search size={24} strokeWidth={1.5} className="text-neutral-400" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="What are you looking for?"
              className="w-full bg-transparent font-display text-2xl font-medium outline-none placeholder:text-neutral-300 sm:text-4xl"
              aria-label="Search products"
            />
          </div>

          {query.trim() === "" ? (
            <div className="mt-10">
              <p className="eyebrow mb-4">Popular Searches</p>
              <div className="flex flex-wrap gap-2">
                {["Hoodie", "Oxford Shirt", "Blazer", "Jeans", "Tote", "New Arrivals"].map((s) => (
                  <button key={s} onClick={() => setQuery(s)} className="border border-neutral-300 px-4 py-2 text-xs font-medium transition-colors hover:border-ink hover:bg-ink hover:text-white">{s}</button>
                ))}
              </div>
            </div>
          ) : (
            <div className="mt-8">
              <p className="mb-4 text-xs font-semibold uppercase tracking-wide2 text-neutral-500">{results.length} result{results.length !== 1 ? "s" : ""} for “{query}”</p>
              {results.length === 0 ? (
                <p className="py-10 text-center text-sm text-neutral-500">No pieces found. Try a different search.</p>
              ) : (
                <div className="space-y-1">
                  {results.map((p) => (
                    <Link key={p.id} href={`/product/${p.slug}`} onClick={() => setSearchOpen(false)} className="flex items-center gap-4 border-b border-neutral-100 py-3 transition-colors hover:bg-cream">
                      <img src={p.images[0]} alt="" className="h-16 w-14 object-cover" />
                      <div className="flex-1">
                        <p className="text-sm font-bold">{p.name}</p>
                        <p className="text-xs capitalize text-neutral-500">{p.category.replace(/-/g, " & ")}</p>
                      </div>
                      <span className="text-sm font-semibold">{formatBDT(p.price)}</span>
                    </Link>
                  ))}
                </div>
              )}
              {results.length > 0 && (
                <Link href={`/search?q=${encodeURIComponent(query)}`} onClick={() => setSearchOpen(false)} className="btn-outline mt-8">View All Results</Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
