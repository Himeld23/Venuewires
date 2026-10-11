"use client";

import { createLocalStore } from "./local-store";

export type ListingStatus = "pending" | "verified" | "rejected";

export interface Listing {
  id: string;
  ownerEmail: string;
  kind: "venue" | "vendor";
  name: string;
  category?: string; // vendors: catering, decoration …  venues: Banquet, Hotel …
  zone: string;
  locality: string;
  address: string;
  contactPerson: string;
  phone: string;
  description: string;
  status: ListingStatus;
  createdAt: string;
  photos: number;
  // venue-specific
  capacityMin?: number;
  capacityMax?: number;
  priceMin?: number;
  priceMax?: number;
  parking?: number;
  food?: string;
  decoration?: string;
  amenities?: string[];
  timing?: string;
  // vendor-specific
  serviceArea?: string;
  packages?: { name: string; price: number; unit: string }[];
}

const store = createLocalStore<Listing[]>("vw-listings", []);

export const useListings = store.useValue;

export function addListing(l: Omit<Listing, "id" | "status" | "createdAt">): Listing {
  const full: Listing = {
    ...l,
    id: "L-" + Math.random().toString(36).slice(2, 7).toUpperCase(),
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  store.set([full, ...store.get()]);
  return full;
}

export function setListingStatus(id: string, status: ListingStatus) {
  store.set(store.get().map((l) => (l.id === id ? { ...l, status } : l)));
}
