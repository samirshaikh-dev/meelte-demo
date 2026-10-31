import React from "react";
import { Download } from "@/lib/icons";
import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";

/**
 * First-run path for /signup: install → allow location → find something nearby.
 *
 * Same three steps as /discover, mapped to the documented "Riya" journey
 * (docs/target_customer.md §4). The steps are a real `<ol>` so the order is
 * conveyed structurally and the numbered tiles can stay `aria-hidden` decoration.
 *
 * Deliberately absent: a form, a "create your account here" step, and any claim
 * about a browser-based sign-up. Step one is the only place an account is made.
 */
const STEPS = [
  {
    title: "Install the app",
    body: "Download Meelte from Google Play or the App Store. The web app is not live yet.",
  },
  {
    title: "Turn on location",
    body: "Location is what sorts offers and events by distance. It is used only to show what is near you and is never sold or shared.",
  },
  {
    title: "Find something nearby",
    body: "Open a time-boxed offer and tap directions, or send a join request to a local event host.",
  },
];

export function SignupSteps() {
  return (
    <section
      aria-labelledby="signup-steps-heading"
      className="border-b border-border/80 bg-canvas py-14 sm:py-20"
    >
      <Container>
        <div className="max-w-2xl">
          <Badge variant="primary" className="mb-3 gap-1.5">
            <Download className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Getting started</span>
          </Badge>

          <h2
            id="signup-steps-heading"
            className="text-2xl font-extrabold leading-tight tracking-tight text-foreground sm:text-3xl lg:text-4xl"
          >
            From install to something nearby.
          </h2>

          <p className="mt-3 text-base leading-relaxed text-foreground-secondary">
            Three steps, and the first one happens in an app store.
          </p>
        </div>

        <ol role="list" className="mt-10 grid gap-6 sm:mt-12 lg:grid-cols-3">
          {STEPS.map((step, index) => (
            <li
              key={step.title}
              className="rounded-3xl border border-border/80 bg-surface p-6 sm:p-7"
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

export default SignupSteps;
