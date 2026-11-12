"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { BLOG_STATUSES } from "@/constants/blog-constants";

/**
 * Blog Post Status Badge
 *
 * Styles mapped strictly to design tokens in globals.css per docs/Design.md.
 * Blog statuses are lowercase (`published` / `draft` / `archived` —
 * BLOG_STATUSES), unlike the capitalized job statuses, so this badge owns
 * its own mapping instead of reusing JobStatusBadge (which has no
 * `published` case and would fall through to the neutral style).
 */
export function BlogStatusBadge({ status, className }) {
  const normalized = (status || BLOG_STATUSES.DRAFT).toLowerCase();

  let style = "bg-surface-subtle text-foreground-secondary border-border";
  let dot = "bg-foreground-muted";

  if (normalized === BLOG_STATUSES.PUBLISHED) {
    style = "bg-success-bg text-success border-success-border font-medium";
    dot = "bg-success";
  } else if (normalized === BLOG_STATUSES.DRAFT) {
    style = "bg-surface-muted text-primary border-primary/20 font-medium";
    dot = "bg-primary";
  } else if (normalized === BLOG_STATUSES.ARCHIVED) {
    style = "bg-surface text-foreground-muted border-border font-medium";
    dot = "bg-foreground-muted";
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs select-none",
        style,
        className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", dot)} aria-hidden="true" />
      {normalized}
    </span>
  );
}

export default BlogStatusBadge;
