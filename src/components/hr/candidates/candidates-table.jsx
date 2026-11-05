"use client";

import React from "react";
import { Eye } from "@/lib/icons";
import { Button } from "@/components/ui/button";
import { CandidateStatusBadge } from "@/components/hr/shared/hr-badge";

export function CandidatesTable({ candidates = [], onSelectCandidate }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-soft">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-border bg-surface-subtle text-foreground-secondary uppercase tracking-wider text-[11px]">
              <th className="px-5 py-3.5 font-semibold">Candidate</th>
              <th className="px-4 py-3.5 font-semibold">Contact Info</th>
              <th className="px-4 py-3.5 font-semibold">Applied Position</th>
              <th className="px-4 py-3.5 font-semibold">Applied Date</th>
              <th className="px-4 py-3.5 font-semibold">Status</th>
              <th className="px-5 py-3.5 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {candidates.length > 0 ? (
              candidates.map((cand) => (
                <tr
                  key={cand.id}
                  className="hover:bg-surface-subtle transition-colors"
                >
                  {/* Name & Avatar */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-muted text-primary font-bold text-xs shrink-0">
                        {cand.fullName ? cand.fullName.charAt(0) : "C"}
                      </div>
                      <div>
                        <div className="font-bold text-foreground text-sm">
                          {cand.fullName}
                        </div>
                        <div className="text-[11px] text-foreground-muted">
                          {cand.location || "India"}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Contact Info */}
                  <td className="px-4 py-3.5 text-foreground-secondary">
                    <div className="font-medium text-foreground">{cand.email}</div>
                    <div className="text-[11px] text-foreground-muted">{cand.phone}</div>
                  </td>

                  {/* Applied Position */}
                  <td className="px-4 py-3.5">
                    <div className="font-semibold text-foreground">
                      {cand.appliedJobTitle}
                    </div>
                    {cand.experience && (
                      <div className="text-[11px] text-foreground-muted">
                        Exp: {cand.experience}
                      </div>
                    )}
                  </td>

                  {/* Applied Date */}
                  <td className="px-4 py-3.5 text-foreground-secondary">
                    {cand.appliedDate}
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3.5">
                    <CandidateStatusBadge status={cand.status} />
                  </td>

                  {/* Action: Open Drawer */}
                  <td className="px-5 py-3.5 text-right">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => onSelectCandidate(cand)}
                      className="h-8 px-3 text-xs"
                      aria-label={`View full details for ${cand.fullName}`}
                    >
                      <Eye className="h-3.5 w-3.5 mr-1" aria-hidden="true" />
                      View Profile
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="p-8 text-center text-xs text-foreground-muted">
                  No candidates found matching the selected filters.
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

