"use client";

import React from "react";
import {
  Compass,
  MapPin,
  Search,
  Sparkles,
  ArrowRight,
  Store,
  Users,
  CalendarDays,
} from "@/lib/icons";
import { PLAY_STORE_URL } from "@/config/site";
import { Container } from "@/components/layout/container";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const DISCOVER_BREADCRUMBS = [
  { name: "Home", path: "/" },
  { name: "Discover" },
];

const trustPills = [
  {
    id: 1,
    label: "Hyperlocal",
    icon: MapPin,
    ariaLabel: "Discover nearby within walking distance",
  },
  {
    id: 2,
    label: "Direct Connect",
    icon: Users,
    ariaLabel: "Connect directly with merchants and hosts",
  },
  {
    id: 3,
    label: "Community First",
    icon: Sparkles,
    ariaLabel: "Community-moderated listings",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const fadeUpVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 120,
      damping: 18,
    },
  },
};

const floatingCards = [
  { text: "Chai Corner", subtext: "Food • 200m", icon: Store, className: "top-[10%] left-[8%]" },
  { text: "Weekend Run Club", subtext: "Events • 450m", icon: CalendarDays, className: "top-[24%] right-[6%]" },
  { text: "Local Tailor", subtext: "Fashion • 650m", icon: Compass, className: "bottom-[26%] left-[4%]" },
];

