"use client";

import Image from "next/image";
import Link from "next/link";
import { Bookmark, CalendarDays, MapPin, MessageCircle, Users } from "@/lib/icons";
import { Badge } from "@/components/ui/badge";
import { formatCost, formatDateTime } from "./event-formatters";

/**
 * One event card for the `/events` listing grid.
 *
 * Matches the `/ads` offer card: the cover photo is the only framed element and
 * the text sits directly on the page canvas, so the grid reads as a programme
 * rather than a stack of identical boxes (AVOID.md §2). The cost chip is the
 * primary accent — amber for a paid event, green for a free one.
 *
 * Interactive actions (Request to Join, Message Host, Save) trigger the in-app
 * action modal, while clicking the title or image navigates to the detailed view.
 */
export function EventCard({ event, priority = false, onAction }) {
  const costLabel = formatCost(event.cost);
  const startDateTime = formatDateTime(event.startTime);
  const isFree = event.cost === 0;
  const metaLine = [event.creatorName && `Hosted by ${event.creatorName}`, event.category]
    .filter(Boolean)
    .join(" · ");
  const place = event.locationName || [event.city, event.state].filter(Boolean).join(", ");
  const detailHref = `/events/${encodeURIComponent(event.id)}`;

  return (
    <article className="group relative flex h-full flex-col">
      {/* Framed Cover Photo Container */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border/80 bg-surface-muted transition-colors group-hover:border-primary/40">
        <Link
          href={detailHref}
          className="block h-full w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2"
          aria-label={`View details for ${event.title || "Community event"}`}
        >
          {event.coverUrl ? (
            <Image
              src={event.coverUrl}
              alt={event.title || "Community event"}
              fill
              unoptimized
              priority={priority}
              sizes="(min-width: 1024px) 32vw, (min-width: 640px) 48vw, 100vw"
              className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            />
          ) : (
            <div className="flex h-full items-center justify-center px-4 text-center text-xs text-foreground-secondary">
              No event cover image was provided.
            </div>
          )}
        </Link>

        {/* Cost Badge */}
        {costLabel && (
          <Badge
            size="sm"
            variant={isFree ? "success" : "accent"}
            className={
              isFree
                ? "pointer-events-none absolute left-3 top-3 border-transparent bg-success text-white shadow-soft"
                : "pointer-events-none absolute left-3 top-3 bg-accent text-accent-foreground shadow-soft"
            }
          >
            {costLabel}
          </Badge>
        )}

        {/* Save / Bookmark Button */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onAction?.("save", event);
          }}
          aria-label={`Save ${event.title || "event"} to favourites`}
          className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-surface/90 text-foreground-secondary shadow-soft backdrop-blur-xs transition-colors hover:bg-surface hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
        >
          <Bookmark className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      {/* Event Details */}
      <div className="flex flex-1 flex-col pt-3.5">
        <h2 className="line-clamp-2 text-base font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
          <Link
            href={detailHref}
            className="rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
          >
            {event.title || "Community event"}
          </Link>
        </h2>

        {metaLine && (
          <p className="mt-1 truncate text-xs text-foreground-secondary">{metaLine}</p>
        )}

        <div className="mt-auto space-y-1.5 pt-3">
          {startDateTime && (
            <p className="flex items-center gap-1.5 text-xs text-foreground-secondary">
              <CalendarDays className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden="true" />
              <span className="truncate">{startDateTime}</span>
            </p>
          )}

          {place && (
            <p className="flex items-center gap-1.5 text-xs text-foreground-secondary">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden="true" />
              <span className="truncate">{place}</span>
            </p>
          )}
        </div>

        {/* Action Bar */}
        <div className="mt-4 flex items-center justify-between gap-2 border-t border-border/60 pt-3">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onAction?.("join", event);
            }}
            className="inline-flex items-center gap-1.5 rounded-lg bg-surface-muted px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
          >
            <Users className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Request to join</span>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onAction?.("chat", event);
            }}
            className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-foreground-secondary transition-colors hover:bg-surface-muted hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
            aria-label={`Message host about ${event.title || "this event"}`}
          >
            <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Message</span>
          </button>
        </div>
      </div>
    </article>
  );
}

export default EventCard;
