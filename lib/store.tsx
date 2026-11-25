"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { products as seedProducts } from "./products";
import {
  defaultBanners,
  defaultCoupons,
  defaultReviews,
} from "./data";
import type {
  Banner,
  CartLine,
  Coupon,
  Customer,
  Order,
  OrderStatus,
  PaymentMethod,
  Product,
  Review,
  ShippingAddress,
} from "./types";

type AppliedCoupon = { code: string; discount: number } | null;

type StoreValue = {
  hydrated: boolean;
  cart: CartLine[];
  wishlist: string[];
  user: Customer | null;
  customers: Customer[];
  orders: Order[];
  coupons: Coupon[];
  reviews: Review[];
  banners: Banner[];
  products: Product[];
  appliedCoupon: AppliedCoupon;
  cartOpen: boolean;
  searchOpen: boolean;
  setCartOpen: (v: boolean) => void;
  setSearchOpen: (v: boolean) => void;
  addToCart: (p: Product, size: string, color: string, qty?: number) => void;
  removeFromCart: (key: string) => void;
  updateQty: (key: string, qty: number) => void;
  clearCart: () => void;
  toggleWishlist: (id: string) => void;
  register: (name: string, email: string, phone: string, password: string) => { ok: boolean; message: string };
  login: (email: string, password: string) => { ok: boolean; message: string };
  logout: () => void;
  updateProfile: (data: Partial<Pick<Customer, "name" | "email" | "phone">>) => void;
  placeOrder: (address: ShippingAddress, payment: PaymentMethod, details?: { transactionId?: string; account?: string }) => Order;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  applyCoupon: (code: string) => { ok: boolean; message: string };
  removeCoupon: () => void;
  addProduct: (p: Product) => void;
  updateProduct: (p: Product) => void;
  deleteProduct: (id: string) => void;
  addCoupon: (c: Coupon) => void;
  toggleCoupon: (code: string) => void;
  deleteCoupon: (code: string) => void;
  addBanner: (b: Banner) => void;
  updateBanner: (b: Banner) => void;
  deleteBanner: (id: string) => void;
  addReview: (r: Review) => void;
  updateReviewStatus: (id: string, status: "published" | "hidden") => void;
  deleteReview: (id: string) => void;
  cartCount: number;
  subtotal: number;
};

const StoreContext = createContext<StoreValue | null>(null);

const ADMIN: Customer = {
  id: "admin-001",
  name: "RYVENO Admin",
  email: "admin@ryveno.com",
  phone: "+8801700000000",
  password: "admin123",
  createdAt: "2026-01-01",
  role: "admin",
};

const KEY = "ryveno:v1:";

function load<T>(name: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(KEY + name);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function save<T>(name: string, value: T) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY + name, JSON.stringify(value));
  } catch {
    /* storage full or unavailable — demo continues in memory */
  }
}

