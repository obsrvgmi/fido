"use client";

import { useState, type ComponentType } from "react";
import {
  RiFileList3Line,
  RiRobot2Line,
  RiScales3Line,
  RiSafe2Line,
  RiShieldCheckLine,
  RiWallet3Line,
} from "@remixicon/react";
import { Switch } from "@/components/base/switch/switch";
import { Card, PageHeader } from "@/components/dashboard/shell";
import { cx } from "@/utils/cx";

type Agent = {
  id: string;
  name: string;
  icon: ComponentType<{ className?: string }>;
  blurb: string;
  stat: string;
  tasks: string[];
};

const AGENTS: Agent[] = [
  {
    id: "ops",
    name: "Ops Agent",
    icon: RiRobot2Line,
    blurb: "Onboards new hires end to end — contracts, wallet setup and reminders.",
    stat: "38 tasks this week",
    tasks: ["Sent wallet setup to Noah", "Drafted offer letter for Design role"],
  },
  {
    id: "payroll",
    name: "Payroll Agent",
    icon: RiWallet3Line,
    blurb: "Prepares each run, flags anomalies and schedules payouts for approval.",
    stat: "Next run prepared",
    tasks: ["Flagged a 22% salary change for review", "Scheduled payroll for the 28th"],
  },
  {
    id: "invoice",
    name: "Invoice Agent",
    icon: RiFileList3Line,
    blurb: "Reads vendor invoices, matches them to your ledger and queues payments.",
    stat: "142 matched",
    tasks: ["Matched 142 invoices to Q3 ledger", "Queued 4 vendor payments"],
  },
  {
    id: "compliance",
    name: "Compliance Agent",
    icon: RiScales3Line,
    blurb: "Collects tax forms and keeps records audit-ready across jurisdictions.",
    stat: "3 forms collected",
    tasks: ["Collected 3 W-8BEN forms", "Exported October records"],
  },
  {
    id: "treasury",
    name: "Treasury Agent",
    icon: RiSafe2Line,
    blurb: "Keeps enough runway in the payroll token and rebalances via intents.",
    stat: "Runway: 6.7 months",
    tasks: ["Topped up USDC buffer by $40k"],
  },
];

export function AgentsPage() {
  const [on, setOn] = useState<Record<string, boolean>>({ ops: true, payroll: true, invoice: true, compliance: false, treasury: false });
  const activeCount = Object.values(on).filter(Boolean).length;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="AI Agents"
        description={`${activeCount} of ${AGENTS.length} agents running · private inference, your data never trains models`}
      />

      <div className="flex items-center gap-3 rounded-3xl border border-neutral-200 bg-neutral-50/70 p-4">
        <span className="grid size-9 place-items-center rounded-xl bg-white shadow-[0_1px_2px_rgb(0_0_0/0.05),0_0_0_1px_rgb(0_0_0/0.05)]">
          <RiShieldCheckLine className="size-[18px] text-brand-ink" />
        </span>
        <p className="text-body-regular text-neutral-600">
          Agents propose, you approve. Anything that moves money waits for an admin signature.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {AGENTS.map((a) => {
          const enabled = on[a.id];
          return (
            <Card key={a.id} className={cx("flex flex-col p-5 transition-opacity", !enabled && "opacity-75")}>
              <div className="flex items-start justify-between">
                <span
                  className={cx(
                    "grid size-10 place-items-center rounded-2xl transition-colors",
                    enabled ? "bg-neutral-950 text-brand" : "border border-neutral-200 bg-neutral-50 text-neutral-400",
                  )}
                >
                  <a.icon className="size-5" />
                </span>
                <Switch isSelected={enabled} onChange={(v) => setOn((p) => ({ ...p, [a.id]: v }))} aria-label={`Enable ${a.name}`} />
              </div>
              <h2 className="mt-4 text-headline-medium text-neutral-950">{a.name}</h2>
              <p className="mt-1 text-body-regular text-neutral-500">{a.blurb}</p>
              <div className="flex-1" />
              <div className="mt-5 border-t border-neutral-100 pt-4">
                <p className="flex items-center gap-1.5 text-caption-1-medium">
                  <span className={cx("size-1.5 rounded-full", enabled ? "animate-pulse-ring bg-brand" : "bg-neutral-300")} />
                  <span className={enabled ? "text-brand-ink" : "text-neutral-400"}>{enabled ? a.stat : "Paused"}</span>
                </p>
                <ul className="mt-2.5 space-y-1.5">
                  {a.tasks.map((t) => (
                    <li key={t} className="truncate text-caption-1-regular text-neutral-500">
                      · {t}
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
