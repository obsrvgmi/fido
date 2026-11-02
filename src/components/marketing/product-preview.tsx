import {
  RiCheckLine,
  RiLockLine,
  RiRobot2Line,
  RiDashboardLine,
  RiTeamLine,
  RiWallet3Line,
  RiFileList3Line,
  RiSettings3Line,
  RiArrowRightUpLine,
  RiTimeLine,
  RiUserAddLine,
} from "@remixicon/react";
import { Avatar } from "@/components/base/avatar/avatar";
import { Chip } from "@/components/base/badges/chip";
import { Button } from "@/components/base/buttons/button";
import { cx } from "@/utils/cx";

const nav = [
  { icon: RiDashboardLine, label: "Overview" },
  { icon: RiWallet3Line, label: "Payroll", active: true },
  { icon: RiTeamLine, label: "People" },
  { icon: RiRobot2Line, label: "Agents" },
  { icon: RiFileList3Line, label: "Invoices" },
  { icon: RiSettings3Line, label: "Settings" },
];

const team = [
  { name: "Amara Okafor", role: "Engineering", amount: "8,400", token: "USDC", chain: "NEAR", initials: "AO", color: "lime" as const, done: true },
  { name: "Lucas Moreau", role: "Design", amount: "6,250", token: "USDT", chain: "Arbitrum", initials: "LM", color: "blue" as const, done: true },
  { name: "Priya Raman", role: "Operations", amount: "5,900", token: "NEAR", chain: "NEAR", initials: "PR", color: "pink" as const, done: true },
  { name: "Mei Tanaka", role: "Finance", amount: "6,800", token: "USDC", chain: "Solana", initials: "MT", color: "lime" as const, done: true },
  { name: "Diego Alvarez", role: "Growth", amount: "7,100", token: "ETH", chain: "Base", initials: "DA", color: "neutral" as const, done: false },
  { name: "Noah Fischer", role: "Support", amount: "4,600", token: "USDC", chain: "NEAR", initials: "NF", color: "blue" as const, done: false },
];

const agentLog = [
  { icon: RiFileList3Line, text: "Reconciled 142 invoices with Q3 ledger", time: "2m" },
  { icon: RiUserAddLine, text: "Onboarded Priya — contract, wallet, tax form", time: "18m" },
  { icon: RiTimeLine, text: "Scheduled December payroll for the 28th", time: "1h" },
];

