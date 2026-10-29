"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Compass,
  Store,
  CalendarDays,
  Users,
  Layers,
  ArrowRight,
  CheckCircle2,
  HeartHandshake,
} from "@/lib/icons";
import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";

/**
 * The four roles that exist in the Meelte product today.
 *
 * Sourced from docs/target_customer.md §4 (P1 local consumers, P2 local merchants,
 * S1 community event hosts, S3 social connectors). The previous version of this file
 * advertised five roles including a jobs board that does not exist, plus a
 * "verified service professional" identity badge, per-role guarantees, and three
 * invented case studies with invented rupee savings and attendance numbers.
 *
 * Copy rules applied here (meelte-context.md §3 "Claim guardrails"):
 * - No role, badge or benefit that is not evidenced in the product.
 * - `example` describes a flow, never a named business or a measured result.
 * - `href` points at a real route/anchor that exists.
 */
const ECOSYSTEM_ROLES = [
  {
    id: "residents",
    title: "Everyday Residents",
    subtitle: "See what is on near you",
    icon: Compass,
    badge: "Residents",
    color: "bg-primary text-white",
    lightBg: "bg-primary/5 border-primary/20",
    description:
      "Open the app and browse time-boxed offers from nearby shops and local events. Everything is sorted by distance from where you are, using a \u201cMax distance\u201d filter that defaults to 60 km.",
    keyBenefits: [
      "Offers carry a price, a discount and an end date",
      "Events show the host's joining cost before you ask to join",
      "One-tap Google Maps directions to the shop or venue",
      "Follow a shop or host to catch their next offer",
    ],
    example:
      "A shop publishes its weekend offer; nearby residents see it in the distance-sorted feed until the offer's end date, then it drops out.",
    href: "/discover#offers",
    cta: "See what the app shows",
  },
  {
    id: "merchants",
    title: "Shops & Service Businesses",
    subtitle: "Reach the people already nearby",
    icon: Store,
    badge: "Merchants",
    color: "bg-accent text-accent-foreground",
    lightBg: "bg-accent/5 border-accent/20",
    description:
      "Publish a single-product ad or a shop ad carrying up to 100 products, with a price or discount and a fixed run of dates. Photograph your menu or price list and the app fills in the items for you.",
    keyBenefits: [
      "One product or a catalogue of up to 100 items per shop ad",
      "Menu and price-list import from a photo",
      "AI-generated product images for items you did not photograph",
      "Followers are notified when you post again",
    ],
    example:
      "A field team member signs a shop up in person; the owner photographs the menu, sets a discount and dates, and the ad goes live.",
    href: "/for-merchants",
    cta: "Grow your business",
  },
  {
    id: "hosts",
    title: "Event Hosts & Clubs",
    subtitle: "Keep control of the guest list",
    icon: CalendarDays,
    badge: "Hosts",
    color: "bg-primary-dark text-white",
    lightBg: "bg-primary/5 border-primary/20",
    description:
      "Publish a public or private event with a date, time, pinned location and joining cost in rupees. People ask to join with their group size, and you decide who comes.",
    keyBenefits: [
      "Public or private events with a start and end time",
      "Join requests state the group size up front",
      "Approve, reject or remove an attendee at any time",
      "Joining cost is set by you and settled directly with you",
    ],
    example:
      "An organiser publishes a paid workshop; each request carries a group size, so the host knows the headcount before approving anyone.",
    href: "/discover#events",
    cta: "See how hosting works",
  },
  {
    id: "connection",
    title: "Neighbours & New Arrivals",
    subtitle: "Stay in touch with people you meet",
    icon: Users,
    badge: "Community",
    color: "bg-primary-royal text-white",
    lightBg: "bg-primary/5 border-primary/20",
    description:
      "Add friends, follow the shops and hosts you like, and talk one to one. Chat carries text, emoji, documents and location, and audio and video calls are built in.",
    keyBenefits: [
      "Friends, follows and shop updates in one place",
      "1:1 chat with text, emoji, documents and location",
      "Audio and video calls",
      "Block and report on every profile",
    ],
    example:
      "Someone who moved to a new city keeps talking to the people they met at a local event, instead of losing touch once it ends.",
    href: "/discover#people",
    cta: "See the social layer",
  },
];

