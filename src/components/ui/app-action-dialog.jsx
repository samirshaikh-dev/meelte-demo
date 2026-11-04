"use client";

import * as Dialog from "@radix-ui/react-dialog";
import Link from "next/link";
import { X } from "@/lib/icons";
import { StoreButton } from "@/components/layout/store-button";
import { PLAY_STORE_URL, APP_STORE_URL } from "@/config/site";

/**
 * Honest, platform-wide support line shown under the store buttons. It is one
 * plain sentence rather than a bullet list, because the Android/iOS fact is
 * already carried by the two store badges above it (AVOID.md §9).
 */
const SIGNUP_NOTE = "Free to download. New accounts start with 30 bonus coins.";

/**
 * Shared shell for the in-app action promotion dialogs used by the offer and
 * event surfaces (`/ads`, `/ads/[id]`, `/events`, `/events/[id]`).
 *
 * The two surfaces differ only in copy, so the dialog chrome lives here once:
 * scrim, panel, close control, title/description wiring and the dual store
 * buttons can never drift between them (AVOID.md §11).
 *
 * Accessibility (WCAG 2.2 AA dialog pattern via Radix Dialog):
 * - Focus is trapped while open and restored to the invoking trigger on close
 * - Escape and outside click dismiss the dialog
 * - `Dialog.Title` names the dialog and `Dialog.Description` describes it; Radix
 *   wires `aria-labelledby` / `aria-describedby` from them
 */
export function AppActionDialog({
  isOpen = false,
  onClose,
  icon: Icon,
  title,
  description,
  contextLabel,
  contextValue = "",
  footerLink = null,
}) {
  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose?.()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-foreground/40 transition-opacity duration-150 ease-out starting:opacity-0" />

        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 max-h-[calc(100dvh-2rem)] w-[min(28rem,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 overflow-y-auto overscroll-contain rounded-2xl border border-border bg-surface p-6 shadow-card transition duration-150 ease-out starting:scale-95 starting:opacity-0 focus-visible:outline-none">
          <div className="flex items-start gap-3">
            {Icon ? (
              <Icon className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
            ) : null}

            <Dialog.Title className="flex-1 text-lg font-semibold tracking-tight text-balance text-foreground sm:text-xl">
              {title}
            </Dialog.Title>

            <Dialog.Close asChild>
              <button
                type="button"
                aria-label="Close dialog"
                className="-mr-2 -mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-foreground-secondary transition-colors hover:bg-surface-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </Dialog.Close>
          </div>

          {contextValue ? (
            <p className="mt-2 text-xs text-foreground-secondary">
              <span className="sr-only">{contextLabel}: </span>
              <span aria-hidden="true">{contextLabel} · </span>
              <span className="font-medium text-foreground">{contextValue}</span>
            </p>
          ) : null}

          <Dialog.Description className="mt-4 text-sm leading-6 text-foreground-secondary">
            {description}
          </Dialog.Description>

          <div className="mt-5 grid gap-2 sm:grid-cols-2">
            <StoreButton
              type="google"
              href={PLAY_STORE_URL}
              variant="brand"
              className="w-full justify-center"
            />
            <StoreButton
              type="apple"
              href={APP_STORE_URL}
              variant="brand"
              className="w-full justify-center"
            />
          </div>

          <p className="mt-3 text-xs leading-5 text-foreground-secondary">{SIGNUP_NOTE}</p>

          {footerLink ? (
            <p className="mt-4 border-t border-border pt-3 text-xs">
              <Link
                href={footerLink.href}
                onClick={() => onClose?.()}
                className="rounded-sm font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
              >
                {footerLink.label}
              </Link>
            </p>
          ) : null}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default AppActionDialog;
