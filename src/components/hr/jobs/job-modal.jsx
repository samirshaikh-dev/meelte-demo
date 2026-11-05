"use client";

import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, Briefcase } from "@/lib/icons";
import { Button } from "@/components/ui/button";
import { DEPARTMENTS, EMPLOYMENT_TYPES, WORKPLACE_TYPES, JOB_STATUSES } from "@/data/hr-mock-data";

function JobForm({ job, onSave, onClose }) {
  const isEditing = Boolean(job);

  const [formData, setFormData] = useState(() => ({
    title: job?.title || "",
    department: job?.department || "Engineering",
    employmentType: job?.employmentType || "Full-time",
    workplaceType: job?.workplaceType || "Hybrid",
    location: job?.location || "Bengaluru, India",
    description: job?.description || "",
    responsibilities: job?.responsibilities || "",
    requirements: job?.requirements || "",
    salaryRange: job?.salaryRange || "",
    deadline: job?.deadline || "2026-12-31",
    status: job?.status || "Active",
  }));

  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Job title is required.";
    if (!formData.description.trim()) newErrors.description = "Job description is required.";
    if (!formData.location.trim()) newErrors.location = "Location is required.";
    if (!formData.deadline) newErrors.deadline = "Application deadline is required.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-5 space-y-4">
      {/* Title */}
      <div>
        <label htmlFor="job-title" className="block text-xs font-medium text-foreground">
          Job Title <span className="text-error">*</span>
        </label>
        <input
          id="job-title"
          type="text"
          placeholder="e.g. Senior Frontend Engineer"
          value={formData.title}
          onChange={(e) => handleChange("title", e.target.value)}
          className="mt-1.5 w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-foreground placeholder:text-foreground-muted focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
        />
        {errors.title && <p className="mt-1 text-xs text-error">{errors.title}</p>}
      </div>

      {/* Department & Employment Type */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="job-dept" className="block text-xs font-medium text-foreground">
            Department
          </label>
          <select
            id="job-dept"
            value={formData.department}
            onChange={(e) => handleChange("department", e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-foreground focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
          >
            {DEPARTMENTS.filter((d) => d !== "All Departments").map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="job-type" className="block text-xs font-medium text-foreground">
            Employment Type
          </label>
          <select
            id="job-type"
            value={formData.employmentType}
            onChange={(e) => handleChange("employmentType", e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-foreground focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
          >
            {EMPLOYMENT_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Workplace Type & Location */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="workplace-type" className="block text-xs font-medium text-foreground">
            Workplace Type
          </label>
          <select
            id="workplace-type"
            value={formData.workplaceType}
            onChange={(e) => handleChange("workplaceType", e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-foreground focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
          >
            {WORKPLACE_TYPES.map((wpt) => (
              <option key={wpt} value={wpt}>
                {wpt}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="job-location" className="block text-xs font-medium text-foreground">
            Location <span className="text-error">*</span>
          </label>
          <input
            id="job-location"
            type="text"
            placeholder="e.g. Bengaluru, India or Remote"
            value={formData.location}
            onChange={(e) => handleChange("location", e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-foreground placeholder:text-foreground-muted focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
          />
          {errors.location && <p className="mt-1 text-xs text-error">{errors.location}</p>}
        </div>
      </div>

      {/* Salary Range & Deadline & Status */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor="salary-range" className="block text-xs font-medium text-foreground">
            Salary Range (Optional)
          </label>
          <input
            id="salary-range"
            type="text"
            placeholder="e.g. ₹8L - ₹12L / yr"
            value={formData.salaryRange}
            onChange={(e) => handleChange("salaryRange", e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-foreground placeholder:text-foreground-muted focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
          />
        </div>

        <div>
          <label htmlFor="job-deadline" className="block text-xs font-medium text-foreground">
            Deadline <span className="text-error">*</span>
          </label>
          <input
            id="job-deadline"
            type="date"
            value={formData.deadline}
            onChange={(e) => handleChange("deadline", e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-foreground focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
          />
          {errors.deadline && <p className="mt-1 text-xs text-error">{errors.deadline}</p>}
        </div>

        <div>
          <label htmlFor="job-status" className="block text-xs font-medium text-foreground">
            Initial Status
          </label>
          <select
            id="job-status"
            value={formData.status}
            onChange={(e) => handleChange("status", e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-foreground focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
          >
            {JOB_STATUSES.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Description */}
      <div>
        <label htmlFor="job-desc" className="block text-xs font-medium text-foreground">
          Job Overview <span className="text-error">*</span>
        </label>
        <textarea
          id="job-desc"
          rows={3}
          placeholder="High-level summary of the role..."
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          className="mt-1.5 w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-foreground placeholder:text-foreground-muted focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
        />
        {errors.description && <p className="mt-1 text-xs text-error">{errors.description}</p>}
      </div>

      {/* Responsibilities */}
      <div>
        <label htmlFor="job-resp" className="block text-xs font-medium text-foreground">
          Key Responsibilities (One per line or bulleted)
        </label>
        <textarea
          id="job-resp"
          rows={3}
          placeholder="- Deliver clean App Router code&#10;- Ensure accessibility conformance"
          value={formData.responsibilities}
          onChange={(e) => handleChange("responsibilities", e.target.value)}
          className="mt-1.5 w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-foreground placeholder:text-foreground-muted focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
        />
      </div>

      {/* Requirements */}
      <div>
        <label htmlFor="job-req" className="block text-xs font-medium text-foreground">
          Requirements & Qualifications
        </label>
        <textarea
          id="job-req"
          rows={3}
          placeholder="- 3+ years experience with Next.js and React&#10;- Familiarity with Tailwind CSS"
          value={formData.requirements}
          onChange={(e) => handleChange("requirements", e.target.value)}
          className="mt-1.5 w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-foreground placeholder:text-foreground-muted focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
        />
      </div>

      {/* Footer Buttons */}
      <div className="flex items-center justify-end gap-3 border-t border-border pt-4">
        <Button type="button" variant="outline" size="sm" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" size="sm">
          {isEditing ? "Save Changes" : "Create Job"}
        </Button>
      </div>
    </form>
  );
}

export function JobModal({ isOpen, onClose, onSave, job = null }) {
  const isEditing = Boolean(job);

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-foreground/40 transition-opacity duration-150 ease-out starting:opacity-0" />

        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 max-h-[90dvh] w-[min(42rem,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 overflow-y-auto overscroll-contain rounded-2xl border border-border bg-surface p-6 shadow-card transition duration-150 ease-out starting:scale-95 starting:opacity-0 focus-visible:outline-none">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-muted text-primary">
                <Briefcase className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <Dialog.Title className="text-lg font-semibold tracking-tight text-foreground">
                  {isEditing ? "Edit Job Posting" : "Create New Job Posting"}
                </Dialog.Title>
                <Dialog.Description className="text-xs text-foreground-secondary">
                  {isEditing
                    ? "Update position specifications and recruitment requirements."
                    : "Fill in the details to publish or draft a new job listing."}
                </Dialog.Description>
              </div>
            </div>

            <Dialog.Close asChild>
              <button
                type="button"
                aria-label="Close dialog"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-foreground-secondary transition-colors hover:bg-surface-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </Dialog.Close>
          </div>

          <JobForm
            key={job ? job.id : "new-job-form"}
            job={job}
            onSave={onSave}
            onClose={onClose}
          />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default JobModal;

