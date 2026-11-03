"use client";

import React, { useEffect, useRef, useState } from "react";
import { CheckCircle2, Mail, Send } from "@/lib/icons";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TOAST_COPY, TOAST_ID, notifyError, notifyInfo } from "@/lib/toast-feedback";
import {
  CONTACT_FIELD_LIMITS,
  MAX_MAILTO_LENGTH,
  validateContactForm,
} from "@/validation/contacts/contact-validation";
import { SUPPORT_EMAIL } from "@/config/site";
import { CONTACT_FIELDS, CONTACT_FORM } from "./contact-content";

/**
 * The /contact form — the only client component on this route.
 *
 * Moved here from `src/components/sections/contact/contact-client.jsx`, which
 * wrapped the whole aside in the client boundary purely to keep the form and its
 * neighbours in one file. The aside is now a server component
 * (`contact-details.jsx`), so this file is the only hydrated island.
 *
 * The behaviour is unchanged and deliberate: nothing is submitted anywhere. The
 * form validates, then hands a prepared `mailto:` to the visitor's own email app
 * and says so in the UI. There is no endpoint, no API route, and no success claim
 * beyond "your message is ready".
 *
 * Fixes applied while moving it:
 * - Field borders were `border-foreground-secondary/60` (≈2.86:1 against the card
 *   surface) and now use `/70` (≈3.58:1) to clear WCAG 1.4.11 for the input
 *   boundary.
 * - Placeholders were `text-foreground-secondary/70` and are now full-strength
 *   secondary text, which clears 4.5:1 — a placeholder is still text.
 * - Focus rings were `ring-primary/40` (≈1.96:1) on the field, the success heading
 *   and the inline email link; all now use `/70` (≈3.6:1), matching
 *   `src/components/ui/button.jsx`.
 * - `tracking-[0.16em]` is gone in favour of the token scale.
 * - A visible "Fields marked * are required" note was added, because the asterisk
 *   was previously carried only by `aria-hidden` text and colour.
 *
 * Errors, limits and their wording still come from
 * `src/validation/contacts/contact-validation.js`; this file owns presentation.
 */

const FIELD_ORDER = ["topic", "name", "email", "phone", "city", "message"];

const FIELD_BASE =
  "block w-full rounded-xl border bg-surface px-3.5 py-3 text-sm text-foreground placeholder:text-foreground-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2";

const FIELD_BY_ID = Object.fromEntries(
  CONTACT_FIELDS.map((field) => [field.id, field])
);

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
      {" "}
      *
    </span>
  );
}

/**
 * One labelled control, rendered from the `CONTACT_FIELDS` entry with the given
 * id. Ids stay exactly as they were, so `FIELD_ORDER`, the `*-error` describedby
 * targets and the focus-the-first-invalid-field lookup all keep working.
 */
