"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  MoreVertical,
  Edit2,
  Trash2,
  Archive,
  Clock,
  CheckCircle2,
  XCircle,
  RefreshCw,
  FileText,
  Briefcase,
  Plus,
} from "@/lib/icons";
import { Button } from "@/components/ui/button";
import { JobStatusBadge } from "@/components/hr/shared/hr-badge";

export function JobsTable({
  jobs = [],
  statusFilter = "All",
  onUpdateStatus,
  onDeleteJobClick,
}) {
  const [activeMenuJobId, setActiveMenuJobId] = useState(null);

  const toggleActionsMenu = (id) => {
    setActiveMenuJobId((prev) => (prev === id ? null : id));
  };

  // Close dropdown on click outside or Escape key
  useEffect(() => {
    if (!activeMenuJobId) return;

    const handleClickOutside = (e) => {
      if (!e.target.closest('[data-actions-menu="true"]')) {
        setActiveMenuJobId(null);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setActiveMenuJobId(null);
      }
    };

    document.addEventListener("pointerdown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeMenuJobId]);

  // Render contextual empty state
  const renderEmptyState = () => {
    const normalizedFilter = (statusFilter || "All").toLowerCase();

    let title = "No jobs matched your criteria";
    let message = "Try adjusting your search terms or filters, or create a new job opening.";
    let IconComponent = Briefcase;

    if (normalizedFilter === "draft") {
      title = "No drafts yet";
      message = "You don't have any in-progress drafts. When you save a draft from the job form, it will be safely stored here.";
      IconComponent = FileText;
    } else if (normalizedFilter === "active") {
      title = "No active job postings";
      message = "There are currently no active job postings published.";
      IconComponent = Briefcase;
    } else if (normalizedFilter === "expired") {
      title = "No expired jobs";
      message = "There are no expired job requisitions in the archive.";
      IconComponent = Clock;
    } else if (normalizedFilter === "archived") {
      title = "No archived jobs";
      message = "No job postings have been archived.";
      IconComponent = Archive;
    }

    return (
      <div className="flex flex-col items-center justify-center py-14 sm:py-16 px-4 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-muted text-primary mb-3">
          <IconComponent className="h-6 w-6" aria-hidden="true" />
        </div>
        <h3 className="text-sm sm:text-base font-bold text-foreground">
          {title}
        </h3>
        <p className="mt-1 max-w-sm text-xs text-foreground-muted leading-relaxed">
          {message}
        </p>
        <div className="mt-5">
          <Button
            as={Link}
            href="/hr/jobs/new"
            variant="primary"
            size="sm"
            className="gap-1.5 rounded-xl font-semibold shadow-2xs"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            <span>Create New Job</span>
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-soft">
      {/* Container with min-height ensures dropdown menus on 1-2 rows never get clipped */}
      <div className="overflow-x-auto min-h-[250px]">
        <table className="w-full min-w-[860px] text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-border/80 bg-surface-subtle/80 text-foreground-muted uppercase tracking-wider text-[11px]">
              <th className="w-[28%] px-5 py-3 font-semibold">Job Title & Role</th>
              <th className="w-[14%] px-4 py-3 font-semibold">Department</th>
              <th className="w-[14%] px-4 py-3 font-semibold">Type & Setup</th>
              <th className="w-[10%] px-4 py-3 font-semibold text-center">Applicants</th>
              <th className="w-[12%] px-4 py-3 font-semibold">Deadline</th>
              <th className="w-[10%] px-4 py-3 font-semibold">Status</th>
              <th className="w-[12%] px-5 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {jobs.length > 0 ? (
              jobs.map((job) => {
                const isDraft = (job.status || "").toLowerCase() === "draft";
                const lastEditedDate = job.updatedAt || job.createdAt;

                return (
                  <tr
                    key={job.id}
                    className="h-16 hover:bg-surface-subtle/60 transition-colors"
                  >
                    {/* Title & Role / Location */}
                    <td className="px-5 py-3.5">
                      <div className="font-bold text-foreground text-sm truncate max-w-[240px]">
                        {job.title}
                      </div>
                      <div className="text-[11px] text-foreground-muted mt-0.5 truncate max-w-[240px]">
                        {job.location || "Remote"} · {job.salaryRange || "Competitive"}
                      </div>
                      {/* Last edited timestamp for drafts */}
                      {isDraft && lastEditedDate && (
                        <div className="mt-1 flex items-center gap-1 text-[10px] text-foreground-muted/90">
                          <Clock className="h-2.5 w-2.5 shrink-0" aria-hidden="true" />
                          <span>Last edited {lastEditedDate}</span>
                        </div>
                      )}
                    </td>

                    {/* Department */}
                    <td className="px-4 py-3.5 text-foreground-secondary font-medium">
                      {job.department || "—"}
                    </td>

                    {/* Type & Workplace */}
                    <td className="px-4 py-3.5 text-foreground-secondary">
                      <div>{job.employmentType || "—"}</div>
                      <div className="text-[11px] text-foreground-muted">
                        {job.workplaceType || "—"}
                      </div>
                    </td>

                    {/* Applicants */}
                    <td className="px-4 py-3.5 text-center">
                      {isDraft ? (
                        <span className="text-foreground-muted font-normal select-none">—</span>
                      ) : (
                        <span className="inline-flex items-center rounded-lg bg-surface-muted px-2.5 py-1 text-xs font-semibold text-primary tabular-nums">
                          {job.applicantCount ?? 0}
                        </span>
                      )}
                    </td>

                    {/* Deadline */}
                    <td className="px-4 py-3.5 text-foreground-secondary tabular-nums">
                      {job.deadline && job.deadline.trim() !== "" ? (
                        job.deadline
                      ) : (
                        <span className="text-foreground-muted select-none">—</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3.5">
                      <JobStatusBadge status={job.status} />
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-3.5 text-right relative">
                      <div className="flex items-center justify-end gap-1.5 whitespace-nowrap">
                        {isDraft ? (
                          <>
                            {/* Draft Primary Action: Continue Editing (single line, no wrapping) */}
                            <Button
                              as={Link}
                              href={`/hr/jobs/${job.id}/edit`}
                              variant="ghost"
                              size="sm"
                              className="h-8 px-2.5 text-xs font-semibold text-primary hover:bg-primary/10 hover:text-primary transition-colors whitespace-nowrap shrink-0 rounded-lg"
                              aria-label={`Continue editing ${job.title}`}
                            >
                              <Edit2 className="h-3.5 w-3.5 mr-1 shrink-0" aria-hidden="true" />
                              <span>Continue Editing</span>
                            </Button>

                            {/* Dropdown Menu for Draft Actions (Publish, Delete) */}
                            <div
                              data-actions-menu="true"
                              className="relative inline-block text-left shrink-0"
                            >
                              <button
                                type="button"
                                onClick={() => toggleActionsMenu(job.id)}
                                aria-label="More draft actions"
                                className="flex h-8 w-8 items-center justify-center rounded-lg text-foreground-secondary hover:bg-surface-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
                              >
                                <MoreVertical className="h-4 w-4" />
                              </button>

                              {activeMenuJobId === job.id && (
                                <div
                                  className="absolute right-0 top-9 z-30 w-44 rounded-xl border border-border bg-surface p-1 shadow-card"
                                >
                                  <button
                                    type="button"
                                    onClick={() => {
                                      onUpdateStatus(job.id, "Active");
                                      setActiveMenuJobId(null);
                                    }}
                                    className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-medium text-success hover:bg-success-bg transition-colors cursor-pointer"
                                  >
                                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                                    <span>Publish Job</span>
                                  </button>

                                  <div className="my-1 border-t border-border" />

                                  <button
                                    type="button"
                                    onClick={() => {
                                      onDeleteJobClick(job.id);
                                      setActiveMenuJobId(null);
                                    }}
                                    className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-medium text-error hover:bg-error-bg transition-colors cursor-pointer"
                                  >
                                    <Trash2 className="h-3.5 w-3.5 shrink-0" />
                                    <span>Delete Draft</span>
                                  </button>
                                </div>
                              )}
                            </div>
                          </>
                        ) : (
                          <>
                            {/* Non-Draft Action: Edit */}
                            <Button
                              as={Link}
                              href={`/hr/jobs/${job.id}/edit`}
                              variant="ghost"
                              size="sm"
                              className="h-8 px-2.5 text-xs font-medium text-foreground-secondary hover:text-foreground whitespace-nowrap shrink-0 rounded-lg"
                              aria-label={`Edit ${job.title}`}
                            >
                              <Edit2 className="h-3.5 w-3.5 mr-1 text-foreground-muted shrink-0" />
                              <span>Edit</span>
                            </Button>

                            {/* Dropdown Menu for Active/Expired/Archived */}
                            <div
                              data-actions-menu="true"
                              className="relative inline-block text-left shrink-0"
                            >
                              <button
                                type="button"
                                onClick={() => toggleActionsMenu(job.id)}
                                aria-label="More job actions"
                                className="flex h-8 w-8 items-center justify-center rounded-lg text-foreground-secondary hover:bg-surface-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
                              >
                                <MoreVertical className="h-4 w-4" />
                              </button>

                              {activeMenuJobId === job.id && (
                                <div
                                  className="absolute right-0 top-9 z-30 w-44 rounded-xl border border-border bg-surface p-1 shadow-card"
                                >
                                  {job.status === "Active" && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        onUpdateStatus(job.id, "Draft");
                                        setActiveMenuJobId(null);
                                      }}
                                      className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-medium text-foreground-secondary hover:bg-surface-muted transition-colors cursor-pointer"
                                    >
                                      <XCircle className="h-3.5 w-3.5 shrink-0" />
                                      <span>Unpublish to Draft</span>
                                    </button>
                                  )}

                                  {job.status !== "Expired" && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        onUpdateStatus(job.id, "Expired");
                                        setActiveMenuJobId(null);
                                      }}
                                      className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-medium text-warning hover:bg-warning-bg transition-colors cursor-pointer"
                                    >
                                      <Clock className="h-3.5 w-3.5 shrink-0" />
                                      <span>Mark as Expired</span>
                                    </button>
                                  )}

                                  {job.status !== "Archived" ? (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        onUpdateStatus(job.id, "Archived");
                                        setActiveMenuJobId(null);
                                      }}
                                      className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-medium text-foreground-secondary hover:bg-surface-muted transition-colors cursor-pointer"
                                    >
                                      <Archive className="h-3.5 w-3.5 shrink-0" />
                                      <span>Archive Job</span>
                                    </button>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        onUpdateStatus(job.id, "Active");
                                        setActiveMenuJobId(null);
                                      }}
                                      className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-medium text-primary hover:bg-surface-muted transition-colors cursor-pointer"
                                    >
                                      <RefreshCw className="h-3.5 w-3.5 shrink-0" />
                                      <span>Restore to Active</span>
                                    </button>
                                  )}

                                  <div className="my-1 border-t border-border" />

                                  <button
                                    type="button"
                                    onClick={() => {
                                      onDeleteJobClick(job.id);
                                      setActiveMenuJobId(null);
                                    }}
                                    className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-medium text-error hover:bg-error-bg transition-colors cursor-pointer"
                                  >
                                    <Trash2 className="h-3.5 w-3.5 shrink-0" />
                                    <span>Delete Job</span>
                                  </button>
                                </div>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={7} className="p-0">
                  {renderEmptyState()}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default JobsTable;
