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
  Sparkles,
  Compass,
  Users,
  Layers,
  Store,
  ShieldCheck,
  HeartHandshake,
  CheckCircle2,
  Download,
  ArrowRight,
  Phone,
  MapPin,
  CalendarDays,
  ShoppingBag,
  Zap,
} from "@/lib/icons";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { getAboutPageJsonLd, getBreadcrumbsJsonLd } from "@/lib/seo/structured-data";
import { PLAY_STORE_URL } from "@/config/site";

export const metadata = buildPageMetadata({
  title: "About Meelte — Why We Built Meelte",
  description:
    "Why we built a platform to help people find what matters, before it slips away. Discover local products, meaningful events, and real communities with Meelte.",
  path: "/about",
  keywords: [
    "About Meelte",
    "Meelte story",
    "local community platform",
    "neighborhood discovery India",
    "find nearby products",
    "community events Bengaluru",
    "connect with neighbors",
    "why choose Meelte",
  ],
});

const VISION_POINTS = [
  {
    title: "Discover nearby products & services",
    description: "Find what is available in your neighborhood quickly without endless scrolling or lengthy delivery waits.",
    icon: Store,
  },
  {
    title: "Connect with like-minded individuals",
    description: "Build meaningful bonds with people around you who share your language, culture, interests, and passions.",
    icon: Users,
  },
  {
    title: "Participate in meaningful events",
    description: "Join or organize local gatherings, hobby circles, sports meetups, and real-world social experiences.",
    icon: CalendarDays,
  },
  {
    title: "Build stronger local communities",
    description: "Support local shopkeepers, neighbors, and organizers to create resilient, vibrant neighborhoods.",
    icon: HeartHandshake,
  },
];

const WHAT_WE_DO_ITEMS = [
  {
    title: "Discover Nearby Products",
    description: "Find products available near your location at competitive prices, without waiting for deliveries.",
    icon: Compass,
    badge: "Fast & Local",
  },
  {
    title: "Explore Local Offers",
    description: "Never miss a fleeting local deal or neighborhood opportunity before it slips away.",
    icon: Sparkles,
    badge: "Fleeting Deals",
  },
  {
    title: "Create & Join Community Events",
    description: "Organize weekend runs, pottery jams, workshops, and community festivals with zero barrier to entry.",
    icon: CalendarDays,
    badge: "Real World",
  },
  {
    title: "Connect with People",
    description: "Easily meet neighbors who share your hobbies, native language, cultural background, and ambitions.",
    icon: Users,
    badge: "Authentic Ties",
  },
  {
    title: "Real-World Relationships",
    description: "Move past superficial online follows into genuine, lasting friendships and community support networks.",
    icon: ShieldCheck,
    badge: "Meaningful",
  },
];

/**
 * Single standardized icon container used across every section of this page.
 * Light purple tint + dark purple line icon, per UI consistency standard.
 */
const ICON_BOX =
  "h-11 w-11 shrink-0 rounded-2xl bg-surface-muted text-primary border border-primary/20 shadow-soft flex items-center justify-center";

/** Keeps the visual breadcrumb and its BreadcrumbList schema in sync. */
const BREADCRUMB_ITEMS = [
  { name: "Home", path: "/" },
  { name: "About Us", path: "/about" },
];

