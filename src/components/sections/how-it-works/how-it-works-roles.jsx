import React from "react";
import Link from "next/link";
import { ArrowRight, CalendarDays, Store, Users } from "@/lib/icons";
import { Container } from "@/components/layout/container";

/**
 * The three sides of the platform, stated plainly.
 *
 * Each card answers "what does this role actually do in the app?" and points at
 * the page that covers that role in full, so /how-it-works explains the mechanics
 * and the dedicated pages carry the detail.
 */
const ROLES = [
  {
    id: "shops",
    icon: Store,
    title: "Shops & service businesses",
    body: "A shop posts what is on offer — one product or a catalogue of up to 100 — with a price or discount and the dates it runs. Local shops are onboarded in person by the meelTe field team rather than through a self-serve form.",
    link: { href: "/for-merchants", label: "Merchant onboarding" },
  },
  {
    id: "hosts",
    icon: CalendarDays,
    title: "Event hosts & clubs",
    body: "A host publishes an event with a date, a time, a map location and a joining cost, then approves or rejects each join request by group size. Attendees can be removed later, and any fee settles directly with the host.",
    link: { href: "/how-it-works#roles", label: "How events work" },
  },
  {
    id: "neighbours",
    icon: Users,
    title: "Neighbours & new arrivals",
    body: "Follow the shops and hosts you meet, add friends, and talk one to one with text, documents and location sharing. Voice and video calls are built in. Browsing new people nearby is still rolling out.",
    link: { href: "/signup", label: "People and chat" },
  },
];

export function HowItWorksRoles() {
  return (
    <section
      id="roles"
      aria-labelledby="how-it-works-roles-heading"
      className="scroll-mt-20 border-b border-border/80 bg-canvas py-8 sm:py-12 lg:py-14"
    >
      <Container>
        <div className="max-w-2xl">
          <h2
            id="how-it-works-roles-heading"
            className="text-3xl font-extrabold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-[2.6rem] text-balance"
          >
            Three kinds of people use meelTe.
          </h2>
        </div>

        <ul role="list" className="mt-6 sm:mt-8 grid gap-4 sm:gap-5 lg:grid-cols-3">
          {ROLES.map((role) => {
            const Icon = role.icon;
            return (
              <li
                key={role.id}
                className="flex flex-col justify-between rounded-2xl border border-primary/15 bg-surface p-4 sm:p-5 shadow-none transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-soft"
              >
                <div>
                  <div className="flex items-start gap-3.5 sm:gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-muted text-primary">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base font-semibold tracking-tight text-foreground">
                        {role.title}
                      </h3>
                      <p className="mt-1 text-sm leading-relaxed text-foreground-secondary">
                        {role.body}
                      </p>
                    </div>
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

export default HowItWorksRoles;