export function ProductPreview() {
  return (
    <div className="rounded-[28px] border border-neutral-200 bg-neutral-50 p-2 shadow-[0_24px_60px_-24px_rgb(0_0_0/0.18)]">
      <div className="flex overflow-hidden rounded-[22px] border border-neutral-200 bg-white">
        {/* Sidebar */}
        <aside className="hidden w-52 shrink-0 border-r border-neutral-100 bg-neutral-50/60 p-3 md:block">
          <div className="flex items-center gap-2 px-2 py-1.5">
            <span className="grid size-6 place-items-center rounded-md bg-neutral-950 text-[11px] font-semibold text-white">
              A
            </span>
            <span className="text-body-medium text-neutral-900">Acme Labs</span>
          </div>
          <ul className="mt-4 space-y-0.5">
            {nav.map(({ icon: Icon, label, active }) => (
              <li
                key={label}
                className={cx(
                  "flex items-center gap-2 rounded-lg px-2 py-1.5 text-body-medium",
                  active
                    ? "bg-white text-neutral-950 shadow-[0_1px_2px_rgb(0_0_0/0.06),0_0_0_1px_rgb(0_0_0/0.06)]"
                    : "text-neutral-500",
                )}
              >
                <Icon className={cx("size-4", active ? "text-brand-ink" : "text-neutral-400")} aria-hidden />
                {label}
              </li>
            ))}
          </ul>
          <div className="mt-6 rounded-xl border border-neutral-200 bg-white p-3">
            <p className="text-caption-1-medium text-neutral-500">Treasury</p>
            <p className="mt-1 text-headline-semibold tabular-nums text-neutral-950">$1.24M</p>
            <p className="mt-0.5 flex items-center gap-1 text-caption-2-medium text-brand-ink">
              <RiLockLine className="size-3" aria-hidden /> Shielded
            </p>
          </div>
        </aside>

        {/* Main */}
        <div className="min-w-0 flex-1 p-4 text-left sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-caption-1-medium text-neutral-500">Payroll · November</p>
              <p className="mt-1 text-[30px] font-medium leading-none tracking-tight tabular-nums text-neutral-950">
                $184,920<span className="text-neutral-300">.00</span>
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-1.5">
                <Chip color="lime" variant="caption" className="bg-accent-50 text-brand-ink">
                  <RiLockLine className="mr-1 size-3" aria-hidden /> Private
                </Chip>
                <Chip color="gray" variant="caption">24 people</Chip>
                <Chip color="gray" variant="caption">6 chains</Chip>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" size="small">Review</Button>
              <Button size="small" trailingIcon={RiArrowRightUpLine}>Run payroll</Button>
            </div>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-[1.5fr_1fr]">
            {/* Recipients */}
            <div className="rounded-2xl border border-neutral-200">
              <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-3">
                <p className="text-body-medium text-neutral-900">Recipients</p>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-20 overflow-hidden rounded-full bg-neutral-100">
                    <div className="h-full w-3/4 rounded-full bg-brand" />
                  </div>
                  <span className="text-caption-1-medium tabular-nums text-neutral-500">18/24</span>
                </div>
              </div>
              <ul className="divide-y divide-neutral-100">
                {team.map((p) => (
                  <li key={p.name} className="flex items-center gap-3 px-4 py-2.5">
                    <Avatar size="sm" color={p.color} initials={p.initials} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-body-medium text-neutral-900">{p.name}</p>
                    </div>
                    <span className="hidden text-caption-1-regular text-neutral-400 sm:inline">{p.chain}</span>
                    <p className="w-24 text-right text-body-medium tabular-nums text-neutral-900">
                      {p.amount} <span className="text-neutral-400">{p.token}</span>
                    </p>
                    {p.done ? (
                      <span className="grid size-[18px] place-items-center rounded-full bg-brand">
                        <RiCheckLine className="size-3 text-neutral-950" aria-hidden />
                      </span>
                    ) : (
                      <span className="size-[18px] rounded-full border-2 border-neutral-200 border-t-brand-ink animate-spin" />
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Agent + intent */}
            <div className="flex flex-col gap-4">
              <div className="rounded-2xl border border-neutral-200 p-4">
                <div className="flex items-center justify-between">
                  <p className="flex items-center gap-2 text-body-medium text-neutral-900">
                    <RiRobot2Line className="size-4 text-neutral-400" aria-hidden /> Ops Agent
                  </p>
                  <span className="flex items-center gap-1.5 text-caption-1-medium text-brand-ink">
                    <span className="animate-pulse-ring size-1.5 rounded-full bg-brand" />
                    Working
                  </span>
                </div>
                <ul className="mt-3 space-y-2.5">
                  {agentLog.map(({ icon: Icon, text, time }) => (
                    <li key={text} className="flex items-start gap-2">
                      <Icon className="mt-0.5 size-3.5 shrink-0 text-neutral-400" aria-hidden />
                      <p className="flex-1 text-caption-1-regular leading-5 text-neutral-600">{text}</p>
                      <span className="text-caption-2-regular text-neutral-400">{time}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-neutral-200 bg-neutral-50/70 p-4">
                <p className="text-caption-1-medium text-neutral-500">NEAR Intent</p>
                <p className="mt-1.5 text-body-regular text-neutral-700">
                  Pay <span className="text-neutral-950">$6,250</span> to Lucas in{" "}
                  <span className="text-neutral-950">USDT on Arbitrum</span> from treasury USDC.
                </p>
                <div className="mt-3 flex items-center justify-between rounded-lg border border-neutral-200 bg-white px-2.5 py-1.5 font-mono text-[11px]">
                  <span className="text-neutral-400">solver · best route</span>
                  <span className="text-brand-ink">filled 2.1s</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
