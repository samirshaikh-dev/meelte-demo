import React from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/layout/container";
import {
  ContactHero,
  ContactForm,
  ContactDetails,
  ContactFaq,
  CONTACT_BREADCRUMBS,
  CONTACT_DESCRIPTION,
  getContactFaqJsonLd,
} from "@/components/sections/contact";
import { buildPageMetadata } from "@/lib/seo/metadata";
import {
  getBreadcrumbsJsonLd,
  getContactPageJsonLd,
  mergeJsonLd,
} from "@/lib/seo/structured-data";

export const metadata = buildPageMetadata({
  title: "Contact meelTe — Support, Merchants & Partnerships",
  description: CONTACT_DESCRIPTION,
  path: "/contact",
  keywords: [
    "Contact meelTe",
    "meelTe support",
    "meelTe phone number",
    "merchant onboarding",
    "meelTe registered office",
    "meelTe Bodh Gaya",
  ],
});

function getContactJsonLd() {
  return mergeJsonLd(
    getContactPageJsonLd({ description: CONTACT_DESCRIPTION }),
    getContactFaqJsonLd(),
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

        <section className="border-b border-border/80 bg-canvas py-10 sm:py-14 lg:py-16">
          <Container>
            <div className="grid items-start gap-8 lg:grid-cols-12">
              <div className="lg:col-span-5 order-2 lg:order-1">
                <ContactDetails />
              </div>
              <div className="lg:col-span-7 order-1 lg:order-2">
                <ContactForm />
              </div>
            </div>
          </Container>
        </section>

        <ContactFaq />
      </main>

      <Footer />
    </div>
  );
}
