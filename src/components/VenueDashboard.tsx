"use client";

import Link from "next/link";
import { useState } from "react";
import { getAvailability, inr } from "@/lib/api";
import { useSession } from "@/lib/auth";
import { useListings, type Listing, type ListingStatus } from "@/lib/listings";
import { venues } from "@/lib/data/venues";
import { callsMonth, callsWeek, demoPhotos, peakHours, venueDemoLeads, venuePlans } from "@/lib/data/venue-demo";
import type { Lead, LeadStatus } from "@/lib/data/vendor-demo";
import type { AvailabilityStatus } from "@/lib/types";
import { STATUSES, statusColor } from "./VendorDashboard";
import { Panel } from "./Dash";

const DEMO = "venue@venuewires.demo";
type Section = "overview" | "profile" | "pricing" | "availability" | "leads" | "analytics" | "photos" | "subscription";
const NAV: [Section, string][] = [
  ["overview", "Overview"], ["profile", "Venue Profile"], ["pricing", "Pricing"], ["availability", "Availability"],
  ["leads", "Leads"], ["analytics", "Call Analytics"], ["photos", "Photos"], ["subscription", "Subscription"],
];
const badge: Record<ListingStatus, string> = {
  pending: "bg-[#fbf3e1] text-gold-dark", verified: "bg-[#e8f1ec] text-ok", rejected: "bg-[#fbeceb] text-bad",
};
const AMENITIES = ["AC", "Wi-Fi", "Power backup", "Rooms / lodging", "Alcohol allowed", "Valet parking", "Stage", "Changing rooms"];

interface Base {
  demo: boolean; slug: string; name: string; description: string; address: string; phone: string; timing: string;
  capMin: number; capMax: number; parking: number; food: string; decoration: string; amenities: string[];
  priceMin: number; priceMax: number; minGuarantee: number; rental: number;
}

function baseFor(email: string, listing?: Listing): Base {
  if (email === DEMO) {
    const v = venues.find((x) => x.slug === "shagun-banquet")!;
    return {
      demo: true, slug: v.slug, name: v.name, description: v.description, address: v.address, phone: "+91 62904 48823", timing: v.timing,
      capMin: v.capacityMin, capMax: v.capacityMax, parking: v.parking, food: v.food, decoration: v.decoration,
      amenities: ["AC", "Wi-Fi", "Power backup", "Alcohol allowed", "Changing rooms"],
      priceMin: v.pricePerPlateMin, priceMax: v.pricePerPlateMax, minGuarantee: v.minGuarantee ?? 100, rental: 0,
    };
  }
  return {
    demo: false, slug: listing?.id ?? "new", name: listing?.name ?? "Your venue", description: listing?.description ?? "", address: listing?.address ?? "",
    phone: listing?.phone ?? "", timing: listing?.timing ?? "11 AM – 11 PM", capMin: listing?.capacityMin ?? 0, capMax: listing?.capacityMax ?? 0,
    parking: listing?.parking ?? 0, food: listing?.food ?? "Veg & Non-Veg", decoration: listing?.decoration ?? "In-house",
    amenities: listing?.amenities ?? [], priceMin: listing?.priceMin ?? 0, priceMax: listing?.priceMax ?? 0, minGuarantee: 0, rental: 0,
  };
}

export function VenueDashboard() {
  const session = useSession()!;
  const listings = useListings();
  const mine = listings.filter((l) => l.ownerEmail === session.email && l.kind === "venue");
  return <Workspace key={session.email + (mine[0]?.id ?? "")} base={baseFor(session.email, mine[0])} mine={mine} business={session.business} />;
}

const TOOLS: { s: AvailabilityStatus; label: string; cls: string }[] = [
  { s: "available", label: "Available", cls: "bg-ok" }, { s: "hold", label: "Hold", cls: "bg-gold" },
  { s: "booked", label: "Booked", cls: "bg-bad" }, { s: "unavailable", label: "Unavailable", cls: "bg-gray-300" },
];

