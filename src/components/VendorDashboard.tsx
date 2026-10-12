"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession } from "@/lib/auth";
import { useListings, type Listing } from "@/lib/listings";
import { vendors, categoryMeta } from "@/lib/data/vendors";
import { demoInvoices, demoLeads, demoPlans, demoReviews, demoViews, type Lead, type LeadStatus } from "@/lib/data/vendor-demo";
import { inr } from "@/lib/api";
import { Panel, Stat } from "./Dash";

type Section = "overview" | "profile" | "packages" | "areas" | "availability" | "leads" | "reviews" | "billing";
const NAV: [Section, string][] = [
  ["overview", "Overview"], ["profile", "Profile"], ["packages", "Menus / Packages"], ["areas", "Service Areas"],
  ["availability", "Availability"], ["leads", "Leads"], ["reviews", "Reviews"], ["billing", "Billing"],
];
export const STATUSES: LeadStatus[] = ["New", "Contacted", "Quoted", "Won", "Lost"];
export const statusColor: Record<LeadStatus, string> = {
  New: "bg-[#fbf3e1] text-gold-dark", Contacted: "bg-[#e8eef6] text-[#3b5b86]", Quoted: "bg-[#efe8f6] text-[#6a4b8a]",
  Won: "bg-[#e8f1ec] text-ok", Lost: "bg-[#fbeceb] text-bad",
};

interface Pkg { name: string; price: number; unit: string; summary: string }
interface Base {
  name: string; category: string; phone: string; about: string; areas: string[]; packages: Pkg[];
  demo: boolean; status: Listing["status"] | "demo"; owner: string;
}

function baseFor(email: string, business: string, listing?: Listing): Base {
  if (email === "vendor@venuewires.demo") {
    const v = vendors.find((x) => x.slug === "royal-feast-catering")!;
    return {
      name: v.name, category: "catering", phone: "+91 98300 10001", demo: true, status: "demo", owner: email,
      about: "Kolkata's trusted wedding and corporate caterer — Bengali, North Indian and live counters for 100 to 1,000 guests.",
      areas: ["South Kolkata", "Central Kolkata", "North Kolkata", "New Town", "Howrah"],
      packages: v.packages.map((p) => ({ ...p })),
    };
  }
  return {
    name: listing?.name ?? business, category: listing?.category ?? "catering", phone: listing?.phone ?? "", demo: false,
    status: listing?.status ?? "pending", owner: email, about: listing?.description ?? "",
    areas: listing?.serviceArea ? listing.serviceArea.split(/,|&/).map((s) => s.trim()).filter(Boolean) : ["Kolkata"],
    packages: (listing?.packages ?? []).map((p) => ({ ...p, summary: "" })),
  };
}

export function VendorDashboard() {
  const session = useSession()!;
  const listings = useListings();
  const mine = listings.find((l) => l.ownerEmail === session.email && l.kind === "vendor");
  return <Workspace key={session.email + (mine?.id ?? "")} base={baseFor(session.email, session.business, mine)} contact={session.name} />;
}

