"use client";

import { useMemo, useState } from "react";
import { RiSearchLine, RiTeamLine, RiUserAddLine } from "@remixicon/react";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { Avatar } from "@/components/base/avatar/avatar";
import { SegmentedControl, SegmentedControlItem } from "@/components/base/segmented-control/segmented-control";
import { Card, PageHeader } from "@/components/dashboard/shell";
import { AddEmployeeModal } from "@/components/dashboard/add-employee-modal";
import { initials, monthlyTotal, useCurrentOrg, usd, type EmployeeStatus } from "@/lib/session";
import { cx } from "@/utils/cx";

const STATUS: Record<EmployeeStatus, { label: string; cls: string; dot: string }> = {
  active: { label: "Active", cls: "bg-accent-50 text-brand-ink", dot: "bg-brand" },
  invited: { label: "Invited", cls: "bg-neutral-100 text-neutral-600", dot: "bg-neutral-400" },
  paused: { label: "Paused", cls: "bg-amber-50 text-amber-700", dot: "bg-amber-500" },
};

export function PeoplePage() {
  const org = useCurrentOrg();
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<"all" | EmployeeStatus>("all");
  const [addOpen, setAddOpen] = useState(false);

  const rows = useMemo(() => {
    if (!org) return [];
    const needle = q.toLowerCase();
    return org.employees.filter(
      (e) =>
        (filter === "all" || e.status === filter) &&
        (!needle || [e.name, e.email, e.title, e.department].some((s) => s.toLowerCase().includes(needle))),
    );
  }, [org, q, filter]);

  if (!org) return null;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="People"
        description={`${org.employees.length} people · ${usd(monthlyTotal(org))} per month`}
        actions={
          <Button leadingIcon={RiUserAddLine} onClick={() => setAddOpen(true)}>
            Add employee
          </Button>
        }
      />

      <Card className="overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-100 p-4">
          <SegmentedControl
            aria-label="Filter by status"
            selectedKeys={[filter]}
            onSelectionChange={(keys) => {
              const k = [...keys][0];
              if (k) setFilter(k as typeof filter);
            }}
          >
            <SegmentedControlItem id="all">All</SegmentedControlItem>
            <SegmentedControlItem id="active">Active</SegmentedControlItem>
            <SegmentedControlItem id="invited">Invited</SegmentedControlItem>
          </SegmentedControl>
          <Input
            aria-label="Search people"
            placeholder="Search name, email, team…"
            leadingIcon={RiSearchLine}
            value={q}
            onChange={setQ}
            size="small"
            className="w-full sm:w-72"
          />
        </div>

        {rows.length === 0 ? (
          <div className="grid place-items-center px-6 py-16 text-center">
            <RiTeamLine className="size-6 text-neutral-300" />
            <p className="mt-3 text-body-medium text-neutral-700">{org.employees.length ? "No matches" : "No people yet"}</p>
            <p className="mt-1 text-body-regular text-neutral-400">
              {org.employees.length ? "Try a different search or filter." : "Add your first employee to start paying your team."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left">
              <thead>
                <tr className="text-caption-1-medium text-neutral-400">
                  <th className="px-5 py-3 font-medium">Name</th>
                  <th className="px-3 py-3 font-medium">Role</th>
                  <th className="px-3 py-3 font-medium">Paid in</th>
                  <th className="px-3 py-3 font-medium">Status</th>
                  <th className="px-3 py-3 font-medium">Start date</th>
                  <th className="px-5 py-3 text-right font-medium">Monthly</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 border-t border-neutral-100">
                {rows.map((e) => (
                  <tr key={e.id} className="transition-colors hover:bg-neutral-50/70">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar size="md" initials={initials(e.name)} />
                        <div className="min-w-0">
                          <p className="truncate text-body-medium text-neutral-950">{e.name}</p>
                          <p className="truncate text-caption-1-regular text-neutral-400">{e.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <p className="text-body-regular text-neutral-900">{e.title}</p>
                      <p className="text-caption-1-regular text-neutral-400">{e.department}</p>
                    </td>
                    <td className="px-3 py-3">
                      <span className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 px-2 py-1 text-caption-1-medium text-neutral-700">
                        {e.token}
                        <span className="text-neutral-300">·</span>
                        <span className="text-neutral-500">{e.chain}</span>
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <span className={cx("inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-caption-1-medium", STATUS[e.status].cls)}>
                        <span className={cx("size-1.5 rounded-full", STATUS[e.status].dot)} />
                        {STATUS[e.status].label}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-body-regular text-neutral-500">
                      {new Date(e.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </td>
                    <td className="px-5 py-3 text-right text-body-medium tabular-nums text-neutral-950">{usd(e.salary)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <AddEmployeeModal org={org} isOpen={addOpen} onOpenChange={setAddOpen} />
    </div>
  );
}
