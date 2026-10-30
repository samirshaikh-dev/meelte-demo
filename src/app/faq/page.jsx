import React from "react";
import Link from "next/link";
import * as Accordion from "@radix-ui/react-accordion";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/layout/container";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { HelpCircle, ChevronDown, Mail, ArrowRight } from "@/lib/icons";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { getBreadcrumbsJsonLd, getFaqPageJsonLd } from "@/lib/seo/structured-data";
import { SUPPORT_EMAIL } from "@/config/site";
import faqData from "@/data/faq.json";

export const metadata = buildPageMetadata({
  title: "App, Offers & Events FAQ",
  description:
    "Answers about the Meelte Android app, nearby shop offers, community events, merchant listings, payments, privacy, safety, and current availability.",
  path: "/faq",
  keywords: [
    "Meelte FAQ",
    "Meelte app FAQs",
    "hyperlocal community app India",
    "local offers app",
    "local events app India",
    "Meelte Android app",
    "Meelte merchant listings",
    "Meelte privacy and payments",
  ],
});

const BREADCRUMB_ITEMS = [
  { name: "Home", path: "/" },
  { name: "FAQs", path: "/faq" },
];

export default function FaqPage() {
  const faqJsonLdItems = faqData.map((faq) => ({
    question: faq.question,
    answer: faq.answer,
  }));
  const jsonLd = [
    getBreadcrumbsJsonLd(BREADCRUMB_ITEMS),
    getFaqPageJsonLd(faqJsonLdItems),
  ].filter(Boolean);

  return (
    <div className="flex min-h-screen flex-col bg-canvas selection:bg-primary/20 selection:text-primary">
      {jsonLd.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}

      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2.5 focus:bg-primary focus:text-white focus:font-bold focus:rounded-xl focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-white"
      >
        Skip to main content
      </a>

      <Navbar />

      <main id="main-content" className="flex-1">
        <section className="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24 border-b border-border/80">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-canvas to-canvas" />

          <Container className="flex flex-col items-center text-center max-w-4xl">
            <Breadcrumbs
              items={BREADCRUMB_ITEMS}
              className="mb-4"
              listClassName="justify-center"
            />

            <Badge variant="primary" size="md" className="mb-5 shadow-2xs">
              <HelpCircle className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
              <span>Frequently Asked Questions</span>
            </Badge>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.15]">
              Meelte app FAQs:{" "}
              <span className="bg-gradient-to-r from-primary via-primary-hover to-accent bg-clip-text text-transparent">
                offers, events, and more
              </span>
            </h1>

            <p className="mt-5 text-lg sm:text-2xl font-medium text-foreground-secondary leading-relaxed max-w-2xl">
              Meelte is an Android app for discovering offers from nearby shops,
              local events, and community connections. Find direct answers about
              availability, merchant listings, payments, privacy, and safety.
            </p>
          </Container>
        </section>

        <section className="py-16 sm:py-24 bg-surface border-b border-border/80">
          <Container className="max-w-4xl">
            <Accordion.Root
              type="single"
              collapsible
              className="flex flex-col gap-3.5"
              defaultValue={faqData[0]?.id}
            >
              {faqData.map((faq) => (
                <Accordion.Item
                  key={faq.id}
                  value={faq.id}
                  className="rounded-3xl border border-border/80 bg-canvas/70 overflow-hidden shadow-2xs transition-all data-[state=open]:border-primary/40 data-[state=open]:bg-surface data-[state=open]:shadow-soft"
                >
                  <Accordion.Header className="flex">
                    <Accordion.Trigger className="flex flex-1 items-center justify-between p-5 sm:p-6 text-left font-bold text-base sm:text-lg text-foreground hover:text-primary transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 group">
                      <span className="pr-4">{faq.question}</span>
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-surface-muted text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                        <ChevronDown
                          className="h-4 w-4 transition-transform duration-200 ease-out group-data-[state=open]:rotate-180"
                          aria-hidden="true"
                        />
                      </div>
                    </Accordion.Trigger>
                  </Accordion.Header>
                  <Accordion.Content className="overflow-hidden px-5 sm:px-6 pb-5 sm:pb-6 text-sm sm:text-base text-foreground-secondary leading-relaxed data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
                    <div className="pt-2 border-t border-border/40">
                      <p>{faq.answer}</p>
                    </div>
                  </Accordion.Content>
                </Accordion.Item>
              ))}
            </Accordion.Root>
          </Container>
        </section>

        <section className="py-16 sm:py-24">
          <Container className="max-w-4xl">
            <Card className="p-8 sm:p-10 text-center shadow-card border-primary/20 bg-gradient-to-br from-primary/5 via-surface to-surface">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                Still have questions?
              </h2>
              <p className="mt-3 text-base sm:text-lg text-foreground-secondary leading-relaxed max-w-2xl mx-auto">
                Our team is happy to help. Reach out and we will get back to you as
                soon as we can.
              </p>
              <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                <Button
                  as="a"
                  href={`mailto:${SUPPORT_EMAIL}?subject=Meelte%20FAQ%20Inquiry`}
                  variant="primary"
                  size="lg"
                  className="shadow-soft"
                >
                  <Mail className="h-4 w-4" aria-hidden="true" />
                  <span>Contact Support</span>
                </Button>
                <Button as={Link} href="/contact" variant="outline" size="lg">
                  <span>Go to Contact Page</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
            </Card>
          </Container>
        </section>
      </main>

      <Footer />
    </div>
  );
}
