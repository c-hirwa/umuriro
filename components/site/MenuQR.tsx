"use client";

import { QR } from "@/components/QR";

/** A table card like the ones on the restaurant's tables. */
export function MenuQR() {
  return (
    <div className="mx-auto w-64 rotate-[-3deg] rounded-2xl bg-leaf p-5 text-bone shadow-2xl md:mx-0">
      <div className="imigongo -mx-5 -mt-5 mb-5 rounded-t-2xl" aria-hidden="true" />
      <QR path="/menu?table=7" className="rounded-xl bg-white p-2 [&_svg]:block [&_svg]:size-full" />
      <p className="mt-4 font-display text-3xl font-black leading-none">Table 7</p>
      <p className="mt-1 text-sm text-bone/75">Scan to see the menu and order</p>
    </div>
  );
}
