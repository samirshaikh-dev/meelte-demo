import Image from "next/image";
import Link from "next/link";
import { CalendarDays, MapPin } from "@/lib/icons";
import { Badge } from "@/components/ui/badge";
import { formatCost, formatDateTime } from "./event-formatters";

/**
 * One event card for the `/events` listing grid.
 *
 * The whole card is a single link so the grid is one tab stop per event and the
 * accessible name comes from the card's own content. Nothing inside the card is
 * independently interactive, so no nested controls are introduced.
 *
 * `unoptimized` keeps the upstream `cover_url` untouched: these images are
 * already CDN-hosted and the event list is prerendered, so a custom `loader`
 * function cannot be passed across the server/client boundary here.
 */
export function EventCard({ event, priority = false }) {
  const costLabel = formatCost(event.cost);
  const startDateTime = formatDateTime(event.startTime);

  return (
    <Link
      href={`/events/${encodeURIComponent(event.id)}`}
      className="group block h-full rounded-2xl border border-border/80 bg-surface shadow-soft transition-colors hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2"
    >
      <article className="flex h-full flex-col">
        <div className="relative aspect-[4/3] overflow-hidden rounded-t-2xl bg-surface-muted">
          {event.coverUrl ? (
            <Image
              src={event.coverUrl}
              alt={event.title || "Community event"}
              fill
              unoptimized
              priority={priority}
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center px-4 text-center text-xs text-foreground-secondary">
              No event cover image was provided.
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-2 p-4">
          {(event.category || costLabel) && (
            <div className="flex flex-wrap gap-1.5">
              {event.category && (
                <Badge size="sm" variant="primary">
                  {event.category}
                </Badge>
              )}
              {costLabel && (
                <Badge size="sm" variant={event.cost === 0 ? "success" : "accent"}>
                  {costLabel}
                </Badge>
              )}
            </div>
          )}

          <h2 className="line-clamp-2 text-base font-bold leading-snug text-foreground transition-colors group-hover:text-primary">
            {event.title || "Community event"}
          </h2>

          {event.creatorName && (
            <p className="truncate text-sm text-foreground-secondary">
              Hosted by {event.creatorName}
            </p>
          )}

          <div className="mt-auto space-y-1.5 pt-2">
            {startDateTime && (
              <p className="flex items-center gap-1.5 text-xs text-foreground-secondary">
                <CalendarDays className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden="true" />
                <span className="truncate">{startDateTime}</span>
              </p>
            )}

            {(event.locationName || event.city) && (
              <p className="flex items-center gap-1.5 text-xs text-foreground-secondary">
                <MapPin className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden="true" />
                <span className="truncate">
                  {event.locationName || [event.city, event.state].filter(Boolean).join(", ")}
                </span>
              </p>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}

export default EventCard;

