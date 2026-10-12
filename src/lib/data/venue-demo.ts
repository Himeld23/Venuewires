import type { Lead } from "./vendor-demo";

// Demo content for the venue dashboard walkthrough (Shagun Banquet). Placeholder data.

export const venueDemoLeads: Lead[] = [
  { id: "V1", name: "Ritu & Karan Jalan", event: "Wedding", guests: 300, date: "2026-11-28", budget: "₹5L – ₹7L", status: "New", message: "Looking for the main hall + lawn for the reception. Is Nov 28 free?", received: "1 hour ago", phone: "+91 98310 11111" },
  { id: "V2", name: "TCS — Events Desk", event: "Corporate", guests: 180, date: "2026-10-29", budget: "₹2L – ₹3L", status: "New", message: "Annual dinner with a small stage and AV setup.", received: "4 hours ago", phone: "+91 98310 22222" },
  { id: "V3", name: "Mahesh Gupta", event: "Birthday", guests: 120, date: "2026-10-24", budget: "₹1.5L – ₹2L", status: "Contacted", message: "60th birthday, veg only. Need decoration quote.", received: "Yesterday", phone: "+91 98310 33333" },
  { id: "V4", name: "Ananya & Siddharth", event: "Engagement", guests: 250, date: "2026-12-05", budget: "₹4L – ₹5L", status: "Quoted", message: "Shared the Gold package quote. Waiting for site visit date.", received: "2 days ago", phone: "+91 98310 44444" },
  { id: "V5", name: "Suman Biswas", event: "Wedding", guests: 280, date: "2026-11-15", budget: "₹5L – ₹6L", status: "Won", message: "Booked. 40% advance received.", received: "4 days ago", phone: "+91 98310 55555" },
  { id: "V6", name: "Priyanka Roy", event: "Anniversary", guests: 100, date: "2026-11-02", budget: "₹1L – ₹1.5L", status: "Lost", message: "Chose a smaller hall closer to home.", received: "1 week ago", phone: "+91 98310 66666" },
];

export const callsWeek = { labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], calls: [4, 6, 3, 7, 9, 8, 5], enquiries: [9, 11, 8, 12, 15, 14, 17] };
export const callsMonth = {
  labels: ["W1", "W2", "W3", "W4"], calls: [31, 38, 42, 47], enquiries: [58, 66, 79, 86],
};
export const peakHours = [
  ["9–11 AM", 14], ["11 AM–1 PM", 22], ["1–3 PM", 9], ["3–5 PM", 17], ["5–7 PM", 31], ["7–9 PM", 24],
] as const;

export const demoPhotos = [
  "https://venuewires.in/wp-content/uploads/2024/08/d33f402b-b1b5-4452-9ea8-2043e84bf981-1024x576.png",
  "https://venuewires.in/wp-content/uploads/2024/08/f44425d1-138f-43d9-9c9d-1104f5c6f017-1024x576.png",
  "https://venuewires.in/wp-content/uploads/2024/07/WhatsApp-Image-2024-06-29-at-4.48.09-PM-1024x768.jpeg",
  "https://venuewires.in/wp-content/uploads/2024/07/WhatsApp-Image-2024-06-29-at-4.55.55-PM-1024x682.jpeg",
];

export const venuePlans = [
  { name: "Basic", price: "Free", note: "Standard listing, up to 10 leads / month" },
  { name: "Featured", price: "₹4,999 / mo", note: "Priority in search, unlimited leads, analytics" },
  { name: "Premium", price: "₹9,999 / mo", note: "Top placement, homepage feature, dedicated manager" },
];
