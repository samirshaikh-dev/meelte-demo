import React from "react";
import { Lock, MapPin, ShieldCheck, Wallet } from "@/lib/icons";
import { Container } from "@/components/layout/container";

const BOUNDARIES = [
  {
    id: "payments",
    icon: Wallet,
    title: "Direct merchant settlement",
    guarantee: "0% in-app transaction cuts",
    description:
      "meelTe does not process payments or sell goods. When you discover an offer, you pay the merchant directly at their counter. No payment gateway surcharges or platform commissions.",
  },
  {
    id: "privacy",
    icon: Lock,
    title: "Proximity without tracking",
    guarantee: "Location never sold or brokered",
    description:
      "Your coordinates are evaluated only to sort listings by distance and verify ad city zones. We never build travel heatmaps, log background movements, or sell data to advertisers.",
  },
  {
    id: "ground-ops",
    icon: MapPin,
    title: "In-person field verification",
    guarantee: "Real physical neighbourhood shops",
    description:
      "Our field team visits local merchants at their physical shops to verify legitimacy and assist with menu digitisation. We believe local trust requires real humans on the ground.",
  },
  {
    id: "safety",
    icon: ShieldCheck,
    title: "13+ community standards",
    guarantee: "Moderation, report & block tools",
    description:
      "Every user must be 13 or older. Built-in blocking and reporting tools protect private chats, while public ads and comments are overseen by administrative moderation.",
  },
];

export function TrustBoundariesSection() {
  return (
    <section className="border-b border-border/80 bg-surface-subtle py-8 sm:py-12 lg:py-14">
      <Container>
        {/* Section Header: Honesty as Persuasion (Psychology §4, §6) */}
        <div className="max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">
            Honest Boundaries
          </span>
          <h2 className="mt-1.5 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-[2.6rem] lg:leading-tight text-balance">
            Trust is built on what we refuse to do.
          </h2>
        </div>

        {/* 4 Trust Blocks (AVOID.md: Clean, balanced, non-bloated) */}
        <div className="mt-6 sm:mt-8 grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {BOUNDARIES.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="flex flex-col justify-between rounded-2xl border border-border/80 bg-surface p-5 sm:p-5.5 shadow-soft transition-all hover:border-primary/30 hover:shadow-card"
              >
                <div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-muted text-primary">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h3 className="mt-3.5 text-base sm:text-lg font-bold text-foreground tracking-tight">
                    {item.title}
                  </h3>
                  <span className="mt-1 inline-block text-xs font-semibold text-primary">
                    {item.guarantee}
                  </span>
                  <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-foreground-secondary">
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

export default TrustBoundariesSection;
