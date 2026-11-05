"use client";

import React, { useSyncExternalStore } from "react";
import {
  WORKPLACE_TYPES,
  SALARY_CURRENCIES,
  SALARY_PERIODS,
  getTodayDateString,
} from "@/validation/hr/job-validation";

// Client-only "today" snapshot for the deadline picker's `min` bound.
// Reading the clock during render is an unstable value that fails the static prerender
// of the HR job routes (Next.js 16 Cache Components). `useSyncExternalStore` gives the
// hook a server snapshot for the prerender/hydration pass and the real local date on the
// client, without a setState-in-effect cascade or a hydration mismatch.
const subscribeToNothing = () => () => {};
const getClientDateSnapshot = () => getTodayDateString();
const getServerDateSnapshot = () => "";

/**
 * Step 2: Location and Pay
 * Workplace Type, Location, Salary Range, Application Deadline, Openings
 */
export function StepLocationPay({ register, errors, watch, headingRef }) {
  const currentWorkplaceType = watch("workplaceType");
  const isLocationRequired = currentWorkplaceType !== "Remote";
  const todayDateString = useSyncExternalStore(
    subscribeToNothing,
    getClientDateSnapshot,
    getServerDateSnapshot
  );

  return (
    <section aria-labelledby="step-2-heading" className="space-y-6">
      <div className="border-b border-border pb-4">
        <h2
          id="step-2-heading"
          ref={headingRef}
          tabIndex={-1}
          className="text-lg sm:text-xl font-bold tracking-tight text-foreground focus:outline-none"
        >
          Location & Compensation
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-foreground-secondary">
          Specify where this job is based, remuneration parameters, and the application cut-off date.
        </p>
      </div>

      <div className="space-y-5">
        {/* Workplace Type & Location (2 cols) */}
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="job-workplace-type"
              className="block text-xs font-semibold text-foreground"
            >
              Workplace Type <span className="text-error" aria-hidden="true">*</span>
            </label>
            <select
              id="job-workplace-type"
              {...register("workplaceType")}
              aria-required="true"
              aria-invalid={Boolean(errors.workplaceType)}
              aria-describedby={errors.workplaceType ? "workplaceType-error" : undefined}
              className={`mt-1.5 w-full rounded-xl border bg-surface px-3.5 py-2.5 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 transition-all ${
                errors.workplaceType
                  ? "border-error"
                  : "border-border hover:border-foreground-muted/40 focus-visible:border-primary"
              }`}
            >
              {WORKPLACE_TYPES.map((wpt) => (
                <option key={wpt} value={wpt}>
                  {wpt}
                </option>
              ))}
            </select>
            {errors.workplaceType && (
              <p id="workplaceType-error" className="mt-1.5 text-xs text-error font-medium" role="alert">
                {errors.workplaceType.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="job-location"
              className="block text-xs font-semibold text-foreground"
            >
              Location{" "}
              {isLocationRequired ? (
                <span className="text-error" aria-hidden="true">*</span>
              ) : (
                <span className="text-foreground-muted font-normal">(Optional for Remote)</span>
              )}
            </label>
            <input
              id="job-location"
              type="text"
              placeholder={
                currentWorkplaceType === "Remote"
                  ? "e.g. Remote, India or Global"
                  : "e.g. Bengaluru, Karnataka, India"
              }
              {...register("location")}
              aria-required={isLocationRequired}
              aria-invalid={Boolean(errors.location)}
              aria-describedby={errors.location ? "location-error" : undefined}
              onKeyDown={(e) => {
                if (e.key === "Enter") e.preventDefault();
              }}
              className={`mt-1.5 w-full rounded-xl border bg-surface px-3.5 py-2.5 text-sm text-foreground placeholder:text-foreground-secondary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 transition-all ${
                errors.location
                  ? "border-error focus-visible:border-error"
                  : "border-border hover:border-foreground-muted/40 focus-visible:border-primary"
              }`}
            />
            {errors.location && (
              <p id="location-error" className="mt-1.5 text-xs text-error font-medium" role="alert">
                {errors.location.message}
              </p>
            )}
          </div>
        </div>

        {/* Salary Range (Min, Max, Currency, Period) */}
        <div className="rounded-xl border border-border bg-surface-subtle/50 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-foreground">
              Salary Range <span className="text-foreground-muted font-normal">(Optional)</span>
            </span>
          </div>

          <div className="grid gap-3 sm:grid-cols-4">
            <div>
              <label htmlFor="salary-currency" className="block text-[11px] font-medium text-foreground-secondary">
                Currency
              </label>
              <select
                id="salary-currency"
                {...register("salaryCurrency")}
                className="mt-1 w-full rounded-lg border border-border bg-surface px-2.5 py-2 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
              >
                {SALARY_CURRENCIES.map((curr) => (
                  <option key={curr} value={curr}>
                    {curr}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="salary-min" className="block text-[11px] font-medium text-foreground-secondary">
                Minimum
              </label>
              <input
                id="salary-min"
                type="number"
                min="0"
                step="1000"
                placeholder="e.g. 800000"
                {...register("salaryMin")}
                aria-invalid={Boolean(errors.salaryMin)}
                aria-describedby={errors.salaryMin ? "salaryMin-error" : undefined}
                onKeyDown={(e) => {
                  if (e.key === "Enter") e.preventDefault();
                }}
                className={`mt-1 w-full rounded-lg border bg-surface px-3 py-2 text-xs text-foreground placeholder:text-foreground-secondary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 ${
                  errors.salaryMin ? "border-error" : "border-border"
                }`}
              />
            </div>

            <div>
              <label htmlFor="salary-max" className="block text-[11px] font-medium text-foreground-secondary">
                Maximum
              </label>
              <input
                id="salary-max"
                type="number"
                min="0"
                step="1000"
                placeholder="e.g. 1500000"
                {...register("salaryMax")}
                aria-invalid={Boolean(errors.salaryMax)}
                aria-describedby={errors.salaryMin ? "salaryMin-error" : undefined}
                onKeyDown={(e) => {
                  if (e.key === "Enter") e.preventDefault();
                }}
                className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-xs text-foreground placeholder:text-foreground-secondary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
              />
            </div>

            <div>
              <label htmlFor="salary-period" className="block text-[11px] font-medium text-foreground-secondary">
                Period
              </label>
              <select
                id="salary-period"
                {...register("salaryPeriod")}
                className="mt-1 w-full rounded-lg border border-border bg-surface px-2.5 py-2 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
              >
                {SALARY_PERIODS.map((period) => (
                  <option key={period} value={period}>
                    {period}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {errors.salaryMin && (
            <p id="salaryMin-error" className="text-xs text-error font-medium" role="alert">
              {errors.salaryMin.message}
            </p>
          )}
        </div>

        {/* Application Deadline & Openings (2 cols) */}
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="job-deadline"
              className="block text-xs font-semibold text-foreground"
            >
              Application Deadline <span className="text-error" aria-hidden="true">*</span>
            </label>
            <input
              id="job-deadline"
              type="date"
              min={todayDateString || undefined}
              {...register("deadline")}
              aria-required="true"
              aria-invalid={Boolean(errors.deadline)}
              aria-describedby={errors.deadline ? "deadline-error" : "deadline-hint"}
              className={`mt-1.5 w-full rounded-xl border bg-surface px-3.5 py-2.5 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 transition-all ${
                errors.deadline
                  ? "border-error focus-visible:border-error"
                  : "border-border hover:border-foreground-muted/40 focus-visible:border-primary"
              }`}
            />
            {errors.deadline ? (
              <p id="deadline-error" className="mt-1.5 text-xs text-error font-medium" role="alert">
                {errors.deadline.message}
              </p>
            ) : (
              <p id="deadline-hint" className="mt-1 text-[11px] text-foreground-muted">
                Suggested 30 days from today. Earliest selectable is today.
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="job-openings"
              className="block text-xs font-semibold text-foreground"
            >
              Number of Openings <span className="text-foreground-muted font-normal">(Optional)</span>
            </label>
            <input
              id="job-openings"
              type="number"
              min="1"
              max="100"
              placeholder="1"
              {...register("openings")}
              aria-invalid={Boolean(errors.openings)}
              aria-describedby={errors.openings ? "openings-error" : undefined}
              onKeyDown={(e) => {
                if (e.key === "Enter") e.preventDefault();
              }}
              className="mt-1.5 w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-foreground placeholder:text-foreground-secondary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 hover:border-foreground-muted/40 transition-all"
            />
            {errors.openings && (
              <p id="openings-error" className="mt-1.5 text-xs text-error font-medium" role="alert">
                {errors.openings.message}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
