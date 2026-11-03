import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { AdDetail } from "@/components/sections/ads";
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

    return buildPageMetadata({
      title: ad.productName || "Local offer",
      description: snippet(
        ad.description,
        `${ad.brandName || "A local business"} offer on meelTe.`
      ),
      path,
      image: ad.photoUrl || undefined,
      noIndex: ad.hasEnded,
      keywords: [ad.category, "local offer", "meelTe"].filter(Boolean),
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

  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: ad.productName || "Offer", path: routePath(ad.id) },
  ];
  const jsonLd = [
    getBreadcrumbsJsonLd(breadcrumbs),
    !ad.hasEnded && getPublicAdJsonLd(ad),
  ].filter(Boolean);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <AdDetail ad={ad} breadcrumbs={breadcrumbs} />
    </>
  );
}

function DetailFallback() {
  return (
    <section
      aria-busy="true"
      aria-label="Loading offer"
      className="border-b border-border/80 bg-canvas py-24"
    >
      <div className="mx-auto h-8 w-48 animate-pulse rounded-lg bg-surface-muted" />
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
