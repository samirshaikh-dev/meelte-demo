import React from "react";
import { Container } from "@/components/layout/container";
import { FaqAccordion } from "@/components/ui/faq-accordion";
import { getFaqPageJsonLd } from "@/lib/seo/structured-data";

export const CAREERS_FAQS = [
  {
    id: "careers-faq-1",
    question: "Does meelTe operate a local jobs board in the app?",
    answer:
      "No. meelTe is a hyperlocal discovery and community app, not a jobs board or gig portal. This Careers page is solely for employment opportunities at meelTe the company.",
  },
  {
    id: "careers-faq-2",
    question: "Where are meelTe's operational teams located?",
    answer:
      "meelTe operates with core corporate and product hubs in India, supported by an on-the-ground field acquisition network onboarding neighborhood merchants in person.",
  },
  {
    id: "careers-faq-3",
    question: "How can I apply if my ideal role is not listed?",
    answer:
      "We always welcome passionate builders. You can send your resume, portfolio links, and a brief description of what you'd like to build at meelTe to hr@meelTe.com. We review every submission for future openings.",
  },
  {
    id: "careers-faq-4",
    question: "What is the interview and hiring process at meelTe?",
    answer:
      "Our process is transparent and prompt: an initial introductory call with our team, a practical discussion or assessment around real product problems, and a culture alignment conversation.",
  },
];

export function getCareersFaqJsonLd() {
  return getFaqPageJsonLd(CAREERS_FAQS);
}

/**
 * Dedicated Careers Page FAQ Section.
 * Tailored for prospective team members: clarifies that meelTe is company recruitment
 * rather than a local jobs board, explains team locations, speculative applications, and hiring stages.
 */
export function CareersFaq() {
  return (
    <section
      id="careers-faq"
      aria-labelledby="careers-faq-heading"
      className="py-8 sm:py-12 lg:py-14 bg-surface scroll-mt-20 border-b border-border/80"
    >
      <Container className="max-w-4xl">
        <div className="text-center mb-6 sm:mb-8">
          <h2
            id="careers-faq-heading"
            className="text-3xl sm:text-4xl lg:text-[2.6rem] font-extrabold tracking-tight text-foreground leading-tight text-balance"
          >
            Frequently asked questions about working at meelTe.
          </h2>
          <p className="mt-2 text-base sm:text-lg text-foreground-secondary leading-relaxed max-w-2xl mx-auto">
            Clear answers about our company hiring, speculative applications, team culture, and platform scope.
          </p>
        </div>

        <FaqAccordion items={CAREERS_FAQS} />
      </Container>
    </section>
  );
}

export default CareersFaq;

