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
  title: "How Meelte Works — Offers, Events, Chat & Roles",
  description:
    "See how Meelte works for residents, shops, and event hosts: time-boxed offers from nearby businesses, events you request to join, and one-to-one chat. Live in Bengaluru, Gaya and Ranchi.",
  path: "/how-it-works",
  keywords: [
    "how Meelte works",
    "Meelte platform explained",
    "hyperlocal discovery app India",
    "local shop offers near me",
    "list an offer on Meelte",
    "local merchant platform India",
    "Meelte for residents",
    "Meelte for merchants",
    "Meelte for event hosts",
    "Meelte app walkthrough",
    "location based offers India",
    "neighborhood discovery platform",
    "community platform Bengaluru",
    "local events Gaya Ranchi",
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
        name: "How to Use Meelte — Step-by-Step for Residents & Shops",
        description:
          "Meelte shows nearby shop offers, local events and one-to-one chat in Bengaluru, Gaya, and Ranchi.",
        url: `${APP_URL}/how-it-works`,
        step: [
          {
            "@type": "HowToStep",
            name: "Download the Meelte App",
            text: "Install the Meelte app from the Google Play Store. The Android app is live; the web app is still in development.",
            url: `${APP_URL}/how-it-works#download`,
          },
          {
            "@type": "HowToStep",
            name: "Set your maximum distance",
            text: "Allow location access so the feed can be sorted by distance. The \"Max distance\" filter defaults to 60 km and you can narrow it.",
            url: `${APP_URL}/how-it-works#ecosystem`,
          },
          {
            "@type": "HowToStep",
            name: "Browse offers and events nearby",
            text: "See time-boxed offers from nearby shops and local events with their joining cost. Offers leave the feed when their end date passes.",
            url: `${APP_URL}/how-it-works#product-tour`,
          },
          {
            "@type": "HowToStep",
            name: "Reach out directly",
            text: "Get one-tap Google Maps directions to the shop or venue, follow shops for their next offer, and ask a host to join an event. Meelte does not take payments or commissions.",
            url: `${APP_URL}/how-it-works#product-tour`,
          },
        ],
      },
      {
        "@type": "ItemList",
        "@id": `${APP_URL}/how-it-works#roles`,
        name: "Who Meelte Is For",
        description:
          "Meelte serves four roles in the neighbourhood ecosystem.",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Everyday Residents",
            description:
              "Browse time-boxed offers from nearby shops and local events, sorted by distance, with directions to the shop or venue.",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Shops & Service Businesses",
            description:
              "Post a single-product ad or a shop catalogue of up to 100 items, with a price or discount and a defined run of dates. Onboarded in person by the field team.",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "Event Hosts & Clubs",
            description:
              "Publish local events with a joining cost and approve attendees through join requests that state group size.",
          },
          {
            "@type": "ListItem",
            position: 4,
            name: "Neighbours & New Arrivals",
            description:
              "Add friends, follow shops and hosts, and talk one to one with text, documents, location sharing, and audio or video calls.",
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

        {/* ── SECTION 1: The Meelte Ecosystem — WHO it's for (4 roles) ── */}
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

