import Link from "next/link";
import { BRUNCH_HOURS, HOURS, MENU, PHOTOS, PLACE, photo, rwf } from "@/lib/data";
import { MenuQR } from "@/components/site/MenuQR";
import { ReservationForm } from "@/components/site/ReservationForm";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { EventsCalendar } from "@/components/site/EventsCalendar";
import { OpenNow } from "@/components/site/OpenNow";
import { Faq } from "@/components/site/Faq";

const WAYS = [
  { href: "/#book", title: "Eat in", desc: "Charcoal grill, garden terrace, open late on weekends.", cta: "Book a table", img: PHOTOS.room },
  { href: "/order", title: "Order online", desc: "Pickup in 20 minutes or delivery across Kigali.", cta: "Start an order", img: "1555939594-58d7cb561ad1" },
  { href: "/brunch", title: "Weekend brunch", desc: "Rolex, pancakes and bottomless mimosas, Sat and Sun.", cta: "See brunch", img: PHOTOS.crowd },
  { href: "/events", title: "Events", desc: "Live music Fridays, Nyama Night, trivia and more.", cta: "See what is on", img: PHOTOS.coals },
];

const REVIEWS = [
  { q: "The goat brochettes are the best in Kigali, and I have tried a lot of them. The Friday band is a bonus.", who: "Jean-Paul, Kimihurura" },
  { q: "Sunday brunch has become our family thing. The kids go straight for the banana pancakes.", who: "Ange, Kicukiro" },
  { q: "Ordered the mixed grill to the office for a team lunch. Hot, on time, and the rider called ahead.", who: "Michelle, Kacyiru" },
];

const featured = ["goat", "tilapia", "platter", "isombe", "hibiscus"].map(
  (id) => MENU.flatMap((s) => s.dishes).find((d) => d.id === id)!,
);

