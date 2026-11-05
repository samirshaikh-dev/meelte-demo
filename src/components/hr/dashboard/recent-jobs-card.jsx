"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "@/lib/icons";
import { JobStatusBadge } from "@/components/hr/shared/hr-badge";

export function RecentJobsCard({ jobs = [], onEditJob, limit = 3 }) {
  const recent = jobs.slice(0, limit);

  return (
    <div className="flex flex-col rounded-xl border border-border/80 bg-surface">
      {/* Panel Header */}
      <div className="flex items-center justify-between border-b border-border/80 px-4 py-2 sm:px-4 sm:py-2.5">
        <div>
          <h2 className="text-xs sm:text-sm font-semibold tracking-tight text-foreground">
            Job Requisitions
          </h2>
          <p className="text-[11px] text-foreground-secondary">
            Active roles and applicant counts
          </p>
        </div>

        <Link
          href="/hr/jobs"
          className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 rounded-md"
        >
          <span>Manage all</span>
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </div>

      {/* Jobs List */}
      <div className="divide-y divide-border/60">
        {recent.length > 0 ? (
          recent.map((job) => (
            <div
              key={job.id}
              onClick={() => onEditJob(job)}
              className="group flex cursor-pointer items-center justify-between gap-3 px-4 py-2 sm:px-4 sm:py-2 transition-colors hover:bg-surface-subtle"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onEditJob(job);
                }
              }}
              aria-label={`View or edit job requisition for ${job.title}`}
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="truncate text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
                    {job.title}
                  </span>
                  <JobStatusBadge status={job.status} />
                </div>
                <div className="mt-0.5 flex flex-wrap items-center gap-x-2 text-[11px] text-foreground-secondary">
                  <span>{job.department}</span>
                  <span className="text-foreground-muted">·</span>
                  <span>{job.employmentType}</span>
                  <span className="text-foreground-muted">·</span>
                  <span className="font-semibold text-foreground">
                    {job.applicantCount} applicants
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="py-8 text-center text-xs text-foreground-muted">
            No job postings created yet.
          </p>
        )}
      </div>
    </div>
  );
}

export default RecentJobsCard;
