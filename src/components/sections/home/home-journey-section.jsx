"use client";

import React, { useState } from "react";
import { Container } from "@/components/layout/container";

const AUDIENCES = {
  residents: {
    id: "residents",
    label: "For Residents",
    subtitle: "How to discover deals, events, and people around you",
    steps: [
      {
        number: "01",
        title: "Set your neighbourhood radius",
        description:
          "Open the app on Android or iOS and allow location. The feed instantly sorts nearby shop offers and community gatherings by proximity, so you discover what is happening right in your area.",
        highlight: "Nearby Discovery",
      },
      {
        number: "02",
        title: "Spot dated offers and joinable events",
        description:
          "Check time-boxed shop catalogues (up to 100 items) with start/end dates and exact rupee discounts. For events, review dates, locations, and join conditions.",
        highlight: "Start & end dates + ₹ prices",
      },
      {
        number: "03",
        title: "Get directions or request to join",
        description:
          "Tap once to open Google Maps directions straight to the shop, or send a Request to Join to an event host with your group size. Buying and event settlement happen offline directly.",
        highlight: "One-tap Google Maps directions",
      },
    ],
    ctaText: "See how it works",
    ctaHref: "/how-it-works",
  },
  merchants: {
    id: "merchants",
    label: "For Local Merchants",
    subtitle: "How neighbourhood shops and restaurants get discovered",
    steps: [
      {
        number: "01",
        title: "Connect with our merchant desk",
        description:
          "Reach out online or through our field team with your shop name, category, and locality to get started.",
        highlight: "Ground team support",
      },
      {
        number: "02",
        title: "In-person setup and menu digitisation",
        description:
          "Our field staff visits your shop to help create your profile. Simply photograph your menu or price list — our photo tool reads items and prices into a catalogue of up to 100 products.",
        highlight: "AI menu import from photo",
      },
      {
        number: "03",
        title: "Publish offers directly to nearby footfall",
        description:
          "Set flat or percentage discounts and your active dates. Your offer goes live at 12:00 AM on the start date to local shoppers, and followers get push notifications on updates.",
        highlight: "Follower update notifications",
      },
    ],
    ctaText: "Read merchant guide & terms",
    ctaHref: "/for-merchants",
  },
};

export function HomeJourneySection() {
  const [selectedAudience, setSelectedAudience] = useState("residents");
  const current = AUDIENCES[selectedAudience];

  return (
    <section className="border-b border-border/80 bg-canvas py-8 sm:py-12 lg:py-14">
      <Container>
        {/* Section heading: one clean title given the full container measure, so it never orphans a word */}
        <div className="border-b border-border/80 pb-6 sm:pb-7">
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground md:text-4xl lg:text-[2.6rem] lg:leading-tight text-balance">
            Predictable, low-effort from day one.
          </h2>
        </div>

        <div className="mt-6 sm:mt-7">
          {/* Audience switcher sits with the panel it controls, so the heading keeps the full width */}
          <div className="mb-3.5 flex flex-col gap-3 sm:mb-4 lg:flex-row lg:items-center lg:justify-between">
            <p className="text-sm font-semibold text-foreground-secondary">
              {current.subtitle}
            </p>

            <div
              role="tablist"
              aria-label="Choose journey by audience"
              className="flex shrink-0 items-center self-start rounded-xl border border-border/80 bg-surface p-1 shadow-soft lg:self-auto"
            >
              {Object.values(AUDIENCES).map((audience) => {
                const isActive = audience.id === selectedAudience;
                return (
                  <button
                    key={audience.id}
                    type="button"
                    role="tab"
                    id={`tab-${audience.id}`}
                    aria-selected={isActive}
                    aria-controls={`panel-${audience.id}`}
                    onClick={() => setSelectedAudience(audience.id)}
                    className={`rounded-lg px-4 py-2 text-xs sm:text-sm font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-1 ${
                      isActive
                        ? "bg-primary text-white shadow-soft"
                        : "text-foreground-secondary hover:text-foreground hover:bg-surface-subtle"
                    }`}
                  >
                    {audience.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab Panel: 3 process steps */}
          <div
            role="tabpanel"
            id={`panel-${current.id}`}
            aria-labelledby={`tab-${current.id}`}
            className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-3"
          >
            {current.steps.map((step) => (
              <div
                key={step.number}
                className="flex flex-col justify-between rounded-2xl border border-border/80 bg-surface p-5 sm:p-6 shadow-soft transition-shadow hover:shadow-card"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl sm:text-3xl font-black text-primary/30 font-mono">
                      {step.number}
                    </span>
                    <span className="rounded-full bg-surface-muted px-2.5 py-1 text-[11px] font-semibold text-primary">
                      {step.highlight}
                    </span>
                  </div>
                  <h3 className="mt-3.5 text-base sm:text-lg font-bold text-foreground tracking-tight">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm leading-relaxed text-foreground-secondary">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </Container>
    </section>
  );
}

export default HomeJourneySection;
