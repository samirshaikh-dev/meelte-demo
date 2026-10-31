"use client";

import React from "react";
import { Store } from "@/lib/icons";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SUPPORT_EMAIL } from "@/config/site";
import { Reveal } from "@/components/animations/reveal";

const ONBOARDING_STEPS = [
  {
    number: "01",
    title: "Contact the merchant desk",
    description:
      "Share your business name, category, phone number and city, or call the merchant desk directly.",
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
        <Reveal className="max-w-3xl mb-12 sm:mb-16">
          <Badge variant="accent" className="mb-3 gap-1.5 py-1 px-3">
            <Store className="h-3.5 w-3.5 text-accent-foreground" aria-hidden="true" />
            <span className="font-bold">For local merchants</span>
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-[2.6rem] font-extrabold tracking-tight text-foreground leading-tight">
            From first conversation to your first offer.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-foreground-secondary leading-relaxed">
            Meelte&apos;s field team helps shops get set up in person in Bengaluru, Gaya and
            Ranchi. Here&apos;s what getting started looks like.
          </p>
        </Reveal>

        <div className="mb-12">
          <Reveal className="text-center max-w-xl mx-auto mb-10">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground mt-1">
              A straightforward three-step setup
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
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal delay={0.1}>
            <div className="rounded-3xl bg-gradient-to-br from-primary via-primary-hover to-primary-royal p-8 sm:p-12 text-white shadow-card flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="max-w-xl">
                <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  Ready to list your local shop?
                </h3>
              <p className="mt-2 text-sm sm:text-base text-white/90 leading-relaxed">
                Ask the merchant desk about getting your shop set up and publishing its first offer.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full md:w-auto">
              <Button
                as="a"
                href={`mailto:${SUPPORT_EMAIL}?subject=Merchant%20Partnership%20Enquiry`}
                variant="accent"
                size="lg"
                className="w-full font-bold shadow-soft text-accent-foreground hover:-translate-y-[2px] hover:scale-[1.02] sm:w-auto"
              >
                <Store className="h-4 w-4" aria-hidden="true" />
                <span>Start a merchant enquiry</span>
              </Button>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

export default BusinessAcquisitionSection;
