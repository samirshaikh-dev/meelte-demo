import Image from "next/image";
import Link from "next/link";
import { MapPin } from "@/lib/icons";
import { Badge } from "@/components/ui/badge";
import { formatPrice, getDiscountLabel } from "./ad-formatters";

/**
 * One offer card for the `/ads` listing grid.
 *
 * The whole card is a single link so the grid is one tab stop per offer and the
 * accessible name comes from the card's own content. Nothing inside the card is
 * independently interactive, so no nested controls are introduced.
 *
 * `unoptimized` keeps the upstream `photo_url` untouched: these images are
 * already CDN-hosted and the offer list is prerendered, so a custom `loader`
 * function cannot be passed across the server/client boundary here.
 */
export function AdCard({ ad, priority = false }) {
  const finalPrice = formatPrice(ad.finalPrice);
  const originalPrice = formatPrice(ad.originalPrice);
  const discountLabel = getDiscountLabel(ad);
  const showOriginalPrice =
    Boolean(originalPrice) &&
    typeof ad.finalPrice === "number" &&
    typeof ad.originalPrice === "number" &&
    ad.originalPrice > ad.finalPrice;

  return (
    <Link
      href={`/ads/${encodeURIComponent(ad.id)}`}
      className="group block h-full rounded-2xl border border-border/80 bg-surface shadow-soft transition-colors hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2"
    >
      <article className="flex h-full flex-col">
        <div className="relative aspect-[4/3] overflow-hidden rounded-t-2xl bg-surface-muted">
          {ad.photoUrl ? (
            <Image
              src={ad.photoUrl}
              alt={ad.productName || "Local offer"}
              fill
              unoptimized
              priority={priority}
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center px-4 text-center text-xs text-foreground-secondary">
              No offer image was provided.
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-2 p-4">
          {(ad.category || discountLabel) && (
            <div className="flex flex-wrap gap-1.5">
              {ad.category && (
                <Badge size="sm" variant="primary">
                  {ad.category}
                </Badge>
              )}
              {discountLabel && (
                <Badge size="sm" variant="accent">
                  {discountLabel}
                </Badge>
              )}
            </div>
          )}

          <h2 className="line-clamp-2 text-base font-bold leading-snug text-foreground transition-colors group-hover:text-primary">
            {ad.productName || "Local offer"}
          </h2>

          {ad.brandName && (
            <p className="truncate text-sm text-foreground-secondary">{ad.brandName}</p>
          )}

          {finalPrice && (
            <p className="mt-auto flex flex-wrap items-baseline gap-2 pt-2">
              <span className="text-lg font-extrabold text-primary">{finalPrice}</span>
              {showOriginalPrice && (
                <del className="text-xs text-foreground-secondary">{originalPrice}</del>
              )}
            </p>
          )}

          {ad.locationName && (
            <p className="flex items-center gap-1.5 text-xs text-foreground-secondary">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden="true" />
              <span className="truncate">{ad.locationName}</span>
            </p>
          )}
        </div>
      </article>
    </Link>
  );
}

export default AdCard;
