import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/layout/container";
import { EventDetail } from "@/components/sections/events";
import { buildPageMetadata } from "@/lib/seo/metadata";
import {
  getBreadcrumbsJsonLd,
  getPublicEventJsonLd,
} from "@/lib/seo/structured-data";
import { getPublicEvent } from "@/services/supabase-services/events/get-events-by-id";
import { formatDisplayName } from "@/lib/display-name";

function snippet(value, fallback) {
  const normalized = typeof value === "string" ? value.replace(/\s+/g, " ").trim() : "";
  return (normalized || fallback).slice(0, 155);
}

// Hosts type titles, categories and host names in any casing, and the detail page
// title-cases them for display. Everything that names the event — heading,
// breadcrumb, metadata and JSON-LD — reads from this one value so they agree.
function displayEvent(event) {
  return {
    ...event,
    title: formatDisplayName(event.title) || "Community event",
    category: formatDisplayName(event.category),
    creatorName: formatDisplayName(event.creatorName),
  };
}

function routePath(id) {
  return `/events/${encodeURIComponent(id || "")}`;
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const path = routePath(id);

  try {
    const event = await getPublicEvent(id);
    if (!event) {
      return buildPageMetadata({
        title: "Event unavailable",
        description: "This meelTe event could not be found.",
        path,
        noIndex: true,
      });
    }

    const shown = displayEvent(event);

    return buildPageMetadata({
      title: shown.title,
      description: snippet(event.description, "A public community event on meelTe."),
      path,
      image: event.coverUrl || undefined,
      noIndex: event.hasEnded,
      keywords: [shown.category, "local event", "meelTe"].filter(Boolean),
    });
  } catch {
    return buildPageMetadata({
      title: "Event unavailable",
      description: "This meelTe event is temporarily unavailable.",
      path,
      noIndex: true,
    });
  }
}

async function EventPageContent({ params }) {
  const { id } = await params;
  const event = await getPublicEvent(id);
  if (!event) notFound();

  const shown = displayEvent(event);

  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "Events", path: "/events" },
    { name: shown.title, path: routePath(event.id) },
  ];
  const jsonLd = [
    getBreadcrumbsJsonLd(breadcrumbs),
    !shown.hasEnded && getPublicEventJsonLd(shown),
  ].filter(Boolean);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <EventDetail event={shown} breadcrumbs={breadcrumbs} />
    </>
  );
}

function DetailFallback() {
  return (
    <section
      aria-busy="true"
      aria-label="Loading event"
      className="border-b border-border/80 bg-canvas pb-24 pt-6 sm:pt-8 lg:pb-16"
    >
      <Container className="max-w-6xl">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-12 xl:gap-16">
          <div className="aspect-[4/3] animate-pulse rounded-2xl bg-surface-muted lg:aspect-square" />
          <div className="space-y-4">
            <div className="h-9 w-4/5 animate-pulse rounded-lg bg-surface-muted" />
            <div className="h-9 w-1/3 animate-pulse rounded-full bg-surface-muted" />
            <div className="h-24 w-full animate-pulse rounded-lg bg-surface-muted" />
            <div className="h-12 w-full animate-pulse rounded-xl bg-surface-muted" />
            <div className="h-11 w-full animate-pulse rounded-xl bg-surface-muted" />
          </div>
        </div>
      </Container>
    </section>
  );
}

export default function EventPage({ params }) {
  return (
    <div className="flex min-h-screen flex-col bg-canvas selection:bg-primary/20 selection:text-primary">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-xl focus:bg-primary focus:px-4 focus:py-2.5 focus:font-bold focus:text-white focus:ring-2 focus:ring-white focus:outline-none"
      >
        Skip to main content
      </a>
      <Suspense fallback={<div className="h-16 border-b border-border/80 bg-surface" aria-hidden="true" />}>
        <Navbar />
      </Suspense>
      <main id="main-content" className="flex-1">
        <Suspense fallback={<DetailFallback />}>
          <EventPageContent params={params} />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
