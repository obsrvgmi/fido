"use client";

import { useState, type ComponentType } from "react";
import Link from "next/link";
import {
  RiArrowRightUpLine,
  RiCalendarLine,
  RiFileList3Line,
  RiLockLine,
  RiMagicLine,
  RiRobot2Line,
  RiTeamLine,
  RiTimeLine,
  RiUserAddLine,
  RiWallet3Line,
} from "@remixicon/react";
import { Button } from "@/components/base/buttons/button";
import { Chip } from "@/components/base/badges/chip";
import { RevenueChartCard, type RevenuePoint } from "@/components/application/dashboard/revenue-chart-card";
import { Card, CardHeader, PageHeader } from "@/components/dashboard/shell";
import { RunPayrollModal } from "@/components/dashboard/run-payroll-modal";
import { AddEmployeeModal } from "@/components/dashboard/add-employee-modal";
import { SAMPLE_TEAM, addEmployee, monthlyTotal, useCurrentOrg, useSession, usd, type Org } from "@/lib/session";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function nextPayday(org: Org) {
  const now = new Date();
  let d = new Date(now.getFullYear(), now.getMonth(), 28);
  if (org.cycle === "biweekly") {
    d = new Date(now);
    d.setDate(now.getDate() + ((5 - now.getDay() + 7) % 7 || 7) + 7);
  } else if (d <= now) d = new Date(now.getFullYear(), now.getMonth() + 1, 28);
  const days = Math.ceil((d.getTime() - now.getTime()) / 86_400_000);
  return { date: d, days };
}

/** Trailing 12 months ending this month, ramping up to the current payroll. */
function spendSeries(total: number): RevenuePoint[] {
  const nowM = new Date().getMonth();
  return Array.from({ length: 12 }, (_, i) => {
    const label = MONTHS[(nowM - 11 + i + 12) % 12]!;
    const ramp = 0.62 + (i / 11) * 0.38;
    const wobble = 1 + Math.sin(i * 1.7) * 0.03;
    return {
      label,
      current: Math.round(total * ramp * wobble),
      previous: Math.round(total * 0.58 * (0.8 + i * 0.02)),
    };
  });
}

