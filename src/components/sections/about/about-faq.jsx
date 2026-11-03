import React from "react";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { FaqAccordion } from "@/components/ui/faq-accordion";
import { ArrowRight } from "@/lib/icons";
import { SUPPORT_EMAIL } from "@/config/site";
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
            className="text-3xl sm:text-4xl lg:text-[2.6rem] font-extrabold tracking-tight text-foreground leading-tight"
          >
            Questions about meelTe&apos;s story &amp; platform.
          </h2>
          <p className="mt-2 text-base sm:text-lg text-foreground-secondary leading-relaxed max-w-2xl mx-auto">
            Why we built meelTe, how our hyperlocal model works, and how we protect direct community relationships.
          </p>
        </div>

        <FaqAccordion items={ABOUT_FAQS} />

        <div className="mt-5 sm:mt-6 text-center">
          <Link
            href="/faq"
            className="inline-flex items-center gap-1.5 rounded text-sm font-bold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2"
          >
            <span>See all FAQs</span>
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-6 sm:mt-8 text-center p-4 sm:p-5 rounded-2xl bg-canvas border border-border/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left">
            <span className="text-sm font-bold text-foreground block">
              Want to learn more about our company or mission?
            </span>
            <span className="text-xs text-foreground-secondary">
              Get in touch with our team directly.
            </span>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <a
              href={`mailto:${SUPPORT_EMAIL}?subject=meelTe%20About%20Inquiry`}
              className="rounded text-xs font-bold text-primary hover:underline px-3 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2"
            >
              Contact our team
            </a>
            <Link
              href="/how-it-works"
              className="text-xs font-bold text-foreground bg-surface hover:bg-surface-subtle border border-border px-3.5 py-2 rounded-xl transition-colors shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2"
            >
              How it works
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default AboutFaq;

