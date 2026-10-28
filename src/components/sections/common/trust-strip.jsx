import React from "react";
import { ShieldCheck, UserCheck, HeartHandshake, MapPin } from "@/lib/icons";
import { Container } from "@/components/layout/container";

const TRUST_ITEMS = [
  {
    icon: ShieldCheck,
    title: "Privacy First",
    description: "Location is only used to surface nearby listings — never sold, tracked, or shared.",
    tag: "100% Protected",
  },
  {
    icon: UserCheck,
    title: "Community Moderated",
    description: "Safe, spam-free interactions verified by neighborhood peers and local guidelines.",
    tag: "Zero Spam",
  },
  {
    icon: HeartHandshake,
    title: "Zero Commission Commerce",
    description: "Neighbors deal directly with merchants. No middleman delivery cuts eating profits.",
    tag: "Fair Local Trade",
  },
  {
    icon: MapPin,
    title: "Built for India",
    description: "Hyper-localized for Bengaluru, Gaya, Ranchi, and towns expanding nationwide.",
    tag: "Pan-India Vision",
  },
];

export function TrustStrip() {
  return (
    <section className="py-6 sm:py-8 border-y border-border/80 bg-surface/60 backdrop-blur-xs">
      <Container>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {TRUST_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="flex items-start gap-3.5 p-3.5 sm:p-4 rounded-xl bg-surface/80 border border-border/60 shadow-2xs hover:border-primary/20 transition-colors"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-muted text-primary shadow-2xs">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm text-foreground tracking-tight">
                      {item.title}
                    </h3>
                  </div>
                  <p className="mt-1 text-xs text-foreground-secondary leading-relaxed line-clamp-2">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

export default TrustStrip;
