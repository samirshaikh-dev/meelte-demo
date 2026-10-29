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
  title: "List Your Shop on Meelte — 0% Commission Local Offers",
  description:
    "Promote your shop to nearby residents on Meelte with 0% commission. Publish a single offer or a catalogue of up to 100 items, with a price, a discount and a defined run of dates. Live in Bengaluru, Gaya & Ranchi.",
  path: "/for-merchants",
  keywords: [
    "list business on Meelte",
    "local business listing India",
    "zero commission food delivery alternative",
    "promote local business",
    "hyperlocal business listing",
    "shop listing near me",
    "grow local store",
    "Meelte for merchants",
    "0% commission business platform",
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
        name: "How to List Your Business on Meelte",
        description:
          "Promote a local shop to nearby residents with a time-boxed offer and no commission deducted.",
        url: `${APP_URL}/for-merchants`,
        step: [
          {
            "@type": "HowToStep",
            name: "Submit an enquiry",
            text: "Send your business name, category, phone number, and city, or call the merchant desk directly.",
            url: `${APP_URL}/for-merchants#merchant-enquiry`,
          },
          {
            "@type": "HowToStep",
            name: "Meet the field team",
            text: "A member of Meelte's field team visits the shop in person and sets up the profile.",
            url: `${APP_URL}/for-merchants#merchant-enquiry`,
          },
          {
            "@type": "HowToStep",
            name: "Publish your first offer",
            text: "Add a single product or a catalogue of up to 100 items with a price or discount and the dates it should run. It goes live at 12:00 AM on the start date.",
            url: `${APP_URL}/for-merchants#merchant-enquiry`,
          },
        ],
      },
      {
        "@type": "Service",
        "@id": `${APP_URL}/for-merchants#service`,
        name: "Meelte Merchant Onboarding — Local Business Promotion",
        description:
          "Local business promotion for shops, cafes and service businesses: publish time-boxed offers to nearby residents. Meelte deducts no commission on a sale.",
        provider: {
          "@id": `${APP_URL}#organization`,
        },
        areaServed: [
          { "@type": "City", name: "Bengaluru" },
          { "@type": "City", name: "Gaya" },
          { "@type": "City", name: "Ranchi" },
        ],
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
