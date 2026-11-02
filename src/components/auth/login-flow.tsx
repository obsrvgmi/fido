"use client";

import { useEffect, useState, type ComponentType, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Radio, RadioGroup } from "react-aria-components";
import {
  RiArrowLeftLine,
  RiArrowRightLine,
  RiBuilding2Line,
  RiCheckLine,
  RiMailLine,
  RiShieldCheckLine,
  RiUserSmileLine,
} from "@remixicon/react";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { InputOtp } from "@/components/base/input-otp/input-otp";
import { Divider } from "@/components/base/divider/divider";
import { SocialButton } from "@/components/base/social-button/social-button";
import { Spinner } from "@/components/base/spinner/spinner";
import { Logo } from "@/components/marketing/logo";
import { NearMark } from "@/components/brand/near-mark";
import { AuthShowcase } from "./auth-showcase";
import { signIn, useSession, type AuthMethod, type Role } from "@/lib/session";
import { cx } from "@/utils/cx";

type Step = "role" | "method" | "otp" | "connecting" | "done";

const ROLES: { id: Role; title: string; body: string; icon: ComponentType<{ className?: string }> }[] = [
  {
    id: "admin",
    title: "Admin",
    body: "Run payroll, manage people and deploy AI agents for your organization.",
    icon: RiBuilding2Line,
  },
  {
    id: "employee",
    title: "Employee",
    body: "See your payslips, set your payout wallet and pick the token you're paid in.",
    icon: RiUserSmileLine,
  },
];

