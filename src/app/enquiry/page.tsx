import type { Metadata } from "next";
import { Suspense } from "react";
import { EnquiryForm } from "@/components/EnquiryForm";
import { getVendor, getVenue, priceRange, inr } from "@/lib/api";
import { one, type SP } from "@/lib/params";

export const metadata: Metadata = { title: "Send Enquiry" };

export default function EnquiryPage({ searchParams }: { searchParams: Promise<SP> }) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-4xl">Send Enquiry</h1>
      <p className="mb-8 mt-1 text-sm text-ink/60">Share the event details once. Venue Wires routes the requirement to the selected partner.</p>
      <Suspense fallback={<p className="text-ink/50">Loading…</p>}>
        <EnquiryContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function EnquiryContent({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const venue = one(sp.venue) ? await getVenue(one(sp.venue)!) : undefined;
  const vendor = !venue && one(sp.vendor) ? await getVendor(one(sp.vendor)!) : undefined;

  const target = venue
    ? { type: "venue" as const, slug: venue.slug, name: venue.name, price: priceRange(venue) }
    : vendor
      ? { type: "vendor" as const, slug: vendor.slug, name: vendor.name, price: `From ${inr(Math.min(...vendor.packages.map((p) => p.price)))}` }
      : { type: "venue" as const, slug: "", name: "Venue Wires team", price: "We'll recommend options" };

  return (
    <EnquiryForm
      targetType={target.type} targetSlug={target.slug} targetName={target.name} targetPrice={target.price}
      defaults={{ date: one(sp.date), guests: one(sp.guests), event: one(sp.event) }}
    />
  );
}
