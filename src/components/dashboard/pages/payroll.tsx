"use client";

import { useState } from "react";
import { RiArrowLeftRightLine, RiLockLine, RiWallet3Line } from "@remixicon/react";
import { Button } from "@/components/base/buttons/button";
import { Card, CardHeader, PageHeader } from "@/components/dashboard/shell";
import { RunPayrollModal } from "@/components/dashboard/run-payroll-modal";
import { monthlyTotal, useCurrentOrg, usd } from "@/lib/session";

export function PayrollPage() {
  const org = useCurrentOrg();
  const [payOpen, setPayOpen] = useState(false);
  if (!org) return null;

  const total = monthlyTotal(org);
  const paidYtd = org.runs.reduce((s, r) => s + r.total, 0);
  const chains = new Set(org.employees.map((e) => e.chain)).size;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Payroll"
        description={`Paid ${org.cycle === "monthly" ? "monthly" : "every two weeks"} from ${org.token} on ${org.chain}`}
        actions={
          <Button leadingIcon={RiWallet3Line} onClick={() => setPayOpen(true)}>
            Run payroll
          </Button>
        }
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="Next run" value={usd(total)} sub={`${org.employees.filter((e) => e.status === "active").length} payouts`} />
        <Stat label="Paid to date" value={usd(paidYtd)} sub={`${org.runs.length} runs`} />
        <Stat label="Destinations" value={`${chains} chain${chains === 1 ? "" : "s"}`} sub="Routed via NEAR Intents" />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        <Card>
          <CardHeader title="Pay runs" description="Every run settles onchain and is final in seconds." />
          <div className="mt-3 overflow-x-auto px-5 pb-4">
            <table className="w-full min-w-[480px] text-left">
              <thead>
                <tr className="border-b border-neutral-100 text-caption-1-medium text-neutral-400">
                  <th className="py-2 font-medium">Period</th>
                  <th className="py-2 font-medium">Settled</th>
                  <th className="py-2 font-medium">People</th>
                  <th className="py-2 font-medium">Status</th>
                  <th className="py-2 text-right font-medium">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {org.runs.map((r) => (
                  <tr key={r.id} className="text-body-regular">
                    <td className="py-3 text-neutral-900">{r.period}</td>
                    <td className="py-3 text-neutral-500">
                      {new Date(r.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </td>
                    <td className="py-3 text-neutral-500">{r.people}</td>
                    <td className="py-3">
                      <span className="inline-flex items-center gap-1.5 rounded-md bg-accent-50 px-2 py-0.5 text-caption-1-medium text-brand-ink">
                        <span className="size-1.5 rounded-full bg-brand" /> Settled
                      </span>
                    </td>
                    <td className="py-3 text-right tabular-nums text-neutral-900">{usd(r.total)}</td>
                  </tr>
                ))}
                {org.runs.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-10 text-center text-body-regular text-neutral-400">
                      No pay runs yet — your first run will show up here.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        <div className="flex flex-col gap-4">
          <Card className="p-5">
            <p className="flex items-center gap-2 text-headline-medium text-neutral-950">
              <RiLockLine className="size-[18px] text-brand-ink" /> Privacy
            </p>
            <p className="mt-1.5 text-body-regular text-neutral-500">
              {org.shielded
                ? "Shielded payroll is on. Salaries settle onchain without exposing amounts or recipients."
                : "Shielded payroll is off. Turn it on in Settings to keep amounts private."}
            </p>
          </Card>
          <Card className="p-5">
            <p className="flex items-center gap-2 text-headline-medium text-neutral-950">
              <RiArrowLeftRightLine className="size-[18px] text-brand-ink" /> How payouts route
            </p>
            <ol className="mt-3 space-y-3">
              {[
                ["Intent", `You sign one intent: pay N people from ${org.token}.`],
                ["Solve", "Solvers compete to fill each payout in the token and chain the employee chose."],
                ["Settle", "Funds land in employee wallets; the run is final in seconds."],
              ].map(([t, d], i) => (
                <li key={t} className="flex gap-3">
                  <span className="grid size-6 shrink-0 place-items-center rounded-full bg-neutral-950 text-caption-2-semibold text-white">{i + 1}</span>
                  <div>
                    <p className="text-body-medium text-neutral-900">{t}</p>
                    <p className="text-caption-1-regular text-neutral-500">{d}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Card>
        </div>
      </div>

      <RunPayrollModal org={org} isOpen={payOpen} onOpenChange={setPayOpen} />
    </div>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="rounded-3xl border border-neutral-200 bg-white p-5">
      <p className="text-body-medium text-neutral-500">{label}</p>
      <p className="mt-3 text-[26px] font-medium leading-none tracking-tight tabular-nums text-neutral-950">{value}</p>
      <p className="mt-2 text-caption-1-regular text-neutral-400">{sub}</p>
    </div>
  );
}
