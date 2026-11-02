"use client";

import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  RiAddLine,
  RiArrowLeftLine,
  RiArrowRightLine,
  RiCheckLine,
  RiCloseLine,
  RiLockLine,
  RiMagicLine,
  RiSparkling2Line,
} from "@remixicon/react";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { Select, SelectItem } from "@/components/base/select/select";
import { Switch } from "@/components/base/switch/switch";
import { SegmentedControl, SegmentedControlItem } from "@/components/base/segmented-control/segmented-control";
import { Avatar } from "@/components/base/avatar/avatar";
import { Spinner } from "@/components/base/spinner/spinner";
import { Logo } from "@/components/marketing/logo";
import { useGuard } from "@/lib/use-guard";
import {
  CHAINS,
  COUNTRIES,
  SAMPLE_TEAM,
  TOKENS,
  createOrg,
  initials,
  signOut,
  slugify,
  usd,
  type Employee,
} from "@/lib/session";
import { cx } from "@/utils/cx";

const STEPS = [
  { title: "Organization", hint: "Name and basics" },
  { title: "Payroll", hint: "Tokens, chain, cadence" },
  { title: "Team", hint: "Who you pay" },
];

const SIZES = ["1–10", "11–50", "51–200", "200+"];

type Draft = {
  name: string;
  slug: string;
  slugTouched: boolean;
  country: string;
  size: string;
  token: string;
  chain: string;
  cycle: "monthly" | "biweekly";
  shielded: boolean;
  employees: Omit<Employee, "id">[];
};

