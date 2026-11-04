import React from "react";
import { Apple, ArrowRight, Play } from "@/lib/icons";
import { APP_STORE_URL, PLAY_STORE_URL } from "@/config/site";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";

/**
 * Dual-audience final conversion section.
 *
 * Promotes both live app store listings for residents while offering an obvious,
 * low-friction conversion path for local merchants per psychology.md §10 and
 * meelTe-context.md §3.
 */
export function FinalConversionCTA() {
  return (
    <section className="py-8 sm:py-12 lg:py-14 bg-canvas">
      <Container>
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary-hover to-primary-royal px-6 py-8 text-center text-white shadow-card sm:px-10 sm:py-10">
          <div className="relative mx-auto max-w-3xl">
            {/* Header */}
            <span className="inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-semibold tracking-wide text-white">
              Available Now on Android &amp; iOS
            </span>
            <h2 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-5xl text-balance">
              Start exploring your neighbourhood today.
            </h2>
            <p className="mx-auto mt-2.5 max-w-xl text-base leading-relaxed text-white/90 sm:text-lg">
              Find dated offers from nearby shops, request to join local events, and connect with people around you. Free to download.
            </p>

            {/* Resident Conversion: Dual Store Buttons */}
            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap">
              <Button
                as="a"
                href={PLAY_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                variant="accent"
                size="lg"
                className="min-h-12 w-full justify-center px-7 text-base font-bold shadow-card sm:w-auto sm:px-8"
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
                className="min-h-12 w-full justify-center border border-white/30 bg-white/10 px-7 text-base font-bold text-white shadow-card hover:bg-white/15 sm:w-auto sm:px-8"
              >
                <Apple className="h-5 w-5 fill-current" aria-hidden="true" />
                <span>Download for iPhone</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default FinalConversionCTA;
