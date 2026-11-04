"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  Bookmark,
  CalendarDays,
  Heart,
  MapPin,
  MessageCircle,
  Navigation,
  Share2,
  Store,
  Tag,
} from "@/lib/icons";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Container } from "@/components/layout/container";
import { DetailSteps } from "@/components/sections/common/detail-steps";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { shareCurrentPage } from "@/lib/share-link";
import {
  formatDate,
  formatDisplayName,
  formatPrice,
  getDealBadge,
  getDirectionsHref,
  getDiscountLabel,
} from "./ad-formatters";
import { AppActionModal } from "./app-action-modal";

const REDEMPTION_STEPS = [
  {
    title: "Claim the voucher",
    detail: "Open the free meelTe app for Android or iOS and claim this deal.",
  },
  {
    title: "Visit the shop",
    detail: "Use the directions below and show the voucher at the counter.",
  },
  {
    title: "Pay the shop",
    detail: "Pay the discounted price directly to the merchant, in store.",
  },
];

/**
 * The public page for one app-shared offer.
 *
 * A visitor arriving here came from a shared link, so the page has to answer
 * three things before it asks for anything: what the deal is, what it costs, and
 * whether they can get there. Those three sit above the fold — the photo, the
 * title, the price — and the only action a browser visitor can actually finish,
 * "Get directions", is a real link rather than a prompt to install something.
 *
 * Deliberately light on containers (AVOID.md §2): the photo is the single framed
 * element and everything else is typography, hairlines and spacing. Claiming,
 * saving and posting are app-only, so they open the AppActionModal.
 */
