"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { useStore } from "@/lib/store";
import { useToast } from "@/components/Toast";

export default function LoginPage() {
  const router = useRouter();
  const { login, register } = useStore();
  const { notify } = useToast();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.email.includes("@")) return setError("Please enter a valid email address.");
    if (form.password.length < 6) return setError("Password must be at least 6 characters.");
    setBusy(true);
    setTimeout(() => {
      if (mode === "register") {
        if (!form.name.trim()) { setError("Please enter your name."); setBusy(false); return; }
        if (form.password !== form.confirm) { setError("Passwords do not match."); setBusy(false); return; }
        const res = register(form.name, form.email, form.phone, form.password);
        if (!res.ok) { setError(res.message); setBusy(false); return; }
        notify(res.message);
        router.push("/account");
      } else {
        const res = login(form.email, form.password);
        if (!res.ok) { setError(res.message); setBusy(false); return; }
        notify(res.message);
        router.push(form.email.toLowerCase() === "admin@ryveno.com" ? "/admin" : "/account");
      }
      setBusy(false);
    }, 350);
  };

  return (
    <div className="grid min-h-[calc(100vh-160px)] lg:grid-cols-2">
      {/* Visual */}
      <div className="relative hidden overflow-hidden bg-ink lg:block">
        <img src="/images/hero-women.jpg" alt="RYVENO campaign" className="absolute inset-0 h-full w-full object-cover opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />
        <div className="relative flex h-full flex-col justify-between p-12 text-white">
          <Link href="/" className="font-display text-2xl font-extrabold tracking-brand">RYVENO</Link>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide2 text-sand">Your space</p>
            <h2 className="mt-4 max-w-md font-display text-4xl font-extrabold uppercase leading-tight tracking-tight">Style is personal.<br />So is your account.</h2>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/70">Track orders, save your favourites and check out faster — all in one place.</p>
          </div>
          <p className="text-[10px] uppercase tracking-wide2 text-white/50">Wear Your Identity · Since 2026</p>
        </div>
      </div>

      {/* Form */}
      <div className="flex items-center justify-center px-5 py-14 sm:px-10">
        <div className="w-full max-w-md">
          <Link href="/" className="font-display text-2xl font-extrabold tracking-brand lg:hidden">RYVENO</Link>
          <p className="eyebrow mt-8 lg:mt-0">Welcome</p>
          <h1 className="mt-3 font-display text-3xl font-extrabold uppercase tracking-tight sm:text-4xl">{mode === "login" ? "Sign In" : "Create Account"}</h1>
          <p className="mt-2 text-sm text-neutral-500">{mode === "login" ? "Welcome back. Your wardrobe is waiting." : "Join RYVENO and make it yours."}</p>

          <div className="mt-8 flex border-b border-neutral-200">
            {(["login", "register"] as const).map((m) => (
              <button key={m} onClick={() => { setMode(m); setError(""); }} className={`flex-1 border-b-2 pb-3 text-[11px] font-bold uppercase tracking-wide2 transition-colors ${mode === m ? "border-ink text-ink" : "border-transparent text-neutral-400 hover:text-ink"}`}>
                {m === "login" ? "Sign In" : "Register"}
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="mt-8 space-y-5">
            {mode === "register" && (
              <div>
                <label className="mb-2 block text-[11px] font-bold uppercase tracking-wide2">Full Name</label>
                <input className="field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your full name" />
              </div>
            )}
            <div>
              <label className="mb-2 block text-[11px] font-bold uppercase tracking-wide2">Email Address</label>
              <input className="field" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
            </div>
            {mode === "register" && (
              <div>
                <label className="mb-2 block text-[11px] font-bold uppercase tracking-wide2">Mobile Number</label>
                <input className="field" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+880 1700-000000" />
              </div>
            )}
            <div>
              <label className="mb-2 block text-[11px] font-bold uppercase tracking-wide2">Password</label>
              <div className="relative">
                <input className="field pr-12" type={showPass ? "text" : "password"} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••••••" />
                <button type="button" onClick={() => setShowPass((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-ink" aria-label="Toggle password">{showPass ? <EyeOff size={17} /> : <Eye size={17} />}</button>
              </div>
            </div>
            {mode === "register" && (
              <div>
                <label className="mb-2 block text-[11px] font-bold uppercase tracking-wide2">Confirm Password</label>
                <input className="field" type="password" value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} placeholder="••••••••" />
              </div>
            )}
            {error && <p className="border-l-2 border-red-600 bg-red-50 px-4 py-3 text-xs text-red-700">{error}</p>}
            <button type="submit" disabled={busy} className="btn-dark w-full disabled:opacity-60">{busy ? "Please wait…" : <>{mode === "login" ? "Sign In" : "Create Account"} <ArrowRight size={14} /></>}</button>
          </form>

          <p className="mt-6 text-center text-xs text-neutral-500">
            {mode === "login" ? "New to RYVENO? " : "Already have an account? "}
            <button onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }} className="font-bold text-ink hover:text-sand">{mode === "login" ? "Create an account" : "Sign in"}</button>
          </p>
          <p className="mt-8 border-t border-neutral-200 pt-5 text-center text-[10px] leading-relaxed text-neutral-400">
            Demo admin: admin@ryveno.com / admin123
          </p>
        </div>
      </div>
    </div>
  );
}
