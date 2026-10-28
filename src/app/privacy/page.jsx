import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/layout/container";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { getBreadcrumbsJsonLd } from "@/lib/seo/structured-data";
import { Mail, Phone, MapPin } from "@/lib/icons";

const PRIVACY_BREADCRUMBS = [
  { name: "Home", path: "/" },
  { name: "Privacy Policy", path: "/privacy" },
];

export const metadata = buildPageMetadata({
  title: "Privacy Policy — Meelte",
  description:
    "How Meelte collects, uses, and protects your personal information. Read our official privacy policy.",
  path: "/privacy",
  keywords: [
    "Meelte Privacy Policy",
    "Meelte privacy",
    "data protection Meelte",
    "account deletion Meelte",
    "location data Meelte",
  ],
});

export default function PrivacyPolicyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-surface text-foreground selection:bg-primary/20 selection:text-primary">
      {/* Breadcrumb Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getBreadcrumbsJsonLd(PRIVACY_BREADCRUMBS)),
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
            <Breadcrumbs items={PRIVACY_BREADCRUMBS} className="mb-4" />
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground">
              Privacy Policy
            </h1>
            <p className="mt-3 text-lg sm:text-xl text-foreground-secondary leading-relaxed">
              How Meelte collects, uses, and protects your information.
            </p>
            <div className="mt-3 text-sm text-foreground-muted font-medium">
              Effective Date: October 2026
            </div>
          </div>

          {/* Policy Content — Full Container Width */}
          <div className="pt-8 space-y-12 text-foreground-secondary text-base sm:text-lg leading-relaxed">
            {/* Introduction */}
            <p className="text-foreground text-lg sm:text-xl font-normal leading-relaxed">
              At Meelte, we are committed to protecting your privacy and personal information. This Privacy Policy explains how we collect, use, store, share, and protect your information when you access or use the Meelte platform.
            </p>

            {/* Section 1 */}
            <section className="space-y-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                1. Information We Collect
              </h2>
              <p>We may collect the following types of information:</p>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-foreground">Account Information</h3>
                  <ul className="mt-2.5 list-disc list-inside space-y-1 pl-1">
                    <li>Name</li>
                    <li>Email address</li>
                    <li>Mobile number</li>
                    <li>Profile picture</li>
                    <li>User preferences</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-foreground">Event Information</h3>
                  <ul className="mt-2.5 list-disc list-inside space-y-1 pl-1">
                    <li>Events you create</li>
                    <li>Events you join</li>
                    <li>Event participation details</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-foreground">Advertisement Information</h3>
                  <ul className="mt-2.5 list-disc list-inside space-y-1 pl-1">
                    <li>Advertisements you publish</li>
                    <li>Advertisement details and media</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-foreground">Content You Share</h3>
                  <ul className="mt-2.5 list-disc list-inside space-y-1 pl-1">
                    <li>Posts</li>
                    <li>Comments</li>
                    <li>Photos</li>
                    <li>Videos</li>
                    <li>Messages</li>
                    <li>Reviews</li>
                    <li>Phone Contact List</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-foreground">Device Information</h3>
                  <ul className="mt-2.5 list-disc list-inside space-y-1 pl-1">
                    <li>Device type</li>
                    <li>Operating system</li>
                    <li>Browser information</li>
                    <li>App version</li>
                    <li>Device identifiers</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-foreground">Usage Information</h3>
                  <ul className="mt-2.5 list-disc list-inside space-y-1 pl-1">
                    <li>Features accessed</li>
                    <li>Time spent on platform</li>
                    <li>Interactions with users, events and advertisements</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-foreground">Location Information</h3>
                  <p className="mt-2 text-foreground-secondary">
                    With your permission, we may collect location information to provide localised services, events, and nearby opportunities.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 2 */}
            <section className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                2. How We Use Your Information
              </h2>
              <ul className="list-disc list-inside space-y-2 pl-1">
                <li>Create and manage user accounts</li>
                <li>Provide platform services</li>
                <li>Enable event participation</li>
                <li>Display advertisements and offers</li>
                <li>Improve user experience</li>
                <li>Send notifications</li>
                <li>Respond to support requests</li>
                <li>Prevent fraud and abuse</li>
                <li>Ensure platform security</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            {/* Section 3 */}
            <section className="space-y-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                3. Sharing of Information
              </h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-foreground">With Other Users</h3>
                  <ul className="mt-2.5 list-disc list-inside space-y-1 pl-1">
                    <li>Name</li>
                    <li>Profile photo</li>
                    <li>Event participation</li>
                    <li>Public posts</li>
                    <li>Advertisements</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-foreground">Service Providers</h3>
                  <p className="mt-2 text-foreground-secondary">We may share information with trusted third-party providers for:</p>
                  <ul className="mt-2 list-disc list-inside space-y-1 pl-1">
                    <li>Cloud hosting</li>
                    <li>Analytics</li>
                    <li>Notifications</li>
                    <li>Customer support</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-foreground">Legal Requirements</h3>
                  <p className="mt-2 text-foreground-secondary">
                    We may disclose information when required by law, court order, or regulatory authorities.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 4 */}
            <section className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                4. Data Storage and Security
              </h2>
              <p>
                We implement reasonable administrative, technical, and organisational measures to safeguard personal information. However, no system can guarantee complete security, and users acknowledge that data transmission over the internet carries inherent risks.
              </p>
            </section>

            {/* Section 5 */}
            <section className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                5. Account Deletion
              </h2>
              <p>Users may request account deletion through:</p>
              <ul className="list-disc list-inside space-y-1.5 pl-1">
                <li>Application settings</li>
                <li>Customer support</li>
              </ul>
              <div className="pt-2">
                <h3 className="text-lg sm:text-xl font-semibold text-foreground">Upon deletion:</h3>
                <ul className="mt-2.5 list-disc list-inside space-y-1.5 pl-1">
                  <li>Profile information may be removed</li>
                  <li>Access to the platform may cease</li>
                  <li>Certain records may be retained where legally required</li>
                </ul>
              </div>
            </section>

            {/* Section 6 */}
            <section className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                6. Your Rights
              </h2>
              <ul className="list-disc list-inside space-y-2 pl-1">
                <li>Access personal information</li>
                <li>Correct inaccurate information</li>
                <li>Request account deletion</li>
                <li>Withdraw permissions where applicable</li>
              </ul>
            </section>

            {/* Section 7 */}
            <section className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                7. Third-Party Services
              </h2>
              <p>
                Meelte may integrate with third-party services. Their privacy practices are governed by their own privacy policies, and Meelte is not responsible for third-party privacy practices.
              </p>
            </section>

            {/* Section 8 */}
            <section className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                8. Changes to This Privacy Policy
              </h2>
              <p>
                We may update this Privacy Policy periodically. Continued use of Meelte following updates constitutes acceptance of the revised Privacy Policy.
              </p>
            </section>

            {/* Section 9 */}
            <section className="space-y-4 pt-4 border-t border-border/80">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                9. Contact Us
              </h2>
              <div className="space-y-2 text-foreground font-medium">
                <div className="font-bold text-lg text-foreground">
                  Meelte Private Limited
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-foreground-secondary">📧</span>
                  <a
                    href="mailto:support@meelte.com"
                    className="text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded"
                  >
                    support@meelte.com
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-foreground-secondary">📞</span>
                  <a
                    href="tel:+918884524444"
                    className="text-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded"
                  >
                    +91-8884524444
                  </a>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-foreground-secondary">📍</span>
                  <span className="text-foreground-secondary">
                    Pratistha, Ward No. 14, LIC Gali, Upadhyay Bigha, Sujata Bypass, Rajapur, Bodh Gaya, Bihar – 824231, India
                  </span>
                </div>
              </div>
            </section>
          </div>
        </Container>
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
