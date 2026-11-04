"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Bookmark,
  CalendarDays,
  CheckCircle2,
  Clock,
  Heart,
  MapPin,
  MessageCircle,
  Navigation,
  Share2,
  ShieldCheck,
  Sparkles,
  Store,
  Tag,
} from "@/lib/icons";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { notifySuccess } from "@/lib/toast-feedback";
import { formatDate, formatPrice, getDiscountLabel } from "./ad-formatters";
import { AppActionModal } from "./app-action-modal";

const remoteImageLoader = ({ src }) => src;

function getDirectionsHref(ad) {
  if (ad.lat === null || ad.lng === null) return null;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${ad.lat},${ad.lng}`)}`;
}

/**
 * Offer detail view grounded in buyer psychology (psychology.md) and strict
 * anti-pattern design principles (AVOID.md).
 *
 * Sells confidence by addressing buyer questions upfront:
 * 1. "What is the deal and how much do I save?" (Visual price calculation)
 * 2. "How do I redeem it?" (3-step clear, predictable redemption process)
 * 3. "Where is the shop?" (Direct directions and address details)
 * 4. "Is it verified?" (Local merchant credentials and offline settlement honesty)
 *
 * Interactive in-app actions trigger the AppActionModal with store links.
 */
export function AdDetail({ ad, breadcrumbs }) {
  const [modalState, setModalState] = useState({
    isOpen: false,
    actionType: "default",
    offerTitle: ad?.productName || "",
  });

  const directionsHref = getDirectionsHref(ad);
  const finalPrice = formatPrice(ad.finalPrice);
  const originalPrice = formatPrice(ad.originalPrice);
  const discountLabel = getDiscountLabel(ad);
  const startDate = formatDate(ad.startAt);
  const endDate = formatDate(ad.endAt);

  const savingsAmount =
    typeof ad.originalPrice === "number" &&
    typeof ad.finalPrice === "number" &&
    ad.originalPrice > ad.finalPrice
      ? formatPrice(ad.originalPrice - ad.finalPrice)
      : null;

  function triggerAppModal(actionType) {
    setModalState({
      isOpen: true,
      actionType,
      offerTitle: ad?.productName || "Local offer",
    });
  }

  function handleShare() {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (navigator?.share) {
      navigator
        .share({
          title: ad.productName || "Local offer on meelTe",
          text: `Check out this offer on meelTe: ${ad.productName || "Local offer"} from ${ad.brandName || "a local shop"}`,
          url,
        })
        .catch(() => {});
    } else if (navigator?.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        notifySuccess("Offer link copied to clipboard!");
      });
    }
  }

  return (
    <section className="border-b border-border/80 bg-canvas py-6 sm:py-10 lg:py-14">
      <Container className="max-w-6xl">
        <Breadcrumbs items={breadcrumbs} className="mb-6" />

        {/* Expiry Notification */}
        {ad.hasEnded ? (
          <div
            role="status"
            className="mb-6 flex items-start gap-3 rounded-xl border border-error/30 bg-error/5 p-4 text-sm text-error"
          >
            <Clock className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
            <div>
              <p className="font-semibold">This offer has expired</p>
              <p className="mt-0.5 text-xs text-error/90">
                This promotion is no longer active. You can browse other live deals currently available
                nearby.
              </p>
            </div>
          </div>
        ) : null}

        <article className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(20rem,0.85fr)] lg:items-start lg:gap-12">
          {/* Left Column: Visual Media & Merchant Card */}
          <div className="flex flex-col gap-6">
            {/* Offer Image */}
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border/80 bg-surface shadow-soft">
              {ad.photoUrl ? (
                <Image
                  src={ad.photoUrl}
                  loader={remoteImageLoader}
                  alt={ad.productName || "Local offer photo"}
                  fill
                  priority
                  unoptimized
                  sizes="(min-width: 1024px) 55vw, 100vw"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center p-8 text-center text-sm text-foreground-secondary">
                  No offer photo provided by the shopkeeper.
                </div>
              )}

              {/* Discount Ribbon */}
              {discountLabel && (
                <Badge
                  variant="accent"
                  className="absolute left-3.5 top-3.5 bg-accent text-accent-foreground shadow-soft text-xs font-bold"
                >
                  {discountLabel}
                </Badge>
              )}
            </div>

            {/* Merchant Credibility & Location Panel */}
            <div className="rounded-2xl border border-border/80 bg-surface p-5 shadow-soft">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-surface-muted text-primary shadow-soft">
                    <Store className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-foreground">
                      {ad.brandName || "Local neighbourhood merchant"}
                    </h2>
                    <p className="text-xs text-foreground-secondary">
                      {ad.category || "Retail & Shopping"}
                    </p>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-surface-muted px-2 py-0.5 text-[10px] font-semibold text-primary">
                  <ShieldCheck className="h-3 w-3" aria-hidden="true" />
                  <span>Local Shop</span>
                </span>
              </div>

              {ad.locationName && (
                <div className="mt-4 flex items-start gap-2.5 border-t border-border/60 pt-3.5 text-xs text-foreground-secondary">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                  <span className="leading-relaxed">{ad.locationName}</span>
                </div>
              )}

              <div className="mt-4 flex flex-wrap gap-2 pt-1">
                {directionsHref && (
                  <Button
                    as="a"
                    href={directionsHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="outline"
                    size="sm"
                    className="flex-1 justify-center gap-1.5 text-xs"
                  >
                    <Navigation className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Get directions</span>
                  </Button>
                )}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => triggerAppModal("chat")}
                  className="flex-1 justify-center gap-1.5 text-xs text-foreground-secondary hover:text-primary"
                >
                  <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Message shop</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Right Column: Offer Specifications & Conversion */}
          <div className="min-w-0 flex flex-col">
            {/* Category and Badges */}
            <div className="flex flex-wrap items-center gap-2">
              {ad.category && (
                <Badge variant="primary" className="text-xs">
                  {ad.category}
                </Badge>
              )}
              {endDate && !ad.hasEnded && (
                <span className="inline-flex items-center gap-1 rounded-md bg-canvas px-2.5 py-1 text-xs font-medium text-foreground-secondary border border-border/60">
                  <CalendarDays className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                  <span>Valid till {endDate}</span>
                </span>
              )}
            </div>

            {/* Title & Brand */}
            <h1 className="mt-3.5 text-2xl font-black tracking-tight text-foreground sm:text-3xl lg:text-4xl">
              {ad.productName || "Local offer"}
            </h1>

            {ad.brandName && (
              <p className="mt-1.5 text-base font-semibold text-foreground-secondary">
                By <strong className="text-foreground">{ad.brandName}</strong>
              </p>
            )}

            {/* Price Box with Savings Highlight */}
            {finalPrice && (
              <div className="mt-5 rounded-2xl border border-border/80 bg-surface p-4 shadow-soft">
                <span className="text-xs font-semibold uppercase tracking-wider text-foreground-secondary">
                  Exclusive Offer Price
                </span>
                <div className="mt-1 flex flex-wrap items-baseline gap-3">
                  <span className="text-3xl font-black text-primary">{finalPrice}</span>
                  {originalPrice && ad.originalPrice > (ad.finalPrice ?? -1) && (
                    <del className="text-base text-foreground-secondary">
                      <span className="sr-only">Original price </span>
                      {originalPrice}
                    </del>
                  )}
                  {savingsAmount && (
                    <span className="rounded-full bg-accent/15 px-2.5 py-0.5 text-xs font-bold text-accent-foreground border border-accent/30">
                      Save {savingsAmount}
                    </span>
                  )}
                </div>

                {/* Primary Conversion Action Area */}
                <div className="mt-4 flex flex-col gap-2.5 sm:flex-row sm:items-center">
                  <Button
                    type="button"
                    onClick={() => triggerAppModal("claim")}
                    size="lg"
                    className="flex-1 justify-center bg-primary text-white hover:bg-primary-hover shadow-soft font-bold"
                  >
                    <Tag className="h-4 w-4" aria-hidden="true" />
                    <span>Claim deal in app</span>
                  </Button>

                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => triggerAppModal("save")}
                      aria-label="Save to favourites"
                      className="h-11 w-11 p-0 justify-center text-foreground-secondary hover:text-primary"
                    >
                      <Bookmark className="h-4 w-4" aria-hidden="true" />
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleShare}
                      aria-label="Share this offer"
                      className="h-11 w-11 p-0 justify-center text-foreground-secondary hover:text-primary"
                    >
                      <Share2 className="h-4 w-4" aria-hidden="true" />
                    </Button>
                  </div>
                </div>
                <p className="mt-2 text-center text-[11px] text-foreground-secondary">
                  Available for in-store redemption on Android & iOS
                </p>
              </div>
            )}

            {/* Description */}
            {ad.description && (
              <div className="mt-6">
                <h2 className="text-sm font-bold uppercase tracking-wider text-foreground-secondary">
                  Offer Details
                </h2>
                <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-relaxed text-foreground">
                  {ad.description}
                </p>
              </div>
            )}

            {/* How to Redeem - Clear Process Guidance (psychology.md) */}
            <section
              aria-labelledby="redemption-steps-heading"
              className="mt-8 rounded-2xl border border-border/80 bg-surface p-5 shadow-soft"
            >
              <h2
                id="redemption-steps-heading"
                className="flex items-center gap-2 text-sm font-bold text-foreground"
              >
                <CheckCircle2 className="h-4 w-4 text-primary" aria-hidden="true" />
                <span>How to redeem this deal</span>
              </h2>

              <ol className="mt-3.5 grid gap-3 sm:grid-cols-3">
                <li className="flex flex-col rounded-xl border border-border/60 bg-canvas p-3">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    1
                  </span>
                  <h3 className="mt-1.5 text-xs font-bold text-foreground">Claim Voucher</h3>
                  <p className="mt-0.5 text-[11px] leading-4 text-foreground-secondary">
                    Open the meelTe app to claim your deal voucher code.
                  </p>
                </li>
                <li className="flex flex-col rounded-xl border border-border/60 bg-canvas p-3">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    2
                  </span>
                  <h3 className="mt-1.5 text-xs font-bold text-foreground">Visit Store</h3>
                  <p className="mt-0.5 text-[11px] leading-4 text-foreground-secondary">
                    Use Google Maps directions to visit the physical store.
                  </p>
                </li>
                <li className="flex flex-col rounded-xl border border-border/60 bg-canvas p-3">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    3
                  </span>
                  <h3 className="mt-1.5 text-xs font-bold text-foreground">Pay in Store</h3>
                  <p className="mt-0.5 text-[11px] leading-4 text-foreground-secondary">
                    Show voucher at checkout & pay the merchant directly.
                  </p>
                </li>
              </ol>

              <div className="mt-3.5 border-t border-border/60 pt-3 text-[11px] text-foreground-secondary flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden="true" />
                <span>No upfront app payment required. All transactions happen directly with the merchant.</span>
              </div>
            </section>

            {/* Offer Meta Information List */}
            <dl className="mt-6 space-y-4 border-t border-border/80 pt-6 text-xs text-foreground-secondary">
              {(startDate || endDate) && (
                <div className="flex items-start gap-3">
                  <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                  <div>
                    <dt className="font-semibold text-foreground">Offer validity</dt>
                    <dd className="mt-0.5">
                      {startDate && endDate ? `${startDate} – ${endDate}` : startDate || endDate}
                    </dd>
                  </div>
                </div>
              )}

              {ad.createdBy && (
                <div className="flex items-start gap-3">
                  <Store className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                  <div>
                    <dt className="font-semibold text-foreground">Merchant</dt>
                    <dd className="mt-0.5">{ad.createdBy}</dd>
                  </div>
                </div>
              )}
            </dl>

            {/* Community Activity Feedback */}
            {(ad.likesCount !== null || ad.commentsCount !== null) && (
              <div
                className="mt-6 flex flex-wrap items-center gap-4 border-t border-border/60 pt-4 text-xs text-foreground-secondary"
                aria-label="Offer community engagement"
              >
                {ad.likesCount !== null && (
                  <button
                    type="button"
                    onClick={() => triggerAppModal("default")}
                    className="inline-flex items-center gap-1.5 hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/70 rounded-md py-1"
                  >
                    <Heart className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>{ad.likesCount} likes</span>
                  </button>
                )}
                {ad.commentsCount !== null && (
                  <button
                    type="button"
                    onClick={() => triggerAppModal("default")}
                    className="inline-flex items-center gap-1.5 hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/70 rounded-md py-1"
                  >
                    <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>{ad.commentsCount} comments</span>
                  </button>
                )}
              </div>
            )}

            {/* Back to all offers */}
            <div className="mt-8 pt-4">
              <Link
                href="/ads"
                className="inline-flex items-center gap-2 text-xs font-semibold text-primary hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/70"
              >
                <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Explore more offers nearby</span>
              </Link>
            </div>
          </div>
        </article>

        {/* Mobile Fixed Bottom Action Bar */}
        <div className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-between border-t border-border/80 bg-surface/95 px-4 py-3 backdrop-blur-md shadow-card md:hidden">
          <div>
            <span className="block text-xs font-bold text-primary">{finalPrice || "Offer"}</span>
            {discountLabel && (
              <span className="text-[10px] font-semibold text-foreground-secondary">
                {discountLabel}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {directionsHref && (
              <Button
                as="a"
                href={directionsHref}
                target="_blank"
                rel="noopener noreferrer"
                variant="outline"
                size="sm"
                className="h-9 px-3 text-xs"
              >
                <Navigation className="h-3.5 w-3.5" aria-hidden="true" />
                <span className="sr-only">Directions</span>
              </Button>
            )}
            <Button
              type="button"
              onClick={() => triggerAppModal("claim")}
              size="sm"
              className="h-9 bg-primary text-white text-xs font-bold"
            >
              <Tag className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Claim deal</span>
            </Button>
          </div>
        </div>
      </Container>

      {/* Action Gating App Promotion Modal */}
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
