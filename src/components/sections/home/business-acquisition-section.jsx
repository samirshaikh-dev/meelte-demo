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
  notifyInfo,
} from "@/lib/toast-feedback";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { SUPPORT_EMAIL, CONTACT_PHONE } from "@/config/site";

/**
 * Comparison rows.
 *
 * Rewritten because the previous version asserted competitor figures ("20% – 35%
 * cut taken"), a walking-distance radius ("Hyperlocal Proximity (< 3 km)") that
 * contradicts the product's 60 km default sort, and a verification programme
 * ("Free Community Verification") that does not exist in the app. The right-hand
 * column now describes aggregator behaviour only in general terms — no invented
 * percentages — and the left-hand column states only what the product does
 * (docs/target_customer.md §1, §4.3).
 */
const COMPARISON_POINTS = [
  {
    feature: "Commission on a sale",
    meelte: "0% commission",
    aggregators: "A percentage of every order",
    detail: "Meelte does not deduct a cut of what a shop earns.",
  },
  {
    feature: "Who sees your offer",
    meelte: "Nearby residents, sorted by distance",
    aggregators: "Whoever the ranking favours",
    detail: "Offers appear to people in the city zone the ad is published in.",
  },
  {
    feature: "What you can list",
    meelte: "One product, or a catalogue of up to 100",
    aggregators: "Menu-bound listings",
    detail: "Photograph a menu or price list and the app fills in the items.",
  },
  {
    feature: "How you get set up",
    meelte: "In person, by our field team",
    aggregators: "Self-serve sign-up",
    detail: "A field team member visits the shop and helps publish the first ad.",
  },
];

const ONBOARDING_STEPS = [
  {
    number: "01",
    title: "Tell us about the shop",
    description:
      "Send your business name, category, phone number and city — or call the merchant desk directly. The field team visits shops in person.",
  },
  {
    number: "02",
    title: "A field team visit",
    description:
      "Someone from the team meets you at the shop, sets up the profile and shows you how to publish an offer from the app.",
  },
  {
    number: "03",
    title: "Publish your first ad",
    description:
      "A single product or a catalogue of up to 100, with a price or discount and the dates it should run. It goes live at 12:00 AM on the start date.",
  },
];

export function BusinessAcquisitionSection() {
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    businessName: "",
    contactPerson: "",
    phone: "",
    category: "Food & beverage",
    city: "Bengaluru",
  });
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

    // No backend endpoint is provisioned yet (AI_RULE.md §2.1), so the form hands the
    // enquiry to the user's mail client instead of showing a success state for a
    // request that was never sent. The toast says exactly that.
    const subject = encodeURIComponent(
      `Merchant enquiry — ${formData.businessName.trim()}`
    );
    const body = encodeURIComponent(
      [
        `Business: ${formData.businessName.trim()}`,
        `Contact: ${formData.contactPerson.trim() || "—"}`,
        `Phone: ${formData.phone.trim()}`,
        `Category: ${formData.category}`,
        `City: ${formData.city}`,
      ].join("\n")
    );

    window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`;
    notifyInfo(TOAST_COPY.merchantHandoff, {
      id: TOAST_ID.merchant,
      description: TOAST_COPY.merchantHandoffDescription(SUPPORT_EMAIL),
    });
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
            Sell to the people already nearby. 0% commission.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-foreground-secondary leading-relaxed">
            Delivery aggregators take a percentage of every order and sit between you and the
            customer. Meelte is built the other way round: your shop, your offer, your counter.
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
                    <CheckCircle2 className="h-4 w-4 text-success shrink-0" aria-hidden="true" />
                    <div>
                      <span className="text-xs font-bold text-success bg-success/10 px-2.5 py-1 rounded-md border border-success/30 inline-block">
                        {item.meelte}
                      </span>
                    </div>
                  </div>

                  <div className="md:col-span-4 flex items-center gap-2 text-xs text-foreground-secondary">
                    <span className="text-error font-bold shrink-0" aria-hidden="true">
                      ✕
                    </span>
                    <span className="text-foreground-muted">{item.aggregators}</span>
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
                <div className="mt-6 pt-3 border-t border-border/50 text-[11px] text-success font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-success" aria-hidden="true" />
                  <span>No commission deducted</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Business CTA Action Card with Enquiry Dialog */}
        <div className="rounded-3xl bg-gradient-to-br from-primary via-primary-hover to-primary-royal p-8 sm:p-12 text-white shadow-card flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-accent block mb-2">
              Merchant onboarding
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Ready to list your local shop?
            </h3>
            <p className="mt-2 text-sm sm:text-base text-white/90 leading-relaxed">
              Meelte onboards shops in person in Bengaluru, Gaya and Ranchi. Read the dedicated{" "}
              <Link href="/for-merchants" className="underline decoration-accent/70 hover:decoration-white transition-colors font-semibold">
                For Merchants
              </Link>{" "}
              page for what a shop can publish.
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
                  <span>Start a merchant enquiry</span>
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
                        <span className="text-xs text-primary font-medium">0% commission</span>
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
                    Send us the shop details and a member of our field team will get in touch to
                    set up your profile and publish your first offer.
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
                        placeholder="The name on your shop board"
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
                          <option>Food & beverage</option>
                          <option>Fashion & apparel</option>
                          <option>Home & repair services</option>
                          <option>Health & wellness</option>
                          <option>Retail</option>
                          <option>Something else</option>
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
                      className="mt-2 w-full justify-center shadow-soft"
                    >
                      <Send className="h-4 w-4" aria-hidden="true" />
                      <span>Open email with these details</span>
                    </Button>

                    <p className="text-[11px] text-foreground-secondary text-center leading-relaxed">
                      This sends the enquiry through your own email app. Nothing is submitted
                      until you send it. Prefer to talk?{" "}
                      <a
                        href={`tel:${CONTACT_PHONE.replace(/[^+\d]/g, "")}`}
                        className="font-semibold text-primary underline"
                      >
                        Call {CONTACT_PHONE}
                      </a>
                    </p>
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
