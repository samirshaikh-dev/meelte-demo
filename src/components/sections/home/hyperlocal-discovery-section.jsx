import React from "react";
import {
  MapPin,
  UtensilsCrossed,
  Shirt,
  CalendarDays,
  Wrench,
  HeartPulse,
  Briefcase,
  ArrowRight,
  Store,
  Compass,
} from "@/lib/icons";
import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import { PLAY_STORE_URL } from "@/config/site";

const ACTIVE_HUBS = [
  {
    city: "Bengaluru",
    state: "Karnataka",
    status: "Active Operational Hub",
    neighborhoods: [
      "Indiranagar",
      "Koramangala",
      "HSR Layout",
      "Whitefield",
      "Jayanagar",
      "BTM Layout",
      "Cubbon Park Zone",
    ],
    highlight: "Specialty coffee roasters, weekend running clubs & retail boutiques",
  },
  {
    city: "Gaya",
    state: "Bihar",
    status: "Active Regional Hub",
    neighborhoods: [
      "Town Center",
      "AP Colony",
      "Civil Lines",
      "Ramsagar",
      "Bodhgaya Zone",
    ],
    highlight: "Traditional sweets, local apparel stores & verified home service pros",
  },
  {
    city: "Ranchi",
    state: "Jharkhand",
    status: "Active Regional Hub",
    neighborhoods: [
      "Morabadi Ground",
      "Kanke Road",
      "Harmu Housing",
      "Main Road",
      "Lalpur",
    ],
    highlight: "Community workshops, healthcare clinics & neighborhood artisan tailors",
  },
];

const TAXONOMY_LINKS = [
  { name: "Local Dining & Bakeries", icon: UtensilsCrossed, href: "#discover", count: "Cafes & Food" },
  { name: "Regional Boutiques & Apparel", icon: Shirt, href: "#discover", count: "Fashion" },
  { name: "Neighborhood Meetups & Runs", icon: CalendarDays, href: "#discover", count: "Events" },
  { name: "Verified Electricians & Plumbers", icon: Wrench, href: "#discover", count: "Services" },
  { name: "Yoga Studios & Dental Clinics", icon: HeartPulse, href: "#discover", count: "Health" },
  { name: "Local Direct-Hire Jobs", icon: Briefcase, href: "#jobs", count: "Careers" },
];

export function HyperlocalDiscoverySection() {
  return (
    <section className="py-16 sm:py-24 bg-canvas scroll-mt-20 border-b border-border/80">
      <Container>
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <Badge variant="primary" className="mb-3 gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
            <span>Hyperlocal Coverage</span>
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-[2.6rem] font-extrabold tracking-tight text-foreground leading-tight">
            Discover verified offerings across our active city hubs.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-foreground-secondary leading-relaxed">
            Meelte concentrates deeply on real neighborhood clusters. Explore genuine local communities in Bengaluru, Gaya, and Ranchi with verified physical presence.
          </p>
        </div>

        {/* 3 Active City Hub Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
          {ACTIVE_HUBS.map((hub) => (
            <div
              key={hub.city}
              className="p-6 sm:p-7 rounded-3xl bg-surface border border-border/80 shadow-soft flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
                    <span className="font-extrabold text-xl text-foreground">{hub.city}</span>
                  </div>
                  <span className="text-[10px] font-bold text-primary bg-surface-muted px-2 py-0.5 rounded-full border border-primary/10">
                    {hub.state}
                  </span>
                </div>

                <p className="text-xs text-primary font-medium mb-4">
                  {hub.highlight}
                </p>

                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-foreground-secondary block mb-2">
                    Active Neighborhoods:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {hub.neighborhoods.map((n) => (
                      <span
                        key={n}
                        className="text-[11px] font-medium px-2 py-1 rounded-lg bg-canvas border border-border/70 text-foreground"
                      >
                        {n}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-border/60 flex items-center justify-between text-xs">
                <span className="text-emerald-700 font-semibold">{hub.status}</span>
                <a
                  href={PLAY_STORE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-primary hover:underline inline-flex items-center gap-1"
                >
                  <span>Explore {hub.city}</span>
                  <ArrowRight className="h-3 w-3" aria-hidden="true" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Category Discovery Navigation Matrix */}
        <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-border/80 shadow-soft">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/70 mb-6">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-foreground">
                Browse Neighborhood Directories
              </h3>
              <p className="text-xs sm:text-sm text-foreground-secondary mt-0.5">
                Explore real offerings by category with transparent merchant contacts
              </p>
            </div>
            <a
              href="#for-businesses"
              className="text-xs font-bold text-primary hover:underline flex items-center gap-1 self-start sm:self-auto"
            >
              <Store className="h-3.5 w-3.5" aria-hidden="true" />
              <span>List your business in these hubs →</span>
            </a>
          </div>

          <nav aria-label="Hyperlocal Discovery Categories">
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3" role="list">
              {TAXONOMY_LINKS.map((link) => {
                const Icon = link.icon;
                return (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="flex items-center justify-between p-3.5 rounded-2xl bg-canvas border border-border/70 hover:border-primary/40 hover:bg-surface-muted transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface text-primary shadow-2xs group-hover:bg-primary group-hover:text-white transition-colors">
                          <Icon className="h-4 w-4" aria-hidden="true" />
                        </div>
                        <span className="font-semibold text-xs sm:text-sm text-foreground group-hover:text-primary transition-colors">
                          {link.name}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-foreground-muted group-hover:text-primary">
                        {link.count}
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </Container>
    </section>
  );
}

export default HyperlocalDiscoverySection;
