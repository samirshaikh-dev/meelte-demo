import React from "react";
import Link from "next/link";
import { ArrowRight, Mail } from "@/lib/icons";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CAREERS_EMAIL_HREF } from "./careers-content";

/**
 * Closing CTA for /careers — the same copy and the same two actions as before,
 * restyled.
 *
 * The card used to be centred inside a gradient wash. It is now left-aligned with
 * the actions on the far side at `sm` and up, which gives the two buttons a single
 * baseline and stops the page ending on a third centred block of the same shape as
 * the two above it. The gradient uses `primary` at a low alpha only — no amber, and
 * no raw palette utility (docs/Design.md §9.1, §9.8).
 */
export function CareersCta() {
  return (
    <section className="bg-surface py-8 sm:py-12 lg:py-14">
      <Container>
        <Card className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-surface to-surface p-5 shadow-none transition-all duration-200 hover:shadow-soft sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
            <div className="max-w-xl">
              <h2 className="text-xl font-bold leading-tight tracking-tight text-foreground sm:text-2xl">
                Think you&apos;d be a great fit?
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-foreground-secondary sm:text-base">
                Tell us a bit about yourself and share your resume. We&apos;ll reach
                out if there&apos;s a good fit.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:shrink-0 sm:flex-row sm:items-center">
              <Button
                as="a"
                href={CAREERS_EMAIL_HREF}
                variant="primary"
                size="lg"
                className="justify-center font-semibold"
              >
                <Mail className="h-5 w-5" aria-hidden="true" />
                <span>Email your resume</span>
              </Button>
              <Button
                as={Link}
                href="/contact"
                variant="outline"
                size="lg"
                className="group justify-center font-medium"
              >
                <span>Contact us</span>
                <ArrowRight
                  className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Button>
            </div>
          </div>
        </Card>
      </Container>
    </section>
  );
}

export default CareersCta;
