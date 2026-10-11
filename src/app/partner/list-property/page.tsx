"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { dashboardPath, register, useSession } from "@/lib/auth";
import { addListing } from "@/lib/listings";
import { categoryMeta } from "@/lib/data/vendors";

type Kind = "venue" | "vendor";
interface Pkg { name: string; price: string; unit: string }

const venueTypes = ["Banquet", "Hotel", "Resort", "Garden", "Rajbari"];
const amenityList = ["AC", "Wi-Fi", "Power backup", "Rooms / lodging", "Alcohol allowed", "Valet parking", "Stage", "Changing rooms"];
const stepNames = ["Basics", "Details", "Photos & about", "Review & submit"];

export default function ListProperty() {
  const router = useRouter();
  const session = useSession();
  const [step, setStep] = useState(0);
  const [kind, setKind] = useState<Kind>("venue");
  const [error, setError] = useState("");

  const [f, setF] = useState({
    name: "", category: "Banquet", zone: "South", locality: "", address: "", contactPerson: "", phone: "",
    capacityMin: "", capacityMax: "", priceMin: "", priceMax: "", parking: "", food: "Veg & Non-Veg",
    decoration: "In-house", timing: "11 AM – 11 PM", serviceArea: "Kolkata & suburbs", description: "",
    email: "", password: "", confirm: "",
  });
  const [amenities, setAmenities] = useState<string[]>(["AC", "Power backup"]);
  const [pkgs, setPkgs] = useState<Pkg[]>([{ name: "Standard", price: "", unit: "event" }]);
  const [photos, setPhotos] = useState<{ name: string; url: string }[]>([]);
  const [agree, setAgree] = useState(false);

  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setF({ ...f, [k]: e.target.value });

  const loggedIn = session && session.role !== "admin";

  function validate(s: number): string {
    if (s === 0 && (!f.name || !f.locality || !f.address || !f.contactPerson || !/^[0-9+ ]{10,15}$/.test(f.phone)))
      return "Please fill in all basic details, including a valid phone number.";
    if (s === 1 && kind === "venue" && (!f.capacityMin || !f.capacityMax || !f.priceMin || !f.priceMax))
      return "Please add capacity and price-per-plate range.";
    if (s === 1 && kind === "vendor" && !pkgs.some((p) => p.name && Number(p.price) > 0))
      return "Add at least one package with a price.";
    if (s === 3 && !loggedIn) {
      if (!/^\S+@\S+\.\S+$/.test(f.email)) return "Enter a valid email for your partner login.";
      if (f.password.length < 6) return "Password must be at least 6 characters.";
      if (f.password !== f.confirm) return "Passwords do not match.";
    }
    if (s === 3 && !agree) return "Please accept the listing terms.";
    return "";
  }

  function next() {
    const err = validate(step);
    setError(err);
    if (!err) setStep(step + 1);
  }

  function submit() {
    const err = validate(3);
    if (err) return setError(err);
    let email = session?.email ?? "";
    let role: Kind = kind;
    if (!loggedIn) {
      const r = register({ email: f.email, password: f.password, name: f.contactPerson, business: f.name, phone: f.phone.replace(/\D/g, "").slice(-10), role: kind });
      if (r === "exists") return setError("An account with this email already exists. Please log in instead.");
      email = r.email;
    } else role = session!.role as Kind;

    addListing({
      ownerEmail: email, kind, name: f.name, category: f.category,
      zone: f.zone, locality: f.locality, address: f.address, contactPerson: f.contactPerson, phone: f.phone,
      description: f.description, photos: photos.length,
      ...(kind === "venue"
        ? { capacityMin: +f.capacityMin, capacityMax: +f.capacityMax, priceMin: +f.priceMin, priceMax: +f.priceMax,
            parking: +f.parking || 0, food: f.food, decoration: f.decoration, amenities, timing: f.timing }
        : { serviceArea: f.serviceArea, priceMin: Math.min(...pkgs.filter((p) => +p.price > 0).map((p) => +p.price)),
            packages: pkgs.filter((p) => p.name && +p.price > 0).map((p) => ({ name: p.name, price: +p.price, unit: p.unit })) }),
    });
    router.push(dashboardPath(role));
  }

  const toggleAmenity = (a: string) => setAmenities(amenities.includes(a) ? amenities.filter((x) => x !== a) : [...amenities, a]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-4xl">List your property</h1>
      <p className="mt-1 text-sm text-ink/60">Get discovered by couples and event planners across Kolkata. Free to list — we verify before you go live.</p>

      <div className="mt-6 flex flex-wrap gap-2">
        {stepNames.map((s, i) => (
          <span key={s} className={`rounded-full px-4 py-1.5 text-xs font-semibold ${i === step ? "bg-gold text-white" : i < step ? "bg-[#e8f1ec] text-ok" : "bg-[#f3ecdd] text-ink/60"}`}>
            {i < step ? "✓" : `${i + 1}.`} {s}
          </span>
        ))}
      </div>

      <div className="card mt-6 space-y-5 p-6">
        {step === 0 && (
          <>
            <div className="grid grid-cols-2 gap-3">
              {([["venue", "🏛️ Venue", "Banquet hall, hotel, resort, garden"], ["vendor", "🛠️ Service vendor", "Catering, decor, photography, makeup…"]] as const).map(([k, t, d]) => (
                <button key={k} type="button" onClick={() => { setKind(k); setF({ ...f, category: k === "venue" ? "Banquet" : "catering" }); }}
                  className={`rounded-xl border p-4 text-left ${kind === k ? "border-gold bg-[#fbf3e1]" : "border-line"}`}>
                  <b>{t}</b><p className="mt-1 text-xs text-ink/60">{d}</p>
                </button>
              ))}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2"><label className="label">{kind === "venue" ? "Venue name" : "Business name"}</label>
                <input className="input" value={f.name} onChange={set("name")} placeholder={kind === "venue" ? "e.g. Shagun Banquet" : "e.g. Royal Feast Catering"} /></div>
              <div><label className="label">{kind === "venue" ? "Venue type" : "Service category"}</label>
                <select className="input" value={f.category} onChange={set("category")}>
                  {kind === "venue" ? venueTypes.map((t) => <option key={t}>{t}</option>)
                    : Object.entries(categoryMeta).map(([k, m]) => <option key={k} value={k}>{m.label}</option>)}
                </select></div>
              <div><label className="label">Zone</label>
                <select className="input" value={f.zone} onChange={set("zone")}><option>South</option><option>Central</option><option>North</option></select></div>
              <div><label className="label">Locality</label><input className="input" value={f.locality} onChange={set("locality")} placeholder="e.g. Tangra, Topsia" /></div>
              <div><label className="label">City</label><input className="input" value="Kolkata, West Bengal, India" disabled /></div>
              <div className="sm:col-span-2"><label className="label">Full address</label><input className="input" value={f.address} onChange={set("address")} /></div>
              <div><label className="label">Contact person</label><input className="input" value={f.contactPerson} onChange={set("contactPerson")} /></div>
              <div><label className="label">Phone / WhatsApp</label><input className="input" value={f.phone} onChange={set("phone")} placeholder="+91 XXXXX XXXXX" /></div>
            </div>
          </>
        )}

        {step === 1 && kind === "venue" && (
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label className="label">Capacity — min guests</label><input type="number" className="input" value={f.capacityMin} onChange={set("capacityMin")} /></div>
            <div><label className="label">Capacity — max guests</label><input type="number" className="input" value={f.capacityMax} onChange={set("capacityMax")} /></div>
            <div><label className="label">Price per plate — from (₹)</label><input type="number" className="input" value={f.priceMin} onChange={set("priceMin")} /></div>
            <div><label className="label">Price per plate — to (₹)</label><input type="number" className="input" value={f.priceMax} onChange={set("priceMax")} /></div>
            <div><label className="label">Parking (cars)</label><input type="number" className="input" value={f.parking} onChange={set("parking")} /></div>
            <div><label className="label">Timing</label><input className="input" value={f.timing} onChange={set("timing")} /></div>
            <div><label className="label">Food</label>
              <select className="input" value={f.food} onChange={set("food")}><option>Veg & Non-Veg</option><option>Veg</option><option>Non-Veg</option></select></div>
            <div><label className="label">Decoration</label>
              <select className="input" value={f.decoration} onChange={set("decoration")}><option>In-house</option><option>External allowed</option><option>Both</option></select></div>
            <div className="sm:col-span-2">
              <label className="label">Facilities</label>
              <div className="flex flex-wrap gap-2">
                {amenityList.map((a) => (
                  <button type="button" key={a} onClick={() => toggleAmenity(a)}
                    className={`rounded-full border px-3 py-1.5 text-xs ${amenities.includes(a) ? "border-gold bg-[#fbf3e1] font-semibold text-gold-dark" : "border-line"}`}>{a}</button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 1 && kind === "vendor" && (
          <div className="space-y-4">
            <div><label className="label">Service area</label><input className="input" value={f.serviceArea} onChange={set("serviceArea")} /></div>
            <div>
              <label className="label">Packages</label>
              <div className="space-y-2">
                {pkgs.map((p, i) => (
                  <div key={i} className="grid grid-cols-[1fr_110px_110px_auto] gap-2">
                    <input className="input" placeholder="Package name" value={p.name} onChange={(e) => setPkgs(pkgs.map((x, j) => j === i ? { ...x, name: e.target.value } : x))} />
                    <input className="input" type="number" placeholder="₹ price" value={p.price} onChange={(e) => setPkgs(pkgs.map((x, j) => j === i ? { ...x, price: e.target.value } : x))} />
                    <select className="input" value={p.unit} onChange={(e) => setPkgs(pkgs.map((x, j) => j === i ? { ...x, unit: e.target.value } : x))}>
                      <option>event</option><option>plate</option><option>person</option><option>hour</option>
                    </select>
                    <button type="button" className="btn btn-soft !px-3" onClick={() => setPkgs(pkgs.filter((_, j) => j !== i))} disabled={pkgs.length === 1}>✕</button>
                  </div>
                ))}
              </div>
              <button type="button" className="btn btn-soft mt-3" onClick={() => setPkgs([...pkgs, { name: "", price: "", unit: "event" }])}>+ Add package</button>
            </div>
          </div>
        )}

        {step === 2 && (
          <>
            <div><label className="label">About your {kind === "venue" ? "venue" : "business"}</label>
              <textarea rows={5} className="input" value={f.description} onChange={set("description")} placeholder="What makes you special? Spaces, specialities, past events…" /></div>
            <div>
              <label className="label">Photos</label>
              <label className="flex cursor-pointer flex-col items-center rounded-xl border-2 border-dashed border-line p-8 text-center text-sm text-ink/60 hover:border-gold">
                <span className="text-3xl">📷</span>Click to upload photos (JPG / PNG)
                <input type="file" accept="image/*" multiple className="hidden"
                  onChange={(e) => setPhotos([...photos, ...Array.from(e.target.files ?? []).map((file) => ({ name: file.name, url: URL.createObjectURL(file) }))])} />
              </label>
              {photos.length > 0 && (
                <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5">
                  {photos.map((p, i) => (
                    <div key={p.url} className="relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.url} alt={p.name} className="aspect-square w-full rounded-lg object-cover" />
                      <button type="button" onClick={() => setPhotos(photos.filter((_, j) => j !== i))} className="absolute right-1 top-1 rounded-full bg-black/60 px-1.5 text-xs text-white">✕</button>
                    </div>
                  ))}
                </div>
              )}
              <p className="mt-2 text-xs text-ink/50">Prototype: photos are previewed here but not uploaded anywhere yet.</p>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <div className="rounded-xl bg-cream p-4 text-sm">
              <h3 className="text-lg">{f.name}</h3>
              <p className="text-ink/60">{kind === "venue" ? f.category : categoryMeta[f.category]?.label} · {f.locality}, {f.zone} Kolkata</p>
              <p className="mt-2">{kind === "venue" ? `${f.capacityMin}–${f.capacityMax} guests · ₹${f.priceMin}–₹${f.priceMax} / plate` : `${pkgs.filter((p) => p.name).length} package(s) · ${f.serviceArea}`}</p>
              <p className="text-ink/60">{f.contactPerson} · {f.phone} · {photos.length} photo(s)</p>
            </div>
            {loggedIn ? (
              <p className="text-sm text-ink/70">Listing will be added to your account <b>{session!.email}</b>.</p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                <h3 className="text-lg sm:col-span-2">Create your partner login</h3>
                <div className="sm:col-span-2"><label className="label">Email</label><input type="email" className="input" value={f.email} onChange={set("email")} /></div>
                <div><label className="label">Password</label><input type="password" className="input" value={f.password} onChange={set("password")} /></div>
                <div><label className="label">Confirm password</label><input type="password" className="input" value={f.confirm} onChange={set("confirm")} /></div>
                <p className="text-xs text-ink/50 sm:col-span-2">Already registered? <Link href="/partner/login" className="text-gold">Log in</Link> first to add another listing.</p>
              </div>
            )}
            <label className="flex items-start gap-2 text-sm">
              <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-1 accent-[#b98425]" />
              I confirm the details are accurate and agree to Venue Wires verification and listing terms.
            </label>
          </>
        )}

        {error && <p className="rounded-lg bg-[#fbeceb] px-3 py-2 text-sm text-bad">{error}</p>}

        <div className="flex justify-between pt-2">
          <button type="button" disabled={step === 0} onClick={() => { setStep(step - 1); setError(""); }} className="btn btn-soft disabled:opacity-40">← Back</button>
          {step < 3 ? <button type="button" onClick={next} className="btn btn-gold">Continue →</button>
            : <button type="button" onClick={submit} className="btn btn-gold">Submit listing for verification</button>}
        </div>
      </div>
    </div>
  );
}
