import React from "react";
import Link from "next/link";
import { ArrowRight, Compass, Mail } from "@/lib/icons";
import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ABOUT_DISCOVER_LABEL, ABOUT_WHY } from "./about-content";

/**
 * Closing CTA for /about — the same two sentences and the same destinations,
 * restyled.
 *
 * The card used to be centred, with the argument above the actions. It is now a
 * left/right split: the argument keeps the left column and the two actions get their
 * own column and a single baseline, matching the closing block on /careers.
 *
 * What changed in substance, and why:
 * - The store pair moved out. It already appears in the hero, and repeating the same
 *   two download buttons with identical labels at both ends of the page is exactly
 *   the duplicated-CTA pattern meelte-context.md §4 warns against. The destinations
 *   that close the argument now are the two the reader actually wants at this point:
 *   see the product (`/discover`) or talk to the team (`/contact`).
 * - No `Badge variant="accent"`. The amber pill was a raw palette utility outside
 *   the token set (docs/Design.md §9.2), and amber is a fill colour here, not a
 *   surface for text.
 *
 * The emphasised words stay `text-primary font-bold` — emphasis carried by weight as
 * well as colour, so nothing depends on colour alone (1.4.1).
 */
export function AboutCta() {
  const { emphasis } = ABOUT_WHY.difference;

  return (
    <section
      id="why-meelte"
      aria-labelledby="about-why-heading"
      className="scroll-mt-20 bg-canvas py-14 sm:py-20"
    >
      <Container>
        <div className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/5 via-surface to-surface p-6 shadow-card sm:p-10">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-x-12">
            <div className="lg:col-span-7">
              <Badge variant="primary" className="mb-4">
                <span>{ABOUT_WHY.badge}</span>
              </Badge>

              <h2
                id="about-why-heading"
                className="text-2xl font-extrabold leading-tight tracking-tight text-foreground sm:text-3xl"
              >
                {ABOUT_WHY.title}
              </h2>

              <p className="mt-4 text-base font-medium leading-relaxed text-foreground sm:text-lg">
                {ABOUT_WHY.difference.before}
                {emphasis.map((word, index) => (
                  <React.Fragment key={word}>
                    <span className="font-bold text-primary">{word}</span>
                    {index < emphasis.length - 1
                      ? index === emphasis.length - 2
                        ? ", and "
                        : ", "
                      : ABOUT_WHY.difference.after}
                  </React.Fragment>
                ))}
              </p>

              <p className="mt-4 border-t border-border/70 pt-4 text-sm leading-relaxed text-foreground-secondary sm:text-base">
                {ABOUT_WHY.body}
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:col-span-5 lg:flex-col lg:items-stretch">
              <Button
                as={Link}
                href="/discover"
                variant="primary"
                size="lg"
                className="group justify-center font-semibold shadow-card"
              >
                <Compass className="h-5 w-5" aria-hidden="true" />
                <span>{ABOUT_DISCOVER_LABEL}</span>
                <ArrowRight
                  className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Button>

              <Button
                as={Link}
                href="/contact"
                variant="outline"
                size="lg"
                className="justify-center font-medium"
              >
                <Mail className="h-5 w-5 text-primary" aria-hidden="true" />
                <span>{ABOUT_WHY.contactLabel}</span>
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default AboutCta;
