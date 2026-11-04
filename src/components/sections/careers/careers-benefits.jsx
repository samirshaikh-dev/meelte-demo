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
import { Card } from "@/components/ui/card";

const BENEFITS = [
  {
    title: "Flexible Work",
    description:
      "Work with flexibility that respects your life. We focus on outcomes, not just hours.",
    icon: Clock,
  },
  {
    title: "Learning & Growth",
    description:
      "Access to learning resources, mentorship, and opportunities to grow your skills across the stack.",
    icon: BookOpen,
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
      "As an early team member, you'll have the opportunity to share in meelTe's growth.",
    icon: Gift,
  },
];

export function CareersBenefits() {
  return (
    <section
      id="benefits"
      aria-labelledby="careers-benefits-heading"
      className="border-b border-border/80 bg-surface py-8 sm:py-12 lg:py-14 scroll-mt-20"
    >
      <Container>
        <div className="max-w-2xl">
          <h2
            id="careers-benefits-heading"
            className="text-2xl font-extrabold leading-tight tracking-tight text-foreground sm:text-3xl lg:text-4xl text-balance"
          >
            Why you&apos;ll love working here
          </h2>
        </div>

        <ul
          role="list"
          className="mt-6 sm:mt-8 grid gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {BENEFITS.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <li key={benefit.title} className="flex">
                <Card
                  className="flex w-full items-start gap-3.5 sm:gap-4 rounded-2xl border border-primary/15 bg-surface p-4 sm:p-5 shadow-none transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-soft"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-muted text-primary">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-semibold tracking-tight text-foreground">
                      {benefit.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-foreground-secondary">
                      {benefit.description}
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

export default CareersBenefits;
