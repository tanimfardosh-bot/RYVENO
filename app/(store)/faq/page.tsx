"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown, MessageCircle } from "lucide-react";
import { faqs } from "@/lib/data";

const sizeGuide = [
  { size: "XS", chest: '34"', waist: '28"', length: '26"' },
  { size: "S", chest: '36"', waist: '30"', length: '27"' },
  { size: "M", chest: '38"', waist: '32"', length: '28"' },
  { size: "L", chest: '40"', waist: '34"', length: '29"' },
  { size: "XL", chest: '42"', waist: '36"', length: '30"' },
  { size: "XXL", chest: '44"', waist: '38"', length: '31"' },
];

export default function FAQPage() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <>
      <section className="relative h-[280px] overflow-hidden bg-ink">
        <img src="/images/lifestyle-1.jpg" alt="" className="absolute inset-0 h-full w-full object-cover opacity-45" />
        <div className="absolute inset-0 bg-black/55" />
        <div className="site-container relative flex h-full flex-col justify-center text-white">
          <p className="text-[11px] font-semibold uppercase tracking-wide2 text-sand">Good to know</p>
          <h1 className="mt-3 font-display text-4xl font-extrabold uppercase tracking-tight sm:text-5xl">Frequently Asked Questions</h1>
        </div>
      </section>

      <div className="site-container grid gap-12 py-14 lg:grid-cols-[1fr_320px] lg:gap-16 lg:py-20">
        <div>
          <p className="eyebrow mb-3">Answers, simplified</p>
          <h2 className="section-title mb-8">Everything you need to know.</h2>
          <div className="divide-y divide-neutral-200 border-y border-neutral-200">
            {faqs.map((f, i) => (
              <div key={f.q}>
                <button onClick={() => setOpen(open === i ? null : i)} className="flex w-full items-center justify-between gap-4 py-5 text-left text-sm font-bold">
                  {f.q}<ChevronDown size={17} className={`shrink-0 transition-transform ${open === i ? "rotate-180" : ""}`} />
                </button>
                {open === i && <p className="pb-6 pr-8 text-sm leading-[1.9] text-neutral-600">{f.a}</p>}
              </div>
            ))}
          </div>
        </div>

        <aside className="space-y-6">
          <div id="size" className="border border-neutral-200 bg-cream p-6">
            <h3 className="font-display text-lg font-bold uppercase">Size Guide</h3>
            <p className="mt-2 text-xs text-neutral-500">Measurements in inches. Size up for a relaxed fit.</p>
            <div className="mt-5 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead><tr className="border-b border-ink"><th className="py-2">Size</th><th>Chest</th><th>Waist</th><th>Length</th></tr></thead>
                <tbody>{sizeGuide.map((r) => <tr key={r.size} className="border-b border-neutral-200"><td className="py-2.5 font-bold">{r.size}</td><td>{r.chest}</td><td>{r.waist}</td><td>{r.length}</td></tr>)}</tbody>
              </table>
            </div>
          </div>
          <div className="bg-ink p-6 text-white">
            <MessageCircle size={24} strokeWidth={1.3} className="text-sand" />
            <h3 className="mt-4 font-display text-lg font-bold">Still need help?</h3>
            <p className="mt-2 text-xs leading-relaxed text-neutral-400">Chat with us on WhatsApp — we typically reply within a few hours.</p>
            <a href="https://wa.me/8801700000000" target="_blank" rel="noreferrer" className="btn-light mt-5 w-full">WhatsApp Us</a>
            <Link href="/contact" className="mt-3 block text-center text-[11px] font-bold uppercase tracking-wide2 text-sand hover:underline">Or use the contact form →</Link>
          </div>
        </aside>
      </div>
    </>
  );
}
