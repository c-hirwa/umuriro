"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { DELIVERY_ZONES, PICKUP_ETA, PLACE, photo, rwf, type Dish } from "@/lib/data";
import { useDB, type Order } from "@/lib/store";
import type { CartLine } from "@/lib/cart";
import { Logo } from "@/components/Logo";

const noop = () => () => {};
/** false during prerender and hydration, true after. Use before reading the clock or storage in render. */
export const useMounted = () => useSyncExternalStore(noop, () => true, () => false);

export function CloseIcon({ className = "size-5" }: { className?: string }) {
  return <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>;
}
export function BackIcon({ className = "size-5" }: { className?: string }) {
  return <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg>;
}

export function VegMark() {
  return <span title="Vegetarian" className="inline-grid size-5 place-items-center rounded border-2 border-leaf-soft text-[10px] font-black text-leaf-soft" aria-label="Vegetarian">V</span>;
}

export function Badge({ n }: { n: number }) {
  return <span className="absolute -top-2 -right-2 grid size-7 place-items-center rounded-full bg-ember text-sm font-bold text-white ring-3 ring-bone">{n}</span>;
}

/* ---------- bottom sheet (phones) / centred dialog (desktop) ---------- */
export function Sheet({ label, onClose, children, side = false }: { label: string; onClose: () => void; children: React.ReactNode; side?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const close = useRef(onClose);
  useEffect(() => { close.current = onClose; });
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close.current();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const opener = document.activeElement as HTMLElement | null;
    ref.current?.focus();
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = prev; opener?.focus?.(); };
  }, []);
  return (
    <div className={`fixed inset-0 z-50 flex justify-center ${side ? "items-end sm:items-stretch sm:justify-end" : "items-end sm:items-center sm:p-6"}`}>
      <div className="fade-in absolute inset-0 bg-char/60 backdrop-blur-[2px]" onClick={onClose} aria-hidden="true" />
      <div ref={ref} tabIndex={-1} role="dialog" aria-modal="true" aria-label={label}
        className={`relative flex max-h-[92dvh] w-full flex-col overflow-hidden bg-bone outline-none ${side
          ? "sheet-in rounded-t-3xl sm:drawer-in sm:max-h-none sm:max-w-md sm:rounded-none"
          : "sheet-in max-w-2xl rounded-t-3xl sm:max-w-xl sm:rounded-3xl"}`}>
        <div className="mx-auto mt-2 h-1.5 w-10 shrink-0 rounded-full bg-mist sm:hidden" aria-hidden="true" />
        <button onClick={onClose} aria-label="Close"
          className="absolute right-3 top-3 z-10 grid size-10 place-items-center rounded-full bg-white/95 text-char shadow-md hover:bg-white">
          <CloseIcon />
        </button>
        {children}
      </div>
    </div>
  );
}

export function Stepper({ value, onChange, min = 0, label, small = false }: { value: number; onChange: (n: number) => void; min?: number; label: string; small?: boolean }) {
  const btn = small ? "size-8" : "size-10";
  return (
    <div className="flex shrink-0 items-center rounded-full border-2 border-mist bg-white font-bold">
      <button type="button" onClick={() => onChange(Math.max(min, value - 1))} aria-label={value - 1 < 1 ? `Remove ${label}` : `One less ${label}`} className={`grid ${btn} place-items-center text-lg`}>{value <= 1 && min === 0 ? <TrashIcon /> : "−"}</button>
      <span className="w-6 text-center tabular-nums" aria-live="polite">{value}</span>
      <button type="button" onClick={() => onChange(Math.min(20, value + 1))} aria-label={`One more ${label}`} className={`grid ${btn} place-items-center text-lg`}>+</button>
    </div>
  );
}
function TrashIcon() {
  return <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true"><path d="M5 7h14M10 11v6M14 11v6M6 7l1 12a2 2 0 002 2h6a2 2 0 002-2l1-12M9 7V4h6v3" /></svg>;
}

