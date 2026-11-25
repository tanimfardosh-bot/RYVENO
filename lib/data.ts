import type { Banner, Coupon, Review } from "./types";

export type Collection = {
  slug: string;
  title: string;
  eyebrow: string;
  description: string;
  image: string;
  filter: (p: import("./types").Product) => boolean;
  sort?: "newest" | "popular";
};

export const collections: Collection[] = [
  {
    slug: "men",
    title: "Men's Collection",
    eyebrow: "THE MEN'S EDIT",
    description: "Considered essentials and sharp statements for the modern man. Tailored for confidence, built for every day.",
    image: "/images/hero-men.jpg",
    filter: (p) => p.gender === "men" || p.gender === "unisex",
    sort: "popular",
  },
  {
    slug: "women",
    title: "Women's Collection",
    eyebrow: "THE WOMEN'S EDIT",
    description: "Fluid silhouettes, confident cuts and quiet details. A wardrobe that moves entirely on your terms.",
    image: "/images/hero-women.jpg",
    filter: (p) => p.gender === "women" || p.gender === "unisex",
    sort: "popular",
  },
  {
    slug: "new-arrivals",
    title: "New Arrivals",
    eyebrow: "JUST LANDED",
    description: "The newest expressions of the RYVENO identity. Fresh cuts, considered details, made to be seen first.",
    image: "/images/lifestyle-1.jpg",
    filter: (p) => p.tags.includes("new"),
    sort: "newest",
  },
  {
    slug: "best-sellers",
    title: "Best Sellers",
    eyebrow: "MOST LOVED",
    description: "The pieces our community keeps coming back for. Proven favourites, refined to perfection.",
    image: "/images/lifestyle-2.jpg",
    filter: (p) => p.tags.includes("best-seller"),
    sort: "popular",
  },
  {
    slug: "t-shirts",
    title: "T-Shirts",
    eyebrow: "THE EVERYDAY FOUNDATION",
    description: "From heavyweight staples to relaxed statements — tees engineered for comfort and built to last.",
    image: "/images/cat-tshirts.jpg",
    filter: (p) => p.category === "t-shirts",
  },
  {
    slug: "shirts",
    title: "Shirts",
    eyebrow: "SHARP BY DESIGN",
    description: "Crisp poplins, soft linens and tailored oxfords. Shirts that carry a point of view.",
    image: "/images/cat-shirts.jpg",
    filter: (p) => p.category === "shirts",
  },
  {
    slug: "jeans-trousers",
    title: "Jeans & Trousers",
    eyebrow: "THE PERFECT FIT",
    description: "Denim, chinos and considered trousers with the rise, drape and detail that matter.",
    image: "/images/cat-jeans.jpg",
    filter: (p) => p.category === "jeans-trousers",
  },
  {
    slug: "hoodies-sweatshirts",
    title: "Hoodies & Sweatshirts",
    eyebrow: "LAYERED COMFORT",
    description: "Substantial fleece, relaxed shapes and an easy confidence. Comfort, elevated.",
    image: "/images/cat-hoodies.jpg",
    filter: (p) => p.category === "hoodies-sweatshirts",
  },
  {
    slug: "accessories",
    title: "Accessories",
    eyebrow: "THE FINAL DETAIL",
    description: "Watches, bags, footwear and the small things that make the whole look yours.",
    image: "/images/cat-accessories.jpg",
    filter: (p) => p.category === "accessories",
  },
  {
    slug: "dresses-kurtis",
    title: "Dresses & Kurtis",
    eyebrow: "EFFORTLESS ELEGANCE",
    description: "Fluid, flattering silhouettes designed to take you from daylight to evening with ease.",
    image: "/images/cat-women.jpg",
    filter: (p) => p.category === "dresses-kurtis",
  },
  {
    slug: "outerwear",
    title: "Outerwear",
    eyebrow: "STATEMENT LAYERS",
    description: "Structured blazers and considered layers that finish an outfit with intent.",
    image: "/images/p-blazer-1.jpg",
    filter: (p) => p.category === "outerwear",
  },
  {
    slug: "sale",
    title: "Sale",
    eyebrow: "THE EDIT, REDUCED",
    description: "Selected pieces at a new price. Same RYVENO quality, a little more room in your wallet.",
    image: "/images/editorial.jpg",
    filter: (p) => p.tags.includes("sale") || (p.compareAtPrice ?? 0) > p.price,
    sort: "popular",
  },
];

export const getCollection = (slug: string) => collections.find((c) => c.slug === slug);

export const shopCategories = [
  { name: "Men's Fashion", slug: "men", image: "/images/cat-men.jpg" },
  { name: "Women's Fashion", slug: "women", image: "/images/cat-women.jpg" },
  { name: "T-Shirts", slug: "t-shirts", image: "/images/cat-tshirts.jpg" },
  { name: "Shirts", slug: "shirts", image: "/images/cat-shirts.jpg" },
  { name: "Jeans", slug: "jeans-trousers", image: "/images/cat-jeans.jpg" },
  { name: "Hoodies", slug: "hoodies-sweatshirts", image: "/images/cat-hoodies.jpg" },
  { name: "Accessories", slug: "accessories", image: "/images/cat-accessories.jpg" },
];

