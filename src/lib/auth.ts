"use client";

import { createLocalStore } from "./local-store";

export type Role = "venue" | "vendor" | "admin";

export interface Account {
  email: string;
  phone?: string;
  password: string; // PROTOTYPE ONLY: plaintext. Backend phase: hashed passwords / OTP auth.
  name: string;
  business: string;
  role: Role;
}

export interface Session {
  email: string;
  name: string;
  business: string;
  role: Role;
}

// Demo accounts for client presentations. Shown on the login page.
export const DEMO_ACCOUNTS: Account[] = [
  { email: "venue@venuewires.demo", phone: "9830000001", password: "Venue@123", name: "Rahul Sharma", business: "Shagun Banquet", role: "venue" },
  { email: "vendor@venuewires.demo", phone: "9830000002", password: "Vendor@123", name: "Anita Das", business: "Royal Feast Catering", role: "vendor" },
  { email: "admin@venuewires.demo", phone: "9830000003", password: "Admin@123", name: "Venue Wires Admin", business: "Venue Wires", role: "admin" },
];

const accounts = createLocalStore<Account[]>("vw-accounts", []);
const sessionStore = createLocalStore<Session | null>("vw-session", null);

export const useSession = sessionStore.useValue;

const norm = (s: string) => s.trim().toLowerCase().replace(/[\s-]/g, "");
const toSession = (a: Account): Session => ({ email: a.email, name: a.name, business: a.business, role: a.role });

export function login(id: string, password: string): Session | null {
  const key = norm(id.replace(/^\+?91/, ""));
  const acc = [...DEMO_ACCOUNTS, ...accounts.get()].find(
    (a) => (norm(a.email) === norm(id) || (a.phone && norm(a.phone.replace(/^\+?91/, "")) === key)) && a.password === password,
  );
  if (!acc) return null;
  const s = toSession(acc);
  sessionStore.set(s);
  return s;
}

export function register(acc: Account): Session | "exists" {
  const all = [...DEMO_ACCOUNTS, ...accounts.get()];
  if (all.some((a) => norm(a.email) === norm(acc.email))) return "exists";
  accounts.set([...accounts.get(), acc]);
  const s = toSession(acc);
  sessionStore.set(s);
  return s;
}

export const logout = () => sessionStore.set(null);

export const dashboardPath = (r: Role) => (r === "admin" ? "/admin" : `/partner/${r}`);
