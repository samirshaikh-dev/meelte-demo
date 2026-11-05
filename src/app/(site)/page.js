import { Suspense } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { DiscoverySwitch, ListingFallback } from "@/components/sections/discovery";
import { buildCollectionMetadata } from "@/lib/seo/metadata";
import { getCollectionPageJsonLd } from "@/lib/seo/structured-data";
import { listPublicAds } from "@/services/supabase-services/ads/get-all-ads";
import { listPublicEvents } from "@/services/supabase-services/events/get-all-events";
import { LISTING_PAGE_SIZE } from "@/services/supabase-services/shared/constants";

const PAGE_PATH = "/";
const PAGE_TITLE = "Local offers and community events nearby";
const PAGE_DESCRIPTION =
  "Explore live local offers, shop discounts and community events happening nearby on meelTe.";

export const metadata = buildCollectionMetadata({
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  path: PAGE_PATH,
  keywords: [
    "local offers nearby",
    "community events",
    "neighbourhood deals",
    "local discovery",
    "meelTe",
  ],
});

/**
 * Parallel data fetch for unified discovery on the homepage.
 *
 * Runs inside a Suspense boundary in the static shell.
 * Fetches the first page of Ads and Events in parallel.
 * Emits CollectionPage schema covering only the server-rendered offers.
 */
async function DiscoveryContent() {
  const [adsResult, eventsResult] = await Promise.allSettled([
    listPublicAds({ limit: LISTING_PAGE_SIZE }),
    listPublicEvents({ limit: LISTING_PAGE_SIZE }),
  ]);

  const adsPage = adsResult.status === "fulfilled" ? adsResult.value : [];
  const adsUnavailable = adsResult.status === "rejected";
  const lastAd = adsPage[adsPage.length - 1];
  const hasMoreAds = adsPage.length === LISTING_PAGE_SIZE;
  const nextAdsCursor =
    hasMoreAds && lastAd?.createdAt && lastAd?.id
      ? { beforeCreatedAt: lastAd.createdAt, beforeId: lastAd.id }
      : null;
  const liveAds = adsPage.filter((ad) => !ad.hasEnded);

  const eventsPage = eventsResult.status === "fulfilled" ? eventsResult.value : [];
  const eventsUnavailable = eventsResult.status === "rejected";
  const lastEvent = eventsPage[eventsPage.length - 1];
  const hasMoreEvents = eventsPage.length === LISTING_PAGE_SIZE;
  const nextEventsCursor =
    hasMoreEvents && lastEvent?.createdAt && lastEvent?.id
      ? { beforeCreatedAt: lastEvent.createdAt, beforeId: lastEvent.id }
      : null;
  const liveEvents = eventsPage.filter((event) => !event.hasEnded);

  // Schema: CollectionPage covering only the offers actually rendered in server HTML.
  // BreadcrumbList is not emitted on / per AI_RULE.md §2.7 exemption.
  const collectionJsonLd =
    liveAds.length > 0
      ? getCollectionPageJsonLd({
          name: PAGE_TITLE,
          description: PAGE_DESCRIPTION,
          path: PAGE_PATH,
          items: liveAds.map((ad) => ({
            name: ad.productName || "Local offer",
            path: `/ads/${encodeURIComponent(ad.id)}`,
          })),
        })
      : null;

  return (
    <>
      {collectionJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(collectionJsonLd).replace(/</g, "\\u003c"),
          }}
        />
      )}
      <DiscoverySwitch
        ads={{
          items: liveAds,
          nextCursor: nextAdsCursor,
          unavailable: adsUnavailable,
        }}
        events={{
          items: liveEvents,
          nextCursor: nextEventsCursor,
          unavailable: eventsUnavailable,
        }}
      />
    </>
  );
}

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-canvas selection:bg-primary/20 selection:text-primary">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-xl focus:bg-primary focus:px-4 focus:py-2.5 focus:font-bold focus:text-white focus:ring-2 focus:ring-white focus:outline-none"
      >
        Skip to main content
      </a>

      <Suspense fallback={<div className="h-16 border-b border-border/80 bg-surface" aria-hidden="true" />}>
        <Navbar />
      </Suspense>

      <main id="main-content" className="flex-1">
        <Suspense fallback={<ListingFallback label="Loading local offers" />}>
          <DiscoveryContent />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
