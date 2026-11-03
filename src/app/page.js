import React from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import {
  HeroSection,
  HyperlocalDifferenceSection,
  HomeJourneySection,
  ProductExperienceSection,
  TrustBoundariesSection,
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
        {/* ── SECTION 2: Text-First, Buyer-Centred Hero with Dual Store CTAs ── */}
        <HeroSection />

        {/* ── SECTION 3: The Hyperlocal Difference (Why meelTe vs chaotic feeds) ── */}
        <HyperlocalDifferenceSection />

        {/* ── SECTION 4: Predictable 3-Step Journey for Residents & Merchants ── */}
        <HomeJourneySection />

        {/* ── SECTION 5: In-App Capabilities Tour ── */}
        <ProductExperienceSection />

        {/* ── SECTION 6: Honest Boundaries & Operational Limits (Psychology §4 & §6) ── */}
        <TrustBoundariesSection />

        {/* ── SECTION 7: Resident-Focused FAQ Teaser ── */}
        <FaqSection items={HOMEPAGE_FAQS} viewAllHref="/faq" />

        {/* ── SECTION 8: Dual-Audience Conversion Closer ── */}
        <FinalConversionCTA />
      </main>

      {/* ── Global multi-column directory footer ── */}
      <Footer />
    </div>
  );
}