export function DiscoverHero() {
  return (
    <section className="relative pt-10 pb-16 sm:pt-14 sm:pb-20 lg:pt-20 lg:pb-28 overflow-hidden">
      {/* Gradient mesh background */}
      <div className="absolute inset-0 -z-20" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_#f5f3ff_0%,_#f8f5ff_35%,_#ffffff_100%)]" />
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1200px] h-[620px] bg-[radial-gradient(ellipse_at_top,_rgba(124,58,237,0.18)_0%,_transparent_70%)] blur-3xl" />
        <div className="absolute top-20 -left-40 w-[420px] h-[420px] bg-[radial-gradient(circle,_rgba(244,114,182,0.14)_0%,_transparent_70%)] blur-3xl" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[520px] h-[520px] bg-[radial-gradient(circle,_rgba(99,102,241,0.12)_0%,_transparent_72%)] blur-3xl" />
      </div>

      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left: Text content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center text-center lg:items-start lg:text-left"
          >
            <motion.div variants={fadeUpVariants} className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 rounded-full bg-white/80 backdrop-blur px-2.5 py-1 shadow-soft ring-1 ring-white/70">
                {trustPills.map((pill) => {
                  const Icon = pill.icon;
                  return (
                    <span
                      key={pill.id}
                      className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold text-primary"
                      aria-label={pill.ariaLabel}
                      title={pill.ariaLabel}
                    >
                      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                      <span className="hidden sm:inline">{pill.label}</span>
                    </span>
                  );
                })}
              </div>
            </motion.div>

            <motion.div variants={fadeUpVariants} className="mt-6">
              <Breadcrumbs items={DISCOVER_BREADCRUMBS} />
            </motion.div>

            <motion.h1
              variants={fadeUpVariants}
              className="mt-4 text-[2.8rem] sm:text-6xl lg:text-[4.25rem] font-black tracking-tight leading-[1.02]"
            >
              <span className="text-foreground">Discover your neighborhood,</span>
              <br />
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-primary via-indigo-500 to-violet-500 bg-clip-text text-transparent">
                  without the noise
                </span>
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUpVariants}
              className="mt-5 max-w-xl text-lg sm:text-xl text-foreground-secondary leading-relaxed"
            >
              Find authentic local food, fashion, events, services, and jobs nearby. Connect directly with merchants and hosts — transactions happen offline.
            </motion.p>

            <motion.div
              variants={fadeUpVariants}
              className="mt-8 flex w-full flex-col items-center gap-3 sm:flex-row sm:w-auto lg:items-start"
            >
              <Button
                as="a"
                href="#discover-listings"
                variant="primary"
                size="lg"
                className="group relative w-full overflow-hidden rounded-2xl px-8 font-semibold shadow-[0_30px_70px_-30px_rgba(109,59,179,0.9)] transition-transform duration-200 hover:-translate-y-0.5 hover:scale-[1.01] focus-visible:scale-[1.01] sm:w-auto"
              >
                <Search className="h-5 w-5" aria-hidden="true" />
                <span>Browse Nearby</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
              </Button>

              <Button
                as="a"
                href={PLAY_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                variant="outline"
                size="lg"
                className="group w-full rounded-2xl px-8 font-medium backdrop-blur transition-transform duration-200 hover:-translate-y-0.5 hover:scale-[1.01] sm:w-auto"
              >
                <span>Get the Meelte App</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
              </Button>
            </motion.div>

            <motion.div
              variants={fadeUpVariants}
              className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-foreground-secondary lg:justify-start"
            >
              <div className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-primary" aria-hidden="true" />
                <span>Bengaluru • Gaya • Ranchi</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="h-4 w-4 text-primary" aria-hidden="true" />
                <span>Community-moderated</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right: Visual */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, type: "spring", stiffness: 110, damping: 18 }}
            className="relative flex items-center justify-center"
          >
            <div className="relative mx-auto w-full max-w-[320px] sm:max-w-[360px]">
              <div className="absolute -inset-x-10 -top-10 h-40 bg-gradient-to-b from-primary/20 via-fuchsia-200/20 to-transparent blur-3xl" aria-hidden="true" />
              <div className="relative rounded-[2.25rem] bg-gradient-to-b from-white/95 to-white/80 p-2 shadow-[0_60px_120px_-60px_rgba(76,29,149,0.9)] ring-1 ring-white/70">
                <div className="rounded-[1.9rem] overflow-hidden bg-gradient-to-b from-[#f7f3ff] to-white">
                  <div className="flex items-center justify-between px-5 pt-4">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary/70" />
                      <span className="text-xs font-semibold text-foreground">Discover Nearby</span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-foreground-secondary">
                      <MapPin className="h-3 w-3" aria-hidden="true" />
                      <span>On-device location</span>
                    </div>
                  </div>
                  <div className="px-5 pt-4">
                    <div className="rounded-2xl bg-white shadow-soft px-4 py-3 flex items-center justify-between">
                      <div>
                        <p className="text-xs text-foreground-secondary">Search nearby</p>
                        <p className="text-sm font-semibold text-foreground">Food • Fashion • Events</p>
                      </div>
                      <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-indigo-500 flex items-center justify-center shadow-[0_10px_40px_-12px_rgba(109,59,179,0.9)]">
                        <Search className="h-4 w-4 text-white" aria-hidden="true" />
                      </div>
                    </div>
                  </div>
                  <div className="px-5 pt-4 space-y-2">
                    {[
                      { title: "Roast & Toast", tag: "Food & Cafes • 200m" },
                      { title: "Cubbon Park Run Club", tag: "Events • 450m" },
                      { title: "Kalarang Handloom", tag: "Fashion • 650m" },
                    ].map((item) => (
                      <div
                        key={item.title}
                        className="rounded-2xl bg-white/90 backdrop-blur px-4 py-3 flex items-center justify-between shadow-[0_30px_60px_-40px_rgba(109,59,179,0.8)]"
                      >
                        <div>
                          <p className="text-sm font-semibold text-foreground">{item.title}</p>
                          <p className="text-xs text-foreground-secondary">{item.tag}</p>
                        </div>
                        <span className="text-xs font-medium text-primary">View</span>
                      </div>
                    ))}
                  </div>
                  <div className="px-5 pt-5 pb-6">
                    <div className="rounded-2xl bg-gradient-to-r from-primary via-indigo-500 to-fuchsia-400 px-4 py-3 text-white flex items-center justify-between shadow-[0_40px_80px_-40px_rgba(99,102,241,0.9)]">
                      <div>
                        <p className="text-sm font-semibold">Walkable discoveries</p>
                        <p className="text-xs text-white/80">Within 1-3 km radius</p>
                      </div>
                      <Compass className="h-5 w-5" aria-hidden="true" />
                    </div>
                  </div>
                </div>
              </div>
              {floatingCards.map((card, idx) => {
                const Icon = card.icon;
                return (
                  <motion.div
                    key={card.text}
                    initial={{ opacity: 0, scale: 0.9, y: 16 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: 0.4 + idx * 0.1, type: "spring", stiffness: 140, damping: 16 }}
                    className={`absolute hidden sm:flex items-center gap-2 px-3 py-2 rounded-2xl bg-white/80 backdrop-blur-xl border border-white/60 shadow-[0_20px_60px_-20px_rgba(109,59,179,0.45)] ${card.className}`}
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary/15 to-primary/5">
                      <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-foreground leading-tight">{card.text}</span>
                      <span className="text-[10px] text-foreground-secondary">{card.subtext}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

export default DiscoverHero;
