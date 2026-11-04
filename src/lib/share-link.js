"use client";

import { notifySuccess } from "@/lib/toast-feedback";

/**
 * Share the current page from a Client Component.
 *
 * The offer and event detail pages both need the same behaviour: use the native
 * share sheet where the browser exposes one, otherwise copy the URL to the
 * clipboard and confirm it with a toast. Keeping it here means the fallback
 * order and the confirmation copy cannot drift between the two surfaces.
 *
 * The function never throws — a dismissed share sheet or a blocked clipboard is
 * a user choice, not an error, and must not surface as a failure message.
 */
export async function shareCurrentPage({
  title,
  text,
  successMessage = "Link copied to your clipboard.",
}) {
  if (typeof window === "undefined") return;

  const url = window.location.href;

  if (typeof navigator?.share === "function") {
    try {
      await navigator.share({ title, text, url });
      return;
    } catch (error) {
      // A dismissed sheet is intentional; anything else falls through to copy.
      if (error?.name === "AbortError") return;
    }
  }

  if (typeof navigator?.clipboard?.writeText !== "function") return;

  try {
    await navigator.clipboard.writeText(url);
    notifySuccess(successMessage);
  } catch {
    // Clipboard access can be denied outside a secure context. Nothing to
    // report: the address bar still holds the URL the visitor can copy.
  }
}
