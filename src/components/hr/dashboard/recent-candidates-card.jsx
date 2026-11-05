"use client";

import { useId } from "react";
import Link from "next/link";
import { ArrowRight, ChevronRight } from "@/lib/icons";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

/**
 * Applied dates arrive as `YYYY-MM-DD` strings. Formatting them by hand keeps
 * the label identical on the server and the client, and avoids the timezone
 * shift of `new Date("2026-11-03")`, which reads as UTC midnight and can render
 * as the previous day west of Greenwich.
 */
function formatAppliedDate(value) {
  if (typeof value !== "string") return "";
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  if (!match) return "";
  const month = MONTHS[Number(match[2]) - 1];
  if (!month) return "";
  return `${Number(match[3])} ${month}`;
}

/**
 * Recent candidate applications for the HR dashboard.
 *
 * Triage order is "who → which role → how fresh", because that is the decision
 * the recruiter makes here. Contact details stay in the candidate drawer: two
 * truncated contact strings at 11px told the reader nothing they could act on.
 * Each row is a native button (it opens the drawer), so Enter/Space, focus and
 * the accessible name come from the platform instead of a keydown handler.
 */
export function RecentCandidatesCard({
  candidates = [],
  onSelectCandidate,
  limit = 3,
}) {
  const headingId = useId();
  const recent = candidates.slice(0, limit);

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
          Recent Candidates
        </h2>

        <Link
          href="/hr/candidates"
          aria-label="View all candidates"
          className="inline-flex shrink-0 items-center gap-1 rounded-md text-xs font-semibold text-primary transition-colors hover:text-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
        >
          <span>View all</span>
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </div>

      {/* Candidates List */}
      {recent.length > 0 ? (
        <ul role="list" className="divide-y divide-border/60">
          {recent.map((candidate) => {
            const appliedRole = candidate.appliedJobTitle || "";
            const appliedDate = formatAppliedDate(candidate.appliedDate);

            return (
              <li key={candidate.id}>
                <button
                  type="button"
                  onClick={() => onSelectCandidate?.(candidate)}
                  className="group flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary/70"
                >
                  <span
                    aria-hidden="true"
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-muted text-xs font-semibold text-primary"
                  >
                    {getInitials(candidate.fullName)}
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-foreground transition-colors group-hover:text-primary">
                      {candidate.fullName}
                    </span>

                    {(appliedRole || appliedDate) && (
                      <span className="mt-1 flex items-baseline gap-x-2 text-xs text-foreground-secondary">
                        {appliedRole && (
                          <span className="truncate">{appliedRole}</span>
                        )}
                        {appliedRole && appliedDate && (
                          <span aria-hidden="true" className="text-foreground-muted">
                            ·
                          </span>
                        )}
                        {appliedDate && (
                          <span className="shrink-0 whitespace-nowrap tabular-nums">
                            {appliedDate}
                          </span>
                        )}
                      </span>
                    )}
                  </span>

                  <ChevronRight
                    aria-hidden="true"
                    className="h-4 w-4 shrink-0 text-foreground-muted transition-colors group-hover:text-primary"
                  />

                  <span className="sr-only">View candidate profile</span>
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="px-4 py-6 text-xs leading-relaxed text-foreground-secondary">
          No applications yet.
        </p>
      )}
    </section>
  );
}

export default RecentCandidatesCard;