export default function Home() {
  return (
    <>
      <SiteHeader overlay />

      <main>
        {/* Hero: the fire is the subject, so the photo carries it */}
        <section className="relative isolate flex min-h-[92svh] items-end overflow-hidden bg-char text-bone">
          <img src={photo(PHOTOS.hero, 2000)} alt="Brochettes cooking over glowing charcoal"
            className="absolute inset-0 -z-10 size-full object-cover" fetchPriority="high" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-char via-char/55 to-char/10" />
          <div className="mx-auto w-full max-w-6xl px-4 pb-14 pt-28 sm:px-6 md:pb-20">
            <OpenNow />
            <h1 className="mt-4 max-w-4xl font-display text-[clamp(3.6rem,11vw,9rem)] font-black leading-[0.86] tracking-tight">
              Cooked over fire, the Rwandan way.
            </h1>
            <div className="mt-8 flex flex-wrap items-end gap-x-10 gap-y-6">
              <p className="max-w-md text-lg leading-relaxed text-bone/85">
                Goat brochettes, whole Lake Kivu tilapia and isombe, grilled on charcoal in Kiyovu since 2019.
              </p>
              <div className="flex flex-wrap gap-3">
                <a href="#book" className="rounded-full bg-ember px-6 py-3 font-bold text-white hover:bg-ember-deep">Book a table</a>
                <Link href="/order" className="rounded-full bg-bone px-6 py-3 font-bold text-leaf hover:bg-white">Order online</Link>
                <Link href="/menu" className="rounded-full border-2 border-bone/70 px-6 py-3 font-bold hover:bg-bone hover:text-leaf">See the menu</Link>
              </div>
            </div>
          </div>
        </section>
        <div className="imigongo" aria-hidden="true" />

        {/* Ways to eat */}
        <section aria-label="Ways to eat with us" className="mx-auto max-w-6xl px-4 pt-16 sm:px-6">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {WAYS.map((w) => (
              <Link key={w.title} href={w.href} className="group relative isolate flex min-h-56 flex-col justify-end overflow-hidden rounded-3xl bg-char p-5 text-bone">
                <img src={photo(w.img, 600, 600)} alt="" loading="lazy" className="absolute inset-0 -z-10 size-full object-cover opacity-55 transition duration-500 group-hover:scale-105 group-hover:opacity-45" />
                <div className="absolute inset-0 -z-10 bg-gradient-to-t from-char/90 to-transparent" />
                <h2 className="font-display text-4xl font-black leading-none">{w.title}</h2>
                <p className="mt-1 text-sm text-bone/80">{w.desc}</p>
                <span className="mt-3 text-sm font-bold text-ochre group-hover:underline">{w.cta} →</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Story */}
        <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-20 sm:px-6 md:grid-cols-2 md:py-28">
          <div className="relative">
            <img src={photo(PHOTOS.grill, 1000, 1100)} alt="Meat being turned on a charcoal grill"
              className="aspect-[10/11] w-full rounded-2xl object-cover" loading="lazy" />
            <img src={photo(PHOTOS.coals, 500, 500)} alt=""
              className="absolute -bottom-8 -right-4 hidden w-40 rounded-xl border-4 border-bone object-cover shadow-xl sm:block" loading="lazy" />
          </div>
          <div>
            <h2 className="font-display text-5xl font-black leading-[0.95] text-leaf sm:text-6xl">
              Umuriro means fire. It&apos;s the only way we cook meat.
            </h2>
            <p className="mt-6 max-w-[62ch] text-lg leading-relaxed text-ash">
              Every brochette is marinated overnight and grilled over eucalyptus charcoal, the way it&apos;s done at
              roadside grills across the country. Fish arrives from Lake Kivu each morning. When it&apos;s gone, it&apos;s gone.
            </p>
            <dl className="mt-10 grid grid-cols-3 gap-4 border-t-2 border-mist pt-6">
              {[["Charcoal", "No gas, ever"], ["Daily", "Fish from Kivu"], ["Late", "Open till 1am Fri, Sat"]].map(([a, b]) => (
                <div key={a}>
                  <dt className="font-display text-3xl font-black text-ember">{a}</dt>
                  <dd className="text-sm text-ash">{b}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* Food */}
        <section id="food" className="bg-leaf py-20 text-bone md:py-28">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <h2 className="font-display text-6xl font-black leading-none sm:text-7xl">What people order</h2>
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                <Link href="/menu" className="font-bold text-ochre underline decoration-2 underline-offset-4 hover:text-bone">Full menu and prices</Link>
                <Link href="/order" className="font-bold text-ochre underline decoration-2 underline-offset-4 hover:text-bone">Order for delivery</Link>
              </div>
            </div>
            <div className="mt-10 grid gap-4 md:grid-cols-4 md:grid-rows-2">
              {featured.map((d, i) => (
                <figure key={d.id}
                  className={`group relative overflow-hidden rounded-2xl bg-leaf-soft ${i === 0 ? "md:col-span-2 md:row-span-2" : ""}`}>
                  <img src={photo(d.img!, i === 0 ? 1200 : 700, i === 0 ? 1200 : 520)} alt={d.name} loading="lazy"
                    className={`w-full object-cover transition-transform duration-500 group-hover:scale-[1.03] ${i === 0 ? "aspect-square md:h-full" : "aspect-[4/3] md:h-full"}`} />
                  <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-char/90 to-transparent p-4 pt-16">
                    <span>
                      <span className={`block font-display font-black leading-none ${i === 0 ? "text-4xl" : "text-2xl"}`}>{d.name}</span>
                      {i === 0 && <span className="mt-2 block max-w-sm text-sm text-bone/80">{d.desc}</span>}
                    </span>
                    <span className="shrink-0 rounded-full bg-bone px-3 py-1 text-sm font-bold text-leaf tabular-nums">{rwf(d.price)}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* Brunch */}
        <section className="mx-auto max-w-6xl px-4 pt-20 sm:px-6 md:pt-28">
          <div className="grid overflow-hidden rounded-3xl bg-ochre md:grid-cols-2">
            <img src={photo(PHOTOS.crowd, 1000, 800)} alt="Friends at brunch around a long table" loading="lazy" className="aspect-[5/4] size-full object-cover md:aspect-auto" />
            <div className="p-8 md:p-12">
              <p className="font-bold text-char/70">{BRUNCH_HOURS}</p>
              <h2 className="mt-1 font-display text-5xl font-black leading-[0.92] text-char sm:text-6xl">Weekend brunch is here.</h2>
              <p className="mt-4 max-w-md text-lg text-char/80">
                Rolex, pili-pili shakshuka, banana pancakes and brochettes off the morning fire. Go bottomless on juice, coffee and passion mimosas for 15,000 RWF.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/brunch#book-brunch" className="rounded-full bg-char px-6 py-3 font-bold text-bone hover:bg-leaf">Book brunch</Link>
                <Link href="/brunch" className="rounded-full border-2 border-char px-6 py-3 font-bold text-char hover:bg-char hover:text-bone">See the brunch menu</Link>
              </div>
            </div>
          </div>
        </section>

        {/* What's on */}
        <section className="mx-auto grid max-w-6xl gap-10 px-4 py-20 sm:px-6 md:grid-cols-[1fr_1.3fr] md:py-28">
          <div>
            <h2 className="font-display text-5xl font-black leading-[0.95] text-leaf sm:text-6xl">What&apos;s on this week</h2>
            <p className="mt-4 max-w-sm text-lg text-ash">Live bands on Fridays, all-you-can-eat Nyama Night on Wednesdays, trivia on Tuesdays and a long-table fish feast once a month.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/events" className="rounded-full bg-leaf px-6 py-3 font-bold text-bone hover:bg-leaf-soft">All events</Link>
              <Link href="/private-events" className="rounded-full border-2 border-leaf px-6 py-3 font-bold text-leaf hover:bg-leaf hover:text-bone">Host a private event</Link>
            </div>
          </div>
          <EventsCalendar limit={4} compact />
        </section>

        {/* Reviews */}
        <section aria-label="What guests say" className="bg-mist/50 py-20">
          <div className="mx-auto grid max-w-6xl gap-4 px-4 sm:px-6 md:grid-cols-3">
            {REVIEWS.map((r) => (
              <figure key={r.who} className="rounded-3xl bg-white p-6">
                <p role="img" aria-label="5 out of 5 stars" className="text-ember">★★★★★</p>
                <blockquote className="mt-3 text-lg leading-snug">“{r.q}”</blockquote>
                <figcaption className="mt-4 text-sm font-bold text-ash">{r.who}</figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* QR */}
        <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-20 sm:px-6 md:grid-cols-[auto_1fr] md:gap-16 md:py-24">
          <MenuQR />
          <div>
            <h2 className="font-display text-5xl font-black leading-[0.95] text-leaf sm:text-6xl">Order from your table.</h2>
            <p className="mt-5 max-w-[56ch] text-lg leading-relaxed text-ash">
              Every table has a QR code. Scan it, pick what you want and send it straight to the kitchen. No waiting to
              catch someone&apos;s eye. Pay with MoMo or card when you&apos;re done.
            </p>
            <Link href="/menu" className="mt-7 inline-block rounded-full bg-leaf px-6 py-3 font-bold text-bone hover:bg-leaf-soft">
              Try the menu
            </Link>
          </div>
        </section>

        {/* Book */}
        <section id="book" className="relative isolate overflow-hidden bg-char py-20 text-bone md:py-28">
          <img src={photo(PHOTOS.crowd, 1800)} alt="" className="absolute inset-0 -z-10 size-full object-cover opacity-30" loading="lazy" />
          <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 md:grid-cols-[1fr_1.1fr]">
            <div>
              <h2 className="font-display text-6xl font-black leading-[0.9] sm:text-7xl">Book a table</h2>
              <p className="mt-5 max-w-sm text-lg text-bone/80">
                Birthdays, team dinners or just Friday. For groups over 12, message us and we&apos;ll set up the long table.
              </p>
            </div>
            <ReservationForm />
          </div>
        </section>

        {/* Visit */}
        <section id="visit" className="mx-auto grid max-w-6xl gap-10 px-4 py-20 sm:px-6 md:grid-cols-2 md:py-28">
          <img src={photo(PHOTOS.room, 1100, 800)} alt="The dining room at night" loading="lazy"
            className="aspect-[11/8] w-full rounded-2xl object-cover" />
          <div>
            <h2 className="font-display text-6xl font-black leading-none text-leaf">Find us</h2>
            <p className="mt-4 text-lg">{PLACE.address}</p>
            <p className="text-ash">Parking in front. Ask the guard to point you to the fire.</p>
            <table className="mt-8 w-full text-left">
              <caption className="sr-only">Opening hours</caption>
              <tbody>
                {HOURS.map((h) => (
                  <tr key={h.days} className="border-b border-mist">
                    <th scope="row" className="py-3 font-semibold">{h.days}</th>
                    <td className="py-3 text-right tabular-nums">{h.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={`tel:${PLACE.phoneDisplay.replace(/\s/g, "")}`} className="rounded-full bg-leaf px-5 py-2.5 font-bold text-bone">Call {PLACE.phoneDisplay}</a>
              <a href="https://maps.google.com/?q=Kiyovu,Kigali" target="_blank" rel="noopener" className="rounded-full border-2 border-leaf px-5 py-2.5 font-bold text-leaf">Directions</a>
            </div>
            <div className="mt-10">
              <Faq items={[
                ["Do I need to book?", "Walk-ins are welcome. Book for Friday and Saturday nights, Sunday brunch, and any group over six."],
                ["Do you deliver?", "Yes, across most of Kigali from 1,000 RWF, free over 40,000 RWF. Order online for pickup or delivery."],
                ["Is there food for vegetarians?", "Isombe, ibihaza, samosas, roasted maize, salads and most of the brunch menu are vegetarian."],
                ["How do I pay?", "MTN MoMo, Airtel Money, Visa and Mastercard, or cash."],
              ]} />
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
