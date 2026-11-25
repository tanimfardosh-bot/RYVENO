"use client";

import Link from "next/link";
import { useState } from "react";
import { Facebook, Instagram, Mail, MapPin, Phone, Send, Youtube } from "lucide-react";
import { storeContact } from "@/lib/supabase";
import { useToast } from "./Toast";

const columns = [
  {
    title: "Shop",
    links: [
      ["New Arrivals", "/collections/new-arrivals"],
      ["Best Sellers", "/collections/best-sellers"],
      ["Men", "/collections/men"],
      ["Women", "/collections/women"],
      ["Accessories", "/collections/accessories"],
      ["Sale", "/collections/sale"],
    ],
  },
  {
    title: "Customer Support",
    links: [
      ["Order Tracking", "/order-tracking"],
      ["FAQ", "/faq"],
      ["Contact Us", "/contact"],
      ["My Account", "/account"],
      ["Wishlist", "/wishlist"],
      ["Size Guide", "/faq#size"],
    ],
  },
  {
    title: "Policies",
    links: [
      ["Shipping & Delivery", "/policies/shipping"],
      ["Return & Exchange", "/policies/returns"],
      ["Privacy Policy", "/policies/privacy"],
      ["Terms & Conditions", "/policies/terms"],
    ],
  },
  {
    title: "Company",
    links: [
      ["About RYVENO", "/about"],
      ["Our Story", "/about#story"],
      ["Careers", "/about#careers"],
      ["Admin", "/admin"],
    ],
  },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const { notify } = useToast();

  const subscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) return notify("Please enter a valid email address.", "error");
    notify("You're on the list. Welcome to RYVENO!");
    setEmail("");
  };

  return (
    <footer className="bg-ink text-white">
      {/* Newsletter */}
      <div className="border-b border-white/10">
        <div className="site-container grid gap-8 py-14 md:grid-cols-2 md:items-center lg:py-16">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide2 text-sand">The RYVENO Edit</p>
            <h2 className="mt-3 font-display text-3xl font-extrabold uppercase leading-tight tracking-tight sm:text-4xl">Be the first to know.</h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-neutral-400">Get exclusive access to new collections, special offers and the latest from RYVENO.</p>
          </div>
          <form onSubmit={subscribe} className="flex w-full max-w-md flex-col gap-3 sm:flex-row md:justify-end">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              aria-label="Email address"
              className="h-13 flex-1 border border-white/25 bg-transparent px-4 text-sm text-white outline-none placeholder:text-neutral-500 focus:border-sand"
            />
            <button type="submit" className="btn-sand h-13 shrink-0"><Send size={14} /> Subscribe</button>
          </form>
        </div>
      </div>

      {/* Main footer */}
      <div className="site-container grid gap-12 py-14 lg:grid-cols-12 lg:py-20">
        <div className="lg:col-span-4">
          <Link href="/" className="inline-block font-display text-3xl font-extrabold tracking-brand">RYVENO</Link>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-neutral-400">
            Premium affordable fashion for a generation that believes style is personal. Designed in Dhaka, made for everywhere.
          </p>
          <div className="mt-7 space-y-3 text-sm text-neutral-300">
            <p className="flex items-start gap-3"><MapPin size={16} className="mt-0.5 shrink-0 text-sand" />{storeContact.address}</p>
            <p className="flex items-center gap-3"><Phone size={16} className="shrink-0 text-sand" />{storeContact.phone}</p>
            <p className="flex items-center gap-3"><Mail size={16} className="shrink-0 text-sand" />{storeContact.email}</p>
          </div>
          <div className="mt-7 flex gap-3">
            {[
              { href: storeContact.facebook, icon: Facebook, label: "Facebook" },
              { href: storeContact.instagram, icon: Instagram, label: "Instagram" },
              { href: `https://wa.me/${storeContact.whatsapp}`, icon: Phone, label: "WhatsApp" },
              { href: storeContact.instagram, icon: Youtube, label: "YouTube" },
            ].map(({ href, icon: Icon, label }) => (
              <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label} className="flex h-9 w-9 items-center justify-center border border-white/20 transition-colors hover:border-sand hover:bg-sand hover:text-ink">
                <Icon size={15} />
              </a>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:col-span-8">
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="mb-5 text-[10px] font-bold uppercase tracking-wide2 text-sand">{col.title}</h3>
              <ul className="space-y-3">
                {col.links.map(([label, href]) => (
                  <li key={label}>
                    <Link href={href} className="text-[13px] text-neutral-300 transition-colors hover:text-white">{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Payment + bottom */}
      <div className="border-t border-white/10">
        <div className="site-container flex flex-col gap-4 py-6 text-[11px] text-neutral-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} RYVENO. All rights reserved. Wear Your Identity.</p>
          <div className="flex flex-wrap items-center gap-2">
            {["VISA", "Mastercard", "bKash", "Nagad", "COD", "SSLCommerz"].map((p) => (
              <span key={p} className="border border-white/15 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wider text-neutral-300">{p}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
