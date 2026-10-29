import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/layout/container";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Briefcase,
  HeartHandshake,
  Users,
  Sparkles,
  Mail,
  ArrowRight,
  CheckCircle2,
  Gift,
  Clock,
  Home,
  BookOpen,
  Zap,
  Globe,
  Coffee,
} from "@/lib/icons";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { getBreadcrumbsJsonLd } from "@/lib/seo/structured-data";
import { HR_EMAIL } from "@/config/site";

export const metadata = buildPageMetadata({
  title: "Careers at Meelte | Join Our Team",
  description:
    "Build with Meelte. We're a small, mission-driven team working to help people discover, connect, and grow in their neighborhoods across India.",
  path: "/careers",
  keywords: [
    "Meelte careers",
    "jobs at Meelte",
    "work at Meelte",
    "startup jobs India",
    "hyperlocal startup hiring",
    "community platform careers",
  ],
});

const BREADCRUMB_ITEMS = [
  { name: "Home", path: "/" },
  { name: "Careers", path: "/careers" },
];

const VALUES = [
  {
    title: "Community-first",
    description:
      "We build for neighborhoods — putting real people and local communities at the heart of everything we do.",
    icon: HeartHandshake,
  },
  {
    title: "Build for Bharat",
    description:
      "Our focus is on India's towns and cities, solving everyday problems with simple, useful experiences.",
    icon: Users,
  },
  {
    title: "Ownership",
    description:
      "We take initiative, move with purpose, and own outcomes as one small, tight-knit team.",
    icon: Sparkles,
  },
  {
    title: "Empathy",
    description:
      "We listen first, stay humble, and design with care for the people who use Meelte every day.",
    icon: CheckCircle2,
  },
];

const BENEFITS = [
  {
    title: "Flexible Work",
    description:
      "Work with flexibility that respects your life. We focus on outcomes, not just hours.",
    icon: Clock,
  },
  {
    title: "Learning & Growth",
    description:
      "Access to learning resources, mentorship, and opportunities to grow your skills across the stack.",
    icon: BookOpen,
  },
  {
    title: "Mission-Driven Impact",
    description:
      "Build something meaningful that helps real people in neighborhoods across India every day.",
    icon: Zap,
  },
  {
    title: "Small, Collaborative Team",
    description:
      "Work closely with founders and a tight-knit team where your ideas make an immediate impact.",
    icon: Users,
  },
  {
    title: "Health & Wellbeing",
    description:
      "We care about your wellbeing and support a healthy work-life balance.",
    icon: HeartHandshake,
  },
  {
    title: "Equity & Ownership",
    description:
      "As an early team member, you'll have the opportunity to share in Meelte's growth.",
    icon: Gift,
  },
];

const ICON_BOX =
  "h-11 w-11 shrink-0 rounded-2xl bg-surface-muted text-primary border border-primary/20 shadow-soft flex items-center justify-center";

