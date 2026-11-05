"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { MENU, menuForNow, PHOTOS, PLACE, dishById, photo, rwf, type Dish } from "@/lib/data";
import { placeOrder, useDB, type Order } from "@/lib/store";
import { rememberOrder, useCart, useMyOrderIds } from "@/lib/cart";
import { Logo } from "@/components/Logo";
import { BackIcon, Badge, DishSheet, Sheet, Stepper, Tracker, VegMark, useMounted, useToast } from "@/components/order/ui";

/** The menu guests open from the QR code on their table. Without ?table= it works as a browsable menu. */
export function MenuApp() {
  const params = useSearchParams();
  const tableParam = params.get("table");
  const table = tableParam && /^\d{1,2}$/.test(tableParam) && Number(tableParam) >= 1 && Number(tableParam) <= PLACE.tables ? tableParam : null;
  const db = useDB();
  const soldOut = useMemo(() => new Set(db?.soldOut ?? []), [db]);
  const cart = useCart("table");
  const mounted = useMounted();
  const [toast, showToast] = useToast();

  const [open, setOpen] = useState<Dish | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [tracking, setTracking] = useState<number | null>(null);
  const [active, setActive] = useState("");
  const [query, setQuery] = useState("");
  const [vegOnly, setVegOnly] = useState(false);

  const mine = useMyOrderIds();
  const activeOrder = db?.orders.find((o) => mine.includes(o.id) && o.channel !== "online" && ["new", "preparing", "ready"].includes(o.status));

  const menu = useMemo(() => menuForNow(mounted ? new Date() : undefined), [mounted]);
  const q = query.trim().toLowerCase();
  const sections = menu.map((s) => ({
    ...s,
    dishes: s.dishes.filter((d) => (!vegOnly || d.veg) && (!q || `${d.name} ${d.desc}`.toLowerCase().includes(q))),
  })).filter((s) => s.dishes.length);

  // highlight the section in view
  useEffect(() => {
    const els = MENU.map((s) => document.getElementById(`sec-${s.id}`)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id.slice(4))),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [tracking, q, vegOnly, menu]);

  function send(details: { type: Order["type"]; table?: string; name?: string; phone?: string }) {
    const order = placeOrder({
      ...details,
      channel: "table",
      lines: cart.lines.map((l) => {
        const d = dishById(l.dishId)!;
        return { dishId: d.id, name: d.name, price: d.price, qty: l.qty, options: l.options, note: l.note };
      }),
    });
    rememberOrder(order.id);
    cart.clear();
    setCartOpen(false);
    setTracking(order.id);
    window.scrollTo({ top: 0 });
  }

  if (tracking !== null) {
    return <Tracker id={tracking} back={{ label: "Back to the menu", onClick: () => setTracking(null) }} />;
  }

  return (
    <div className="mx-auto min-h-dvh max-w-2xl bg-bone pb-28 shadow-[0_0_0_100vmax_var(--color-leaf)] [clip-path:inset(0_-100vmax)]">
      {toast}
      {/* banner */}
      <header className="relative isolate overflow-hidden bg-char px-4 pt-4 pb-6 text-bone">
        <img src={photo(PHOTOS.hero, 1000, 500)} alt="" className="absolute inset-0 -z-10 size-full object-cover opacity-45" />
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-1 rounded-full bg-char/50 py-1.5 pl-2 pr-3 text-sm font-bold backdrop-blur hover:bg-char/70">
            <BackIcon className="size-4" /> Website
          </Link>
          <span className="ml-auto rounded-full bg-bone px-3 py-1 text-sm font-bold text-leaf">{table ? `Table ${table}` : "Menu"}</span>
        </div>
        <Logo light className="mt-8" />
        <h1 className="mt-2 font-display text-5xl font-black leading-none">{table ? "Order to your table" : "The menu"}</h1>
        <p className="mt-1 text-sm text-bone/80">Kitchen open until 23:00. Prices include VAT.</p>
      </header>
      <div className="imigongo" aria-hidden="true" />

      {!table && (
        <Link href="/order" className="flex items-center gap-3 bg-leaf px-4 py-3 text-sm text-bone hover:bg-leaf-soft">
          <span className="flex-1"><b>Not at the restaurant?</b> Order for pickup or delivery.</span>
          <span className="font-bold text-ochre">Order online →</span>
        </Link>
      )}

      {activeOrder && (
        <button onClick={() => setTracking(activeOrder.id)}
          className="flex w-full items-center gap-3 bg-ochre/25 px-4 py-3 text-left text-sm">
          <span className="size-2.5 rounded-full bg-ember ping" />
          <span className="flex-1">Order #{activeOrder.id} is {activeOrder.status === "new" ? "with the kitchen" : activeOrder.status === "preparing" ? "on the grill" : "ready"}.</span>
          <span className="font-bold text-leaf underline underline-offset-4">Track it</span>
        </button>
      )}

      {/* search + category nav */}
      <nav aria-label="Menu sections" className="sticky top-0 z-20 border-b border-mist bg-bone/95 backdrop-blur">
        <div className="flex items-center gap-2 px-4 pt-3">
          <label className="relative flex-1">
            <span className="sr-only">Search the menu</span>
            <svg viewBox="0 0 24 24" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ash" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>
            <input value={query} onChange={(e) => setQuery(e.target.value)} type="search" placeholder="Search dishes"
              className="w-full rounded-full border-2 border-mist bg-white py-2 pl-9 pr-3 text-sm focus:border-leaf focus:outline-none" />
          </label>
          <button onClick={() => setVegOnly((v) => !v)} aria-pressed={vegOnly}
            className={`shrink-0 rounded-full border-2 px-3 py-1.5 text-sm font-bold ${vegOnly ? "border-leaf bg-leaf text-bone" : "border-mist bg-white"}`}>
            Vegetarian
          </button>
        </div>
        <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 py-3">
          {sections.map((s) => (
            <a key={s.id} href={`#sec-${s.id}`} aria-current={active === s.id ? "true" : undefined}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold transition-colors ${active === s.id ? "bg-leaf text-bone" : "bg-mist/70 text-char hover:bg-mist"}`}>
              {s.label}
            </a>
          ))}
        </div>
      </nav>

      {sections.length === 0 && (
        <div className="px-4 py-16 text-center">
          <p className="font-bold">Nothing matches “{query}”.</p>
          <button onClick={() => { setQuery(""); setVegOnly(false); }} className="mt-2 font-bold text-ember underline underline-offset-4">Clear search</button>
        </div>
      )}

      {sections.map((s) => (
        <section key={s.id} id={`sec-${s.id}`} aria-labelledby={`h-${s.id}`} className="scroll-mt-32 px-4 pt-8">
          <h2 id={`h-${s.id}`} className="font-display text-3xl font-black text-leaf">{s.label}</h2>
          {s.note && <p className="text-sm font-semibold text-ember-deep">{s.note}</p>}
          <ul className="mt-2 divide-y divide-mist">
            {s.dishes.map((d) => {
              const out = soldOut.has(d.id);
              const inCart = cart.lines.filter((l) => l.dishId === d.id).reduce((n, l) => n + l.qty, 0);
              return (
                <li key={d.id}>
                  <button disabled={out} onClick={() => setOpen(d)}
                    className="flex w-full items-center gap-4 py-4 text-left disabled:cursor-not-allowed">
                    <div className={`min-w-0 flex-1 ${out ? "opacity-45" : ""}`}>
                      {d.tag && !out && <span className="mb-1 inline-block rounded bg-ochre/25 px-1.5 py-0.5 text-xs font-bold text-char">{d.tag}</span>}
                      <p className="flex items-center gap-1.5 font-bold leading-snug">{d.name}{d.veg && <VegMark />}</p>
                      <p className="mt-0.5 line-clamp-2 text-sm text-ash">{d.desc}</p>
                      <p className="mt-1.5 font-semibold tabular-nums">{out ? "Sold out today" : rwf(d.price)}</p>
                    </div>
                    {d.img ? (
                      <div className="relative shrink-0">
                        <img src={photo(d.img, 240, 240)} alt="" loading="lazy"
                          className={`size-24 rounded-xl bg-mist object-cover ${out ? "grayscale opacity-50" : ""}`} />
                        {inCart > 0 && <Badge n={inCart} />}
                      </div>
                    ) : (
                      <div className="relative grid size-10 shrink-0 place-items-center rounded-full border-2 border-mist text-xl font-bold text-leaf">
                        +{inCart > 0 && <Badge n={inCart} />}
                      </div>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      ))}

      <p className="px-4 pt-10 text-center text-sm text-ash">Allergies? Tell your server or add a note to the dish.</p>
      <div className="px-4 pt-4 text-center">
        <Link href="/" className="inline-flex items-center gap-1 font-bold text-leaf underline underline-offset-4"><BackIcon className="size-4" /> Back to the Umuriro website</Link>
      </div>

      {/* cart bar */}
      {cart.count > 0 && !cartOpen && !open && (
        <div className="fixed inset-x-0 bottom-0 z-30 mx-auto max-w-2xl p-4 fade-in">
          <button onClick={() => setCartOpen(true)}
            className="flex w-full items-center gap-3 rounded-full bg-ember px-5 py-4 font-bold text-white shadow-xl hover:bg-ember-deep">
            <span className="grid size-7 place-items-center rounded-full bg-white text-sm text-ember">{cart.count}</span>
            View order
            <span className="ml-auto tabular-nums">{rwf(cart.subtotal)}</span>
          </button>
        </div>
      )}

      {open && (
        <DishSheet dish={open} onClose={() => setOpen(null)} note={MENU.find((s) => s.dishes.includes(open))?.note}
          onAdd={(l) => { cart.add(l); setOpen(null); showToast(`Added ${l.qty} × ${open.name}`); }} />
      )}
      {cartOpen && (
        <CartSheet cart={cart} table={table} onClose={() => setCartOpen(false)} onSend={send} soldOut={soldOut} />
      )}
    </div>
  );
}

/* ---------- cart / send to kitchen ---------- */
function CartSheet({ cart, table, onClose, onSend, soldOut }: {
  cart: ReturnType<typeof useCart>; table: string | null;
  onClose: () => void; onSend: (d: { type: Order["type"]; table?: string; name?: string; phone?: string }) => void; soldOut: Set<string>;
}) {
  const [type, setType] = useState<"dine-in" | "takeaway">("dine-in");
  const [tableNo, setTableNo] = useState(table ?? "");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const unavailable = cart.lines.filter((l) => soldOut.has(l.dishId));

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
        {cart.lines.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-ash">Nothing here yet.</p>
            <button onClick={onClose} className="mt-3 font-bold text-ember underline underline-offset-4">Back to the menu</button>
          </div>
        ) : (
          <ul className="mt-3 divide-y divide-mist">
            {cart.lines.map((l) => {
              const d = dishById(l.dishId)!;
              return (
                <li key={l.key} className="flex items-center gap-3 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-bold">{d.name}</p>
                    {(l.options || l.note) && <p className="text-sm text-ash">{[l.options, l.note && `“${l.note}”`].filter(Boolean).join(". ")}</p>}
                    {soldOut.has(l.dishId) && <p className="text-sm font-bold text-ember-deep">Just sold out</p>}
                    <p className="text-sm font-semibold tabular-nums">{rwf(d.price * l.qty)}</p>
                  </div>
                  <Stepper value={l.qty} label={d.name} onChange={(n) => cart.setQty(l.key, n)} />
                </li>
              );
            })}
          </ul>
        )}

        {cart.lines.length > 0 && (
          <>
            <div className="mt-5 grid grid-cols-2 gap-1 rounded-full bg-mist p-1" role="radiogroup" aria-label="Eating here or taking away">
              {(["dine-in", "takeaway"] as const).map((t) => (
                <button key={t} role="radio" aria-checked={type === t} onClick={() => { setType(t); setError(""); }}
                  className={`rounded-full py-2.5 font-bold transition-colors ${type === t ? "bg-white shadow" : "text-ash"}`}>
                  {t === "dine-in" ? "Eating here" : "Taking away"}
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
          </>
        )}
      </div>
      {cart.lines.length > 0 && (
        <div className="border-t border-mist p-4">
          <div className="mb-3 flex items-baseline justify-between">
            <span className="text-ash">Total</span>
            <span className="font-display text-3xl font-black tabular-nums">{rwf(cart.subtotal)}</span>
          </div>
          <div className="flex gap-2">
            <button onClick={onClose} className="rounded-full border-2 border-mist px-5 py-4 font-bold">Keep browsing</button>
            <button onClick={submit} className="flex-1 rounded-full bg-ember py-4 font-bold text-white hover:bg-ember-deep">Send to kitchen</button>
          </div>
          <p className="mt-2 text-center text-xs text-ash">You pay at the end with MoMo, card or cash.</p>
        </div>
      )}
    </Sheet>
  );
}
