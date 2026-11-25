"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { heroSlides } from "@/lib/slides";

const DURATION = 5000;
const TOTAL = heroSlides.length;

export default function HeroSlider() {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState<"right" | "left">("right");
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const reducedMotion = useRef(false);
  const slide = heroSlides[active];

  useEffect(() => {
    reducedMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const onVisibility = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  const goTo = useCallback((index: number, dir?: "right" | "left") => {
    const target = (index + TOTAL) % TOTAL;
    setDirection(dir ?? (index > active ? "right" : "left"));
    setActive(target);
  }, [active]);

  const nextSlide = useCallback(() => goTo(active + 1, "right"), [active, goTo]);
  const prevSlide = useCallback(() => goTo(active - 1, "left"), [active, goTo]);

  // Autoplay — resets whenever the active slide changes or interaction pauses it.
  useEffect(() => {
    if (paused || reducedMotion.current) return;
    const id = window.setTimeout(() => {
      setDirection("right");
      setActive((a) => (a + 1) % TOTAL);
    }, DURATION);
    return () => window.clearTimeout(id);
  }, [active, paused]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    setPaused(true);
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    setPaused(false);
    if (Math.abs(delta) > 45) (delta < 0 ? nextSlide : prevSlide)();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") { e.preventDefault(); nextSlide(); }
    if (e.key === "ArrowLeft") { e.preventDefault(); prevSlide(); }
  };

  // Only the current slide and its neighbours load their imagery.
  const visibleImages = new Set([active, (active + 1) % TOTAL, (active - 1 + TOTAL) % TOTAL]);
  const isRight = slide.align === "right";
  const isCenter = slide.align === "center";
  const isDiscount = Boolean(slide.badge?.toLowerCase().includes("off"));

  return (
    <section
      aria-roledescription="carousel"
      aria-label="RYVENO featured campaigns"
      tabIndex={0}
      onKeyDown={onKeyDown}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      className="relative h-[86svh] min-h-[580px] max-h-[920px] overflow-hidden bg-ink outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-sand sm:min-h-[640px]"
    >
      <span className="sr-only" aria-live="polite">
        {`Slide ${active + 1} of ${TOTAL}: ${slide.headlineTop} ${slide.headlineAccent}`}
      </span>

      {/* Photographs + overlays */}
      {heroSlides.map((item, i) => {
        const isActive = i === active;
        return (
          <div
            key={item.id}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${TOTAL}: ${item.eyebrow}`}
            aria-hidden={!isActive}
            className={`absolute inset-0 transition-opacity duration-[1000ms] ease-out ${isActive ? "z-10 opacity-100" : "pointer-events-none z-0 opacity-0"}`}
          >
            {visibleImages.has(i) && (
              <img
                src={item.image}
                alt=""
                loading={i === active ? "eager" : "lazy"}
                className={`absolute inset-0 h-full w-full object-cover ${isActive ? "hero-zoom" : ""}`}
                style={{ objectPosition: item.focus ?? "center" }}
              />
            )}
            <div
              className={`absolute inset-0 ${
                item.align === "right"
                  ? "bg-gradient-to-l from-black/90 via-black/50 to-transparent"
                  : item.align === "center"
                    ? "bg-black/50"
                    : "bg-gradient-to-r from-black/90 via-black/50 to-transparent"
              }`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/25" />
          </div>
        );
      })}

      {/* Campaign copy */}
      <div
        className={`site-container relative z-20 flex h-full items-center pb-20 pt-16 ${
          isRight ? "justify-end text-right" : isCenter ? "justify-center text-center" : "justify-start"
        }`}
      >
        <div
          key={slide.id}
          className={`${isCenter ? "max-w-4xl" : "max-w-2xl"} ${isRight ? "pr-14 sm:pr-20" : isCenter ? "" : "pl-14 sm:pl-20"} ${direction === "right" ? "hero-in-right" : "hero-in-left"}`}
        >
          <div
            className={`hero-rise mb-6 flex items-center gap-3 ${isRight ? "justify-end" : ""} ${isCenter ? "justify-center" : ""}`}
            style={{ animationDelay: "90ms" }}
          >
            {!isCenter && !isRight && <span className="h-px w-10 bg-sand" />}
            <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-sand sm:text-[11px]">{slide.eyebrow}</span>
            {isRight && <span className="h-px w-10 bg-sand" />}
          </div>

          {slide.badge && (
            <div className={`hero-rise mb-6 ${isCenter ? "flex justify-center" : isRight ? "flex justify-end" : ""}`} style={{ animationDelay: "170ms" }}>
              <span
                className={`inline-flex items-center border px-4 py-2 text-[10px] font-extrabold uppercase tracking-[0.2em] sm:text-[11px] ${
                  isDiscount ? "border-sand bg-sand text-white" : "border-sand text-sand"
                }`}
              >
                {slide.badge}
              </span>
            </div>
          )}

          <h1
            className="hero-rise font-display text-[clamp(2.6rem,6.8vw,6.4rem)] font-extrabold uppercase leading-[0.9] tracking-[-0.035em] text-white"
            style={{ animationDelay: "250ms" }}
          >
            {slide.headlineTop}
            <br />
            <span className="text-sand">{slide.headlineAccent}</span>
          </h1>

          <p
            className={`hero-rise mt-7 text-sm leading-relaxed text-white/80 sm:text-base ${
              isCenter ? "mx-auto max-w-xl" : isRight ? "ml-auto max-w-md" : "max-w-md"
            }`}
            style={{ animationDelay: "350ms" }}
          >
            {slide.description}
          </p>

          <div
            className={`hero-rise mt-9 flex flex-wrap gap-3 ${isCenter ? "justify-center" : isRight ? "justify-end" : ""}`}
            style={{ animationDelay: "450ms" }}
          >
            <Link href={slide.href} className={isDiscount ? "btn-sand" : "btn-light"}>
              {slide.cta} <ArrowUpRight size={14} />
            </Link>
            {slide.secondary && (
              <Link
                href={slide.secondary.href}
                className="btn border-white/60 bg-transparent text-white hover:bg-white hover:text-ink"
              >
                {slide.secondary.label}
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Side arrows */}
      <button
        type="button"
        onClick={prevSlide}
        aria-label="Previous campaign"
        className="group absolute left-3 top-1/2 z-30 flex h-11 w-11 -translate-y-1/2 items-center justify-center border border-white/40 bg-black/25 text-white backdrop-blur-sm transition-all duration-300 hover:border-white hover:bg-white hover:text-ink sm:left-6 sm:h-12 sm:w-12"
      >
        <ChevronLeft size={20} strokeWidth={1.5} className="transition-transform group-hover:-translate-x-0.5" />
      </button>
      <button
        type="button"
        onClick={nextSlide}
        aria-label="Next campaign"
        className="group absolute right-3 top-1/2 z-30 flex h-11 w-11 -translate-y-1/2 items-center justify-center border border-white/40 bg-black/25 text-white backdrop-blur-sm transition-all duration-300 hover:border-white hover:bg-white hover:text-ink sm:right-6 sm:h-12 sm:w-12"
      >
        <ChevronRight size={20} strokeWidth={1.5} className="transition-transform group-hover:translate-x-0.5" />
      </button>

      {/* Progress pagination */}
      <div className="absolute bottom-7 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2" role="tablist" aria-label="Choose campaign">
        {heroSlides.map((item, i) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={i === active}
            aria-label={`Go to slide ${i + 1}: ${item.eyebrow}`}
            onClick={() => goTo(i, i > active ? "right" : "left")}
            className="relative h-1.5 w-7 overflow-hidden bg-white/35 transition-all duration-300 hover:bg-white/60 sm:w-10"
          >
            {i === active && (
              <span
                className="hero-progress absolute inset-0 bg-sand"
                style={{ animationPlayState: paused ? "paused" : "running" }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Slide counter */}
      <div className="absolute bottom-6 right-6 z-30 hidden items-baseline gap-2 text-white sm:flex">
        <span className="font-display text-2xl font-extrabold">{String(active + 1).padStart(2, "0")}</span>
        <span className="text-[10px] font-semibold tracking-wide2 text-white/50">/ {String(TOTAL).padStart(2, "0")}</span>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-7 left-6 z-30 hidden items-center gap-2 text-[9px] font-bold uppercase tracking-[0.2em] text-white/55 lg:flex">
        <ArrowDown size={14} className="animate-bounce" /> Scroll to discover
      </div>
    </section>
  );
}
