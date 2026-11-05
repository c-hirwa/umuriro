// What happens at Umuriro each week and each month. Fictional; change freely for a real client.
import { PHOTOS } from "./data";

export type EventDef = {
  id: string;
  title: string;
  kicker: string;
  desc: string;
  /** 0 = Sunday ... 6 = Saturday */
  days: number[];
  /** only on the nth such weekday of the month (1-4) or the last one (-1) */
  nth?: number;
  start: string;
  end: string;
  price: string;
  /** seats are limited and must be booked */
  ticketed?: boolean;
  capacity?: number;
  img: string;
  highlights: string[];
};

export const EVENTS: EventDef[] = [
  {
    id: "fire-sessions", title: "Friday Fire Sessions", kicker: "Live music, every Friday",
    desc: "A live band on the terrace from 19:30. Afrobeat, rumba and the odd Rwandan classic. The grill runs till midnight.",
    days: [5], start: "19:00", end: "00:00", price: "Free entry", img: PHOTOS.crowd,
    highlights: ["Live band from 19:30", "Happy hour cocktails 19:00–20:00", "Kitchen open till midnight"],
  },
  {
    id: "brunch", title: "Weekend Brunch", kicker: "Saturday and Sunday mornings",
    desc: "The fire goes on early. Rolex, shakshuka, banana pancakes and brochettes for breakfast, with a DJ playing soft and slow.",
    days: [6, 0], start: "10:00", end: "14:00", price: "Bottomless option 15,000 RWF", img: PHOTOS.room,
    highlights: ["Bottomless juice, coffee and mimosas, 2 hours", "Kids under 6 eat free", "Garden tables for families"],
  },
  {
    id: "nyama-night", title: "Nyama Night", kicker: "All-you-can-eat, every Wednesday",
    desc: "The grill team keeps the brochettes coming until you wave the white napkin. Goat, beef, chicken and sausage with all the sides.",
    days: [3], start: "18:30", end: "22:30", price: "20,000 RWF per person", ticketed: true, capacity: 60, img: PHOTOS.grill,
    highlights: ["Unlimited brochettes and sides", "One drink included", "Book ahead, it fills up"],
  },
  {
    id: "trivia", title: "Tuesday Trivia", kicker: "Pub quiz, every Tuesday",
    desc: "Six rounds, teams of up to six, and a bar tab for the winners. Questions about Rwanda, music, sport and the deeply random.",
    days: [2], start: "19:30", end: "22:00", price: "Free to play", img: PHOTOS.room,
    highlights: ["Win a 50,000 RWF bar tab", "2-for-1 brochettes during the quiz", "Teams of up to 6"],
  },
  {
    id: "kivu-feast", title: "Kivu Fish Feast", kicker: "First Saturday of the month",
    desc: "A long-table dinner of the best of Lake Kivu: sambaza, whole tilapia, grilled fillets and a fish stew, shared family style.",
    days: [6], nth: 1, start: "19:00", end: "22:30", price: "28,000 RWF per person", ticketed: true, capacity: 30, img: PHOTOS.coals,
    highlights: ["Five courses, shared", "Welcome cocktail", "One seating, 30 seats"],
  },
  {
    id: "masterclass", title: "Grill Masterclass", kicker: "Last Sunday of the month",
    desc: "Spend an afternoon at the fire with our head griller. Marinades, charcoal, timing, and how to never dry out a brochette again.",
    days: [0], nth: -1, start: "15:00", end: "18:00", price: "35,000 RWF, lunch included", ticketed: true, capacity: 12, img: PHOTOS.chef,
    highlights: ["Hands-on at the grill", "Take home our marinade recipes", "12 places only"],
  },
];

export type Occurrence = { event: EventDef; date: string; d: Date };

const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

function matches(e: EventDef, d: Date) {
  if (!e.days.includes(d.getDay())) return false;
  if (!e.nth) return true;
  if (e.nth === -1) { const next = new Date(d); next.setDate(d.getDate() + 7); return next.getMonth() !== d.getMonth(); }
  return Math.ceil(d.getDate() / 7) === e.nth;
}

/** Every event happening in the next `days` days, soonest first. */
export function upcoming(from: Date, days = 35, only?: string): Occurrence[] {
  const out: Occurrence[] = [];
  const start = new Date(from); start.setHours(0, 0, 0, 0);
  for (let i = 0; i < days; i++) {
    const d = new Date(start); d.setDate(start.getDate() + i);
    for (const e of EVENTS) {
      if (only && e.id !== only) continue;
      if (!matches(e, d)) continue;
      // skip today's if it has already finished
      if (i === 0) { const [h, m] = e.end.split(":").map(Number); const endAt = new Date(d); endAt.setHours(h || 24, m); if (endAt < from) continue; }
      out.push({ event: e, date: iso(d), d });
    }
  }
  return out;
}

export const eventById = (id: string) => EVENTS.find((e) => e.id === id);

export const prettyDate = (d: Date) => d.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });
