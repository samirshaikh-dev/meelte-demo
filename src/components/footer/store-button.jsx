import React from "react";
import { Apple, Play } from "lucide-react";
import { PLAY_STORE_URL } from "@/config/site";
import { cn } from "@/lib/utils";

export function StoreButton({ type = "google", href, className }) {
  if (type === "google") {
    return (
      <a
        href={href || PLAY_STORE_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Get it on Google Play"
        className={cn(
          "group relative flex h-[44px] w-full items-center gap-2.5 rounded-xl bg-black px-3 text-white shadow-[0_10px_40px_-12px_rgba(109,59,179,0.55)] transition-all hover:-translate-y-0.5 hover:shadow-[0_16px_50px_-14px_rgba(109,59,179,0.8)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
          className
        )}
      >
        <Play className="h-5 w-5 shrink-0 fill-white" aria-hidden="true" />
        <div className="flex min-w-0 flex-col leading-none">
          <span className="text-[8px] uppercase tracking-[0.22em] text-white/80 whitespace-nowrap">
            Get it on
          </span>
          <span className="mt-0.5 text-sm font-semibold leading-none">Google Play</span>
        </div>
      </a>
    );
  }

  const appStoreHref = href || "#";

  return (
    <a
      href={appStoreHref}
      target={appStoreHref.startsWith("http") ? "_blank" : undefined}
      rel={appStoreHref.startsWith("http") ? "noopener noreferrer" : undefined}
      aria-label="Download on the App Store"
      className={cn(
        "group relative flex h-[44px] w-full items-center gap-2.5 rounded-xl bg-black px-3 text-white shadow-[0_10px_40px_-12px_rgba(109,59,179,0.55)] transition-all hover:-translate-y-0.5 hover:shadow-[0_16px_50px_-14px_rgba(109,59,179,0.8)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
        className
      )}
    >
      <Apple className="h-5 w-5 shrink-0 fill-white" aria-hidden="true" />
      <div className="flex min-w-0 flex-col leading-none">
        <span className="text-[8px] uppercase tracking-[0.18em] text-white/80 whitespace-nowrap">
          Download on the
        </span>
        <span className="mt-0.5 text-sm font-semibold leading-none">App Store</span>
      </div>
    </a>
  );
}

export default StoreButton;
