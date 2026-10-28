"use client";

import React, { useState } from "react";
import {
  Compass,
  Users,
  Store,
  CalendarDays,
  Wrench,
  Briefcase,
  Layers,
  ArrowRight,
  ShieldCheck,
  Percent,
  CheckCircle2,
  HeartHandshake,
} from "@/lib/icons";
import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

const ECOSYSTEM_ROLES = [
  {
    id: "residents",
    title: "Everyday Residents",
    subtitle: "Discover your neighborhood without noise",
    icon: Compass,
    badge: "Consumer",
    color: "bg-primary text-white",
    lightBg: "bg-primary/5 border-primary/20",
    description:
      "Find curated local dining, authentic fashion boutiques, verified plumbers, and weekend events within walking distance. Location stays on-device — zero tracking.",
    keyBenefits: [
      "Curated 5-category hyperlocal directory",
      "Direct phone and WhatsApp with merchants",
      "Weekend community runs and cultural meetups",
      "Zero location selling or behavioral ad profiling",
    ],
    example: "Indiranagar resident discovering single-origin artisan roaster 800m away.",
  },
  {
    id: "merchants",
    title: "Local Merchants & Boutiques",
    subtitle: "Grow with 0% commission cuts",
    icon: Store,
    badge: "Business",
    color: "bg-accent text-accent-foreground",
    lightBg: "bg-accent/5 border-accent/20",
    description:
      "National food and retail aggregators take 20–35% of your revenues. Meelte provides a verified digital storefront directly accessible to residents living nearby.",
    keyBenefits: [
      "Zero commission on footfall and orders",
      "Direct customer communication with no middleman",
      "Verified local business badge on mobile app",
      "Direct listing across Bengaluru, Gaya & Ranchi",
    ],
    example: "Koramangala cafe saving ₹20,000/mo by connecting directly with nearby regulars.",
  },
  {
    id: "organizers",
    title: "Event Hosts & Community Clubs",
    subtitle: "Bring people together locally",
    icon: CalendarDays,
    badge: "Community",
    color: "bg-purple-600 text-white",
    lightBg: "bg-purple-500/5 border-purple-500/20",
    description:
      "Whether you are hosting a morning 5K run, a language exchange circle, an indie pottery workshop, or a tech meetup — reach neighbors who actually live in your area.",
    keyBenefits: [
      "Free event publishing and RSVP management",
      "Reaches neighbors interested in your exact topic",
      "Eliminates reliance on spammy social media groups",
      "Community-moderated for safety and zero harassment",
    ],
    example: "Cubbon Park weekend running club gathering 40+ local runners every Saturday.",
  },
  {
    id: "services",
    title: "Verified Service Professionals",
    subtitle: "Direct work without lead brokers",
    icon: Wrench,
    badge: "Services",
    color: "bg-blue-600 text-white",
    lightBg: "bg-blue-500/5 border-blue-500/20",
    description:
      "Plumbers, electricians, appliance repair pros, yoga instructors, and home tutors connect directly with neighborhood residents without paying lead generation brokers.",
    keyBenefits: [
      "Direct client phone calls and appointments",
      "No fees deducted per service or booking",
      "Build a trustworthy local reputation in your zone",
      "Verified identity and service category badge",
    ],
    example: "Neighborhood electrician receiving direct neighborhood calls across Gaya Town.",
  },
  {
    id: "careers",
    title: "Employers & Local Job Seekers",
    subtitle: "Work close to home with verified stores",
    icon: Briefcase,
    badge: "Jobs",
    color: "bg-emerald-600 text-white",
    lightBg: "bg-emerald-500/5 border-emerald-500/20",
    description:
      "Local shopkeepers and clinics need reliable retail associates, baristas, and clinic coordinators. Candidates apply directly via mobile with resume uploads.",
    keyBenefits: [
      "Transparent salary ranges on every listing",
      "Direct employer interviews with no hiring agencies",
      "Short commutes within your neighborhood zone",
      "Free job application process for candidates",
    ],
    example: "Barista hired directly by a specialty cafe within 15 minutes of their home.",
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
            How Meelte brings people, merchants, and neighborhood life together.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-foreground-secondary leading-relaxed">
            Unlike distant global social networks or predatory aggregator monopolies, Meelte is designed as a balanced, mutually rewarding neighborhood ecosystem where everyone benefits.
          </p>
        </div>

        {/* Ecosystem Interactive Experience */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Role Navigation Switcher (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-foreground-secondary mb-1 px-1">
              Select an ecosystem role to see how it works:
            </span>

            {ECOSYSTEM_ROLES.map((role) => {
              const Icon = role.icon;
              const isSelected = role.id === activeRoleId;

              return (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => setActiveRoleId(role.id)}
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
                  Verified Capability
                </Badge>
              </div>

              <p className="mt-5 text-sm sm:text-base text-foreground leading-relaxed">
                {activeRole.description}
              </p>

              {/* Key Benefits List */}
              <div className="mt-6">
                <span className="text-xs font-bold uppercase tracking-wider text-foreground-secondary block mb-3">
                  Key Ecosystem Advantages:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {activeRole.keyBenefits.map((benefit) => (
                    <div key={benefit} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-surface/90 border border-border/60">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
                      <span className="text-xs text-foreground-secondary font-medium leading-snug">
                        {benefit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Concrete Real-World Example */}
              <div className="mt-6 p-4 rounded-2xl bg-surface border border-border/80 flex items-start gap-3">
                <HeartHandshake className="h-5 w-5 text-accent shrink-0 mt-0.5" aria-hidden="true" />
                <div className="flex flex-col text-xs">
                  <span className="font-bold text-foreground">Real-World Flow:</span>
                  <span className="text-foreground-secondary mt-0.5 leading-relaxed">
                    {activeRole.example}
                  </span>
                </div>
              </div>

              {/* Role CTA Link */}
              <div className="mt-6 pt-4 border-t border-border/60 flex items-center justify-between">
                <span className="text-xs text-foreground-secondary">
                  Part of Meelte&apos;s verified platform
                </span>
                {activeRole.id === "merchants" ? (
                  <a
                    href="#for-businesses"
                    className="text-xs font-bold text-primary hover:underline inline-flex items-center gap-1"
                  >
                    <span>Onboard your business</span>
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                ) : (
                  <a
                    href="#discover"
                    className="text-xs font-bold text-primary hover:underline inline-flex items-center gap-1"
                  >
                    <span>Explore this category</span>
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default EcosystemSection;
