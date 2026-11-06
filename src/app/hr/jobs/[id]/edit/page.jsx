"use client";

import React, { use, useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, AlertCircle, Loader2 } from "@/lib/icons";
import { Button } from "@/components/ui/button";
import { useHr, JobMultiStepForm } from "@/components/hr";
import { fetchHrJobById } from "@/services/hr/jobs";

export default function EditJobPage({ params }) {
  const unwrappedParams = use(params);
  const jobId = unwrappedParams.id;

  const { getJobById, updateJob, isLoading: isContextLoading } = useHr();
  const [fetchedJob, setFetchedJob] = useState(null);
  const [isDirectFetchComplete, setIsDirectFetchComplete] = useState(false);

  const contextJob = getJobById(jobId);
  const existingJob = contextJob || fetchedJob;

  useEffect(() => {
    let ignore = false;

    if (!contextJob && !isContextLoading) {
      fetchHrJobById(jobId)
        .then((job) => {
          if (!ignore) {
            setFetchedJob(job || null);
            setIsDirectFetchComplete(true);
          }
        })
        .catch(() => {
          if (!ignore) {
            setIsDirectFetchComplete(true);
          }
        });
    }

    return () => {
      ignore = true;
    };
  }, [jobId, contextJob, isContextLoading]);

  const handleSaveJob = async (jobData) => {
    return updateJob(jobId, jobData);
  };

  // Show loading skeleton while data is being fetched
  const isStillLoading =
    isContextLoading || (!contextJob && !isDirectFetchComplete && !existingJob);

  if (isStillLoading) {
    return (
      <main className="flex-1 p-4 sm:p-5 lg:p-6 max-w-7xl w-full mx-auto flex flex-col items-center justify-center min-h-[50vh] text-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden="true" />
        <p className="mt-3 text-xs sm:text-sm text-foreground-muted">
          Loading job requisition...
        </p>
      </main>
    );
  }

  // Not Found screen if no matching job was found
  if (!existingJob) {
    return (
      <main className="flex-1 p-4 sm:p-5 lg:p-6 max-w-4xl w-full mx-auto space-y-6">
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
              The requested job ID &ldquo;{jobId}&rdquo; could not be located in requisitions.
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
    <main className="flex-1 p-4 sm:p-5 lg:p-6 max-w-7xl w-full mx-auto space-y-6">
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
