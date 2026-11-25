"use client";

import Link from "next/link";
import { useState } from "react";
import { Clock, Mail, MapPin, MessageCircle, Phone, Send } from "lucide-react";
import { storeContact } from "@/lib/supabase";
import { useToast } from "@/components/Toast";

export default function ContactPage() {
  const { notify } = useToast();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email.includes("@") || !form.message) return notify("Please complete the required fields.", "error");
    notify("Message sent! We'll get back to you shortly.");
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  const cards = [
    { icon: MessageCircle, title: "WhatsApp", lines: [storeContact.whatsapp, "Fastest way to reach us"], href: `https://wa.me/${storeContact.whatsapp}` },
    { icon: Mail, title: "Email", lines: [storeContact.email, "We reply within a few hours"], href: `mailto:${storeContact.email}` },
    { icon: Phone, title: "Phone", lines: [storeContact.phone, "Sat–Thu, 10am–7pm"], href: `tel:${storeContact.whatsapp}` },
    { icon: MapPin, title: "Studio", lines: [storeContact.address, "Visits by appointment"], href: undefined },
  ];

  return (
    <>
      <section className="relative h-[300px] overflow-hidden bg-ink">
        <img src="/images/lifestyle-3.jpg" alt="" className="absolute inset-0 h-full w-full object-cover opacity-50" />
        <div className="absolute inset-0 bg-black/55" />
        <div className="site-container relative flex h-full flex-col justify-center text-white">
          <p className="text-[11px] font-semibold uppercase tracking-wide2 text-sand">We&apos;re here for you</p>
          <h1 className="mt-3 font-display text-4xl font-extrabold uppercase tracking-tight sm:text-5xl">Contact RYVENO</h1>
          <p className="mt-3 max-w-lg text-sm text-white/70">Questions about a product, an order or anything else? Reach out — we&apos;d love to hear from you.</p>
        </div>
      </section>

      <div className="site-container py-14 lg:py-20">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map(({ icon: Icon, title, lines, href }) => {
            const inner = (
              <>
                <Icon size={22} strokeWidth={1.3} className="text-sand" />
                <h2 className="mt-5 text-[11px] font-bold uppercase tracking-wide2">{title}</h2>
                <p className="mt-3 text-[13px] font-bold">{lines[0]}</p>
                <p className="mt-1 text-xs text-neutral-500">{lines[1]}</p>
              </>
            );
            return href ? (
              <a key={title} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="border border-neutral-200 p-6 transition-colors hover:border-ink">{inner}</a>
            ) : (
              <div key={title} className="border border-neutral-200 p-6">{inner}</div>
            );
          })}
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="eyebrow mb-3">Send a message</p>
            <h2 className="section-title">Let&apos;s talk.</h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-neutral-600">Fill in the form and our customer care team will get back to you as soon as possible.</p>
            <form onSubmit={submit} className="mt-8 space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div><label className="mb-2 block text-[11px] font-bold uppercase tracking-wide2">Your Name *</label><input className="field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Full name" /></div>
                <div><label className="mb-2 block text-[11px] font-bold uppercase tracking-wide2">Email Address *</label><input className="field" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" /></div>
              </div>
              <div><label className="mb-2 block text-[11px] font-bold uppercase tracking-wide2">Subject</label><input className="field" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="What is this about?" /></div>
              <div><label className="mb-2 block text-[11px] font-bold uppercase tracking-wide2">Message *</label><textarea className="field" rows={6} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Tell us more…" /></div>
              <button type="submit" className="btn-dark"><Send size={14} /> Send Message</button>
            </form>
          </div>

          <div className="space-y-6">
            <div className="relative h-72 overflow-hidden bg-cream">
              <img src="/images/story.jpg" alt="RYVENO studio in Dhaka" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-5 left-5 text-white"><p className="text-[10px] font-semibold uppercase tracking-wide2 text-sand">Visit us</p><p className="mt-1 font-display text-lg font-bold">Dhaka, Bangladesh</p></div>
            </div>
            <div className="border border-neutral-200 p-7">
              <p className="flex items-center gap-2 text-sm font-bold uppercase"><Clock size={17} className="text-sand" /> Business Hours</p>
              <div className="mt-5 space-y-2 text-sm text-neutral-600">
                <div className="flex justify-between"><span>Saturday – Thursday</span><span className="font-semibold text-ink">10:00 – 19:00</span></div>
                <div className="flex justify-between"><span>Friday</span><span className="font-semibold text-ink">Closed</span></div>
              </div>
              <p className="mt-5 border-t border-neutral-200 pt-5 text-xs leading-relaxed text-neutral-500">For order-related queries, WhatsApp is the fastest route. For returns and exchanges, include your tracking number.</p>
              <Link href="/faq" className="mt-4 inline-block text-[11px] font-bold uppercase tracking-wide2 text-sand hover:underline">Browse FAQ →</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
