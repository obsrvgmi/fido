"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession, type Role } from "./session";

/**
 * Client-side route guard for the mock session.
 * Returns the session once it's loaded and allowed, otherwise null while it
 * redirects (to /login, or to the right home for the user's role).
 */
export function useGuard(role: Role, { requireOrg = false } = {}) {
  const session = useSession();
  const router = useRouter();

  const user = session?.user ?? null;
  const redirect =
    session === null
      ? null // still loading from storage
      : !user
        ? "/login"
        : user.role !== role
          ? user.role === "admin"
            ? "/dashboard"
            : "/employee"
          : requireOrg && session.orgs.length === 0
            ? "/onboarding"
            : null;

  useEffect(() => {
    if (redirect) router.replace(redirect);
  }, [redirect, router]);

  return session && !redirect ? session : null;
}
