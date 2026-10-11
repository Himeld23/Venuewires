"use client";

import Link from "next/link";
import { useCompare } from "@/lib/compare-store";

export function CompareBar() {
  const { slugs, clear } = useCompare();
  if (slugs.length === 0) return null;
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3">
        <p className="text-sm"><b>{slugs.length}</b> venue{slugs.length > 1 ? "s" : ""} selected <span className="text-ink/50">(2–4 to compare)</span></p>
        <div className="flex gap-2">
          <button onClick={clear} className="btn btn-soft">Clear</button>
          <Link href="/compare" className={`btn btn-gold ${slugs.length < 2 ? "pointer-events-none opacity-50" : ""}`}>Compare now →</Link>
        </div>
      </div>
    </div>
  );
}
