export type Gender = "men" | "women" | "unisex";

export type ProductColor = {
  name: string;
  hex: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  category: string;
  gender: Gender;
  tags: string[];
  description: string;
  details: string[];
  images: string[];
  colors: ProductColor[];
  sizes: string[];
  stock: number;
  rating: number;
  reviewCount: number;
  createdAt: string;
};

export type CartLine = {
  key: string;
  productId: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  size: string;
  color: string;
  quantity: number;
  stock: number;
};

export type WishlistItem = {
  productId: string;
  addedAt: string;
};

export type ShippingAddress = {
  fullName: string;
  phone: string;
  email: string;
  division: string;
  district: string;
  area: string;
  address: string;
  note?: string;
};

export type PaymentMethod = "cod" | "bkash" | "nagad" | "sslcommerz";

export type OrderStatus =
  | "Pending"
  | "Confirmed"
  | "Processing"
  | "Shipped"
  | "Out for Delivery"
  | "Delivered"
  | "Cancelled"
  | "Returned";

export type Order = {
  id: string;
  trackingNumber: string;
  lines: CartLine[];
  address: ShippingAddress;
  payment: PaymentMethod;
  paymentDetails?: { transactionId?: string; account?: string };
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  coupon?: string;
  status: OrderStatus;
  createdAt: string;
  timeline: { label: string; date: string; done: boolean }[];
  userId?: string;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  createdAt: string;
  role: "customer" | "admin";
};

export type Coupon = {
  code: string;
  type: "percent" | "fixed";
  value: number;
  minSpend: number;
  active: boolean;
  usage: number;
};

export type Review = {
  id: string;
  productId?: string;
  name: string;
  rating: number;
  title: string;
  body: string;
  date: string;
  verified: boolean;
  status: "published" | "hidden";
};

export type Banner = {
  id: string;
  title: string;
  subtitle: string;
  cta: string;
  href: string;
  image: string;
  active: boolean;
};
