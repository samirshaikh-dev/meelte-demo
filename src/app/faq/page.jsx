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
import { ChevronDown, Mail, ArrowRight } from "@/lib/icons";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { getBreadcrumbsJsonLd, getFaqPageJsonLd } from "@/lib/seo/structured-data";
import { SUPPORT_EMAIL } from "@/config/site";
import faqData from "@/data/faq.json";

export const metadata = buildPageMetadata({
  title: "Meelte App FAQ: Downloads, Offers & Events",
  description:
    "Answers about the Meelte app on Google Play and the App Store: nearby shop offers, local events, merchant listings, payments, privacy and availability.",
  path: "/faq",
  keywords: [
    "Meelte FAQ",
    "Meelte app FAQs",
    "Meelte app download",
    "Meelte iPhone app",
    "hyperlocal community app India",
    "local offers app",
    "local events app India",
    "Meelte merchant listings",
    "Meelte privacy and payments",
  ],
});

const BREADCRUMB_ITEMS = [
  { name: "Home", path: "/" },
  { name: "FAQs", path: "/faq" },
];

const FAQ_CATEGORIES = [
  {
    id: "getting-started",
    title: "Getting started",
    questionIds: ["faq-1", "faq-5", "faq-7", "faq-17", "faq-18"],
  },
  {
    id: "offers-events",
    title: "Offers, events & payments",
    questionIds: ["faq-4", "faq-8", "faq-9", "faq-10", "faq-11", "faq-14", "faq-15", "faq-16"],
  },
  {
    id: "local-businesses",
    title: "For local businesses",
    questionIds: ["faq-3", "faq-21", "faq-22"],
  },
  {
    id: "privacy-safety-support",
    title: "Privacy, safety & support",
    questionIds: ["faq-2", "faq-12", "faq-13", "faq-19", "faq-20", "faq-23"],
  },
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
        <section className="border-b border-border/80 bg-surface">
          <Container className="max-w-6xl pb-12 pt-8 sm:pb-16 sm:pt-10">
            <Breadcrumbs items={BREADCRUMB_ITEMS} className="mb-10" />

            <div className="flex flex-col items-start gap-7 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-3xl">
                <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                  Meelte,{" "}
                  <span className="text-primary">explained clearly.</span>
                </h1>

                <p className="mt-5 max-w-2xl text-lg leading-relaxed text-foreground-secondary sm:text-xl">
                  Straightforward answers about the app, nearby discovery, local businesses,
                  events, privacy, and support.
                </p>
              </div>
            </div>
          </Container>
        </section>

        <section className="py-12 sm:py-16">
          <Container className="max-w-6xl">
            <div className="grid items-start gap-10 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-14">
              <aside
                id="faq-topics"
                aria-labelledby="faq-topics-heading"
                className="lg:sticky lg:top-28"
              >
                <h2
                  id="faq-topics-heading"
                  className="mb-4 text-sm font-bold uppercase tracking-[0.12em] text-foreground-secondary"
                >
                  Browse by topic
                </h2>
                <nav aria-label="FAQ topics">
                  <ul className="grid grid-cols-2 gap-2 lg:grid-cols-1">
                    {FAQ_CATEGORIES.map((category, index) => (
                      <li key={category.id}>
                        <a
                          href={`#${category.id}`}
                          className="flex min-h-12 items-center gap-3 rounded-xl border border-border/80 bg-surface px-3 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-primary/40 hover:bg-surface-subtle hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2"
                        >
                          <span className="text-xs font-bold text-primary" aria-hidden="true">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <span>{category.title}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              </aside>

              <div className="flex min-w-0 flex-col gap-10 sm:gap-12">
                {FAQ_CATEGORIES.map((category, categoryIndex) => {
                  const questions = category.questionIds
                    .map((questionId) => faqData.find((faq) => faq.id === questionId))
                    .filter(Boolean);

                  return (
                    <section
                      key={category.id}
                      id={category.id}
                      aria-labelledby={`${category.id}-heading`}
                      className="scroll-mt-28"
                    >
                      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
                        <div>
                          <p className="mb-1 text-xs font-bold uppercase tracking-[0.12em] text-primary">
                            Topic {String(categoryIndex + 1).padStart(2, "0")}
                          </p>
                          <h2
                            id={`${category.id}-heading`}
                            className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl"
                          >
                            {category.title}
                          </h2>
                        </div>
                        <span className="text-sm text-foreground-secondary">
                          {questions.length} questions
                        </span>
                      </div>

                      <Accordion.Root
                        type="single"
                        collapsible
                        defaultValue={categoryIndex === 0 ? questions[0]?.id : undefined}
                        className="divide-y divide-border/70 rounded-2xl border border-border/80 bg-surface px-4 shadow-soft sm:px-5"
                      >
                        {questions.map((faq) => (
                          <Accordion.Item key={faq.id} value={faq.id}>
                            <Accordion.Header className="flex">
                              <Accordion.Trigger className="group flex min-h-16 w-full items-center justify-between gap-4 py-4 text-left text-base font-bold text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 sm:text-lg">
                                <span>{faq.question}</span>
                                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-muted text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                                  <ChevronDown
                                    className="h-4 w-4 transition-transform duration-200 ease-out group-data-[state=open]:rotate-180"
                                    aria-hidden="true"
                                  />
                                </span>
                              </Accordion.Trigger>
                            </Accordion.Header>
                            {/* Keep answers in prerendered HTML so the FAQPage schema
                                continues to match the content available to crawlers. */}
                            <Accordion.Content
                              forceMount
                              className="overflow-hidden text-sm leading-relaxed text-foreground-secondary data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up sm:text-base"
                            >
                              <p className="pb-5 pr-2 sm:pb-6 sm:pr-12">{faq.answer}</p>
                            </Accordion.Content>
                          </Accordion.Item>
                        ))}
                      </Accordion.Root>
                    </section>
                  );
                })}
              </div>
            </div>
          </Container>
        </section>

        <section className="pb-16 sm:pb-20">
          <Container className="max-w-6xl">
            <Card className="flex flex-col gap-7 border-primary/20 bg-gradient-to-br from-primary/5 via-surface to-surface p-7 shadow-card sm:flex-row sm:items-center sm:justify-between sm:p-9">
              <div className="max-w-xl">
                <p className="mb-2 text-sm font-bold uppercase tracking-[0.12em] text-primary">
                  Need a hand?
                </p>
                <h2 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                  Still have a question?
                </h2>
                <p className="mt-3 text-base leading-relaxed text-foreground-secondary">
                  Our team can help with app support, account questions, or general enquiries.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  as="a"
                  href={`mailto:${SUPPORT_EMAIL}?subject=Meelte%20FAQ%20Inquiry`}
                  variant="primary"
                  size="md"
                  className="shadow-soft"
                >
                  <Mail className="h-4 w-4" aria-hidden="true" />
                  <span>Contact Support</span>
                </Button>
                <Button as={Link} href="/contact" variant="outline" size="md">
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
