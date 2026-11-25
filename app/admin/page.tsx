"use client";

import Link from "next/link";
import { ArrowRight, Boxes, DollarSign, ShoppingCart, Users } from "lucide-react";
import { useStore } from "@/lib/store";
import { formatBDT, formatDate } from "@/lib/format";

const chartData = [38, 52, 44, 68, 58, 82, 64, 90, 74, 96, 88, 100];
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function AdminOverview() {
  const { orders, customers, products, banners, reviews } = useStore();
  const revenue = orders.reduce((s, o) => s + o.total, 0);
  const avgOrder = orders.length ? Math.round(revenue / orders.length) : 0;

  const stats = [
    { label: "Total Sales", value: formatBDT(revenue), sub: `${avgOrder ? formatBDT(avgOrder) + " avg. order" : "No orders yet"}`, icon: DollarSign },
    { label: "Total Orders", value: String(orders.length), sub: `${orders.filter((o) => o.status === "Pending").length} pending`, icon: ShoppingCart },
    { label: "Total Customers", value: String(customers.filter((c) => c.role === "customer").length), sub: "Registered accounts", icon: Users },
    { label: "Products", value: String(products.length), sub: `${products.filter((p) => p.stock < 10).length} low stock`, icon: Boxes },
  ];

  return (
    <div className="space-y-7">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><p className="text-[11px] font-bold uppercase tracking-wide2 text-sand">Dashboard</p><h1 className="mt-1 font-display text-2xl font-extrabold uppercase tracking-tight sm:text-3xl">Overview</h1></div>
        <p className="text-xs text-neutral-500">{new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, sub, icon: Icon }) => (
          <div key={label} className="border border-neutral-200 bg-white p-6">
            <div className="flex items-start justify-between"><div><p className="text-[11px] font-bold uppercase tracking-wide2 text-neutral-500">{label}</p><p className="mt-3 font-display text-2xl font-extrabold sm:text-3xl">{value}</p></div><span className="flex h-10 w-10 items-center justify-center bg-cream text-sand"><Icon size={19} strokeWidth={1.5} /></span></div>
            <p className="mt-3 text-[11px] text-neutral-400">{sub}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
        <div className="border border-neutral-200 bg-white p-6">
          <div className="flex items-center justify-between"><div><h2 className="font-display text-base font-bold uppercase">Sales Analytics</h2><p className="mt-1 text-[11px] text-neutral-500">Revenue overview · 2026</p></div><span className="border border-neutral-200 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide">This Year</span></div>
          <div className="mt-8 flex h-52 items-end gap-2">
            {chartData.map((h, i) => (
              <div key={i} className="group flex h-full flex-1 flex-col justify-end gap-2">
                <div className="relative flex-1 flex items-end"><div className={`w-full transition-all duration-500 ${i === chartData.length - 1 ? "bg-sand" : "bg-ink/85 group-hover:bg-sand"}`} style={{ height: `${h}%` }}><span className="absolute -top-6 left-1/2 hidden -translate-x-1/2 bg-ink px-1.5 py-0.5 text-[9px] text-white group-hover:block">{h}k</span></div></div>
                <span className="text-center text-[9px] text-neutral-400">{months[i]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="border border-neutral-200 bg-white p-6">
          <h2 className="font-display text-base font-bold uppercase">Quick Actions</h2>
          <div className="mt-5 grid gap-3">
            {[
              ["/admin/products", "Add New Product", "Build your catalogue"],
              ["/admin/orders", "Manage Orders", "Update order statuses"],
              ["/admin/coupons", "Create Coupon", "Launch a promotion"],
              ["/admin/banners", "Edit Banners", "Refresh the homepage"],
            ].map(([href, title, desc]) => (
              <Link key={href} href={href} className="flex items-center justify-between border border-neutral-200 p-4 transition-colors hover:border-ink hover:bg-cream">
                <span><span className="block text-[13px] font-bold">{title}</span><span className="mt-0.5 block text-[11px] text-neutral-500">{desc}</span></span><ArrowRight size={15} className="text-neutral-400" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="border border-neutral-200 bg-white">
          <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4"><h2 className="font-display text-base font-bold uppercase">Recent Orders</h2><Link href="/admin/orders" className="text-[11px] font-bold uppercase tracking-wide2 text-sand hover:underline">View All</Link></div>
          {orders.length === 0 ? <p className="px-6 py-10 text-center text-sm text-neutral-500">No orders yet.</p> : (
            <div className="divide-y divide-neutral-100">
              {orders.slice(0, 5).map((o) => (
                <div key={o.id} className="flex items-center justify-between px-6 py-4">
                  <div><p className="text-[13px] font-bold">{o.trackingNumber}</p><p className="mt-0.5 text-[11px] text-neutral-500">{o.address.fullName} · {formatDate(o.createdAt)}</p></div>
                  <div className="text-right"><p className="text-[13px] font-bold">{formatBDT(o.total)}</p><p className="mt-0.5 text-[10px] font-bold uppercase tracking-wide text-sand">{o.status}</p></div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border border-neutral-200 bg-white">
          <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4"><h2 className="font-display text-base font-bold uppercase">Low Stock Alert</h2><Link href="/admin/products" className="text-[11px] font-bold uppercase tracking-wide2 text-sand hover:underline">Manage</Link></div>
          <div className="divide-y divide-neutral-100">
            {products.filter((p) => p.stock < 16).slice(0, 5).map((p) => (
              <div key={p.id} className="flex items-center gap-4 px-6 py-3">
                <img src={p.images[0]} alt="" className="h-12 w-10 object-cover" />
                <div className="flex-1"><p className="text-[13px] font-bold">{p.name}</p><p className="mt-0.5 text-[11px] text-neutral-500">{p.id}</p></div>
                <span className={`px-2.5 py-1 text-[10px] font-bold ${p.stock < 10 ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-700"}`}>{p.stock} left</span>
              </div>
            ))}
          </div>
          <div className="border-t border-neutral-200 px-6 py-4 text-xs text-neutral-500">Banners: {banners.length} · Reviews: {reviews.length} · awaiting moderation</div>
        </div>
      </div>
    </div>
  );
}
