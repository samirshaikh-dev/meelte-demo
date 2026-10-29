"use client";

import React from "react";
import Link from "next/link";
import {
  MapPin,
  Users,
  HeartHandshake,
  Download,
  Gift,
  Sparkles,
  Check,
} from "@/lib/icons";
import { PLAY_STORE_URL } from "@/config/site";
import { Container } from "@/components/layout/container";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const SIGNUP_BREADCRUMBS = [
  { name: "Home", path: "/" },
  { name: "Sign Up", path: "/signup" },
];

const benefits = [
  {
    icon: MapPin,
    title: "Discover what's nearby",
    description:
      "Find local offers, events, shops and services within a 60 km radius — priced, dated and easy to reach.",
  },
  {
    icon: Users,
    title: "Feel more connected",
    description:
      "Chat, follow local shops and meet people around you. Build real connections in your neighborhood.",
  },
  {
    icon: HeartHandshake,
    title: "Support your local community",
    description:
      "Discover and connect directly with small businesses — no middlemen, no inflated fees.",
  },
];

const referBenefits = [
  "30 coins on signup",
  "30 coins for each friend who joins with your referral code",
  "Milestones at 10, 50 & 100 invites",
  "Redeem ₹100 or ₹500 as an Amazon voucher once your profile is complete",
  "₹500 lifetime cap per user; vouchers emailed within 7 business days",
];

export function SignupClient() {
  return (
    <section className="py-10 sm:py-14 lg:py-16 xl:py-20">
      <Container>
        <Breadcrumbs
          items={SIGNUP_BREADCRUMBS}
          className="mx-auto mb-6 max-w-6xl lg:mb-8"
        />
        <div className="mx-auto grid max-w-6xl items-start gap-8 lg:grid-cols-12 lg:gap-10 xl:gap-14">
          {/* Left — story & benefits */}
          <div className="lg:col-span-7">
            <h1 className="max-w-2xl text-3xl font-extrabold leading-[1.12] tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Your neighborhood has more to offer.
            </h1>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-foreground-secondary sm:text-lg">
              Discover local offers, events, and people nearby. Meet your
              neighbors, support local shops, and stay in the loop — all in one
              place on Meelte.
            </p>

            <div className="mt-6 grid auto-rows-fr gap-4 sm:grid-cols-2 sm:items-stretch lg:mt-8">
              {benefits.map((benefit) => {
                const Icon = benefit.icon;
                return (
                  <Card
                    key={benefit.title}
                    className="relative h-full min-h-full overflow-hidden"
                    hoverable
                  >
                    <CardContent className="h-full p-5 sm:p-6">
                      <div className="flex h-full items-start gap-3 sm:gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-muted text-primary">
                          <Icon className="h-4.5 w-4.5" aria-hidden="true" />
                        </div>
                        <div className="min-w-0">
                          <h2 className="text-base font-semibold text-foreground">
                            {benefit.title}
                          </h2>
                          <p className="mt-1.5 text-sm leading-relaxed text-foreground-secondary">
                            {benefit.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Refer & Earn */}
            <div className="mt-6 sm:mt-8">
              <Card className="relative overflow-hidden border-primary/20 shadow-card">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
                <CardContent className="p-6 sm:p-8">
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-6">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <Gift className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                          Refer & Earn
                        </h2>
                        <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary">
                          <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>Amazon vouchers</span>
                        </span>
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-foreground-secondary sm:text-base">
                        Invite friends to Meelte and earn coins you can redeem for
                        Amazon vouchers.
                      </p>
                      <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
                        {referBenefits.map((item) => (
                          <li
                            key={item}
                            className="flex items-start gap-2.5 text-sm text-foreground-secondary"
                          >
                            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                              <Check className="h-3 w-3" aria-hidden="true" />
                            </span>
                            <span className="leading-relaxed">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right — single app-download panel */}
          <div className="lg:col-span-5 lg:flex lg:justify-end">
            <div className="w-full max-w-md lg:sticky lg:top-24">
              <div className="rounded-3xl border border-primary/15 bg-surface p-5 shadow-card sm:p-6 lg:p-8">
                <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-primary">
                  <span
                    className="h-1.5 w-1.5 rounded-full bg-primary"
                    aria-hidden="true"
                  />
                  Mobile app available
                </span>

                <h2 className="mt-4 text-2xl font-bold leading-tight tracking-tight text-foreground sm:text-3xl">
                  Your community is waiting.
                </h2>

                <p className="mt-2.5 text-sm leading-relaxed text-foreground-secondary sm:mt-3 sm:text-base">
                  Join Meelte on mobile and start exploring what’s happening
                  around you. The web experience is coming soon.
                </p>

                <div className="mt-6 sm:mt-7">
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

                <p className="mt-3 text-center text-xs text-foreground-muted sm:mt-4">
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
