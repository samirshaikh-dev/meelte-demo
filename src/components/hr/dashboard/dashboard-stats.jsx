"use client";

import React from "react";
import { Users, Briefcase, FileCheck2, AlertCircle } from "@/lib/icons";

/**
 * Overview statistics grid for HR dashboard
 * Conforms to compact-card-design and AVOID.md:
 * - Crisp 1px token borders (no puffy resting shadows)
 * - Calibrated icon tiles (32x32px) and disciplined typography
 * - High-contrast readable metric counts without verbose boilerplate
 */
export function DashboardStats({ stats }) {
  const statItems = [
    {
      id: "candidates",
      label: "Candidates",
      value: stats.totalRegisteredCandidates,
      tag: "In Pool",
      tagStyle: "bg-surface-muted text-primary border-primary/20",
      description: "Registered applicant profiles",
      icon: Users,
      iconStyle: "bg-surface-muted text-primary",
    },
    {
      id: "active-jobs",
      label: "Active Jobs",
      value: stats.totalActiveJobs,
      tag: "Live",
      tagStyle: "bg-success-bg text-success border-success-border",
      description: "Accepting applications",
      icon: Briefcase,
      iconStyle: "bg-success-bg text-success",
    },
    {
      id: "applications",
      label: "Total Applications",
      value: stats.totalApplications,
      tag: "Submissions",
      tagStyle: "bg-surface-subtle text-foreground-secondary border-border",
      description: "Across published roles",
      icon: FileCheck2,
      iconStyle: "bg-surface-muted text-primary",
    },
    {
      id: "expired-jobs",
      label: "Expired Roles",
      value: stats.totalExpiredJobs,
      tag: stats.totalExpiredJobs > 0 ? "Needs Review" : "Clear",
      tagStyle:
        stats.totalExpiredJobs > 0
          ? "bg-warning-bg text-warning border-warning-border"
          : "bg-surface-subtle text-foreground-muted border-border",
      description: "Passed listing deadline",
      icon: AlertCircle,
      iconStyle:
        stats.totalExpiredJobs > 0
          ? "bg-warning-bg text-warning"
          : "bg-surface-subtle text-foreground-muted",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
      {statItems.map((item) => {
        
        return (
          <div
            key={item.id}
            className="flex flex-col justify-between rounded-xl border border-border/80 bg-surface p-3 transition-colors hover:border-primary/30"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-foreground-secondary">
                {item.label}
              </span>

            </div>

            <div className="mt-1.5 flex items-baseline justify-between gap-1.5">
              <span className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                {item.value}
              </span>

            </div>

          </div>
        );
      })}
    </div>
  );
}

export default DashboardStats;
