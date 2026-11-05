"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "@/lib/icons";
import {
  HrHeader,
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
    openEditJobModal,
    openCandidateModal,
  } = useHr();

  return (
    <>
      {/* Minimal Top Header without redundant breadcrumbs */}
      <HrHeader title="Recruitment Dashboard" />

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
            onEditJob={openEditJobModal}
            limit={4}
          />
        </div>
      </main>
    </>
  );
}