function Workspace({ base, mine, business }: { base: Base; mine: Listing[]; business: string }) {
  const [section, setSection] = useState<Section>("overview");
  const [profile, setProfile] = useState({ name: base.name, description: base.description, address: base.address, phone: base.phone, timing: base.timing,
    capMin: base.capMin, capMax: base.capMax, parking: base.parking, food: base.food, decoration: base.decoration, amenities: base.amenities });
  const [price, setPrice] = useState({ priceMin: base.priceMin, priceMax: base.priceMax, minGuarantee: base.minGuarantee, rental: base.rental });
  const [marks, setMarks] = useState<Record<string, AvailabilityStatus>>({});
  const [tool, setTool] = useState<AvailabilityStatus>("booked");
  const [leads, setLeads] = useState<Lead[]>(base.demo ? venueDemoLeads : []);
  const [openLead, setOpenLead] = useState<string | null>(null);
  const [leadFilter, setLeadFilter] = useState<LeadStatus | "All">("All");
  const [range, setRange] = useState<"week" | "month">("week");
  const [photos, setPhotos] = useState<string[]>(base.demo ? demoPhotos : []);
  const [plan, setPlan] = useState(base.demo ? "Featured" : "Basic");
  const [toast, setToast] = useState("");

  const flash = (m: string) => { setToast(m); setTimeout(() => setToast(""), 2200); };
  const go = (s: Section, lead?: string) => { setSection(s); if (lead) setOpenLead(lead); };
  const newLeads = leads.filter((l) => l.status === "New").length;
  const series = range === "week" ? callsWeek : callsMonth;
  const maxSeries = Math.max(...series.enquiries, 1);
  const totalCalls = base.demo ? series.calls.reduce((a, b) => a + b, 0) : 0;

  const stats: [string, string | number, Section][] = [
    ["Profile Views", base.demo ? "1,284" : 0, "analytics"], ["Enquiries", base.demo ? 86 : leads.length, "leads"],
    ["Calls", base.demo ? 42 : 0, "analytics"], ["Calendar", base.demo ? "92% updated" : "Not set up", "availability"],
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-4xl">Venue Partner Dashboard</h1>
          <p className="mt-1 text-sm text-ink/60">One place to manage your venue business on Venue Wires. <span className="text-gold">{business}</span></p>
        </div>
        <div className="flex gap-2">
          {base.demo && <Link href={`/venues/${base.slug}`} className="btn btn-outline">View public page ↗</Link>}
          <Link href="/partner/list-property" className="btn btn-gold">+ Add another property</Link>
        </div>
      </div>

      {mine.some((l) => l.status === "pending") && (
        <div className="mt-5 rounded-xl border border-gold bg-[#fbf3e1] p-4 text-sm">⏳ <b>Your listing is pending verification.</b> Our team will verify price, contact and facilities, then publish it.</div>
      )}
      {mine.some((l) => l.status === "verified") && !base.demo && (
        <div className="mt-5 rounded-xl border border-[#cfe3d7] bg-[#eef6f1] p-4 text-sm text-ok">✓ <b>Your listing is verified and live.</b></div>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(([label, value, to]) => (
          <button key={label} onClick={() => go(to)} className="card p-5 text-left transition hover:border-gold hover:shadow-md">
            <p className="text-xs text-ink/60">{label}</p>
            <p className="mt-2 font-serif text-2xl">{value}</p>
            <p className="mt-1 text-[11px] text-gold">View details →</p>
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[230px_1fr]">
        <nav className="card h-fit p-3 text-sm">
          <ul className="space-y-1">
            {NAV.map(([k, label]) => (
              <li key={k}>
                <button onClick={() => setSection(k)} className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left ${section === k ? "bg-[#fbf3e1] font-semibold text-gold-dark" : "text-ink/70 hover:bg-cream"}`}>
                  {label}{k === "leads" && newLeads > 0 && <span className="rounded-full bg-gold px-1.5 text-[10px] text-white">{newLeads}</span>}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="min-w-0 space-y-6">
          {section === "overview" && (
            <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
              <div className="space-y-6">
                <Panel title="Availability calendar">
                  <ToolBar tool={tool} setTool={setTool} />
                  <Calendar slug={base.slug} marks={marks} setMarks={setMarks} tool={tool} />
                  <button onClick={() => go("availability")} className="mt-4 text-sm text-gold">Open full availability manager →</button>
                </Panel>
                <Panel title="My listings">
                  {base.demo && (
                    <div className="flex items-center justify-between border-b border-line pb-3 text-sm">
                      <div><b>Shagun Banquet</b><p className="text-xs text-ink/60">Tangra, Topsia · 100–300 guests</p></div>
                      <span className="rounded-full bg-[#e8f1ec] px-2.5 py-0.5 text-xs font-semibold text-ok">verified</span>
                    </div>
                  )}
                  {mine.map((l) => (
                    <div key={l.id} className="flex items-center justify-between border-b border-line py-3 text-sm last:border-0">
                      <div><b>{l.name}</b><p className="text-xs text-ink/60">{l.locality}, {l.zone} Kolkata · {l.capacityMin}–{l.capacityMax} guests · ₹{l.priceMin}–₹{l.priceMax}/plate</p></div>
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${badge[l.status]}`}>{l.status}</span>
                    </div>
                  ))}
                  {!base.demo && mine.length === 0 && <p className="text-sm text-ink/60">No venue listings yet.</p>}
                </Panel>
              </div>
              <Panel title="Recent leads" tint>
                {leads.length === 0 ? <p className="text-sm text-ink/60">Enquiries will appear here once your venue is live.</p> : (
                  <ul className="space-y-3 text-sm">
                    {leads.slice(0, 5).map((l) => (
                      <li key={l.id}>
                        <button onClick={() => go("leads", l.id)} className="flex w-full items-center justify-between gap-2 rounded-lg p-2 text-left hover:bg-white/70">
                          <span><span className="text-ink/80">{l.event} • {l.guests} guests</span><span className="block text-[11px] text-ink/50">{l.name}</span></span>
                          <span className="flex items-center gap-2"><span className={`rounded-full px-2 text-[10px] font-semibold leading-5 ${statusColor[l.status]}`}>{l.status}</span><b className="text-gold">View →</b></span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </Panel>
            </div>
          )}

          {section === "profile" && (
            <Panel title="Venue profile">
              <div className="grid gap-4 sm:grid-cols-2">
                <div><label className="label">Venue name</label><input className="input" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} /></div>
                <div><label className="label">Phone / WhatsApp</label><input className="input" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} /></div>
                <div className="sm:col-span-2"><label className="label">Address</label><input className="input" value={profile.address} onChange={(e) => setProfile({ ...profile, address: e.target.value })} /></div>
                <div><label className="label">Capacity — min</label><input type="number" className="input" value={profile.capMin} onChange={(e) => setProfile({ ...profile, capMin: +e.target.value })} /></div>
                <div><label className="label">Capacity — max</label><input type="number" className="input" value={profile.capMax} onChange={(e) => setProfile({ ...profile, capMax: +e.target.value })} /></div>
                <div><label className="label">Parking (cars)</label><input type="number" className="input" value={profile.parking} onChange={(e) => setProfile({ ...profile, parking: +e.target.value })} /></div>
                <div><label className="label">Timing</label><input className="input" value={profile.timing} onChange={(e) => setProfile({ ...profile, timing: e.target.value })} /></div>
                <div><label className="label">Food</label>
                  <select className="input" value={profile.food} onChange={(e) => setProfile({ ...profile, food: e.target.value })}><option>Veg & Non-Veg</option><option>Veg</option><option>Non-Veg</option></select></div>
                <div><label className="label">Decoration</label>
                  <select className="input" value={profile.decoration} onChange={(e) => setProfile({ ...profile, decoration: e.target.value })}><option>In-house</option><option>External allowed</option><option>Both</option></select></div>
                <div className="sm:col-span-2"><label className="label">Facilities</label>
                  <div className="flex flex-wrap gap-2">
                    {AMENITIES.map((a) => (
                      <button type="button" key={a} onClick={() => setProfile({ ...profile, amenities: profile.amenities.includes(a) ? profile.amenities.filter((x) => x !== a) : [...profile.amenities, a] })}
                        className={`rounded-full border px-3 py-1.5 text-xs ${profile.amenities.includes(a) ? "border-gold bg-[#fbf3e1] font-semibold text-gold-dark" : "border-line"}`}>{a}</button>
                    ))}
                  </div></div>
                <div className="sm:col-span-2"><label className="label">Description</label>
                  <textarea rows={4} className="input" value={profile.description} onChange={(e) => setProfile({ ...profile, description: e.target.value })} /></div>
              </div>
              <button onClick={() => flash("Venue profile saved (demo)")} className="btn btn-gold mt-5">Save changes</button>
            </Panel>
          )}

          {section === "pricing" && (
            <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
              <Panel title="Pricing & policies">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div><label className="label">Price per plate — from (₹)</label><input type="number" className="input" value={price.priceMin} onChange={(e) => setPrice({ ...price, priceMin: +e.target.value })} /></div>
                  <div><label className="label">Price per plate — to (₹)</label><input type="number" className="input" value={price.priceMax} onChange={(e) => setPrice({ ...price, priceMax: +e.target.value })} /></div>
                  <div><label className="label">Minimum guarantee (guests)</label><input type="number" className="input" value={price.minGuarantee} onChange={(e) => setPrice({ ...price, minGuarantee: +e.target.value })} /></div>
                  <div><label className="label">Rental per day (₹, optional)</label><input type="number" className="input" value={price.rental} onChange={(e) => setPrice({ ...price, rental: +e.target.value })} /></div>
                </div>
                <button onClick={() => flash("Pricing saved — sent for re-verification (demo)")} className="btn btn-gold mt-5">Save pricing</button>
                <p className="mt-3 text-xs text-ink/50">Price changes are re-verified by the Venue Wires team before the “Price verified” date updates.</p>
              </Panel>
              <Panel title="Estimator" tint>
                <p className="text-xs text-ink/60">What a customer sees for a given guest count</p>
                {[100, 200, 300].map((g) => (
                  <div key={g} className="mt-3 flex justify-between border-b border-line/70 pb-2 text-sm">
                    <span>{g} guests</span><b>{inr(price.priceMin * Math.max(g, price.minGuarantee))} – {inr(price.priceMax * Math.max(g, price.minGuarantee))}</b>
                  </div>
                ))}
              </Panel>
            </div>
          )}

          {section === "availability" && (
            <Panel title="Availability manager">
              <p className="mb-3 text-sm text-ink/60">Pick a status, then click dates to paint them. Customers see this calendar on your public page.</p>
              <ToolBar tool={tool} setTool={setTool} />
              <Calendar slug={base.slug} marks={marks} setMarks={setMarks} tool={tool} />
              <div className="mt-5 flex gap-2">
                <button onClick={() => flash("Availability saved (demo)")} className="btn btn-gold">Save availability</button>
                <button onClick={() => { setMarks({}); flash("Calendar reset"); }} className="btn btn-soft">Reset changes</button>
              </div>
            </Panel>
          )}

          {section === "leads" && (
            <Panel title={`Leads (${leads.length})`}>
              <div className="mb-4 flex flex-wrap gap-2">
                {(["All", ...STATUSES] as const).map((s) => (
                  <button key={s} onClick={() => setLeadFilter(s)} className={`rounded-full px-3 py-1 text-xs font-semibold ${leadFilter === s ? "bg-gold text-white" : "bg-[#f3ecdd] text-ink/70"}`}>
                    {s}{s !== "All" && ` (${leads.filter((l) => l.status === s).length})`}
                  </button>
                ))}
              </div>
              {leads.length === 0 ? <p className="text-sm text-ink/60">No leads yet — they appear once your listing is live.</p> : (
                <ul className="space-y-3">
                  {leads.filter((l) => leadFilter === "All" || l.status === leadFilter).map((l) => (
                    <li key={l.id} className={`rounded-xl border p-4 text-sm ${openLead === l.id ? "border-gold bg-[#fffaf0]" : "border-line"}`}>
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <button onClick={() => setOpenLead(openLead === l.id ? null : l.id)} className="text-left">
                          <b>{l.name}</b> <span className="text-xs text-ink/50">· {l.received}</span>
                          <p className="text-xs text-ink/60">{l.event} · {l.guests} guests · {new Date(l.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })} · {l.budget}</p>
                        </button>
                        <select value={l.status} onChange={(e) => setLeads(leads.map((x) => x.id === l.id ? { ...x, status: e.target.value as LeadStatus } : x))}
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColor[l.status]}`}>
                          {STATUSES.map((s) => <option key={s}>{s}</option>)}
                        </select>
                      </div>
                      {openLead === l.id && (
                        <>
                          <p className="mt-3 text-ink/70">“{l.message}”</p>
                          <div className="mt-3 flex flex-wrap gap-2">
                            <a href={`tel:${l.phone.replace(/\s/g, "")}`} className="btn btn-gold !py-1.5">Call</a>
                            <a href={`https://wa.me/${l.phone.replace(/\D/g, "")}`} target="_blank" rel="noreferrer" className="btn btn-soft !py-1.5">WhatsApp</a>
                            <button onClick={() => { const d = new Date(l.date); setMarks({ ...marks, [`${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`]: "hold" }); flash(`Hold placed on ${d.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`); }} className="btn btn-outline !py-1.5">Place date on hold</button>
                          </div>
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </Panel>
          )}

          {section === "analytics" && (
            <>
              <Panel title="Calls & enquiries">
                <div className="mb-4 flex gap-2">
                  {(["week", "month"] as const).map((r) => (
                    <button key={r} onClick={() => setRange(r)} className={`btn !py-1.5 ${range === r ? "btn-gold" : "btn-soft"}`}>{r === "week" ? "Last 7 days" : "Last 4 weeks"}</button>
                  ))}
                </div>
                {base.demo ? (
                  <>
                    <div className="flex h-44 items-end gap-3">
                      {series.labels.map((lb, i) => (
                        <div key={lb} className="flex flex-1 flex-col items-center gap-1">
                          <div className="flex h-36 w-full items-end gap-1">
                            <div title={`${series.enquiries[i]} enquiries`} className="w-1/2 rounded-t bg-gold" style={{ height: `${(series.enquiries[i] / maxSeries) * 100}%` }} />
                            <div title={`${series.calls[i]} calls`} className="w-1/2 rounded-t bg-ink/70" style={{ height: `${(series.calls[i] / maxSeries) * 100}%` }} />
                          </div>
                          <span className="text-[10px] text-ink/50">{lb}</span>
                        </div>
                      ))}
                    </div>
                    <p className="mt-3 flex gap-4 text-xs text-ink/60"><span><i className="mr-1 inline-block h-2.5 w-2.5 rounded-sm bg-gold" />Enquiries</span><span><i className="mr-1 inline-block h-2.5 w-2.5 rounded-sm bg-ink/70" />Calls</span><b className="ml-auto text-ink">{totalCalls} calls this period</b></p>
                  </>
                ) : <p className="text-sm text-ink/60">Analytics start once your venue is live and receiving traffic.</p>}
              </Panel>
              <Panel title="Busiest call hours">
                {base.demo ? (
                  <ul className="space-y-3">
                    {peakHours.map(([h, n]) => (
                      <li key={h} className="flex items-center gap-3 text-sm"><span className="w-28 text-ink/60">{h}</span>
                        <div className="h-2.5 flex-1 rounded-full bg-[#f1ede4]"><div className="h-2.5 rounded-full bg-gold" style={{ width: `${(n / 31) * 100}%` }} /></div><b className="w-8 text-right">{n}</b></li>
                    ))}
                  </ul>
                ) : <p className="text-sm text-ink/60">No data yet.</p>}
              </Panel>
            </>
          )}

          {section === "photos" && (
            <Panel title={`Photos (${photos.length})`}>
              {photos.length === 0 ? <p className="mb-4 text-sm text-ink/60">No photos yet. Venues with 10+ photos get far more enquiries.</p> : (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {photos.map((p, i) => (
                    <div key={p + i} className="overflow-hidden rounded-xl border border-line">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p} alt="" className="aspect-[4/3] w-full object-cover" />
                      <div className="flex items-center justify-between p-2 text-xs">
                        {i === 0 ? <span className="font-bold text-ok">★ Cover photo</span>
                          : <button onClick={() => setPhotos([photos[i], ...photos.filter((_, j) => j !== i)])} className="text-gold">Set as cover</button>}
                        <button onClick={() => setPhotos(photos.filter((_, j) => j !== i))} className="text-bad">Remove</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <label className="mt-4 flex cursor-pointer flex-col items-center rounded-xl border-2 border-dashed border-line p-6 text-center text-sm text-ink/60 hover:border-gold">
                <span className="text-2xl">📷</span>Add photos
                <input type="file" accept="image/*" multiple className="hidden"
                  onChange={(e) => setPhotos([...photos, ...Array.from(e.target.files ?? []).map((f) => URL.createObjectURL(f))])} />
              </label>
            </Panel>
          )}

          {section === "subscription" && (
            <Panel title="Subscription">
              <div className="grid gap-4 sm:grid-cols-3">
                {venuePlans.map((p) => (
                  <div key={p.name} className={`rounded-xl border p-4 ${plan === p.name ? "border-gold bg-[#fbf3e1]" : "border-line"}`}>
                    <h4 className="text-lg">{p.name}</h4><p className="font-bold text-gold">{p.price}</p>
                    <p className="mt-2 text-xs text-ink/60">{p.note}</p>
                    {plan === p.name ? <p className="mt-3 text-xs font-bold text-ok">✓ Current plan</p>
                      : <button onClick={() => { setPlan(p.name); flash(`Switched to ${p.name} (demo — no billing yet)`); }} className="btn btn-soft mt-3 !py-1.5">Choose</button>}
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs text-ink/50">Visibility plans are prepared for future activation. No charges are made in the prototype.</p>
            </Panel>
          )}
        </div>
      </div>

      {toast && <div className="fixed bottom-20 left-1/2 z-50 -translate-x-1/2 rounded-full bg-ink px-5 py-2.5 text-sm text-white shadow-lg">{toast}</div>}
    </div>
  );
}

function ToolBar({ tool, setTool }: { tool: AvailabilityStatus; setTool: (s: AvailabilityStatus) => void }) {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-2 text-xs">
      <span className="text-ink/60">Paint with:</span>
      {TOOLS.map((t) => (
        <button key={t.s} onClick={() => setTool(t.s)} className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 ${tool === t.s ? "border-ink font-semibold" : "border-line"}`}>
          <i className={`inline-block h-3 w-3 rounded-full ${t.cls}`} />{t.label}
        </button>
      ))}
    </div>
  );
}

function Calendar({ slug, marks, setMarks, tool }: { slug: string; marks: Record<string, AvailabilityStatus>; setMarks: (m: Record<string, AvailabilityStatus>) => void; tool: AvailabilityStatus }) {
  const [today] = useState(() => new Date());
  const [off, setOff] = useState(0);
  const t = new Date(today.getFullYear(), today.getMonth() + off, 1);
  const y = t.getFullYear(), m = t.getMonth();
  const base = getAvailability(slug, y, m);
  const days = new Date(y, m + 1, 0).getDate();
  const lead = (t.getDay() + 6) % 7;
  const key = (d: number) => `${y}-${m}-${d}`;
  const status = (d: number) => marks[key(d)] ?? base[d];
  const counts = { available: 0, hold: 0, booked: 0, unavailable: 0 };
  for (let d = 1; d <= days; d++) counts[status(d)]++;

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <b className="text-gold">{t.toLocaleString("en-IN", { month: "long", year: "numeric" })}</b>
        <div className="flex gap-2"><button className="btn btn-soft !px-3 !py-1.5" onClick={() => setOff(off - 1)} aria-label="Previous month">‹</button><button className="btn btn-soft !px-3 !py-1.5" onClick={() => setOff(off + 1)} aria-label="Next month">›</button></div>
      </div>
      <div className="grid grid-cols-7 gap-1.5 text-center text-xs font-semibold text-ink/50">{["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => <div key={d}>{d}</div>)}</div>
      <div className="mt-2 grid grid-cols-7 gap-1.5">
        {Array.from({ length: lead }).map((_, i) => <div key={"e" + i} />)}
        {Array.from({ length: days }, (_, i) => i + 1).map((d) => {
          const s = status(d);
          const cls = TOOLS.find((x) => x.s === s)!.cls;
          return <button key={d} onClick={() => setMarks({ ...marks, [key(d)]: tool })} title={s}
            className={`mx-auto aspect-square w-full max-w-12 rounded-full text-xs font-semibold transition hover:scale-105 ${cls} ${s === "unavailable" ? "text-gray-600" : "text-white"}`}>{d}</button>;
        })}
      </div>
      <p className="mt-4 text-xs text-ink/60">
        <b className="text-ok">{counts.available}</b> available · <b className="text-gold-dark">{counts.hold}</b> hold · <b className="text-bad">{counts.booked}</b> booked · <b>{counts.unavailable}</b> unavailable
      </p>
    </div>
  );
}
