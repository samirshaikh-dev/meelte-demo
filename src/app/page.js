import React from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import {
  HeroSection,
  ProductExperienceSection,
  FinalConversionCTA,
} from "@/components/sections/home";
import { FaqSection } from "@/components/sections/common";
import { FAQ_ITEMS } from "@/constants/faq-constants";
import { getFaqPageJsonLd } from "@/lib/seo/structured-data";

/**
 * The homepage FAQ stays resident-focused; merchant details live on
 * /for-merchants. JSON-LD uses this exact subset so it matches the page.
 */
const HOMEPAGE_FAQ_IDS = new Set(["faq-1", "faq-2", "faq-5", "faq-7"]);
const HOMEPAGE_FAQS = FAQ_ITEMS.filter((faq) => HOMEPAGE_FAQ_IDS.has(faq.id));

export default function HomePage() {
  const faqJsonLd = getFaqPageJsonLd(HOMEPAGE_FAQS);

  return (
    <div className="flex min-h-screen flex-col bg-canvas selection:bg-primary/20 selection:text-primary">
      {/* Schema.org FAQPage for the questions rendered in the homepage teaser */}
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqJsonLd),
          }}
        />
      )}

      {/* Accessible Skip-to-Main-Content Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2.5 focus:bg-primary focus:text-white focus:font-bold focus:rounded-xl focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-white"
      >
        Skip to main content
      </a>

      {/* ── SECTION 1: Brand Navigation Header ── */}
      <Navbar />

      {/* Main Content Landmark */}
      <main id="main-content" className="flex-1">
        {/* ── SECTION 2: High-Impact Hero with Interactive Community Pulse ── */}
        <HeroSection />

        {/* ── SECTION 3: Resident-focused product walkthrough ── */}
        <ProductExperienceSection />

        {/* ── SECTION 4: Resident-focused FAQ teaser ── */}
        <FaqSection items={HOMEPAGE_FAQS} viewAllHref="/faq" />

        {/* ── SECTION 5: Resident and merchant next steps ── */}
        <FinalConversionCTA />
      </main>

      {/* ── Global multi-column directory footer ── */}
      <Footer />
    </div>
  );
}
