export function Faq({ items, dark = false }: { items: [string, string][]; dark?: boolean }) {
  return (
    <div className={`divide-y ${dark ? "divide-bone/15" : "divide-mist"}`}>
      {items.map(([q, a]) => (
        <details key={q} className="group py-4">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold [&::-webkit-details-marker]:hidden">
            {q}
            <span aria-hidden="true" className="grid size-7 shrink-0 place-items-center rounded-full border-2 border-current text-sm transition-transform group-open:rotate-45">+</span>
          </summary>
          <p className={`mt-2 max-w-prose ${dark ? "text-bone/75" : "text-ash"}`}>{a}</p>
        </details>
      ))}
    </div>
  );
}
