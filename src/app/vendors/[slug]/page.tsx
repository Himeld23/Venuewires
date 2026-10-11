import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getVendor, inr } from "@/lib/api";
import { vendors } from "@/lib/data/vendors";

export function generateStaticParams() {
  return vendors.map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const v = await getVendor((await params).slug);
  return v ? { title: v.name, description: v.summary } : {};
}

export default async function VendorPage({ params }: { params: Promise<{ slug: string }> }) {
  const v = await getVendor((await params).slug);
  if (!v) notFound();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <Link href={`/services/${v.category}`} className="text-sm text-gold">← {v.category}</Link>
      <div className="card mt-4 p-6 md:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-4xl">{v.name}</h1>
            <p className="mt-1 text-sm text-gold capitalize">{v.category} • {v.city} • ★ {v.rating} ({v.reviews} reviews)</p>
            {v.verified && <p className="mt-2 text-xs font-bold text-ok">✓ Verified Vendor</p>}
            <p className="mt-3 max-w-xl text-sm text-ink/70">{v.summary}</p>
          </div>
          <div className="flex gap-2">
            <a href="tel:+916290448823" className="btn btn-gold">Call Vendor</a>
            <a href="https://wa.me/916290448823" target="_blank" rel="noreferrer" className="btn btn-soft">WhatsApp</a>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {v.packages.map((p) => (
            <div key={p.name} className="rounded-xl bg-cream p-5">
              <h3 className="text-lg">{p.name}</h3>
              <p className="mt-2 font-bold text-gold">{inr(p.price)} / {p.unit}</p>
              <p className="mt-2 text-xs text-ink/60">{p.summary}</p>
            </div>
          ))}
        </div>

        <h3 className="mt-8 text-sm font-semibold">Portfolio / menu / service areas / availability / reviews</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {v.tags.map((t) => <span key={t} className="rounded-lg bg-[#f1ede4] px-3 py-1.5 text-xs">{t}</span>)}
        </div>

        <Link href={`/enquiry?vendor=${v.slug}`} className="btn btn-gold mt-8">Send Enquiry →</Link>
      </div>
    </div>
  );
}
