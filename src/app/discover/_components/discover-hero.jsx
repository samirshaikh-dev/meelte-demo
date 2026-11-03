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

export function DiscoverHero() {
  return (
    <section className="border-b border-border/80 bg-canvas pt-8 pb-14 sm:pt-10 sm:pb-20">
      <Container>
        <Breadcrumbs items={DISCOVER_BREADCRUMBS} className="mb-6" />

        <div className="max-w-3xl">
          <h1 className="text-3xl font-black leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-[3.4rem]">
            What is on near you, right now.
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-foreground-secondary sm:text-lg">
            meelTe is a nearby-first feed: offers from local shops, events you
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
          </div>

        </div>
      </Container>
    </section>
  );
}

export default DiscoverHero;
