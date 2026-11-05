"use client";

import React, { useState, useMemo } from "react";
import {
  CandidatesFilterBar,
  CandidatesTable,
  useHr,
} from "@/components/hr";

export default function CandidatesPage() {
  const { candidates, jobs, openCandidateModal } = useHr();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedJobId, setSelectedJobId] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

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
    <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Candidates Database
            </h1>
          </div>

          <div className="rounded-xl border border-border bg-surface px-3 py-1.5 text-xs text-foreground-secondary self-start sm:self-auto">
            Total Candidates:{" "}
            <span className="font-bold text-foreground">{candidates.length}</span>
          </div>
        </div>

        {/* Modular Candidates Filter Bar */}
        <CandidatesFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedJobId={selectedJobId}
          onJobChange={setSelectedJobId}
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
