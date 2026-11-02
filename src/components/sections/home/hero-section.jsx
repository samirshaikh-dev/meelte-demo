"use client";

import React from "react";
import Link from "next/link";
import {
  Apple,
  MapPin,
  MessageCircle,
  Play,
  Tag,
} from "@/lib/icons";
import { APP_STORE_URL, PLAY_STORE_URL } from "@/config/site";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

/**
 * Hero content.
 *
 * The hero is text-first and conversion-focused per AVOID.md and docs/target_customer.md.
 * It provides clear dual-store download actions and an honest merchant link without
 * artificial decorative sparkles, floating blobs, or nested card mocks.
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
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

const fadeUpVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: "easeOut",
    },
  },
};

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-10 pb-16 sm:pt-14 sm:pb-20 lg:pt-20 lg:pb-24 border-b border-border/80 bg-canvas">
      {/* Subtle brand wash */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-canvas to-canvas"
        aria-hidden="true"
      />

      <Container>
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center text-center"
          >
            <motion.div variants={fadeUpVariants} className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 rounded-full bg-surface px-3 py-1 shadow-soft ring-1 ring-border/80">
                {trustPills.map((pill) => {
                  const Icon = pill.icon;
                  return (
                    <span
                      key={pill.id}
                      className="flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-semibold text-primary"
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
              className="mt-6 text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl lg:leading-[1.08]"
            >
              <span className="text-foreground">Discover what’s happening </span>
              <span className="relative inline-block text-primary">
                near you.
                <svg
                  className="absolute -bottom-2 left-0 w-full hidden sm:block"
                  viewBox="0 0 320 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M 4 8 C 40 4, 120 2, 200 6 C 250 8, 300 6, 316 4"
                    stroke="#6D3BB3"
                    strokeWidth="5"
                    strokeLinecap="round"
                    opacity="0.85"
                  />
                </svg>
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUpVariants}
              className="mt-5 max-w-xl text-base sm:text-lg text-foreground-secondary leading-relaxed"
            >
              Meelte is the hyperlocal app for Indian neighbourhoods. See time-boxed shop
              offers, request to join local events, and talk to people you meet. Results are
              sorted by distance, not by a global feed.
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
                className="w-full justify-center px-6 font-semibold shadow-card sm:w-auto"
              >
                <Play className="h-5 w-5 fill-current" aria-hidden="true" />
                <span>Get it on Google Play</span>
              </Button>

              <Button
                as="a"
                href={APP_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                variant="outline"
                size="lg"
                className="w-full justify-center px-6 font-medium sm:w-auto"
              >
                <Apple className="h-5 w-5 fill-current text-primary" aria-hidden="true" />
                <span>Download for iPhone</span>
              </Button>
            </motion.div>

            <motion.p
              variants={fadeUpVariants}
              className="mt-6 text-sm text-foreground-secondary"
            >
              Own a local business?{" "}
              <Link
                href="/for-merchants"
                className="font-semibold text-primary underline underline-offset-4 hover:text-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 rounded"
              >
                Explore merchant onboarding
              </Link>
            </motion.p>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

export default HeroSection;