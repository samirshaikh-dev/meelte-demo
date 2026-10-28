import React from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ContactClient } from "@/components/sections/contact/contact-client";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { getContactPageJsonLd, getBreadcrumbsJsonLd } from "@/lib/seo/structured-data";
import { ContactHero } from "./_components/contact-hero";

const CONTACT_BREADCRUMBS = [
  { name: "Home", path: "/" },
  { name: "Contact Us", path: "/contact" },
];

export const metadata = buildPageMetadata({
  title: "Get in Touch — Meelte",
  description:
    "Questions, feedback, partnerships, or support for Meelte. Reach out for merchant onboarding, community inquiries, or general questions. Based in Bodh Gaya with presence in Bengaluru, Gaya & Ranchi.",
  path: "/contact",
  keywords: [
    "Contact Meelte",
    "Meelte support",
    "merchant onboarding India",
    "local business partnership",
    "community feedback",
    "Bengaluru Meelte",
    "Gaya local merchants",
    "Ranchi community inquiries",
    "Meelte Bodh Gaya",
  ],
});

export default function ContactPage() {
  const jsonLd = [
    getContactPageJsonLd(),
    getBreadcrumbsJsonLd(CONTACT_BREADCRUMBS),
  ].filter(Boolean);

  return (
    <div className="flex min-h-screen flex-col bg-canvas selection:bg-primary/20 selection:text-primary">
      {/* Schema.org ContactPage + BreadcrumbList JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />

      {/* Accessible Skip Link */}
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
        <ContactHero />
        <ContactClient />
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}

