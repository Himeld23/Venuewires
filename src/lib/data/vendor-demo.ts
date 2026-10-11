// Demo content for the vendor dashboard walkthrough (Royal Feast Catering). Placeholder data.

export type LeadStatus = "New" | "Contacted" | "Quoted" | "Won" | "Lost";

export interface Lead {
  id: string;
  name: string;
  event: string;
  guests: number;
  date: string;
  budget: string;
  status: LeadStatus;
  message: string;
  received: string;
  phone: string;
}

export const demoLeads: Lead[] = [
  { id: "L1", name: "Sneha & Arjun Mitra", event: "Wedding", guests: 300, date: "2026-11-22", budget: "₹5L – ₹7L", status: "New", message: "Need Bengali wedding menu with fish counters and live mishti station.", received: "2 hours ago", phone: "+91 98300 11111" },
  { id: "L2", name: "Infosys BPM — Admin", event: "Corporate", guests: 200, date: "2026-10-30", budget: "₹1.5L – ₹2L", status: "New", message: "Annual day lunch, mostly North Indian and a few Bengali items.", received: "5 hours ago", phone: "+91 98300 22222" },
  { id: "L3", name: "Priya Banerjee", event: "Reception", guests: 450, date: "2026-12-06", budget: "₹8L – ₹10L", status: "Quoted", message: "Platinum menu for reception, please share tasting slots.", received: "Yesterday", phone: "+91 98300 33333" },
  { id: "L4", name: "Rohit Agarwal", event: "Birthday", guests: 100, date: "2026-10-25", budget: "₹80K – ₹1L", status: "Contacted", message: "50th birthday, North Indian veg only.", received: "Yesterday", phone: "+91 98300 44444" },
  { id: "L5", name: "Debjani Sen", event: "Engagement", guests: 180, date: "2026-11-14", budget: "₹2.5L – ₹3.5L", status: "Won", message: "Gold package confirmed, advance paid.", received: "3 days ago", phone: "+91 98300 55555" },
  { id: "L6", name: "Kolkata Rotary Club", event: "Social", guests: 250, date: "2026-11-02", budget: "₹2L – ₹3L", status: "Contacted", message: "Annual dinner, buffet with live pasta counter.", received: "4 days ago", phone: "+91 98300 66666" },
  { id: "L7", name: "Aman Kapoor", event: "Wedding", guests: 600, date: "2026-12-12", budget: "₹12L+", status: "Lost", message: "Went with an in-house caterer at the venue.", received: "1 week ago", phone: "+91 98300 77777" },
  { id: "L8", name: "Ritika Ghosh", event: "Corporate", guests: 120, date: "2026-11-09", budget: "₹1L – ₹1.4L", status: "Quoted", message: "Product launch lunch, Silver or Gold.", received: "1 week ago", phone: "+91 98300 88888" },
];

export const demoReviews = [
  { name: "Debjani Sen", rating: 5, date: "Sep 2026", text: "The Bengali spread was outstanding — guests are still talking about the kosha mangsho. Service staff were polished and on time." },
  { name: "Sourav Dutta", rating: 5, date: "Aug 2026", text: "Handled 500 guests flawlessly. Live counters were a hit and nothing ran out." },
  { name: "Meera Joshi", rating: 4, date: "Aug 2026", text: "Great food and presentation. Dessert counter could have opened a little earlier." },
  { name: "Anirban Roy", rating: 5, date: "Jul 2026", text: "Transparent pricing, tasting session before booking. Highly recommend the Gold menu." },
  { name: "Pallavi Shah", rating: 4, date: "Jun 2026", text: "Good variety for a corporate lunch. Will book again." },
];

export const demoViews = [112, 128, 98, 141, 156, 133, 172];

export const demoInvoices = [
  { id: "INV-1042", date: "01 Oct 2026", item: "Featured listing — October", amount: "₹2,999", status: "Paid" },
  { id: "INV-0987", date: "01 Sep 2026", item: "Featured listing — September", amount: "₹2,999", status: "Paid" },
  { id: "INV-0921", date: "01 Aug 2026", item: "Featured listing — August", amount: "₹2,999", status: "Paid" },
];

export const demoPlans = [
  { name: "Free", price: "₹0", note: "Basic listing, 5 leads / month", current: false },
  { name: "Growth", price: "₹2,999 / mo", note: "Featured placement, unlimited leads, analytics", current: true },
  { name: "Pro", price: "₹5,999 / mo", note: "Top placement, verified badge boost, priority support", current: false },
];
