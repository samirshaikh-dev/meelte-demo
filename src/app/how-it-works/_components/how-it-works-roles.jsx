import React from "react";
import Link from "next/link";
import { ArrowRight, CalendarDays, Store, Users } from "@/lib/icons";
import { OPERATIONAL_HUBS } from "@/constants/app-constants";
import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";

/**
 * The three sides of the platform, stated plainly.
 *
 * Each card answers "what does this role actually do in the app?" and points at
 * the page that covers that role in full, so /how-it-works explains the mechanics
 * and the dedicated pages carry the detail. Nothing here is a capability the
 * product does not ship:
 *
 * - Shops: single-product ad or a catalogue of up to 100 items, a price or
 *   discount, a defined run of dates, and in-person onboarding by the field team
 *   (docs/target_customer.md §5, faq-8).
 * - Hosts: event date, time, location, visibility and joining cost, with
 *   approval-based join requests carrying group size (faq-9, faq-10).
 * - Neighbours: friends, follows, 1:1 chat with documents and location, plus
 *   voice/video calls — while Discover People is still rolling out (faq-19).
 *
 * Deliberately absent: merchant pricing, "verified business" wording, and any
 * reach or performance claim (meelte-context.md claim guardrails).
 *
 * `id="roles"` is the anchor for this section; the `ItemList` in `page.jsx` mirrors
 * these three cards and links each role at the page that covers it in full.
 */
const ROLES = [
  {
    id: "shops",
    icon: Store,
    title: "Shops & service businesses",
    body: "A shop posts what is on offer — one product or a catalogue of up to 100 — with a price or discount and the dates it runs. Shops in ",
    bodyTail:
      " are onboarded in person by the Meelte field team rather than through a self-serve form.",
    link: { href: "/for-merchants", label: "Merchant onboarding" },
  },
  {
    id: "hosts",
    icon: CalendarDays,
    title: "Event hosts & clubs",
    body: "A host publishes an event with a date, a time, a map location and a joining cost, then approves or rejects each join request by group size. Attendees can be removed later, and any fee settles directly with the host.",
    link: { href: "/discover#events", label: "How events work" },
  },
  {
    id: "neighbours",
    icon: Users,
    title: "Neighbours & new arrivals",
    body: "Follow the shops and hosts you meet, add friends, and talk one to one with text, documents and location sharing. Voice and video calls are built in. Browsing new people nearby is still rolling out.",
    link: { href: "/discover#people", label: "People and chat" },
  },
];

export function HowItWorksRoles() {
  return (
    <section
      id="roles"
      aria-labelledby="how-it-works-roles-heading"
      className="scroll-mt-20 border-b border-border/80 bg-surface py-16 sm:py-20"
    >
      <Container>
        <div className="max-w-2xl">
          <Badge variant="primary" className="mb-3 gap-1.5">
            <Users className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
            <span>Who it is for</span>
          </Badge>
          <h2
            id="how-it-works-roles-heading"
            className="text-3xl font-extrabold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-[2.6rem]"
          >
            Three kinds of people use Meelte.
          </h2>
          <p className="mt-3.5 text-base leading-relaxed text-foreground-secondary sm:text-lg">
            A resident browsing, a shop posting an offer and a host filling an
            event all work from the same nearby feed. Each one has a different job
            to do in the app.
          </p>
        </div>

        <ul role="list" className="mt-10 grid gap-4 sm:mt-12 lg:grid-cols-3">
          {ROLES.map((role) => {
            const Icon = role.icon;
            return (
              <li
                key={role.id}
                className="flex flex-col rounded-3xl border border-border/80 bg-surface p-6 shadow-soft sm:p-7"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-surface-muted text-primary">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>

                <h3 className="mt-4 text-lg font-bold tracking-tight text-foreground">
                  {role.title}
                </h3>

                <p className="mt-2 flex-1 text-sm leading-relaxed text-foreground-secondary">
                  {role.bodyTail ? (
                    <>
                      {role.body}
                      <span className="font-semibold text-foreground">
                        {OPERATIONAL_HUBS.join(", ")}
                      </span>
                      {role.bodyTail}
                    </>
                  ) : (
                    role.body
                  )}
                </p>

                <Link
                  href={role.link.href}
                  className="group mt-5 inline-flex min-h-11 items-center gap-1.5 rounded text-sm font-bold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2"
                >
                  <span>{role.link.label}</span>
                  <ArrowRight
                    className="h-3.5 w-3.5 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}

export default HowItWorksRoles;
