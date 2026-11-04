import React from "react";
import {
  Building2,
  ExternalLink,
  HelpCircle,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  ArrowRight,
} from "@/lib/icons";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CONTACT_CHANNELS,
  CONTACT_DIRECT,
  CONTACT_OFFICE,
  CONTACT_PRIVACY,
} from "./contact-content";

export function ContactDetails() {
  return (
    <aside
      aria-labelledby="contact-details-heading"
      className="flex flex-col gap-5 lg:sticky lg:top-24 lg:self-start"
    >
      {/* Unified Direct Channels & Office Card */}
      <Card className="rounded-2xl border border-border/80 bg-surface p-6 sm:p-7 shadow-soft">
        <div className="border-b border-border/80 pb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">
            Direct Communication
          </span>
          <h2
            id="contact-details-heading"
            className="mt-1 text-xl sm:text-2xl font-bold tracking-tight text-foreground"
          >
            Reach us directly
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm text-foreground-secondary leading-relaxed">
            Need prompt support or have urgent questions? Connect through our direct channels.
          </p>
        </div>

        {/* Channel 1: Customer Support Email */}
        <div className="pt-5 flex items-start gap-3.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-muted text-primary">
            <Mail className="h-5 w-5" aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-bold text-foreground">
              Customer Support
            </h3>
            <div className="mt-2">
              <a
                href={CONTACT_CHANNELS.emailHref}
                className="text-sm font-bold text-primary hover:underline inline-flex items-center gap-1.5 break-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 rounded"
              >
                <span>{CONTACT_CHANNELS.email}</span>
                <ArrowRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              </a>
            </div>
            <span className="mt-1 block text-xs text-foreground-secondary font-medium">
              {CONTACT_DIRECT.hours}
            </span>
          </div>
        </div>

        {/* Channel 2: Direct Helpline Phone */}
        <div className="mt-5 pt-5 border-t border-border/70 flex items-start gap-3.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-muted text-primary">
            <Phone className="h-5 w-5" aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-bold text-foreground">
              Direct Helpline
            </h3>
            <div className="mt-2">
              <a
                href={CONTACT_CHANNELS.phoneHref}
                className="text-sm font-bold text-primary hover:underline inline-flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 rounded"
              >
                <span>{CONTACT_CHANNELS.phoneDisplay}</span>
                <ArrowRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              </a>
            </div>
            <span className="mt-1 block text-xs text-foreground-secondary font-medium">
              {CONTACT_DIRECT.hours}
            </span>
          </div>
        </div>

        {/* Channel 3: Corporate Office */}
        <div className="mt-5 pt-5 border-t border-border/70">
          <div className="flex items-start gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-muted text-primary">
              <Building2 className="h-5 w-5" aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-bold text-foreground">
                {CONTACT_OFFICE.title}
              </h3>
              <address className="mt-1.5 text-xs sm:text-sm not-italic leading-relaxed text-foreground-secondary">
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
            className="mt-4 w-full justify-center shadow-2xs font-medium text-xs sm:text-sm"
          >
            <MapPin className="h-4 w-4 text-primary" aria-hidden="true" />
            <span>{CONTACT_OFFICE.mapLabel}</span>
            <ExternalLink className="h-3.5 w-3.5 text-foreground-secondary" aria-hidden="true" />
            <span className="sr-only"> (opens in a new tab)</span>
          </Button>
        </div>
      </Card>

      {/* Quick Self-Serve FAQ Card & Privacy Assurance */}
      <div className="flex flex-col gap-3">
        <a
          href="#contact-faq"
          className="group flex items-center justify-between rounded-2xl border border-border/80 bg-surface p-4 shadow-soft transition-all hover:border-primary/40 hover:shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-muted text-primary">
              <HelpCircle className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <span className="block text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                Looking for quick answers?
              </span>
              <span className="block text-xs text-foreground-secondary">
                Read support &amp; merchant FAQs below
              </span>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-foreground-secondary group-hover:text-primary group-hover:translate-x-0.5 transition-all" aria-hidden="true" />
        </a>

      </div>
    </aside>
  );
}

export default ContactDetails;
