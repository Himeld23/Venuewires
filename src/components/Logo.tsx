import Link from "next/link";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="flex shrink-0 items-center gap-2.5 whitespace-nowrap" aria-label="Venue Wires home">
      <svg width="34" height="28" viewBox="0 0 34 28" aria-hidden>
        <path d="M2 24 L5 6 L13 14 L17 2 L21 14 L29 6 L32 24 Z" fill="#f0a01c" />
        <path d="M2 24 L5 6 L13 14 L10 24 Z" fill="#d9381e" />
      </svg>
      <span className="font-serif text-2xl text-ink leading-none border-r border-ink/40 pr-2.5">VW</span>
      <span className="leading-tight">
        <span className={`block font-serif text-sm tracking-[0.18em] ${light ? "text-white" : "text-ink"}`}>VENUE WIRES</span>
        <span className={`block text-[8px] tracking-[0.3em] ${light ? "text-white/70" : "text-ink/60"}`}>MAKE IT MEMORABLE</span>
      </span>
    </Link>
  );
}
