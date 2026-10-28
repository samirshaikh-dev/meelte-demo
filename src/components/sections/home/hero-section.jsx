"use client";

import React, { useRef } from "react";
import {
  Download,
  ArrowRight,
  ShieldCheck,
  Percent,
  Users,
  MapPin,
  CalendarDays,
  Wrench,
  Briefcase,
  Coffee,
  Sparkles,
} from "@/lib/icons";
import { PLAY_STORE_URL } from "@/config/site";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";

const floatingCards = [
  {
    id: 1,
    text: "Chai Corner - 200m",
    icon: Coffee,
    emoji: "☕",
    className: "top-[8%] left-[6%] lg:left-[10%]",
    delay: 0.4,
    floatDuration: 6,
  },
  {
    id: 2,
    text: "Sunday Yoga Meetup",
    icon: Users,
    emoji: "🧘",
    className: "top-[22%] right-[4%] lg:right-[8%]",
    delay: 0.6,
    floatDuration: 7,
  },
  {
    id: 3,
    text: "Verified Electrician",
    icon: Wrench,
    emoji: "🔌",
    className: "bottom-[28%] left-[2%] lg:left-[6%]",
    delay: 0.8,
    floatDuration: 6.5,
  },
  {
    id: 4,
    text: "Part-time Job Nearby",
    icon: Briefcase,
    emoji: "💼",
    className: "bottom-[14%] right-[8%] lg:right-[12%]",
    delay: 1.0,
    floatDuration: 7.5,
  },
];

