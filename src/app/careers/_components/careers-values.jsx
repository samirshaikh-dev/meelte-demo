import React from "react";
import {
  CheckCircle2,
  HeartHandshake,
  Sparkles,
  Users,
} from "@/lib/icons";
import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";

const VALUES = [
  {
    title: "Community-first",
    description:
      "We build for neighborhoods — putting real people and local communities at the heart of everything we do.",
    icon: HeartHandshake,
  },
  {
    title: "Build for Bharat",
    description:
      "Our focus is on India's towns and cities, solving everyday problems with simple, useful experiences.",
    icon: Users,
  },
  {
    title: "Ownership",
    description:
      "We take initiative, move with purpose, and own outcomes as one small, tight-knit team.",
    icon: Sparkles,
  },
  {
    title: "Empathy",
    description:
      "We listen first, stay humble, and design with care for the people who use meelTe every day.",
    icon: CheckCircle2,
  },
];

export function CareersValues() {
  return (
    <section
      id="values"
      aria-labelledby="careers-values-heading"
      className="border-b border-border/80 bg-canvas py-14 scroll-mt-20 sm:py-20"
    >
      <Container>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-x-12">
          <div className="lg:col-span-4">
            <h2
              id="careers-values-heading"
              className="text-2xl font-extrabold leading-tight tracking-tight text-foreground sm:text-3xl lg:text-4xl"
            >
              What we value
            </h2>
          </div>

          <ol
            role="list"
            className="divide-y divide-border/70 border-t border-border/70 lg:col-span-8"
          >
            {VALUES.map((value, index) => {
              return (
                <li
                  key={value.title}
                  className="grid gap-3 py-6 sm:grid-cols-[3rem_1fr] sm:gap-x-6 sm:py-7"
                >
                  <div className="flex items-center gap-3 sm:block">
                    <span
                      aria-hidden="true"
                      className="text-sm font-black tabular-nums text-primary/60 sm:hidden"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold tracking-tight text-foreground sm:text-xl">
                      <span
                        aria-hidden="true"
                        className="mr-2 hidden text-sm font-black tabular-nums text-primary/60 sm:inline"
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      {value.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-foreground-secondary sm:text-base">
                      {value.description}
                    </p>
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

export default CareersValues;
