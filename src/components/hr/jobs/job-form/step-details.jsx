"use client";

import React from "react";
import { Controller } from "react-hook-form";
import { RichTextEditor } from "./rich-text-editor";
import { TagInput } from "./tag-input";

/**
 * Step 3: Details
 * Job Overview (RTE), Key Responsibilities (RTE), Requirements & Qualifications (RTE), Skills (Tags)
 */
export function StepDetails({ control, errors, headingRef }) {
  return (
    <section aria-labelledby="step-3-heading" className="space-y-6">
      <div className="border-b border-border pb-4">
        <h2
          id="step-3-heading"
          ref={headingRef}
          tabIndex={-1}
          className="text-lg sm:text-xl font-bold tracking-tight text-foreground focus:outline-none"
        >
          Job Details & Requirements
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-foreground-secondary">
          Craft structured, formatted content using headings, lists, and formatting.
        </p>
      </div>

      <div className="space-y-6">
        {/* Job Overview */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="job-description-editor"
              className="block text-xs font-semibold text-foreground"
            >
              Job Overview <span className="text-error" aria-hidden="true">*</span>
            </label>
            <span className="text-[11px] text-foreground-muted">Rich text formatting supported</span>
          </div>

          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <RichTextEditor
                id="job-description-editor"
                value={field.value}
                onChange={field.onChange}
                placeholder="Describe the mission of this role, the core team context, and what makes it exciting..."
                hasError={Boolean(errors.description)}
                ariaDescribedBy={errors.description ? "description-error" : undefined}
              />
            )}
          />

          {errors.description && (
            <p id="description-error" className="mt-1.5 text-xs text-error font-medium" role="alert">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Key Responsibilities */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="job-responsibilities-editor"
              className="block text-xs font-semibold text-foreground"
            >
              Key Responsibilities <span className="text-error" aria-hidden="true">*</span>
            </label>
            <span className="text-[11px] text-foreground-muted">Bullet or numbered lists recommended</span>
          </div>

          <Controller
            name="responsibilities"
            control={control}
            render={({ field }) => (
              <RichTextEditor
                id="job-responsibilities-editor"
                value={field.value}
                onChange={field.onChange}
                placeholder="List day-to-day duties, architectural leadership responsibilities, and deliverables..."
                hasError={Boolean(errors.responsibilities)}
                ariaDescribedBy={errors.responsibilities ? "responsibilities-error" : undefined}
              />
            )}
          />

          {errors.responsibilities && (
            <p id="responsibilities-error" className="mt-1.5 text-xs text-error font-medium" role="alert">
              {errors.responsibilities.message}
            </p>
          )}
        </div>

        {/* Requirements & Qualifications */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="job-requirements-editor"
              className="block text-xs font-semibold text-foreground"
            >
              Requirements & Qualifications <span className="text-error" aria-hidden="true">*</span>
            </label>
            <span className="text-[11px] text-foreground-muted">Experience, technical competencies, and education</span>
          </div>

          <Controller
            name="requirements"
            control={control}
            render={({ field }) => (
              <RichTextEditor
                id="job-requirements-editor"
                value={field.value}
                onChange={field.onChange}
                placeholder="Outline required years of experience, specific frameworks, tools, or domain knowledge..."
                hasError={Boolean(errors.requirements)}
                ariaDescribedBy={errors.requirements ? "requirements-error" : undefined}
              />
            )}
          />

          {errors.requirements && (
            <p id="requirements-error" className="mt-1.5 text-xs text-error font-medium" role="alert">
              {errors.requirements.message}
            </p>
          )}
        </div>

        {/* Skills Tag Input */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="job-skills-input"
              className="block text-xs font-semibold text-foreground"
            >
              Skills & Tech Stack <span className="text-foreground-muted font-normal">(Optional)</span>
            </label>
          </div>

          <Controller
            name="skills"
            control={control}
            render={({ field }) => (
              <TagInput
                id="job-skills-input"
                tags={field.value || []}
                onChange={field.onChange}
                placeholder="e.g. Next.js, React, Tailwind CSS, TypeScript, Supabase..."
              />
            )}
          />
        </div>
      </div>
    </section>
  );
}
