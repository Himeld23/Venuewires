"use client";

import Link from "next/link";
import type { Venue } from "@/lib/types";
import { priceRange } from "@/lib/api";
import { useCompare } from "@/lib/compare-store";

export function VerifiedBadge({ small }: { small?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full bg-[#e8f1ec] text-ok font-semibold ${small ? "px-2 py-0.5 text-[10px]" : "px-3 py-1 text-xs"}`}>
      ✓ Venue Wires Verified
    </span>
  );
}

export function VenueCard({ v }: { v: Venue }) {
  const { has, toggle, full } = useCompare();
  const selected = has(v.slug);
  return (
    <article className="card overflow-hidden flex flex-col">
      <Link href={`/venues/${v.slug}`} className="relative block aspect-[16/10] bg-line">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={v.image} alt={v.name} className="h-full w-full object-cover" loading="lazy" />
        {v.verified && <span className="absolute left-3 top-3"><VerifiedBadge small /></span>}
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <Link href={`/venues/${v.slug}`} className="font-serif text-lg leading-tight hover:text-gold">{v.name}</Link>
          <span className="text-xs text-gold whitespace-nowrap">★ {v.rating} <span className="text-ink/50">({v.reviews})</span></span>
        </div>
        <p className="text-xs text-ink/60">{v.location.locality}, {v.location.zone} {v.location.city}</p>
        <p className="text-sm font-semibold">{priceRange(v)}</p>
        <p className="text-xs text-ink/60">Capacity {v.capacityMin} – {v.capacityMax} · {v.parking} cars · {v.food}</p>
        <div className="mt-auto flex gap-2 pt-3">
          <Link href={`/venues/${v.slug}`} className="btn btn-soft flex-1">View Venue</Link>
          <button
            onClick={() => toggle(v.slug)}
            disabled={!selected && full}
            className={`btn flex-1 ${selected ? "btn-gold" : "btn-outline"} disabled:opacity-40`}
          >
            {selected ? "✓ Added" : "Compare"}
          </button>
        </div>
      </div>
    </article>
  );
}
