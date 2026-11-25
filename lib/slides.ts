/**
 * Centralised hero campaign content.
 * Edit this file to change slides — no component changes required.
 */
export type HeroSlide = {
  id: string;
  eyebrow: string;
  headlineTop: string;
  headlineAccent: string;
  description: string;
  badge?: string;
  cta: string;
  href: string;
  secondary?: { label: string; href: string };
  image: string;
  align: "left" | "right" | "center";
  /** object-position for the campaign photograph */
  focus?: string;
};

export const heroSlides: HeroSlide[] = [
  {
    id: "new-arrivals",
    eyebrow: "The New Collection · 2026",
    headlineTop: "New Season.",
    headlineAccent: "New Statement.",
    description:
      "Discover the latest fashion trends, considered pieces and a new expression of everyday style — made to feel unmistakably yours.",
    cta: "Explore Now",
    href: "/collections/new-arrivals",
    secondary: { label: "Shop Men", href: "/collections/men" },
    image: "/models/pose.jpg",
    align: "left",
    focus: "center 50%",
  },
  {
    id: "special-discount",
    eyebrow: "Limited-Time Offer",
    headlineTop: "Style More.",
    headlineAccent: "Spend Less.",
    description:
      "The pieces you love, at prices you'll love more. Selected styles from the RYVENO edit, reduced for a limited time only.",
    badge: "Up to 50% Off",
    cta: "Shop Sale",
    href: "/collections/sale",
    secondary: { label: "View New Arrivals", href: "/collections/new-arrivals" },
    image: "/images/editorial.jpg",
    align: "right",
    focus: "center 40%",
  },
  {
    id: "mens-collection",
    eyebrow: "The Men's Edit",
    headlineTop: "Redefine",
    headlineAccent: "Your Style.",
    description:
      "Premium fashion for the modern man. Tailored silhouettes, considered fabrics and details that make every day feel intentional.",
    cta: "Explore Men",
    href: "/collections/men",
    secondary: { label: "Shop Shirts", href: "/collections/shirts" },
    image: "/models/pose-2.jpg",
    align: "left",
    focus: "center 40%",
  },
  {
    id: "womens-collection",
    eyebrow: "The Women's Edit",
    headlineTop: "Elegance in",
    headlineAccent: "Every Detail.",
    description:
      "Discover your signature look. Fluid silhouettes, refined finishes and effortless pieces designed to move with you.",
    cta: "Explore Women",
    href: "/collections/women",
    secondary: { label: "Shop Dresses", href: "/collections/dresses-kurtis" },
    image: "/images/hero-women.jpg",
    align: "right",
    focus: "center 22%",
  },
  {
    id: "exclusive-collection",
    eyebrow: "The Exclusive Edit",
    headlineTop: "Beyond",
    headlineAccent: "Ordinary.",
    description:
      "Experience the RYVENO lifestyle. A curated world of fashion, confidence and individuality — designed in Dhaka, made for everywhere.",
    badge: "Exclusive Collection",
    cta: "Discover Collection",
    href: "/collections/all",
    secondary: { label: "Our Story", href: "/about" },
    image: "/models/pose-1.jpg",
    align: "center",
    focus: "center 35%",
  },
];
