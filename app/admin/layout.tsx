"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  BarChart3, Bell, LayoutDashboard, LogOut, Menu, Package, Percent,
  Search, Settings, ShoppingCart, Tag, Users, X,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { useToast } from "@/components/Toast";

const nav = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/coupons", label: "Coupons", icon: Percent },
  { href: "/admin/reviews", label: "Reviews", icon: Tag },
  { href: "/admin/banners", label: "Banners", icon: Settings },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, login, logout, hydrated } = useStore();
  const { notify } = useToast();
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  if (!hydrated) return <div className="min-h-screen bg-cream p-10"><div className="skeleton h-96 w-full" /></div>;

  if (!user || user.role !== "admin") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream px-5">
        <div className="w-full max-w-md border border-neutral-200 bg-white p-9 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center bg-ink text-white"><LayoutDashboard size={24} strokeWidth={1.4} /></div>
          <p className="eyebrow mt-6">Restricted Area</p>
          <h1 className="mt-3 font-display text-2xl font-extrabold uppercase">Admin Dashboard</h1>
          <p className="mt-3 text-sm leading-relaxed text-neutral-600">Sign in with an administrator account to manage RYVENO.</p>
          <button
            onClick={() => { const res = login("admin@ryveno.com", "admin123"); if (res.ok) notify("Welcome to the admin dashboard."); else notify(res.message, "error"); }}
            className="btn-dark mt-7 w-full"
          >Enter Admin Demo</button>
          <Link href="/login" className="mt-4 block text-xs font-semibold text-neutral-500 hover:text-ink">Use the sign-in page instead →</Link>
        </div>
      </div>
    );
  }

  const isActive = (href: string) => href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <div className="min-h-screen bg-cream">
      {/* Top bar */}
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-neutral-200 bg-white px-5 lg:px-8">
        <div className="flex items-center gap-3">
          <button onClick={() => setMenuOpen((v) => !v)} className="lg:hidden" aria-label="Toggle navigation">{menuOpen ? <X size={22} /> : <Menu size={22} />}</button>
          <Link href="/admin" className="font-display text-xl font-extrabold tracking-brand">RYVENO <span className="ml-1 text-[10px] font-semibold tracking-wide2 text-sand">ADMIN</span></Link>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-2 border border-neutral-200 px-3 py-2 sm:flex"><Search size={14} className="text-neutral-400" /><span className="text-xs text-neutral-400">Search anything…</span></div>
          <button className="relative p-2 text-neutral-500 hover:text-ink" aria-label="Notifications"><Bell size={19} /><span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" /></button>
          <div className="flex items-center gap-2 border-l pl-4">
            <span className="flex h-8 w-8 items-center justify-center bg-ink text-xs font-bold text-white">{user.name[0]}</span>
            <div className="hidden sm:block"><p className="text-xs font-bold">{user.name}</p><p className="text-[10px] text-neutral-500">Administrator</p></div>
          </div>
          <button onClick={() => { logout(); router.push("/"); }} className="p-2 text-neutral-500 hover:text-red-600" aria-label="Sign out"><LogOut size={18} /></button>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`fixed inset-y-16 left-0 z-30 w-60 overflow-y-auto border-r border-neutral-200 bg-white transition-transform lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] lg:translate-x-0 ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}>
          <p className="px-6 pb-2 pt-6 text-[10px] font-bold uppercase tracking-wide2 text-neutral-400">Management</p>
          <nav className="px-3 pb-8">
            {nav.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)} className={`mb-1 flex items-center gap-3 px-3 py-3 text-[13px] font-semibold transition-colors ${isActive(item.href) ? "bg-ink text-white" : "text-coal hover:bg-cream"}`}>
                  <Icon size={17} strokeWidth={1.6} />{item.label}
                </Link>
              );
            })}
          </nav>
          <div className="mx-3 border-t border-neutral-200 pt-5">
            <Link href="/" className="flex items-center gap-3 px-3 py-3 text-[13px] font-semibold text-neutral-500 hover:text-ink">← View Storefront</Link>
          </div>
        </aside>

        {menuOpen && <div className="fixed inset-0 top-16 z-20 bg-black/30 lg:hidden" onClick={() => setMenuOpen(false)} />}

        <main className="min-w-0 flex-1 p-5 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
