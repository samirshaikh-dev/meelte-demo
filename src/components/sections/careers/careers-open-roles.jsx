import React from "react";
import { Briefcase, Mail } from "@/lib/icons";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CAREERS_EMAIL_HREF } from "./careers-content";

/**
 * "Open roles" for /careers — the same copy and the same single CTA as before,
 * restyled.
 *
 * The section used to be a centred badge, a heading and one wide card. It is now a
 * two-column block: the heading and its explanation on the left, the status card
 * with the icon and the resume button on the right. Same words, same destination —
 * only the arrangement and the type scale change.
 */
export function CareersOpenRoles() {
  return (
    <section
      id="open-roles"
      aria-labelledby="careers-open-roles-heading"
      className="border-b border-border/80 bg-canvas py-8 sm:py-12 lg:py-14 scroll-mt-20"
    >
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-x-12">
          <div className="lg:col-span-5">
            <h2
              id="careers-open-roles-heading"
              className="text-2xl font-extrabold leading-tight tracking-tight text-foreground sm:text-3xl lg:text-4xl"
            >
              Open roles
            </h2>
          </div>

          <Card className="lg:col-span-7 rounded-2xl border border-primary/15 bg-surface p-4 sm:p-5 shadow-none transition-all duration-200 hover:border-primary/30 hover:shadow-soft">
            <div className="flex items-start gap-3.5 sm:gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-muted text-primary">
                <Briefcase className="h-5 w-5" aria-hidden="true" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-base font-semibold tracking-tight text-foreground">
                  No open roles at the moment
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-foreground-secondary">
                  We&apos;re not actively hiring right now. If you believe you&apos;d
                  be a great fit for meelTe, we&apos;d still love to hear from you.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </Container>
    </section>
  );
}

export default CareersOpenRoles;
