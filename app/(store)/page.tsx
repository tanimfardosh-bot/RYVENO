"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight, ArrowUpRight, BadgeCheck, ChevronLeft, ChevronRight,
  RotateCcw, Send, ShieldCheck, Truck,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { shopCategories, faqs } from "@/lib/data";
import { bestSellers, newArrivals, products } from "@/lib/products";
import { formatBDT } from "@/lib/format";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";
import ModelPhoto from "@/components/ModelPhoto";
import HeroSlider from "@/components/HeroSlider";
import { useToast } from "@/components/Toast";

const perks = [
  { icon: Truck, title: "Nationwide Delivery", text: "All 64 districts" },
  { icon: BadgeCheck, title: "Premium Quality", text: "Considered fabrics" },
  { icon: RotateCcw, title: "7-Day Returns", text: "Easy exchanges" },
  { icon: ShieldCheck, title: "Secure Checkout", text: "COD & mobile banking" },
];

export default function HomePage() {
  const { reviews } = useStore();
  const { notify } = useToast();
  const [email, setEmail] = useState("");
  const published = reviews.filter((r) => r.status === "published").slice(0, 3);

  const subscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) return notify("Please enter a valid email address.", "error");
    notify("You're on the list. Welcome to RYVENO!");
    setEmail("");
  };

  return (
    <>
      {/* HERO CAMPAIGN SLIDER */}
      <HeroSlider />

      {/* PERKS STRIP */}
      <section className="border-b border-neutral-200 bg-cream">
        <div className="site-container grid grid-cols-2 divide-x divide-neutral-200 lg:grid-cols-4">
          {perks.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex items-center gap-3 px-1 py-5 lg:px-6">
              <Icon size={22} strokeWidth={1.3} className="shrink-0 text-sand" />
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wide sm:text-xs">{title}</p>
                <p className="mt-0.5 text-[10px] text-neutral-500 sm:text-[11px]">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SHOP BY CATEGORY */}
      <section className="site-container py-16 sm:py-20 lg:py-28">
        <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow mb-3">Find Your Fit</p>
            <h2 className="section-title">Shop by Category</h2>
          </div>
          <Link href="/collections/all" className="link-line flex items-center gap-2 pb-1 text-[11px] font-bold uppercase tracking-wide2">View All <ArrowRight size={14} /></Link>
        </Reveal>

        <div className="no-scrollbar -mx-5 flex snap-x gap-4 overflow-x-auto px-5 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 lg:grid-cols-4">
          {shopCategories.map((cat, i) => (
            <Reveal key={cat.name} delay={i * 50} className="min-w-[68vw] snap-start sm:min-w-0">
              <Link href={`/collections/${cat.slug}`} className="group block">
                <div className="relative aspect-[4/5] overflow-hidden bg-cream">
                  <img src={cat.image} alt={cat.name} loading="lazy" className="h-full w-full object-cover img-hover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                    <h3 className="font-display text-lg font-bold uppercase tracking-tight sm:text-xl">{cat.name}</h3>
                    <span className="mt-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide2 opacity-0 transition-all duration-300 group-hover:opacity-100 max-md:opacity-100">
                      Shop Now <ArrowUpRight size={13} />
                    </span>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* NEW ARRIVALS */}
      <section className="bg-cream py-16 sm:py-20 lg:py-28">
        <div className="site-container">
          <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow mb-3">Just Landed</p>
              <h2 className="section-title">New Arrivals</h2>
              <p className="mt-3 max-w-md text-sm text-neutral-600">The latest expressions of the RYVENO identity. Fresh cuts, considered details, made to be seen first.</p>
            </div>
            <Link href="/collections/new-arrivals" className="link-line flex items-center gap-2 pb-1 text-[11px] font-bold uppercase tracking-wide2">View All <ArrowRight size={14} /></Link>
          </Reveal>
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
            {newArrivals.slice(0, 8).map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        </div>
      </section>

      {/* BEST SELLERS */}
      <section className="site-container py-16 sm:py-20 lg:py-28">
        <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow mb-3">Most Loved</p>
            <h2 className="section-title">Best Sellers</h2>
          </div>
          <Link href="/collections/best-sellers" className="link-line flex items-center gap-2 pb-1 text-[11px] font-bold uppercase tracking-wide2">View All <ArrowRight size={14} /></Link>
        </Reveal>
        <BestSellerRail products={bestSellers.slice(0, 8)} />
      </section>

      {/* EDITORIAL CAMPAIGN */}
      <section className="relative h-[70svh] min-h-[460px] overflow-hidden bg-ink">
        <img src="/images/editorial.jpg" alt="RYVENO editorial campaign" loading="lazy" className="absolute inset-0 h-full w-full object-cover object-center opacity-80" />
        <div className="absolute inset-0 bg-black/40" />
        <div className="site-container relative flex h-full flex-col items-center justify-center text-center text-white">
          <Reveal>
            <p className="text-[11px] font-semibold uppercase tracking-wide2 text-sand">The RYVENO Manifesto</p>
            <h2 className="mx-auto mt-5 max-w-4xl font-display text-[clamp(2rem,5.2vw,4.6rem)] font-extrabold uppercase leading-[1.02] tracking-tight">
              Style is not what you wear.<br /><span className="text-sand">It&apos;s who you are.</span>
            </h2>
            <Link href="/collections/all" className="btn-light mt-9">Explore Collection <ArrowRight size={14} /></Link>
          </Reveal>
        </div>
      </section>

      {/* BRAND STORY */}
      <section className="site-container grid items-center gap-12 py-16 sm:py-20 lg:grid-cols-2 lg:gap-20 lg:py-28">
        <Reveal className="relative order-2 aspect-[4/5] overflow-hidden bg-cream lg:order-1">
          <ModelPhoto alt="RYVENO — more than just fashion" fallback="/images/story.jpg" className="h-full w-full object-cover" />
          <div className="absolute bottom-6 left-6 bg-white/95 px-6 py-4 backdrop-blur">
            <p className="font-display text-2xl font-extrabold tracking-tight">RYVENO</p>
            <p className="mt-1 text-[10px] font-semibold uppercase tracking-wide2 text-sand">Wear Your Identity</p>
          </div>
        </Reveal>
        <Reveal delay={120} className="order-1 lg:order-2">
          <p className="eyebrow mb-3">Our Story</p>
          <h2 className="section-title">More than<br />just fashion.</h2>
          <p className="mt-6 max-w-lg text-[15px] leading-[1.9] text-neutral-600">
            RYVENO represents a generation that believes style is personal. We create modern everyday fashion that combines confidence, comfort, and individuality.
          </p>
          <p className="mt-4 max-w-lg text-[15px] leading-[1.9] text-neutral-600">
            Born in Dhaka and shaped by the energy of Bangladesh, our mission is simple: premium design that stays within reach — pieces that feel considered, look effortless, and are unmistakably yours.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-4 border-t border-neutral-200 pt-8">
            {[["64", "Districts served"], ["2K+", "Styles curated"], ["10K+", "Happy customers"]].map(([n, l]) => (
              <div key={l}>
                <p className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">{n}</p>
                <p className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-neutral-500">{l}</p>
              </div>
            ))}
          </div>
          <Link href="/about" className="btn-dark mt-9">Discover Our Story <ArrowRight size={14} /></Link>
        </Reveal>
      </section>

      {/* REVIEWS */}
      <section className="bg-cream py-16 sm:py-20 lg:py-28">
        <div className="site-container">
          <Reveal className="mb-12 text-center">
            <p className="eyebrow mb-3">The Community</p>
            <h2 className="section-title">Loved by You</h2>
            <p className="mx-auto mt-3 max-w-lg text-sm text-neutral-600">Real words from people who wear RYVENO.</p>
          </Reveal>
          <div className="grid gap-5 md:grid-cols-3">
            {published.map((r, i) => (
              <Reveal key={r.id} delay={i * 90} className="flex h-full flex-col border border-neutral-200 bg-white p-7">
                <div className="stars text-sm">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</div>
                <h3 className="mt-5 font-display text-lg font-bold leading-snug">{r.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-neutral-600">“{r.body}”</p>
                <div className="mt-6 flex items-center justify-between border-t border-neutral-100 pt-5">
                  <div>
                    <p className="text-[13px] font-bold">{r.name}</p>
                    <p className="text-[10px] uppercase tracking-wide text-neutral-400">{r.verified ? "Verified Buyer" : "Customer"}</p>
                  </div>
                  <span className="text-[11px] text-neutral-400">{new Date(r.date).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="site-container py-16 sm:py-20 lg:py-24">
        <Reveal className="relative overflow-hidden bg-ink px-6 py-14 text-center text-white sm:px-12 lg:py-20">
          <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full border border-white/10" />
          <div className="absolute -bottom-20 -left-10 h-64 w-64 rounded-full border border-white/10" />
          <p className="eyebrow relative">The RYVENO Edit</p>
          <h2 className="relative mt-3 font-display text-3xl font-extrabold uppercase tracking-tight sm:text-5xl">Be the first to know.</h2>
          <p className="relative mx-auto mt-4 max-w-lg text-sm leading-relaxed text-neutral-400">Get exclusive access to new collections, special offers, and the latest from RYVENO.</p>
          <form onSubmit={subscribe} className="relative mx-auto mt-8 flex max-w-lg flex-col gap-3 sm:flex-row">
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Enter your email address" aria-label="Email address" className="h-13 flex-1 border border-white/25 bg-transparent px-4 text-sm text-white outline-none placeholder:text-neutral-500 focus:border-sand" />
            <button type="submit" className="btn-sand h-13"><Send size={14} /> Subscribe</button>
          </form>
          <p className="relative mt-4 text-[10px] text-neutral-500">No spam. Just the good stuff. Unsubscribe anytime.</p>
        </Reveal>
      </section>

      {/* FAQ TEASER */}
      <section className="site-container pb-16 sm:pb-20">
        <Reveal className="grid gap-6 border-t border-neutral-200 pt-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="eyebrow mb-3">Good to Know</p>
            <h2 className="section-title">Frequently asked<br />questions.</h2>
            <p className="mt-4 text-sm text-neutral-600">Everything you need to know about delivery, sizing, returns and shopping with RYVENO.</p>
            <Link href="/faq" className="btn-outline mt-7">Read the FAQ <ArrowRight size={14} /></Link>
          </div>
          <div className="divide-y divide-neutral-200">
            {faqs.slice(0, 3).map((f) => (
              <details key={f.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-bold">
                  {f.q}<ChevronRight size={16} className="shrink-0 transition-transform group-open:rotate-90" />
                </summary>
                <p className="mt-3 pr-6 text-sm leading-relaxed text-neutral-600">{f.a}</p>
              </details>
            ))}
          </div>
        </Reveal>
      </section>
    </>
  );
}

function BestSellerRail({ products: items }: { products: import("@/lib/types").Product[] }) {
  const scroller = useState<HTMLDivElement | null>(null);
  const ref = scroller[0];
  const setRef = scroller[1];
  const scroll = (dir: number) => ref?.scrollBy({ left: dir * 320, behavior: "smooth" });
  return (
    <div className="relative">
      <div ref={setRef} className="no-scrollbar -mx-5 flex snap-x gap-5 overflow-x-auto px-5 pb-2 sm:mx-0 sm:px-0">
        {items.map((p) => (
          <div key={p.id} className="min-w-[72vw] snap-start sm:min-w-[45%] lg:min-w-[23.5%]">
            <ProductCard product={p} />
          </div>
        ))}
      </div>
      <div className="mt-8 flex justify-center gap-2">
        <button onClick={() => scroll(-1)} aria-label="Previous" className="flex h-10 w-10 items-center justify-center border border-neutral-300 transition-colors hover:border-ink hover:bg-ink hover:text-white"><ChevronLeft size={17} /></button>
        <button onClick={() => scroll(1)} aria-label="Next" className="flex h-10 w-10 items-center justify-center border border-neutral-300 transition-colors hover:border-ink hover:bg-ink hover:text-white"><ChevronRight size={17} /></button>
      </div>
    </div>
  );
}
