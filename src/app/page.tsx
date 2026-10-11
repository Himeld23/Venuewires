import Link from "next/link";
import { getFeaturedVenues, getVenues } from "@/lib/api";
import { VenueCard } from "@/components/VenueCard";
import { categoryMeta } from "@/lib/data/vendors";

const events = [
  ["Wedding", "💍"], ["Birthday & Party", "🎂"], ["Corporate Event", "🏢"],
  ["Engagement", "💎"], ["Social Celebration", "🎉"], ["Destination Event", "🏝️"],
];

export default async function Home() {
  const [featured, all] = await Promise.all([getFeaturedVenues(), getVenues()]);
  const popular = all.slice(0, 6);

  return (
    <>
      {/* Hero + search */}
      <section className="relative isolate overflow-hidden bg-ink text-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="https://venuewires.in/wp-content/uploads/2024/08/f44425d1-138f-43d9-9c9d-1104f5c6f017-1024x576.png"
          alt="" className="absolute inset-0 -z-10 h-full w-full object-cover opacity-35" />
        <div className="mx-auto max-w-7xl px-4 py-20 md:py-28">
          <p className="text-xs tracking-[0.25em] text-gold">INDIA&apos;S LEADING EVENT &amp; VENUE PLATFORM</p>
          <h1 className="mt-4 text-4xl md:text-6xl leading-tight">
            Find. Compare. Plan.<br /><span className="text-gold">Book with Venue Wires.</span>
          </h1>
          <p className="mt-4 text-lg">Your event. Your choices. One platform.</p>
          <p className="mt-2 max-w-xl text-white/75 text-sm">
            Find the perfect venue, photographer, decorator, caterer, makeup artist and more — all in one place.
          </p>

          <form action="/venues" className="mt-8 grid gap-3 rounded-2xl bg-white p-3 text-ink shadow-xl md:grid-cols-[1.4fr_1fr_1fr_1fr_1fr_auto]">
            <div><label className="label">What are you looking for?</label>
              <input name="q" className="input" placeholder="Venue, banquet, hotel…" /></div>
            <div><label className="label">Location</label>
              <select name="zone" className="input" defaultValue="">
                <option value="">All Kolkata</option><option>South</option><option>Central</option><option>North</option>
              </select></div>
            <div><label className="label">Event type</label>
              <select name="event" className="input" defaultValue="Wedding">
                {events.map(([e]) => <option key={e}>{e}</option>)}
              </select></div>
            <div><label className="label">Guests</label>
              <input name="guests" type="number" min={10} className="input" placeholder="e.g. 300" /></div>
            <div><label className="label">Event date</label>
              <input name="date" type="date" className="input" /></div>
            <button className="btn btn-gold self-end !py-3">Search →</button>
          </form>

          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            <span className="text-white/60">Popular:</span>
            {[["Wedding venues", "/venues?event=Wedding"], ["Under ₹1,800", "/venues?maxPrice=1800"],
              ["Hotels", "/venues?type=Hotel"], ["Photography", "/services/photography"],
              ["Catering", "/services/catering"], ["Decoration", "/services/decoration"]].map(([l, h]) => (
              <Link key={l} href={h} className="rounded-full border border-white/30 px-3 py-1 hover:bg-white/10">{l}</Link>
            ))}
          </div>
        </div>
      </section>

      {/* Event types */}
      <section className="mx-auto max-w-7xl px-4 py-14">
        <h2 className="text-3xl">What are you planning?</h2>
        <p className="mt-1 text-sm text-ink/60">Choose your event type and explore all related services</p>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {events.map(([e, icon]) => (
            <Link key={e} href={`/venues?event=${encodeURIComponent(e)}`} className="card p-5 text-center transition hover:border-gold hover:shadow-md">
              <div className="text-4xl">{icon}</div>
              <div className="mt-3 text-sm font-semibold">{e}</div>
              <div className="mt-1 text-xs text-gold">Explore →</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Compare teaser */}
      <section className="bg-[#f3ecdd]">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-14 md:grid-cols-2">
          <div>
            <p className="text-xs tracking-[0.2em] text-gold">THE SMARTER WAY TO PLAN</p>
            <h2 className="mt-2 text-4xl">Don&apos;t just search.<br />Compare.</h2>
            <p className="mt-3 text-ink/70">Shortlist multiple options and compare everything side-by-side before you decide.</p>
            <Link href="/compare?v=shagun-banquet&v=ojas-banquet" className="btn btn-gold mt-6">Compare Venues →</Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {featured.slice(0, 2).map((v) => (
              <div key={v.slug} className="card overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={v.image} alt={v.name} className="aspect-[4/3] w-full object-cover" />
                <div className="p-3 text-sm">
                  <b className="font-serif">{v.name}</b>
                  <p className="text-xs text-ink/60">₹{v.pricePerPlateMin} / plate · {v.capacityMin}–{v.capacityMax}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="mx-auto max-w-7xl px-4 py-14">
        <h2 className="text-3xl">One Event. Every Service. One Platform.</h2>
        <p className="mt-1 text-sm text-ink/60">Everything you need for a perfect event — connected in one place.</p>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-7">
          {Object.entries(categoryMeta).map(([k, m]) => (
            <Link key={k} href={`/services/${k}`} className="card p-4 text-center text-sm font-medium hover:border-gold">
              {m.label}
            </Link>
          ))}
        </div>
      </section>

      {/* Build event teaser */}
      <section className="mx-auto max-w-7xl px-4">
        <div className="card grid gap-6 p-6 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <h2 className="text-2xl">Build Your Event</h2>
            <p className="mt-1 text-sm text-ink/60">Tell us what you&apos;re planning. We&apos;ll estimate the total — venue, catering, decoration and more.</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-ink/60">Estimated event budget (300 guests)</p>
            <p className="font-serif text-3xl text-gold">₹5.2L – ₹5.8L</p>
            <Link href="/build-event" className="btn btn-gold mt-2">Get Estimate</Link>
          </div>
        </div>
      </section>

      {/* Popular venues */}
      <section className="mx-auto max-w-7xl px-4 py-14">
        <div className="flex items-end justify-between">
          <div><h2 className="text-3xl">Explore Popular Venues</h2>
            <p className="mt-1 text-sm text-ink/60">Handpicked venues for your special moments</p></div>
          <Link href="/venues" className="text-sm text-gold">View All Venues →</Link>
        </div>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {popular.map((v) => <VenueCard key={v.slug} v={v} />)}
        </div>
      </section>

      {/* Why */}
      <section className="mx-auto max-w-7xl px-4">
        <h2 className="text-3xl">Why Venue Wires?</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[["Search", "Browse verified venues across Kolkata"], ["Compare", "Prices, facilities and policies side-by-side"],
            ["Choose", "Check live availability for your date"], ["Book Easily", "Book your venue with the help of Venue Wires — quick, simple and hassle-free"]].map(([t, d], i) => (
            <div key={t} className="card p-5">
              <div className="text-gold font-serif text-2xl">0{i + 1}</div>
              <h3 className="mt-1 text-lg">{t}</h3><p className="mt-1 text-sm text-ink/60">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-14 max-w-7xl px-4">
        <div className="rounded-2xl bg-ink px-6 py-12 text-center text-white">
          <h2 className="text-3xl">Planning an event?</h2>
          <p className="mt-2 text-white/70">Start with one search. Search. Compare. Choose. Book.</p>
          <Link href="/venues" className="btn btn-gold mt-5">Find Your Perfect Event →</Link>
        </div>
      </section>
    </>
  );
}
