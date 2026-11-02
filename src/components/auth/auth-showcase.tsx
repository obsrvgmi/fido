import { RiCheckLine, RiLockLine, RiRobot2Line } from "@remixicon/react";
import type { Role } from "@/lib/session";

/** Right-hand visual on the auth screens: a dark, quiet panel with floating product cards. */
export function AuthShowcase({ role }: { role: Role }) {
  return (
    <div className="relative m-3 hidden overflow-hidden rounded-[28px] bg-neutral-950 lg:block">
      <div
        aria-hidden
        className="absolute inset-0 [background-image:radial-gradient(rgb(255_255_255/0.07)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
      />
      <div aria-hidden className="absolute -right-24 -top-24 size-[480px] rounded-full bg-brand/20 blur-[120px]" />
      <div aria-hidden className="absolute -bottom-32 -left-20 size-[380px] rounded-full bg-brand/10 blur-[100px]" />

      <div className="relative flex h-full flex-col justify-between p-12">
        <p className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-caption-1-medium text-neutral-300">
          <span className="size-1.5 rounded-full bg-brand" /> Private payroll on NEAR
        </p>

        {/* Floating cards */}
        <div className="relative mx-auto h-[380px] w-full max-w-[500px]">
          <div className="absolute left-0 top-4 w-[300px] rounded-2xl border border-white/10 bg-white/[0.06] p-4 shadow-2xl backdrop-blur-xl">
            <p className="text-caption-1-medium text-neutral-400">
              {role === "admin" ? "November payroll" : "Your next payout"}
            </p>
            <p className="mt-1 text-[28px] font-medium tracking-tight text-white tabular-nums">
              {role === "admin" ? "$184,920" : "$8,400"}
              <span className="text-neutral-600">.00</span>
            </p>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-3/4 rounded-full bg-brand" />
            </div>
            <p className="mt-2 flex items-center gap-1.5 text-caption-1-medium text-neutral-400">
              <RiLockLine className="size-3.5 text-brand" /> Amounts shielded onchain
            </p>
          </div>

          <div className="absolute right-0 top-[170px] w-[260px] rounded-2xl border border-white/10 bg-white/[0.06] p-4 shadow-2xl backdrop-blur-xl">
            <p className="flex items-center gap-2 text-body-medium text-white">
              <RiRobot2Line className="size-4 text-brand" /> Ops Agent
            </p>
            <ul className="mt-3 space-y-2">
              {["Reconciled 142 invoices", "Collected 3 tax forms", "Scheduled next payroll"].map((t) => (
                <li key={t} className="flex items-center gap-2 text-caption-1-regular text-neutral-300">
                  <span className="grid size-4 place-items-center rounded-full bg-brand">
                    <RiCheckLine className="size-3 text-neutral-950" />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <div className="absolute bottom-0 left-10 flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2.5 shadow-2xl backdrop-blur-xl">
            <span className="grid size-8 place-items-center rounded-lg bg-brand text-caption-1-bold text-neutral-950">✓</span>
            <div>
              <p className="text-caption-1-medium text-white">Intent filled · USDT on Arbitrum</p>
              <p className="text-caption-2-regular text-neutral-400">Solver matched best route in 2.1s</p>
            </div>
          </div>
        </div>

        <figure>
          <blockquote className="max-w-md text-[22px] font-medium leading-snug tracking-[-0.01em] text-white">
            Your business runs.{" "}
            <span className="text-neutral-500">Payroll runs itself.</span>
          </blockquote>
          <figcaption className="mt-3 text-body-regular text-neutral-500">
            Private onchain payroll and AI agents, in one workspace.
          </figcaption>
        </figure>
      </div>
    </div>
  );
}
