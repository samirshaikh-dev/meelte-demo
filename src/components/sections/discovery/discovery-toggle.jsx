"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * Presentational segmented toggle for switching between discovery views.
 *
 * Implements WCAG 2.2 AA roving tabindex contract with arrow navigation,
 * Home/End jump keys, focus visibility ring (>=3:1 ratio), and 40px touch targets.
 */
export function DiscoveryToggle({
  label = "Browse offers or events",
  value = "ads",
  onChange,
  className,
  items = [
    { value: "ads", label: "Ads" },
    { value: "events", label: "Events" },
  ],
}) {
  const tabsRef = useRef([]);

  const handleKeyDown = (e, index) => {
    let nextIndex = null;
    const count = items.length;

    if (e.key === "ArrowRight") {
      e.preventDefault();
      nextIndex = (index + 1) % count;
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      nextIndex = (index - 1 + count) % count;
    } else if (e.key === "Home") {
      e.preventDefault();
      nextIndex = 0;
    } else if (e.key === "End") {
      e.preventDefault();
      nextIndex = count - 1;
    }

    if (nextIndex !== null) {
      const nextItem = items[nextIndex];
      onChange?.(nextItem.value);
      tabsRef.current[nextIndex]?.focus();
    }
  };

  return (
    <div
      role="tablist"
      aria-label={label}
      className={cn(
        "grid h-12 w-full grid-cols-2 gap-1 rounded-full border border-border/80 bg-surface p-1 shadow-soft",
        className
      )}
    >
      {items.map((item, index) => {
        const isActive = value === item.value;
        return (
          <button
            key={item.value}
            ref={(el) => {
              tabsRef.current[index] = el;
            }}
            type="button"
            role="tab"
            id={`discovery-tab-${item.value}`}
            aria-selected={isActive}
            aria-controls="discovery-panel"
            tabIndex={isActive ? 0 : -1}
            onClick={() => onChange?.(item.value)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className={cn(
              "inline-flex h-full w-full items-center justify-center rounded-full px-6 text-sm font-semibold transition-colors duration-150 whitespace-nowrap text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2",
              isActive
                ? "bg-primary text-white shadow-soft"
                : "font-medium text-foreground-secondary hover:bg-surface-subtle hover:text-foreground"
            )}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

