"use client";

import React from "react";
import {
  DEPARTMENTS,
  EMPLOYMENT_TYPES,
  EXPERIENCE_LEVELS,
} from "@/validation/hr/job-validation";

/**
 * Step 1: Basics
 * Job Title, Department, Employment Type, Experience Level
 */
export function StepBasics({ register, errors, headingRef }) {
  return (
    <section aria-labelledby="step-1-heading" className="space-y-6">
      <div className="border-b border-border pb-4">
        <h2
          id="step-1-heading"
          ref={headingRef}
          tabIndex={-1}
          className="text-lg sm:text-xl font-bold tracking-tight text-foreground focus:outline-none"
        >
          Basic Information
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-foreground-secondary">
          Define the job title, department, and employment terms for this role.
        </p>
      </div>

      <div className="space-y-5">
        {/* Job Title */}
        <div>
          <label
            htmlFor="job-title"
            className="block text-xs font-semibold text-foreground"
          >
            Job Title <span className="text-error" aria-hidden="true">*</span>
          </label>
          <input
            id="job-title"
            type="text"
            placeholder="e.g. Senior Frontend Developer (Next.js)"
            {...register("title")}
            aria-required="true"
            aria-invalid={Boolean(errors.title)}
            aria-describedby={errors.title ? "title-error" : undefined}
            onKeyDown={(e) => {
              if (e.key === "Enter") e.preventDefault();
            }}
            className={`mt-1.5 w-full rounded-xl border bg-surface px-3.5 py-2.5 text-sm text-foreground placeholder:text-foreground-secondary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 transition-all ${
              errors.title
                ? "border-error focus-visible:border-error"
                : "border-border hover:border-foreground-muted/40 focus-visible:border-primary"
            }`}
          />
          {errors.title && (
            <p id="title-error" className="mt-1.5 text-xs text-error font-medium" role="alert">
              {errors.title.message}
            </p>
          )}
        </div>

        {/* Department */}
        <div>
          <label
            htmlFor="job-department"
            className="block text-xs font-semibold text-foreground"
          >
            Department <span className="text-error" aria-hidden="true">*</span>
          </label>
          <select
            id="job-department"
            {...register("department")}
            aria-required="true"
            aria-invalid={Boolean(errors.department)}
            aria-describedby={errors.department ? "department-error" : undefined}
            className={`mt-1.5 w-full rounded-xl border bg-surface px-3.5 py-2.5 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 transition-all ${
              errors.department
                ? "border-error"
                : "border-border hover:border-foreground-muted/40 focus-visible:border-primary"
            }`}
          >
            {DEPARTMENTS.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
          {errors.department && (
            <p id="department-error" className="mt-1.5 text-xs text-error font-medium" role="alert">
              {errors.department.message}
            </p>
          )}
        </div>

        {/* Employment Type & Experience Level (2 cols) */}
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="job-employment-type"
              className="block text-xs font-semibold text-foreground"
            >
              Employment Type <span className="text-error" aria-hidden="true">*</span>
            </label>
            <select
              id="job-employment-type"
              {...register("employmentType")}
              aria-required="true"
              aria-invalid={Boolean(errors.employmentType)}
              aria-describedby={errors.employmentType ? "employmentType-error" : undefined}
              className={`mt-1.5 w-full rounded-xl border bg-surface px-3.5 py-2.5 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 transition-all ${
                errors.employmentType
                  ? "border-error"
                  : "border-border hover:border-foreground-muted/40 focus-visible:border-primary"
              }`}
            >
              {EMPLOYMENT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            {errors.employmentType && (
              <p id="employmentType-error" className="mt-1.5 text-xs text-error font-medium" role="alert">
                {errors.employmentType.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="job-experience-level"
              className="block text-xs font-semibold text-foreground"
            >
              Experience Level <span className="text-error" aria-hidden="true">*</span>
            </label>
            <select
              id="job-experience-level"
              {...register("experienceLevel")}
              aria-required="true"
              aria-invalid={Boolean(errors.experienceLevel)}
              aria-describedby={errors.experienceLevel ? "experienceLevel-error" : undefined}
              className={`mt-1.5 w-full rounded-xl border bg-surface px-3.5 py-2.5 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 transition-all ${
                errors.experienceLevel
                  ? "border-error"
                  : "border-border hover:border-foreground-muted/40 focus-visible:border-primary"
              }`}
            >
              {EXPERIENCE_LEVELS.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
            {errors.experienceLevel && (
              <p id="experienceLevel-error" className="mt-1.5 text-xs text-error font-medium" role="alert">
                {errors.experienceLevel.message}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
