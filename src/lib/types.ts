// Domain model. Mirrors the brief: Country → State → City → Locality → Venue.
// Nothing Kolkata-specific is hard-coded in the types.

export type Zone = "South" | "Central" | "North";
export type FoodType = "Veg" | "Non-Veg" | "Veg & Non-Veg";
export type AvailabilityStatus = "available" | "hold" | "booked" | "unavailable";

export interface Location {
  country: string;
  state: string;
  city: string;
  zone: Zone;
  locality: string;
}

export interface Venue {
  slug: string;
  name: string;
  location: Location;
  address: string;
  description: string;
  image: string;
  rating: number;
  reviews: number;
  capacityMin: number;
  capacityMax: number;
  pricePerPlateMin: number;
  pricePerPlateMax: number;
  rentalPerDay?: number;
  minGuarantee?: number;
  parking: number; // cars
  food: FoodType;
  decoration: "In-house" | "External allowed" | "Both";
  alcohol: boolean;
  rooms: boolean;
  ac: boolean;
  wifi: boolean;
  powerBackup: boolean;
  timing: string;
  venueType: "Banquet" | "Hotel" | "Resort" | "Garden" | "Rajbari";
  verified: boolean;
  priceVerifiedOn: string; // ISO date
  featured?: boolean;
}

export interface VenueFilters {
  q?: string;
  zone?: Zone[];
  capacity?: string[]; // "100-500" style buckets
  food?: FoodType[];
  parking?: boolean;
  venueType?: Venue["venueType"][];
  maxPricePerPlate?: number;
  guests?: number;
}

export type ServiceCategory =
  | "catering"
  | "decoration"
  | "photography"
  | "makeup"
  | "mehendi"
  | "entertainment"
  | "transport";

export interface VendorPackage {
  name: string;
  price: number;
  unit: string;
  summary: string;
}

export interface Vendor {
  slug: string;
  name: string;
  category: ServiceCategory;
  city: string;
  rating: number;
  reviews: number;
  verified: boolean;
  summary: string;
  image: string;
  packages: VendorPackage[];
  tags: string[];
}

export interface Enquiry {
  name: string;
  mobile: string;
  event: string;
  date: string;
  guests: number;
  budget: string;
  message: string;
  venueSlug?: string;
  vendorSlug?: string;
}