export const divisions: Record<string, string[]> = {
  Dhaka: ["Dhaka North", "Dhaka South", "Gazipur", "Narayanganj", "Tangail", "Kishoreganj"],
  Chattogram: ["Chattogram", "Cox's Bazar", "Comilla", "Feni", "Khagrachhari", "Rangamati"],
  Rajshahi: ["Rajshahi", "Bogra", "Pabna", "Naogaon", "Natore", "Chapai Nawabganj"],
  Khulna: ["Khulna", "Bagerhat", "Satkhira", "Jessore", "Narail", "Magura"],
  Sylhet: ["Sylhet", "Moulvibazar", "Habiganj", "Sunamganj"],
  Barishal: ["Barishal", "Patuakhali", "Bhola", "Pirojpur", "Jhalokati"],
  Rangpur: ["Rangpur", "Dinajpur", "Gaibandha", "Kurigram", "Lalmonirhat", "Thakurgaon"],
  Mymensingh: ["Mymensingh", "Jamalpur", "Netrokona", "Sherpur"],
};

export const defaultCoupons: Coupon[] = [
  { code: "RYVENO10", type: "percent", value: 10, minSpend: 1500, active: true, usage: 0 },
  { code: "WELCOME200", type: "fixed", value: 200, minSpend: 2000, active: true, usage: 0 },
  { code: "FREESHIP", type: "fixed", value: 120, minSpend: 0, active: true, usage: 0 },
];

export const defaultReviews: Review[] = [
  { id: "r1", name: "Tanim A.", rating: 5, title: "Finally, a brand that gets it", body: "The quality is genuinely impressive for the price. The Essential Cotton Tee fits exactly how I wanted and the fabric feels premium. RYVENO is now my go-to.", date: "2026-09-14", verified: true, status: "published" },
  { id: "r2", name: "Sadia R.", rating: 5, title: "Obsessed with the blazer", body: "Ordered the Tailored Statement Blazer for an event and received so many compliments. Delivery to Chattogram was faster than expected too.", date: "2026-08-30", verified: true, status: "published" },
  { id: "r3", name: "Rahim K.", rating: 4, title: "Great everyday wear", body: "Comfortable, well-stitched and true to size. The hoodie has become my weekend uniform. Would love more colour options.", date: "2026-08-11", verified: true, status: "published" },
  { id: "r4", name: "Nusrat J.", rating: 5, title: "Clean, modern, affordable", body: "The women's collection feels genuinely international. The midi dress is beautiful and the packaging was lovely. Highly recommend.", date: "2026-07-22", verified: true, status: "published" },
  { id: "r5", name: "Imran H.", rating: 5, title: "Wear Your Identity, literally", body: "Love the whole vibe of this brand. ordered a full outfit — shirts, chinos and a watch. Everything arrived in perfect condition.", date: "2026-07-05", verified: true, status: "published" },
  { id: "r6", name: "Fariha S.", rating: 4, title: "Good value", body: "Nice fabric and quick delivery inside Dhaka. Sizing was slightly roomy for me but still looks great.", date: "2026-06-18", verified: false, status: "published" },
];

export const defaultBanners: Banner[] = [
  { id: "b1", title: "NEW SEASON. NEW IDENTITY.", subtitle: "Discover a new expression of everyday fashion.", cta: "SHOP THE COLLECTION", href: "/collections/new-arrivals", image: "/images/hero-men.jpg", active: true },
  { id: "b2", title: "STYLE IS NOT WHAT YOU WEAR.", subtitle: "It's who you are.", cta: "EXPLORE COLLECTION", href: "/collections/women", image: "/images/editorial.jpg", active: true },
  { id: "b3", title: "MORE THAN JUST FASHION.", subtitle: "Confidence, comfort and individuality in every stitch.", cta: "DISCOVER OUR STORY", href: "/about", image: "/images/story.jpg", active: false },
];

