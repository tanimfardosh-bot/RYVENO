/**
 * Bengali / English language-ready architecture.
 *
 * The storefront currently renders in English. This dictionary is the
 * foundation for a full locale switch: wrap the app in a LocaleProvider,
 * read the active locale here, and replace hard-coded UI strings with t().
 *
 * Currency stays in BDT (৳) and phone numbers use the +880 format in both
 * locales, matching Bangladesh conventions.
 */
export type Locale = "en" | "bn";

export const locales: Locale[] = ["en", "bn"];

export const translations: Record<Locale, Record<string, string>> = {
  en: {
    "brand.slogan": "Wear Your Identity.",
    "nav.new": "New Arrivals",
    "nav.men": "Men",
    "nav.women": "Women",
    "nav.collections": "Collections",
    "nav.accessories": "Accessories",
    "nav.sale": "Sale",
    "action.search": "Search",
    "action.account": "Account",
    "action.wishlist": "Wishlist",
    "action.cart": "Shopping Bag",
    "action.addToCart": "Add to Cart",
    "action.buyNow": "Buy Now",
    "action.checkout": "Checkout",
    "cart.subtotal": "Subtotal",
    "cart.shipping": "Delivery",
    "cart.total": "Total",
    "checkout.placeOrder": "Place Order",
    "delivery.insideDhaka": "Inside Dhaka",
    "delivery.outsideDhaka": "Outside Dhaka",
  },
  bn: {
    "brand.slogan": "নিজের পরিচয় পরিধান করুন।",
    "nav.new": "নতুন আগমন",
    "nav.men": "পুরুষ",
    "nav.women": "নারী",
    "nav.collections": "সংগ্রহ",
    "nav.accessories": "আনুষাঙ্গিক",
    "nav.sale": "বিক্রয়",
    "action.search": "খুঁজুন",
    "action.account": "অ্যাকাউন্ট",
    "action.wishlist": "পছন্দের তালিকা",
    "action.cart": "Shopping Bag",
    "action.addToCart": "কার্টে যোগ করুন",
    "action.buyNow": "এখনই কিনুন",
    "action.checkout": "চেকআউট",
    "cart.subtotal": "উপমোট",
    "cart.shipping": "ডেলিভারি",
    "cart.total": "মোট",
    "checkout.placeOrder": "অর্ডার দিন",
    "delivery.insideDhaka": "ঢাকার ভেতরে",
    "delivery.outsideDhaka": "ঢাকার বাইরে",
  },
};

export function t(locale: Locale, key: string): string {
  return translations[locale][key] ?? translations.en[key] ?? key;
}

export function formatPhoneBangladesh(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("880")) return `+${digits}`;
  if (digits.startsWith("0")) return `+88${digits}`;
  return `+880${digits}`;
}
