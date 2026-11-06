"use client";

import React from "react";
import { Users, Briefcase, FileCheck2, AlertCircle } from "@/lib/icons";

/**
 * Overview statistics grid for HR dashboard
 * Conforms to compact-card-design, docs/Design.md, and AVOID.md:
 * - Clear visual hierarchy: bold large metrics with compact muted uppercase labels
 * - Subtle accent tints: purple for Active Jobs, subtle red/amber for Expired Roles
 * - Crisp borders with shadow-soft for distinct card elevation over lavender canvas
 */
export function DashboardStats({ stats }) {
  const statItems = [
    {
      id: "candidates",
      label: "Candidates",
      value: stats.totalRegisteredCandidates,
      icon: Users,
      cardStyle: "bg-surface border-border hover:border-primary/30",
      valueStyle: "text-foreground",
    },
    {
      id: "active-jobs",
      label: "Active Jobs",
      value: stats.totalActiveJobs,
      icon: Briefcase,
      cardStyle: "bg-primary/[0.025] border-primary/20 hover:border-primary/40",
      valueStyle: "text-primary",
    },
    {
      id: "applications",
      label: "Total Applications",
      value: stats.totalApplications,
      icon: FileCheck2,
      cardStyle: "bg-surface border-border hover:border-primary/30",
      valueStyle: "text-foreground",
    },
    {
      id: "expired-jobs",
      label: "Expired Roles",
      value: stats.totalExpiredJobs,
      icon: AlertCircle,
      cardStyle:
        stats.totalExpiredJobs > 0
          ? "bg-error/[0.025] border-error/25 hover:border-error/40"
          : "bg-surface border-border hover:border-primary/30",
      valueStyle: stats.totalExpiredJobs > 0 ? "text-error" : "text-foreground",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {statItems.map((item) => (
        <div
          key={item.id}
          className={`flex flex-col justify-between rounded-xl border p-3.5 sm:p-4 shadow-soft transition-all duration-150 ${item.cardStyle}`}
        >
          <span className="text-[11px] font-semibold uppercase tracking-wider text-foreground-muted">
            {item.label}
          </span>

          <div className="mt-2 flex items-baseline justify-between">
            <span
              className={`text-2xl font-extrabold tracking-tight sm:text-3xl tabular-nums ${item.valueStyle}`}
            >
              {item.value}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default DashboardStats;
