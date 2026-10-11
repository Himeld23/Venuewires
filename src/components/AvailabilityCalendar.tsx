"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { getAvailability } from "@/lib/api";
import type { AvailabilityStatus } from "@/lib/types";

const COLORS: Record<AvailabilityStatus, string> = {
  available: "bg-ok text-white",
  hold: "bg-gold text-white",
  booked: "bg-bad text-white",
  unavailable: "bg-gray-300 text-gray-600",
};
const LABEL: Record<AvailabilityStatus, string> = {
  available: "AVAILABLE", hold: "ON HOLD", booked: "BOOKED", unavailable: "UNAVAILABLE",
};
const pad = (n: number) => String(n).padStart(2, "0");

export function AvailabilityCalendar({
  slug, venueName, priceText, capacityText, startYear, startMonth, initialDate, phone,
}: {
  slug: string; venueName: string; priceText: string; capacityText: string;
  startYear: number; startMonth: number; initialDate?: string; phone: string;
}) {
  const init = initialDate ? new Date(initialDate) : null;
  const [ym, setYm] = useState(() =>
    init && !isNaN(init.getTime()) ? { y: init.getFullYear(), m: init.getMonth() } : { y: startYear, m: startMonth });
  const [day, setDay] = useState<number | null>(init && !isNaN(init.getTime()) ? init.getDate() : null);

  const avail = useMemo(() => getAvailability(slug, ym.y, ym.m), [slug, ym]);
  const days = new Date(ym.y, ym.m + 1, 0).getDate();
  const lead = (new Date(ym.y, ym.m, 1).getDay() + 6) % 7; // Monday-first
  const monthName = new Date(ym.y, ym.m, 1).toLocaleString("en-IN", { month: "long", year: "numeric" });

  const move = (d: number) => {
    const t = new Date(ym.y, ym.m + d, 1);
    setYm({ y: t.getFullYear(), m: t.getMonth() });
    setDay(null);
  };

  const status = day ? avail[day] : null;
  const iso = day ? `${ym.y}-${pad(ym.m + 1)}-${pad(day)}` : "";
  const nice = day ? new Date(ym.y, ym.m, day).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "";

  return (
    <div className="card grid gap-6 p-5 md:grid-cols-[1fr_280px]">
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl text-gold">{monthName}</h3>
          <div className="flex gap-2">
            <button onClick={() => move(-1)} className="btn btn-soft !px-3" aria-label="Previous month">‹</button>
            <button onClick={() => move(1)} className="btn btn-soft !px-3" aria-label="Next month">›</button>
          </div>
        </div>
        <div className="mb-3 flex flex-wrap gap-4 text-xs text-ink/70">
          {(["available", "hold", "booked"] as const).map((s) => (
            <span key={s} className="flex items-center gap-1.5">
              <i className={`inline-block h-3 w-3 rounded-full ${COLORS[s].split(" ")[0]}`} />{s[0].toUpperCase() + s.slice(1)}
            </span>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1.5 text-center text-xs font-semibold text-ink/60">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => <div key={d}>{d}</div>)}
        </div>
        <div className="mt-2 grid grid-cols-7 gap-1.5">
          {Array.from({ length: lead }).map((_, i) => <div key={"e" + i} />)}
          {Array.from({ length: days }, (_, i) => i + 1).map((d) => (
            <button key={d} onClick={() => setDay(d)}
              className={`mx-auto aspect-square w-full max-w-11 rounded-full text-xs font-semibold ${COLORS[avail[d]]} ${day === d ? "ring-2 ring-ink ring-offset-2" : ""}`}>
              {d}
            </button>
          ))}
        </div>
        <p className="mt-4 text-xs text-ink/50">Availability last updated by the venue partner. Final confirmation happens on enquiry.</p>
      </div>

      <aside className="rounded-xl bg-cream p-5">
        <p className="text-xs text-ink/60">Selected date</p>
        {day && status ? (
          <>
            <h4 className="mt-1 text-xl">{nice}</h4>
            <p className={`mt-2 text-sm font-bold ${status === "available" ? "text-ok" : status === "hold" ? "text-gold-dark" : "text-bad"}`}>{LABEL[status]}</p>
            <p className="mt-3 text-xs text-ink/60">Capacity: {capacityText}</p>
            <p className="mt-1 text-sm font-semibold">{priceText}</p>
            <div className="mt-5 flex flex-col gap-2">
              {status === "booked" || status === "unavailable" ? (
                <p className="text-xs text-ink/60">This date isn&apos;t open. Try another date or compare similar venues.</p>
              ) : (
                <Link href={`/enquiry?venue=${slug}&date=${iso}`} className="btn btn-gold">Enquire Now</Link>
              )}
              <a href={`tel:${phone}`} className="btn btn-outline">Call Direct</a>
            </div>
          </>
        ) : (
          <p className="mt-3 text-sm text-ink/60">Pick a date on {venueName}&apos;s calendar to see its status.</p>
        )}
      </aside>
    </div>
  );
}
