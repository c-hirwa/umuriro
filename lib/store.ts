"use client";

/**
 * Demo data layer. Everything lives in localStorage so the site works with no backend:
 * an order placed on /menu shows up live on /admin (in the same browser, across tabs).
 * To go live, replace the functions in this file with calls to a real database
 * (for example Supabase) — the components only use the exports below.
 */
import { useSyncExternalStore } from "react";
import { ALL_DISHES, dishById } from "./data";

export type OrderStatus = "new" | "preparing" | "ready" | "done" | "cancelled";
export type OrderLine = { dishId: string; name: string; price: number; qty: number; options?: string; note?: string };
export type Order = {
  id: number;
  createdAt: number;
  type: "dine-in" | "takeaway";
  table?: string;
  name?: string;
  phone?: string;
  lines: OrderLine[];
  total: number;
  status: OrderStatus;
};
export type ReservationStatus = "pending" | "confirmed" | "declined";
export type Reservation = {
  id: number;
  createdAt: number;
  name: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  note?: string;
  status: ReservationStatus;
};
export type DB = { orders: Order[]; reservations: Reservation[]; soldOut: string[] };

const KEY = "umuriro:demo:v1";
const EVT = "umuriro:change";
let cache: DB | null = null;
let cacheRaw: string | null = null;

function read(): DB {
  const raw = localStorage.getItem(KEY);
  if (raw && raw === cacheRaw && cache) return cache;
  if (!raw) {
    const seeded = seed();
    write(seeded, false); // first visit: seed quietly (we're inside a render)
    return seeded;
  }
  try {
    cache = JSON.parse(raw) as DB;
    cacheRaw = raw;
  } catch {
    write(seed(), false);
  }
  return cache!;
}

function write(db: DB, notify = true) {
  const raw = JSON.stringify(db);
  localStorage.setItem(KEY, raw);
  cache = db;
  cacheRaw = raw;
  if (notify) window.dispatchEvent(new Event(EVT));
}

function update(fn: (db: DB) => DB) {
  write(fn(read()));
}

function subscribe(cb: () => void) {
  const onStorage = (e: StorageEvent) => { if (e.key === KEY) cb(); };
  window.addEventListener("storage", onStorage); // other tabs
  window.addEventListener(EVT, cb); // this tab
  return () => { window.removeEventListener("storage", onStorage); window.removeEventListener(EVT, cb); };
}

/** Returns null during prerender and the first client render. */
export function useDB(): DB | null {
  return useSyncExternalStore(subscribe, read, () => null);
}

const nextId = (xs: { id: number }[], start: number) => xs.reduce((m, x) => Math.max(m, x.id), start) + 1;

export function placeOrder(o: Omit<Order, "id" | "createdAt" | "status" | "total">): Order {
  let created!: Order;
  update((db) => {
    const total = o.lines.reduce((s, l) => s + l.price * l.qty, 0);
    created = { ...o, id: nextId(db.orders, 1040), createdAt: Date.now(), status: "new", total };
    return { ...db, orders: [created, ...db.orders] };
  });
  return created;
}

export function setOrderStatus(id: number, status: OrderStatus) {
  update((db) => ({ ...db, orders: db.orders.map((o) => (o.id === id ? { ...o, status } : o)) }));
}

export function addReservation(r: Omit<Reservation, "id" | "createdAt" | "status">) {
  update((db) => ({
    ...db,
    reservations: [{ ...r, id: nextId(db.reservations, 200), createdAt: Date.now(), status: "pending" }, ...db.reservations],
  }));
}

export function setReservationStatus(id: number, status: ReservationStatus) {
  update((db) => ({ ...db, reservations: db.reservations.map((r) => (r.id === id ? { ...r, status } : r)) }));
}

export function toggleSoldOut(dishId: string) {
  update((db) => ({
    ...db,
    soldOut: db.soldOut.includes(dishId) ? db.soldOut.filter((x) => x !== dishId) : [...db.soldOut, dishId],
  }));
}

export function resetDemo() {
  write(seed());
}

