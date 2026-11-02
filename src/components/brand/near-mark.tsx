/** Simplified NEAR "N" mark for wallet buttons. */
export function NearMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="none">
      <path
        d="M17.4 3.6 14 8.7c-.24.36.22.78.56.48l3.36-2.92c.1-.08.24-.02.24.11v9.2c0 .14-.17.2-.26.1L7.7 3.95A1.6 1.6 0 0 0 6.48 3.4h-.36A1.6 1.6 0 0 0 4.5 5v14a1.6 1.6 0 0 0 2.96.84L10.9 14.7c.24-.36-.22-.78-.56-.48L6.98 17.15c-.1.08-.24.02-.24-.11V7.84c0-.14.17-.2.26-.1l10.2 12.32c.32.37.78.54 1.22.54h.36A1.6 1.6 0 0 0 20.4 19V5a1.6 1.6 0 0 0-2.96-.84Z"
        fill="currentColor"
      />
    </svg>
  );
}
