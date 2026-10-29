import React from "react";
import Link from "next/link";
import {
  Compass,
  MapPin,
  Download,
  ArrowRight,
  ShieldCheck,
} from "@/lib/icons";
import { PLAY_STORE_URL } from "@/config/site";
import { Container } from "@/components/layout/container";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const DISCOVER_BREADCRUMBS = [
  { name: "Home", path: "/" },
  { name: "Discover" },
];

/**
 * /discover hero.
 *
 * Rewritten as a server component with no invented content. The previous version
 * was a framer-motion client component that showed a mock phone listing three
 * fictional businesses at made-up distances (200m–650m) and described a "1–3 km"
 * walking radius. Neither exists: the product's feed is distance-sorted with a
 * default 60 km radius (docs/target_customer.md §1), and the app is the only place
 * real listings appear. The mock also claimed "on-device location", but ad
 * geofencing is evaluated against server-side city zones (§1 "Ad geofencing").
 */
export function DiscoverHero() {
  return (
    <section className="border-b border-border/80 bg-canvas pt-8 pb-14 sm:pt-10 sm:pb-20">
      <Container>
        <Breadcrumbs items={DISCOVER_BREADCRUMBS} className="mb-6" />

        <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7">
            <Badge variant="primary" className="mb-4 gap-1.5">
              <Compass className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Discover</span>
            </Badge>

            <h1 className="text-3xl font-black leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-[3.4rem]">
              What is on near you, right now.
            </h1>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-foreground-secondary sm:text-lg">
              Meelte shows time-boxed offers from nearby shops, local events you can ask to
              join, and the people and businesses you already follow — in a feed sorted by
              distance instead of an endless global timeline.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                as="a"
                href={PLAY_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                variant="primary"
                size="lg"
                className="group justify-center font-semibold sm:w-auto"
              >
                <Download className="h-5 w-5" aria-hidden="true" />
                <span>Get the Android app</span>
                <ArrowRight
                  className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Button>

              <Button
                as={Link}
                href="/how-it-works"
                variant="outline"
                size="lg"
                className="justify-center font-medium sm:w-auto"
              >
                <span>See how it works</span>
              </Button>
            </div>

            <p className="mt-5 text-sm text-foreground-secondary">
              The Android app is live on Google Play. The web app is still in development.
            </p>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-3xl border border-border/80 bg-surface p-6 shadow-soft sm:p-7">
              <h2 className="text-sm font-bold uppercase tracking-wider text-foreground">
                Where Meelte runs
              </h2>
              <ul role="list" className="mt-4 space-y-3">
                {[
                  { city: "Bengaluru", state: "Karnataka" },
                  { city: "Gaya", state: "Bihar" },
                  { city: "Ranchi", state: "Jharkhand" },
                ].map((hub) => (
                  <li key={hub.city} className="flex items-center gap-2.5">
                    <MapPin className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                    <span className="text-sm font-semibold text-foreground">{hub.city}</span>
                    <span className="text-xs text-foreground-secondary">{hub.state}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 border-t border-border/70 pt-5">
                <div className="flex items-start gap-2.5">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                  <p className="text-sm leading-relaxed text-foreground-secondary">
                    Location is used to sort what is near you. It is never sold or shared.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default DiscoverHero;