const timelineFor = (): Order["timeline"] => [
  { label: "Order Placed", date: new Date().toISOString(), done: true },
  { label: "Confirmed", date: "", done: false },
  { label: "Processing", date: "", done: false },
  { label: "Shipped", date: "", done: false },
  { label: "Out for Delivery", date: "", done: false },
  { label: "Delivered", date: "", done: false },
];

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [user, setUser] = useState<Customer | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([ADMIN]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>(defaultCoupons);
  const [reviews, setReviews] = useState<Review[]>(defaultReviews);
  const [banners, setBanners] = useState<Banner[]>(defaultBanners);
  const [products, setProducts] = useState<Product[]>(seedProducts);
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    setCart(load("cart", []));
    setWishlist(load("wishlist", []));
    setUser(load("user", null));
    setCustomers(load("customers", [ADMIN]));
    setOrders(load("orders", []));
    setCoupons(load("coupons", defaultCoupons));
    setReviews(load("reviews", defaultReviews));
    setBanners(load("banners", defaultBanners));
    setProducts(load("products", seedProducts));
    setHydrated(true);
  }, []);

  useEffect(() => { if (hydrated) save("cart", cart); }, [cart, hydrated]);
  useEffect(() => { if (hydrated) save("wishlist", wishlist); }, [wishlist, hydrated]);
  useEffect(() => { if (hydrated) save("user", user); }, [user, hydrated]);
  useEffect(() => { if (hydrated) save("customers", customers); }, [customers, hydrated]);
  useEffect(() => { if (hydrated) save("orders", orders); }, [orders, hydrated]);
  useEffect(() => { if (hydrated) save("coupons", coupons); }, [coupons, hydrated]);
  useEffect(() => { if (hydrated) save("reviews", reviews); }, [reviews, hydrated]);
  useEffect(() => { if (hydrated) save("banners", banners); }, [banners, hydrated]);
  useEffect(() => { if (hydrated) save("products", products); }, [products, hydrated]);

  const addToCart = useCallback((p: Product, size: string, color: string, qty = 1) => {
    const key = `${p.id}-${size}-${color}`;
    setCart((prev) => {
      const found = prev.find((l) => l.key === key);
      if (found) {
        return prev.map((l) =>
          l.key === key ? { ...l, quantity: Math.min(l.stock, l.quantity + qty) } : l,
        );
      }
      return [
        ...prev,
        {
          key,
          productId: p.id,
          slug: p.slug,
          name: p.name,
          image: p.images[0],
          price: p.price,
          size,
          color,
          quantity: qty,
          stock: p.stock,
        },
      ];
    });
    setCartOpen(true);
  }, []);

  const removeFromCart = useCallback((key: string) => {
    setCart((prev) => prev.filter((l) => l.key !== key));
  }, []);

  const updateQty = useCallback((key: string, qty: number) => {
    setCart((prev) =>
      prev.map((l) =>
        l.key === key ? { ...l, quantity: Math.max(1, Math.min(l.stock, qty)) } : l,
      ),
    );
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
    setAppliedCoupon(null);
  }, []);

  const toggleWishlist = useCallback((id: string) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }, []);

  const register = useCallback((name: string, email: string, phone: string, password: string) => {
    const exists = customers.some((c) => c.email.toLowerCase() === email.toLowerCase());
    if (exists) return { ok: false, message: "An account with this email already exists." };
    const customer: Customer = {
      id: `cus-${Date.now()}`,
      name,
      email,
      phone,
      password,
      createdAt: new Date().toISOString(),
      role: "customer",
    };
    setCustomers((prev) => [...prev, customer]);
    setUser(customer);
    return { ok: true, message: "Welcome to RYVENO!" };
  }, [customers]);

  const login = useCallback((email: string, password: string) => {
    const found = customers.find(
      (c) => c.email.toLowerCase() === email.toLowerCase() && c.password === password,
    );
    if (!found) return { ok: false, message: "Invalid email or password." };
    setUser(found);
    return { ok: true, message: "Signed in successfully." };
  }, [customers]);

  const logout = useCallback(() => setUser(null), []);

  const updateProfile = useCallback((data: Partial<Pick<Customer, "name" | "email" | "phone">>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    setUser(updated);
    setCustomers((prev) => prev.map((c) => (c.id === user.id ? updated : c)));
  }, [user]);

  const subtotal = useMemo(
    () => cart.reduce((sum, l) => sum + l.price * l.quantity, 0),
    [cart],
  );

  const applyCoupon = useCallback((code: string) => {
    const c = coupons.find((x) => x.code.toLowerCase() === code.trim().toLowerCase());
    if (!c || !c.active) return { ok: false, message: "This coupon code is invalid or inactive." };
    if (subtotal < c.minSpend)
      return {
        ok: false,
        message: `Spend at least ৳${c.minSpend.toLocaleString("en-BD")} to use this code.`,
      };
    const discount = c.type === "percent" ? Math.round((subtotal * c.value) / 100) : c.value;
    setAppliedCoupon({ code: c.code, discount });
    return { ok: true, message: `${c.code} applied — you saved ৳${discount.toLocaleString("en-BD")}!` };
  }, [coupons, subtotal]);

  const removeCoupon = useCallback(() => setAppliedCoupon(null), []);

  const placeOrder = useCallback((
    address: ShippingAddress,
    payment: PaymentMethod,
    details?: { transactionId?: string; account?: string },
  ) => {
    const shippingCharge = subtotal >= 3000 ? 0 : cart.length ? (address.division.toLowerCase() === "dhaka" ? 60 : 120) : 0;
    const order: Order = {
      id: `ord_${Date.now()}`,
      trackingNumber: `RV${Date.now().toString().slice(-9)}`,
      lines: cart,
      address,
      payment,
      paymentDetails: details,
      subtotal,
      shipping: shippingCharge,
      discount: appliedCoupon?.discount ?? 0,
      total: Math.max(0, subtotal + shippingCharge - (appliedCoupon?.discount ?? 0)),
      coupon: appliedCoupon?.code,
      status: "Pending",
      createdAt: new Date().toISOString(),
      timeline: timelineFor(),
      userId: user?.id,
    };
    setOrders((prev) => [order, ...prev]);
    clearCart();
    return order;
  }, [cart, subtotal, appliedCoupon, user, clearCart]);

  const updateOrderStatus = useCallback((id: string, status: OrderStatus) => {
    const orderIndexLabel: Record<OrderStatus, number> = {
      Pending: 0, Confirmed: 1, Processing: 2, Shipped: 3,
      "Out for Delivery": 4, Delivered: 5, Cancelled: -1, Returned: -1,
    };
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== id) return o;
        const upto = orderIndexLabel[status];
        return {
          ...o,
          status,
          timeline: o.timeline.map((t, i) => ({
            ...t,
            done: upto < 0 ? t.label === "Order Placed" : i <= upto,
            date: i === upto && !t.date ? new Date().toISOString() : t.date,
          })),
        };
      }),
    );
  }, []);

  const addProduct = useCallback((p: Product) => setProducts((prev) => [p, ...prev]), []);
  const updateProduct = useCallback((p: Product) =>
    setProducts((prev) => prev.map((x) => (x.id === p.id ? p : x))), []);
  const deleteProduct = useCallback((id: string) =>
    setProducts((prev) => prev.filter((x) => x.id !== id)), []);

  const addCoupon = useCallback((c: Coupon) => setCoupons((prev) => [...prev, c]), []);
  const toggleCoupon = useCallback((code: string) =>
    setCoupons((prev) => prev.map((c) => (c.code === code ? { ...c, active: !c.active } : c))), []);
  const deleteCoupon = useCallback((code: string) =>
    setCoupons((prev) => prev.filter((c) => c.code !== code)), []);

  const addBanner = useCallback((b: Banner) => setBanners((prev) => [...prev, b]), []);
  const updateBanner = useCallback((b: Banner) =>
    setBanners((prev) => prev.map((x) => (x.id === b.id ? b : x))), []);
  const deleteBanner = useCallback((id: string) =>
    setBanners((prev) => prev.filter((x) => x.id !== id)), []);

  const addReview = useCallback((r: Review) => setReviews((prev) => [r, ...prev]), []);
  const updateReviewStatus = useCallback((id: string, status: "published" | "hidden") =>
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r))), []);
  const deleteReview = useCallback((id: string) =>
    setReviews((prev) => prev.filter((r) => r.id !== id)), []);

  const cartCount = useMemo(() => cart.reduce((n, l) => n + l.quantity, 0), [cart]);

  const value: StoreValue = {
    hydrated, cart, wishlist, user, customers, orders, coupons, reviews, banners,
    products, appliedCoupon, cartOpen, searchOpen, setCartOpen, setSearchOpen,
    addToCart, removeFromCart, updateQty, clearCart, toggleWishlist, register,
    login, logout, updateProfile, placeOrder, updateOrderStatus, applyCoupon,
    removeCoupon, addProduct, updateProduct, deleteProduct, addCoupon,
    toggleCoupon, deleteCoupon, addBanner, updateBanner, deleteBanner,
    addReview, updateReviewStatus, deleteReview, cartCount, subtotal,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}
