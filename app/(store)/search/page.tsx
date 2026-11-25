"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { useStore } from "@/lib/store";
import { products as seedProducts } from "@/lib/products";
import ProductCard from "@/components/ProductCard";

export default function SearchPage() {
  const { products } = useStore();
  const [query, setQuery] = useState("");
  const [input, setInput] = useState("");

  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("q") ?? "";
    setQuery(q); setInput(q);
  }, []);

  const source = products.length ? products : seedProducts;
  const q = query.trim().toLowerCase();
  const results = q ? source.filter((p) => [p.name, p.category, p.gender, p.description, ...p.tags].join(" ").toLowerCase().includes(q)) : [];

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setQuery(input);
    window.history.replaceState(null, "", `/search?q=${encodeURIComponent(input)}`);
  };

  return (
    <div className="site-container py-10 lg:py-14">
      <p className="eyebrow mb-3">Find your piece</p>
      <h1 className="font-display text-3xl font-extrabold uppercase tracking-tight sm:text-4xl">Search</h1>
      <form onSubmit={submit} className="mt-7 flex max-w-2xl gap-3">
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Search products, categories, styles…" className="field flex-1" autoFocus />
        <button type="submit" className="btn-dark"><Search size={15} /> Search</button>
      </form>

      {q && (
        <p className="mt-7 text-sm text-neutral-500"><span className="font-bold text-ink">{results.length}</span> result{results.length !== 1 ? "s" : ""} for “{query}”</p>
      )}

      {q && results.length === 0 ? (
        <div className="my-16 text-center">
          <p className="font-display text-xl font-bold">No matches found</p>
          <p className="mt-2 text-sm text-neutral-500">Try a different keyword or browse the full collection.</p>
          <Link href="/collections/all" className="btn-outline mt-6">Shop All</Link>
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
          {results.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
      )}
    </div>
  );
}
