"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Heart, LogOut, MapPin, Package, Settings, User } from "lucide-react";
import { useStore } from "@/lib/store";
import { formatBDT, formatDate } from "@/lib/format";
import { useToast } from "@/components/Toast";

const tabs = [
  { id: "overview", label: "Overview", icon: User },
  { id: "orders", label: "My Orders", icon: Package },
  { id: "profile", label: "Profile", icon: Settings },
];

export default function AccountPage() {
  const router = useRouter();
  const { user, orders, wishlist, logout, updateProfile, hydrated } = useStore();
  const { notify } = useToast();
  const [tab, setTab] = useState("overview");
  const [profile, setProfile] = useState({ name: "", email: "", phone: "" });

  useEffect(() => {
    if (user) setProfile({ name: user.name, email: user.email, phone: user.phone });
  }, [user]);

  if (!hydrated) return <div className="site-container py-20"><div className="skeleton h-64 w-full" /></div>;

  if (!user) {
    return (
      <div className="site-container flex min-h-[60vh] flex-col items-center justify-center text-center">
        <User size={44} strokeWidth={1} className="text-neutral-300" />
        <h1 className="mt-6 font-display text-3xl font-bold">Sign in to your account</h1>
        <p className="mt-3 max-w-sm text-sm text-neutral-500">Track orders, manage your details and keep your favourite pieces close.</p>
        <div className="mt-7 flex gap-3"><Link href="/login" className="btn-dark">Sign In</Link><Link href="/login" className="btn-outline">Register</Link></div>
      </div>
    );
  }

  const myOrders = orders.filter((o) => o.userId === user.id);
  const totalSpent = myOrders.reduce((s, o) => s + o.total, 0);

  const saveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(profile);
    notify("Profile updated successfully.");
  };

  return (
    <div className="site-container py-10 lg:py-14">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="eyebrow mb-2">My Account</p>
          <h1 className="font-display text-3xl font-extrabold uppercase tracking-tight sm:text-4xl">Hello, {user.name.split(" ")[0]}.</h1>
        </div>
        <button onClick={() => { logout(); notify("Signed out."); router.push("/"); }} className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wide2 text-neutral-500 hover:text-red-600"><LogOut size={15} /> Sign Out</button>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[230px_1fr]">
        <aside className="h-fit border border-neutral-200">
          <div className="border-b border-neutral-200 bg-cream p-5">
            <div className="flex h-11 w-11 items-center justify-center bg-ink font-display text-lg font-bold text-white">{user.name[0].toUpperCase()}</div>
            <p className="mt-3 text-sm font-bold">{user.name}</p>
            <p className="mt-0.5 truncate text-[11px] text-neutral-500">{user.email}</p>
          </div>
          <nav className="p-2">
            {tabs.map((t) => {
              const Icon = t.icon;
              return (
                <button key={t.id} onClick={() => setTab(t.id)} className={`flex w-full items-center gap-3 px-3 py-3 text-left text-[13px] font-semibold transition-colors ${tab === t.id ? "bg-ink text-white" : "hover:bg-cream"}`}>
                  <Icon size={16} /> {t.label}
                </button>
              );
            })}
            <Link href="/wishlist" className="flex w-full items-center gap-3 px-3 py-3 text-[13px] font-semibold hover:bg-cream"><Heart size={16} /> Wishlist <span className="ml-auto text-xs">({wishlist.length})</span></Link>
          </nav>
        </aside>

        <div>
          {tab === "overview" && (
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  { label: "Total Orders", value: String(myOrders.length), icon: Package },
                  { label: "Total Spent", value: formatBDT(totalSpent), icon: User },
                  { label: "Wishlist Items", value: String(wishlist.length), icon: Heart },
                ].map((s) => {
                  const Icon = s.icon;
                  return (
                    <div key={s.label} className="border border-neutral-200 p-5">
                      <Icon size={20} strokeWidth={1.3} className="text-sand" />
                      <p className="mt-4 font-display text-2xl font-extrabold">{s.value}</p>
                      <p className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-neutral-500">{s.label}</p>
                    </div>
                  );
                })}
              </div>

              <div className="border border-neutral-200">
                <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4"><h2 className="text-sm font-bold uppercase tracking-wide">Recent Orders</h2><button onClick={() => setTab("orders")} className="text-[11px] font-bold uppercase tracking-wide2 text-sand hover:underline">View All</button></div>
                {myOrders.length === 0 ? (
                  <div className="px-6 py-12 text-center"><p className="text-sm text-neutral-500">No orders yet.</p><Link href="/collections/all" className="btn-dark mt-5">Start Shopping</Link></div>
                ) : (
                  <div className="divide-y divide-neutral-100">
                    {myOrders.slice(0, 3).map((o) => (
                      <div key={o.id} className="flex flex-wrap items-center justify-between gap-3 px-6 py-4">
                        <div><p className="text-[13px] font-bold">{o.trackingNumber}</p><p className="mt-1 text-[11px] text-neutral-500">{formatDate(o.createdAt)} · {o.lines.length} item(s)</p></div>
                        <div className="flex items-center gap-4"><span className="text-[10px] font-bold uppercase tracking-wide text-sand">{o.status}</span><span className="text-sm font-bold">{formatBDT(o.total)}</span><Link href={`/order-tracking?order=${o.trackingNumber}`} className="text-[11px] font-bold uppercase tracking-wide2 hover:underline">Track</Link></div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="border border-neutral-200 bg-cream p-6">
                <p className="flex items-center gap-2 text-sm font-bold uppercase"><MapPin size={16} className="text-sand" /> Default Address</p>
                <p className="mt-3 text-[13px] leading-relaxed text-neutral-600">Add a default delivery address during checkout to speed up future orders.</p>
              </div>
            </div>
          )}

          {tab === "orders" && (
            <div className="border border-neutral-200">
              <div className="border-b border-neutral-200 px-6 py-4"><h2 className="text-sm font-bold uppercase tracking-wide">Order History</h2></div>
              {myOrders.length === 0 ? (
                <div className="px-6 py-16 text-center"><Package size={36} strokeWidth={1} className="mx-auto text-neutral-300" /><p className="mt-4 text-sm text-neutral-500">You haven&apos;t placed any orders yet.</p><Link href="/collections/all" className="btn-dark mt-6">Explore Collection</Link></div>
              ) : (
                <div className="divide-y divide-neutral-100">
                  {myOrders.map((o) => (
                    <div key={o.id} className="p-6">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div><p className="text-[13px] font-bold">{o.trackingNumber}</p><p className="mt-1 text-[11px] text-neutral-500">Placed {formatDate(o.createdAt)} · {o.payment.toUpperCase()}</p></div>
                        <span className="bg-ink px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-white">{o.status}</span>
                      </div>
                      <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-neutral-100 pt-4">
                        {o.lines.slice(0, 4).map((l) => <img key={l.key} src={l.image} alt="" className="h-14 w-12 object-cover" />)}
                        <div className="ml-auto text-right"><p className="text-sm font-bold">{formatBDT(o.total)}</p><Link href={`/order-tracking?order=${o.trackingNumber}`} className="mt-1 inline-block text-[11px] font-bold uppercase tracking-wide2 text-sand hover:underline">Track Order →</Link></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === "profile" && (
            <form onSubmit={saveProfile} className="max-w-xl border border-neutral-200 p-6 sm:p-8">
              <h2 className="font-display text-lg font-bold uppercase">Profile Details</h2>
              <p className="mt-1 text-xs text-neutral-500">Keep your details up to date for faster delivery.</p>
              <div className="mt-7 space-y-5">
                <div><label className="mb-2 block text-[11px] font-bold uppercase tracking-wide2">Full Name</label><input className="field" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} /></div>
                <div><label className="mb-2 block text-[11px] font-bold uppercase tracking-wide2">Email Address</label><input className="field" type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} /></div>
                <div><label className="mb-2 block text-[11px] font-bold uppercase tracking-wide2">Mobile Number</label><input className="field" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} /></div>
                <button type="submit" className="btn-dark">Save Changes</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
