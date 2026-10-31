import React from "react";
import {
  CheckCircle2,
  HeartHandshake,
  Sparkles,
  Users,
} from "@/lib/icons";
import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";

/**
 * "What we value" for /careers — the same four values as before, restyled.
 *
 * Layout change only: the four values used to be four identical icon cards in a
 * row, which is the pattern meelte-context.md §4 warns against ("prefer few
 * purposeful sections over a stack of generic feature cards"). They are now a ruled
 * editorial list — numerals, icon, heading, body — beside the section intro, so the
 * section reads as writing rather than as a tile grid, and the page keeps a
 * different shape from the benefits grid below it.
 *
 * The ordinals are decorative and `aria-hidden`; an ordered list already announces
 * its own ordering to a screen reader.
 */
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
      "We listen first, stay humble, and design with care for the people who use Meelte every day.",
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
            <p className="mt-3 text-base leading-relaxed text-foreground-secondary">
              We keep things simple and focus on what matters.
            </p>
          </div>

          <ol
            role="list"
            className="divide-y divide-border/70 border-t border-border/70 lg:col-span-8"
          >
            {VALUES.map((value, index) => {
              const Icon = value.icon;
              return (
                <li
                  key={value.title}
                  className="grid gap-3 py-6 sm:grid-cols-[3rem_1fr] sm:gap-x-6 sm:py-7"
                >
                  <div className="flex items-center gap-3 sm:block">
                    <span
                      aria-hidden="true"
                      className="flex h-10 w-10 items-center justify-center rounded-2xl bg-surface-muted text-primary"
                    >
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
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
