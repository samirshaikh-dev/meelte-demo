import React from "react";
import Link from "next/link";
import Image from "next/image";
import { QrCode, ShieldCheck } from "lucide-react";
import { Container } from "./container";
import { PLAY_STORE_URL, SOCIAL_LINKS } from "../../config/site";
import { NewsletterForm } from "../footer/newsletter-form";
import { StoreButton } from "../footer/store-button";
import { FooterColumn } from "../footer/footer-column";

const CURRENT_YEAR = 2026;

const DISCOVERY_LINKS = [
  { label: "Food & Cafes", href: "/discover" },
  { label: "Fashion & Boutiques", href: "/discover" },
  { label: "Community & Events", href: "/discover" },
  { label: "Home Services", href: "/discover" },
  { label: "Health & Wellness", href: "/discover" },
  { label: "Local Direct Jobs", href: "/jobs" },
];

const COMPANY_LINKS = [
  { label: "About Us", href: "/about" },
  { label: "Discover", href: "/discover" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "For Merchants", href: "/for-merchants" },
  { label: "Contact Us", href: "/contact" },
  { label: "Trust & Safety", href: "/#trust" },
  { label: "FAQ", href: "/#faq" },
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
        <div className="grid grid-cols-1 gap-10 pb-10 pt-10 sm:grid-cols-2 sm:gap-12 sm:pt-12 lg:grid-cols-12 lg:gap-12 lg:pt-14">
          <div className="flex flex-col gap-4 sm:col-span-2 lg:col-span-4">
            <Link href="/" className="flex items-center gap-2.5">
              <Image
                src="/icon_only_meelte.png"
                alt="Meelte"
                width={40}
                height={40}
                className="h-10 w-10 shrink-0 rounded-xl object-contain shadow-soft"
              />
              <Image
                src="/only_meelte.png"
                alt="Meelte wordmark"
                width={110}
                height={32}
                className="h-7 w-auto shrink-0 max-w-[110px] object-contain"
                style={{ letterSpacing: "-0.02em" }}
                priority={false}
              />
            </Link>

            <p className="max-w-sm text-sm leading-relaxed text-foreground-secondary">
              The hyperlocal community platform connecting neighbors with local businesses and opportunities.
              <br />
              Built for everyday discovery across India.
            </p>


            <div className="inline-flex w-fit items-center gap-2 rounded-xl border border-primary/10 bg-surface-muted px-3 py-1.5 text-xs font-semibold text-primary">
              <ShieldCheck className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
              <span>Location processed on-device • Never sold</span>
            </div>
          </div>

          <div className="sm:col-span-1 lg:col-span-2">
            <FooterColumn title="Discovery">
              <ul className="flex flex-col gap-2" role="list">
                {DISCOVERY_LINKS.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      className="inline-block rounded py-0.5 transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </FooterColumn>
          </div>

          <div className="sm:col-span-1 lg:col-span-2">
            <FooterColumn title="Company">
              <ul className="flex flex-col gap-2" role="list">
                {COMPANY_LINKS.map((item) => {
                  const isInternal = item.href.startsWith("/");
                  return (
                    <li key={item.label}>
                      {isInternal ? (
                        <Link
                          href={item.href}
                          className="inline-block rounded py-0.5 transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                        >
                          {item.label}
                        </Link>
                      ) : (
                        <a
                          href={item.href}
                          className="inline-block rounded py-0.5 transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                        >
                          {item.label}
                        </a>
                      )}
                    </li>
                  );
                })}
              </ul>
            </FooterColumn>
          </div>

          <div className="sm:col-span-2 lg:col-span-4">
            <div className="flex max-w-sm flex-col gap-6">
              <div className="flex flex-col gap-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
                  GET THE APP
                </h3>
                <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                  <StoreButton type="google" href={PLAY_STORE_URL} />
                  <StoreButton type="apple" href="#" />
                </div>
              </div>

              <NewsletterForm />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2.5 sm:gap-3 pb-6">
          {SOCIAL_LINKS.INSTAGRAM && (
            <a
              href={SOCIAL_LINKS.INSTAGRAM}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Meelte on Instagram"
              className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-border text-foreground-secondary hover:text-foreground hover:border-foreground/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
            >
              <span className="text-xs">IG</span>
            </a>
          )}
          {SOCIAL_LINKS.FACEBOOK && (
            <a
              href={SOCIAL_LINKS.FACEBOOK}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Meelte on Facebook"
              className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-border text-foreground-secondary hover:text-foreground hover:border-foreground/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
            >
              <span className="text-xs">FB</span>
            </a>
          )}
          {SOCIAL_LINKS.TWITTER && (
            <a
              href={SOCIAL_LINKS.TWITTER}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Meelte on Twitter"
              className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-border text-foreground-secondary hover:text-foreground hover:border-foreground/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
            >
              <span className="text-xs">X</span>
            </a>
          )}
          {SOCIAL_LINKS.LINKEDIN && (
            <a
              href={SOCIAL_LINKS.LINKEDIN}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Meelte on LinkedIn"
              className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-border text-foreground-secondary hover:text-foreground hover:border-foreground/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
            >
              <span className="text-xs">IN</span>
            </a>
          )}
          {SOCIAL_LINKS.YOUTUBE && (
            <a
              href={SOCIAL_LINKS.YOUTUBE}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Meelte on YouTube"
              className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-border text-foreground-secondary hover:text-foreground hover:border-foreground/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
            >
              <span className="text-xs">YT</span>
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
