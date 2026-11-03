import React from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import {
  AboutHero,
  AboutStory,
  AboutMission,
  AboutVision,
  AboutCapabilities,
  AboutFaq,
  AboutCta,
  ABOUT_BREADCRUMBS,
  ABOUT_DESCRIPTION,
  getAboutFaqJsonLd,
} from "@/components/sections/about";
import { buildPageMetadata } from "@/lib/seo/metadata";
import {
  getAboutPageJsonLd,
  getBreadcrumbsJsonLd,
  mergeJsonLd,
} from "@/lib/seo/structured-data";

/**
 * /about
 *
 * Visual rebuild only — every content block from the previous version is still
 * here, in the same order: hero → our story → our mission → our vision → what we
 * do → why choose meelTe. What changed is the arrangement, the type scale, the token
 * usage and the section rhythm:
 *
 * - One hero. `components/sections/about/about-hero.jsx` used to be an orphaned client-side
 *   alternate hero that nothing imported while the real hero sat inline in this
 *   file; it is now the single server-rendered hero.
 * - Five centred "heading + grid of identical cards" sections became five different
 *   shapes: an asymmetric split, a three-act ruled list, two full-width rows, four
 *   bordered cells with a `<blockquote>`, and a 3×2 bento with the summary in the
 *   sixth cell. meelTe-context.md §4 asks for exactly that.
 * - The `<h1>` gradient ends in `primary-royal` instead of `accent`; amber
 *   `#F59E0B` as text measures 2.15:1 on this canvas (docs/Design.md §9.8).
 * - Sections carry `id`s matching `ABOUT_ON_THIS_PAGE`, so every section is
 *   deep-linkable and the hero can offer wayfinding.
 *
 * Title note: `buildPageMetadata` runs the title through the root `%s | meelTe`
 * template in src/lib/seo/metadata.js. The previous "About meelTe — Why We Built
 * meelTe" rendered as "About meelTe — Why We Built meelTe | meelTe": the brand three
 * times, saying the same thing twice. The title below survives the template and
 * spends its words on what the page is actually about. Changing the template itself
 * is a site-wide decision and out of scope here.
 *
 * Schema: AboutPage + BreadcrumbList. `AboutPage.description` is passed the same
 * string as the meta description, so schema and page cannot diverge.
 */
export const metadata = buildPageMetadata({
  title: "About meelTe — Why We Built a Hyperlocal App",
  description: ABOUT_DESCRIPTION,
  path: "/about",
  keywords: [
    "About meelTe",
    "meelTe story",
    "hyperlocal community app India",
    "local community platform",
    "why choose meelTe",
  ],
});

function getAboutJsonLd() {
  return mergeJsonLd(
    getAboutPageJsonLd({ description: ABOUT_DESCRIPTION }),
    getAboutFaqJsonLd(),
    getBreadcrumbsJsonLd(ABOUT_BREADCRUMBS)
  );
}

export default function AboutPage() {
  const jsonLd = getAboutJsonLd();

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

      <main id="main-content" tabIndex={-1} className="flex-1">
        <AboutHero />
        <AboutStory />
        <AboutMission />
        <AboutVision />
        <AboutCapabilities />
        <AboutFaq />
        <AboutCta />
      </main>

      <Footer />
    </div>
  );
}
