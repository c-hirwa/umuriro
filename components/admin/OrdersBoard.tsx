"use client";

import { useState } from "react";
import { rwf } from "@/lib/data";
import { setOrderStatus, type DB, type Order, type OrderStatus } from "@/lib/store";
import { H1, ago, clock, isToday, orderWhere, useTick } from "./util";

const COLS: { s: OrderStatus; label: string; next?: { s: OrderStatus; label: (o: Order) => string } }[] = [
  { s: "new", label: "New", next: { s: "preparing", label: () => "Start cooking" } },
  { s: "preparing", label: "On the grill", next: { s: "ready", label: (o) => (o.type === "delivery" ? "Send with rider" : "Mark ready") } },
  { s: "ready", label: "Ready / out", next: { s: "done", label: (o) => (o.type === "takeaway" ? "Collected" : o.type === "delivery" ? "Delivered" : "Served") } },
];

export function OrdersBoard({ db, fresh }: { db: DB; fresh: Set<number> }) {
  const now = useTick();
  const [filter, setFilter] = useState<"all" | Order["type"]>("all");
  const [showDone, setShowDone] = useState(false);
  const list = db.orders.filter((o) => filter === "all" || o.type === filter);
  const done = list.filter((o) => (o.status === "done" || o.status === "cancelled") && isToday(o.createdAt));

  return (
    <>
      <H1 aside={
        <div className="flex gap-1 rounded-full bg-mist p-1 text-sm font-semibold" role="radiogroup" aria-label="Filter orders">
          {(["all", "dine-in", "takeaway", "delivery"] as const).map((f) => (
            <button key={f} role="radio" aria-checked={filter === f} onClick={() => setFilter(f)}
              className={`rounded-full px-3.5 py-1.5 ${filter === f ? "bg-white shadow-sm" : "text-ash"}`}>
              {f === "all" ? "All" : f === "dine-in" ? "Tables" : f === "takeaway" ? "Pickup" : "Delivery"}
            </button>
          ))}
        </div>
      }>Orders</H1>

      <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 sm:-mx-6 sm:px-6 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0">
        {COLS.map((c) => {
          const items = list.filter((o) => o.status === c.s).sort((a, b) => a.createdAt - b.createdAt);
          return (
            <section key={c.s} aria-label={c.label} className="w-[85vw] max-w-sm shrink-0 snap-start rounded-2xl bg-mist/60 p-3 md:w-auto md:max-w-none">
              <h2 className="flex items-center gap-2 px-1 pb-3 font-bold">
                {c.label}<span className="rounded-full bg-white px-2 text-sm tabular-nums">{items.length}</span>
              </h2>
              {items.length === 0 && <p className="px-1 pb-2 text-sm text-ash">Nothing here right now.</p>}
              <ul className="space-y-3">
                {items.map((o) => {
                  const late = c.s !== "ready" && now - o.createdAt > 20 * 60_000;
                  return (
                    <li key={o.id} className={`rounded-xl bg-white p-3.5 shadow-sm ${fresh.has(o.id) && c.s === "new" ? "ping ring-2 ring-ember" : ""}`}>
                      <div className="flex flex-wrap items-baseline gap-x-2">
                        <span className="font-display text-2xl font-black">#{o.id}</span>
                        <span className="font-semibold">{o.table ? `Table ${o.table}` : o.type === "delivery" ? "Delivery" : "Pickup"}</span>
                        {o.channel === "online" && <span className="rounded bg-ochre/30 px-1.5 text-[11px] font-bold">ONLINE</span>}
                        <span className={`ml-auto text-xs tabular-nums ${late ? "font-bold text-ember-deep" : "text-ash"}`}>{ago(o.createdAt, now)}</span>
                      </div>
                      {o.type !== "dine-in" && <p className="text-sm text-ash">{o.name}, {o.phone}</p>}
                      {o.address && <p className="text-sm"><b>To:</b> {o.address}{o.zone && <span className="text-ash"> ({o.zone})</span>}</p>}
                      {(o.when && o.when !== "asap") && <p className="text-sm font-bold text-ember-deep">For {o.when}</p>}
                      {o.payment && <p className="text-xs text-ash">Pays by {o.payment === "momo" ? "Mobile Money" : o.payment}</p>}
                      {o.note && <p className="mt-1 text-sm font-semibold text-ember-deep">“{o.note}”</p>}
                      <ul className="mt-2 space-y-1 text-sm">
                        {o.lines.map((l, i) => (
                          <li key={i}>
                            <span className="font-bold">{l.qty}×</span> {l.name}
                            {l.options && <span className="block pl-5 text-ash">{l.options}</span>}
                            {l.note && <span className="block pl-5 font-semibold text-ember-deep">“{l.note}”</span>}
                          </li>
                        ))}
                      </ul>
                      <div className="mt-3 flex items-center gap-2 border-t border-mist pt-3">
                        <span className="font-semibold tabular-nums">{rwf(o.total)}</span>
                        {c.s === "new" && (
                          <button onClick={() => setOrderStatus(o.id, "cancelled")} className="ml-auto text-sm font-semibold text-ash hover:text-ember-deep">Cancel</button>
                        )}
                        {c.next && (
                          <button onClick={() => setOrderStatus(o.id, c.next!.s)}
                            className={`${c.s === "new" ? "" : "ml-auto"} rounded-full px-4 py-2 text-sm font-bold ${c.s === "new" ? "bg-ember text-white hover:bg-ember-deep" : "bg-leaf text-bone hover:bg-leaf-soft"}`}>
                            {c.next.label(o)}
                          </button>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>

      <section className="mt-6">
        <button onClick={() => setShowDone((v) => !v)} aria-expanded={showDone} className="font-bold text-leaf">
          {showDone ? "Hide" : "Show"} finished orders today ({done.length})
        </button>
        {showDone && (
          <div className="mt-3 overflow-x-auto rounded-2xl bg-white">
            <table className="w-full min-w-[560px] text-sm">
              <thead className="text-left text-ash">
                <tr><th className="p-3 font-semibold">Order</th><th className="p-3 font-semibold">Time</th><th className="p-3 font-semibold">Where</th><th className="p-3 font-semibold">Items</th><th className="p-3 text-right font-semibold">Total</th></tr>
              </thead>
              <tbody>
                {done.map((o) => (
                  <tr key={o.id} className={`border-t border-mist ${o.status === "cancelled" ? "text-ash line-through" : ""}`}>
                    <td className="p-3 font-bold">#{o.id}</td>
                    <td className="p-3 tabular-nums">{clock(o.createdAt)}</td>
                    <td className="p-3">{orderWhere(o)}</td>
                    <td className="p-3">{o.lines.map((l) => `${l.qty}× ${l.name}`).join(", ")}</td>
                    <td className="p-3 text-right tabular-nums">{rwf(o.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}
