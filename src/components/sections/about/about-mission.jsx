import React from "react";
import { HeartHandshake, Store } from "@/lib/icons";
import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import { ABOUT_MISSION } from "./about-content";

/**
 * "Our Mission" for /about — the same two commitments, same wording, restyled.
 *
 * Layout change only: two side-by-side cards became two full-width rows, each
 * splitting into a title column and a body column. The two commitments are long
 * prose, not features; giving them the page's full measure lets them be read
 * instead of squeezed into a half-width tile, and the rule between the rows makes
 * the pair read as a list of two rather than a comparison.
 *
 * No `hoverable`, no lift: neither row is interactive
 * (accessibility finding N2 — hover motion on static content advertises clicks
 * that do not exist).
 */
const MISSION_ICONS = {
  Store,
  HeartHandshake,
};

export function AboutMission() {
  return (
    <section
      id="mission"
      aria-labelledby="about-mission-heading"
      className="scroll-mt-20 border-b border-border/80 bg-canvas py-8 sm:py-12 lg:py-14"
    >
      <Container>
        <div className="max-w-2xl">
          <h2
            id="about-mission-heading"
            className="text-2xl font-extrabold leading-tight tracking-tight text-foreground sm:text-3xl lg:text-4xl text-balance"
          >
            {ABOUT_MISSION.title}
          </h2>
         
        </div>

        <ul role="list" className="mt-6 sm:mt-8 border-t border-border/70">
          {ABOUT_MISSION.items.map((item) => {
            return (
              <li
                key={item.title}
                className="border-b border-border/70 py-8 sm:py-10"
              >
                <div className="grid gap-5 lg:grid-cols-12 lg:gap-x-12">
                  <div className="lg:col-span-4">    
                    <h3 className="mt-4 text-xl font-bold tracking-tight text-foreground">
                      {item.title}
                    </h3>
                  </div>

                  <div className="lg:col-span-8">
                    <p className="text-base leading-relaxed text-foreground-secondary">
                      {item.body}
                    </p>
                    <p className="mt-4 text-xs font-semibold text-primary">
                      {item.note}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}

export default AboutMission;
