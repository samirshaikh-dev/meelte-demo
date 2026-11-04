import React from "react";
import { MapPin, Sparkles, Zap } from "@/lib/icons";
import { Container } from "@/components/layout/container";
import { Card } from "@/components/ui/card";
import { ABOUT_STORY } from "./about-content";

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
      className="scroll-mt-20 border-b border-border/80 bg-surface py-8 sm:py-12 lg:py-14"
    >
      <Container>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-x-12">
          <div className="lg:col-span-4">
            <h2
              id="about-story-heading"
              className="text-2xl font-extrabold leading-tight tracking-tight text-foreground sm:text-3xl lg:text-4xl text-balance"
            >
              {ABOUT_STORY.title}
            </h2>
            <p className="mt-3 text-base leading-relaxed text-foreground-secondary">
              {ABOUT_STORY.intro}
            </p>
          </div>

          <ol role="list" className="space-y-4 lg:col-span-8">
            {ABOUT_STORY.acts.map((act) => {
              const Icon = ACT_ICONS[act.icon] || Sparkles;

              return (
                <li key={act.marker} className="flex">
                  <Card className="flex w-full items-start gap-3.5 sm:gap-4 rounded-2xl border border-primary/15 bg-surface p-4 sm:p-5 shadow-none transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-soft">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-muted text-primary">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span
                          aria-hidden="true"
                          className="text-xs font-bold tabular-nums text-primary/70"
                        >
                          {act.marker}
                        </span>
                        <h3 className="text-base font-semibold tracking-tight text-foreground">
                          {act.title}
                        </h3>
                      </div>

                      <div className="mt-1.5 space-y-2">
                        {act.paragraphs.map((paragraph) => (
                          <p
                            key={paragraph.slice(0, 40)}
                            className="text-sm leading-relaxed text-foreground-secondary"
                          >
                            {paragraph}
                          </p>
                        ))}
                        {act.conclusion && (
                          <p className="mt-2 text-xs font-semibold text-primary">
                            {act.conclusion}
                          </p>
                        )}
                      </div>
                    </div>
                  </Card>
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
