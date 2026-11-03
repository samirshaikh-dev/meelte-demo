import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Compass,
  ShieldCheck,
  Sparkles,
  Users,
} from "@/lib/icons";
import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ABOUT_CAPABILITIES } from "./about-content";


const CAPABILITY_ICONS = {
  Compass,
  Sparkles,
  CalendarDays,
  Users,
  ShieldCheck,
};

export function AboutCapabilities() {
  return (
    <section
      id="what-we-do"
      aria-labelledby="about-capabilities-heading"
      className="scroll-mt-20 border-b border-border/80 bg-canvas py-8 sm:py-12 lg:py-14"
    >
      <Container>
        <div className="max-w-2xl">
          <h2
            id="about-capabilities-heading"
            className="text-2xl font-extrabold leading-tight tracking-tight text-foreground sm:text-3xl lg:text-4xl"
          >
            {ABOUT_CAPABILITIES.title}
          </h2>
        
        </div>

        <ul
          role="list"
          className="mt-6 sm:mt-8 grid gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {ABOUT_CAPABILITIES.items.map((item) => {
            const Icon = CAPABILITY_ICONS[item.icon] || Compass;

            return (
              <li key={item.title}>
                <Card className="flex h-full flex-col p-6 sm:p-7">
                  <div className="flex items-center justify-between gap-3">

                  </div>
                  <h3 className="mt-4 text-lg font-bold tracking-tight text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-foreground-secondary">
                    {item.body}
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

export default AboutCapabilities;
