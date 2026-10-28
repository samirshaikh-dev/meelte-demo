"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Store,
  CheckCircle2,
  Percent,
  TrendingUp,
  Users,
  ShieldCheck,
  Send,
  Phone,
  Mail,
  ArrowRight,
  Sparkles,
  Building2,
  X,
} from "@/lib/icons";
import * as Dialog from "@radix-ui/react-dialog";
import {
  TOAST_COPY,
  TOAST_ID,
  notifyError,
  notifySuccess,
} from "@/lib/toast-feedback";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { SUPPORT_EMAIL, CONTACT_PHONE } from "@/config/site";

const COMPARISON_POINTS = [
  {
    feature: "Commission per Order or Walk-in",
    meelte: "0% Commission",
    aggregators: "20% – 35% cut taken",
    detail: "Keep 100% of your earnings. No revenue sharing.",
  },
  {
    feature: "Customer Ownership & Data",
    meelte: "Direct Phone & WhatsApp",
    aggregators: "Masked numbers & locked data",
    detail: "Build real relationships with repeat neighborhood buyers.",
  },
  {
    feature: "Local Discoverability",
    meelte: "Hyperlocal Proximity (< 3 km)",
    aggregators: "Pay-to-rank sponsored bidding",
    detail: "Nearby neighbors see your store based on real proximity.",
  },
  {
    feature: "Setup & Onboarding Fees",
    meelte: "Free Community Verification",
    aggregators: "Hefty onboarding charges",
    detail: "No barrier to entry for verified local businesses.",
  },
];

const ONBOARDING_STEPS = [
  {
    number: "01",
    title: "Submit Quick Enquiry",
    description: "Provide your business name, category, and neighborhood address in under 60 seconds.",
  },
  {
    number: "02",
    title: "Community Verification",
    description: "Our local coordinator verifies your physical presence to maintain a trusted, spam-free directory.",
  },
  {
    number: "03",
    title: "Storefront Goes Live",
    description: "Your digital profile, contact details, and catalog become discoverable to nearby residents on the Meelte App.",
  },
];

