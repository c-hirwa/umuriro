"use client";

import { MENU, photo, rwf } from "@/lib/data";
import { toggleSoldOut, type DB } from "@/lib/store";
import { H1 } from "./util";

export function MenuManager({ db }: { db: DB }) {
  const out = new Set(db.soldOut);
  return (
    <>
      <H1 aside={<p className="text-ash">{out.size} sold out. Guests see changes instantly.</p>}>Menu</H1>
      <div className="space-y-6">
        {MENU.map((s) => (
          <section key={s.id} className="rounded-2xl bg-white p-2 sm:p-4">
            <h2 className="px-2 pb-2 pt-2 font-bold sm:px-0 sm:pt-0">{s.label}</h2>
            <ul className="divide-y divide-mist">
              {s.dishes.map((d) => {
                const available = !out.has(d.id);
                return (
                  <li key={d.id} className="flex items-center gap-3 px-2 py-2.5 sm:px-0">
                    {d.img ? <img src={photo(d.img, 120, 120)} alt="" className="size-11 rounded-lg bg-mist object-cover" /> : <span className="size-11 rounded-lg bg-mist" />}
                    <div className="min-w-0 flex-1">
                      <p className={`font-semibold ${available ? "" : "text-ash line-through"}`}>{d.name}</p>
                      <p className="text-sm tabular-nums text-ash">{rwf(d.price)}</p>
                    </div>
                    <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold">
                      <span className={available ? "text-leaf" : "text-ember-deep"}>{available ? "Available" : "Sold out"}</span>
                      <input type="checkbox" role="switch" checked={available} onChange={() => toggleSoldOut(d.id)} className="peer sr-only" />
                      <span aria-hidden="true" className="relative h-7 w-12 rounded-full bg-mist transition-colors peer-checked:bg-leaf peer-focus-visible:outline-3 peer-focus-visible:outline-ember after:absolute after:left-1 after:top-1 after:size-5 after:rounded-full after:bg-white after:shadow after:transition-transform peer-checked:after:translate-x-5" />
                    </label>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}
