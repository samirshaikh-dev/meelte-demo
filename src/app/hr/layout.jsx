"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Menu } from "@/lib/icons";
import {
  HrProvider,
  useHr,
  HrSidebar,
  DeleteJobDialog,
  CandidateDetailModal,
} from "@/components/hr";

function HrLayoutContent({ children }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/hr/login" || pathname === "/hr/login/";

  const {
    jobs,
    deletingJobId,
    setDeletingJobId,
    deleteJob,
    selectedCandidate,
    closeCandidateModal,
    updateCandidateStatus,
    addCandidateNote,
    isSidebarOpen,
    closeSidebar,
    toggleSidebar,
  } = useHr();

  // If on login page, render clean standalone layout without dashboard chrome
  if (isLoginPage) {
    return (
      <div className="min-h-screen bg-canvas text-foreground">
        {children}
      </div>
    );
  }

  const deletingJob = jobs.find((j) => j.id === deletingJobId);

  return (
    <div className="flex h-screen overflow-hidden bg-canvas text-foreground">
      {/* Sidebar Navigation */}
      <HrSidebar
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0 h-screen overflow-y-auto">
        {/* Mobile menu trigger bar (only on screens < lg) */}
        <div className="sticky top-0 z-30 flex h-12 items-center justify-between border-b border-border bg-surface/90 px-4 backdrop-blur-md lg:hidden shrink-0">
          <button
            type="button"
            onClick={toggleSidebar}
            aria-label="Open sidebar menu"
            className="flex h-9 w-9 items-center justify-center rounded-xl text-foreground-secondary hover:bg-surface-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </button>
          <span className="text-xs font-bold tracking-tight text-foreground uppercase">
            HR Portal
          </span>
          <div className="w-9" aria-hidden="true" />
        </div>

        {children}
      </div>

      {/* Global Modals for HR operations */}
      <DeleteJobDialog
        isOpen={Boolean(deletingJobId)}
        onClose={() => setDeletingJobId(null)}
        onConfirm={() => deleteJob(deletingJobId)}
        jobTitle={deletingJob?.title}
      />

      <CandidateDetailModal
        isOpen={Boolean(selectedCandidate)}
        candidate={selectedCandidate}
        onClose={closeCandidateModal}
        onUpdateStatus={updateCandidateStatus}
        onAddNote={addCandidateNote}
      />
    </div>
  );
}

export default function HrLayout({ children }) {
  return (
    <HrProvider>
      <HrLayoutContent>{children}</HrLayoutContent>
    </HrProvider>
  );
}
