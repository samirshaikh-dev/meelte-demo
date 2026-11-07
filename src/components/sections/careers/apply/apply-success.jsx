"use client";

import React from "react";
import Link from "next/link";
import { CheckCircle2, ArrowRight, Clock, Mail, ShieldCheck } from "@/lib/icons";
import { Button } from "@/components/ui/button";

export function ApplySuccess({ jobTitle }) {
  return (
    <div className="rounded-2xl border border-success-border/60 bg-surface p-8 sm:p-12 shadow-soft text-center space-y-6">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-success-bg text-success border border-success-border shadow-2xs">
        <CheckCircle2 className="h-9 w-9 stroke-[2.2]" aria-hidden="true" />
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
          Application Received!
        </h2>
        <p className="text-sm sm:text-base text-foreground-secondary max-w-lg mx-auto">
          Thank you for applying for the <strong className="text-foreground">{jobTitle}</strong> position at meelTe. We have received your resume and details.
        </p>
      </div>

      {/* Next steps timeline box */}
      <div className="rounded-2xl border border-border/80 bg-surface-subtle p-6 max-w-xl mx-auto text-left space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-foreground">
          <Clock className="h-4 w-4 text-primary" aria-hidden="true" />
          <span>What to expect next</span>
        </div>

        <ul className="space-y-3 text-xs sm:text-sm text-foreground-secondary">
          <li className="flex items-start gap-2.5">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-surface-muted text-primary text-[11px] font-bold mt-0.5">
              1
            </span>
            <span>
              <strong className="text-foreground">Initial Screening:</strong> Our hiring team typically reviews applications within <strong className="text-foreground">3–5 business days</strong>.
            </span>
          </li>

          <li className="flex items-start gap-2.5">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-surface-muted text-primary text-[11px] font-bold mt-0.5">
              2
            </span>
            <span>
              <strong className="text-foreground">Next Steps:</strong> If your background matches what we are looking for, our talent team will reach out via email or phone to schedule an introductory conversation.
            </span>
          </li>

          <li className="flex items-start gap-2.5">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-surface-muted text-primary text-[11px] font-bold mt-0.5">
              3
            </span>
            <span>
              <strong className="text-foreground">Data Privacy:</strong> Your application data is stored securely and processed in strict adherence to our privacy guidelines.
            </span>
          </li>
        </ul>
      </div>

      <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
        <Button
          as={Link}
          href="/careers"
          variant="primary"
          size="md"
          className="gap-2 font-bold px-7 rounded-xl shadow-2xs h-11 text-xs sm:text-sm"
        >
          <span>Explore More Open Roles</span>
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}

export default ApplySuccess;
