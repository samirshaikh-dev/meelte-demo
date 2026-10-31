import React from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/layout/container";
import { ContactHero } from "./_components/contact-hero";
import { ContactForm } from "./_components/contact-form";
import { ContactDetails } from "./_components/contact-details";
import {
  CONTACT_BREADCRUMBS,
  CONTACT_DESCRIPTION,
} from "./_components/contact-content";
import { buildPageMetadata } from "@/lib/seo/metadata";
import {
  getBreadcrumbsJsonLd,
  getContactPageJsonLd,
  mergeJsonLd,
} from "@/lib/seo/structured-data";

/**
 * /contact
 *
 * Visual rebuild only — every block the previous version published is still here:
 * the "How can we help?" headline and lead, the support email, the phone number,
 * the support hours, the form with the same six fields and the same validation
 * copy, the registered office with its Maps link, and the privacy note.
 *
 * What changed:
 * - One trail. `page.jsx` and `contact-hero.jsx` each declared their own
 *   `CONTACT_BREADCRUMBS`, and the hero's copy had no `path` on the last item, so
 *   `getBreadcrumbsJsonLd` emitted the homepage URL for this page. Both now import
 *   the single array from `contact-content.js`.
 * - One client island. `ContactClient` wrapped the form *and* the aside in a
 *   `"use client"` boundary; the aside is a server component now and only the form
 *   hydrates.
 * - The support channels moved from the bottom of the aside into the hero, where
 *   the visitor's first choice — form or direct contact — is on one screen.
 * - The aside sticks beside the form at `lg` instead of trailing off into space.
 * - `title` no longer renders the brand twice ("Get in Touch — Meelte | Meelte"),
 *   and the description is one string shared by the meta tag and the JSON-LD.
 *   The previous description claimed a "presence in Bengaluru, Gaya & Ranchi"
 *   that this page never showed, so it now states what the page actually says.
 *
 * Schema: ContactPage + BreadcrumbList, merged into one graph.
 */
export const metadata = buildPageMetadata({
  title: "Contact Meelte — Support, Merchants & Partnerships",
  description: CONTACT_DESCRIPTION,
  path: "/contact",
  keywords: [
    "Contact Meelte",
    "Meelte support",
    "Meelte phone number",
    "merchant onboarding",
    "Meelte registered office",
    "Meelte Bodh Gaya",
  ],
});

function getContactJsonLd() {
  return mergeJsonLd(
    getContactPageJsonLd({ description: CONTACT_DESCRIPTION }),
    getBreadcrumbsJsonLd(CONTACT_BREADCRUMBS)
  );
}

export default function ContactPage() {
  const jsonLd = getContactJsonLd();

  return (
    <div className="flex min-h-screen flex-col bg-canvas selection:bg-primary/20 selection:text-primary">
      {jsonLd.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}

      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2.5 focus:bg-primary focus:text-white focus:font-bold focus:rounded-xl focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-white"
      >
        Skip to main content
      </a>

      <Navbar />

      <main id="main-content" tabIndex={-1} className="flex-1">
        <ContactHero />

        <section className="py-10 sm:py-14 lg:py-16">
          <Container>
            <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(17rem,0.75fr)] lg:gap-8">
              <ContactForm />
              <ContactDetails />
            </div>
          </Container>
        </section>
      </main>

      <Footer />
    </div>
  );
}
