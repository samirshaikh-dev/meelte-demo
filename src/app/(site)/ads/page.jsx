import { Suspense } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { AdsListing } from "@/components/sections/ads";
import { buildCollectionMetadata } from "@/lib/seo/metadata";
import {
  getBreadcrumbsJsonLd,
  getCollectionPageJsonLd,
} from "@/lib/seo/structured-data";
import { listPublicAds } from "@/services/supabase-services/ads/get-all-ads";
import { LISTING_PAGE_SIZE } from "@/services/supabase-services/shared/constants";

const BREADCRUMBS = [
  { name: "Home", path: "/" },
  { name: "Offers", path: "/ads" },
];

const PAGE_PATH = "/ads";
const PAGE_TITLE = "Local offers nearby";
const PAGE_DESCRIPTION =
  "Browse live offers shared by nearby shops on meelTe, with prices, discounts and locations.";

export const metadata = buildCollectionMetadata({
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  path: PAGE_PATH,
  keywords: ["local offers nearby", "shop offers", "neighbourhood discounts", "meelTe offers"],
});

/**
 * The first page of live offers from the read-only Web API.
 *
 * `listPublicAds()` throws when the API is unconfigured or the upstream call
 * fails, so the failure is caught here and handed to the listing as an explicit
 * state. A missing key must never turn this route into a 500.
 *
 * Only `LISTING_PAGE_SIZE` (20) rows are fetched; the rest arrive through the
 * `loadMoreAds` Server Action. The cursor is derived from the last *raw* row —
 * including offers that have already ended — because the upstream list is
 * ordered by `created_at`. Deriving it from the last visible row would re-fetch
 * or skip rows.
 */
async function AdsPageContent() {
  let page = [];
  let unavailable = false;

  try {
    page = await listPublicAds({ limit: LISTING_PAGE_SIZE });
  } catch {
    unavailable = true;
  }

  const last = page[page.length - 1];
  const hasMore = page.length === LISTING_PAGE_SIZE;
  const nextCursor =
    hasMore && last?.createdAt && last?.id
      ? { beforeCreatedAt: last.createdAt, beforeId: last.id }
      : null;

  const liveAds = page.filter((ad) => !ad.hasEnded);

  const jsonLd = [
    getBreadcrumbsJsonLd(BREADCRUMBS),
    liveAds.length > 0 &&
      getCollectionPageJsonLd({
        name: PAGE_TITLE,
        description: PAGE_DESCRIPTION,
        path: PAGE_PATH,
        items: liveAds.map((ad) => ({
          name: ad.productName || "Local offer",
          path: `/ads/${encodeURIComponent(ad.id)}`,
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
      <AdsListing
        ads={liveAds}
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
      aria-label="Loading offers"
      className="border-b border-border/80 bg-canvas py-24"
    >
      <div className="mx-auto h-8 w-48 animate-pulse rounded-lg bg-surface-muted" />
    </section>
  );
}

export default function AdsPage() {
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
          <AdsPageContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
