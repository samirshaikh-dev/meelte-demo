"use client";

import React, { useMemo } from "react";
import { sanitizeHtml } from "@/lib/sanitize-html";
import { Edit2 } from "@/lib/icons";

/**
 * Step 4: Review and Publish
 * Read-only summary with rendered rich text and direct edit jump links.
 * Follows AVOID.md: clean open editorial hierarchy, subtle dividers, no nested card bloat.
 */
export function StepReview({ formData, onJumpToStep, headingRef }) {
  // Sanitize rich text HTML blocks before rendering in review
  const sanitizedDescription = useMemo(
    () => sanitizeHtml(formData.description || ""),
    [formData.description]
  );
  const sanitizedResponsibilities = useMemo(
    () => sanitizeHtml(formData.responsibilities || ""),
    [formData.responsibilities]
  );
  const sanitizedRequirements = useMemo(
    () => sanitizeHtml(formData.requirements || ""),
    [formData.requirements]
  );

  // Format salary display string
  const salaryDisplay = useMemo(() => {
    const { salaryMin, salaryMax, salaryCurrency, salaryPeriod } = formData;
    if (!salaryMin && !salaryMax) return "Competitive / Not specified";

    const formatNum = (num) => {
      if (!num || isNaN(Number(num))) return "";
      return Number(num).toLocaleString("en-IN");
    };

    if (salaryMin && salaryMax) {
      return `${salaryCurrency} ${formatNum(salaryMin)} – ${formatNum(salaryMax)} ${salaryPeriod}`;
    }
    if (salaryMin) {
      return `From ${salaryCurrency} ${formatNum(salaryMin)} ${salaryPeriod}`;
    }
    return `Up to ${salaryCurrency} ${formatNum(salaryMax)} ${salaryPeriod}`;
  }, [formData]);

  return (
    <section aria-labelledby="step-4-heading" className="space-y-6">
      <div className="border-b border-border pb-4">
        <h2
          id="step-4-heading"
          ref={headingRef}
          tabIndex={-1}
          className="text-lg sm:text-xl font-bold tracking-tight text-foreground focus:outline-none"
        >
          Review & Publish Requisition
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-foreground-secondary">
          Review all details before publishing. Click &ldquo;Edit&rdquo; on any section to make adjustments.
        </p>
      </div>

      <div className="space-y-6 divide-y divide-border">
        {/* Section 1: Basics Summary */}
        <div className="pt-2">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-foreground-secondary text-[11px]">
              1. Basic Information
            </h3>
            <button
              type="button"
              onClick={() => onJumpToStep(1)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-dark hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded"
            >
              <Edit2 className="h-3 w-3" aria-hidden="true" />
              <span>Edit Basics</span>
            </button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4 bg-surface-subtle/50 rounded-xl p-3.5 border border-border">
            <div>
              <span className="block text-[11px] text-foreground-muted">Job Title</span>
              <span className="block text-sm font-bold text-foreground mt-0.5">
                {formData.title || <span className="text-error italic">Missing</span>}
              </span>
            </div>

            <div>
              <span className="block text-[11px] text-foreground-muted">Department</span>
              <span className="block text-sm font-medium text-foreground mt-0.5">
                {formData.department || "Engineering"}
              </span>
            </div>

            <div>
              <span className="block text-[11px] text-foreground-muted">Employment Type</span>
              <span className="block text-sm font-medium text-foreground mt-0.5">
                {formData.employmentType || "Full-time"}
              </span>
            </div>

            <div>
              <span className="block text-[11px] text-foreground-muted">Experience Level</span>
              <span className="block text-sm font-medium text-foreground mt-0.5">
                {formData.experienceLevel || "Mid-level"}
              </span>
            </div>
          </div>
        </div>

        {/* Section 2: Location and Pay Summary */}
        <div className="pt-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-foreground-secondary text-[11px]">
              2. Location & Compensation
            </h3>
            <button
              type="button"
              onClick={() => onJumpToStep(2)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-dark hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded"
            >
              <Edit2 className="h-3 w-3" aria-hidden="true" />
              <span>Edit Location & Pay</span>
            </button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4 bg-surface-subtle/50 rounded-xl p-3.5 border border-border">
            <div>
              <span className="block text-[11px] text-foreground-muted">Workplace & Location</span>
              <span className="block text-sm font-medium text-foreground mt-0.5">
                {formData.workplaceType} {formData.location ? `· ${formData.location}` : ""}
              </span>
            </div>

            <div>
              <span className="block text-[11px] text-foreground-muted">Compensation</span>
              <span className="block text-sm font-medium text-foreground mt-0.5">
                {salaryDisplay}
              </span>
            </div>

            <div>
              <span className="block text-[11px] text-foreground-muted">Application Deadline</span>
              <span className="block text-sm font-medium text-foreground mt-0.5">
                {formData.deadline || <span className="text-error italic">Missing</span>}
              </span>
            </div>

            <div>
              <span className="block text-[11px] text-foreground-muted">Openings</span>
              <span className="block text-sm font-medium text-foreground mt-0.5">
                {formData.openings || 1} position(s)
              </span>
            </div>
          </div>
        </div>

        {/* Section 3: Details Summary (Rendered Rich Text) */}
        <div className="pt-6 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-foreground-secondary text-[11px]">
              3. Content & Qualifications
            </h3>
            <button
              type="button"
              onClick={() => onJumpToStep(3)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-dark hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded"
            >
              <Edit2 className="h-3 w-3" aria-hidden="true" />
              <span>Edit Details</span>
            </button>
          </div>

          {/* Job Overview */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold text-foreground">Job Overview</h4>
            {sanitizedDescription ? (
              <div
                className="text-xs sm:text-sm text-foreground/90 leading-relaxed bg-surface rounded-xl p-3.5 border border-border prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
              />
            ) : (
              <p className="text-xs text-error italic">Job overview is not provided.</p>
            )}
          </div>

          {/* Key Responsibilities */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold text-foreground">Key Responsibilities</h4>
            {sanitizedResponsibilities ? (
              <div
                className="text-xs sm:text-sm text-foreground/90 leading-relaxed bg-surface rounded-xl p-3.5 border border-border prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: sanitizedResponsibilities }}
              />
            ) : (
              <p className="text-xs text-error italic">Responsibilities are not provided.</p>
            )}
          </div>

          {/* Requirements & Qualifications */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold text-foreground">Requirements & Qualifications</h4>
            {sanitizedRequirements ? (
              <div
                className="text-xs sm:text-sm text-foreground/90 leading-relaxed bg-surface rounded-xl p-3.5 border border-border prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: sanitizedRequirements }}
              />
            ) : (
              <p className="text-xs text-error italic">Requirements are not provided.</p>
            )}
          </div>

          {/* Skills */}
          {formData.skills && formData.skills.length > 0 && (
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold text-foreground">Required Skills</h4>
              <div className="flex flex-wrap gap-1.5">
                {formData.skills.map((skill, index) => (
                  <span
                    key={`${skill}-${index}`}
                    className="inline-flex rounded-lg bg-surface-muted px-2.5 py-1 text-xs font-medium text-primary border border-primary/20"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
