"use client";

import { useState } from "react";
import { addReservation } from "@/lib/store";
import { useMounted } from "@/components/order/ui";

const OCCASIONS = ["Birthday", "Wedding or engagement", "Company dinner or party", "Product launch", "Graduation", "Catering at my venue", "Something else"];
const SPACES = ["Garden terrace (up to 40)", "The long table (up to 20)", "Main room (up to 60)", "Whole restaurant (up to 120)", "Not sure yet"];
const BUDGETS = ["Under 15,000 RWF a head", "15,000–25,000 RWF a head", "25,000–40,000 RWF a head", "Over 40,000 RWF a head", "Not sure yet"];
const field = "mt-1.5 w-full rounded-xl border-2 border-mist bg-white px-3.5 py-3 focus:border-leaf focus:outline-none aria-[invalid=true]:border-ember";

export function PrivateEventForm() {
  const mounted = useMounted();
  const today = mounted ? new Date().toLocaleDateString("en-CA") : undefined; // YYYY-MM-DD in local time
  const [f, setF] = useState({ name: "", phone: "", email: "", occasion: OCCASIONS[0], space: SPACES[0], budget: BUDGETS[1], date: "", time: "19:00", guests: "30", note: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);
  const set = (k: keyof typeof f, v: string) => { setF((p) => ({ ...p, [k]: v })); setErrors((e) => ({ ...e, [k]: "" })); };

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const err: Record<string, string> = {};
    if (!f.name.trim()) err.name = "Add your name.";
    if (f.phone.replace(/\D/g, "").length < 9) err.phone = "Add a phone number.";
    if (!f.date) err.date = "Pick a date, even a rough one.";
    else if (today && f.date < today) err.date = "That date has passed.";
    const n = Number(f.guests);
    if (!n || n < 8) err.guests = "Private events start at 8 guests. For fewer, book a table.";
    setErrors(err);
    if (Object.values(err).some(Boolean)) return;
    addReservation({
      kind: "private", event: f.occasion, name: f.name.trim(), phone: f.phone.trim(), date: f.date, time: f.time, guests: n,
      note: [f.space, f.budget, f.email && `Email ${f.email}`, f.note.trim()].filter(Boolean).join(". "),
    });
    setSent(true);
  }

  if (sent) {
    return (
      <div role="status" className="fade-in rounded-3xl bg-leaf p-8 text-bone">
        <p className="font-display text-4xl font-black">Thanks, {f.name.split(" ")[0]}</p>
        <p className="mt-3 text-lg text-bone/85">
          Our events team will call you on {f.phone} within one working day with menu ideas and a quote for {f.guests} guests.
        </p>
        <button onClick={() => setSent(false)} className="mt-6 font-bold text-ochre underline underline-offset-4">Send another enquiry</button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="grid gap-4 rounded-3xl bg-white p-5 sm:grid-cols-2 sm:p-7">
      <F label="Your name" error={errors.name}><input className={field} value={f.name} onChange={(e) => set("name", e.target.value)} autoComplete="name" aria-invalid={!!errors.name} /></F>
      <F label="Phone or WhatsApp" error={errors.phone}><input className={field} type="tel" value={f.phone} onChange={(e) => set("phone", e.target.value)} autoComplete="tel" placeholder="078..." aria-invalid={!!errors.phone} /></F>
      <F label="Email (optional)" className="sm:col-span-2"><input className={field} type="email" value={f.email} onChange={(e) => set("email", e.target.value)} autoComplete="email" /></F>
      <F label="Occasion"><select className={field} value={f.occasion} onChange={(e) => set("occasion", e.target.value)}>{OCCASIONS.map((o) => <option key={o}>{o}</option>)}</select></F>
      <F label="Space"><select className={field} value={f.space} onChange={(e) => set("space", e.target.value)}>{SPACES.map((o) => <option key={o}>{o}</option>)}</select></F>
      <F label="Date" error={errors.date}><input className={field} type="date" min={today} value={f.date} onChange={(e) => set("date", e.target.value)} aria-invalid={!!errors.date} /></F>
      <F label="Start time"><input className={field} type="time" value={f.time} onChange={(e) => set("time", e.target.value)} /></F>
      <F label="Number of guests" error={errors.guests}><input className={field} inputMode="numeric" value={f.guests} onChange={(e) => set("guests", e.target.value.replace(/\D/g, "").slice(0, 3))} aria-invalid={!!errors.guests} /></F>
      <F label="Food budget"><select className={field} value={f.budget} onChange={(e) => set("budget", e.target.value)}>{BUDGETS.map((o) => <option key={o}>{o}</option>)}</select></F>
      <F label="Tell us about it" className="sm:col-span-2">
        <textarea className={`${field} min-h-24`} value={f.note} onChange={(e) => set("note", e.target.value)} placeholder="Music, cake, decorations, dietary needs, speeches..." />
      </F>
      <button className="rounded-full bg-ember px-6 py-3.5 font-bold text-white hover:bg-ember-deep sm:col-span-2">Send enquiry</button>
    </form>
  );
}

function F({ label, error, className = "", children }: { label: string; error?: string; className?: string; children: React.ReactNode }) {
  return (
    <label className={`block ${className}`}>
      <span className="text-sm font-semibold">{label}</span>
      {children}
      {error && <span role="alert" className="mt-1.5 block text-sm font-semibold text-ember-deep">{error}</span>}
    </label>
  );
}
