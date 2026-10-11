"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { dashboardPath, logout, useSession } from "@/lib/auth";
import { useState } from "react";
import { Logo } from "./Logo";
import { useCompare } from "@/lib/compare-store";

const before = [{ href: "/venues", label: "Venues" }];
const more = [
  { href: "/services/catering", label: "Catering" },
  { href: "/services/decoration", label: "Decoration" },
  { href: "/services/photography", label: "Photography & Videography" },
  { href: "/services/makeup", label: "Makeup Artist" },
  { href: "/services/mehendi", label: "Mehendi Artist" },
  { href: "/services/entertainment", label: "Entertainment" },
  { href: "/services/transport", label: "Transportation" },
  { href: "/services", label: "All services →" },
];
const after = [
  { href: "/budget", label: "Budget" },
  { href: "/build-event", label: "Build My Event" },
];
const nav = [...before, ...more, ...after]; // flat list for the mobile menu

export function Header() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const { slugs } = useCompare();
  const session = useSession();
  const router = useRouter();

  const active = (href: string) =>
    href === "/services" ? path === "/services" : path === href || path.startsWith(href + "/");

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-line">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
        <Logo />
        <nav className="hidden xl:flex items-center gap-4 text-[13px] whitespace-nowrap">
          {before.map((n) => (
            <Link key={n.href} href={n.href}
              className={active(n.href) ? "font-semibold text-gold" : "text-ink/80 hover:text-gold"}>
              {n.label}
            </Link>
          ))}

          <div className="group relative">
            <Link href="/services"
              className={`flex items-center gap-1 ${more.some((m) => active(m.href)) ? "font-semibold text-gold" : "text-ink/80 group-hover:text-gold"}`}>
              More Services <span className="text-[9px]">▾</span>
            </Link>
            <div className="invisible absolute left-1/2 top-full z-50 -translate-x-1/2 pt-3 opacity-0 transition group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
              <ul className="min-w-48 rounded-xl border border-line bg-white py-2 shadow-lg">
                {more.map((m) => (
                  <li key={m.href}>
                    <Link href={m.href}
                      className={`block px-4 py-2 hover:bg-cream hover:text-gold ${active(m.href) && m.href !== "/services" ? "font-semibold text-gold" : "text-ink/80"}`}>
                      {m.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {after.map((n) => (
            <Link key={n.href} href={n.href}
              className={active(n.href) ? "font-semibold text-gold" : "text-ink/80 hover:text-gold"}>
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/compare" className="btn btn-soft !py-2 relative">
            Compare
            {slugs.length > 0 && (
              <span className="rounded-full bg-gold px-1.5 text-[10px] text-white">{slugs.length}</span>
            )}
          </Link>
          {session ? (
            <>
              <Link href={dashboardPath(session.role)} className="btn btn-outline !py-2 hidden sm:inline-flex">{session.name.split(" ")[0]} · Dashboard</Link>
              <button onClick={() => { logout(); router.push("/"); }} className="btn btn-soft !py-2 hidden sm:inline-flex">Logout</button>
            </>
          ) : (
            <>
              <Link href="/partner/list-property" className="btn btn-soft !py-2 hidden 2xl:inline-flex">List your property</Link>
              <Link href="/partner/login" className="btn btn-outline !py-2 hidden sm:inline-flex">Partner Login</Link>
            </>
          )}
          <button className="xl:hidden btn btn-soft !px-3" onClick={() => setOpen(!open)} aria-label="Menu">☰</button>
        </div>
      </div>
      {open && (
        <nav className="xl:hidden border-t border-line bg-white px-4 py-3 grid grid-cols-2 gap-2 text-sm">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} onClick={() => setOpen(false)} className="py-1.5">{n.label}</Link>
          ))}
          <Link href="/partner/list-property" onClick={() => setOpen(false)} className="py-1.5 text-gold font-semibold">List your property</Link>
          {session ? (
            <>
              <Link href={dashboardPath(session.role)} onClick={() => setOpen(false)} className="py-1.5 text-gold font-semibold">My Dashboard</Link>
              <button onClick={() => { logout(); setOpen(false); router.push("/"); }} className="py-1.5 text-left">Logout</button>
            </>
          ) : (
            <Link href="/partner/login" onClick={() => setOpen(false)} className="py-1.5 text-gold font-semibold">Partner Login</Link>
          )}
        </nav>
      )}
    </header>
  );
}
