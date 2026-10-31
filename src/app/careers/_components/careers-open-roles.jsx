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
      className="border-b border-border/80 bg-canvas py-14 scroll-mt-20 sm:py-20"
    >
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-x-12">
          <div className="lg:col-span-5">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-surface-muted text-primary">
              <Briefcase className="h-5 w-5" aria-hidden="true" />
            </div>
            <h2
              id="careers-open-roles-heading"
              className="text-2xl font-extrabold leading-tight tracking-tight text-foreground sm:text-3xl lg:text-4xl"
            >
              Open roles
            </h2>
          </div>

          <Card className="lg:col-span-7 border-primary/15 p-6 shadow-card sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-surface-muted text-primary">
                <Briefcase className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <h3 className="text-lg font-bold tracking-tight text-foreground sm:text-xl">
                  No open roles at the moment
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-foreground-secondary sm:text-base">
                  We&apos;re not actively hiring right now. If you believe you&apos;d
                  be a great fit for Meelte, we&apos;d still love to hear from you.
                </p>
              </div>
            </div>

            <div className="mt-6 border-t border-border/70 pt-6">
              <Button
                as="a"
                href={CAREERS_EMAIL_HREF}
                variant="primary"
                size="lg"
                className="justify-center font-semibold sm:w-auto"
              >
                <Mail className="h-5 w-5" aria-hidden="true" />
                <span>Send your resume</span>
              </Button>
            </div>
          </Card>
        </div>
      </Container>
    </section>
  );
}

export default CareersOpenRoles;
