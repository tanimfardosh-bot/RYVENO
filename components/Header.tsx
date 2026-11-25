"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Heart, Menu, Search, ShoppingBag, User, X, ChevronRight,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { usePathname } from "next/navigation";

const nav = [
  { label: "New Arrivals", href: "/collections/new-arrivals" },
  { label: "Men", href: "/collections/men", mega: "men" },
  { label: "Women", href: "/collections/women", mega: "women" },
  { label: "Collections", href: "/collections/all", mega: "collections" },
  { label: "Accessories", href: "/collections/accessories" },
  { label: "Sale", href: "/collections/sale", sale: true },
];

const megaData: Record<string, { title: string; links: { label: string; href: string }[] }[]> = {
  men: [
    {
      title: "Shop by Category",
      links: [
        { label: "T-Shirts", href: "/collections/t-shirts" },
        { label: "Shirts", href: "/collections/shirts" },
        { label: "Jeans & Trousers", href: "/collections/jeans-trousers" },
        { label: "Hoodies & Sweatshirts", href: "/collections/hoodies-sweatshirts" },
        { label: "Outerwear", href: "/collections/outerwear" },
        { label: "Accessories", href: "/collections/accessories" },
      ],
    },
    {
      title: "Collections",
      links: [
        { label: "New Arrivals", href: "/collections/new-arrivals" },
        { label: "Best Sellers", href: "/collections/best-sellers" },
        { label: "The Sale Edit", href: "/collections/sale" },
        { label: "Shop All Men", href: "/collections/men" },
      ],
    },
    {
      title: "Discover",
      links: [
        { label: "Our Story", href: "/about" },
        { label: "Size Guide", href: "/faq#size" },
        { label: "Order Tracking", href: "/order-tracking" },
        { label: "Contact Us", href: "/contact" },
      ],
    },
  ],
  women: [
    {
      title: "Shop by Category",
      links: [
        { label: "Dresses & Kurtis", href: "/collections/dresses-kurtis" },
        { label: "T-Shirts", href: "/collections/t-shirts" },
        { label: "Shirts", href: "/collections/shirts" },
        { label: "Jeans & Trousers", href: "/collections/jeans-trousers" },
        { label: "Hoodies & Sweatshirts", href: "/collections/hoodies-sweatshirts" },
        { label: "Accessories", href: "/collections/accessories" },
      ],
    },
    {
      title: "Collections",
      links: [
        { label: "New Arrivals", href: "/collections/new-arrivals" },
        { label: "Best Sellers", href: "/collections/best-sellers" },
        { label: "The Sale Edit", href: "/collections/sale" },
        { label: "Shop All Women", href: "/collections/women" },
      ],
    },
    {
      title: "Discover",
      links: [
        { label: "Our Story", href: "/about" },
        { label: "Size Guide", href: "/faq#size" },
        { label: "Order Tracking", href: "/order-tracking" },
        { label: "Contact Us", href: "/contact" },
      ],
    },
  ],
  collections: [
    {
      title: "Shop",
      links: [
        { label: "New Arrivals", href: "/collections/new-arrivals" },
        { label: "Best Sellers", href: "/collections/best-sellers" },
        { label: "T-Shirts", href: "/collections/t-shirts" },
        { label: "Shirts", href: "/collections/shirts" },
      ],
    },
    {
      title: "Shop",
      links: [
        { label: "Jeans & Trousers", href: "/collections/jeans-trousers" },
        { label: "Hoodies & Sweatshirts", href: "/collections/hoodies-sweatshirts" },
        { label: "Dresses & Kurtis", href: "/collections/dresses-kurtis" },
        { label: "Accessories", href: "/collections/accessories" },
      ],
    },
    {
      title: "More",
      links: [
        { label: "View All", href: "/collections/all" },
        { label: "Sale", href: "/collections/sale" },
        { label: "Our Story", href: "/about" },
      ],
    },
  ],
};

