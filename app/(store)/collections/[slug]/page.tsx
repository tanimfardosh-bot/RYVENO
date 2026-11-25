"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { ChevronDown, ChevronRight, SlidersHorizontal, X } from "lucide-react";
import { useStore } from "@/lib/store";
import { getCollection, collections } from "@/lib/data";
import { products as seedProducts } from "@/lib/products";
import type { Product } from "@/lib/types";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest First" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
];

const allSizes = ["XS", "S", "M", "L", "XL", "XXL", "30", "32", "34", "36", "39", "40", "41", "42", "43", "44"];
const allColors = [
  { name: "Black", hex: "#111111" }, { name: "White", hex: "#F7F7F5" },
  { name: "Beige", hex: "#B69A72" }, { name: "Navy", hex: "#24324a" },
  { name: "Grey", hex: "#9a9a98" }, { name: "Olive", hex: "#5c6148" },
  { name: "Blue", hex: "#3b5a86" }, { name: "Brown", hex: "#5a3c2e" },
];

export default function CollectionPage() {
  const params = useParams();
  const slug = typeof params.slug === "string" ? params.slug : "";
  const { products: storeProducts } = useStore();
  const collection = getCollection(slug);
  const all = slug === "all";

  const [sort, setSort] = useState(collection?.sort === "popular" ? "featured" : collection?.sort ?? "featured");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(6000);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const base = useMemo(() => {
    const source = storeProducts.length ? storeProducts : seedProducts;
    if (all) return source;
    if (!collection) return [];
    return source.filter(collection.filter);
  }, [storeProducts, collection, all]);

  const categories = useMemo(
    () => Array.from(new Set(base.map((p) => p.category))),
    [base],
  );

  const filtered = useMemo(() => {
    let list = base.filter((p) => {
      if (selectedCategories.length && !selectedCategories.includes(p.category)) return false;
      if (selectedSizes.length && !p.sizes.some((s) => selectedSizes.includes(s))) return false;
      if (selectedColors.length && !p.colors.some((c) => selectedColors.includes(c.name))) return false;
      if (p.price > maxPrice) return false;
      return true;
    });
    list = [...list];
    if (sort === "price-low") list.sort((a, b) => a.price - b.price);
    if (sort === "price-high") list.sort((a, b) => b.price - a.price);
    if (sort === "rating") list.sort((a, b) => b.rating - a.rating);
    if (sort === "newest") list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    if (sort === "featured") list.sort((a, b) => Number(b.tags.includes("best-seller")) - Number(a.tags.includes("best-seller")));
    return list;
  }, [base, selectedCategories, selectedSizes, selectedColors, maxPrice, sort]);

  const toggle = (arr: string[], set: (v: string[]) => void, value: string) =>
    set(arr.includes(value) ? arr.filter((x) => x !== value) : [...arr, value]);

  const activeCount = selectedCategories.length + selectedSizes.length + selectedColors.length + (maxPrice < 6000 ? 1 : 0);
  const clearAll = () => { setSelectedCategories([]); setSelectedSizes([]); setSelectedColors([]); setMaxPrice(6000); };

  const title = all ? "Shop All" : collection?.title ?? "Collection Not Found";
  const image = all ? "/images/lifestyle-1.jpg" : collection?.image ?? "/images/hero-men.jpg";
  const eyebrow = all ? "THE FULL EDIT" : collection?.eyebrow ?? "DISCOVER";
  const description = all
    ? "Every piece in the RYVENO universe — considered essentials and statement styles in one place."
    : collection?.description ?? "This collection could not be found. Explore everything RYVENO has to offer.";

  return (
    <>
      {/* Banner */}
      <section className="relative h-[340px] overflow-hidden bg-ink sm:h-[420px]">
        <img src={image} alt={title} className="absolute inset-0 h-full w-full object-cover opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 to-black/25" />
        <div className="site-container relative flex h-full flex-col justify-center text-white">
          <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wide2 text-white/60">
            <Link href="/" className="hover:text-white">Home</Link><ChevronRight size={12} /><span>{title}</span>
          </div>
          <p className="mt-6 text-[11px] font-semibold uppercase tracking-wide2 text-sand">{eyebrow}</p>
          <h1 className="mt-3 font-display text-4xl font-extrabold uppercase leading-none tracking-tight sm:text-6xl">{title}</h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/75">{description}</p>
        </div>
      </section>

      <div className="site-container py-10 lg:py-14">
        {/* Toolbar */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-neutral-200 pb-5">
          <p className="text-xs text-neutral-500"><span className="font-bold text-ink">{filtered.length}</span> product{filtered.length !== 1 ? "s" : ""}</p>
          <div className="flex items-center gap-3">
            <button onClick={() => setFiltersOpen((v) => !v)} className="flex items-center gap-2 border border-neutral-300 px-4 py-2.5 text-[11px] font-bold uppercase tracking-wide lg:hidden">
              <SlidersHorizontal size={14} /> Filters {activeCount > 0 && `(${activeCount})`}
            </button>
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                aria-label="Sort products"
                className="appearance-none border border-neutral-300 bg-white py-2.5 pl-4 pr-10 text-[11px] font-bold uppercase tracking-wide outline-none focus:border-ink"
              >
                {sortOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-[230px_1fr]">
          {/* Filters */}
          <aside className={`${filtersOpen ? "block" : "hidden"} lg:block`}>
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold uppercase tracking-wide2">Filters</h2>
                {activeCount > 0 && <button onClick={clearAll} className="text-[11px] font-semibold text-sand hover:underline">Clear all</button>}
              </div>

              <FilterGroup title="Category">
                {categories.map((c) => (
                  <Check key={c} label={c === "t-shirts" ? "T-Shirts" : c.replace(/-/g, " & ").replace(/\b\w/g, (m) => m.toUpperCase())} checked={selectedCategories.includes(c)} onChange={() => toggle(selectedCategories, setSelectedCategories, c)} />
                ))}
              </FilterGroup>

              <FilterGroup title="Size">
                <div className="flex flex-wrap gap-2">
                  {allSizes.filter((s) => base.some((p) => p.sizes.includes(s))).map((s) => (
                    <button key={s} onClick={() => toggle(selectedSizes, setSelectedSizes, s)} className={`min-w-9 border px-2.5 py-1.5 text-[11px] font-semibold transition-colors ${selectedSizes.includes(s) ? "border-ink bg-ink text-white" : "border-neutral-300 hover:border-ink"}`}>{s}</button>
                  ))}
                </div>
              </FilterGroup>

              <FilterGroup title="Colour">
                <div className="flex flex-wrap gap-2.5">
                  {allColors.map((c) => (
                    <button key={c.name} title={c.name} aria-label={c.name} onClick={() => toggle(selectedColors, setSelectedColors, c.name)} className={`h-7 w-7 rounded-full border-2 transition-all ${selectedColors.includes(c.name) ? "scale-110 border-ink ring-1 ring-offset-2 ring-ink" : "border-neutral-200"}`} style={{ background: c.hex }} />
                  ))}
                </div>
              </FilterGroup>

              <FilterGroup title="Max Price">
                <input type="range" min={500} max={6000} step={100} value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} className="w-full" />
                <div className="mt-2 flex justify-between text-[11px] text-neutral-500"><span>৳500</span><span className="font-bold text-ink">Up to ৳{maxPrice.toLocaleString("en-BD")}</span></div>
              </FilterGroup>

              <div className="bg-cream p-5">
                <p className="text-xs font-bold uppercase tracking-wide">Need a hand?</p>
                <p className="mt-2 text-xs leading-relaxed text-neutral-600">Our team can help you find the right size or style.</p>
                <Link href="/contact" className="mt-3 inline-block text-[11px] font-bold uppercase tracking-wide text-sand hover:underline">Contact Us →</Link>
              </div>
            </div>
          </aside>

          {/* Products */}
          <div>
            {activeCount > 0 && (
              <div className="mb-6 flex flex-wrap gap-2">
                {[...selectedCategories, ...selectedSizes, ...selectedColors].map((v) => (
                  <button key={v} onClick={() => {
                    if (selectedCategories.includes(v)) toggle(selectedCategories, setSelectedCategories, v);
                    else if (selectedSizes.includes(v)) toggle(selectedSizes, setSelectedSizes, v);
                    else toggle(selectedColors, setSelectedColors, v);
                  }} className="flex items-center gap-1.5 bg-cream px-3 py-1.5 text-[11px] font-medium">
                    {v}<X size={12} />
                  </button>
                ))}
                {maxPrice < 6000 && <button onClick={() => setMaxPrice(6000)} className="flex items-center gap-1.5 bg-cream px-3 py-1.5 text-[11px] font-medium">Under ৳{maxPrice}<X size={12} /></button>}
              </div>
            )}

            {filtered.length === 0 ? (
              <div className="flex min-h-[400px] flex-col items-center justify-center border border-dashed border-neutral-300 text-center">
                <p className="font-display text-2xl font-bold">No pieces found</p>
                <p className="mt-2 max-w-sm text-sm text-neutral-500">Try adjusting your filters — or explore the full collection.</p>
                <button onClick={clearAll} className="btn-dark mt-6">Clear Filters</button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:gap-x-6 xl:grid-cols-4">
                {filtered.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Other collections */}
      <section className="border-t border-neutral-200 bg-cream py-14">
        <div className="site-container">
          <p className="eyebrow mb-5 text-center">Keep Exploring</p>
          <div className="no-scrollbar flex justify-center gap-2 overflow-x-auto pb-2">
            {collections.filter((c) => c.slug !== slug).map((c) => (
              <Link key={c.slug} href={`/collections/${c.slug}`} className="shrink-0 border border-neutral-300 bg-white px-5 py-2.5 text-[11px] font-bold uppercase tracking-wide transition-colors hover:border-ink hover:bg-ink hover:text-white">{c.title}</Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-4 border-b border-neutral-200 pb-3 text-[11px] font-bold uppercase tracking-wide2">{title}</h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Check({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 text-[13px] text-coal">
      <input type="checkbox" checked={checked} onChange={onChange} className="h-4 w-4 accent-ink" />
      {label}
    </label>
  );
}
