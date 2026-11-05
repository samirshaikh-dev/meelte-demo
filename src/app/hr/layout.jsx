"use client";

import React from "react";
import { usePathname } from "next/navigation";
import {
  HrProvider,
  useHr,
  HrSidebar,
  JobModal,
  DeleteJobDialog,
  CandidateDetailModal,
} from "@/components/hr";

function HrLayoutContent({ children }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/hr/login" || pathname === "/hr/login/";

  const {
    jobs,
    isJobModalOpen,
    editingJob,
    closeJobModal,
    createJob,
    updateJob,
    deletingJobId,
    setDeletingJobId,
    deleteJob,
    selectedCandidate,
    closeCandidateModal,
    updateCandidateStatus,
    addCandidateNote,
    isSidebarOpen,
    closeSidebar,
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
        {children}
      </div>

      {/* Global Modals for HR operations */}
      <JobModal
        isOpen={isJobModalOpen}
        onClose={closeJobModal}
        onSave={(data) => {
          if (editingJob) {
            updateJob(editingJob.id, data);
          } else {
            createJob(data);
          }
        }}
        job={editingJob}
      />

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
