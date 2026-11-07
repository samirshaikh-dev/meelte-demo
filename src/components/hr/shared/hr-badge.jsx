"use client";

import React from "react";
import { cn } from "@/lib/utils";

/**
 * Job Status Badge
 * Styles mapped strictly to design tokens in globals.css per docs/Design.md
 */
export function JobStatusBadge({ status, className }) {
  const normalized = (status || "").toLowerCase();

  let style = "bg-surface-subtle text-foreground-secondary border-border";

  if (normalized === "active") {
    style = "bg-success-bg text-success border-success-border font-medium";
  } else if (normalized === "draft") {
    style = "bg-surface-muted text-primary border-primary/20 font-medium";
  } else if (normalized === "expired") {
    style = "bg-warning-bg text-warning border-warning-border font-medium";
  } else if (normalized === "archived") {
    style = "bg-surface text-foreground-muted border-border font-medium";
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs select-none",
        style,
        className
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          normalized === "active" && "bg-success",
          normalized === "draft" && "bg-primary",
          normalized === "expired" && "bg-warning",
          normalized === "archived" && "bg-foreground-muted"
        )}
        aria-hidden="true"
      />
      {status}
    </span>
  );
}

/**
 * Candidate Status Badge
 */
export function CandidateStatusBadge({ status, className }) {
  const normalized = (status || "").toLowerCase();

  let style = "bg-surface-subtle text-foreground-secondary border-border";

  if (normalized === "applied") {
    style = "bg-surface-muted text-primary border-primary/20 font-medium";
  } else if (normalized === "shortlisted") {
    style = "bg-accent/15 text-accent-foreground border-accent/40 font-medium";
  } else if (normalized === "rejected") {
    style = "bg-error-bg text-error border-error-border font-medium";
  } else if (normalized === "hired") {
    style = "bg-success-bg text-success border-success-border font-medium";
  } else if (normalized === "under review") {
    style = "bg-warning-bg text-warning border-warning-border font-medium";
  } else if (normalized === "interview scheduled") {
    style = "bg-accent/15 text-accent-foreground border-accent/40 font-medium";
  } else if (normalized === "offered") {
    style = "bg-success-bg text-success border-success-border font-medium";
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs select-none",
        style,
        className
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          normalized === "applied" && "bg-primary",
          normalized === "shortlisted" && "bg-accent",
          normalized === "rejected" && "bg-error",
          normalized === "hired" && "bg-success",
          normalized === "under review" && "bg-warning",
          normalized === "interview scheduled" && "bg-accent",
          normalized === "offered" && "bg-success"
        )}
        aria-hidden="true"
      />
      {status}
    </span>
  );
}

export default JobStatusBadge;

