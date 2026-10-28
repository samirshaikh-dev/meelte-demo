import React from "react";
import { cn } from "../../lib/utils";

const buttonVariants = {
  primary:
    "bg-primary text-white hover:bg-primary-hover active:bg-primary-active shadow-soft hover:shadow-card",
  secondary:
    "bg-surface-muted text-primary hover:bg-primary/15 active:bg-primary/20",
  accent:
    "bg-accent text-accent-foreground hover:bg-accent-hover font-semibold shadow-soft",
  outline:
    "border border-border bg-surface text-foreground hover:bg-surface-subtle hover:border-primary/40 active:bg-surface-muted",
  ghost:
    "text-foreground hover:bg-surface-muted hover:text-primary active:bg-primary/10",
  link:
    "text-primary underline-offset-4 hover:underline p-0 h-auto font-medium",
};

const buttonSizes = {
  sm: "h-10 px-4 text-xs rounded-lg gap-1.5",
  md: "h-11 px-5 text-sm rounded-xl gap-2",
  lg: "h-12 px-6 text-base rounded-xl gap-2.5",
  pill: "h-11 px-6 text-sm rounded-full gap-2",
  pillLg: "h-13 px-8 text-base rounded-full gap-2.5",
  icon: "h-10 w-10 p-0 rounded-xl justify-center",
};

/**
 * Reusable Accessible Button component supporting standard Meelte brand variants & sizes.
 */
export const Button = React.forwardRef(
  (
    {
      className,
      variant = "primary",
      size = "md",
      as: Component = "button",
      children,
      disabled,
      type = "button",
      ...props
    },
    ref
  ) => {
    const isButton = Component === "button";

    return (
      <Component
        ref={ref}
        type={isButton ? type : undefined}
        disabled={isButton ? disabled : undefined}
        aria-disabled={disabled ? "true" : undefined}
        className={cn(
          "inline-flex items-center justify-center font-semibold transition-all duration-150 ease-out select-none",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2",
          "disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed",
          buttonVariants[variant] || buttonVariants.primary,
          buttonSizes[size] || buttonSizes.md,
          className
        )}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Button.displayName = "Button";

export default Button;
