import React from "react";
import {
  ShieldCheck,
  Lock,
  UserCheck,
  HeartHandshake,
  MapPin,
  Mail,
  Phone,
  Sparkles,
  Download,
  Building2,
} from "@/lib/icons";
import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import { SUPPORT_EMAIL, HR_EMAIL, PLAY_STORE_URL } from "@/config/site";

const PILLARS_OF_TRUST = [
  {
    icon: Lock,
    title: "On-Device Location Privacy",
    guarantee: "100% Uncompromised",
    description:
      "Your coordinates are computed locally on your device to display nearby listings. We do not store movement history, build tracking profiles, or sell location data to third-party ad brokers.",
  },
  {
    icon: HeartHandshake,
    title: "Zero Commission Philosophy",
    guarantee: "0% Revenue Cut",
    description:
      "We believe neighborhood merchants and service professionals should keep every rupee they earn. Meelte does not deduct percentage fees on walk-ins, inquiries, or local trade.",
  },
  {
    icon: UserCheck,
    title: "Community Moderation",
    guarantee: "Spam & Scam Free",
    description:
      "All listings, events, and job postings are reviewed under clear community guidelines. Inappropriate content, abusive behavior, and fake accounts are removed promptly.",
  },
  {
    icon: Building2,
    title: "Verified Physical Presence",
    guarantee: "Authentic Local Hubs",
    description:
      "We focus deeply on real neighborhoods in Bengaluru, Gaya, and Ranchi rather than claiming superficial coverage. Every listed business has verified physical operations.",
  },
];

export function TrustCredibilitySection() {
  return (
    <section id="trust" className="py-16 sm:py-24 bg-surface scroll-mt-20 border-b border-border/80">
      <Container>
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <Badge variant="primary" className="mb-3 gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
            <span>Company Identity & Ethics</span>
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-[2.6rem] font-extrabold tracking-tight text-foreground leading-tight">
            Why Meelte exists: restoring neighborhood community and economic dignity.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-foreground-secondary leading-relaxed">
            In an era where massive tech platforms extract 30% from local merchants and turn personal privacy into an ad commodity, Meelte is built on transparent, community-first foundations.
          </p>
        </div>

        {/* 4 Trust Guarantee Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
          {PILLARS_OF_TRUST.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="p-6 rounded-3xl bg-canvas border border-border/80 shadow-2xs flex flex-col justify-between hover:border-primary/30 transition-all hover:shadow-soft"
              >
                <div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-surface-muted text-primary mb-4 shadow-2xs">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-primary block mb-1">
                    {item.guarantee}
                  </span>
                  <h3 className="font-bold text-base sm:text-lg text-foreground tracking-tight">
                    {item.title}
                  </h3>
                  <p className="mt-2.5 text-xs text-foreground-secondary leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-border/60 text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
                  <span>Institutional Commitment</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Company Identity & Transparency Banner */}
        <div className="p-8 sm:p-10 rounded-3xl bg-canvas border border-border/90 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="max-w-xl">
            <span className="text-xs font-bold text-primary uppercase tracking-wider block mb-1">
              Transparent Operations
            </span>
            <h4 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
              A company built for local India, based in Bengaluru.
            </h4>
            <p className="mt-2 text-xs sm:text-sm text-foreground-secondary leading-relaxed">
              We operate with open lines of communication for both community members and local business partners. For support, partnerships, or job openings, reach out directly.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-semibold text-foreground">
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="inline-flex items-center gap-1.5 text-primary hover:underline"
              >
                <Mail className="h-4 w-4" aria-hidden="true" />
                <span>{SUPPORT_EMAIL}</span>
              </a>
              <span className="text-foreground-muted">•</span>
              <a
                href={`mailto:${HR_EMAIL}`}
                className="inline-flex items-center gap-1.5 text-primary hover:underline"
              >
                <Building2 className="h-4 w-4" aria-hidden="true" />
                <span>{HR_EMAIL}</span>
              </a>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-surface border border-border/80 text-xs text-foreground-secondary flex flex-col gap-2 shrink-0 w-full sm:w-auto">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
              <span className="font-bold text-foreground">Active Operational Cities:</span>
            </div>
            <p className="font-medium text-primary">Bengaluru · Gaya · Ranchi</p>
            <p className="text-[11px] text-foreground-muted">Android Package: com.meelte.classico</p>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default TrustCredibilitySection;