export function AdDetail({ ad, breadcrumbs }) {
  const [modalState, setModalState] = useState({
    isOpen: false,
    actionType: "default",
    offerTitle: formatDisplayName(ad?.productName) || "",
  });

  const offerName = formatDisplayName(ad.productName) || "Local offer";
  const shopName = formatDisplayName(ad.brandName);
  const categoryLabel = formatDisplayName(ad.category);
  const merchantName = formatDisplayName(ad.createdBy);

  const finalPrice = formatPrice(ad.finalPrice);
  const originalPrice = formatPrice(ad.originalPrice);
  const discountLabel = getDiscountLabel(ad);
  const hasPriceDrop =
    typeof ad.originalPrice === "number" &&
    typeof ad.finalPrice === "number" &&
    ad.originalPrice > ad.finalPrice;

  // The photo carries the discount, never a repeat of the price shown below it.
  const photoBadge = finalPrice ? discountLabel : getDealBadge(ad);

  const startDate = formatDate(ad.startAt);
  const endDate = formatDate(ad.endAt);
  const validity =
    startDate && endDate
      ? `${startDate} – ${endDate}`
      : endDate
        ? `Until ${endDate}`
        : startDate
          ? `From ${startDate}`
          : "";

  const directionsHref = getDirectionsHref(ad);
  const likesCount = typeof ad.likesCount === "number" ? ad.likesCount : 0;
  const commentsCount = typeof ad.commentsCount === "number" ? ad.commentsCount : 0;
  const hasEngagement = likesCount > 0 || commentsCount > 0;
  const showMerchantRow = Boolean(merchantName) && merchantName !== shopName;

  function triggerAppModal(actionType) {
    setModalState({
      isOpen: true,
      actionType,
      offerTitle: offerName,
    });
  }

  function handleShare() {
    shareCurrentPage({
      title: `${offerName} on meelTe`,
      text: `Check out this offer on meelTe: ${offerName}${shopName ? ` from ${shopName}` : ""}.`,
      successMessage: "Offer link copied to your clipboard.",
    });
  }

  return (
    <section
      className={`border-b border-border/80 bg-canvas pt-6 sm:pt-8 lg:pb-16 ${
        ad.hasEnded ? "pb-12" : "pb-24"
      }`}
    >
      <Container className="max-w-6xl">
        <Breadcrumbs items={breadcrumbs} className="mb-5" />

        <article className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:items-start lg:gap-12 xl:gap-16">
          {/* Media: the one framed element on the page */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-surface-muted">
              <div className="relative aspect-[4/3] lg:aspect-square">
                {ad.photoUrl ? (
                  <Image
                    src={ad.photoUrl}
                    alt={offerName}
                    fill
                    priority
                    unoptimized
                    sizes="(min-width: 1024px) 46vw, 100vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center px-8 text-center text-sm text-foreground-secondary">
                    This shop did not add a photo to the offer.
                  </div>
                )}

                {/* Holds the category chip legible over unpredictable shop photos */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent"
                />
              </div>

              {photoBadge && (
                <Badge
                  size="sm"
                  variant="accent"
                  className="pointer-events-none absolute left-3 top-3 max-w-[70%] truncate bg-accent text-accent-foreground shadow-soft"
                >
                  {photoBadge}
                </Badge>
              )}

              {categoryLabel && (
                <span className="pointer-events-none absolute bottom-3 left-3 max-w-[70%] truncate rounded-lg bg-black/45 px-2 py-0.5 text-[11px] font-semibold text-white ring-1 ring-white/25 ring-inset">
                  {categoryLabel}
                </span>
              )}
            </div>
          </div>

          {/* Everything that explains and converts */}
          <div className="min-w-0">
            <h1 className="text-3xl font-black leading-[1.1] tracking-tight text-balance text-foreground sm:text-4xl">
              {offerName}
            </h1>

            {shopName && (
              <p className="mt-2 text-sm text-foreground-secondary">
                From <span className="font-semibold text-foreground">{shopName}</span>
              </p>
            )}

            {ad.locationName && (
              <p className="mt-1.5 flex items-start gap-1.5 text-sm text-foreground-secondary">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                <span className="break-words">{ad.locationName}</span>
              </p>
            )}

            {ad.hasEnded && (
              <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1.5 rounded-xl border border-border bg-surface px-4 py-3">
                <p className="text-sm text-foreground-secondary">
                  <span className="font-semibold text-foreground">This offer has ended.</span> It can
                  no longer be redeemed.
                </p>
                <Link
                  href="/ads"
                  className="rounded-sm text-sm font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
                >
                  Browse live offers
                </Link>
              </div>
            )}

            {(finalPrice || discountLabel) && (
              <div className="mt-6">
                <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="text-4xl font-black tracking-tight text-foreground">
                    {finalPrice || discountLabel}
                  </span>
                  {hasPriceDrop && originalPrice && (
                    <del className="text-base font-medium text-foreground-secondary">
                      <span className="sr-only">Regular price </span>
                      {originalPrice}
                    </del>
                  )}
                </p>
                {!hasPriceDrop && discountLabel && finalPrice ? (
                  <p className="mt-1 text-sm font-semibold text-foreground-secondary">
                    {discountLabel}
                  </p>
                ) : null}
              </div>
            )}

            {/* The one action a browser visitor can complete without the app */}
            {!ad.hasEnded && (
              <div className="mt-6 flex flex-col gap-2.5">
                <Button
                  type="button"
                  size="lg"
                  onClick={() => triggerAppModal("claim")}
                  className="w-full justify-center"
                >
                  <Tag className="h-4 w-4" aria-hidden="true" />
                  <span>Claim deal in app</span>
                </Button>

                <div className="flex items-center gap-2">
                  {directionsHref && (
                    <Button
                      as="a"
                      href={directionsHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="outline"
                      size="md"
                      className="flex-1 justify-center"
                    >
                      <Navigation className="h-4 w-4" aria-hidden="true" />
                      <span>Get directions</span>
                      <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                      <span className="sr-only"> (opens Google Maps in a new tab)</span>
                    </Button>
                  )}

                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => triggerAppModal("save")}
                    aria-label={`Save ${offerName} to favourites`}
                    className="text-foreground-secondary hover:text-primary"
                  >
                    <Bookmark className="h-4 w-4" aria-hidden="true" />
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={handleShare}
                    aria-label={`Share ${offerName}`}
                    className="text-foreground-secondary hover:text-primary"
                  >
                    <Share2 className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </div>

                <p className="text-xs leading-5 text-foreground-secondary">
                  Claiming and saving happen in the meelTe app. You pay the shop directly, in store.
                </p>
              </div>
            )}

            {!ad.hasEnded && (
              <DetailSteps
                id="redemption-steps-heading"
                title="How to redeem this deal"
                steps={REDEMPTION_STEPS}
                footnote="No payment is taken in the app. The price above is what you pay the merchant."
              />
            )}

            {ad.description && (
              <div className="mt-8">
                <h2 className="text-sm font-semibold text-foreground">About this offer</h2>
                <p className="mt-2 max-w-prose whitespace-pre-wrap break-words text-base leading-7 text-foreground">
                  {ad.description}
                </p>
              </div>
            )}

            {(validity || showMerchantRow) && (
              <dl className="mt-8 divide-y divide-border/60 border-y border-border/60">
                {validity && (
                  <div className="flex items-start gap-3 py-3.5">
                    <CalendarDays
                      className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                      aria-hidden="true"
                    />
                    <div className="min-w-0">
                      <dt className="text-xs font-semibold text-foreground-secondary">
                        Offer valid
                      </dt>
                      <dd className="mt-0.5 text-sm leading-6 text-foreground">{validity}</dd>
                    </div>
                  </div>
                )}

                {showMerchantRow && (
                  <div className="flex items-start gap-3 py-3.5">
                    <Store className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                    <div className="min-w-0">
                      <dt className="text-xs font-semibold text-foreground-secondary">
                        Listed by
                      </dt>
                      <dd className="mt-0.5 break-words text-sm leading-6 text-foreground">
                        {merchantName}
                      </dd>
                    </div>
                  </div>
                )}
              </dl>
            )}

            {hasEngagement && (
              <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-border/60 pt-4 text-sm text-foreground-secondary">
                {likesCount > 0 && (
                  <button
                    type="button"
                    onClick={() => triggerAppModal("default")}
                    aria-label={`${likesCount} likes — open this offer in the app`}
                    className="inline-flex items-center gap-1.5 rounded-md py-1 transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
                  >
                    <Heart className="h-4 w-4" aria-hidden="true" />
                    <span>{likesCount} likes</span>
                  </button>
                )}

                {commentsCount > 0 && (
                  <button
                    type="button"
                    onClick={() => triggerAppModal("default")}
                    aria-label={`${commentsCount} comments — open this offer in the app`}
                    className="inline-flex items-center gap-1.5 rounded-md py-1 transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
                  >
                    <MessageCircle className="h-4 w-4" aria-hidden="true" />
                    <span>{commentsCount} comments</span>
                  </button>
                )}
              </div>
            )}

            <div className="mt-8">
              <Link
                href="/ads"
                className="inline-flex items-center gap-2 rounded-sm text-sm font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                <span>Explore more offers nearby</span>
              </Link>
            </div>
          </div>
        </article>
      </Container>

      {/* Phones only: keeps the price and the primary action reachable while reading */}
      {!ad.hasEnded && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border/80 bg-surface/95 px-4 pt-2.5 pb-[calc(0.625rem+env(safe-area-inset-bottom))] backdrop-blur-md lg:hidden">
          <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-foreground">
                {finalPrice || discountLabel || offerName}
              </p>
              <p className="truncate text-[11px] text-foreground-secondary">
                {shopName || "Claim in the meelTe app"}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              {directionsHref && (
                <Button
                  as="a"
                  href={directionsHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="outline"
                  size="icon"
                  aria-label="Get directions to this shop"
                >
                  <Navigation className="h-4 w-4" aria-hidden="true" />
                </Button>
              )}

              <Button type="button" size="md" onClick={() => triggerAppModal("claim")}>
                <Tag className="h-4 w-4" aria-hidden="true" />
                <span>Claim deal</span>
              </Button>
            </div>
          </div>
        </div>
      )}

      <AppActionModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState((prev) => ({ ...prev, isOpen: false }))}
        actionType={modalState.actionType}
        offerTitle={modalState.offerTitle}
      />
    </section>
  );
}

export default AdDetail;
