import React from "react";
import { Apple, Play } from "@/lib/icons";
import { PLAY_STORE_URL, APP_STORE_URL } from "@/config/site";
import { cn } from "@/lib/utils";

/**
 * Store download button.
 *
 * Two presentations of the same two links, so the URLs, labels and icons stay in one place:
 *
 * - `variant="badge"` (default) — the dark, two-line store badge, currently used only inside
 *   the `MobileNav` drawer where the official badge shape is the expected convention, there
 *   is room for it, and it is the only download surface below `lg`.
 * - `variant="brand"` — a compact single-line pill for the navbar. The navbar is a 64/80px
 *   bar on a white `surface`, so the black badge reads as a heavy block that competes with the
 *   brand. This variant is token-led instead: Play Store is the filled primary because the
 *   Android app is genuinely live, and App Store is a quiet outlined secondary because the
 *   iOS listing does not exist yet. Hierarchy therefore reflects reality rather than size.
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
      "bg-gradient-to-b from-primary to-primary-hover text-primary-foreground shadow-[0_10px_24px_-14px_rgba(109,59,179,0.85)] hover:from-primary-hover hover:to-primary-active hover:shadow-[0_14px_30px_-14px_rgba(109,59,179,0.95)] active:from-primary-active active:to-primary-active",
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
      "border border-primary/25 bg-surface text-primary shadow-2xs hover:border-primary/50 hover:bg-surface-muted hover:shadow-soft",
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
          "h-10 shrink-0 gap-2 rounded-full px-4 text-xs font-semibold",
          meta.brandClass,
          className
        )}
      >
        <Icon
          className={cn("h-4 w-4 shrink-0", meta.brandIconClass)}
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
        "relative h-[44px] w-full items-center gap-2.5 rounded-xl bg-black px-3 text-white shadow-orb-primary-light hover:-translate-y-0.5 hover:shadow-orb-primary-hover",
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
