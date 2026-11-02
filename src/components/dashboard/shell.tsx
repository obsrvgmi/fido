"use client";

import { useState, type ComponentType, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  RiAddLine,
  RiArrowUpDownLine,
  RiCheckLine,
  RiDashboardLine,
  RiLogoutBoxRLine,
  RiMenuLine,
  RiRobot2Line,
  RiSearchLine,
  RiSettings3Line,
  RiSparkling2Line,
  RiTeamLine,
  RiWallet3Line,
  RiCloseLine,
} from "@remixicon/react";
import { Dropdown, DropdownDivider, DropdownGroup, DropdownItem, DropdownPopover, DropdownTrigger } from "@/components/base/dropdown/dropdown";
import { Avatar } from "@/components/base/avatar/avatar";
import { Kbd } from "@/components/base/kbd/kbd";
import { Logo } from "@/components/marketing/logo";
import { FullPageSpinner } from "@/components/onboarding/create-org-wizard";
import { useGuard } from "@/lib/use-guard";
import { initials, signOut, switchOrg, useCurrentOrg, type Org } from "@/lib/session";
import { cx } from "@/utils/cx";

type Icon = ComponentType<{ className?: string }>;

const NAV: { href: string; label: string; icon: Icon }[] = [
  { href: "/dashboard", label: "Overview", icon: RiDashboardLine },
  { href: "/dashboard/people", label: "People", icon: RiTeamLine },
  { href: "/dashboard/payroll", label: "Payroll", icon: RiWallet3Line },
  { href: "/dashboard/agents", label: "AI Agents", icon: RiRobot2Line },
  { href: "/dashboard/settings", label: "Settings", icon: RiSettings3Line },
];

