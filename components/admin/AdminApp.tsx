"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useDB, resetDemo, type DB } from "@/lib/store";
import { Logo } from "@/components/Logo";
import { Overview } from "./Overview";
import { OrdersBoard } from "./OrdersBoard";
import { Reservations } from "./Reservations";
import { MenuManager } from "./MenuManager";
import { QRCodes } from "./QRCodes";
import { orderWhere } from "./util";

// Demo-only gate. A real deployment needs proper auth on the server.
const DEMO_PIN = "2580";
const SESSION = "umuriro:admin";

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "orders", label: "Orders" },
  { id: "reservations", label: "Bookings" },
  { id: "menu", label: "Menu" },
  { id: "qr", label: "QR codes" },
] as const;
type Tab = (typeof TABS)[number]["id"];

export function AdminApp() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  useEffect(() => {
    const t = setTimeout(() => {
      try { setAuthed(sessionStorage.getItem(SESSION) === "1"); } catch { setAuthed(false); }
    }, 0);
    return () => clearTimeout(t);
  }, []);
  if (authed === null) return <div className="min-h-dvh bg-leaf" />;
  if (!authed) return <Login onOk={() => { try { sessionStorage.setItem(SESSION, "1"); } catch {} setAuthed(true); }} />;
  return <Dashboard onLogout={() => { try { sessionStorage.removeItem(SESSION); } catch {} setAuthed(false); }} />;
}

