"use client";

import React, { useState } from "react";
import {
  UtensilsCrossed,
  Shirt,
  CalendarDays,
  Wrench,
  HeartPulse,
  Compass,
  ArrowRight,
  MapPin,
  Clock,
  Download,
  CheckCircle2,
  Sparkles,
} from "@/lib/icons";
import { PLAY_STORE_URL } from "@/config/site";
import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const CONSUMER_CATEGORIES = [
  {
    id: "food",
    name: "Food & Cafes",
    icon: UtensilsCrossed,
    tagline: "Local dining, artisanal bakeries & street food gems",
    description: "Skip expensive sponsored aggregator ads. Find independent coffee roasters, homemade bakes, authentic regional thalis, and hidden neighborhood cafes.",
    highlights: [
      {
        title: "Roast & Toast Coffeehouse",
        location: "Koramangala 4th Block, Bengaluru",
        tag: "Specialty Coffee · Bakery",
        perk: "Fresh daily single-origin batch brew",
      },
      {
        title: "Sri Krishna Traditional Bakes",
        location: "Gaya Town Center, Gaya",
        tag: "Artisanal Sweets & Snacks",
        perk: "Zero preservative sweets made fresh",
      },
      {
        title: "The Green Earth Vegan Deli",
        location: "Indiranagar, Bengaluru",
        tag: "Plant-Based Bowls",
        perk: "Farm-to-table organic produce",
      },
    ],
  },
  {
    id: "fashion",
    name: "Fashion & Boutiques",
    icon: Shirt,
    tagline: "Regional designers, handmade jewelry & custom tailors",
    description: "Connect directly with local boutiques, master tailors, sustainable fabric studios, and artisanal craftspeople in your city.",
    highlights: [
      {
        title: "Kalarang Handloom Atelier",
        location: "Commercial Street, Bengaluru",
        tag: "Handloom Sarees & Linen",
        perk: "Direct master weaver creations",
      },
      {
        title: "Sutra Custom Tailoring",
        location: "Ranchi Main Road, Ranchi",
        tag: "Custom Fitting & Suits",
        perk: "Doorstep measurement & 48hr delivery",
      },
      {
        title: "Aura Artisan Silver Studio",
        location: "Jayanagar, Bengaluru",
        tag: "Handmade Silver Jewelry",
        perk: "Pure 925 hallmarked jewelry",
      },
    ],
  },
  {
    id: "events",
    name: "Community & Events",
    icon: CalendarDays,
    tagline: "Weekend runs, cultural festivals & hobby circles",
    description: "Break the cycle of urban isolation. Join weekend jogging clubs, book discussions, tech meetups, art jams, and neighborhood volunteer drives.",
    highlights: [
      {
        title: "Cubbon Park 5K Morning Run",
        location: "Cubbon Park, Bengaluru",
        tag: "Saturday · 7:00 AM",
        perk: "Open to runners of all paces",
      },
      {
        title: "Tech Founders & Builders Circle",
        location: "HSR Layout, Bengaluru",
        tag: "Sunday · 5:00 PM",
        perk: "Casual coffee chat on local SaaS",
      },
      {
        title: "Morabadi Open-Air Pottery Jam",
        location: "Morabadi Ground, Ranchi",
        tag: "Weekend Workshop",
        perk: "Hands-on clay workshop for beginners",
      },
    ],
  },
  {
    id: "services",
    name: "Trusted Home Services",
    icon: Wrench,
    tagline: "Plumbers, electricians & neighborhood repair pros",
    description: "Need a verified electrician or emergency plumber? Call trusted local technicians directly without third-party commission cuts inflating your bills.",
    highlights: [
      {
        title: "Sharma Reliable Electricals",
        location: "Whitefield, Bengaluru",
        tag: "Home Wiring & Appliances",
        perk: "Direct hourly rates · No hidden fee",
      },
      {
        title: "Modern Plumbing Solutions",
        location: "AP Colony, Gaya",
        tag: "Sanitary & Pipe Repairs",
        perk: "Same-day emergency response",
      },
      {
        title: "Harmu Appliance Servicing",
        location: "Harmu Housing Colony, Ranchi",
        tag: "AC & Refrigerator Repair",
        perk: "Certified technician guarantee",
      },
    ],
  },
  {
    id: "health",
    name: "Health & Wellness",
    icon: HeartPulse,
    tagline: "Yoga studios, dental clinics & holistic wellness",
    description: "Locate trusted physiotherapists, neighborhood dental centers, certified yoga instructors, and fitness spaces close to your home.",
    highlights: [
      {
        title: "Prana Community Yoga Sanctuary",
        location: "Indiranagar, Bengaluru",
        tag: "Hatha & Vinyasa Sessions",
        perk: "Morning and evening batch options",
      },
      {
        title: "Dr. Sen Dental & Orthodontic Care",
        location: "Kanke Road, Ranchi",
        tag: "Family Dental Health",
        perk: "Modern painless dental diagnostics",
      },
      {
        title: "Arogya Physiotherapy & Rehab",
        location: "Civil Lines, Gaya",
        tag: "Posture & Joint Therapy",
        perk: "Certified rehabilitation therapist",
      },
    ],
  },
];

