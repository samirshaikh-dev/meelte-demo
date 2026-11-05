"use client";

import React from "react";
import { Check } from "@/lib/icons";

export const STEPS_CONFIG = [
  { step: 1, title: "Basics", description: "Role, department & type" },
  { step: 2, title: "Location & Pay", description: "Workplace, salary & dates" },
  { step: 3, title: "Details", description: "Overview, skills & criteria" },
  { step: 4, title: "Review & Publish", description: "Summary & confirmation" },
];

/**
 * Responsive, accessible Stepper Component
 * Desktop: Horizontal numbered step tracker with status indicators and click-to-jump for completed steps.
 * Mobile: Clean, high-density "Step X of 4: Title" status bar with semantic progress.
 * Strictly adheres to AVOID.md and docs/Design.md.
 */
export function JobStepper({ currentStep = 1, onStepClick, completedSteps = [] }) {
  const currentStepConfig = STEPS_CONFIG.find((s) => s.step === currentStep) || STEPS_CONFIG[0];
  const progressPercent = ((currentStep - 1) / (STEPS_CONFIG.length - 1)) * 100;

  return (
    <nav aria-label="Job Posting Steps" className="w-full">
      {/* Mobile Stepper View (< md) */}
      <div className="md:hidden rounded-xl border border-border bg-surface p-3.5 shadow-soft">
        <div className="flex items-center justify-between text-xs font-semibold text-foreground">
          <span className="text-primary font-bold">Step {currentStep} of {STEPS_CONFIG.length}</span>
          <span className="text-foreground-secondary font-medium">{currentStepConfig.title}</span>
        </div>
        <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-surface-muted">
          <div
            className="h-full bg-primary transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
            role="progressbar"
            aria-valuenow={currentStep}
            aria-valuemin={1}
            aria-valuemax={STEPS_CONFIG.length}
            aria-label={`Step ${currentStep} of ${STEPS_CONFIG.length}`}
          />
        </div>
      </div>

      {/* Desktop Stepper View (>= md) */}
      <div className="hidden md:block rounded-2xl border border-border bg-surface p-4 shadow-soft">
        <ol className="grid grid-cols-4 gap-2">
          {STEPS_CONFIG.map((item, index) => {
            const isCurrent = item.step === currentStep;
            const isCompleted = completedSteps.includes(item.step) || item.step < currentStep;
            const isClickable = isCompleted && !isCurrent;

            return (
              <li key={item.step} className="relative">
                {/* Connecting track line between steps */}
                {index < STEPS_CONFIG.length - 1 && (
                  <div
                    aria-hidden="true"
                    className={`absolute top-4 left-[calc(50%+18px)] right-[calc(-50%+18px)] h-[2px] transition-colors ${
                      isCompleted && item.step < currentStep ? "bg-primary" : "bg-border"
                    }`}
                  />
                )}

                <button
                  type="button"
                  disabled={!isClickable}
                  onClick={() => isClickable && onStepClick?.(item.step)}
                  aria-current={isCurrent ? "step" : undefined}
                  className={`group relative flex w-full flex-col items-center text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 rounded-xl p-1.5 transition-colors ${
                    isClickable ? "cursor-pointer hover:bg-surface-subtle" : "cursor-default"
                  }`}
                >
                  {/* Step Icon / Number Indicator */}
                  <div
                    className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all ${
                      isCurrent
                        ? "bg-primary text-white ring-4 ring-primary/20 shadow-xs"
                        : isCompleted
                        ? "bg-surface-muted text-primary border border-primary/40 group-hover:bg-primary group-hover:text-white"
                        : "bg-surface-subtle text-foreground-muted border border-border"
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="h-4 w-4 stroke-[2.5]" aria-hidden="true" />
                    ) : (
                      <span>{item.step}</span>
                    )}
                  </div>

                  {/* Step Label & Meta */}
                  <div className="mt-2">
                    <span
                      className={`block text-xs font-semibold ${
                        isCurrent
                          ? "text-primary"
                          : isCompleted
                          ? "text-foreground"
                          : "text-foreground-secondary"
                      }`}
                    >
                      {item.title}
                    </span>
                    <span className="block text-[11px] text-foreground-muted mt-0.5 line-clamp-1">
                      {item.description}
                    </span>
                  </div>
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
