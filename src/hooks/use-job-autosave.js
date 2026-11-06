"use client";

import { useEffect, useCallback } from "react";

/**
 * One-time cleanup for legacy localStorage draft keys.
 * Removes all legacy meelte_job_draft_* items to ensure no stale client drafts linger.
 */
function cleanupLegacyLocalStorageDrafts() {
  if (typeof window === "undefined") return;
  try {
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("meelte_job_draft_")) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((k) => localStorage.removeItem(k));
  } catch {
    // Ignore localStorage access errors
  }
}

/**
 * Hook to guard against accidental page unload when the job form is dirty,
 * and perform one-time cleanup of stale legacy localStorage draft keys.
 *
 * Real drafts are persisted directly to Cloud Firestore via the backend API.
 */
export function useJobAutosave({ isDirty = false, isSubmitted = false } = {}) {
  // Purge any stale legacy localStorage draft keys on mount
  useEffect(() => {
    cleanupLegacyLocalStorageDrafts();
  }, []);

  // Warn before leaving the page with unsaved form changes
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isDirty && !isSubmitted) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isDirty, isSubmitted]);

  const clearDraft = useCallback(() => {
    cleanupLegacyLocalStorageDrafts();
  }, []);

  return {
    clearDraft,
  };
}
