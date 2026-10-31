import React from "react";
import { Apple, Play, Sparkles } from "@/lib/icons";
import { Container } from "@/components/layout/container";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { APP_STORE_URL, PLAY_STORE_URL } from "@/config/site";
import {
  ABOUT_BREADCRUMBS,
  ABOUT_HERO,
  ABOUT_ON_THIS_PAGE,
} from "./about-content";

/**
 * /about hero.
 *
 * This file used to be an orphaned `"use client"` alternate hero (180 lines,
 * framer-motion stagger, raw hex gradients, trust pills) that nothing imported.
 * The live hero was inlined in page.jsx. Rather than keep two competing heroes,
 * this file is now the real one, as a server component: the page has no client
 * state worth hydrating for.
 *
 * Layout: an asymmetric split. The headline keeps the left column and the "Our
 * Core Goal" statement becomes the right column, so the goal reads as a card next
 * to the claim instead of a third centred block under it. The "On this page" nav
 * runs full width beneath both columns.
 *
 * Token notes:
 * - The gradient ends in `primary-royal`, never `accent`. Amber `#F59E0B` as text
 *   measures 2.15:1 on this canvas, so the old `to-accent` failed 1.4.3 across the
 *   rightmost quarter of the word (docs/Design.md §9.8, AI_RULE.md §2.2).
 * - The radial wash is decorative and `aria-hidden`, matching the careers hero.
 *
 * Both store links are live URLs in src/config/site.js. The hero carries them
 * once; the closing CTA does not repeat them (meelte-context.md §4).
 */
export function AboutHero() {
  return (
    <section className="relative overflow-hidden border-b border-border/80 pt-8 pb-14 sm:pt-12 sm:pb-20">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-canvas to-canvas"
      />

      <Container>
        <Breadcrumbs items={ABOUT_BREADCRUMBS} className="mb-6" />

        <div className="grid gap-10 lg:grid-cols-12 lg:items-start lg:gap-x-12">
          <div className="lg:col-span-7">
            <Badge variant="primary" className="mb-5 gap-1.5">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{ABOUT_HERO.badge}</span>
            </Badge>

            <h1 className="text-4xl font-black leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              {ABOUT_HERO.titleLead}{" "}
              <span className="text-primary">
                {ABOUT_HERO.titleAccent}
              </span>
            </h1>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-foreground-secondary sm:text-lg">
              {ABOUT_HERO.lead}
            </p>

            <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
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

          {/* The goal statement, promoted from a centred card to the hero's second column. */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-primary/20 bg-surface p-6 shadow-soft sm:p-7">
              <div className="flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="h-2 w-2 shrink-0 rounded-full bg-primary"
                />
                <p className="text-xs font-bold text-primary">
                  {ABOUT_HERO.goalLabel}
                </p>
              </div>
              <p className="mt-3 text-lg font-semibold leading-snug text-foreground">
                {ABOUT_HERO.goal}
              </p>
            </div>
          </div>
        </div>

        <nav
          aria-label="On this page"
          className="mt-10 border-t border-border/70 pt-5"
        >
          <ul
            role="list"
            className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm"
          >
            <li className="font-semibold text-foreground-secondary">
              On this page:
            </li>
            {ABOUT_ON_THIS_PAGE.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className="rounded font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2"
                >
                  {section.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </section>
  );
}

export default AboutHero;
