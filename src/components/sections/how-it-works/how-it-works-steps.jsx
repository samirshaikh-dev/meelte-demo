import React from "react";
import Link from "next/link";
import { ArrowRight, Route } from "@/lib/icons";
import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";

/**
 * The resident journey, in the order the app asks for it.
 *
 * Every step maps to a journey documented in docs/target_customer.md §4 (persona
 * "Riya"): install, sign in, allow location so the feed sorts by distance, open a
 * dated offer or request to join an event, then settle with the shop or host.
 */
export const RESIDENT_STEPS = [
  {
    title: "Install the app and sign in",
    body: "Download meelTe from Google Play or the App Store, then sign in with a phone number, an email and password, Google or Apple.",
  },
  {
    title: "Allow location",
    body: "Location is what makes the feed local. Offers and events are sorted by distance from where you are, and the Max distance filter starts at 60 km and can be narrowed.",
  },
  {
    title: "Browse offers and events nearby",
    body: "An offer carries its price or discount and the exact dates it runs. An event shows its date, time, pinned location and the host's joining cost before you ask to join.",
  },
  {
    title: "Take the next step",
    body: "Open one-tap Google Maps directions to the shop or venue, follow a shop to hear about its next offer, or send a join request to an event host with your group size.",
  },
];

export function HowItWorksSteps() {
  return (
    <section
      id="residents"
      aria-labelledby="how-it-works-steps-heading"
      className="scroll-mt-20 border-b border-border/80 bg-canvas py-8 sm:py-12 lg:py-14"
    >
      <Container>
        <div className="max-w-2xl">
          <h2
            id="how-it-works-steps-heading"
            className="text-3xl font-extrabold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-[2.6rem] text-balance"
          >
            What happens after you install.
          </h2>
          <p className="mt-2 text-base leading-relaxed text-foreground-secondary sm:text-lg">
            Four steps, in the order the app asks for them. There is no booking
            form, no checkout and no account to create on the web.
          </p>
        </div>

        <ol role="list" className="mt-6 sm:mt-8 grid gap-4 sm:gap-5 sm:grid-cols-2">
          {RESIDENT_STEPS.map((step, index) => (
            <li
              key={step.title}
              className="flex items-start gap-3.5 sm:gap-4 rounded-2xl border border-border/80 bg-surface p-5 sm:p-6 shadow-soft"
            >
              <span
                aria-hidden="true"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-surface-muted text-sm font-bold text-primary"
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="text-lg font-bold tracking-tight text-foreground">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-foreground-secondary">
                  {step.body}
                </p>
              </div>
            </li>
          ))}
        </ol>

      </Container>
    </section>
  );
}

export default HowItWorksSteps;
