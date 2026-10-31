import React from "react";
import Link from "next/link";
import { MapPin, ArrowRight, Store } from "@/lib/icons";
import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import { PLATFORM_AREAS } from "@/constants/app-constants";

/**
 * City coverage — the hubs confirmed by the business brief
 * (project-context.md §1 and §12: "real hubs (Bengaluru, Gaya, Ranchi)").
 *
 * Deliberately city-level only. Neighbourhood clusters, "active zone" statuses
 * and per-city highlight claims have no product evidence: ad city zones are
 * admin-configured and which of them are live is unresolved in
 * docs/target_customer.md §5. Nothing here asserts merchant verification
 * either — the product has no consumer-visible verification today
 * (meelte-context.md §3 claim guardrails).
 */
const COVERAGE_HUBS = [
  { city: "Bengaluru", state: "Karnataka" },
  { city: "Gaya", state: "Bihar" },
  { city: "Ranchi", state: "Jharkhand" },
];

export function HyperlocalDiscoverySection() {
  return (
    <section className="py-14 sm:py-20 bg-canvas border-b border-border/80">
      <Container>
        <div className="grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-12">
          {/* Section Header */}
          <div className="lg:col-span-6">
            <Badge variant="primary" className="mb-3 gap-1.5">
              <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
              <span>City Coverage</span>
            </Badge>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground leading-tight">
              Live in Bengaluru, Gaya and Ranchi.
            </h2>
            <p className="mt-3 text-base text-foreground-secondary leading-relaxed">
              Meelte runs in three Indian cities today. Open the Android app to see which offers, events and people are near you.
            </p>
          </div>

          {/* Coverage Strip */}
          <div className="lg:col-span-6">
            <ul
              role="list"
              className="grid grid-cols-1 divide-y divide-border/70 overflow-hidden rounded-2xl border border-border/80 bg-surface shadow-soft sm:grid-cols-3 sm:divide-x sm:divide-y-0"
            >
              {COVERAGE_HUBS.map((hub) => (
                <li key={hub.city} className="px-5 py-4 sm:px-5 sm:py-5">
                  <span className="block text-base font-bold text-foreground">
                    {hub.city}
                  </span>
                  <span className="mt-0.5 block text-xs text-foreground-secondary">
                    {hub.state}
                  </span>
                </li>
              ))}
            </ul>
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
                  href={`/discover#${area.anchor}`}
                  className="inline-block rounded-lg border border-border/70 bg-surface-muted px-2.5 py-1 text-xs font-medium text-foreground transition-colors hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
                >
                  {area.name}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link
              href="/discover"
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
