"use client";

import React from "react";
import Link from "next/link";
import {
  Store,
  ArrowRight,
  Percent,
  Users,
  MapPin,
} from "@/lib/icons";
import { Container } from "@/components/layout/container";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const FOR_MERCHANTS_BREADCRUMBS = [
  { name: "Home", path: "/" },
  { name: "For Merchants" },
];

/**
 * Merchant hero.
 *
 * Clean, intentional and grounded in product evidence (AVOID.md & docs/target_customer.md).
 * No decorative sparkles, AI-generated floating blobs, or exaggerated button animations.
 */
const trustPills = [
  {
    id: 1,
    label: "0% Commission",
    icon: Percent,
    ariaLabel: "No commission deducted from a sale",
  },
  {
    id: 2,
    label: "In-Person Setup",
    icon: Users,
    ariaLabel: "Shops are onboarded in person by the field team",
  },
  {
    id: 3,
    label: "Local Field Support",
    icon: MapPin,
    ariaLabel: "In-person onboarding support for local shops",
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

export function ForMerchantsHero() {
  return (
    <section className="relative overflow-hidden pt-10 pb-16 sm:pt-14 sm:pb-20 lg:pt-20 lg:pb-24 border-b border-border/80 bg-canvas">
      {/* Subtle brand wash */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accent/10 via-canvas to-canvas"
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

            <motion.div variants={fadeUpVariants} className="mt-6">
              <Breadcrumbs items={FOR_MERCHANTS_BREADCRUMBS} listClassName="justify-center" />
            </motion.div>

            <motion.h1
              variants={fadeUpVariants}
              className="mt-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl lg:leading-[1.08]"
            >
              <span className="text-foreground">Grow your local business</span>
              <br />
              <span className="relative inline-block text-primary">
                with zero commission
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
              Put your shop&apos;s offer in front of the people already nearby. Publish a single
              product or a catalogue of up to 100, with a price, a discount and the dates it
              runs.
            </motion.p>

            <motion.div
              variants={fadeUpVariants}
              className="mt-8 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row"
            >
              <Button
                as="a"
                href="#merchant-enquiry"
                variant="primary"
                size="lg"
                className="w-full justify-center px-8 font-semibold shadow-card sm:w-auto"
              >
                <Store className="h-5 w-5" aria-hidden="true" />
                <span>Start an onboarding enquiry</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>

              <Button
                as={Link}
                href="/how-it-works"
                variant="outline"
                size="lg"
                className="w-full justify-center px-6 font-medium sm:w-auto"
              >
                <span>See how it works</span>
              </Button>
            </motion.div>

          </motion.div>
        </div>
      </Container>
    </section>
  );
}

export default ForMerchantsHero;