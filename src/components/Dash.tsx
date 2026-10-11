import type { ReactNode } from "react";

export function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="card p-5">
      <p className="text-xs text-ink/60">{label}</p>
      <p className="mt-2 font-serif text-2xl">{value}</p>
    </div>
  );
}

export function SideNav({ title, sub, items }: { title?: string; sub?: string; items: string[] }) {
  return (
    <nav className="card h-fit p-5 text-sm">
      {title && <h2 className="text-lg">{title}</h2>}
      {sub && <p className="mb-3 text-xs text-gold">{sub}</p>}
      <ul className="space-y-2.5">
        {items.map((it, i) => (
          <li key={it} className={i === 0 ? "font-semibold text-gold" : "text-ink/70"}>{i === 0 ? "● " : "■ "}{it}</li>
        ))}
      </ul>
    </nav>
  );
}

export function Panel({ title, children, tint }: { title: string; children: ReactNode; tint?: boolean }) {
  return (
    <section className={`rounded-2xl p-6 ${tint ? "bg-[#f3ecdd]" : "card"}`}>
      <h3 className="mb-4 text-lg">{title}</h3>
      {children}
    </section>
  );
}
