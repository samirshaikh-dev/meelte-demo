import React, { Suspense } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/layout/container";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { getBreadcrumbsJsonLd } from "@/lib/seo/structured-data";
import { fetchPublicJobBySlugOrId } from "@/services/site/careers";
import { ApplyForm } from "@/components/sections/careers/apply";
import { RoleClosedView } from "../role-closed-view";

/**
 * Title cases role names for headings and breadcrumbs (e.g. "software engineer" -> "Software Engineer").
 */
function formatRoleTitle(title) {
  if (!title) return "";
  return title
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Metadata for /careers/[slug]/apply.
 * Strict noindex to prevent indexing dynamic application forms.
 */
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const job = await fetchPublicJobBySlugOrId(slug);

  if (!job) {
    return buildPageMetadata({
      title: "Role No Longer Open",
      description: "This position is no longer accepting applications.",
      path: `/careers/${slug}/apply`,
      noIndex: true,
    });
  }

  const roleTitle = formatRoleTitle(job.title);

  return buildPageMetadata({
    title: `Apply for ${roleTitle} — ${job.department} | meelTe Careers`,
    description: `Submit your application for the ${roleTitle} role at meelTe.`,
    path: `/careers/${job.slug || job.id}/apply`,
    noIndex: true,
  });
}

function ApplyFallback() {
  return (
    <Container className="py-8 sm:py-12 max-w-6xl">
      <div className="h-[700px] animate-pulse rounded-2xl border border-border bg-surface p-6 sm:p-10" />
    </Container>
  );
}

async function CareerApplyContent({ params }) {
  const { slug } = await params;
  const job = await fetchPublicJobBySlugOrId(slug);

  if (!job) {
    return <RoleClosedView slug={slug} />;
  }

  const roleTitle = formatRoleTitle(job.title);

  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "Careers", path: "/careers" },
    { name: roleTitle, path: `/careers/${job.slug || job.id}` },
    { name: "Apply", path: `/careers/${job.slug || job.id}/apply` },
  ];

  const jsonLd = getBreadcrumbsJsonLd(breadcrumbs);

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}

      <Container className="py-8 sm:py-12 max-w-6xl">
        <ApplyForm job={{ ...job, title: roleTitle }} />
      </Container>
    </>
  );
}

export default function CareerJobApplyPage({ params }) {
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
        <Suspense fallback={<ApplyFallback />}>
          <CareerApplyContent params={params} />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
