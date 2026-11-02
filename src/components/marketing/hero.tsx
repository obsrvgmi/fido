import { RiArrowRightLine, RiArrowRightSLine } from "@remixicon/react";
import { ButtonLink } from "@/components/base/buttons/button";
import { ProductPreview } from "./product-preview";

export function Hero() {
  return (
    <section className="relative px-4 pb-20 pt-20 sm:px-6 sm:pt-28">
      <div
        aria-hidden
        className="dot-grid pointer-events-none absolute inset-x-0 top-0 -z-10 h-[560px] [mask-image:radial-gradient(ellipse_60%_70%_at_50%_0%,black,transparent_75%)]"
      />

      <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <a
          href="#intents"
          className="group animate-rise inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white py-1 pl-1.5 pr-2.5 text-caption-1-medium text-neutral-600 shadow-[0_1px_2px_rgb(0_0_0/0.04)] transition-colors hover:border-neutral-300"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-50 px-2 py-0.5 text-brand-ink">
            <span className="animate-pulse-ring size-1.5 rounded-full bg-brand" />
            New
          </span>
          Payroll on NEAR Intents
          <RiArrowRightSLine
            className="size-4 text-neutral-400 transition-transform group-hover:translate-x-0.5"
            aria-hidden
          />
        </a>

        <h1
          className="animate-rise mt-8 text-balance text-[44px] font-medium leading-[1.05] tracking-[-0.035em] text-neutral-950 sm:text-[60px] lg:text-[68px]"
          style={{ animationDelay: "60ms" }}
        >
          Your business runs.
          <br />
          <span className="relative whitespace-nowrap">
            Payroll runs itself
            <span className="text-brand">.</span>
          </span>
        </h1>

        <p
          className="animate-rise mt-6 max-w-xl text-pretty text-[17px] leading-7 text-neutral-500"
          style={{ animationDelay: "120ms" }}
        >
          <span className="text-neutral-800">
            Private onchain payroll and AI agents that take care of the busywork.
          </span>{" "}
          Pay your team, automate business operations, and manage everything from one
          intelligent workspace — powered by private AI and NEAR Intents.
        </p>

        <div
          className="animate-rise mt-9 flex flex-col items-center gap-2.5 sm:flex-row"
          style={{ animationDelay: "180ms" }}
        >
          <ButtonLink href="/login?intent=signup" trailingIcon={RiArrowRightLine} className="h-10 rounded-xl px-4">
            Get Started
          </ButtonLink>
          <ButtonLink href="#demo" variant="secondary" className="h-10 rounded-xl px-4">
            Book a demo
          </ButtonLink>
        </div>

        <p
          className="animate-rise mt-5 text-caption-1-regular text-neutral-400"
          style={{ animationDelay: "240ms" }}
        >
          Private by default · Any token, any chain · Settles in seconds
        </p>
      </div>

      <div className="animate-rise mx-auto mt-16 max-w-5xl sm:mt-20" style={{ animationDelay: "320ms" }}>
        <ProductPreview />
      </div>
    </section>
  );
}
