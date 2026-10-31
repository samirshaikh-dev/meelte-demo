import React from "react";
import Link from "next/link";
import { Apple, ArrowRight, Download, Play } from "@/lib/icons";
import { APP_STORE_URL, PLAY_STORE_URL } from "@/config/site";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";

/**
 * Closing band for /signup.
 *
 * One primary action (install on Android) and one secondary action (read the
 * FAQ), then the merchant path for the shop owner who landed here by mistake.
 * The three hubs named in the footer line are the only cities where the field
 * team onboards merchants in person (OPERATIONAL_HUBS, confirmed Oct 2026) —
 * the sentence must not be widened to "across India".
 *
 * The white text and white focus rings are deliberate: this band sits on the
 * primary gradient, where the default `ring-primary/40` would be invisible.
 */
export function SignupClose() {
  return (
    <section
      aria-labelledby="signup-close-heading"
      className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-hover to-primary-royal text-white"
    >
      {/* Decorative ambient shapes — not content, not announced */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -right-16 h-64 w-64 rounded-full bg-white/10 blur-2xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-white/10"
      />

      <Container className="relative py-14 sm:py-20">
        <div className="max-w-2xl">
          <h2
            id="signup-close-heading"
            className="text-2xl font-black leading-tight tracking-tight sm:text-3xl lg:text-4xl"
          >
            Start with what is nearby.
          </h2>

          <p className="mt-3 text-base leading-relaxed text-white/90">
            Download Meelte on Android and see what is happening around you today.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button
              as="a"
              href={PLAY_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              variant="accent"
              size="lg"
              className="justify-center font-bold"
            >
              <Play className="h-5 w-5 fill-current" aria-hidden="true" />
              <span>Get it on Google Play</span>
            </Button>

            <Button
              as="a"
              href={APP_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              variant="ghost"
              size="lg"
              className="justify-center font-semibold text-white hover:bg-white/10 hover:text-white focus-visible:ring-white/70"
            >
              <Apple className="h-5 w-5 fill-current" aria-hidden="true" />
              <span>Download for iPhone</span>
            </Button>

            <Button
              as={Link}
              href="/faq"
              variant="ghost"
              size="lg"
              className="justify-center font-semibold text-white hover:bg-white/10 hover:text-white focus-visible:ring-white/70"
            >
              <span>Read the FAQ</span>
            </Button>
          </div>
        </div>

        <div className="mt-10 border-t border-white/20 pt-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
            <p className="text-sm leading-relaxed text-white/90">
              Run a local shop? Our field team onboards merchants in person in
              Bengaluru, Gaya and Ranchi.
            </p>
            <Link
              href="/for-merchants"
              className="inline-flex w-fit items-center gap-1 rounded text-sm font-semibold text-white underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-primary-hover"
            >
              <span>For merchants</span>
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default SignupClose;