/* ---------- dish detail ---------- */
export function DishSheet({ dish, onClose, onAdd, note }: { dish: Dish; onClose: () => void; onAdd: (l: Omit<CartLine, "key">) => void; note?: string }) {
  const [qty, setQty] = useState(1);
  const [choices, setChoices] = useState<string[]>(dish.options?.map((o) => o.choices[0]) ?? []);
  const [kitchenNote, setKitchenNote] = useState("");
  return (
    <Sheet label={dish.name} onClose={onClose}>
      <div className="overflow-y-auto">
        {dish.img ? <img src={photo(dish.img, 900, 600)} alt={dish.name} className="aspect-[3/2] w-full bg-mist object-cover" />
          : <div className="h-14" aria-hidden="true" />}
        <div className="p-5">
          {dish.tag && <span className="mb-2 inline-block rounded bg-ochre/25 px-1.5 py-0.5 text-xs font-bold">{dish.tag}</span>}
          <h2 className="flex items-center gap-2 font-display text-4xl font-black leading-none text-leaf">{dish.name}{dish.veg && <VegMark />}</h2>
          <p className="mt-2 text-ash">{dish.desc}</p>
          <p className="mt-2 text-lg font-bold tabular-nums">{rwf(dish.price)}</p>
          {note && <p className="mt-2 rounded-lg bg-ochre/20 px-3 py-2 text-sm font-semibold">{note}</p>}

          {dish.options?.map((o, i) => (
            <fieldset key={o.label} className="mt-6">
              <legend className="mb-2 font-bold">{o.label}</legend>
              <div className="flex flex-wrap gap-2">
                {o.choices.map((c) => {
                  const on = choices[i] === c;
                  return (
                    <label key={c} className={`cursor-pointer rounded-full border-2 px-4 py-2 text-sm font-semibold transition-colors has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-ember ${on ? "border-leaf bg-leaf text-bone" : "border-mist bg-white hover:border-leaf/40"}`}>
                      <input type="radio" className="sr-only" name={o.label} checked={on} onChange={() => setChoices((p) => p.map((x, j) => (j === i ? c : x)))} />
                      {c}
                    </label>
                  );
                })}
              </div>
            </fieldset>
          ))}

          <label className="mt-6 block">
            <span className="font-bold">Note for the kitchen</span> <span className="text-sm text-ash">(optional)</span>
            <input value={kitchenNote} onChange={(e) => setKitchenNote(e.target.value)} maxLength={80} placeholder="No onions, extra sauce, allergies..."
              className="mt-2 w-full rounded-xl border-2 border-mist bg-white px-3.5 py-3 focus:border-leaf focus:outline-none" />
          </label>
        </div>
      </div>
      <div className="flex items-center gap-3 border-t border-mist bg-bone p-4">
        <Stepper value={qty} onChange={setQty} min={1} label={dish.name} />
        <button onClick={() => onAdd({ dishId: dish.id, qty, options: choices.join(", ") || undefined, note: kitchenNote.trim() || undefined })}
          className="flex flex-1 items-center justify-between gap-2 rounded-full bg-ember px-5 py-3 font-bold text-white hover:bg-ember-deep">
          Add to cart <span className="tabular-nums">{rwf(dish.price * qty)}</span>
        </button>
      </div>
    </Sheet>
  );
}

/* ---------- small confirmation toast ---------- */
export function useToast() {
  const [msg, setMsg] = useState<string | null>(null);
  useEffect(() => {
    if (!msg) return;
    const t = setTimeout(() => setMsg(null), 2200);
    return () => clearTimeout(t);
  }, [msg]);
  const node = msg ? (
    <div role="status" className="pop-in fixed left-1/2 top-20 z-[60] -translate-x-1/2 rounded-full bg-char px-5 py-2.5 text-sm font-semibold text-bone shadow-xl">
      {msg}
    </div>
  ) : null;
  return [node, setMsg] as const;
}

/* ---------- live order tracker ---------- */
type Step = { s: Order["status"]; label: string; hint: string };
export function stepsFor(o: Order): Step[] {
  if (o.type === "delivery") return [
    { s: "new", label: "Order received", hint: "The kitchen has your order." },
    { s: "preparing", label: "On the grill", hint: "Being cooked now." },
    { s: "ready", label: "On its way", hint: "Your rider has left. They'll call when they're close." },
    { s: "done", label: "Delivered", hint: "Enjoy your food." },
  ];
  if (o.type === "takeaway") return [
    { s: "new", label: "Order received", hint: "The kitchen has your order." },
    { s: "preparing", label: "On the grill", hint: "Being cooked now." },
    { s: "ready", label: "Ready for pickup", hint: `Come to the counter and give order number #${o.id}.` },
    { s: "done", label: "Collected", hint: "Thanks for picking up. Enjoy." },
  ];
  return [
    { s: "new", label: "Received", hint: "The kitchen has your order." },
    { s: "preparing", label: "On the grill", hint: "Being cooked now." },
    { s: "ready", label: "Ready", hint: "Coming out to you." },
    { s: "done", label: "Enjoy", hint: "Served. Shout if you need anything." },
  ];
}

const PAY: Record<string, string> = { momo: "MTN MoMo or Airtel Money", card: "Card", cash: "Cash" };

