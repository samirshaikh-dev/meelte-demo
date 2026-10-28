import React from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import {
  HeroSection,
  BusinessAcquisitionSection,
  HyperlocalDiscoverySection,
  FinalConversionCTA,
} from "@/components/sections/home";
import { TrustCredibilitySection, FaqSection } from "@/components/sections/common";
import { FAQ_ITEMS } from "@/constants/faq-constants";
import { getFaqPageJsonLd } from "@/lib/seo/structured-data";

export default function HomePage() {
  const faqJsonLd = getFaqPageJsonLd(FAQ_ITEMS);

  return (
    <div className="flex min-h-screen flex-col bg-canvas selection:bg-primary/20 selection:text-primary">
      {/* Schema.org FAQPage for AEO & Google Rich Results */}
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

        {/* ── SECTION 5: Organic Discovery across Bengaluru, Gaya & Ranchi Hubs ── */}
        <HyperlocalDiscoverySection />

        {/* ── SECTION 6: Dual-Audience FAQ Accordion ── */}
        <FaqSection />

        {/* ── SECTION 7: Conversion-Focused Final Dual Action ── */}
        <FinalConversionCTA />
      </main>

      {/* ── SECTION 8: Global Multi-Column Directory Footer ── */}
      <Footer />
    </div>
  );
}
