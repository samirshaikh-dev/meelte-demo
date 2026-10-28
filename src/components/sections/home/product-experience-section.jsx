"use client";

import React, { useState } from "react";
import {
  Smartphone,
  Compass,
  MessageSquare,
  CalendarDays,
  ShieldCheck,
  MapPin,
  Clock,
  Phone,
  ArrowRight,
  CheckCircle2,
  SlidersHorizontal,
  Lock,
} from "@/lib/icons";
import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import { PLAY_STORE_URL } from "@/config/site";

const EXPERIENCES = [
  {
    id: "radar",
    label: "Hyperlocal Radar",
    icon: Compass,
    title: "Proximity-based discovery without sponsored noise",
    description:
      "Adjust your discovery radius from 1 km to 5 km. Only listings from verified neighborhood merchants, artisans, and hosts appear — never distant sponsored advertisements.",
    screenTitle: "Explore Koramangala",
    screenSubtitle: "Within 2.5 km of your location",
    screenBadge: "Real-time Proximity",
    screenContent: (
      <div className="flex flex-col gap-2.5">
        <div className="p-3 rounded-xl bg-surface border border-border/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
            <span className="text-xs font-semibold text-foreground">Radius: 3 km</span>
          </div>
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
            18 Verified Nearby
          </span>
        </div>

        <div className="p-3 rounded-xl bg-surface border border-border/70 flex flex-col gap-1 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs text-foreground">Roast & Toast Neighborhood Cafe</span>
            <span className="text-[10px] font-bold text-primary">0.8 km</span>
          </div>
          <p className="text-[11px] text-foreground-secondary">Artisan Coffee & Sourdough Bakes</p>
          <div className="flex items-center gap-2 text-[10px] text-foreground-muted mt-1">
            <span className="flex items-center gap-0.5 text-emerald-700 font-medium">
              <CheckCircle2 className="h-2.5 w-2.5" aria-hidden="true" /> Open Now
            </span>
            <span>•</span>
            <span>Koramangala 4th Block</span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-surface border border-border/70 flex flex-col gap-1 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs text-foreground">Aura Silver Artisanal Studio</span>
            <span className="text-[10px] font-bold text-primary">1.4 km</span>
          </div>
          <p className="text-[11px] text-foreground-secondary">Handmade 925 Hallmarked Jewelry</p>
          <div className="flex items-center gap-2 text-[10px] text-foreground-muted mt-1">
            <span className="text-primary font-medium">Direct Merchant Chat</span>
            <span>•</span>
            <span>Jayanagar 3rd Block</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "chat",
    label: "Direct Merchant Connect",
    icon: MessageSquare,
    title: "Direct WhatsApp & call without middleman walls",
    description:
      "Unlike delivery aggregators that mask phone numbers and control chats, Meelte enables open, direct communication between neighbors and local shopkeepers.",
    screenTitle: "Direct Store Chat",
    screenSubtitle: "Kalarang Handloom Atelier",
    screenBadge: "Direct Connect",
    screenContent: (
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-2 p-2 rounded-xl bg-surface/50">
          <div className="self-end bg-primary text-white p-2.5 rounded-2xl rounded-tr-xs text-xs max-w-[85%] shadow-2xs">
            Hi! Do you have the indigo handloom cotton kurta in Size 40 in stock at Commercial Street?
          </div>
          <div className="self-start bg-surface border border-border/80 text-foreground p-2.5 rounded-2xl rounded-tl-xs text-xs max-w-[85%] shadow-2xs">
            Yes, we have 2 pieces available right now! Would you like me to hold one for you, or send a quick WhatsApp video?
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-between text-xs text-emerald-800 font-semibold">
          <span className="flex items-center gap-1.5">
            <Phone className="h-3.5 w-3.5 text-emerald-700" aria-hidden="true" />
            Direct Phone & WhatsApp Enabled
          </span>
          <span className="text-[10px] text-emerald-700 bg-white px-2 py-0.5 rounded border border-emerald-200">
            0% Cut
          </span>
        </div>
      </div>
    ),
  },
  {
    id: "events",
    label: "Community Gatherings",
    icon: CalendarDays,
    title: "Real local gatherings to combat urban isolation",
    description:
      "Find weekend 5K runners, book exchange circles, pottery jams, and coding coffee meetups in your neighborhood. Free RSVPs with zero platform transaction fees.",
    screenTitle: "Upcoming Gathering",
    screenSubtitle: "Cubbon Park Weekend Jog",
    screenBadge: "Community RSVP",
    screenContent: (
      <div className="flex flex-col gap-3">
        <div className="p-3.5 rounded-xl bg-surface border border-border/80 shadow-2xs flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-foreground">Cubbon Park 5K Morning Run</span>
            <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
              This Sat · 7 AM
            </span>
          </div>
          <p className="text-[11px] text-foreground-secondary leading-relaxed">
            Paced community jog starting from King Edward Statue, followed by coffee at local cafe.
          </p>
          <div className="flex items-center justify-between pt-2 border-t border-border/60 text-[10px] text-foreground-muted">
            <span>Organized by: Bengaluru Runners</span>
            <span className="font-bold text-emerald-700">32 Neighbors Attending</span>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-surface-muted border border-primary/20 flex items-center justify-between text-xs text-primary font-bold">
          <span>Free Community RSVP</span>
          <span className="text-[11px] underline">Open in App →</span>
        </div>
      </div>
    ),
  },
  {
    id: "privacy",
    label: "On-Device Privacy Engine",
    icon: ShieldCheck,
    title: "Location stays on device — never monetized or sold",
    description:
      "Meelte utilizes on-device coordinates solely to compute radius distance for nearby listings. Your movement history is never stored, profiled, or sold to ad brokers.",
    screenTitle: "Privacy Architecture",
    screenSubtitle: "Client-side Proximity Matching",
    screenBadge: "100% On-Device",
    screenContent: (
      <div className="flex flex-col gap-2.5">
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2">
          <ShieldCheck className="h-4 w-4 text-emerald-700 shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <span className="font-bold block">Zero Cloud Location Logging</span>
            <span className="text-[11px] text-emerald-800 leading-snug">
              Coordinates are calculated locally inside the app. No central tracking database.
            </span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-surface border border-border/80 flex items-center justify-between text-xs">
          <span className="font-medium text-foreground">Data Sold to Third Parties:</span>
          <span className="font-bold text-emerald-700">Strictly 0%</span>
        </div>

        <div className="p-3 rounded-xl bg-surface border border-border/80 flex items-center justify-between text-xs">
          <span className="font-medium text-foreground">Cross-App Behavioral Ads:</span>
          <span className="font-bold text-emerald-700">Disabled</span>
        </div>
      </div>
    ),
  },
];

export function ProductExperienceSection() {
  const [activeExpId, setActiveExpId] = useState("radar");
  const activeExp = EXPERIENCES.find((e) => e.id === activeExpId) || EXPERIENCES[0];

  return (
    <section id="product-tour" className="py-16 sm:py-24 bg-canvas scroll-mt-20 border-b border-border/80">
      <Container>
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <Badge variant="primary" className="mb-3 gap-1.5">
            <Smartphone className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
            <span>Product Experience</span>
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-[2.6rem] font-extrabold tracking-tight text-foreground leading-tight">
            Designed for genuine neighborhood discovery.
          </h2>
          <p className="mt-3.5 text-base sm:text-lg text-foreground-secondary leading-relaxed">
            See how Meelte combines proximity matching, direct merchant chat, and community gatherings into a unified mobile platform.
          </p>
        </div>

        {/* Walkthrough Grid: Left Features List, Right Simulated App View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left: Interactive Capabilities List (6 Cols) */}
          <div className="lg:col-span-6 flex flex-col gap-3">
            {EXPERIENCES.map((item) => {
              const Icon = item.icon;
              const isSelected = item.id === activeExpId;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveExpId(item.id)}
                  className={`p-5 rounded-2xl text-left border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
                    isSelected
                      ? "bg-surface border-primary/40 shadow-soft"
                      : "bg-surface/50 border-border/70 hover:bg-surface hover:border-border"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-1.5">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                        isSelected ? "bg-primary text-white" : "bg-surface-muted text-primary"
                      }`}
                    >
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </div>
                    <span className={`font-bold text-sm sm:text-base ${isSelected ? "text-primary" : "text-foreground"}`}>
                      {item.label}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-foreground-secondary leading-relaxed pl-11">
                    {item.description}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Right: Simulated App Device Frame Showcase (6 Cols) */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="w-full max-w-sm rounded-[2.5rem] bg-foreground p-3.5 shadow-2xl border-4 border-foreground/10 ring-1 ring-black/5">
              {/* Phone Top Notch / Speaker Bar */}
              <div className="flex items-center justify-between px-6 py-2 text-white/70 text-[11px]">
                <span className="font-semibold">9:41</span>
                <div className="h-4 w-20 bg-black/60 rounded-full" />
                <span className="font-semibold">5G</span>
              </div>

              {/* App Screen Canvas */}
              <div className="rounded-[2rem] bg-canvas p-4 sm:p-5 flex flex-col min-h-[380px] justify-between border border-border/60">
                <div>
                  {/* Screen Header */}
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-border/70">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                        {activeExp.screenBadge}
                      </span>
                      <h4 className="font-extrabold text-sm text-foreground leading-tight">
                        {activeExp.screenTitle}
                      </h4>
                      <p className="text-[10px] text-foreground-muted">{activeExp.screenSubtitle}</p>
                    </div>

                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-surface-muted text-primary shadow-2xs">
                      <activeExp.icon className="h-4 w-4" aria-hidden="true" />
                    </div>
                  </div>

                  {/* Active Capability Simulated Dynamic Content */}
                  {activeExp.screenContent}
                </div>

                {/* Bottom App Navigation Bar simulation */}
                <div className="pt-3 border-t border-border/70 flex items-center justify-around text-[10px] text-foreground-muted">
                  <div className="flex flex-col items-center gap-0.5 text-primary font-bold">
                    <Compass className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Discover</span>
                  </div>
                  <div className="flex flex-col items-center gap-0.5">
                    <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Events</span>
                  </div>
                  <div className="flex flex-col items-center gap-0.5">
                    <MessageSquare className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Chat</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default ProductExperienceSection;