export const faqs = [
  { q: "What is RYVENO?", a: "RYVENO is a Bangladeshi fashion and lifestyle brand built on the idea of premium, affordable everyday fashion. We design modern pieces that combine confidence, comfort and individuality — made for men and women aged 16 to 35." },
  { q: "Where do you deliver?", a: "We deliver nationwide across Bangladesh, including all 64 districts. Dhaka orders typically arrive within 1–3 business days, while orders outside Dhaka arrive within 3–6 business days." },
  { q: "How much is the delivery charge?", a: "Delivery inside Dhaka is ৳60. Outside Dhaka it is ৳120. Orders above ৳3,000 qualify for free delivery anywhere in Bangladesh." },
  { q: "What payment methods do you accept?", a: "We accept Cash on Delivery (COD), bKash, Nagad and all major cards through our SSLCommerz-ready payment architecture. You can also make a direct bKash/Nagad merchant payment." },
  { q: "How do I track my order?", a: "Once your order is confirmed, you'll receive a unique tracking number. Enter it on our Order Tracking page to see real-time status, or log in to My Account for your full order history." },
  { q: "What is your return and exchange policy?", a: "You can return or exchange unworn items with tags within 7 days of delivery. Sale items are eligible for exchange only. See our Return & Exchange Policy page for full details." },
  { q: "How do I choose the right size?", a: "Every product page includes a detailed Size Guide popup with measurements in inches and centimetres. If you're between sizes, we generally recommend sizing up for a relaxed fit." },
  { q: "Are your products true to the photos?", a: "Yes. We photograph our products in natural light and edit minimally to represent colours accurately. Slight variations may occur due to screen settings." },
  { q: "Do you have physical stores?", a: "RYVENO is currently an online-first brand. Visit us at our studio in Dhaka by appointment, or shop the full collection here at ryveno.com." },
  { q: "How can I contact customer support?", a: "Message us on WhatsApp at +880 1700-000000, email hello@ryveno.com, or reach us on Facebook and Instagram. We typically respond within a few hours." },
];

export const supportLinks = [
  { label: "Order Tracking", href: "/order-tracking" },
  { label: "Shipping & Delivery", href: "/policies/shipping" },
  { label: "Return & Exchange", href: "/policies/returns" },
  { label: "FAQ", href: "/faq" },
  { label: "Privacy Policy", href: "/policies/privacy" },
  { label: "Terms & Conditions", href: "/policies/terms" },
];

export const policyPages: Record<string, { title: string; updated: string; sections: { h: string; p: string[] }[] }> = {
  shipping: {
    title: "Shipping & Delivery Policy",
    updated: "1 November 2026",
    sections: [
      { h: "Nationwide Delivery", p: ["RYVENO delivers to every district in Bangladesh. Whether you're in the heart of Dhaka or a remote upazila, we'll get your order to you.", "All orders are processed within 24 hours of confirmation, excluding Fridays and public holidays."] },
      { h: "Delivery Charges & Timelines", p: ["Inside Dhaka: ৳60, delivered within 1–3 business days.", "Outside Dhaka: ৳120, delivered within 3–6 business days.", "Free delivery on all orders above ৳3,000."] },
      { h: "Order Confirmation", p: ["After placing an order, our team calls you to confirm details, size and address. Orders are dispatched only after confirmation.", "You'll receive an SMS with your tracking number once the parcel leaves our studio."] },
      { h: "Delays", p: ["Occasional delays may occur due to weather, strikes or courier volumes. We'll keep you informed and appreciate your understanding."] },
    ],
  },
  returns: {
    title: "Return & Exchange Policy",
    updated: "1 November 2026",
    sections: [
      { h: "7-Day Window", p: ["You may request a return or exchange within 7 days of receiving your order. Items must be unworn, unwashed and in original packaging with all tags attached."] },
      { h: "Eligibility", p: ["Full-priced items are eligible for return or exchange.", "Sale and discounted items are eligible for exchange only, subject to stock availability.", "Accessories and innerwear are non-returnable unless faulty."] },
      { h: "How to Request", p: ["Message us on WhatsApp or email hello@ryveno.com with your order number and a photo of the item. Our team will arrange a courier pickup at no extra cost for eligible returns."] },
      { h: "Refunds", p: ["Approved refunds are processed to your original payment method within 5–7 business days. For Cash on Delivery orders, we arrange a bank transfer or bKash payment."] },
    ],
  },
  privacy: {
    title: "Privacy Policy",
    updated: "1 November 2026",
    sections: [
      { h: "Information We Collect", p: ["We collect the information you provide when you register, place an order or subscribe to our newsletter — such as your name, phone number, email address and delivery address."] },
      { h: "How We Use It", p: ["Your information is used to process orders, arrange delivery, respond to support requests and — only with your consent — send you updates about new collections and offers."] },
      { h: "Data Protection", p: ["We never sell your personal data. Information is stored securely and shared only with trusted delivery and payment partners as needed to fulfil your order."] },
      { h: "Your Choices", p: ["You can update your account details at any time or unsubscribe from marketing messages using the link in any email."] },
    ],
  },
  terms: {
    title: "Terms & Conditions",
    updated: "1 November 2026",
    sections: [
      { h: "Using Our Website", p: ["By using ryveno.com you agree to these terms. You must provide accurate information when placing an order and are responsible for keeping your account credentials secure."] },
      { h: "Pricing & Availability", p: ["All prices are in Bangladeshi Taka (BDT) and include VAT where applicable. Product availability and prices may change without notice, but confirmed orders are never affected."] },
      { h: "Orders", p: ["We reserve the right to cancel orders due to stock unavailability, incorrect pricing or suspected fraud. You'll be notified immediately if this happens."] },
      { h: "Intellectual Property", p: ["All content, imagery and the RYVENO wordmark are the property of RYVENO and may not be reproduced without written permission."] },
    ],
  },
};
