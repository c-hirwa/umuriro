"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { DELIVERY_ZONES, FREE_DELIVERY_FROM, MENU, menuForNow, PICKUP_ETA, dishById, photo, rwf, type Dish } from "@/lib/data";
import { useDB } from "@/lib/store";
import { useCart, useMyOrderIds } from "@/lib/cart";
import { CartIcon } from "@/components/site/SiteHeader";
import { DishSheet, Sheet, Stepper, VegMark, useMounted, useToast } from "./ui";

const minFee = Math.min(...DELIVERY_ZONES.map((z) => z.fee));

export function OrderApp() {
  const db = useDB();
  const soldOut = useMemo(() => new Set(db?.soldOut ?? []), [db]);
  const cart = useCart("online");
  const mounted = useMounted();
  const [toast, showToast] = useToast();
  const [open, setOpen] = useState<Dish | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [active, setActive] = useState("");
  const [query, setQuery] = useState("");

  const mine = useMyOrderIds();
  const live = db?.orders.find((o) => mine.includes(o.id) && o.channel === "online" && ["new", "preparing", "ready"].includes(o.status));

  const menu = useMemo(() => menuForNow(mounted ? new Date() : undefined), [mounted]);
  const q = query.trim().toLowerCase();
  const sections = menu.map((s) => ({ ...s, dishes: s.dishes.filter((d) => !q || `${d.name} ${d.desc}`.toLowerCase().includes(q)) })).filter((s) => s.dishes.length);

  useEffect(() => {
    const els = MENU.map((s) => document.getElementById(`o-${s.id}`)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id.slice(2))),
      { rootMargin: "-30% 0px -60% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [q, menu]);

  function quickAdd(d: Dish) {
    if (d.options?.length) return setOpen(d);
    cart.add({ dishId: d.id, qty: 1 });
    showToast(`Added ${d.name}`);
  }

  return (
    <>
      {toast}
      <section className="relative isolate overflow-hidden bg-char text-bone">
        <img src={photo("1555939594-58d7cb561ad1", 1800, 600)} alt="" className="absolute inset-0 -z-10 size-full object-cover opacity-35" />
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
          <p className="font-bold text-ochre">Pickup or delivery across Kigali</p>
          <h1 className="mt-1 font-display text-6xl font-black leading-[0.9] sm:text-7xl">Order online</h1>
          <div className="mt-6 flex flex-wrap gap-3 text-sm font-semibold">
            <span className="rounded-full bg-bone/15 px-3 py-1.5 backdrop-blur">Pickup ready in about {PICKUP_ETA}</span>
            <span className="rounded-full bg-bone/15 px-3 py-1.5 backdrop-blur">Delivery from {rwf(minFee)}</span>
            <span className="rounded-full bg-bone/15 px-3 py-1.5 backdrop-blur">Free delivery over {rwf(FREE_DELIVERY_FROM)}</span>
            <span className="rounded-full bg-bone/15 px-3 py-1.5 backdrop-blur">Pay with MoMo, card or cash</span>
          </div>
        </div>
      </section>
      <div className="imigongo" aria-hidden="true" />

      {mounted && live && (
        <Link href={`/order/track?id=${live.id}`} className="flex items-center gap-3 bg-ochre/25 px-4 py-3 text-sm sm:px-6">
          <span className="mx-auto flex w-full max-w-6xl items-center gap-3">
            <span className="size-2.5 rounded-full bg-ember ping" />
            <span className="flex-1">Order #{live.id} is {live.status === "new" ? "with the kitchen" : live.status === "preparing" ? "on the grill" : live.type === "delivery" ? "on its way" : "ready for pickup"}.</span>
            <span className="font-bold text-leaf underline underline-offset-4">Track it</span>
          </span>
        </Link>
      )}

      <div className="mx-auto grid max-w-6xl gap-8 px-4 pb-32 pt-6 sm:px-6 lg:grid-cols-[1fr_340px] lg:pb-16">
        <div className="min-w-0">
          {/* sticky category bar */}
          <div className="sticky top-[68px] z-20 -mx-4 border-b border-mist bg-bone/95 px-4 pb-3 pt-3 backdrop-blur sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0">
            <label className="relative block">
              <span className="sr-only">Search the menu</span>
              <svg viewBox="0 0 24 24" className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ash" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>
              <input value={query} onChange={(e) => setQuery(e.target.value)} type="search" placeholder="Search brochettes, tilapia, pancakes..."
                className="w-full rounded-full border-2 border-mist bg-white py-2.5 pl-10 pr-4 focus:border-leaf focus:outline-none" />
            </label>
            <nav aria-label="Menu sections" className="no-scrollbar mt-3 flex gap-2 overflow-x-auto">
              {sections.map((s) => (
                <a key={s.id} href={`#o-${s.id}`} aria-current={active === s.id ? "true" : undefined}
                  className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold transition-colors ${active === s.id ? "bg-leaf text-bone" : "bg-mist/70 hover:bg-mist"}`}>
                  {s.label}
                </a>
              ))}
            </nav>
          </div>

          {sections.length === 0 && (
            <div className="py-16 text-center">
              <p className="font-bold">Nothing matches “{query}”.</p>
              <button onClick={() => setQuery("")} className="mt-2 font-bold text-ember underline underline-offset-4">Clear search</button>
            </div>
          )}

          {sections.map((s) => (
            <section key={s.id} id={`o-${s.id}`} aria-labelledby={`oh-${s.id}`} className="scroll-mt-44 pt-8">
              <div className="flex flex-wrap items-baseline gap-x-3">
                <h2 id={`oh-${s.id}`} className="font-display text-4xl font-black text-leaf">{s.label}</h2>
                {s.note && <p className="text-sm font-semibold text-ember-deep">{s.note}</p>}
              </div>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {s.dishes.map((d) => {
                  const out = soldOut.has(d.id);
                  const blocked = out || d.dineInOnly;
                  const inCart = cart.lines.filter((l) => l.dishId === d.id).reduce((n, l) => n + l.qty, 0);
                  return (
                    <li key={d.id} className={`flex overflow-hidden rounded-2xl border-2 bg-white transition-colors ${inCart ? "border-ember/60" : "border-transparent"} ${blocked ? "opacity-60" : ""}`}>
                      <button disabled={blocked} onClick={() => setOpen(d)} className="flex min-w-0 flex-1 gap-3 p-3 text-left disabled:cursor-not-allowed">
                        {d.img && <img src={photo(d.img, 240, 240)} alt="" loading="lazy" className={`size-24 shrink-0 rounded-xl bg-mist object-cover ${blocked ? "grayscale" : ""}`} />}
                        <span className="min-w-0 flex-1">
                          {d.tag && !blocked && <span className="mb-1 inline-block rounded bg-ochre/25 px-1.5 py-0.5 text-xs font-bold">{d.tag}</span>}
                          <span className="flex items-center gap-1.5 font-bold leading-snug">{d.name}{d.veg && <VegMark />}</span>
                          <span className="mt-0.5 line-clamp-2 block text-sm text-ash">{d.desc}</span>
                          <span className="mt-1.5 block font-semibold tabular-nums">
                            {out ? "Sold out today" : d.dineInOnly ? "Served at the restaurant only" : rwf(d.price)}
                          </span>
                        </span>
                      </button>
                      {!blocked && (
                        <div className="flex flex-col items-center justify-end p-3 pl-0">
                          <button onClick={() => quickAdd(d)} aria-label={`Add ${d.name}`}
                            className="relative grid size-10 place-items-center rounded-full bg-leaf text-xl font-bold text-bone hover:bg-ember">
                            +
                            {inCart > 0 && <span className="absolute -right-1.5 -top-1.5 grid size-6 place-items-center rounded-full bg-ember text-xs ring-2 ring-white">{inCart}</span>}
                          </button>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>

        {/* desktop cart */}
        <aside className="hidden lg:block" aria-label="Your cart">
          <div className="sticky top-[88px] rounded-3xl bg-white p-5 shadow-sm">
            <CartBody cart={cart} soldOut={soldOut} />
          </div>
        </aside>
      </div>

      {/* phone cart bar */}
      {cart.count > 0 && !cartOpen && !open && (
        <div className="fade-in fixed inset-x-0 bottom-0 z-30 p-4 lg:hidden">
          <button onClick={() => setCartOpen(true)}
            className="mx-auto flex w-full max-w-xl items-center gap-3 rounded-full bg-ember px-5 py-4 font-bold text-white shadow-xl hover:bg-ember-deep">
            <span className="grid size-7 place-items-center rounded-full bg-white text-sm text-ember">{cart.count}</span>
            View cart
            <span className="ml-auto tabular-nums">{rwf(cart.subtotal)}</span>
          </button>
        </div>
      )}

      {cartOpen && (
        <Sheet label="Your cart" onClose={() => setCartOpen(false)} side>
          <div className="flex min-h-0 flex-1 flex-col overflow-y-auto p-5"><CartBody cart={cart} soldOut={soldOut} onKeepBrowsing={() => setCartOpen(false)} /></div>
        </Sheet>
      )}
      {open && (
        <DishSheet dish={open} onClose={() => setOpen(null)} note={MENU.find((s) => s.dishes.includes(open))?.note}
          onAdd={(l) => { cart.add(l); setOpen(null); showToast(`Added ${l.qty} × ${open.name}`); }} />
      )}
    </>
  );
}

function CartBody({ cart, soldOut, onKeepBrowsing }: { cart: ReturnType<typeof useCart>; soldOut: Set<string>; onKeepBrowsing?: () => void }) {
  const blocked = cart.lines.some((l) => soldOut.has(l.dishId));
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex items-baseline justify-between pr-10 lg:pr-0">
        <h2 className="font-display text-3xl font-black text-leaf">Your cart</h2>
        {cart.count > 0 && <button onClick={cart.clear} className="text-sm font-semibold text-ash hover:text-ember-deep">Empty cart</button>}
      </div>
      {cart.lines.length === 0 ? (
        <div className="grid flex-1 place-items-center py-10 text-center text-ash">
          <div>
            <CartIcon className="mx-auto size-10 text-mist" />
            <p className="mt-3">Your cart is empty.</p>
            <p className="text-sm">Tap + on any dish to add it.</p>
          </div>
        </div>
      ) : (
        <>
          <ul className="mt-2 divide-y divide-mist">
            {cart.lines.map((l) => {
              const d = dishById(l.dishId)!;
              return (
                <li key={l.key} className="flex items-center gap-3 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-bold leading-snug">{d.name}</p>
                    {(l.options || l.note) && <p className="text-sm text-ash">{[l.options, l.note && `“${l.note}”`].filter(Boolean).join(". ")}</p>}
                    {soldOut.has(l.dishId) && <p className="text-sm font-bold text-ember-deep">Just sold out, please remove</p>}
                    <p className="text-sm font-semibold tabular-nums">{rwf(d.price * l.qty)}</p>
                  </div>
                  <Stepper small value={l.qty} label={d.name} onChange={(n) => cart.setQty(l.key, n)} />
                </li>
              );
            })}
          </ul>
          <div className="mt-auto border-t border-mist pt-4">
            <p className="flex items-baseline justify-between"><span className="text-ash">Subtotal</span><span className="font-display text-3xl font-black tabular-nums">{rwf(cart.subtotal)}</span></p>
            <p className="mt-1 text-xs text-ash">
              {cart.subtotal >= FREE_DELIVERY_FROM ? "You get free delivery." : `Delivery fee added at checkout. Add ${rwf(FREE_DELIVERY_FROM - cart.subtotal)} more for free delivery.`}
            </p>
            {blocked ? (
              <p className="mt-4 rounded-full bg-mist py-3.5 text-center font-bold text-ash">Remove sold-out dishes to continue</p>
            ) : (
              <Link href="/order/checkout" className="mt-4 block rounded-full bg-ember py-3.5 text-center font-bold text-white hover:bg-ember-deep">Go to checkout</Link>
            )}
            {onKeepBrowsing && <button onClick={onKeepBrowsing} className="mt-2 w-full py-2 font-bold text-leaf">Keep browsing</button>}
          </div>
        </>
      )}
    </div>
  );
}