export function OverviewPage() {
  const org = useCurrentOrg();
  const session = useSession();
  const [payOpen, setPayOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  if (!org) return null;

  const total = monthlyTotal(org);
  const active = org.employees.filter((e) => e.status === "active").length;
  const invited = org.employees.filter((e) => e.status === "invited").length;
  const pay = nextPayday(org);
  const firstName = session?.user?.name.split(/[\s.]/)[0] ?? "there";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={`${greeting}, ${firstName.charAt(0).toUpperCase() + firstName.slice(1)}`}
        description={`Here's what's happening at ${org.name} today.`}
        actions={
          <>
            <Button variant="secondary" leadingIcon={RiUserAddLine} onClick={() => setAddOpen(true)}>
              Add employee
            </Button>
            <Button leadingIcon={RiWallet3Line} onClick={() => setPayOpen(true)}>
              Run payroll
            </Button>
          </>
        }
      />

      {org.employees.length === 0 ? (
        <EmptyWorkspace org={org} onAdd={() => setAddOpen(true)} />
      ) : (
        <>
          {/* KPIs */}
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <Kpi icon={RiWallet3Line} label="Monthly payroll" value={usd(total)} chip={{ label: "+4.2%", tone: "up" }} />
            <Kpi icon={RiTeamLine} label="People" value={String(org.employees.length)} sub={`${active} active · ${invited} invited`} />
            <Kpi
              icon={RiCalendarLine}
              label="Next payday"
              value={pay.date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              sub={`in ${pay.days} day${pay.days === 1 ? "" : "s"}`}
            />
            <Kpi
              icon={RiLockLine}
              label="Treasury"
              value={usd(Math.round(total * 6.7))}
              sub={org.shielded ? "Shielded" : "Public"}
              accent={org.shielded}
            />
          </div>

          <div className="grid gap-4 xl:grid-cols-[1.6fr_1fr]">
            <RevenueChartCard data={spendSeries(total)} title="Payroll spend" className="h-auto min-h-[344px] rounded-3xl border border-neutral-200 bg-white px-5 pt-5" />

            <Card className="flex flex-col p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-caption-1-medium text-neutral-500">Upcoming payroll</p>
                  <p className="mt-1 text-[30px] font-medium leading-none tracking-tight tabular-nums text-neutral-950">{usd(total)}</p>
                </div>
                <Chip color="soft" variant="caption">{org.cycle === "monthly" ? "Monthly" : "Bi-weekly"}</Chip>
              </div>
              <div className="mt-5 flex items-center gap-3 rounded-2xl bg-neutral-50 p-3">
                <span className="grid size-10 place-items-center rounded-xl border border-neutral-200 bg-white text-center">
                  <span className="text-caption-1-semibold leading-none text-neutral-950">{pay.date.getDate()}</span>
                </span>
                <div className="flex-1">
                  <p className="text-body-medium text-neutral-900">
                    {pay.date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                  </p>
                  <p className="text-caption-1-regular text-neutral-500">
                    {active} payouts · auto-approves in {Math.max(pay.days - 1, 0)}d
                  </p>
                </div>
              </div>
              <ul className="mt-4 flex flex-col gap-2.5">
                {tokenMix(org).map(([k, v]) => (
                  <li key={k} className="flex items-center gap-3 text-caption-1-regular">
                    <span className="w-28 text-neutral-600">{k}</span>
                    <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-neutral-100">
                      <span className="block h-full rounded-full bg-brand" style={{ width: `${(v / total) * 100}%` }} />
                    </span>
                    <span className="w-16 text-right tabular-nums text-neutral-900">{Math.round((v / total) * 100)}%</span>
                  </li>
                ))}
              </ul>
              <div className="flex-1" />
              <Button className="mt-5 w-full" trailingIcon={RiArrowRightUpLine} onClick={() => setPayOpen(true)}>
                Review & run now
              </Button>
            </Card>
          </div>

          <div className="grid gap-4 xl:grid-cols-[1fr_1.2fr]">
            <Card>
              <CardHeader
                title="Agent activity"
                description="What your agents handled recently"
                action={
                  <Link href="/dashboard/agents" className="text-body-medium text-neutral-500 hover:text-neutral-950">
                    View all
                  </Link>
                }
              />
              <ul className="mt-3 px-2 pb-3">
                {[
                  { icon: RiFileList3Line, agent: "Invoice Agent", text: "Matched 142 invoices to the Q3 ledger", time: "2m ago" },
                  { icon: RiUserAddLine, agent: "Ops Agent", text: `Sent wallet setup to ${invited || 1} new hire${invited === 1 ? "" : "s"}`, time: "18m ago" },
                  { icon: RiTimeLine, agent: "Payroll Agent", text: `Scheduled payroll for ${pay.date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`, time: "1h ago" },
                  { icon: RiRobot2Line, agent: "Compliance Agent", text: "Collected 3 tax forms (W-8BEN)", time: "3h ago" },
                ].map(({ icon: Icon, agent, text, time }) => (
                  <li key={text} className="flex items-start gap-3 rounded-2xl px-3 py-2.5 hover:bg-neutral-50">
                    <span className="grid size-8 shrink-0 place-items-center rounded-xl border border-neutral-200 bg-white">
                      <Icon className="size-4 text-neutral-500" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-body-medium text-neutral-900">{text}</p>
                      <p className="text-caption-1-regular text-neutral-400">{agent}</p>
                    </div>
                    <span className="shrink-0 text-caption-1-regular text-neutral-400">{time}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card>
              <CardHeader
                title="Recent pay runs"
                action={
                  <Link href="/dashboard/payroll" className="text-body-medium text-neutral-500 hover:text-neutral-950">
                    View all
                  </Link>
                }
              />
              <div className="mt-3 overflow-x-auto px-5 pb-4">
                <table className="w-full min-w-[420px] text-left">
                  <thead>
                    <tr className="border-b border-neutral-100 text-caption-1-medium text-neutral-400">
                      <th className="py-2 font-medium">Period</th>
                      <th className="py-2 font-medium">People</th>
                      <th className="py-2 font-medium">Status</th>
                      <th className="py-2 text-right font-medium">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {org.runs.slice(0, 5).map((r) => (
                      <tr key={r.id} className="text-body-regular">
                        <td className="py-3 text-neutral-900">{r.period}</td>
                        <td className="py-3 text-neutral-500">{r.people}</td>
                        <td className="py-3">
                          <span className="inline-flex items-center gap-1.5 text-caption-1-medium text-brand-ink">
                            <span className="size-1.5 rounded-full bg-brand" /> Settled
                          </span>
                        </td>
                        <td className="py-3 text-right tabular-nums text-neutral-900">{usd(r.total)}</td>
                      </tr>
                    ))}
                    {org.runs.length === 0 && (
                      <tr>
                        <td colSpan={4} className="py-6 text-center text-body-regular text-neutral-400">
                          No pay runs yet
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </>
      )}

      <RunPayrollModal org={org} isOpen={payOpen} onOpenChange={setPayOpen} />
      <AddEmployeeModal org={org} isOpen={addOpen} onOpenChange={setAddOpen} />
    </div>
  );
}

function tokenMix(org: Org) {
  const m: Record<string, number> = {};
  org.employees
    .filter((e) => e.status === "active")
    .forEach((e) => (m[`${e.token} · ${e.chain}`] = (m[`${e.token} · ${e.chain}`] ?? 0) + e.salary));
  return Object.entries(m)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);
}

function Kpi({
  icon: Icon,
  label,
  value,
  sub,
  chip,
  accent,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
  sub?: string;
  chip?: { label: string; tone: "up" | "down" };
  accent?: boolean;
}) {
  return (
    <div className="rounded-3xl border border-neutral-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <p className="flex items-center gap-2 text-body-medium text-neutral-500">
          <Icon className="size-4 text-neutral-400" /> {label}
        </p>
        {chip && (
          <span className="rounded-md bg-accent-50 px-1.5 py-0.5 text-caption-1-medium text-brand-ink">{chip.label}</span>
        )}
      </div>
      <p className="mt-3 text-[26px] font-medium leading-none tracking-tight tabular-nums text-neutral-950">{value}</p>
      {sub && (
        <p className={`mt-2 text-caption-1-regular ${accent ? "text-brand-ink" : "text-neutral-400"}`}>{sub}</p>
      )}
    </div>
  );
}

function EmptyWorkspace({ org, onAdd }: { org: Org; onAdd: () => void }) {
  return (
    <Card className="relative overflow-hidden px-6 py-14 text-center">
      <div aria-hidden className="dot-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
      <div className="relative mx-auto max-w-md">
        <span className="mx-auto grid size-12 place-items-center rounded-2xl border border-neutral-200 bg-white shadow-[0_1px_2px_rgb(0_0_0/0.05)]">
          <RiTeamLine className="size-6 text-brand-ink" />
        </span>
        <h2 className="mt-5 text-title-3-medium text-neutral-950">Add your first employee</h2>
        <p className="mt-2 text-body-regular text-neutral-500">
          Once your team is in, {org.name} can run private payroll in any token — and your agents start handling the busywork.
        </p>
        <div className="mt-6 flex justify-center gap-2">
          <Button
            variant="secondary"
            leadingIcon={RiMagicLine}
            onClick={() => SAMPLE_TEAM.forEach((e) => addEmployee(org.id, e))}
          >
            Load sample team
          </Button>
          <Button leadingIcon={RiUserAddLine} onClick={onAdd}>
            Add employee
          </Button>
        </div>
      </div>
    </Card>
  );
}
