import React from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import {
  CareersHero,
  CareersValues,
  CareersBenefits,
  CareersOpenRoles,
  CareersFaq,
  CareersCta,
  CAREERS_BREADCRUMBS,
  CAREERS_DIRECT_ANSWER,
  getCareersFaqJsonLd,
} from "@/components/sections/careers";
import { buildPageMetadata } from "@/lib/seo/metadata";
import {
  getBreadcrumbsJsonLd,
  getWebPageJsonLd,
  mergeJsonLd,
} from "@/lib/seo/structured-data";
import { fetchPublicActiveJobs } from "@/services/site/careers";

/*
 * Cache Components (`next.config.mjs` → `cacheComponents: true`) rejects the
 * `revalidate` route segment config. The 60-second freshness window now lives
 * on the data itself: `fetchPublicActiveJobs` is a `"use cache"` scope with
 * `cacheLife('minutes')` (revalidate 60s, expire 1h), so the list still picks
 * up newly published or archived roles within a minute.
 */

export const metadata = buildPageMetadata({
  title: "Careers at meelTe: Values, Benefits & How to Apply",
  description:
    "Build with meelTe. We're a small, mission-driven team working to help people discover, connect, and grow in their neighborhoods across India.",
  path: "/careers",
  keywords: [
    "meelTe careers",
    "jobs at meelTe",
    "work at meelTe",
    "startup jobs India",
    "hyperlocal startup hiring",
    "community platform careers",
  ],
});

function getCareersJsonLd() {
  return mergeJsonLd(
    getWebPageJsonLd({
      name: "Careers at meelTe",
      description: CAREERS_DIRECT_ANSWER,
      path: "/careers",
      speakableSelectors: ["h1", "h2"],
    }),
    getCareersFaqJsonLd(),
    getBreadcrumbsJsonLd(CAREERS_BREADCRUMBS)
  );
}

export default async function CareersPage() {
  const activeJobs = await fetchPublicActiveJobs();
  const jsonLd = getCareersJsonLd();

  return (
    <div className="flex min-h-screen flex-col bg-canvas selection:bg-primary/20 selection:text-primary">
      {jsonLd.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}

      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2.5 focus:bg-primary focus:text-white focus:font-bold focus:rounded-xl focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-white"
      >
        Skip to main content
      </a>

      <Navbar />

      <main id="main-content" className="flex-1">
        <CareersHero />
        <CareersValues />
        <CareersBenefits />
        <CareersOpenRoles initialJobs={activeJobs} />
        <CareersFaq />
        <CareersCta />
      </main>

      <Footer />
    </div>
  );
}
