"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  UploadCloud,
  FileText,
  X,
  AlertCircle,
  Loader2,
  ArrowLeft,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  MapPin,
  Briefcase,
  Building,
} from "@/lib/icons";
import { Button } from "@/components/ui/button";
import { ApplySuccess } from "./apply-success";

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

const NOTICE_PERIOD_OPTIONS = [
  "Immediate",
  "15 days",
  "30 days",
  "60+ days",
  "Other",
];

function formatBytes(bytes) {
  if (!bytes || bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

function deriveNameFromFilename(filename) {
  if (!filename) return "";
  const base = filename
    .replace(/\.[^/.]+$/, "") // strip extension
    .replace(/[_-]+/g, " ")
    .replace(/\b(resume|cv|biodata|profile|doc|meelte|latest|updated)\b/gi, "")
    .trim();

  // If result looks like a person's name (2+ letters)
  if (base.length >= 2 && /^[a-zA-Z\s.]+$/.test(base)) {
    return base
      .split(/\s+/)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(" ");
  }
  return "";
}

function autoFormatPhone(raw) {
  // Strip non-digits and non-plus
  const cleaned = raw.replace(/[^\d+]/g, "");
  if (!cleaned) return "";

  // If starts with +91 and has 10 digits
  if (cleaned.startsWith("+91")) {
    const digits = cleaned.slice(3).replace(/\D/g, "");
    if (digits.length <= 5) return `+91 ${digits}`;
    return `+91 ${digits.slice(0, 5)} ${digits.slice(5, 10)}`;
  }

  // If 10 raw digits without +91
  const digitsOnly = cleaned.replace(/\D/g, "");
  if (digitsOnly.length === 10 && !cleaned.startsWith("+")) {
    return `+91 ${digitsOnly.slice(0, 5)} ${digitsOnly.slice(5, 10)}`;
  }

  return raw;
}

export function ApplyForm({ job }) {
  const jobId = job.slug || job.id;
  const draftStorageKey = `meelte_apply_draft_${jobId}`;

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    linkedinUrl: "",
    portfolioUrl: "",
    experience: "",
    currentCompany: "",
    noticePeriod: "",
    expectedSalary: "",
    coverNote: "",
    consent: false,
    website: "", // Honeypot field
  });

  const [resumeFile, setResumeFile] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});
  const [globalError, setGlobalError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isMoreDetailsOpen, setIsMoreDetailsOpen] = useState(false);
  const [customNotice, setCustomNotice] = useState("");

  const fileInputRef = useRef(null);
  const firstErrorRef = useRef(null);

  // Restore draft from localStorage on mount (deferred to avoid synchronous setState inside effect body)
  useEffect(() => {
    let active = true;
    Promise.resolve().then(() => {
      if (!active) return;
      try {
        const saved = localStorage.getItem(draftStorageKey);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && typeof parsed === "object") {
            setFormData((prev) => ({
              ...prev,
              ...parsed,
              consent: false, // require re-affirmation
              website: "", // clear honeypot
            }));

            // If optional details were saved, expand the section
            if (
              parsed.experience ||
              parsed.currentCompany ||
              parsed.noticePeriod ||
              parsed.expectedSalary
            ) {
              setIsMoreDetailsOpen(true);
              if (
                parsed.noticePeriod &&
                !NOTICE_PERIOD_OPTIONS.slice(0, 4).includes(parsed.noticePeriod)
              ) {
                setCustomNotice(parsed.noticePeriod);
              }
            }
          }
        }
      } catch {
        // LocalStorage access not permitted or corrupt
      }
    });

    return () => {
      active = false;
    };
  }, [draftStorageKey]);

  // Autosave draft on form changes
  useEffect(() => {
    if (isSubmitted) return;
    const timer = setTimeout(() => {
      try {
        const { website, consent, ...toSave } = formData;
        const hasValues = Object.values(toSave).some(
          (val) => typeof val === "string" && val.trim().length > 0
        );
        if (hasValues) {
          localStorage.setItem(draftStorageKey, JSON.stringify(toSave));
        }
      } catch {
        // Ignore storage exceptions
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [formData, draftStorageKey, isSubmitted]);

  // Inline validation logic
  const validateField = (name, value) => {
    switch (name) {
      case "fullName":
        if (!value.trim() || value.trim().length < 2) {
          return "Full name must be at least 2 characters.";
        }
        return null;
      case "email": {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.trim() || !emailRegex.test(value.trim())) {
          return "Please provide a valid email address.";
        }
        return null;
      }
      case "phone": {
        const digits = value.replace(/[\s+\-()]/g, "");
        if (!value.trim() || digits.length < 7 || digits.length > 15) {
          return "Please enter a valid phone number (7-15 digits).";
        }
        return null;
      }
      case "location":
        if (!value.trim() || value.trim().length < 2) {
          return "Please provide your current location.";
        }
        return null;
      case "linkedinUrl":
        if (value.trim() && !value.trim().startsWith("https://")) {
          return "LinkedIn profile URL must start with https://";
        }
        return null;
      case "portfolioUrl":
        if (value.trim() && !value.trim().startsWith("https://")) {
          return "Portfolio or GitHub URL must start with https://";
        }
        return null;
      default:
        return null;
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const finalValue = type === "checkbox" ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: finalValue,
    }));

    if (touchedFields[name]) {
      const err = validateField(name, finalValue);
      setFieldErrors((prev) => {
        const next = { ...prev };
        if (err) next[name] = err;
        else delete next[name];
        return next;
      });
    }

    if (globalError) setGlobalError("");
  };

  const handleInputBlur = (e) => {
    const { name, value } = e.target;
    setTouchedFields((prev) => ({ ...prev, [name]: true }));

    const err = validateField(name, value);
    setFieldErrors((prev) => {
      const next = { ...prev };
      if (err) next[name] = err;
      else delete next[name];
      return next;
    });
  };

  const handlePhoneChange = (e) => {
    const formatted = autoFormatPhone(e.target.value);
    setFormData((prev) => ({ ...prev, phone: formatted }));

    if (touchedFields.phone) {
      const err = validateField("phone", formatted);
      setFieldErrors((prev) => {
        const next = { ...prev };
        if (err) next.phone = err;
        else delete next.phone;
        return next;
      });
    }
  };

  const handleNoticeChipClick = (option) => {
    if (option === "Other") {
      setFormData((prev) => ({ ...prev, noticePeriod: customNotice }));
    } else {
      setFormData((prev) => ({ ...prev, noticePeriod: option }));
    }
  };

  const handleCustomNoticeChange = (e) => {
    const val = e.target.value;
    setCustomNotice(val);
    setFormData((prev) => ({ ...prev, noticePeriod: val }));
  };

  // Resume selection and lightweight client extraction
  const handleFileSelect = (file) => {
    if (!file) return;

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setFieldErrors((prev) => ({
        ...prev,
        resume: "File size exceeds 5MB limit. Please upload a smaller document.",
      }));
      return;
    }

    const lowerName = file.name.toLowerCase();
    const isValidExt =
      lowerName.endsWith(".pdf") ||
      lowerName.endsWith(".doc") ||
      lowerName.endsWith(".docx");

    if (!isValidExt) {
      setFieldErrors((prev) => ({
        ...prev,
        resume: "Allowed formats: PDF (.pdf) or Word (.doc, .docx).",
      }));
      return;
    }

    setResumeFile(file);
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next.resume;
      return next;
    });

    // Auto-detect details from filename & file header
    const detected = [];
    const nameGuess = deriveNameFromFilename(file.name);
    if (nameGuess && !formData.fullName) {
      setFormData((prev) => ({ ...prev, fullName: nameGuess }));
      detected.push("name");
    }

    // Attempt text scanning on first 64KB if browser FileReader is available
    if (window.FileReader && file.type === "application/pdf") {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target.result;
          if (typeof text === "string") {
            const emailMatch = text.match(
              /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/
            );
            const linkedinMatch = text.match(
              /https?:\/\/(?:www\.)?linkedin\.com\/in\/[A-Za-z0-9_-]+/i
            );
            const githubMatch = text.match(
              /https?:\/\/(?:www\.)?github\.com\/[A-Za-z0-9_-]+/i
            );

            setFormData((prev) => {
              const updates = {};
              if (emailMatch && !prev.email) {
                updates.email = emailMatch[0].toLowerCase();
                detected.push("email");
              }
              if (linkedinMatch && !prev.linkedinUrl) {
                updates.linkedinUrl = linkedinMatch[0];
                detected.push("LinkedIn");
              }
              if (githubMatch && !prev.portfolioUrl) {
                updates.portfolioUrl = githubMatch[0];
                detected.push("GitHub");
              }
              return Object.keys(updates).length > 0
                ? { ...prev, ...updates }
                : prev;
            });
          }
        } catch {
          // Soft fail
        }
      };
      // Read a slice as text
      reader.readAsText(file.slice(0, 65536));
    }
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setResumeFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Full validation before submission
  const validateAll = () => {
    const errors = {};

    const nameErr = validateField("fullName", formData.fullName);
    if (nameErr) errors.fullName = nameErr;

    const emailErr = validateField("email", formData.email);
    if (emailErr) errors.email = emailErr;

    const phoneErr = validateField("phone", formData.phone);
    if (phoneErr) errors.phone = phoneErr;

    const locErr = validateField("location", formData.location);
    if (locErr) errors.location = locErr;

    const liErr = validateField("linkedinUrl", formData.linkedinUrl);
    if (liErr) errors.linkedinUrl = liErr;

    const portErr = validateField("portfolioUrl", formData.portfolioUrl);
    if (portErr) errors.portfolioUrl = portErr;

    if (!resumeFile) {
      errors.resume = "Please upload your resume document.";
    }

    if (!formData.consent) {
      errors.consent = "You must agree to meelTe storing your details for hiring.";
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGlobalError("");

    // Honeypot check
    if (formData.website) {
      setIsSubmitted(true);
      return;
    }

    const errors = validateAll();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setTouchedFields({
        fullName: true,
        email: true,
        phone: true,
        location: true,
        linkedinUrl: true,
        portfolioUrl: true,
      });
      setTimeout(() => {
        firstErrorRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 50);
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = new FormData();
      payload.append("fullName", formData.fullName.trim());
      payload.append("email", formData.email.trim().toLowerCase());
      payload.append("phone", formData.phone.trim());
      payload.append("location", formData.location.trim());
      payload.append("linkedinUrl", formData.linkedinUrl.trim());
      payload.append("portfolioUrl", formData.portfolioUrl.trim());
      payload.append("experience", formData.experience.trim());
      payload.append("currentCompany", formData.currentCompany.trim());
      payload.append("noticePeriod", formData.noticePeriod.trim());
      payload.append("expectedSalary", formData.expectedSalary.trim());
      payload.append("coverNote", formData.coverNote.trim());
      payload.append("consent", "true");
      payload.append("website", formData.website);
      payload.append("resume", resumeFile);

      const res = await fetch(`/api/site/careers/jobs/${jobId}/apply`, {
        method: "POST",
        body: payload,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        if (data.fieldErrors) {
          const flat = {};
          for (const [key, msgs] of Object.entries(data.fieldErrors)) {
            flat[key] = Array.isArray(msgs) ? msgs[0] : msgs;
          }
          setFieldErrors(flat);
        }
        setGlobalError(
          data.error ||
            "Unable to submit your application. Please check the fields and try again."
        );
        return;
      }

      // Clear draft on successful submission
      try {
        localStorage.removeItem(draftStorageKey);
      } catch {
        // ignore
      }

      setIsSubmitted(true);
    } catch {
      setGlobalError(
        "A network error occurred. Please check your connection and try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return <ApplySuccess jobTitle={job.title} />;
  }

  // Progress metrics
  const isResumeDone = Boolean(resumeFile);
  const isContactDone =
    formData.fullName.trim().length >= 2 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim()) &&
    formData.phone.replace(/[\s+\-()]/g, "").length >= 7 &&
    formData.location.trim().length >= 2;
  const isConsentDone = formData.consent;

  const completedSteps =
    (isResumeDone ? 1 : 0) + (isContactDone ? 1 : 0) + (isConsentDone ? 1 : 0);
  const progressPercent = Math.round((completedSteps / 3) * 100);

  const isFormReadyToSubmit = isResumeDone && isContactDone && isConsentDone;

  const inputBaseStyle =
    "w-full h-11 rounded-xl border border-border bg-surface hover:border-foreground-secondary/40 px-3.5 text-sm text-foreground placeholder:text-foreground-secondary/60 focus:bg-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-1 transition-colors shadow-2xs";

  const inputErrorStyle =
    "border-error bg-error-bg/25 text-foreground focus:border-error focus:ring-error/40";

  return (
    <div className="space-y-4">
      {/* Global Error Banner */}
      {globalError && (
        <div
          ref={firstErrorRef}
          role="alert"
          className="rounded-2xl border border-error-border bg-error-bg p-4.5 flex items-start gap-3 text-sm text-error shadow-2xs"
        >
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <div className="font-semibold">Unable to submit application</div>
            <div>{globalError}</div>
          </div>
        </div>
      )}

      {/* Main Unified Form Card */}
      <div className="rounded-2xl border border-border bg-surface shadow-soft overflow-hidden">
        {/* Header Section */}
        <div className="px-6 py-6 sm:px-10 sm:py-7 border-b border-border/70">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Link
              href={`/careers/${jobId}`}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-foreground-secondary hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 rounded-md"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              <span>Back to role details</span>
            </Link>

            <span className="inline-flex items-center rounded-full border border-primary/20 bg-surface-muted px-3 py-1 text-xs font-semibold text-primary">
              {job.department}
            </span>
          </div>

          <h1 className="mt-4 text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Apply for {job.title}
          </h1>

          {/* Metadata Chips */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-subtle px-3 py-1 text-xs font-medium text-foreground-secondary">
              <MapPin className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
              <span>{job.location}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-subtle px-3 py-1 text-xs font-medium text-foreground-secondary">
              <Briefcase className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
              <span>{job.employmentType}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-subtle px-3 py-1 text-xs font-medium text-foreground-secondary">
              <Building className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
              <span>{job.workplaceType}</span>
            </span>
          </div>

          {/* Stepper / Progress Bar Indicator */}
          <div className="mt-6 pt-5 border-t border-border/60">
            <div className="flex items-center justify-between text-xs text-foreground-secondary mb-2">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-foreground">Application Progress</span>
                <span className="text-foreground-muted">·</span>
                <span className="text-foreground-secondary">
                  {completedSteps} of 3 sections completed
                </span>
              </div>
              <span className="font-semibold text-primary tabular-nums">
                {progressPercent}%
              </span>
            </div>

            <div className="h-2 w-full overflow-hidden rounded-full bg-surface-muted">
              <div
                className="h-full bg-primary transition-all duration-300 ease-out"
                style={{ width: `${progressPercent}%` }}
                role="progressbar"
                aria-valuenow={progressPercent}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Application completion progress"
              />
            </div>

            <div className="mt-3 grid grid-cols-3 gap-2 text-center text-[11px] sm:text-xs">
              <div
                className={`flex items-center justify-center gap-1.5 font-medium ${
                  isResumeDone ? "text-primary" : "text-foreground-muted"
                }`}
              >
                {isResumeDone ? (
                  <Check className="h-3.5 w-3.5 text-primary stroke-[2.5]" aria-hidden="true" />
                ) : (
                  <span className="h-1.5 w-1.5 rounded-full bg-foreground-muted/60" aria-hidden="true" />
                )}
                <span>1. Resume</span>
              </div>

              <div
                className={`flex items-center justify-center gap-1.5 font-medium ${
                  isContactDone ? "text-primary" : "text-foreground-muted"
                }`}
              >
                {isContactDone ? (
                  <Check className="h-3.5 w-3.5 text-primary stroke-[2.5]" aria-hidden="true" />
                ) : (
                  <span className="h-1.5 w-1.5 rounded-full bg-foreground-muted/60" aria-hidden="true" />
                )}
                <span>2. Contact</span>
              </div>

              <div
                className={`flex items-center justify-center gap-1.5 font-medium ${
                  isConsentDone ? "text-primary" : "text-foreground-muted"
                }`}
              >
                {isConsentDone ? (
                  <Check className="h-3.5 w-3.5 text-primary stroke-[2.5]" aria-hidden="true" />
                ) : (
                  <span className="h-1.5 w-1.5 rounded-full bg-foreground-muted/60" aria-hidden="true" />
                )}
                <span>3. Submit</span>
              </div>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form
          onSubmit={handleSubmit}
          noValidate
          className="px-6 py-6 sm:px-10 sm:py-8 space-y-8"
        >
          {/* Honeypot field */}
          <input
            type="text"
            name="website"
            value={formData.website}
            onChange={handleInputChange}
            tabIndex={-1}
            autoComplete="off"
            className="hidden"
            aria-hidden="true"
          />

          {/* ============================================================ */}
          {/* SECTION 1: RESUME UPLOAD (AT THE TOP)                        */}
          {/* ============================================================ */}
          <section aria-labelledby="section-resume-title" className="space-y-3">
            <div className="flex items-center justify-between">
              <h2
                id="section-resume-title"
                className="text-sm sm:text-base font-bold text-foreground flex items-center gap-2"
              >
                <span className="flex h-5.5 w-5.5 items-center justify-center rounded-full bg-surface-muted text-primary text-xs font-bold">
                  1
                </span>
                <span>Resume Document</span>
                <span className="text-error font-semibold ml-0.5" aria-hidden="true">*</span>
              </h2>

              <span className="text-xs text-foreground-muted">
                PDF or Word (max 5 MB)
              </span>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  handleFileSelect(e.target.files[0]);
                }
              }}
              className="sr-only"
              aria-labelledby="section-resume-title"
            />

            {!resumeFile ? (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleFileDrop}
                onClick={() => fileInputRef.current?.click()}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    fileInputRef.current?.click();
                  }
                }}
                tabIndex={0}
                role="button"
                aria-label="Upload resume: click or drag and drop a PDF or Word document under 5 MB"
                className={`flex flex-col items-center justify-center rounded-2xl border border-dashed py-7 px-4 text-center cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 ${
                  isDragging
                    ? "border-primary bg-surface-muted/70 ring-2 ring-primary/20"
                    : fieldErrors.resume
                    ? "border-error bg-error-bg/30"
                    : "border-primary/30 bg-surface-muted/25 hover:border-primary/60 hover:bg-surface-muted/50"
                }`}
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-surface-muted text-primary mb-2.5 shadow-2xs">
                  <UploadCloud className="h-6 w-6" aria-hidden="true" />
                </div>
                <p className="text-sm font-semibold text-foreground">
                  <span className="text-primary hover:underline">Click to upload</span> or drag and drop
                </p>
                <p className="mt-1 text-xs text-foreground-secondary font-medium">
                  PDF, DOC, or DOCX (maximum file size: 5 MB)
                </p>
                <p className="mt-2 inline-flex items-center gap-1 text-[11px] text-primary bg-surface px-2.5 py-0.5 rounded-full border border-primary/20">
                  <Sparkles className="h-3 w-3" aria-hidden="true" />
                  <span>Attaching your resume auto-fills basic details</span>
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between rounded-xl border border-primary/25 bg-surface-muted/40 p-4">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
                      <FileText className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {resumeFile.name}
                      </p>
                      <p className="text-xs text-foreground-muted flex items-center gap-1.5 mt-0.5">
                        <CheckCircle2 className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                        <span>Ready to submit · {formatBytes(resumeFile.size)}</span>
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    aria-label="Remove uploaded resume"
                    className="rounded-lg p-2 text-foreground-muted hover:text-error hover:bg-error-bg/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 transition-colors"
                  >
                    <X className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            )}

            {fieldErrors.resume && (
              <p className="mt-1.5 text-xs text-error font-medium">{fieldErrors.resume}</p>
            )}
          </section>

          {/* ============================================================ */}
          {/* SECTION 2: CONTACT & PROFILES                                */}
          {/* ============================================================ */}
          <section aria-labelledby="section-contact-title" className="space-y-4 pt-2">
            <h2
              id="section-contact-title"
              className="text-sm sm:text-base font-bold text-foreground flex items-center gap-2"
            >
              <span className="flex h-5.5 w-5.5 items-center justify-center rounded-full bg-surface-muted text-primary text-xs font-bold">
                2
              </span>
              <span>Contact & Profiles</span>
            </h2>

            <div className="grid gap-5 sm:grid-cols-2">
              {/* Full Name */}
              <div className="sm:col-span-2">
                <label
                  htmlFor="fullName"
                  className="block text-xs font-semibold text-foreground mb-1.5"
                >
                  Full Name <span className="text-error font-semibold ml-0.5" aria-hidden="true">*</span>
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  aria-required="true"
                  aria-invalid={Boolean(fieldErrors.fullName)}
                  aria-describedby={fieldErrors.fullName ? "fullName-error" : undefined}
                  value={formData.fullName}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  placeholder="e.g. Priyanshu Sharma"
                  className={`${inputBaseStyle} ${
                    fieldErrors.fullName ? inputErrorStyle : ""
                  }`}
                />
                {fieldErrors.fullName && (
                  <p id="fullName-error" className="mt-1.5 text-xs text-error font-medium">
                    {fieldErrors.fullName}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-semibold text-foreground mb-1.5"
                >
                  Email Address <span className="text-error font-semibold ml-0.5" aria-hidden="true">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  aria-required="true"
                  aria-invalid={Boolean(fieldErrors.email)}
                  aria-describedby={fieldErrors.email ? "email-error" : undefined}
                  value={formData.email}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  placeholder="name@example.com"
                  className={`${inputBaseStyle} ${
                    fieldErrors.email ? inputErrorStyle : ""
                  }`}
                />
                {fieldErrors.email && (
                  <p id="email-error" className="mt-1.5 text-xs text-error font-medium">
                    {fieldErrors.email}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="phone"
                  className="block text-xs font-semibold text-foreground mb-1.5"
                >
                  Phone Number <span className="text-error font-semibold ml-0.5" aria-hidden="true">*</span>
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  aria-required="true"
                  aria-invalid={Boolean(fieldErrors.phone)}
                  aria-describedby={fieldErrors.phone ? "phone-error" : undefined}
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  onBlur={handleInputBlur}
                  placeholder="+91 98765 43210"
                  className={`${inputBaseStyle} ${
                    fieldErrors.phone ? inputErrorStyle : ""
                  }`}
                />
                {fieldErrors.phone && (
                  <p id="phone-error" className="mt-1.5 text-xs text-error font-medium">
                    {fieldErrors.phone}
                  </p>
                )}
              </div>

              {/* Current Location */}
              <div className="sm:col-span-2">
                <label
                  htmlFor="location"
                  className="block text-xs font-semibold text-foreground mb-1.5"
                >
                  Current Location (City, State) <span className="text-error font-semibold ml-0.5" aria-hidden="true">*</span>
                </label>
                <input
                  id="location"
                  name="location"
                  type="text"
                  required
                  aria-required="true"
                  aria-invalid={Boolean(fieldErrors.location)}
                  aria-describedby={fieldErrors.location ? "location-error" : undefined}
                  value={formData.location}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  placeholder="e.g. Surat, Gujarat"
                  className={`${inputBaseStyle} ${
                    fieldErrors.location ? inputErrorStyle : ""
                  }`}
                />
                {fieldErrors.location && (
                  <p id="location-error" className="mt-1.5 text-xs text-error font-medium">
                    {fieldErrors.location}
                  </p>
                )}
              </div>

              {/* LinkedIn URL */}
              <div>
                <label
                  htmlFor="linkedinUrl"
                  className="block text-xs font-semibold text-foreground mb-1.5"
                >
                  LinkedIn Profile URL
                </label>
                <input
                  id="linkedinUrl"
                  name="linkedinUrl"
                  type="url"
                  aria-invalid={Boolean(fieldErrors.linkedinUrl)}
                  aria-describedby={fieldErrors.linkedinUrl ? "linkedinUrl-error" : undefined}
                  value={formData.linkedinUrl}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  placeholder="https://linkedin.com/in/username"
                  className={`${inputBaseStyle} ${
                    fieldErrors.linkedinUrl ? inputErrorStyle : ""
                  }`}
                />
                {fieldErrors.linkedinUrl && (
                  <p id="linkedinUrl-error" className="mt-1.5 text-xs text-error font-medium">
                    {fieldErrors.linkedinUrl}
                  </p>
                )}
              </div>

              {/* Portfolio / GitHub URL */}
              <div>
                <label
                  htmlFor="portfolioUrl"
                  className="block text-xs font-semibold text-foreground mb-1.5"
                >
                  Portfolio or GitHub URL
                </label>
                <input
                  id="portfolioUrl"
                  name="portfolioUrl"
                  type="url"
                  aria-invalid={Boolean(fieldErrors.portfolioUrl)}
                  aria-describedby={fieldErrors.portfolioUrl ? "portfolioUrl-error" : undefined}
                  value={formData.portfolioUrl}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  placeholder="https://github.com/username"
                  className={`${inputBaseStyle} ${
                    fieldErrors.portfolioUrl ? inputErrorStyle : ""
                  }`}
                />
                {fieldErrors.portfolioUrl && (
                  <p id="portfolioUrl-error" className="mt-1.5 text-xs text-error font-medium">
                    {fieldErrors.portfolioUrl}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* ============================================================ */}
          {/* SECTION 3: ROLE DETAILS & COLLAPSED EXPERIENCE               */}
          {/* ============================================================ */}
          <section aria-labelledby="section-details-title" className="space-y-4 pt-2">
            <h2
              id="section-details-title"
              className="text-sm sm:text-base font-bold text-foreground flex items-center gap-2"
            >
              <span className="flex h-5.5 w-5.5 items-center justify-center rounded-full bg-surface-muted text-primary text-xs font-bold">
                3
              </span>
              <span>Role Details & Notes</span>
            </h2>

            {/* Collapsible Disclosure for Secondary Details */}
            <div className="rounded-2xl border border-border bg-surface-subtle/50 overflow-hidden transition-all">
              <button
                type="button"
                onClick={() => setIsMoreDetailsOpen((prev) => !prev)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-surface-subtle transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
                aria-expanded={isMoreDetailsOpen}
                aria-controls="more-details-panel"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm font-semibold text-foreground">
                    Add experience & compensation details
                  </span>
                  <span className="text-[11px] text-foreground-muted">
                    (Notice, Salary, Current Role)
                  </span>
                </div>

                <div className="flex items-center gap-2 text-primary text-xs font-semibold">
                  <span>{isMoreDetailsOpen ? "Hide" : "Expand"}</span>
                  {isMoreDetailsOpen ? (
                    <ChevronUp className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <ChevronDown className="h-4 w-4" aria-hidden="true" />
                  )}
                </div>
              </button>

              {isMoreDetailsOpen && (
                <div
                  id="more-details-panel"
                  className="p-4 sm:p-6 border-t border-border/60 bg-surface grid gap-5 sm:grid-cols-2"
                >
                  {/* Total Experience */}
                  <div>
                    <label
                      htmlFor="experience"
                      className="block text-xs font-semibold text-foreground mb-1.5"
                    >
                      Total Experience
                    </label>
                    <input
                      id="experience"
                      name="experience"
                      type="text"
                      value={formData.experience}
                      onChange={handleInputChange}
                      placeholder="e.g. 3 years"
                      className={inputBaseStyle}
                    />
                  </div>

                  {/* Current Role / Company */}
                  <div>
                    <label
                      htmlFor="currentCompany"
                      className="block text-xs font-semibold text-foreground mb-1.5"
                    >
                      Current Role / Company
                    </label>
                    <input
                      id="currentCompany"
                      name="currentCompany"
                      type="text"
                      value={formData.currentCompany}
                      onChange={handleInputChange}
                      placeholder="e.g. Software Engineer at Acme"
                      className={inputBaseStyle}
                    />
                  </div>

                  {/* Notice Period Chips */}
                  <div className="sm:col-span-2 space-y-2">
                    <label
                      htmlFor="noticePeriod"
                      className="block text-xs font-semibold text-foreground mb-1"
                    >
                      Notice Period
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {NOTICE_PERIOD_OPTIONS.map((opt) => {
                        const isSelected =
                          opt === "Other"
                            ? Boolean(
                                formData.noticePeriod &&
                                  !NOTICE_PERIOD_OPTIONS.slice(0, 4).includes(
                                    formData.noticePeriod
                                  )
                              )
                            : formData.noticePeriod === opt;

                        return (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => handleNoticeChipClick(opt)}
                            className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 ${
                              isSelected
                                ? "bg-primary text-white shadow-2xs"
                                : "border border-border bg-surface text-foreground-secondary hover:border-primary/40 hover:text-foreground"
                            }`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>

                    {/* Custom Notice input if "Other" is chosen */}
                    {(NOTICE_PERIOD_OPTIONS.slice(0, 4).indexOf(
                      formData.noticePeriod
                    ) === -1 &&
                      formData.noticePeriod) ||
                    customNotice ? (
                      <div className="pt-2">
                        <input
                          id="noticePeriod"
                          name="noticePeriod"
                          type="text"
                          value={customNotice}
                          onChange={handleCustomNoticeChange}
                          placeholder="Specify notice period (e.g. 45 days, Negotiable)"
                          className={inputBaseStyle}
                        />
                      </div>
                    ) : null}
                  </div>

                  {/* Expected Salary (Structured Currency / Unit) */}
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="expectedSalary"
                      className="block text-xs font-semibold text-foreground mb-1.5"
                    >
                      Expected Annual Salary (LPA)
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-xs font-bold text-foreground-secondary pointer-events-none">
                        ₹
                      </span>
                      <input
                        id="expectedSalary"
                        name="expectedSalary"
                        type="text"
                        value={formData.expectedSalary}
                        onChange={handleInputChange}
                        placeholder="e.g. 12 – 15"
                        className={`${inputBaseStyle} pl-8 pr-14`}
                      />
                      <span className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-xs font-semibold text-foreground-muted pointer-events-none">
                        LPA
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Cover Note */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="coverNote"
                  className="block text-xs font-semibold text-foreground"
                >
                  Cover Note or Quick Introduction
                </label>
                <span className="text-xs text-foreground-muted tabular-nums">
                  {formData.coverNote.length} / 1000
                </span>
              </div>

              <textarea
                id="coverNote"
                name="coverNote"
                rows={4}
                maxLength={1000}
                value={formData.coverNote}
                onChange={handleInputChange}
                placeholder="Share why you're interested in joining meelTe and what makes you a great fit..."
                className={`w-full rounded-xl border border-border bg-surface hover:border-foreground-secondary/40 p-3.5 text-sm text-foreground placeholder:text-foreground-secondary/60 focus:bg-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-1 transition-colors resize-y shadow-2xs`}
              />
            </div>
          </section>

          {/* ============================================================ */}
          {/* CONSENT & SUBMISSION                                         */}
          {/* ============================================================ */}
          <div className="pt-2 border-t border-border/70 space-y-4">
            {/* Consent Checkbox */}
            <div>
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  name="consent"
                  checked={formData.consent}
                  onChange={handleInputChange}
                  required
                  aria-required="true"
                  className="mt-0.5 h-4.5 w-4.5 rounded border-border text-primary accent-[#6D3BB3] focus:ring-primary/70 transition-colors cursor-pointer shrink-0"
                />
                <span className="text-xs sm:text-sm text-foreground-secondary leading-normal select-none">
                  I agree to meelTe storing and processing my application details for hiring purposes in accordance with the company{" "}
                  <Link
                    href="/privacy"
                    className="text-primary hover:underline font-semibold"
                    target="_blank"
                  >
                    Privacy Policy
                  </Link>.
                </span>
              </label>
              {fieldErrors.consent && (
                <p className="mt-1.5 text-xs text-error font-medium">{fieldErrors.consent}</p>
              )}
            </div>

            {/* Validation helper status */}
            {!isFormReadyToSubmit && (
              <p className="text-xs text-foreground-muted flex items-center gap-1.5">
                <span className="text-error font-bold">*</span>
                <span>
                  Please upload your resume, fill required fields, and accept the hiring policy to submit.
                </span>
              </p>
            )}

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3">
              <Button
                as={Link}
                href={`/careers/${jobId}`}
                variant="ghost"
                size="md"
                className="rounded-xl text-xs sm:text-sm font-medium text-foreground-secondary hover:text-foreground hover:bg-surface-muted/60 px-5 h-11 order-2 sm:order-1"
              >
                Cancel
              </Button>

              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={isSubmitting || !isFormReadyToSubmit}
                className="rounded-xl font-bold px-7 h-11 text-xs sm:text-sm shadow-soft gap-2 disabled:opacity-40 disabled:cursor-not-allowed order-1 sm:order-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    <span>Submitting Application...</span>
                  </>
                ) : (
                  <span>Submit Application</span>
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>

      {/* Mobile Sticky Bar for Easy Submit */}
      <div className="sm:hidden fixed bottom-0 inset-x-0 bg-surface/95 backdrop-blur-md p-3.5 border-t border-border/80 shadow-card z-30 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold text-foreground truncate">
            {completedSteps} / 3 sections done
          </p>
          <p className="text-[11px] text-foreground-muted truncate">
            {isFormReadyToSubmit ? "Ready to submit" : "Fill required fields"}
          </p>
        </div>

        <Button
          type="button"
          variant="primary"
          size="sm"
          disabled={isSubmitting || !isFormReadyToSubmit}
          onClick={handleSubmit}
          className="rounded-xl font-bold px-5 h-10 text-xs shrink-0 shadow-soft gap-1.5 disabled:opacity-40"
        >
          {isSubmitting ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
          ) : (
            <span>Submit</span>
          )}
        </Button>
      </div>
    </div>
  );
}

export default ApplyForm;
