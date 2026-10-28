import React from "react";
import {
  Download,
  Store,
  Compass,
  ShieldCheck,
  Percent,
  MapPin,
  ArrowRight,
  Smartphone,
  Sparkles,
} from "@/lib/icons";
import { PLAY_STORE_URL } from "@/config/site";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";

export function FinalConversionCTA() {
  return (
    <section className="py-16 sm:py-24 bg-canvas">
      <Container>
        {/* Section Headline */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">
            Get Started with Meelte
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-[2.6rem] font-extrabold tracking-tight text-foreground mt-1.5 leading-tight">
            Choose your path in the neighborhood.
          </h2>
          <p className="mt-3 text-base text-foreground-secondary leading-relaxed">
            Whether you want to discover what is happening around you or build visibility for your local business, Meelte is ready for you.
          </p>
        </div>

        {/* Dual Pathway Side-by-Side Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Card A: Everyday Neighbors (Consumer Journey) */}
          <div className="rounded-3xl bg-gradient-to-br from-primary via-primary-hover to-primary-royal text-white p-8 sm:p-10 lg:p-12 shadow-card flex flex-col justify-between relative overflow-hidden">
            {/* Ambient subtle decorative shape */}
            <div
              className="absolute -top-16 -right-16 w-60 h-60 rounded-full bg-white/10 blur-2xl pointer-events-none"
              aria-hidden="true"
            />

            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-bold backdrop-blur-xs mb-4">
                <Compass className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
                <span>For Residents & Neighbors</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
                Rediscover what your city has to offer.
              </h3>

              <p className="mt-3.5 text-sm sm:text-base text-white/90 leading-relaxed">
                Explore local eateries, artisan fashion boutiques, weekend running clubs, and nearby jobs in your neighborhood without ad overload.
              </p>

              <div className="mt-6 flex flex-col gap-2 text-xs text-white/80">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-accent shrink-0" aria-hidden="true" />
                  <span>100% Free · Location processed strictly on-device</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-accent shrink-0" aria-hidden="true" />
                  <span>Active in Bengaluru, Gaya, Ranchi & expanding</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/20 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Button
                as="a"
                href="/signup"
                variant="accent"
                size="lg"
                className="shadow-soft hover:shadow-card font-bold text-accent-foreground group justify-center"
              >
                <span>Sign Up</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 duration-200" aria-hidden="true" />
              </Button>

              <Button
                as="a"
                href={PLAY_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                variant="ghost"
                size="lg"
                className="text-white hover:text-white hover:bg-white/10 group justify-center"
              >
                <Download className="h-5 w-5 transition-transform group-hover:translate-y-0.5 duration-200" aria-hidden="true" />
                <span>Download on Google Play</span>
              </Button>
            </div>
          </div>

          {/* Card B: Local Merchants & Organizers (Business Journey) */}
          <div className="rounded-3xl bg-surface border border-border/80 p-8 sm:p-10 lg:p-12 shadow-card flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-muted text-primary text-xs font-bold mb-4 border border-primary/10">
                <Store className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                <span>For Local Businesses & Hosts</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight leading-tight">
                Grow with nearby customers. Zero commission.
              </h3>

              <p className="mt-3.5 text-sm sm:text-base text-foreground-secondary leading-relaxed">
                Connect directly with neighborhood residents looking for your products, dining, or services. No aggregator fees eating into your margins.
              </p>

              <div className="mt-6 flex flex-col gap-2 text-xs text-foreground-secondary">
                <div className="flex items-center gap-2">
                  <Percent className="h-4 w-4 text-emerald-600 shrink-0" aria-hidden="true" />
                  <span className="font-semibold text-emerald-800">0% Commission on walk-ins and inquiries</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary shrink-0" aria-hidden="true" />
                  <span>Direct phone calls and WhatsApp inquiries from neighbors</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-border/70 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Button
                as="a"
                href="#for-businesses"
                variant="primary"
                size="lg"
                className="shadow-soft font-bold justify-center"
              >
                <Store className="h-4 w-4" aria-hidden="true" />
                <span>Onboard Your Business</span>
              </Button>

              <a
                href="mailto:support@meelte.com?subject=Merchant%20Partnership"
                className="text-xs font-bold text-foreground-secondary hover:text-primary text-center sm:text-left hover:underline"
              >
                Talk to Merchant Desk →
              </a>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default FinalConversionCTA;
