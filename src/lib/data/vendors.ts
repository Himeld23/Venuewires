import type { Vendor } from "../types";

// Placeholder vendors for the prototype (the live site has no vendor directory yet).
const img = "https://venuewires.in/wp-content/uploads/2024/07/WhatsApp-Image-2024-06-29-at-4.43.46-PM.jpeg";

export const vendors: Vendor[] = [
  {
    slug: "royal-feast-catering", name: "Royal Feast Catering", category: "catering", city: "Kolkata",
    rating: 4.7, reviews: 86, verified: true, image: img,
    summary: "Wedding and corporate catering with live counters and Bengali menus.",
    tags: ["Wedding catering", "Corporate lunch", "Live counters", "Bengali menu", "North Indian", "Desserts"],
    packages: [
      { name: "Silver", price: 650, unit: "plate", summary: "Standard menu • 18 items" },
      { name: "Gold", price: 900, unit: "plate", summary: "Premium menu • 24 items" },
      { name: "Platinum", price: 1250, unit: "plate", summary: "Signature menu • 32 items" },
    ],
  },
  {
    slug: "bloom-and-bough-decor", name: "Bloom & Bough Decor", category: "decoration", city: "Kolkata",
    rating: 4.6, reviews: 52, verified: true, image: img,
    summary: "Stage, floral, lighting and theme decoration.",
    tags: ["Floral", "Stage", "Bengali traditional", "Lighting"],
    packages: [
      { name: "Classic", price: 70000, unit: "event", summary: "Stage + entrance floral" },
      { name: "Premium", price: 150000, unit: "event", summary: "Full hall theme + lighting" },
    ],
  },
  {
    slug: "frame-story-studio", name: "Frame Story Studio", category: "photography", city: "Kolkata",
    rating: 4.8, reviews: 64, verified: true, image: img,
    summary: "Candid photography, cinematic video and reels.",
    tags: ["Candid", "Cinematic video", "Reels", "Pre-wedding"],
    packages: [
      { name: "Basic", price: 45000, unit: "event", summary: "1 photographer, 8 hours" },
      { name: "Premium", price: 80000, unit: "event", summary: "Photo + cinematic video team" },
    ],
  },
  {
    slug: "glow-bridal-makeovers", name: "Glow Bridal Makeovers", category: "makeup", city: "Kolkata",
    rating: 4.5, reviews: 41, verified: false, image: img,
    summary: "Bridal, party and family makeup.",
    tags: ["Bridal", "HD makeup", "Family"],
    packages: [
      { name: "Party", price: 10000, unit: "person", summary: "Party look" },
      { name: "Bridal", price: 25000, unit: "person", summary: "Full bridal with trial" },
    ],
  },
  {
    slug: "henna-by-riya", name: "Henna by Riya", category: "mehendi", city: "Kolkata",
    rating: 4.6, reviews: 33, verified: true, image: img,
    summary: "Bridal and guest mehendi.",
    tags: ["Bridal", "Guest mehendi", "Arabic"],
    packages: [{ name: "Group", price: 20000, unit: "5 people", summary: "Bride + 4 guests" }],
  },
  {
    slug: "beatbox-entertainment", name: "Beatbox Entertainment", category: "entertainment", city: "Kolkata",
    rating: 4.4, reviews: 29, verified: false, image: img,
    summary: "DJ, live music and anchors.",
    tags: ["DJ", "Live band", "Anchor"],
    packages: [{ name: "DJ Night", price: 20000, unit: "event", summary: "DJ + sound" }],
  },
  {
    slug: "regal-wheels", name: "Regal Wheels", category: "transport", city: "Kolkata",
    rating: 4.5, reviews: 24, verified: true, image: img,
    summary: "Luxury cars and guest transport.",
    tags: ["Luxury cars", "Guest transport"],
    packages: [{ name: "Luxury car", price: 2300, unit: "10 hours", summary: "BMW / Honda City / Verna" }],
  },
];

export const categoryMeta: Record<string, { label: string; blurb: string }> = {
  catering: { label: "Catering", blurb: "Menus, live counters, service staff" },
  decoration: { label: "Decoration", blurb: "Stage, floral, lighting, theme" },
  photography: { label: "Photography & Videography", blurb: "Photo, cinematic video, reels" },
  makeup: { label: "Makeup Artist", blurb: "Bridal, party, family makeup" },
  mehendi: { label: "Mehendi Artist", blurb: "Bridal and guest mehendi" },
  entertainment: { label: "Entertainment", blurb: "DJ, live music, anchors" },
  transport: { label: "Transportation", blurb: "Luxury cars, guest transport" },
};
