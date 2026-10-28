import React from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { DiscoverClient, DISCOVERY_CATEGORIES } from "@/components/sections/discover";
import { TrustCredibilitySection, FaqSection } from "@/components/sections/common";
import { FinalConversionCTA } from "@/components/sections/home";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { getCollectionPageJsonLd } from "@/lib/seo/structured-data";
import { APP_URL } from "@/config/site";
import { DiscoverHero } from "./_components/discover-hero";

export const metadata = buildPageMetadata({
  title: "Discover Local Food, Fashion, Events & Services | Meelte",
  description:
    "Explore authentic neighborhood cafes, artisanal boutiques, weekend community runs, verified home services and local jobs across Bengaluru, Gaya, and Ranchi on Meelte.",
  path: "/discover",
  keywords: [
    "hyperlocal discovery",
    "neighborhood cafes",
    "local boutiques",
    "community events",
    "home services Bengaluru",
    "local discovery Gaya",
    "Ranchi local business",
    "local jobs near me",
    "find local services",
    "discover nearby offers",
  ],
});

function getDiscoverJsonLd() {
  const collectionItems = DISCOVERY_CATEGORIES.map((cat) => ({
    name: cat.name,
    path: `/discover#${cat.id}`,
  }));

  const collectionJsonLd = getCollectionPageJsonLd({
    name: "Meelte Hyperlocal Discovery Directory",
    description:
      "Community directory of local dining, fashion, events, services, and health studios across Indian neighborhoods.",
    path: "/discover",
    items: collectionItems,
  });

  return {
    "@context": "https://schema.org",
    "@graph": [
      collectionJsonLd,
      {
        "@type": "BreadcrumbList",
        "@id": `${APP_URL}/discover#breadcrumb`,
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
            name: "Discover",
            item: `${APP_URL}/discover`,
          },
        ],
      },
    ].filter(Boolean),
  };
}

export default function DiscoverPage() {
  const jsonLd = getDiscoverJsonLd();

  return (
    <div className="flex min-h-screen flex-col bg-canvas selection:bg-primary/20 selection:text-primary">
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />

      {/* Accessible Skip-to-Main-Content Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2.5 focus:bg-primary focus:text-white focus:font-bold focus:rounded-xl focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-white"
      >
        Skip to main content
      </a>

      {/* Brand Navigation Header */}
      <Navbar />

      {/* Main Content Landmark */}
      <main id="main-content" className="flex-1">
        <DiscoverHero />

        <div id="discover-listings">
          <DiscoverClient />
        </div>

        <TrustCredibilitySection />
        <FaqSection />
        <FinalConversionCTA />
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}

