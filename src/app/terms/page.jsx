import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/layout/container";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { getBreadcrumbsJsonLd } from "@/lib/seo/structured-data";

const TERMS_BREADCRUMBS = [
  { name: "Home", path: "/" },
  { name: "Terms & Conditions", path: "/terms" },
];

export const metadata = buildPageMetadata({
  title: "Terms & Conditions — Meelte",
  description:
    "The rules for using Meelte, for shoppers, event creators, and merchants. Read our official terms and conditions.",
  path: "/terms",
  keywords: [
    "Meelte Terms and Conditions",
    "Meelte terms of service",
    "event creator terms",
    "merchant terms Meelte",
    "platform rules Meelte",
  ],
});

export default function TermsAndConditionsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-surface text-foreground selection:bg-primary/20 selection:text-primary">
      {/* Breadcrumb Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getBreadcrumbsJsonLd(TERMS_BREADCRUMBS)),
        }}
      />

      {/* Accessible Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2.5 focus:bg-primary focus:text-white focus:font-bold focus:rounded-xl focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-white"
      >
        Skip to main content
      </a>

      {/* Global Navbar */}
      <Navbar />

      <main id="main-content" className="flex-1 py-10 sm:py-16">
        <Container>
          {/* Header */}
          <div className="pb-8 border-b border-border/80">
            <Breadcrumbs items={TERMS_BREADCRUMBS} className="mb-4" />
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground">
              Terms & Conditions
            </h1>
            <p className="mt-3 text-lg sm:text-xl text-foreground-secondary leading-relaxed">
              The rules for using Meelte, for shoppers, event creators, and merchants.
            </p>
            <div className="mt-3 text-sm text-foreground-muted font-medium">
              Effective Date: October 2026
            </div>
          </div>

          {/* Terms Content — Full Container Width */}
          <div className="pt-8 space-y-12 text-foreground-secondary text-base sm:text-lg leading-relaxed">
            {/* Preamble */}
            <p className="text-foreground text-lg sm:text-xl font-normal leading-relaxed">
              Creating an account, logging in, accessing, or using Meelte, you acknowledge that you have read, understood, and agreed to these Terms & Conditions, our Privacy Policy, Community Guidelines, and all applicable laws.
            </p>

            {/* Section 1 */}
            <section className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                1. Eligibility
              </h2>
              <p>You must be at least 13 years of age to create an account, access, or use Meelte.</p>
              <ul className="list-disc list-inside space-y-1.5 pl-1">
                <li>You are at least 13 years old</li>
                <li>You have the legal capacity to enter into a binding agreement</li>
                <li>All information provided is accurate and complete</li>
              </ul>
            </section>

            {/* Section 2 */}
            <section className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                2. Nature of the Platform
              </h2>
              <p>
                Meelte is a technology platform that enables users to discover events, create events, publish advertisements, connect with other users, and share content and experiences.
              </p>
              <p>
                Meelte is not an event organiser, advertiser, broker, recruitment agency, seller of goods, promoter, contractor, or service provider.
              </p>
            </section>

            {/* Section 3 */}
            <section className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                3. User Accounts
              </h2>
              <p>
                Users are responsible for maintaining the confidentiality of account credentials and all activities performed through their account.
              </p>
              <ul className="list-disc list-inside space-y-1.5 pl-1">
                <li>Do not share login credentials</li>
                <li>Do not create fake accounts</li>
                <li>Do not impersonate another person or organisation</li>
                <li>Do not access accounts that do not belong to you</li>
              </ul>
            </section>

            {/* Section 4 */}
            <section className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                4. User Generated Content
              </h2>
              <p>
                Users may create and publish events, advertisements, posts, comments, photos, videos, messages, reviews, and profile information. Users remain solely responsible for the content they publish.
              </p>
            </section>

            {/* Section 5 */}
            <section className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                5. Event Creator Responsibilities
              </h2>
              <p>Event creators are solely responsible for:</p>
              <ul className="list-disc list-inside space-y-1.5 pl-1">
                <li>Event planning and execution</li>
                <li>Venue arrangements</li>
                <li>Event safety and security</li>
                <li>Obtaining required permissions</li>
                <li>Legal compliance</li>
                <li>Ticketing and refunds</li>
              </ul>
              <p className="mt-2 text-foreground font-medium">
                Meelte does not organise, supervise, endorse, or guarantee any event listed on the platform.
              </p>
            </section>

            {/* Section 6 */}
            <section className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                6. Advertisement Responsibility
              </h2>
              <p>
                Advertisers are solely responsible for advertisement content, pricing, claims, product quality, legal compliance, and all related obligations.
              </p>
              <ul className="list-disc list-inside space-y-1.5 pl-1">
                <li>No fraudulent advertisements</li>
                <li>No counterfeit products</li>
                <li>No scams or misleading claims</li>
                <li>No illegal products or services</li>
              </ul>
            </section>

            {/* Section 7 */}
            <section className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                7. Prohibited Content and Conduct
              </h2>
              <p>
                Users must not publish content that is illegal, abusive, threatening, misleading, fraudulent, obscene, hateful, or harmful.
              </p>
              <ul className="list-disc list-inside space-y-1.5 pl-1">
                <li>Illegal content</li>
                <li>Hate speech</li>
                <li>Harassment</li>
                <li>Pornographic material</li>
                <li>Fraudulent activity</li>
                <li>Malware or harmful software</li>
              </ul>
            </section>

            {/* Section 8 */}
            <section className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                8. Community Safety
              </h2>
              <p>
                Users interact with others at their own discretion and risk. Meelte does not guarantee the identity, intentions, behaviour, or reliability of users.
              </p>
            </section>

            {/* Section 9 */}
            <section className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                9. Account Deletion
              </h2>
              <p>
                Users may request account deletion through application settings or support channels. Certain information may be retained where required by law.
              </p>
            </section>

            {/* Section 10 */}
            <section className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                10. Limitation of Liability
              </h2>
              <p>
                To the maximum extent permitted by law, Meelte shall not be liable for user conduct, advertisements, events, transactions, product defects, service quality issues, personal injury, property damage, financial losses, or disputes between users.
              </p>
            </section>

            {/* Section 11 */}
            <section className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                11. Changes to Terms
              </h2>
              <p>
                Meelte may update these Terms & Conditions from time to time. Continued use of the platform constitutes acceptance of the updated terms.
              </p>
            </section>

            {/* Section 12 */}
            <section className="space-y-4 pt-4 border-t border-border/80">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                12. Governing Law
              </h2>
              <p>
                These Terms & Conditions shall be governed by the laws of India. Any dispute arising out of or relating to the platform shall be subject to the exclusive jurisdiction of the courts of Gaya, Bihar, India.
              </p>
            </section>
          </div>
        </Container>
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}

