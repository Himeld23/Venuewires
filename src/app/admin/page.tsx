import type { Metadata } from "next";
import { AdminQueue } from "@/components/AdminQueue";
import { AuthGuard } from "@/components/AuthGuard";
import { Panel, Stat } from "@/components/Dash";

export const metadata: Metadata = { title: "Admin Control Center" };

const funnel = [["Search → Compare", 68], ["Compare → Enquiry", 31], ["Enquiry → Call", 54], ["Call → Booking", 18]] as const;

export default function Admin() {
  return <AuthGuard roles={["admin"]}><AdminContent /></AuthGuard>;
}

function AdminContent() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-4xl">Admin Control Center</h1>
      <p className="mb-8 mt-1 text-sm text-ink/60">Manage supply, verification, leads, content and marketplace quality.</p>
      <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <Stat label="Venues" value={428} /><Stat label="Verified" value={361} /><Stat label="Vendors" value={182} />
        <Stat label="Pending Checks" value={27} /><Stat label="Leads Today" value={94} />
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Panel title="Verification Queue"><AdminQueue /></Panel>
        <Panel title="Marketplace Health" tint>
          <ul className="space-y-4">
            {funnel.map(([l, p]) => (
              <li key={l}>
                <div className="flex justify-between text-sm"><span className="text-ink/70">{l}</span><b>{p}%</b></div>
                <div className="mt-1 h-2 rounded-full bg-white"><div className="h-2 rounded-full bg-gold" style={{ width: `${p}%` }} /></div>
              </li>
            ))}
          </ul>
          <button className="btn btn-gold mt-6">Open Analytics</button>
        </Panel>
      </div>
      <p className="mt-6 text-xs text-ink/50">Numbers are illustrative. Backend phase adds role-based access, audit log and live analytics.</p>
    </div>
  );
}