export function EcosystemSection() {
  const [activeRoleId, setActiveRoleId] = useState("residents");
  const activeRole = ECOSYSTEM_ROLES.find((r) => r.id === activeRoleId) || ECOSYSTEM_ROLES[0];

  return (
    <section id="ecosystem" className="py-16 sm:py-24 bg-surface scroll-mt-20 border-b border-border/80">
      <Container>
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <Badge variant="primary" className="mb-3 gap-1.5">
            <Layers className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
            <span>The Meelte Ecosystem</span>
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-[2.6rem] font-extrabold tracking-tight text-foreground leading-tight">
            Four ways people use Meelte.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-foreground-secondary leading-relaxed">
            Meelte is a two-sided neighbourhood platform: residents get current local offers and
            events, while shops and event hosts get a way to reach the people already nearby.
          </p>
        </div>

        {/* Ecosystem Interactive Experience */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Role Navigation Switcher (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-foreground-secondary mb-1 px-1">
              Select a role to see how it works:
            </span>

            {ECOSYSTEM_ROLES.map((role) => {
              const Icon = role.icon;
              const isSelected = role.id === activeRoleId;

              return (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => setActiveRoleId(role.id)}
                  aria-pressed={isSelected}
                  className={`flex items-center gap-3.5 p-3.5 sm:p-4 rounded-2xl text-left transition-all duration-200 border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
                    isSelected
                      ? "bg-surface-subtle border-primary/40 shadow-soft"
                      : "bg-canvas/60 border-border/70 hover:bg-surface hover:border-border"
                  }`}
                >
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors ${
                      isSelected ? role.color : "bg-surface-muted text-foreground-secondary"
                    }`}
                  >
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className={`font-bold text-sm ${isSelected ? "text-primary" : "text-foreground"}`}>
                        {role.title}
                      </h3>
                      <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-surface border border-border text-foreground-secondary">
                        {role.badge}
                      </span>
                    </div>
                    <p className="text-xs text-foreground-secondary mt-0.5 truncate">
                      {role.subtitle}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right: Active Role Deep-Dive Display (7 Cols) */}
          <div className="lg:col-span-7">
            <div className={`p-6 sm:p-8 rounded-3xl border bg-surface shadow-card transition-all ${activeRole.lightBg}`}>
              <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-border/80">
                <div className="flex items-center gap-3">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${activeRole.color} shadow-soft`}>
                    <activeRole.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
                      {activeRole.title}
                    </h3>
                    <p className="text-xs sm:text-sm font-semibold text-primary">
                      {activeRole.subtitle}
                    </p>
                  </div>
                </div>

                <Badge variant="primary" size="sm">
                  In the app today
                </Badge>
              </div>

              <p className="mt-5 text-sm sm:text-base text-foreground leading-relaxed">
                {activeRole.description}
              </p>

              {/* Key Benefits List */}
              <div className="mt-6">
                <span className="text-xs font-bold uppercase tracking-wider text-foreground-secondary block mb-3">
                  What this role gets:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {activeRole.keyBenefits.map((benefit) => (
                    <div key={benefit} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-surface/90 border border-border/60">
                      <CheckCircle2 className="h-4 w-4 text-success shrink-0 mt-0.5" aria-hidden="true" />
                      <span className="text-xs text-foreground-secondary font-medium leading-snug">
                        {benefit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Illustrative Flow */}
              <div className="mt-6 p-4 rounded-2xl bg-surface border border-border/80 flex items-start gap-3">
                <HeartHandshake className="h-5 w-5 text-accent shrink-0 mt-0.5" aria-hidden="true" />
                <div className="flex flex-col text-xs">
                  <span className="font-bold text-foreground">How it plays out:</span>
                  <span className="text-foreground-secondary mt-0.5 leading-relaxed">
                    {activeRole.example}
                  </span>
                </div>
              </div>

              {/* Role CTA Link */}
              <div className="mt-6 pt-4 border-t border-border/60 flex items-center justify-between gap-3">
                <span className="text-xs text-foreground-secondary">
                  Android app, live on Google Play
                </span>
                <Link
                  href={activeRole.href}
                  className="text-xs font-bold text-primary hover:underline inline-flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 rounded"
                >
                  <span>{activeRole.cta}</span>
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-8 max-w-3xl text-sm leading-relaxed text-foreground-secondary">
          Finding new people by interest is still rolling out. Friends, follows, chat and calls work
          today, and every user can block and report.
        </p>
      </Container>
    </section>
  );
}

export default EcosystemSection;
