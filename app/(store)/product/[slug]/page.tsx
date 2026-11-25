"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import {
  ArrowRight, Check, ChevronDown, ChevronRight, Heart, Minus, Plus,
  RotateCcw, Ruler, Share2, ShieldCheck, Star, Truck, X,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { products as seedProducts, relatedProducts } from "@/lib/products";
import { formatBDT } from "@/lib/format";
import type { Product } from "@/lib/types";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";
import { useToast } from "@/components/Toast";

const sizeChart = [
  { size: "XS", chest: '34"', waist: '28"', length: '26"' },
  { size: "S", chest: '36"', waist: '30"', length: '27"' },
  { size: "M", chest: '38"', waist: '32"', length: '28"' },
  { size: "L", chest: '40"', waist: '34"', length: '29"' },
  { size: "XL", chest: '42"', waist: '36"', length: '30"' },
  { size: "XXL", chest: '44"', waist: '38"', length: '31"' },
];

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const slug = typeof params.slug === "string" ? params.slug : "";
  const { products, addToCart, wishlist, toggleWishlist, reviews, addReview } = useStore();
  const { notify } = useToast();

  const product = useMemo(() => {
    const source = products.length ? products : seedProducts;
    return source.find((p) => p.slug === slug);
  }, [products, slug]);

  const [activeImage, setActiveImage] = useState(0);
  const [color, setColor] = useState(0);
  const [size, setSize] = useState("");
  const [qty, setQty] = useState(1);
  const [sizeGuide, setSizeGuide] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>("description");
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [reviewForm, setReviewForm] = useState({ name: "", rating: 5, title: "", body: "" });
  const imgRef = useRef<HTMLDivElement>(null);

  if (!product) {
    return (
      <div className="site-container flex min-h-[60vh] flex-col items-center justify-center text-center">
        <h1 className="font-display text-3xl font-bold">Product not found</h1>
        <p className="mt-3 text-sm text-neutral-500">This piece may have sold out or moved.</p>
        <Link href="/collections/all" className="btn-dark mt-7">Shop All</Link>
      </div>
    );
  }

  const discount = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;
  const wished = wishlist.includes(product.id);
  const selectedSize = size || product.sizes[0];
  const related = relatedProducts(product, 4);
  const productReviews = reviews.filter((r) => r.status === "published" && (!r.productId || r.productId === product.id));

  const handleAdd = (buyNow = false) => {
    addToCart(product, selectedSize, product.colors[color].name, qty);
    notify(`${product.name} added to your bag.`);
    if (buyNow) router.push("/checkout");
  };

  const onMouseMove = (e: React.MouseEvent) => {
    const el = imgRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setZoom({ x: ((e.clientX - rect.left) / rect.width) * 100, y: ((e.clientY - rect.top) / rect.height) * 100 });
  };

  const submitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewForm.name || !reviewForm.body) return notify("Please fill in your name and review.", "error");
    addReview({
      id: `rev_${Date.now()}`,
      productId: product.id,
      name: reviewForm.name,
      rating: reviewForm.rating,
      title: reviewForm.title || "My review",
      body: reviewForm.body,
      date: new Date().toISOString().slice(0, 10),
      verified: false,
      status: "published",
    });
    setReviewForm({ name: "", rating: 5, title: "", body: "" });
    setReviewOpen(false);
    notify("Thank you! Your review has been published.");
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images.map((i) => `https://ryveno.com${i}`),
    description: product.description,
    brand: { "@type": "Brand", name: "RYVENO" },
    offers: {
      "@type": "Offer",
      priceCurrency: "BDT",
      price: product.price,
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
    aggregateRating: { "@type": "AggregateRating", ratingValue: product.rating, reviewCount: product.reviewCount },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

      <div className="site-container">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 py-6 text-[11px] text-neutral-500">
          <Link href="/" className="hover:text-ink">Home</Link><ChevronRight size={12} />
          <Link href={`/collections/${product.category}`} className="capitalize hover:text-ink">{product.category.replace(/-/g, " ")}</Link><ChevronRight size={12} />
          <span className="truncate text-ink">{product.name}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Gallery */}
          <div className="flex flex-col-reverse gap-4 sm:flex-row">
            <div className="no-scrollbar flex gap-3 overflow-x-auto sm:w-20 sm:flex-col">
              {product.images.map((im, i) => (
                <button key={im + i} onClick={() => setActiveImage(i)} className={`h-20 w-16 shrink-0 border-2 transition-colors sm:h-24 sm:w-full ${activeImage === i ? "border-ink" : "border-transparent hover:border-neutral-300"}`} aria-label={`View image ${i + 1}`}>
                  <img src={im} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
            <div
              ref={imgRef}
              onMouseMove={onMouseMove}
              onMouseLeave={() => setZoom(null)}
              className="relative flex-1 aspect-[3/4] cursor-zoom-in overflow-hidden bg-cream"
            >
              <img src={product.images[activeImage]} alt={product.name} className="h-full w-full object-cover" />
              {zoom && (
                <div
                  className="zoom-lens"
                  style={{ left: `calc(${zoom.x}% - 60px)`, top: `calc(${zoom.y}% - 60px)`, width: 120, height: 120 }}
                />
              )}
              {zoom && (
                <div
                  className="pointer-events-none absolute inset-0 hidden lg:block"
                  style={{
                    backgroundImage: `url(${product.images[activeImage]})`,
                    backgroundSize: "220%",
                    backgroundPosition: `${zoom.x}% ${zoom.y}%`,
                  }}
                />
              )}
              <div className="absolute left-4 top-4 flex flex-col gap-1.5">
                {product.tags.includes("new") && <span className="bg-ink px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide2 text-white">New</span>}
                {discount > 0 && <span className="bg-[#a4343f] px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide2 text-white">-{discount}%</span>}
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="lg:pt-4">
            <p className="eyebrow mb-2">RYVENO · {product.category.replace(/-/g, " & ")}</p>
            <h1 className="font-display text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">{product.name}</h1>

            <div className="mt-4 flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="stars text-sm">{"★".repeat(Math.round(product.rating))}{"☆".repeat(5 - Math.round(product.rating))}</span>
                <span className="text-xs text-neutral-500">{product.rating.toFixed(1)} · {product.reviewCount} reviews</span>
              </div>
              <span className="h-4 w-px bg-neutral-300" />
              <span className="text-xs text-neutral-500">SKU: {product.id}</span>
            </div>

            <div className="mt-6 flex items-center gap-3 border-b border-neutral-200 pb-6">
              <span className="font-display text-3xl font-extrabold">{formatBDT(product.price)}</span>
              {product.compareAtPrice && <span className="text-lg text-neutral-400 line-through">{formatBDT(product.compareAtPrice)}</span>}
              {discount > 0 && <span className="bg-[#a4343f]/10 px-2 py-1 text-[11px] font-bold text-[#a4343f]">Save {formatBDT(product.compareAtPrice! - product.price)}</span>}
            </div>

            {/* Colour */}
            <div className="mt-6">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-bold uppercase tracking-wide2">Colour: <span className="font-medium text-neutral-500">{product.colors[color].name}</span></p>
              </div>
              <div className="mt-3 flex gap-3">
                {product.colors.map((c, i) => (
                  <button key={c.name} onClick={() => setColor(i)} title={c.name} aria-label={c.name} className={`h-8 w-8 rounded-full border-2 transition-all ${color === i ? "scale-110 border-ink ring-1 ring-offset-2 ring-ink" : "border-neutral-200"}`} style={{ background: c.hex }} />
                ))}
              </div>
            </div>

            {/* Size */}
            <div className="mt-7">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-bold uppercase tracking-wide2">Size</p>
                <button onClick={() => setSizeGuide(true)} className="flex items-center gap-1.5 text-[11px] font-semibold text-sand hover:underline"><Ruler size={13} /> Size Guide</button>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button key={s} onClick={() => setSize(s)} className={`min-w-11 border px-3 py-2.5 text-xs font-bold transition-colors ${selectedSize === s ? "border-ink bg-ink text-white" : "border-neutral-300 hover:border-ink"}`}>{s}</button>
                ))}
              </div>
            </div>

            {/* Quantity + actions */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <div className="flex items-center border border-neutral-300">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3.5 py-3.5 hover:bg-cream" aria-label="Decrease quantity"><Minus size={14} /></button>
                <span className="w-10 text-center text-sm font-bold">{qty}</span>
                <button onClick={() => setQty(Math.min(product.stock, qty + 1))} className="px-3.5 py-3.5 hover:bg-cream" aria-label="Increase quantity"><Plus size={14} /></button>
              </div>
              <button onClick={() => handleAdd(false)} className="btn-dark flex-1">Add to Cart</button>
              <button onClick={() => { toggleWishlist(product.id); notify(wished ? "Removed from wishlist." : "Added to wishlist."); }} aria-label="Add to wishlist" className={`flex h-[50px] w-[50px] items-center justify-center border transition-colors ${wished ? "border-ink bg-ink text-white" : "border-neutral-300 hover:border-ink"}`}>
                <Heart size={18} fill={wished ? "currentColor" : "none"} strokeWidth={1.5} />
              </button>
            </div>
            <button onClick={() => handleAdd(true)} className="btn-sand mt-3 w-full">Buy Now <ArrowRight size={14} /></button>

            <div className="mt-4 flex items-center gap-2 text-[11px] text-neutral-500">
              <span className={`h-2 w-2 rounded-full ${product.stock > 5 ? "bg-green-600" : "bg-amber-500"}`} />
              {product.stock > 5 ? "In stock — ready to ship" : `Only ${product.stock} left in stock`}
            </div>

            {/* Info accordions */}
            <div className="mt-8 divide-y divide-neutral-200 border-y border-neutral-200">
              <Accordion title="Delivery & Shipping" icon={Truck} open={openAccordion === "delivery"} onClick={() => setOpenAccordion(openAccordion === "delivery" ? null : "delivery")}>
                <p>Delivery inside Dhaka within 1–3 business days (৳60) and nationwide within 3–6 business days (৳120). Free delivery on orders above ৳3,000. Cash on Delivery, bKash and Nagad available.</p>
              </Accordion>
              <Accordion title="Return & Exchange" icon={RotateCcw} open={openAccordion === "returns"} onClick={() => setOpenAccordion(openAccordion === "returns" ? null : "returns")}>
                <p>Unworn items with tags can be returned or exchanged within 7 days of delivery. Sale items are eligible for exchange only. Message us on WhatsApp to start a return.</p>
              </Accordion>
              <Accordion title="Product Details" icon={ShieldCheck} open={openAccordion === "description"} onClick={() => setOpenAccordion(openAccordion === "description" ? null : "description")}>
                <p>{product.description}</p>
                <ul className="mt-4 space-y-2">
                  {product.details.map((d) => <li key={d} className="flex items-start gap-2 text-[13px] text-neutral-600"><Check size={14} className="mt-0.5 shrink-0 text-sand" />{d}</li>)}
                </ul>
              </Accordion>
            </div>

            <button onClick={() => { navigator.clipboard?.writeText(window.location.href); notify("Product link copied."); }} className="mt-6 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide2 text-neutral-500 hover:text-ink"><Share2 size={14} /> Share this piece</button>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <section className="site-container border-t border-neutral-200 py-16 lg:py-20">
        <Reveal className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow mb-3">Customer Reviews</p>
            <h2 className="section-title">What they&apos;re saying</h2>
          </div>
          <button onClick={() => setReviewOpen((v) => !v)} className="btn-outline">Write a Review</button>
        </Reveal>

        {reviewOpen && (
          <form onSubmit={submitReview} className="mb-10 grid gap-4 border border-neutral-200 bg-cream p-6 sm:grid-cols-2">
            <input value={reviewForm.name} onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })} placeholder="Your name" className="field" />
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold">Rating:</span>
              <select value={reviewForm.rating} onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })} className="field max-w-[120px]">
                {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} Stars</option>)}
              </select>
            </div>
            <input value={reviewForm.title} onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })} placeholder="Review title" className="field sm:col-span-2" />
            <textarea value={reviewForm.body} onChange={(e) => setReviewForm({ ...reviewForm, body: e.target.value })} placeholder="Your review" rows={4} className="field sm:col-span-2" />
            <button type="submit" className="btn-dark sm:col-span-2 sm:justify-self-start">Submit Review</button>
          </form>
        )}

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {productReviews.slice(0, 6).map((r) => (
            <div key={r.id} className="border border-neutral-200 p-6">
              <div className="stars text-sm">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</div>
              <h3 className="mt-4 font-display text-base font-bold">{r.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600">{r.body}</p>
              <p className="mt-5 text-xs font-semibold">{r.name} {r.verified && <span className="font-normal text-sand">· Verified Buyer</span>}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="bg-cream py-16 lg:py-20">
          <div className="site-container">
            <Reveal className="mb-9 flex items-end justify-between">
              <div><p className="eyebrow mb-3">You May Also Like</p><h2 className="section-title">Complete the Look</h2></div>
              <Link href={`/collections/${product.category}`} className="link-line hidden items-center gap-2 pb-1 text-[11px] font-bold uppercase tracking-wide2 sm:flex">View All <ArrowRight size={14} /></Link>
            </Reveal>
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 lg:gap-x-6">
              {related.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
            </div>
          </div>
        </section>
      )}

      {/* Size guide modal */}
      {sizeGuide && (
        <div className="fixed inset-0 z-[140] flex items-center justify-center p-4">
          <div className="drawer-backdrop absolute inset-0 bg-black/60" onClick={() => setSizeGuide(false)} />
          <div className="relative w-full max-w-lg bg-white p-7 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl font-bold uppercase tracking-tight">Size Guide</h2>
              <button onClick={() => setSizeGuide(false)} aria-label="Close"><X size={22} /></button>
            </div>
            <p className="mt-2 text-sm text-neutral-500">Measurements are in inches. For a relaxed fit, size up.</p>
            <div className="mt-6 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead><tr className="border-b-2 border-ink text-[11px] uppercase tracking-wide"><th className="py-3">Size</th><th>Chest</th><th>Waist</th><th>Length</th></tr></thead>
                <tbody>
                  {sizeChart.map((row) => <tr key={row.size} className="border-b border-neutral-200"><td className="py-3 font-bold">{row.size}</td><td>{row.chest}</td><td>{row.waist}</td><td>{row.length}</td></tr>)}
                </tbody>
              </table>
            </div>
            <p className="mt-5 text-xs leading-relaxed text-neutral-500">How to measure: Chest — around the fullest part, under the arms. Waist — around the natural waistline. Length — from the highest shoulder point to the hem.</p>
          </div>
        </div>
      )}
    </>
  );
}

function Accordion({ title, icon: Icon, open, onClick, children }: { title: string; icon: React.ElementType; open: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <div>
      <button onClick={onClick} className="flex w-full items-center justify-between py-4 text-left text-[13px] font-bold uppercase tracking-wide">
        <span className="flex items-center gap-2.5"><Icon size={16} className="text-sand" />{title}</span>
        <ChevronDown size={16} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="pb-5 text-[13px] leading-relaxed text-neutral-600">{children}</div>}
    </div>
  );
}
