import type { Gender, Product, ProductColor } from "./types";

const img = (name: string) => `/images/${name}.jpg`;

const PALETTE: Record<string, ProductColor> = {
  black: { name: "Black", hex: "#111111" },
  white: { name: "White", hex: "#F7F7F5" },
  beige: { name: "Beige", hex: "#B69A72" },
  navy: { name: "Navy", hex: "#24324a" },
  grey: { name: "Heather Grey", hex: "#9a9a98" },
  olive: { name: "Olive", hex: "#5c6148" },
  brown: { name: "Coffee", hex: "#5a3c2e" },
  blue: { name: "Indigo Blue", hex: "#3b5a86" },
  burgundy: { name: "Burgundy", hex: "#6b2130" },
  sand: { name: "Sand", hex: "#d8c6a5" },
  rose: { name: "Dusty Rose", hex: "#b98383" },
};

const sizesByCategory: Record<string, string[]> = {
  "t-shirts": ["S", "M", "L", "XL", "XXL"],
  shirts: ["S", "M", "L", "XL", "XXL"],
  "jeans-trousers": ["30", "32", "34", "36", "38"],
  "hoodies-sweatshirts": ["S", "M", "L", "XL"],
  accessories: ["One Size"],
  "dresses-kurtis": ["XS", "S", "M", "L", "XL"],
  outerwear: ["S", "M", "L", "XL"],
};

const descriptionByCategory: Record<string, string> = {
  "t-shirts": "The {name} is cut from breathable, pre-shrunk cotton jersey with a clean shoulder line and a relaxed everyday fit. Reinforced neckline and double-stitched hems keep its shape wash after wash — an effortless staple built for Dhaka days and beyond.",
  shirts: "The {name} brings a sharp, modern line to everyday dressing. Woven from a soft, easy-care fabric with a tailored silhouette, it moves from the office to an evening out without missing a beat. Thoughtful detailing, confident simplicity.",
  "jeans-trousers": "The {name} is engineered for comfort and a clean drape. With a considered rise, tapered leg and durable stretch fabric, it delivers all-day ease without compromising on a refined, contemporary profile.",
  "hoodies-sweatshirts": "The {name} is made from a substantial cotton-fleece blend that feels soft against the skin and holds its structure. A relaxed fit, ribbed cuffs and a brushed inner face make it your go-to layer for cooler evenings and travel.",
  accessories: "The {name} is the finishing touch that pulls a look together. Designed with clean lines and durable materials, it balances everyday practicality with the quiet confidence of considered design.",
  "dresses-kurtis": "The {name} pairs an easy, flattering silhouette with thoughtful detailing and a soft hand-feel. Designed to move with you, it transitions seamlessly from daytime plans to evening occasions.",
  outerwear: "The {name} is a statement layer built around clean structure and confident proportions. Cut with precision and finished with considered details, it lifts any outfit instantly.",
};

const detailsByCategory: Record<string, string[]> = {
  "t-shirts": ["100% combed cotton, 180 GSM", "Pre-shrunk & bio-washed", "Relaxed regular fit", "Machine wash cold, inside out"],
  shirts: ["Cotton-rich woven fabric", "Tailored regular fit", "Full-length button placket", "Machine wash cold, warm iron"],
  "jeans-trousers": ["Cotton stretch denim / twill", "Mid-rise, tapered leg", "Reinforced seams", "Machine wash cold"],
  "hoodies-sweatshirts": ["Cotton-poly fleece, 320 GSM", "Brushed inner lining", "Ribbed cuffs & hem", "Machine wash cold"],
  accessories: ["Durable, wear-resistant finish", "Minimal RYVENO detailing", "Everyday essential", "Wipe clean"],
  "dresses-kurtis": ["Soft breathable fabric", "Relaxed, flattering cut", "Fine stitch finishing", "Gentle wash recommended"],
  outerwear: ["Structured woven shell", "Full lining", "Notched lapel, two-button front", "Dry clean recommended"],
};

type Seed = {
  slug: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  category: string;
  gender: Gender;
  images: string[];
  tags?: string[];
  sizes?: string[];
  colors?: string[];
  stock?: number;
  rating?: number;
  reviewCount?: number;
  createdAt?: string;
};

