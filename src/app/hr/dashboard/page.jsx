"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight, AlertCircle, RotateCcw } from "@/lib/icons";
import { Button } from "@/components/ui/button";
import {
  DashboardStats,
  RecentCandidatesCard,
  RecentJobsCard,
  useHr,
} from "@/components/hr";

export default function HrDashboardPage() {
  const {
    jobs,
    candidates,
    stats,
    isLoading,
    error,
    refetchData,
    openCandidateModal,
  } = useHr();

  // Full Screen Error State when no data could be retrieved
  if (error && !jobs.length && !candidates.length) {
    return (
      <main className="flex-1 p-4 sm:p-6 lg:p-8 flex flex-col items-center justify-center max-w-7xl w-full mx-auto">
        <div
          role="alert"
          className="w-full max-w-md rounded-2xl border border-error/30 bg-surface p-6 sm:p-8 text-center shadow-soft space-y-4"
        >
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-error/10 text-error">
            <AlertCircle className="h-6 w-6" aria-hidden="true" />
          </div>

          <div>
            <h1 className="text-lg font-bold text-foreground">
              Unable to Load Dashboard
            </h1>
            <p className="mt-1.5 text-xs sm:text-sm text-foreground-secondary leading-relaxed">
              {error}
            </p>
          </div>

          <div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={refetchData}
              className="inline-flex items-center gap-1.5"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Retry Connection</span>
            </Button>
          </div>
        </div>
      </main>
    );
  }

  // Skeleton Loading State
  if (isLoading && !jobs.length && !candidates.length) {
    return (
      <main className="flex-1 p-4 sm:p-5 lg:p-6 flex flex-col gap-4 max-w-7xl w-full mx-auto animate-pulse">
        <div className="h-8 w-48 rounded-lg bg-surface-muted" />

        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-20 rounded-xl border border-border/60 bg-surface p-3"
            />
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 flex-1 min-h-0">
          <div className="h-64 rounded-xl border border-border/60 bg-surface" />
          <div className="h-64 rounded-xl border border-border/60 bg-surface" />
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 p-4 sm:p-5 lg:p-6 flex flex-col gap-4 max-w-7xl w-full mx-auto">
      {/* Streamlined Welcome Banner */}
      <div className="flex items-center justify-between gap-3 pb-2 border-b border-border/60">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/careers"
            target="_blank"
            className="inline-flex items-center gap-1.5 rounded-lg border border-border/80 bg-surface px-3 py-1.5 text-xs font-medium text-foreground-secondary hover:bg-surface-subtle hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
          >
            <span>Public Careers</span>
            <ArrowUpRight className="h-3.5 w-3.5 text-foreground-muted" aria-hidden="true" />
          </Link>
        </div>
      </div>

      {/* Warning Notice if partial error occurred while displaying cached data */}
      {error && (
        <div
          role="alert"
          className="flex items-center justify-between gap-3 rounded-xl border border-warning-border bg-warning-bg px-4 py-2.5 text-xs text-warning"
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{error} Showing cached records.</span>
          </div>
          <button
            type="button"
            onClick={refetchData}
            className="font-semibold underline hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warning"
          >
            Retry
          </button>
        </div>
      )}

      {/* 4 Overview Statistics Metric Cards */}
      <DashboardStats stats={stats} />

      {/* Two-Column Grid: Recent Candidates & Recent Jobs */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 flex-1 min-h-0">
        <RecentCandidatesCard
          candidates={candidates}
          onSelectCandidate={openCandidateModal}
          limit={4}
        />
        <RecentJobsCard
          jobs={jobs}
          limit={4}
        />
      </div>
    </main>
  );
}
