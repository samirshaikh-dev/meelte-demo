"use client";

import React, { createContext, useContext, useState, useMemo } from "react";
import { INITIAL_JOBS, INITIAL_CANDIDATES } from "@/data/hr-mock-data";
import { notifySuccess, notifyInfo } from "@/lib/toast-feedback";

const HrContext = createContext(null);

export function HrProvider({ children }) {
  const [jobs, setJobs] = useState(INITIAL_JOBS);
  const [candidates, setCandidates] = useState(INITIAL_CANDIDATES);

  // Sidebar State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const closeSidebar = () => setIsSidebarOpen(false);

  // Candidate Details Modal State
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  // Delete Confirmation Dialog State
  const [deletingJobId, setDeletingJobId] = useState(null);

  // Dashboard Stats
  const stats = useMemo(() => {
    const totalRegisteredCandidates = candidates.length;
    const totalActiveJobs = jobs.filter((j) => j.status === "Active").length;
    const totalExpiredJobs = jobs.filter((j) => j.status === "Expired").length;
    const totalApplications = jobs.reduce((acc, j) => acc + (j.applicantCount || 0), 0);

    return {
      totalRegisteredCandidates,
      totalActiveJobs,
      totalExpiredJobs,
      totalApplications,
    };
  }, [jobs, candidates]);

  // Actions: Jobs
  const getJobById = (id) => {
    return jobs.find((j) => j.id === id) || null;
  };

  const createJob = (jobData) => {
    const newId = `job-${Date.now()}`;
    const today = new Date().toISOString().split("T")[0];

    const newJob = {
      ...jobData,
      id: newId,
      applicantCount: 0,
      createdAt: today,
      updatedAt: today,
    };

    setJobs((prev) => [newJob, ...prev]);
    return newJob;
  };

  const updateJob = (id, updatedFields) => {
    const today = new Date().toISOString().split("T")[0];

    setJobs((prev) =>
      prev.map((job) =>
        job.id === id
          ? { ...job, ...updatedFields, updatedAt: today }
          : job
      )
    );
    return { id, ...updatedFields };
  };

  const deleteJob = (id) => {
    const targetJob = jobs.find((j) => j.id === id);
    setJobs((prev) => prev.filter((j) => j.id !== id));
    setDeletingJobId(null);
    notifyInfo(`Job "${targetJob?.title || id}" deleted.`);
  };

  const updateJobStatus = (id, newStatus) => {
    setJobs((prev) =>
      prev.map((job) =>
        job.id === id ? { ...job, status: newStatus, updatedAt: "2026-11-04" } : job
      )
    );
    notifySuccess(`Status updated to "${newStatus}".`);
  };

  // Actions: Candidates
  const openCandidateModal = (candidate) => {
    setSelectedCandidate(candidate);
  };

  const closeCandidateModal = () => {
    setSelectedCandidate(null);
  };

  const updateCandidateStatus = (candidateId, newStatus) => {
    setCandidates((prev) =>
      prev.map((c) => (c.id === candidateId ? { ...c, status: newStatus } : c))
    );

    if (selectedCandidate && selectedCandidate.id === candidateId) {
      setSelectedCandidate((prev) => ({ ...prev, status: newStatus }));
    }

    notifySuccess(`Candidate status updated to "${newStatus}".`);
  };

  const addCandidateNote = (candidateId, noteText) => {
    if (!noteText.trim()) return;

    const newNote = {
      id: `note-${Date.now()}`,
      author: "HR Operations",
      date: "2026-11-04",
      text: noteText.trim(),
    };

    setCandidates((prev) =>
      prev.map((c) =>
        c.id === candidateId ? { ...c, notes: [newNote, ...(c.notes || [])] } : c
      )
    );

    if (selectedCandidate && selectedCandidate.id === candidateId) {
      setSelectedCandidate((prev) => ({
        ...prev,
        notes: [newNote, ...(prev.notes || [])],
      }));
    }

    notifySuccess("Note added to candidate profile.");
  };

  const value = {
    jobs,
    candidates,
    stats,
    isSidebarOpen,
    setIsSidebarOpen,
    toggleSidebar,
    closeSidebar,
    selectedCandidate,
    deletingJobId,
    setDeletingJobId,
    getJobById,
    createJob,
    updateJob,
    deleteJob,
    updateJobStatus,
    openCandidateModal,
    closeCandidateModal,
    updateCandidateStatus,
    addCandidateNote,
  };

  return <HrContext.Provider value={value}>{children}</HrContext.Provider>;
}

export function useHr() {
  const context = useContext(HrContext);
  if (!context) {
    throw new Error("useHr must be used within an HrProvider");
  }
  return context;
}

export default HrContext;
