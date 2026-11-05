export function Logo({ className = "", light = false }: { className?: string; light?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg viewBox="0 0 32 32" className="size-7" aria-hidden="true">
        <path d="M16 3c3 5 9 8 9 15a9 9 0 01-18 0c0-4 2-6 4-8 0 3 1 5 3 5-1-5 0-9 2-12z" fill="#f05a1a" />
        <path d="M16 15c2 3 4 4 4 7a4 4 0 01-8 0c0-2 1-3 2-4 0 1 1 2 2 2-1-2 0-4 0-5z" fill="#e0a63a" />
      </svg>
      <span className={`font-display text-2xl font-black leading-none tracking-wide ${light ? "text-bone" : "text-leaf"}`}>Umuriro</span>
    </span>
  );
}
