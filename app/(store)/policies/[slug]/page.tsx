"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { policyPages } from "@/lib/data";
import Reveal from "@/components/Reveal";

export default function PolicyPage() {
  const params = useParams();
  const slug = typeof params.slug === "string" ? params.slug : "";
  const page = policyPages[slug];

  if (!page) {
    return (
      <div className="site-container flex min-h-[60vh] flex-col items-center justify-center text-center">
        <h1 className="font-display text-3xl font-bold">Page not found</h1>
        <Link href="/" className="btn-dark mt-7">Back Home</Link>
      </div>
    );
  }

  return (
    <>
      <section className="relative h-[260px] overflow-hidden bg-ink">
        <img src="/images/editorial.jpg" alt="" className="absolute inset-0 h-full w-full object-cover opacity-45" />
        <div className="absolute inset-0 bg-black/55" />
        <div className="site-container relative flex h-full flex-col justify-center text-white">
          <p className="text-[11px] font-semibold uppercase tracking-wide2 text-sand">RYVENO Policies</p>
          <h1 className="mt-3 font-display text-4xl font-extrabold uppercase tracking-tight sm:text-5xl">{page.title}</h1>
        </div>
      </section>

      <div className="site-container grid gap-12 py-14 lg:grid-cols-[240px_1fr] lg:gap-16 lg:py-20">
        <aside className="h-fit border border-neutral-200 lg:sticky lg:top-28">
          <p className="border-b border-neutral-200 bg-cream px-5 py-4 text-[11px] font-bold uppercase tracking-wide2">All Policies</p>
          <nav className="flex flex-col p-2">
            {Object.entries(policyPages).map(([key, p]) => (
              <Link key={key} href={`/policies/${key}`} className={`px-3 py-3 text-[13px] font-medium transition-colors ${key === slug ? "bg-ink text-white" : "hover:bg-cream"}`}>{p.title}</Link>
            ))}
          </nav>
        </aside>

        <article className="max-w-3xl">
          <p className="text-xs text-neutral-500">Last updated: {page.updated}</p>
          <div className="mt-8 space-y-10">
            {page.sections.map((s, i) => (
              <Reveal key={s.h} delay={i * 50}>
                <h2 className="font-display text-xl font-bold uppercase tracking-tight">{s.h}</h2>
                <div className="mt-4 space-y-4 text-[14px] leading-[1.9] text-neutral-600">
                  {s.p.map((p) => <p key={p}>{p}</p>)}
                </div>
              </Reveal>
            ))}
          </div>
          <div className="mt-12 border-t border-neutral-200 pt-8">
            <p className="text-sm text-neutral-600">Questions about this policy?</p>
            <Link href="/contact" className="btn-dark mt-4">Contact Us</Link>
          </div>
        </article>
      </div>
    </>
  );
}
