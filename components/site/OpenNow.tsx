"use client";

import { useMounted } from "@/components/order/ui";

// [open, close] in minutes after midnight, by weekday (0 = Sunday). Close past midnight is > 1440.
const OPEN: [number, number][] = [
  [600, 1320], [660, 1380], [660, 1380], [660, 1380], [660, 1380], [660, 1500], [600, 1500],
];
const hm = (m: number) => `${String(Math.floor(m / 60) % 24).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;

export function OpenNow() {
  const mounted = useMounted();
  if (!mounted) return <span className="inline-block h-8" aria-hidden="true" />;
  const now = new Date();
  const mins = now.getHours() * 60 + now.getMinutes();
  const day = now.getDay();
  const yesterday = OPEN[(day + 6) % 7];
  const today = OPEN[day];
  let open = false, label = "";
  if (yesterday[1] > 1440 && mins < yesterday[1] - 1440) { open = true; label = `Open now until ${hm(yesterday[1])}`; }
  else if (mins >= today[0] && mins < today[1]) { open = true; label = `Open now until ${hm(today[1])}`; }
  else if (mins < today[0]) label = `Closed. Opens today at ${hm(today[0])}`;
  else label = `Closed. Opens tomorrow at ${hm(OPEN[(day + 1) % 7][0])}`;
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-char/60 px-3 py-1.5 text-sm font-semibold backdrop-blur">
      <span className={`size-2 rounded-full ${open ? "bg-green-400" : "bg-ochre"}`} aria-hidden="true" />{label}
    </span>
  );
}
