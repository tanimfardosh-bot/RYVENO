"use client";

import Link from "next/link";
import { ArrowRight, Compass, Heart, Leaf, Sparkles } from "lucide-react";
import Reveal from "@/components/Reveal";
import ModelPhoto from "@/components/ModelPhoto";

const values = [
  { icon: Sparkles, title: "Considered Design", text: "Every piece starts with a point of view. Clean lines, honest detailing and silhouettes that feel current without chasing trends." },
  { icon: Heart, title: "Made for Real Life", text: "Comfort is not a compromise. Fabrics are chosen for how they feel at 9am and how they hold up at 9pm." },
  { icon: Compass, title: "Accessibly Premium", text: "Quality should not be exclusive. We keep our pricing honest so more people can dress with confidence." },
  { icon: Leaf, title: "Mindful Choices", text: "We favour durable construction and responsible sourcing — pieces made to stay in your wardrobe, not landfills." },
];

const milestones = [
  { year: "2026", title: "The Beginning", text: "RYVENO is founded in Dhaka with a simple idea: premium fashion should feel personal and stay within reach." },
  { year: "2026", title: "First Collection", text: "A focused edit of tees, shirts and everyday layers launches online and resonates with a new generation." },
  { year: "Now", title: "Nationwide", text: "Delivery reaches all 64 districts, and the RYVENO community grows across Bangladesh." },
];

export default function AboutPage() {
  return (
    <>
      <section className="relative h-[380px] overflow-hidden bg-ink sm:h-[460px]">
        <img src="/images/story.jpg" alt="RYVENO studio" className="absolute inset-0 h-full w-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-black/55" />
        <div className="site-container relative flex h-full flex-col justify-center text-white">
          <p className="text-[11px] font-semibold uppercase tracking-wide2 text-sand">About RYVENO</p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-extrabold uppercase leading-[1.05] tracking-tight sm:text-6xl">More than just fashion.</h1>
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-white/75">A generation that believes style is personal. We build modern everyday fashion around confidence, comfort and individuality.</p>
        </div>
      </section>

      <section id="story" className="site-container grid items-center gap-12 py-16 sm:py-20 lg:grid-cols-2 lg:gap-20 lg:py-28">
        <Reveal className="relative aspect-[4/5] overflow-hidden bg-cream">
          <ModelPhoto alt="RYVENO brand story" fallback="/images/hero-men.jpg" className="h-full w-full object-cover" />
        </Reveal>
        <Reveal delay={100}>
          <p className="eyebrow mb-3">Our Story</p>
          <h2 className="section-title">Wear your identity.</h2>
          <p className="mt-6 text-[15px] leading-[1.9] text-neutral-600">RYVENO represents a generation that believes style is personal. We create modern everyday fashion that combines confidence, comfort, and individuality.</p>
          <p className="mt-4 text-[15px] leading-[1.9] text-neutral-600">We started in Dhaka because we saw a gap between what young people wanted to wear and what was actually available — either overpriced or forgettable. RYVENO is our answer: thoughtfully designed pieces, made with care, priced with respect.</p>
          <p className="mt-4 text-[15px] leading-[1.9] text-neutral-600">Our name is a promise. To keep evolving, to keep it real, and to help you wear your identity — wherever life takes you.</p>
          <Link href="/collections/all" className="btn-dark mt-8">Explore the Collection <ArrowRight size={14} /></Link>
        </Reveal>
      </section>

      <section className="bg-cream py-16 sm:py-20 lg:py-24">
        <div className="site-container">
          <Reveal className="mb-12 text-center"><p className="eyebrow mb-3">What we stand for</p><h2 className="section-title">The RYVENO Way</h2></Reveal>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map(({ icon: Icon, title, text }, i) => (
              <Reveal key={title} delay={i * 70} className="border-t-2 border-ink bg-white p-7">
                <Icon size={26} strokeWidth={1.3} className="text-sand" />
                <h3 className="mt-5 font-display text-base font-bold uppercase tracking-wide">{title}</h3>
                <p className="mt-3 text-[13px] leading-relaxed text-neutral-600">{text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="site-container py-16 sm:py-20 lg:py-24">
        <Reveal className="mb-12"><p className="eyebrow mb-3">Our journey</p><h2 className="section-title">Where we&apos;re headed</h2></Reveal>
        <div className="grid gap-8 md:grid-cols-3">
          {milestones.map((m, i) => (
            <Reveal key={m.title} delay={i * 80} className="relative border-l border-neutral-300 pl-7">
              <span className="absolute -left-[5px] top-1 h-2.5 w-2.5 rounded-full bg-sand" />
              <p className="font-display text-2xl font-extrabold text-sand">{m.year}</p>
              <h3 className="mt-2 font-display text-lg font-bold">{m.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-neutral-600">{m.text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="careers" className="border-t border-neutral-200 bg-cream py-14">
        <div className="site-container flex flex-wrap items-center justify-between gap-6">
          <div><p className="eyebrow mb-2">Join us</p><h2 className="font-display text-2xl font-bold uppercase sm:text-3xl">Build the future of Bangladeshi fashion.</h2></div>
          <Link href="/contact" className="btn-dark">Get in Touch <ArrowRight size={14} /></Link>
        </div>
      </section>
    </>
  );
}
