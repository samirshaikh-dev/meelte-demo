import React from "react";
import { Apple, Play } from "@/lib/icons";
import { Container } from "@/components/layout/container";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Button } from "@/components/ui/button";
import { APP_STORE_URL, PLAY_STORE_URL } from "@/config/site";
import {
  ABOUT_BREADCRUMBS,
  ABOUT_HERO,
} from "./about-content";

export function AboutHero() {
  return (
    <section className="relative overflow-hidden border-b border-border/80 pt-8 pb-10 sm:pt-12 sm:pb-14 lg:pt-14 lg:pb-16">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-canvas to-canvas"
      />

      <Container>
        <Breadcrumbs items={ABOUT_BREADCRUMBS} className="mb-3.5 sm:mb-4" />

        <div className="max-w-3xl">
          <h1 className="text-4xl font-black leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            {ABOUT_HERO.titleLead}{" "}
            <span className="text-primary">
              {ABOUT_HERO.titleAccent}
            </span>
          </h1>

          <p className="mt-3.5 sm:mt-4 max-w-xl text-base leading-relaxed text-foreground-secondary sm:text-lg">
            {ABOUT_HERO.lead}
          </p>

          <div className="mt-6 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
            <Button
              as="a"
              href={PLAY_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              variant="primary"
              size="lg"
              className="justify-center font-semibold shadow-card"
            >
              <Play className="h-4 w-4 fill-current" aria-hidden="true" />
              <span>{ABOUT_HERO.playLabel}</span>
            </Button>
            <Button
              as="a"
              href={APP_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              variant="outline"
              size="lg"
              className="justify-center font-medium"
            >
              <Apple className="h-4 w-4 fill-current text-primary" aria-hidden="true" />
              <span>{ABOUT_HERO.appStoreLabel}</span>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default AboutHero;
