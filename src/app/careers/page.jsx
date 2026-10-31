import React from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CareersHero } from "./_components/careers-hero";
import { CareersValues } from "./_components/careers-values";
import { CareersBenefits } from "./_components/careers-benefits";
import { CareersOpenRoles } from "./_components/careers-open-roles";
import { CareersCta } from "./_components/careers-cta";
import {
  CAREERS_BREADCRUMBS,
  CAREERS_DIRECT_ANSWER,
} from "./_components/careers-content";
import { buildPageMetadata } from "@/lib/seo/metadata";
import {
  getBreadcrumbsJsonLd,
  getWebPageJsonLd,
  mergeJsonLd,
} from "@/lib/seo/structured-data";

/**
 * /careers
 *
 * Visual rebuild only — every content block from the previous version is still
 * here, in the same order: hero → what we value → perks & benefits → open roles →
 * closing CTA. What changed is the arrangement, the type scale, the token usage and
 * the section rhythm:
 *
 * - The hero is left-aligned instead of centred, and the "not actively hiring"
 *   status (which used to sit fourth) is stated directly under the summary.
 * - Values became a ruled editorial list, benefits a 4-column bento, open roles a
 *   two-column status block, and the closing CTA a left/right split — so the page
 *   no longer reads as five stacked grids of identical cards
 *   (meelte-context.md §4).
 * - The headline gradient ends in `primary-royal` instead of `accent`; amber
 *   `#F59E0B` as text measures 2.15:1 on this canvas (docs/Design.md §9.8).
 * - Breadcrumbs come from the shared primitive and are mirrored by a
 *   `BreadcrumbList` node (AI_RULE.md §2.6).
 *
 * Title note: `buildPageMetadata` runs the title through the root `%s | Meelte`
 * template in src/lib/seo/metadata.js. The previous "Careers at Meelte | Join Our
 * Team" therefore rendered as "Careers at Meelte | Join Our Team | Meelte" — a
 * double brand and two pipes. The title below is short enough to survive the
 * template and describes what is actually on the page. Changing the template
 * itself is a site-wide decision and out of scope here.
 *
 * Schema: WebPage + BreadcrumbList. The `WebPage.description` is quoted verbatim
 * from the hero status line so the structured data cannot claim more than the page
 * says. `JobPosting` is deliberately not emitted, because no posting exists.
 */
export const metadata = buildPageMetadata({
  title: "Careers at Meelte: Values, Benefits & How to Apply",
  description:
    "Build with Meelte. We're a small, mission-driven team working to help people discover, connect, and grow in their neighborhoods across India.",
  path: "/careers",
  keywords: [
    "Meelte careers",
    "jobs at Meelte",
    "work at Meelte",
    "startup jobs India",
    "hyperlocal startup hiring",
    "community platform careers",
  ],
});

function getCareersJsonLd() {
  return mergeJsonLd(
    getWebPageJsonLd({
      name: "Careers at Meelte",
      // Quoted verbatim from the hero so the structured data cannot drift.
      description: CAREERS_DIRECT_ANSWER,
      path: "/careers",
      speakableSelectors: ["h1", "h2"],
    }),
    getBreadcrumbsJsonLd(CAREERS_BREADCRUMBS)
  );
}

export default function CareersPage() {
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
        <CareersOpenRoles />
        <CareersCta />
      </main>

      <Footer />
    </div>
  );
}
