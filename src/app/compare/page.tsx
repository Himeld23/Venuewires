import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { CompareView } from "@/components/CompareView";
import { getVenues } from "@/lib/api";
import { arr, type SP } from "@/lib/params";

export const metadata: Metadata = { title: "Compare Venues" };

async function CompareContent({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const all = await getVenues();
  return <CompareView all={all} urlSlugs={arr(sp.v)} />;
}

export default function ComparePage({ searchParams }: { searchParams: Promise<SP> }) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl">Compare Venues</h1>
          <p className="mt-1 text-sm text-ink/60">See the details, compare side by side and choose the perfect venue for your special day.</p>
        </div>
        <Link href="/venues" className="btn btn-outline">+ Browse more venues</Link>
      </div>
      <Suspense fallback={<p className="text-ink/50">Loading…</p>}>
        <CompareContent searchParams={searchParams} />
      </Suspense>
      <div className="card mt-10 p-6">
        <h3 className="text-xl">Need more than just a venue?</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {[["catering", "Catering"], ["decoration", "Decoration"], ["photography", "Photography & Videography"], ["makeup", "Makeup Artist"], ["mehendi", "Mehendi"]].map(([k, l]) => (
            <Link key={k} href={`/services/${k}`} className="btn btn-soft">{l} →</Link>
          ))}
        </div>
      </div>
    </div>
  );
}
