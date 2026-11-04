import React from "react";
import { Apple, Play } from "@/lib/icons";
import { PLAY_STORE_URL, APP_STORE_URL } from "@/config/site";
import { cn } from "@/lib/utils";

/**
 * Store download button.
 *
 * Two presentations of the same two links, so the URLs, labels and icons stay in one place:
 *
 * - `variant="badge"` (default) — the dark, two-line store badge, used inside
 *   the `MobileNav` drawer where the official badge shape is the expected convention.
 * - `variant="brand"` — a compact, single-line button standardized on `rounded-xl`
 *   per AVOID.md §6. Sized at h-9 to integrate cleanly with navigation bars and dense toolbars.
 */
const STORE_META = {
  google: {
    defaultHref: PLAY_STORE_URL,
    ariaLabel: "Get it on Google Play",
    label: "Google Play",
    eyebrow: "Get it on",
    eyebrowClass: "tracking-[0.22em]",
    Icon: Play,
    brandClass:
      "bg-primary text-white hover:bg-primary-hover active:bg-primary-active shadow-2xs",
    brandIconClass: "fill-current",
  },
  apple: {
    defaultHref: APP_STORE_URL,
    ariaLabel: "Download on the App Store",
    label: "App Store",
    eyebrow: "Download on the",
    eyebrowClass: "tracking-[0.18em]",
    Icon: Apple,
    brandClass:
      "border border-primary/25 bg-surface text-primary shadow-2xs hover:border-primary/40 hover:bg-surface-muted active:bg-primary/10",
    brandIconClass: "fill-current",
  },
};

const BASE_CLASSES =
  "group inline-flex items-center transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-surface";

export function StoreButton({ type = "google", href, className, variant = "badge" }) {
  const meta = STORE_META[type] || STORE_META.google;
  const { Icon } = meta;
  const resolvedHref = href || meta.defaultHref;
  const opensNewTab = resolvedHref.startsWith("http");
  const linkProps = {
    href: resolvedHref,
    target: opensNewTab ? "_blank" : undefined,
    rel: opensNewTab ? "noopener noreferrer" : undefined,
    "aria-label": meta.ariaLabel,
  };

  if (variant === "brand") {
    return (
      <a
        {...linkProps}
        className={cn(
          BASE_CLASSES,
          "h-9 shrink-0 gap-1.5 rounded-xl px-3 text-xs font-semibold",
          meta.brandClass,
          className
        )}
      >
        <Icon
          className={cn("h-3.5 w-3.5 shrink-0", meta.brandIconClass)}
          aria-hidden="true"
        />
        <span className="whitespace-nowrap">{meta.label}</span>
      </a>
    );
  }

  return (
    <a
      {...linkProps}
      className={cn(
        BASE_CLASSES,
        "relative h-[44px] w-full items-center gap-2.5 rounded-xl bg-black px-3 text-white shadow-soft hover:shadow-card",
        className
      )}
    >
      <Icon className="h-5 w-5 shrink-0 fill-white" aria-hidden="true" />
      <span className="flex min-w-0 flex-col leading-none">
        <span className="whitespace-nowrap text-[8px] text-white/80">
          {meta.eyebrow}
        </span>
        <span className="mt-0.5 text-sm font-semibold leading-none">
          {meta.label}
        </span>
      </span>
    </a>
  );
}

export default StoreButton;