export default function Header() {
  const { cartCount, wishlist, user, setCartOpen, setSearchOpen } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const [mega, setMega] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMega(null);
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      {/* Announcement bar */}
      <div className="relative overflow-hidden bg-ink py-2.5 text-white">
        <div className="ticker-track items-center">
          {[0, 1].map((i) => (
            <div key={i} className="flex shrink-0 items-center">
              {["INTRODUCING THE NEW RYVENO COLLECTION", "WEAR YOUR IDENTITY", "FREE DELIVERY ON ORDERS OVER ৳3,000", "NATIONWIDE DELIVERY ACROSS BANGLADESH"].map((t) => (
                <span key={t} className="flex items-center text-[10px] font-semibold uppercase tracking-wide2">
                  <span className="mx-6 text-sand">✦</span>{t}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Header */}
      <header
        className={`sticky top-0 z-50 border-b bg-white/95 backdrop-blur-md transition-shadow duration-300 ${scrolled ? "border-neutral-200 shadow-[0_4px_24px_rgba(0,0,0,.06)]" : "border-transparent"}`}
        onMouseLeave={() => setMega(null)}
      >
        <div className="site-container flex h-[72px] items-center justify-between gap-6 lg:h-[84px]">
          {/* Left: logo + mobile toggle */}
          <div className="flex flex-1 items-center gap-3">
            <button className="-ml-1 p-1 lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Open menu">
              <Menu size={22} strokeWidth={1.6} />
            </button>
            <Link href="/" className="group inline-flex flex-col leading-none" aria-label="RYVENO home">
              <span className="font-display text-[22px] font-extrabold tracking-brand text-ink transition-colors group-hover:text-sand sm:text-[26px]">RYVENO</span>
              <span className="mt-1 hidden text-[7px] font-semibold uppercase tracking-[0.42em] text-neutral-400 sm:block">Wear Your Identity</span>
            </Link>
          </div>

          {/* Center: nav */}
          <nav className="hidden items-center gap-7 lg:flex xl:gap-9" aria-label="Main navigation">
            {nav.map((item) => (
              <div key={item.label} className="relative" onMouseEnter={() => setMega(item.mega ?? null)}>
                <Link
                  href={item.href}
                  className={`relative py-8 text-[11px] font-bold uppercase tracking-wide2 transition-colors hover:text-sand ${item.sale ? "text-[#a4343f]" : "text-ink"} ${pathname.startsWith(item.href) ? "text-sand" : ""}`}
                >
                  {item.label}
                </Link>
              </div>
            ))}
          </nav>

          {/* Right: icons */}
          <div className="flex flex-1 items-center justify-end gap-1 sm:gap-2">
            <button onClick={() => setSearchOpen(true)} className="p-2 transition-colors hover:text-sand" aria-label="Search">
              <Search size={20} strokeWidth={1.6} />
            </button>
            <Link href={user ? "/account" : "/login"} className="hidden p-2 transition-colors hover:text-sand sm:block" aria-label="Account">
              <User size={20} strokeWidth={1.6} />
            </Link>
            <Link href="/wishlist" className="relative p-2 transition-colors hover:text-sand" aria-label="Wishlist">
              <Heart size={20} strokeWidth={1.6} />
              {wishlist.length > 0 && (
                <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-ink px-1 text-[9px] font-bold text-white">{wishlist.length}</span>
              )}
            </Link>
            <button onClick={() => setCartOpen(true)} className="relative p-2 transition-colors hover:text-sand" aria-label="Shopping bag">
              <ShoppingBag size={20} strokeWidth={1.6} />
              {cartCount > 0 && (
                <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-sand px-1 text-[9px] font-bold text-white">{cartCount}</span>
              )}
            </button>
          </div>
        </div>

        {/* Mega menu */}
        {mega && (
          <div className="absolute inset-x-0 top-full hidden border-t border-neutral-100 bg-white shadow-[0_24px_50px_rgba(0,0,0,.1)] lg:block" onMouseEnter={() => setMega(mega)}>
            <div className="site-container grid grid-cols-12 gap-8 py-10">
              <div className="col-span-9 grid grid-cols-3 gap-8">
                {megaData[mega].map((col) => (
                  <div key={col.title}>
                    <h3 className="mb-5 text-[10px] font-bold uppercase tracking-wide2 text-sand">{col.title}</h3>
                    <ul className="space-y-3">
                      {col.links.map((l) => (
                        <li key={l.label}>
                          <Link href={l.href} className="group flex items-center justify-between text-[13px] font-medium text-coal transition-colors hover:text-sand">
                            {l.label}
                            <ChevronRight size={13} className="opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <div className="col-span-3 relative h-[220px] overflow-hidden bg-cream">
                <img src="/images/lifestyle-2.jpg" alt="RYVENO campaign" className="h-full w-full object-cover img-hover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <p className="text-[10px] font-semibold uppercase tracking-wide2">The Edit</p>
                  <p className="mt-1 font-display text-lg font-bold">Wear Your Identity</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-white lg:hidden">
          <div className="flex h-16 items-center justify-between border-b px-5">
            <span className="font-display text-xl font-extrabold tracking-brand">RYVENO</span>
            <button onClick={() => setMobileOpen(false)} aria-label="Close menu"><X size={24} strokeWidth={1.5} /></button>
          </div>
          <div className="flex-1 overflow-y-auto px-5 py-6">
            <p className="eyebrow mb-4">Shop</p>
            <ul className="space-y-1">
              {nav.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="flex items-center justify-between border-b border-neutral-100 py-3.5 font-display text-2xl font-bold uppercase tracking-tight">
                    {item.label}<ChevronRight size={18} className="text-neutral-400" />
                  </Link>
                </li>
              ))}
            </ul>
            <p className="eyebrow mb-4 mt-9">More</p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm font-medium">
              {[
                ["/about", "Our Story"], ["/contact", "Contact"], ["/faq", "FAQ"],
                ["/order-tracking", "Track Order"], ["/account", "My Account"], ["/wishlist", "Wishlist"],
                ["/policies/shipping", "Shipping"], ["/policies/returns", "Returns"],
              ].map(([href, label]) => (
                <Link key={href} href={href} className="py-2 text-coal hover:text-sand">{label}</Link>
              ))}
            </div>
            <div className="mt-10 border-t border-neutral-200 pt-6 text-xs text-neutral-500">
              <p className="font-semibold text-ink">Need help?</p>
              <p className="mt-1">WhatsApp +880 1700-000000</p>
              <p>hello@ryveno.com</p>
            </div>
          </div>
          <div className="border-t p-5">
            <Link href="/login" className="btn-dark w-full">Sign In / Register</Link>
          </div>
        </div>
      )}
    </>
  );
}
