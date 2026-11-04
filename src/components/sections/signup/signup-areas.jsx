import React from "react";
import { CalendarDays, Check, Tag, Users } from "@/lib/icons";
import { PLATFORM_AREAS } from "@/constants/app-constants";
import { Container } from "@/components/layout/container";

/**
 * What you get once the app is installed, for /signup.
 *
 * Every card is generated from `PLATFORM_AREAS` (src/constants/app-constants.js),
 * the same constant behind the footer "In the app" column, the /how-it-works role
 * headings and the CollectionPage ItemList — so the three capability names,
 * taglines and bullets cannot drift between routes.
 *
 * The cards are not links: this page's job is the next action, not a second
 * capability page, and the capability detail lives on /how-it-works.
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
      className="border-b border-border/80 bg-surface py-8 sm:py-12 lg:py-14"
    >
      <Container>
        <div className="max-w-2xl">

          <h2
            id="signup-areas-heading"
            className="text-2xl font-extrabold leading-tight tracking-tight text-foreground sm:text-3xl lg:text-4xl text-balance"
          >
            Three things to do once you are in.
          </h2>

          <p className="mt-2 text-base leading-relaxed text-foreground-secondary">
            Everything is sorted by distance from where you are, and the
            &ldquo;Max distance&rdquo; setting defaults to 60&nbsp;km.
          </p>
        </div>

        <ul role="list" className="mt-6 sm:mt-8 grid gap-4 sm:gap-5 lg:grid-cols-3">
          {PLATFORM_AREAS.map((area) => {
            const Icon = AREA_ICONS[area.id];

            return (
              <li
                key={area.id}
                className="flex flex-col justify-between rounded-2xl border border-primary/15 bg-surface p-4 sm:p-5 shadow-none transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-soft"
              >
                <div>
                  <div className="flex items-start gap-3.5 sm:gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-muted text-primary">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base font-semibold tracking-tight text-foreground">
                        {area.name}
                      </h3>
                      <p className="mt-0.5 text-xs font-semibold text-primary">
                        {area.tagline}
                      </p>
                    </div>
                  </div>

                  <ul role="list" className="mt-4 space-y-2 border-t border-border/70 pt-3.5">
                    {area.points.map((point) => (
                      <li
                        key={point}
                        className="flex gap-2 text-xs sm:text-sm leading-relaxed text-foreground-secondary"
                      >
                        <Check
                          className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary"
                          aria-hidden="true"
                        />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            );
          })}
        </ul>

        <p className="mt-8 max-w-3xl rounded-2xl border border-border/80 bg-surface px-5 py-4 text-sm leading-relaxed text-foreground-secondary shadow-soft">
          <span className="font-semibold text-foreground">One thing to know:</span>{" "}
          meelTe does not sell goods, run events or take payments. You buy directly
          from the shop, and any event cost is settled with the host.
        </p>
      </Container>
    </section>
  );
}

export default SignupAreas;
