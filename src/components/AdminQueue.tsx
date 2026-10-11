"use client";

import { useState } from "react";
import { setListingStatus, useListings } from "@/lib/listings";

const initial = [
  { name: "Shagun Banquet", check: "Price • Contact" },
  { name: "Ojas Banquet", check: "Calendar" },
  { name: "Royal Feast", check: "Menu" },
  { name: "Heera Garden", check: "Photos" },
];

export function AdminQueue() {
  const [done, setDone] = useState<string[]>([]);
  const submitted = useListings().filter((l) => l.status === "pending");

  return (
    <ul className="space-y-4">
      {submitted.map((l) => (
        <li key={l.id} className="rounded-xl border border-gold bg-[#fbf3e1] p-3 text-sm">
          <div className="flex items-center justify-between gap-2">
            <div><b>{l.name}</b> <span className="rounded-full bg-gold px-2 text-[10px] text-white">NEW</span>
              <p className="text-xs text-ink/60">{l.kind === "venue" ? "Venue" : "Vendor"} · {l.locality}, {l.zone} · {l.contactPerson} · {l.phone}</p></div>
            <div className="flex gap-2">
              <button onClick={() => setListingStatus(l.id, "verified")} className="btn btn-gold !py-1.5">Approve</button>
              <button onClick={() => setListingStatus(l.id, "rejected")} className="btn btn-soft !py-1.5">Reject</button>
            </div>
          </div>
        </li>
      ))}
      {initial.map((q) => (
        <li key={q.name} className="flex items-center justify-between gap-3 text-sm">
          <b className="w-36">{q.name}</b>
          <span className="flex-1 text-xs text-ink/60">{q.check}</span>
          {done.includes(q.name)
            ? <span className="text-xs font-bold text-ok">✓ Verified</span>
            : <button onClick={() => setDone([...done, q.name])} className="btn btn-soft !py-1.5">Review</button>}
        </li>
      ))}
    </ul>
  );
}
