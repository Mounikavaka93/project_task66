import { cx } from "./cx";

export function controlClass(invalid) {
  return cx(
    "h-12 w-full rounded-2xl border bg-white px-3.5 text-[15px] text-ink outline-none transition placeholder:text-muted/80",
    invalid
      ? "border-ember focus:border-ember focus:ring-4 focus:ring-ember/15"
      : "border-line focus:border-pine focus:ring-4 focus:ring-pine/10",
  );
}

export function buttonClass(variant = "primary") {
  const variants = {
    primary:
      "bg-ember text-white shadow-[0_12px_30px_-16px_rgba(226,75,26,0.85)] hover:bg-ember-dark",
    dark: "bg-ink text-cream hover:bg-pine",
    pine: "bg-pine text-cream hover:bg-pine-deep",
    ghost: "border border-line bg-white text-ink hover:border-ink",
  };

  return cx(
    "inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-sm font-bold transition active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50",
    variants[variant] || variants.primary,
  );
}
