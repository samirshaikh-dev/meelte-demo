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
 * Product facts used here: the sign-in methods, the "Max distance" default of
 * 60 km, price/discount/date fields on an ad, and the Google Maps directions action.
 *
 * Deliberately absent: the sign-up coin bonus, per-city zone behaviour, and any
 * claim that Meelte handles payments or bookings.
 *
 * `id="residents"` is the anchor for this section, and `RESIDENT_STEPS` is
 * exported so the `HowTo` node in `page.jsx` quotes the same titles and bodies
 * the page renders instead of paraphrasing them.
 */
export const RESIDENT_STEPS = [
  {
    title: "Install the app and sign in",
    body: "Download Meelte from Google Play or the App Store, then sign in with a phone number, an email and password, Google or Apple.",
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
      className="scroll-mt-20 border-b border-border/80 bg-canvas py-16 sm:py-20"
    >
      <Container>
        <div className="max-w-2xl">
          <Badge variant="primary" className="mb-3 gap-1.5">
            <Route className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
            <span>The resident path</span>
          </Badge>
          <h2
            id="how-it-works-steps-heading"
            className="text-3xl font-extrabold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-[2.6rem]"
          >
            What happens after you install.
          </h2>
          <p className="mt-3.5 text-base leading-relaxed text-foreground-secondary sm:text-lg">
            Four steps, in the order the app asks for them. There is no booking
            form, no checkout and no account to create on the web.
          </p>
        </div>

        <ol role="list" className="mt-10 grid gap-4 sm:mt-12 sm:grid-cols-2">
          {RESIDENT_STEPS.map((step, index) => (
            <li
              key={step.title}
              className="rounded-3xl border border-border/80 bg-surface p-6 shadow-soft sm:p-7"
            >
              <span
                aria-hidden="true"
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface-muted text-sm font-black text-primary"
              >
                {index + 1}
              </span>
              <h3 className="mt-4 text-lg font-bold tracking-tight text-foreground">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-foreground-secondary">
                {step.body}
              </p>
            </li>
          ))}
        </ol>

        <div className="mt-8 flex flex-col gap-3 rounded-2xl border border-border/80 bg-surface-subtle p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <p className="max-w-2xl text-sm leading-relaxed text-foreground-secondary">
            <span className="font-semibold text-foreground">
              Who handles the money:
            </span>{" "}
            you settle directly with the shop or the host. Meelte does not take
            payments or sell tickets.
          </p>
          <Link
            href="/faq"
            className="inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded text-sm font-bold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2"
          >
            <span>Payment and safety questions</span>
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
      </Container>
    </section>
  );
}

export default HowItWorksSteps;
