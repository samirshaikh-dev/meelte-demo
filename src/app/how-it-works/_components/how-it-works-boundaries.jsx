import React from "react";
import Link from "next/link";
import { ArrowRight, Ban, BarChart3, Lock, Receipt, UserCheck } from "@/lib/icons";
import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";

/**
 * What Meelte does not do — stated on the page itself.
 *
 * Every line here is a documented boundary, not a disclaimer invented for the
 * page. Sources, in order: faq-11 and faq-4 (no payments, tickets or commissions),
 * project-context.md §3 and §12.3 (there is no local jobs board; /careers is
 * company recruitment), faq-21 (in-person onboarding is not a verification badge),
 * faq-22 (no reach, view or footfall analytics for merchants) and faq-2 (location
 * used for distance sorting; Meelte states it does not sell or share location with
 * advertisers).
 *
 * This section replaces the old TrustCredibilitySection, which asserted
 * "0% commission", a "30% platform cut" comparison, and a Bengaluru-only
 * company base — none of which the product evidence supports.
 */
const BOUNDARIES = [
  {
    id: "payments",
    icon: Receipt,
    title: "No checkout and no tickets",
    body: "Meelte does not sell goods, run events, process payments or sell tickets. You settle a purchase with the shop and any event fee with the host, directly.",
  },
  {
    id: "jobs",
    icon: Ban,
    title: "No local jobs board",
    body: "There is no hiring or job-listing feature in the app. The careers page is about working at Meelte, not about local vacancies.",
  },
  {
    id: "verification",
    icon: UserCheck,
    title: "No verification badge",
    body: "Shops are onboarded in person by the field team, but that is not an identity or background check — for shops or for people. Use your own judgement when you meet someone.",
  },
  {
    id: "analytics",
    icon: BarChart3,
    title: "No reach analytics",
    body: "Merchants do not get a dashboard of views, reach or footfall. What a shop posts is visible; how many people acted on it is not reported back.",
  },
];

export function HowItWorksBoundaries() {
  return (
    <section
      id="boundaries"
      aria-labelledby="how-it-works-boundaries-heading"
      className="scroll-mt-20 border-b border-border/80 bg-canvas py-16 sm:py-20"
    >
      <Container>
        <div className="max-w-2xl">
          <Badge variant="neutral" className="mb-3 gap-1.5">
            <Ban className="h-3.5 w-3.5 text-foreground-secondary" aria-hidden="true" />
            <span>Honest boundaries</span>
          </Badge>
          <h2
            id="how-it-works-boundaries-heading"
            className="text-3xl font-extrabold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-[2.6rem]"
          >
            What Meelte does not do.
          </h2>
          <p className="mt-3.5 text-base leading-relaxed text-foreground-secondary sm:text-lg">
            Four things a local app is often assumed to handle. Knowing they are
            out of scope is part of understanding how the platform works.
          </p>
        </div>

        <ul role="list" className="mt-10 grid gap-4 sm:mt-12 md:grid-cols-2">
          {BOUNDARIES.map((item) => {
            const Icon = item.icon;
            return (
              <li
                key={item.id}
                className="rounded-2xl border border-border/80 bg-surface p-5 sm:p-6"
              >
                <div className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-surface-muted text-foreground-secondary">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-bold tracking-tight text-foreground">
                      {item.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-foreground-secondary">
                      {item.body}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        {/* Location and privacy — the one boundary that needs its own explanation. */}
        <div className="mt-6 flex flex-col gap-4 rounded-3xl border border-border/80 bg-surface-muted p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-surface text-primary">
              <Lock className="h-5 w-5" aria-hidden="true" />
            </span>
            <div className="max-w-2xl">
              <h3 className="text-lg font-bold tracking-tight text-foreground">
                What location is used for
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-foreground-secondary">
                Location sorts listings by distance and works out which city zone
                applies. Meelte states that it does not sell or share user location
                with advertisers. Reporting and blocking are available in the app
                for the rest.
              </p>
            </div>
          </div>

          <div className="flex shrink-0 flex-wrap items-center gap-x-5 gap-y-2 sm:pl-15 lg:pl-0">
            <Link
              href="/privacy"
              className="inline-flex min-h-11 items-center gap-1.5 rounded text-sm font-bold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2"
            >
              <span>Privacy policy</span>
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
            <Link
              href="/faq"
              className="inline-flex min-h-11 items-center gap-1.5 rounded text-sm font-bold text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2"
            >
              <span>Read the FAQ</span>
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default HowItWorksBoundaries;
