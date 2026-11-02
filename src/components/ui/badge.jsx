import React from "react";
import { cn } from "../../lib/utils";

const badgeVariants = {
  primary: "bg-surface-muted text-primary border-primary/20",
  accent: "bg-accent/15 text-accent-foreground border-accent/40",
  neutral: "bg-surface text-foreground-secondary border-border",
  success: "bg-success-bg text-success border-success-border",
  outline: "bg-transparent text-foreground-secondary border-border",
};

const badgeSizes = {
  sm: "px-2.5 py-0.5 text-xs font-medium gap-1",
  md: "px-3 py-1 text-xs sm:text-sm font-medium gap-1.5",
};

/**
 * Reusable Badge / Tag pill component.
 * Maps strictly to design tokens defined in globals.css per AVOID.md & docs/Design.md.
 */
export function Badge({
  className,
  variant = "primary",
  size = "md",
  children,
  ...props
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border transition-colors select-none",
        badgeVariants[variant] || badgeVariants.primary,
        badgeSizes[size] || badgeSizes.md,
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export default Badge;
