import React from "react";
import { Container } from "@/components/layout/container";
import { FaqAccordion } from "@/components/ui/faq-accordion";
import { getFaqPageJsonLd } from "@/lib/seo/structured-data";

export const ABOUT_FAQS = [
  {
    id: "about-faq-1",
    question: "Why was meelTe started?",
    answer:
      "meelTe was created to solve everyday neighborhood friction: valuable local offers lost in phone chats, community events that go unnoticed, and new residents feeling disconnected after moving to a new city.",
  },
  {
    id: "about-faq-2",
    question: "What is the core difference between meelTe and generic social media?",
    answer:
      "Unlike global algorithmic feeds cluttered with non-local noise, meelTe is strictly hyperlocal and distance-sorted. You only see active, time-boxed offers from neighborhood shops and community events happening near you right now.",
  },
  {
    id: "about-faq-3",
    question: "Who is meelTe built for?",
    answer:
      "meelTe serves local residents looking for deals and gatherings, independent shopkeepers who want simple local reach without digital marketing overhead, and community hosts organizing local activities.",
  },
  {
    id: "about-faq-4",
    question: "Does meelTe sell goods, take commissions, or broker payments?",
    answer:
      "No. meelTe is a pure discovery and connection platform. It does not sell goods, charge commissions on sales, or process event payments. All commerce and event settlements occur directly between neighbors offline.",
  },
];

export function getAboutFaqJsonLd() {
  return getFaqPageJsonLd(ABOUT_FAQS);
}

/**
 * Dedicated About Page FAQ Section.
 * Tailored for company and platform background: origins, hyperlocal differentiation,
 * audience personas, and offline settlement boundaries.
 */
export function AboutFaq() {
  return (
    <section
      id="about-faq"
      aria-labelledby="about-faq-heading"
      className="py-8 sm:py-12 lg:py-14 bg-surface scroll-mt-20 border-b border-border/80"
    >
      <Container className="max-w-4xl">
        <div className="text-center mb-6 sm:mb-8">
          <h2
            id="about-faq-heading"
            className="text-3xl sm:text-4xl lg:text-[2.6rem] font-extrabold tracking-tight text-foreground leading-tight text-balance"
          >
            Questions about meelTe&apos;s story &amp; platform.
          </h2>
          <p className="mt-2 text-base sm:text-lg text-foreground-secondary leading-relaxed max-w-2xl mx-auto">
            Why we built meelTe, how our hyperlocal model works, and how we protect direct community relationships.
          </p>
        </div>

        <FaqAccordion items={ABOUT_FAQS} />
      </Container>
    </section>
  );
}

export default AboutFaq;

