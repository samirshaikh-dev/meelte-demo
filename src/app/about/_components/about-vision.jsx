import React from "react";
import {
  CalendarDays,
  HeartHandshake,
  Store,
  Users,
} from "@/lib/icons";
import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import { ABOUT_VISION } from "./about-content";

/**
 * "Our Vision" for /about — the same four points and the same closing sentence,
 * restyled.
 *
 * Layout change only: four soft cards became four bordered editorial cells with the
 * ordinal as part of the heading, and the pull-quote became a real `<blockquote>`.
 *
 * The quote was a plain `<div>` wrapped in typographic quotation marks, which gives
 * a screen reader no quotation semantics at all (1.3.1 Info and Relationships,
 * accessibility finding S6). It is unattributed company voice, so there is no
 * `<figcaption>`: inventing an attribution would be a fabricated claim.
 *
 * No `hover:-translate-y-1` on the cells — none of them is interactive
 * (finding N2).
 */
const VISION_ICONS = {
  Store,
  Users,
  CalendarDays,
  HeartHandshake,
};

export function AboutVision() {
  return (
    <section
      id="vision"
      aria-labelledby="about-vision-heading"
      className="scroll-mt-20 border-b border-border/80 bg-surface py-14 sm:py-20"
    >
      <Container>
        <div className="max-w-3xl">
          <Badge variant="neutral" className="mb-3">
            <span>{ABOUT_VISION.badge}</span>
          </Badge>
          <h2
            id="about-vision-heading"
            className="text-2xl font-extrabold leading-tight tracking-tight text-foreground sm:text-3xl lg:text-4xl"
          >
            {ABOUT_VISION.title}
          </h2>
          <p className="mt-3 text-base leading-relaxed text-foreground-secondary sm:text-lg">
            {ABOUT_VISION.intro}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-foreground-secondary">
            {ABOUT_VISION.subIntro}
          </p>
        </div>

        <ol
          role="list"
          className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-border/80 bg-border/70 sm:grid-cols-2 lg:grid-cols-4"
        >
          {ABOUT_VISION.points.map((point) => {
            const Icon = VISION_ICONS[point.icon] || Store;

            return (
              <li key={point.marker} className="bg-surface-subtle p-6 sm:p-7">
                <div className="flex items-center justify-between gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-surface-muted text-primary">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span
                    aria-hidden="true"
                    className="text-sm font-black tabular-nums text-primary/60"
                  >
                    {point.marker}
                  </span>
                </div>
                <h3 className="mt-4 text-base font-bold leading-snug tracking-tight text-foreground">
                  {point.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-foreground-secondary">
                  {point.body}
                </p>
              </li>
            );
          })}
        </ol>

        <figure className="mt-10 rounded-2xl border border-primary/15 bg-surface-muted px-6 py-7 sm:px-10">
          <blockquote className="mx-auto max-w-2xl text-center text-base font-semibold leading-relaxed text-primary sm:text-lg">
            <p>{ABOUT_VISION.quote}</p>
          </blockquote>
        </figure>
      </Container>
    </section>
  );
}

export default AboutVision;
