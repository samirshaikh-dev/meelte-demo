"use client";

import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Send,
  Save,
  ArrowLeft,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Loader2,
} from "@/lib/icons";
import { Button } from "@/components/ui/button";
import { BlogStatusBadge } from "./blog-status-badge";
import { BlogStepper, BLOG_STEPS_CONFIG } from "./blog-stepper";
import { StepStoryContent } from "./step-story-content";
import { StepSettingsSeo } from "./step-settings-seo";
import { StepBlogReview } from "./step-blog-review";
import {
  BLOG_STATUSES,
} from "@/constants/blog-constants";
import {
  blogPostDraftSchema,
  blogPostPublishSchema,
  getFirstValidationMessage,
  getInitialBlogFormValues,
} from "@/validation/hr/blog-validation";
import { isRichTextEmpty } from "@/validation/hr/job-validation";
import { slugify } from "@/lib/slug";
import { notifySuccess, notifyError } from "@/lib/toast-feedback";

export function BlogForm({ existingPost = null, onSavePost }) {
  const router = useRouter();

  // Step Management
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState([]);
  const stepHeadingRef = useRef(null);

  // Form State
  const [formData, setFormData] = useState(() =>
    getInitialBlogFormValues(existingPost)
  );
  const [featured, setFeatured] = useState(() => Boolean(existingPost?.featured));
  const [isCustomSlug, setIsCustomSlug] = useState(() => Boolean(existingPost?.slug));
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMode, setSubmitMode] = useState(null); // 'draft' | 'published'

  // Dirty tracking for accidental page unload warning
  const [isDirty, setIsDirty] = useState(false);

  // Computed live slug
  const activeSlug = useMemo(() => {
    if (isCustomSlug && formData.slug) {
      return slugify(formData.slug);
    }
    return slugify(formData.title);
  }, [isCustomSlug, formData.slug, formData.title]);

  // Focus step heading on transition (WCAG 2.2 AA)
  useEffect(() => {
    if (stepHeadingRef.current) {
      stepHeadingRef.current.focus();
    }
  }, [currentStep]);

  // Clean up any stale legacy localStorage draft keys on mount (same as job flow)
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith("meelte_blog_draft_")) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach((k) => localStorage.removeItem(k));
    } catch {
      // Ignore localStorage access errors
    }
  }, []);

  // Warn on leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  const handleFieldChange = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setIsDirty(true);
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  }, [errors]);

  // Jump to specific step from stepper
  const handleJumpToStep = (targetStep) => {
    setCurrentStep(targetStep);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Validate current step before advancing
  const validateStep = (stepNumber) => {
    const stepErrors = {};

    if (stepNumber === 1) {
      if (!formData.title.trim()) {
        stepErrors.title = "Story title is required.";
      } else if (formData.title.trim().length < 3) {
        stepErrors.title = "Title must be at least 3 characters.";
      }

      if (!formData.content || isRichTextEmpty(formData.content)) {
        stepErrors.content = "Article body is required.";
      }
    } else if (stepNumber === 2) {
      if (!formData.category) {
        stepErrors.category = "Please select a category.";
      }

      if (!formData.excerpt.trim()) {
        stepErrors.excerpt = "Story excerpt is required.";
      } else if (formData.excerpt.trim().length < 20) {
        stepErrors.excerpt = "Excerpt must be at least 20 characters.";
      }
    }

    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      notifyError("Please fix the highlighted fields to proceed.");
      return false;
    }

    setErrors({});
    return true;
  };

  const handleNextStep = () => {
    if (!validateStep(currentStep)) return;

    setCompletedSteps((prev) =>
      prev.includes(currentStep) ? prev : [...prev, currentStep]
    );
    setCurrentStep((prev) => Math.min(prev + 1, BLOG_STEPS_CONFIG.length));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePreviousStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Save Draft from any step
  const handleSaveDraft = async () => {
    // Require at least a 3-character title to create a draft record
    if (!formData.title.trim() || formData.title.trim().length < 3) {
      setErrors((prev) => ({
        ...prev,
        title: "Story title must be at least 3 characters to save a draft.",
      }));
      notifyError("Please enter a story title (at least 3 characters) to save a draft.");
      setCurrentStep(1);
      setTimeout(() => {
        const el = document.getElementById("blog-title-input");
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
          el.focus();
        }
      }, 50);
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    setSubmitMode(BLOG_STATUSES.DRAFT);

    const payload = {
      ...formData,
      slug: activeSlug || undefined,
      featured,
      status: BLOG_STATUSES.DRAFT,
    };

    const draftValidation = blogPostDraftSchema.safeParse(payload);
    if (!draftValidation.success) {
      const fieldErrors = {};
      draftValidation.error.issues.forEach((issue) => {
        const path = issue.path.join(".");
        if (!fieldErrors[path]) {
          fieldErrors[path] = issue.message;
        }
      });
      setErrors(fieldErrors);
      notifyError(getFirstValidationMessage(draftValidation));
      setIsSubmitting(false);
      setSubmitMode(null);
      return;
    }

    try {
      await onSavePost({
        ...draftValidation.data,
        id: existingPost?.id,
        featured,
        status: BLOG_STATUSES.DRAFT,
      });

      notifySuccess("Draft saved successfully.");
      router.push("/hr/blog");
      router.refresh();
    } catch (err) {
      notifyError(err.message || "Failed to save draft.");
    } finally {
      setIsSubmitting(false);
      setSubmitMode(null);
    }
  };

  // Publish Story
  const handlePublishStory = async () => {
    setErrors({});
    setIsSubmitting(true);
    setSubmitMode(BLOG_STATUSES.PUBLISHED);

    const payload = {
      ...formData,
      slug: activeSlug || undefined,
      featured,
      status: BLOG_STATUSES.PUBLISHED,
    };

    const validationResult = blogPostPublishSchema.safeParse(payload);
    if (!validationResult.success) {
      const fieldErrors = {};
      validationResult.error.issues.forEach((issue) => {
        const path = issue.path.join(".");
        if (!fieldErrors[path]) {
          fieldErrors[path] = issue.message;
        }
      });
      setErrors(fieldErrors);
      notifyError(getFirstValidationMessage(validationResult));

      // Jump to the earliest step with an error
      if (fieldErrors.title || fieldErrors.content || fieldErrors.coverImage) {
        setCurrentStep(1);
      } else if (fieldErrors.category || fieldErrors.excerpt || fieldErrors.slug || fieldErrors.tags) {
        setCurrentStep(2);
      }

      setIsSubmitting(false);
      setSubmitMode(null);
      return;
    }

    try {
      await onSavePost({
        ...validationResult.data,
        id: existingPost?.id,
        featured,
        status: BLOG_STATUSES.PUBLISHED,
      });

      notifySuccess(
        existingPost?.status === "published"
          ? "Story updated successfully!"
          : "Story published successfully!"
      );
      router.push("/hr/blog");
      router.refresh();
    } catch (err) {
      notifyError(err.message || "Failed to publish story.");
    } finally {
      setIsSubmitting(false);
      setSubmitMode(null);
    }
  };

  return (
    <div className="space-y-6 pb-24 relative">
      {/* MULTI-STEP STEPPER */}
      <BlogStepper
        currentStep={currentStep}
        completedSteps={completedSteps}
        onStepClick={handleJumpToStep}
      />

      {/* Top Banner Alert on Validation Errors */}
      {Object.keys(errors).length > 0 && (
        <div
          role="alert"
          className="rounded-xl border border-error/30 bg-error/5 p-4 text-xs text-error flex items-start gap-3"
        >
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <p className="font-bold text-sm">Please correct the highlighted issues:</p>
            <ul className="mt-1.5 list-disc list-inside space-y-0.5 text-xs">
              {Object.entries(errors).map(([field, msg]) => (
                <li key={field}>{msg}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* STEP CONTENT RENDER */}
      <main className="w-full">
        {currentStep === 1 && (
          <StepStoryContent
            formData={formData}
            onChangeField={handleFieldChange}
            errors={errors}
            headingRef={stepHeadingRef}
          />
        )}

        {currentStep === 2 && (
          <StepSettingsSeo
            formData={formData}
            onChangeField={handleFieldChange}
            featured={featured}
            onToggleFeatured={(val) => {
              setFeatured(val);
              setIsDirty(true);
            }}
            isCustomSlug={isCustomSlug}
            onToggleCustomSlug={setIsCustomSlug}
            activeSlug={activeSlug}
            errors={errors}
            headingRef={stepHeadingRef}
          />
        )}

        {currentStep === 3 && (
          <StepBlogReview
            formData={formData}
            featured={featured}
            activeSlug={activeSlug}
            onJumpToStep={handleJumpToStep}
            headingRef={stepHeadingRef}
          />
        )}
      </main>

      {/* STICKY BOTTOM ACTION BAR (Matching Job Multi-step Form) */}
      <aside
        aria-label="Story form actions"
        className="fixed bottom-0 left-0 right-0 z-30 border-t border-border bg-surface/95 backdrop-blur-md px-4 py-3 sm:px-6 shadow-card lg:left-64"
      >
        <div className="max-w-7xl mx-auto flex w-full items-center justify-between gap-3">
          {/* Back button (hidden on Step 1) */}
          <div>
            {currentStep > 1 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handlePreviousStep}
                disabled={isSubmitting}
                className="gap-1.5 text-xs sm:text-sm"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                <span>Previous Step</span>
              </Button>
            )}
          </div>

          {/* Right Actions: Save Draft & Next / Publish */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Save Draft */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleSaveDraft}
              disabled={isSubmitting}
              className="gap-1.5 text-xs sm:text-sm"
            >
              {isSubmitting && submitMode === BLOG_STATUSES.DRAFT ? (
                <Loader2 className="h-4 w-4 animate-spin text-primary" aria-hidden="true" />
              ) : (
                <Save className="h-4 w-4 text-foreground-secondary" aria-hidden="true" />
              )}
              <span>Save Draft</span>
            </Button>

            {currentStep === 3 ? (
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={handlePublishStory}
                disabled={isSubmitting}
                className="gap-1.5 text-xs sm:text-sm shadow-2xs"
              >
                {isSubmitting && submitMode === BLOG_STATUSES.PUBLISHED ? (
                  <Loader2 className="h-4 w-4 animate-spin text-white" aria-hidden="true" />
                ) : (
                  <Send className="h-4 w-4 text-white" aria-hidden="true" />
                )}
                <span>
                  {existingPost?.status === "published"
                    ? "Update Story"
                    : "Publish Story"}
                </span>
              </Button>
            ) : (
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={handleNextStep}
                disabled={isSubmitting}
                className="gap-1.5 text-xs sm:text-sm shadow-2xs"
              >
                <span>Next Step</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
}

export default BlogForm;
