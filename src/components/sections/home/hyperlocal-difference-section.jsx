import React from "react";
import { Container } from "@/components/layout/container";
import { CalendarDays, MapPin, Store, Users } from "@/lib/icons";

// Four compact cards: each pairs one product behaviour with the habit it replaces.
const DIFFERENCES = [
  {
    id: "distance",
    icon: MapPin,
    tag: "Not a viral feed",
    title: "Sorted by your street, not the algorithm.",
    description:
      "Shop offers and events are ordered by proximity to where you are, so what you see is actually near you.",
  },
  {
    id: "dated-offers",
    icon: CalendarDays,
    tag: "Not WhatsApp guesswork",
    title: "Every offer shows its dates and price.",
    description:
      "Each offer runs from 12:00 AM on its start date to 11:59 PM on its end date, with rupee prices or a clear percentage discount.",
  },
  {
    id: "curated-events",
    icon: Users,
    tag: "Not open-invite chaos",
    title: "Hosts approve who joins.",
    description:
      "Organisers review Request to Join entries with exact group sizes, so meetups and workshops keep the headcount they planned for.",
  },
  {
    id: "direct-support",
    icon: Store,
    tag: "Not middleman fees",
    title: "Pay the shop, not a platform.",
    description:
      "meelTe does not broker payments or take a cut. Customers settle directly with the merchant, with one-tap directions to the shop.",
  },
];

export function HyperlocalDifferenceSection() {
  return (
    <section className="border-b border-border/80 bg-surface py-8 sm:py-12 lg:py-14">
      <Container>
        <h2 className="text-[clamp(1.75rem,3.4vw,2.6rem)] font-extrabold leading-[1.15] tracking-tight text-foreground text-balance">
          Built for neighbourhoods, not endless scrolling.
        </h2>

        {/* Compact 2x2 grid: static cards, so no hover or shadow implies clickability. */}
        <ul className="mt-6 grid gap-3.5 sm:mt-8 sm:grid-cols-2 sm:gap-4">
          {DIFFERENCES.map((item) => (
            <li key={item.id} className="flex">
              <div className="flex w-full items-start gap-3.5 rounded-2xl border border-primary/15 bg-canvas p-4 sm:gap-4 sm:p-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-primary/15 bg-surface text-primary">
                  <item.icon className="h-5 w-5" aria-hidden="true" />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="text-base font-semibold tracking-tight text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-foreground-secondary">
                    {item.description}
                  </p>
                  <span className="mt-2.5 inline-block rounded-md bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                    {item.tag}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

export default HyperlocalDifferenceSection;
