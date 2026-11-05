"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "@/lib/icons";
import { CandidateStatusBadge } from "@/components/hr/shared/hr-badge";

function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function RecentCandidatesCard({ candidates = [], onSelectCandidate, limit = 3 }) {
  const recent = candidates.slice(0, limit);

  return (
    <div className="flex flex-col rounded-xl border border-border/80 bg-surface">
      {/* Panel Header */}
      <div className="flex items-center justify-between border-b border-border/80 px-4 py-2 sm:px-4 sm:py-2.5">
        <div>
          <h2 className="text-xs sm:text-sm font-semibold tracking-tight text-foreground">
            Recent Candidates
          </h2>
          <p className="text-[11px] text-foreground-secondary">
            Latest applicant submissions
          </p>
        </div>

        <Link
          href="/hr/candidates"
          className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 rounded-md"
        >
          <span>View all</span>
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </div>

      {/* Candidates List */}
      <div className="divide-y divide-border/60">
        {recent.length > 0 ? (
          recent.map((candidate) => (
            <div
              key={candidate.id}
              onClick={() => onSelectCandidate(candidate)}
              className="group flex cursor-pointer items-center justify-between gap-3 px-4 py-2 sm:px-4 sm:py-2 transition-colors hover:bg-surface-subtle"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelectCandidate(candidate);
                }
              }}
              aria-label={`View application details for ${candidate.fullName}`}
            >
              <div className="flex min-w-0 items-center gap-2.5">
                {/* Initials avatar chip */}
                <div
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-surface-muted text-[11px] font-semibold text-primary"
                  aria-hidden="true"
                >
                  {getInitials(candidate.fullName)}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
                      {candidate.fullName}
                    </span>
                    <CandidateStatusBadge status={candidate.status} />
                  </div>
                  <p className="truncate text-[11px] text-foreground-secondary mt-0.5">
                    {candidate.appliedJobTitle} ·{" "}
                    <span className="text-foreground-muted">{candidate.appliedDate}</span>
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="py-8 text-center text-xs text-foreground-muted">
            No candidates registered yet.
          </p>
        )}
      </div>
    </div>
  );
}

export default RecentCandidatesCard;
