import React from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { FaqSection } from "@/components/sections/common";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { getBreadcrumbsJsonLd, getFaqPageJsonLd } from "@/lib/seo/structured-data";
import { FAQ_ITEMS } from "@/constants/faq-constants";
import { SIGNUP_BREADCRUMBS, SignupHero } from "./_components/signup-hero";
import { SignupAreas } from "./_components/signup-areas";
import { SignupSteps } from "./_components/signup-steps";
import { SignupReferral } from "./_components/signup-referral";
import { SignupClose } from "./_components/signup-close";

/**
 * /signup FAQ teaser.
 *
 * Drawn from `src/data/faq.json`, the single copy source: where to get the app,
 * what is free, which cities are live, and how safety is handled. Those are the
 * four questions a visitor deciding whether to install actually asks. Filtering
 * (rather than a hand-written copy of the answers) keeps the accordion and the
 * FAQPage schema identical.
 */
const SIGNUP_FAQ_IDS = ["faq-7", "faq-4", "faq-5", "faq-13"];
const SIGNUP_FAQS = FAQ_ITEMS.filter((faq) => SIGNUP_FAQ_IDS.includes(faq.id));

export const metadata = buildPageMetadata({
  title: "Get the Meelte App — Sign Up & Refer Friends",
  description:
    "Meelte for Android is live on Google Play: time-boxed offers from local shops, local events you can request to join, and one-to-one chat. Refer friends for coins and Amazon vouchers. The web app is still in development.",
  path: "/signup",
  keywords: [
    "Meelte sign up",
    "Meelte app download",
    "hyperlocal community app India",
    "discover local offers nearby",
    "local events near me",
    "connect with neighbors",
    "Meelte referral program",
    "Amazon voucher referral",
  ],
});

/**
 * /signup is a signpost, not a form.
 *
 * Meelte creates accounts inside the Android app (App Store listing is not
 * published, and the web app is still in development), so this page cannot and
 * must not render a sign-up form. It answers "how do I join", "what do I get"
 * and "what does it cost me" in that order, then hands over to Google Play:
 *   1. SignupHero      what the app is and where joining is possible today
 *   2. SignupAreas     the three capabilities, generated from PLATFORM_AREAS
 *   3. SignupSteps     install → allow location → find something nearby
 *   4. SignupReferral  coin and voucher facts, stated without income framing
 *   5. FaqSection      four objection-handling questions, linked to /faq
 *   6. SignupClose     install, read the FAQ, or go to the merchant path
 *
 * The FAQPage graph is built from exactly the questions rendered below, and the
 * BreadcrumbList from the same array the hero renders, so the visible trail and
 * the structured data cannot diverge.
 */
function getSignupJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      getBreadcrumbsJsonLd(SIGNUP_BREADCRUMBS),
      getFaqPageJsonLd(SIGNUP_FAQS),
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
        <FaqSection
          items={SIGNUP_FAQS}
          viewAllHref="/faq"
          title="Before you install."
          description="How to get the app, what it costs, where Meelte works today, and how safety is handled."
        />
        <SignupClose />
      </main>

      <Footer />
    </div>
  );
}
