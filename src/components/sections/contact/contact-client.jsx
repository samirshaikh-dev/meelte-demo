"use client";

import React, { useEffect, useRef, useState } from "react";
import { TOAST_COPY, TOAST_ID, notifyError, notifyInfo } from "@/lib/toast-feedback";
import { Container } from "@/components/layout/container";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Building2,
  CheckCircle2,
  Clock,
  ExternalLink,
  Mail,
  MapPin,
  Phone,
  Send,
  ShieldCheck,
} from "@/lib/icons";
import { CONTACT_PHONE, SUPPORT_EMAIL } from "@/config/site";

const GOOGLE_MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=Pratistha,+Ward+No.+14,+LIC+Gali,+Upadhyay+Bigha,+Sujata+Bypass,+Rajapur,+Bodh+Gaya,+Bihar+824231";

const TOPICS = [
  "General Inquiry",
  "Merchant/Business Onboarding",
  "Community Support & Feedback",
  "Event Partnerships & Meetups",
  "Careers & Hiring",
];

const CITIES = ["Bodh Gaya", "Gaya", "Bengaluru", "Ranchi", "Other City in India"];
const CONTACT_PHONE_DISPLAY = "+91 88845 24444";
const CONTACT_PHONE_HREF = CONTACT_PHONE.replace(/[^\d+]/g, "");
const FIELD_ORDER = ["name", "email", "city", "message"];
const FIELD_CLASS =
  "block w-full rounded-xl border bg-surface px-3.5 py-3 text-sm text-foreground placeholder:text-foreground-secondary/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2";

function getMailtoHref({ name, email, phone, city, topic, message }) {
  const subject = encodeURIComponent(`[${topic}] ${name} — ${city}`);
  const body = encodeURIComponent(
    [
      `Name: ${name}`,
      `Email: ${email}`,
      `Phone: ${phone || "—"}`,
      `City: ${city}`,
      `Topic: ${topic}`,
      "",
      message,
    ].join("\n")
  );
  return `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`;
}

function RequiredMark() {
  return (
    <span aria-hidden="true" className="text-error">
      {" "}*
    </span>
  );
}

