"use client";

import React, { useState } from "react";
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
} from "@/lib/icons";
import { Button } from "@/components/ui/button";
import { JobStatusBadge } from "@/components/hr/shared/hr-badge";

export function JobsTable({
  jobs = [],
  onUpdateStatus,
  onDeleteJobClick,
}) {
  const [activeMenuJobId, setActiveMenuJobId] = useState(null);

  const toggleActionsMenu = (id) => {
    setActiveMenuJobId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-soft">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-border/80 bg-surface-subtle/80 text-foreground-muted uppercase tracking-wider text-[11px]">
              <th className="w-[32%] px-5 py-3 font-semibold">Job Title & Role</th>
              <th className="w-[15%] px-4 py-3 font-semibold">Department</th>
              <th className="w-[15%] px-4 py-3 font-semibold">Type & Setup</th>
              <th className="w-[12%] px-4 py-3 font-semibold text-center">Applicants</th>
              <th className="w-[12%] px-4 py-3 font-semibold">Deadline</th>
              <th className="w-[12%] px-4 py-3 font-semibold">Status</th>
              <th className="w-[14%] px-5 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {jobs.length > 0 ? (
              jobs.map((job) => (
                <tr
                  key={job.id}
                  className="h-14 sm:h-16 hover:bg-surface-subtle/60 transition-colors"
                >
                  {/* Title & Location */}
                  <td className="px-5 py-3.5">
                    <div className="font-bold text-foreground text-sm">
                      {job.title}
                    </div>
                    <div className="text-[11px] text-foreground-muted mt-0.5">
                      {job.location} · {job.salaryRange || "Competitive"}
                    </div>
                  </td>

                  {/* Department */}
                  <td className="px-4 py-3.5 text-foreground-secondary font-medium">
                    {job.department}
                  </td>

                  {/* Type & Workplace */}
                  <td className="px-4 py-3.5 text-foreground-secondary">
                    <div>{job.employmentType}</div>
                    <div className="text-[11px] text-foreground-muted">
                      {job.workplaceType}
                    </div>
                  </td>

                  {/* Applicants */}
                  <td className="px-4 py-3.5 text-center">
                    <span className="inline-flex items-center rounded-lg bg-surface-muted px-2.5 py-1 text-xs font-semibold text-primary tabular-nums">
                      {job.applicantCount ?? 0}
                    </span>
                  </td>

                  {/* Deadline */}
                  <td className="px-4 py-3.5 text-foreground-secondary tabular-nums">
                    {job.deadline}
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3.5">
                    <JobStatusBadge status={job.status} />
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-3.5 text-right relative">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        as={Link}
                        href={`/hr/jobs/${job.id}/edit`}
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2 text-xs font-medium text-foreground-secondary hover:text-foreground"
                        aria-label={`Edit ${job.title}`}
                      >
                        <Edit2 className="h-3.5 w-3.5 mr-1 text-foreground-muted" />
                        Edit
                      </Button>

                      {/* Dropdown Menu */}
                      <div className="relative inline-block text-left">
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
                            onMouseLeave={() => setActiveMenuJobId(null)}
                            className="absolute right-0 top-9 z-20 w-44 rounded-xl border border-border bg-surface p-1 shadow-card"
                          >
                            {job.status === "Draft" && (
                              <button
                                type="button"
                                onClick={() => {
                                  onUpdateStatus(job.id, "Active");
                                  setActiveMenuJobId(null);
                                }}
                                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium text-success hover:bg-success-bg transition-colors"
                              >
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                Publish (Activate)
                              </button>
                            )}

                            {job.status === "Active" && (
                              <button
                                type="button"
                                onClick={() => {
                                  onUpdateStatus(job.id, "Draft");
                                  setActiveMenuJobId(null);
                                }}
                                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium text-foreground-secondary hover:bg-surface-muted transition-colors"
                              >
                                <XCircle className="h-3.5 w-3.5" />
                                Unpublish to Draft
                              </button>
                            )}

                            {job.status !== "Expired" && (
                              <button
                                type="button"
                                onClick={() => {
                                  onUpdateStatus(job.id, "Expired");
                                  setActiveMenuJobId(null);
                                }}
                                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium text-warning hover:bg-warning-bg transition-colors"
                              >
                                <Clock className="h-3.5 w-3.5" />
                                Mark as Expired
                              </button>
                            )}

                            {job.status !== "Archived" ? (
                              <button
                                type="button"
                                onClick={() => {
                                  onUpdateStatus(job.id, "Archived");
                                  setActiveMenuJobId(null);
                                }}
                                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium text-foreground-secondary hover:bg-surface-muted transition-colors"
                              >
                                <Archive className="h-3.5 w-3.5" />
                                Archive Job
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  onUpdateStatus(job.id, "Active");
                                  setActiveMenuJobId(null);
                                }}
                                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium text-primary hover:bg-surface-muted transition-colors"
                              >
                                <RefreshCw className="h-3.5 w-3.5" />
                                Restore to Active
                              </button>
                            )}

                            <div className="my-1 border-t border-border" />

                            <button
                              type="button"
                              onClick={() => {
                                onDeleteJobClick(job.id);
                                setActiveMenuJobId(null);
                              }}
                              className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium text-error hover:bg-error-bg transition-colors"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              Delete Job
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-14 sm:py-16 px-4 text-center">
                  <p className="text-xs text-foreground-muted">
                    No job requisitions found.
                  </p>
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
