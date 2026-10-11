import type { Metadata } from "next";
import { BudgetMatchForm } from "@/components/BudgetMatch";

export const metadata: Metadata = { title: "Smart Budget Match" };

export default function BudgetPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-4xl">Smart Budget Match</h1>
      <p className="mb-8 mt-1 text-sm text-ink/60">Tell us your event budget and we&apos;ll surface venues that fit.</p>
      <BudgetMatchForm />
    </div>
  );
}