function Login({ onOk }: { onOk: () => void }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (pin === DEMO_PIN) onOk();
    else { setError(true); setPin(""); }
  }
  return (
    <div className="grid min-h-dvh place-items-center bg-leaf px-4">
      <form onSubmit={submit} className="w-full max-w-sm rounded-3xl bg-bone p-7">
        <Logo />
        <h1 className="mt-6 font-display text-4xl font-black text-leaf">Staff dashboard</h1>
        <label className="mt-6 block">
          <span className="font-semibold">PIN</span>
          <input value={pin} onChange={(e) => { setPin(e.target.value.replace(/\D/g, "").slice(0, 4)); setError(false); }}
            inputMode="numeric" autoComplete="off" autoFocus aria-invalid={error}
            className="mt-2 w-full rounded-xl border-2 border-mist bg-white px-4 py-3 text-center font-display text-3xl tracking-[0.5em] focus:border-leaf focus:outline-none" />
        </label>
        {error && <p role="alert" className="mt-2 text-sm font-semibold text-ember-deep">That PIN didn&apos;t match. Try again.</p>}
        <button className="mt-5 w-full rounded-full bg-ember py-3.5 font-bold text-white hover:bg-ember-deep">Sign in</button>
        <p className="mt-4 text-center text-sm text-ash">Demo PIN: {DEMO_PIN}</p>
      </form>
    </div>
  );
}

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const db = useDB();
  const [tab, setTab] = useState<Tab>("orders");
  const [toast, setToast] = useState<string | null>(null);
  const seen = useRef<Set<number> | null>(null);
  const [fresh, setFresh] = useState<Set<number>>(new Set());

  // notice orders that arrive while the dashboard is open (from the QR menu in another tab)
  useEffect(() => {
    if (!db) return;
    const ids = new Set(db.orders.map((o) => o.id));
    if (seen.current) {
      const incoming = db.orders.filter((o) => !seen.current!.has(o.id));
      if (incoming.length) {
        const o = incoming[0];
        const t = setTimeout(() => {
          setToast(`New order #${o.id}: ${orderWhere(o)}`);
          setFresh((f) => new Set([...f, ...incoming.map((x) => x.id)]));
        }, 0);
        seen.current = ids;
        return () => clearTimeout(t);
      }
    }
    seen.current = ids;
  }, [db]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 5000);
    return () => clearTimeout(t);
  }, [toast]);

  const counts = db ? countBadges(db) : { orders: 0, reservations: 0 };
  useEffect(() => {
    document.title = counts.orders ? `(${counts.orders}) Dashboard | Umuriro` : "Dashboard | Umuriro";
  }, [counts.orders]);

  return (
    <div className="min-h-dvh bg-bone md:grid md:grid-cols-[220px_1fr]">
      <aside className="no-print sticky top-0 z-20 bg-leaf text-bone md:h-dvh">
        <div className="flex items-center gap-3 px-4 py-4 md:block md:px-5 md:py-6">
          <Logo light />
          <p className="hidden text-xs text-bone/60 md:mt-1 md:block">Kiyovu, staff dashboard</p>
          <div className="ml-auto flex gap-2 md:hidden">
            <button onClick={onLogout} className="rounded-full border border-bone/30 px-3 py-1.5 text-xs font-semibold">Sign out</button>
          </div>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 [scrollbar-width:none] md:flex-col md:px-3" aria-label="Dashboard sections">
          {TABS.map((t) => {
            const badge = t.id === "orders" ? counts.orders : t.id === "reservations" ? counts.reservations : 0;
            return (
              <button key={t.id} onClick={() => setTab(t.id)} aria-current={tab === t.id ? "page" : undefined}
                className={`flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2.5 text-left text-sm font-semibold transition-colors ${tab === t.id ? "bg-bone text-leaf" : "text-bone/80 hover:bg-leaf-soft"}`}>
                {t.label}
                {badge > 0 && <span className={`ml-auto rounded-full px-2 py-0.5 text-xs font-bold ${tab === t.id ? "bg-ember text-white" : "bg-ember text-white"}`}>{badge}</span>}
              </button>
            );
          })}
        </nav>
        <div className="hidden px-5 pt-6 md:block">
          <Link href="/menu?table=4" target="_blank" className="block text-sm text-bone/75 underline underline-offset-4 hover:text-bone">Open the guest menu</Link>
          <Link href="/order" target="_blank" className="mt-2 block text-sm text-bone/75 underline underline-offset-4 hover:text-bone">Open online ordering</Link>
          <Link href="/" target="_blank" className="mt-2 block text-sm text-bone/75 underline underline-offset-4 hover:text-bone">View website</Link>
          <button onClick={() => confirmReset()} className="mt-6 block text-sm text-bone/60 hover:text-bone">Reset demo data</button>
          <button onClick={onLogout} className="mt-2 block text-sm text-bone/60 hover:text-bone">Sign out</button>
        </div>
      </aside>

      <main className="min-w-0 px-4 py-6 sm:px-6 md:px-8 md:py-8">
        {!db ? <p className="text-ash">Loading…</p> : (
          <>
            {tab === "overview" && <Overview db={db} onGo={setTab} />}
            {tab === "orders" && <OrdersBoard db={db} fresh={fresh} />}
            {tab === "reservations" && <Reservations db={db} />}
            {tab === "menu" && <MenuManager db={db} />}
            {tab === "qr" && <QRCodes />}
          </>
        )}
      </main>

      {toast && (
        <div role="status" className="no-print fade-in fixed bottom-5 right-5 left-5 z-50 flex items-center gap-3 rounded-2xl bg-char px-5 py-4 text-bone shadow-2xl sm:left-auto sm:max-w-sm">
          <span className="size-2.5 shrink-0 rounded-full bg-ember ping" />
          <p className="flex-1 text-sm font-semibold">{toast}</p>
          <button onClick={() => { setTab("orders"); setToast(null); }} className="text-sm font-bold text-ochre">View</button>
        </div>
      )}
    </div>
  );
}

function confirmReset() {
  // a plain in-page action; the demo data regenerates for "today"
  resetDemo();
}

function countBadges(db: DB) {
  return {
    orders: db.orders.filter((o) => o.status === "new").length,
    reservations: db.reservations.filter((r) => r.status === "pending").length,
  };
}
