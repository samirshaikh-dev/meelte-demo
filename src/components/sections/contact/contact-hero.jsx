import React from "react";
import { HelpCircle, Mail, MessageSquare, Phone } from "@/lib/icons";
import { Container } from "@/components/layout/container";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import {
  CONTACT_BREADCRUMBS,
  CONTACT_CHANNELS,
  CONTACT_HERO,
} from "./contact-content";

export function ContactHero() {
  return (
    <section className="relative overflow-hidden border-b border-border/80 bg-canvas pt-10 pb-12 sm:pt-14 sm:pb-16 lg:pt-16 lg:pb-18">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-canvas to-canvas"
      />

      <Container>
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <Breadcrumbs
            items={CONTACT_BREADCRUMBS}
            className="mb-3.5 sm:mb-4"
            listClassName="justify-center"
          />

          <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-surface px-3.5 py-1.5 shadow-soft mb-3.5 sm:mb-4">
            <span className="flex h-2 w-2 rounded-full bg-primary" aria-hidden="true" />
            <span className="text-xs font-semibold text-foreground">
              Contact &amp; Support
            </span>
            <span className="text-border" aria-hidden="true">·</span>
            <span className="text-xs font-medium text-foreground-secondary">
              Real Humans • Real Help
            </span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl text-balance">
            {CONTACT_HERO.titleLead}{" "}
            <span className="text-primary">{CONTACT_HERO.titleAccent}</span>
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-relaxed text-foreground-secondary sm:text-lg">
            {CONTACT_HERO.lead}
          </p>

        </div>
      </Container>
    </section>
  );
}

export default ContactHero;
