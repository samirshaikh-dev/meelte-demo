import React from "react";
import { Container } from "@/components/layout/container";
import { FaqAccordion } from "@/components/ui/faq-accordion";
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
      className="py-8 sm:py-12 lg:py-14 bg-surface scroll-mt-20 border-b border-border/80"
    >
      <Container className="max-w-4xl">
        <div className="text-center mb-6 sm:mb-8">
          <h2
            id="home-faq-heading"
            className="text-3xl sm:text-4xl lg:text-[2.6rem] font-extrabold tracking-tight text-foreground leading-tight text-balance"
          >
            Clear, honest answers about meelTe.
          </h2>
          <p className="mt-2 text-base sm:text-lg text-foreground-secondary leading-relaxed max-w-2xl mx-auto">
            Everything you need to know about privacy, city coverage, merchant listings, events, and app access across Indian neighbourhoods.
          </p>
        </div>

        <FaqAccordion items={HOMEPAGE_FAQS} />
      </Container>
    </section>
  );
}

export default HomeFaq;
