import type { Metadata } from "next";
import { EmployeePortal } from "@/components/employee/portal";

export const metadata: Metadata = { title: "My pay — Fido" };

export default function Page() {
  return <EmployeePortal />;
}
