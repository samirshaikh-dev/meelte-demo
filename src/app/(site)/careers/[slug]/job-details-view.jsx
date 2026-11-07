"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Briefcase,
  MapPin,
  Clock,
  Calendar,
  DollarSign,
  Share2,
  CheckCircle2,
  Mail,
  GraduationCap,
  ArrowRight,
} from "@/lib/icons";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { shareCurrentPage } from "@/lib/share-link";
import { sanitizeHtml } from "@/lib/sanitize-html";

export function JobDetailsView({ job }) {
  const applyUrl = `/careers/${job.slug || job.id}/apply`;

  const handleShare = () => {
    shareCurrentPage({
      title: `${job.title} at meelTe`,
      text: `Check out the ${job.title} role at meelTe!`,
      successMessage: "Job link copied to your clipboard.",
    });
  };

  return (
    <div className="relative pb-16 lg:pb-24">
      <Container className="py-8 sm:py-10">
        {/* Navigation & Breadcrumb */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <Link
            href="/careers#open-roles"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-foreground-secondary hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 rounded-md"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            <span>Back to all roles</span>
          </Link>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleShare}
            className="gap-1.5 text-xs h-8 px-2.5 rounded-lg"
          >
            <Share2 className="h-3.5 w-3.5 text-foreground-muted" aria-hidden="true" />
            <span>Share role</span>
          </Button>
        </div>

        {/* Hero / Header Card */}
        <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8 shadow-soft space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-md border border-primary/20 bg-surface-muted px-2.5 py-1 text-xs font-semibold text-primary">
              {job.department}
            </span>
            <span className="inline-flex items-center gap-1 rounded-md bg-surface-subtle px-2.5 py-1 text-xs font-medium text-foreground-secondary">
              <Briefcase className="h-3 w-3 text-foreground-muted" aria-hidden="true" />
              <span>{job.employmentType}</span>
            </span>
            <span className="inline-flex items-center gap-1 rounded-md bg-surface-subtle px-2.5 py-1 text-xs font-medium text-foreground-secondary">
              <MapPin className="h-3 w-3 text-foreground-muted" aria-hidden="true" />
              <span>
                {job.location} ({job.workplaceType})
              </span>
            </span>
            {job.experienceLevel && (
              <span className="inline-flex items-center gap-1 rounded-md bg-surface-subtle px-2.5 py-1 text-xs font-medium text-foreground-secondary">
                <GraduationCap className="h-3 w-3 text-foreground-muted" aria-hidden="true" />
                <span>{job.experienceLevel}</span>
              </span>
            )}
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground">
                {job.title}
              </h1>

              {/* Salary & Meta Row */}
              <div className="mt-3 flex flex-wrap items-center gap-4 text-xs sm:text-sm text-foreground-muted">
                {job.salaryRange && (
                  <div className="flex items-center gap-1 text-foreground font-semibold">
                    <DollarSign className="h-4 w-4 text-primary" aria-hidden="true" />
                    <span>{job.salaryRange}</span>
                  </div>
                )}
                {job.deadline && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-warning" aria-hidden="true" />
                    <span>Apply before: {job.deadline}</span>
                  </div>
                )}
                {job.createdAt && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-foreground-muted" aria-hidden="true" />
                    <span>Posted {job.createdAt}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Desktop Apply CTA */}
            <div className="hidden lg:flex shrink-0">
              <Button
                as={Link}
                href={applyUrl}
                variant="primary"
                size="lg"
                className="gap-2 font-bold px-6 shadow-2xs rounded-xl"
              >
                <span>Apply for this position</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="mt-8 grid gap-8 lg:grid-cols-12">
          {/* Main Content Column */}
          <div className="lg:col-span-8 space-y-8">
            {/* Overview / About the Role */}
            {job.description && (
              <section aria-labelledby="overview-heading" className="space-y-3">
                <h2
                  id="overview-heading"
                  className="text-lg sm:text-xl font-bold tracking-tight text-foreground"
                >
                  About the Role
                </h2>
                <div
                  className="prose prose-sm max-w-none text-foreground-secondary leading-relaxed space-y-3"
                  dangerouslySetInnerHTML={{
                    __html: sanitizeHtml(job.description),
                  }}
                />
              </section>
            )}

            {/* Key Responsibilities */}
            {job.responsibilities && (
              <section aria-labelledby="responsibilities-heading" className="space-y-3">
                <h2
                  id="responsibilities-heading"
                  className="text-lg sm:text-xl font-bold tracking-tight text-foreground"
                >
                  Key Responsibilities
                </h2>
                <div
                  className="prose prose-sm max-w-none text-foreground-secondary leading-relaxed space-y-3"
                  dangerouslySetInnerHTML={{
                    __html: sanitizeHtml(job.responsibilities),
                  }}
                />
              </section>
            )}

            {/* Requirements & Qualifications */}
            {job.requirements && (
              <section aria-labelledby="requirements-heading" className="space-y-3">
                <h2
                  id="requirements-heading"
                  className="text-lg sm:text-xl font-bold tracking-tight text-foreground"
                >
                  Requirements & Qualifications
                </h2>
                <div
                  className="prose prose-sm max-w-none text-foreground-secondary leading-relaxed space-y-3"
                  dangerouslySetInnerHTML={{
                    __html: sanitizeHtml(job.requirements),
                  }}
                />
              </section>
            )}

            {/* Required Skills */}
            {job.skills && job.skills.length > 0 && (
              <section aria-labelledby="skills-heading" className="space-y-3">
                <h2
                  id="skills-heading"
                  className="text-lg sm:text-xl font-bold tracking-tight text-foreground"
                >
                  Skills & Technologies
                </h2>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center rounded-lg border border-border bg-surface px-3 py-1 text-xs font-medium text-foreground-secondary"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar Column: Summary & Application Guide */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6 shadow-soft space-y-4">
              <h3 className="text-base font-bold text-foreground">
                Role Snapshot
              </h3>
              <dl className="divide-y divide-border/60 text-xs sm:text-sm">
                <div className="py-2.5 flex justify-between gap-2">
                  <dt className="text-foreground-muted">Department</dt>
                  <dd className="font-semibold text-foreground">{job.department}</dd>
                </div>
                <div className="py-2.5 flex justify-between gap-2">
                  <dt className="text-foreground-muted">Employment</dt>
                  <dd className="font-semibold text-foreground">{job.employmentType}</dd>
                </div>
                <div className="py-2.5 flex justify-between gap-2">
                  <dt className="text-foreground-muted">Location</dt>
                  <dd className="font-semibold text-foreground text-right">{job.location}</dd>
                </div>
                <div className="py-2.5 flex justify-between gap-2">
                  <dt className="text-foreground-muted">Workplace</dt>
                  <dd className="font-semibold text-foreground">{job.workplaceType}</dd>
                </div>
                {job.experienceLevel && (
                  <div className="py-2.5 flex justify-between gap-2">
                    <dt className="text-foreground-muted">Experience</dt>
                    <dd className="font-semibold text-foreground">{job.experienceLevel}</dd>
                  </div>
                )}
                {job.deadline && (
                  <div className="py-2.5 flex justify-between gap-2">
                    <dt className="text-foreground-muted">Deadline</dt>
                    <dd className="font-semibold text-warning">{job.deadline}</dd>
                  </div>
                )}
              </dl>

              <div className="pt-2">
                <Button
                  as={Link}
                  href={applyUrl}
                  variant="primary"
                  className="w-full gap-2 font-semibold shadow-2xs rounded-xl"
                >
                  <span>Apply Now</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
            </div>

            {/* How we hire card */}
            <div className="rounded-2xl border border-primary/20 bg-surface-muted/60 p-5 text-xs text-foreground-secondary space-y-3">
              <div className="flex items-center gap-2 font-bold text-foreground text-sm">
                <CheckCircle2 className="h-4 w-4 text-primary" aria-hidden="true" />
                <span>Our Hiring Process</span>
              </div>
              <p className="leading-relaxed">
                1. <strong>Application Review:</strong> Our team reviews your resume and background.
              </p>
              <p className="leading-relaxed">
                2. <strong>Introductory Call:</strong> A brief conversation about your goals and our culture.
              </p>
              <p className="leading-relaxed">
                3. <strong>Technical / Domain Chat:</strong> Deep dive into your experience and problem-solving skills.
              </p>
            </div>
          </aside>
        </div>
      </Container>

      {/* Sticky Mobile Apply Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-surface/95 backdrop-blur-md px-4 py-3 shadow-card flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="text-xs font-bold text-foreground truncate">
            {job.title}
          </div>
          <div className="text-[11px] text-foreground-muted truncate">
            {job.location} · {job.department}
          </div>
        </div>

        <Button
          as={Link}
          href={applyUrl}
          variant="primary"
          size="sm"
          className="shrink-0 gap-1.5 font-bold rounded-xl shadow-2xs"
        >
          <span>Apply Now</span>
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}

export default JobDetailsView;

