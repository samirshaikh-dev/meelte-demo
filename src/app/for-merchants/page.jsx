import React from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { BusinessAcquisitionSection } from "@/components/sections/home";
import { TrustCredibilitySection, FaqSection } from "@/components/sections/common";
import { FinalConversionCTA } from "@/components/sections/home";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { APP_URL } from "@/config/site";
import { ForMerchantsHero } from "./_components/for-merchants-hero";

/* ─────────────────────────────────────────────
   SEO Metadata — per seo-engineer SKILL.md
   Merchant-focused intent keywords.
───────────────────────────────────────────── */
export const metadata = buildPageMetadata({
  title: "List Your Business on Meelte — 0% Commission Local Store Listing",
  description:
    "Grow your local business on Meelte with 0% commission. List your shop, cafe, boutique, clinic, or service for free. Direct calls & WhatsApp from nearby customers in Bengaluru, Gaya & Ranchi.",
  path: "/for-merchants",
  keywords: [
    "list business on Meelte",
    "free business listing India",
    "zero commission food delivery alternative",
    "promote local business",
    "hyperlocal business listing",
    "shop listing near me",
    "grow local store",
    "Meelte for merchants",
    "0% commission business platform",
    "direct customer marketing India",
    "local business advertising Bengaluru",
    "neighborhood store promotion",
  ],
});

/* ─────────────────────────────────────────────
   JSON-LD — HowTo + Service + BreadcrumbList for AEO/GEO
───────────────────────────────────────────── */
function getForMerchantsJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "HowTo",
        "@id": `${APP_URL}/for-merchants#howto`,
        name: "How to List Your Business on Meelte — Free, 0% Commission",
        description:
          "Get your local store discovered by nearby customers with direct contact and zero commission fees.",
        url: `${APP_URL}/for-merchants`,
        step: [
          {
            "@type": "HowToStep",
            name: "Submit Quick Enquiry",
            text: "Fill out the merchant enquiry form with your business name, category, phone number, and city.",
            url: `${APP_URL}/for-merchants#merchant-enquiry`,
          },
          {
            "@type": "HowToStep",
            name: "Community Verification",
            text: "Our local coordinator verifies your physical presence to maintain a trusted, spam-free directory.",
            url: `${APP_URL}/for-merchants#merchant-enquiry`,
          },
          {
            "@type": "HowToStep",
            name: "Storefront Goes Live",
            text: "Your digital profile, contact details, and catalog become discoverable to nearby residents on the Meelte App.",
            url: `${APP_URL}/for-merchants#merchant-enquiry`,
          },
        ],
      },
      {
        "@type": "Service",
        "@id": `${APP_URL}/for-merchants#service`,
        name: "Meelte Merchant Onboarding — 0% Commission Local Business Listing",
        description:
          "Free business listing platform connecting local merchants directly with nearby customers. No commission cuts, direct phone and WhatsApp contact, hyperlocal discoverability.",
        provider: {
          "@id": `${APP_URL}#organization`,
        },
        areaServed: [
          { "@type": "City", name: "Bengaluru" },
          { "@type": "City", name: "Gaya" },
          { "@type": "City", name: "Ranchi" },
        ],
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "INR",
          description: "Free listing with 0% commission on orders and walk-ins",
          availability: "https://schema.org/InStock",
        },
        serviceType: "Local Business Promotion",
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${APP_URL}/for-merchants#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: APP_URL,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "For Merchants",
            item: `${APP_URL}/for-merchants`,
          },
        ],
      },
    ],
  };
}

export default function ForMerchantsPage() {
  const jsonLd = getForMerchantsJsonLd();

  return (
    <div className="flex min-h-screen flex-col bg-canvas selection:bg-primary/20 selection:text-primary">
      {/* ── JSON-LD Structured Data ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Accessible Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2.5 focus:bg-primary focus:text-white focus:font-bold focus:rounded-xl focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-white"
      >
        Skip to main content
      </a>

      {/* ── Global Navigation ── */}
      <Navbar />

      <main id="main-content" className="flex-1">
        {/* ── HERO ── */}
        <ForMerchantsHero />

        {/* ── Business Acquisition & Comparison ── */}
        <div id="merchant-enquiry">
          <BusinessAcquisitionSection />
        </div>

        {/* ── Trust & Credibility ── */}
        <TrustCredibilitySection />

        {/* ── FAQ ── */}
        <FaqSection />

        {/* ── Conversion CTA ── */}
        <FinalConversionCTA />
      </main>

      {/* ── Global Footer ── */}
      <Footer />
    </div>
  );
}
