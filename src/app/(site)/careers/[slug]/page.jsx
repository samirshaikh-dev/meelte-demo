import React, { Suspense } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/layout/container";
import { buildPageMetadata } from "@/lib/seo/metadata";
import {
  getBreadcrumbsJsonLd,
  getJobPostingJsonLd,
  mergeJsonLd,
} from "@/lib/seo/structured-data";
import { fetchPublicJobBySlugOrId } from "@/services/careers/public-jobs-service";
import { JobDetailsView } from "./job-details-view";
import { RoleClosedView } from "./role-closed-view";

/*
 * Freshness is set on the cached read functions in
 * `@/services/careers/public-jobs-service` via `cacheLife('minutes')`.
 * `export const revalidate` is rejected under Cache Components, and the slug
 * only exists at request time, so this route builds as a partial-prerender
 * page: the shell (header, skeleton, footer) is static and the role streams in
 * behind the Suspense boundary, exactly like `/events/[id]` and `/ads/[id]`.
 */

/**
 * Dynamic SEO metadata for /careers/[slug].
 * Generates title, description and Open Graph tags from real job data.
 */
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const job = await fetchPublicJobBySlugOrId(slug);

  if (!job) {
    return buildPageMetadata({
      title: "Role No Longer Open",
      description:
        "This job opening at meelTe is no longer accepting applications. View our other open positions.",
      path: `/careers/${slug}`,
      noIndex: true,
    });
  }

  return buildPageMetadata({
    title: `${job.title} — ${job.department} | Careers at meelTe`,
    description: `Apply for the ${job.title} role (${job.employmentType}, ${job.workplaceType}) in ${job.location} at meelTe. ${job.experienceLevel} level.`,
    path: `/careers/${job.slug || job.id}`,
    keywords: [
      job.title,
      job.department,
      `${job.employmentType} jobs`,
      `${job.workplaceType} jobs India`,
      "meelTe careers",
      "startup jobs India",
    ],
  });
}

function JobDetailFallback() {
  return (
    <section
      aria-busy="true"
      aria-label="Loading role details"
      className="pb-16 lg:pb-24"
    >
      <Container className="py-8 sm:py-10">
        <div className="h-5 w-32 animate-pulse rounded-md bg-surface-muted" />
        <div className="mt-6 rounded-2xl border border-border bg-surface p-6 sm:p-8">
          <div className="flex flex-wrap gap-2">
            <div className="h-6 w-24 animate-pulse rounded-md bg-surface-muted" />
            <div className="h-6 w-28 animate-pulse rounded-md bg-surface-muted" />
            <div className="h-6 w-32 animate-pulse rounded-md bg-surface-muted" />
          </div>
          <div className="mt-5 h-10 w-3/4 animate-pulse rounded-lg bg-surface-muted" />
          <div className="mt-3 h-4 w-1/2 animate-pulse rounded-md bg-surface-muted" />
        </div>
        <div className="mt-8 grid gap-8 lg:grid-cols-12">
          <div className="space-y-3 lg:col-span-8">
            <div className="h-6 w-40 animate-pulse rounded-md bg-surface-muted" />
            <div className="h-4 w-full animate-pulse rounded-md bg-surface-muted" />
            <div className="h-4 w-11/12 animate-pulse rounded-md bg-surface-muted" />
            <div className="h-4 w-10/12 animate-pulse rounded-md bg-surface-muted" />
          </div>
          <div className="lg:col-span-4">
            <div className="h-64 animate-pulse rounded-2xl bg-surface-muted" />
          </div>
        </div>
      </Container>
    </section>
  );
}

async function CareerJobContent({ params }) {
  const { slug } = await params;
  const job = await fetchPublicJobBySlugOrId(slug);

  // If no active job found, show clean "role closed" page instead of a hard 404
  if (!job) {
    return <RoleClosedView slug={slug} />;
  }

  // Build structured data for active job
  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "Careers", path: "/careers" },
    { name: job.title, path: `/careers/${job.slug || job.id}` },
  ];

  const jsonLd = mergeJsonLd(
    getJobPostingJsonLd(job),
    getBreadcrumbsJsonLd(breadcrumbs)
  );

  return (
    <>
      {jsonLd.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}

      <JobDetailsView job={job} />
    </>
  );
}

export default function CareerJobPage({ params }) {
  return (
    <div className="flex min-h-screen flex-col bg-canvas selection:bg-primary/20 selection:text-primary">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2.5 focus:bg-primary focus:text-white focus:font-bold focus:rounded-xl focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-white"
      >
        Skip to main content
      </a>

      <Suspense fallback={<div className="h-16 border-b border-border/80 bg-surface" aria-hidden="true" />}>
        <Navbar />
      </Suspense>

      <main id="main-content" className="flex-1">
        <Suspense fallback={<JobDetailFallback />}>
          <CareerJobContent params={params} />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
