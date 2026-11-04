import React from "react";
import { Container } from "@/components/layout/container";
import { FaqAccordion } from "@/components/ui/faq-accordion";
import { getFaqPageJsonLd } from "@/lib/seo/structured-data";

export const HOW_IT_WORKS_FAQS = [
  {
    id: "how-it-works-faq-1",
    question: "What is meelTe and how does the platform work?",
    answer:
      "meelTe connects neighbourhood residents with local activity across three areas: time-boxed offers from nearby shops, local events you can request to join, and direct one-to-one messaging with people and businesses you follow.",
  },
  {
    id: "how-it-works-faq-2",
    question: "How long does a local shop offer stay active?",
    answer:
      "A shop ad runs from 12:00 AM on its start date through 11:59 PM on its end date. After the end date, it is automatically archived so you only see live, active offers.",
  },
  {
    id: "how-it-works-faq-3",
    question: "Who can create and host an event on meelTe?",
    answer:
      "Individuals, clubs, and local organisers can create events with a category, cover image, time, map location, and public or private visibility. Hosts review join requests and decide who attends.",
  },
  {
    id: "how-it-works-faq-4",
    question: "Who processes payments for deals and events?",
    answer:
      "meelTe does not process payments or broker transactions. Customers pay shops directly, and event attendees settle any joining cost directly with the host.",
  },
  {
    id: "how-it-works-faq-5",
    question: "Can I discover and chat with people in my neighborhood?",
    answer:
      "meelTe supports friends, follows, and one-to-one chat with people you connect with through local content and events. Voice and video calls are also available.",
  },
];

export function getHowItWorksFaqJsonLd() {
  return getFaqPageJsonLd(HOW_IT_WORKS_FAQS);
}

/**
 * Dedicated How-It-Works Page FAQ Section.
 * Tailored for understanding platform mechanics: role pathways, time boundaries,
 * event join flows, and offline settlement boundaries.
 */
export function HowItWorksFaq() {
  return (
    <section
      id="how-it-works-faq"
      aria-labelledby="how-it-works-faq-heading"
      className="py-8 sm:py-12 lg:py-14 bg-surface scroll-mt-20 border-b border-border/80"
    >
      <Container className="max-w-4xl">
        <div className="text-center mb-6 sm:mb-8">
          <h2
            id="how-it-works-faq-heading"
            className="text-3xl sm:text-4xl lg:text-[2.6rem] font-extrabold tracking-tight text-foreground leading-tight text-balance"
          >
            How meelTe works: common questions.
          </h2>
          <p className="mt-2 text-base sm:text-lg text-foreground-secondary leading-relaxed max-w-2xl mx-auto">
            Clear details on platform mechanics, joining events, finding offers, and offline settlements.
          </p>
        </div>

        <FaqAccordion items={HOW_IT_WORKS_FAQS} />
      </Container>
    </section>
  );
}

export default HowItWorksFaq;

