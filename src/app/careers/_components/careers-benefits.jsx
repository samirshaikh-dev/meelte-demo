import React from "react";
import {
  BookOpen,
  Clock,
  Gift,
  HeartHandshake,
  Users,
  Zap,
} from "@/lib/icons";
import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

/**
 * "Perks & Benefits" for /careers — the same six benefits as before, restyled.
 *
 * Layout change only: a plain 3×2 grid of identical tiles becomes a 4-column bento
 * where the first two benefits run double width. That keeps the section from
 * repeating the rhythm of the values list above it and gives the two claims a
 * reader cares about most (flexible work, learning) room to be read rather than
 * scanned.
 *
 * Icon tiles use `bg-surface-muted text-primary`; there is no amber anywhere on the
 * page, because `#F59E0B` fails text contrast on this canvas (docs/Design.md §9.8).
 */
const BENEFITS = [
  {
    title: "Flexible Work",
    description:
      "Work with flexibility that respects your life. We focus on outcomes, not just hours.",
    icon: Clock,
    span: "md:col-span-2 lg:col-span-2",
  },
  {
    title: "Learning & Growth",
    description:
      "Access to learning resources, mentorship, and opportunities to grow your skills across the stack.",
    icon: BookOpen,
    span: "md:col-span-2 lg:col-span-2",
  },
  {
    title: "Mission-Driven Impact",
    description:
      "Build something meaningful that helps real people in neighborhoods across India every day.",
    icon: Zap,
  },
  {
    title: "Small, Collaborative Team",
    description:
      "Work closely with founders and a tight-knit team where your ideas make an immediate impact.",
    icon: Users,
  },
  {
    title: "Health & Wellbeing",
    description:
      "We care about your wellbeing and support a healthy work-life balance.",
    icon: HeartHandshake,
  },
  {
    title: "Equity & Ownership",
    description:
      "As an early team member, you'll have the opportunity to share in Meelte's growth.",
    icon: Gift,
  },
];

export function CareersBenefits() {
  return (
    <section
      id="benefits"
      aria-labelledby="careers-benefits-heading"
      className="border-b border-border/80 bg-surface py-14 scroll-mt-20 sm:py-20"
    >
      <Container>
        <div className="max-w-2xl">
          <Badge variant="primary" className="mb-3 gap-1.5">
            <Gift className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Perks &amp; Benefits</span>
          </Badge>
          <h2
            id="careers-benefits-heading"
            className="text-2xl font-extrabold leading-tight tracking-tight text-foreground sm:text-3xl lg:text-4xl"
          >
            Why you&apos;ll love working here
          </h2>
          <p className="mt-3 text-base leading-relaxed text-foreground-secondary">
            We take care of our team so we can focus on building for our
            communities.
          </p>
        </div>

        <ul
          role="list"
          className="mt-10 grid gap-5 sm:mt-12 md:grid-cols-2 lg:grid-cols-4"
        >
          {BENEFITS.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <li
                key={benefit.title}
                className={benefit.span || "md:col-span-1"}
              >
                <Card hoverable className="flex h-full flex-col p-6 sm:p-7">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-surface-muted text-primary">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h3 className="mt-4 text-lg font-bold tracking-tight text-foreground">
                    {benefit.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-foreground-secondary">
                    {benefit.description}
                  </p>
                </Card>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}

export default CareersBenefits;
