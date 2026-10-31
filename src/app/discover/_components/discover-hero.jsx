import React from "react";
import Link from "next/link";
import { Apple, Compass, Download, ArrowRight, Play } from "@/lib/icons";
import { APP_STORE_URL, PLAY_STORE_URL } from "@/config/site";
import { PLATFORM_AREAS } from "@/constants/app-constants";
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
 *
 * The card that listed the three operational hubs has been removed so the hero is
 * a single text-first column like the other page heroes. The section links below
 * are generated from PLATFORM_AREAS, so they stay in step with the anchors the
 * footer and the CollectionPage schema point at.
 */
export function DiscoverHero() {
  return (
    <section className="border-b border-border/80 bg-canvas pt-8 pb-14 sm:pt-10 sm:pb-20">
      <Container>
        <Breadcrumbs items={DISCOVER_BREADCRUMBS} className="mb-6" />

        <div className="max-w-3xl">
          <Badge variant="primary" className="mb-4 gap-1.5">
            <Compass className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Discover</span>
          </Badge>

          <h1 className="text-3xl font-black leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-[3.4rem]">
            What is on near you, right now.
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-foreground-secondary sm:text-lg">
            Meelte is a nearby-first feed: offers from local shops, events you
            can join, and chat with people you follow.
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
              <Play className="h-5 w-5 fill-current" aria-hidden="true" />
              <span>Get it on Google Play</span>
              <ArrowRight
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Button>

            <Button
              as="a"
              href={APP_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              variant="outline"
              size="lg"
              className="group justify-center font-medium sm:w-auto"
            >
              <Apple className="h-5 w-5 fill-current" aria-hidden="true" />
              <span>Download for iPhone</span>
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

          <nav aria-label="On this page" className="mt-7 border-t border-border/70 pt-5">
            <ul role="list" className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
              <li className="font-semibold text-foreground-secondary">On this page:</li>
              {PLATFORM_AREAS.map((area) => (
                <li key={area.id}>
                  <a
                    href={`#${area.anchor}`}
                    className="rounded font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
                  >
                    {area.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </Container>
    </section>
  );
}

export default DiscoverHero;
