import React from "react";
import { Container } from "@/components/layout/container";

const DIFFERENCES = [
  {
    id: "distance",
    badge: "Hyperlocal Feed",
    description:
      "Generic social feeds prioritize viral content from across the country. meelTe lists shop offers and events strictly by proximity to where you are, showing what is genuinely down your street or across your neighbourhood.",
  },
  {
    id: "dated-offers",
    badge: "Dated Offers",
    description:
      "No guessing whether a WhatsApp deal is still valid. Every offer has an active window (from 12:00 AM on start date to 11:59 PM on end date) and displays either original vs final rupee prices or clear percentage discounts.",
  },
  {
    id: "curated-events",
    badge: "Controlled Groups",
    description:
      "Open social invites often lead to no-shows or chaotic crowds. meelTe lets organisers review 'Request to Join' submissions with exact group sizes, so hosts control who attends their meetups or workshops.",
  },
  {
    id: "direct-support",
    badge: "Direct Local Commerce",
    description:
      "meelTe does not broker payments, charge commission on purchases, or take ticketing cuts. Customers settle directly with the merchant at the shop, guided by one-tap Google Maps directions.",
  },
];

export function HyperlocalDifferenceSection() {
  return (
    <section className="border-b border-border/80 bg-surface py-8 sm:py-12 lg:py-14">
      <Container>
        {/* Section Header: Problem & Purpose Framing (Psychology §2, §7) */}
        <div className="max-w-3xl">
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-[2.6rem] lg:leading-tight">
            Built for neighbourhoods, not endless scrolling.
          </h2>
        </div>

        {/* Editorial Layout with Subtle Dividers (AVOID.md §2: Open layouts instead of nested card spam) */}
        <div className="mt-6 sm:mt-8 divide-y divide-border/80 border-t border-b border-border/80">
          {DIFFERENCES.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-1 py-4 sm:py-5 lg:grid-cols-12 lg:gap-8 items-start"
            >
              {/* Column 1: Badge / Category */}
              <div className="flex items-center gap-4 lg:col-span-4">
                <h3 className="text-xs font-bold tracking-wider uppercase text-foreground-secondary">
                  {item.badge}
                </h3>
              </div>

              {/* Column 2: Explanation (Psychology §8: Short, scannable copy) */}
              <div className="mt-2 lg:mt-0 lg:col-span-8">
                <p className="text-sm sm:text-base leading-relaxed text-foreground-secondary">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

export default HyperlocalDifferenceSection;
