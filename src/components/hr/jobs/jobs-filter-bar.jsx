"use client";

import React from "react";
import { Search } from "@/lib/icons";
import { DEPARTMENTS } from "@/data/hr-mock-data";

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
    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-4 shadow-soft">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-muted" />
          <input
            type="text"
            placeholder="Search jobs by title, department, or location..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-xl border border-border bg-surface pl-9 pr-4 py-2 text-xs sm:text-sm text-foreground placeholder:text-foreground-muted focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
          />
        </div>

        {/* Department Dropdown */}
        <div className="w-full sm:w-56 shrink-0">
          <label htmlFor="dept-filter" className="sr-only">
            Filter by department
          </label>
          <select
            id="dept-filter"
            value={selectedDept}
            onChange={(e) => onDeptChange(e.target.value)}
            className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-xs sm:text-sm text-foreground focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
          >
            {DEPARTMENTS.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 border-t border-border pt-3">
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
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 ${
                isSelected
                  ? "bg-primary text-white shadow-soft"
                  : "bg-surface-subtle text-foreground-secondary hover:bg-surface-muted hover:text-foreground"
              }`}
            >
              <span>{st}</span>
              <span
                className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                  isSelected
                    ? "bg-white/20 text-white"
                    : "bg-border text-foreground-muted"
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

