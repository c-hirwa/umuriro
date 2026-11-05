"use client";

import { setReservationStatus, type DB, type Reservation } from "@/lib/store";
import { StatusPill } from "./Overview";
import { H1, waNumber } from "./util";

function label(date: string) {
  const d = new Date(date + "T00:00");
  const t = new Date(); t.setHours(0, 0, 0, 0);
  const diff = Math.round((d.getTime() - t.getTime()) / 86400000);
  const pretty = d.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });
  return diff === 0 ? `Today, ${pretty}` : diff === 1 ? `Tomorrow, ${pretty}` : pretty;
}

export function Reservations({ db }: { db: DB }) {
  const t = new Date();
  const todayStr = `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}`;
  const upcoming = db.reservations.filter((r) => r.date >= todayStr).sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
  const days = [...new Set(upcoming.map((r) => r.date))];
  const guestsToday = upcoming.filter((r) => r.date === todayStr && r.status === "confirmed").reduce((s, r) => s + r.guests, 0);

  return (
    <>
      <H1 aside={<p className="text-ash">{guestsToday} confirmed guests today</p>}>Bookings</H1>
      {days.length === 0 && <p className="text-ash">No upcoming bookings. New requests from the website appear here.</p>}
      <div className="space-y-8">
        {days.map((d) => (
          <section key={d}>
            <h2 className="mb-3 font-bold">{label(d)}</h2>
            <ul className="grid gap-3 lg:grid-cols-2">
              {upcoming.filter((r) => r.date === d).map((r) => <Card key={r.id} r={r} />)}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}

function Card({ r }: { r: Reservation }) {
  const msg = encodeURIComponent(`Hi ${r.name.split(" ")[0]}, this is Umuriro. Your table for ${r.guests} on ${r.date} at ${r.time} is confirmed. See you then!`);
  return (
    <li className={`rounded-2xl bg-white p-4 ${r.status === "pending" ? "ring-2 ring-ember/60" : ""}`}>
      <div className="flex items-start gap-3">
        <div className="grid size-14 shrink-0 place-items-center rounded-xl bg-leaf text-bone">
          <span className="font-display text-2xl font-black leading-none">{r.time}</span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2"><p className="font-bold">{r.name}</p><StatusPill s={r.status} /></div>
          <p className="text-sm text-ash">{r.guests} {r.guests === 1 ? "guest" : "guests"}, {r.phone}</p>
          {r.note && <p className="mt-1 text-sm">“{r.note}”</p>}
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-2 border-t border-mist pt-3">
        {r.status !== "confirmed" && (
          <button onClick={() => setReservationStatus(r.id, "confirmed")} className="rounded-full bg-leaf px-4 py-2 text-sm font-bold text-bone">Confirm</button>
        )}
        {r.status !== "declined" && (
          <button onClick={() => setReservationStatus(r.id, "declined")} className="rounded-full border-2 border-mist px-4 py-1.5 text-sm font-bold">Decline</button>
        )}
        <a href={`https://wa.me/${waNumber(r.phone)}?text=${msg}`} target="_blank" rel="noopener"
          className="ml-auto rounded-full px-3 py-2 text-sm font-bold text-leaf underline underline-offset-4">Message on WhatsApp</a>
      </div>
    </li>
  );
}
