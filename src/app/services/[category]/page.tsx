import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getVendors, inr } from "@/lib/api";
import { categoryMeta } from "@/lib/data/vendors";
import type { ServiceCategory } from "@/lib/types";

export function generateStaticParams() {
  return Object.keys(categoryMeta).map((category) => ({ category }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const m = categoryMeta[(await params).category];
  return m ? { title: `${m.label} in Kolkata` } : {};
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const meta = categoryMeta[category];
  if (!meta) notFound();
  const list = await getVendors(category as ServiceCategory);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <Link href="/services" className="text-sm text-gold">← All services</Link>
      <h1 className="mt-2 text-4xl">{meta.label}</h1>
      <p className="mb-8 mt-1 text-sm text-ink/60">{meta.blurb}</p>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((v) => (
          <Link key={v.slug} href={`/vendors/${v.slug}`} className="card p-5 transition hover:border-gold hover:shadow-md">
            <div className="flex items-start justify-between gap-2">
              <h2 className="text-lg">{v.name}</h2>
              {v.verified && <span className="rounded-full bg-[#e8f1ec] px-2 py-0.5 text-[10px] font-semibold text-ok">✓ Verified</span>}
            </div>
            <p className="mt-1 text-xs text-gold">★ {v.rating} ({v.reviews} reviews) · {v.city}</p>
            <p className="mt-3 text-sm text-ink/70">{v.summary}</p>
            <p className="mt-4 text-sm font-semibold">From {inr(Math.min(...v.packages.map((p) => p.price)))}</p>
          </Link>
        ))}
        {list.length === 0 && <p className="text-ink/60">No partners listed yet.</p>}
      </div>
    </div>
  );
}