function Workspace({ base, contact }: { base: Base; contact: string }) {
  const [section, setSection] = useState<Section>("overview");
  const [profile, setProfile] = useState({ name: base.name, category: base.category, phone: base.phone, about: base.about });
  const [areas, setAreas] = useState(base.areas);
  const [pkgs, setPkgs] = useState(base.packages);
  const [leads, setLeads] = useState<Lead[]>(base.demo ? demoLeads : []);
  const [toast, setToast] = useState("");

  const flash = (m: string) => { setToast(m); setTimeout(() => setToast(""), 2200); };
  const newLeads = leads.filter((l) => l.status === "New").length;
  const reviews = base.demo ? demoReviews : [];
  const views = base.demo ? demoViews : [0, 0, 0, 0, 0, 0, 0];
  const maxView = Math.max(...views, 1);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-4xl">Vendor Partner Dashboard</h1>
          <p className="mt-1 text-sm text-ink/60">Manage services, menus, leads and portfolio.</p>
        </div>
        <Link href={base.demo ? "/vendors/royal-feast-catering" : "/services"} className="btn btn-outline">View public profile ↗</Link>
      </div>

      {base.status === "pending" && (
        <div className="mt-5 rounded-xl border border-gold bg-[#fbf3e1] p-4 text-sm">
          ⏳ <b>Your listing is pending verification.</b> The Venue Wires team will review your details and go live within 1–2 working days.
        </div>
      )}
      {base.status === "verified" && (
        <div className="mt-5 rounded-xl border border-[#cfe3d7] bg-[#eef6f1] p-4 text-sm text-ok">✓ <b>Your listing is verified and live.</b></div>
      )}
      {base.status === "rejected" && (
        <div className="mt-5 rounded-xl border border-bad/40 bg-[#fbeceb] p-4 text-sm text-bad">Your listing needs changes. Please update your profile and contact support.</div>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-[240px_1fr]">
        <nav className="card h-fit p-5 text-sm">
          <h2 className="text-lg">{profile.name}</h2>
          <p className="mb-4 text-xs text-gold">Vendor Partner · {contact}</p>
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
            <>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Stat label="Profile Views" value={base.demo ? 924 : 0} /><Stat label="Enquiries" value={base.demo ? 57 : leads.length} />
                <Stat label="New Leads" value={newLeads} /><Stat label="Rating" value={base.demo ? "4.7 / 5" : "—"} />
              </div>
              <Panel title="Profile views — last 7 days">
                <div className="flex h-32 items-end gap-3">
                  {views.map((v, i) => (
                    <div key={i} className="flex flex-1 flex-col items-center gap-1">
                      <span className="text-[10px] text-ink/50">{v || ""}</span>
                      <div className="w-full rounded-t bg-gold" style={{ height: `${(v / maxView) * 100}%`, minHeight: 2 }} />
                      <span className="text-[10px] text-ink/50">{["M", "T", "W", "T", "F", "S", "S"][i]}</span>
                    </div>
                  ))}
                </div>
              </Panel>
              <div className="grid gap-6 md:grid-cols-[1.3fr_1fr]">
                <Panel title="Active Packages">
                  {pkgs.length === 0 ? <p className="text-sm text-ink/60">No packages yet. Add one under Menus / Packages.</p> : (
                    <ul className="space-y-3 text-sm">
                      {pkgs.map((p) => (
                        <li key={p.name} className="flex items-center justify-between gap-2"><b>{p.name}</b>
                          <span className="text-ink/60">{inr(p.price)} / {p.unit}</span>
                          <button onClick={() => setSection("packages")} className="btn btn-soft !py-1.5">Edit</button></li>
                      ))}
                    </ul>
                  )}
                </Panel>
                <Panel title="Lead Inbox" tint>
                  {leads.length === 0 ? <p className="text-sm text-ink/60">Leads from customers will appear here.</p> : (
                    <ul className="space-y-3 text-sm">
                      {leads.slice(0, 4).map((l) => (
                        <li key={l.id} className="flex justify-between gap-2"><span className="text-ink/70">{l.event} • {l.guests}</span>
                          <span className={`rounded-full px-2 text-[10px] font-semibold leading-5 ${statusColor[l.status]}`}>{l.status}</span></li>
                      ))}
                    </ul>
                  )}
                  <button onClick={() => setSection("leads")} className="btn btn-gold mt-4">Open all leads</button>
                </Panel>
              </div>
            </>
          )}

          {section === "profile" && (
            <Panel title="Business profile">
              <div className="grid gap-4 sm:grid-cols-2">
                <div><label className="label">Business name</label><input className="input" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} /></div>
                <div><label className="label">Category</label>
                  <select className="input" value={profile.category} onChange={(e) => setProfile({ ...profile, category: e.target.value })}>
                    {Object.entries(categoryMeta).map(([k, m]) => <option key={k} value={k}>{m.label}</option>)}</select></div>
                <div><label className="label">Phone / WhatsApp</label><input className="input" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} /></div>
                <div><label className="label">Login email</label><input className="input" value={base.owner} disabled /></div>
                <div className="sm:col-span-2"><label className="label">About</label>
                  <textarea rows={4} className="input" value={profile.about} onChange={(e) => setProfile({ ...profile, about: e.target.value })} /></div>
              </div>
              <p className="mt-4 text-xs text-ink/50">Portfolio photos and sample menus upload arrives with the backend phase.</p>
              <button onClick={() => flash("Profile saved (demo)")} className="btn btn-gold mt-4">Save changes</button>
            </Panel>
          )}

          {section === "packages" && (
            <Panel title="Menus / Packages">
              <div className="space-y-3">
                {pkgs.map((p, i) => (
                  <div key={i} className="grid gap-2 rounded-xl bg-cream p-3 sm:grid-cols-[1fr_110px_110px_2fr_auto]">
                    <input className="input" value={p.name} placeholder="Name" onChange={(e) => setPkgs(pkgs.map((x, j) => j === i ? { ...x, name: e.target.value } : x))} />
                    <input className="input" type="number" value={p.price} onChange={(e) => setPkgs(pkgs.map((x, j) => j === i ? { ...x, price: Number(e.target.value) } : x))} />
                    <select className="input" value={p.unit} onChange={(e) => setPkgs(pkgs.map((x, j) => j === i ? { ...x, unit: e.target.value } : x))}>
                      <option>plate</option><option>event</option><option>person</option><option>hour</option></select>
                    <input className="input" value={p.summary} placeholder="What's included" onChange={(e) => setPkgs(pkgs.map((x, j) => j === i ? { ...x, summary: e.target.value } : x))} />
                    <button className="btn btn-soft" onClick={() => setPkgs(pkgs.filter((_, j) => j !== i))}>Delete</button>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex gap-2">
                <button className="btn btn-soft" onClick={() => setPkgs([...pkgs, { name: "New package", price: 0, unit: "plate", summary: "" }])}>+ Add package</button>
                <button className="btn btn-gold" onClick={() => flash("Packages saved (demo)")}>Save packages</button>
              </div>
            </Panel>
          )}

          {section === "areas" && <Areas areas={areas} setAreas={setAreas} onSave={() => flash("Service areas saved (demo)")} />}

          {section === "availability" && <VendorCalendar onSave={() => flash("Availability saved (demo)")} demo={base.demo} />}

          {section === "leads" && (
            <Panel title={`Leads (${leads.length})`}>
              {leads.length === 0 ? <p className="text-sm text-ink/60">No leads yet — once your listing is live, enquiries appear here.</p> : (
                <ul className="space-y-3">
                  {leads.map((l) => (
                    <li key={l.id} className="rounded-xl border border-line p-4 text-sm">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <b>{l.name}</b> <span className="text-xs text-ink/50">· {l.received}</span>
                          <p className="text-xs text-ink/60">{l.event} · {l.guests} guests · {new Date(l.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })} · {l.budget}</p>
                        </div>
                        <select value={l.status} onChange={(e) => setLeads(leads.map((x) => x.id === l.id ? { ...x, status: e.target.value as LeadStatus } : x))}
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColor[l.status]}`}>
                          {STATUSES.map((s) => <option key={s}>{s}</option>)}
                        </select>
                      </div>
                      <p className="mt-2 text-ink/70">“{l.message}”</p>
                      <div className="mt-3 flex gap-2">
                        <a href={`tel:${l.phone.replace(/\s/g, "")}`} className="btn btn-gold !py-1.5">Call</a>
                        <a href={`https://wa.me/${l.phone.replace(/\D/g, "")}`} target="_blank" rel="noreferrer" className="btn btn-soft !py-1.5">WhatsApp</a>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </Panel>
          )}

          {section === "reviews" && (
            <Panel title={`Reviews (${reviews.length})`}>
              {reviews.length === 0 ? <p className="text-sm text-ink/60">Customer reviews will show here.</p> : (
                <ul className="space-y-4">
                  {reviews.map((r) => (
                    <li key={r.name} className="border-b border-line pb-4 text-sm last:border-0">
                      <div className="flex justify-between"><b>{r.name}</b><span className="text-xs text-ink/50">{r.date}</span></div>
                      <p className="text-gold">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</p>
                      <p className="mt-1 text-ink/70">{r.text}</p>
                    </li>
                  ))}
                </ul>
              )}
            </Panel>
          )}

          {section === "billing" && (
            <>
              <Panel title="Subscription">
                <div className="grid gap-4 sm:grid-cols-3">
                  {demoPlans.map((p) => {
                    const current = base.demo ? p.current : p.name === "Free";
                    return (
                      <div key={p.name} className={`rounded-xl border p-4 ${current ? "border-gold bg-[#fbf3e1]" : "border-line"}`}>
                        <h4 className="text-lg">{p.name}</h4>
                        <p className="font-bold text-gold">{p.price}</p>
                        <p className="mt-2 text-xs text-ink/60">{p.note}</p>
                        {current ? <p className="mt-3 text-xs font-bold text-ok">✓ Current plan</p> : <button onClick={() => flash("Plan upgrades open with billing (demo)")} className="btn btn-soft mt-3 !py-1.5">Choose</button>}
                      </div>
                    );
                  })}
                </div>
              </Panel>
              <Panel title="Invoices">
                {base.demo ? (
                  <table className="w-full text-left text-sm">
                    <thead className="text-xs text-ink/50"><tr><th className="py-2">Invoice</th><th>Date</th><th>Item</th><th>Amount</th><th>Status</th></tr></thead>
                    <tbody>{demoInvoices.map((i) => <tr key={i.id} className="border-t border-line"><td className="py-2">{i.id}</td><td>{i.date}</td><td>{i.item}</td><td>{i.amount}</td><td className="text-ok">{i.status}</td></tr>)}</tbody>
                  </table>
                ) : <p className="text-sm text-ink/60">No invoices yet.</p>}
              </Panel>
            </>
          )}
        </div>
      </div>

      {toast && <div className="fixed bottom-20 left-1/2 z-50 -translate-x-1/2 rounded-full bg-ink px-5 py-2.5 text-sm text-white shadow-lg">{toast}</div>}
    </div>
  );
}

function Areas({ areas, setAreas, onSave }: { areas: string[]; setAreas: (a: string[]) => void; onSave: () => void }) {
  const [val, setVal] = useState("");
  const add = () => { const v = val.trim(); if (v && !areas.includes(v)) setAreas([...areas, v]); setVal(""); };
  return (
    <Panel title="Service Areas">
      <div className="flex flex-wrap gap-2">
        {areas.map((a) => (
          <span key={a} className="flex items-center gap-2 rounded-full bg-[#f1ede4] px-3 py-1.5 text-sm">{a}
            <button onClick={() => setAreas(areas.filter((x) => x !== a))} className="text-ink/40 hover:text-bad" aria-label={`Remove ${a}`}>✕</button></span>
        ))}
      </div>
      <div className="mt-4 flex max-w-md gap-2">
        <input className="input" value={val} onChange={(e) => setVal(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), add())} placeholder="Add an area, e.g. Salt Lake" />
        <button className="btn btn-soft" onClick={add}>Add</button>
      </div>
      <button onClick={onSave} className="btn btn-gold mt-5">Save areas</button>
    </Panel>
  );
}

type Day = "available" | "booked" | "unavailable";
const DAY_STYLE: Record<Day, string> = { available: "bg-ok text-white", booked: "bg-bad text-white", unavailable: "bg-gray-300 text-gray-600" };
const NEXT: Record<Day, Day> = { available: "booked", booked: "unavailable", unavailable: "available" };

function VendorCalendar({ onSave, demo }: { onSave: () => void; demo: boolean }) {
  const [base] = useState(() => new Date());
  const [off, setOff] = useState(0);
  const [marks, setMarks] = useState<Record<string, Day>>(() => {
    if (!demo) return {};
    const d = new Date(); const m: Record<string, Day> = {};
    [3, 8, 12, 17, 23].forEach((n) => { m[`${d.getFullYear()}-${d.getMonth()}-${n}`] = "booked"; });
    [5, 19].forEach((n) => { m[`${d.getFullYear()}-${d.getMonth()}-${n}`] = "unavailable"; });
    return m;
  });
  const t = new Date(base.getFullYear(), base.getMonth() + off, 1);
  const days = new Date(t.getFullYear(), t.getMonth() + 1, 0).getDate();
  const lead = (t.getDay() + 6) % 7;
  const key = (d: number) => `${t.getFullYear()}-${t.getMonth()}-${d}`;

  return (
    <Panel title="Availability">
      <div className="mb-3 flex items-center justify-between">
        <b className="text-gold">{t.toLocaleString("en-IN", { month: "long", year: "numeric" })}</b>
        <div className="flex gap-2"><button className="btn btn-soft !px-3" onClick={() => setOff(off - 1)}>‹</button><button className="btn btn-soft !px-3" onClick={() => setOff(off + 1)}>›</button></div>
      </div>
      <p className="mb-3 text-xs text-ink/60">Click a date to cycle: Available → Booked → Unavailable.</p>
      <div className="grid max-w-md grid-cols-7 gap-1.5 text-center text-xs font-semibold text-ink/50">{["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => <div key={d}>{d}</div>)}</div>
      <div className="mt-2 grid max-w-md grid-cols-7 gap-1.5">
        {Array.from({ length: lead }).map((_, i) => <div key={"e" + i} />)}
        {Array.from({ length: days }, (_, i) => i + 1).map((d) => {
          const s = marks[key(d)] ?? "available";
          return <button key={d} onClick={() => setMarks({ ...marks, [key(d)]: NEXT[s] })} className={`aspect-square rounded-full text-xs font-semibold ${DAY_STYLE[s]}`}>{d}</button>;
        })}
      </div>
      <button onClick={onSave} className="btn btn-gold mt-5">Save availability</button>
    </Panel>
  );
}
