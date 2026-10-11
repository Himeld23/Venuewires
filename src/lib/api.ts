// Data-access layer. Every page talks to these functions only.
// For the backend phase, replace the bodies with fetch()/DB calls — signatures stay the same.

import { venues } from "./data/venues";
import { vendors } from "./data/vendors";
import type { AvailabilityStatus, Vendor, Venue, VenueFilters, ServiceCategory, Zone, FoodType } from "./types";

export async function getVenues(f: VenueFilters = {}): Promise<Venue[]> {
  return venues.filter((v) => {
    if (f.q) {
      const hay = `${v.name} ${v.location.locality} ${v.location.zone} ${v.venueType}`.toLowerCase();
      if (!hay.includes(f.q.toLowerCase())) return false;
    }
    if (f.zone?.length && !f.zone.includes(v.location.zone)) return false;
    if (f.food?.length && !f.food.includes(v.food)) return false;
    if (f.venueType?.length && !f.venueType.includes(v.venueType)) return false;
    if (f.parking && v.parking <= 0) return false;
    if (f.maxPricePerPlate && v.pricePerPlateMin > f.maxPricePerPlate) return false;
    if (f.guests && (f.guests < v.capacityMin * 0.5 || f.guests > v.capacityMax)) return false;
    if (f.capacity?.length) {
      const ok = f.capacity.some((b) => {
        const [lo, hi] = b.split("-").map(Number);
        return v.capacityMax >= lo && v.capacityMin <= hi;
      });
      if (!ok) return false;
    }
    return true;
  });
}

export async function getVenue(slug: string): Promise<Venue | undefined> {
  return venues.find((v) => v.slug === slug);
}

export async function getVenuesBySlugs(slugs: string[]): Promise<Venue[]> {
  return slugs.map((s) => venues.find((v) => v.slug === s)).filter((v): v is Venue => !!v);
}

export async function getFeaturedVenues(): Promise<Venue[]> {
  return venues.filter((v) => v.featured);
}

export async function getVendors(category?: ServiceCategory): Promise<Vendor[]> {
  return category ? vendors.filter((v) => v.category === category) : vendors;
}

export async function getVendor(slug: string): Promise<Vendor | undefined> {
  return vendors.find((v) => v.slug === slug);
}

// ---- Availability (deterministic mock; backend will return real calendar rows) ----

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function getAvailability(slug: string, year: number, month: number): Record<number, AvailabilityStatus> {
  const days = new Date(year, month + 1, 0).getDate();
  const out: Record<number, AvailabilityStatus> = {};
  for (let d = 1; d <= days; d++) {
    const n = hash(`${slug}-${year}-${month}-${d}`) % 10;
    out[d] = n < 2 ? "booked" : n === 2 ? "hold" : n === 3 && d % 7 === 0 ? "unavailable" : "available";
  }
  return out;
}

// ---- Smart Budget Match: rule-based, no AI (per brief) ----

export interface BudgetInput {
  guests: number;
  budgetMin: number;
  budgetMax: number;
  zone?: Zone | "";
  food?: FoodType | "";
}

export interface BudgetMatch {
  venue: Venue;
  score: number;
  estMin: number;
  estMax: number;
  reasons: string[];
}

export async function matchBudget(i: BudgetInput): Promise<BudgetMatch[]> {
  const res: BudgetMatch[] = venues.map((venue) => {
    const estMin = venue.pricePerPlateMin * i.guests;
    const estMax = venue.pricePerPlateMax * i.guests;
    const reasons: string[] = [];
    let score = 0;

    if (i.guests >= venue.capacityMin && i.guests <= venue.capacityMax) { score += 40; reasons.push("Fits guest count"); }
    else if (i.guests <= venue.capacityMax) score += 15;

    if (estMin <= i.budgetMax && estMax >= i.budgetMin) {
      score += 35; reasons.push("Within budget");
    } else if (estMin > i.budgetMax) {
      score += Math.max(0, 20 - Math.round(((estMin - i.budgetMax) / i.budgetMax) * 100));
    }

    if (!i.zone || venue.location.zone === i.zone) { score += 15; if (i.zone) reasons.push("Fits location"); }
    if (!i.food || venue.food === i.food) score += 5;
    if (venue.verified) { score += 5; reasons.push("Verified pricing"); }

    return { venue, score: Math.min(100, score), estMin, estMax, reasons };
  });
  return res.sort((a, b) => b.score - a.score).slice(0, 5);
}

// ---- Enquiry (prototype: logs only) ----

export const ENQUIRY_ENDPOINT = "/api/enquiry";

// ---- Formatting helpers ----

export const inr = (n: number) => "₹" + n.toLocaleString("en-IN");

export function inrShort(n: number) {
  if (n >= 100000) return `₹${(n / 100000).toFixed(n % 100000 === 0 ? 0 : 1)}L`;
  if (n >= 1000) return `₹${Math.round(n / 1000)}K`;
  return `₹${n}`;
}

export function priceRange(v: Venue) {
  return `${inr(v.pricePerPlateMin)} – ${inr(v.pricePerPlateMax)} / plate`;
}

export function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}
