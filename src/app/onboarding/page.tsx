import type { Metadata } from "next";
import { CreateOrgWizard } from "@/components/onboarding/create-org-wizard";

export const metadata: Metadata = { title: "Create organization — Fido" };

export default function OnboardingPage() {
  return <CreateOrgWizard />;
}
