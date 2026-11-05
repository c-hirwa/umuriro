import Link from "next/link";
import { HOURS, MENU, PHOTOS, PLACE, photo, rwf } from "@/lib/data";
import { Logo } from "@/components/Logo";
import { MenuQR } from "@/components/site/MenuQR";
import { ReservationForm } from "@/components/site/ReservationForm";

const featured = ["goat", "tilapia", "platter", "isombe", "hibiscus"].map(
  (id) => MENU.flatMap((s) => s.dishes).find((d) => d.id === id)!,
);

export default function Home() {
  return (
    <>
      <header className="absolute inset-x-0 top-0 z-20">
        <div className="mx-auto flex max-w-6xl items-center gap-6 px-4 py-5 sm:px-6">
          <Link href="/" aria-label="Umuriro home"><Logo light /></Link>
          <nav className="ml-auto hidden items-center gap-7 text-sm font-semibold text-bone/90 md:flex">
            <a href="#food" className="hover:text-bone">Food</a>
            <a href="#book" className="hover:text-bone">Book a table</a>
            <a href="#visit" className="hover:text-bone">Visit</a>
          </nav>
          <Link href="/menu" className="ml-auto rounded-full bg-bone px-4 py-2 text-sm font-bold text-leaf hover:bg-white md:ml-0">
            Open the menu
          </Link>
        </div>
      </header>

      <main>
        {/* Hero: the fire is the subject, so the photo carries it */}
        <section className="relative isolate flex min-h-[92svh] items-end overflow-hidden bg-char text-bone">
          <img src={photo(PHOTOS.hero, 2000)} alt="Brochettes cooking over glowing charcoal"
            className="absolute inset-0 -z-10 size-full object-cover" fetchPriority="high" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-char via-char/55 to-char/10" />
          <div className="mx-auto w-full max-w-6xl px-4 pb-14 sm:px-6 md:pb-20">
            <h1 className="max-w-4xl font-display text-[clamp(3.6rem,11vw,9rem)] font-black leading-[0.86] tracking-tight">
              Cooked over fire, the Rwandan way.
            </h1>
            <div className="mt-8 flex flex-wrap items-end gap-x-10 gap-y-6">
              <p className="max-w-md text-lg leading-relaxed text-bone/85">
                Goat brochettes, whole Lake Kivu tilapia and isombe, grilled on charcoal in Kiyovu since 2019.
              </p>
              <div className="flex flex-wrap gap-3">
                <a href="#book" className="rounded-full bg-ember px-6 py-3 font-bold text-white hover:bg-ember-deep">Book a table</a>
                <Link href="/menu" className="rounded-full border-2 border-bone/70 px-6 py-3 font-bold hover:bg-bone hover:text-leaf">See the menu</Link>
              </div>
            </div>
          </div>
        </section>
        <div className="imigongo" aria-hidden="true" />

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
              <Link href="/menu" className="font-bold text-ochre underline decoration-2 underline-offset-4 hover:text-bone">
                Full menu and prices
              </Link>
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
          </div>
        </section>
      </main>

      <div className="imigongo" aria-hidden="true" />
      <footer className="bg-leaf text-bone">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-8 gap-y-3 px-4 py-8 text-sm sm:px-6">
          <Logo light />
          <p className="text-bone/75">{PLACE.address}</p>
          <p className="text-bone/75 sm:ml-auto">Umuriro Grill House</p>
        </div>
      </footer>
    </>
  );
}
