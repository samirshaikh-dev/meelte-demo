import React from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { EcosystemSection } from "@/components/sections/home";
import { ProductExperienceSection } from "@/components/sections/home";
import { TrustCredibilitySection, FaqSection } from "@/components/sections/common";
import { FinalConversionCTA } from "@/components/sections/home";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { APP_URL } from "@/config/site";
import { HowItWorksHero } from "./_components/how-it-works-hero";

/* ─────────────────────────────────────────────
   SEO Metadata — per seo-engineer SKILL.md
   Unique title + description per indexable page.
   Canonical URL set via buildPageMetadata.
───────────────────────────────────────────── */
export const metadata = buildPageMetadata({
  title: "How Meelte Works — Roles, Platform & App Experience",
  description:
    "Learn how Meelte works for residents, local merchants, event hosts, service professionals, and job seekers. Free to post in most cases, direct contact with no middlemen, and hyperlocal discovery in Bengaluru, Gaya & Ranchi.",
  path: "/how-it-works",
  keywords: [
    "how Meelte works",
    "Meelte platform explained",
    "hyperlocal discovery app India",
    "local business listing India",
    "how to list business on Meelte",
    "local merchant platform India",
    "Meelte for residents",
    "Meelte for merchants",
    "Meelte for event organizers",
    "Meelte for service professionals",
    "Meelte app walkthrough",
    "location based deals India",
    "neighborhood discovery platform",
    "community platform Bengaluru",
    "local jobs Gaya Ranchi",
  ],
});

/* ─────────────────────────────────────────────
   JSON-LD — HowTo + ItemList for AEO/GEO
   Per seo-engineer: must match actual page content.
───────────────────────────────────────────── */
function getHowItWorksJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "HowTo",
        "@id": `${APP_URL}/how-it-works#howto`,
        name: "How to Use Meelte — Step-by-Step for Residents & Merchants",
        description:
          "Meelte connects residents, local merchants, event hosts, service professionals, and job seekers in hyperlocal neighborhoods across Bengaluru, Gaya, and Ranchi.",
        url: `${APP_URL}/how-it-works`,
        step: [
          {
            "@type": "HowToStep",
            name: "Download the Meelte App",
            text: "Install the Meelte app from Google Play Store. Available for Android devices across India.",
            url: `${APP_URL}/how-it-works#download`,
          },
          {
            "@type": "HowToStep",
            name: "Set your neighborhood radius",
            text: "Allow location access to discover what's nearby. Browse by distance with a default radius of up to 60 km and filter by category.",
            url: `${APP_URL}/how-it-works#ecosystem`,
          },
          {
            "@type": "HowToStep",
            name: "Discover what's nearby",
            text: "Browse listings across categories like Food & Dining, Fashion, Services, Events, and Jobs. Find time-boxed offers and joinable events near you.",
            url: `${APP_URL}/how-it-works#product-tour`,
          },
          {
            "@type": "HowToStep",
            name: "Connect directly",
            text: "Call or WhatsApp merchants and hosts directly from the app. Transactions happen offline — Meelte does not take payments or commissions.",
            url: `${APP_URL}/how-it-works#product-tour`,
          },
        ],
      },
      {
        "@type": "ItemList",
        "@id": `${APP_URL}/how-it-works#roles`,
        name: "Who Meelte Is For",
        description:
          "Meelte serves five distinct roles in the neighborhood ecosystem.",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Everyday Residents",
            description:
              "Discover local dining, fashion boutiques, services, and weekend events nearby. Find time-boxed deals and joinable events with directions to the shop.",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Local Merchants & Shopkeepers",
            description:
              "Post time-boxed offers or a shop catalogue for free in most cases. In-person onboarding is available, with simple tools like photo-to-menu import and AI product images. Connect directly with nearby customers.",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "Event Hosts & Community Clubs",
            description:
              "Publish local events and manage RSVPs with approval controls and group sizes. Share links with neighbors and notify followers of updates.",
          },
          {
            "@type": "ListItem",
            position: 4,
            name: "Service Professionals",
            description:
              "Connect directly with neighborhood clients for local services. Reach people nearby without paying lead-generation fees or broker commissions.",
          },
          {
            "@type": "ListItem",
            position: 5,
            name: "Employers & Local Job Seekers",
            description:
              "Post or find local jobs and connect directly. Focus on nearby opportunities with a short commute.",
          },
        ],
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${APP_URL}/how-it-works#breadcrumb`,
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
            name: "How It Works",
            item: `${APP_URL}/how-it-works`,
          },
        ],
      },
    ],
  };
}

/* ─────────────────────────────────────────────
   Page — SSG (no revalidate needed; static content)
   Per frontend-engineer SKILL.md: SSG for marketing
   pages whose content is the same for every user.
───────────────────────────────────────────── */
export default function HowItWorksPage() {
  const jsonLd = getHowItWorksJsonLd();

  return (
    <div className="flex min-h-screen flex-col bg-canvas selection:bg-primary/20 selection:text-primary">
      {/* ── JSON-LD Structured Data (HowTo + ItemList + BreadcrumbList) ── */}
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
        <HowItWorksHero />

        {/* ── SECTION 1: The Meelte Ecosystem — WHO it's for (5 roles) ── */}
        <EcosystemSection />

        {/* ── SECTION 2: Product Experience — HOW it works in the app ── */}
        <ProductExperienceSection />

        {/* ── SECTION 3: Trust & Credibility ── */}
        <TrustCredibilitySection />

        {/* ── SECTION 4: FAQ — platform-understanding questions ── */}
        <FaqSection />

        {/* ── SECTION 5: Conversion CTA ── */}
        <FinalConversionCTA />
      </main>

      {/* ── Global Footer ── */}
      <Footer />
    </div>
  );
}

