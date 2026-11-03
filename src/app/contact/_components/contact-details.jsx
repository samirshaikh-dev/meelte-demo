import React from "react";
import { Building2, ExternalLink, MapPin, ShieldCheck } from "@/lib/icons";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CONTACT_OFFICE, CONTACT_PRIVACY } from "./contact-content";

export function ContactDetails() {
  return (
    <aside
      aria-labelledby="contact-office-heading"
      className="flex flex-col gap-5 lg:sticky lg:top-24 lg:self-start"
    >
      <Card className="p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-surface-muted text-primary">
            <Building2 className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <h2
              id="contact-office-heading"
              className="text-lg font-bold text-foreground"
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
          className="mt-5 w-full justify-center"
        >
          <MapPin className="h-4 w-4 text-primary" aria-hidden="true" />
          {CONTACT_OFFICE.mapLabel}
          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          <span className="sr-only"> (opens in a new tab)</span>
        </Button>
      </Card>

      <div className="flex items-start gap-3 rounded-2xl border border-primary/10 bg-surface-muted/70 p-4 text-sm leading-relaxed text-foreground-secondary">
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
        <p>{CONTACT_PRIVACY}</p>
      </div>
    </aside>
  );
}

export default ContactDetails;
