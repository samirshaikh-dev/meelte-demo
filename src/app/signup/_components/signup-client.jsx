"use client";

import React from "react";
import Link from "next/link";
import { MapPin, Users, HeartHandshake, Download } from "@/lib/icons";
import { PLAY_STORE_URL } from "@/config/site";
import { Container } from "@/components/layout/container";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Button } from "@/components/ui/button";

const SIGNUP_BREADCRUMBS = [
  { name: "Home", path: "/" },
  { name: "Sign Up", path: "/signup" },
];

const benefits = [
  {
    icon: MapPin,
    title: "Discover what’s nearby",
    description: "Find local places, events, services, and opportunities.",
  },
  {
    icon: Users,
    title: "Feel more connected",
    description: "Get to know your neighborhood and the people in it.",
  },
  {
    icon: HeartHandshake,
    title: "Support your local community",
    description: "Discover and connect with businesses around you.",
  },
];

export function SignupClient() {
  return (
    <section className="py-10 sm:py-14 lg:py-20">
      <Container>
        <Breadcrumbs
          items={SIGNUP_BREADCRUMBS}
          className="mx-auto mb-6 max-w-6xl"
        />
        <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-12 lg:gap-14">
          {/* Left — story & benefits */}
          <div className="lg:col-span-7">
            <h1 className="max-w-2xl text-3xl font-extrabold leading-[1.12] tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Your neighborhood has more to offer.
            </h1>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-foreground-secondary sm:text-lg">
              Discover local places, meet people nearby, and stay connected to
              what’s happening around you. Meelte brings your neighborhood
              closer, all in one place.
            </p>

            <div className="mt-8 border-t border-border/70 sm:mt-10">
              {benefits.map((benefit) => {
                const Icon = benefit.icon;
                return (
                  <div
                    key={benefit.title}
                    className="flex items-start gap-4 border-b border-border/70 py-5"
                  >
                    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-muted text-primary">
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <h2 className="text-base font-semibold text-foreground">
                        {benefit.title}
                      </h2>
                      <p className="mt-1 text-sm leading-relaxed text-foreground-secondary">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right — single app-download panel */}
          <div className="lg:col-span-5">
            <div className="mx-auto w-full max-w-md lg:mx-0 lg:ml-auto">
              <div className="rounded-3xl border border-primary/15 bg-surface p-6 shadow-card sm:p-8">
                <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-primary">
                  <span
                    className="h-1.5 w-1.5 rounded-full bg-primary"
                    aria-hidden="true"
                  />
                  Mobile app available
                </span>

                <h2 className="mt-5 text-2xl font-bold leading-tight tracking-tight text-foreground sm:text-3xl">
                  Your community is waiting.
                </h2>

                <p className="mt-3 text-sm leading-relaxed text-foreground-secondary sm:text-base">
                  Join Meelte on mobile and start exploring what’s happening
                  around you. The web experience is coming soon.
                </p>

                <div className="mt-7">
                  {PLAY_STORE_URL ? (
                    <Button
                      as="a"
                      href={PLAY_STORE_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="primary"
                      size="lg"
                      className="w-full font-semibold shadow-soft"
                    >
                      <Download className="h-5 w-5" aria-hidden="true" />
                      <span>Get the Meelte App</span>
                    </Button>
                  ) : (
                    <p className="text-sm text-foreground-secondary">
                      The app link is being set up.{" "}
                      <Link
                        href="/contact"
                        className="font-medium text-primary hover:underline"
                      >
                        Contact us
                      </Link>{" "}
                      to get started.
                    </p>
                  )}
                </div>

                <p className="mt-4 text-center text-xs text-foreground-muted">
                  Web app coming soon.
                </p>
              </div>

              <p className="mt-4 text-center text-xs text-foreground-secondary">
                Have a question?{" "}
                <Link
                  href="/contact"
                  className="font-medium text-primary hover:underline rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                >
                  Contact us
                </Link>
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default SignupClient;
