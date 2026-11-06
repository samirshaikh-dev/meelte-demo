"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Briefcase,
  MapPin,
  Clock,
  ArrowRight,
  GraduationCap,
} from "@/lib/icons";
import { Container } from "@/components/layout/container";
import { Card } from "@/components/ui/card";
import { CAREERS_EMAIL_HREF } from "./careers-content";

/**
 * Compact Job Opening Card
 * Follows compact-card-design guidelines and the visual hierarchy of Stripe, Razorpay & Notion.
 */
function CompactJobCard({ job }) {
  const targetHref = `/careers/${job.slug || job.id}`;

  return (
    <Link
      href={targetHref}
      className="group block rounded-2xl border border-border bg-surface p-4 sm:p-5 shadow-none transition-all duration-200 hover:border-primary/40 hover:shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
    >
      <div className="flex flex-col gap-3">
        {/* Header Row: Title & Department Pill */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="text-base sm:text-lg font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
              {job.title}
            </h3>
          </div>
          <span className="inline-flex shrink-0 items-center rounded-md border border-primary/20 bg-surface-muted px-2.5 py-0.5 text-xs font-semibold text-primary">
            {job.department}
          </span>
        </div>

        {/* Tags Row: Workplace, Employment Type & Experience */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-foreground-secondary">
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-surface-subtle px-2.5 py-1 text-foreground-secondary">
            <MapPin className="h-3.5 w-3.5 text-foreground-muted shrink-0" aria-hidden="true" />
            <span>
              {job.location} {job.workplaceType ? `(${job.workplaceType})` : ""}
            </span>
          </span>

          <span className="inline-flex items-center gap-1.5 rounded-lg bg-surface-subtle px-2.5 py-1 text-foreground-secondary">
            <Briefcase className="h-3.5 w-3.5 text-foreground-muted shrink-0" aria-hidden="true" />
            <span>{job.employmentType}</span>
          </span>

          {job.experienceLevel && (
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-surface-subtle px-2.5 py-1 text-foreground-secondary">
              <GraduationCap className="h-3.5 w-3.5 text-foreground-muted shrink-0" aria-hidden="true" />
              <span>{job.experienceLevel}</span>
            </span>
          )}
        </div>

        {/* Footer Row: Deadline / Posted & View Details CTA */}
        <div className="flex items-center justify-between border-t border-border/60 pt-2.5 text-xs">
          <span className="text-foreground-muted flex items-center gap-1.5">
            {job.deadline ? (
              <>
                <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span>Apply by {job.deadline}</span>
              </>
            ) : job.createdAt ? (
              <span>Posted on {job.createdAt}</span>
            ) : (
              <span>Active opening</span>
            )}
          </span>

          <span className="inline-flex items-center font-semibold text-primary transition-transform group-hover:translate-x-0.5">
            <span>View details</span>
            <ArrowRight className="h-3.5 w-3.5 ml-1" aria-hidden="true" />
          </span>
        </div>
      </div>
    </Link>
  );
}

/**
 * Skeleton Loader for active roles
 */
function RolesSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {[1, 2].map((i) => (
        <div
          key={i}
          className="rounded-2xl border border-border bg-surface p-4 sm:p-5 animate-pulse space-y-3"
        >
          <div className="flex justify-between items-center">
            <div className="h-5 w-48 bg-surface-muted rounded-md" />
            <div className="h-5 w-20 bg-surface-muted rounded-md" />
          </div>
          <div className="flex gap-2">
            <div className="h-6 w-24 bg-surface-muted rounded-md" />
            <div className="h-6 w-24 bg-surface-muted rounded-md" />
          </div>
          <div className="h-4 w-32 bg-surface-muted rounded-md" />
        </div>
      ))}
    </div>
  );
}

/**
 * Empty state rendered when there are 0 active roles.
 */
function EmptyRolesState() {
  return (
    <Card className="rounded-2xl border border-primary/15 bg-surface p-4 sm:p-5 shadow-none transition-all duration-200 hover:border-primary/30 hover:shadow-soft">
      <div className="flex items-start gap-3.5 sm:gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-muted text-primary">
          <Briefcase className="h-5 w-5" aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-semibold tracking-tight text-foreground">
            No open roles at the moment
          </h3>
          <p className="mt-1 text-sm leading-relaxed text-foreground-secondary">
            We&apos;re not actively hiring right now. If you believe you&apos;d
            be a great fit for meelTe, we&apos;d still love to hear from you. Send us a{" "}
            <a
              href={CAREERS_EMAIL_HREF}
              className="font-medium text-primary underline underline-offset-2 hover:text-primary-hover"
            >
              speculative application
            </a>
            .
          </p>
        </div>
      </div>
    </Card>
  );
}

/**
 * CareersOpenRoles section:
 * Left column: "Open roles" heading + description
 * Right column: Stack of compact job cards or clean empty state
 */
export function CareersOpenRoles({ initialJobs = [], isLoading = false }) {
  const [selectedDept, setSelectedDept] = useState("All");

  // Extract unique departments for filtering if there are > 6 jobs
  const departments = useMemo(() => {
    if (initialJobs.length <= 6) return [];
    const depts = new Set(initialJobs.map((j) => j.department).filter(Boolean));
    return ["All", ...Array.from(depts)];
  }, [initialJobs]);

  const filteredJobs = useMemo(() => {
    if (selectedDept === "All") return initialJobs;
    return initialJobs.filter((j) => j.department === selectedDept);
  }, [initialJobs, selectedDept]);

  return (
    <section
      id="open-roles"
      aria-labelledby="careers-open-roles-heading"
      className="border-b border-border/80 bg-canvas py-8 sm:py-12 lg:py-14 scroll-mt-20"
    >
      <Container>
        <div className="grid items-start gap-8 lg:grid-cols-12 lg:gap-x-12">
          {/* Left Column: Heading and Context */}
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <h2
              id="careers-open-roles-heading"
              className="text-2xl font-extrabold leading-tight tracking-tight text-foreground sm:text-3xl lg:text-4xl"
            >
              Open roles
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-foreground-secondary">
              Explore positions across engineering, product, operations, and community growth.
              Join us in building India&apos;s leading hyperlocal community network.
            </p>

            {/* Department Filter Chips (shown only if >6 jobs exist) */}
            {departments.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-1.5" role="tablist" aria-label="Filter roles by department">
                {departments.map((dept) => {
                  const isSelected = selectedDept === dept;
                  return (
                    <button
                      key={dept}
                      type="button"
                      onClick={() => setSelectedDept(dept)}
                      className={`rounded-lg px-2.5 py-1 text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 ${
                        isSelected
                          ? "bg-primary text-white font-semibold"
                          : "bg-surface border border-border text-foreground-secondary hover:text-foreground hover:bg-surface-muted"
                      }`}
                    >
                      {dept}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column: Roles List, Loading Skeletons or Empty State */}
          <div className="lg:col-span-7">
            {isLoading ? (
              <RolesSkeleton />
            ) : filteredJobs.length > 0 ? (
              <div className="flex flex-col gap-4">
                {filteredJobs.map((job) => (
                  <CompactJobCard key={job.id} job={job} />
                ))}
              </div>
            ) : (
              <EmptyRolesState />
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}

export default CareersOpenRoles;
