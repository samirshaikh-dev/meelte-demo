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
import { Reveal } from "@/components/animations/reveal";

const PILLARS_OF_TRUST = [
  {
    icon: Lock,
    title: "Location Privacy",
    guarantee: "Never Sold",
    description:
      "Your location is used to sort what is near you and to decide which nearby city zone applies. We do not build movement histories, create tracking profiles, or sell location data to third-party ad brokers.",
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
    guarantee: "Moderated",
    description:
      "Ads, comments and events pass through community moderation. Inappropriate content, abusive behavior, and fake accounts are removed promptly.",
  },
  {
    icon: Building2,
    title: "In-Person Onboarding",
    guarantee: "Real Local Hubs",
    description:
      "Shops are signed up in person by Meelte's field team rather than self-declared online. We work city by city — Bengaluru, Gaya and Ranchi — instead of claiming coverage we do not have.",
  },
];

export function TrustCredibilitySection() {
  return (
    <section id="trust" className="py-16 sm:py-24 bg-surface scroll-mt-20 border-b border-border/80">
      <Container>
        {/* Section Header */}
        <Reveal className="max-w-3xl mb-12 sm:mb-16">
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
        </Reveal>

        {/* 4 Trust Guarantee Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
          {PILLARS_OF_TRUST.map((item, idx) => {
            const Icon = item.icon;
            return (
              <Reveal
                key={item.title}
                delay={0.05 + idx * 0.06}
                className="p-6 rounded-3xl bg-canvas border border-border/80 shadow-2xs flex flex-col justify-between hover:border-primary/30 transition-all hover:shadow-soft hover:-translate-y-[2px]"
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

              </Reveal>
            );
          })}
        </div>

        {/* Company Identity & Transparency Banner */}
        <Reveal delay={0.08}>
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
            </div>

            <div className="flex flex-col gap-3 shrink-0 w-full sm:w-auto sm:flex-row lg:flex-col">
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="inline-flex items-center gap-2 rounded-2xl bg-surface border border-border/80 shadow-2xs px-5 py-4 text-xs font-semibold text-primary hover:border-primary/30 hover:shadow-soft transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
              >
                <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{SUPPORT_EMAIL}</span>
              </a>
              <a
                href={`mailto:${HR_EMAIL}`}
                className="inline-flex items-center gap-2 rounded-2xl bg-surface border border-border/80 shadow-2xs px-5 py-4 text-xs font-semibold text-primary hover:border-primary/30 hover:shadow-soft transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
              >
                <Building2 className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{HR_EMAIL}</span>
              </a>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

export default TrustCredibilitySection;
