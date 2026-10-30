import React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  InstagramIcon,
  FacebookIcon,
  XIcon,
  LinkedInIcon,
  YouTubeIcon,
} from "@/lib/icons";
import { PLATFORM_AREAS } from "@/constants/app-constants";
import { SOCIAL_LINKS } from "@/config/site";
import { Container } from "./container";
import { NewsletterForm } from "../footer/newsletter-form";
import { FooterColumn } from "../footer/footer-column";

const CURRENT_YEAR = 2026;

/** One link style for every footer column, so hover and focus never drift. */
const FOOTER_LINK_CLASS =
  "inline-block rounded py-0.5 transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2";

/**
 * "In the app" shortcuts.
 *
 * Derived from PLATFORM_AREAS — the three capabilities that exist in the product
 * (docs/target_customer.md §1) — so the footer can never drift from the /discover
 * section headings, the CollectionPage ItemList, or the hero copy (AI_RULE.md §2.3).
 *
 * Each href targets a section id that <DiscoverAreas> actually renders, so the
 * fragments resolve on the page instead of pointing at dead anchors.
 */
const IN_APP_LINKS = PLATFORM_AREAS.map((area) => ({
  label: area.name,
  href: `/discover#${area.anchor}`,
}));

/**
 * The three footer link columns, in reading order.
 *
 * Every href points at a route that exists (project-context.md §10 item 1 & 4);
 * `title` doubles as the column heading and the accessible name of its <nav>.
 */
const FOOTER_SECTIONS = [
  {
    id: "product",
    title: "Product",
    links: [
      { label: "Discover", href: "/discover" },
      { label: "How it works", href: "/how-it-works" },
      { label: "For Merchant", href: "/for-merchants" },
    ],
  },
  {
    id: "in-the-app",
    title: "In the app",
    links: IN_APP_LINKS,
  },
  {
    id: "company",
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Contact", href: "/contact" },
      { label: "FAQ", href: "/faq" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-border/80 bg-surface text-foreground">
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 select-none overflow-hidden"
        aria-hidden="true"
      >
        <div className="mx-auto w-full max-w-[2000px] px-4 sm:px-6 lg:px-8">
          <div className="relative h-[100px] sm:h-[140px] md:h-[180px] lg:h-[230px] xl:h-[290px] 2xl:h-[340px]">
            <span
              className="absolute bottom-[-12%] left-1/2 -translate-x-1/2 whitespace-nowrap font-extrabold leading-none tracking-tighter text-foreground/[0.03]"
              style={{
                fontSize: "clamp(6rem, 22vw, 26rem)",
                letterSpacing: "-0.04em",
              }}
            >
              Meelte
            </span>
          </div>
        </div>
      </div>

      <Container className="relative z-10">
        <div className="grid grid-cols-1 gap-10 pb-10 pt-10 sm:grid-cols-2 sm:gap-12 sm:pt-12 lg:grid-cols-12 lg:gap-8 lg:pt-14">
          <div className="flex flex-col gap-5 sm:col-span-2 lg:col-span-3">
            <p className="max-w-sm text-sm leading-relaxed text-foreground-secondary">
              The hyperlocal community platform connecting neighbors with local businesses and opportunities.
              Built for everyday discovery across India.
            </p>

            <div className="inline-flex w-fit items-center gap-2 rounded-xl border border-primary/10 bg-surface-muted px-3 py-1.5 text-xs font-semibold text-primary">
              <ShieldCheck className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
              <span>Location never sold or shared</span>
            </div>
          </div>

          {FOOTER_SECTIONS.map((section) => (
            <div key={section.id} className="sm:col-span-1 lg:col-span-2">
              <nav aria-label={section.title}>
                <FooterColumn title={section.title}>
                  <ul className="flex flex-col gap-2" role="list">
                    {section.links.map((link) => (
                      <li key={link.href}>
                        <Link href={link.href} className={FOOTER_LINK_CLASS}>
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </FooterColumn>
              </nav>
            </div>
          ))}

          <div className="sm:col-span-1 lg:col-span-3">
            <NewsletterForm />
          </div>
        </div>

        <div className="flex items-center justify-center gap-2.5 sm:gap-3 pb-6">
          {SOCIAL_LINKS.INSTAGRAM && (
            <a
              href={SOCIAL_LINKS.INSTAGRAM}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Meelte on Instagram"
              className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-border bg-surface text-foreground-secondary hover:text-foreground hover:border-foreground/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
            >
              <InstagramIcon className="h-4 w-4" />
            </a>
          )}
          {SOCIAL_LINKS.FACEBOOK && (
            <a
              href={SOCIAL_LINKS.FACEBOOK}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Meelte on Facebook"
              className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-border bg-surface text-foreground-secondary hover:text-foreground hover:border-foreground/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
            >
              <FacebookIcon className="h-4 w-4" />
            </a>
          )}
          {SOCIAL_LINKS.TWITTER && (
            <a
              href={SOCIAL_LINKS.TWITTER}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Meelte on Twitter"
              className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-border bg-surface text-foreground-secondary hover:text-foreground hover:border-foreground/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
            >
              <XIcon className="h-4 w-4" />
            </a>
          )}
          {SOCIAL_LINKS.LINKEDIN && (
            <a
              href={SOCIAL_LINKS.LINKEDIN}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Meelte on LinkedIn"
              className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-border bg-surface text-foreground-secondary hover:text-foreground hover:border-foreground/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
            >
              <LinkedInIcon className="h-4 w-4" />
            </a>
          )}
          {SOCIAL_LINKS.YOUTUBE && (
            <a
              href={SOCIAL_LINKS.YOUTUBE}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Meelte on YouTube"
              className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-border bg-surface text-foreground-secondary hover:text-foreground hover:border-foreground/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
            >
              <YouTubeIcon className="h-4 w-4" />
            </a>
          )}
        </div>

        <div className="pt-4 pb-8 sm:pb-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-foreground-secondary border-t border-border/60">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span>&copy; {CURRENT_YEAR} Meelte Technologies. All rights reserved.</span>
            <span className="text-foreground-muted">•</span>
            <span>Made for India</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/privacy"
              className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded"
            >
              Privacy Policy
            </Link>
            <span className="text-foreground-muted">•</span>
            <Link
              href="/terms"
              className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded"
            >
              Terms & Conditions
            </Link>
            <span className="text-foreground-muted">•</span>
            <Link
              href="/support"
              className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded"
            >
              Support Desk
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
