import React from "react";
import Link from "next/link";
import {
  Building2,
  ExternalLink,
  HelpCircle,
  MapPin,
  ShieldCheck,
  ArrowRight,
} from "@/lib/icons";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CONTACT_OFFICE, CONTACT_PRIVACY } from "./contact-content";

export function ContactDetails() {
  return (
    <aside
      aria-labelledby="contact-office-heading"
      className="flex flex-col gap-5 lg:sticky lg:top-24 lg:self-start"
    >
      {/* Card 1: Registered Corporate Office */}
      <Card className="rounded-2xl border border-border/80 bg-surface p-5 sm:p-6 shadow-soft">
        <div className="flex items-start gap-3.5">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-surface-muted text-primary">
            <Building2 className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Corporate Office
            </span>
            <h2
              id="contact-office-heading"
              className="mt-0.5 text-base sm:text-lg font-bold text-foreground"
            >
              {CONTACT_OFFICE.title}
            </h2>
            <address className="mt-2 text-sm not-italic leading-relaxed text-foreground-secondary">
              <span className="font-semibold text-foreground">
                {CONTACT_OFFICE.company}
              </span>
              <br />
              {CONTACT_OFFICE.addressLines.map((line) => (
                <React.Fragment key={line}>
                  {line}
                  <br />
                </React.Fragment>
              ))}
            </address>
          </div>
        </div>

        <Button
          as="a"
          href={CONTACT_OFFICE.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          variant="outline"
          size="md"
          className="mt-5 w-full justify-center shadow-2xs font-medium"
        >
          <MapPin className="h-4 w-4 text-primary" aria-hidden="true" />
          <span>{CONTACT_OFFICE.mapLabel}</span>
          <ExternalLink className="h-3.5 w-3.5 text-foreground-secondary" aria-hidden="true" />
          <span className="sr-only"> (opens in a new tab)</span>
        </Button>
      </Card>

      {/* Card 2: Instant FAQ Shortcut */}
      <Card className="rounded-2xl border border-border/80 bg-surface p-5 sm:p-6 shadow-soft">
        <div className="flex items-start gap-3.5">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-surface-muted text-primary">
            <HelpCircle className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <h3 className="text-base font-bold text-foreground">
              Looking for quick answers?
            </h3>
            <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-foreground-secondary">
              Check out our FAQs below for instant answers regarding merchant listings, app features, and privacy.
            </p>
            <div className="mt-3">
              <a
                href="#contact-faq"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 rounded"
              >
                <span>Read support questions</span>
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </Card>

      {/* Card 3: Trust & Privacy Assurance */}
      <div className="flex items-start gap-3 rounded-2xl border border-primary/15 bg-surface-muted/60 p-4.5 text-xs sm:text-sm leading-relaxed text-foreground-secondary">
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
        <p>{CONTACT_PRIVACY}</p>
      </div>
    </aside>
  );
}

export default ContactDetails;
