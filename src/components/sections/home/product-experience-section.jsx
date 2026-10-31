"use client";

import { useState } from "react";
import {
  Smartphone,
  Tag,
  CalendarDays,
  MessageSquare,
  Lock,
} from "@/lib/icons";
import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";

const EXPERIENCES = [
  {
    id: "offers",
    label: "Local offers",
    icon: Tag,
    description:
      "See shop ads with prices or discounts, date ranges, and directions in Google Maps.",
    announcement:
      "Shop ads show a price or discount, start and end dates, and a Google Maps directions option. Shop catalogues can include up to 100 products.",
    screenBadge: "Discover",
    screenTitle: "Offer details",
    screenSubtitle: "Distance filter · default 60 km",
    screenContent: (
      <div className="flex flex-col gap-3">
        <div className="rounded-2xl border border-border/80 bg-surface p-4">
          <p className="text-xs font-semibold text-foreground-secondary">
            Ad format
          </p>
          <p className="mt-1 font-bold text-foreground">
            One product or a shop catalogue
          </p>
          <p className="mt-1 text-sm leading-relaxed text-foreground-secondary">
            Shop catalogues can include up to 100 products.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-border/80 bg-surface p-3">
            <p className="text-sm font-semibold text-foreground">Price or discount</p>
            <p className="mt-1 text-xs text-foreground-secondary">Set by the shop</p>
          </div>
          <div className="rounded-2xl border border-border/80 bg-surface p-3">
            <p className="text-sm font-semibold text-foreground">Date range</p>
            <p className="mt-1 text-xs text-foreground-secondary">Start and end dates</p>
          </div>
        </div>

        <div className="rounded-xl border border-primary/20 bg-surface-muted px-4 py-3 text-center text-sm font-semibold text-primary">
          Get directions · Google Maps
        </div>
      </div>
    ),
  },
  {
    id: "events",
    label: "Local events",
    icon: CalendarDays,
    description:
      "Request to join public or private events; hosts decide who attends.",
    announcement:
      "Events show their date, time, location, and joining cost. You can request to join alone or with a group, and the host decides who attends.",
    screenBadge: "Events",
    screenTitle: "Request to Join",
    screenSubtitle: "The host manages attendance",
    screenContent: (
      <div className="flex flex-col gap-3">
        <div className="rounded-2xl border border-border/80 bg-surface p-4">
          <p className="text-xs font-semibold text-foreground-secondary">
            Event details
          </p>
          <div className="mt-3 flex flex-col gap-3">
            <div className="flex items-start justify-between gap-3">
              <span className="text-sm font-medium text-foreground">Visibility</span>
              <span className="text-right text-sm text-foreground-secondary">
                Public or private
              </span>
            </div>
            <div className="flex items-start justify-between gap-3">
              <span className="text-sm font-medium text-foreground">Joining cost</span>
              <span className="text-right text-sm text-foreground-secondary">
                Set by the host
              </span>
            </div>
            <div className="flex items-start justify-between gap-3">
              <span className="text-sm font-medium text-foreground">Group size</span>
              <span className="text-right text-sm text-foreground-secondary">
                Included in your request
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-primary/20 bg-surface-muted px-4 py-3 text-center text-sm font-semibold text-primary">
          Request to Join
        </div>
        <p className="px-1 text-sm leading-relaxed text-foreground-secondary">
          The host can approve, reject, or remove attendees. Any event fee is paid directly to the host.
        </p>
      </div>
    ),
  },
  {
    id: "chat",
    label: "People and chat",
    icon: MessageSquare,
    description:
      "Chat one to one with friends and follows, and use voice or video calls.",
    announcement:
      "One-to-one chat supports text, emoji, documents, and location. Voice and video calls, plus block and report tools, are available.",
    screenBadge: "Connect",
    screenTitle: "One-to-one chat",
    screenSubtitle: "Friends and follows",
    screenContent: (
      <div className="flex flex-col gap-3">
        <div className="rounded-2xl border border-border/80 bg-surface p-4">
          <p className="text-xs font-semibold text-foreground-secondary">
            Chat supports
          </p>
          <ul className="mt-3 flex flex-col gap-2.5">
            {["Text and emoji", "Documents and location", "Voice and video calls"].map(
              (feature) => (
                <li
                  key={feature}
                  className="flex items-center gap-2.5 text-sm font-medium text-foreground"
                >
                  <span
                    className="h-2 w-2 shrink-0 rounded-full bg-primary"
                    aria-hidden="true"
                  />
                  {feature}
                </li>
              ),
            )}
          </ul>
        </div>

        <div className="rounded-xl border border-primary/20 bg-surface-muted px-4 py-3 text-center text-sm font-semibold text-primary">
          Block and report tools
        </div>
      </div>
    ),
  },
  {
    id: "privacy",
    label: "Location and privacy",
    icon: Lock,
    description:
      "Location helps sort nearby listings and check configured ad city zones. It is not sold to ad brokers.",
    announcement:
      "Location is used to sort ads and events by distance and check configured ad city zones. Meelte does not build movement histories or sell location data to ad brokers.",
    screenBadge: "Privacy",
    screenTitle: "Location use",
    screenSubtitle: "What location supports",
    screenContent: (
      <div className="flex flex-col gap-3">
        <div className="rounded-2xl border border-border/80 bg-surface p-4">
          <p className="text-xs font-semibold text-foreground-secondary">
            Used for
          </p>
          <div className="mt-3 flex flex-col gap-3">
            <div className="flex items-start justify-between gap-3">
              <span className="text-sm font-medium text-foreground">Distance sorting</span>
              <span className="text-right text-sm text-foreground-secondary">
                Ads and events
              </span>
            </div>
            <div className="flex items-start justify-between gap-3">
              <span className="text-sm font-medium text-foreground">City-zone check</span>
              <span className="text-right text-sm text-foreground-secondary">
                Configured ad zones
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border/80 bg-surface p-4">
          <p className="text-sm font-semibold text-foreground">
            Location is not sold to ad brokers
          </p>
          <p className="mt-1 text-sm leading-relaxed text-foreground-secondary">
            Meelte does not build movement histories.
          </p>
        </div>
      </div>
    ),
  },
];

