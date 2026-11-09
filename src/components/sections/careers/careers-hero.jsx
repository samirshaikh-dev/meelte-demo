import React from "react";
import Link from "next/link";
import { ArrowRight, Briefcase, Mail, Users } from "@/lib/icons";
import { Container } from "@/components/layout/container";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CAREERS_BREADCRUMBS,
  CAREERS_EMAIL,
  CAREERS_EMAIL_HREF,
  CAREERS_ON_THIS_PAGE,
  CAREERS_STATUS_SENTENCE,
} from "./careers-content";


export function CareersHero() {
  return (
    <section className="relative overflow-hidden border-b border-border/80 pt-8 pb-10 sm:pt-12 sm:pb-14 lg:pt-14 lg:pb-16">
      {/* Old hero's radial wash, restored as a decorative layer. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-canvas to-canvas"
      />

      <Container className="flex max-w-4xl flex-col items-center text-center">
        <Breadcrumbs
          items={CAREERS_BREADCRUMBS}
          className="mb-3.5 sm:mb-4"
          listClassName="justify-center"
        />

        <h1 className="text-3xl font-black leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-6xl text-balance">
          Work at{" "}
          <span className="text-primary">
            meelTe
          </span>
        </h1>

        <p className="mt-3.5 sm:mt-4 max-w-2xl text-base leading-relaxed text-foreground-secondary sm:text-lg">
          Help us build meelTe to connect neighborhoods across India.
        </p>

      </Container>
    </section>
  );
}

export default CareersHero;
