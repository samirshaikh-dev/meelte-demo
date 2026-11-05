import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/layout/container";
import { AdDetail } from "@/components/sections/ads";
import { formatDisplayName } from "@/components/sections/ads/ad-formatters";
import { buildPageMetadata } from "@/lib/seo/metadata";
import {
  getBreadcrumbsJsonLd,
  getPublicAdJsonLd,
} from "@/lib/seo/structured-data";
import { getPublicAd } from "@/services/supabase-services/ads/get-ads-by-id";

function snippet(value, fallback) {
  const normalized = typeof value === "string" ? value.replace(/\s+/g, " ").trim() : "";
  return (normalized || fallback).slice(0, 155);
}

// Merchants type names in any casing, and the detail page title-cases them for
// display. Everything that names the offer — heading, breadcrumb, metadata and
// JSON-LD — reads from this one value so they can never disagree.
function displayAd(ad) {
  return {
    ...ad,
    productName: formatDisplayName(ad.productName) || "Local offer",
    brandName: formatDisplayName(ad.brandName),
    category: formatDisplayName(ad.category),
  };
}

function routePath(id) {
  return `/ads/${encodeURIComponent(id || "")}`;
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const path = routePath(id);

  try {
    const ad = await getPublicAd(id);
    if (!ad) {
      return buildPageMetadata({
        title: "Offer unavailable",
        description: "This meelTe offer could not be found.",
        path,
        noIndex: true,
      });
    }

    const shown = displayAd(ad);

    return buildPageMetadata({
      title: shown.productName,
      description: snippet(
        ad.description,
        `${shown.brandName || "A local business"} offer on meelTe.`
      ),
      path,
      image: ad.photoUrl || undefined,
      noIndex: ad.hasEnded,
      keywords: [shown.category, "local offer", "meelTe"].filter(Boolean),
    });
  } catch {
    return buildPageMetadata({
      title: "Offer unavailable",
      description: "This meelTe offer is temporarily unavailable.",
      path,
      noIndex: true,
    });
  }
}

async function AdPageContent({ params }) {
  const { id } = await params;
  const ad = await getPublicAd(id);
  if (!ad) notFound();

  const shown = displayAd(ad);

  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: shown.productName, path: routePath(ad.id) },
  ];
  const jsonLd = [
    getBreadcrumbsJsonLd(breadcrumbs),
    !shown.hasEnded && getPublicAdJsonLd(shown),
  ].filter(Boolean);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <AdDetail ad={shown} breadcrumbs={breadcrumbs} />
    </>
  );
}

function DetailFallback() {
  return (
    <section
      aria-busy="true"
      aria-label="Loading offer"
      className="border-b border-border/80 bg-canvas pb-24 pt-6 sm:pt-8 lg:pb-16"
    >
      <Container className="max-w-6xl">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-12 xl:gap-16">
          <div className="aspect-[4/3] animate-pulse rounded-2xl bg-surface-muted lg:aspect-square" />
          <div className="space-y-4">
            <div className="h-9 w-4/5 animate-pulse rounded-lg bg-surface-muted" />
            <div className="h-4 w-2/5 animate-pulse rounded-md bg-surface-muted" />
            <div className="h-10 w-1/2 animate-pulse rounded-lg bg-surface-muted" />
            <div className="h-12 w-full animate-pulse rounded-xl bg-surface-muted" />
            <div className="h-11 w-full animate-pulse rounded-xl bg-surface-muted" />
          </div>
        </div>
      </Container>
    </section>
  );
}

export default function AdPage({ params }) {
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
          <AdPageContent params={params} />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
