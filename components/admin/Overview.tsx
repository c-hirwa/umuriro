"use client";

import { rwf } from "@/lib/data";
import type { DB } from "@/lib/store";
import { H1, clock, isToday, orderWhere } from "./util";

export function Overview({ db, onGo }: { db: DB; onGo: (t: "orders" | "reservations") => void }) {
  const today = db.orders.filter((o) => isToday(o.createdAt));
  const valid = today.filter((o) => o.status !== "cancelled");
  const revenue = valid.reduce((s, o) => s + o.total, 0);
  const open = today.filter((o) => ["new", "preparing", "ready"].includes(o.status)).length;
  const pending = db.reservations.filter((r) => r.status === "pending").length;
  const todayStr = new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });

  const hours = Array.from({ length: 13 }, (_, i) => 11 + i);
  const byHour = hours.map((h) => valid.filter((o) => new Date(o.createdAt).getHours() === h).length);
  const maxH = Math.max(1, ...byHour);

  const dishQty = new Map<string, number>();
  valid.forEach((o) => o.lines.forEach((l) => dishQty.set(l.name, (dishQty.get(l.name) ?? 0) + l.qty)));
  const top = [...dishQty.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6);
  const maxD = Math.max(1, ...top.map((t) => t[1]));

  const dineIn = valid.filter((o) => o.type === "dine-in").length;
  const delivery = valid.filter((o) => o.type === "delivery").length;

  return (
    <>
      <H1 aside={<p className="text-ash">{todayStr}</p>}>Today</H1>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Sales" value={rwf(revenue)} />
        <Stat label="Orders" value={String(valid.length)} sub={`${dineIn} tables, ${valid.length - dineIn - delivery} pickup, ${delivery} delivery`} />
        <Stat label="Average order" value={rwf(valid.length ? Math.round(revenue / valid.length / 100) * 100 : 0)} />
        <button onClick={() => onGo("orders")} className="rounded-2xl bg-ember p-4 text-left text-white hover:bg-ember-deep">
          <p className="text-sm font-semibold text-white/85">Open orders</p>
          <p className="mt-1 font-display text-4xl font-black tabular-nums">{open}</p>
          <p className="text-sm text-white/85">Go to the order board</p>
        </button>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <section className="rounded-2xl bg-white p-5">
          <h2 className="font-bold">Orders by hour</h2>
          <div className="mt-5 flex h-44 items-end gap-1.5" role="img" aria-label={`Orders by hour: ${hours.map((h, i) => `${h}:00 ${byHour[i]}`).join(", ")}`}>
            {hours.map((h, i) => (
              <div key={h} className="flex h-full flex-1 flex-col justify-end">
                <div className="relative rounded-t-md bg-leaf transition-all" style={{ height: `${(byHour[i] / maxH) * 100}%`, minHeight: byHour[i] ? 6 : 2, opacity: byHour[i] ? 1 : 0.15 }}>
                  {byHour[i] > 0 && <span className="absolute -top-5 inset-x-0 text-center text-xs font-bold tabular-nums">{byHour[i]}</span>}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-2 flex gap-1.5 text-[11px] text-ash">
            {hours.map((h) => <span key={h} className="flex-1 text-center tabular-nums">{h % 2 ? "" : h}</span>)}
          </div>
        </section>

        <section className="rounded-2xl bg-white p-5">
          <h2 className="font-bold">Selling most today</h2>
          {top.length === 0 ? <p className="mt-4 text-ash">No orders yet today. They&apos;ll show up here as they come in.</p> : (
            <ul className="mt-4 space-y-3">
              {top.map(([name, q]) => (
                <li key={name}>
                  <div className="flex justify-between text-sm"><span className="font-semibold">{name}</span><span className="tabular-nums text-ash">{q}</span></div>
                  <div className="mt-1 h-2 rounded-full bg-mist"><div className="h-2 rounded-full bg-ochre" style={{ width: `${(q / maxD) * 100}%` }} /></div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl bg-white p-5">
          <h2 className="font-bold">Latest orders</h2>
          <ul className="mt-3 divide-y divide-mist">
            {today.slice(0, 6).map((o) => (
              <li key={o.id} className="flex items-center gap-3 py-2.5 text-sm">
                <span className="w-12 font-bold tabular-nums">#{o.id}</span>
                <span className="w-12 tabular-nums text-ash">{clock(o.createdAt)}</span>
                <span className="flex-1 truncate">{orderWhere(o)}</span>
                <StatusPill s={o.status} />
                <span className="w-24 text-right tabular-nums">{rwf(o.total)}</span>
              </li>
            ))}
          </ul>
        </section>
        <section className="rounded-2xl bg-white p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-bold">Bookings waiting for a reply</h2>
            <button onClick={() => onGo("reservations")} className="text-sm font-bold text-ember">See all</button>
          </div>
          {pending === 0 ? <p className="mt-3 text-ash">You&apos;re all caught up.</p> : (
            <ul className="mt-3 divide-y divide-mist">
              {db.reservations.filter((r) => r.status === "pending").map((r) => (
                <li key={r.id} className="flex gap-3 py-2.5 text-sm">
                  <span className="font-bold">{r.name}</span>
                  {r.kind && r.kind !== "table" && <span className="rounded-full bg-ochre/30 px-2 text-xs font-bold leading-5">{r.kind === "private" ? "Private event" : r.kind === "event" ? r.event : "Brunch"}</span>}
                  <span className="text-ash">{r.guests} people, {r.date.slice(5).split("-").reverse().join("/")} at {r.time}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-2xl bg-white p-4">
      <p className="text-sm font-semibold text-ash">{label}</p>
      <p className="mt-1 font-display text-3xl font-black tabular-nums sm:text-4xl">{value}</p>
      {sub && <p className="text-sm text-ash">{sub}</p>}
    </div>
  );
}

export function StatusPill({ s }: { s: string }) {
  const map: Record<string, [string, string]> = {
    new: ["New", "bg-ember text-white"],
    preparing: ["On the grill", "bg-ochre/30 text-char"],
    ready: ["Ready", "bg-leaf text-bone"],
    done: ["Done", "bg-mist text-ash"],
    cancelled: ["Cancelled", "bg-mist text-ash line-through"],
    pending: ["Waiting", "bg-ember text-white"],
    confirmed: ["Confirmed", "bg-leaf text-bone"],
    declined: ["Declined", "bg-mist text-ash"],
  };
  const [label, cls] = map[s] ?? [s, "bg-mist"];
  return <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-bold ${cls}`}>{label}</span>;
}
