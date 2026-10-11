import type { Location, Venue, Zone } from "../types";

// Seed data. Names, areas, capacity and starting prices come from venuewires.in.
// Ratings, review counts, parking, policies and verification dates are PLACEHOLDERS
// for the prototype and must be replaced by verified data from the backend.

const U = "https://venuewires.in/wp-content/uploads";
const loc = (zone: Zone, locality: string): Location => ({
  country: "India",
  state: "West Bengal",
  city: "Kolkata",
  zone,
  locality,
});

type Seed = Omit<
  Venue,
  | "description" | "decoration" | "alcohol" | "rooms" | "ac" | "wifi" | "powerBackup"
  | "timing" | "verified" | "priceVerifiedOn" | "venueType"
> &
  Partial<Venue>;

const seeds: Seed[] = [
  {
    slug: "shagun-banquet", name: "Shagun Banquet", location: loc("South", "Tangra, Topsia"),
    address: "86, Seal Lane, Tangra, Topsia, Kolkata, West Bengal 700046",
    image: `${U}/2024/08/d33f402b-b1b5-4452-9ea8-2043e84bf981-1024x576.png`,
    rating: 4.5, reviews: 124, capacityMin: 100, capacityMax: 300, pricePerPlateMin: 1400,
    pricePerPlateMax: 1800, parking: 35, food: "Veg & Non-Veg", featured: true, minGuarantee: 100,
    alcohol: true, rooms: false,
    description: "Large indoor banquet hall plus a lawn for pre-wedding ceremonies. In-house catering and decoration, complimentary changing rooms and 6-hour event slots.",
  },
  {
    slug: "ojas-banquet", name: "Ojas Banquet", location: loc("South", "Topsia"),
    address: "3rd floor, Haute Street, Mahindra Showroom Building, Topsia Road, 86A, JBS Haldane Ave, Kolkata 700046",
    image: `${U}/2024/08/f44425d1-138f-43d9-9c9d-1104f5c6f017-1024x576.png`,
    rating: 4.3, reviews: 98, capacityMin: 200, capacityMax: 2000, pricePerPlateMin: 1500,
    pricePerPlateMax: 1900, parking: 50, food: "Veg & Non-Veg", featured: true, minGuarantee: 200,
    alcohol: true, rooms: true,
    description: "Grand multi-hall banquet suited to large weddings and receptions, with ample parking and on-site rooms.",
  },
  {
    slug: "imperio-banquet", name: "Imperio Banquet", location: loc("Central", "Park Street area"),
    address: "Park Street area, Central Kolkata", image: `${U}/2024/07/WhatsApp-Image-2024-05-27-at-8.52.00-PM-1-1024x768.jpeg`,
    rating: 4.4, reviews: 61, capacityMin: 70, capacityMax: 130, pricePerPlateMin: 1400,
    pricePerPlateMax: 1700, parking: 12, food: "Veg & Non-Veg", alcohol: true, rooms: false,
    description: "Intimate banquet for small weddings, engagements and corporate gatherings in the heart of the city.",
  },
  {
    slug: "japanese-forest", name: "Japanese Forest", location: loc("North", "New Town"),
    address: "New Town, Kolkata", image: `${U}/2024/07/WhatsApp-Image-2024-06-29-at-4.48.09-PM-1024x768.jpeg`,
    rating: 4.2, reviews: 47, capacityMin: 600, capacityMax: 1200, pricePerPlateMin: 1500,
    pricePerPlateMax: 1900, parking: 120, food: "Veg & Non-Veg", venueType: "Garden", alcohol: true, rooms: false,
    description: "Open garden-style venue with a lush green setting, built for large celebrations.",
  },
  {
    slug: "beyzaa-hotel-suites", name: "Beyzaa Hotel & Suites", location: loc("North", "Saltlake"),
    address: "Saltlake, Kolkata", image: `${U}/2024/07/WhatsApp-Image-2024-06-29-at-4.48.14-PM-1024x768.jpeg`,
    rating: 4.4, reviews: 72, capacityMin: 100, capacityMax: 400, pricePerPlateMin: 2200,
    pricePerPlateMax: 2800, parking: 40, food: "Veg & Non-Veg", venueType: "Hotel", alcohol: true, rooms: true,
    description: "Hotel banquet with suites on site, ideal for weddings with outstation guests.",
  },
  {
    slug: "baro-kuthi-rajbari", name: "Baro Kuthi Rajbari", location: loc("North", "Belgachia"),
    address: "Belgachia, Kolkata", image: `${U}/2024/07/WhatsApp-Image-2024-06-29-at-4.43.46-PM.jpeg`,
    rating: 4.6, reviews: 38, capacityMin: 100, capacityMax: 700, pricePerPlateMin: 1700,
    pricePerPlateMax: 2200, parking: 30, food: "Veg & Non-Veg", venueType: "Rajbari", alcohol: false, rooms: false,
    description: "A heritage rajbari with courtyards and pillared halls, popular for traditional Bengali weddings.",
  },
  {
    slug: "aquatica-hotel-and-resort", name: "Aquatica Hotel & Resort", location: loc("North", "Rajarhat"),
    address: "Rajarhat, Kolkata", image: `${U}/2024/07/WhatsApp-Image-2024-06-29-at-4.57.27-PM-2-1024x768.jpeg`,
    rating: 4.3, reviews: 83, capacityMin: 200, capacityMax: 2000, pricePerPlateMin: 1800,
    pricePerPlateMax: 2400, parking: 150, food: "Veg & Non-Veg", venueType: "Resort", alcohol: true, rooms: true,
    description: "Resort-style venue with lawns, banquet halls and rooms, suited to destination-feel weddings in the city.",
  },
  {
    slug: "aristocrat-hotel", name: "Aristocrat Hotel", location: loc("North", "New Town"),
    address: "New Town, Kolkata", image: `${U}/2024/07/WhatsApp-Image-2024-06-29-at-4.55.55-PM-1024x682.jpeg`,
    rating: 4.1, reviews: 55, capacityMin: 100, capacityMax: 800, pricePerPlateMin: 1900,
    pricePerPlateMax: 2500, parking: 60, food: "Veg & Non-Veg", venueType: "Hotel", alcohol: true, rooms: true,
    description: "Hotel with multiple halls scalable from small functions to 800-guest receptions.",
  },
  {
    slug: "agora-banquet", name: "Agora Banquet", location: loc("South", "New Alipore"),
    address: "New Alipore, Kolkata", image: `${U}/2024/07/WhatsApp-Image-2024-06-29-at-5.03.05-PM-1024x470.jpeg`,
    rating: 4.2, reviews: 44, capacityMin: 100, capacityMax: 220, pricePerPlateMin: 1450,
    pricePerPlateMax: 1750, parking: 20, food: "Veg & Non-Veg", alcohol: false, rooms: false,
    description: "Compact banquet in New Alipore for engagements, birthdays and small weddings.",
  },
  {
    slug: "galleria-1910", name: "Galleria 1910", location: loc("Central", "Camac Street"),
    address: "Camac Street, Kolkata", image: `${U}/2024/06/WhatsApp-Image-2024-05-27-at-8.49.55-PM-1024x770.jpeg`,
    rating: 4.7, reviews: 109, capacityMin: 200, capacityMax: 600, pricePerPlateMin: 2500,
    pricePerPlateMax: 3200, parking: 45, food: "Veg & Non-Veg", venueType: "Hotel", featured: true,
    alcohol: true, rooms: true,
    description: "Premium Camac Street venue with a refined setting for weddings and corporate events.",
  },
];

export const venues: Venue[] = seeds.map((s, i) => ({
  description: "",
  decoration: "In-house",
  alcohol: true,
  rooms: false,
  ac: true,
  wifi: true,
  powerBackup: true,
  timing: "11 AM – 11 PM",
  venueType: "Banquet",
  verified: i % 4 !== 3,
  priceVerifiedOn: "2026-09-28",
  ...s,
}));
