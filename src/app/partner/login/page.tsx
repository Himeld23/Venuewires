"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/Logo";
import { DEMO_ACCOUNTS, dashboardPath, login } from "@/lib/auth";

const roleLabel = { venue: "Venue Partner", vendor: "Vendor Partner", admin: "Admin" } as const;

export default function PartnerLogin() {
  const router = useRouter();
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const s = login(id, pw);
    if (!s) return setError("Incorrect email/mobile or password.");
    router.push(dashboardPath(s.role));
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-8 px-4 py-14 lg:grid-cols-[1fr_380px]">
      <form onSubmit={submit} className="card space-y-4 p-8">
        <div className="flex justify-center"><Logo /></div>
        <h1 className="text-center text-2xl">Partner Login</h1>
        <p className="text-center text-sm text-ink/60">Manage your listing, leads, pricing and availability.</p>
        <div><label className="label">Email / Mobile</label>
          <input className="input" value={id} onChange={(e) => { setId(e.target.value); setError(""); }} placeholder="Enter registered email or mobile" autoComplete="username" required /></div>
        <div><label className="label">Password</label>
          <input type="password" className="input" value={pw} onChange={(e) => { setPw(e.target.value); setError(""); }} placeholder="Enter password" autoComplete="current-password" required /></div>
        {error && <p className="rounded-lg bg-[#fbeceb] px-3 py-2 text-sm text-bad">{error}</p>}
        <button className="btn btn-gold w-full">Login</button>
        <p className="text-center text-sm">
          New venue or vendor? <Link href="/partner/list-property" className="font-semibold text-gold">List your property →</Link>
        </p>
      </form>

      <aside className="h-fit rounded-2xl border border-dashed border-gold bg-[#fbf3e1] p-6">
        <h2 className="text-lg">Demo credentials</h2>
        <p className="mt-1 text-xs text-ink/60">For client walkthroughs. Click “Use” to fill the form.</p>
        <ul className="mt-4 space-y-3">
          {DEMO_ACCOUNTS.map((a) => (
            <li key={a.email} className="rounded-xl bg-white p-3 text-xs">
              <div className="flex items-center justify-between">
                <b className="text-sm">{roleLabel[a.role]}</b>
                <button type="button" onClick={() => { setId(a.email); setPw(a.password); setError(""); }} className="btn btn-soft !px-3 !py-1">Use</button>
              </div>
              <p className="mt-1 text-ink/60">{a.business}</p>
              <p className="mt-2 font-mono">{a.email}</p>
              <p className="font-mono">{a.password}</p>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