const trustPills = [
  {
    id: 1,
    label: "Private",
    icon: ShieldCheck,
    ariaLabel: "100% Private - Location never sold or tracked",
  },
  {
    id: 2,
    label: "0% Cut",
    icon: Percent,
    ariaLabel: "0% Cut - Zero commission on merchant sales",
  },
  {
    id: 3,
    label: "Moderated",
    icon: Users,
    ariaLabel: "Moderated - Spam-free local community",
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

const floatVariants = {
  animate: (custom) => ({
    y: [0, -10, 0],
    transition: {
      duration: custom.floatDuration,
      repeat: Infinity,
      repeatType: "mirror",
      ease: "easeInOut",
      delay: custom.delay,
    },
  }),
};

function FloatingCard({ card }) {
  const cardRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 150, damping: 20, mass: 0.5 };
  const x = useSpring(useTransform(mouseX, [-50, 50], [-6, 6]), springConfig);
  const y = useSpring(useTransform(mouseY, [-50, 50], [-4, 6]), springConfig);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const Icon = card.icon;

  return (
    <motion.div
      ref={cardRef}
      custom={card}
      variants={floatVariants}
      animate="animate"
      initial={{ opacity: 0, scale: 0.9, y: 16 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ delay: card.delay, type: "spring", stiffness: 140, damping: 16 }}
      style={{ x, y }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`absolute hidden sm:flex items-center gap-2 px-3 py-2 rounded-2xl bg-white/80 backdrop-blur-xl border border-white/60 shadow-[0_20px_60px_-20px_rgba(109,59,179,0.45)] ${card.className}`}
      role="listitem"
      aria-label={card.text}
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary/15 to-primary/5 text-lg" aria-hidden="true">
        {card.emoji}
      </span>
      <div className="flex flex-col">
        <span className="text-xs font-semibold text-foreground leading-tight">{card.text}</span>
        <span className="text-[10px] text-foreground-secondary">Nearby</span>
      </div>
      <Icon className="h-3.5 w-3.5 text-primary/80" aria-hidden="true" />
    </motion.div>
  );
}

function PhoneMockup() {
  return (
    <div className="relative mx-auto w-full max-w-[280px] sm:max-w-[320px] lg:max-w-[340px]">
      <div className="absolute -inset-x-10 -top-10 h-40 bg-gradient-to-b from-primary/20 via-fuchsia-200/20 to-transparent blur-3xl" aria-hidden="true" />
      <div className="relative rounded-[2.25rem] bg-gradient-to-b from-white/95 to-white/80 p-2 shadow-[0_60px_120px_-60px_rgba(76,29,149,0.9)] ring-1 ring-white/70">
        <div className="rounded-[1.9rem] overflow-hidden bg-gradient-to-b from-[#f7f3ff] to-white">
          <div className="flex items-center justify-between px-5 pt-4">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary/70" />
              <span className="text-xs font-semibold text-foreground">Meelte</span>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-foreground-secondary">
              <MapPin className="h-3 w-3" aria-hidden="true" />
              <span>Bengaluru</span>
            </div>
          </div>
          <div className="px-5 pt-4">
            <div className="rounded-2xl bg-white shadow-soft px-4 py-3 flex items-center justify-between">
              <div>
                <p className="text-xs text-foreground-secondary">Discover nearby</p>
                <p className="text-sm font-semibold text-foreground">Shops • Events • Services</p>
              </div>
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-indigo-500 flex items-center justify-center shadow-[0_10px_40px_-12px_rgba(109,59,179,0.9)]">
                <ArrowRight className="h-4 w-4 text-white" aria-hidden="true" />
              </div>
            </div>
          </div>
          <div className="px-5 pt-4 space-y-2">
            {[
              { title: "Chai Corner", tag: "Food • 200m" },
              { title: "Sunday Yoga Meetup", tag: "Events • 450m" },
              { title: "Verified Electrician", tag: "Services • 650m" },
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
                <p className="text-sm font-semibold">Find something nearby</p>
                <p className="text-xs text-white/80">Right around you</p>
              </div>
              <CalendarDays className="h-5 w-5" aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>
      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 h-16 w-3/4 rounded-full bg-primary/20 blur-3xl" aria-hidden="true" />
    </div>
  );
}

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

            <motion.h1
              variants={fadeUpVariants}
              className="mt-6 text-[2.8rem] sm:text-6xl lg:text-[4.25rem] font-black tracking-tight leading-[1.02]"
            >
              <span className="text-foreground">Your neighborhood, </span>
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-primary via-indigo-500 to-violet-500 bg-clip-text text-transparent">
                  connected directly.
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
              Discover shops, events and services right around you.
            </motion.p>

            <motion.div
              variants={fadeUpVariants}
              className="mt-8 flex w-full flex-col items-center gap-3 sm:flex-row sm:w-auto lg:items-start"
            >
              <Button
                as="a"
                href="/signup"
                variant="primary"
                size="lg"
                className="group relative w-full overflow-hidden rounded-2xl px-8 font-semibold shadow-[0_30px_70px_-30px_rgba(109,59,179,0.9)] transition-transform duration-200 hover:-translate-y-0.5 hover:scale-[1.01] focus-visible:scale-[1.01] sm:w-auto"
              >
                <span className="absolute inset-0 -z-10 bg-gradient-to-r from-primary via-indigo-500 to-violet-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" aria-hidden="true" />
                <span className="absolute inset-x-0 -top-10 h-16 bg-white/20 blur-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" aria-hidden="true" />
                <span>Sign Up</span>
                <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
              </Button>

              <Button
                as="a"
                href="#discover"
                variant="outline"
                size="lg"
                className="group w-full rounded-2xl px-8 font-medium backdrop-blur transition-transform duration-200 hover:-translate-y-0.5 hover:scale-[1.01] sm:w-auto"
              >
                <span>Explore Nearby</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
              </Button>

              <Button
                as="a"
                href={PLAY_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                variant="ghost"
                size="lg"
                className="group w-full rounded-2xl px-6 font-medium backdrop-blur transition-transform duration-200 hover:-translate-y-0.5 hover:scale-[1.01] sm:w-auto"
              >
                <Download className="h-4 w-4 transition-transform duration-200 group-hover:translate-y-0.5" aria-hidden="true" />
                <span>Get on Play Store</span>
              </Button>
            </motion.div>
          </motion.div>

          {/* Right: Visual */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, type: "spring", stiffness: 110, damping: 18 }}
            className="relative flex items-center justify-center"
          >
            <div className="relative">
              <PhoneMockup />
              {floatingCards.map((card) => (
                <FloatingCard key={card.id} card={card} />
              ))}
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

export default HeroSection;
