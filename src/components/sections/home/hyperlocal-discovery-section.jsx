import React from "react";
import Link from "next/link";
import { MapPin, ArrowRight, Store } from "@/lib/icons";
import { Container } from "@/components/layout/container";
import { PLATFORM_AREAS } from "@/constants/app-constants";

export function HyperlocalDiscoverySection() {
  return (
    <section className="py-14 sm:py-20 bg-canvas border-b border-border/80">
      <Container>
        <div className="grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-12">
          {/* Section Header */}
          <div className="lg:col-span-8">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground leading-tight text-balance">
              Hyperlocal discovery across Indian neighbourhoods.
            </h2>
            <p className="mt-3 text-base text-foreground-secondary leading-relaxed">
              Open the meelTe app on Android or iPhone to see which offers, events, and people are near you.
            </p>
          </div>
        </div>

        {/* Capabilities + Next Steps */}
        <div className="mt-8 flex flex-col gap-5 border-t border-border/70 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <ul role="list" className="flex flex-wrap items-center gap-2">
            <li className="text-xs font-semibold text-foreground-secondary">
              In the app
            </li>
            {PLATFORM_AREAS.map((area) => (
              <li key={area.id}>
                <Link
                  href={`/how-it-works#roles`}
                  className="inline-block rounded-lg border border-border/70 bg-surface-muted px-2.5 py-1 text-xs font-medium text-foreground transition-colors hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
                >
                  {area.name}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link
              href="/how-it-works"
              className="inline-flex items-center gap-1.5 rounded text-sm font-bold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
            >
              <span>Browse what is nearby</span>
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
            <Link
              href="/for-merchants"
              className="inline-flex items-center gap-1.5 rounded text-sm font-semibold text-foreground-secondary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
            >
              <Store className="h-3.5 w-3.5" aria-hidden="true" />
              <span>For local businesses</span>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default HyperlocalDiscoverySection;