function ContactField({ id, value, error, onChange }) {
  const config = FIELD_BY_ID[id];
  const errorId = `${config.id}-error`;
  const isTextarea = config.type === "textarea";

  const controlProps = {
    id: config.id,
    name: config.id,
    value,
    onChange: (event) => onChange(config.id, event.target.value),
    maxLength: CONTACT_FIELD_LIMITS[config.maxLengthKey],
    placeholder: config.placeholder,
    autoComplete: config.autoComplete,
    required: config.required,
    "aria-invalid": Boolean(error),
    "aria-describedby": error ? errorId : undefined,
    className: cn(
      FIELD_BASE,
      error
        ? "border-error focus-visible:border-error"
        : "border-foreground-secondary/70 focus-visible:border-primary",
      isTextarea && "min-h-32 resize-y"
    ),
  };

  return (
    <div>
      <label
        htmlFor={config.id}
        className="mb-1.5 block text-sm font-semibold text-foreground"
      >
        {config.label}
        {config.hint ? (
          <span className="ml-1 font-normal text-foreground-secondary">
            {config.hint}
          </span>
        ) : null}
        {config.required ? <RequiredMark /> : null}
      </label>

      {isTextarea ? (
        <textarea rows={5} {...controlProps} />
      ) : (
        <input type={config.type} {...controlProps} />
      )}

      {error ? (
        <p id={errorId} className="mt-1.5 text-sm text-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    topic: "",
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

  const handleSubmit = (event) => {
    event.preventDefault();

    const { values, errors: nextErrors } = validateContactForm(formData);
    if (
      Object.keys(nextErrors).length === 0 &&
      getMailtoHref(values).length > MAX_MAILTO_LENGTH
    ) {
      nextErrors.message = "Please shorten your message before continuing.";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      notifyError(TOAST_COPY.contactValidation, { id: TOAST_ID.contact });
      const firstInvalidField = FIELD_ORDER.find((field) => nextErrors[field]);
      if (firstInvalidField) {
        document.getElementById(firstInvalidField)?.focus();
      }
      return;
    }

    setFormData(values);
    window.location.href = getMailtoHref(values);
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
      topic: "",
      message: "",
    });
    setErrors({});
    setIsSubmitted(false);
    setTimeout(() => document.getElementById("name")?.focus(), 0);
  };

  return (
    <Card
      id="contact-form"
      className="scroll-mt-24 p-5 shadow-card sm:p-8 lg:p-9"
    >
      {isSubmitted ? (
        <div className="flex min-h-[26rem] flex-col items-center justify-center py-10 text-center">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-success/30 bg-success/10 text-success">
            <CheckCircle2 className="h-7 w-7" aria-hidden="true" />
          </div>
          <h2
            id="contact-form-heading"
            ref={successHeadingRef}
            tabIndex={-1}
            className="rounded-sm text-2xl font-bold tracking-tight text-foreground focus:outline-none focus:ring-2 focus:ring-primary/70 focus:ring-offset-4"
          >
            {CONTACT_FORM.successTitle}
          </h2>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-foreground-secondary">
            {CONTACT_FORM.successBodyBefore}{" "}
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="rounded font-semibold text-primary underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2"
            >
              {SUPPORT_EMAIL}
            </a>
            {CONTACT_FORM.successBodyAfter}
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Button as="a" href={getMailtoHref(formData)} variant="primary" size="md">
              <Mail className="h-4 w-4" aria-hidden="true" />
              {CONTACT_FORM.successOpenAgain}
            </Button>
            <Button variant="outline" size="md" onClick={handleReset}>
              {CONTACT_FORM.successReset}
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
          <div className="border-b border-border/80 pb-5">
            <p className="text-xs font-bold text-primary">
              {CONTACT_FORM.eyebrow}
            </p>
            <h2
              id="contact-form-heading"
              className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
            >
              {CONTACT_FORM.title}
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-foreground-secondary">
              {CONTACT_FORM.intro}
            </p>
            <p className="mt-3 text-xs leading-relaxed text-foreground-secondary">
              {CONTACT_FORM.requiredNote}
            </p>
          </div>

          <ContactField
            id="topic"
            value={formData.topic}
            error={errors.topic}
            onChange={updateField}
          />

          <div className="grid gap-5 sm:grid-cols-2">
            <ContactField
              id="name"
              value={formData.name}
              error={errors.name}
              onChange={updateField}
            />
            <ContactField
              id="email"
              value={formData.email}
              error={errors.email}
              onChange={updateField}
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <ContactField
              id="phone"
              value={formData.phone}
              error={errors.phone}
              onChange={updateField}
            />
            <ContactField
              id="city"
              value={formData.city}
              error={errors.city}
              onChange={updateField}
            />
          </div>

          <ContactField
            id="message"
            value={formData.message}
            error={errors.message}
            onChange={updateField}
          />

          <div className="flex flex-col gap-3 border-t border-border/80 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-md text-xs leading-relaxed text-foreground-secondary">
              {CONTACT_FORM.footerNote}
            </p>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full shrink-0 justify-center sm:w-auto"
            >
              <Send className="h-4 w-4" aria-hidden="true" />
              {CONTACT_FORM.submit}
            </Button>
          </div>
        </form>
      )}
    </Card>
  );
}

export default ContactForm;
