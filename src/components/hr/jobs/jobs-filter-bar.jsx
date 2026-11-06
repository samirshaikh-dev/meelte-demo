"use client";

import React from "react";
import { Search, ChevronDown } from "@/lib/icons";
import { DEPARTMENTS } from "@/constants/hr-constants";

export function JobsFilterBar({
  searchQuery,
  onSearchChange,
  selectedDept,
  onDeptChange,
  statusFilter,
  onStatusChange,
  jobs = [],
}) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-4 shadow-soft">
      {/* Controls Row: Search & Department Dropdown */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-muted"
          />
          <input
            type="text"
            placeholder="Search jobs by title, department, or location..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full h-10 rounded-xl border border-border bg-surface pl-9 pr-3.5 text-xs sm:text-sm text-foreground placeholder:text-foreground-muted/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 transition-colors"
          />
        </div>

        {/* Department Dropdown */}
        <div className="relative w-full sm:w-56 shrink-0">
          <label htmlFor="dept-filter" className="sr-only">
            Filter by department
          </label>
          <select
            id="dept-filter"
            value={selectedDept}
            onChange={(e) => onDeptChange(e.target.value)}
            className="w-full appearance-none h-10 rounded-xl border border-border bg-surface pl-3 pr-9 text-xs sm:text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 transition-colors cursor-pointer"
          >
            {DEPARTMENTS.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
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
      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 border-t border-border/80 pt-2.5 mt-0.5">
        {["All", "Active", "Draft", "Expired", "Archived"].map((st) => {
          const isSelected = statusFilter === st;
          const count =
            st === "All"
              ? jobs.length
              : jobs.filter((j) => j.status === st).length;

          return (
            <button
              key={st}
              type="button"
              onClick={() => onStatusChange(st)}
              className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 ${
                isSelected
                  ? "bg-primary text-white font-semibold"
                  : "bg-transparent text-foreground-secondary hover:bg-surface-muted/60 hover:text-foreground font-medium"
              }`}
            >
              <span>{st}</span>
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

export default JobsFilterBar;