export function LoginFlow() {
  const router = useRouter();
  const params = useSearchParams();
  const session = useSession();
  const isSignup = params.get("intent") === "signup";

  const [step, setStep] = useState<Step>("role");
  const [role, setRole] = useState<Role>("admin");
  const [method, setMethod] = useState<AuthMethod>("near");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");

  const roleMeta = ROLES.find((r) => r.id === role)!;

  /** Finish auth and route by role / org state. */
  const complete = (m: AuthMethod) => {
    const local = m === "near" ? "" : email.split("@")[0] ?? "";
    const name =
      m === "near"
        ? "alex.near"
        : m === "google"
          ? "Alex Morgan"
          : local.replace(/[._-]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) || "New user";
    signIn({
      name,
      email: m === "email" ? email : m === "google" ? "alex@gmail.com" : "alex.near",
      role,
      method: m,
      wallet: m === "near" ? "alex.near" : undefined,
    });
    setStep("done");
  };

  useEffect(() => {
    if (step !== "done" || !session?.user) return;
    const dest = session.user.role === "employee" ? "/employee" : session.orgs.length ? "/dashboard" : "/onboarding";
    const t = setTimeout(() => router.push(dest), 700);
    return () => clearTimeout(t);
  }, [step, session, router]);

  const connect = (m: AuthMethod) => {
    setMethod(m);
    setStep("connecting");
    setTimeout(() => complete(m), 1400);
  };

  const submitEmail = (e: FormEvent) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) return;
    setMethod("email");
    setStep("otp");
  };

  return (
    <div className="grid min-h-dvh bg-white lg:grid-cols-[1fr_1.05fr]">
      {/* Form column */}
      <div className="flex flex-col px-6 py-6 sm:px-10">
        <div className="flex items-center justify-between">
          <Logo />
          <Link href="/" className="text-body-medium text-neutral-500 transition-colors hover:text-neutral-950">
            Back to site
          </Link>
        </div>

        <div className="mx-auto flex w-full max-w-[400px] flex-1 flex-col justify-center py-12">
          <StepDots step={step} />

          {step === "role" && (
            <section key="role" className="animate-rise">
              <h1 className="mt-6 text-[28px] font-medium leading-tight tracking-[-0.02em] text-neutral-950">
                {isSignup ? "Create your account" : "Welcome back"}
              </h1>
              <p className="mt-2 text-body-regular text-neutral-500">How will you be using Fido?</p>

              <RadioGroup
                aria-label="Account type"
                value={role}
                onChange={(v) => setRole(v as Role)}
                className="mt-7 flex flex-col gap-3"
              >
                {ROLES.map(({ id, title, body, icon: Icon }) => (
                  <Radio
                    key={id}
                    value={id}
                    className={({ isSelected, isFocusVisible }) =>
                      cx(
                        "group relative flex cursor-pointer items-start gap-4 rounded-2xl border bg-white p-4 outline-none transition-all duration-200",
                        isSelected
                          ? "border-neutral-950 shadow-[0_0_0_1px_var(--color-neutral-950),0_8px_24px_-12px_rgb(0_0_0/0.2)]"
                          : "border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50/60",
                        isFocusVisible && "ring-2 ring-brand ring-offset-2",
                      )
                    }
                  >
                    {({ isSelected }) => (
                      <>
                        <span
                          className={cx(
                            "grid size-10 shrink-0 place-items-center rounded-xl border transition-colors",
                            isSelected ? "border-neutral-950 bg-neutral-950 text-white" : "border-neutral-200 bg-neutral-50 text-neutral-500",
                          )}
                        >
                          <Icon className="size-5" />
                        </span>
                        <span className="flex-1">
                          <span className="block text-headline-medium text-neutral-950">{title}</span>
                          <span className="mt-0.5 block text-body-regular text-neutral-500">{body}</span>
                        </span>
                        <span
                          className={cx(
                            "mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border transition-all",
                            isSelected ? "border-brand bg-brand" : "border-neutral-300 bg-white",
                          )}
                        >
                          <RiCheckLine className={cx("size-3.5 text-neutral-950 transition-opacity", isSelected ? "opacity-100" : "opacity-0")} />
                        </span>
                      </>
                    )}
                  </Radio>
                ))}
              </RadioGroup>

              <Button
                className="mt-6 h-11 w-full rounded-xl"
                trailingIcon={RiArrowRightLine}
                onClick={() => setStep("method")}
              >
                Continue as {roleMeta.title}
              </Button>
            </section>
          )}

          {step === "method" && (
            <section key="method" className="animate-rise">
              <BackButton onClick={() => setStep("role")} label={`Signing in as ${roleMeta.title}`} />
              <h1 className="mt-5 text-[28px] font-medium leading-tight tracking-[-0.02em] text-neutral-950">
                {role === "admin" ? "Sign in to your workspace" : "Sign in to your pay portal"}
              </h1>
              <p className="mt-2 text-body-regular text-neutral-500">
                Use your NEAR wallet for one-tap, keyless access.
              </p>

              <div className="mt-7 flex flex-col gap-2.5">
                <button
                  type="button"
                  onClick={() => connect("near")}
                  className="group relative flex h-11 w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-neutral-950 text-body-medium text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.15),0_1px_2px_rgb(0_0_0/0.2)] transition-colors hover:bg-neutral-800"
                >
                  <NearMark className="size-[18px] text-brand" />
                  Continue with NEAR Wallet
                </button>
                <SocialButton
                  brand="google"
                  appearance="white"
                  fullWidth
                  className="h-11 rounded-xl"
                  onClick={() => connect("google")}
                />
              </div>

              <Divider className="my-6">or</Divider>

              <form onSubmit={submitEmail} className="flex flex-col gap-3">
                <Input
                  label="Work email"
                  type="email"
                  placeholder="you@company.com"
                  leadingIcon={RiMailLine}
                  value={email}
                  onChange={setEmail}
                  isRequired
                />
                <Button type="submit" variant="secondary" className="h-11 w-full rounded-xl">
                  Continue with email
                </Button>
              </form>

              <p className="mt-6 text-caption-1-regular text-neutral-400">
                By continuing you agree to Fido&apos;s{" "}
                <a href="#" className="text-neutral-600 underline-offset-2 hover:underline">Terms</a> and{" "}
                <a href="#" className="text-neutral-600 underline-offset-2 hover:underline">Privacy Policy</a>.
              </p>
            </section>
          )}

          {step === "otp" && (
            <section key="otp" className="animate-rise">
              <BackButton onClick={() => setStep("method")} label="Use another method" />
              <span className="mt-6 grid size-11 place-items-center rounded-xl border border-neutral-200 bg-neutral-50">
                <RiMailLine className="size-5 text-neutral-600" />
              </span>
              <h1 className="mt-4 text-[28px] font-medium leading-tight tracking-[-0.02em] text-neutral-950">
                Check your inbox
              </h1>
              <p className="mt-2 text-body-regular text-neutral-500">
                We sent a 6-digit code to <span className="text-neutral-900">{email}</span>.
              </p>
              <InputOtp
                className="mt-7"
                value={code}
                onChange={setCode}
                groupEvery={3}
                onComplete={() => {
                  setStep("connecting");
                  setTimeout(() => complete("email"), 900);
                }}
              />
              <p className="mt-4 text-caption-1-regular text-neutral-400">
                Demo mode — any 6 digits will sign you in.
              </p>
            </section>
          )}

          {(step === "connecting" || step === "done") && (
            <section key="wait" className="animate-rise flex flex-col items-center py-10 text-center">
              <div className="relative grid size-16 place-items-center">
                {step === "connecting" ? (
                  <Spinner size="xl" className="text-neutral-950" aria-label="Signing in" />
                ) : (
                  <span className="grid size-14 place-items-center rounded-full bg-brand shadow-[0_0_0_8px_rgb(0_236_151/0.15)]">
                    <RiCheckLine className="size-7 text-neutral-950" />
                  </span>
                )}
              </div>
              <h2 className="mt-6 text-title-3-medium text-neutral-950">
                {step === "done"
                  ? "You're in"
                  : method === "near"
                    ? "Connecting NEAR wallet…"
                    : method === "google"
                      ? "Signing in with Google…"
                      : "Verifying code…"}
              </h2>
              <p className="mt-1.5 flex items-center gap-1.5 text-body-regular text-neutral-500">
                <RiShieldCheckLine className="size-4 text-brand-ink" />
                {step === "done"
                  ? role === "admin"
                    ? "Taking you to your workspace"
                    : "Opening your pay portal"
                  : "Secured end-to-end"}
              </p>
            </section>
          )}
        </div>

        <p className="text-caption-1-regular text-neutral-400">© {new Date().getFullYear()} Fido Labs</p>
      </div>

      {/* Showcase column */}
      <AuthShowcase role={role} />
    </div>
  );
}

function BackButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-6 inline-flex items-center gap-1.5 rounded-full border border-neutral-200 py-1 pl-1.5 pr-3 text-caption-1-medium text-neutral-600 transition-colors hover:border-neutral-300 hover:text-neutral-950"
    >
      <RiArrowLeftLine className="size-3.5" />
      {label}
    </button>
  );
}

function StepDots({ step }: { step: Step }) {
  const idx = step === "role" ? 0 : step === "method" || step === "otp" ? 1 : 2;
  return (
    <div className="flex items-center gap-1.5" aria-hidden>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={cx(
            "h-1 rounded-full transition-all duration-500",
            i === idx ? "w-6 bg-neutral-950" : i < idx ? "w-3 bg-brand" : "w-3 bg-neutral-200",
          )}
        />
      ))}
    </div>
  );
}
