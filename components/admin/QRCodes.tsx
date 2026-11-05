"use client";

import { useCallback, useRef } from "react";
import { PLACE } from "@/lib/data";
import { QR } from "@/components/QR";
import { Logo } from "@/components/Logo";
import { H1 } from "./util";

export function QRCodes() {
  const svgs = useRef(new Map<string, string>());
  const cards = [{ key: "general", title: "Menu", sub: "Takeaway and walk-ins", path: "/menu" },
    ...Array.from({ length: PLACE.tables }, (_, i) => ({ key: `t${i + 1}`, title: `Table ${i + 1}`, sub: "Scan to order", path: `/menu?table=${i + 1}` }))];

  return (
    <>
      <H1 aside={<button onClick={() => window.print()} className="no-print rounded-full bg-leaf px-5 py-2.5 font-bold text-bone">Print all</button>}>QR codes</H1>
      <p className="no-print mb-6 max-w-[60ch] text-ash">
        Each table gets its own code, so orders arrive with the table number already filled in. Print them, cut them out
        and put one on every table.
      </p>
      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4 print:grid-cols-3">
        {cards.map((c) => (
          <QRCard key={c.key} title={c.title} sub={c.sub} path={c.path} onSvg={(s) => svgs.current.set(c.key, s)} getSvg={() => svgs.current.get(c.key)} />
        ))}
      </ul>
    </>
  );
}

function QRCard({ title, sub, path, onSvg, getSvg }: { title: string; sub: string; path: string; onSvg: (s: string) => void; getSvg: () => string | undefined }) {
  const handle = useCallback((s: string) => onSvg(s), [onSvg]);
  function download() {
    const s = getSvg();
    if (!s) return;
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([s], { type: "image/svg+xml" }));
    a.download = `umuriro-${title.toLowerCase().replace(/\s+/g, "-")}.svg`;
    a.click();
    URL.revokeObjectURL(a.href);
  }
  return (
    <li className="break-inside-avoid overflow-hidden rounded-2xl bg-leaf text-bone">
      <div className="imigongo" aria-hidden="true" />
      <div className="p-4">
        <Logo light className="[&_span]:text-xl" />
        <QR path={path} onSvg={handle} className="mt-3 rounded-lg bg-white p-1.5 [&_svg]:block [&_svg]:size-full" />
        <p className="mt-3 font-display text-3xl font-black leading-none">{title}</p>
        <p className="text-sm text-bone/75">{sub}</p>
        <button onClick={download} className="no-print mt-3 text-sm font-semibold text-ochre underline underline-offset-4">Download SVG</button>
      </div>
    </li>
  );
}
