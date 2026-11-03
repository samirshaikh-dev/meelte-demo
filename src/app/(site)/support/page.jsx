import React from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/layout/container";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Clock, Headphones, Mail, Phone } from "@/lib/icons";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { getBreadcrumbsJsonLd } from "@/lib/seo/structured-data";
import { SUPPORT_EMAIL } from "@/config/site";

const SUPPORT_BREADCRUMBS = [
  { name: "Home", path: "/" },
  { name: "Support", path: "/support" },
];

export const metadata = buildPageMetadata({
  title: "Support — meelTe",
  description:
    "Get in touch with our customer-friendly support team. We're here from 9AM–6PM IST, Monday–Friday.",
  path: "/support",
  keywords: [
    "meelTe support",
    "meelTe help",
    "meelTe customer service",
    "contact meelTe support",
  ],
});

export default function SupportPage() {
  return (
    <div className="flex min-h-screen flex-col bg-canvas text-foreground selection:bg-primary/20 selection:text-primary">
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

      {/* Centered Support Hero */}
      <main
        id="main-content"
        className="flex-1 flex items-center justify-center py-8 sm:py-12 lg:py-14"
      >
        <Container className="max-w-2xl">
          <div className="flex flex-col items-center text-center gap-6">
            <Breadcrumbs
              items={SUPPORT_BREADCRUMBS}
              listClassName="justify-center"
            />

            {/* Clean, authentic support badge */}
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-muted text-primary shadow-soft ring-1 ring-border/80">
              <Headphones className="h-8 w-8" aria-hidden="true" />
            </div>

            {/* Heading */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground leading-tight tracking-tight">
              Get in touch with meelTe support
            </h1>

            {/* Support details card */}
            <div className="w-full mt-2 rounded-2xl border border-border/80 bg-surface p-6 sm:p-7 shadow-soft text-left">
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="flex items-start gap-3.5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-muted text-primary">
                    <Clock className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-foreground-secondary uppercase tracking-wider">
                      Support Hours
                    </p>
                    <p className="mt-1 text-sm font-semibold text-foreground">
                      9:00 AM – 6:00 PM IST
                    </p>
                    <p className="text-xs text-foreground-secondary">
                      Monday to Friday
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-muted text-primary">
                    <Phone className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-foreground-secondary uppercase tracking-wider">
                      Direct Helpline
                    </p>
                    <a
                      href="tel:+918884524444"
                      className="mt-1 block text-sm font-semibold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 rounded"
                    >
                      +91-8884524444
                    </a>
                    <p className="text-xs text-foreground-secondary">
                      Toll-free within India
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Primary Action */}
            <div className="mt-2 flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              <Button
                as="a"
                href={`mailto:${SUPPORT_EMAIL}`}
                variant="primary"
                size="lg"
                className="w-full sm:w-auto px-8 font-semibold shadow-card"
              >
                <Mail className="h-4 w-4" aria-hidden="true" />
                <span>Email Support Team</span>
              </Button>

              <Button
                as="a"
                href="tel:+918884524444"
                variant="outline"
                size="lg"
                className="w-full sm:w-auto px-6 font-medium"
              >
                <Phone className="h-4 w-4 text-primary" aria-hidden="true" />
                <span>Call Helpline</span>
              </Button>
            </div>
          </div>
        </Container>
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
