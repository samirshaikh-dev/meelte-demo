"use client";

import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { CalendarDays, MessageCircle, Bookmark, Sparkles, Users, X, Bell } from "@/lib/icons";
import { StoreButton } from "@/components/layout/store-button";
import { PLAY_STORE_URL, APP_STORE_URL } from "@/config/site";

const ACTION_CONFIG = {
  join: {
    icon: Users,
    title: "Request to join this event in the mobile app",
    badge: "Community Gathering",
    description:
      "Join requests, group size selection, and host approvals are managed directly through the meelTe mobile app.",
  },
  chat: {
    icon: MessageCircle,
    title: "Message the event host in the app",
    badge: "Host Contact",
    description:
      "Direct messaging, inquiries, and coordination with event hosts and attendees are exclusive to the meelTe mobile app.",
  },
  save: {
    icon: Bookmark,
    title: "Save event to your calendar",
    badge: "Saved Events",
    description:
      "Save meetups, track schedule updates, and receive start reminders by installing the meelTe mobile app.",
  },
  alerts: {
    icon: Bell,
    title: "Get local event alerts",
    badge: "Community Alerts",
    description:
      "Get notified when neighbourhood meetups, sports games, and cultural gatherings are announced near you on meelTe.",
  },
  host: {
    icon: CalendarDays,
    title: "Host a community event",
    badge: "Event Organisers",
    description:
      "Creating events, approving attendee requests, and notifying your followers is available for all hosts on the meelTe mobile app.",
  },
  default: {
    icon: CalendarDays,
    title: "This feature is only available in the mobile app",
    badge: "Mobile App Feature",
    description:
      "meelTe is built as a hyperlocal mobile experience. Download the app to discover, join, and host community events around you.",
  },
};

/**
 * Accessible promotion modal triggered whenever a visitor attempts an
 * interactive in-app action on the website's event pages.
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
  eventTitle = "",
}) {
  const config = ACTION_CONFIG[actionType] || ACTION_CONFIG.default;
  const IconComponent = config.icon;

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose?.()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs transition-opacity data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content
          aria-describedby="event-app-promo-description"
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

          {/* Title & Event context */}
          <div className="mt-4">
            <Dialog.Title className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              {config.title}
            </Dialog.Title>

            {eventTitle ? (
              <p className="mt-1 text-xs font-medium text-primary line-clamp-1">
                Event: <span className="text-foreground">{eventTitle}</span>
              </p>
            ) : null}

            <Dialog.Description
              id="event-app-promo-description"
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
              <span>Controlled attendance with host approval & group sizes</span>
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
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default AppActionModal;

