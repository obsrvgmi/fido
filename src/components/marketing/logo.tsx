import Link from "next/link";
import { cx } from "@/utils/cx";

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cx("inline-flex items-center gap-2", className)} aria-label="Fido home">
      <span className="relative grid size-7 place-items-center rounded-lg bg-neutral-950 shadow-[inset_0_1px_0_rgb(255_255_255/0.18)]">
        <svg viewBox="0 0 24 24" className="size-4 text-white" fill="none" aria-hidden>
          <path
            d="M6 18V6h10M6 12h7"
            stroke="currentColor"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="18" cy="17" r="2.2" className="fill-brand" />
        </svg>
      </span>
      <span className="text-headline-semibold tracking-tight text-text-primary">Fido</span>
    </Link>
  );
}
