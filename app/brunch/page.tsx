import type { Metadata } from "next";
import Link from "next/link";
import { BRUNCH_HOURS, MENU, PHOTOS, photo, rwf } from "@/lib/data";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { BRUNCH_TIMES, ReservationForm } from "@/components/site/ReservationForm";
import { Faq } from "@/components/site/Faq";

export const metadata: Metadata = {
  title: "Weekend brunch",
  description: "Saturday and Sunday brunch in Kiyovu: rolex, shakshuka, banana pancakes, brochettes off the morning fire and bottomless juice and mimosas.",
};

const brunch = MENU.find((s) => s.id === "brunch")!;

const PACKAGES = [
  { name: "À la carte", price: "Order as you go", points: ["The full brunch menu", "Plus everything from the grill", "Fresh juice from 2,500 RWF"] },
  { name: "Bottomless", price: "15,000 RWF per person", points: ["Two hours of unlimited juice, coffee, icyayi and passion mimosas", "Add any dish from the menu", "Whole table joins in"], hot: true },
  { name: "Family board", price: "38,000 RWF for four", points: ["A big board of eggs, sausages, brochettes, pancakes, mandazi and fruit", "A jug of juice", "Kids under 6 eat free"] },
];

export default function BrunchPage() {
  return (
    <>
      <SiteHeader overlay />
      <main>
        <section className="relative isolate flex min-h-[78svh] items-end overflow-hidden bg-char text-bone">
          <img src={photo(PHOTOS.crowd, 2000)} alt="Friends sharing brunch at a long table" className="absolute inset-0 -z-10 size-full object-cover" fetchPriority="high" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-char via-char/50 to-char/20" />
          <div className="mx-auto w-full max-w-6xl px-4 pb-14 pt-32 sm:px-6">
            <p className="inline-block rounded-full bg-ochre px-3 py-1 text-sm font-bold text-char">{BRUNCH_HOURS}</p>
            <h1 className="mt-4 max-w-3xl font-display text-[clamp(3.4rem,10vw,8rem)] font-black leading-[0.86]">Weekend brunch, off the morning fire.</h1>
            <p className="mt-6 max-w-lg text-lg text-bone/85">
              Rolex and shakshuka, banana pancakes, brochettes for breakfast and bottomless passion mimosas. A DJ plays soft till two.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#book-brunch" className="rounded-full bg-ember px-6 py-3 font-bold text-white hover:bg-ember-deep">Book brunch</a>
              <Link href="/order#o-brunch" className="rounded-full border-2 border-bone/70 px-6 py-3 font-bold hover:bg-bone hover:text-leaf">Order brunch delivered</Link>
            </div>
          </div>
        </section>
        <div className="imigongo" aria-hidden="true" />

        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <h2 className="font-display text-5xl font-black text-leaf sm:text-6xl">Three ways to brunch</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {PACKAGES.map((p) => (
              <div key={p.name} className={`relative rounded-3xl p-6 ${p.hot ? "bg-leaf text-bone" : "bg-white"}`}>
                {p.hot && <span className="absolute right-5 top-5 rounded-full bg-ember px-2.5 py-1 text-xs font-bold text-white">Most booked</span>}
                <h3 className="font-display text-3xl font-black">{p.name}</h3>
                <p className={`mt-1 font-bold ${p.hot ? "text-ochre" : "text-ember-deep"}`}>{p.price}</p>
                <ul className={`mt-4 space-y-2 text-sm ${p.hot ? "text-bone/85" : "text-ash"}`}>
                  {p.points.map((x) => <li key={x} className="flex gap-2"><span aria-hidden="true" className="text-ember">●</span>{x}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white py-20">
          <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 md:grid-cols-[1fr_1.2fr]">
            <div>
              <h2 className="font-display text-5xl font-black text-leaf sm:text-6xl">The brunch menu</h2>
              <p className="mt-4 max-w-sm text-lg text-ash">Served alongside the full grill menu. Everything is cooked to order, so give the eggs a minute.</p>
              <img src={photo(PHOTOS.room, 900, 700)} alt="The dining room set for brunch" loading="lazy" className="mt-8 hidden aspect-[9/7] w-full rounded-2xl object-cover md:block" />
            </div>
            <ul className="divide-y divide-mist">
              {brunch.dishes.map((d) => (
                <li key={d.id} className="flex items-baseline gap-4 py-4">
                  <div className="flex-1">
                    <p className="font-bold">{d.name}{d.veg && <span className="ml-2 text-xs font-bold text-leaf-soft">VEG</span>}</p>
                    <p className="text-sm text-ash">{d.desc}</p>
                  </div>
                  <span className="shrink-0 font-semibold tabular-nums">{rwf(d.price)}</span>
                </li>
              ))}
              <li className="flex items-baseline gap-4 py-4">
                <div className="flex-1">
                  <p className="font-bold">Passion mimosa</p>
                  <p className="text-sm text-ash">Sparkling wine and fresh passion juice.</p>
                </div>
                <span className="shrink-0 font-semibold tabular-nums">{rwf(5000)}</span>
              </li>
            </ul>
          </div>
        </section>

        <section id="book-brunch" className="mx-auto grid max-w-6xl scroll-mt-20 gap-10 px-4 py-20 sm:px-6 md:grid-cols-[1fr_1.2fr]">
          <div>
            <h2 className="font-display text-5xl font-black leading-[0.95] text-leaf sm:text-6xl">Book your brunch table</h2>
            <p className="mt-4 max-w-sm text-lg text-ash">Walk-ins welcome, but Sundays from 11:00 fill up fast. Groups of 8 or more, book ahead so we can join tables.</p>
            <div className="mt-8">
              <Faq items={[
                ["Do you take children?", "Yes. High chairs, a kids' menu, and kids under 6 eat free from the family board."],
                ["How long is bottomless?", "Two hours from when you sit down. Everyone at the table needs to be on it."],
                ["Is there vegetarian food?", "Plenty: rolex, shakshuka, pancakes, avocado toast and mandazi are all vegetarian."],
                ["Can I order brunch for delivery?", "Yes, on weekends from 10:00 to 14:00 through online ordering. Mimosas stay here."],
              ]} />
            </div>
          </div>
          <ReservationForm kind="brunch" tone="light" times={BRUNCH_TIMES} days={[6, 0]} guests={[1, 2, 3, 4, 5, 6, 8, 10]}
            submitLabel="Request brunch booking" notePlaceholder="High chair, birthday, dietary needs..."
            extras={[{ label: "À la carte", value: "À la carte" }, { label: "Bottomless, 15,000 RWF per person", value: "Bottomless brunch" }, { label: "Family board for four", value: "Family board" }]} />
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
