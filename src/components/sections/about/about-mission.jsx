import React from "react";
import { HeartHandshake, Store } from "@/lib/icons";
import { Container } from "@/components/layout/container";
import { Card } from "@/components/ui/card";
import { ABOUT_MISSION } from "./about-content";

const MISSION_ICONS = {
  Store,
  HeartHandshake,
};

export function AboutMission() {
  return (
    <section
      id="mission"
      aria-labelledby="about-mission-heading"
      className="scroll-mt-20 border-b border-border/80 bg-canvas py-8 sm:py-12 lg:py-14"
    >
      <Container>
        <div className="max-w-2xl">
          <h2
            id="about-mission-heading"
            className="text-2xl font-extrabold leading-tight tracking-tight text-foreground sm:text-3xl lg:text-4xl text-balance"
          >
            {ABOUT_MISSION.title}
          </h2>
        </div>

        <ul
          role="list"
          className="mt-6 sm:mt-8 grid gap-4 sm:gap-5 sm:grid-cols-2"
        >
          {ABOUT_MISSION.items.map((item) => {
            const Icon = MISSION_ICONS[item.icon] || Store;

            return (
              <li key={item.title} className="flex">
                <Card className="flex w-full items-start gap-3.5 sm:gap-4 rounded-2xl border border-primary/15 bg-surface p-4 sm:p-5 shadow-none transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-soft">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-muted text-primary">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-semibold tracking-tight text-foreground">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-foreground-secondary">
                      {item.body}
                    </p>
                    {item.note && (
                      <p className="mt-2 text-xs font-semibold text-primary">
                        {item.note}
                      </p>
                    )}
                  </div>
                </Card>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}

export default AboutMission;
