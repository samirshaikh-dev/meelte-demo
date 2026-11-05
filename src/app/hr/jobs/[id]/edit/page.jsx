"use client";

import React, { use } from "react";
import Link from "next/link";
import { ArrowLeft, AlertCircle } from "@/lib/icons";
import { Button } from "@/components/ui/button";
import { useHr, JobMultiStepForm } from "@/components/hr";

export default function EditJobPage({ params }) {
  const unwrappedParams = use(params);
  const jobId = unwrappedParams.id;

  const { getJobById, updateJob } = useHr();
  const existingJob = getJobById(jobId);

  const handleSaveJob = async (jobData) => {
    return updateJob(jobId, jobData);
  };

  if (!existingJob) {
    return (
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-4xl w-full mx-auto space-y-6">
        <Link
          href="/hr/jobs"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-foreground-secondary hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 rounded-md"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Back to Job Openings</span>
        </Link>

        <div className="rounded-2xl border border-border bg-surface p-8 text-center shadow-soft space-y-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-surface-muted text-primary">
            <AlertCircle className="h-6 w-6" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">Job Requisition Not Found</h1>
            <p className="mt-1 text-xs text-foreground-secondary">
              The requested job ID &ldquo;{jobId}&rdquo; could not be located in active requisitions.
            </p>
          </div>
          <div>
            <Button as={Link} href="/hr/jobs" variant="primary" size="sm">
              Return to Jobs List
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full space-y-6">
        {/* Navigation Breadcrumb / Back Link */}
        <div>
          <Link
            href="/hr/jobs"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-foreground-secondary hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 rounded-md"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Back to Job Openings</span>
          </Link>

          <div className="mt-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Edit Job Posting: {existingJob.title}
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-foreground-secondary">
              Update posting details, formatted responsibilities, criteria, or publishing status.
            </p>
          </div>
        </div>

        {/* Master Multi-Step Form with Prefilled Existing Job */}
        <JobMultiStepForm existingJob={existingJob} onSaveJob={handleSaveJob} />
      </main>
    );
  }
