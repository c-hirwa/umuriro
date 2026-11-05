"use client";

/**
 * Shopping cart, kept in localStorage so it survives page changes and reloads.
 * Two separate carts: "table" for the QR menu at a table, "online" for pickup and delivery.
 */
import { useSyncExternalStore } from "react";
import { dishById } from "./data";

export type CartScope = "table" | "online";
export type CartLine = { key: string; dishId: string; qty: number; options?: string; note?: string };

const key = (scope: CartScope) => `umuriro:cart:${scope}`;
const EVT = "umuriro:cart";
const EMPTY: CartLine[] = [];
const cache: Partial<Record<CartScope, { raw: string | null; lines: CartLine[] }>> = {};

function read(scope: CartScope): CartLine[] {
  let raw: string | null = null;
  try { raw = localStorage.getItem(key(scope)); } catch {}
  const hit = cache[scope];
  if (hit && hit.raw === raw) return hit.lines;
  let lines = EMPTY;
  try {
    const parsed = raw ? (JSON.parse(raw) as CartLine[]) : EMPTY;
    // drop anything that is no longer on the menu
    lines = Array.isArray(parsed) ? parsed.filter((l) => dishById(l.dishId) && l.qty > 0) : EMPTY;
  } catch {}
  cache[scope] = { raw, lines };
  return lines;
}

function write(scope: CartScope, lines: CartLine[]) {
  try { localStorage.setItem(key(scope), JSON.stringify(lines)); } catch {}
  window.dispatchEvent(new Event(EVT));
}

function subscribe(cb: () => void) {
  const onStorage = (e: StorageEvent) => { if (e.key?.startsWith("umuriro:cart:") || e.key === MINE) cb(); };
  window.addEventListener("storage", onStorage);
  window.addEventListener(EVT, cb);
  return () => { window.removeEventListener("storage", onStorage); window.removeEventListener(EVT, cb); };
}

export const lineKey = (l: { dishId: string; options?: string; note?: string }) => `${l.dishId}|${l.options ?? ""}|${l.note ?? ""}`;

export function useCart(scope: CartScope) {
  const lines = useSyncExternalStore(subscribe, () => read(scope), () => EMPTY);
  const count = lines.reduce((s, l) => s + l.qty, 0);
  const subtotal = lines.reduce((s, l) => s + l.qty * (dishById(l.dishId)?.price ?? 0), 0);

  return {
    lines,
    count,
    subtotal,
    add(line: Omit<CartLine, "key">) {
      const k = lineKey(line);
      const cur = read(scope);
      const found = cur.find((l) => l.key === k);
      write(scope, found ? cur.map((l) => (l.key === k ? { ...l, qty: Math.min(20, l.qty + line.qty) } : l)) : [...cur, { ...line, key: k }]);
    },
    setQty(k: string, qty: number) {
      const cur = read(scope);
      write(scope, qty <= 0 ? cur.filter((l) => l.key !== k) : cur.map((l) => (l.key === k ? { ...l, qty: Math.min(20, qty) } : l)));
    },
    remove(k: string) {
      write(scope, read(scope).filter((l) => l.key !== k));
    },
    clear() {
      write(scope, []);
    },
  };
}

/** Order ids this browser placed, newest first, so guests can find their order again. */
const MINE = "umuriro:my-orders";
export function rememberOrder(id: number) {
  try {
    const cur = JSON.parse(localStorage.getItem(MINE) ?? "[]") as number[];
    localStorage.setItem(MINE, JSON.stringify([id, ...cur.filter((x) => x !== id)].slice(0, 10)));
  } catch {}
  window.dispatchEvent(new Event(EVT));
}
const readMine = () => { try { return localStorage.getItem(MINE) ?? "[]"; } catch { return "[]"; } };
export function useMyOrderIds(): number[] {
  const raw = useSyncExternalStore(subscribe, readMine, () => "[]");
  try { return JSON.parse(raw) as number[]; } catch { return []; }
}
