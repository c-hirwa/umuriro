# Umuriro Grill House

Website, QR ordering menu and staff dashboard for a fictional grill restaurant in Kiyovu, Kigali.

**Stack:** Next.js 16 (App Router), TypeScript, Tailwind CSS v4, `qrcode`. Fonts are self-hosted with Fontsource (Big Shoulders Display and Instrument Sans).

## Pages

| Route | What it is |
|---|---|
| `/` | Restaurant website: story, signature dishes, brunch, what's on, reviews, table booking, hours, FAQ |
| `/menu` | The menu that opens from a QR code. `/menu?table=7` fills in the table. Guests order and track their order live. "Website" button goes back to the site |
| `/order` | Online ordering with a cart that persists across pages: search, quick add, dish options, pickup or delivery |
| `/order/checkout` | Delivery zones and fees, free delivery threshold, ASAP or scheduled time, MoMo / card / cash |
| `/order/track?id=` | Live status for an online order (received, on the grill, on its way, delivered) |
| `/brunch` | Weekend brunch menu, packages (bottomless, family board) and brunch booking (Sat and Sun only) |
| `/events` | Weekly and monthly events, a five-week calendar and RSVP / booking for each date |
| `/private-events` | Spaces, set menus, catering and an enquiry form |
| `/admin` | Staff dashboard (demo PIN **2580**): sales, live order board (tables, pickup, delivery), bookings filtered by table / brunch / event / private, sold-out switches, table QR codes |

## Run it

```bash
npm install
npm run dev     # http://localhost:3000
```

To see the live flow, open `/admin` in one tab and `/menu?table=4` in another. Place an order: it pops up on the board.
Move it to "On the grill" and the guest's screen updates.

## How the data works (no backend yet)

Orders, bookings and sold-out items are stored in the browser's localStorage (`lib/store.ts`) and synced across tabs.
That keeps the demo free to host, but it means the menu and dashboard only share data **in the same browser**.
The first visit seeds a believable day of orders and bookings. "Reset demo data" in the dashboard regenerates it.

To make it real, replace the functions in `lib/store.ts` with database calls (Supabase works well: an `orders` and a
`reservations` table plus a realtime subscription in place of the storage event). Components only use that file's exports.
The PIN screen is a demo gate only. A real deployment needs server-side auth.

## Customising for a client

- `lib/data.ts`: name, address, phone, number of tables, menu, prices, opening hours, delivery zones and fees, photos
- `lib/events.ts`: recurring events (weekday, or nth / last weekday of the month), prices and capacity
- `lib/cart.ts`: the two carts (table and online), kept in localStorage
- Photos are free images from [Unsplash](https://unsplash.com/license), loaded from their CDN at the right size by `photo()`.
  Swap the IDs for the client's own photos before launch.
