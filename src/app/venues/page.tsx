import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { getVenues } from "@/lib/api";
import { VenueCard } from "@/components/VenueCard";
import { arr, one, type SP } from "@/lib/params";
import type { FoodType, Venue, Zone } from "@/lib/types";

export const metadata: Metadata = { title: "Find Venues in Kolkata" };

const zones: Zone[] = ["South", "Central", "North"];
const caps = ["1-100", "100-500", "500-1000", "1000-5000"];
const foods: FoodType[] = ["Veg & Non-Veg", "Veg", "Non-Veg"];
const types: Venue["venueType"][] = ["Banquet", "Hotel", "Resort", "Garden", "Rajbari"];

function Group({ title, name, options, checked }: { title: string; name: string; options: string[]; checked: string[] }) {
  return (
    <fieldset className="mb-5">
      <legend className="mb-2 text-sm font-semibold">{title}</legend>
      {options.map((o) => (
        <label key={o} className="flex items-center gap-2 py-1 text-sm">
          <input type="checkbox" name={name} value={o} defaultChecked={checked.includes(o)} className="accent-[#b98425]" />
          {o}
        </label>
      ))}
    </fieldset>
  );
}

export default function VenuesPage({ searchParams }: { searchParams: Promise<SP> }) {
  return (
    <Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-16 text-ink/50">Loading venues…</div>}>
      <VenuesResults searchParams={searchParams} />
    </Suspense>
  );
}

async function VenuesResults({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const guests = Number(one(sp.guests)) || undefined;
  const maxPrice = Number(one(sp.maxPrice)) || undefined;
  const zone = arr(sp.zone) as Zone[];
  const food = arr(sp.food) as FoodType[];
  const capacity = arr(sp.cap);
  const type = arr(sp.type) as Venue["venueType"][];
  const parking = one(sp.parking) === "1";
  const q = one(sp.q);
  const date = one(sp.date);
  const event = one(sp.event);

  const results = await getVenues({ q, zone, food, capacity, venueType: type, parking, guests, maxPricePerPlate: maxPrice });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-4xl">Find Venues</h1>
      <p className="mt-1 text-sm text-ink/60">Filter by location, capacity, budget, food, parking and more.</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[260px_1fr]">
        <form className="card h-fit p-5 lg:sticky lg:top-24">
          <h2 className="mb-4 text-xl">Filters</h2>
          <input name="q" defaultValue={q} placeholder="Search venues…" className="input mb-5" />
          {date && <input type="hidden" name="date" value={date} />}
          {event && <input type="hidden" name="event" value={event} />}
          <Group title="Location" name="zone" options={zones} checked={zone} />
          <Group title="Capacity" name="cap" options={caps} checked={capacity} />
          <Group title="Food" name="food" options={foods} checked={food} />
          <Group title="Venue type" name="type" options={types} checked={type} />
          <label className="mb-5 flex items-center gap-2 text-sm font-semibold">
            <input type="checkbox" name="parking" value="1" defaultChecked={parking} className="accent-[#b98425]" /> Parking available
          </label>
          <div className="mb-5">
            <label className="label">Guests</label>
            <input name="guests" type="number" defaultValue={guests} className="input" placeholder="e.g. 300" />
          </div>
          <div className="mb-5">
            <label className="label">Max price / plate (₹)</label>
            <input name="maxPrice" type="number" defaultValue={maxPrice} className="input" placeholder="e.g. 2000" />
          </div>
          <button className="btn btn-gold w-full">Update Results</button>
          <Link href="/venues" className="mt-2 block text-center text-xs text-ink/60 hover:text-gold">Reset filters</Link>
        </form>

        <section>
          <p className="mb-4 text-sm text-ink/60">{results.length} venue{results.length !== 1 && "s"} found{date && ` · for ${date}`}</p>
          {results.length === 0 ? (
            <div className="card p-10 text-center text-ink/60">No venues match these filters. Try widening them.</div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {results.map((v) => <VenueCard key={v.slug} v={v} />)}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
