"use client";

import Image from "next/image";
import Link from "next/link";
import { Bookmark, MapPin, Tag } from "@/lib/icons";
import { Badge } from "@/components/ui/badge";
import { formatDisplayName, getAreaLabel, getDealBadge } from "./ad-formatters";

export function AdCard({ ad, priority = false, onAction }) {
  const offerName = formatDisplayName(ad.productName) || "Local offer";
  const shopName = formatDisplayName(ad.brandName);
  const categoryLabel = formatDisplayName(ad.category);
  const areaLabel = getAreaLabel(ad);
  const dealBadge = getDealBadge(ad);
  const detailHref = `/ads/${encodeURIComponent(ad.id)}`;

  return (
    <article className="group relative flex h-full flex-col">
      {/* Framed Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-border/80 bg-surface-muted transition-colors group-hover:border-primary/40">
        <Link
          href={detailHref}
          className="relative block h-full w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2"
          aria-label={`View details for ${offerName}`}
        >
          {ad.photoUrl ? (
            <Image
              src={ad.photoUrl}
              alt={offerName}
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

          {/* Unifies uneven merchant photos and holds the overlay labels readable */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 via-black/25 to-transparent"
          />
        </Link>

        {/* Deal Value: the reason to click, visible before any scrolling */}
        {dealBadge && (
          <Badge
            size="sm"
            variant="accent"
            className="pointer-events-none absolute left-3 top-3 max-w-[75%] truncate bg-accent text-accent-foreground shadow-soft"
          >
            {dealBadge}
          </Badge>
        )}

        {/* Category and area: the two facts that make an offer local and findable */}
        <div className="pointer-events-none absolute inset-x-3 bottom-3 flex items-end justify-between gap-2">
          {categoryLabel ? (
            <span className="max-w-[60%] truncate rounded-lg bg-black/45 px-2 py-0.5 text-[11px] font-semibold text-white ring-1 ring-white/25 ring-inset">
              {categoryLabel}
            </span>
          ) : (
            <span aria-hidden="true" />
          )}

          {areaLabel ? (
            <span className="inline-flex max-w-[55%] items-center gap-1 rounded-lg bg-black/45 px-2 py-0.5 text-[11px] font-medium text-white ring-1 ring-white/25 ring-inset">
              <MapPin className="h-3 w-3 shrink-0" aria-hidden="true" />
              <span className="truncate">{areaLabel}</span>
            </span>
          ) : (
            <span aria-hidden="true" />
          )}
        </div>
      </div>

      {/* Offer Info */}
      <div className="flex flex-1 flex-col pt-3">
        {shopName && (
          <p className="truncate text-xs font-semibold text-foreground-secondary">{shopName}</p>
        )}

        <h2 className="mt-1 line-clamp-2 text-base font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
          <Link
            href={detailHref}
            className="rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
          >
            {offerName}
          </Link>
        </h2>

        {/* Action Bar */}
        <div className="mt-auto pt-3">
          <div className="border-t border-border/60 pt-3">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onAction?.("claim", ad);
              }}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-surface-muted py-2 text-xs font-semibold text-primary transition-colors hover:bg-primary hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
            >
              <Tag className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Claim deal</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

export default AdCard;
