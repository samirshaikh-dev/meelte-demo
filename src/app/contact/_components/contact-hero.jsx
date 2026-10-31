import React from "react";
import Link from "next/link";
import { ArrowRight, Clock, Mail, Phone, Sparkles } from "@/lib/icons";
import { Container } from "@/components/layout/container";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CONTACT_BREADCRUMBS,
  CONTACT_CHANNELS,
  CONTACT_DIRECT,
  CONTACT_HERO,
} from "./contact-content";

/**
 * /contact hero.
 *
 * Was a single centred column (headline + lead + one CTA) with the support
 * channels living far below in the aside. The direct channels are the fastest
 * route for most of this page's visitors, so they now sit in the hero's second
 * column instead of being scrolled past: an asymmetric split, headline left,
 * "Contact support" card right.
 *
 * The card keeps the same `bg-primary` panel it had in the aside, which is the
 * only place on the page where the brand fill carries the hierarchy — the form
 * stays on plain surface so it reads as the calmer, longer task.
 *
 * Token notes:
 * - The `<h1>` accent uses the token gradient (`primary → primary-hover →
 *   primary-royal`), matching the `/about` and `/careers` heroes instead of the
 *   raw `indigo-500` / `violet-500` variant still used on `/` and `/discover`
 *   (docs/Design.md §9.1).
 * - Focus rings inside the purple card are `ring-white` with
 *   `ring-offset-primary`; `ring-primary/70` would be invisible on the fill.
 * - The radial wash is decorative and `aria-hidden`, matching the about and
 *   careers heroes.
 * - Emails and phone numbers render as real `mailto:`/`tel:` links, so a visitor
 *   who never opens the form still has a one-tap route.
 */
export function ContactHero() {
  return (
    <section className="relative overflow-hidden border-b border-border/80 pt-8 pb-14 sm:pt-12 sm:pb-20">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-canvas to-canvas"
      />

      <Container>
        <Breadcrumbs items={CONTACT_BREADCRUMBS} className="mb-6" />

        <div className="grid gap-10 lg:grid-cols-12 lg:items-start lg:gap-x-12">
          <div className="lg:col-span-7">
            <Badge variant="primary" className="mb-5 gap-1.5">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{CONTACT_HERO.badge}</span>
            </Badge>

            <h1 className="text-4xl font-black leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              {CONTACT_HERO.titleLead}{" "}
              <span className="text-primary">
                {CONTACT_HERO.titleAccent}
              </span>
            </h1>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-foreground-secondary sm:text-lg">
              {CONTACT_HERO.lead}
            </p>

            <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
              <Button
                as="a"
                href="#contact-form"
                variant="primary"
                size="lg"
                className="group justify-center font-semibold shadow-card"
              >
                <span>{CONTACT_HERO.formCta}</span>
                <ArrowRight
                  className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Button>

              <Button
                as={Link}
                href="/faq"
                variant="outline"
                size="lg"
                className="justify-center font-medium"
              >
                <span>{CONTACT_HERO.faqCta}</span>
              </Button>
            </div>
          </div>

          <div className="lg:col-span-5">
            <section
              aria-labelledby="direct-contact-heading"
              className="rounded-2xl bg-primary p-6 text-white shadow-card sm:p-7"
            >
              <h2
                id="direct-contact-heading"
                className="mt-2 text-2xl font-bold tracking-tight"
              >
                {CONTACT_DIRECT.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-white">
                {CONTACT_DIRECT.body}
              </p>

              <ul role="list" className="mt-6 space-y-3">
                <li>
                  <a
                    href={CONTACT_CHANNELS.emailHref}
                    className="flex min-w-0 items-center gap-3 rounded-xl border border-white/25 bg-white/10 p-3 text-sm font-semibold text-white underline-offset-4 transition-colors hover:bg-white/15 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
                  >
                    <Mail className="h-5 w-5 shrink-0" aria-hidden="true" />
                    <span className="break-all">{CONTACT_CHANNELS.email}</span>
                  </a>
                </li>
                <li>
                  <a
                    href={CONTACT_CHANNELS.phoneHref}
                    className="flex items-center gap-3 rounded-xl border border-white/25 bg-white/10 p-3 text-sm font-semibold text-white underline-offset-4 transition-colors hover:bg-white/15 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
                  >
                    <Phone className="h-5 w-5 shrink-0" aria-hidden="true" />
                    <span>{CONTACT_CHANNELS.phoneDisplay}</span>
                  </a>
                </li>
              </ul>

              <div className="mt-6 border-t border-white/25 pt-5">
                <p className="flex items-center gap-2 text-sm font-semibold">
                  <Clock className="h-4 w-4 shrink-0" aria-hidden="true" />
                  {CONTACT_DIRECT.hoursLabel}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-white">
                  {CONTACT_DIRECT.hours}
                </p>
              </div>
            </section>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default ContactHero;
