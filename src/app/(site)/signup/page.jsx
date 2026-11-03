import React from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { getBreadcrumbsJsonLd } from "@/lib/seo/structured-data";
import {
  SIGNUP_BREADCRUMBS,
  SignupHero,
  SignupAreas,
  SignupSteps,
  SignupReferral,
  SignupClose,
  SignupFaq,
  getSignupFaqJsonLd,
} from "@/components/sections/signup";

export const metadata = buildPageMetadata({
  title: "Get the meelTe App — Sign Up & Refer Friends",
  description:
    "meelTe is live on Google Play and the App Store: time-boxed local offers, events you can join, and one-to-one chat across Indian neighbourhoods.",
  path: "/signup",
  keywords: [
    "meelTe sign up",
    "meelTe app download",
    "hyperlocal community app India",
    "discover local offers nearby",
    "local events near me",
    "connect with neighbors",
    "meelTe referral program",
    "Amazon voucher referral",
  ],
});

/**
 * /signup is a signpost, not a form.
 *
 * meelTe creates accounts inside the mobile app (both store listings are live),
 * so this page answers "how do I join", "what do I get" and "what does it cost me"
 * in that order, then hands over to the store listings:
 *   1. SignupHero      what the app is and where joining is possible today
 *   2. SignupAreas     the three capabilities, generated from PLATFORM_AREAS
 *   3. SignupSteps     install → allow location → find something nearby
 *   4. SignupReferral  coin and voucher facts, stated without income framing
 *   5. SignupFaq       four objection-handling questions, linked to /faq
 *   6. SignupClose     install, read the FAQ, or go to the merchant path
 */
function getSignupJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      getBreadcrumbsJsonLd(SIGNUP_BREADCRUMBS),
      getSignupFaqJsonLd(),
    ].filter(Boolean),
  };
}

export default function SignupPage() {
  const jsonLd = getSignupJsonLd();

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

      <Navbar />

      <main id="main-content" className="flex-1">
        <SignupHero />
        <SignupAreas />
        <SignupSteps />
        <SignupReferral />
        <SignupFaq />
        <SignupClose />
      </main>

      <Footer />
    </div>
  );
}