export function DashboardShell({ children }: { children: ReactNode }) {
  const session = useGuard("admin", { requireOrg: true });
  const org = useCurrentOrg();
  const pathname = usePathname();
  // The drawer remembers the path it was opened on, so navigating closes it.
  const [openedOn, setOpenedOn] = useState<string | null>(null);
  const mobileOpen = openedOn === pathname;
  const setMobileOpen = (open: boolean) => setOpenedOn(open ? pathname : null);

  // Keep the page segment mounted (pages render nothing without an org) so
  // Next can still validate the route while the session loads from storage.
  if (!session || !org)
    return (
      <>
        <FullPageSpinner />
        <div hidden>{children}</div>
      </>
    );

  const sidebar = <Sidebar orgs={session.orgs} org={org} userName={session.user!.name} userEmail={session.user!.email} />;

  return (
    <div className="min-h-dvh bg-white lg:flex">
      {/* Desktop sidebar */}
      <div className="sticky top-0 hidden h-dvh w-[272px] shrink-0 p-2 lg:block">{sidebar}</div>

      {/* Mobile top bar + drawer */}
      <div className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-neutral-200/70 bg-white/85 px-4 backdrop-blur-xl lg:hidden">
        <Logo />
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="grid size-9 place-items-center rounded-lg text-neutral-600 hover:bg-neutral-100"
          aria-label="Open navigation"
        >
          <RiMenuLine className="size-5" />
        </button>
      </div>
      <div
        className={cx("fixed inset-0 z-50 lg:hidden", mobileOpen ? "pointer-events-auto" : "pointer-events-none")}
        aria-hidden={!mobileOpen}
      >
        <div
          onClick={() => setMobileOpen(false)}
          className={cx("absolute inset-0 bg-black/30 transition-opacity", mobileOpen ? "opacity-100" : "opacity-0")}
        />
        <div
          className={cx(
            "absolute inset-y-0 left-0 w-[288px] p-2 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
            mobileOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="absolute -right-11 top-4 grid size-9 place-items-center rounded-full bg-white text-neutral-700 shadow"
            aria-label="Close navigation"
          >
            <RiCloseLine className="size-5" />
          </button>
          {sidebar}
        </div>
      </div>

      <main className="min-w-0 flex-1">
        <div className="mx-auto max-w-[1180px] px-4 py-6 sm:px-8 lg:py-8">{children}</div>
      </main>
    </div>
  );
}

function Sidebar({ orgs, org, userName, userEmail }: { orgs: Org[]; org: Org; userName: string; userEmail: string }) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside className="flex h-full flex-col rounded-3xl border border-white bg-neutral-100/80 p-3 shadow-sidebar">
      {/* Org switcher */}
      <Dropdown>
        <DropdownTrigger className="flex w-full items-center gap-2.5 rounded-2xl bg-white p-2 text-left shadow-[0_1px_2px_rgb(0_0_0/0.05),0_0_0_1px_rgb(0_0_0/0.05)] outline-none transition-shadow hover:shadow-[0_2px_6px_rgb(0_0_0/0.07),0_0_0_1px_rgb(0_0_0/0.07)] focus-visible:ring-2 focus-visible:ring-brand">
          <OrgBadge org={org} />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-body-medium text-neutral-950">{org.name}</span>
            <span className="block truncate text-caption-1-regular text-neutral-400">
              {org.employees.length} people · {org.chain}
            </span>
          </span>
          <RiArrowUpDownLine className="size-4 shrink-0 text-neutral-400" />
        </DropdownTrigger>
        <DropdownPopover aria-label="Switch organization" className="w-[248px]">
          <DropdownGroup label="Organizations">
            {orgs.map((o) => (
              <DropdownItem key={o.id} selected={o.id === org.id} onSelect={() => switchOrg(o.id)} className="px-2 py-1.5">
                <OrgBadge org={o} small />
                <span className="flex-1 truncate text-left text-body-medium text-neutral-900">{o.name}</span>
                {o.id === org.id && <RiCheckLine className="size-4 text-brand-ink" />}
              </DropdownItem>
            ))}
          </DropdownGroup>
          <DropdownDivider />
          <DropdownItem onSelect={() => router.push("/onboarding")} className="px-2 py-1.5">
            <span className="grid size-6 place-items-center rounded-md border border-dashed border-neutral-300 text-neutral-500">
              <RiAddLine className="size-3.5" />
            </span>
            <span className="text-body-medium text-neutral-900">Create organization</span>
          </DropdownItem>
        </DropdownPopover>
      </Dropdown>

      {/* Search */}
      <button
        type="button"
        className="mt-3 flex h-9 items-center gap-2 rounded-xl bg-neutral-200/60 px-2.5 text-body-regular text-neutral-500 transition-colors hover:bg-neutral-200"
      >
        <RiSearchLine className="size-4" />
        <span className="flex-1 text-left">Search</span>
        <Kbd>⌘K</Kbd>
      </button>

      {/* Nav */}
      <nav className="mt-5">
        <p className="px-2 pb-1.5 text-caption-1-medium text-neutral-400">Workspace</p>
        <ul className="flex flex-col gap-0.5">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = href === "/dashboard" ? pathname === href : pathname.startsWith(href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={cx(
                    "group flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-body-medium transition-all",
                    active
                      ? "bg-white text-neutral-950 shadow-[0_1px_2px_rgb(0_0_0/0.06),0_0_0_1px_rgb(0_0_0/0.05)]"
                      : "text-neutral-600 hover:bg-neutral-200/50 hover:text-neutral-950",
                  )}
                >
                  <Icon className={cx("size-[18px]", active ? "text-brand-ink" : "text-neutral-400 group-hover:text-neutral-600")} />
                  {label}
                  {label === "AI Agents" && (
                    <span className="ml-auto flex items-center gap-1 rounded-md bg-accent-50 px-1.5 py-0.5 text-caption-2-semibold text-brand-ink">
                      <span className="size-1.5 animate-pulse-ring rounded-full bg-brand" /> 3
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="flex-1" />

      {/* Agent nudge */}
      <div className="relative overflow-hidden rounded-2xl border border-white bg-white p-3.5 shadow-[0_1px_2px_rgb(0_0_0/0.05)]">
        <div aria-hidden className="absolute -right-8 -top-8 size-24 rounded-full bg-brand/25 blur-2xl" />
        <p className="relative flex items-center gap-1.5 text-caption-1-semibold text-neutral-950">
          <RiSparkling2Line className="size-3.5 text-brand-ink" /> Ops Agent
        </p>
        <p className="relative mt-1 text-caption-1-regular text-neutral-500">
          Saved your team <span className="text-neutral-900">14 hours</span> of busywork this week.
        </p>
        <Link href="/dashboard/agents" className="relative mt-2 inline-block text-caption-1-medium text-brand-ink hover:underline">
          See activity →
        </Link>
      </div>

      {/* User menu */}
      <Dropdown>
        <DropdownTrigger className="mt-3 flex w-full items-center gap-2.5 rounded-xl p-1.5 text-left outline-none transition-colors hover:bg-neutral-200/50 focus-visible:ring-2 focus-visible:ring-brand">
          <Avatar size="md" initials={initials(userName)} color="lime" />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-body-medium text-neutral-950">{userName}</span>
            <span className="block truncate text-caption-1-regular text-neutral-400">Admin · {userEmail}</span>
          </span>
        </DropdownTrigger>
        <DropdownPopover aria-label="Account" placement="top start" className="w-[248px]">
          <DropdownItem onSelect={() => router.push("/dashboard/settings")} className="px-2 py-1.5">
            <RiSettings3Line className="size-4 text-neutral-500" />
            <span className="text-body-medium text-neutral-900">Settings</span>
          </DropdownItem>
          <DropdownItem onSelect={() => router.push("/onboarding")} className="px-2 py-1.5">
            <RiAddLine className="size-4 text-neutral-500" />
            <span className="text-body-medium text-neutral-900">Create organization</span>
          </DropdownItem>
          <DropdownDivider />
          <DropdownItem
            onSelect={() => {
              signOut();
              router.push("/login");
            }}
            className="px-2 py-1.5"
          >
            <RiLogoutBoxRLine className="size-4 text-neutral-500" />
            <span className="text-body-medium text-neutral-900">Sign out</span>
          </DropdownItem>
        </DropdownPopover>
      </Dropdown>
    </aside>
  );
}

export function OrgBadge({ org, small }: { org: Org; small?: boolean }) {
  return (
    <span
      className={cx(
        "grid shrink-0 place-items-center bg-neutral-950 font-semibold text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.15)]",
        small ? "size-6 rounded-md text-[10px]" : "size-9 rounded-xl text-caption-1-semibold",
      )}
    >
      {initials(org.name)}
    </span>
  );
}

/** Page header used by every dashboard page. */
export function PageHeader({ title, description, actions }: { title: string; description?: ReactNode; actions?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-[26px] font-medium leading-tight tracking-[-0.02em] text-neutral-950">{title}</h1>
        {description && <p className="mt-1 text-body-regular text-neutral-500">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

/** Hairline card surface used across the dashboard. */
export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return <section className={cx("rounded-3xl border border-neutral-200 bg-white", className)}>{children}</section>;
}

export function CardHeader({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3 px-5 pt-5">
      <div>
        <h2 className="text-headline-medium text-neutral-950">{title}</h2>
        {description && <p className="mt-0.5 text-body-regular text-neutral-500">{description}</p>}
      </div>
      {action}
    </div>
  );
}
