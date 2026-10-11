import type { Metadata } from "next";
import Link from "next/link";
import { categoryMeta } from "@/lib/data/vendors";

export const metadata: Metadata = { title: "Event Services" };

export default function ServicesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-4xl">One Event. Every Service. One Platform.</h1>
      <p className="mb-8 mt-1 text-sm text-ink/60">Book the services around your venue from verified local partners.</p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Object.entries(categoryMeta).map(([k, m]) => (
          <div key={k} className="card flex flex-col p-5">
            <h2 className="text-lg">{m.label}</h2>
            <p className="mt-1 text-xs text-ink/60">{m.blurb}</p>
            <Link href={`/services/${k}`} className="btn btn-soft mt-5 self-start">Explore →</Link>
          </div>
        ))}
      </div>
      <div className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-[#f3ecdd] p-6">
        <div><h3 className="text-xl">Verified Partner Network</h3>
          <p className="text-sm text-ink/60">Compare pricing, portfolio, availability and customer reviews before you book.</p></div>
        <Link href="/build-event" className="btn btn-gold">Build my event</Link>
      </div>
    </div>
  );
}
