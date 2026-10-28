import React from "react";
import {
  UtensilsCrossed,
  Shirt,
  CalendarDays,
  Wrench,
  HeartPulse,
  ArrowRight,
  Sparkles,
} from "@/lib/icons";
import { CATEGORIES } from "@/constants/app-constants";
import { Container } from "@/components/layout/container";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PLAY_STORE_URL } from "@/config/site";

const CATEGORY_META = {
  food: {
    icon: UtensilsCrossed,
    examples: ["Artisan Cafes", "Homemade Bakes", "South Indian Tiffins", "Street Food Trails"],
    popularIn: "Koramangala, HSR Layout, Gaya Market",
    colorBadge: "bg-orange-50 text-orange-800 border-orange-200/60",
  },
  fashion: {
    icon: Shirt,
    examples: ["Regional Boutiques", "Custom Tailors", "Handcrafted Jewelry", "Festive Apparel"],
    popularIn: "Commercial Street, Ranchi Main Rd",
    colorBadge: "bg-pink-50 text-pink-800 border-pink-200/60",
  },
  events: {
    icon: CalendarDays,
    examples: ["Tech Meetups", "Weekend Treks", "Cultural Festivals", "Music Jams"],
    popularIn: "Indiranagar, Cubbon Park, Morabadi",
    colorBadge: "bg-purple-50 text-purple-800 border-purple-200/60",
  },
  services: {
    icon: Wrench,
    examples: ["Verified Plumbers", "Electricians", "Home Tutors", "Appliance Repair"],
    popularIn: "Whitefield, Gaya Town, Harmu",
    colorBadge: "bg-blue-50 text-blue-800 border-blue-200/60",
  },
  health: {
    icon: HeartPulse,
    examples: ["Yoga Studios", "Dental Clinics", "Physiotherapy", "Fitness Trainers"],
    popularIn: "Jayanagar, Kanke Road, BTM",
    colorBadge: "bg-emerald-50 text-emerald-800 border-emerald-200/60",
  },
};

export function CategoriesSection() {
  return (
    <section id="categories" className="py-16 sm:py-24 bg-canvas scroll-mt-20">
      <Container>
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div className="max-w-2xl">
            <Badge variant="primary" className="mb-3">
              <Sparkles className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
              <span>Hyper-Local Exploration</span>
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Explore your city through 5 curated categories.
            </h2>
            <p className="mt-3 text-base sm:text-lg text-foreground-secondary leading-relaxed">
              From neighborhood bakeries and indie fashion designers to verified repair pros and cultural meetups — find what you need nearby without ad overload.
            </p>
          </div>

          <a
            href={PLAY_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-hover group shrink-0"
          >
            <span>Open live directory on App</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </a>
        </div>

        {/* 5 Category Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES.map((cat, index) => {
            const meta = CATEGORY_META[cat.id] || CATEGORY_META.food;
            const Icon = meta.icon;
            const isFeatured = index === 0;

            return (
              <Card
                key={cat.id}
                id={`cat-${cat.id}`}
                hoverable
                className={`p-6 sm:p-7 flex flex-col justify-between scroll-mt-28 ${
                  isFeatured ? "lg:col-span-2 bg-gradient-to-br from-surface to-surface-subtle" : ""
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-muted text-primary shadow-2xs">
                      <Icon className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${meta.colorBadge}`}>
                      {cat.name}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                    {cat.name}
                  </h3>
                  <p className="mt-1 font-medium text-xs sm:text-sm text-primary">
                    {cat.tagline}
                  </p>
                  <p className="mt-2.5 text-sm text-foreground-secondary leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                {/* Listing Tags */}
                <div className="mt-6 pt-5 border-t border-border/70">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-foreground-secondary/90 block mb-2.5">
                    Popular in your area:
                  </span>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {meta.examples.map((example) => (
                      <span
                        key={example}
                        className="inline-flex items-center px-2.5 py-1 rounded-lg bg-surface-subtle border border-border/80 text-xs text-foreground font-medium"
                      >
                        {example}
                      </span>
                    ))}
                  </div>

                  <div className="mt-4 flex items-center justify-between pt-3 border-t border-border/40 text-xs text-foreground-secondary">
                    <span>Active in: {meta.popularIn}</span>
                    <a
                      href={PLAY_STORE_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-primary hover:underline flex items-center gap-1"
                    >
                      Browse {cat.name} →
                    </a>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

export default CategoriesSection;
