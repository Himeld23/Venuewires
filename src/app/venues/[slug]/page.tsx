import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import type { Venue } from "@/lib/types";
import { fmtDate, getVenue, priceRange } from "@/lib/api";
import { venues } from "@/lib/data/venues";
import { AvailabilityCalendar } from "@/components/AvailabilityCalendar";
import { VerifiedBadge } from "@/components/VenueCard";
import { one, type SP } from "@/lib/params";

const PHONE = "+916290448823";

export function generateStaticParams() {
  return venues.map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const v = await getVenue((await params).slug);
  return v ? { title: `${v.name}, ${v.location.locality}`, description: v.description } : {};
}

// Reads the ?date= param and today's date, so it must render at request time inside Suspense.
async function CalendarSection({ v, searchParams }: { v: Venue; searchParams: Promise<SP> }) {
  const date = one((await searchParams).date);
  const now = new Date();
  return (
    <AvailabilityCalendar
      slug={v.slug} venueName={v.name} priceText={priceRange(v)} capacityText={`${v.capacityMin} – ${v.capacityMax}`}
      startYear={now.getFullYear()} startMonth={now.getMonth()} initialDate={date} phone={PHONE}
    />
  );
}

export default async function VenuePage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<SP> }) {
  const { slug } = await params;
  const v = await getVenue(slug);
  if (!v) notFound();

  const facts: [string, string][] = [
    ["Capacity", `${v.capacityMin} – ${v.capacityMax}`],
    ["Parking", `${v.parking} cars`],
    ["Food", v.food],
    ["Decoration", v.decoration],
    ["Alcohol", v.alcohol ? "Available" : "Not available"],
    ["Rooms", v.rooms ? "Available" : "Not available"],
    ["AC", v.ac ? "Yes" : "No"],
    ["Wi-Fi", v.wifi ? "Yes" : "No"],
    ["Power backup", v.powerBackup ? "Yes" : "No"],
    ["Timing", v.timing],
    ["Venue type", v.venueType],
    ["Min. guarantee", v.minGuarantee ? `${v.minGuarantee} guests` : "On request"],
  ];

  const jsonLd = {
    "@context": "https://schema.org", "@type": "EventVenue", name: v.name, address: v.address,
    aggregateRating: { "@type": "AggregateRating", ratingValue: v.rating, reviewCount: v.reviews },
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Link href="/venues" className="text-sm text-gold">← All venues</Link>

      <div className="mt-4 overflow-hidden rounded-2xl bg-line">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={v.image} alt={v.name} className="h-72 w-full object-cover md:h-96" />
      </div>

      <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-4xl">{v.name}</h1>
          <p className="mt-1 text-sm text-gold">{v.location.locality}, {v.location.city} | ★ {v.rating} ({v.reviews} reviews)</p>
          <p className="mt-1 text-xs text-ink/60">{v.address}</p>
          <p className="mt-3 text-lg font-semibold">{priceRange(v)}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <a href={`tel:${PHONE}`} className="btn btn-gold">Call Direct</a>
          <a href={`https://wa.me/916290448823?text=${encodeURIComponent(`Hi, I'm interested in ${v.name}`)}`} target="_blank" rel="noreferrer" className="btn btn-soft">WhatsApp</a>
          <Link href={`/enquiry?venue=${v.slug}`} className="btn btn-outline">Send Enquiry</Link>
          <Link href={`/compare?v=${v.slug}`} className="btn btn-outline">+ Compare</Link>
        </div>
      </div>

      <p className="mt-5 max-w-3xl text-ink/75">{v.description}</p>

      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        {facts.map(([k, val]) => (
          <div key={k} className="card p-4">
            <p className="text-xs text-ink/60">{k}</p>
            <p className="mt-2 font-serif text-lg">{val}</p>
          </div>
        ))}
      </div>

      {v.verified ? (
        <div className="mt-5 flex flex-wrap items-center gap-3 rounded-xl border border-[#cfe3d7] bg-[#eef6f1] p-4 text-xs font-semibold text-ok">
          <VerifiedBadge />
          <span>Price last verified: {fmtDate(v.priceVerifiedOn)}</span><span>• Contact verified</span>
          <span>• Facilities checked</span><span>• Availability checked</span>
        </div>
      ) : (
        <div className="mt-5 rounded-xl border border-line bg-white p-4 text-xs text-ink/60">Verification pending — pricing and availability are indicative.</div>
      )}

      <h2 className="mt-12 text-3xl">Check Availability</h2>
      <p className="mb-4 text-sm text-ink/60">See date-wise availability before you enquire.</p>
      <Suspense fallback={<div className="card h-96 animate-pulse" />}>
        <CalendarSection v={v} searchParams={searchParams} />
      </Suspense>

      <div className="card mt-10 flex flex-wrap items-center justify-between gap-4 p-6">
        <div>
          <h3 className="text-xl">Need more than just a venue?</h3>
          <p className="text-sm text-ink/60">Add catering, decoration, photography and more to your plan.</p>
        </div>
        <Link href={`/build-event?venue=${v.slug}`} className="btn btn-gold">Build my event with {v.name} →</Link>
      </div>
    </div>
  );
}
