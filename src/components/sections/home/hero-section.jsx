"use client";

import {
  ArrowRight,
  MapPin,
  MessageCircle,
  Tag,
  Store,
} from "@/lib/icons";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

/**
 * Hero content.
 *
 * The hero is text-only. The earlier phone mock named invented businesses at invented
 * distances ("Chai Corner - ₹40 / 200m away", "Sunday Yoga Meetup / 450m away"), which
 * no such listings support, and the product's real default sort is 60 km, not metres.
 * Those mocks and the decorative floating cards have been removed rather than relabelled.
 */
const trustPills = [
  {
    id: 1,
    label: "Hyperlocal",
    icon: MapPin,
    ariaLabel: "Nearby listings sorted by distance, with a 60 km default",
  },
  {
    id: 2,
    label: "Shop Offers",
    icon: Tag,
    ariaLabel: "Time-boxed offers set by nearby shops",
  },
  {
    id: 3,
    label: "Direct Chat",
    icon: MessageCircle,
    ariaLabel: "Chat one to one with people and shops you follow",
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

function SparkleAccent() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path
        d="M14 3L15.854 10.146L23 12L15.854 13.854L14 21L12.146 13.854L5 12L12.146 10.146L14 3Z"
        fill="url(#sparkle-gradient)"
      />
      <circle cx="20" cy="8" r="1.2" fill="rgba(168,85,247,0.9)" />
      <circle cx="9" cy="19" r="1" fill="rgba(99,102,241,0.8)" />
      <defs>
        <linearGradient id="sparkle-gradient" x1="5" y1="3" x2="23" y2="21" gradientUnits="userSpaceOnUse">
          <stop stopColor="#A78BFA" />
          <stop offset="1" stopColor="#6366F1" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function HeroSection() {
  return (
    <section className="relative pt-10 pb-16 sm:pt-14 sm:pb-20 lg:pt-20 lg:pb-28 overflow-hidden">
      {/* Gradient mesh background */}
      <div className="absolute inset-0 -z-20" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_#f5f3ff_0%,_#f8f5ff_35%,_#ffffff_100%)]" />
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1200px] h-[620px] bg-[radial-gradient(ellipse_at_top,_rgba(124,58,237,0.18)_0%,_transparent_70%)] blur-3xl" />
        <div className="absolute top-20 -left-40 w-[420px] h-[420px] bg-[radial-gradient(circle,_rgba(244,114,182,0.16)_0%,_transparent_70%)] blur-3xl" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[520px] h-[520px] bg-[radial-gradient(circle,_rgba(99,102,241,0.14)_0%,_transparent_72%)] blur-3xl" />
      </div>

      {/* Map-style background */}
      <div className="absolute inset-0 -z-10 pointer-events-none" aria-hidden="true">
        <svg className="absolute inset-0 h-full w-full opacity-60" viewBox="0 0 1440 800" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="map-line" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="rgba(109,59,179,0.18)" />
              <stop offset="100%" stopColor="rgba(99,102,241,0.12)" />
            </linearGradient>
          </defs>
          <g stroke="url(#map-line)" strokeWidth="1" strokeDasharray="6 10" opacity="0.7">
            <path d="M -40 220 C 220 160, 420 280, 680 220" />
            <path d="M 160 420 C 420 360, 720 480, 1040 380" />
            <path d="M 320 620 C 620 560, 920 660, 1260 580" />
          </g>
          <g fill="rgba(109,59,179,0.28)">
            <circle cx="220" cy="190" r="3" />
            <circle cx="520" cy="250" r="2.6" />
            <circle cx="760" cy="210" r="3.2" />
            <circle cx="340" cy="400" r="2.8" />
            <circle cx="680" cy="440" r="3" />
            <circle cx="980" cy="370" r="2.6" />
            <circle cx="520" cy="600" r="3" />
            <circle cx="880" cy="620" r="2.8" />
          </g>
          <g fill="rgba(244,114,182,0.24)">
            <circle cx="420" cy="290" r="2.4" />
            <circle cx="820" cy="460" r="2.2" />
            <circle cx="720" cy="640" r="2.4" />
          </g>
        </svg>
        <div className="absolute top-[18%] left-[12%] hidden lg:flex items-center gap-1 text-[10px] text-primary/60">
          <MapPin className="h-3 w-3" aria-hidden="true" />
          <span>Neighborhood</span>
        </div>
      </div>

      <Container>
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center text-center"
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

            <motion.h1
              variants={fadeUpVariants}
              className="mt-6 text-[2.8rem] sm:text-6xl lg:text-[4.25rem] font-black tracking-tight leading-[1.02]"
            >
              <span className="text-foreground">Discover what’s happening </span>
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-primary via-indigo-500 to-violet-500 bg-clip-text text-transparent">
                  near you.
                </span>
                <svg
                  className="absolute -bottom-2 left-0 w-full hidden sm:block"
                  viewBox="0 0 320 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M 4 8 C 40 4, 120 2, 200 6 C 250 8, 300 6, 316 4"
                    stroke="url(#underline-gradient)"
                    strokeWidth="6"
                    strokeLinecap="round"
                    opacity="0.9"
                  />
                  <defs>
                    <linearGradient id="underline-gradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="rgba(109,59,179,0.9)" />
                      <stop offset="60%" stopColor="rgba(99,102,241,0.9)" />
                      <stop offset="100%" stopColor="rgba(168,85,247,0.8)" />
                    </linearGradient>
                  </defs>
                </svg>
                <span className="absolute -top-4 -right-6 hidden lg:inline-flex" aria-hidden="true">
                  <SparkleAccent />
                </span>
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUpVariants}
              className="mt-5 max-w-xl text-lg sm:text-xl text-foreground-secondary leading-relaxed"
            >
              Meelte is the hyperlocal app for Indian neighbourhoods. See time-boxed shop
              offers, request to join local events, and talk to people you meet — sorted by
              distance, not by a global feed.
            </motion.p>

            <motion.div
              variants={fadeUpVariants}
              className="mt-8 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row sm:flex-wrap"
            >
              <Button
                as="a"
                href="/for-merchants"
                variant="outline"
                size="lg"
                className="group w-full rounded-2xl px-8 font-medium backdrop-blur transition-all duration-200 hover:-translate-y-[2px] hover:scale-[1.02] hover:shadow-soft sm:w-auto"
              >
                <Store className="h-4 w-4" aria-hidden="true" />
                <span>For Local Businesses</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

export default HeroSection;
