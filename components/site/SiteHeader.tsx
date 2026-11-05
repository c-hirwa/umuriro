"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/Logo";
import { useCart } from "@/lib/cart";
import { PLACE } from "@/lib/data";

export const NAV = [
  { href: "/menu", label: "Menu" },
  { href: "/order", label: "Order online" },
  { href: "/brunch", label: "Brunch" },
  { href: "/events", label: "Events" },
  { href: "/private-events", label: "Private events" },
  { href: "/#visit", label: "Visit" },
];

/** `overlay` sits on top of a dark hero photo; otherwise the header is solid. */
export function SiteHeader({ overlay = false }: { overlay?: boolean }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { count } = useCart("online");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [open]);

  const light = overlay && !scrolled;
  const isActive = (href: string) => !href.includes("#") && (pathname === href || pathname.startsWith(href + "/"));

  return (
    <>
      <header className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${light ? "bg-transparent" : "bg-leaf shadow-lg shadow-char/10"}`}>
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3.5 sm:px-6">
          <Link href="/" aria-label="Umuriro home" className="shrink-0"><Logo light /></Link>
          <nav aria-label="Main" className="ml-auto hidden items-center gap-1 text-sm font-semibold text-bone/85 lg:flex">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} aria-current={isActive(n.href) ? "page" : undefined}
                className={`rounded-full px-3 py-2 transition-colors hover:bg-bone/10 hover:text-bone ${isActive(n.href) ? "bg-bone/15 text-bone" : ""}`}>
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2 lg:ml-2">
            <Link href="/order" aria-label={count ? `Cart, ${count} items` : "Cart"}
              className="relative grid size-10 place-items-center rounded-full text-bone hover:bg-bone/10">
              <CartIcon />
              {count > 0 && <span className="absolute -right-0.5 -top-0.5 grid min-w-5 place-items-center rounded-full bg-ember px-1 text-[11px] font-bold leading-5 text-white">{count}</span>}
            </Link>
            <Link href="/#book" className="hidden rounded-full bg-ember px-4 py-2 text-sm font-bold text-white hover:bg-ember-deep sm:inline-block">
              Book a table
            </Link>
            <button onClick={() => setOpen(true)} aria-label="Open menu" aria-expanded={open} aria-controls="mobile-nav"
              className="grid size-10 place-items-center rounded-full text-bone hover:bg-bone/10 lg:hidden">
              <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
            </button>
          </div>
        </div>
      </header>
      {!overlay && <div className="h-[68px]" aria-hidden="true" />}

      {open && (
        <div id="mobile-nav" role="dialog" aria-modal="true" aria-label="Site menu" className="fixed inset-0 z-50 lg:hidden">
          <div className="fade-in absolute inset-0 bg-char/60" onClick={() => setOpen(false)} />
          <div className="drawer-in absolute inset-y-0 right-0 flex w-[min(22rem,88vw)] flex-col bg-leaf text-bone shadow-2xl">
            <div className="flex items-center justify-between px-5 py-3.5">
              <Logo light />
              <button onClick={() => setOpen(false)} aria-label="Close menu" autoFocus
                className="grid size-11 place-items-center rounded-full bg-bone/10 text-bone hover:bg-bone/20">
                <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
              </button>
            </div>
            <div className="imigongo" aria-hidden="true" />
            <nav aria-label="Main" className="flex-1 overflow-y-auto px-3 py-4">
              {[{ href: "/", label: "Home" }, ...NAV].map((n) => (
                <Link key={n.href} href={n.href} onClick={() => setOpen(false)} aria-current={isActive(n.href) && n.href !== "/" ? "page" : undefined}
                  className={`block rounded-xl px-4 py-3 font-display text-3xl font-black tracking-wide hover:bg-leaf-soft ${isActive(n.href) && n.href !== "/" ? "text-ochre" : ""}`}>
                  {n.label}
                </Link>
              ))}
            </nav>
            <div className="space-y-2 border-t border-bone/15 p-5">
              <Link href="/#book" onClick={() => setOpen(false)} className="block rounded-full bg-ember py-3 text-center font-bold text-white">Book a table</Link>
              <a href={`tel:${PLACE.phoneDisplay.replace(/\s/g, "")}`} className="block rounded-full border-2 border-bone/30 py-2.5 text-center font-bold">Call {PLACE.phoneDisplay}</a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function CartIcon({ className = "size-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 7h14l-1.2 11.1a2 2 0 01-2 1.9H8.2a2 2 0 01-2-1.9L5 7z" /><path d="M9 10V6a3 3 0 016 0v4" />
    </svg>
  );
}
