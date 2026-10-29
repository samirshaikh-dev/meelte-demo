"use client";

import React, { useState } from "react";
import {
  Smartphone,
  Tag,
  CalendarDays,
  MessageSquare,
  Lock,
  CheckCircle2,
} from "@/lib/icons";
import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/animations/reveal";

/**
 * App walkthrough — four capabilities, described exactly as they behave.
 *
 * The previous version of this section presented invented businesses at invented
 * distances ("Roast & Toast… 0.8 km", "Aura Silver Artisanal Studio… 1.4 km"),
 * invented social proof ("18 Verified Nearby", "32 Neighbors Attending"), a
 * fictional 1–5 km radius (the product defaults to 60 km), and a privacy
 * architecture that does not exist ("100% On-Device", "Client-side Proximity
 * Matching") — ad city zones are evaluated server-side
 * (docs/target_customer.md §1 "Ad geofencing").
 *
 * The phone mock now shows interface shape only: no named business, no counts,
 * no measured distances. The caption under the device states that plainly.
 */
const EXPERIENCES = [
  {
    id: "offers",
    label: "Time-boxed offers",
    icon: Tag,
    title: "Offers expire, so the feed stays current",
    description:
      "Every shop ad carries a price or discount and a run of dates. It goes live at 12:00 AM on the start date and leaves the feed at 11:59 PM on the end date.",
    screenBadge: "Nearby offers",
    screenTitle: "Offers near you",
    screenSubtitle: "Sorted by distance · max 60 km",
    screenContent: (
      <div className="flex flex-col gap-2.5">
        <div className="p-3 rounded-xl bg-surface border border-border/80 flex flex-col gap-1.5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-bold text-foreground">Weekend menu offer</span>
            <span className="text-[10px] font-semibold text-primary">Ends Sunday</span>
          </div>
          <p className="text-[11px] text-foreground-secondary">
            <span className="line-through text-foreground-muted">₹899</span>{" "}
            <span className="font-bold text-foreground">₹699</span>
          </p>
        </div>

        <div className="p-3 rounded-xl bg-surface border border-border/80 flex flex-col gap-1.5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-bold text-foreground">Shop offer</span>
            <span className="text-[10px] font-semibold text-primary">Up to 100 items</span>
          </div>
          <p className="text-[11px] text-foreground-secondary">
            Flat discount, set by the shop
          </p>
        </div>

        <div className="p-2.5 rounded-xl bg-surface-muted border border-primary/20 text-[11px] font-semibold text-primary text-center">
          Directions open in Google Maps
        </div>
      </div>
    ),
  },
  {
    id: "events",
    label: "Events you ask to join",
    icon: CalendarDays,
    title: "You ask, the host decides",
    description:
      "Events carry a date, time, pinned location and joining cost in rupees. You request to join alone or with your group, and the host approves, rejects or removes attendees.",
    screenBadge: "Request to join",
    screenTitle: "Event request",
    screenSubtitle: "Group size 2 · cost set by the host",
    screenContent: (
      <div className="flex flex-col gap-3">
        <div className="p-3 rounded-xl bg-surface border border-border/80 flex flex-col gap-2">
          <span className="text-xs font-bold text-foreground">Group size</span>
          <div className="flex items-center justify-between text-[11px] text-foreground-secondary">
            <span>You + 1 friend</span>
            <span className="font-bold text-primary">2</span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-surface border border-border/80 flex flex-col gap-1">
          <span className="text-xs font-bold text-foreground">Who decides</span>
          <span className="text-[11px] text-foreground-secondary">
            The host approves or rejects each request.
          </span>
        </div>

        <div className="p-2.5 rounded-xl bg-surface-muted border border-primary/20 text-[11px] font-semibold text-primary text-center">
          Joining cost is paid directly to the host
        </div>
      </div>
    ),
  },
  {
    id: "chat",
    label: "One-to-one chat",
    icon: MessageSquare,
    title: "Talk to the people and shops you follow",
    description:
      "Friends, follows and one-to-one chat. Send text, emoji, documents and your location, or start an audio or video call without leaving the app.",
    screenBadge: "1:1 chat",
    screenTitle: "Chat",
    screenSubtitle: "People and shops you follow",
    screenContent: (
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-2 p-2 rounded-xl bg-surface/50">
          <div className="self-end bg-primary text-white p-2.5 rounded-2xl rounded-tr-xs text-xs max-w-[85%] shadow-2xs">
            Is this weekend&apos;s offer still on?
          </div>
          <div className="self-start bg-surface border border-border/80 text-foreground p-2.5 rounded-2xl rounded-tl-xs text-xs max-w-[85%] shadow-2xs">
            Yes, until Sunday. I can send you the details.
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-surface-muted border border-primary/20 flex items-center justify-between text-[11px] text-primary font-semibold">
          <span>Text · emoji · documents · location</span>
          <span>Audio &amp; video</span>
        </div>

        <div className="flex items-center gap-2 text-[10px] text-foreground-secondary px-0.5">
          <CheckCircle2 className="h-3 w-3 text-success shrink-0" aria-hidden="true" />
          <span>Block and report available on every profile</span>
        </div>
      </div>
    ),
  },
  {
    id: "privacy",
    label: "Location & privacy",
    icon: Lock,
    title: "Location sorts what you see. It is never sold.",
    description:
      "Your location is used to order the feed by distance and to work out which nearby city zone applies. Meelte does not build movement histories or sell location data to ad brokers.",
    screenBadge: "Privacy",
    screenTitle: "Where location is used",
    screenSubtitle: "Two uses, nothing hidden",
    screenContent: (
      <div className="flex flex-col gap-2.5">
        <div className="p-3 rounded-xl bg-surface border border-border/80 flex items-center justify-between text-xs">
          <span className="font-medium text-foreground">Sort the feed by distance</span>
          <span className="font-bold text-success">Yes</span>
        </div>

        <div className="p-3 rounded-xl bg-surface border border-border/80 flex items-center justify-between text-xs">
          <span className="font-medium text-foreground">Check the active city zone</span>
          <span className="font-bold text-success">Yes</span>
        </div>

        <div className="p-3 rounded-xl bg-surface border border-border/80 flex items-center justify-between text-xs">
          <span className="font-medium text-foreground">Sold to ad brokers</span>
          <span className="font-bold text-success">No</span>
        </div>
      </div>
    ),
  },
];

