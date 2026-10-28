import React from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/layout/container";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Button } from "@/components/ui/button";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { getBreadcrumbsJsonLd } from "@/lib/seo/structured-data";
import { SUPPORT_EMAIL } from "@/config/site";

const SUPPORT_BREADCRUMBS = [
  { name: "Home", path: "/" },
  { name: "Support", path: "/support" },
];

export const metadata = buildPageMetadata({
  title: "Support — Meelte",
  description:
    "Get in touch with our customer-friendly support team. We're here from 9AM–6PM IST, Monday–Friday.",
  path: "/support",
  keywords: [
    "Meelte support",
    "Meelte help",
    "Meelte customer service",
    "contact Meelte support",
  ],
});

export default function SupportPage() {
  return (
    <div className="flex min-h-screen flex-col bg-surface text-foreground selection:bg-primary/20 selection:text-primary">
      {/* Breadcrumb Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getBreadcrumbsJsonLd(SUPPORT_BREADCRUMBS)),
        }}
      />

      {/* Accessible Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2.5 focus:bg-primary focus:text-white focus:font-bold focus:rounded-xl focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-white"
      >
        Skip to main content
      </a>

      {/* Global Navbar */}
      <Navbar />

      {/* Centered Support Hero — full flex height like the reference image */}
      <main
        id="main-content"
        className="flex-1 flex items-center justify-center py-16 sm:py-24"
      >
        <Container className="max-w-2xl">
          <div className="flex flex-col items-center text-center gap-6">
            <Breadcrumbs
              items={SUPPORT_BREADCRUMBS}
              listClassName="justify-center"
            />

            {/* Support Illustration */}
            <div className="relative flex items-center justify-center w-56 h-56 sm:w-72 sm:h-72 select-none" aria-hidden="true">
              {/* Soft background blob */}
              <div className="absolute inset-0 rounded-full bg-blue-50" />

              {/* Decorative message bubbles */}
              <div className="absolute top-6 right-8 flex flex-col gap-1">
                <div className="w-20 h-3 rounded-full bg-primary/30" />
                <div className="w-14 h-3 rounded-full bg-primary/20" />
                <div className="w-16 h-3 rounded-full bg-primary/25" />
              </div>
              <div className="absolute top-10 left-6 w-8 h-8 rounded-xl bg-white border border-border shadow-soft flex items-center justify-center text-foreground-muted text-xs font-bold">
                ···
              </div>

              {/* Central support agent icon */}
              <div className="relative z-10 flex flex-col items-center gap-1">
                <div className="text-7xl sm:text-8xl">🧑‍💻</div>
                <div className="flex items-center gap-1.5 mt-1">
                  {/* Notification dots */}
                  <div className="w-6 h-6 rounded-lg bg-red-400 text-white text-[10px] flex items-center justify-center font-bold shadow">✉</div>
                  <div className="w-6 h-6 rounded-lg bg-primary text-white text-[10px] flex items-center justify-center shadow">💬</div>
                </div>
              </div>

              {/* Decorative reply bubble on the right */}
              <div className="absolute bottom-12 right-4 bg-primary rounded-2xl rounded-br-none px-3 py-1.5 shadow-soft">
                <div className="flex flex-col gap-1">
                  <div className="w-16 h-2 rounded-full bg-white/70" />
                  <div className="w-10 h-2 rounded-full bg-white/50" />
                </div>
              </div>
            </div>

            {/* Heading */}
            <h1 className="text-2xl sm:text-4xl font-bold text-foreground leading-tight tracking-tight">
              Get in touch with our customer-friendly support team
            </h1>

            {/* Availability */}
            <p className="text-sm sm:text-base text-foreground-secondary">
              Our team is here from 9AM–6PM IST, Monday–Friday
            </p>

            {/* Primary CTA — matches the reference's "Send email" pill button */}
            <Button
              as="a"
              href={`mailto:${SUPPORT_EMAIL}`}
              variant="primary"
              size="pill"
              className="mt-2 shadow-soft px-8"
            >
              Send email
            </Button>

            {/* Secondary: phone */}
            <a
              href="tel:+918884524444"
              className="text-sm text-foreground-secondary hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded"
            >
              Or call us at{" "}
              <span className="font-semibold text-foreground">+91-8884524444</span>
            </a>
          </div>
        </Container>
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}

