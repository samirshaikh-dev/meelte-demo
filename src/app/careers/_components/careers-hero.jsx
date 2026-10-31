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
    <section className="relative overflow-hidden border-b border-border/80 pt-8 pb-14 sm:pt-12 sm:pb-20">
      {/* Old hero's radial wash, restored as a decorative layer. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-canvas to-canvas"
      />

      <Container className="flex max-w-4xl flex-col items-center text-center">
        <Breadcrumbs
          items={CAREERS_BREADCRUMBS}
          className="mb-5"
          listClassName="justify-center"
        />

        <h1 className="text-3xl font-black leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          Work at{" "}
          <span className="text-primary">
            Meelte
          </span>
        </h1>

        <p className="mt-5 max-w-2xl text-base leading-relaxed text-foreground-secondary sm:text-lg">
          Help us build Meelte to connect neighborhoods across India.
        </p>

        <div className="mt-7 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
          <Button
            as="a"
            href={CAREERS_EMAIL_HREF}
            variant="primary"
            size="lg"
            className="group justify-center font-semibold shadow-card"
          >
            <Mail className="h-5 w-5" aria-hidden="true" />
            <span>Email your resume</span>
            <ArrowRight
              className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Button>

          <Button
            as={Link}
            href="/about"
            variant="outline"
            size="lg"
            className="group justify-center font-medium"
          >
            <Users className="h-5 w-5 text-primary" aria-hidden="true" />
            <span>Learn more about us</span>
          </Button>
        </div>

      </Container>
    </section>
  );
}

export default CareersHero;
