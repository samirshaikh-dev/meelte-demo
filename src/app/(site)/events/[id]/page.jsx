import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { EventDetail } from "@/components/sections/events";
import { buildPageMetadata } from "@/lib/seo/metadata";
import {
  getBreadcrumbsJsonLd,
  getPublicEventJsonLd,
} from "@/lib/seo/structured-data";
import { getPublicEvent } from "@/services/supabase-services/events/get-events-by-id";

function snippet(value, fallback) {
  const normalized = typeof value === "string" ? value.replace(/\s+/g, " ").trim() : "";
  return (normalized || fallback).slice(0, 155);
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

    return buildPageMetadata({
      title: event.title || "Community event",
      description: snippet(event.description, "A public community event on meelTe."),
      path,
      image: event.coverUrl || undefined,
      noIndex: event.hasEnded,
      keywords: [event.category, "local event", "meelTe"].filter(Boolean),
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

  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: event.title || "Event", path: routePath(event.id) },
  ];
  const jsonLd = [
    getBreadcrumbsJsonLd(breadcrumbs),
    !event.hasEnded && getPublicEventJsonLd(event),
  ].filter(Boolean);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <EventDetail event={event} breadcrumbs={breadcrumbs} />
    </>
  );
}

function DetailFallback() {
  return (
    <section
      aria-busy="true"
      aria-label="Loading event"
      className="border-b border-border/80 bg-canvas py-24"
    >
      <div className="mx-auto h-8 w-48 animate-pulse rounded-lg bg-surface-muted" />
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
