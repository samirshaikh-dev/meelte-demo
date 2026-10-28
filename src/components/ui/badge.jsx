import React from "react";
import { cn } from "../../lib/utils";

const badgeVariants = {
  primary: "bg-surface-muted text-primary border-primary/20",
  accent: "bg-amber-50 text-amber-900 border-amber-200/80",
  neutral: "bg-surface text-foreground-secondary border-border",
  success: "bg-emerald-50 text-emerald-800 border-emerald-200/80",
  outline: "bg-transparent text-foreground-secondary border-border",
};

const badgeSizes = {
  sm: "px-2.5 py-0.5 text-xs font-medium gap-1",
  md: "px-3 py-1 text-xs sm:text-sm font-medium gap-1.5",
};

/**
 * Reusable Badge / Tag pill component.
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
        "inline-flex items-center rounded-full border transition-colors",
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
