"use client";

import React, { createContext, useContext, useState, useMemo, useEffect, useCallback } from "react";
import {
  fetchHrJobs,
  createHrJob,
  updateHrJob,
  deleteHrJob,
} from "@/services/hr/jobs";
import {
  fetchHrCandidates,
  updateCandidateStage,
  addCandidateNote as addCandidateNoteService,
  uploadCandidateResume,
} from "@/services/hr/candidates";
import { notifySuccess, notifyInfo, notifyError } from "@/lib/toast-feedback";

const HrContext = createContext(null);

export function HrProvider({ children }) {
  const [jobs, setJobs] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sidebar State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const closeSidebar = () => setIsSidebarOpen(false);

  // Candidate Details Modal State
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  // Delete Confirmation Dialog State
  const [deletingJobId, setDeletingJobId] = useState(null);

  // Reusable manual retry handler for user events (buttons, retry triggers)
  const refetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/hr/dashboard", {
        headers: { Accept: "application/json" },
        cache: "no-store",
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          setJobs(result.data.jobs || []);
          setCandidates(result.data.candidates || []);
          setError(null);
          return;
        }
      }

      const [directJobs, directCandidates] = await Promise.all([
        fetchHrJobs(),
        fetchHrCandidates(),
      ]);

      setJobs(directJobs || []);
      setCandidates(directCandidates || []);
      setError(null);
    } catch (err) {
      console.error("[HR Dashboard Error]: Failed to fetch live data from database:", err);
      setError("Unable to connect to the database. Please check your network or try again in a moment.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load on mount via subscription/promise callback (satisfies React Compiler)
  useEffect(() => {
    let ignore = false;

    fetch("/api/hr/dashboard", {
      headers: { Accept: "application/json" },
      cache: "no-store",
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((result) => {
        if (!ignore) {
          if (result?.success && result?.data) {
            setJobs(result.data.jobs || []);
            setCandidates(result.data.candidates || []);
            setError(null);
            setIsLoading(false);
          } else {
            // Direct client SDK fallback
            Promise.all([fetchHrJobs(), fetchHrCandidates()])
              .then(([directJobs, directCandidates]) => {
                if (!ignore) {
                  setJobs(directJobs || []);
                  setCandidates(directCandidates || []);
                  setError(null);
                }
              })
              .catch((directErr) => {
                if (!ignore) {
                  console.error("[HR Dashboard Error]:", directErr);
                  setError("Unable to connect to the database. Please check your network or try again in a moment.");
                }
              })
              .finally(() => {
                if (!ignore) {
                  setIsLoading(false);
                }
              });
          }
        }
      })
      .catch((err) => {
        if (!ignore) {
          console.error("[HR Dashboard Error]:", err);
          setError("Unable to connect to the database. Please check your network or try again in a moment.");
          setIsLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

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

  const createJob = async (jobData) => {
    const newId = jobData.id || `job-${Date.now()}`;
    const today = new Date().toISOString().split("T")[0];

    const newJob = {
      ...jobData,
      id: newId,
      applicantCount: 0,
      createdAt: today,
      updatedAt: today,
    };

    // Optimistic UI update
    setJobs((prev) => [newJob, ...prev]);

    // Backend API persistence with client SDK fallback
    try {
      const res = await fetch("/api/hr/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newJob),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setJobs((prev) =>
            prev.map((j) => (j.id === newId ? json.data : j))
          );
          return json.data;
        }
      }
    } catch {
      // Fallback to client SDK
    }

    try {
      await createHrJob(newJob);
    } catch (err) {
      if (process.env.NODE_ENV !== "production") {
        console.warn("[HrProvider] Cloud job creation fallback:", err.message);
      }
    }

    return newJob;
  };

  const updateJob = async (id, updatedFields) => {
    const today = new Date().toISOString().split("T")[0];

    // Optimistic UI update
    setJobs((prev) =>
      prev.map((job) =>
        job.id === id
          ? { ...job, ...updatedFields, updatedAt: today }
          : job
      )
    );

    // Backend API persistence with client SDK fallback
    try {
      const res = await fetch(`/api/hr/jobs/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedFields),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          return json.data;
        }
      }
    } catch {
      // Fallback to client SDK
    }

    try {
      await updateHrJob(id, updatedFields);
    } catch (err) {
      if (process.env.NODE_ENV !== "production") {
        console.warn("[HrProvider] Cloud job update fallback:", err.message);
      }
    }

    return { id, ...updatedFields };
  };

  const deleteJob = async (id) => {
    const targetJob = jobs.find((j) => j.id === id);

    // Optimistic UI update
    setJobs((prev) => prev.filter((j) => j.id !== id));
    setDeletingJobId(null);
    notifyInfo(`Job "${targetJob?.title || id}" deleted.`);

    // Backend API persistence with client SDK fallback
    try {
      const res = await fetch(`/api/hr/jobs/${id}`, {
        method: "DELETE",
      });
      if (res.ok) return;
    } catch {
      // Fallback to client SDK
    }

    try {
      await deleteHrJob(id);
    } catch (err) {
      if (process.env.NODE_ENV !== "production") {
        console.warn("[HrProvider] Cloud job deletion fallback:", err.message);
      }
    }
  };

  const updateJobStatus = async (id, newStatus) => {
    const today = new Date().toISOString().split("T")[0];

    // Optimistic UI update
    setJobs((prev) =>
      prev.map((job) =>
        job.id === id ? { ...job, status: newStatus, updatedAt: today } : job
      )
    );
    notifySuccess(`Status updated to "${newStatus}".`);

    // Backend API persistence with client SDK fallback
    try {
      const res = await fetch(`/api/hr/jobs/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) return;
    } catch {
      // Fallback to client SDK
    }

    try {
      await updateHrJob(id, { status: newStatus });
    } catch (err) {
      if (process.env.NODE_ENV !== "production") {
        console.warn("[HrProvider] Cloud job status update fallback:", err.message);
      }
    }
  };

  // Actions: Candidates
  const openCandidateModal = (candidate) => {
    setSelectedCandidate(candidate);
  };

  const closeCandidateModal = () => {
    setSelectedCandidate(null);
  };

  const updateCandidateStatus = async (candidateId, newStatus) => {
    // Optimistic UI update
    setCandidates((prev) =>
      prev.map((c) => (c.id === candidateId ? { ...c, status: newStatus } : c))
    );

    if (selectedCandidate && selectedCandidate.id === candidateId) {
      setSelectedCandidate((prev) => ({ ...prev, status: newStatus }));
    }

    notifySuccess(`Candidate status updated to "${newStatus}".`);

    // Async cloud update
    try {
      await updateCandidateStage(candidateId, newStatus);
    } catch (err) {
      if (process.env.NODE_ENV !== "production") {
        console.warn("[HrProvider] Cloud candidate stage update fallback:", err.message);
      }
    }
  };

  const addCandidateNote = async (candidateId, noteText) => {
    if (!noteText.trim()) return;

    const today = new Date().toISOString().split("T")[0];
    const newNote = {
      id: `note-${Date.now()}`,
      author: "HR Operations",
      date: today,
      text: noteText.trim(),
    };

    // Optimistic UI update
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

    // Async cloud update
    try {
      await addCandidateNoteService(candidateId, noteText);
    } catch (err) {
      if (process.env.NODE_ENV !== "production") {
        console.warn("[HrProvider] Cloud candidate note fallback:", err.message);
      }
    }
  };

  const uploadResume = async (candidateId, file) => {
    try {
      const { downloadUrl, storagePath, fileName } = await uploadCandidateResume(candidateId, file);

      setCandidates((prev) =>
        prev.map((c) =>
          c.id === candidateId
            ? { ...c, resumeUrl: downloadUrl, resumeStoragePath: storagePath, resumeFileName: fileName }
            : c
        )
      );

      if (selectedCandidate && selectedCandidate.id === candidateId) {
        setSelectedCandidate((prev) => ({
          ...prev,
          resumeUrl: downloadUrl,
          resumeStoragePath: storagePath,
          resumeFileName: fileName,
        }));
      }

      notifySuccess("Resume uploaded successfully.");
      return downloadUrl;
    } catch (err) {
      notifyError(err.message || "Failed to upload resume.");
      throw err;
    }
  };

  const value = {
    jobs,
    candidates,
    stats,
    isLoading,
    error,
    refetchData,
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
    uploadResume,
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
