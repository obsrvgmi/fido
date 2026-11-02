import {
  RiArrowLeftRightLine,
  RiCheckLine,
  RiLockLine,
  RiRobot2Line,
} from "@remixicon/react";
import type { ReactNode } from "react";

/** Feature tiles in the style of BoardUI's component cards:
 *  a preview on top, a title and a muted one-line description beneath. */
export function Features() {
  return (
    <section id="payroll" className="px-4 pb-28 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-baseline gap-2">
          <h2 className="text-title-2-medium tracking-tight text-neutral-950">One workspace</h2>
          <span className="text-body-regular text-neutral-400">Everything payroll and ops touch.</span>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Tile title="Private payroll" description="Salaries settle onchain, amounts stay confidential.">
            <div className="w-full max-w-[220px] space-y-2">
              {[
                ["Engineering", "••••••"],
                ["Design", "••••••"],
                ["Operations", "••••••"],
              ].map(([team, amt]) => (
                <div
                  key={team}
                  className="flex items-center justify-between rounded-lg border border-neutral-200 bg-white px-3 py-2 text-caption-1-medium"
                >
                  <span className="text-neutral-700">{team}</span>
                  <span className="flex items-center gap-1 text-neutral-400">
                    <RiLockLine className="size-3 text-brand-ink" aria-hidden /> {amt}
                  </span>
                </div>
              ))}
            </div>
          </Tile>

          <Tile title="AI agents" description="Reconcile, onboard and file — without the busywork.">
            <div className="w-full max-w-[230px] rounded-xl border border-neutral-200 bg-white p-3">
              <p className="flex items-center gap-1.5 text-caption-1-medium text-neutral-900">
                <RiRobot2Line className="size-3.5 text-neutral-400" aria-hidden /> Ops Agent
              </p>
              <ul className="mt-2.5 space-y-1.5">
                {["Match invoices", "Collect W-8BEN", "Schedule payroll"].map((t, i) => (
                  <li key={t} className="flex items-center gap-2 text-caption-1-regular text-neutral-600">
                    {i < 2 ? (
                      <span className="grid size-3.5 place-items-center rounded-full bg-brand">
                        <RiCheckLine className="size-2.5 text-neutral-950" aria-hidden />
                      </span>
                    ) : (
                      <span className="size-3.5 animate-spin rounded-full border-[1.5px] border-neutral-200 border-t-brand-ink" />
                    )}
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </Tile>

          <Tile title="NEAR Intents" description="Pay in any token on any chain. Solvers find the route.">
            <div className="flex items-center gap-2">
              <TokenPill label="USDC" sub="NEAR" />
              <span className="grid size-7 place-items-center rounded-full border border-neutral-200 bg-white">
                <RiArrowLeftRightLine className="size-3.5 text-brand-ink" aria-hidden />
              </span>
              <TokenPill label="USDT" sub="Arbitrum" />
            </div>
          </Tile>
        </div>
      </div>
    </section>
  );
}

function Tile({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return (
    <article className="tile group p-4 transition-shadow hover:shadow-[0_8px_24px_-12px_rgb(0_0_0/0.12)]">
      <div className="grid h-44 place-items-center rounded-2xl bg-neutral-50 px-4">{children}</div>
      <div className="px-1 pb-1 pt-4">
        <h3 className="text-headline-medium text-neutral-950">{title}</h3>
        <p className="mt-1 text-body-regular text-neutral-500">{description}</p>
      </div>
    </article>
  );
}

function TokenPill({ label, sub }: { label: string; sub: string }) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-left">
      <p className="text-body-medium text-neutral-900">{label}</p>
      <p className="text-caption-2-regular text-neutral-400">{sub}</p>
    </div>
  );
}
