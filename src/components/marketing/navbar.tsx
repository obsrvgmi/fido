"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { RiArrowRightLine, RiCloseLine, RiMenuLine } from "@remixicon/react";
import { ButtonLink } from "@/components/base/buttons/button";
import { cx } from "@/utils/cx";
import { Logo } from "./logo";

const links = [
  { label: "Payroll", href: "#payroll" },
  { label: "AI Agents", href: "#agents" },
  { label: "NEAR Intents", href: "#intents" },
  { label: "Pricing", href: "#pricing" },
];

/**
 * Floating glass navbar. Sits wide and borderless at the top of the page,
 * then tightens into an elevated pill once the page scrolls. Links share a
 * single hover highlight that glides between them.
 */
export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState<{ left: number; width: number } | null>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const moveHighlight = (el: HTMLElement) => {
    const parent = listRef.current?.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    if (parent) setHover({ left: r.left - parent.left, width: r.width });
  };

  return (
    <header className="sticky top-0 z-50 px-3 pt-3 sm:px-4">
      <nav
        className={cx(
          "mx-auto flex items-center justify-between rounded-2xl transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
          scrolled
            ? "h-14 max-w-4xl border border-neutral-200/80 bg-white/75 pl-4 pr-2 shadow-[0_1px_0_rgb(255_255_255/0.9)_inset,0_8px_32px_-12px_rgb(0_0_0/0.14),0_0_0_1px_rgb(0_0_0/0.02)] backdrop-blur-xl backdrop-saturate-150"
            : "h-16 max-w-6xl border border-transparent bg-transparent px-3",
        )}
      >
        <Logo />

        <ul
          ref={listRef}
          onMouseLeave={() => setHover(null)}
          className="relative hidden items-center md:flex"
        >
          <span
            aria-hidden
            className={cx(
              "absolute top-1/2 h-8 -translate-y-1/2 rounded-lg bg-neutral-950/[0.05] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
              hover ? "opacity-100" : "opacity-0",
            )}
            style={hover ? { left: hover.left, width: hover.width } : undefined}
          />
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                onMouseEnter={(e) => moveHighlight(e.currentTarget)}
                onFocus={(e) => moveHighlight(e.currentTarget)}
                className="relative block rounded-lg px-3 py-1.5 text-body-medium text-neutral-500 transition-colors hover:text-neutral-950"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-1.5">
          <Link
            href="/login"
            className="hidden rounded-lg px-3 py-1.5 text-body-medium text-neutral-600 transition-colors hover:text-neutral-950 sm:block"
          >
            Sign in
          </Link>
          <ButtonLink
            href="/login?intent=signup"
            size="small"
            trailingIcon={RiArrowRightLine}
            className="group rounded-[10px] pl-3 [&>svg]:transition-transform hover:[&>svg]:translate-x-0.5"
          >
            Get Started
          </ButtonLink>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="grid size-8 place-items-center rounded-lg text-neutral-600 hover:bg-neutral-100 md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <RiCloseLine className="size-5" /> : <RiMenuLine className="size-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile sheet */}
      <div
        className={cx(
          "mx-auto mt-2 max-w-4xl origin-top overflow-hidden rounded-2xl border border-neutral-200 bg-white/95 shadow-[0_16px_40px_-16px_rgb(0_0_0/0.2)] backdrop-blur-xl transition-all duration-300 md:hidden",
          open ? "max-h-80 opacity-100" : "pointer-events-none max-h-0 border-transparent opacity-0",
        )}
      >
        <ul className="p-2">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-2.5 text-body-medium text-neutral-700 hover:bg-neutral-50"
              >
                {l.label}
              </a>
            </li>
          ))}
          <li className="mt-1 border-t border-neutral-100 pt-1">
            <Link href="/login" className="block rounded-lg px-3 py-2.5 text-body-medium text-neutral-700 hover:bg-neutral-50">
              Sign in
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}
