"use client";

import React, { useState } from "react";
import { Store, CheckCircle2, TrendingUp, Users, Shield, Send, Phone, Mail, ArrowRight } from "@/lib/icons";
import * as Dialog from "@radix-ui/react-dialog";
import {
  TOAST_COPY,
  TOAST_ID,
  notifyError,
  notifySuccess,
} from "@/lib/toast-feedback";
import { Container } from "@/components/layout/container";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SUPPORT_EMAIL, CONTACT_PHONE } from "@/config/site";

const STEPS = [
  {
    step: "01",
    title: "Enquire in 60 Seconds",
    description: "Submit your business name, neighborhood location, and category. No paperwork or registration fees.",
  },
  {
    step: "02",
    title: "Get Verified & Listed",
    description: "Our community team verifies your local presence and curates your digital storefront on Meelte.",
  },
  {
    step: "03",
    title: "Reach Nearby Customers",
    description: "Nearby residents discover your offers, menus, and services directly on the app with zero middleman cuts.",
  },
];

const VALUE_PROPS = [
  "Zero commission on customer footfall or sales",
  "Targeted specifically to your city and neighborhood",
  "Direct customer communication without opaque middlemen",
  "Free initial onboarding for Bengaluru, Gaya & Ranchi SMBs",
];

export function MerchantCTA() {
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "", category: "Food", city: "Bengaluru" });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const nextErrors = {};

    if (!formData.name.trim()) {
      nextErrors.name = "Enter your business or shop name.";
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
      const firstInvalidField = ["name", "phone"].find((field) => nextErrors[field]);
      if (firstInvalidField) {
        document.getElementById(`merchant-${firstInvalidField}`)?.focus();
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
      setFormData({ name: "", phone: "", category: "Food", city: "Bengaluru" });
    }, 600);
  };

  return (
    <section id="grow" className="py-16 sm:py-24 bg-surface-subtle scroll-mt-20">
      <Container>
        <div className="rounded-3xl bg-gradient-to-br from-primary via-primary-hover to-[#4A247A] p-8 sm:p-12 lg:p-16 text-white shadow-card relative overflow-hidden">
          {/* Subtle decorative glow */}
          <div
            className="absolute -right-20 -bottom-20 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none"
            aria-hidden="true"
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center relative z-10">
            {/* Left Content */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-semibold backdrop-blur-xs mb-4">
                <Store className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
                <span>Grow with Meelte • For Neighborhood Merchants</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
                Connect directly with nearby customers. Zero commission.
              </h2>

              <p className="mt-4 text-base sm:text-lg text-white/90 leading-relaxed max-w-xl">
                Global delivery platforms take up to 30% of your margins. Meelte puts neighborhood shops, home bakers, tailors, and clinic owners in direct touch with local residents.
              </p>

              {/* Value list */}
              <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {VALUE_PROPS.map((prop) => (
                  <div key={prop} className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-accent shrink-0 mt-0.5" aria-hidden="true" />
                    <span className="text-xs sm:text-sm text-white/90 leading-snug">{prop}</span>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <Dialog.Root open={modalOpen} onOpenChange={handleModalOpenChange}>
                  <Dialog.Trigger asChild>
                    <Button
                      variant="accent"
                      size="lg"
                      className="shadow-soft hover:shadow-card font-bold text-accent-foreground"
                    >
                      <Store className="h-4 w-4" aria-hidden="true" />
                      <span>Promote Your Business</span>
                    </Button>
                  </Dialog.Trigger>

                  <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs" />
                    <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md bg-surface p-6 sm:p-8 rounded-2xl shadow-2xl border border-border text-foreground focus:outline-none">
                      <Dialog.Title className="text-xl sm:text-2xl font-bold tracking-tight">
                        Promote Your Local Business
                      </Dialog.Title>
                      <Dialog.Description className="mt-2 text-xs sm:text-sm text-foreground-secondary leading-relaxed">
                        List your store, clinic, or service on Meelte. Reach nearby residents without commission fees.
                      </Dialog.Description>

                      <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3.5" noValidate>
                        <div>
                          <label htmlFor="merchant-name" className="block text-xs font-semibold text-foreground mb-1">
                            Business or Shop Name *
                          </label>
                          <input
                            id="merchant-name"
                            type="text"
                            required
                            placeholder="e.g. Anand Sweet Corner, Royal Tailors"
                            value={formData.name}
                            onChange={(e) => {
                              setFormData({ ...formData, name: e.target.value });
                              if (errors.name) setErrors({ ...errors, name: "" });
                            }}
                            className={`w-full px-3.5 py-2.5 rounded-xl border bg-surface text-sm text-foreground placeholder:text-foreground-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
                              errors.name ? "border-error" : "border-border"
                            }`}
                            aria-invalid={errors.name ? "true" : "false"}
                            aria-describedby={errors.name ? "merchant-name-error" : undefined}
                          />
                          {errors.name && (
                            <p id="merchant-name-error" className="mt-1 text-xs text-error">
                              {errors.name}
                            </p>
                          )}
                        </div>

                        <div>
                          <label htmlFor="merchant-phone" className="block text-xs font-semibold text-foreground mb-1">
                            Contact Phone Number *
                          </label>
                          <input
                            id="merchant-phone"
                            type="tel"
                            required
                            autoComplete="tel"
                            placeholder="+91 98765 43210"
                            value={formData.phone}
                            onChange={(e) => {
                              setFormData({ ...formData, phone: e.target.value });
                              if (errors.phone) setErrors({ ...errors, phone: "" });
                            }}
                            className={`w-full px-3.5 py-2.5 rounded-xl border bg-surface text-sm text-foreground placeholder:text-foreground-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
                              errors.phone ? "border-error" : "border-border"
                            }`}
                            aria-invalid={errors.phone ? "true" : "false"}
                            aria-describedby={errors.phone ? "merchant-phone-error" : undefined}
                          />
                          {errors.phone && (
                            <p id="merchant-phone-error" className="mt-1 text-xs text-error">
                              {errors.phone}
                            </p>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label htmlFor="merchant-category" className="block text-xs font-semibold text-foreground mb-1">
                              Category
                            </label>
                            <select
                              id="merchant-category"
                              value={formData.category}
                              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                              className="w-full px-3 py-2.5 rounded-xl border border-border bg-surface text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                            >
                              <option value="Food">Food & Dining</option>
                              <option value="Fashion">Fashion & Boutique</option>
                              <option value="Events">Events & Venues</option>
                              <option value="Services">Local Services</option>
                              <option value="Health">Health & Wellness</option>
                            </select>
                          </div>
                          <div>
                            <label htmlFor="merchant-city" className="block text-xs font-semibold text-foreground mb-1">
                              City
                            </label>
                            <select
                              id="merchant-city"
                              value={formData.city}
                              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                              className="w-full px-3 py-2.5 rounded-xl border border-border bg-surface text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                            >
                              <option value="Bengaluru">Bengaluru</option>
                              <option value="Gaya">Gaya</option>
                              <option value="Ranchi">Ranchi</option>
                              <option value="Other">Other City</option>
                            </select>
                          </div>
                        </div>

                        <div className="mt-2 flex gap-3">
                          <Button
                            type="submit"
                            variant="primary"
                            size="md"
                            disabled={submitting}
                            className="flex-1 justify-center"
                          >
                            <Send className="h-4 w-4" aria-hidden="true" />
                            <span>{submitting ? "Submitting..." : "Send Free Listing Request"}</span>
                          </Button>
                          <Dialog.Close asChild>
                            <Button type="button" variant="outline" size="md">
                              Cancel
                            </Button>
                          </Dialog.Close>
                        </div>
                      </form>
                    </Dialog.Content>
                  </Dialog.Portal>
                </Dialog.Root>

                <a
                  href={`mailto:${SUPPORT_EMAIL}?subject=Merchant%20Listing%20Enquiry`}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-semibold transition-colors duration-150 backdrop-blur-xs border border-white/20"
                >
                  <Mail className="h-4 w-4" aria-hidden="true" />
                  <span>Email Merchant Desk</span>
                </a>
              </div>
            </div>

            {/* Right: 3-Step Pathway Cards */}
            <div className="lg:col-span-5 flex flex-col gap-3.5">
              {STEPS.map((step) => (
                <div
                  key={step.step}
                  className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-white flex items-start gap-4"
                >
                  <span className="font-mono text-xl font-extrabold text-accent shrink-0">
                    {step.step}
                  </span>
                  <div>
                    <h3 className="font-bold text-base tracking-tight leading-snug">
                      {step.title}
                    </h3>
                    <p className="mt-1 text-xs text-white/80 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default MerchantCTA;
