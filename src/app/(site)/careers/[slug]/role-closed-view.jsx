import React from "react";
import Link from "next/link";
import { Briefcase, ArrowLeft } from "@/lib/icons";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";

/**
 * Shown when a visitor lands on /careers/[slug] and the role is not active
 * (draft, expired, archived, or wrong ID). Clean, branded, never reveals
 * whether the slug was a draft vs. a wrong URL.
 */
export function RoleClosedView({ slug }) {
  return (
    <Container className="py-16 sm:py-24">
      <div className="mx-auto max-w-lg text-center space-y-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-muted text-primary">
          <Briefcase className="h-8 w-8" aria-hidden="true" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            This role is no longer open
          </h1>
          <p className="text-sm sm:text-base leading-relaxed text-foreground-secondary">
            The position you&apos;re looking for is no longer accepting
            applications. It may have been filled, closed, or moved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            as={Link}
            href="/careers#open-roles"
            variant="primary"
            size="sm"
            className="gap-1.5 rounded-xl font-semibold shadow-2xs"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            <span>View open roles</span>
          </Button>

          <Button
            as={Link}
            href="/careers"
            variant="outline"
            size="sm"
            className="gap-1.5 rounded-xl"
          >
            <span>Back to Careers</span>
          </Button>
        </div>
      </div>
    </Container>
  );
}

export default RoleClosedView;

