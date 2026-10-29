"use client";

import React, { useEffect, useRef, useState } from "react";
import { TOAST_COPY, TOAST_ID, notifyError, notifyInfo } from "@/lib/toast-feedback";
import { Container } from "@/components/layout/container";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Building2,
} from "@/lib/icons";
import {
  SUPPORT_EMAIL,
  CONTACT_PHONE,
} from "@/config/site";

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

/** Validation order matches visual order, so focus lands on the first thing needing attention. */
const FIELD_ORDER = ["name", "email", "city", "message"];

/**
 * Compose a mailto: link from the form values.
 *
 * There is no contact endpoint yet (AI_RULE.md §2.1), so the form opens the user's own
 * mail client with the message pre-filled. That is a real delivery path; pretending the
 * message was received is not.
 */
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

export function ContactClient() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    topic: "General Inquiry",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const successHeadingRef = useRef(null);

  // The form is replaced by the confirmation panel, so the previously focused submit button
  // disappears. Move focus to the confirmation heading so keyboard and screen reader users are
  // told the submission succeeded (single announcement — no duplicate success toast).
  useEffect(() => {
    if (isSubmitted) {
      successHeadingRef.current?.focus();
    }
  }, [isSubmitted]);

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

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation errors announce once via the toast live region, then move focus to the
    // first invalid field (accessibility-engineer: announce + focus, never announce silently).
    const nextErrors = validate();

    if (nextErrors) {
      notifyError(TOAST_COPY.contactValidation, { id: TOAST_ID.contact });
      const firstInvalidField = FIELD_ORDER.find((field) => nextErrors[field]);
      if (firstInvalidField) {
        document.getElementById(firstInvalidField)?.focus();
      }
      return;
    }

    setIsSubmitting(true);

    // No backend endpoint is provisioned yet (AI_RULE.md §2.1), so the form hands the
    // message to the user's mail client instead of claiming it was delivered.
    // See `getMailtoHref` below for the composed link.
    window.location.href = getMailtoHref(formData);

    notifyInfo(TOAST_COPY.contactHandoff, {
      id: TOAST_ID.contact,
      description: TOAST_COPY.contactHandoffDescription(SUPPORT_EMAIL),
    });

    setIsSubmitting(false);
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
    // The success panel is replaced by the form, so re-anchor focus on the first field.
    setTimeout(() => document.getElementById("name")?.focus(), 0);
  };

  return (
    <div className="pb-10 sm:pb-14">
      {/* Main Content: Info & Interactive Form */}
      <section className="pt-0 pb-6 sm:pb-8">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-[0.4fr_0.6fr] gap-6 lg:gap-8 items-start">
            {/* Left Column: Customer Support, Registered Office, Operating Hours, Privacy Note */}
            <div className="flex flex-col gap-4">
              {/* Customer Support Card */}
              <Card className="p-5 sm:p-6 shadow-soft border-primary/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-xl bg-surface-muted text-primary flex items-center justify-center border border-primary/20">
                    <Mail className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-foreground">
                      Customer Support
                    </h2>
                    <span className="text-xs text-primary font-medium">Quick Assistance</span>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-foreground-secondary">
                  <div className="flex items-center gap-2">
                    <span className="text-foreground font-medium">Email:</span>
                    <a
                      href={`mailto:${SUPPORT_EMAIL}`}
                      className="text-primary hover:underline font-semibold"
                      aria-label={`Email ${SUPPORT_EMAIL}`}
                    >
                      {SUPPORT_EMAIL}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-foreground font-medium">Phone:</span>
                    <a
                      href={`tel:${CONTACT_PHONE_DISPLAY.replace(/[^+\d]/g, "")}`}
                      className="text-foreground hover:text-primary transition-colors font-semibold"
                      aria-label={`Call ${CONTACT_PHONE_DISPLAY}`}
                    >
                      {CONTACT_PHONE_DISPLAY}
                    </a>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-border/80 flex items-center gap-3">
                  <Button
                    as="a"
                    href={`mailto:${SUPPORT_EMAIL}`}
                    variant="primary"
                    size="sm"
                    className="flex-1 shadow-2xs justify-center"
                    aria-label="Email customer support"
                  >
                    <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Email us</span>
                  </Button>
                  <Button
                    as="a"
                    href={`tel:${CONTACT_PHONE_DISPLAY.replace(/[^+\d]/g, "")}`}
                    variant="outline"
                    size="sm"
                    className="flex-1 justify-center"
                    aria-label="Call customer support"
                  >
                    <Phone className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                    <span>Call us</span>
                  </Button>
                </div>
              </Card>

              {/* Registered Office Card */}
              <Card className="p-5 sm:p-6 shadow-soft">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-xl bg-surface-muted text-primary flex items-center justify-center border border-primary/20">
                    <Building2 className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-foreground">
                      Registered Office
                    </h2>
                    <span className="text-xs text-foreground-secondary">Official Headquarters</span>
                  </div>
                </div>

                <div className="text-sm text-foreground-secondary leading-relaxed space-y-1">
                  <p className="font-bold text-foreground">Meelte Private Limited</p>
                  <p>Pratistha, Ward No. 14</p>
                  <p>LIC Gali, Upadhyay Bigha</p>
                  <p>Sujata Bypass, Rajapur</p>
                  <p>Bodh Gaya, Bihar – 824231, India</p>
                </div>

                <div className="mt-4 pt-4 border-t border-border/80">
                  <Button
                    as="a"
                    href={GOOGLE_MAPS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="outline"
                    size="sm"
                    className="w-full justify-center gap-1.5"
                    aria-label="Open registered office location in Google Maps"
                  >
                    <MapPin className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                    <span>Open in Maps</span>
                    <ExternalLink className="h-3 w-3 text-foreground-muted" aria-hidden="true" />
                  </Button>
                </div>
              </Card>

              {/* Operating Hours Card */}
              <Card className="p-5 sm:p-6 shadow-soft">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 rounded-xl bg-surface-muted text-primary flex items-center justify-center border border-primary/20">
                    <Clock className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-foreground">
                    Operating Hours
                  </h2>
                </div>

                <ul className="text-sm text-foreground-secondary space-y-1">
                  <li><span className="text-foreground font-semibold">Monday – Friday</span></li>
                  <li><span className="text-foreground font-semibold">9:00 AM – 6:00 PM (IST)</span></li>
                </ul>
              </Card>

              {/* Privacy Note */}
              <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-surface-muted/60 text-xs sm:text-sm text-[#4B5563] border border-primary/10">
                <ShieldCheck className="h-4 w-4 text-primary shrink-0 mt-0.5" aria-hidden="true" />
                <span>
                  Your inquiry is used only for customer support. We never share your contact details with third parties or advertisers.
                </span>
              </div>
            </div>

            {/* Right Column: Send a Message Form */}
            <div>
              <Card className="p-6 sm:p-8 shadow-card flex flex-col">
                {isSubmitted ? (
                  <div className="py-10 text-center flex flex-col items-center flex-1 justify-center">
                    <div className="h-16 w-16 rounded-full bg-success/10 text-success flex items-center justify-center mb-5 border border-success/30">
                      <CheckCircle2 className="h-8 w-8" aria-hidden="true" />
                    </div>
                    <h2
                      ref={successHeadingRef}
                      tabIndex={-1}
                      className="text-2xl font-bold text-foreground focus:outline-none"
                    >
                      Message ready to send
                    </h2>
                    <p className="mt-2 text-sm text-foreground-secondary max-w-md leading-relaxed">
                      Your email app should have opened with the message. Send it to{" "}
                      <span className="font-semibold text-foreground">{SUPPORT_EMAIL}</span> and
                      we&apos;ll reply during our operating hours. Nothing reaches us until you
                      send it.
                    </p>
                    <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                      <Button
                        as="a"
                        href={getMailtoHref(formData)}
                        variant="primary"
                        size="md"
                        className="shadow-soft"
                        aria-label={`Open the message in your email app to send it to ${SUPPORT_EMAIL}`}
                      >
                        <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>Open email app again</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="md"
                        onClick={handleReset}
                        aria-label="Write another message"
                      >
                        Write another message
                      </Button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                        Send a Message
                      </h2>
                      <p className="mt-1 text-sm text-foreground-secondary">
                        Fill out the form below and we will respond as soon as possible.
                      </p>
                    </div>

                    {/* Topic / Category Selection */}
                    <div>
                      <label htmlFor="topic" className="block text-xs font-semibold text-foreground mb-1.5">
                        Inquiry Topic <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="topic"
                        value={formData.topic}
                        onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-surface text-foreground text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:border-primary/60 transition-all"
                        aria-label="Inquiry topic"
                      >
                        {TOPICS.map((topic) => (
                          <option key={topic} value={topic}>
                            {topic}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Name & Email Fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="name" className="block text-xs font-semibold text-foreground mb-1.5">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="name"
                          type="text"
                          placeholder="Your Name"
                          value={formData.name}
                          onChange={(e) => {
                            setFormData({ ...formData, name: e.target.value });
                            if (errors.name) setErrors({ ...errors, name: "" });
                          }}
                          className={`w-full px-3.5 py-2.5 rounded-xl border bg-surface text-foreground text-sm placeholder:text-foreground-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 transition-all ${
                            errors.name ? "border-error focus-visible:border-error" : "border-border focus-visible:border-primary/60"
                          }`}
                          aria-invalid={errors.name ? "true" : "false"}
                          aria-describedby={errors.name ? "name-error" : undefined}
                        />
                        {errors.name && (
                          <p id="name-error" className="mt-1 text-xs text-error">
                            {errors.name}
                          </p>
                        )}
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-xs font-semibold text-foreground mb-1.5">
                          Email Address <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="email"
                          type="email"
                          placeholder="you@example.com"
                          value={formData.email}
                          onChange={(e) => {
                            setFormData({ ...formData, email: e.target.value });
                            if (errors.email) setErrors({ ...errors, email: "" });
                          }}
                          className={`w-full px-3.5 py-2.5 rounded-xl border bg-surface text-foreground text-sm placeholder:text-foreground-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 transition-all ${
                            errors.email ? "border-error focus-visible:border-error" : "border-border focus-visible:border-primary/60"
                          }`}
                          aria-invalid={errors.email ? "true" : "false"}
                          aria-describedby={errors.email ? "email-error" : undefined}
                        />
                        {errors.email && (
                          <p id="email-error" className="mt-1 text-xs text-error">
                            {errors.email}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Phone & City */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="phone" className="block text-xs font-semibold text-foreground mb-1.5">
                          Phone Number <span className="text-foreground-muted font-normal">(Optional)</span>
                        </label>
                        <input
                          id="phone"
                          type="tel"
                          placeholder="+91 98765 43210"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-surface text-foreground text-sm placeholder:text-foreground-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:border-primary/60 transition-all"
                          aria-label="Phone number (optional)"
                        />
                      </div>
                      <div>
                        <label htmlFor="city" className="block text-xs font-semibold text-foreground mb-1.5">
                          City / Region <span className="text-red-500">*</span>
                        </label>
                        <select
                          id="city"
                          value={formData.city}
                          onChange={(e) => {
                            setFormData({ ...formData, city: e.target.value });
                            if (errors.city) setErrors({ ...errors, city: "" });
                          }}
                          className={`w-full px-3.5 py-2.5 rounded-xl border bg-surface text-foreground text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 transition-all ${
                            errors.city ? "border-error focus-visible:border-error" : "border-border focus-visible:border-primary/60"
                          }`}
                          aria-invalid={errors.city ? "true" : "false"}
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
                          <p id="city-error" className="mt-1 text-xs text-error">
                            {errors.city}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Message Area */}
                    <div>
                      <label htmlFor="message" className="block text-xs font-semibold text-foreground mb-1.5">
                        Your Message <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="message"
                        rows={4}
                        placeholder="Write your message here..."
                        value={formData.message}
                        onChange={(e) => {
                          setFormData({ ...formData, message: e.target.value });
                          if (errors.message) setErrors({ ...errors, message: "" });
                        }}
                        className={`w-full px-3.5 py-2.5 rounded-xl border bg-surface text-foreground text-sm placeholder:text-foreground-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 transition-all resize-y ${
                          errors.message ? "border-error focus-visible:border-error" : "border-border focus-visible:border-primary/60"
                        }`}
                        aria-invalid={errors.message ? "true" : "false"}
                        aria-describedby={errors.message ? "message-error" : undefined}
                      />
                      {errors.message && (
                        <p id="message-error" className="mt-1 text-xs text-error">
                          {errors.message}
                        </p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      disabled={isSubmitting}
                      className="mt-2 w-full justify-center shadow-soft"
                      aria-label="Submit contact message"
                    >
                      {isSubmitting ? (
                        <span>Sending message...</span>
                      ) : (
                        <>
                          <Send className="h-4 w-4" aria-hidden="true" />
                          <span>Submit Message</span>
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </Card>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}

export default ContactClient;
