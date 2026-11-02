"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  RiCheckLine,
  RiDownloadLine,
  RiFileTextLine,
  RiLockLine,
  RiLogoutBoxRLine,
  RiWallet3Line,
} from "@remixicon/react";
import { Avatar } from "@/components/base/avatar/avatar";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { Select, SelectItem } from "@/components/base/select/select";
import { Dropdown, DropdownItem, DropdownPopover, DropdownTrigger } from "@/components/base/dropdown/dropdown";
import { Logo } from "@/components/marketing/logo";
import { FullPageSpinner } from "@/components/onboarding/create-org-wizard";
import { Card, CardHeader } from "@/components/dashboard/shell";
import { NearMark } from "@/components/brand/near-mark";
import { useGuard } from "@/lib/use-guard";
import { CHAINS, SAMPLE_TEAM, TOKENS, initials, signOut, usd } from "@/lib/session";

export function EmployeePortal() {
  const session = useGuard("employee");
  const router = useRouter();

  // Find the org this person belongs to; fall back to a demo profile.
  const match = session?.orgs
    .map((o) => ({ org: o, emp: o.employees.find((e) => e.email.toLowerCase() === session.user?.email.toLowerCase()) }))
    .find((m) => m.emp);
  const emp = match?.emp ?? { ...SAMPLE_TEAM[0]!, name: session?.user?.name ?? SAMPLE_TEAM[0]!.name };
  const orgName = match?.org.name ?? "Acme Labs";

  const [token, setToken] = useState(emp.token);
  const [chain, setChain] = useState(emp.chain);
  const [wallet, setWallet] = useState(session?.user?.wallet ?? "");
  const [saved, setSaved] = useState(false);

  if (!session) return <FullPageSpinner />;

  const now = new Date();
  const payday = new Date(now.getFullYear(), now.getMonth() + (now.getDate() >= 28 ? 1 : 0), 28);
  const days = Math.ceil((payday.getTime() - now.getTime()) / 86_400_000);
  const payslips = [1, 2, 3, 4].map((back) => {
    const d = new Date(now.getFullYear(), now.getMonth() - back, 28);
    return { period: d.toLocaleString("en-US", { month: "long", year: "numeric" }), date: d, amount: emp.salary };
  });

  return (
    <div className="min-h-dvh bg-neutral-50">
      <header className="sticky top-0 z-40 border-b border-neutral-200/70 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Logo />
            <span className="hidden h-5 w-px bg-neutral-200 sm:block" />
            <span className="hidden text-body-medium text-neutral-500 sm:block">{orgName}</span>
          </div>
          <Dropdown>
            <DropdownTrigger className="flex items-center gap-2 rounded-xl p-1 pr-2.5 outline-none hover:bg-neutral-100 focus-visible:ring-2 focus-visible:ring-brand">
              <Avatar size="sm" initials={initials(emp.name)} color="lime" />
              <span className="text-body-medium text-neutral-900">{emp.name}</span>
            </DropdownTrigger>
            <DropdownPopover aria-label="Account" placement="bottom end" className="w-[220px]">
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
        </div>
      </header>

      <main className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-8 sm:px-6">
        <div>
          <h1 className="text-[26px] font-medium tracking-[-0.02em] text-neutral-950">Hi {emp.name.split(/[\s.]/)[0]}</h1>
          <p className="mt-1 text-body-regular text-neutral-500">
            {emp.title} at {orgName}
          </p>
        </div>

        {/* Next payout hero */}
        <section className="relative overflow-hidden rounded-3xl bg-neutral-950 p-6 text-white sm:p-8">
          <div aria-hidden className="absolute -right-20 -top-20 size-80 rounded-full bg-brand/25 blur-[90px]" />
          <div aria-hidden className="absolute inset-0 [background-image:radial-gradient(rgb(255_255_255/0.06)_1px,transparent_1px)] [background-size:20px_20px] [mask-image:linear-gradient(to_left,black,transparent_70%)]" />
          <div className="relative flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-body-medium text-neutral-400">Next payout</p>
              <p className="mt-2 text-[44px] font-medium leading-none tracking-[-0.03em] tabular-nums">
                {usd(emp.salary)}
                <span className="text-neutral-600">.00</span>
              </p>
              <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-body-regular text-neutral-400">
                <span>
                  {payday.toLocaleDateString("en-US", { weekday: "short", month: "long", day: "numeric" })} · in {days} days
                </span>
                <span className="inline-flex items-center gap-1 text-brand">
                  <RiLockLine className="size-3.5" /> Private
                </span>
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 backdrop-blur">
              <p className="text-caption-1-medium text-neutral-400">You receive</p>
              <p className="mt-0.5 text-headline-medium">
                {token} <span className="text-neutral-500">on</span> {chain}
              </p>
            </div>
          </div>
        </section>

        <div className="grid gap-4 lg:grid-cols-[1fr_1.15fr]">
          {/* Payout settings */}
          <Card>
            <CardHeader title="Payout settings" description="Choose how you get paid. NEAR Intents handles the conversion." />
            <div className="flex flex-col gap-4 p-5">
              <Input
                label="Wallet"
                placeholder="yourname.near or 0x…"
                value={wallet}
                onChange={setWallet}
                leadingAddon={<NearMark className="size-4 text-neutral-500" />}
              />
              <div className="grid grid-cols-2 gap-3">
                <Select label="Token" selectedKey={token} onSelectionChange={(k) => setToken(String(k))}>
                  {TOKENS.map((t) => (
                    <SelectItem key={t} id={t}>{t}</SelectItem>
                  ))}
                </Select>
                <Select label="Chain" selectedKey={chain} onSelectionChange={(k) => setChain(String(k))}>
                  {CHAINS.map((c) => (
                    <SelectItem key={c} id={c}>{c}</SelectItem>
                  ))}
                </Select>
              </div>
              <Button
                leadingIcon={saved ? RiCheckLine : RiWallet3Line}
                onClick={() => {
                  setSaved(true);
                  setTimeout(() => setSaved(false), 1800);
                }}
              >
                {saved ? "Saved for next payout" : "Save payout settings"}
              </Button>
            </div>
          </Card>

          {/* Payslips */}
          <Card>
            <CardHeader title="Payslips" description="Every payout, settled onchain." />
            <ul className="mt-3 px-2 pb-3">
              {payslips.map((p) => (
                <li key={p.period} className="flex items-center gap-3 rounded-2xl px-3 py-2.5 hover:bg-neutral-50">
                  <span className="grid size-9 place-items-center rounded-xl border border-neutral-200 bg-white">
                    <RiFileTextLine className="size-4 text-neutral-500" />
                  </span>
                  <div className="flex-1">
                    <p className="text-body-medium text-neutral-900">{p.period}</p>
                    <p className="flex items-center gap-1 text-caption-1-regular text-brand-ink">
                      <span className="size-1.5 rounded-full bg-brand" /> Settled{" "}
                      {p.date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </p>
                  </div>
                  <span className="text-body-medium tabular-nums text-neutral-900">{usd(p.amount)}</span>
                  <button
                    type="button"
                    aria-label={`Download ${p.period} payslip`}
                    className="grid size-8 place-items-center rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
                  >
                    <RiDownloadLine className="size-4" />
                  </button>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </main>
    </div>
  );
}
