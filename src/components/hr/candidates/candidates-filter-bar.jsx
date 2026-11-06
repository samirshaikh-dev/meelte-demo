"use client";

import React from "react";
import { Search, ChevronDown } from "@/lib/icons";
import { CANDIDATE_STATUSES } from "@/constants/hr-constants";

export function CandidatesFilterBar({
  searchQuery,
  onSearchChange,
  selectedJobId,
  onJobChange,
  statusFilter,
  onStatusChange,
  jobOptions = [],
  candidates = [],
}) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-4 shadow-soft">
      {/* Controls Row: Search & Applied Position Dropdown */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-muted"
          />
          <input
            type="text"
            placeholder="Search candidates by name, email, or phone number..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full h-10 rounded-xl border border-border bg-surface pl-9 pr-3.5 text-xs sm:text-sm text-foreground placeholder:text-foreground-muted/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 transition-colors"
          />
        </div>

        {/* Filter by Applied Job Dropdown */}
        <div className="relative w-full sm:w-60 shrink-0">
          <label htmlFor="job-filter" className="sr-only">
            Filter by applied job
          </label>
          <select
            id="job-filter"
            value={selectedJobId}
            onChange={(e) => onJobChange(e.target.value)}
            className="w-full appearance-none h-10 rounded-xl border border-border bg-surface pl-3 pr-9 text-xs sm:text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 transition-colors cursor-pointer"
          >
            {jobOptions.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.title}
              </option>
            ))}
          </select>
          <ChevronDown
            aria-hidden="true"
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-muted"
          />
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar border-t border-border/80 pt-2.5 mt-0.5 py-0.5">
        {["ALL", ...CANDIDATE_STATUSES].map((st) => {
          const isSelected = statusFilter === st;
          const count =
            st === "ALL"
              ? candidates.length
              : candidates.filter((c) => c.status === st).length;

          return (
            <button
              key={st}
              type="button"
              onClick={() => onStatusChange(st)}
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 ${
                isSelected
                  ? "bg-primary text-white font-semibold"
                  : "bg-transparent text-foreground-secondary hover:bg-surface-muted/60 hover:text-foreground font-medium"
              }`}
            >
              <span>{st === "ALL" ? "All Statuses" : st}</span>
              <span
                className={`rounded-full px-1.5 py-0.5 text-[10px] tabular-nums ${
                  isSelected
                    ? "bg-white/20 text-white font-semibold"
                    : count === 0
                    ? "text-foreground-muted/50 font-normal"
                    : "bg-surface-muted text-foreground-secondary font-medium"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default CandidatesFilterBar;