export function ProductExperienceSection() {
  const [activeExpId, setActiveExpId] = useState("offers");
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
            What the app actually does.
          </h2>
          <p className="mt-3.5 text-base sm:text-lg text-foreground-secondary leading-relaxed">
            Four capabilities, described as they behave today. The Android app is live on Google
            Play; the web app is still in development.
          </p>
        </div>

        {/* Walkthrough Grid: Left Capabilities List, Right Interface Preview */}
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
                  aria-pressed={isSelected}
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

          {/* Right: Interface Preview (6 Cols) */}
          <div className="lg:col-span-6 flex flex-col items-center gap-3">
            <div className="w-full max-w-sm rounded-[2.5rem] bg-foreground p-3.5 shadow-2xl border-4 border-foreground/10 ring-1 ring-black/5">
              {/* Phone Top Notch / Speaker Bar */}
              <div className="flex items-center justify-between px-6 py-2 text-white/70 text-[11px]">
                <span className="font-semibold">9:41</span>
                <div className="h-4 w-20 bg-black/60 rounded-full" aria-hidden="true" />
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

                  {/* Active Capability Preview Content */}
                  {activeExp.screenContent}
                </div>

                {/* Bottom App Navigation Bar */}
                <div className="pt-3 border-t border-border/70 flex items-center justify-around text-[10px] text-foreground-muted">
                  <div className="flex flex-col items-center gap-0.5 text-primary font-bold">
                    <Tag className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Offers</span>
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

            <p className="text-[11px] text-foreground-secondary text-center max-w-xs leading-relaxed">
              Illustrative interface — sample content, not a real listing.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default ProductExperienceSection;
