import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  CalendarCheck,
  Compass,
  MapPin,
  ShieldCheck,
  Store,
  Tag,
  Users,
} from "@/lib/icons";
import { Container } from "@/components/layout/container";

const DIFFERENCES = [
  {
    id: "distance",
    icon: Compass,
    title: "Distance-sorted, not algorithm-driven",
    badge: "Hyperlocal Feed",
    description:
      "Generic social feeds prioritize viral content from across the country. meelTe lists shop offers and events strictly by proximity to where you are, showing what is genuinely down your street or across your neighbourhood.",
  },
  {
    id: "dated-offers",
    icon: Tag,
    title: "Explicit dates and rupee pricing",
    badge: "Dated Offers",
    description:
      "No guessing whether a WhatsApp deal is still valid. Every offer has an active window (from 12:00 AM on start date to 11:59 PM on end date) and displays either original vs final rupee prices or clear percentage discounts.",
  },
  {
    id: "curated-events",
    icon: CalendarCheck,
    title: "Host-approved event attendance",
    badge: "Controlled Groups",
    description:
      "Open social invites often lead to no-shows or chaotic crowds. meelTe lets organisers review 'Request to Join' submissions with exact group sizes, so hosts control who attends their meetups or workshops.",
  },
  {
    id: "direct-support",
    icon: Store,
    title: "Zero transaction cuts & offline settlement",
    badge: "Direct Local Commerce",
    description:
      "meelTe does not broker payments, charge commission on purchases, or take ticketing cuts. Customers settle directly with the merchant at the shop, guided by one-tap Google Maps directions.",
  },
];

export function HyperlocalDifferenceSection() {
  return (
    <section className="border-b border-border/80 bg-surface py-16 sm:py-24">
      <Container>
        {/* Section Header: Problem & Purpose Framing (Psychology §2, §7) */}
        <div className="max-w-3xl">
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-[2.6rem] lg:leading-tight">
            Built for neighbourhoods, not endless scrolling.
          </h2>
          <p className="mt-3.5 text-base leading-relaxed text-foreground-secondary sm:text-lg">
            Local opportunities shouldn&apos;t get lost in WhatsApp forwards or expired window posters. Here is how meelTe approaches proximity differently.
          </p>
        </div>

        {/* Editorial Layout with Subtle Dividers (AVOID.md §2: Open layouts instead of nested card spam) */}
        <div className="mt-12 divide-y divide-border/80 border-t border-b border-border/80">
          {DIFFERENCES.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="grid grid-cols-1 py-8 sm:py-10 lg:grid-cols-12 lg:gap-8 items-start"
              >
                {/* Column 1: Number & Icon */}
                <div className="flex items-center gap-4 lg:col-span-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-surface-muted text-primary">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <div>
                    <span className="text-xs font-bold tracking-wider uppercase text-primary">
                      {item.badge}
                    </span>
                    <h3 className="mt-0.5 text-lg sm:text-xl font-bold text-foreground">
                      {item.title}
                    </h3>
                  </div>
                </div>

                {/* Column 2: Explanation (Psychology §8: Short, scannable copy) */}
                <div className="mt-4 lg:mt-0 lg:col-span-8">
                  <p className="text-sm sm:text-base leading-relaxed text-foreground-secondary">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Supporting Anchor Links */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <p className="text-xs sm:text-sm text-foreground-secondary">
            Connecting local residents and independent shops across Indian neighbourhoods.
          </p>
          <div className="flex items-center gap-5">
            <Link
              href="/discover"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 rounded"
            >
              <span>Explore discovery categories</span>
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
            <Link
              href="/for-merchants"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-foreground-secondary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 rounded"
            >
              <span>Merchant onboarding</span>
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default HyperlocalDifferenceSection;
