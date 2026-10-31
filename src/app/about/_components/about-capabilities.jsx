import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Compass,
  ShieldCheck,
  Sparkles,
  Users,
} from "@/lib/icons";
import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ABOUT_CAPABILITIES, ABOUT_DISCOVER_LABEL } from "./about-content";

/**
 * "What We Do" for /about — the same five capabilities and the same summary
 * statement, restyled.
 *
 * Layout change only: the section stays a bento because five capabilities plus one
 * summary cell fill a 3-column grid exactly (3 + 3), so the summary card lands as a
 * real cell rather than an orphan. Chips moved from an arbitrary `text-[11px]` to
 * `text-xs` so the pill respects the browser's base font size, and from the
 * `accent` (amber) badge to a token-only chip — amber is a fill colour on this
 * canvas, never a text colour (docs/Design.md §9.8).
 *
 * The summary card's `/discover` link needs to be discoverable without hovering:
 * persistent underline plus a white focus ring (previously `hover:underline` only,
 * with no author focus style at all — findings S1 and 3.2.4).
 */
const CAPABILITY_ICONS = {
  Compass,
  Sparkles,
  CalendarDays,
  Users,
  ShieldCheck,
};

export function AboutCapabilities() {
  return (
    <section
      id="what-we-do"
      aria-labelledby="about-capabilities-heading"
      className="scroll-mt-20 border-b border-border/80 bg-canvas py-14 sm:py-20"
    >
      <Container>
        <div className="max-w-2xl">
          <Badge variant="primary" className="mb-3">
            <span>{ABOUT_CAPABILITIES.badge}</span>
          </Badge>
          <h2
            id="about-capabilities-heading"
            className="text-2xl font-extrabold leading-tight tracking-tight text-foreground sm:text-3xl lg:text-4xl"
          >
            {ABOUT_CAPABILITIES.title}
          </h2>
          <p className="mt-3 text-base leading-relaxed text-foreground-secondary sm:text-lg">
            {ABOUT_CAPABILITIES.intro}
          </p>
        </div>

        <ul
          role="list"
          className="mt-10 grid gap-5 sm:mt-12 sm:grid-cols-2 lg:grid-cols-3"
        >
          {ABOUT_CAPABILITIES.items.map((item) => {
            const Icon = CAPABILITY_ICONS[item.icon] || Compass;

            return (
              <li key={item.title}>
                <Card className="flex h-full flex-col p-6 sm:p-7">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-surface-muted text-primary">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <span className="whitespace-nowrap rounded-full border border-primary/15 bg-surface-muted px-2.5 py-1 text-xs font-bold text-primary">
                      {item.chip}
                    </span>
                  </div>
                  <h3 className="mt-4 text-lg font-bold tracking-tight text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-foreground-secondary">
                    {item.body}
                  </p>
                </Card>
              </li>
            );
          })}

          {/* Summary cell — the sixth slot in the 3×2 bento. */}
          <li>
            <div className="flex h-full flex-col justify-between rounded-2xl bg-gradient-to-br from-primary to-primary-hover p-6 text-white shadow-soft sm:p-7">
              <div>
                <h3 className="mt-2 text-lg font-bold tracking-tight text-white">
                  {ABOUT_CAPABILITIES.summary.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/95">
                  {ABOUT_CAPABILITIES.summary.body}
                </p>
              </div>

              <div className="mt-6 border-t border-white/20 pt-4">
                <Link
                  href={ABOUT_CAPABILITIES.summary.href}
                  className="group inline-flex items-center gap-1.5 rounded text-xs font-bold text-white underline decoration-white/60 underline-offset-4 transition-colors hover:decoration-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
                >
                  <span>{ABOUT_DISCOVER_LABEL}</span>
                  <ArrowRight
                    className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </Link>
              </div>
            </div>
          </li>
        </ul>
      </Container>
    </section>
  );
}

export default AboutCapabilities;