export default function AboutPage() {
  const jsonLd = [
    getAboutPageJsonLd(),
    getBreadcrumbsJsonLd(BREADCRUMB_ITEMS),
  ].filter(Boolean);

  return (
    <div className="flex min-h-screen flex-col bg-canvas selection:bg-primary/20 selection:text-primary">
      {/* Schema.org Structured Data (AboutPage + BreadcrumbList) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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

      <main id="main-content" className="flex-1">
        {/* ── HERO SECTION ── */}
        <section className="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24 border-b border-border/80">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-canvas to-canvas" />

          <Container className="flex flex-col items-center text-center max-w-4xl">
            <Breadcrumbs
              items={BREADCRUMB_ITEMS}
              className="mb-4"
              listClassName="justify-center"
            />

            <Badge variant="primary" size="md" className="mb-5 shadow-2xs">
              <Sparkles className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
              <span>Our Purpose & Origin</span>
            </Badge>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.15]">
              About{" "}
              <span className="bg-gradient-to-r from-primary via-primary-hover to-accent bg-clip-text text-transparent">
                Meelte
              </span>
            </h1>

            <p className="mt-5 text-lg sm:text-2xl font-medium text-foreground-secondary leading-relaxed max-w-2xl">
              Why we built a platform to help people find what matters, before it slips away.
            </p>

            <div className="mt-8 p-5 sm:p-6 rounded-2xl bg-surface border border-primary/20 shadow-soft max-w-2xl text-left flex items-start gap-4">
              <div className={ICON_BOX}>
                <Sparkles className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-primary block mb-1">
                  Our Core Goal
                </span>
                <p className="text-base font-semibold text-foreground leading-snug">
                  Help people connect with the right opportunities and the right people at the right time.
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button
                as="a"
                href={PLAY_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                variant="primary"
                size="lg"
                className="shadow-card"
              >
                <Download className="h-4 w-4" aria-hidden="true" />
                <span>Get the Meelte App</span>
              </Button>
              <Button as={Link} href="/discover" variant="outline" size="lg">
                <Compass className="h-4 w-4 text-primary" aria-hidden="true" />
                <span>Explore Discover</span>
              </Button>
            </div>
          </Container>
        </section>

        {/* ── SECTION 1: OUR STORY ── */}
        <section className="py-16 sm:py-24 bg-surface border-b border-border/80">
          <Container className="max-w-4xl">
            <div className="text-center mb-12">
              <Badge variant="accent" size="md" className="mb-3">
                The Spark
              </Badge>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                Our Story
              </h2>
              <p className="mt-2 text-base text-foreground-secondary">
                Meelte was born from a simple everyday experience.
              </p>
            </div>

            {/* Narrative Editorial Cards */}
            <div className="flex flex-col gap-8">
              <Card className="p-6 sm:p-8 hoverable">
                <div className="flex items-start gap-4">
                  <div className={ICON_BOX}>
                    <Zap className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-foreground mb-2">
                      The Fleeting Opportunity
                    </h3>
                    <p className="text-base text-foreground-secondary leading-relaxed">
                      While browsing a social platform, I came across an attractive product offer that caught my attention. Before I could learn more, I received a phone call. By the time the call ended, the advertisement had disappeared and I was unable to find it again.
                    </p>
                    <p className="mt-3 text-base text-foreground-secondary leading-relaxed">
                      I regretted answering the call and realised how easily valuable opportunities can be lost in the fast-moving digital world.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 sm:p-8 hoverable">
                <div className="flex items-start gap-4">
                  <div className={ICON_BOX}>
                    <MapPin className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-foreground mb-2">
                      The Disconnection in a New City
                    </h3>
                    <p className="text-base text-foreground-secondary leading-relaxed">
                      At another point, while travelling to a new city, I found it difficult to connect with people who shared my language, culture, and interests. Despite being surrounded by thousands of people, meaningful connections were hard to find.
                    </p>
                  </div>
                </div>
              </Card>

              <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-primary/10 via-surface-muted to-primary/5 border border-primary/20">
                <div className="flex items-start gap-4">
                  <div className={ICON_BOX}>
                    <Sparkles className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">
                      The Inspiration Behind Meelte
                    </h3>
                    <p className="text-base text-foreground-secondary leading-relaxed">
                      These experiences inspired the creation of Meelte — a platform designed to help people discover opportunities, local products, meaningful events, and communities without missing what matters most to them.
                    </p>
                    <p className="mt-3 text-base font-semibold text-primary">
                      Our goal is simple: help people connect with the right opportunities and the right people at the right time.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* ── SECTION 2: OUR MISSION ── */}
        <section className="py-14 sm:py-20 border-b border-border/80">
          <Container>
            <div className="max-w-3xl mx-auto text-center mb-10 sm:mb-12">
              <Badge variant="primary" size="md" className="mb-3">
                Value in Local Communities
              </Badge>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                Our Mission
              </h2>
              <p className="mt-4 text-base sm:text-lg text-foreground-secondary leading-relaxed">
                At Meelte, our mission is to help people discover value in their local communities.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
              <Card className="p-6 sm:p-8 hoverable flex flex-col justify-between h-full">
                <div>
                  <div className={`${ICON_BOX} mb-5`}>
                    <Store className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">
                    Faster, Smarter Local Commerce
                  </h3>
                  <p className="text-base text-foreground-secondary leading-relaxed">
                    We aim to enable users to find products available nearby at competitive prices, allowing them to purchase what they need without waiting for deliveries or lengthy searches. By connecting buyers with local opportunities, we help users make faster and smarter decisions.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-border/60 text-xs font-semibold text-primary">
                  Zero delivery delays · Immediate neighborhood access
                </div>
              </Card>

              <Card className="p-6 sm:p-8 hoverable flex flex-col justify-between h-full">
                <div>
                  <div className={`${ICON_BOX} mb-5`}>
                    <HeartHandshake className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">
                    Meaningful Human Connections
                  </h3>
                  <p className="text-base text-foreground-secondary leading-relaxed">
                    At the same time, we believe meaningful human connections are more important than ever. Through community-driven events and social experiences, Meelte provides a platform where people with shared interests, hobbies, cultures, and goals can come together, build relationships, and create lasting memories.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-border/60 text-xs font-semibold text-primary">
                  Shared cultures & hobbies · Real-world memories
                </div>
              </Card>
            </div>
          </Container>
        </section>

        {/* ── SECTION 3: OUR VISION ── */}
        <section className="py-16 sm:py-24 bg-surface border-b border-border/80">
          <Container>
            <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
              <Badge variant="neutral" size="md" className="mb-3">
                Looking Ahead
              </Badge>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                Our Vision
              </h2>
              <p className="mt-4 text-base sm:text-lg text-foreground-secondary leading-relaxed">
                We envision a world where discovering opportunities and building connections is effortless.
              </p>
              <p className="mt-2 text-sm text-foreground-secondary">
                Our vision is to become a trusted platform that bridges the gap between local commerce and community engagement by helping people:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {VISION_POINTS.map((point) => {
                const Icon = point.icon;
                return (
                  <div
                    key={point.title}
                    className="p-6 rounded-2xl bg-surface-subtle border border-border/80 shadow-2xs hover:-translate-y-1 hover:shadow-card transition-all duration-200 flex flex-col justify-between h-full"
                  >
                    <div>
                      <div className={`${ICON_BOX} mb-4`}>
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </div>
                      <h3 className="text-base font-bold text-foreground mb-2">
                        {point.title}
                      </h3>
                      <p className="text-sm sm:text-base text-foreground-secondary leading-relaxed">
                        {point.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-12 text-center max-w-2xl mx-auto p-4 rounded-xl bg-surface-muted text-primary text-sm font-semibold border border-primary/15">
              “We aspire to create an ecosystem where every interaction adds value and every connection has purpose.”
            </div>
          </Container>
        </section>

        {/* ── SECTION 4: WHAT WE DO ── */}
        <section className="py-16 sm:py-24 border-b border-border/80">
          <Container>
            <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
              <Badge variant="primary" size="md" className="mb-3">
                Platform Experience
              </Badge>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                What We Do
              </h2>
              <p className="mt-4 text-base sm:text-lg text-foreground-secondary leading-relaxed">
                Meelte is a platform that brings together people, communities, events, and local opportunities in one place.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {WHAT_WE_DO_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <Card key={item.title} className="p-6 hoverable flex flex-col justify-between h-full">
                    <div>
                      <div className="flex items-center justify-between gap-3 mb-5">
                        <div className={ICON_BOX}>
                          <Icon className="h-5 w-5" aria-hidden="true" />
                        </div>
                        <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-surface-muted text-primary border border-primary/15 whitespace-nowrap">
                          {item.badge}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-foreground mb-2">
                        {item.title}
                      </h3>
                      <p className="text-base text-foreground-secondary leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </Card>
                );
              })}

              {/* Summary Highlight Card */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-primary to-primary-hover text-white flex flex-col justify-between h-full shadow-soft">
                <div>
                  <span className="text-xs uppercase tracking-wider font-bold text-white block mb-2">
                    All In One Place
                  </span>
                  <h3 className="text-lg font-bold text-white mb-3">
                    Discover What Matters Most
                  </h3>
                  <p className="text-sm sm:text-base text-white/95 leading-relaxed">
                    Whether you are looking for the best local deal or seeking people with shared interests, Meelte helps you discover what matters most to you.
                  </p>
                </div>
                <div className="mt-6 pt-3 border-t border-white/20">
                  <Link
                    href="/discover"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-white hover:underline"
                  >
                    <span>Browse Discovery Directory</span>
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* ── SECTION 5: WHY CHOOSE MEELTE ── */}
        <section className="py-16 sm:py-24 bg-surface">
          <Container className="max-w-4xl">
            <div className="text-center mb-10">
              <Badge variant="accent" size="md" className="mb-3">
                The Meelte Difference
              </Badge>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                Why Choose Meelte
              </h2>
            </div>

            <Card className="p-8 sm:p-10 text-center shadow-card border-primary/20 bg-surface">
              <p className="text-base sm:text-xl text-foreground leading-relaxed max-w-2xl mx-auto font-medium">
                Unlike traditional platforms that often overwhelm users with irrelevant content, Meelte focuses on <span className="text-primary font-bold">relevance</span>, <span className="text-primary font-bold">community</span>, and <span className="text-primary font-bold">meaningful discovery</span>.
              </p>

              <div className="my-6 max-w-xs mx-auto border-t border-border/80" />

              <p className="text-base text-foreground-secondary max-w-xl mx-auto leading-relaxed">
                We believe users should spend less time searching and more time finding exactly what they need.
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Button
                  as="a"
                  href={PLAY_STORE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="primary"
                  size="lg"
                  className="shadow-soft"
                >
                  <Download className="h-4 w-4" aria-hidden="true" />
                  <span>Get Meelte on Google Play</span>
                </Button>
                <Button as={Link} href="/contact" variant="outline" size="lg">
                  <span>Contact Our Team</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
            </Card>
          </Container>
        </section>
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
