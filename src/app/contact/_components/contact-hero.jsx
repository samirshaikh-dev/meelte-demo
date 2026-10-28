"use client";

import React from "react";
import { Container } from "@/components/layout/container";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Sparkles, Mail, Phone, MessageCircle, ArrowRight } from "@/lib/icons";
import { SUPPORT_EMAIL, CONTACT_PHONE } from "@/config/site";

const CONTACT_BREADCRUMBS = [
  { name: "Home", path: "/" },
  { name: "Contact Us" },
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
        fill="url(#sparkle-gradient-contact)"
      />
      <circle cx="20" cy="8" r="1.2" fill="rgba(168,85,247,0.9)" />
      <circle cx="9" cy="19" r="1" fill="rgba(99,102,241,0.8)" />
      <defs>
        <linearGradient id="sparkle-gradient-contact" x1="5" y1="3" x2="23" y2="21" gradientUnits="userSpaceOnUse">
          <stop stopColor="#A78BFA" />
          <stop offset="1" stopColor="#6366F1" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function ContactHero() {
  return (
    <section className="relative pt-6 pb-8 sm:pt-8 sm:pb-10 lg:pt-10 lg:pb-12 overflow-hidden">
      {/* Gradient mesh background */}
      <div className="absolute inset-0 -z-20" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_#f5f3ff_0%,_#f8f5ff_35%,_#ffffff_100%)]" />
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1200px] h-[620px] bg-[radial-gradient(ellipse_at_top,_rgba(124,58,237,0.18)_0%,_transparent_70%)] blur-3xl" />
        <div className="absolute top-20 -left-40 w-[420px] h-[420px] bg-[radial-gradient(circle,_rgba(244,114,182,0.16)_0%,_transparent_70%)] blur-3xl" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[520px] h-[520px] bg-[radial-gradient(circle,_rgba(99,102,241,0.14)_0%,_transparent_72%)] blur-3xl" />
      </div>

      {/* Map-style background */}
      <div className="absolute inset-0 -z-10 pointer-events-none" aria-hidden="true">
        <svg className="absolute inset-0 h-full w-full opacity-50" viewBox="0 0 1440 600" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="map-line-contact" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="rgba(109,59,179,0.18)" />
              <stop offset="100%" stopColor="rgba(99,102,241,0.12)" />
            </linearGradient>
          </defs>
          <g stroke="url(#map-line-contact)" strokeWidth="1" strokeDasharray="6 10" opacity="0.7">
            <path d="M -40 180 C 220 140, 420 240, 680 180" />
            <path d="M 200 320 C 420 280, 720 380, 980 320" />
          </g>
          <g fill="rgba(109,59,179,0.28)">
            <circle cx="280" cy="160" r="3" />
            <circle cx="580" cy="210" r="2.6" />
            <circle cx="820" cy="170" r="3" />
            <circle cx="400" cy="300" r="2.8" />
            <circle cx="720" cy="340" r="3" />
          </g>
        </svg>
      </div>

      <Container className="text-center max-w-4xl">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center"
        >
          <motion.div variants={fadeUpVariants}>
            <Badge variant="primary" size="md" className="mb-5 shadow-2xs gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
              <span>We&apos;re Here to Help</span>
            </Badge>
          </motion.div>

          <motion.div variants={fadeUpVariants} className="mb-4">
            <Breadcrumbs
              items={CONTACT_BREADCRUMBS}
              listClassName="justify-center"
            />
          </motion.div>

          <motion.h1
            variants={fadeUpVariants}
            className="text-[2.8rem] sm:text-6xl lg:text-[4.25rem] font-black tracking-tight leading-[1.02]"
          >
            <span className="text-foreground">Get in</span>{" "}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-primary via-indigo-500 to-violet-500 bg-clip-text text-transparent">
                Touch
              </span>
              <svg
                className="absolute -bottom-2 left-0 w-full hidden sm:block"
                viewBox="0 0 200 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M 4 8 C 30 4, 90 2, 150 6 C 180 8, 196 6, 196 4"
                  stroke="url(#underline-gradient-contact)"
                  strokeWidth="6"
                  strokeLinecap="round"
                  opacity="0.9"
                />
                <defs>
                  <linearGradient id="underline-gradient-contact" x1="0" y1="0" x2="1" y2="0">
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
            className="mt-4 max-w-2xl text-base sm:text-lg text-foreground-secondary leading-relaxed"
          >
            Questions, feedback, partnerships, or support — our team is here to help you connect with your neighborhood.
          </motion.p>

          <motion.div variants={fadeUpVariants} className="mt-6" />
        </motion.div>
      </Container>
    </section>
  );
}

export default ContactHero;