export function ConsumerJourneySection() {
  const [selectedCatId, setSelectedCatId] = useState("food");
  const currentCat = CONSUMER_CATEGORIES.find((c) => c.id === selectedCatId) || CONSUMER_CATEGORIES[0];

  return (
    <section id="discover" className="py-16 sm:py-24 bg-canvas scroll-mt-20">
      <Container>
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div className="max-w-2xl">
            <Badge variant="primary" className="mb-3 gap-1.5">
              <Compass className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
              <span>For Everyday Citizens</span>
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-[2.6rem] font-extrabold tracking-tight text-foreground leading-tight">
              Rediscover your city, 3 kilometers at a time.
            </h2>
            <p className="mt-3.5 text-base sm:text-lg text-foreground-secondary leading-relaxed">
              Find what matters nearby without infinite algorithmic feeds, predatory sponsor boosts, or data tracking.
            </p>
          </div>

          <Button
            as="a"
            href={PLAY_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            variant="primary"
            size="md"
            className="shadow-soft shrink-0 self-start md:self-auto"
          >
            <Download className="h-4 w-4" aria-hidden="true" />
            <span>Open on Meelte App</span>
          </Button>
        </div>

        {/* Category Pill Switcher */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 no-scrollbar" role="tablist" aria-label="Discovery Categories">
          {CONSUMER_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = cat.id === selectedCatId;

            return (
              <button
                key={cat.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                aria-controls={`panel-${cat.id}`}
                id={`tab-${cat.id}`}
                onClick={() => setSelectedCatId(cat.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
                  isSelected
                    ? "bg-primary text-white border-primary shadow-soft"
                    : "bg-surface text-foreground-secondary border-border/80 hover:bg-surface-subtle hover:text-foreground"
                }`}
              >
                <Icon className={`h-4 w-4 ${isSelected ? "text-white" : "text-primary"}`} aria-hidden="true" />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Category Content Card */}
        <div
          role="tabpanel"
          id={`panel-${currentCat.id}`}
          aria-labelledby={`tab-${currentCat.id}`}
          className="bg-surface rounded-3xl border border-border/80 shadow-card p-6 sm:p-8 lg:p-10"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-border/70">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold text-primary uppercase tracking-wider">
                  Featured Category Showcase
                </span>
                <span className="text-xs text-foreground-muted">•</span>
                <span className="text-xs text-foreground-secondary font-medium">Real Neighborhood Examples</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                {currentCat.tagline}
              </h3>
              <p className="mt-2 text-sm sm:text-base text-foreground-secondary leading-relaxed max-w-2xl">
                {currentCat.description}
              </p>
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-surface-muted text-primary text-xs font-bold self-start lg:self-auto border border-primary/10">
              <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
              <span>Direct connect with zero commission</span>
            </div>
          </div>

          {/* 3 Real Listing Samples */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-5">
            {currentCat.highlights.map((item, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-canvas border border-border/70 flex flex-col justify-between hover:border-primary/30 transition-all hover:shadow-soft"
              >
                <div>
                  <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-primary bg-surface px-2.5 py-1 rounded-md border border-primary/10 mb-2.5">
                    {item.tag}
                  </span>
                  <h4 className="font-bold text-base text-foreground tracking-tight">
                    {item.title}
                  </h4>
                  <div className="mt-1 flex items-center gap-1.5 text-xs text-foreground-secondary">
                    <MapPin className="h-3.5 w-3.5 text-primary shrink-0" aria-hidden="true" />
                    <span className="truncate">{item.location}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-border/50 text-xs text-emerald-800 font-medium flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" aria-hidden="true" />
                  <span>{item.perk}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Footer note inside panel */}
          <div className="mt-8 pt-5 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-foreground-secondary">
            <span>
              All listings are community-moderated and verified by physical local presence.
            </span>
            <a
              href={PLAY_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-primary hover:underline inline-flex items-center gap-1 shrink-0"
            >
              <span>Explore more {currentCat.name} on Meelte App</span>
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default ConsumerJourneySection;
