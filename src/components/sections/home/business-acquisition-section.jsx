"use client";

import React from "react";
import Link from "next/link";
import { Store, CheckCircle2 } from "@/lib/icons";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SUPPORT_EMAIL } from "@/config/site";
import { Reveal } from "@/components/animations/reveal";

/**
 * Comparison rows.
 *
 * Rewritten because the previous version asserted competitor figures ("20% – 35%
 * cut taken"), a walking-distance radius ("Hyperlocal Proximity (< 3 km)") that
 * contradicts the product's 60 km default sort, and a verification programme
 * ("Free Community Verification") that does not exist in the app. The right-hand
 * column now describes aggregator behaviour only in general terms — no invented
 * percentages — and the left-hand column states only what the product does
 * (docs/target_customer.md §1, §4.3).
 */
const COMPARISON_POINTS = [
  {
    feature: "Commission on a sale",
    meelte: "0% commission",
    aggregators: "A percentage of every order",
    detail: "Meelte does not deduct a cut of what a shop earns.",
  },
  {
    feature: "Who sees your offer",
    meelte: "Nearby residents, sorted by distance",
    aggregators: "Whoever the ranking favours",
    detail: "Offers appear to people in the city zone the ad is published in.",
  },
  {
    feature: "What you can list",
    meelte: "One product, or a catalogue of up to 100",
    aggregators: "Menu-bound listings",
    detail: "Photograph a menu or price list and the app fills in the items.",
  },
  {
    feature: "How you get set up",
    meelte: "In person, by our field team",
    aggregators: "Self-serve sign-up",
    detail: "A field team member visits the shop and helps publish the first ad.",
  },
];

const ONBOARDING_STEPS = [
  {
    number: "01",
    title: "Tell us about the shop",
    description:
      "Send your business name, category, phone number and city — or call the merchant desk directly. The field team visits shops in person.",
  },
  {
    number: "02",
    title: "A field team visit",
    description:
      "Someone from the team meets you at the shop, sets up the profile and shows you how to publish an offer from the app.",
  },
  {
    number: "03",
    title: "Publish your first ad",
    description:
      "A single product or a catalogue of up to 100, with a price or discount and the dates it should run. It goes live at 12:00 AM on the start date.",
  },
];

export function BusinessAcquisitionSection() {

  return (
    <section id="for-businesses" className="py-16 sm:py-24 bg-surface-subtle scroll-mt-20 border-b border-border/80">
      <Container>
        {/* Section Header */}
        <Reveal className="max-w-3xl mb-12 sm:mb-16">
          <Badge variant="accent" className="mb-3 gap-1.5 py-1 px-3">
            <Store className="h-3.5 w-3.5 text-accent-foreground" aria-hidden="true" />
            <span className="font-bold">Grow with Meelte · For Local Merchants</span>
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-[2.6rem] font-extrabold tracking-tight text-foreground leading-tight">
            Sell to the people already nearby. 0% commission.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-foreground-secondary leading-relaxed">
            Delivery aggregators take a percentage of every order and sit between you and the
            customer. Meelte is built the other way round: your shop, your offer, your counter.
          </p>
        </Reveal>

        {/* Side-by-Side Comparison: Aggregators vs Meelte */}
        <Reveal className="mb-14" delay={0.05}>
          <div className="overflow-hidden rounded-3xl border border-border/80 bg-surface shadow-card">
            <div className="p-6 sm:p-8 bg-gradient-to-r from-primary to-primary-dark text-white">
              <span className="text-xs font-bold uppercase tracking-wider text-accent block mb-1">
                Transparent Economics
              </span>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
                Why local merchants choose the Meelte Ecosystem
              </h3>
            </div>

            <div className="divide-y divide-border/70">
              {COMPARISON_POINTS.map((item, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-1 md:grid-cols-12 p-5 sm:p-6 gap-4 items-center hover:bg-canvas/50 transition-colors"
                >
                  <div className="md:col-span-4">
                    <span className="font-bold text-sm text-foreground block">
                      {item.feature}
                    </span>
                    <span className="text-xs text-foreground-secondary mt-0.5 block">
                      {item.detail}
                    </span>
                  </div>

                  <div className="md:col-span-4 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-success shrink-0" aria-hidden="true" />
                    <div>
                      <span className="text-xs font-bold text-success bg-success/10 px-2.5 py-1 rounded-md border border-success/30 inline-block">
                        {item.meelte}
                      </span>
                    </div>
                  </div>

                  <div className="md:col-span-4 flex items-center gap-2 text-xs text-foreground-secondary">
                    <span className="text-error font-bold shrink-0" aria-hidden="true">
                      ✕
                    </span>
                    <span className="text-foreground-muted">{item.aggregators}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* 3-Step Onboarding Pathway */}
        <div className="mb-12">
          <Reveal className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Simple 3-Step Process
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground mt-1">
              How onboarding works for your business
            </h3>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ONBOARDING_STEPS.map((step, idx) => (
              <Reveal
                key={step.number}
                delay={0.08 + idx * 0.08}
                className="p-6 rounded-3xl bg-surface border border-border/80 shadow-soft flex flex-col justify-between transition-transform duration-300 hover:-translate-y-[2px] hover:shadow-card"
              >
                <div>
                  <span className="text-2xl font-black text-primary/40 block mb-3">
                    {step.number}
                  </span>
                  <h4 className="font-bold text-lg text-foreground tracking-tight">
                    {step.title}
                  </h4>
                  <p className="mt-2 text-xs sm:text-sm text-foreground-secondary leading-relaxed">
                    {step.description}
                  </p>
                </div>
                <div className="mt-6 pt-3 border-t border-border/50 text-[11px] text-success font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-success" aria-hidden="true" />
                  <span>No commission deducted</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Business CTA Action Card with Enquiry Dialog */}
        <Reveal delay={0.1}>
          <div className="rounded-3xl bg-gradient-to-br from-primary via-primary-hover to-primary-royal p-8 sm:p-12 text-white shadow-card flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-xl">
              <span className="text-xs font-bold uppercase tracking-wider text-accent block mb-2">
                Merchant onboarding
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Ready to list your local shop?
              </h3>
              <p className="mt-2 text-sm sm:text-base text-white/90 leading-relaxed">
                Meelte onboards shops in person in Bengaluru, Gaya and Ranchi. Read the dedicated{" "}
                <Link href="/for-merchants" className="underline decoration-accent/70 hover:decoration-white transition-colors font-semibold">
                  For Merchants
                </Link>{" "}
                page for what a shop can publish.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full md:w-auto">
              <Link href="/for-merchants">
                <Button
                  variant="accent"
                  size="lg"
                  className="w-full sm:w-auto font-bold shadow-soft text-accent-foreground hover:-translate-y-[2px] hover:scale-[1.02]"
                >
                  <Store className="h-4 w-4" aria-hidden="true" />
                  <span>Start a merchant enquiry</span>
                </Button>
              </Link>

              <div className="flex flex-col items-center gap-2">
                <a
                  href={`mailto:${SUPPORT_EMAIL}?subject=Merchant%20Partnership%20Enquiry`}
                  className="text-xs font-semibold text-white/90 hover:text-white px-3 py-2 text-center underline hover:decoration-white transition-colors"
                >
                  Email Merchant Desk →
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

export default BusinessAcquisitionSection;
