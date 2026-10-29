import React from "react";
import { Tag, CalendarDays, Users, Check } from "@/lib/icons";
import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import { PLATFORM_AREAS } from "@/constants/app-constants";

const AREA_ICONS = {
  offers: Tag,
  events: CalendarDays,
  people: Users,
};

/**
 * "What you can do" section for /discover.
 *
 * Explains the three capabilities that exist in the Meelte app today
 * (docs/target_customer.md §1: local offers, local events, the social layer).
 *
 * This is a capability explainer, not a directory. The previous implementation
 * rendered fifteen invented businesses across five invented categories; none of
 * those shops, addresses or category names had product evidence, so they are gone
 * rather than restyled. Anything that lists real nearby content belongs in the
 * app, which is where the data actually lives.
 *
 * Copy comes from PLATFORM_AREAS so the cards, the footer links and the
 * CollectionPage ItemList keep pointing at the same three anchors.
 */
export function DiscoverAreas() {
  return (
    <section
      id="discover-areas"
      aria-labelledby="discover-areas-heading"
      className="border-b border-border/80 bg-canvas py-14 sm:py-20 scroll-mt-20"
    >
      <Container>
        <div className="max-w-2xl">
          <Badge variant="primary" className="mb-3 gap-1.5">
            <Tag className="h-3.5 w-3.5" aria-hidden="true" />
            <span>In the app today</span>
          </Badge>
          <h2
            id="discover-areas-heading"
            className="text-2xl font-extrabold leading-tight tracking-tight text-foreground sm:text-3xl lg:text-4xl"
          >
            Three things you can do in Meelte.
          </h2>
          <p className="mt-3 text-base leading-relaxed text-foreground-secondary">
            Everything is filtered by distance from where you are — the &ldquo;Max
            distance&rdquo; setting defaults to 60&nbsp;km.
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:mt-12 lg:grid-cols-3">
          {PLATFORM_AREAS.map((area) => {
            const Icon = AREA_ICONS[area.id];
            return (
              <section
                key={area.id}
                id={area.anchor}
                aria-labelledby={`${area.anchor}-heading`}
                className="flex flex-col rounded-3xl border border-border/80 bg-surface p-6 shadow-soft transition-shadow hover:shadow-card sm:p-7 scroll-mt-24"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-surface-muted text-primary">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>

                <h3
                  id={`${area.anchor}-heading`}
                  className="mt-4 text-xl font-bold tracking-tight text-foreground"
                >
                  {area.name}
                </h3>
                <p className="mt-1 text-sm font-semibold text-primary">{area.tagline}</p>
                <p className="mt-3 text-sm leading-relaxed text-foreground-secondary">
                  {area.description}
                </p>

                <ul role="list" className="mt-5 space-y-2.5 border-t border-border/70 pt-4">
                  {area.points.map((point) => (
                    <li
                      key={point}
                      className="flex gap-2 text-sm leading-relaxed text-foreground"
                    >
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>

        <p className="mt-8 max-w-3xl rounded-2xl border border-border/80 bg-surface px-5 py-4 text-sm leading-relaxed text-foreground-secondary">
          <span className="font-semibold text-foreground">One thing to know:</span> Meelte
          does not sell goods, run events or take payments. You buy directly from the shop,
          and any event cost is settled with the host.
        </p>
      </Container>
    </section>
  );
}

export default DiscoverAreas;
