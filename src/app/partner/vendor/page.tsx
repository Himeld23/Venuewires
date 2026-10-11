import type { Metadata } from "next";
import { AuthGuard } from "@/components/AuthGuard";
import { VendorDashboard } from "@/components/VendorDashboard";

export const metadata: Metadata = { title: "Vendor Partner Dashboard" };

export default function Page() {
  return <AuthGuard roles={["vendor"]}><VendorDashboard /></AuthGuard>;
}
