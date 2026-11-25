"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { ArrowLeft, Check, CreditCard, Lock, Smartphone, Truck } from "lucide-react";
import { useStore } from "@/lib/store";
import { divisions } from "@/lib/data";
import { formatBDT, shippingCost } from "@/lib/format";
import type { PaymentMethod, ShippingAddress } from "@/lib/types";
import { useToast } from "@/components/Toast";

const paymentMethods: { id: PaymentMethod; label: string; desc: string; icon: React.ElementType }[] = [
  { id: "cod", label: "Cash on Delivery", desc: "Pay when your order arrives", icon: Truck },
  { id: "bkash", label: "bKash", desc: "Pay with your bKash account", icon: Smartphone },
  { id: "nagad", label: "Nagad", desc: "Pay with your Nagad account", icon: Smartphone },
  { id: "sslcommerz", label: "Card / SSLCommerz", desc: "Visa, Mastercard & more", icon: CreditCard },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, subtotal, appliedCoupon, placeOrder, user } = useStore();
  const { notify } = useToast();

  const [form, setForm] = useState<ShippingAddress>({
    fullName: user?.name ?? "",
    phone: user?.phone ?? "",
    email: user?.email ?? "",
    division: "Dhaka",
    district: "",
    area: "",
    address: "",
    note: "",
  });
  const [payment, setPayment] = useState<PaymentMethod>("cod");
  const [transactionId, setTransactionId] = useState("");
  const [account, setAccount] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [placing, setPlacing] = useState(false);

  const shipping = useMemo(
    () => shippingCost(`${form.division} ${form.district}`, subtotal),
    [form.division, form.district, subtotal],
  );
  const discount = appliedCoupon?.discount ?? 0;
  const total = Math.max(0, subtotal + shipping - discount);

  const districts = divisions[form.division] ?? [];

  const set = (key: keyof ShippingAddress, value: string) => {
    setForm((f) => ({ ...f, [key]: value, ...(key === "division" ? { district: "" } : {}) }));
    setErrors((e) => ({ ...e, [key]: "" }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.fullName.trim()) e.fullName = "Full name is required";
    const phone = form.phone.replace(/\D/g, "");
    if (phone.length < 10) e.phone = "Enter a valid mobile number";
    if (!form.email.includes("@")) e.email = "Enter a valid email";
    if (!form.district) e.district = "Select your district";
    if (!form.area.trim()) e.area = "Area / thana is required";
    if (form.address.trim().length < 8) e.address = "Enter your full delivery address";
    if ((payment === "bkash" || payment === "nagad") && !transactionId.trim()) e.transactionId = "Enter the transaction ID";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cart.length) return notify("Your bag is empty.", "error");
    if (!validate()) return notify("Please check the highlighted fields.", "error");
    setPlacing(true);
    setTimeout(() => {
      const order = placeOrder(form, payment, { transactionId, account });
      notify("Order placed successfully!");
      router.push(`/order-confirmation?order=${order.id}`);
    }, 600);
  };

  if (!cart.length) {
    return (
      <div className="site-container flex min-h-[60vh] flex-col items-center justify-center text-center">
        <h1 className="font-display text-3xl font-bold">Nothing to check out</h1>
        <p className="mt-3 text-sm text-neutral-500">Add something to your bag first.</p>
        <Link href="/collections/all" className="btn-dark mt-7">Browse Collection</Link>
      </div>
    );
  }

  return (
    <div className="site-container py-10 lg:py-14">
      <Link href="/cart" className="mb-8 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-wide2 text-neutral-500 hover:text-ink"><ArrowLeft size={14} /> Back to Bag</Link>
      <h1 className="font-display text-3xl font-extrabold uppercase tracking-tight sm:text-4xl">Checkout</h1>
      <p className="mt-2 text-sm text-neutral-500">Secure, Bangladesh-focused checkout. Your details stay with us.</p>

      <form onSubmit={submit} className="mt-10 grid gap-10 lg:grid-cols-[1fr_400px] lg:gap-14">
        <div className="space-y-10">
          {/* Delivery info */}
          <section>
            <h2 className="flex items-center gap-3 font-display text-lg font-bold uppercase"><span className="flex h-7 w-7 items-center justify-center bg-ink text-xs text-white">1</span> Delivery Information</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Field label="Full Name *" error={errors.fullName}>
                <input className="field" value={form.fullName} onChange={(e) => set("fullName", e.target.value)} placeholder="e.g. Tanim Ahmed" />
              </Field>
              <Field label="Mobile Number *" error={errors.phone}>
                <div className="flex">
                  <span className="flex items-center border border-r-0 border-neutral-300 bg-cream px-3 text-sm">+880</span>
                  <input className="field" value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="1700-000000" inputMode="tel" />
                </div>
              </Field>
              <Field label="Email Address *" error={errors.email} full>
                <input className="field" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="you@example.com" />
              </Field>
              <Field label="Division *">
                <select className="field" value={form.division} onChange={(e) => set("division", e.target.value)}>
                  {Object.keys(divisions).map((d) => <option key={d}>{d}</option>)}
                </select>
              </Field>
              <Field label="District *" error={errors.district}>
                <select className="field" value={form.district} onChange={(e) => set("district", e.target.value)}>
                  <option value="">Select district</option>
                  {districts.map((d) => <option key={d}>{d}</option>)}
                </select>
              </Field>
              <Field label="Area / Thana *" error={errors.area}>
                <input className="field" value={form.area} onChange={(e) => set("area", e.target.value)} placeholder="e.g. Dhanmondi" />
              </Field>
              <Field label="Delivery Charge">
                <div className="field flex items-center justify-between bg-cream">
                  <span>{shipping === 0 ? "Free delivery applied" : form.division === "Dhaka" ? "Inside Dhaka" : "Outside Dhaka"}</span>
                  <span className="font-bold">{shipping === 0 ? "FREE" : formatBDT(shipping)}</span>
                </div>
              </Field>
              <Field label="Full Delivery Address *" error={errors.address} full>
                <textarea className="field" rows={3} value={form.address} onChange={(e) => set("address", e.target.value)} placeholder="House / flat, road, landmark, post code" />
              </Field>
              <Field label="Order Note (optional)" full>
                <input className="field" value={form.note} onChange={(e) => set("note", e.target.value)} placeholder="Anything we should know?" />
              </Field>
            </div>
          </section>

          {/* Payment */}
          <section>
            <h2 className="flex items-center gap-3 font-display text-lg font-bold uppercase"><span className="flex h-7 w-7 items-center justify-center bg-ink text-xs text-white">2</span> Payment Method</h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {paymentMethods.map((m) => {
                const Icon = m.icon;
                return (
                  <button type="button" key={m.id} onClick={() => setPayment(m.id)} className={`flex items-center gap-3 border p-4 text-left transition-colors ${payment === m.id ? "border-ink bg-cream" : "border-neutral-300 hover:border-neutral-500"}`}>
                    <span className={`flex h-9 w-9 shrink-0 items-center justify-center ${payment === m.id ? "bg-ink text-white" : "bg-cream text-ink"}`}><Icon size={17} /></span>
                    <span><span className="block text-[13px] font-bold">{m.label}</span><span className="mt-0.5 block text-[11px] text-neutral-500">{m.desc}</span></span>
                  </button>
                );
              })}
            </div>

            {(payment === "bkash" || payment === "nagad") && (
              <div className="mt-4 border border-neutral-300 bg-cream p-5">
                <p className="text-[13px] font-bold">Send payment to {payment === "bkash" ? "bKash" : "Nagad"} Merchant</p>
                <p className="mt-1 text-xs text-neutral-600">Number: <strong>{payment === "bkash" ? "+880 1700-000000" : "+880 1800-000000"}</strong> (Send Money)</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <Field label="Transaction ID *" error={errors.transactionId}>
                    <input className="field" value={transactionId} onChange={(e) => { setTransactionId(e.target.value); setErrors((x) => ({ ...x, transactionId: "" })); }} placeholder="e.g. BK7X9A2LMN" />
                  </Field>
                  <Field label="Your account number">
                    <input className="field" value={account} onChange={(e) => setAccount(e.target.value)} placeholder="01XXXXXXXXX" />
                  </Field>
                </div>
              </div>
            )}

            {payment === "sslcommerz" && (
              <div className="mt-4 border border-neutral-300 bg-cream p-5 text-xs leading-relaxed text-neutral-600">
                <p className="font-bold text-ink">Card payment (integration-ready)</p>
                <p className="mt-1">SSLCommerz credentials are configured via server-side environment variables. In this demo, placing the order creates a pending payment session. Add your store ID and password in <code className="bg-white px-1">.env.local</code> and wire the GatewayPageURL callback to go live.</p>
              </div>
            )}
          </section>
        </div>

        {/* Summary */}
        <aside className="h-fit border border-neutral-200 bg-cream p-6 lg:sticky lg:top-28">
          <h2 className="font-display text-lg font-bold uppercase">Your Order</h2>
          <div className="mt-5 max-h-72 space-y-4 overflow-y-auto border-b border-neutral-300 pb-5">
            {cart.map((line) => (
              <div key={line.key} className="flex gap-3">
                <div className="relative h-16 w-14 shrink-0 bg-white"><img src={line.image} alt="" className="h-full w-full object-cover" /><span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-ink text-[9px] font-bold text-white">{line.quantity}</span></div>
                <div className="flex-1"><p className="text-[12px] font-bold leading-snug">{line.name}</p><p className="mt-1 text-[10px] text-neutral-500">{line.size} · {line.color}</p></div>
                <span className="text-xs font-bold">{formatBDT(line.price * line.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-neutral-600">Subtotal</span><span className="font-semibold">{formatBDT(subtotal)}</span></div>
            <div className="flex justify-between"><span className="text-neutral-600">Delivery</span><span className="font-semibold">{shipping === 0 ? "Free" : formatBDT(shipping)}</span></div>
            {discount > 0 && <div className="flex justify-between text-[#a4343f]"><span>Discount ({appliedCoupon?.code})</span><span className="font-semibold">−{formatBDT(discount)}</span></div>}
          </div>
          <div className="mt-5 flex items-center justify-between border-t border-neutral-300 pt-5">
            <span className="text-sm font-bold uppercase tracking-wide">Total</span>
            <span className="font-display text-2xl font-extrabold">{formatBDT(total)}</span>
          </div>
          <button type="submit" disabled={placing} className="btn-dark mt-6 w-full disabled:opacity-60">
            {placing ? "Placing Order…" : <><Lock size={14} /> Place Order</>}
          </button>
          <p className="mt-3 flex items-center justify-center gap-1.5 text-[10px] text-neutral-500"><Check size={12} className="text-green-600" /> Your order is confirmed by phone before dispatch</p>
        </aside>
      </form>
    </div>
  );
}

function Field({ label, error, full, children }: { label: string; error?: string; full?: boolean; children: React.ReactNode }) {
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <label className="mb-2 block text-[11px] font-bold uppercase tracking-wide2">{label}</label>
      {children}
      {error && <p className="mt-1 text-[11px] text-red-600">{error}</p>}
    </div>
  );
}
