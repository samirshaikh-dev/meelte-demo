import React from "react";
import { Download, ArrowRight } from "@/lib/icons";
import { PLAY_STORE_URL } from "@/config/site";
import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

/**
 * First-run path for /discover: install → allow location → find something nearby.
 *
 * Every step maps to a journey documented in docs/target_customer.md §4 (persona
 * "Riya"): install from a shared link, sign up, allow location so the feed sorts
 * by distance, then open a dated offer or request to join an event.
 *
 * Deliberately absent: sign-up bonus amounts, per-city zone rules and any claim
 * about coverage outside Bengaluru, Gaya and Ranchi. The page's job is to make the
 * next action obvious, not to sell a reward programme.
 */
const STEPS = [
  {
    title: "Download the app",
    body: "Meelte for Android is on Google Play. The web app is still in development.",
  },
  {
    title: "Turn on location",
    body: "That is how offers and events are sorted by distance. Your location is never sold or shared.",
  },
  {
    title: "Browse what is nearby",
    body: "Open a time-boxed offer and tap directions, or send a join request to a local event host.",
  },
];

export function DiscoverSteps() {
  return (
    <section
      aria-labelledby="discover-steps-heading"
      className="border-b border-border/80 bg-surface py-14 sm:py-20"
    >
      <Container>
        <div className="max-w-2xl">
          <Badge variant="primary" className="mb-3 gap-1.5">
            <Download className="h-3.5 w-3.5" aria-hidden="true" />
            <span>How it starts</span>
          </Badge>
          <h2
            id="discover-steps-heading"
            className="text-2xl font-extrabold leading-tight tracking-tight text-foreground sm:text-3xl lg:text-4xl"
          >
            From download to something to do nearby.
          </h2>
          <p className="mt-3 text-base leading-relaxed text-foreground-secondary">
            Three steps. No booking forms, no account to create on the web.
          </p>
        </div>

        <ol role="list" className="mt-10 grid gap-6 sm:mt-12 lg:grid-cols-3">
          {STEPS.map((step, index) => (
            <li
              key={step.title}
              className="rounded-3xl border border-border/80 bg-canvas p-6 sm:p-7"
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

      </Container>
    </section>
  );
}

export default DiscoverSteps;
