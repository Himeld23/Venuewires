import type { Metadata } from "next";
import { Suspense } from "react";
import { BuildEvent } from "@/components/BuildEvent";
import { getVendors, getVenues } from "@/lib/api";
import { one, type SP } from "@/lib/params";

export const metadata: Metadata = { title: "Build Your Event" };

async function BuildContent({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const [venues, vendors] = await Promise.all([getVenues(), getVendors()]);
  return <BuildEvent venues={venues} vendors={vendors} initialVenue={one(sp.venue)} />;
}

export default function BuildEventPage({ searchParams }: { searchParams: Promise<SP> }) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-4xl">Build Your Event</h1>
      <p className="mb-8 mt-1 text-sm text-ink/60">Choose the venue and services. Venue Wires estimates the total event budget.</p>
      <Suspense fallback={<p className="text-ink/50">Loading…</p>}>
        <BuildContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
