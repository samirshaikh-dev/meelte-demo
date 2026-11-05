"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "@/lib/icons";
import { useHr, JobMultiStepForm } from "@/components/hr";

export default function CreateJobPage() {
  const { createJob } = useHr();

  const handleSaveJob = async (jobData) => {
    return createJob(jobData);
  };

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
            Create New Job 
          </h1>
        </div>
      </div>

      {/* Master Multi-Step Form */}
      <JobMultiStepForm onSaveJob={handleSaveJob} />
    </main>
  );
}
