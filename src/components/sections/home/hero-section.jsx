"use client";

import React from "react";
import { Apple, Play } from "@/lib/icons";
import { APP_STORE_URL, PLAY_STORE_URL } from "@/config/site";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.04,
    },
  },
};

const fadeUpVariants = {
  hidden: { opacity: 0, y: 14 },
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
    <section className="relative overflow-hidden border-b border-border/80 bg-canvas pt-8 pb-10 sm:pt-12 sm:pb-14 lg:pt-14 lg:pb-16">
      {/* Subtle brand wash strictly using design tokens, zero neon glowing orbs */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/8 via-canvas to-canvas"
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
            {/* Context Badge */}
            <motion.div variants={fadeUpVariants} className="flex flex-wrap items-center justify-center gap-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-surface px-3.5 py-1.5 shadow-soft">
                <span className="flex h-2 w-2 rounded-full bg-primary" aria-hidden="true" />
                <span className="text-xs font-semibold text-foreground">
                  Hyperlocal community app for India
                </span>
                <span className="text-border" aria-hidden="true">·</span>
                <span className="text-xs font-medium text-foreground-secondary">
                  Real Rapport • Real Reach
                </span>
              </div>
            </motion.div>

            {/* Buyer-Centered Heading (Psychology §1, §7) */}
            <motion.h1
              variants={fadeUpVariants}
              className="mt-4 text-3xl font-extrabold tracking-tight text-foreground sm:mt-5 sm:text-5xl lg:text-6xl lg:leading-[1.1] text-balance"
            >
              Find what’s happening near you,{" "}
              <span className="text-primary">right now.</span>
            </motion.h1>

            {/* Clear, honest value proposition without generic startup hype */}
            <motion.p
              variants={fadeUpVariants}
              className="mt-3.5 max-w-2xl text-base leading-relaxed text-foreground-secondary sm:mt-4 sm:text-lg"
            >
              Dated shop offers with rupee pricing, joinable community events, and direct neighbourhood conversations. Sorted by distance — never buried in an algorithmic social feed.
            </motion.p>

            {/* Dual Store Conversion Actions (AVOID.md §6: standardized buttons) */}
            {/* <motion.div
              variants={fadeUpVariants}
              className="mt-6 flex w-full flex-col items-center justify-center gap-3 sm:mt-7 sm:w-auto sm:flex-row"
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
            </motion.div> */}
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

export default HeroSection;
