"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { MAX_COMPARE, useCompare } from "@/lib/compare-store";
import { fmtDate, inr } from "@/lib/api";
import type { Venue } from "@/lib/types";

const yn = (b: boolean) => (b ? "Available" : "Not available");

export function CompareView({ all, urlSlugs }: { all: Venue[]; urlSlugs: string[] }) {
  const store = useCompare();
  const router = useRouter();
  const fromUrl = urlSlugs.length > 0;
  const slugs = (fromUrl ? urlSlugs : store.slugs).slice(0, MAX_COMPARE);
  const chosen = slugs.map((s) => all.find((v) => v.slug === s)).filter((v): v is Venue => !!v);
  const rest = all.filter((v) => !slugs.includes(v.slug));

  const setSlugs = (next: string[]) => {
    if (fromUrl) router.replace(`/compare?${next.map((s) => `v=${s}`).join("&")}`);
    else { store.clear(); next.forEach((s) => store.toggle(s)); }
  };

  if (chosen.length === 0) {
    return (
      <div className="card p-10 text-center">
        <p className="text-ink/70">No venues selected yet. Use “Compare” on any venue card to build a shortlist (2–4 venues).</p>
        <Link href="/venues" className="btn btn-gold mt-5">Browse venues</Link>
      </div>
    );
  }

  const minPrice = Math.min(...chosen.map((v) => v.pricePerPlateMin));
  const maxCap = Math.max(...chosen.map((v) => v.capacityMax));
  const maxPark = Math.max(...chosen.map((v) => v.parking));
  const best = "font-semibold text-ok";

  const rows: { label: string; cell: (v: Venue) => { text: string; best?: boolean } }[] = [
    { label: "Location", cell: (v) => ({ text: `${v.location.locality}, ${v.location.zone} Kolkata` }) },
    { label: "Price / plate", cell: (v) => ({ text: `${inr(v.pricePerPlateMin)} – ${inr(v.pricePerPlateMax)}`, best: v.pricePerPlateMin === minPrice }) },
    { label: "Capacity", cell: (v) => ({ text: `${v.capacityMin} – ${v.capacityMax}`, best: v.capacityMax === maxCap }) },
    { label: "Parking", cell: (v) => ({ text: `${v.parking} cars`, best: v.parking === maxPark }) },
    { label: "Food preference", cell: (v) => ({ text: v.food }) },
    { label: "Decoration", cell: (v) => ({ text: v.decoration }) },
    { label: "Alcohol", cell: (v) => ({ text: yn(v.alcohol) }) },
    { label: "Rooms", cell: (v) => ({ text: yn(v.rooms) }) },
    { label: "AC / Wi-Fi", cell: (v) => ({ text: `${v.ac ? "AC" : "No AC"} · ${v.wifi ? "Wi-Fi" : "No Wi-Fi"}` }) },
    { label: "Timing", cell: (v) => ({ text: v.timing }) },
    { label: "Rating", cell: (v) => ({ text: `★ ${v.rating} (${v.reviews} reviews)` }) },
    { label: "Verification", cell: (v) => ({ text: v.verified ? `✓ Verified ${fmtDate(v.priceVerifiedOn)}` : "Pending", best: v.verified }) },
  ];

  return (
    <>
      <div className="overflow-x-auto">
        <div className="grid min-w-[640px] gap-4" style={{ gridTemplateColumns: `160px repeat(${chosen.length}, minmax(0, 1fr))` }}>
          <div />
          {chosen.map((v) => (
            <div key={v.slug} className="card overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={v.image} alt={v.name} className="aspect-[16/10] w-full object-cover" />
              <div className="p-4">
                <Link href={`/venues/${v.slug}`} className="font-serif text-lg hover:text-gold">{v.name}</Link>
                <p className="text-xs text-gold">★ {v.rating}</p>
                <div className="mt-3 flex gap-2">
                  <Link href={`/enquiry?venue=${v.slug}`} className="btn btn-gold !px-3 !py-1.5 flex-1">Enquire</Link>
                  <button onClick={() => setSlugs(slugs.filter((s) => s !== v.slug))} className="btn btn-soft !px-3 !py-1.5">Remove</button>
                </div>
              </div>
            </div>
          ))}

          {rows.map((r) => (
            <div key={r.label} className="contents">
              <div className="border-b border-line py-3 text-sm font-semibold">{r.label}</div>
              {chosen.map((v) => {
                const c = r.cell(v);
                return <div key={v.slug} className={`border-b border-line py-3 text-sm ${c.best && chosen.length > 1 ? best : ""}`}>{c.text}</div>;
              })}
            </div>
          ))}
        </div>
      </div>

      <p className="mt-3 text-xs text-ink/50">Green marks the strongest value in each row.</p>

      {chosen.length < MAX_COMPARE && rest.length > 0 && (
        <div className="card mt-8 flex flex-wrap items-center gap-3 p-4">
          <span className="text-sm font-semibold">Add another venue</span>
          <select className="input max-w-xs" defaultValue="" onChange={(e) => e.target.value && setSlugs([...slugs, e.target.value])}>
            <option value="">Select venue…</option>
            {rest.map((v) => <option key={v.slug} value={v.slug}>{v.name}</option>)}
          </select>
        </div>
      )}
      {chosen.length < 2 && <p className="mt-4 text-sm text-gold">Add at least one more venue to compare side by side.</p>}
    </>
  );
}
