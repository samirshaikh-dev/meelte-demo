import React from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import {
  HeroSection,
  BusinessAcquisitionSection,
  FinalConversionCTA,
} from "@/components/sections/home";
import { TrustCredibilitySection, FaqSection } from "@/components/sections/common";
import { FAQ_ITEMS } from "@/constants/faq-constants";
import { getFaqPageJsonLd } from "@/lib/seo/structured-data";

/**
 * Homepage FAQ teaser: a short subset of `src/data/faq.json` (the single copy
 * source). The full set stays on /faq, and the homepage FAQPage JSON-LD is
 * generated from exactly these same items so schema never claims content that
 * is not rendered here.
 */
const HOMEPAGE_FAQ_COUNT = 4;
const HOMEPAGE_FAQS = FAQ_ITEMS.slice(0, HOMEPAGE_FAQ_COUNT);

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

        {/* ── SECTION 3: Dedicated Merchant & Business Acquisition ── */}
        <BusinessAcquisitionSection />

        {/* ── SECTION 4: Trust, Credibility & Institutional Guarantees ── */}
        <TrustCredibilitySection />

        {/* ── SECTION 5: Homepage FAQ Teaser (first 4 questions, full set on /faq) ── */}
        <FaqSection items={HOMEPAGE_FAQS} viewAllHref="/faq" />

        {/* ── SECTION 6: Conversion-Focused Final Dual Action ── */}
        <FinalConversionCTA />
      </main>

      {/* ── SECTION 7: Global Multi-Column Directory Footer ── */}
      <Footer />
    </div>
  );
}
