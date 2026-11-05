"use client";
import { useEffect, useState } from "react";

export function useTick(ms = 30_000) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), ms); return () => clearInterval(t); }, [ms]);
  return now;
}

export function ago(ts: number, now: number) {
  const m = Math.max(0, Math.round((now - ts) / 60_000));
  if (m < 1) return "just now";
  if (m < 60) return `${m} min ago`;
  const h = Math.floor(m / 60);
  return `${h} h ${m % 60} min ago`;
}

export const clock = (ts: number) => new Date(ts).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

export const isToday = (ts: number) => new Date(ts).toDateString() === new Date().toDateString();

export function H1({ children, aside }: { children: React.ReactNode; aside?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <h1 className="font-display text-4xl font-black leading-none text-leaf sm:text-5xl">{children}</h1>
      {aside}
    </div>
  );
}

/** "250788..." for wa.me from a local 07.. number */
export const waNumber = (phone: string) => {
  const d = phone.replace(/\D/g, "");
  return d.startsWith("250") ? d : d.startsWith("0") ? "250" + d.slice(1) : "250" + d;
};
