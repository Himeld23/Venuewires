"use client";

import Link from "next/link";
import { useState } from "react";
import { inr, inrShort } from "@/lib/api";
import type { ServiceCategory, Vendor, Venue } from "@/lib/types";

const steps: { key: "venue" | ServiceCategory; label: string }[] = [
  { key: "venue", label: "Venue" }, { key: "catering", label: "Catering" }, { key: "decoration", label: "Decoration" },
  { key: "photography", label: "Photography" }, { key: "makeup", label: "Makeup" }, { key: "transport", label: "Transport" },
];

export function BuildEvent({ venues, vendors, initialVenue }: { venues: Venue[]; vendors: Vendor[]; initialVenue?: string }) {
  const [step, setStep] = useState(0);
  const [guests, setGuests] = useState(300);
  const [eventType, setEventType] = useState("Wedding");
  const [venueSlug, setVenueSlug] = useState(initialVenue ?? "");
  // chosen[category] = "vendorSlug::packageName"
  const [chosen, setChosen] = useState<Record<string, string>>({});

  const venue = venues.find((v) => v.slug === venueSlug);
  const lines: { label: string; amount: number }[] = [];
  if (venue) lines.push({ label: "Venue (hall + base)", amount: Math.round(((venue.rentalPerDay ?? 150000)) / 1000) * 1000 });

  for (const s of steps.slice(1)) {
    const sel = chosen[s.key];
    if (!sel) continue;
    const [slug, pkg] = sel.split("::");
    const p = vendors.find((v) => v.slug === slug)?.packages.find((x) => x.name === pkg);
    if (!p) continue;
    lines.push({ label: s.label, amount: p.unit === "plate" ? p.price * guests : p.price });
  }
  const total = lines.reduce((a, l) => a + l.amount, 0);
  const cur = steps[step];

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-2">
        {steps.map((s, i) => (
          <button key={s.key} onClick={() => setStep(i)} className={`btn ${i === step ? "btn-gold" : "btn-soft"}`}>{i + 1}. {s.label}</button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="card p-6">
          <div className="mb-6 grid gap-4 sm:grid-cols-2">
            <div><label className="label">Event type</label>
              <select className="input" value={eventType} onChange={(e) => setEventType(e.target.value)}>
                {["Wedding", "Engagement", "Birthday & Party", "Corporate Event"].map((e) => <option key={e}>{e}</option>)}</select></div>
            <div><label className="label">Guests</label>
              <input type="number" min={10} className="input" value={guests} onChange={(e) => setGuests(Number(e.target.value) || 0)} /></div>
          </div>

          <h2 className="mb-3 text-xl">{cur.label}</h2>
          {cur.key === "venue" ? (
            <div className="grid gap-2">
              {venues.map((v) => (
                <label key={v.slug} className={`flex cursor-pointer items-center justify-between rounded-xl border p-3 text-sm ${venueSlug === v.slug ? "border-gold bg-[#fbf3e1]" : "border-line"}`}>
                  <span><input type="radio" className="mr-2 accent-[#b98425]" checked={venueSlug === v.slug} onChange={() => setVenueSlug(v.slug)} />
                    <b>{v.name}</b> <span className="text-ink/50">· {v.location.locality} · {v.capacityMin}–{v.capacityMax}</span></span>
                  <span className="text-xs">{inr(v.pricePerPlateMin)}/plate</span>
                </label>
              ))}
            </div>
          ) : (
            <div className="grid gap-2">
              <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-line p-3 text-sm">
                <input type="radio" className="accent-[#b98425]" checked={!chosen[cur.key]} onChange={() => setChosen({ ...chosen, [cur.key]: "" })} /> Skip this service
              </label>
              {vendors.filter((v) => v.category === cur.key).flatMap((v) =>
                v.packages.map((p) => {
                  const val = `${v.slug}::${p.name}`;
                  const amt = p.unit === "plate" ? p.price * guests : p.price;
                  return (
                    <label key={val} className={`flex cursor-pointer items-center justify-between rounded-xl border p-3 text-sm ${chosen[cur.key] === val ? "border-gold bg-[#fbf3e1]" : "border-line"}`}>
                      <span><input type="radio" className="mr-2 accent-[#b98425]" checked={chosen[cur.key] === val} onChange={() => setChosen({ ...chosen, [cur.key]: val })} />
                        <b>{v.name}</b> — {p.name} <span className="text-ink/50">· {p.summary}</span></span>
                      <span className="text-xs font-semibold">{inr(p.price)}/{p.unit} {p.unit === "plate" && <>= {inrShort(amt)}</>}</span>
                    </label>
                  );
                }),
              )}
            </div>
          )}

          <div className="mt-6 flex justify-between">
            <button disabled={step === 0} onClick={() => setStep(step - 1)} className="btn btn-soft disabled:opacity-40">← Back</button>
            {step < steps.length - 1
              ? <button onClick={() => setStep(step + 1)} className="btn btn-gold">Continue →</button>
              : <Link href={`/enquiry?${venue ? `venue=${venue.slug}&` : ""}guests=${guests}&event=${encodeURIComponent(eventType)}`} className="btn btn-gold">Send plan as enquiry →</Link>}
          </div>
        </div>

        <aside className="h-fit rounded-2xl bg-[#f3ecdd] p-6">
          <p className="text-sm text-ink/60">Estimated Event Budget</p>
          <p className="mt-1 font-serif text-3xl">{total ? `${inrShort(Math.round(total * 0.95))} – ${inrShort(Math.round(total * 1.1))}` : "—"}</p>
          <div className="mt-5 space-y-3 text-sm">
            {lines.length === 0 && <p className="text-ink/60">Pick a venue and services to see your estimate.</p>}
            {lines.map((l) => (
              <div key={l.label} className="flex justify-between border-b border-line/70 pb-2"><span className="text-ink/70">{l.label}</span><b>{inrShort(l.amount)}</b></div>
            ))}
          </div>
          <p className="mt-4 text-xs text-ink/50">Indicative range (−5% / +10%). Final prices are confirmed by each partner before booking.</p>
        </aside>
      </div>
    </div>
  );
}