export function CreateOrgWizard() {
  const session = useGuard("admin");
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [phase, setPhase] = useState<"form" | "creating" | "ready">("form");
  const [d, setD] = useState<Draft>({
    name: "",
    slug: "",
    slugTouched: false,
    country: "United States",
    size: "11–50",
    token: "USDC",
    chain: "NEAR",
    cycle: "monthly",
    shielded: true,
    employees: [],
  });
  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setD((p) => ({ ...p, [k]: v }));

  const [newHire, setNewHire] = useState({ name: "", email: "", salary: "" });

  if (!session) return <FullPageSpinner />;
  const hasOrgs = session.orgs.length > 0;

  const canNext = step === 0 ? d.name.trim().length >= 2 && d.slug.length >= 2 : true;

  const finish = () => {
    setPhase("creating");
    setTimeout(() => {
      createOrg({
        name: d.name.trim(),
        slug: d.slug,
        country: d.country,
        size: d.size,
        token: d.token,
        chain: d.chain,
        cycle: d.cycle,
        shielded: d.shielded,
        employees: d.employees.map((e, i) => ({ ...e, id: `${i}-${e.email}` })),
      });
      setPhase("ready");
    }, 1800);
  };

  const addHire = () => {
    if (!newHire.name.trim() || !/^\S+@\S+\.\S+$/.test(newHire.email)) return;
    set("employees", [
      ...d.employees,
      {
        name: newHire.name.trim(),
        email: newHire.email.trim(),
        title: "Team member",
        department: "General",
        salary: Number(newHire.salary) || 5000,
        token: d.token,
        chain: d.chain,
        status: "invited",
        startDate: new Date().toISOString().slice(0, 10),
      },
    ]);
    setNewHire({ name: "", email: "", salary: "" });
  };

  const total = d.employees.reduce((s, e) => s + e.salary, 0);

  return (
    <div className="min-h-dvh bg-neutral-50">
      {/* Top bar */}
      <header className="flex h-16 items-center justify-between border-b border-neutral-200/70 bg-white px-4 sm:px-6">
        <Logo />
        <div className="flex items-center gap-3">
          {hasOrgs && phase === "form" && (
            <Link href="/dashboard" className="text-body-medium text-neutral-500 hover:text-neutral-950">
              Cancel
            </Link>
          )}
          <span className="hidden text-body-regular text-neutral-400 sm:inline">{session.user?.name}</span>
          <Button
            variant="secondary"
            size="small"
            onClick={() => {
              signOut();
              router.push("/login");
            }}
          >
            Sign out
          </Button>
        </div>
      </header>

      {phase !== "form" ? (
        <div className="grid min-h-[calc(100dvh-64px)] place-items-center px-4">
          <div className="animate-rise flex max-w-sm flex-col items-center text-center">
            {phase === "creating" ? (
              <>
                <Spinner size="xl" className="text-neutral-950" aria-label="Creating organization" />
                <h1 className="mt-6 text-title-2-medium tracking-tight text-neutral-950">Setting up {d.name}…</h1>
                <ul className="mt-5 space-y-2 text-left">
                  {["Provisioning private treasury", `Routing payouts via NEAR Intents`, "Waking up your Ops Agent"].map((t, i) => (
                    <li
                      key={t}
                      className="animate-rise flex items-center gap-2 text-body-regular text-neutral-500"
                      style={{ animationDelay: `${i * 400}ms` }}
                    >
                      <span className="size-1.5 rounded-full bg-brand" /> {t}
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <>
                <span className="grid size-16 place-items-center rounded-2xl bg-neutral-950 text-[22px] font-semibold text-white shadow-[0_0_0_6px_rgb(0_236_151/0.18)]">
                  {initials(d.name)}
                </span>
                <h1 className="mt-6 text-title-2-medium tracking-tight text-neutral-950">{d.name} is ready</h1>
                <p className="mt-2 text-body-regular text-neutral-500">
                  Your workspace lives at <span className="text-neutral-900">fido.app/{d.slug}</span>.
                  {d.employees.length > 0 && ` ${d.employees.length} people added.`}
                </p>
                <Button className="mt-7 h-11 rounded-xl px-5" trailingIcon={RiArrowRightLine} onClick={() => router.push("/dashboard")}>
                  Open dashboard
                </Button>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[220px_minmax(0,1fr)_340px] lg:py-14">
          {/* Stepper */}
          <nav aria-label="Progress" className="lg:pt-2">
            <ol className="flex gap-2 lg:flex-col lg:gap-1">
              {STEPS.map((s, i) => (
                <li key={s.title} className="flex-1 lg:flex-none">
                  <button
                    type="button"
                    onClick={() => i < step && setStep(i)}
                    disabled={i > step}
                    className={cx(
                      "flex w-full items-center gap-3 rounded-xl p-2 text-left transition-colors",
                      i === step ? "bg-white shadow-[0_1px_2px_rgb(0_0_0/0.05),0_0_0_1px_rgb(0_0_0/0.06)]" : i < step && "hover:bg-white/60",
                    )}
                  >
                    <span
                      className={cx(
                        "grid size-7 shrink-0 place-items-center rounded-full text-caption-1-semibold",
                        i < step
                          ? "bg-brand text-neutral-950"
                          : i === step
                            ? "bg-neutral-950 text-white"
                            : "border border-neutral-200 bg-white text-neutral-400",
                      )}
                    >
                      {i < step ? <RiCheckLine className="size-4" /> : i + 1}
                    </span>
                    <span className="hidden min-w-0 sm:block">
                      <span className={cx("block text-body-medium", i <= step ? "text-neutral-950" : "text-neutral-400")}>{s.title}</span>
                      <span className="block text-caption-1-regular text-neutral-400">{s.hint}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ol>
          </nav>

          {/* Form card */}
          <div key={step} className="animate-rise rounded-3xl border border-neutral-200 bg-white p-6 shadow-[0_1px_2px_rgb(0_0_0/0.04)] sm:p-8">
            {step === 0 && (
              <StepShell
                eyebrow="Step 1 of 3"
                title={hasOrgs ? "Create a new organization" : "Create your organization"}
                description="This is the workspace your team, payroll and agents live in. You can create more later."
              >
                <Input
                  label="Organization name"
                  placeholder="Acme Labs"
                  value={d.name}
                  autoFocus
                  onChange={(v) => setD((p) => ({ ...p, name: v, slug: p.slugTouched ? p.slug : slugify(v) }))}
                />
                <Input
                  label="Workspace URL"
                  placeholder="acme-labs"
                  value={d.slug}
                  onChange={(v) => setD((p) => ({ ...p, slug: slugify(v), slugTouched: true }))}
                  leadingAddon={<span className="text-body-regular text-neutral-400">fido.app/</span>}
                />
                <Select label="Country of incorporation" selectedKey={d.country} onSelectionChange={(k) => set("country", String(k))}>
                  {COUNTRIES.map((c) => (
                    <SelectItem key={c} id={c}>{c}</SelectItem>
                  ))}
                </Select>
                <Field label="Team size">
                  <SegmentedControl
                    aria-label="Team size"
                    selectedKeys={[d.size]}
                    onSelectionChange={(keys) => {
                      const k = [...keys][0];
                      if (k) set("size", String(k));
                    }}
                  >
                    {SIZES.map((s) => (
                      <SegmentedControlItem key={s} id={s}>{s}</SegmentedControlItem>
                    ))}
                  </SegmentedControl>
                </Field>
              </StepShell>
            )}

            {step === 1 && (
              <StepShell
                eyebrow="Step 2 of 3"
                title="How you pay"
                description="Defaults for new hires. Each employee can still choose their own token and chain — NEAR Intents handles the swap."
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <Select label="Treasury token" selectedKey={d.token} onSelectionChange={(k) => set("token", String(k))}>
                    {TOKENS.map((t) => (
                      <SelectItem key={t} id={t}>{t}</SelectItem>
                    ))}
                  </Select>
                  <Select label="Settlement chain" selectedKey={d.chain} onSelectionChange={(k) => set("chain", String(k))}>
                    {CHAINS.map((c) => (
                      <SelectItem key={c} id={c}>{c}</SelectItem>
                    ))}
                  </Select>
                </div>
                <Field label="Pay cycle">
                  <SegmentedControl
                    aria-label="Pay cycle"
                    selectedKeys={[d.cycle]}
                    onSelectionChange={(keys) => {
                      const k = [...keys][0];
                      if (k) set("cycle", k as Draft["cycle"]);
                    }}
                  >
                    <SegmentedControlItem id="monthly">Monthly</SegmentedControlItem>
                    <SegmentedControlItem id="biweekly">Every 2 weeks</SegmentedControlItem>
                  </SegmentedControl>
                </Field>
                <div className="flex items-start justify-between gap-4 rounded-2xl border border-neutral-200 p-4">
                  <div className="flex gap-3">
                    <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-accent-50">
                      <RiLockLine className="size-[18px] text-brand-ink" />
                    </span>
                    <div>
                      <p className="text-body-medium text-neutral-950">Shielded payroll</p>
                      <p className="mt-0.5 text-body-regular text-neutral-500">
                        Salaries settle onchain but amounts and recipients stay private.
                      </p>
                    </div>
                  </div>
                  <Switch isSelected={d.shielded} onChange={(v) => set("shielded", v)} aria-label="Shielded payroll" />
                </div>
              </StepShell>
            )}

            {step === 2 && (
              <StepShell
                eyebrow="Step 3 of 3"
                title="Add your team"
                description="Invite people now or skip and do it from the dashboard. They'll get a link to connect a wallet."
                action={
                  d.employees.length === 0 ? (
                    <Button
                      variant="secondary"
                      size="small"
                      leadingIcon={RiMagicLine}
                      onClick={() => set("employees", SAMPLE_TEAM.map((e) => ({ ...e, token: e.token, chain: e.chain })))}
                    >
                      Use sample team
                    </Button>
                  ) : undefined
                }
              >
                <div className="grid gap-2 sm:grid-cols-[1fr_1.2fr_110px_auto]">
                  <Input aria-label="Full name" placeholder="Full name" value={newHire.name} onChange={(v) => setNewHire((p) => ({ ...p, name: v }))} />
                  <Input aria-label="Email" type="email" placeholder="name@company.com" value={newHire.email} onChange={(v) => setNewHire((p) => ({ ...p, email: v }))} />
                  <Input
                    aria-label="Monthly salary"
                    placeholder="5,000"
                    inputMode="numeric"
                    value={newHire.salary}
                    onChange={(v) => setNewHire((p) => ({ ...p, salary: v.replace(/[^0-9]/g, "") }))}
                    leadingAddon={<span className="text-body-regular text-neutral-400">$</span>}
                  />
                  <Button variant="secondary" iconOnly leadingIcon={RiAddLine} aria-label="Add person" onClick={addHire} />
                </div>

                {d.employees.length === 0 ? (
                  <div className="grid place-items-center rounded-2xl border border-dashed border-neutral-200 bg-neutral-50/60 px-6 py-10 text-center">
                    <p className="text-body-medium text-neutral-700">No one added yet</p>
                    <p className="mt-1 text-body-regular text-neutral-400">Add people above, or load a sample team to explore.</p>
                  </div>
                ) : (
                  <ul className="divide-y divide-neutral-100 rounded-2xl border border-neutral-200">
                    {d.employees.map((e, i) => (
                      <li key={e.email + i} className="flex items-center gap-3 px-4 py-2.5">
                        <Avatar size="sm" initials={initials(e.name)} />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-body-medium text-neutral-900">{e.name}</p>
                          <p className="truncate text-caption-1-regular text-neutral-400">{e.email}</p>
                        </div>
                        <span className="text-body-medium tabular-nums text-neutral-700">{usd(e.salary)}</span>
                        <span className="hidden text-caption-1-regular text-neutral-400 sm:inline">
                          {e.token} · {e.chain}
                        </span>
                        <button
                          type="button"
                          aria-label={`Remove ${e.name}`}
                          onClick={() => set("employees", d.employees.filter((_, j) => j !== i))}
                          className="grid size-7 place-items-center rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
                        >
                          <RiCloseLine className="size-4" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </StepShell>
            )}

            <div className="mt-8 flex items-center justify-between border-t border-neutral-100 pt-6">
              {step > 0 ? (
                <Button variant="secondary" leadingIcon={RiArrowLeftLine} onClick={() => setStep(step - 1)}>
                  Back
                </Button>
              ) : (
                <span />
              )}
              {step < 2 ? (
                <Button trailingIcon={RiArrowRightLine} disabled={!canNext} onClick={() => setStep(step + 1)}>
                  Continue
                </Button>
              ) : (
                <Button leadingIcon={RiSparkling2Line} onClick={finish}>
                  {d.employees.length ? "Create organization" : "Skip & create"}
                </Button>
              )}
            </div>
          </div>

          {/* Live preview */}
          <aside className="hidden lg:block">
            <p className="mb-3 text-caption-1-medium uppercase tracking-[0.08em] text-neutral-400">Preview</p>
            <div className="sticky top-6 rounded-3xl border border-neutral-200 bg-white p-5">
              <div className="flex items-center gap-3">
                <span className="grid size-11 place-items-center rounded-xl bg-neutral-950 text-body-semibold text-white">
                  {d.name ? initials(d.name) : "—"}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-headline-medium text-neutral-950">{d.name || "Your organization"}</p>
                  <p className="truncate text-caption-1-regular text-neutral-400">fido.app/{d.slug || "workspace"}</p>
                </div>
              </div>
              <dl className="mt-5 space-y-2.5 border-t border-neutral-100 pt-4 text-body-regular">
                <PreviewRow label="Country" value={d.country} />
                <PreviewRow label="Team size" value={d.size} />
                <PreviewRow label="Pays in" value={`${d.token} on ${d.chain}`} />
                <PreviewRow label="Cycle" value={d.cycle === "monthly" ? "Monthly" : "Every 2 weeks"} />
                <PreviewRow
                  label="Privacy"
                  value={
                    d.shielded ? (
                      <span className="inline-flex items-center gap-1 text-brand-ink">
                        <RiLockLine className="size-3.5" /> Shielded
                      </span>
                    ) : (
                      "Public"
                    )
                  }
                />
              </dl>
              <div className="mt-4 rounded-2xl bg-neutral-50 p-4">
                <p className="text-caption-1-medium text-neutral-500">Monthly payroll</p>
                <p className="mt-1 text-[26px] font-medium tracking-tight tabular-nums text-neutral-950">{usd(total)}</p>
                <div className="mt-2 flex -space-x-1.5">
                  {d.employees.slice(0, 6).map((e) => (
                    <Avatar key={e.email} size="sm" initials={initials(e.name)} className="ring-2 ring-neutral-50" />
                  ))}
                  {d.employees.length === 0 && <span className="text-caption-1-regular text-neutral-400">No people yet</span>}
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

function StepShell({
  eyebrow,
  title,
  description,
  action,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-caption-1-medium text-neutral-400">{eyebrow}</p>
          <h1 className="mt-1.5 text-title-2-medium tracking-tight text-neutral-950">{title}</h1>
          <p className="mt-1.5 max-w-md text-body-regular text-neutral-500">{description}</p>
        </div>
        {action}
      </div>
      <div className="mt-7 flex flex-col gap-5">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-body-medium text-text-primary">{label}</span>
      <div className="w-fit">{children}</div>
    </div>
  );
}

function PreviewRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-neutral-400">{label}</dt>
      <dd className="truncate text-neutral-900">{value}</dd>
    </div>
  );
}

export function FullPageSpinner() {
  return (
    <div className="grid min-h-dvh place-items-center bg-white">
      <Spinner size="lg" className="text-neutral-950" />
    </div>
  );
}