export function Tracker({ id, back }: { id: number; back: { label: string; href?: string; onClick?: () => void } }) {
  const db = useDB();
  if (!db) return <div className="grid min-h-dvh place-items-center bg-bone text-ash">Loading your order…</div>;
  const order = db.orders.find((o) => o.id === id);
  if (!order) {
    return (
      <div className="grid min-h-dvh place-items-center bg-bone p-6 text-center">
        <div>
          <p className="font-display text-4xl font-black text-leaf">We can&apos;t find that order</p>
          <p className="mt-2 text-ash">It may have been placed on another device.</p>
          <Link href="/order" className="mt-6 inline-block rounded-full bg-ember px-6 py-3 font-bold text-white">Start a new order</Link>
        </div>
      </div>
    );
  }
  const steps = stepsFor(order);
  const idx = steps.findIndex((s) => s.s === order.status);
  const cancelled = order.status === "cancelled";
  const zone = DELIVERY_ZONES.find((z) => z.name === order.zone);
  const eta = order.type === "delivery" ? zone?.eta : order.type === "takeaway" ? PICKUP_ETA : null;
  const where = order.table ? `table ${order.table}` : order.type === "delivery" ? "delivery" : "pickup";
  const subtotal = order.lines.reduce((s, l) => s + l.qty * l.price, 0);

  const backBtn = "w-full rounded-full border-2 border-leaf py-3.5 text-center font-bold text-leaf hover:bg-leaf hover:text-bone";

  return (
    <div className="mx-auto min-h-dvh max-w-2xl bg-bone pb-10 shadow-[0_0_0_100vmax_var(--color-leaf)] [clip-path:inset(0_-100vmax)]">
      <div className="bg-leaf px-5 pb-8 pt-5 text-bone">
        <div className="flex items-center justify-between">
          <Link href="/" aria-label="Umuriro home"><Logo light /></Link>
          {back.href ? <Link href={back.href} className="rounded-full bg-bone/10 px-3 py-1.5 text-sm font-bold hover:bg-bone/20">Close</Link>
            : <button onClick={back.onClick} className="rounded-full bg-bone/10 px-3 py-1.5 text-sm font-bold hover:bg-bone/20">Close</button>}
        </div>
        <p className="mt-10 text-bone/75">Order #{order.id}, {where}</p>
        <h1 className="font-display text-5xl font-black leading-none" aria-live="polite">
          {cancelled ? "Order cancelled" : steps[idx].label}
        </h1>
        <p className="mt-2 text-bone/85">{cancelled ? "Sorry, something on your order wasn't available. We'll call you to sort it out." : steps[idx].hint}</p>
        {eta && !cancelled && order.status !== "done" && <p className="mt-4 inline-block rounded-full bg-bone/15 px-3 py-1 text-sm font-semibold">{order.when && order.when !== "asap" ? `Scheduled for ${order.when}` : `Usually ${eta}`}</p>}
      </div>
      <div className="imigongo" aria-hidden="true" />
      {!cancelled && (
        <ol className="px-5 pt-8">
          {steps.map((s, i) => {
            const done = i < idx, now = i === idx;
            return (
              <li key={s.s} className="relative flex gap-4 pb-7 last:pb-0">
                {i < steps.length - 1 && <span className={`absolute left-[15px] top-8 h-[calc(100%-2rem)] w-0.5 ${done ? "bg-leaf" : "bg-mist"}`} aria-hidden="true" />}
                <span className={`grid size-8 shrink-0 place-items-center rounded-full text-sm font-bold ${done ? "bg-leaf text-bone" : now ? "bg-ember text-white ping" : "bg-mist text-ash"}`}>
                  {done ? "✓" : i + 1}
                </span>
                <div className={now ? "" : "text-ash"}>
                  <p className="font-bold">{s.label}</p>
                  {now && <p className="text-sm">{s.hint}</p>}
                </div>
              </li>
            );
          })}
        </ol>
      )}
      <div className="mx-5 mt-8 rounded-2xl bg-white p-4">
        <ul className="space-y-1.5 text-sm">
          {order.lines.map((l, i) => (
            <li key={i} className="flex gap-3">
              <span className="font-bold">{l.qty}×</span>
              <span className="flex-1">{l.name}{l.options && <span className="block text-ash">{l.options}</span>}</span>
              <span className="tabular-nums">{rwf(l.qty * l.price)}</span>
            </li>
          ))}
        </ul>
        {order.fee ? (
          <div className="mt-3 space-y-1 border-t border-mist pt-3 text-sm">
            <p className="flex justify-between"><span>Subtotal</span><span className="tabular-nums">{rwf(subtotal)}</span></p>
            <p className="flex justify-between"><span>Delivery</span><span className="tabular-nums">{rwf(order.fee)}</span></p>
          </div>
        ) : null}
        <p className="mt-3 flex justify-between border-t border-mist pt-3 font-bold"><span>Total</span><span className="tabular-nums">{rwf(order.total)}</span></p>
      </div>
      {(order.address || order.payment) && (
        <dl className="mx-5 mt-3 grid gap-3 rounded-2xl bg-white p-4 text-sm sm:grid-cols-2">
          {order.address && <div><dt className="text-ash">Delivering to</dt><dd className="font-semibold">{order.address}{order.zone && <span className="block font-normal text-ash">{order.zone}</span>}</dd></div>}
          {order.payment && <div><dt className="text-ash">Paying with</dt><dd className="font-semibold">{PAY[order.payment]}{order.payment === "momo" ? "" : order.type === "delivery" ? " on delivery" : " at pickup"}</dd></div>}
        </dl>
      )}
      <div className="space-y-3 p-5">
        {back.href ? <Link href={back.href} className={`block ${backBtn}`}>{back.label}</Link> : <button onClick={back.onClick} className={backBtn}>{back.label}</button>}
        <a href={`tel:${PLACE.phoneDisplay.replace(/\s/g, "")}`} className="block text-center text-sm font-semibold text-ash underline underline-offset-4">Questions? Call {PLACE.phoneDisplay}</a>
      </div>
    </div>
  );
}
