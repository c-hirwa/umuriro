import type { Metadata } from "next";
import Link from "next/link";
import { EVENTS } from "@/lib/events";
import { PHOTOS, photo } from "@/lib/data";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { EventsCalendar } from "@/components/site/EventsCalendar";

export const metadata: Metadata = {
  title: "Events",
  description: "Live music on Fridays, Nyama Night, trivia, weekend brunch, Kivu fish feasts and grill masterclasses at Umuriro in Kiyovu.",
};

const WHEN: Record<string, string> = {
  "fire-sessions": "Fridays", brunch: "Sat and Sun", "nyama-night": "Wednesdays", trivia: "Tuesdays", "kivu-feast": "1st Saturday", masterclass: "Last Sunday",
};

export default function EventsPage() {
  return (
    <>
      <SiteHeader overlay />
      <main>
        <section className="relative isolate overflow-hidden bg-char text-bone">
          <img src={photo(PHOTOS.crowd, 2000, 900)} alt="" className="absolute inset-0 -z-10 size-full object-cover opacity-40" fetchPriority="high" />
          <div className="mx-auto max-w-6xl px-4 pb-16 pt-36 sm:px-6">
            <p className="font-bold text-ochre">Something on most nights</p>
            <h1 className="mt-2 max-w-3xl font-display text-[clamp(3.4rem,10vw,8rem)] font-black leading-[0.86]">Events by the fire</h1>
            <p className="mt-6 max-w-lg text-lg text-bone/85">Live bands, all-you-can-eat brochettes, trivia, long-table fish feasts and lessons at the grill. Most are free to walk into.</p>
          </div>
        </section>
        <div className="imigongo" aria-hidden="true" />

        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <h2 className="font-display text-5xl font-black text-leaf sm:text-6xl">Every week and every month</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {EVENTS.map((e) => (
              <article key={e.id} className="group overflow-hidden rounded-3xl bg-white">
                <div className="relative">
                  <img src={photo(e.img, 700, 440)} alt="" loading="lazy" className="aspect-[7/4.4] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                  <span className="absolute left-3 top-3 rounded-full bg-char/80 px-3 py-1 text-xs font-bold text-bone backdrop-blur">{WHEN[e.id]}, {e.start}</span>
                </div>
                <div className="p-5">
                  <p className="text-sm font-bold text-ember-deep">{e.kicker}</p>
                  <h3 className="font-display text-3xl font-black leading-none text-leaf">{e.title}</h3>
                  <p className="mt-2 text-sm text-ash">{e.desc}</p>
                  <ul className="mt-3 space-y-1 text-sm">
                    {e.highlights.map((h) => <li key={h} className="flex gap-2"><span aria-hidden="true" className="text-ember">●</span>{h}</li>)}
                  </ul>
                  <p className="mt-4 font-bold">{e.price}</p>
                  {e.id === "brunch" && <Link href="/brunch" className="mt-2 inline-block text-sm font-bold text-leaf underline underline-offset-4">See the brunch menu</Link>}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="calendar" className="bg-mist/50 py-20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <h2 className="font-display text-5xl font-black text-leaf sm:text-6xl">Coming up</h2>
            <p className="mb-6 mt-2 text-ash">The next five weeks. Tap RSVP to hold a spot, or Book for events with limited places.</p>
            <EventsCalendar />
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="grid items-center gap-8 rounded-3xl bg-leaf p-8 text-bone md:grid-cols-[1.4fr_1fr] md:p-12">
            <div>
              <h2 className="font-display text-5xl font-black leading-[0.95]">Planning your own event?</h2>
              <p className="mt-3 max-w-lg text-bone/80">Birthdays, weddings, launches and team dinners. Take over the terrace, the long table or the whole place, or have us bring the grill to you.</p>
            </div>
            <Link href="/private-events" className="justify-self-start rounded-full bg-ember px-6 py-3.5 font-bold text-white hover:bg-ember-deep md:justify-self-end">Private events and catering</Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
