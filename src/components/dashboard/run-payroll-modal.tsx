"use client";

import { useEffect, useState } from "react";
import { RiCheckLine, RiLockLine, RiWallet3Line } from "@remixicon/react";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "@/components/base/modal/modal";
import { Button } from "@/components/base/buttons/button";
import { Avatar } from "@/components/base/avatar/avatar";
import { initials, monthlyTotal, recordRun, usd, type Org } from "@/lib/session";
import { cx } from "@/utils/cx";

type Phase = "review" | "running" | "done";

/**
 * Review → run → done. "Running" simulates each payout being submitted as a
 * NEAR Intent and filled by a solver, one by one.
 */
export function RunPayrollModal({ org, isOpen, onOpenChange }: { org: Org; isOpen: boolean; onOpenChange: (o: boolean) => void }) {
  const [phase, setPhase] = useState<Phase>("review");
  const [filled, setFilled] = useState(0);
  const payees = org.employees.filter((e) => e.status === "active");
  const total = monthlyTotal({ ...org, employees: payees });
  const period = new Date().toLocaleString("en-US", { month: "long", year: "numeric" });

  useEffect(() => {
    if (!isOpen) {
      const t = setTimeout(() => {
        setPhase("review");
        setFilled(0);
      }, 300);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  useEffect(() => {
    if (phase !== "running") return;
    const t = setTimeout(() => {
      if (filled + 1 >= payees.length) {
        recordRun(org.id, { period, date: new Date().toISOString(), total, people: payees.length, status: "settled" });
        setFilled(payees.length);
        setPhase("done");
      } else {
        setFilled(filled + 1);
      }
    }, 450);
    return () => clearTimeout(t);
  }, [phase, filled, payees.length, org.id, period, total]);

  const byToken = payees.reduce<Record<string, number>>((acc, e) => {
    acc[`${e.token} · ${e.chain}`] = (acc[`${e.token} · ${e.chain}`] ?? 0) + e.salary;
    return acc;
  }, {});

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="md" isDismissable={phase !== "running"}>
      {({ close }) => (
        <>
          <ModalHeader
            icon={phase === "done" ? RiCheckLine : RiWallet3Line}
            title={phase === "done" ? "Payroll settled" : phase === "running" ? "Paying your team…" : `Run ${period} payroll`}
            description={
              phase === "done"
                ? `${payees.length} payouts filled via NEAR Intents.`
                : phase === "running"
                  ? "Each payout is submitted as an intent and filled by the best solver."
                  : `${payees.length} active people · paid from ${org.token} on ${org.chain}`
            }
            showCloseButton={phase !== "running"}
          />
          <ModalBody>
            {payees.length === 0 ? (
              <p className="rounded-2xl bg-neutral-50 p-4 text-body-regular text-neutral-500">
                No active employees yet. Add people from the People page first.
              </p>
            ) : phase === "review" ? (
              <div className="flex flex-col gap-4">
                <div className="rounded-2xl bg-neutral-50 p-4">
                  <p className="text-caption-1-medium text-neutral-500">Total</p>
                  <p className="mt-1 text-[30px] font-medium leading-none tracking-tight tabular-nums text-neutral-950">{usd(total, 2)}</p>
                  {org.shielded && (
                    <p className="mt-2.5 flex items-center gap-1.5 text-caption-1-medium text-brand-ink">
                      <RiLockLine className="size-3.5" /> Amounts and recipients stay shielded onchain
                    </p>
                  )}
                </div>
                <ul className="flex flex-col gap-2">
                  {Object.entries(byToken).map(([k, v]) => (
                    <li key={k} className="flex items-center gap-3 text-body-regular">
                      <span className="w-36 shrink-0 text-neutral-600">{k}</span>
                      <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-neutral-100">
                        <span className="block h-full rounded-full bg-brand" style={{ width: `${(v / total) * 100}%` }} />
                      </span>
                      <span className="w-20 text-right tabular-nums text-neutral-900">{usd(v)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <div className="h-1.5 overflow-hidden rounded-full bg-neutral-100">
                  <div
                    className="h-full rounded-full bg-brand transition-[width] duration-500 ease-out"
                    style={{ width: `${(filled / payees.length) * 100}%` }}
                  />
                </div>
                <ul className="max-h-64 divide-y divide-neutral-100 overflow-auto rounded-2xl border border-neutral-200">
                  {payees.map((e, i) => {
                    const done = i < filled;
                    const active = i === filled && phase === "running";
                    return (
                      <li key={e.id} className="flex items-center gap-3 px-3.5 py-2.5">
                        <Avatar size="sm" initials={initials(e.name)} />
                        <span className="flex-1 truncate text-body-medium text-neutral-900">{e.name}</span>
                        <span className="text-caption-1-regular text-neutral-400">
                          {e.token} · {e.chain}
                        </span>
                        <span
                          className={cx(
                            "grid size-[18px] place-items-center rounded-full transition-all",
                            done ? "bg-brand" : active ? "animate-spin border-2 border-neutral-200 border-t-brand-ink" : "border-2 border-neutral-200",
                          )}
                        >
                          {done && <RiCheckLine className="size-3 text-neutral-950" />}
                        </span>
                      </li>
                    );
                  })}
                </ul>
                <p className="text-caption-1-regular tabular-nums text-neutral-400">
                  {filled} / {payees.length} intents filled
                </p>
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            {phase === "review" && (
              <>
                <Button variant="secondary" onClick={close}>Cancel</Button>
                <Button onClick={() => setPhase("running")} disabled={payees.length === 0}>
                  Confirm & pay {payees.length > 0 && usd(total)}
                </Button>
              </>
            )}
            {phase === "running" && <Button disabled>Processing…</Button>}
            {phase === "done" && <Button onClick={close}>Done</Button>}
          </ModalFooter>
        </>
      )}
    </Modal>
  );
}
