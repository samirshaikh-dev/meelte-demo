import React from "react";
import Link from "next/link";
import { ArrowRight, CalendarDays, Check, Tag, Users } from "@/lib/icons";
import { PLATFORM_AREAS } from "@/constants/app-constants";
import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";

/**
 * What you get once the app is installed, for /signup.
 *
 * Every card is generated from `PLATFORM_AREAS` (src/constants/app-constants.js),
 * the same constant behind the /discover cards, the footer "In the app" column
 * and the CollectionPage ItemList — so the three capability names, taglines and
 * bullets cannot drift between routes.
 *
 * Deliberately shorter than /discover: only the tagline and the three bullets are
 * repeated here, and each card links to its /discover anchor for the full
 * description. This page's job is the next action, not a second capability page.
 */
const AREA_ICONS = {
  offers: Tag,
  events: CalendarDays,
  people: Users,
};

export function SignupAreas() {
  return (
    <section
      aria-labelledby="signup-areas-heading"
      className="border-b border-border/80 bg-surface py-14 sm:py-20"
    >
      <Container>
        <div className="max-w-2xl">
          <Badge variant="primary" className="mb-3 gap-1.5">
            <Tag className="h-3.5 w-3.5" aria-hidden="true" />
            <span>What you get</span>
          </Badge>

          <h2
            id="signup-areas-heading"
            className="text-2xl font-extrabold leading-tight tracking-tight text-foreground sm:text-3xl lg:text-4xl"
          >
            Three things to do once you are in.
          </h2>

          <p className="mt-3 text-base leading-relaxed text-foreground-secondary">
            Everything is sorted by distance from where you are, and the
            &ldquo;Max distance&rdquo; setting defaults to 60&nbsp;km.
          </p>
        </div>

        <ul role="list" className="mt-10 grid gap-6 sm:mt-12 lg:grid-cols-3">
          {PLATFORM_AREAS.map((area) => {
            const Icon = AREA_ICONS[area.id];

            return (
              <li
                key={area.id}
                className="flex flex-col rounded-3xl border border-border/80 bg-canvas p-6 transition-shadow duration-200 hover:shadow-card sm:p-7"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-surface-muted text-primary">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>

                <h3 className="mt-4 text-xl font-bold tracking-tight text-foreground">
                  {area.name}
                </h3>
                <p className="mt-1 text-sm font-semibold text-primary">
                  {area.tagline}
                </p>

                <ul role="list" className="mt-5 space-y-2.5 border-t border-border/70 pt-4">
                  {area.points.map((point) => (
                    <li
                      key={point}
                      className="flex gap-2 text-sm leading-relaxed text-foreground"
                    >
                      <Check
                        className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                        aria-hidden="true"
                      />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto pt-5">
                  <Link
                    href={`/discover#${area.anchor}`}
                    className="inline-flex items-center gap-1 rounded text-sm font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
                  >
                    <span>More on Discover</span>
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>

        <p className="mt-8 max-w-3xl rounded-2xl border border-border/80 bg-surface px-5 py-4 text-sm leading-relaxed text-foreground-secondary shadow-soft">
          <span className="font-semibold text-foreground">One thing to know:</span>{" "}
          Meelte does not sell goods, run events or take payments. You buy directly
          from the shop, and any event cost is settled with the host.
        </p>
      </Container>
    </section>
  );
}

export default SignupAreas;
