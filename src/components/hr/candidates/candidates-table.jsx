"use client";

import React from "react";
import { Eye } from "@/lib/icons";
import { Button } from "@/components/ui/button";
import { CandidateStatusBadge } from "@/components/hr/shared/hr-badge";

export function CandidatesTable({ candidates = [], onSelectCandidate }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-soft">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-border/80 bg-surface-subtle/80 text-foreground-muted uppercase tracking-wider text-[11px]">
              <th className="w-[28%] px-5 py-3 font-semibold">Candidate</th>
              <th className="w-[24%] px-4 py-3 font-semibold">Contact Info</th>
              <th className="w-[20%] px-4 py-3 font-semibold">Applied Position</th>
              <th className="w-[12%] px-4 py-3 font-semibold">Applied Date</th>
              <th className="w-[10%] px-4 py-3 font-semibold">Status</th>
              <th className="w-[6%] px-5 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {candidates.length > 0 ? (
              candidates.map((cand) => (
                <tr
                  key={cand.id}
                  className="h-16 hover:bg-surface-subtle/60 transition-colors"
                >
                  {/* Name & Avatar */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-muted text-primary font-bold text-xs shrink-0">
                        {cand.fullName ? cand.fullName.charAt(0) : "C"}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-foreground text-sm truncate">
                          {cand.fullName}
                        </div>
                        <div className="text-[11px] text-foreground-muted truncate">
                          {cand.location || "India"}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Contact Info */}
                  <td className="px-4 py-3.5 text-foreground-secondary">
                    <div className="font-medium text-foreground truncate">{cand.email}</div>
                    <div className="text-[11px] text-foreground-muted truncate">{cand.phone}</div>
                  </td>

                  {/* Applied Position */}
                  <td className="px-4 py-3.5">
                    <div className="font-semibold text-foreground truncate">
                      {cand.appliedJobTitle}
                    </div>
                    {cand.experience && (
                      <div className="text-[11px] text-foreground-muted">
                        Exp: {cand.experience}
                      </div>
                    )}
                  </td>

                  {/* Applied Date */}
                  <td className="px-4 py-3.5 text-foreground-secondary tabular-nums">
                    {cand.appliedDate}
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3.5">
                    <CandidateStatusBadge status={cand.status} />
                  </td>

                  {/* Action: Open Drawer */}
                  <td className="px-5 py-3.5 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onSelectCandidate(cand)}
                      className="h-8 px-2.5 text-xs font-medium text-foreground-secondary hover:text-foreground"
                      aria-label={`View full details for ${cand.fullName}`}
                    >
                      <Eye className="h-3.5 w-3.5 mr-1 text-foreground-muted" aria-hidden="true" />
                      View
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="py-14 sm:py-16 px-4 text-center">
                  <p className="text-xs text-foreground-muted">
                    No candidates found matching the selected filters.
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

export default CandidatesTable;
