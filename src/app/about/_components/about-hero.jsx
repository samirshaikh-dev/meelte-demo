"use client";

import React from "react";
import Link from "next/link";
import {
  Apple,
  Sparkles,
  Compass,
  Download,
  ArrowRight,
  Play,
  Users,
  MapPin,
  ShieldCheck,
} from "@/lib/icons";
import { APP_STORE_URL, PLAY_STORE_URL } from "@/config/site";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const trustPills = [
  { id: 1, label: "Hyperlocal", icon: MapPin },
  { id: 2, label: "Privacy First", icon: ShieldCheck },
  { id: 3, label: "Community Driven", icon: Users },
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

export function AboutHero() {
  return (
    <section className="relative overflow-hidden pt-10 pb-16 sm:pt-14 sm:pb-20 lg:pt-20 lg:pb-28 border-b border-border/80">
      <div className="absolute inset-0 -z-20" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_#f5f3ff_0%,_#f8f5ff_35%,_#ffffff_100%)]" />
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1200px] h-[620px] bg-[radial-gradient(ellipse_at_top,_rgba(124,58,237,0.18)_0%,_transparent_70%)] blur-3xl" />
        <div className="absolute top-20 -left-40 w-[420px] h-[420px] bg-[radial-gradient(circle,_rgba(244,114,182,0.14)_0%,_transparent_70%)] blur-3xl" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[520px] h-[520px] bg-[radial-gradient(circle,_rgba(99,102,241,0.12)_0%,_transparent_72%)] blur-3xl" />
      </div>

      <Container>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center text-center max-w-4xl mx-auto"
        >
          <motion.div variants={fadeUpVariants} className="w-full flex items-center justify-start">
            <nav aria-label="Breadcrumb" className="mt-2">
              <ol className="flex items-center gap-1.5 text-xs text-foreground-secondary">
                <li>
                  <Link href="/" className="hover:text-primary transition-colors font-medium">
                    Home
                  </Link>
                </li>
                <li aria-hidden="true" className="text-foreground-muted">
                  /
                </li>
                <li className="text-foreground font-semibold" aria-current="page">
                  About Us
                </li>
              </ol>
            </nav>
          </motion.div>

          <motion.div variants={fadeUpVariants} className="mt-6 flex items-center gap-2">
            <div className="flex items-center gap-1.5 rounded-full bg-white/80 backdrop-blur px-2.5 py-1 shadow-soft ring-1 ring-white/70">
              {trustPills.map((pill) => {
                const Icon = pill.icon;
                return (
                  <span
                    key={pill.id}
                    className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold text-primary"
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
            className="mt-4 text-[2.8rem] sm:text-6xl lg:text-[4.25rem] font-black tracking-tight leading-[1.02]"
          >
            <span className="text-foreground">About</span>{" "}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-primary via-indigo-500 to-violet-500 bg-clip-text text-transparent">
                Meelte
              </span>
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUpVariants}
            className="mt-5 max-w-2xl text-lg sm:text-xl text-foreground-secondary leading-relaxed"
          >
            Why we built a platform to help people find what matters, before it slips away. Discover local opportunities, meaningful events, and real communities.
          </motion.p>

          <motion.div
            variants={fadeUpVariants}
            className="mt-8 flex w-full flex-col items-center gap-3 sm:flex-row sm:w-auto"
          >
            <Button
              as="a"
              href={PLAY_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              variant="primary"
              size="lg"
              className="group w-full sm:w-auto rounded-2xl px-8 shadow-[0_30px_70px_-30px_rgba(109,59,179,0.9)]"
            >
              <Play className="h-5 w-5 fill-current" aria-hidden="true" />
              <span>Get it on Google Play</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
            </Button>
            <Button
              as="a"
              href={APP_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              variant="outline"
              size="lg"
              className="group w-full sm:w-auto rounded-2xl px-8"
            >
              <Apple className="h-5 w-5 fill-current" aria-hidden="true" />
              <span>Download for iPhone</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
            </Button>
            <Button as={Link} href="/discover" variant="outline" size="lg" className="w-full sm:w-auto rounded-2xl px-8">
              <Compass className="h-4 w-4 text-primary" aria-hidden="true" />
              <span>Explore Discover</span>
            </Button>
          </motion.div>

          <motion.div
            variants={fadeUpVariants}
            className="mt-8 p-5 sm:p-6 rounded-2xl bg-white/80 backdrop-blur border border-primary/20 shadow-soft max-w-2xl text-left flex items-start gap-4"
          >
            <div className="h-10 w-10 shrink-0 rounded-xl bg-surface-muted text-primary flex items-center justify-center border border-primary/20">
              <Sparkles className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-primary block mb-1">
                Our Core Goal
              </span>
              <p className="text-sm sm:text-base font-semibold text-foreground leading-snug">
                Help people connect with the right opportunities and the right people at the right time.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}

export default AboutHero;
