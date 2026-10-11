"use client";

import Link from "next/link";
import { useState } from "react";
import { matchBudget, inrShort, type BudgetMatch } from "@/lib/api";
import type { FoodType, Zone } from "@/lib/types";

const budgets: [string, number, number][] = [
  ["₹2L – ₹3L", 200000, 300000], ["₹3L – ₹5L", 300000, 500000], ["₹5L – ₹7L", 500000, 700000],
  ["₹7L – ₹10L", 700000, 1000000], ["₹10L+", 1000000, 5000000],
];

export function BudgetMatchForm() {
  const [results, setResults] = useState<BudgetMatch[] | null>(null);
  const [guests, setGuests] = useState(300);
  const [date, setDate] = useState("2026-10-17");

  async function run(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const [, min, max] = budgets[Number(f.get("budget"))];
    setResults(await matchBudget({
      guests: Number(f.get("guests")), budgetMin: min, budgetMax: max,
      zone: f.get("zone") as Zone | "", food: f.get("food") as FoodType | "",
    }));
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
      <form onSubmit={run} className="card grid gap-4 p-6 h-fit">
        <h2 className="text-xl">Your event</h2>
        <div><label className="label">Event type</label>
          <select name="event" className="input">{["Wedding", "Engagement", "Birthday & Party", "Corporate Event"].map((e) => <option key={e}>{e}</option>)}</select></div>
        <div><label className="label">Guests</label>
          <input name="guests" type="number" min={10} value={guests} onChange={(e) => setGuests(Number(e.target.value))} className="input" /></div>
        <div><label className="label">Location</label>
          <select name="zone" className="input" defaultValue="South"><option value="">Any</option><option>South</option><option>Central</option><option>North</option></select></div>
        <div><label className="label">Total budget</label>
          <select name="budget" className="input" defaultValue="2">{budgets.map(([l], i) => <option key={l} value={i}>{l}</option>)}</select></div>
        <div><label className="label">Food</label>
          <select name="food" className="input" defaultValue="Veg & Non-Veg"><option value="">Any</option><option>Veg & Non-Veg</option><option>Veg</option><option>Non-Veg</option></select></div>
        <div><label className="label">Date</label>
          <input name="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} className="input" /></div>
        <button className="btn btn-gold">Find Matches →</button>
      </form>

      <div>
        <h2 className="mb-4 text-xl">Recommended venues</h2>
        {!results ? (
          <div className="card p-10 text-center text-ink/60">Fill in your event details and we&apos;ll rank venues by guest fit, location and budget.</div>
        ) : (
          <div className="space-y-4">
            {results.map((r) => (
              <div key={r.venue.slug} className="card grid gap-4 overflow-hidden sm:grid-cols-[200px_1fr]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={r.venue.image} alt={r.venue.name} className="h-full min-h-36 w-full object-cover" />
                <div className="flex flex-col gap-1 p-4">
                  <Link href={`/venues/${r.venue.slug}?date=${date}`} className="font-serif text-xl hover:text-gold">{r.venue.name}</Link>
                  <p className="text-sm font-bold text-ok">{r.score}% match</p>
                  <p className="text-sm font-semibold">{inrShort(r.estMin)} – {inrShort(r.estMax)} <span className="text-xs font-normal text-ink/50">for {guests} guests</span></p>
                  <p className="text-xs text-ink/60">{r.reasons.join(" • ") || "Partial fit"}</p>
                  <div className="mt-auto flex gap-2 pt-2">
                    <Link href={`/compare?v=${r.venue.slug}`} className="btn btn-soft">Compare</Link>
                    <Link href={`/enquiry?venue=${r.venue.slug}&date=${date}&guests=${guests}`} className="btn btn-gold">Enquire</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
