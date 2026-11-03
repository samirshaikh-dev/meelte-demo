import Image from "next/image";
import { ArrowLeft, CalendarDays, Heart, MapPin, MessageCircle, Navigation } from "@/lib/icons";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate, formatPrice, getDiscountLabel } from "./ad-formatters";

const remoteImageLoader = ({ src }) => src;

function getDirectionsHref(ad) {
  if (ad.lat === null || ad.lng === null) return null;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${ad.lat},${ad.lng}`)}`;
}

function DateRange({ ad }) {
  const start = formatDate(ad.startAt);
  const end = formatDate(ad.endAt);
  if (!start && !end) return null;

  return (
    <div className="flex items-start gap-3">
      <CalendarDays className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
      <div>
        <dt className="text-sm font-semibold text-foreground">Offer dates</dt>
        <dd className="mt-1 text-sm text-foreground-secondary">
          {start && end ? `${start} – ${end}` : start || end}
        </dd>
      </div>
    </div>
  );
}

export function AdDetail({ ad, breadcrumbs }) {
  const directionsHref = getDirectionsHref(ad);
  const finalPrice = formatPrice(ad.finalPrice);
  const originalPrice = formatPrice(ad.originalPrice);
  const discountLabel = getDiscountLabel(ad);

  return (
    <section className="border-b border-border/80 bg-canvas py-6 sm:py-10 lg:py-14">
      <Container className="max-w-6xl">
        <Breadcrumbs items={breadcrumbs} className="mb-6" />

        {ad.hasEnded && (
          <p
            role="status"
            className="mb-6 border-l-4 border-error bg-error/5 px-4 py-3 text-sm font-semibold text-error"
          >
            This offer has ended.
          </p>
        )}

        <article className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(20rem,0.9fr)] lg:items-start lg:gap-12">
          <div>
            {ad.photoUrl ? (
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border/80 bg-surface shadow-soft">
                <Image
                  src={ad.photoUrl}
                  loader={remoteImageLoader}
                  alt={ad.productName || "Local offer"}
                  fill
                  priority
                  unoptimized
                  sizes="(min-width: 1024px) 55vw, 100vw"
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="flex aspect-[4/3] items-center justify-center rounded-2xl border border-border/80 bg-surface-muted px-6 text-center text-sm text-foreground-secondary">
                No offer image was provided.
              </div>
            )}
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              {ad.category && <Badge variant="primary">{ad.category}</Badge>}
              {discountLabel && <Badge variant="accent">{discountLabel}</Badge>}
            </div>

            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              {ad.productName || "Local offer"}
            </h1>

            {ad.brandName && (
              <p className="mt-2 text-lg font-semibold text-foreground-secondary">{ad.brandName}</p>
            )}

            {finalPrice && (
              <div className="mt-6 flex flex-wrap items-baseline gap-3">
                <span className="text-3xl font-extrabold text-primary">{finalPrice}</span>
                {originalPrice && ad.originalPrice > (ad.finalPrice ?? -1) && (
                  <del className="text-base text-foreground-secondary">{originalPrice}</del>
                )}
              </div>
            )}

            {ad.description && (
              <p className="mt-6 whitespace-pre-wrap break-words text-base leading-7 text-foreground-secondary">
                {ad.description}
              </p>
            )}

            <dl className="mt-8 space-y-5 border-t border-border/80 pt-6">
              <DateRange ad={ad} />

              {ad.locationName && (
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                  <div>
                    <dt className="text-sm font-semibold text-foreground">Location</dt>
                    <dd className="mt-1 text-sm text-foreground-secondary">{ad.locationName}</dd>
                  </div>
                </div>
              )}

              {ad.createdBy && (
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-surface-muted text-xs font-bold text-primary" aria-hidden="true">
                    {ad.createdBy.charAt(0).toUpperCase()}
                  </span>
                  <div>
                    <dt className="text-sm font-semibold text-foreground">Posted by</dt>
                    <dd className="mt-1 text-sm text-foreground-secondary">{ad.createdBy}</dd>
                  </div>
                </div>
              )}
            </dl>

            <div className="mt-8 flex flex-wrap gap-3">
              {directionsHref && (
                <Button as="a" href={directionsHref} target="_blank" rel="noopener noreferrer">
                  <Navigation className="h-4 w-4" aria-hidden="true" />
                  <span>Get directions</span>
                </Button>
              )}
              <Button as="a" href="/" variant="outline">
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                <span>Explore meelTe</span>
              </Button>
            </div>

            {(ad.likesCount !== null || ad.commentsCount !== null) && (
              <div className="mt-7 flex flex-wrap gap-4 text-sm text-foreground-secondary" aria-label="Offer activity">
                {ad.likesCount !== null && (
                  <span className="inline-flex items-center gap-1.5">
                    <Heart className="h-4 w-4" aria-hidden="true" />
                    {ad.likesCount} likes
                  </span>
                )}
                {ad.commentsCount !== null && (
                  <span className="inline-flex items-center gap-1.5">
                    <MessageCircle className="h-4 w-4" aria-hidden="true" />
                    {ad.commentsCount} comments
                  </span>
                )}
              </div>
            )}
          </div>
        </article>
      </Container>
    </section>
  );
}

export default AdDetail;
