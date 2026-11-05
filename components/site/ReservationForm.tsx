"use client";

import { useEffect, useState } from "react";
import { addReservation } from "@/lib/store";

const TIMES = ["12:00", "12:30", "13:00", "13:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00"];
const field = "mt-1.5 w-full rounded-xl border-2 border-bone/25 bg-char/60 px-3.5 py-3 text-bone placeholder:text-bone/40 focus:border-ochre focus:outline-none";

function today() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function ReservationForm() {
  const [f, setF] = useState({ name: "", phone: "", date: "", time: "19:00", guests: 2, note: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);
  const [minDate, setMinDate] = useState<string>();
  useEffect(() => { const t = setTimeout(() => setMinDate(today()), 0); return () => clearTimeout(t); }, []);
  const set = (k: keyof typeof f, v: string | number) => setF((p) => ({ ...p, [k]: v }));

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const err: Record<string, string> = {};
    if (!f.name.trim()) err.name = "Add the name the booking is under.";
    if (f.phone.replace(/\D/g, "").length < 9) err.phone = "Add a phone number so we can confirm.";
    if (!f.date) err.date = "Pick a date.";
    else if (f.date < today()) err.date = "That date has passed. Pick today or later.";
    setErrors(err);
    if (Object.keys(err).length) return;
    addReservation({ ...f, note: f.note.trim() || undefined });
    setSent(true);
  }

  if (sent) {
    return (
      <div className="fade-in self-start rounded-2xl bg-bone p-8 text-char">
        <p className="font-display text-4xl font-black text-leaf">Request sent</p>
        <p className="mt-3 text-lg">
          Table for {f.guests} on {new Date(f.date + "T00:00").toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })} at {f.time}.
          We&apos;ll confirm on WhatsApp at {f.phone} within the hour.
        </p>
        <button onClick={() => { setSent(false); setF({ ...f, note: "" }); }} className="mt-6 font-bold text-ember underline underline-offset-4">
          Book another table
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="grid gap-4 rounded-2xl bg-char/70 p-5 backdrop-blur sm:grid-cols-2 sm:p-7">
      <Field label="Name" error={errors.name}>
        <input className={field} value={f.name} onChange={(e) => set("name", e.target.value)} autoComplete="name" aria-invalid={!!errors.name} />
      </Field>
      <Field label="Phone or WhatsApp" error={errors.phone}>
        <input className={field} value={f.phone} onChange={(e) => set("phone", e.target.value)} type="tel" autoComplete="tel" placeholder="078..." aria-invalid={!!errors.phone} />
      </Field>
      <Field label="Date" error={errors.date}>
        <input className={`${field} [color-scheme:dark]`} type="date" min={minDate} value={f.date} onChange={(e) => set("date", e.target.value)} aria-invalid={!!errors.date} />
      </Field>
      <Field label="Time">
        <select className={field} value={f.time} onChange={(e) => set("time", e.target.value)}>
          {TIMES.map((t) => <option key={t}>{t}</option>)}
        </select>
      </Field>
      <div className="sm:col-span-2">
        <span className="text-sm font-semibold">Guests</span>
        <div className="mt-1.5 flex flex-wrap gap-2" role="radiogroup" aria-label="Guests">
          {[1, 2, 3, 4, 5, 6, 8, 10, 12].map((n) => (
            <button type="button" key={n} role="radio" aria-checked={f.guests === n} onClick={() => set("guests", n)}
              className={`size-11 rounded-full border-2 font-bold transition-colors ${f.guests === n ? "border-ember bg-ember text-white" : "border-bone/25 hover:border-bone/60"}`}>
              {n}
            </button>
          ))}
        </div>
      </div>
      <Field label="Anything we should know?" className="sm:col-span-2">
        <textarea className={`${field} min-h-20`} value={f.note} onChange={(e) => set("note", e.target.value)} placeholder="Birthday, high chair, allergies..." />
      </Field>
      <button className="rounded-full bg-ember px-6 py-3.5 font-bold text-white hover:bg-ember-deep sm:col-span-2">Request booking</button>
    </form>
  );
}

function Field({ label, error, className = "", children }: { label: string; error?: string; className?: string; children: React.ReactNode }) {
  return (
    <label className={`block ${className}`}>
      <span className="text-sm font-semibold">{label}</span>
      {children}
      {error && <span className="mt-1.5 block text-sm font-semibold text-ochre" role="alert">{error}</span>}
    </label>
  );
}
