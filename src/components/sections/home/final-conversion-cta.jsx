import React from "react";
import Link from "next/link";
import { Apple, ArrowRight, Download, Play } from "@/lib/icons";
import { APP_STORE_URL, PLAY_STORE_URL } from "@/config/site";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";

/**
 * The homepage's primary conversion is a direct Google Play download.
 */
export function FinalConversionCTA() {
  return (
    <section className="py-16 sm:py-24 bg-canvas">
      <Container>
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary-hover to-primary-royal px-6 py-12 text-center text-white shadow-card sm:px-10 sm:py-16">
          <div
            className="pointer-events-none absolute -right-16 -top-16 h-60 w-60 rounded-full bg-white/10 blur-2xl"
            aria-hidden="true"
          />

          <div className="relative mx-auto max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-wider text-white/90">
              The app is ready
            </p>
            <h2 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              Start exploring your neighborhood.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-white/90 sm:text-lg">
              Find time-boxed offers from nearby shops, discover local events, and connect
              with people around you.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap">
              <Button
                as="a"
                href={PLAY_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                variant="accent"
                size="lg"
                className="min-h-14 w-full justify-center px-7 text-base font-bold shadow-card hover:shadow-card sm:w-auto sm:px-10"
              >
                <Play className="h-5 w-5 fill-current" aria-hidden="true" />
                <span>Get it on Google Play</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>

              <Button
                as="a"
                href={APP_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                variant="outline"
                size="lg"
                className="min-h-14 w-full justify-center border border-white/30 bg-white/10 px-7 text-base font-bold text-white shadow-card hover:bg-white/15 hover:shadow-card sm:w-auto sm:px-10"
              >
                <Apple className="h-5 w-5 fill-current" aria-hidden="true" />
                <span>Download for iPhone</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>

            <p className="mt-8 border-t border-white/20 pt-6 text-sm text-white/90">
              A local business?{" "}
              <Link
                href="/for-merchants"
                className="inline-flex min-h-11 items-center gap-1 font-bold text-white underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
              >
                Explore merchant onboarding
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default FinalConversionCTA;
