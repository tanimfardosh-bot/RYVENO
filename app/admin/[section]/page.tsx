"use client";

import { useParams } from "next/navigation";
import { Fragment, useMemo, useRef, useState } from "react";
import {
  Check, Eye, EyeOff, Pencil, Plus, Search, Trash2, X,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { formatBDT, formatDate } from "@/lib/format";
import { collections } from "@/lib/data";
import type { Banner, Coupon, Order, OrderStatus, Product } from "@/lib/types";
import { useToast } from "@/components/Toast";

const titles: Record<string, { title: string; desc: string }> = {
  products: { title: "Products", desc: "Manage your catalogue, inventory and pricing." },
  orders: { title: "Orders", desc: "Track orders and update their fulfilment status." },
  customers: { title: "Customers", desc: "Everyone who has joined the RYVENO community." },
  coupons: { title: "Coupons", desc: "Create and manage discount codes." },
  reviews: { title: "Reviews", desc: "Moderate customer feedback." },
  banners: { title: "Homepage Banners", desc: "Control the campaigns shown on your homepage." },
  analytics: { title: "Analytics", desc: "A closer look at your store performance." },
};

const imageOptions = [
  "hero-men", "hero-women", "editorial", "story", "cat-men", "cat-women",
  "cat-tshirts", "cat-shirts", "cat-jeans", "cat-hoodies", "cat-accessories",
  "p-tshirt-1", "p-tshirt-2", "p-tshirt-3", "p-tshirt-4", "p-shirt-1",
  "p-shirt-2", "p-shirt-3", "p-shirt-4", "p-jeans-1", "p-jeans-2",
  "p-jeans-3", "p-jeans-4", "p-hoodie-1", "p-hoodie-2", "p-hoodie-3",
  "p-hoodie-4", "p-acc-1", "p-acc-2", "p-acc-3", "p-acc-4",
  "p-dress-1", "p-dress-2", "p-blazer-1", "lifestyle-1", "lifestyle-2", "lifestyle-3",
];

const orderStatuses: OrderStatus[] = ["Pending", "Confirmed", "Processing", "Shipped", "Out for Delivery", "Delivered", "Cancelled", "Returned"];

export default function AdminSectionPage() {
  const params = useParams();
  const section = typeof params.section === "string" ? params.section : "";
  const meta = titles[section] ?? { title: "Not Found", desc: "" };

  if (!titles[section]) return <div className="border border-neutral-200 bg-white p-10 text-center"><h1 className="font-display text-2xl font-bold">Section not found</h1></div>;

  return (
    <div className="space-y-6">
      <div><p className="text-[11px] font-bold uppercase tracking-wide2 text-sand">Management</p><h1 className="mt-1 font-display text-2xl font-extrabold uppercase tracking-tight sm:text-3xl">{meta.title}</h1><p className="mt-1 text-sm text-neutral-500">{meta.desc}</p></div>
      {section === "products" && <ProductsManager />}
      {section === "orders" && <OrdersManager />}
      {section === "customers" && <CustomersManager />}
      {section === "coupons" && <CouponsManager />}
      {section === "reviews" && <ReviewsManager />}
      {section === "banners" && <BannersManager />}
      {section === "analytics" && <AnalyticsManager />}
    </div>
  );
}

function Panel({ children }: { children: React.ReactNode }) {
  return <div className="border border-neutral-200 bg-white">{children}</div>;
}

function Toolbar({ search, setSearch, children }: { search: string; setSearch: (v: string) => void; children?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200 p-4">
      <div className="flex items-center gap-2 border border-neutral-200 px-3 py-2"><Search size={15} className="text-neutral-400" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search…" className="w-40 bg-transparent text-sm outline-none sm:w-56" /></div>
      {children}
    </div>
  );
}

function Btn({ children, onClick, variant = "dark" }: { children: React.ReactNode; onClick: () => void; variant?: "dark" | "light" | "danger" }) {
  const cls = variant === "danger" ? "border border-red-200 text-red-600 hover:bg-red-50" : variant === "light" ? "border border-neutral-300 hover:border-ink" : "bg-ink text-white hover:bg-coal";
  return <button onClick={onClick} className={`flex items-center gap-1.5 px-3.5 py-2 text-[11px] font-bold uppercase tracking-wide transition-colors ${cls}`}>{children}</button>;
}

/* ---------------- PRODUCTS ---------------- */
function ProductsManager() {
  const { products, addProduct, updateProduct, deleteProduct } = useStore();
  const { notify } = useToast();
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Product | null>(null);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState<Product>(blankProduct());
  const fileRef = useRef<HTMLInputElement>(null);

  const list = products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.category.includes(search.toLowerCase()));

  const openNew = () => { setForm(blankProduct()); setEditing(null); setModal(true); };
  const openEdit = (p: Product) => { setForm({ ...p }); setEditing(p); setModal(true); };

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.slug) return notify("Name and slug are required.", "error");
    if (!form.images.length) return notify("Add at least one image.", "error");
    if (editing) { updateProduct(form); notify("Product updated."); }
    else { addProduct({ ...form, id: `RV-${Date.now().toString().slice(-5)}` }); notify("Product added."); }
    setModal(false);
  };

  const upload = (files: FileList | null) => {
    if (!files?.[0]) return;
    const reader = new FileReader();
    reader.onload = () => setForm((f) => ({ ...f, images: [String(reader.result), ...f.images] }));
    reader.readAsDataURL(files[0]);
  };

  return (
    <>
      <Panel>
        <Toolbar search={search} setSearch={setSearch}>
          <Btn onClick={openNew}><Plus size={14} /> Add Product</Btn>
        </Toolbar>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-neutral-200 bg-cream text-[10px] font-bold uppercase tracking-wide2 text-neutral-500">
              <tr><th className="px-4 py-3">Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th><th className="text-right">Actions</th></tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {list.map((p) => (
                <tr key={p.id} className="hover:bg-cream/50">
                  <td className="px-4 py-3"><div className="flex items-center gap-3"><img src={p.images[0]} alt="" className="h-12 w-10 object-cover" /><div><p className="text-[13px] font-bold">{p.name}</p><p className="text-[11px] text-neutral-500">{p.id}</p></div></div></td>
                  <td className="capitalize text-[12px] text-neutral-600">{p.category.replace(/-/g, " ")}</td>
                  <td className="text-[13px] font-bold">{formatBDT(p.price)}</td>
                  <td><span className={`text-[11px] font-bold ${p.stock < 10 ? "text-red-600" : "text-green-700"}`}>{p.stock}</span></td>
                  <td><div className="flex flex-wrap gap-1">{p.tags.map((t) => <span key={t} className="bg-cream px-1.5 py-0.5 text-[9px] font-bold uppercase">{t}</span>)}{!p.tags.length && <span className="text-[11px] text-neutral-400">—</span>}</div></td>
                  <td className="text-right"><div className="flex justify-end gap-2"><button onClick={() => openEdit(p)} className="p-2 text-neutral-500 hover:bg-cream hover:text-ink" aria-label="Edit"><Pencil size={15} /></button><button onClick={() => { if (confirm(`Delete "${p.name}"?`)) { deleteProduct(p.id); notify("Product deleted."); } }} className="p-2 text-neutral-500 hover:bg-red-50 hover:text-red-600" aria-label="Delete"><Trash2 size={15} /></button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
          {list.length === 0 && <p className="p-10 text-center text-sm text-neutral-500">No products found.</p>}
        </div>
      </Panel>

      {modal && (
        <Modal title={editing ? "Edit Product" : "Add New Product"} onClose={() => setModal(false)} wide>
          <form onSubmit={save} className="grid gap-4 sm:grid-cols-2">
            <Input label="Product Name *" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
            <Input label="URL Slug *" value={form.slug} onChange={(v) => setForm({ ...form, slug: v })} />
            <Input label="Price (BDT) *" type="number" value={String(form.price)} onChange={(v) => setForm({ ...form, price: Number(v) })} />
            <Input label="Compare-at Price" type="number" value={String(form.compareAtPrice ?? "")} onChange={(v) => setForm({ ...form, compareAtPrice: v ? Number(v) : undefined })} />
            <Select label="Category" value={form.category} options={collections.map((c) => ({ value: c.slug, label: c.title })).filter((c) => !["men", "women", "new-arrivals", "best-sellers", "sale", "all"].includes(c.value))} onChange={(v) => setForm({ ...form, category: v })} />
            <Select label="Gender" value={form.gender} options={[{ value: "men", label: "Men" }, { value: "women", label: "Women" }, { value: "unisex", label: "Unisex" }]} onChange={(v) => setForm({ ...form, gender: v as Product["gender"] })} />
            <Input label="Stock" type="number" value={String(form.stock)} onChange={(v) => setForm({ ...form, stock: Number(v) })} />
            <div>
              <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide2">Tags (comma separated)</label>
              <input className="field" value={form.tags.join(", ")} onChange={(e) => setForm({ ...form, tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) })} placeholder="new, best-seller, sale" />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide2">Description</label>
              <textarea className="field" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide2">Sizes (comma separated)</label>
              <input className="field" value={form.sizes.join(", ")} onChange={(e) => setForm({ ...form, sizes: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })} />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide2">Product Images</label>
              <div className="flex flex-wrap gap-2">
                {form.images.map((im, i) => <div key={i} className="relative h-16 w-14 border border-neutral-200"><img src={im} alt="" className="h-full w-full object-cover" /><button type="button" onClick={() => setForm({ ...form, images: form.images.filter((_, x) => x !== i) })} className="absolute -right-1.5 -top-1.5 bg-ink p-0.5 text-white"><X size={10} /></button></div>)}
                <button type="button" onClick={() => fileRef.current?.click()} className="flex h-16 w-14 items-center justify-center border border-dashed border-neutral-400 text-neutral-400 hover:border-ink"><Plus size={18} /></button>
              </div>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => upload(e.target.files)} />
              <select className="field mt-3" value="" onChange={(e) => { if (e.target.value) setForm((f) => ({ ...f, images: [...f.images, `/images/${e.target.value}.jpg`] })); }}>
                <option value="">— Or choose a library image —</option>
                {imageOptions.map((im) => <option key={im} value={im}>{im}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2"><button type="submit" className="btn-dark w-full">{editing ? "Save Changes" : "Add Product"}</button></div>
          </form>
        </Modal>
      )}
    </>
  );
}

/* ---------------- ORDERS ---------------- */
function OrdersManager() {
  const { orders, updateOrderStatus } = useStore();
  const { notify } = useToast();
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const list = orders.filter((o) => o.trackingNumber.toLowerCase().includes(search.toLowerCase()) || o.address.fullName.toLowerCase().includes(search.toLowerCase()));

  return (
    <Panel>
      <Toolbar search={search} setSearch={setSearch}><span className="text-xs text-neutral-500">{orders.length} orders</span></Toolbar>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="border-b border-neutral-200 bg-cream text-[10px] font-bold uppercase tracking-wide2 text-neutral-500"><tr><th className="px-4 py-3">Order</th><th>Customer</th><th>Date</th><th>Total</th><th>Payment</th><th>Status</th><th /></tr></thead>
          <tbody className="divide-y divide-neutral-100">
            {list.map((o) => (
              <Fragment key={o.id}>
                <tr className="hover:bg-cream/50">
                  <td className="px-4 py-3"><p className="text-[13px] font-bold">{o.trackingNumber}</p><p className="text-[11px] text-neutral-500">{o.lines.length} item(s)</p></td>
                  <td><p className="text-[13px]">{o.address.fullName}</p><p className="text-[11px] text-neutral-500">{o.address.phone}</p></td>
                  <td className="text-[12px] text-neutral-600">{formatDate(o.createdAt)}</td>
                  <td className="text-[13px] font-bold">{formatBDT(o.total)}</td>
                  <td className="text-[12px] capitalize">{o.payment === "cod" ? "Cash on Delivery" : o.payment}</td>
                  <td><select value={o.status} onChange={(e) => { updateOrderStatus(o.id, e.target.value as OrderStatus); notify("Order status updated."); }} className="border border-neutral-300 bg-white px-2 py-1.5 text-[11px] font-semibold outline-none focus:border-ink">{orderStatuses.map((s) => <option key={s}>{s}</option>)}</select></td>
                  <td><button onClick={() => setExpanded(expanded === o.id ? null : o.id)} className="p-2 text-neutral-500 hover:text-ink"><Eye size={15} /></button></td>
                </tr>
                {expanded === o.id && (
                  <tr><td colSpan={7} className="bg-cream px-4 py-5">
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div><p className="text-[10px] font-bold uppercase tracking-wide2 text-sand">Items</p>{o.lines.map((l) => <p key={l.key} className="mt-2 text-[12px]">{l.quantity} × {l.name} <span className="text-neutral-500">({l.size}, {l.color})</span></p>)}</div>
                      <div><p className="text-[10px] font-bold uppercase tracking-wide2 text-sand">Delivery Address</p><p className="mt-2 text-[12px] leading-relaxed">{o.address.address}, {o.address.area}, {o.address.district}, {o.address.division}<br />{o.address.phone} · {o.address.email}</p></div>
                    </div>
                  </td></tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
        {list.length === 0 && <p className="p-10 text-center text-sm text-neutral-500">No orders found.</p>}
      </div>
    </Panel>
  );
}

/* ---------------- CUSTOMERS ---------------- */
function CustomersManager() {
  const { customers, orders } = useStore();
  const [search, setSearch] = useState("");
  const list = customers.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase()));
  return (
    <Panel>
      <Toolbar search={search} setSearch={setSearch}><span className="text-xs text-neutral-500">{customers.length} accounts</span></Toolbar>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] text-left text-sm">
          <thead className="border-b border-neutral-200 bg-cream text-[10px] font-bold uppercase tracking-wide2 text-neutral-500"><tr><th className="px-4 py-3">Customer</th><th>Phone</th><th>Role</th><th>Orders</th><th>Joined</th></tr></thead>
          <tbody className="divide-y divide-neutral-100">
            {list.map((c) => <tr key={c.id}><td className="px-4 py-3"><p className="text-[13px] font-bold">{c.name}</p><p className="text-[11px] text-neutral-500">{c.email}</p></td><td className="text-[12px]">{c.phone || "—"}</td><td><span className={`px-2 py-1 text-[10px] font-bold uppercase ${c.role === "admin" ? "bg-ink text-white" : "bg-cream"}`}>{c.role}</span></td><td className="text-[13px]">{orders.filter((o) => o.userId === c.id).length}</td><td className="text-[12px] text-neutral-500">{formatDate(c.createdAt)}</td></tr>)}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

/* ---------------- COUPONS ---------------- */
function CouponsManager() {
  const { coupons, addCoupon, toggleCoupon, deleteCoupon } = useStore();
  const { notify } = useToast();
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ code: "", type: "percent" as Coupon["type"], value: 10, minSpend: 0 });
  const add = (e: React.FormEvent) => { e.preventDefault(); if (!form.code) return notify("Enter a coupon code.", "error"); addCoupon({ ...form, code: form.code.toUpperCase(), active: true, usage: 0 }); notify("Coupon created."); setShow(false); setForm({ code: "", type: "percent", value: 10, minSpend: 0 }); };
  return (
    <>
      <Panel>
        <div className="flex items-center justify-between border-b border-neutral-200 p-4"><span className="text-xs text-neutral-500">{coupons.length} coupons</span><Btn onClick={() => setShow((v) => !v)}><Plus size={14} /> New Coupon</Btn></div>
        {show && <form onSubmit={add} className="grid gap-3 border-b border-neutral-200 bg-cream p-5 sm:grid-cols-4">
          <Input label="Code" value={form.code} onChange={(v) => setForm({ ...form, code: v })} />
          <Select label="Type" value={form.type} options={[{ value: "percent", label: "Percent" }, { value: "fixed", label: "Fixed" }]} onChange={(v) => setForm({ ...form, type: v as Coupon["type"] })} />
          <Input label="Value" type="number" value={String(form.value)} onChange={(v) => setForm({ ...form, value: Number(v) })} />
          <Input label="Min Spend" type="number" value={String(form.minSpend)} onChange={(v) => setForm({ ...form, minSpend: Number(v) })} />
          <div className="sm:col-span-4"><button className="btn-dark" type="submit">Create Coupon</button></div>
        </form>}
        <div className="overflow-x-auto"><table className="w-full min-w-[560px] text-left text-sm">
          <thead className="border-b border-neutral-200 bg-cream text-[10px] font-bold uppercase tracking-wide2 text-neutral-500"><tr><th className="px-4 py-3">Code</th><th>Discount</th><th>Min Spend</th><th>Status</th><th className="text-right">Actions</th></tr></thead>
          <tbody className="divide-y divide-neutral-100">{coupons.map((c) => <tr key={c.code}><td className="px-4 py-3 font-bold">{c.code}</td><td>{c.type === "percent" ? `${c.value}%` : formatBDT(c.value)}</td><td>{formatBDT(c.minSpend)}</td><td><span className={`px-2 py-1 text-[10px] font-bold uppercase ${c.active ? "bg-green-50 text-green-700" : "bg-neutral-100 text-neutral-500"}`}>{c.active ? "Active" : "Inactive"}</span></td><td className="text-right"><div className="flex justify-end gap-2"><button onClick={() => { toggleCoupon(c.code); notify("Coupon status updated."); }} className="p-2 text-neutral-500 hover:text-ink">{c.active ? <EyeOff size={15} /> : <Eye size={15} />}</button><button onClick={() => { if (confirm(`Delete ${c.code}?`)) { deleteCoupon(c.code); notify("Coupon deleted."); } }} className="p-2 text-neutral-500 hover:text-red-600"><Trash2 size={15} /></button></div></td></tr>)}</tbody>
        </table></div>
      </Panel>
    </>
  );
}

/* ---------------- REVIEWS ---------------- */
function ReviewsManager() {
  const { reviews, updateReviewStatus, deleteReview } = useStore();
  const { notify } = useToast();
  return (
    <Panel>
      <div className="border-b border-neutral-200 p-4"><span className="text-xs text-neutral-500">{reviews.length} reviews</span></div>
      <div className="divide-y divide-neutral-100">
        {reviews.map((r) => <div key={r.id} className="flex flex-wrap items-start gap-4 p-5">
          <div className="stars text-xs">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</div>
          <div className="min-w-[200px] flex-1"><p className="text-[13px] font-bold">{r.title} <span className="font-normal text-neutral-500">— {r.name}</span></p><p className="mt-1 text-[12px] leading-relaxed text-neutral-600">{r.body}</p><p className="mt-2 text-[11px] text-neutral-400">{formatDate(r.date)} {r.verified && "· Verified Buyer"}</p></div>
          <div className="flex gap-2">
            <button onClick={() => { updateReviewStatus(r.id, r.status === "published" ? "hidden" : "published"); notify("Review status updated."); }} className={`flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold uppercase ${r.status === "published" ? "bg-green-50 text-green-700" : "bg-neutral-100 text-neutral-500"}`}>{r.status === "published" ? <><Check size={12} /> Published</> : <><EyeOff size={12} /> Hidden</>}</button>
            <button onClick={() => { if (confirm("Delete this review?")) { deleteReview(r.id); notify("Review deleted."); } }} className="p-2 text-neutral-500 hover:text-red-600"><Trash2 size={15} /></button>
          </div>
        </div>)}
      </div>
    </Panel>
  );
}

/* ---------------- BANNERS ---------------- */
function BannersManager() {
  const { banners, addBanner, updateBanner, deleteBanner } = useStore();
  const { notify } = useToast();
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ title: "", subtitle: "", cta: "SHOP NOW", href: "/collections/all", image: "hero-men" });
  const add = (e: React.FormEvent) => { e.preventDefault(); if (!form.title) return notify("Enter a headline.", "error"); addBanner({ ...form, id: `ban_${Date.now()}`, image: `/images/${form.image}.jpg`, active: true }); notify("Banner added."); setShow(false); };
  return (
    <>
      <Panel>
        <div className="flex items-center justify-between border-b border-neutral-200 p-4"><span className="text-xs text-neutral-500">{banners.length} banners</span><Btn onClick={() => setShow((v) => !v)}><Plus size={14} /> New Banner</Btn></div>
        {show && <form onSubmit={add} className="grid gap-3 border-b border-neutral-200 bg-cream p-5 sm:grid-cols-2">
          <Input label="Headline" value={form.title} onChange={(v) => setForm({ ...form, title: v })} />
          <Input label="Subtitle" value={form.subtitle} onChange={(v) => setForm({ ...form, subtitle: v })} />
          <Input label="Button Text" value={form.cta} onChange={(v) => setForm({ ...form, cta: v })} />
          <Input label="Link" value={form.href} onChange={(v) => setForm({ ...form, href: v })} />
          <Select label="Image" value={form.image} options={["hero-men", "hero-women", "editorial", "story", "lifestyle-1", "lifestyle-2", "lifestyle-3"].map((x) => ({ value: x, label: x }))} onChange={(v) => setForm({ ...form, image: v })} />
          <div className="sm:col-span-2"><button className="btn-dark" type="submit">Add Banner</button></div>
        </form>}
        <div className="divide-y divide-neutral-100">
          {banners.map((b: Banner) => <div key={b.id} className="flex flex-wrap items-center gap-4 p-5">
            <img src={b.image} alt="" className="h-16 w-24 object-cover" />
            <div className="min-w-[180px] flex-1"><p className="text-[13px] font-bold">{b.title}</p><p className="mt-1 text-[11px] text-neutral-500">{b.subtitle}</p><p className="mt-1 text-[10px] uppercase tracking-wide text-sand">{b.cta} → {b.href}</p></div>
            <div className="flex gap-2">
              <button onClick={() => { updateBanner({ ...b, active: !b.active }); notify("Banner status updated."); }} className={`flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold uppercase ${b.active ? "bg-green-50 text-green-700" : "bg-neutral-100 text-neutral-500"}`}>{b.active ? <><Check size={12} /> Active</> : <><EyeOff size={12} /> Inactive</>}</button>
              <button onClick={() => { if (confirm("Delete this banner?")) { deleteBanner(b.id); notify("Banner deleted."); } }} className="p-2 text-neutral-500 hover:text-red-600"><Trash2 size={15} /></button>
            </div>
          </div>)}
        </div>
      </Panel>
    </>
  );
}

/* ---------------- ANALYTICS ---------------- */
function AnalyticsManager() {
  const { orders, products, customers, reviews } = useStore();
  const revenue = orders.reduce((s, o) => s + o.total, 0);
  const byCategory = useMemo(() => {
    const map: Record<string, number> = {};
    orders.forEach((o) => o.lines.forEach((l) => {
      const p = products.find((x) => x.id === l.productId);
      const cat = p?.category ?? "other";
      map[cat] = (map[cat] ?? 0) + l.price * l.quantity;
    }));
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [orders, products]);
  const max = Math.max(1, ...byCategory.map((x) => x[1]));
  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-4">
        {[
          ["Revenue", formatBDT(revenue)], ["Orders", String(orders.length)],
          ["Customers", String(customers.length)], ["Reviews", String(reviews.length)],
        ].map(([l, v]) => <div key={l} className="border border-neutral-200 bg-white p-5"><p className="text-[10px] font-bold uppercase tracking-wide2 text-neutral-500">{l}</p><p className="mt-2 font-display text-2xl font-extrabold">{v}</p></div>)}
      </div>
      <Panel>
        <div className="border-b border-neutral-200 p-5"><h2 className="font-display text-base font-bold uppercase">Revenue by Category</h2></div>
        <div className="space-y-5 p-6">
          {byCategory.length === 0 && <p className="text-sm text-neutral-500">No sales data yet. Place a demo order to see analytics.</p>}
          {byCategory.map(([cat, val]) => <div key={cat}><div className="mb-2 flex justify-between text-[12px]"><span className="font-bold capitalize">{cat.replace(/-/g, " ")}</span><span>{formatBDT(val)}</span></div><div className="h-2.5 bg-cream"><div className="h-full bg-ink" style={{ width: `${(val / max) * 100}%` }} /></div></div>)}
        </div>
      </Panel>
    </div>
  );
}

/* ---------------- helpers ---------------- */
function Modal({ title, onClose, children, wide }: { title: string; onClose: () => void; children: React.ReactNode; wide?: boolean }) {
  return (
    <div className="fixed inset-0 z-[150] flex items-start justify-center overflow-y-auto p-4 sm:items-center">
      <div className="drawer-backdrop fixed inset-0 bg-black/60" onClick={onClose} />
      <div className={`relative my-4 w-full ${wide ? "max-w-3xl" : "max-w-lg"} bg-white p-6 shadow-2xl sm:p-8`}>
        <div className="mb-6 flex items-center justify-between border-b border-neutral-200 pb-4"><h2 className="font-display text-xl font-bold uppercase">{title}</h2><button onClick={onClose} className="p-1 hover:text-sand"><X size={22} /></button></div>
        {children}
      </div>
    </div>
  );
}

function Input({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return <div><label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide2">{label}</label><input type={type} className="field" value={value} onChange={(e) => onChange(e.target.value)} /></div>;
}

function Select({ label, value, options, onChange }: { label: string; value: string; options: { value: string; label: string }[]; onChange: (v: string) => void }) {
  return <div><label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide2">{label}</label><select className="field" value={value} onChange={(e) => onChange(e.target.value)}>{options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select></div>;
}

function blankProduct(): Product {
  return {
    id: "", slug: "", name: "", price: 990, category: "t-shirts", gender: "unisex",
    tags: [], description: "", details: [], images: ["/images/p-tshirt-1.jpg"],
    colors: [{ name: "Black", hex: "#111111" }], sizes: ["S", "M", "L", "XL"],
    stock: 20, rating: 4.5, reviewCount: 0, createdAt: new Date().toISOString().slice(0, 10),
  };
}
