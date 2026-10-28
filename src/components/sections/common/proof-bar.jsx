import React from "react";
import { Check, Shield, MapPin, Zap, Heart } from "@/lib/icons";
import { Container } from "@/components/layout/container";

const CREDIBILITY_HIGHLIGHTS = [
  {
    icon: Shield,
    title: "Zero Data Brokerage",
    stat: "100% Private",
    caption: "Location data stays on device; never monetized",
  },
  {
    icon: Zap,
    title: "Middleman-Free",
    stat: "0% Commission",
    caption: "Direct community transactions with local sellers",
  },
  {
    icon: MapPin,
    title: "Regional Focus",
    stat: "Bengaluru • Gaya • Ranchi",
    caption: "Deep neighborhood roots expanding across India",
  },
  {
    icon: Heart,
    title: "Community First",
    stat: "Free for Members",
    caption: "Discover, join meetups, and apply for jobs freely",
  },
];

export function ProofBar() {
  return (
    <section className="py-12 sm:py-16 bg-surface border-y border-border/80">
      <Container>
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            Built on Trust & Transparency
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mt-1.5">
            A community platform that respects your neighborhood.
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CREDIBILITY_HIGHLIGHTS.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="p-6 rounded-2xl bg-canvas border border-border/70 flex flex-col justify-between"
              >
                <div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-muted text-primary mb-4 shadow-2xs">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground">
                    {item.stat}
                  </div>
                  <div className="text-sm font-semibold text-primary mt-1">
                    {item.title}
                  </div>
                </div>
                <p className="mt-2 text-xs text-foreground-secondary leading-relaxed pt-3 border-t border-border/50">
                  {item.caption}
                </p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

export default ProofBar;
