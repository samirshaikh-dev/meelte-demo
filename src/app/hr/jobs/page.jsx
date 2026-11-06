"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Plus } from "@/lib/icons";
import { Button } from "@/components/ui/button";
import {
  JobsFilterBar,
  JobsTable,
  useHr,
} from "@/components/hr";

export default function JobsManagementPage() {
  const {
    jobs,
    updateJobStatus,
    setDeletingJobId,
  } = useHr();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("All Departments");
  const [statusFilter, setStatusFilter] = useState("All");

  // Filtered jobs calculation
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      // Search query filter
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        job.title.toLowerCase().includes(query) ||
        job.department.toLowerCase().includes(query) ||
        job.location.toLowerCase().includes(query);

      // Department filter
      const matchesDept =
        selectedDept === "All Departments" || job.department === selectedDept;

      // Status tab filter
      const matchesStatus =
        statusFilter === "All" || job.status === statusFilter;

      return matchesSearch && matchesDept && matchesStatus;
    });
  }, [jobs, searchQuery, selectedDept, statusFilter]);

  return (
    <main className="flex-1 p-4 sm:p-5 lg:p-6 flex flex-col gap-6 max-w-7xl w-full mx-auto">
      {/* Page Title & Action Bar */}
      <div className="flex items-center justify-between gap-4 pb-3 border-b border-border/80">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Jobs Management
          </h1>
        </div>

        <Button
          as={Link}
          href="/hr/jobs/new"
          variant="primary"
          size="sm"
          className="gap-1.5 rounded-xl shadow-2xs font-semibold focus-visible:ring-primary/70"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          <span>Create New Job</span>
        </Button>
      </div>

      {/* Modular Filter & Search Bar */}
      <JobsFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedDept={selectedDept}
        onDeptChange={setSelectedDept}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        jobs={jobs}
      />

      {/* Modular Jobs Table */}
      <JobsTable
        jobs={filteredJobs}
        onUpdateStatus={updateJobStatus}
        onDeleteJobClick={setDeletingJobId}
      />
    </main>
  );
}
