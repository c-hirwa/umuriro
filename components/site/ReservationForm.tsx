"use client";

import { useState } from "react";
import { addReservation, type ReservationKind } from "@/lib/store";
import { useMounted } from "@/components/order/ui";

const TABLE_TIMES = ["12:00", "12:30", "13:00", "13:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00"];
export const BRUNCH_TIMES = ["10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00"];
const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function iso(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

type Props = {
  kind?: ReservationKind;
  times?: string[];
  /** only allow these weekdays (0 = Sunday) */
  days?: number[];
  /** the date is set by the event, the guest doesn't pick one */
  fixedDate?: string;
  event?: string;
  guests?: number[];
  tone?: "dark" | "light";
  submitLabel?: string;
  notePlaceholder?: string;
  extras?: { label: string; value: string }[];
  onDone?: () => void;
};

export function ReservationForm({
  kind = "table", times = TABLE_TIMES, days, fixedDate, event, guests = [1, 2, 3, 4, 5, 6, 8, 10, 12],
  tone = "dark", submitLabel = "Request booking", notePlaceholder = "Birthday, high chair, allergies...", extras, onDone,
}: Props) {
  const dark = tone === "dark";
  const field = dark
    ? "mt-1.5 w-full rounded-xl border-2 border-bone/25 bg-char/60 px-3.5 py-3 text-bone placeholder:text-bone/40 focus:border-ochre focus:outline-none"
    : "mt-1.5 w-full rounded-xl border-2 border-mist bg-white px-3.5 py-3 placeholder:text-ash/60 focus:border-leaf focus:outline-none";
  const mounted = useMounted();
  const today = mounted ? iso(new Date()) : undefined;

  const [f, setF] = useState({ name: "", phone: "", date: fixedDate ?? "", time: times.includes("19:00") ? "19:00" : times[0], guests: guests.includes(2) ? 2 : guests[0], note: "", extra: extras?.[0]?.value ?? "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);
  const set = (k: keyof typeof f, v: string | number) => { setF((p) => ({ ...p, [k]: v })); setErrors((e) => ({ ...e, [k]: "" })); };

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const err: Record<string, string> = {};
    const now = iso(new Date());
    if (!f.name.trim()) err.name = "Add the name the booking is under.";
    if (f.phone.replace(/\D/g, "").length < 9) err.phone = "Add a phone number so we can confirm.";
    if (!f.date) err.date = "Pick a date.";
    else if (f.date < now) err.date = "That date has passed. Pick today or later.";
    else if (days && !days.includes(new Date(f.date + "T00:00").getDay())) err.date = `This is only on ${days.map((d) => DAY_NAMES[d]).join(" and ")}. Pick one of those days.`;
    setErrors(err);
    if (Object.values(err).some(Boolean)) return;
    const note = [extras && f.extra, f.note.trim()].filter(Boolean).join(". ");
    addReservation({ kind, event, name: f.name.trim(), phone: f.phone.trim(), date: f.date, time: f.time, guests: f.guests, note: note || undefined });
    setSent(true);
    onDone?.();
  }

  const label = kind === "event" ? `${f.guests} ${f.guests === 1 ? "place" : "places"}` : kind === "brunch" ? `Brunch for ${f.guests}` : `Table for ${f.guests}`;

  if (sent) {
    return (
      <div role="status" className={`fade-in self-start rounded-2xl p-7 ${dark ? "bg-bone text-char" : "bg-leaf text-bone"}`}>
        <p className={`font-display text-4xl font-black ${dark ? "text-leaf" : ""}`}>Request sent</p>
        <p className="mt-3 text-lg">
          {label}{event ? ` at ${event}` : ""} on {new Date(f.date + "T00:00").toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })} at {f.time}.
          We&apos;ll confirm on WhatsApp at {f.phone} within the hour.
        </p>
        <button onClick={() => { setSent(false); setF({ ...f, note: "" }); }} className={`mt-6 font-bold underline underline-offset-4 ${dark ? "text-ember" : "text-ochre"}`}>
          Make another booking
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className={`grid gap-4 rounded-2xl p-5 sm:grid-cols-2 sm:p-7 ${dark ? "bg-char/70 text-bone backdrop-blur" : "bg-white"}`}>
      <Field label="Name" error={errors.name} dark={dark}>
        <input className={field} value={f.name} onChange={(e) => set("name", e.target.value)} autoComplete="name" aria-invalid={!!errors.name} />
      </Field>
      <Field label="Phone or WhatsApp" error={errors.phone} dark={dark}>
        <input className={field} value={f.phone} onChange={(e) => set("phone", e.target.value)} type="tel" autoComplete="tel" placeholder="078..." aria-invalid={!!errors.phone} />
      </Field>
      {!fixedDate && (
        <Field label={days ? `Date (${days.map((d) => DAY_NAMES[d]).join(" or ")})` : "Date"} error={errors.date} dark={dark}>
          <input className={`${field} ${dark ? "[color-scheme:dark]" : ""}`} type="date" min={today} value={f.date} onChange={(e) => set("date", e.target.value)} aria-invalid={!!errors.date} />
        </Field>
      )}
      {times.length > 1 && (
        <Field label="Time" dark={dark} className={fixedDate ? "sm:col-span-2" : ""}>
          <select className={field} value={f.time} onChange={(e) => set("time", e.target.value)}>
            {times.map((t) => <option key={t}>{t}</option>)}
          </select>
        </Field>
      )}
      {extras && (
        <Field label="Package" dark={dark} className="sm:col-span-2">
          <select className={field} value={f.extra} onChange={(e) => set("extra", e.target.value)}>
            {extras.map((x) => <option key={x.value} value={x.value}>{x.label}</option>)}
          </select>
        </Field>
      )}
      <div className="sm:col-span-2">
        <span className="text-sm font-semibold">{kind === "event" ? "How many people?" : "Guests"}</span>
        <div className="mt-1.5 flex flex-wrap gap-2" role="radiogroup" aria-label="Guests">
          {guests.map((n) => (
            <button type="button" key={n} role="radio" aria-checked={f.guests === n} onClick={() => set("guests", n)}
              className={`size-11 rounded-full border-2 font-bold transition-colors ${f.guests === n ? "border-ember bg-ember text-white" : dark ? "border-bone/25 hover:border-bone/60" : "border-mist hover:border-leaf/40"}`}>
              {n}
            </button>
          ))}
        </div>
      </div>
      <Field label="Anything we should know?" className="sm:col-span-2" dark={dark}>
        <textarea className={`${field} min-h-20`} value={f.note} onChange={(e) => set("note", e.target.value)} placeholder={notePlaceholder} />
      </Field>
      <button className="rounded-full bg-ember px-6 py-3.5 font-bold text-white hover:bg-ember-deep sm:col-span-2">{submitLabel}</button>
    </form>
  );
}

function Field({ label, error, className = "", dark, children }: { label: string; error?: string; className?: string; dark: boolean; children: React.ReactNode }) {
  return (
    <label className={`block ${className}`}>
      <span className="text-sm font-semibold">{label}</span>
      {children}
      {error && <span className={`mt-1.5 block text-sm font-semibold ${dark ? "text-ochre" : "text-ember-deep"}`} role="alert">{error}</span>}
    </label>
  );
}
