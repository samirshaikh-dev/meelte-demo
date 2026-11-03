import Image from "next/image";
import { ArrowLeft, CalendarDays, Heart, MapPin, MessageCircle, Navigation, Users } from "@/lib/icons";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const remoteImageLoader = ({ src }) => src;

function formatDateTime(value) {
  const timestamp = Date.parse(value || "");
  if (Number.isNaN(timestamp)) return "";

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  }).format(new Date(timestamp));
}

function formatCost(value) {
  if (value === 0) return "FREE";
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) return "";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(value);
}

function getDirectionsHref(event) {
  if (event.lat === null || event.lng === null) return null;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${event.lat},${event.lng}`)}`;
}

export function EventDetail({ event, breadcrumbs }) {
  const directionsHref = getDirectionsHref(event);
  const start = formatDateTime(event.startTime);
  const end = formatDateTime(event.endTime);
  const cost = formatCost(event.cost);

  return (
    <section className="border-b border-border/80 bg-canvas py-6 sm:py-10 lg:py-14">
      <Container className="max-w-6xl">
        <Breadcrumbs items={breadcrumbs} className="mb-6" />

        {event.hasEnded && (
          <p
            role="status"
            className="mb-6 border-l-4 border-error bg-error/5 px-4 py-3 text-sm font-semibold text-error"
          >
            This event has ended.
          </p>
        )}

        <article className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(20rem,0.9fr)] lg:items-start lg:gap-12">
          <div>
            {event.coverUrl ? (
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border/80 bg-surface shadow-soft">
                <Image
                  src={event.coverUrl}
                  loader={remoteImageLoader}
                  alt={event.title || "Community event"}
                  fill
                  priority
                  unoptimized
                  sizes="(min-width: 1024px) 55vw, 100vw"
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="flex aspect-[4/3] items-center justify-center rounded-2xl border border-border/80 bg-surface-muted px-6 text-center text-sm text-foreground-secondary">
                No event cover image was provided.
              </div>
            )}
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              {event.category && <Badge variant="primary">{event.category}</Badge>}
              {cost && <Badge variant={event.cost === 0 ? "success" : "accent"}>{cost}</Badge>}
            </div>

            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              {event.title || "Community event"}
            </h1>

            {event.description && (
              <p className="mt-6 whitespace-pre-wrap break-words text-base leading-7 text-foreground-secondary">
                {event.description}
              </p>
            )}

            <dl className="mt-8 space-y-5 border-t border-border/80 pt-6">
              {(start || end) && (
                <div className="flex items-start gap-3">
                  <CalendarDays className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                  <div>
                    <dt className="text-sm font-semibold text-foreground">Event time</dt>
                    <dd className="mt-1 text-sm text-foreground-secondary">
                      {start && end ? `${start} – ${end}` : start || end}
                    </dd>
                  </div>
                </div>
              )}

              {(event.locationName || event.address) && (
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                  <div>
                    <dt className="text-sm font-semibold text-foreground">Location</dt>
                    <dd className="mt-1 whitespace-pre-wrap text-sm leading-6 text-foreground-secondary">
                      {[event.locationName, event.address].filter(Boolean).join("\n")}
                    </dd>
                  </div>
                </div>
              )}

              {event.creatorName && (
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-surface-muted text-xs font-bold text-primary" aria-hidden="true">
                    {event.creatorName.charAt(0).toUpperCase()}
                  </span>
                  <div>
                    <dt className="text-sm font-semibold text-foreground">Hosted by</dt>
                    <dd className="mt-1 text-sm text-foreground-secondary">{event.creatorName}</dd>
                  </div>
                </div>
              )}

              {event.attendeesCount !== null && (
                <div className="flex items-start gap-3">
                  <Users className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                  <div>
                    <dt className="text-sm font-semibold text-foreground">Attendees</dt>
                    <dd className="mt-1 text-sm text-foreground-secondary">{event.attendeesCount}</dd>
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

            {(event.likesCount !== null || event.commentsCount !== null) && (
              <div className="mt-7 flex flex-wrap gap-4 text-sm text-foreground-secondary" aria-label="Event activity">
                {event.likesCount !== null && (
                  <span className="inline-flex items-center gap-1.5">
                    <Heart className="h-4 w-4" aria-hidden="true" />
                    {event.likesCount} likes
                  </span>
                )}
                {event.commentsCount !== null && (
                  <span className="inline-flex items-center gap-1.5">
                    <MessageCircle className="h-4 w-4" aria-hidden="true" />
                    {event.commentsCount} comments
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

export default EventDetail;
