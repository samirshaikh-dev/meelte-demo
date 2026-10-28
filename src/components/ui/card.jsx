import React from "react";
import { cn } from "../../lib/utils";

export const Card = React.forwardRef(
  ({ className, hoverable = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "bg-surface rounded-2xl border border-border/80 shadow-soft text-foreground",
          hoverable &&
            "transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-card hover:border-primary/30",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Card.displayName = "Card";

export const CardHeader = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <div ref={ref} className={cn("p-6 sm:p-7 flex flex-col gap-1.5", className)} {...props}>
      {children}
    </div>
  );
});
CardHeader.displayName = "CardHeader";

export const CardTitle = React.forwardRef(
  ({ as: Component = "h3", className, children, ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn(
          "text-xl sm:text-2xl font-semibold tracking-tight text-foreground",
          className
        )}
        {...props}
      >
        {children}
      </Component>
    );
  }
);
CardTitle.displayName = "CardTitle";

export const CardDescription = React.forwardRef(
  ({ className, children, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={cn("text-sm text-foreground-secondary leading-relaxed", className)}
        {...props}
      >
        {children}
      </p>
    );
  }
);
CardDescription.displayName = "CardDescription";

export const CardContent = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <div ref={ref} className={cn("px-6 sm:px-7 pb-6 sm:pb-7 pt-0", className)} {...props}>
      {children}
    </div>
  );
});
CardContent.displayName = "CardContent";

export const CardFooter = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("px-6 sm:px-7 pb-6 sm:pb-7 pt-0 flex items-center", className)}
      {...props}
    >
      {children}
    </div>
  );
});
CardFooter.displayName = "CardFooter";

export default Card;