export function ProductExperienceSection() {
  const [activeExpId, setActiveExpId] = useState("offers");
  const activeExp = EXPERIENCES.find((experience) => experience.id === activeExpId);
  const activeExperience = activeExp || EXPERIENCES[0];
  const ActiveIcon = activeExperience.icon;

  return (
    <section
      id="product-tour"
      className="scroll-mt-20 border-b border-border/80 bg-canvas py-16 sm:py-24"
    >
      <Container>
        <div className="mb-10 max-w-3xl sm:mb-14">
          <Badge variant="primary" className="mb-3 gap-1.5">
            <Smartphone className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
            <span>Product experience</span>
          </Badge>
          <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-[2.6rem]">
            What you can do in the app.
          </h2>
          <p className="mt-3.5 text-base leading-relaxed text-foreground-secondary sm:text-lg">
            Explore four capabilities available today. Meelte is live on Google Play
            and the App Store; the web app is still in development.
          </p>
        </div>

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center lg:gap-12">
          <div
            role="group"
            aria-label="Choose a product capability"
            className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1"
          >
            {EXPERIENCES.map((experience) => {
              const Icon = experience.icon;
              const isSelected = experience.id === activeExperience.id;

              return (
                <button
                  key={experience.id}
                  type="button"
                  onClick={() => setActiveExpId(experience.id)}
                  aria-pressed={isSelected}
                  aria-controls="product-experience-preview"
                  aria-describedby={`${experience.id}-description`}
                  className={`rounded-2xl border p-4 text-left transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 sm:p-5 ${
                    isSelected
                      ? "border-primary/40 bg-surface shadow-soft"
                      : "border-border/80 bg-surface hover:border-primary/30 hover:bg-surface-subtle"
                  }`}
                >
                  <span className="flex items-center justify-between gap-3">
                    <span className="flex min-w-0 items-center gap-3">
                      <span
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                          isSelected
                            ? "bg-primary text-white"
                            : "bg-surface-muted text-primary"
                        }`}
                      >
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <span
                        className={`font-bold leading-snug ${
                          isSelected ? "text-primary" : "text-foreground"
                        }`}
                      >
                        {experience.label}
                      </span>
                    </span>
                    {isSelected && (
                      <span className="shrink-0 rounded-full bg-surface-muted px-2.5 py-1 text-xs font-semibold text-primary">
                        Selected
                      </span>
                    )}
                  </span>
                  <span
                    id={`${experience.id}-description`}
                    className="mt-3 block text-sm leading-relaxed text-foreground-secondary sm:pl-[3.25rem]"
                  >
                    {experience.description}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex flex-col items-center gap-3">
            <div
              id="product-experience-preview"
              role="region"
              aria-labelledby="product-experience-preview-heading"
              className="w-full max-w-[360px] rounded-[2rem] border border-primary/20 bg-foreground p-2.5 shadow-card sm:p-3"
            >
              <div className="flex justify-center py-2" aria-hidden="true">
                <span className="h-1 w-12 rounded-full bg-surface/60" />
              </div>

              <div className="min-h-[400px] rounded-[1.5rem] border border-border/80 bg-canvas p-4 sm:p-5">
                <div className="mb-4 flex items-center justify-between gap-3 border-b border-border/80 pb-3">
                  <div className="min-w-0">
                    <h3
                      id="product-experience-preview-heading"
                      className="mt-0.5 font-extrabold leading-tight text-foreground"
                    >
                      {activeExperience.screenTitle}
                    </h3>
                    <p className="mt-1 text-sm leading-snug text-foreground-secondary">
                      {activeExperience.screenSubtitle}
                    </p>
                  </div>
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-muted text-primary">
                    <ActiveIcon className="h-5 w-5" aria-hidden="true" />
                  </span>
                </div>

                {activeExperience.screenContent}
              </div>
            </div>

            <p className="max-w-sm text-center text-sm leading-relaxed text-foreground-secondary">
              Conceptual preview only. Not a live listing or a screenshot of the app.
            </p>
            <p className="sr-only" aria-live="polite" aria-atomic="true">
              Preview updated: {activeExperience.label}. {activeExperience.announcement}
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default ProductExperienceSection;