export default function CareersPage() {
  const jsonLd = getBreadcrumbsJsonLd(BREADCRUMB_ITEMS);
  const careersEmail = HR_EMAIL || "hr@meelte.com";
  const mailtoHref = `mailto:${careersEmail}?subject=${encodeURIComponent(
    "Careers at Meelte - Resume Submission"
  )}&body=${encodeURIComponent(
    "Hi Meelte Team,\n\nI'm sharing my resume for consideration. Please find attached.\n\nName:\nRole I'm interested in:\nLinkedIn/GitHub/Portfolio:\n\nThanks,\n[Your Name]"
  )}`;

  return (
    <div className="flex min-h-screen flex-col bg-canvas selection:bg-primary/20 selection:text-primary">
      {jsonLd && (
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
        <section className="relative overflow-hidden pt-8 pb-10 sm:pt-12 sm:pb-14 border-b border-border/80">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-canvas to-canvas" />

          <Container className="flex flex-col items-center text-center max-w-4xl">
            <Breadcrumbs
              items={BREADCRUMB_ITEMS}
              className="mb-4"
              listClassName="justify-center"
            />

            <Badge variant="primary" size="md" className="mb-5 shadow-2xs">
              <Briefcase className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
              <span>Careers</span>
            </Badge>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.15]">
              Work at{" "}
              <span className="bg-gradient-to-r from-primary via-primary-hover to-accent bg-clip-text text-transparent">
                Meelte
              </span>
            </h1>

            <p className="mt-5 text-lg sm:text-2xl font-medium text-foreground-secondary leading-relaxed max-w-2xl">
              Help us build Meelte to connect neighborhoods across India.
            </p>

            <p className="mt-4 text-base sm:text-lg text-foreground-secondary leading-relaxed max-w-2xl">
              We're a small, mission-driven team focused on helping people discover
              opportunities, connect with their neighbors, and grow local communities.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button
                as="a"
                href={mailtoHref}
                variant="primary"
                size="lg"
                className="shadow-card"
              >
                <Mail className="h-4 w-4" aria-hidden="true" />
                <span>Email your resume</span>
              </Button>
              <Button as={Link} href="/about" variant="outline" size="lg">
                <span>Learn more about us</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          </Container>
        </section>

        <section className="py-10 sm:py-14 bg-surface border-b border-border/80">
          <Container>
            <div className="max-w-3xl mx-auto text-center mb-10 sm:mb-12">
              <Badge variant="neutral" size="md" className="mb-3">
                Our Values
              </Badge>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                What we value
              </h2>
              <p className="mt-4 text-base sm:text-lg text-foreground-secondary leading-relaxed">
                We keep things simple and focus on what matters.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {VALUES.map((value) => {
                const Icon = value.icon;
                return (
                  <Card
                    key={value.title}
                    className="p-6 hoverable flex flex-col h-full"
                  >
                    <div>
                      <div className={`${ICON_BOX} mb-4`}>
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </div>
                      <h3 className="text-base font-bold text-foreground mb-2">
                        {value.title}
                      </h3>
                      <p className="text-sm sm:text-base text-foreground-secondary leading-relaxed">
                        {value.description}
                      </p>
                    </div>
                  </Card>
                );
              })}
            </div>
          </Container>
        </section>

        <section className="py-10 sm:py-14 border-b border-border/80">
          <Container>
            <div className="max-w-3xl mx-auto text-center mb-10 sm:mb-12">
              <Badge variant="primary" size="md" className="mb-3">
                Perks & Benefits
              </Badge>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                Why you'll love working here
              </h2>
              <p className="mt-4 text-base sm:text-lg text-foreground-secondary leading-relaxed">
                We take care of our team so we can focus on building for our communities.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {BENEFITS.map((benefit) => {
                const Icon = benefit.icon;
                return (
                  <Card
                    key={benefit.title}
                    className="p-6 hoverable flex flex-col h-full"
                  >
                    <div>
                      <div className={`${ICON_BOX} mb-4`}>
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </div>
                      <h3 className="text-base font-bold text-foreground mb-2">
                        {benefit.title}
                      </h3>
                      <p className="text-sm sm:text-base text-foreground-secondary leading-relaxed">
                        {benefit.description}
                      </p>
                    </div>
                  </Card>
                );
              })}
            </div>
          </Container>
        </section>

        <section className="py-16 sm:py-24 border-b border-border/80">
          <Container className="max-w-4xl">
            <div className="text-center mb-10">
              <Badge variant="primary" size="md" className="mb-3">
                Open Roles
              </Badge>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                Open roles
              </h2>
            </div>

            <Card className="p-6 sm:p-10 text-center shadow-card border-primary/15 bg-surface">
              <div className="flex items-center justify-center mb-4">
                <div className={ICON_BOX}>
                  <Briefcase className="h-5 w-5" aria-hidden="true" />
                </div>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-foreground">
                No open roles at the moment
              </h3>
              <p className="mt-2 text-base text-foreground-secondary leading-relaxed max-w-xl mx-auto">
                We're not actively hiring right now. If you believe you'd be a great
                fit for Meelte, we'd still love to hear from you.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <Button as="a" href={mailtoHref} variant="primary" size="lg">
                  <Mail className="h-4 w-4" aria-hidden="true" />
                  <span>Send your resume</span>
                </Button>
              </div>
            </Card>
          </Container>
        </section>

        <section className="py-10 sm:py-14 bg-surface">
          <Container className="max-w-4xl">
            <Card className="p-8 sm:p-10 text-center shadow-card border-primary/20 bg-gradient-to-br from-primary/5 via-surface to-surface">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                Think you'd be a great fit?
              </h2>
              <p className="mt-3 text-base sm:text-lg text-foreground-secondary leading-relaxed max-w-2xl mx-auto">
                Tell us a bit about yourself and share your resume. We'll reach out
                if there's a good fit.
              </p>
              <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                <Button
                  as="a"
                  href={mailtoHref}
                  variant="primary"
                  size="lg"
                  className="shadow-soft"
                >
                  <Mail className="h-4 w-4" aria-hidden="true" />
                  <span>Email your resume</span>
                </Button>
                <Button as={Link} href="/contact" variant="outline" size="lg">
                  <span>Contact us</span>
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