export function BusinessAcquisitionSection() {
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    businessName: "",
    contactPerson: "",
    phone: "",
    category: "Food & Cafes",
    city: "Bengaluru",
  });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const nextErrors = {};

    if (!formData.businessName.trim()) {
      nextErrors.businessName = "Enter your business or store name.";
    }
    if (!formData.phone.trim()) {
      nextErrors.phone = "Enter a phone number we can call.";
    } else if (!/^\+?[\d\s-]{8,}$/.test(formData.phone.trim())) {
      nextErrors.phone = "Enter a valid phone number.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0 ? null : nextErrors;
  };

  const handleModalOpenChange = (open) => {
    setModalOpen(open);
    if (!open) setErrors({});
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const nextErrors = validate();

    if (nextErrors) {
      notifyError(TOAST_COPY.merchantValidation, { id: TOAST_ID.merchant });
      const firstInvalidField = ["businessName", "phone"].find((field) => nextErrors[field]);
      if (firstInvalidField) {
        document.getElementById(firstInvalidField)?.focus();
      }
      return;
    }

    setSubmitting(true);
    // TODO(backend): replace this simulated submit with a POST to API_ENDPOINTS.MERCHANT_INQUIRY
    // via src/services/ once NEXT_PUBLIC_MEELTE_API_BASE_URL is provisioned (AI_RULE.md §2.1).
    setTimeout(() => {
      setSubmitting(false);
      setModalOpen(false);
      notifySuccess(TOAST_COPY.merchantSuccess, {
        id: TOAST_ID.merchant,
        description: TOAST_COPY.merchantSuccessDescription(formData.phone),
      });
      setFormData({
        businessName: "",
        contactPerson: "",
        phone: "",
        category: "Food & Cafes",
        city: "Bengaluru",
      });
    }, 600);
  };

  return (
    <section id="for-businesses" className="py-16 sm:py-24 bg-surface-subtle scroll-mt-20 border-b border-border/80">
      <Container>
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <Badge variant="accent" className="mb-3 gap-1.5 py-1 px-3">
            <Store className="h-3.5 w-3.5 text-accent-foreground" aria-hidden="true" />
            <span className="font-bold">Grow with Meelte · For Local Merchants</span>
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-[2.6rem] font-extrabold tracking-tight text-foreground leading-tight">
            Direct customer connections. Zero commission cuts.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-foreground-secondary leading-relaxed">
            National delivery apps take up to a third of your profit margins and lock your customer data behind opaque paywalls. Meelte restores direct, neighborhood-first commerce.
          </p>
        </div>

        {/* Side-by-Side Comparison: Aggregators vs Meelte */}
        <div className="mb-14">
          <div className="overflow-hidden rounded-3xl border border-border/80 bg-surface shadow-card">
            <div className="p-6 sm:p-8 bg-gradient-to-r from-primary to-primary-dark text-white">
              <span className="text-xs font-bold uppercase tracking-wider text-accent block mb-1">
                Transparent Economics
              </span>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
                Why local merchants choose the Meelte Ecosystem
              </h3>
            </div>

            <div className="divide-y divide-border/70">
              {COMPARISON_POINTS.map((item, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-1 md:grid-cols-12 p-5 sm:p-6 gap-4 items-center hover:bg-canvas/50 transition-colors"
                >
                  <div className="md:col-span-4">
                    <span className="font-bold text-sm text-foreground block">
                      {item.feature}
                    </span>
                    <span className="text-xs text-foreground-secondary mt-0.5 block">
                      {item.detail}
                    </span>
                  </div>

                  <div className="md:col-span-4 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" aria-hidden="true" />
                    <div>
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 inline-block">
                        {item.meelte}
                      </span>
                    </div>
                  </div>

                  <div className="md:col-span-4 flex items-center gap-2 text-xs text-foreground-secondary">
                    <span className="text-red-500 font-bold shrink-0">✕</span>
                    <span className="line-through text-foreground-muted">{item.aggregators}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 3-Step Onboarding Pathway */}
        <div className="mb-12">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Simple 3-Step Process
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground mt-1">
              How onboarding works for your business
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ONBOARDING_STEPS.map((step) => (
              <div
                key={step.number}
                className="p-6 rounded-3xl bg-surface border border-border/80 shadow-soft flex flex-col justify-between"
              >
                <div>
                  <span className="text-2xl font-black text-primary/40 block mb-3">
                    {step.number}
                  </span>
                  <h4 className="font-bold text-lg text-foreground tracking-tight">
                    {step.title}
                  </h4>
                  <p className="mt-2 text-xs sm:text-sm text-foreground-secondary leading-relaxed">
                    {step.description}
                  </p>
                </div>
                <div className="mt-6 pt-3 border-t border-border/50 text-[11px] text-emerald-700 font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
                  <span>Guaranteed zero hidden fees</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Business CTA Action Card with Enquiry Dialog */}
        <div className="rounded-3xl bg-gradient-to-br from-primary via-primary-hover to-primary-royal p-8 sm:p-12 text-white shadow-card flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-accent block mb-2">
              Free Verification & Setup
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Ready to list your local store or service?
            </h3>
            <p className="mt-2 text-sm sm:text-base text-white/90 leading-relaxed">
              Join local cafes, boutiques, tailors, clinics, and service pros already growing their presence in Bengaluru, Gaya, and Ranchi. Learn more on our dedicated{" "}
              <Link href="/for-merchants" className="underline decoration-accent/70 hover:decoration-white transition-colors font-semibold">
                For Merchants
              </Link>{" "}
              page.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full md:w-auto">
            <Dialog.Root open={modalOpen} onOpenChange={handleModalOpenChange}>
              <Dialog.Trigger asChild>
                <Button
                  variant="accent"
                  size="lg"
                  className="w-full sm:w-auto font-bold shadow-soft text-accent-foreground"
                >
                  <Store className="h-4 w-4" aria-hidden="true" />
                  <span>Start Business Enquiry</span>
                </Button>
              </Dialog.Trigger>

              <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
                <Dialog.Content
                  aria-describedby="enquiry-dialog-description"
                  className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-surface p-6 sm:p-8 shadow-2xl border border-border data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 duration-200 focus:outline-none"
                >
                  <div className="flex items-center justify-between pb-4 border-b border-border">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-muted text-primary shadow-2xs">
                        <Store className="h-5 w-5" aria-hidden="true" />
                      </div>
                      <div>
                        <Dialog.Title className="text-lg font-bold text-foreground">
                          Merchant Onboarding Enquiry
                        </Dialog.Title>
                        <span className="text-xs text-primary font-medium">Free • 0% Commission</span>
                      </div>
                    </div>
                    <Dialog.Close asChild>
                      <button
                        type="button"
                        aria-label="Close dialog"
                        className="flex h-9 w-9 items-center justify-center rounded-xl text-foreground-secondary hover:bg-surface-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                      >
                        <X className="h-5 w-5" aria-hidden="true" />
                      </button>
                    </Dialog.Close>
                  </div>

                  <p id="enquiry-dialog-description" className="mt-3 text-xs text-foreground-secondary leading-relaxed">
                    Submit your business details below. Our local community coordinator will call you to verify your shop presence and configure your free storefront.
                  </p>

                  <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3.5" noValidate>
                    <div>
                      <label htmlFor="businessName" className="block text-xs font-bold text-foreground mb-1">
                        Business or Store Name *
                      </label>
                      <input
                        id="businessName"
                        type="text"
                        required
                        placeholder="e.g. Roast & Toast Cafe / Kalarang Handloom"
                        value={formData.businessName}
                        onChange={(e) => {
                          setFormData({ ...formData, businessName: e.target.value });
                          if (errors.businessName) setErrors({ ...errors, businessName: "" });
                        }}
                        className={`w-full px-3.5 py-2.5 rounded-xl border bg-canvas text-sm text-foreground placeholder:text-foreground-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
                          errors.businessName ? "border-error" : "border-border"
                        }`}
                        aria-invalid={errors.businessName ? "true" : "false"}
                        aria-describedby={errors.businessName ? "businessName-error" : undefined}
                      />
                      {errors.businessName && (
                        <p id="businessName-error" className="mt-1 text-xs text-error">
                          {errors.businessName}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label htmlFor="contactPerson" className="block text-xs font-bold text-foreground mb-1">
                          Contact Name
                        </label>
                        <input
                          id="contactPerson"
                          type="text"
                          placeholder="e.g. Ramesh Kumar"
                          value={formData.contactPerson}
                          onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-canvas text-sm text-foreground placeholder:text-foreground-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                        />
                      </div>

                      <div>
                        <label htmlFor="phone" className="block text-xs font-bold text-foreground mb-1">
                          Phone / WhatsApp *
                        </label>
                        <input
                          id="phone"
                          type="tel"
                          required
                          autoComplete="tel"
                          placeholder="+91 98765 43210"
                          value={formData.phone}
                          onChange={(e) => {
                            setFormData({ ...formData, phone: e.target.value });
                            if (errors.phone) setErrors({ ...errors, phone: "" });
                          }}
                          className={`w-full px-3.5 py-2.5 rounded-xl border bg-canvas text-sm text-foreground placeholder:text-foreground-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
                            errors.phone ? "border-error" : "border-border"
                          }`}
                          aria-invalid={errors.phone ? "true" : "false"}
                          aria-describedby={errors.phone ? "phone-error" : undefined}
                        />
                        {errors.phone && (
                          <p id="phone-error" className="mt-1 text-xs text-error">
                            {errors.phone}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label htmlFor="category" className="block text-xs font-bold text-foreground mb-1">
                          Category
                        </label>
                        <select
                          id="category"
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-canvas text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                        >
                          <option>Food & Cafes</option>
                          <option>Fashion & Apparel</option>
                          <option>Community & Events</option>
                          <option>Home Services</option>
                          <option>Health & Wellness</option>
                          <option>Retail & Others</option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor="city" className="block text-xs font-bold text-foreground mb-1">
                          Primary City
                        </label>
                        <select
                          id="city"
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-canvas text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                        >
                          <option>Bengaluru</option>
                          <option>Gaya</option>
                          <option>Ranchi</option>
                          <option>Other Town (Pan-India)</option>
                        </select>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      disabled={submitting}
                      className="mt-2 w-full justify-center shadow-soft"
                    >
                      <Send className="h-4 w-4" aria-hidden="true" />
                      <span>{submitting ? "Submitting..." : "Submit Verification Request"}</span>
                    </Button>
                  </form>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>

            <div className="flex flex-col items-center gap-2">
              <Link
                href="/for-merchants"
                className="text-xs font-semibold text-white/90 hover:text-white px-3 py-2 text-center underline sm:no-underline hover:underline"
              >
                View full merchant guide →
              </Link>
              <a
                href={`mailto:${SUPPORT_EMAIL}?subject=Merchant%20Partnership%20Enquiry`}
                className="text-xs font-semibold text-white/80 hover:text-white px-3 py-1 text-center"
              >
                Email Merchant Desk →
              </a>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default BusinessAcquisitionSection;
