"use client";

import Link from "next/link";
import { getAvailability } from "@/lib/api";
import { useSession } from "@/lib/auth";
import { useListings, type ListingStatus } from "@/lib/listings";
import { Panel, SideNav, Stat } from "./Dash";

const DEMO = "venue@venuewires.demo";
const demoLeads = ["Wedding • 300 guests", "Corporate • 180 guests", "Birthday • 120 guests", "Engagement • 250 guests"];
const colors = { available: "bg-ok", hold: "bg-gold", booked: "bg-bad", unavailable: "bg-gray-300" };
const badge: Record<ListingStatus, string> = {
  pending: "bg-[#fbf3e1] text-gold-dark", verified: "bg-[#e8f1ec] text-ok", rejected: "bg-[#fbeceb] text-bad",
};

export function VenueDashboard() {
  const session = useSession()!;
  const demo = session.email === DEMO;
  const mine = useListings().filter((l) => l.ownerEmail === session.email && l.kind === "venue");
  // Fixed month keeps the demo calendar stable between visits.
  const avail = getAvailability(demo ? "shagun-banquet" : mine[0]?.id ?? "new", 2026, 9);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-4xl">Venue Partner Dashboard</h1>
          <p className="mt-1 text-sm text-ink/60">One place to manage your venue business on Venue Wires. <span className="text-gold">{session.business}</span></p>
        </div>
        <Link href="/partner/list-property" className="btn btn-gold">+ Add another property</Link>
      </div>

      {mine.some((l) => l.status === "pending") && (
        <div className="mt-5 rounded-xl border border-gold bg-[#fbf3e1] p-4 text-sm">
          ⏳ <b>Your listing is pending verification.</b> Our team will verify price, contact and facilities, then publish it.
        </div>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Profile Views" value={demo ? "1,284" : 0} /><Stat label="Enquiries" value={demo ? 86 : 0} />
        <Stat label="Calls" value={demo ? 42 : 0} /><Stat label="Calendar" value={demo ? "92% updated" : "Not set up"} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[220px_1fr_340px]">
        <SideNav items={["Overview", "Venue Profile", "Pricing", "Availability", "Leads", "Call Analytics", "Photos", "Subscription"]} />
        <div className="space-y-6">
          <Panel title="Availability Calendar — October 2026">
            <div className="grid grid-cols-7 gap-2 sm:grid-cols-10">
              {Object.entries(avail).map(([d, s]) => (
                <div key={d} className={`flex aspect-square items-center justify-center rounded-full text-xs font-semibold text-white ${colors[s]}`}>{d}</div>
              ))}
            </div>
          </Panel>
          <Panel title="My listings">
            {demo && (
              <div className="flex items-center justify-between border-b border-line pb-3 text-sm">
                <div><b>Shagun Banquet</b><p className="text-xs text-ink/60">Tangra, Topsia · 100–300 guests</p></div>
                <span className="rounded-full bg-[#e8f1ec] px-2.5 py-0.5 text-xs font-semibold text-ok">verified</span>
              </div>
            )}
            {mine.map((l) => (
              <div key={l.id} className="flex items-center justify-between border-b border-line py-3 text-sm last:border-0">
                <div><b>{l.name}</b>
                  <p className="text-xs text-ink/60">{l.locality}, {l.zone} Kolkata · {l.capacityMin}–{l.capacityMax} guests · ₹{l.priceMin}–₹{l.priceMax}/plate · {l.photos} photo(s)</p></div>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${badge[l.status]}`}>{l.status}</span>
              </div>
            ))}
            {!demo && mine.length === 0 && <p className="text-sm text-ink/60">No venue listings yet.</p>}
          </Panel>
        </div>
        <Panel title="Recent Leads" tint>
          {demo ? (
            <ul className="space-y-4 text-sm">
              {demoLeads.map((l) => <li key={l} className="flex justify-between"><span className="text-ink/70">{l}</span><b className="text-gold">View →</b></li>)}
            </ul>
          ) : <p className="text-sm text-ink/60">Enquiries for your venue will appear here once it&apos;s live.</p>}
        </Panel>
      </div>
    </div>
  );
}
