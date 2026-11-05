"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { MENU, PHOTOS, PLACE, dishById, photo, rwf, type Dish } from "@/lib/data";
import { placeOrder, useDB, type Order } from "@/lib/store";
import { Logo } from "@/components/Logo";

type CartLine = { key: string; dishId: string; qty: number; options?: string; note?: string };

const MY_ORDERS = "umuriro:my-orders";

export function MenuApp() {
  const params = useSearchParams();
  const tableParam = params.get("table");
  const table = tableParam && /^\d{1,2}$/.test(tableParam) ? tableParam : null;
  const db = useDB();
  const soldOut = useMemo(() => new Set(db?.soldOut ?? []), [db]);

  const [cart, setCart] = useState<CartLine[]>([]);
  const [open, setOpen] = useState<Dish | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [tracking, setTracking] = useState<number | null>(null);
  const [active, setActive] = useState(MENU[0].id);

  const [mine, setMine] = useState<number[]>([]);
  useEffect(() => {
    const t = setTimeout(() => {
      try { setMine(JSON.parse(localStorage.getItem(MY_ORDERS) ?? "[]")); } catch {}
    }, 0);
    return () => clearTimeout(t);
  }, [tracking]);
  const activeOrder = db?.orders.find((o) => mine.includes(o.id) && ["new", "preparing", "ready"].includes(o.status));

  const count = cart.reduce((s, l) => s + l.qty, 0);
  const total = cart.reduce((s, l) => s + l.qty * (dishById(l.dishId)?.price ?? 0), 0);

  // highlight the section in view
  useEffect(() => {
    const els = MENU.map((s) => document.getElementById(`sec-${s.id}`)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id.slice(4))),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [tracking]);

  function add(line: Omit<CartLine, "key">) {
    setCart((c) => {
      const key = `${line.dishId}|${line.options ?? ""}|${line.note ?? ""}`;
      const found = c.find((l) => l.key === key);
      return found ? c.map((l) => (l.key === key ? { ...l, qty: l.qty + line.qty } : l)) : [...c, { ...line, key }];
    });
  }

  function send(details: { type: Order["type"]; table?: string; name?: string; phone?: string }) {
    const order = placeOrder({
      ...details,
      lines: cart.map((l) => {
        const d = dishById(l.dishId)!;
        return { dishId: d.id, name: d.name, price: d.price, qty: l.qty, options: l.options, note: l.note };
      }),
    });
    try {
      const mine = JSON.parse(localStorage.getItem(MY_ORDERS) ?? "[]") as number[];
      localStorage.setItem(MY_ORDERS, JSON.stringify([order.id, ...mine].slice(0, 10)));
    } catch {}
    setCart([]);
    setCartOpen(false);
    setTracking(order.id);
    window.scrollTo({ top: 0 });
  }

  if (tracking !== null) {
    return <Tracker id={tracking} onBack={() => setTracking(null)} />;
  }

  return (
    <div className="mx-auto min-h-dvh max-w-2xl bg-bone pb-28 shadow-[0_0_0_100vmax_var(--color-leaf)] [clip-path:inset(0_-100vmax)]">
      {/* banner */}
      <header className="relative isolate overflow-hidden bg-char px-4 pt-4 pb-6 text-bone">
        <img src={photo(PHOTOS.hero, 1000, 500)} alt="" className="absolute inset-0 -z-10 size-full object-cover opacity-45" />
        <div className="flex items-center justify-between">
          <Link href="/" aria-label="Umuriro website"><Logo light /></Link>
          <span className="rounded-full bg-bone px-3 py-1 text-sm font-bold text-leaf">{table ? `Table ${table}` : "Takeaway"}</span>
        </div>
        <h1 className="mt-10 font-display text-5xl font-black leading-none">Menu</h1>
        <p className="mt-1 text-sm text-bone/80">Kitchen open until 23:00. Prices include VAT.</p>
      </header>
      <div className="imigongo" aria-hidden="true" />

      {activeOrder && (
        <button onClick={() => setTracking(activeOrder.id)}
          className="flex w-full items-center gap-3 bg-ochre/25 px-4 py-3 text-left text-sm">
          <span className="size-2.5 rounded-full bg-ember ping" />
          <span className="flex-1">Order #{activeOrder.id} is {activeOrder.status === "new" ? "with the kitchen" : activeOrder.status === "preparing" ? "on the grill" : "ready"}.</span>
          <span className="font-bold text-leaf underline underline-offset-4">Track it</span>
        </button>
      )}

      {/* category nav */}
      <nav aria-label="Menu sections" className="sticky top-0 z-20 border-b border-mist bg-bone/95 backdrop-blur">
        <div className="flex gap-2 overflow-x-auto px-4 py-3 [scrollbar-width:none]">
          {MENU.map((s) => (
            <a key={s.id} href={`#sec-${s.id}`} aria-current={active === s.id ? "true" : undefined}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold transition-colors ${active === s.id ? "bg-leaf text-bone" : "bg-mist/70 text-char hover:bg-mist"}`}>
              {s.label}
            </a>
          ))}
        </div>
      </nav>

      {MENU.map((s) => (
        <section key={s.id} id={`sec-${s.id}`} aria-labelledby={`h-${s.id}`} className="scroll-mt-16 px-4 pt-8">
          <h2 id={`h-${s.id}`} className="font-display text-3xl font-black text-leaf">{s.label}</h2>
          <ul className="mt-2 divide-y divide-mist">
            {s.dishes.map((d) => {
              const out = soldOut.has(d.id);
              const inCart = cart.filter((l) => l.dishId === d.id).reduce((n, l) => n + l.qty, 0);
              return (
                <li key={d.id}>
                  <button disabled={out} onClick={() => setOpen(d)}
                    className="flex w-full items-center gap-4 py-4 text-left disabled:cursor-not-allowed">
                    <div className={`min-w-0 flex-1 ${out ? "opacity-45" : ""}`}>
                      {d.tag && !out && <span className="mb-1 inline-block rounded bg-ochre/25 px-1.5 py-0.5 text-xs font-bold text-char">{d.tag}</span>}
                      <p className="font-bold leading-snug">{d.name}</p>
                      <p className="mt-0.5 line-clamp-2 text-sm text-ash">{d.desc}</p>
                      <p className="mt-1.5 font-semibold tabular-nums">{out ? "Sold out today" : rwf(d.price)}</p>
                    </div>
                    {d.img ? (
                      <div className="relative shrink-0">
                        <img src={photo(d.img, 240, 240)} alt="" loading="lazy"
                          className={`size-24 rounded-xl bg-mist object-cover ${out ? "grayscale opacity-50" : ""}`} />
                        {inCart > 0 && <Badge n={inCart} />}
                      </div>
                    ) : inCart > 0 ? (
                      <div className="relative size-8"><Badge n={inCart} /></div>
                    ) : null}
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      ))}

      <p className="px-4 pt-10 text-center text-sm text-ash">Allergies? Tell your server or add a note to the dish.</p>

      {/* cart bar */}
      {count > 0 && !cartOpen && !open && (
        <div className="fixed inset-x-0 bottom-0 z-30 mx-auto max-w-2xl p-4 fade-in">
          <button onClick={() => setCartOpen(true)}
            className="flex w-full items-center gap-3 rounded-full bg-ember px-5 py-4 font-bold text-white shadow-xl hover:bg-ember-deep">
            <span className="grid size-7 place-items-center rounded-full bg-white text-sm text-ember">{count}</span>
            View order
            <span className="ml-auto tabular-nums">{rwf(total)}</span>
          </button>
        </div>
      )}

      {open && <DishSheet dish={open} onClose={() => setOpen(null)} onAdd={(l) => { add(l); setOpen(null); }} />}
      {cartOpen && (
        <CartSheet cart={cart} setCart={setCart} table={table} total={total}
          onClose={() => setCartOpen(false)} onSend={send} soldOut={soldOut} />
      )}
    </div>
  );
}

function Badge({ n }: { n: number }) {
  return <span className="absolute -top-2 -right-2 grid size-7 place-items-center rounded-full bg-ember text-sm font-bold text-white ring-3 ring-bone">{n}</span>;
}

/* ---------- bottom sheet shell ---------- */
function Sheet({ label, onClose, children }: { label: string; onClose: () => void; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    ref.current?.focus();
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center">
      <div className="fade-in absolute inset-0 bg-char/60" onClick={onClose} />
      <div ref={ref} tabIndex={-1} role="dialog" aria-modal="true" aria-label={label}
        className="sheet-in relative flex max-h-[92dvh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl bg-bone outline-none">
        <button onClick={onClose} aria-label="Close"
          className="absolute right-3 top-3 z-10 grid size-10 place-items-center rounded-full bg-bone/90 text-xl font-bold shadow">×</button>
        {children}
      </div>
    </div>
  );
}

function Stepper({ value, onChange, min = 0, label }: { value: number; onChange: (n: number) => void; min?: number; label: string }) {
  return (
    <div className="flex items-center rounded-full border-2 border-mist bg-white font-bold">
      <button onClick={() => onChange(Math.max(min, value - 1))} aria-label={`One less ${label}`} className="grid size-10 place-items-center text-lg">−</button>
      <span className="w-6 text-center tabular-nums">{value}</span>
      <button onClick={() => onChange(Math.min(20, value + 1))} aria-label={`One more ${label}`} className="grid size-10 place-items-center text-lg">+</button>
    </div>
  );
}

/* ---------- dish detail ---------- */
function DishSheet({ dish, onClose, onAdd }: { dish: Dish; onClose: () => void; onAdd: (l: Omit<CartLine, "key">) => void }) {
  const [qty, setQty] = useState(1);
  const [choices, setChoices] = useState<string[]>(dish.options?.map((o) => o.choices[0]) ?? []);
  const [note, setNote] = useState("");
  return (
    <Sheet label={dish.name} onClose={onClose}>
      <div className="overflow-y-auto">
        {dish.img && <img src={photo(dish.img, 900, 600)} alt={dish.name} className="aspect-[3/2] w-full bg-mist object-cover" />}
        <div className="p-5">
          <h2 className="font-display text-4xl font-black leading-none text-leaf">{dish.name}</h2>
          <p className="mt-2 text-ash">{dish.desc}</p>
          <p className="mt-2 text-lg font-bold tabular-nums">{rwf(dish.price)}</p>

          {dish.options?.map((o, i) => (
            <fieldset key={o.label} className="mt-6">
              <legend className="mb-2 font-bold">{o.label}</legend>
              <div className="flex flex-wrap gap-2">
                {o.choices.map((c) => {
                  const on = choices[i] === c;
                  return (
                    <label key={c} className={`cursor-pointer rounded-full border-2 px-4 py-2 text-sm font-semibold transition-colors has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-ember ${on ? "border-leaf bg-leaf text-bone" : "border-mist bg-white"}`}>
                      <input type="radio" className="sr-only" name={o.label} checked={on} onChange={() => setChoices((p) => p.map((x, j) => (j === i ? c : x)))} />
                      {c}
                    </label>
                  );
                })}
              </div>
            </fieldset>
          ))}

          <label className="mt-6 block">
            <span className="font-bold">Note for the kitchen</span>
            <input value={note} onChange={(e) => setNote(e.target.value)} maxLength={80} placeholder="No onions, extra sauce..."
              className="mt-2 w-full rounded-xl border-2 border-mist bg-white px-3.5 py-3 focus:border-leaf focus:outline-none" />
          </label>
        </div>
      </div>
      <div className="flex items-center gap-3 border-t border-mist p-4">
        <Stepper value={qty} onChange={setQty} min={1} label={dish.name} />
        <button onClick={() => onAdd({ dishId: dish.id, qty, options: choices.join(", ") || undefined, note: note.trim() || undefined })}
          className="flex flex-1 items-center justify-between rounded-full bg-ember px-5 py-3 font-bold text-white hover:bg-ember-deep">
          Add to order <span className="tabular-nums">{rwf(dish.price * qty)}</span>
        </button>
      </div>
    </Sheet>
  );
}

/* ---------- cart / checkout ---------- */
function CartSheet({ cart, setCart, table, total, onClose, onSend, soldOut }: {
  cart: CartLine[]; setCart: React.Dispatch<React.SetStateAction<CartLine[]>>; table: string | null; total: number;
  onClose: () => void; onSend: (d: { type: Order["type"]; table?: string; name?: string; phone?: string }) => void; soldOut: Set<string>;
}) {
  const [type, setType] = useState<Order["type"]>(table ? "dine-in" : "takeaway");
  const [tableNo, setTableNo] = useState(table ?? "");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const unavailable = cart.filter((l) => soldOut.has(l.dishId));

  useEffect(() => { if (cart.length === 0) onClose(); }, [cart.length, onClose]);

  function submit() {
    if (unavailable.length) return setError("Remove the sold-out dishes before sending.");
    if (type === "dine-in" && !tableNo) return setError("Pick your table number. It's on the QR card.");
    if (type === "takeaway" && (!name.trim() || phone.replace(/\D/g, "").length < 9))
      return setError("Add your name and phone so we can call you when it's ready.");
    onSend(type === "dine-in" ? { type, table: tableNo } : { type, name: name.trim(), phone });
  }

  return (
    <Sheet label="Your order" onClose={onClose}>
      <div className="overflow-y-auto p-5">
        <h2 className="font-display text-4xl font-black text-leaf">Your order</h2>
        <ul className="mt-3 divide-y divide-mist">
          {cart.map((l) => {
            const d = dishById(l.dishId)!;
            return (
              <li key={l.key} className="flex items-center gap-3 py-3">
                <div className="min-w-0 flex-1">
                  <p className="font-bold">{d.name}</p>
                  {(l.options || l.note) && <p className="text-sm text-ash">{[l.options, l.note && `“${l.note}”`].filter(Boolean).join(". ")}</p>}
                  {soldOut.has(l.dishId) && <p className="text-sm font-bold text-ember-deep">Just sold out</p>}
                  <p className="text-sm font-semibold tabular-nums">{rwf(d.price * l.qty)}</p>
                </div>
                <Stepper value={l.qty} label={d.name}
                  onChange={(n) => setCart((c) => (n === 0 ? c.filter((x) => x.key !== l.key) : c.map((x) => (x.key === l.key ? { ...x, qty: n } : x))))} />
              </li>
            );
          })}
        </ul>

        <div className="mt-5 grid grid-cols-2 gap-1 rounded-full bg-mist p-1" role="radiogroup" aria-label="Eating here or taking away">
          {(["dine-in", "takeaway"] as const).map((t) => (
            <button key={t} role="radio" aria-checked={type === t} onClick={() => { setType(t); setError(""); }}
              className={`rounded-full py-2.5 font-bold transition-colors ${type === t ? "bg-white shadow" : "text-ash"}`}>
              {t === "dine-in" ? "Eating here" : "Takeaway"}
            </button>
          ))}
        </div>

        {type === "dine-in" ? (
          <label className="mt-4 block">
            <span className="font-bold">Table</span>
            <select value={tableNo} onChange={(e) => setTableNo(e.target.value)}
              className="mt-2 w-full rounded-xl border-2 border-mist bg-white px-3.5 py-3">
              <option value="">Choose your table</option>
              {Array.from({ length: PLACE.tables }, (_, i) => String(i + 1)).map((n) => <option key={n} value={n}>Table {n}</option>)}
            </select>
          </label>
        ) : (
          <div className="mt-4 grid grid-cols-2 gap-3">
            <label className="block"><span className="font-bold">Name</span>
              <input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" className="mt-2 w-full rounded-xl border-2 border-mist bg-white px-3.5 py-3" />
            </label>
            <label className="block"><span className="font-bold">Phone</span>
              <input value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" autoComplete="tel" placeholder="078..." className="mt-2 w-full rounded-xl border-2 border-mist bg-white px-3.5 py-3" />
            </label>
          </div>
        )}
        {error && <p role="alert" className="mt-3 font-semibold text-ember-deep">{error}</p>}
      </div>
      <div className="border-t border-mist p-4">
        <div className="mb-3 flex items-baseline justify-between">
          <span className="text-ash">Total</span>
          <span className="font-display text-3xl font-black tabular-nums">{rwf(total)}</span>
        </div>
        <button onClick={submit} className="w-full rounded-full bg-ember py-4 font-bold text-white hover:bg-ember-deep">Send to kitchen</button>
        <p className="mt-2 text-center text-xs text-ash">You pay at the end with MoMo, card or cash.</p>
      </div>
    </Sheet>
  );
}

/* ---------- live order tracker ---------- */
const STEPS = [
  { s: "new", label: "Received", hint: "The kitchen has your order." },
  { s: "preparing", label: "On the grill", hint: "Being cooked now." },
  { s: "ready", label: "Ready", hint: "Coming out to you." },
  { s: "done", label: "Enjoy", hint: "Served. Shout if you need anything." },
] as const;

function Tracker({ id, onBack }: { id: number; onBack: () => void }) {
  const db = useDB();
  const order = db?.orders.find((o) => o.id === id);
  if (!order) return <div className="grid min-h-dvh place-items-center bg-bone text-ash">Loading your order…</div>;
  const idx = STEPS.findIndex((s) => s.s === order.status);
  const cancelled = order.status === "cancelled";

  return (
    <div className="mx-auto min-h-dvh max-w-2xl bg-bone shadow-[0_0_0_100vmax_var(--color-leaf)] [clip-path:inset(0_-100vmax)]">
      <div className="bg-leaf px-5 pb-8 pt-5 text-bone">
        <Logo light />
        <p className="mt-10 text-bone/75">Order #{order.id}{order.table ? `, table ${order.table}` : ", takeaway"}</p>
        <h1 className="font-display text-5xl font-black leading-none" aria-live="polite">
          {cancelled ? "Order cancelled" : STEPS[idx].label}
        </h1>
        <p className="mt-2 text-bone/85">{cancelled ? "Sorry, something on your order wasn't available. A server will come by." : STEPS[idx].hint}</p>
      </div>
      <div className="imigongo" aria-hidden="true" />
      {!cancelled && (
        <ol className="px-5 pt-8">
          {STEPS.map((s, i) => {
            const done = i < idx, now = i === idx;
            return (
              <li key={s.s} className="relative flex gap-4 pb-7 last:pb-0">
                {i < STEPS.length - 1 && <span className={`absolute left-[15px] top-8 h-[calc(100%-2rem)] w-0.5 ${done ? "bg-leaf" : "bg-mist"}`} aria-hidden="true" />}
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
            <li key={i} className="flex gap-3"><span className="font-bold">{l.qty}×</span><span className="flex-1">{l.name}</span><span className="tabular-nums">{rwf(l.qty * l.price)}</span></li>
          ))}
        </ul>
        <p className="mt-3 flex justify-between border-t border-mist pt-3 font-bold"><span>Total</span><span className="tabular-nums">{rwf(order.total)}</span></p>
      </div>
      <div className="p-5">
        <button onClick={onBack} className="w-full rounded-full border-2 border-leaf py-3.5 font-bold text-leaf">Order something else</button>
      </div>
    </div>
  );
}
