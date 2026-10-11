import type { Metadata } from "next";
import { AuthGuard } from "@/components/AuthGuard";
import { VenueDashboard } from "@/components/VenueDashboard";

export const metadata: Metadata = { title: "Venue Partner Dashboard" };

export default function Page() {
  return <AuthGuard roles={["venue"]}><VenueDashboard /></AuthGuard>;
}