export function ContactClient() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    topic: "General Inquiry",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const successHeadingRef = useRef(null);

  useEffect(() => {
    if (isSubmitted) {
      successHeadingRef.current?.focus();
    }
  }, [isSubmitted]);

  const updateField = (field, value) => {
    setFormData((current) => ({ ...current, [field]: value }));
    if (errors[field]) {
      setErrors((current) => ({ ...current, [field]: "" }));
    }
  };

  const getFieldClass = (field) =>
    `${FIELD_CLASS} ${
      errors[field]
        ? "border-error focus-visible:border-error"
        : "border-foreground-secondary/60 focus-visible:border-primary"
    }`;

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Please enter your full name.";
    if (!formData.email.trim()) {
      newErrors.email = "Please enter your email address.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (!formData.city) newErrors.city = "Please select your city or region.";
    if (!formData.message.trim()) newErrors.message = "Please enter your message.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0 ? null : newErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const nextErrors = validate();
    if (nextErrors) {
      notifyError(TOAST_COPY.contactValidation, { id: TOAST_ID.contact });
      const firstInvalidField = FIELD_ORDER.find((field) => nextErrors[field]);
      if (firstInvalidField) {
        document.getElementById(firstInvalidField)?.focus();
      }
      return;
    }

    window.location.href = getMailtoHref(formData);
    notifyInfo(TOAST_COPY.contactHandoff, {
      id: TOAST_ID.contact,
      description: TOAST_COPY.contactHandoffDescription(SUPPORT_EMAIL),
    });
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      city: "",
      topic: "General Inquiry",
      message: "",
    });
    setErrors({});
    setIsSubmitted(false);
    setTimeout(() => document.getElementById("name")?.focus(), 0);
  };

  return (
    <section id="contact-form" className="py-8 sm:py-12 lg:py-16">
      <Container className="max-w-6xl">
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(17rem,0.75fr)] lg:gap-8">
          <Card className="p-5 shadow-card sm:p-8 lg:p-9">
            {isSubmitted ? (
              <div className="flex min-h-[26rem] flex-col items-center justify-center py-10 text-center">
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-success/30 bg-success/10 text-success">
                  <CheckCircle2 className="h-7 w-7" aria-hidden="true" />
                </div>
                <h2
                  ref={successHeadingRef}
                  tabIndex={-1}
                  className="rounded-sm text-2xl font-bold tracking-tight text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-4"
                >
                  Your message is ready
                </h2>
                <p className="mt-3 max-w-lg text-sm leading-relaxed text-foreground-secondary">
                  Your email app should have opened with a prepared message. Review
                  it and press send to reach{" "}
                  <a
                    href={`mailto:${SUPPORT_EMAIL}`}
                    className="font-semibold text-primary underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
                  >
                    {SUPPORT_EMAIL}
                  </a>
                  . Nothing is sent until you do.
                </p>
                <div className="mt-7 flex flex-wrap justify-center gap-3">
                  <Button
                    as="a"
                    href={getMailtoHref(formData)}
                    variant="primary"
                    size="md"
                  >
                    <Mail className="h-4 w-4" aria-hidden="true" />
                    Open email app again
                  </Button>
                  <Button
                    variant="outline"
                    size="md"
                    onClick={handleReset}
                  >
                    Write another message
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
                <div className="border-b border-border/80 pb-5">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">
                    Send a message
                  </p>
                  <h2 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                    Tell us what you need
                  </h2>
                  <p className="mt-2 max-w-xl text-sm leading-relaxed text-foreground-secondary">
                    Share a few details and we&apos;ll prepare an email for you to
                    review and send.
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="topic"
                    className="mb-1.5 block text-sm font-semibold text-foreground"
                  >
                    What is this about?
                    <RequiredMark />
                  </label>
                  <select
                    id="topic"
                    value={formData.topic}
                    onChange={(event) => updateField("topic", event.target.value)}
                    className={`${FIELD_CLASS} border-foreground-secondary/60 focus-visible:border-primary`}
                    required
                  >
                    {TOPICS.map((topic) => (
                      <option key={topic} value={topic}>
                        {topic}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="name"
                      className="mb-1.5 block text-sm font-semibold text-foreground"
                    >
                      Full name
                      <RequiredMark />
                    </label>
                    <input
                      id="name"
                      type="text"
                      autoComplete="name"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={(event) => updateField("name", event.target.value)}
                      className={getFieldClass("name")}
                      aria-invalid={Boolean(errors.name)}
                      aria-describedby={errors.name ? "name-error" : undefined}
                      required
                    />
                    {errors.name && (
                      <p id="name-error" className="mt-1.5 text-sm text-error">
                        {errors.name}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-1.5 block text-sm font-semibold text-foreground"
                    >
                      Email address
                      <RequiredMark />
                    </label>
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={(event) => updateField("email", event.target.value)}
                      className={getFieldClass("email")}
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={errors.email ? "email-error" : undefined}
                      required
                    />
                    {errors.email && (
                      <p id="email-error" className="mt-1.5 text-sm text-error">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="phone"
                      className="mb-1.5 block text-sm font-semibold text-foreground"
                    >
                      Phone number{" "}
                      <span className="font-normal text-foreground-secondary">
                        (optional)
                      </span>
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      autoComplete="tel"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(event) => updateField("phone", event.target.value)}
                      className={`${FIELD_CLASS} border-foreground-secondary/60 focus-visible:border-primary`}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="city"
                      className="mb-1.5 block text-sm font-semibold text-foreground"
                    >
                      City or region
                      <RequiredMark />
                    </label>
                    <select
                      id="city"
                      value={formData.city}
                      onChange={(event) => updateField("city", event.target.value)}
                      className={getFieldClass("city")}
                      aria-invalid={Boolean(errors.city)}
                      aria-describedby={errors.city ? "city-error" : undefined}
                      required
                    >
                      <option value="" disabled>
                        Select your city
                      </option>
                      {CITIES.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                    {errors.city && (
                      <p id="city-error" className="mt-1.5 text-sm text-error">
                        {errors.city}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="mb-1.5 block text-sm font-semibold text-foreground"
                  >
                    Your message
                    <RequiredMark />
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    placeholder="How can we help?"
                    value={formData.message}
                    onChange={(event) => updateField("message", event.target.value)}
                    className={`${getFieldClass("message")} min-h-32 resize-y`}
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby={errors.message ? "message-error" : undefined}
                    required
                  />
                  {errors.message && (
                    <p id="message-error" className="mt-1.5 text-sm text-error">
                      {errors.message}
                    </p>
                  )}
                </div>

                <p className="text-xs leading-relaxed text-foreground-secondary">
                  The form opens a prepared email in your email app. Review it
                  there and press send; it isn&apos;t sent automatically.
                </p>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full justify-center sm:w-auto sm:self-start"
                >
                  <Send className="h-4 w-4" aria-hidden="true" />
                  Continue to email
                </Button>
              </form>
            )}
          </Card>

          <aside className="flex flex-col gap-5" aria-label="Other ways to contact Meelte">
            <section
              aria-labelledby="direct-contact-heading"
              className="rounded-2xl bg-primary p-6 text-white shadow-card sm:p-7"
            >
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/90">
                Prefer a direct route?
              </p>
              <h2
                id="direct-contact-heading"
                className="mt-2 text-2xl font-bold tracking-tight"
              >
                Contact support
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-white">
                For app help, account questions, privacy requests, or general
                enquiries.
              </p>

              <div className="mt-6 space-y-4">
                <a
                  href={`mailto:${SUPPORT_EMAIL}`}
                  className="flex min-w-0 items-center gap-3 rounded-xl border border-white/25 bg-white/10 p-3 text-sm font-semibold text-white underline-offset-4 hover:bg-white/15 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
                >
                  <Mail className="h-5 w-5 shrink-0" aria-hidden="true" />
                  <span className="break-all">{SUPPORT_EMAIL}</span>
                </a>
                <a
                  href={`tel:${CONTACT_PHONE_HREF}`}
                  className="flex items-center gap-3 rounded-xl border border-white/25 bg-white/10 p-3 text-sm font-semibold text-white underline-offset-4 hover:bg-white/15 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
                >
                  <Phone className="h-5 w-5 shrink-0" aria-hidden="true" />
                  <span>{CONTACT_PHONE_DISPLAY}</span>
                </a>
              </div>

              <div className="mt-6 border-t border-white/25 pt-5">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <Clock className="h-4 w-4" aria-hidden="true" />
                  Support hours
                </div>
                <p className="mt-2 text-sm leading-relaxed text-white">
                  Monday–Friday, 9:00 AM–6:00 PM IST
                </p>
              </div>
            </section>

            <Card className="p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-surface-muted text-primary">
                  <Building2 className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <h2 className="text-lg font-bold text-foreground">
                    Registered office
                  </h2>
                  <address className="mt-2 text-sm not-italic leading-relaxed text-foreground-secondary">
                    <span className="font-semibold text-foreground">
                      Meelte Private Limited
                    </span>
                    <br />
                    Pratistha, Ward No. 14, LIC Gali, Upadhyay Bigha,
                    <br />
                    Sujata Bypass, Rajapur, Bodh Gaya,
                    <br />
                    Bihar 824231, India
                  </address>
                </div>
              </div>
              <Button
                as="a"
                href={GOOGLE_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                variant="outline"
                size="md"
                className="mt-5 w-full justify-center"
                aria-label="Open Meelte's registered office in Google Maps"
              >
                <MapPin className="h-4 w-4 text-primary" aria-hidden="true" />
                View office in Maps
                <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              </Button>
            </Card>

            <div className="flex items-start gap-3 rounded-2xl border border-primary/10 bg-surface-muted/70 p-4 text-sm leading-relaxed text-foreground-secondary">
              <ShieldCheck
                className="mt-0.5 h-5 w-5 shrink-0 text-primary"
                aria-hidden="true"
              />
              <p>
                Contact details are used for customer support and aren&apos;t
                shared with third parties or advertisers.
              </p>
            </div>
          </aside>
        </div>
      </Container>
    </section>
  );
}

export default ContactClient;
