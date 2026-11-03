import React from "react";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { FaqAccordion } from "@/components/ui/faq-accordion";
import { ArrowRight } from "@/lib/icons";
import { SUPPORT_EMAIL } from "@/config/site";
import { getFaqPageJsonLd } from "@/lib/seo/structured-data";

export const HOMEPAGE_FAQS = [
  {
    id: "home-faq-1",
    question: "What is meelTe and how does the platform work?",
    answer:
      "meelTe is a hyperlocal community platform for discovering time-boxed offers from nearby shops, local events, and people around you. The app sorts nearby ads and events by proximity to your current location.",
  },
  {
    id: "home-faq-2",
    question: "How does meelTe protect user location and data privacy?",
    answer:
      "meelTe uses your location strictly to display nearby listings and determine active local zones. meelTe never sells or shares your location with advertisers or third parties.",
  },
  {
    id: "home-faq-3",
    question: "Where can I download the meelTe app?",
    answer:
      "The official meelTe app is available for download on Google Play for Android and on the App Store for iPhone.",
  },
  {
    id: "home-faq-4",
    question: "Does meelTe charge community members or take event fees?",
    answer:
      "No. meelTe has no subscription fees or in-app charges. Event hosts set joining fees independently and collect them directly, while purchases at local shops are settled directly in-store.",
  },
];

export function getHomeFaqJsonLd() {
  return getFaqPageJsonLd(HOMEPAGE_FAQS);
}

/**
 * Resident-Focused Homepage FAQ Section.
 * Tailored for first-time visitors seeking clarity on platform purpose, privacy,
 * app downloads, and free access.
 */
export function HomeFaq() {
  return (
    <section
      id="faq"
      aria-labelledby="home-faq-heading"
      className="py-16 sm:py-24 bg-surface scroll-mt-20 border-b border-border/80"
    >
      <Container className="max-w-4xl">
        <div className="text-center mb-12 sm:mb-16">
          <h2
            id="home-faq-heading"
            className="text-3xl sm:text-4xl lg:text-[2.6rem] font-extrabold tracking-tight text-foreground leading-tight"
          >
            Clear, honest answers about meelTe.
          </h2>
          <p className="mt-3.5 text-base sm:text-lg text-foreground-secondary leading-relaxed max-w-2xl mx-auto">
            Everything you need to know about privacy, city coverage, merchant listings, events, and app access across Indian neighbourhoods.
          </p>
        </div>

        <FaqAccordion items={HOMEPAGE_FAQS} />

        <div className="mt-8 text-center">
          <Link
            href="/faq"
            className="inline-flex items-center gap-1.5 rounded text-sm font-bold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2"
          >
            <span>See all questions</span>
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-12 text-center p-6 rounded-3xl bg-canvas border border-border/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left">
            <span className="text-sm font-bold text-foreground block">
              Have a specific question about your neighborhood or business?
            </span>
            <span className="text-xs text-foreground-secondary">
              Our support team can help.
            </span>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <a
              href={`mailto:${SUPPORT_EMAIL}?subject=meelTe%20Inquiry`}
              className="rounded text-xs font-bold text-primary hover:underline px-3 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2"
            >
              Contact our team
            </a>
            <Link
              href="/for-merchants"
              className="text-xs font-bold text-foreground bg-surface hover:bg-surface-subtle border border-border px-3.5 py-2 rounded-xl transition-colors shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2"
            >
              Merchant desk
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default HomeFaq;

