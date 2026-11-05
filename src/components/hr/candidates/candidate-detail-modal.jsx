"use client";

import { REGEX } from "@/constants/service-constants";

import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, Mail, Phone, MapPin, Calendar, FileText, Send, User } from "@/lib/icons";
import { Button } from "@/components/ui/button";
import { CandidateStatusBadge } from "@/components/hr/shared/hr-badge";
import { CANDIDATE_STATUSES } from "@/data/hr-mock-data";

export function CandidateDetailModal({
  candidate,
  isOpen,
  onClose,
  onUpdateStatus,
  onAddNote,
}) {
  const [newNote, setNewNote] = useState("");

  if (!candidate) return null;

  const handleAddNoteSubmit = (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    onAddNote(candidate.id, newNote);
    setNewNote("");
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-foreground/40 transition-opacity duration-150 ease-out starting:opacity-0" />

        <Dialog.Content className="fixed right-0 top-0 z-50 h-full w-full max-w-lg overflow-y-auto border-l border-border bg-surface p-6 shadow-card transition duration-200 ease-out starting:translate-x-full focus-visible:outline-none sm:p-7">
          {/* Header */}
          <div className="flex items-start justify-between border-b border-border pb-5">
            <div className="flex items-center gap-3.5">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-muted text-primary font-bold text-lg">
                {candidate.fullName ? candidate.fullName.charAt(0) : "C"}
              </div>
              <div>
                <Dialog.Title className="text-lg font-bold tracking-tight text-foreground">
                  {candidate.fullName}
                </Dialog.Title>
                <p className="text-xs text-foreground-secondary">
                  Applied for <span className="font-medium text-foreground">{candidate.appliedJobTitle}</span>
                </p>
              </div>
            </div>

            <Dialog.Close asChild>
              <button
                type="button"
                aria-label="Close candidate view"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-foreground-secondary transition-colors hover:bg-surface-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </Dialog.Close>
          </div>

          <div className="mt-5 space-y-6">
            {/* Status & Quick Action */}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-surface-subtle p-3.5">
              <div>
                <span className="block text-[11px] font-medium uppercase tracking-wider text-foreground-muted">
                  Current Application Status
                </span>
                <div className="mt-1">
                  <CandidateStatusBadge status={candidate.status} />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <label htmlFor="cand-status" className="sr-only">
                  Update Candidate Status
                </label>
                <select
                  id="cand-status"
                  value={candidate.status}
                  onChange={(e) => onUpdateStatus(candidate.id, e.target.value)}
                  className="rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs font-semibold text-foreground focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
                >
                  {CANDIDATE_STATUSES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Contact Details */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground-secondary">
                Contact & Profile Information
              </h3>
              <div className="grid gap-2.5 text-xs">
                <div className="flex items-center gap-2.5 text-foreground-secondary">
                  <Mail className="h-4 w-4 text-primary" aria-hidden="true" />
                  <a
                    href={`mailto:${candidate.email}`}
                    className="hover:text-primary transition-colors hover:underline"
                  >
                    {candidate.email}
                  </a>
                </div>

                <div className="flex items-center gap-2.5 text-foreground-secondary">
                  <Phone className="h-4 w-4 text-primary" aria-hidden="true" />
                  <a
                    href={`tel:${candidate.phone}`}
                    className="hover:text-primary transition-colors hover:underline"
                  >
                    {candidate.phone}
                  </a>
                </div>

                {candidate.location && (
                  <div className="flex items-center gap-2.5 text-foreground-secondary">
                    <MapPin className="h-4 w-4 text-primary" aria-hidden="true" />
                    <span>{candidate.location}</span>
                  </div>
                )}

                <div className="flex items-center gap-2.5 text-foreground-secondary">
                  <Calendar className="h-4 w-4 text-primary" aria-hidden="true" />
                  <span>
                    Applied: <strong className="text-foreground">{candidate.appliedDate}</strong> (Registered: {candidate.registeredDate})
                  </span>
                </div>

                {candidate.experience && (
                  <div className="flex items-center gap-2.5 text-foreground-secondary">
                    <User className="h-4 w-4 text-primary" aria-hidden="true" />
                    <span>
                      Experience: <strong className="text-foreground">{candidate.experience}</strong> · Current: {candidate.currentCompany || "N/A"}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Resume Placeholder */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground-secondary">
                Application Documents
              </h3>
              <div className="mt-2.5 flex items-center justify-between rounded-xl border border-border bg-surface p-3.5">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-muted text-primary">
                    <FileText className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">
                      {candidate.fullName.replace(REGEX.WHITESPACE, "_")}_Resume.pdf
                    </p>
                    <p className="text-[11px] text-foreground-muted">PDF Document · 245 KB</p>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => alert(`Simulating download for ${candidate.fullName}'s resume.`)}
                >
                  Download
                </Button>
              </div>
            </div>

            {/* Application Details */}
            <div className="space-y-2.5">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground-secondary">
                Job Application Summary
              </h3>
              <div className="rounded-xl border border-border bg-surface p-3.5 text-xs text-foreground-secondary">
                <p>
                  Position Applied: <span className="font-semibold text-foreground">{candidate.appliedJobTitle}</span>
                </p>
                <p className="mt-1">
                  Submission Channel: <span className="text-foreground">Meelte Careers Portal (Web)</span>
                </p>
              </div>
            </div>

            {/* Internal Notes Feed */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground-secondary">
                HR Evaluation Notes & History
              </h3>

              {/* Add Note Form */}
              <form onSubmit={handleAddNoteSubmit} className="space-y-2">
                <div className="relative">
                  <textarea
                    rows={2}
                    placeholder="Add an internal evaluation note (e.g. interview feedback, screening comments)..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-xs text-foreground placeholder:text-foreground-muted focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
                  />
                </div>
                <div className="flex justify-end">
                  <Button type="submit" variant="secondary" size="sm" disabled={!newNote.trim()}>
                    <Send className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
                    Save Note
                  </Button>
                </div>
              </form>

              {/* Notes List */}
              <div className="space-y-2 pt-1">
                {candidate.notes && candidate.notes.length > 0 ? (
                  candidate.notes.map((note) => (
                    <div
                      key={note.id}
                      className="rounded-xl border border-border bg-surface-subtle p-3 text-xs"
                    >
                      <div className="flex items-center justify-between text-[11px] text-foreground-muted">
                        <span className="font-medium text-foreground">{note.author}</span>
                        <span>{note.date}</span>
                      </div>
                      <p className="mt-1.5 text-foreground-secondary leading-relaxed">
                        {note.text}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="rounded-xl border border-dashed border-border p-4 text-center text-xs text-foreground-muted">
                    No notes recorded yet for this candidate.
                  </p>
                )}
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default CandidateDetailModal;

