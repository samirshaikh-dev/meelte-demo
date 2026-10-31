import React from "react";
import { MapPin, Sparkles, Zap } from "@/lib/icons";
import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import { ABOUT_STORY } from "./about-content";

/**
 * "Our Story" for /about — the same three acts, same wording, restyled.
 *
 * Layout change only: three stacked `Card`s became a three-act ruled `<ol>`. The
 * story is a narrative in sequence, so an ordered list is the honest structure, and
 * it stops the section repeating the "centred heading + grid of identical cards"
 * rhythm the rest of the page already had five times over
 * (meelte-context.md §4).
 *
 * The closing act keeps the tinted panel it had before, as the narrative's landing
 * point. The ordinal markers are decorative and `aria-hidden`, because an ordered
 * list announces its own ordering and the marker would otherwise be read twice.
 */
const ACT_ICONS = {
  Zap,
  MapPin,
  Sparkles,
};

export function AboutStory() {
  return (
    <section
      id="story"
      aria-labelledby="about-story-heading"
      className="scroll-mt-20 border-b border-border/80 bg-surface py-14 sm:py-20"
    >
      <Container>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-x-12">
          <div className="lg:col-span-4">
            <Badge variant="neutral" className="mb-3 gap-1.5">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{ABOUT_STORY.badge}</span>
            </Badge>
            <h2
              id="about-story-heading"
              className="text-2xl font-extrabold leading-tight tracking-tight text-foreground sm:text-3xl lg:text-4xl"
            >
              {ABOUT_STORY.title}
            </h2>
            <p className="mt-3 text-base leading-relaxed text-foreground-secondary">
              {ABOUT_STORY.intro}
            </p>
          </div>

          <ol role="list" className="lg:col-span-8">
            {ABOUT_STORY.acts.map((act, index) => {
              const Icon = ACT_ICONS[act.icon] || Sparkles;
              const isLast = index === ABOUT_STORY.acts.length - 1;

              return (
                <li
                  key={act.marker}
                  className={
                    isLast
                      ? "mt-8 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-surface to-surface p-6 sm:p-8"
                      : "border-t border-border/70 py-7 first:border-t-0 first:pt-0 sm:py-8"
                  }
                >
                  <div className="flex flex-wrap items-center gap-3">
                    <span
                      className={
                        isLast
                          ? "flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-white"
                          : "flex h-10 w-10 items-center justify-center rounded-2xl bg-surface-muted text-primary"
                      }
                    >
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span
                      aria-hidden="true"
                      className="text-sm font-black tabular-nums text-primary/60"
                    >
                      {act.marker}
                    </span>
                    <h3 className="text-lg font-bold tracking-tight text-foreground sm:text-xl">
                      {act.title}
                    </h3>
                  </div>

                  <div className="mt-3 space-y-3 sm:pl-13">
                    {act.paragraphs.map((paragraph) => (
                      <p
                        key={paragraph.slice(0, 40)}
                        className="text-sm leading-relaxed text-foreground-secondary sm:text-base"
                      >
                        {paragraph}
                      </p>
                    ))}
                    {act.conclusion && (
                      <p className="text-sm font-semibold leading-relaxed text-primary sm:text-base">
                        {act.conclusion}
                      </p>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </Container>
    </section>
  );
}

export default AboutStory;
