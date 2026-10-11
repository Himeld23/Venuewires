import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Built Local. Designed to Scale." };

const cities = ["Kolkata", "Bhubaneswar", "Patna", "Guwahati", "Delhi-NCR", "Mumbai", "Bengaluru", "International"];

export default function About() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-4xl">Built Local. Designed to Scale.</h1>
      <p className="mb-8 mt-1 text-sm text-ink/60">The product architecture is designed for city-by-city expansion.</p>
      <div className="grid gap-6 md:grid-cols-3">
        <div className="card p-6"><h2 className="text-xl">Venue Wires Verified</h2>
          <ul className="mt-4 space-y-2 text-sm text-ok">{["Price verified date", "Contact verified", "Facilities checked", "Availability status", "Photos / profile reviewed"].map((t) => <li key={t}>✓ {t}</li>)}</ul></div>
        <div className="card p-6"><h2 className="text-xl">Global-ready database</h2>
          <ul className="mt-4 space-y-2 text-sm text-ink/70">{["Country → State → City → Locality → Venue", "Multi-currency architecture", "Multilingual-ready content", "Local vendor networks", "SEO-ready city pages"].map((t) => <li key={t}>• {t}</li>)}</ul></div>
        <div className="rounded-2xl bg-[#f3ecdd] p-6"><h2 className="text-xl">Core product loop</h2>
          <div className="mt-6 flex flex-wrap gap-2 text-sm">{["Find", "Compare", "Plan", "Book Direct"].map((s, i) => <span key={s} className={`rounded-lg px-3 py-2 ${i === 3 ? "bg-gold text-white" : "bg-white"}`}>{s}</span>)}</div></div>
      </div>
      <h2 className="mb-4 mt-12 text-2xl">City-by-city expansion</h2>
      <div className="flex flex-wrap items-center gap-2">
        {cities.map((c, i) => (
          <span key={c} className="flex items-center gap-2"><span className={`card px-4 py-3 text-sm font-semibold ${i === 0 ? "!border-gold" : ""}`}>{c}</span>{i < cities.length - 1 && <span className="text-gold">→</span>}</span>
        ))}
      </div>
      <div className="mt-12 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-ink p-8 text-white">
        <div><h3 className="text-2xl">Find the right venue. Know the cost. Plan the event.</h3>
          <p className="mt-1 text-sm text-white/70">Transparent venue &amp; event discovery, comparison and planning infrastructure.</p></div>
        <Link href="/venues" className="btn btn-gold">Start with Kolkata →</Link>
      </div>
    </div>
  );
}
