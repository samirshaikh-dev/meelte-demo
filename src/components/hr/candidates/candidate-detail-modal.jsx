"use client";

import React, { useState, useRef } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { FileText, X } from "@/lib/icons";
import { Button } from "@/components/ui/button";
import { CandidateStatusBadge } from "@/components/hr/shared/hr-badge";
import { useHr } from "@/components/hr/shared/hr-context";
import { CANDIDATE_STATUSES } from "@/constants/hr-constants";
import { notifyInfo } from "@/lib/toast-feedback";
import { REGEX } from "@/constants/service-constants";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/**
 * Dates arrive as `YYYY-MM-DD`. Formatting them by hand keeps the label
 * identical on the server and the client and avoids the timezone shift of
 * `new Date("2026-11-03")`, which reads as UTC midnight and can render as the
 * previous day. The year is kept here (unlike the dashboard row) because a
 * candidate record outlives the current recruiting cycle.
 */
function formatIsoDate(value) {
  if (typeof value !== "string") return "";
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  if (!match) return "";
  const month = MONTHS[Number(match[2]) - 1];
  if (!month) return "";
  return `${Number(match[3])} ${month} ${match[1]}`;
}

/**
 * Candidate profile drawer.
 *
 * Ordered by the decision the recruiter is making: who is this and what did they
 * apply for (header, which also labels the dialog), what is their status and how
 * do I move it (first block, the only mutating action), how do I reach them, and
 * what is on their application.
 *
 * AVOID.md §2: the drawer is already a container, so the old nested
 * `rounded-xl border` cards (status strip, document card, summary card) are gone.
 * Sections are separated by hairlines inside one scrolling body; the header stays
 * fixed so the name and the close control never scroll away. Every label is 12px
 * or larger on `foreground-secondary` or stronger.
 *
 * There is deliberately no notes panel: evaluation notes are not part of this
 * view. `addCandidateNote` still exists in `HrProvider`, so restoring a notes
 * surface means re-adding a prop here, not rebuilding the data path.
 */
