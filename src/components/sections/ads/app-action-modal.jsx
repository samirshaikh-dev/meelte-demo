"use client";

import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Smartphone, X, Sparkles, Store, MessageCircle, Bookmark, Tag, Bell } from "@/lib/icons";
import { StoreButton } from "@/components/layout/store-button";
import { PLAY_STORE_URL, APP_STORE_URL } from "@/config/site";
import Link from "next/link";

const ACTION_CONFIG = {
  claim: {
    icon: Tag,
    title: "Claim this offer in the mobile app",
    badge: "In-Store Offer",
    description:
      "Discount vouchers, coupons, and redemption codes are verified in-store and can only be claimed through the meelTe mobile app.",
  },
  chat: {
    icon: MessageCircle,
    title: "Chat with the merchant in the app",
    badge: "Direct Contact",
    description:
      "Direct messaging, voice calls, and availability checks with neighbourhood shopkeepers are exclusive to the meelTe mobile app.",
  },
  save: {
    icon: Bookmark,
    title: "Save offer to your favourites",
    badge: "Saved Offers",
    description:
      "Save offers, track price drops, and get notified whenever this shop posts fresh deals by downloading the meelTe mobile app.",
  },
  alerts: {
    icon: Bell,
    title: "Get local deal alerts",
    badge: "Hyperlocal Alerts",
    description:
      "Get instant alerts when shops in your neighbourhood publish discounts and limited-time promotions on the meelTe mobile app.",
  },
  post: {
    icon: Store,
    title: "Post offers as a merchant",
    badge: "For Shopkeepers",
    description:
      "Local businesses and shopkeepers can publish product catalogues, photo menus, and discounts directly through the meelTe mobile app.",
  },
  default: {
    icon: Smartphone,
    title: "This feature is only available in the mobile app",
    badge: "Mobile App Feature",
    description:
      "meelTe is built as a hyperlocal mobile experience. Download the app to claim discounts, chat directly with local shops, and explore deals near you.",
  },
};

/**
 * Accessible promotion modal triggered whenever a visitor attempts an
 * interactive in-app action on the website.
 *
 * Implements the WCAG 2.2 AA dialog pattern via Radix Dialog:
 * - Traps focus while open and restores focus to the invoking trigger on close
 * - Dismisses on Escape key and backdrop click
 * - Explicit accessible labels via Dialog.Title and Dialog.Description
 */
export function AppActionModal({
  isOpen = false,
  onClose,
  actionType = "default",
  offerTitle = "",
}) {
  const config = ACTION_CONFIG[actionType] || ACTION_CONFIG.default;
  const IconComponent = config.icon;

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose?.()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs transition-opacity data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content
          aria-describedby="app-promo-description"
          className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border/80 bg-surface p-6 shadow-card transition-all duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
        >
          {/* Close button */}
          <Dialog.Close asChild>
            <button
              type="button"
              aria-label="Close dialog"
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-xl text-foreground-secondary transition-colors hover:bg-surface-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </Dialog.Close>

          {/* Icon & Badge */}
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-surface-muted text-primary shadow-soft">
              <IconComponent className="h-5 w-5" aria-hidden="true" />
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-surface-muted px-2.5 py-0.5 text-xs font-semibold text-primary">
              <Sparkles className="h-3 w-3" aria-hidden="true" />
              {config.badge}
            </span>
          </div>

          {/* Title & Offer context */}
          <div className="mt-4">
            <Dialog.Title className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              {config.title}
            </Dialog.Title>

            {offerTitle ? (
              <p className="mt-1 text-xs font-medium text-primary line-clamp-1">
                Offer: <span className="text-foreground">{offerTitle}</span>
              </p>
            ) : null}

            <Dialog.Description
              id="app-promo-description"
              className="mt-3 text-sm leading-6 text-foreground-secondary"
            >
              {config.description}
            </Dialog.Description>
          </div>

          {/* Benefits strip */}
          <div className="mt-5 rounded-xl border border-border/60 bg-canvas p-3.5 text-xs text-foreground-secondary space-y-2">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
              <span>Free to download & sign up with 30 bonus coins</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
              <span>Direct Google Maps directions & merchant updates</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
              <span>Available on Android & iOS</span>
            </div>
          </div>

          {/* Dual Store Buttons */}
          <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
            <StoreButton
              type="google"
              href={PLAY_STORE_URL}
              variant="brand"
              className="w-full justify-center sm:w-auto flex-1"
            />
            <StoreButton
              type="apple"
              href={APP_STORE_URL}
              variant="brand"
              className="w-full justify-center sm:w-auto flex-1"
            />
          </div>

          {/* Secondary merchant link if applicable */}
          {actionType === "post" && (
            <div className="mt-4 text-center border-t border-border/60 pt-3">
              <Link
                href="/for-merchants"
                onClick={() => onClose?.()}
                className="text-xs font-semibold text-primary hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/70"
              >
                Learn how meelTe works for local businesses →
              </Link>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default AppActionModal;

