"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "@/lib/icons";
import { Container } from "@/components/layout/container";
import { FaqAccordion } from "@/components/ui/faq-accordion";
import { FAQ_ITEMS } from "@/constants/faq-constants";
import { SUPPORT_EMAIL } from "@/config/site";

export { FAQ_ITEMS };

/**
 * Backward-compatible generic FAQ section wrapper.
 * Delegates accordion rendering to the reusable `FaqAccordion` primitive.
 * Note: Individual pages now use their own dedicated FAQ sections (e.g. `HomeFaq`,
 * `DiscoverFaq`, `MerchantFaq`, `HowItWorksFaq`, `SignupFaq`).
 *
 * @param {Object} props
 * @param {Array<{ id: string; question: string; answer: string }>} [props.items]
 * @param {string} [props.viewAllHref]
 * @param {string} [props.title]
 * @param {string} [props.description]
 * @param {boolean} [props.showMerchantLink]
 */
export function FaqSection({
  items = FAQ_ITEMS,
  viewAllHref,
  title = "Clear, honest answers about meelTe.",
  description = "Everything you need to know about privacy, city coverage, merchant listings, events, payments, referrals, and app access.",
  showMerchantLink = true,
}) {
  const faqs = Array.isArray(items) && items.length > 0 ? items : FAQ_ITEMS;

  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="py-16 sm:py-24 bg-surface scroll-mt-20 border-b border-border/80"
    >
      <Container className="max-w-4xl">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2
            id="faq-heading"
            className="text-3xl sm:text-4xl lg:text-[2.6rem] font-extrabold tracking-tight text-foreground leading-tight text-balance"
          >
            {title}
          </h2>
          <p className="mt-3.5 text-base sm:text-lg text-foreground-secondary leading-relaxed max-w-2xl mx-auto">
            {description}
          </p>
        </div>

        {/* Reusable Accessible Accordion Primitive */}
        <FaqAccordion items={faqs} />

        {/* Optional link to the complete FAQ page */}
        {viewAllHref && faqs.length < FAQ_ITEMS.length && (
          <div className="mt-8 text-center">
            <Link
              href={viewAllHref}
              className="inline-flex items-center gap-1.5 rounded text-sm font-bold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2"
            >
              <span>See all questions</span>
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
        )}

        {/* Still have questions? Help desk footer */}
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
            {showMerchantLink && (
              <Link
                href="/for-merchants"
                className="text-xs font-bold text-foreground bg-surface hover:bg-surface-subtle border border-border px-3.5 py-2 rounded-xl transition-colors shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2"
              >
                Merchant desk
              </Link>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}

export default FaqSection;
