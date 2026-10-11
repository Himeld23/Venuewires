"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useSession, type Role } from "@/lib/auth";
import { useClientReady } from "@/lib/local-store";

export function AuthGuard({ roles, children }: { roles: Role[]; children: ReactNode }) {
  const session = useSession();
  const ready = useClientReady();

  if (!ready) return <div className="mx-auto max-w-7xl px-4 py-20 text-ink/40">Loading…</div>;
  if (!session || !roles.includes(session.role)) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <div className="text-5xl">🔒</div>
        <h1 className="mt-3 text-2xl">Partner login required</h1>
        <p className="mt-2 text-sm text-ink/60">
          {session ? "This area is for a different account type." : "Please sign in to open your dashboard."}
        </p>
        <Link href="/partner/login" className="btn btn-gold mt-6">Go to login</Link>
      </div>
    );
  }
  return <>{children}</>;
}
