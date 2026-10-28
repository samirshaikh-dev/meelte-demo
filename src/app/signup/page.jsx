import React from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { getBreadcrumbsJsonLd } from "@/lib/seo/structured-data";
import { SignupClient } from "./_components/signup-client";

const SIGNUP_BREADCRUMBS = [
  { name: "Home", path: "/" },
  { name: "Sign Up", path: "/signup" },
];

export const metadata = buildPageMetadata({
  title: "Sign Up — Meelte | Your Neighborhood Has More to Offer",
  description:
    "Discover local places, meet people nearby, and stay connected to what's happening around you. Meelte brings your neighborhood closer — available on the mobile app, with the web experience coming soon.",
  path: "/signup",
  keywords: [
    "Meelte sign up",
    "Meelte app download",
    "hyperlocal community app India",
    "discover local places nearby",
    "connect with neighbors",
    "neighborhood platform",
    "Meelte mobile app",
  ],
});

export default function SignupPage() {
  return (
    <div className="flex min-h-screen flex-col bg-canvas selection:bg-primary/20 selection:text-primary">
      {/* Breadcrumb Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getBreadcrumbsJsonLd(SIGNUP_BREADCRUMBS)),
        }}
      />

      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2.5 focus:bg-primary focus:text-white focus:font-bold focus:rounded-xl focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-white"
      >
        Skip to main content
      </a>

      <Navbar />

      <main id="main-content" className="flex-1">
        <SignupClient />
      </main>

      <Footer />
    </div>
  );
}
