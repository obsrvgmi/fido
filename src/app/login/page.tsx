import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginFlow } from "@/components/auth/login-flow";

export const metadata: Metadata = { title: "Sign in — Fido" };

export default function LoginPage() {
  return (
    <Suspense>
      <LoginFlow />
    </Suspense>
  );
}
