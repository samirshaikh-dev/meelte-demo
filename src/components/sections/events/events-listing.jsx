"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Container } from "@/components/layout/container";
import { StoreButton } from "@/components/layout/store-button";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { loadMoreEvents } from "@/actions/events/load-more-events";
import { EventCard } from "./event-card";

const GRID_ID = "events-grid";

/**
 * The `/events` listing grid with on-demand pagination.
 *
 * The first page is server-rendered and passed in as `events`, so the initial 20
 * events are present in the prerendered HTML and stay crawlable. Further pages
 * are appended by the `loadMoreEvents` Server Action (`app/api/**` is forbidden by
 * `AI_RULE.md` §2.1), which keeps the anon key server-side.
 *
 * Four states are rendered rather than thrown: a live grid, an honest empty
 * state, a temporary-unavailable state when the read-only API cannot be
 * reached, and an inline retry when a "load more" round-trip fails.
 */
export function EventsListing({
  events = [],
  breadcrumbs,
  unavailable = false,
  nextCursor = null,
}) {
  const [items, setItems] = useState(events);
  const [cursor, setCursor] = useState(nextCursor);
  const [error, setError] = useState("");
  const [announcement, setAnnouncement] = useState("");
  const [isPending, startTransition] = useTransition();

  const endRef = useRef(null);
  const focusEndOnExhaust = useRef(false);

  // When the last page arrives the button unmounts, which would drop focus to
  // <body> and send the next Tab back to the top of the document. Move focus to
  // the end-of-list message instead — but only when the user actually loaded a
  // page, never on first paint.
  useEffect(() => {
    if (focusEndOnExhaust.current && !cursor) {
      focusEndOnExhaust.current = false;
      endRef.current?.focus();
    }
  }, [cursor]);

  function handleLoadMore() {
    if (!cursor || isPending) return;
    setError("");

    startTransition(async () => {
      const result = await loadMoreEvents(cursor);

      if (!result.ok) {
        setError(
          result.error === "INVALID_CURSOR"
            ? "This list could not continue from where it stopped. Reload the page to start again."
            : "Could not load more events. Please try again."
        );
        setAnnouncement("Could not load more events.");
        return;
      }

      // Guard against a cursor that overlaps the previous page, so a repeated
      // id can never render twice or duplicate a React key.
      const seen = new Set(items.map((event) => event.id));
      const fresh = result.items.filter((event) => !seen.has(event.id));

      setItems([...items, ...fresh]);
      setAnnouncement(
        fresh.length === 0
          ? "No further events were found."
          : `${fresh.length} more events loaded. ${items.length + fresh.length} events shown.`
      );

      if (result.nextCursor) {
        setCursor(result.nextCursor);
      } else {
        focusEndOnExhaust.current = true;
        setCursor(null);
      }
    });
  }

  const showEmptyState = items.length === 0 && !cursor;

  return (
    <section className="border-b border-border/80 bg-canvas py-6 sm:py-10 lg:py-14">
      <Container className="max-w-6xl">
        <Breadcrumbs items={breadcrumbs} className="mb-6" />

        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Community events nearby
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-foreground-secondary">
          Live events, meetups and gatherings organized by community hosts on the meelTe app. Open one for the full details.
        </p>

        {unavailable ? (
          <div className="mt-8 rounded-2xl border border-border/80 bg-surface p-8 text-center">
            <p className="text-base font-semibold text-foreground">
              Events are temporarily unavailable
            </p>
            <p className="mt-2 text-sm text-foreground-secondary">
              Please try again shortly, or explore community events in the app.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <StoreButton type="google" variant="brand" />
              <StoreButton type="apple" variant="brand" />
            </div>
          </div>
        ) : showEmptyState ? (
          <div className="mt-8 rounded-2xl border border-border/80 bg-surface p-8 text-center">
            <p className="text-base font-semibold text-foreground">No live events right now</p>
            <p className="mt-2 text-sm text-foreground-secondary">
              New community gatherings appear here as soon as hosts publish them in the app.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <StoreButton type="google" variant="brand" />
              <StoreButton type="apple" variant="brand" />
            </div>
          </div>
        ) : (
          <>
            <ul
              id={GRID_ID}
              role="list"
              aria-busy={isPending}
              className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
            >
              {items.map((event, index) => (
                <li key={event.id}>
                  <EventCard event={event} priority={index < 3} />
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-col items-center gap-3">
              {cursor ? (
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={handleLoadMore}
                  aria-disabled={isPending}
                  aria-controls={GRID_ID}
                  className={cn(isPending && "cursor-progress opacity-60")}
                >
                  {isPending ? "Loading events…" : "Load more events"}
                </Button>
              ) : (
                <p
                  ref={endRef}
                  tabIndex={-1}
                  className="rounded-xl px-3 py-2 text-sm text-foreground-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2"
                >
                  You have reached the end of the events.
                </p>
              )}

              {error ? (
                <p
                  role="alert"
                  className="rounded-xl border-l-4 border-error bg-error/5 px-4 py-3 text-sm font-semibold text-error"
                >
                  {error}
                </p>
              ) : null}
            </div>
          </>
        )}

        <p role="status" className="sr-only">
          {announcement}
        </p>
      </Container>
    </section>
  );
}

export default EventsListing;

