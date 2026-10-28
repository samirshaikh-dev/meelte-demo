"use client";

import React, { useRef } from "react";
import {
  Store,
  ArrowRight,
  Percent,
  Users,
  ShieldCheck,
  Sparkles,
  MapPin,
  CheckCircle2,
} from "@/lib/icons";
import { PLAY_STORE_URL } from "@/config/site";
import { Container } from "@/components/layout/container";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Button } from "@/components/ui/button";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";

const FOR_MERCHANTS_BREADCRUMBS = [
  { name: "Home", path: "/" },
  { name: "For Merchants" },
];

const trustPills = [
  {
    id: 1,
    label: "0% Commission",
    icon: Percent,
    ariaLabel: "Zero commission on orders and walk-ins",
  },
  {
    id: 2,
    label: "Direct Customer Connect",
    icon: Users,
    ariaLabel: "Connect directly with customers via phone and WhatsApp",
  },
  {
    id: 3,
    label: "Privacy First",
    icon: ShieldCheck,
    ariaLabel: "Location never sold or shared",
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
        fill="url(#sparkle-gradient-merchant)"
      />
      <circle cx="20" cy="8" r="1.2" fill="rgba(245,158,11,0.95)" />
      <circle cx="9" cy="19" r="1" fill="rgba(109,59,179,0.9)" />
      <defs>
        <linearGradient id="sparkle-gradient-merchant" x1="5" y1="3" x2="23" y2="21" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F59E0B" />
          <stop offset="1" stopColor="#F4B740" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function MerchantPreview() {
  return (
    <div className="relative mx-auto w-full max-w-[280px] sm:max-w-[320px] lg:max-w-[340px]">
      <div className="absolute -inset-x-10 -top-10 h-40 bg-gradient-to-b from-accent/25 via-primary/15 to-transparent blur-3xl" aria-hidden="true" />
      <div className="relative rounded-[2.25rem] bg-gradient-to-b from-white/95 to-white/80 p-2 shadow-[0_60px_120px_-60px_rgba(109,59,179,0.9)] ring-1 ring-white/70">
        <div className="rounded-[1.9rem] overflow-hidden bg-gradient-to-b from-[#f7f3ff] to-white">
          <div className="flex items-center justify-between px-5 pt-4">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-accent" />
              <span className="text-xs font-semibold text-foreground">Your Storefront</span>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-foreground-secondary">
              <MapPin className="h-3 w-3" aria-hidden="true" />
              <span>Bengaluru • Gaya • Ranchi</span>
            </div>
          </div>
          <div className="px-5 pt-4">
            <div className="rounded-2xl bg-white shadow-soft px-4 py-3 flex items-center justify-between">
              <div>
                <p className="text-xs text-foreground-secondary">Status</p>
                <p className="text-sm font-semibold text-foreground">Live • Discoverable nearby</p>
              </div>
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-accent to-amber-500 flex items-center justify-center shadow-[0_10px_40px_-12px_rgba(245,158,11,0.9)]">
                <Store className="h-4 w-4 text-white" aria-hidden="true" />
              </div>
            </div>
          </div>
          <div className="px-5 pt-4 space-y-2">
            {[
              { title: "Direct calls", desc: "Customers call you directly" },
              { title: "WhatsApp inquiries", desc: "No masked numbers" },
              { title: "Zero commission", desc: "Keep 100% of earnings" },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl bg-white/90 backdrop-blur px-4 py-3 flex items-center justify-between shadow-[0_30px_60px_-40px_rgba(109,59,179,0.8)]"
              >
                <div>
                  <p className="text-sm font-semibold text-foreground">{item.title}</p>
                  <p className="text-xs text-foreground-secondary">{item.desc}</p>
                </div>
                <CheckCircle2 className="h-4 w-4 text-emerald-600" aria-hidden="true" />
              </div>
            ))}
          </div>
          <div className="px-5 pt-5 pb-6">
            <div className="rounded-2xl bg-gradient-to-r from-primary via-primary-hover to-primary-royal px-4 py-3 text-white flex items-center justify-between shadow-[0_40px_80px_-40px_rgba(109,59,179,0.9)]">
              <div>
                <p className="text-sm font-semibold">Free to get started</p>
                <p className="text-xs text-white/80">Community verification in 24-48 hours</p>
              </div>
              <Percent className="h-5 w-5" aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>
      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 h-16 w-3/4 rounded-full bg-primary/20 blur-3xl" aria-hidden="true" />
    </div>
  );
}

export function ForMerchantsHero() {
  return (
    <section className="relative pt-10 pb-16 sm:pt-14 sm:pb-20 lg:pt-20 lg:pb-28 overflow-hidden">
      {/* Gradient mesh background */}
      <div className="absolute inset-0 -z-20" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_#f5f3ff_0%,_#f8f5ff_35%,_#ffffff_100%)]" />
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1200px] h-[620px] bg-[radial-gradient(ellipse_at_top,_rgba(245,158,11,0.16)_0%,_transparent_70%)] blur-3xl" />
        <div className="absolute top-20 -left-40 w-[420px] h-[420px] bg-[radial-gradient(circle,_rgba(109,59,179,0.16)_0%,_transparent_70%)] blur-3xl" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[520px] h-[520px] bg-[radial-gradient(circle,_rgba(99,102,241,0.14)_0%,_transparent_72%)] blur-3xl" />
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
              <Breadcrumbs items={FOR_MERCHANTS_BREADCRUMBS} />
            </motion.div>

            <motion.h1
              variants={fadeUpVariants}
              className="mt-4 text-[2.8rem] sm:text-6xl lg:text-[4.25rem] font-black tracking-tight leading-[1.02]"
            >
              <span className="text-foreground">Grow your local business</span>
              <br />
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-primary via-indigo-500 to-violet-500 bg-clip-text text-transparent">
                  with zero commission
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
                    stroke="url(#underline-gradient-merchant)"
                    strokeWidth="6"
                    strokeLinecap="round"
                    opacity="0.9"
                  />
                  <defs>
                    <linearGradient id="underline-gradient-merchant" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="rgba(245,158,11,0.95)" />
                      <stop offset="60%" stopColor="rgba(109,59,179,0.9)" />
                      <stop offset="100%" stopColor="rgba(124,58,237,0.9)" />
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
              List your shop, cafe, boutique, clinic, or service on Meelte and connect directly with nearby customers. No middleman fees. No masked numbers. Just more walk-ins.
            </motion.p>

            <motion.div
              variants={fadeUpVariants}
              className="mt-8 flex w-full flex-col items-center gap-3 sm:flex-row sm:w-auto lg:items-start"
            >
              <Button
                as="a"
                href="#merchant-enquiry"
                variant="primary"
                size="lg"
                className="group relative w-full overflow-hidden rounded-2xl px-8 font-semibold shadow-[0_30px_70px_-30px_rgba(109,59,179,0.9)] transition-transform duration-200 hover:-translate-y-0.5 hover:scale-[1.01] focus-visible:scale-[1.01] sm:w-auto"
              >
                <span className="absolute inset-0 -z-10 bg-gradient-to-r from-primary via-indigo-500 to-violet-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" aria-hidden="true" />
                <Store className="h-5 w-5" aria-hidden="true" />
                <span>Start Free Onboarding</span>
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
                <span>See How It Works</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
              </Button>
            </motion.div>

            <motion.div
              variants={fadeUpVariants}
              className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-foreground-secondary lg:justify-start"
            >
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" aria-hidden="true" />
                <span>Free community verification</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" aria-hidden="true" />
                <span>Direct WhatsApp & calls</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" aria-hidden="true" />
                <span>Serving Bengaluru, Gaya & Ranchi</span>
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
            <MerchantPreview />
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

export default ForMerchantsHero;
