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
import {
  fetchHrBlogPosts,
  createHrBlogPost,
  updateHrBlogPost,
  deleteHrBlogPost,
} from "@/services/hr/blog";
import { fetchWithAuth } from "@/lib/hr-api-client";
import { notifySuccess, notifyInfo, notifyError } from "@/lib/toast-feedback";

const HrContext = createContext(null);

export function HrProvider({ children }) {
  const [jobs, setJobs] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]);
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
  const [deletingBlogPostId, setDeletingBlogPostId] = useState(null);

  // Reusable manual retry handler for user events (buttons, retry triggers)
  const refetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetchWithAuth("/api/hr/dashboard", {
        headers: { Accept: "application/json" },
        cache: "no-store",
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          setJobs(result.data.jobs || []);
          setCandidates(result.data.candidates || []);
          setBlogPosts(result.data.blogPosts || []);
          setError(null);
          return;
        }
      }

      const [directJobs, directCandidates, directBlogPosts] = await Promise.all([
        fetchHrJobs(),
        fetchHrCandidates(),
        fetchHrBlogPosts(),
      ]);

      setJobs(directJobs || []);
      setCandidates(directCandidates || []);
      setBlogPosts(directBlogPosts || []);
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

    fetchWithAuth("/api/hr/dashboard", {
      headers: { Accept: "application/json" },
      cache: "no-store",
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((result) => {
        if (!ignore) {
          if (result?.success && result?.data) {
            setJobs(result.data.jobs || []);
            setCandidates(result.data.candidates || []);
            setBlogPosts(result.data.blogPosts || []);
            setError(null);
            setIsLoading(false);
          } else {
            // Direct client SDK fallback
            Promise.all([
              fetchHrJobs(),
              fetchHrCandidates(),
              fetchHrBlogPosts(),
            ])
              .then(([directJobs, directCandidates, directBlogPosts]) => {
                if (!ignore) {
                  setJobs(directJobs || []);
                  setCandidates(directCandidates || []);
                  setBlogPosts(directBlogPosts || []);
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
      const res = await fetchWithAuth("/api/hr/jobs", {
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
      const res = await fetchWithAuth(`/api/hr/jobs/${id}`, {
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
      const res = await fetchWithAuth(`/api/hr/jobs/${id}`, {
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
      const res = await fetchWithAuth(`/api/hr/jobs/${id}`, {
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

  // Actions: Blog CMS
  const getBlogPostById = (id) => {
    return blogPosts.find((p) => p.id === id) || null;
  };

  /**
   * Shared API-first helper for blog writes.
   *
   * Mirrors the jobs actions (REST route first, client SDK fallback), with
   * one deliberate difference: a 4xx rejection from `/api/hr/blog` — a zod
   * validation failure at the write boundary — is surfaced to the caller and
   * never retried through the client SDK, because bypassing it could push a
   * half-empty story live on `/blog`. Only transport failures and 5xx fall
   * back to the SDK.
   *
   * @returns {{ data: Object|null, error: string|null }}
   */
  const requestBlogWrite = async (url, options) => {
    try {
      const res = await fetchWithAuth(url, options);
      const json = await res.json().catch(() => null);

      if (res.ok && json?.success && json.data) {
        return { data: json.data, error: null };
      }

      if (res.status >= 400 && res.status < 500) {
        return { data: null, error: json?.error || "The story could not be saved." };
      }

      // 5xx or malformed success payload — fall through to the SDK fallback.
      return { data: null, error: null, retryViaSdk: true };
    } catch {
      // Network failure — fall through to the SDK fallback.
      return { data: null, error: null, retryViaSdk: true };
    }
  };

  const createBlogPost = async (postData) => {
    const nowIso = new Date().toISOString();
    const newId = postData.id || `post-${Date.now()}`;

    const optimisticPost = {
      ...postData,
      id: newId,
      featured: Boolean(postData.featured),
      createdAt: nowIso,
      updatedAt: nowIso,
      publishedAt: postData.status === "published" ? nowIso : null,
    };

    // Optimistic UI update
    setBlogPosts((prev) => [optimisticPost, ...prev]);

    const result = await requestBlogWrite("/api/hr/blog", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(postData),
    });

    if (result.error) {
      // Validation failure — remove the optimistic entry and report it.
      setBlogPosts((prev) => prev.filter((p) => p.id !== newId));
      throw new Error(result.error);
    }

    if (result.data) {
      setBlogPosts((prev) =>
        prev.map((p) => (p.id === newId ? result.data : p))
      );
      return result.data;
    }

    // Client SDK fallback (transport failure / 5xx only)
    try {
      return await createHrBlogPost({ ...postData, id: newId });
    } catch (err) {
      setBlogPosts((prev) => prev.filter((p) => p.id !== newId));
      if (process.env.NODE_ENV !== "production") {
        console.warn("[HrProvider] Cloud blog post creation fallback:", err.message);
      }
      throw new Error("The story could not be saved. Please try again.");
    }
  };

  const updateBlogPost = async (id, updatedFields) => {
    const previousPost = blogPosts.find((p) => p.id === id);

    // Optimistic UI update
    setBlogPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updatedFields } : p))
    );

    const result = await requestBlogWrite(`/api/hr/blog/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedFields),
    });

    if (result.error) {
      // Validation failure — restore the previous state and report it.
      if (previousPost) {
        setBlogPosts((prev) =>
          prev.map((p) => (p.id === id ? previousPost : p))
        );
      }
      throw new Error(result.error);
    }

    if (result.data) {
      return result.data;
    }

    // Client SDK fallback (transport failure / 5xx only)
    try {
      return await updateHrBlogPost(id, updatedFields);
    } catch (err) {
      if (process.env.NODE_ENV !== "production") {
        console.warn("[HrProvider] Cloud blog post update fallback:", err.message);
      }
      throw new Error("The story could not be saved. Please try again.");
    }
  };

  const updateBlogPostStatus = async (id, newStatus) => {
    const previousPost = blogPosts.find((p) => p.id === id);

    // Optimistic UI update
    setBlogPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
    );

    const result = await requestBlogWrite(`/api/hr/blog/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });

    if (result.error) {
      // The API refused the transition (e.g. publishing an incomplete draft)
      // — restore the previous state and explain why.
      if (previousPost) {
        setBlogPosts((prev) =>
          prev.map((p) => (p.id === id ? previousPost : p))
        );
      }
      notifyError(result.error);
      return null;
    }

    if (result.data) {
      notifySuccess(`Story status updated to "${newStatus}".`);
      return result.data;
    }

    // Client SDK fallback (transport failure / 5xx only)
    try {
      await updateHrBlogPost(id, { status: newStatus });
      notifySuccess(`Story status updated to "${newStatus}".`);
      return { ...previousPost, status: newStatus };
    } catch (err) {
      if (previousPost) {
        setBlogPosts((prev) =>
          prev.map((p) => (p.id === id ? previousPost : p))
        );
      }
      if (process.env.NODE_ENV !== "production") {
        console.warn("[HrProvider] Cloud blog status update fallback:", err.message);
      }
      notifyError("Failed to update the story status.");
      return null;
    }
  };

  const deleteBlogPost = async (id) => {
    const targetPost = blogPosts.find((p) => p.id === id);

    // Optimistic UI update
    setBlogPosts((prev) => prev.filter((p) => p.id !== id));
    setDeletingBlogPostId(null);
    notifyInfo(`Story "${targetPost?.title || id}" deleted.`);

    // Backend API persistence with client SDK fallback
    try {
      const res = await fetchWithAuth(`/api/hr/blog/${id}`, {
        method: "DELETE",
      });
      if (res.ok) return;
    } catch {
      // Fallback to client SDK
    }

    try {
      await deleteHrBlogPost(id);
    } catch (err) {
      if (process.env.NODE_ENV !== "production") {
        console.warn("[HrProvider] Cloud blog deletion fallback:", err.message);
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
    blogPosts,
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
    deletingBlogPostId,
    setDeletingBlogPostId,
    getBlogPostById,
    createBlogPost,
    updateBlogPost,
    updateBlogPostStatus,
    deleteBlogPost,
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
