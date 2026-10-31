import React from "react";
import Link from "next/link";
import {
  Apple,
  ArrowRight,
  CalendarDays,
  Info,
  MessageSquare,
  Play,
  Tag,
} from "@/lib/icons";
import { APP_STORE_URL, PLAY_STORE_URL } from "@/config/site";
import { PLATFORM_AREAS } from "@/constants/app-constants";
import { Container } from "@/components/layout/container";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

/**
 * Breadcrumb trail for /how-it-works.
 *
 * Exported so `page.jsx` can emit the matching `BreadcrumbList` through
 * `getBreadcrumbsJsonLd()` — the visible trail and the structured data are built
 * from one array and cannot drift (AI_RULE.md §2.6).
 */
export const HOW_IT_WORKS_BREADCRUMBS = [
  { name: "Home", path: "/" },
  { name: "How It Works", path: "/how-it-works" },
];

/** Icon per `PLATFORM_AREAS` id; the copy itself comes from the constants module. */
const AREA_ICONS = {
  offers: Tag,
  events: CalendarDays,
  people: MessageSquare,
};

/**
 * Hero for /how-it-works.
 *
 * Server component on purpose (no `framer-motion`): this is the LCP region, the
 * content is identical for every visitor, and the page's job is to explain the
 * product, not to perform motion. Section entrance animation was removed with the
 * old sparkle/map-line decoration so nothing large moves on load
 * (accessible-animation Tier 1; WCAG 2.3.3).
 *
 * Two store actions, deliberately weighted: the Google Play pill stays primary and
 * the App Store pill sits beside it in the outlined variant, because both listings
 * are live and the site promotes them together everywhere (site.js owns both URLs).
 * The old hero stacked three equal-weight CTAs, so the in-page link to /discover is
 * now a text link rather than a third button.
 */
export function HowItWorksHero() {
  return (
    <section className="relative overflow-hidden border-b border-border/80 bg-canvas">
      {/* Soft brand wash. Purely decorative, no motion, sits behind the content. */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[var(--orb-glow-canvas)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -top-40 right-[-10%] -z-10 h-[420px] w-[520px] bg-[var(--orb-glow-violet)]"
        aria-hidden="true"
      />

      <Container>
        <div className="grid gap-10 py-10 sm:py-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,400px)] lg:items-start lg:gap-16 lg:py-20">
          {/* ── Left: the answer ── */}
          <div className="max-w-2xl">
            <Breadcrumbs items={HOW_IT_WORKS_BREADCRUMBS} className="mb-5" />

            <Badge variant="primary" className="mb-4 gap-1.5">
              <Info className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
              <span>The short version</span>
            </Badge>

            <h1 className="text-[2.4rem] font-black leading-[1.06] tracking-tight text-foreground sm:text-5xl lg:text-[3.4rem]">
              How Meelte works
            </h1>

            <p className="mt-5 text-lg leading-relaxed text-foreground-secondary sm:text-xl">
              Shops and event hosts post what is on nearby. The app sorts it by
              distance from where you are, and you deal with the shop or host
              directly — Meelte does not sit in the middle of the transaction.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button
                as="a"
                href={PLAY_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                variant="primary"
                size="lg"
                className="w-full justify-center rounded-xl px-6 sm:w-auto"
              >
                <Play className="h-5 w-5 shrink-0 fill-current" aria-hidden="true" />
                <span>Get it on Google Play</span>
              </Button>

              <Button
                as="a"
                href={APP_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                variant="outline"
                size="lg"
                className="w-full justify-center rounded-xl px-6 sm:w-auto"
              >
                <Apple className="h-5 w-5 shrink-0 fill-current" aria-hidden="true" />
                <span>Download on the App Store</span>
              </Button>
            </div>

            <Link
              href="/discover"
              className="group mt-4 inline-flex items-center gap-1.5 rounded py-1 text-sm font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2"
            >
              <span>See what&apos;s nearby</span>
              <ArrowRight
                className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>

            <p className="mt-4 text-sm leading-relaxed text-foreground-secondary">
              Meelte is live on Google Play and the App Store. The browser-based
              app is still in development, so there is nothing to sign up for on
              this website.
            </p>
          </div>

          {/* ── Right: the three parts of the app, at a glance ── */}
          <aside
            aria-labelledby="how-it-works-areas-heading"
            className="rounded-3xl border border-border/80 bg-surface p-2 shadow-soft"
          >
            <h2
              id="how-it-works-areas-heading"
              className="px-4 pt-4 pb-1 text-sm font-bold tracking-tight text-foreground"
            >
              The app in three parts
            </h2>

            <ul role="list" className="mt-2">
              {PLATFORM_AREAS.map((area) => {
                const Icon = AREA_ICONS[area.id] || Tag;
                return (
                  <li
                    key={area.id}
                    className="border-t border-border/60 first:border-t-0"
                  >
                    <Link
                      href={`/discover#${area.anchor}`}
                      className="group flex items-start gap-3 rounded-2xl px-4 py-4 transition-colors hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2"
                    >
                      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-surface-muted text-primary">
                        <Icon className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center justify-between gap-2">
                          <span className="font-bold text-foreground">
                            {area.name}
                          </span>
                          <ArrowRight
                            className="h-4 w-4 shrink-0 text-primary transition-transform duration-200 group-hover:translate-x-0.5"
                            aria-hidden="true"
                          />
                        </span>
                        <span className="mt-0.5 block text-sm leading-relaxed text-foreground-secondary">
                          {area.tagline}
                        </span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </aside>
        </div>
      </Container>
    </section>
  );
}

export default HowItWorksHero;
