"use client";

import { useId } from "react";
import Link from "next/link";
import { ArrowRight, ChevronRight } from "@/lib/icons";
import { JobStatusBadge } from "@/components/hr/shared/hr-badge";

/**
 * Job requisitions for the HR dashboard.
 *
 * The row answers "what is this role, is it live, and how many people are in
 * it" — the applicant count is a first-class number rather than the tail of a
 * dot-separated 11px line. The whole row is one link to the requisition editor,
 * so keyboard and touch users get the same target as the pointer. Colour is not
 * the only status cue: `JobStatusBadge` pairs its tint with a written label.
 */
export function RecentJobsCard({ jobs = [], limit = 3 }) {
  const headingId = useId();
  const recent = jobs.slice(0, limit);

  return (
    <section
      aria-labelledby={headingId}
      className="flex flex-col overflow-hidden rounded-xl border border-border/80 bg-surface"
    >
      {/* Panel Header */}
      <div className="flex items-center justify-between gap-3 border-b border-border/60 px-4 py-2.5">
        <h2
          id={headingId}
          className="text-sm font-semibold tracking-tight text-foreground"
        >
          Job Requisitions
        </h2>

        <Link
          href="/hr/jobs"
          aria-label="Manage all job requisitions"
          className="inline-flex shrink-0 items-center gap-1 rounded-md text-xs font-semibold text-primary transition-colors hover:text-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
        >
          <span>Manage all</span>
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </div>

      {/* Jobs List */}
      {recent.length > 0 ? (
        <ul role="list" className="divide-y divide-border/60">
          {recent.map((job) => {
            const department = job.department || "";
            const employmentType = job.employmentType || "";

            return (
              <li key={job.id}>
                <Link
                  href={`/hr/jobs/${job.id}/edit`}
                  className="group flex w-full items-center gap-3 px-4 py-2.5 transition-colors hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary/70"
                >
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="truncate text-sm font-medium text-foreground transition-colors group-hover:text-primary">
                        {job.title}
                      </span>
                      <JobStatusBadge status={job.status} className="shrink-0" />
                    </span>

                    {(department || employmentType) && (
                      <span className="mt-1 flex items-baseline gap-x-2 text-xs text-foreground-secondary">
                        {department && (
                          <span className="truncate">{department}</span>
                        )}
                        {department && employmentType && (
                          <span aria-hidden="true" className="text-foreground-muted">
                            ·
                          </span>
                        )}
                        {employmentType && (
                          <span className="shrink-0 whitespace-nowrap">
                            {employmentType}
                          </span>
                        )}
                      </span>
                    )}
                  </span>

                  <span className="shrink-0 text-right">
                    <span className="block text-sm font-semibold leading-tight tabular-nums text-foreground">
                      {job.applicantCount ?? 0}
                    </span>
                    <span className="block text-xs leading-tight text-foreground-secondary">
                      applicants
                    </span>
                  </span>

                  <ChevronRight
                    aria-hidden="true"
                    className="h-4 w-4 shrink-0 text-foreground-muted transition-colors group-hover:text-primary"
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="px-4 py-6">
          <p className="text-xs leading-relaxed text-foreground-secondary">
            No job requisitions yet.
          </p>
          <Link
            href="/hr/jobs/new"
            className="mt-2 inline-flex items-center gap-1 rounded-md text-xs font-semibold text-primary transition-colors hover:text-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
          >
            <span>Create a job requisition</span>
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
      )}
    </section>
  );
}

export default RecentJobsCard;
