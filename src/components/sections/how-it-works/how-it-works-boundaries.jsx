import React from "react";
import Link from "next/link";
import { ArrowRight, Ban, BarChart3, Lock, Receipt, UserCheck } from "@/lib/icons";
import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";

/**
 * What meelTe does not do — stated on the page itself.
 *
 * Every line here is a documented boundary, not a disclaimer invented for the
 * page. Sources, in order: faq-11 and faq-4 (no payments, tickets or commissions),
 * project-context.md §3 and §12.3 (there is no local jobs board; /careers is
 * company recruitment), faq-21 (in-person onboarding is not a verification badge),
 * faq-22 (no reach, view or footfall analytics for merchants) and faq-2 (location
 * used for distance sorting; meelTe states it does not sell or share location with
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
    body: "meelTe does not sell goods, run events, process payments or sell tickets. You settle a purchase with the shop and any event fee with the host, directly.",
  },
  {
    id: "jobs",
    icon: Ban,
    title: "No local jobs board",
    body: "There is no hiring or job-listing feature in the app. The careers page is about working at meelTe, not about local vacancies.",
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
      className="scroll-mt-20 border-b border-border/80 bg-canvas py-8 sm:py-12 lg:py-14"
    >
      <Container>
        <div className="max-w-2xl">
          <h2
            id="how-it-works-boundaries-heading"
            className="text-3xl font-extrabold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-[2.6rem]"
          >
            What meelTe does not do.
          </h2>
        </div>

        <ul role="list" className="mt-6 sm:mt-8 grid gap-4 md:grid-cols-2">
          {BOUNDARIES.map((item) => {
            const Icon = item.icon;
            return (
              <li
                key={item.id}
                className="rounded-2xl border border-border/80 bg-surface p-5 sm:p-6"
              >
                <div className="flex items-start gap-3">
                 
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

      </Container>
    </section>
  );
}

export default HowItWorksBoundaries;
