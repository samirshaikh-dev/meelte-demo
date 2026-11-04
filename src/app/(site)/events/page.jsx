import { Suspense } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/layout/container";
import { EventsListing } from "@/components/sections/events";
import { buildCollectionMetadata } from "@/lib/seo/metadata";
import {
  getBreadcrumbsJsonLd,
  getCollectionPageJsonLd,
} from "@/lib/seo/structured-data";
import { listPublicEvents } from "@/services/supabase-services/events/get-all-events";
import { LISTING_PAGE_SIZE } from "@/services/supabase-services/shared/constants";

const BREADCRUMBS = [
  { name: "Home", path: "/" },
  { name: "Events", path: "/events" },
];

const PAGE_PATH = "/events";
const PAGE_TITLE = "Community events nearby";
const PAGE_DESCRIPTION =
  "Discover live local events, meetups and community gatherings happening nearby on meelTe.";

export const metadata = buildCollectionMetadata({
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  path: PAGE_PATH,
  keywords: ["local events nearby", "community events", "neighbourhood meetups", "meelTe events"],
});

/**
 * The first page of live community events from the read-only Web API.
 *
 * `listPublicEvents()` throws when the API is unconfigured or the upstream call
 * fails, so the failure is caught here and handed to the listing as an explicit
 * state. A missing key must never turn this route into a 500.
 *
 * Only `LISTING_PAGE_SIZE` (20) rows are fetched; the rest arrive through the
 * `loadMoreEvents` Server Action. The cursor is derived from the last *raw* row —
 * including events that have already ended — because the upstream list is
 * ordered by `created_at`. Deriving it from the last visible row would re-fetch
 * or skip rows.
 */
async function EventsPageContent() {
  let page = [];
  let unavailable = false;

  try {
    page = await listPublicEvents({ limit: LISTING_PAGE_SIZE });
  } catch {
    unavailable = true;
  }

  const last = page[page.length - 1];
  const hasMore = page.length === LISTING_PAGE_SIZE;
  const nextCursor =
    hasMore && last?.createdAt && last?.id
      ? { beforeCreatedAt: last.createdAt, beforeId: last.id }
      : null;

  const liveEvents = page.filter((event) => !event.hasEnded);

  const jsonLd = [
    getBreadcrumbsJsonLd(BREADCRUMBS),
    liveEvents.length > 0 &&
      getCollectionPageJsonLd({
        name: PAGE_TITLE,
        description: PAGE_DESCRIPTION,
        path: PAGE_PATH,
        items: liveEvents.map((event) => ({
          name: event.title || "Community event",
          path: `/events/${encodeURIComponent(event.id)}`,
        })),
      }),
  ].filter(Boolean);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <EventsListing
        events={liveEvents}
        breadcrumbs={BREADCRUMBS}
        unavailable={unavailable}
        nextCursor={nextCursor}
      />
    </>
  );
}

function ListingFallback() {
  return (
    <section
      aria-busy="true"
      aria-label="Loading events"
      className="border-b border-border/80 bg-canvas py-8 sm:py-12 lg:py-16"
    >
      <Container>
        <div className="h-9 w-64 animate-pulse rounded-lg bg-surface-muted" aria-hidden="true" />
        <div className="mt-4 h-5 w-full max-w-xl animate-pulse rounded-lg bg-surface-muted" aria-hidden="true" />
      </Container>
    </section>
  );
}

export default function EventsPage() {
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
        <Suspense fallback={<ListingFallback />}>
          <EventsPageContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

