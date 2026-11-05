"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, RotateCcw, X } from "@/lib/icons";
import { notifySuccess, notifyError } from "@/lib/toast-feedback";
import {
  jobPublishSchema,
  jobDraftSchema,
  STEP_FIELDS,
  getInitialJobFormValues,
  getDefaultDeadlineDateString,
} from "@/validation/hr/job-validation";
import { useJobAutosave } from "@/hooks/use-job-autosave";
import { JobStepper } from "./job-stepper";
import { StepBasics } from "./step-basics";
import { StepLocationPay } from "./step-location-pay";
import { StepDetails } from "./step-details";
import { StepReview } from "./step-review";
import { StickyActionBar } from "./sticky-action-bar";

/**
 * Master Multi-Step Job Posting Form
 * Shared between Create (/hr/jobs/new) and Edit (/hr/jobs/[id]/edit).
 * Complies with new-req.md, AVOID.md, and WCAG 2.2 AA.
 */
export function JobMultiStepForm({ existingJob = null, onSaveJob }) {
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittingType, setSubmittingType] = useState(null); // "draft" | "publish"

  // Heading ref for moving focus upon step transition (WCAG 2.2 AA)
  const stepHeadingRef = useRef(null);

  // Initialize React Hook Form
  const form = useForm({
    resolver: zodResolver(jobPublishSchema),
    mode: "onBlur",
    defaultValues: getInitialJobFormValues(existingJob),
  });

  const {
    register,
    control,
    watch,
    getValues,
    reset,
    trigger,
    setError,
    setValue,
    formState: { errors, isDirty, isSubmitted },
  } = form;

  // Suggested deadline (today + 30 days) is resolved after mount rather than during
  // render. Reading the clock while rendering a Client Component is an unstable value
  // that fails the static prerender of /hr/jobs/new under Next.js 16 Cache Components.
  // Deferring keeps the prerendered HTML deterministic and still uses the visitor's
  // local calendar date. `shouldDirty: false` keeps the autosave/unsaved-changes guards
  // from treating the seeded default as user input.
  useEffect(() => {
    if (!getValues("deadline")) {
      setValue("deadline", getDefaultDeadlineDateString(), { shouldDirty: false });
    }
  }, [getValues, setValue]);

  // Autosave and Draft Restoration
  const {
    showRestorePrompt,
    savedDraftTime,
    restoreDraft,
    dismissDraft,
    clearDraft,
    triggerAutosave,
  } = useJobAutosave({
    jobId: existingJob?.id || null,
    getValues,
    reset,
    isDirty,
    isSubmitted,
  });

  // Watch form changes via subscription for debounced autosave
  useEffect(() => {
    const subscription = watch(() => {
      triggerAutosave();
    });
    return () => subscription.unsubscribe();
  }, [watch, triggerAutosave]);

  // Focus step heading on step change
  useEffect(() => {
    if (stepHeadingRef.current) {
      stepHeadingRef.current.focus();
    }
  }, [currentStep]);

  // Jump to specific step from review page or stepper click
  const handleJumpToStep = useCallback((targetStep) => {
    setCurrentStep(targetStep);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Save Draft Handler: validates only the title
  const handleSaveDraft = useCallback(async () => {
    setIsSubmitting(true);
    setSubmittingType("draft");

    const currentData = getValues();
    const draftValidation = jobDraftSchema.safeParse(currentData);

    if (!draftValidation.success) {
      setIsSubmitting(false);
      setSubmittingType(null);
      // Show title error and jump to Step 1
      const titleError = draftValidation.error.format().title?._errors?.[0];
      if (titleError) {
        setError("title", { type: "manual", message: titleError });
        setCurrentStep(1);
        notifyError(titleError);
      }
      return;
    }

    try {
      const payload = {
        ...currentData,
        status: "Draft",
      };

      await onSaveJob(payload, "Draft");
      clearDraft();
      notifySuccess(`Draft "${payload.title}" saved successfully.`);
      router.push("/hr/jobs");
    } catch (err) {
      notifyError(err.message || "Failed to save draft.");
    } finally {
      setIsSubmitting(false);
      setSubmittingType(null);
    }
  }, [getValues, onSaveJob, clearDraft, router, setError]);

  // Publish Handler: full validation across all fields
  const handlePublish = useCallback(async () => {
    setIsSubmitting(true);
    setSubmittingType("publish");

    const currentData = getValues();
    const publishValidation = jobPublishSchema.safeParse(currentData);

    if (!publishValidation.success) {
      setIsSubmitting(false);
      setSubmittingType(null);

      // Extract validation issues and find first invalid step to jump back to
      const fieldErrors = publishValidation.error.format();
      let firstInvalidStep = 1;

      // Check step 1 fields
      const hasStep1Error = STEP_FIELDS[1].some((f) => fieldErrors[f]);
      // Check step 2 fields
      const hasStep2Error = STEP_FIELDS[2].some((f) => fieldErrors[f]);
      // Check step 3 fields
      const hasStep3Error = STEP_FIELDS[3].some((f) => fieldErrors[f]);

      if (hasStep1Error) {
        firstInvalidStep = 1;
      } else if (hasStep2Error) {
        firstInvalidStep = 2;
      } else if (hasStep3Error) {
        firstInvalidStep = 3;
      }

      // Re-trigger form validation to populate inline UI errors
      await trigger();
      setCurrentStep(firstInvalidStep);
      notifyError("Please correct the errors before publishing.");
      return;
    }

    try {
      const payload = {
        ...publishValidation.data,
        status: "Active",
      };

      await onSaveJob(payload, "Active");
      clearDraft();
      notifySuccess(`Job "${payload.title}" published successfully!`);
      router.push("/hr/jobs");
    } catch (err) {
      notifyError(err.message || "Failed to publish job.");
    } finally {
      setIsSubmitting(false);
      setSubmittingType(null);
    }
  }, [getValues, onSaveJob, clearDraft, router, trigger]);

  // Step navigation helper: validates only the fields belonging to the current step
  const handleNextStep = useCallback(async () => {
    if (currentStep < 4) {
      const fieldsToValidate = STEP_FIELDS[currentStep];
      const isStepValid = await trigger(fieldsToValidate);

      if (isStepValid) {
        setCompletedSteps((prev) =>
          prev.includes(currentStep) ? prev : [...prev, currentStep]
        );
        setCurrentStep((prev) => prev + 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } else {
      // Step 4: trigger Publish
      handlePublish();
    }
  }, [currentStep, trigger, handlePublish]);

  // Go back to previous step
  const handlePrevStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentStep]);

  return (
    <div className="w-full space-y-6">
      {/* Autosave Draft Found Recovery Prompt */}
      {showRestorePrompt && (
        <div
          role="region"
          aria-label="Draft recovery notification"
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-primary/30 bg-surface-muted/90 p-3.5 sm:p-4 text-xs shadow-soft"
        >
          <div className="flex items-center gap-2.5">
            <AlertCircle className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
            <span className="text-foreground">
              You have an unsaved in-progress draft
              {savedDraftTime && ` from ${new Date(savedDraftTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}.
            </span>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              type="button"
              onClick={restoreDraft}
              className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 transition-colors"
            >
              <RotateCcw className="h-3 w-3" aria-hidden="true" />
              <span>Restore Draft</span>
            </button>
            <button
              type="button"
              onClick={dismissDraft}
              aria-label="Dismiss draft notice"
              className="rounded-lg p-1 text-foreground-secondary hover:bg-surface hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}

      {/* Responsive Step Progress Stepper */}
      <JobStepper
        currentStep={currentStep}
        completedSteps={completedSteps}
        onStepClick={handleJumpToStep}
      />

      {/* Form Content Column */}
      <div className="rounded-2xl border border-border bg-surface p-4 sm:p-6 lg:p-8 shadow-soft">
        <form onSubmit={(e) => e.preventDefault()} noValidate>
          {currentStep === 1 && (
            <StepBasics
              register={register}
              errors={errors}
              headingRef={stepHeadingRef}
            />
          )}

          {currentStep === 2 && (
            <StepLocationPay
              register={register}
              errors={errors}
              watch={watch}
              headingRef={stepHeadingRef}
            />
          )}

          {currentStep === 3 && (
            <StepDetails
              control={control}
              errors={errors}
              headingRef={stepHeadingRef}
            />
          )}

          {currentStep === 4 && (
            <StepReview
              formData={getValues()}
              onJumpToStep={handleJumpToStep}
              headingRef={stepHeadingRef}
            />
          )}
        </form>
      </div>

      {/* Sticky Bottom Actions Bar */}
      <StickyActionBar
        currentStep={currentStep}
        totalSteps={4}
        onBack={handlePrevStep}
        onNext={handleNextStep}
        onSaveDraft={handleSaveDraft}
        isSubmitting={isSubmitting}
        submittingType={submittingType}
      />
    </div>
  );
}