export function CandidateDetailModal({
  candidate,
  isOpen,
  onClose,
  onUpdateStatus,
}) {
  const { uploadResume } = useHr();
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  if (!candidate) return null;

  const displayName = candidate.fullName || "Candidate";

  const resumeFileName = candidate.resumeFileName || `${displayName.replace(
    REGEX.WHITESPACE,
    "_"
  )}_Resume.pdf`;

  const handleDownloadResume = () => {
    if (candidate.resumeUrl && candidate.resumeUrl !== "#") {
      window.open(candidate.resumeUrl, "_blank", "noopener,noreferrer");
      return;
    }
    notifyInfo(`${resumeFileName} is not downloadable in this preview yet.`);
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      await uploadResume(candidate.id, file);
    } catch {
      // Notification is already dispatched by uploadResume
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-foreground/40 transition-opacity duration-150 ease-out starting:opacity-0" />

        <Dialog.Content className="fixed inset-y-0 right-0 z-50 flex h-full w-full max-w-lg flex-col overflow-hidden border-l border-border bg-surface transition-transform duration-200 ease-out starting:translate-x-full focus-visible:outline-none">
          {/* Identity — stays put while the body scrolls */}
          <div className="flex items-start gap-3 border-b border-border/60 px-5 py-4 sm:px-6">
            <span
              aria-hidden="true"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-muted text-sm font-semibold text-primary"
            >
              {displayName.charAt(0)}
            </span>

            <div className="min-w-0 flex-1">
              <Dialog.Title className="text-base font-semibold tracking-tight text-foreground">
                {displayName}
              </Dialog.Title>
              <Dialog.Description className="mt-0.5 text-sm leading-snug text-foreground-secondary">
                {candidate.appliedJobTitle
                  ? `Applied for ${candidate.appliedJobTitle}`
                  : "Applied position not recorded"}
              </Dialog.Description>
            </div>

            <Dialog.Close asChild>
              <button
                type="button"
                aria-label={`Close ${displayName}'s profile`}
                className="-mr-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-foreground-secondary transition-colors hover:bg-surface-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </Dialog.Close>
          </div>

          <div className="min-h-0 flex-1 divide-y divide-border/60 overflow-y-auto overscroll-contain px-5 sm:px-6">
            {/* Status — the one action that moves a candidate forward */}
            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 py-4">
              <CandidateStatusBadge status={candidate.status} />

              <div className="flex items-center gap-2">
                <label
                  htmlFor="candidate-status"
                  className="text-xs font-medium text-foreground-secondary"
                >
                  Change status
                </label>
                <select
                  id="candidate-status"
                  value={candidate.status}
                  onChange={(event) =>
                    onUpdateStatus(candidate.id, event.target.value)
                  }
                  className="h-9 rounded-lg border border-border bg-surface px-2 text-xs font-medium text-foreground transition-colors focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
                >
                  {CANDIDATE_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* How to reach them */}
            <div className="py-4">
              <h3 className="text-sm font-semibold tracking-tight text-foreground">
                Contact
              </h3>

              <dl className="mt-2 grid grid-cols-[auto_minmax(0,1fr)] items-baseline gap-x-4 gap-y-2 text-sm">
                <dt className="text-foreground-secondary">Email</dt>
                <dd className="min-w-0 break-words">
                  {candidate.email ? (
                    <a
                      href={`mailto:${candidate.email}`}
                      className="rounded text-primary transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
                    >
                      {candidate.email}
                    </a>
                  ) : (
                    <span className="text-foreground">Not recorded</span>
                  )}
                </dd>

                <dt className="text-foreground-secondary">Phone</dt>
                <dd className="min-w-0 break-words">
                  {candidate.phone ? (
                    <a
                      href={`tel:${candidate.phone.replace(REGEX.WHITESPACE, "")}`}
                      className="rounded text-primary transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
                    >
                      {candidate.phone}
                    </a>
                  ) : (
                    <span className="text-foreground">Not recorded</span>
                  )}
                </dd>

                {candidate.location && (
                  <>
                    <dt className="text-foreground-secondary">Based in</dt>
                    <dd className="min-w-0 text-foreground">
                      {candidate.location}
                    </dd>
                  </>
                )}
              </dl>
            </div>

            {/* What we know about the application */}
            <div className="py-4">
              <h3 className="text-sm font-semibold tracking-tight text-foreground">
                Application
              </h3>

              <dl className="mt-2 grid grid-cols-[auto_minmax(0,1fr)] items-baseline gap-x-4 gap-y-2 text-sm">
                <dt className="text-foreground-secondary">Experience</dt>
                <dd className="min-w-0 text-foreground">
                  {candidate.experience || "Not recorded"}
                </dd>

                <dt className="text-foreground-secondary">Current company</dt>
                <dd className="min-w-0 text-foreground">
                  {candidate.currentCompany || "Not recorded"}
                </dd>

                <dt className="text-foreground-secondary">Applied on</dt>
                <dd className="min-w-0 text-foreground">
                  <time dateTime={candidate.appliedDate || undefined}>
                    {formatIsoDate(candidate.appliedDate) || "Not recorded"}
                  </time>
                </dd>
              </dl>

              <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                <span className="flex min-w-0 items-center gap-2">
                  <FileText
                    className="h-4 w-4 shrink-0 text-foreground-secondary"
                    aria-hidden="true"
                  />
                  <span className="truncate text-sm text-foreground">
                    {resumeFileName}
                  </span>
                </span>

                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    className="hidden"
                    id="upload-candidate-resume"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={isUploading}
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs"
                  >
                    {isUploading ? "Uploading..." : "Upload New"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleDownloadResume}
                    className="shrink-0"
                  >
                    {candidate.resumeUrl && candidate.resumeUrl !== "#"
                      ? "View / Download"
                      : "Download"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default CandidateDetailModal;
