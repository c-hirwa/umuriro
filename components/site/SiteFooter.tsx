import Link from "next/link";
import { Logo } from "@/components/Logo";
import { HOURS, PLACE, SOCIAL } from "@/lib/data";
import { Newsletter } from "./Newsletter";

export function SiteFooter() {
  return (
    <>
      <div className="imigongo" aria-hidden="true" />
      <footer className="bg-leaf text-bone">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.3fr_1fr_1fr_1.2fr]">
          <div>
            <Logo light />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-bone/75">
              Charcoal grill, weekend brunch and live music in Kiyovu, Kigali. Cooked over fire since 2019.
            </p>
            <div className="mt-5 flex gap-2">
              <a href={SOCIAL.instagram} target="_blank" rel="noopener" className="rounded-full border border-bone/25 px-3 py-1.5 text-sm font-semibold hover:bg-bone/10">Instagram</a>
              <a href={SOCIAL.facebook} target="_blank" rel="noopener" className="rounded-full border border-bone/25 px-3 py-1.5 text-sm font-semibold hover:bg-bone/10">Facebook</a>
              <a href={`https://wa.me/${PLACE.whatsapp}`} target="_blank" rel="noopener" className="rounded-full border border-bone/25 px-3 py-1.5 text-sm font-semibold hover:bg-bone/10">WhatsApp</a>
            </div>
          </div>
          <nav aria-label="Footer">
            <h2 className="font-display text-xl font-black tracking-wide text-ochre">Eat with us</h2>
            <ul className="mt-3 space-y-2 text-sm text-bone/80">
              {[["/menu", "Menu"], ["/order", "Order online"], ["/brunch", "Weekend brunch"], ["/events", "Events"], ["/private-events", "Private events and catering"], ["/#book", "Book a table"]].map(([h, l]) => (
                <li key={h}><Link href={h} className="hover:text-bone hover:underline">{l}</Link></li>
              ))}
            </ul>
          </nav>
          <div>
            <h2 className="font-display text-xl font-black tracking-wide text-ochre">Hours</h2>
            <ul className="mt-3 space-y-1.5 text-sm text-bone/80">
              {HOURS.map((h) => <li key={h.days} className="flex justify-between gap-3"><span>{h.days}</span><span className="tabular-nums">{h.time}</span></li>)}
            </ul>
            <p className="mt-3 text-sm text-bone/80">{PLACE.address}</p>
            <a href={`tel:${PLACE.phoneDisplay.replace(/\s/g, "")}`} className="text-sm font-semibold hover:underline">{PLACE.phoneDisplay}</a>
          </div>
          <Newsletter />
        </div>
        <div className="border-t border-bone/10">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-5 text-xs text-bone/60 sm:px-6">
            <p>© Umuriro Grill House</p>
            <p>Prices in RWF, VAT included</p>
            <Link href="/admin" className="hover:text-bone sm:ml-auto">Staff</Link>
          </div>
        </div>
      </footer>
    </>
  );
}