// ---------- demo seed: a believable day of orders up to "now" ----------
function seed(): DB {
  const now = new Date();
  const at = (h: number, m: number) => { const d = new Date(now); d.setHours(h, m, 0, 0); return d.getTime(); };
  const names = ["Aline", "Eric", "Diane", "Patrick", "Grace", "Jean", "Clarisse", "Olivier", "Sandrine", "Kevin"];
  const pick = <T,>(xs: T[], i: number) => xs[i % xs.length];
  const baskets: [string, number, string?][][] = [
    [["goat", 2, "Chips, Hot with pili-pili"], ["passion", 2]],
    [["tilapia", 1, "Ugali, Mild"], ["kachumbari", 1], ["beer", 2]],
    [["platter", 1, "Hot with pili-pili"], ["hibiscus", 2]],
    [["isombe", 2], ["mango", 2]],
    [["beef", 3, "Fried plantain, Mild"], ["soda", 3]],
    [["rotisserie", 1, "Chips"], ["coffee", 1]],
    [["pilau", 1], ["passion", 1]],
    [["sirloin", 1, "Medium, Chips"], ["beer", 1]],
    [["goat", 1, "Ugali, Hot with pili-pili"], ["sambaza", 1], ["beer", 2]],
    [["agatogo", 2], ["hibiscus", 2]],
    [["chicken-skewers", 2, "Chips, Mild"], ["mango", 1]],
    [["fillet", 1, "Fried plantain"], ["passion", 1]],
    [["goat", 2, "Chips, Hot with pili-pili"], ["beef", 1, "Ugali, Mild"], ["beer", 3]],
    [["tilapia", 2, "Fried plantain, Hot with pili-pili"], ["chips", 1], ["soda", 2]],
  ];
  // spread orders from 11:30 to just before now (or across lunch+dinner if it's late)
  const start = at(11, 30);
  const end = Math.max(start + 3 * 3600_000, now.getTime() - 4 * 60_000);
  const orders: Order[] = baskets.map((b, i): Order => {
    const t = start + ((end - start) * i) / (baskets.length - 1);
    const lines = b.map(([id, qty, options]) => {
      const d = dishById(id)!;
      return { dishId: id, name: d.name, price: d.price, qty, options };
    });
    const fromEnd = baskets.length - 1 - i;
    const status: OrderStatus = fromEnd === 0 ? "new" : fromEnd === 1 ? "new" : fromEnd === 2 ? "preparing" : fromEnd === 3 ? "ready" : i === 4 ? "cancelled" : "done";
    const takeaway = i % 4 === 2;
    return {
      id: 1040 - baskets.length + i + 1,
      createdAt: Math.min(t, now.getTime() - (fromEnd + 1) * 60_000),
      type: takeaway ? "takeaway" : "dine-in",
      table: takeaway ? undefined : String(((i * 5) % 12) + 1),
      name: takeaway ? pick(names, i) : undefined,
      phone: takeaway ? "0788 000 000" : undefined,
      lines,
      total: lines.reduce((s, l) => s + l.price * l.qty, 0),
      status,
    };
  }).reverse();

  const day = (offset: number) => {
    const d = new Date(now); d.setDate(d.getDate() + offset);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  };
  const reservations: Reservation[] = [
    { id: 205, createdAt: now.getTime() - 20 * 60_000, name: "Clarisse M.", phone: "0788 000 001", date: day(0), time: "19:30", guests: 4, note: "Birthday, can we get a quiet corner?", status: "pending" },
    { id: 204, createdAt: now.getTime() - 3 * 3600_000, name: "Olivier N.", phone: "0788 000 002", date: day(1), time: "13:00", guests: 8, note: "Team lunch", status: "pending" },
    { id: 203, createdAt: now.getTime() - 26 * 3600_000, name: "Grace U.", phone: "0788 000 003", date: day(0), time: "20:00", guests: 2, status: "confirmed" },
    { id: 202, createdAt: now.getTime() - 30 * 3600_000, name: "Kevin I.", phone: "0788 000 004", date: day(2), time: "18:30", guests: 6, status: "confirmed" },
    { id: 201, createdAt: now.getTime() - 50 * 3600_000, name: "Sandrine K.", phone: "0788 000 005", date: day(0), time: "12:30", guests: 12, note: "Can you do a set menu?", status: "declined" },
  ];
  return { orders, reservations, soldOut: ["sambaza"] };
}

export const DISH_COUNT = ALL_DISHES.length;
