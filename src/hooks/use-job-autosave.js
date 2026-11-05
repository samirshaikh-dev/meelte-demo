"use client";

import { useState, useEffect, useRef, useCallback } from "react";

const AUTOSAVE_DEBOUNCE_MS = 800;

function getStoredDraft(storageKey) {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed && parsed.data && parsed.savedAt) {
        const hasContent = Boolean(
          parsed.data.title ||
          parsed.data.description ||
          parsed.data.location
        );
        if (hasContent) return parsed;
      }
    }
  } catch {
    // Ignore localStorage access errors
  }
  return null;
}

/**
 * Autosave and draft recovery hook for Job Posting creation and editing.
 * - Autosaves in-progress form changes to localStorage with debouncing.
 * - Detects existing drafts and provides a prompt to restore or discard.
 * - Warns before leaving with unsaved changes (beforeunload).
 * - Cleans up draft upon successful publish or draft save.
 */
export function useJobAutosave({
  jobId = null,
  getValues,
  reset,
  isDirty,
  isSubmitted,
}) {
  const storageKey = jobId
    ? `meelte_job_draft_edit_${jobId}`
    : "meelte_job_draft_new_v1";

  const [savedDraft, setSavedDraft] = useState(() => getStoredDraft(storageKey));
  const [showRestorePrompt, setShowRestorePrompt] = useState(() => Boolean(getStoredDraft(storageKey)));
  const autosaveTimerRef = useRef(null);

  // Clear draft from localStorage
  const clearDraft = useCallback(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(storageKey);
      setSavedDraft(null);
      setShowRestorePrompt(false);
    } catch {
      // Ignore
    }
  }, [storageKey]);

  // Restore the saved draft into the form
  const restoreDraft = useCallback(() => {
    if (savedDraft?.data) {
      reset(savedDraft.data);
      setShowRestorePrompt(false);
    }
  }, [savedDraft, reset]);

  // Dismiss the draft prompt without restoring
  const dismissDraft = useCallback(() => {
    setShowRestorePrompt(false);
  }, []);

  // Debounced autosave whenever form data changes and is dirty
  const triggerAutosave = useCallback(() => {
    if (typeof window === "undefined" || !isDirty || isSubmitted) return;

    if (autosaveTimerRef.current) {
      clearTimeout(autosaveTimerRef.current);
    }

    autosaveTimerRef.current = setTimeout(() => {
      try {
        const currentData = getValues();
        // Only save if there's at least a title or description started
        if (currentData.title || currentData.description) {
          const payload = {
            data: currentData,
            savedAt: new Date().toISOString(),
          };
          localStorage.setItem(storageKey, JSON.stringify(payload));
        }
      } catch {
        // Ignore localStorage quota errors
      }
    }, AUTOSAVE_DEBOUNCE_MS);
  }, [getValues, isDirty, isSubmitted, storageKey]);

  // Warn before leaving the page with unsaved changes
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
      if (autosaveTimerRef.current) {
        clearTimeout(autosaveTimerRef.current);
      }
    };
  }, [isDirty, isSubmitted]);

  return {
    showRestorePrompt,
    savedDraftTime: savedDraft?.savedAt,
    restoreDraft,
    dismissDraft,
    clearDraft,
    triggerAutosave,
  };
}
