import React from "react";
import Link from "next/link";
import { ArrowRight, Mail, Phone, Store } from "@/lib/icons";
import { Container } from "@/components/layout/container";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import {
  CONTACT_BREADCRUMBS,
  CONTACT_CHANNELS,
  CONTACT_DIRECT,
  CONTACT_HERO,
} from "./contact-content";

export function ContactHero() {
  return (
    <section className="relative overflow-hidden border-b border-border/80 bg-canvas pt-8 pb-10 sm:pt-12 sm:pb-14 lg:pt-14 lg:pb-16">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-canvas to-canvas"
      />

      <Container>
        {/* Centered Brand Breadcrumbs & Header */}
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <Breadcrumbs
            items={CONTACT_BREADCRUMBS}
            className="mb-3.5 sm:mb-4"
            listClassName="justify-center"
          />

          <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-surface px-3.5 py-1.5 shadow-soft mb-3 sm:mb-4">
            <span className="flex h-2 w-2 rounded-full bg-primary" aria-hidden="true" />
            <span className="text-xs font-semibold text-foreground">
              Contact &amp; Support
            </span>
            <span className="text-border" aria-hidden="true">·</span>
            <span className="text-xs font-medium text-foreground-secondary">
              Real Humans • Real Help
            </span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            {CONTACT_HERO.titleLead}{" "}
            <span className="text-primary">{CONTACT_HERO.titleAccent}</span>
          </h1>

          <p className="mt-3.5 max-w-xl text-base leading-relaxed text-foreground-secondary sm:text-lg">
            {CONTACT_HERO.lead}
          </p>
        </div>

        {/* 3 Quick Contact Channel Cards Grid */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
          {/* Channel 1: Customer Support */}
          <div className="flex flex-col justify-between rounded-2xl border border-border/80 bg-surface p-5 sm:p-6 shadow-soft transition-all hover:border-primary/40 hover:shadow-card">
            <div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-surface-muted text-primary">
                <Mail className="h-5 w-5" aria-hidden="true" />
              </div>
              <h2 className="mt-4 text-base sm:text-lg font-bold text-foreground">
                Customer Support
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-foreground-secondary leading-relaxed">
                For app help, account inquiries, or general feedback.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-border/70">
              <a
                href={CONTACT_CHANNELS.emailHref}
                className="text-sm font-bold text-primary hover:underline inline-flex items-center gap-1.5 break-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 rounded"
              >
                <span>{CONTACT_CHANNELS.email}</span>
                <ArrowRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              </a>
              <span className="mt-1.5 block text-xs text-foreground-secondary font-medium">
                {CONTACT_DIRECT.hours}
              </span>
            </div>
          </div>

          {/* Channel 2: Direct Helpline */}
          <div className="flex flex-col justify-between rounded-2xl border border-border/80 bg-surface p-5 sm:p-6 shadow-soft transition-all hover:border-primary/40 hover:shadow-card">
            <div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-surface-muted text-primary">
                <Phone className="h-5 w-5" aria-hidden="true" />
              </div>
              <h2 className="mt-4 text-base sm:text-lg font-bold text-foreground">
                Direct Helpline
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-foreground-secondary leading-relaxed">
                Direct telephonic support for urgent account or listing questions.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-border/70">
              <a
                href={CONTACT_CHANNELS.phoneHref}
                className="text-sm font-bold text-primary hover:underline inline-flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 rounded"
              >
                <span>{CONTACT_CHANNELS.phoneDisplay}</span>
                <ArrowRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              </a>
              <span className="mt-1.5 block text-xs text-foreground-secondary font-medium">
                Mon–Fri, 9:00 AM – 6:00 PM IST
              </span>
            </div>
          </div>

          {/* Channel 3: Merchant Onboarding */}
          <div className="flex flex-col justify-between rounded-2xl border border-border/80 bg-surface p-5 sm:p-6 shadow-soft transition-all hover:border-primary/40 hover:shadow-card sm:col-span-2 lg:col-span-1">
            <div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-surface-muted text-primary">
                <Store className="h-5 w-5" aria-hidden="true" />
              </div>
              <h2 className="mt-4 text-base sm:text-lg font-bold text-foreground">
                Merchant Desk
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-foreground-secondary leading-relaxed">
                In-person shop onboarding and 0% commission local promotions.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-border/70">
              <Link
                href="/for-merchants"
                className="text-sm font-bold text-primary hover:underline inline-flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 rounded"
              >
                <span>Explore merchant guide</span>
                <ArrowRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              </Link>
              <span className="mt-1.5 block text-xs text-foreground-secondary font-medium">
                In-person visits across active city zones
              </span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default ContactHero;
