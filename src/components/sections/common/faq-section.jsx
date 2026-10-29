"use client";

import React from "react";
import Link from "next/link";
import * as Accordion from "@radix-ui/react-accordion";
import { ArrowRight, ChevronDown, HelpCircle, ShieldCheck, Store, Compass } from "@/lib/icons";
import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import { FAQ_ITEMS } from "@/constants/faq-constants";
import { SUPPORT_EMAIL } from "@/config/site";

export { FAQ_ITEMS };

/**
 * AEO FAQ accordion.
 *
 * @param {Array<{ id: string; question: string; answer: string }>} [items]
 *   Subset of `FAQ_ITEMS` to render. Defaults to the full list; the homepage
 *   and /discover pass a trimmed teaser so their sections stay short.
 * @param {string} [viewAllHref]
 *   Optional link to the complete FAQ page, rendered under the accordion.
 * @param {string} [title]
 *   Section heading. Override on pages whose teaser covers a narrower set of
 *   questions than the full FAQ.
 * @param {string} [description]
 *   Supporting line under the heading.
 */
export function FaqSection({
  items = FAQ_ITEMS,
  viewAllHref,
  title = "Clear, honest answers about Meelte.",
  description = "Everything you need to know about privacy, city coverage, merchant listings, events, payments, referrals, and app access.",
}) {
  const faqs = Array.isArray(items) && items.length > 0 ? items : FAQ_ITEMS;
  const firstFaqId = faqs[0]?.id;

  return (
    <section id="faq" className="py-16 sm:py-24 bg-surface scroll-mt-20 border-b border-border/80">
      <Container className="max-w-4xl">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <Badge variant="primary" className="mb-3 gap-1.5">
            <HelpCircle className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
            <span>Frequently Asked Questions</span>
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-[2.6rem] font-extrabold tracking-tight text-foreground leading-tight">
            {title}
          </h2>
          <p className="mt-3.5 text-base sm:text-lg text-foreground-secondary leading-relaxed max-w-2xl mx-auto">
            {description}
          </p>
        </div>

        {/* Radix Accessible Accordion */}
        <Accordion.Root
          type="single"
          collapsible
          className="flex flex-col gap-3.5"
          defaultValue={firstFaqId}
        >
          {faqs.map((faq) => (
            <Accordion.Item
              key={faq.id}
              value={faq.id}
              className="rounded-3xl border border-border/80 bg-canvas/70 overflow-hidden shadow-2xs transition-all data-[state=open]:border-primary/40 data-[state=open]:bg-surface data-[state=open]:shadow-soft"
            >
              <Accordion.Header className="flex">
                <Accordion.Trigger className="flex flex-1 items-center justify-between p-5 sm:p-6 text-left font-bold text-base sm:text-lg text-foreground hover:text-primary transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 group">
                  <span className="pr-4">{faq.question}</span>
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-surface-muted text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    <ChevronDown
                      className="h-4 w-4 transition-transform duration-200 ease-out group-data-[state=open]:rotate-180"
                      aria-hidden="true"
                    />
                  </div>
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className="overflow-hidden px-5 sm:px-6 pb-5 sm:pb-6 text-sm sm:text-base text-foreground-secondary leading-relaxed data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
                <div className="pt-2 border-t border-border/40">
                  <p>{faq.answer}</p>
                </div>
              </Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion.Root>

        {/* Optional link to the complete FAQ page (homepage teaser) */}
        {viewAllHref && faqs.length < FAQ_ITEMS.length && (
          <div className="mt-8 text-center">
            <Link
              href={viewAllHref}
              className="inline-flex items-center gap-1.5 rounded text-sm font-bold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
            >
              <span>See all questions</span>
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
        )}

        {/* Still have questions? Help desk footer */}
        <div className="mt-12 text-center p-6 rounded-3xl bg-canvas border border-border/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left">
            <span className="text-sm font-bold text-foreground block">Have a specific question about your neighborhood or business?</span>
            <span className="text-xs text-foreground-secondary">Our support team can help.</span>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <a
              href={`mailto:${SUPPORT_EMAIL}?subject=Meelte%20Inquiry`}
              className="rounded text-xs font-bold text-primary hover:underline px-3 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
            >
              Contact Support →
            </a>
            <Link
              href="/for-merchants"
              className="text-xs font-bold text-foreground bg-surface hover:bg-surface-subtle border border-border px-3.5 py-2 rounded-xl transition-colors shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
            >
              Merchant desk
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default FaqSection;
