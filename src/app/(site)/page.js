import React from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import {
  HeroSection,
  HyperlocalDifferenceSection,
  HomeJourneySection,
  ProductExperienceSection,
  TrustBoundariesSection,
  HomeFaq,
  FinalConversionCTA,
  getHomeFaqJsonLd,
} from "@/components/sections/home";

export default function HomePage() {
  const faqJsonLd = getHomeFaqJsonLd();

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
        <HomeFaq />

        {/* ── SECTION 8: Dual-Audience Conversion Closer ── */}
        {/* <FinalConversionCTA /> */}
      </main>

      {/* ── Global multi-column directory footer ── */}
      <Footer />
    </div>
  );
}
