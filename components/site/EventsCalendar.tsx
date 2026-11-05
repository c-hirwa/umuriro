"use client";

import { useState } from "react";
import { EVENTS, prettyDate, upcoming, type Occurrence } from "@/lib/events";
import { photo } from "@/lib/data";
import { Sheet, useMounted } from "@/components/order/ui";
import { ReservationForm } from "./ReservationForm";

/** Upcoming dates for every recurring event, with an RSVP sheet. `limit` trims the list for teasers. */
export function EventsCalendar({ limit, compact = false }: { limit?: number; compact?: boolean }) {
  const mounted = useMounted();
  const [filter, setFilter] = useState<string>("all");
  const [rsvp, setRsvp] = useState<Occurrence | null>(null);

  if (!mounted) return <div className="min-h-64" />;
  let list = upcoming(new Date(), 35, filter === "all" ? undefined : filter);
  if (limit) list = list.slice(0, limit);

  return (
    <>
      {!compact && (
        <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:px-0" role="radiogroup" aria-label="Filter events">
          {[{ id: "all", title: "Everything" }, ...EVENTS].map((e) => (
            <button key={e.id} role="radio" aria-checked={filter === e.id} onClick={() => setFilter(e.id)}
              className={`shrink-0 rounded-full border-2 px-4 py-2 text-sm font-bold transition-colors ${filter === e.id ? "border-leaf bg-leaf text-bone" : "border-mist bg-white hover:border-leaf/40"}`}>
              {e.title}
            </button>
          ))}
        </div>
      )}
      <ul className={`grid gap-3 ${compact ? "" : "mt-6"}`}>
        {list.map((o) => {
          const { event: e, d } = o;
          return (
            <li key={e.id + o.date} className="flex items-center gap-4 rounded-2xl bg-white p-3 pr-4 sm:p-4">
              <div className="grid w-16 shrink-0 place-items-center rounded-xl bg-leaf py-2 text-bone sm:w-20">
                <span className="text-xs font-bold uppercase tracking-wider text-ochre">{d.toLocaleDateString("en-GB", { weekday: "short" })}</span>
                <span className="font-display text-3xl font-black leading-none">{d.getDate()}</span>
                <span className="text-xs">{d.toLocaleDateString("en-GB", { month: "short" })}</span>
              </div>
              {!compact && <img src={photo(e.img, 200, 200)} alt="" loading="lazy" className="hidden size-20 rounded-xl object-cover md:block" />}
              <div className="min-w-0 flex-1">
                <p className="font-bold leading-snug">{e.title}</p>
                <p className="text-sm text-ash">{e.start}–{e.end} · {e.price}</p>
                {e.ticketed && <p className="text-xs font-bold text-ember-deep">Booking needed · {e.capacity} places</p>}
              </div>
              <button onClick={() => setRsvp(o)}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold ${e.ticketed ? "bg-ember text-white hover:bg-ember-deep" : "border-2 border-leaf text-leaf hover:bg-leaf hover:text-bone"}`}>
                {e.ticketed ? "Book" : "RSVP"}
              </button>
            </li>
          );
        })}
      </ul>

      {rsvp && (
        <Sheet label={`Book ${rsvp.event.title}`} onClose={() => setRsvp(null)}>
          <div className="overflow-y-auto">
            <img src={photo(rsvp.event.img, 900, 380)} alt="" className="aspect-[9/3.8] w-full object-cover" />
            <div className="p-5">
              <p className="text-sm font-bold text-ember-deep">{prettyDate(rsvp.d)}, {rsvp.event.start}–{rsvp.event.end}</p>
              <h2 className="font-display text-4xl font-black leading-none text-leaf">{rsvp.event.title}</h2>
              <p className="mt-2 text-ash">{rsvp.event.desc}</p>
              <p className="mt-2 font-bold">{rsvp.event.price}</p>
              <div className="mt-5 -mx-5 sm:mx-0">
                <ReservationForm kind="event" tone="light" fixedDate={rsvp.date} event={rsvp.event.title} times={[rsvp.event.start]}
                  guests={[1, 2, 3, 4, 5, 6, 8]} submitLabel={rsvp.event.ticketed ? "Reserve places" : "RSVP"}
                  notePlaceholder="Team name for trivia, dietary needs..." />
              </div>
            </div>
          </div>
        </Sheet>
      )}
    </>
  );
}
