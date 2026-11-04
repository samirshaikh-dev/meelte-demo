"use client";

import Image from "next/image";
import Link from "next/link";
import { Bookmark, MapPin, MessageCircle, Tag } from "@/lib/icons";
import { Badge } from "@/components/ui/badge";
import { formatPrice, getDiscountLabel } from "./ad-formatters";

/**
 * One offer card for the `/ads` listing grid.
 *
 * The card is deliberately open rather than a bordered box: the offer photo is
 * the only framed element and the text sits directly on the page canvas, so a
 * grid of offers reads as a catalogue instead of a stack of identical cards
 * (AVOID.md §2). The amber discount chip highlights the deal before the title.
 *
 * Interactive actions (Claim, Chat, Save) trigger the in-app feature modal, while
 * clicking the title or image navigates to the detailed view without nesting
 * button elements inside anchor tags.
 */
export function AdCard({ ad, priority = false, onAction }) {
  const finalPrice = formatPrice(ad.finalPrice);
  const originalPrice = formatPrice(ad.originalPrice);
  const discountLabel = getDiscountLabel(ad);
  const showOriginalPrice =
    Boolean(originalPrice) &&
    typeof ad.finalPrice === "number" &&
    typeof ad.originalPrice === "number" &&
    ad.originalPrice > ad.finalPrice;
  const metaLine = [ad.brandName, ad.category].filter(Boolean).join(" · ");
  const detailHref = `/ads/${encodeURIComponent(ad.id)}`;

  return (
    <article className="group relative flex h-full flex-col">
      {/* Framed Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border/80 bg-surface-muted transition-colors group-hover:border-primary/40">
        <Link
          href={detailHref}
          className="block h-full w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2"
          aria-label={`View details for ${ad.productName || "Local offer"}`}
        >
          {ad.photoUrl ? (
            <Image
              src={ad.photoUrl}
              alt={ad.productName || "Local offer"}
              fill
              unoptimized
              priority={priority}
              sizes="(min-width: 1024px) 32vw, (min-width: 640px) 48vw, 100vw"
              className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            />
          ) : (
            <div className="flex h-full items-center justify-center px-4 text-center text-xs text-foreground-secondary">
              No offer image was provided.
            </div>
          )}
        </Link>

        {/* Discount Badge */}
        {discountLabel && (
          <Badge
            size="sm"
            variant="accent"
            className="pointer-events-none absolute left-3 top-3 bg-accent text-accent-foreground shadow-soft"
          >
            {discountLabel}
          </Badge>
        )}

        {/* Save / Favorite Action Button */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onAction?.("save", ad);
          }}
          aria-label={`Save ${ad.productName || "offer"} to favourites`}
          className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-surface/90 text-foreground-secondary shadow-soft backdrop-blur-xs transition-colors hover:bg-surface hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
        >
          <Bookmark className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      {/* Offer Info */}
      <div className="flex flex-1 flex-col pt-3.5">
        <h2 className="line-clamp-2 text-base font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
          <Link
            href={detailHref}
            className="rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
          >
            {ad.productName || "Local offer"}
          </Link>
        </h2>

        {metaLine && (
          <p className="mt-1 truncate text-xs text-foreground-secondary">{metaLine}</p>
        )}

        {finalPrice && (
          <p className="mt-2.5 flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <span className="text-base font-bold text-foreground">{finalPrice}</span>
            {showOriginalPrice && (
              <del className="text-xs text-foreground-secondary">
                <span className="sr-only">Original price </span>
                {originalPrice}
              </del>
            )}
          </p>
        )}

        {ad.locationName && (
          <p className="mt-2 flex items-center gap-1.5 text-xs text-foreground-secondary">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden="true" />
            <span className="truncate">{ad.locationName}</span>
          </p>
        )}

        {/* Action Bar */}
        <div className="mt-auto flex items-center justify-between gap-2 border-t border-border/60 pt-3">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onAction?.("claim", ad);
            }}
            className="inline-flex items-center gap-1.5 rounded-lg bg-surface-muted px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
          >
            <Tag className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Claim deal</span>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onAction?.("chat", ad);
            }}
            className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-foreground-secondary transition-colors hover:bg-surface-muted hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
            aria-label={`Chat with merchant about ${ad.productName || "this offer"}`}
          >
            <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Chat</span>
          </button>
        </div>
      </div>
    </article>
  );
}

export default AdCard;
