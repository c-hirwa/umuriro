"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DELIVERY_ZONES, FREE_DELIVERY_FROM, MIN_DELIVERY_ORDER, PICKUP_ETA, PLACE, dishById, rwf } from "@/lib/data";
import { placeOrder, useDB, type Payment } from "@/lib/store";
import { rememberOrder, useCart } from "@/lib/cart";
import { BackIcon, Stepper, useMounted } from "./ui";

type Mode = "takeaway" | "delivery";
const SAVED = "umuriro:checkout-details";
const field = "mt-1.5 w-full rounded-xl border-2 border-mist bg-white px-3.5 py-3 focus:border-leaf focus:outline-none aria-[invalid=true]:border-ember";

/** 30-minute slots from 45 minutes from now until 22:30 tonight. */
function slots(now: Date) {
  const out: string[] = [];
  const t = new Date(now.getTime() + 45 * 60_000);
  t.setMinutes(t.getMinutes() < 30 ? 30 : 60, 0, 0);
  const last = new Date(now); last.setHours(22, 30, 0, 0);
  for (; t <= last; t.setMinutes(t.getMinutes() + 30)) out.push(`${String(t.getHours()).padStart(2, "0")}:${String(t.getMinutes()).padStart(2, "0")}`);
  return out;
}

export function Checkout() {
  const router = useRouter();
  const mounted = useMounted();
  const db = useDB();
  const soldOut = useMemo(() => new Set(db?.soldOut ?? []), [db]);
  const cart = useCart("online");

  const [mode, setMode] = useState<Mode>("delivery");
  const [f, setF] = useState({ name: "", phone: "", zone: "", address: "", when: "asap", payment: "momo" as Payment, note: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [placing, setPlacing] = useState(false);
  const set = (k: keyof typeof f, v: string) => { setF((p) => ({ ...p, [k]: v })); setErrors((e) => ({ ...e, [k]: "" })); };

  // remember details from last time (this browser only)
  useEffect(() => {
    const t = setTimeout(() => {
      try {
        const saved = JSON.parse(localStorage.getItem(SAVED) ?? "null");
        if (saved) { setF((p) => ({ ...p, ...saved })); if (saved.mode) setMode(saved.mode); }
      } catch {}
    }, 0);
    return () => clearTimeout(t);
  }, []);

  const times = useMemo(() => (mounted ? slots(new Date()) : []), [mounted]);
  const zone = DELIVERY_ZONES.find((z) => z.id === f.zone);
  const free = cart.subtotal >= FREE_DELIVERY_FROM;
  const fee = mode === "delivery" && zone && !free ? zone.fee : 0;
  const total = cart.subtotal + fee;
  const unavailable = cart.lines.filter((l) => soldOut.has(l.dishId));

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const err: Record<string, string> = {};
    if (!f.name.trim()) err.name = "Add your name.";
    if (f.phone.replace(/\D/g, "").length < 9) err.phone = "Add a phone number we can call.";
    if (mode === "delivery") {
      if (!f.zone) err.zone = "Pick your area so we know the fee.";
      if (f.address.trim().length < 6) err.address = "Add a street, house number or landmark for the rider.";
      if (cart.subtotal < MIN_DELIVERY_ORDER) err.form = `Delivery orders start at ${rwf(MIN_DELIVERY_ORDER)}. Add a little more, or switch to pickup.`;
    }
    if (unavailable.length) err.form = "Some dishes just sold out. Remove them to continue.";
    setErrors(err);
    if (Object.values(err).some(Boolean)) {
      document.querySelector<HTMLElement>("[aria-invalid=true], [role=alert]")?.scrollIntoView({ block: "center", behavior: "smooth" });
      return;
    }
    setPlacing(true);
    const order = placeOrder({
      type: mode,
      channel: "online",
      name: f.name.trim(),
      phone: f.phone.trim(),
      address: mode === "delivery" ? f.address.trim() : undefined,
      zone: mode === "delivery" ? zone?.name : undefined,
      when: f.when,
      payment: f.payment,
      note: f.note.trim() || undefined,
      fee: fee || undefined,
      lines: cart.lines.map((l) => {
        const d = dishById(l.dishId)!;
        return { dishId: d.id, name: d.name, price: d.price, qty: l.qty, options: l.options, note: l.note };
      }),
    });
    try { localStorage.setItem(SAVED, JSON.stringify({ name: f.name, phone: f.phone, zone: f.zone, address: f.address, payment: f.payment, mode })); } catch {}
    rememberOrder(order.id);
    cart.clear();
    router.push(`/order/track?id=${order.id}`);
  }

  if (!mounted) return <div className="min-h-[60vh]" />;

  if (cart.lines.length === 0 && !placing) {
    return (
      <div className="mx-auto grid min-h-[60vh] max-w-md place-items-center px-4 text-center">
        <div>
          <h1 className="font-display text-5xl font-black text-leaf">Your cart is empty</h1>
          <p className="mt-2 text-ash">Pick a few dishes first, then come back here to check out.</p>
          <Link href="/order" className="mt-6 inline-block rounded-full bg-ember px-6 py-3 font-bold text-white hover:bg-ember-deep">Browse the menu</Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="mx-auto grid max-w-6xl gap-8 px-4 pb-16 pt-6 sm:px-6 lg:grid-cols-[1fr_380px]">
      <div className="min-w-0">
        <Link href="/order" className="inline-flex items-center gap-1 text-sm font-bold text-leaf hover:underline"><BackIcon className="size-4" /> Back to the menu</Link>
        <h1 className="mt-3 font-display text-6xl font-black leading-none text-leaf">Checkout</h1>

        <Block n={1} title="Pickup or delivery">
          <div className="grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Pickup or delivery">
            {([["delivery", "Delivery", "Our riders cover most of Kigali"], ["takeaway", "Pickup", `Ready in about ${PICKUP_ETA} at ${PLACE.address}`]] as const).map(([m, t, sub]) => (
              <button type="button" key={m} role="radio" aria-checked={mode === m} onClick={() => { setMode(m); setErrors({}); }}
                className={`rounded-2xl border-2 p-4 text-left transition-colors ${mode === m ? "border-leaf bg-leaf text-bone" : "border-mist bg-white hover:border-leaf/40"}`}>
                <span className="block font-display text-2xl font-black">{t}</span>
                <span className={`text-sm ${mode === m ? "text-bone/80" : "text-ash"}`}>{sub}</span>
              </button>
            ))}
          </div>
        </Block>

        <Block n={2} title="Your details">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Name" error={errors.name}>
              <input className={field} value={f.name} onChange={(e) => set("name", e.target.value)} autoComplete="name" aria-invalid={!!errors.name} />
            </Field>
            <Field label="Phone" hint="We'll call if anything changes" error={errors.phone}>
              <input className={field} value={f.phone} onChange={(e) => set("phone", e.target.value)} type="tel" autoComplete="tel" placeholder="078..." aria-invalid={!!errors.phone} />
            </Field>
            {mode === "delivery" && (
              <>
                <Field label="Area" error={errors.zone} className="sm:col-span-2">
                  <select className={field} value={f.zone} onChange={(e) => set("zone", e.target.value)} aria-invalid={!!errors.zone}>
                    <option value="">Choose your area</option>
                    {DELIVERY_ZONES.map((z) => <option key={z.id} value={z.id}>{z.name} · {free ? "free" : rwf(z.fee)} · {z.eta}</option>)}
                  </select>
                </Field>
                <Field label="Address and directions" error={errors.address} className="sm:col-span-2">
                  <textarea className={`${field} min-h-20`} value={f.address} onChange={(e) => set("address", e.target.value)} autoComplete="street-address"
                    placeholder="KG 9 Ave, house 14. Blue gate opposite the pharmacy." aria-invalid={!!errors.address} />
                </Field>
              </>
            )}
          </div>
        </Block>

        <Block n={3} title={mode === "delivery" ? "When should it arrive?" : "When will you pick it up?"}>
          <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Time">
            {["asap", ...times].map((t) => (
              <button type="button" key={t} role="radio" aria-checked={f.when === t} onClick={() => set("when", t)}
                className={`rounded-full border-2 px-4 py-2 text-sm font-bold tabular-nums transition-colors ${f.when === t ? "border-leaf bg-leaf text-bone" : "border-mist bg-white hover:border-leaf/40"}`}>
                {t === "asap" ? `As soon as possible (${mode === "delivery" ? zone?.eta ?? "30–60 min" : PICKUP_ETA})` : t}
              </button>
            ))}
          </div>
          {times.length === 0 && <p className="mt-2 text-sm text-ash">No later slots left today. Ordering now gets it to you as soon as possible.</p>}
        </Block>

        <Block n={4} title="Payment">
          <div className="grid gap-3 sm:grid-cols-3" role="radiogroup" aria-label="Payment">
            {([
              ["momo", "Mobile Money", "MTN MoMo or Airtel. We send a payment prompt to your phone once the order is confirmed."],
              ["card", "Card", mode === "delivery" ? "The rider brings a card machine." : "Pay by card at the counter."],
              ["cash", "Cash", mode === "delivery" ? "Pay the rider. Exact change helps." : "Pay at the counter."],
            ] as const).map(([p, t, sub]) => (
              <button type="button" key={p} role="radio" aria-checked={f.payment === p} onClick={() => set("payment", p)}
                className={`rounded-2xl border-2 p-4 text-left transition-colors ${f.payment === p ? "border-leaf bg-white ring-2 ring-leaf" : "border-mist bg-white hover:border-leaf/40"}`}>
                <span className="block font-bold">{t}</span>
                <span className="text-sm text-ash">{sub}</span>
              </button>
            ))}
          </div>
          <Field label="Note for the restaurant" hint="optional" className="mt-4">
            <input className={field} value={f.note} onChange={(e) => set("note", e.target.value)} maxLength={140} placeholder="Cutlery for 4, call when outside..." />
          </Field>
        </Block>
      </div>

      {/* summary */}
      <aside aria-label="Order summary" className="lg:pt-16">
        <div className="sticky top-[88px] rounded-3xl bg-white p-5 shadow-sm">
          <h2 className="font-display text-3xl font-black text-leaf">Your order</h2>
          <ul className="mt-2 divide-y divide-mist">
            {cart.lines.map((l) => {
              const d = dishById(l.dishId)!;
              return (
                <li key={l.key} className="flex items-center gap-3 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-bold leading-snug">{d.name}</p>
                    {(l.options || l.note) && <p className="text-sm text-ash">{[l.options, l.note && `“${l.note}”`].filter(Boolean).join(". ")}</p>}
                    {soldOut.has(l.dishId) && <p className="text-sm font-bold text-ember-deep">Just sold out</p>}
                    <p className="text-sm font-semibold tabular-nums">{rwf(d.price * l.qty)}</p>
                  </div>
                  <Stepper small value={l.qty} label={d.name} onChange={(n) => cart.setQty(l.key, n)} />
                </li>
              );
            })}
          </ul>
          <dl className="space-y-1.5 border-t border-mist pt-4 text-sm">
            <div className="flex justify-between"><dt>Subtotal</dt><dd className="tabular-nums">{rwf(cart.subtotal)}</dd></div>
            {mode === "delivery" && (
              <div className="flex justify-between"><dt>Delivery</dt><dd className="tabular-nums">{free ? "Free" : zone ? rwf(zone.fee) : "Pick your area"}</dd></div>
            )}
            <div className="flex items-baseline justify-between pt-2 text-base font-bold"><dt>Total</dt><dd className="font-display text-3xl font-black tabular-nums">{rwf(total)}</dd></div>
          </dl>
          {mode === "delivery" && !free && <p className="mt-1 text-xs text-ash">Free delivery on orders over {rwf(FREE_DELIVERY_FROM)}.</p>}
          {errors.form && <p role="alert" className="mt-3 rounded-xl bg-ember/10 p-3 text-sm font-semibold text-ember-deep">{errors.form}</p>}
          <button disabled={placing} className="mt-4 w-full rounded-full bg-ember py-4 font-bold text-white hover:bg-ember-deep disabled:opacity-60">
            {placing ? "Placing order…" : `Place order · ${rwf(total)}`}
          </button>
          <p className="mt-2 text-center text-xs text-ash">You&apos;ll see live updates from the kitchen after ordering.</p>
        </div>
      </aside>
    </form>
  );
}

function Block({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="mb-3 flex items-center gap-3 text-lg font-bold">
        <span className="grid size-7 place-items-center rounded-full bg-ember text-sm text-white">{n}</span>{title}
      </h2>
      {children}
    </section>
  );
}

function Field({ label, hint, error, className = "", children }: { label: string; hint?: string; error?: string; className?: string; children: React.ReactNode }) {
  return (
    <label className={`block ${className}`}>
      <span className="font-semibold">{label}</span>{hint && <span className="text-sm text-ash"> ({hint})</span>}
      {children}
      {error && <span className="mt-1.5 block text-sm font-semibold text-ember-deep" role="alert">{error}</span>}
    </label>
  );
}
