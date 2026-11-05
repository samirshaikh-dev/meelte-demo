"use client";

import React from "react";
import { ArrowLeft, ArrowRight, Save, Send, Loader2 } from "@/lib/icons";
import { Button } from "@/components/ui/button";

/**
 * Sticky Bottom Actions Bar
 * Sticky at the bottom on all screen sizes with safe-area spacing.
 * Adheres strictly to AVOID.md and docs/Design.md.
 */
export function StickyActionBar({
  currentStep = 1,
  totalSteps = 4,
  onBack,
  onNext,
  onSaveDraft,
  isSubmitting = false,
  submittingType = null, // "draft" | "publish" | null
}) {
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;

  return (
    <aside
      aria-label="Form actions"
      className="sticky bottom-0 z-30 mt-8 w-full border-t border-border bg-surface/95 backdrop-blur-md px-4 py-3 sm:px-6 shadow-card"
    >
      <div className="flex w-full items-center justify-between gap-3">
        {/* Left Side: Back Button (hidden on Step 1) */}
        <div>
          {!isFirstStep && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onBack}
              disabled={isSubmitting}
              className="gap-1.5 text-xs sm:text-sm"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              <span>Back</span>
            </Button>
          )}
        </div>

        {/* Right Side: Save Draft + Next / Publish */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={onSaveDraft}
            disabled={isSubmitting}
            className="gap-1.5 text-xs sm:text-sm"
          >
            {isSubmitting && submittingType === "draft" ? (
              <Loader2 className="h-4 w-4 animate-spin text-primary" aria-hidden="true" />
            ) : (
              <Save className="h-4 w-4 text-primary" aria-hidden="true" />
            )}
            <span>Save Draft</span>
          </Button>

          {isLastStep ? (
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={onNext}
              disabled={isSubmitting}
              className="gap-1.5 text-xs sm:text-sm"
            >
              {isSubmitting && submittingType === "publish" ? (
                <Loader2 className="h-4 w-4 animate-spin text-white" aria-hidden="true" />
              ) : (
                <Send className="h-4 w-4 text-white" aria-hidden="true" />
              )}
              <span>Publish Job</span>
            </Button>
          ) : (
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={onNext}
              disabled={isSubmitting}
              className="gap-1.5 text-xs sm:text-sm"
            >
              <span>Next</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          )}
        </div>
      </div>
    </aside>
  );
}
