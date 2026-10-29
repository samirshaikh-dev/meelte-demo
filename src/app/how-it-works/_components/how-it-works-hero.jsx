"use client";

import {
  Download,
  ArrowRight,
  MapPin,
  Users,
  UserPlus,
} from "@/lib/icons";
import { PLAY_STORE_URL } from "@/config/site";
import { Container } from "@/components/layout/container";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const HOW_IT_WORKS_BREADCRUMBS = [
  { name: "Home", path: "/" },
  { name: "How It Works" },
];

/**
 * Hero content.
 *
 * The previous set advertised "Local Jobs" and "Service Pros" as platform roles, and the
 * phone mock showed invented businesses at invented distances ("Chai Corner • 200m",
 * "Weekend Badminton • 450m"). Neither is in the product (docs/target_customer.md §1, §5),
 * so the mock and the decorative cards built around it have been removed; the hero now
 * states the three real areas and the privacy position in plain copy.
 */
const trustPills = [
  {
    id: 1,
    label: "Direct Connect",
    icon: Users,
    ariaLabel: "Connect directly with no middlemen",
  },
  {
    id: 2,
    label: "Hyperlocal",
    icon: MapPin,
    ariaLabel: "Discover nearby in your neighborhood",
  },
  {
    id: 3,
    label: "Community First",
    icon: UserPlus,
    ariaLabel: "Built for local communities",
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

export function HowItWorksHero() {
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
            <linearGradient id="map-line-how" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="rgba(109,59,179,0.18)" />
              <stop offset="100%" stopColor="rgba(99,102,241,0.12)" />
            </linearGradient>
          </defs>
          <g stroke="url(#map-line-how)" strokeWidth="1" strokeDasharray="6 10" opacity="0.7">
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
          <span>Bengaluru • Gaya • Ranchi</span>
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

            <motion.div variants={fadeUpVariants} className="mt-6">
              <Breadcrumbs items={HOW_IT_WORKS_BREADCRUMBS} listClassName="justify-center" />
            </motion.div>

            <motion.h1
              variants={fadeUpVariants}
              className="mt-4 text-[2.8rem] sm:text-6xl lg:text-[4.25rem] font-black tracking-tight leading-[1.02]"
            >
              <span className="text-foreground">How Meelte</span>
              <br />
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-primary via-indigo-500 to-violet-500 bg-clip-text text-transparent">
                  brings neighbors together
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
                    stroke="url(#underline-gradient-how)"
                    strokeWidth="6"
                    strokeLinecap="round"
                    opacity="0.9"
                  />
                  <defs>
                    <linearGradient id="underline-gradient-how" x1="0" y1="0" x2="1" y2="0">
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
              See time-boxed offers from nearby shops, local events you can ask to join, and
              one-to-one chat with the people you meet. Purchases and event costs are settled
              directly — Meelte does not take payments.
            </motion.p>

            <motion.div
              variants={fadeUpVariants}
              className="mt-8 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row"
            >
              <Button
                as="a"
                href={PLAY_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                variant="primary"
                size="lg"
                className="group relative w-full overflow-hidden rounded-2xl px-8 font-semibold shadow-[0_30px_70px_-30px_rgba(109,59,179,0.9)] transition-transform duration-200 hover:-translate-y-0.5 hover:scale-[1.01] focus-visible:scale-[1.01] sm:w-auto"
              >
                <span className="absolute inset-0 -z-10 bg-gradient-to-r from-primary via-indigo-500 to-violet-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" aria-hidden="true" />
                <span className="absolute inset-x-0 -top-10 h-16 bg-white/20 blur-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" aria-hidden="true" />
                <Download className="h-5 w-5 transition-transform duration-200 group-hover:translate-y-0.5" aria-hidden="true" />
                <span>Get the Meelte App</span>
              </Button>

              <Button
                as="a"
                href="#ecosystem"
                variant="outline"
                size="lg"
                className="group w-full rounded-2xl px-8 font-medium backdrop-blur transition-transform duration-200 hover:-translate-y-0.5 hover:scale-[1.01] sm:w-auto"
              >
                <span>See Who It&apos;s For</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

export default HowItWorksHero;
