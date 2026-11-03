"use client";

import React from "react";
import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown } from "@/lib/icons";
import { cn } from "@/lib/utils";

/**
 * Reusable FAQ Accordion UI Primitive.
 * Built on Radix Accordion with `forceMount` on Content to guarantee
 * all answers exist in static prerendered HTML for SEO/AEO crawlability.
 *
 * @param {Object} props
 * @param {Array<{ id: string; question: string; answer: string }>} props.items
 * @param {string} [props.defaultValue] Initial open item id (defaults to first item id)
 * @param {string} [props.className] Additional wrapper class names
 */
export function FaqAccordion({ items, defaultValue, className }) {
  if (!Array.isArray(items) || items.length === 0) {
    return null;
  }

  const initialValue = defaultValue !== undefined ? defaultValue : items[0]?.id;

  return (
    <Accordion.Root
      type="single"
      collapsible
      className={cn("flex flex-col gap-3.5", className)}
      defaultValue={initialValue}
    >
      {items.map((faq) => (
        <Accordion.Item
          key={faq.id}
          value={faq.id}
          className="rounded-3xl border border-border/80 bg-canvas/70 overflow-hidden shadow-2xs transition-colors transition-shadow data-[state=open]:border-primary/40 data-[state=open]:bg-surface data-[state=open]:shadow-soft"
        >
          <Accordion.Header className="flex">
            <Accordion.Trigger className="flex flex-1 items-center justify-between p-5 sm:p-6 text-left font-bold text-base sm:text-lg text-foreground hover:text-primary transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 group">
              <span className="pr-4">{faq.question}</span>
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-surface-muted text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                <ChevronDown
                  className="h-4 w-4 transition-transform duration-200 ease-out group-data-[state=open]:rotate-180"
                  aria-hidden="true"
                />
              </div>
            </Accordion.Trigger>
          </Accordion.Header>
          {/*
            `forceMount` keeps every answer in the prerendered HTML (Radix still
            sets `hidden` while collapsed). Without it, closed answers exist only
            after hydration, so the FAQPage JSON-LD would declare answers that a
            non-JS crawler cannot see.
          */}
          <Accordion.Content
            forceMount
            className="overflow-hidden px-5 sm:px-6 pb-5 sm:pb-6 text-sm sm:text-base text-foreground-secondary leading-relaxed data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up"
          >
            <div className="pt-2 border-t border-border/40">
              <p>{faq.answer}</p>
            </div>
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}

export default FaqAccordion;

