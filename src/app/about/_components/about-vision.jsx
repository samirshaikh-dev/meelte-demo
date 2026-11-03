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
          <h2
            id="about-vision-heading"
            className="text-2xl font-extrabold leading-tight tracking-tight text-foreground sm:text-3xl lg:text-4xl"
          >
            {ABOUT_VISION.title}
          </h2>
        </div>

        <ol
          role="list"
          className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-border/80 bg-border/70 sm:grid-cols-2 lg:grid-cols-4"
        >
          {ABOUT_VISION.points.map((point) => {
            return (
              <li key={point.marker} className="bg-surface-subtle p-6 sm:p-7">
                <div className="flex items-center justify-between gap-3">
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

      </Container>
    </section>
  );
}

export default AboutVision;
