import type { Metadata } from "next";
import { PHOTOS, PLACE, photo } from "@/lib/data";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { PrivateEventForm } from "@/components/site/PrivateEventForm";
import { Faq } from "@/components/site/Faq";

export const metadata: Metadata = {
  title: "Private events and catering",
  description: "Host a birthday, wedding party or company dinner at Umuriro in Kiyovu, or have our charcoal grill cater your event anywhere in Kigali.",
};

const SPACES = [
  { name: "Garden terrace", size: "Up to 40 seated, 70 standing", desc: "Open air under the jacarandas, with its own bar and a corner for a band or DJ.", img: PHOTOS.crowd },
  { name: "The long table", size: "Up to 20 seated", desc: "One big table beside the grill. Made for birthdays, family dinners and team nights.", img: PHOTOS.grill },
  { name: "Main room", size: "Up to 60 seated", desc: "The whole indoor room, with sound system and screen for speeches or slides.", img: PHOTOS.room },
  { name: "Off-site catering", size: "30 to 500 guests", desc: "We bring the grill, the charcoal and the team to your garden, office or venue.", img: PHOTOS.coals },
];

const MENUS = [
  { name: "The Brochette", price: "15,000 RWF", per: "per guest", items: ["Goat and beef brochettes", "Chips, plantain and kachumbari", "Fresh juice"] },
  { name: "The Feast", price: "25,000 RWF", per: "per guest", items: ["Samosas and wings to start", "Mixed grill and whole tilapia, shared", "Three sides", "Grilled pineapple", "Juice and soft drinks"], hot: true },
  { name: "The Celebration", price: "40,000 RWF", per: "per guest", items: ["Welcome cocktail", "Five shared courses", "Sirloin and lake fish", "Dessert table", "Two drinks each from the bar"] },
];

export default function PrivateEventsPage() {
  return (
    <>
      <SiteHeader overlay />
      <main>
        <section className="relative isolate overflow-hidden bg-char text-bone">
          <img src={photo(PHOTOS.room, 2000, 900)} alt="" className="absolute inset-0 -z-10 size-full object-cover opacity-40" fetchPriority="high" />
          <div className="mx-auto max-w-6xl px-4 pb-16 pt-36 sm:px-6">
            <p className="font-bold text-ochre">Private events and catering</p>
            <h1 className="mt-2 max-w-3xl font-display text-[clamp(3.4rem,10vw,8rem)] font-black leading-[0.86]">Your party, our fire.</h1>
            <p className="mt-6 max-w-lg text-lg text-bone/85">Birthdays, weddings, company dinners and launches, here in Kiyovu or wherever you are. We handle the food, drinks and set-up.</p>
            <a href="#enquire" className="mt-8 inline-block rounded-full bg-ember px-6 py-3 font-bold text-white hover:bg-ember-deep">Start an enquiry</a>
          </div>
        </section>
        <div className="imigongo" aria-hidden="true" />

        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <h2 className="font-display text-5xl font-black text-leaf sm:text-6xl">Spaces</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {SPACES.map((s) => (
              <article key={s.name} className="flex overflow-hidden rounded-3xl bg-white">
                <img src={photo(s.img, 400, 500)} alt="" loading="lazy" className="w-32 shrink-0 object-cover sm:w-40" />
                <div className="p-5">
                  <h3 className="font-display text-3xl font-black leading-none text-leaf">{s.name}</h3>
                  <p className="mt-1 text-sm font-bold text-ember-deep">{s.size}</p>
                  <p className="mt-2 text-sm text-ash">{s.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="bg-leaf py-20 text-bone">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="font-display text-5xl font-black sm:text-6xl">Set menus</h2>
            <p className="mt-2 max-w-lg text-bone/75">Starting points. We&apos;ll shape the menu around your guests, dietary needs and budget.</p>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {MENUS.map((m) => (
                <div key={m.name} className={`rounded-3xl p-6 ${m.hot ? "bg-bone text-char" : "bg-leaf-soft"}`}>
                  <h3 className="font-display text-3xl font-black">{m.name}</h3>
                  <p className="mt-1"><span className={`font-display text-4xl font-black ${m.hot ? "text-ember" : "text-ochre"}`}>{m.price}</span> <span className="text-sm opacity-75">{m.per}</span></p>
                  <ul className="mt-4 space-y-1.5 text-sm">
                    {m.items.map((x) => <li key={x} className="flex gap-2"><span aria-hidden="true" className="text-ember">●</span>{x}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="enquire" className="mx-auto grid max-w-6xl scroll-mt-20 gap-10 px-4 py-20 sm:px-6 md:grid-cols-[1fr_1.3fr]">
          <div>
            <h2 className="font-display text-5xl font-black leading-[0.95] text-leaf sm:text-6xl">Tell us what you&apos;re planning</h2>
            <p className="mt-4 text-lg text-ash">We reply within one working day. Or call the events team on {PLACE.phoneDisplay}.</p>
            <div className="mt-8">
              <Faq items={[
                ["Is there a minimum spend?", "For the terrace and main room, from Sunday to Thursday there's no hire fee if you take a set menu. Friday and Saturday have a minimum spend; we'll quote it with your menu."],
                ["Do you need a deposit?", "30% to hold the date, paid by MoMo or bank transfer. The rest on the day."],
                ["Can we bring our own cake or DJ?", "Yes to both. There's power and a spot for a DJ on the terrace."],
                ["How far will you cater?", "Anywhere in Kigali, and further for bigger events. Transport is quoted separately."],
              ]} />
            </div>
          </div>
          <PrivateEventForm />
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
