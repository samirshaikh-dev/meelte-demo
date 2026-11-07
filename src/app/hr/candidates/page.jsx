"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  CandidatesFilterBar,
  CandidatesTable,
  useHr,
} from "@/components/hr";

function CandidatesPageContent() {
  const searchParams = useSearchParams();
  const { candidates, jobs, openCandidateModal } = useHr();

  const urlJobId = searchParams.get("jobId");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedJobIdOverride, setSelectedJobIdOverride] = useState(null);
  const [statusFilter, setStatusFilter] = useState("ALL");

  const selectedJobId = selectedJobIdOverride ?? (urlJobId || "ALL");

  // Options for jobs dropdown
  const jobOptions = useMemo(() => {
    return [
      { id: "ALL", title: "All Applied Positions" },
      ...jobs.map((j) => ({ id: j.id, title: j.title })),
    ];
  }, [jobs]);

  // Filtered candidate list calculation
  const filteredCandidates = useMemo(() => {
    return candidates.filter((cand) => {
      // Search by name, email, or phone
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        cand.fullName.toLowerCase().includes(query) ||
        cand.email.toLowerCase().includes(query) ||
        cand.phone.toLowerCase().includes(query);

      // Job Filter
      const matchesJob =
        selectedJobId === "ALL" || cand.appliedJobId === selectedJobId;

      // Status Filter
      const matchesStatus =
        statusFilter === "ALL" || cand.status === statusFilter;

      return matchesSearch && matchesJob && matchesStatus;
    });
  }, [candidates, searchQuery, selectedJobId, statusFilter]);

  return (
    <main className="flex-1 p-4 sm:p-5 lg:p-6 flex flex-col gap-6 max-w-7xl w-full mx-auto">
      {/* Page Header */}
      <div className="flex items-center justify-between gap-4 pb-3 border-b border-border/80">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Candidates Database
          </h1>
        </div>

        <div className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface px-3 py-1.5 text-xs text-foreground-secondary shadow-2xs">
          <span className="text-foreground-muted">Total Candidates:</span>
          <span className="font-semibold text-foreground tabular-nums">
            {candidates.length}
          </span>
        </div>
      </div>

      {/* Modular Candidates Filter Bar */}
      <CandidatesFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedJobId={selectedJobId}
        onJobChange={setSelectedJobIdOverride}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        jobOptions={jobOptions}
        candidates={candidates}
      />

      {/* Modular Candidates Table */}
      <CandidatesTable
        candidates={filteredCandidates}
        onSelectCandidate={openCandidateModal}
      />
    </main>
  );
}

export default function CandidatesPage() {
  return (
    <Suspense
      fallback={
        <main className="flex-1 p-4 sm:p-5 lg:p-6 flex flex-col gap-6 max-w-7xl w-full mx-auto">
          <div className="h-8 w-48 animate-pulse rounded-md bg-surface-muted" />
          <div className="h-16 animate-pulse rounded-xl border border-border bg-surface" />
          <div className="h-96 animate-pulse rounded-xl border border-border bg-surface" />
        </main>
      }
    >
      <CandidatesPageContent />
    </Suspense>
  );
}
