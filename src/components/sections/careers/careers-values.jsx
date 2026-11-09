import React from "react";
import {
  Heart,
  MapPin,
  Target,
  Users,
} from "@/lib/icons";
import { Container } from "@/components/layout/container";
import { Card } from "@/components/ui/card";

const VALUES = [
  {
    title: "Community-first",
    description:
      "We build for neighborhoods — putting real people and local communities at the heart of everything we do.",
    icon: Users,
  },
  {
    title: "Build by Bharat",
    description:
      "Our focus is on India's towns and cities, solving everyday problems with simple, useful experiences.",
    icon: MapPin,
  },
  {
    title: "Ownership",
    description:
      "We take initiative, move with purpose, and own outcomes as one small, tight-knit team.",
    icon: Target,
  },
  {
    title: "Empathy",
    description:
      "We listen first, stay humble, and design with care for the people who use meelTe every day.",
    icon: Heart,
  },
];

export function CareersValues() {
  return (
    <section
      id="values"
      aria-labelledby="careers-values-heading"
      className="border-b border-border/80 bg-canvas py-8 sm:py-12 lg:py-14 scroll-mt-20"
    >
      <Container>
        <div className="max-w-2xl">
          <h2
            id="careers-values-heading"
            className="text-2xl font-extrabold leading-tight tracking-tight text-foreground sm:text-3xl lg:text-4xl text-balance"
          >
            What we value
          </h2>
        </div>

        <ul
          role="list"
          className="mt-6 sm:mt-8 grid gap-4 sm:gap-6 sm:grid-cols-2"
        >
          {VALUES.map((value) => {
            const Icon = value.icon;
            return (
              <li key={value.title} className="flex">
                <Card
                  className="flex w-full items-start gap-3.5 sm:gap-4 rounded-2xl border border-primary/15 bg-surface p-5 sm:p-6 shadow-none transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-soft"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-muted text-primary">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-semibold tracking-tight text-foreground">
                      {value.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-foreground-secondary">
                      {value.description}
                    </p>
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

export default CareersValues;
