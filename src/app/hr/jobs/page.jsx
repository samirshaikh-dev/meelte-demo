"use client";

import React, { useState, useMemo } from "react";
import { Plus } from "@/lib/icons";
import { Button } from "@/components/ui/button";
import {
  HrHeader,
  JobsFilterBar,
  JobsTable,
  useHr,
} from "@/components/hr";

export default function JobsManagementPage() {
  const {
    jobs,
    openCreateJobModal,
    openEditJobModal,
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
    <>
      <HrHeader title="Job Requisitions" />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
        {/* Page Title & Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Job Openings & Management
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-foreground-secondary">
              Publish, edit, archive, or expire job requisitions across all departments.
            </p>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={openCreateJobModal}
            className="gap-1.5 self-start sm:self-auto"
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
          onEditJob={openEditJobModal}
          onUpdateStatus={updateJobStatus}
          onDeleteJobClick={setDeletingJobId}
        />
      </main>
    </>
  );
}