function make(s: Seed, index: number): Product {
  const colors = (s.colors ?? ["black", "white", "beige"]).map(
    (c) => PALETTE[c] ?? PALETTE.black,
  );
  return {
    id: `RV-${String(index + 1).padStart(4, "0")}`,
    slug: s.slug,
    name: s.name,
    price: s.price,
    compareAtPrice: s.compareAtPrice,
    category: s.category,
    gender: s.gender,
    tags: s.tags ?? [],
    description: (descriptionByCategory[s.category] ?? descriptionByCategory["t-shirts"]).replace(
      "{name}",
      s.name,
    ),
    details: detailsByCategory[s.category] ?? detailsByCategory["t-shirts"],
    images: s.images.map(img),
    colors,
    sizes: s.sizes ?? sizesByCategory[s.category] ?? ["M", "L", "XL"],
    stock: s.stock ?? 12 + (index % 9),
    rating: s.rating ?? 4.2 + ((index % 8) * 0.1),
    reviewCount: s.reviewCount ?? 18 + ((index * 7) % 140),
    createdAt: s.createdAt ?? `2026-${String((index % 9) + 1).padStart(2, "0")}-12`,
  };
}

const seeds: Seed[] = [
  // T-SHIRTS
  { slug: "rv-essential-tee", name: "RV Essential Cotton Tee", price: 790, compareAtPrice: 990, category: "t-shirts", gender: "men", images: ["p-tshirt-1", "p-tshirt-2", "cat-tshirts"], tags: ["best-seller"], colors: ["black", "white", "navy", "beige"] },
  { slug: "rv-oversized-tee", name: "Oversized Statement Tee", price: 990, category: "t-shirts", gender: "unisex", images: ["p-tshirt-2", "p-tshirt-3", "lifestyle-2"], tags: ["new"], colors: ["black", "beige", "grey"] },
  { slug: "rv-graphic-tee", name: "Identity Graphic Tee", price: 890, compareAtPrice: 1190, category: "t-shirts", gender: "men", images: ["p-tshirt-3", "p-tshirt-4", "lifestyle-1"], tags: ["sale", "new"], colors: ["black", "white", "olive"] },
  { slug: "rv-plain-tee-women", name: "Everyday Relaxed Tee", price: 750, category: "t-shirts", gender: "women", images: ["p-tshirt-4", "p-tshirt-1", "lifestyle-3"], tags: ["best-seller"], colors: ["white", "beige", "rose", "black"] },
  { slug: "rv-premium-tee", name: "Premium Heavyweight Tee", price: 1290, category: "t-shirts", gender: "men", images: ["p-tshirt-1", "p-tshirt-3", "cat-tshirts"], tags: ["new"], colors: ["black", "navy", "grey", "brown"] },
  { slug: "rv-striped-tee", name: "Coastal Stripe Tee", price: 950, category: "t-shirts", gender: "unisex", images: ["p-tshirt-2", "p-tshirt-4", "lifestyle-1"], tags: [], colors: ["white", "navy", "blue"] },
  { slug: "rv-crop-tee", name: "Studio Crop Tee", price: 850, category: "t-shirts", gender: "women", images: ["p-tshirt-4", "lifestyle-3", "p-tshirt-2"], tags: ["new"], colors: ["black", "rose", "white"] },
  { slug: "rv-vintage-tee", name: "Vintage Wash Tee", price: 1090, compareAtPrice: 1390, category: "t-shirts", gender: "men", images: ["p-tshirt-3", "p-tshirt-1", "cat-tshirts"], tags: ["sale"], colors: ["beige", "grey", "olive"] },

  // SHIRTS
  { slug: "rv-oxford-shirt", name: "Classic Oxford Shirt", price: 1690, compareAtPrice: 1990, category: "shirts", gender: "men", images: ["p-shirt-1", "p-shirt-2", "cat-shirts"], tags: ["best-seller"], colors: ["white", "blue", "beige"] },
  { slug: "rv-linen-shirt", name: "Relaxed Linen Blend Shirt", price: 1890, category: "shirts", gender: "men", images: ["p-shirt-2", "p-shirt-3", "lifestyle-2"], tags: ["new"], colors: ["beige", "white", "olive"] },
  { slug: "rv-slim-formal-shirt", name: "Slim Fit Formal Shirt", price: 1790, category: "shirts", gender: "men", images: ["p-shirt-3", "p-shirt-1", "cat-shirts"], tags: [], colors: ["white", "navy", "black"] },
  { slug: "rv-oversized-shirt-women", name: "Oversized Poplin Shirt", price: 1590, category: "shirts", gender: "women", images: ["p-shirt-4", "p-shirt-2", "lifestyle-3"], tags: ["new", "best-seller"], colors: ["white", "beige", "blue"] },
  { slug: "rv-flannel-shirt", name: "Brushed Flannel Shirt", price: 1990, compareAtPrice: 2390, category: "shirts", gender: "men", images: ["p-shirt-1", "p-shirt-4", "cat-shirts"], tags: ["sale"], colors: ["brown", "burgundy", "navy"] },
  { slug: "rv-camp-collar-shirt", name: "Camp Collar Resort Shirt", price: 1490, category: "shirts", gender: "unisex", images: ["p-shirt-2", "p-shirt-4", "lifestyle-1"], tags: ["new"], colors: ["beige", "olive", "rose"] },
  { slug: "rv-white-dress-shirt", name: "Signature White Dress Shirt", price: 1850, category: "shirts", gender: "men", images: ["p-shirt-3", "p-shirt-1", "cat-shirts"], tags: [], colors: ["white", "black"] },

  // JEANS & TROUSERS
  { slug: "rv-slim-jeans", name: "Slim Fit Stretch Jeans", price: 2290, compareAtPrice: 2790, category: "jeans-trousers", gender: "men", images: ["p-jeans-1", "p-jeans-2", "cat-jeans"], tags: ["best-seller"], colors: ["blue", "black", "grey"] },
  { slug: "rv-straight-jeans", name: "Straight Leg Denim", price: 2490, category: "jeans-trousers", gender: "unisex", images: ["p-jeans-2", "p-jeans-3", "lifestyle-1"], tags: ["new"], colors: ["blue", "black"] },
  { slug: "rv-chino-trousers", name: "Tailored Cotton Chinos", price: 1990, category: "jeans-trousers", gender: "men", images: ["p-jeans-3", "p-jeans-4", "cat-jeans"], tags: ["best-seller"], colors: ["beige", "navy", "olive"] },
  { slug: "rv-wide-leg-trousers", name: "Wide Leg Trousers", price: 2150, category: "jeans-trousers", gender: "women", images: ["p-jeans-4", "p-jeans-1", "lifestyle-3"], tags: ["new"], colors: ["black", "beige", "brown"] },
  { slug: "rv-black-jeans", name: "Slim Black Denim", price: 2390, compareAtPrice: 2890, category: "jeans-trousers", gender: "men", images: ["p-jeans-1", "p-jeans-3", "cat-jeans"], tags: ["sale"], colors: ["black", "grey"] },
  { slug: "rv-cargo-trousers", name: "Utility Cargo Trousers", price: 2590, category: "jeans-trousers", gender: "men", images: ["p-jeans-4", "p-jeans-2", "lifestyle-2"], tags: ["new"], colors: ["olive", "beige", "black"] },
  { slug: "rv-pleated-trousers", name: "Pleated Relaxed Trousers", price: 2250, category: "jeans-trousers", gender: "women", images: ["p-jeans-3", "p-jeans-4", "lifestyle-3"], tags: [], colors: ["black", "sand", "navy"] },

  // HOODIES & SWEATSHIRTS
  { slug: "rv-essential-hoodie", name: "Essential Fleece Hoodie", price: 2190, compareAtPrice: 2590, category: "hoodies-sweatshirts", gender: "unisex", images: ["p-hoodie-1", "p-hoodie-2", "cat-hoodies"], tags: ["best-seller"], colors: ["black", "grey", "navy", "beige"] },
  { slug: "rv-zip-hoodie", name: "Full Zip Overlay Hoodie", price: 2790, category: "hoodies-sweatshirts", gender: "men", images: ["p-hoodie-2", "p-hoodie-3", "lifestyle-2"], tags: ["new"], colors: ["black", "olive", "grey"] },
  { slug: "rv-crew-sweatshirt", name: "Clean Crew Sweatshirt", price: 1990, category: "hoodies-sweatshirts", gender: "unisex", images: ["p-hoodie-3", "p-hoodie-4", "cat-hoodies"], tags: ["best-seller"], colors: ["beige", "black", "rose"] },
  { slug: "rv-oversized-hoodie", name: "Oversized Studio Hoodie", price: 2650, category: "hoodies-sweatshirts", gender: "women", images: ["p-hoodie-4", "p-hoodie-1", "lifestyle-3"], tags: ["new"], colors: ["grey", "beige", "black"] },
  { slug: "rv-printed-hoodie", name: "Identity Print Hoodie", price: 2490, compareAtPrice: 2990, category: "hoodies-sweatshirts", gender: "men", images: ["p-hoodie-1", "p-hoodie-3", "cat-hoodies"], tags: ["sale"], colors: ["black", "burgundy"] },
  { slug: "rv-lightweight-hoodie", name: "Lightweight Travel Hoodie", price: 2350, category: "hoodies-sweatshirts", gender: "unisex", images: ["p-hoodie-2", "p-hoodie-4", "lifestyle-1"], tags: ["new"], colors: ["navy", "beige", "black"] },

  // ACCESSORIES
  { slug: "rv-minimal-watch", name: "Minimalist Steel Watch", price: 3490, compareAtPrice: 3990, category: "accessories", gender: "unisex", images: ["p-acc-1", "p-acc-3", "cat-accessories"], tags: ["best-seller"], colors: ["black", "sand"] },
  { slug: "rv-leather-bag", name: "Everyday Leather Bag", price: 4290, category: "accessories", gender: "unisex", images: ["p-acc-2", "p-acc-4", "cat-accessories"], tags: ["new"], colors: ["brown", "black"] },
  { slug: "rv-canvas-tote", name: "Signature Canvas Tote", price: 1290, category: "accessories", gender: "women", images: ["p-acc-3", "p-acc-2", "lifestyle-3"], tags: ["best-seller"], colors: ["beige", "black"] },
  { slug: "rv-classic-sneakers", name: "Classic Court Sneakers", price: 3990, compareAtPrice: 4590, category: "accessories", gender: "unisex", images: ["p-acc-4", "p-acc-1", "cat-accessories"], tags: ["sale"], colors: ["white", "black"], sizes: ["39", "40", "41", "42", "43", "44"] },
  { slug: "rv-leather-wallet", name: "Slim Leather Wallet", price: 1590, category: "accessories", gender: "men", images: ["p-acc-2", "p-acc-1", "cat-accessories"], tags: [], colors: ["brown", "black"] },
  { slug: "rv-sunglasses", name: "Studio Sunglasses", price: 1890, category: "accessories", gender: "unisex", images: ["p-acc-3", "p-acc-4", "lifestyle-1"], tags: ["new"], colors: ["black", "sand"] },

  // DRESSES & KURTIS
  { slug: "rv-midi-dress", name: "Fluid Midi Dress", price: 2890, compareAtPrice: 3390, category: "dresses-kurtis", gender: "women", images: ["p-dress-1", "p-dress-2", "hero-women"], tags: ["new", "best-seller"], colors: ["black", "beige", "rose"] },
  { slug: "rv-shirt-dress", name: "Relaxed Shirt Dress", price: 2690, category: "dresses-kurtis", gender: "women", images: ["p-dress-2", "p-dress-1", "lifestyle-3"], tags: ["new"], colors: ["white", "beige", "blue"] },
  { slug: "rv-evening-dress", name: "Evening Edge Dress", price: 3490, category: "dresses-kurtis", gender: "women", images: ["p-dress-1", "hero-women", "p-dress-2"], tags: [], colors: ["black", "burgundy"] },
  { slug: "rv-print-kurti", name: "Everyday Printed Kurti", price: 1790, compareAtPrice: 2190, category: "dresses-kurtis", gender: "women", images: ["p-dress-2", "p-dress-1", "lifestyle-3"], tags: ["sale", "best-seller"], colors: ["rose", "beige", "navy"] },
  { slug: "rv-linen-blend-kurti", name: "Linen Blend Straight Kurti", price: 2190, category: "dresses-kurtis", gender: "women", images: ["p-dress-1", "p-dress-2", "cat-women"], tags: ["new"], colors: ["sand", "white", "olive"] },

  // OUTERWEAR
  { slug: "rv-tailored-blazer", name: "Tailored Statement Blazer", price: 4990, compareAtPrice: 5990, category: "outerwear", gender: "men", images: ["p-blazer-1", "hero-men", "p-shirt-1"], tags: ["new", "best-seller"], colors: ["navy", "black", "beige"] },
  { slug: "rv-women-blazer", name: "Structured Women's Blazer", price: 4590, category: "outerwear", gender: "women", images: ["p-blazer-1", "hero-women", "p-dress-2"], tags: ["new"], colors: ["beige", "black"] },
  { slug: "rv-everyday-blazer", name: "Everyday Soft Blazer", price: 4290, category: "outerwear", gender: "men", images: ["hero-men", "p-blazer-1", "cat-men"], tags: [], colors: ["navy", "grey", "brown"] },
];

export const products: Product[] = seeds.map(make);

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
export const getProductById = (id: string) => products.find((p) => p.id === id);
export const relatedProducts = (product: Product, limit = 4) =>
  products
    .filter((p) => p.id !== product.id && (p.category === product.category || p.gender === product.gender))
    .slice(0, limit);

export const newArrivals = products.filter((p) => p.tags.includes("new"));
export const bestSellers = products.filter((p) => p.tags.includes("best-seller"));
export const saleProducts = products.filter((p) => p.tags.includes("sale"));
