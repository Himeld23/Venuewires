"use client";

import Link from "next/link";
import { useState } from "react";
import { ENQUIRY_ENDPOINT } from "@/lib/api";

const steps = [
  "We verify date & venue availability",
  "Venue receives your requirement",
  "You get a direct call / WhatsApp",
  "Final price is confirmed before booking",
];

export function EnquiryForm({
  targetType, targetSlug, targetName, targetPrice, defaults,
}: {
  targetType: "venue" | "vendor"; targetSlug: string; targetName: string; targetPrice: string;
  defaults: { date?: string; guests?: string; event?: string };
}) {
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [ref, setRef] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sending");
    const data = Object.fromEntries(new FormData(e.currentTarget));
    try {
      const res = await fetch(ENQUIRY_ENDPOINT, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, [targetType === "venue" ? "venueSlug" : "vendorSlug"]: targetSlug }),
      });
      const json = await res.json();
      if (!json.ok) throw new Error();
      setRef(json.ref);
      setState("done");
    } catch {
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <div className="card mx-auto max-w-xl p-10 text-center">
        <div className="text-5xl">✅</div>
        <h2 className="mt-3 text-2xl">Enquiry sent</h2>
        <p className="mt-2 text-sm text-ink/70">Reference <b>{ref}</b>. {targetName} will reach you directly by call or WhatsApp. We confirm the final price before any booking.</p>
        <div className="mt-6 flex justify-center gap-2">
          <Link href="/venues" className="btn btn-gold">Keep exploring</Link>
          <Link href="/build-event" className="btn btn-soft">Plan the full event</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
      <form onSubmit={submit} className="card grid gap-4 p-6 sm:grid-cols-2">
        <h2 className="text-xl sm:col-span-2">Your event details</h2>
        <div><label className="label">Name</label><input name="name" required className="input" placeholder="Your name" /></div>
        <div><label className="label">Mobile</label><input name="mobile" required pattern="[0-9+ ]{10,15}" className="input" placeholder="+91 XXXXX XXXXX" /></div>
        <div><label className="label">Event</label>
          <select name="event" className="input" defaultValue={defaults.event ?? "Wedding"}>
            {["Wedding", "Birthday & Party", "Corporate Event", "Engagement", "Social Celebration", "Destination Event"].map((e) => <option key={e}>{e}</option>)}
          </select></div>
        <div><label className="label">Date</label><input name="date" type="date" required defaultValue={defaults.date} className="input" /></div>
        <div><label className="label">Guests</label><input name="guests" type="number" min={1} required defaultValue={defaults.guests} className="input" /></div>
        <div><label className="label">Budget</label>
          <select name="budget" className="input" defaultValue="₹5L – ₹7L">
            {["Under ₹2L", "₹2L – ₹5L", "₹5L – ₹7L", "₹7L – ₹10L", "₹10L+"].map((b) => <option key={b}>{b}</option>)}
          </select></div>
        <div className="sm:col-span-2"><label className="label">Message</label>
          <textarea name="message" rows={3} className="input" defaultValue="Need availability, menu and decoration options." /></div>
        {state === "error" && <p className="text-sm text-bad sm:col-span-2">Something went wrong — please try again.</p>}
        <button disabled={state === "sending"} className="btn btn-gold sm:col-span-2">{state === "sending" ? "Sending…" : "Submit Enquiry →"}</button>
      </form>

      <aside className="rounded-2xl bg-[#f3ecdd] p-6">
        <p className="text-xs text-ink/60">Selected</p>
        <h3 className="mt-1 text-2xl">{targetName}</h3>
        <p className="mt-1 font-semibold text-gold">{targetPrice}</p>
        <h4 className="mt-8 text-lg">What happens next</h4>
        <ol className="mt-3 space-y-3 text-sm text-ink/75">
          {steps.map((s, i) => (
            <li key={s} className="flex gap-3"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold text-xs text-white">{i + 1}</span>{s}</li>
          ))}
        </ol>
      </aside>
    </div>
  );
}
