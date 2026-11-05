"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Container } from "@/components/layout/container";
import { StoreButton } from "@/components/layout/store-button";
import { Button } from "@/components/ui/button";
import { Bell, CalendarDays, PlusCircle, Search, Sparkles, X } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { loadMoreEvents } from "@/utils/events/load-more-events";
import { EventCard } from "./event-card";
import { AppActionModal } from "./app-action-modal";

const GRID_ID = "events-grid";

const CORE_CATEGORIES = ["All", "Social", "Sports", "Music", "Workshops", "Community"];

/**
 * The `/events` listing grid with live search, category filtering, on-demand
 * pagination, and mobile app action gating.
 *
 * Browsing is open and crawlable: the first 20 events arrive server-rendered.
 * In-app actions (requesting to join, messaging hosts, saving events, or hosting)
 * trigger the AppActionModal directing visitors to the mobile app.
 */
export function EventsListing({
  events = [],
  breadcrumbs = [],
  unavailable = false,
  nextCursor = null,
  showHeading = true,
  toggleControl = null,
  className,
}) {
  const [items, setItems] = useState(events);
  const [cursor, setCursor] = useState(nextCursor);
  const [error, setError] = useState("");
  const [announcement, setAnnouncement] = useState("");
  const [isPending, startTransition] = useTransition();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // App Action Modal state
  const [modalState, setModalState] = useState({
    isOpen: false,
    actionType: "default",
    eventTitle: "",
  });

  const endRef = useRef(null);
  const focusEndOnExhaust = useRef(false);

  // When the last page arrives the button unmounts. Move focus to end message.
  useEffect(() => {
    if (focusEndOnExhaust.current && !cursor) {
      focusEndOnExhaust.current = false;
      endRef.current?.focus();
    }
  }, [cursor]);

  // Compute available categories dynamically from incoming items
  const categories = useMemo(() => {
    const fromItems = new Set();
    items.forEach((event) => {
      if (event.category) {
        fromItems.add(event.category.trim());
      }
    });
    const combined = [...CORE_CATEGORIES];
    fromItems.forEach((cat) => {
      if (!combined.some((c) => c.toLowerCase() === cat.toLowerCase())) {
        combined.push(cat);
      }
    });
    return combined;
  }, [items]);

  // Client-side filtering across current items
  const filteredItems = useMemo(() => {
    return items.filter((event) => {
      const matchesCategory =
        selectedCategory === "All" ||
        event.category?.toLowerCase() === selectedCategory.toLowerCase();

      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase().trim();
      const titleMatch = event.title?.toLowerCase().includes(q);
      const hostMatch = event.creatorName?.toLowerCase().includes(q);
      const categoryMatch = event.category?.toLowerCase().includes(q);
      const locationMatch =
        event.locationName?.toLowerCase().includes(q) ||
        event.city?.toLowerCase().includes(q);

      return titleMatch || hostMatch || categoryMatch || locationMatch;
    });
  }, [items, selectedCategory, searchQuery]);

  function handleAction(actionType, event) {
    setModalState({
      isOpen: true,
      actionType,
      eventTitle: event?.title || "",
    });
  }

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

      // Guard against overlapping IDs
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
  const isFilteringActive = searchQuery.trim() !== "" || selectedCategory !== "All";

  return (
    <section
      aria-labelledby="events-heading"
      className={cn(
        "border-b border-border/80 bg-canvas py-8 sm:py-12 lg:py-16",
        className
      )}
    >
      <Container>
        <Breadcrumbs items={breadcrumbs} className="mb-5" />

        {/* Accessible hidden heading for section aria-labelledby */}
        <h2 id="events-heading" className="sr-only">
          Community events nearby
        </h2>

        {/* Top Control Bar: Toggle (flex: 1 1 auto) + Host an event button (flex: 0 0 auto) on md+, stacked on mobile */}
        <div className="flex w-full flex-col md:flex-row md:items-center gap-4">
          {toggleControl && (
            <div className="w-full md:flex-[1_1_auto] md:min-w-0">
              {toggleControl}
            </div>
          )}
          <div className="w-full md:w-auto md:flex-[0_0_auto]">
            <button
              type="button"
              onClick={() => handleAction("host", null)}
              className="inline-flex h-12 w-full md:w-auto items-center justify-center gap-1.5 whitespace-nowrap rounded-xl border border-primary/25 bg-surface-muted px-5 text-xs font-semibold text-primary transition-colors hover:border-primary/50 hover:bg-primary hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
            >
              <PlusCircle className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Host an event</span>
            </button>
          </div>
        </div>

        {unavailable ? (
          <div className="mt-10 rounded-2xl border border-border/80 bg-surface px-6 py-12 text-center shadow-soft">
            <p className="text-base font-semibold text-foreground">
              Events are temporarily unavailable
            </p>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-foreground-secondary">
              Please try again shortly, or explore community events in the app.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <StoreButton type="google" variant="brand" />
              <StoreButton type="apple" variant="brand" />
            </div>
          </div>
        ) : showEmptyState ? (
          <div className="mt-10 rounded-2xl border border-border/80 bg-surface px-6 py-12 text-center shadow-soft">
            <p className="text-base font-semibold text-foreground">No live events right now</p>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-foreground-secondary">
              New community gatherings appear here as soon as hosts publish them in the app.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <StoreButton type="google" variant="brand" />
              <StoreButton type="apple" variant="brand" />
            </div>
          </div>
        ) : (
          <>
            {/* Search and Category Filters Bar */}
            <div className="mt-8 rounded-2xl border border-border/80 bg-surface p-4 shadow-soft">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                {/* Search Input */}
                <div className="relative flex-1">
                  <label htmlFor="events-search" className="sr-only">
                    Search events by title, host, or location
                  </label>
                  <Search
                    className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-secondary"
                    aria-hidden="true"
                  />
                  <input
                    id="events-search"
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search events, activities, or hosts…"
                    className="w-full rounded-xl border border-border/80 bg-canvas py-2.5 pl-10 pr-10 text-sm text-foreground placeholder:text-foreground-secondary focus:border-primary focus:bg-surface focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      aria-label="Clear search input"
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-foreground-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
                    >
                      <X className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  )}
                </div>

                {/* Event count & Reset */}
                <div className="flex items-center justify-between sm:justify-end gap-3 text-xs text-foreground-secondary">
                  <span>
                    Showing <strong className="text-foreground">{filteredItems.length}</strong> of {items.length} events
                  </span>
                  {isFilteringActive && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedCategory("All");
                      }}
                      className="font-semibold text-primary hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/70"
                    >
                      Reset filters
                    </button>
                  )}
                </div>
              </div>

              {/* Category Pills */}
              <div className="mt-3.5 flex flex-wrap items-center gap-1.5 border-t border-border/60 pt-3">
                <span className="text-xs font-semibold text-foreground-secondary mr-1">
                  Categories:
                </span>
                {categories.map((cat) => {
                  const isActive = selectedCategory.toLowerCase() === cat.toLowerCase();
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={cn(
                        "rounded-full px-3 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70",
                        isActive
                          ? "bg-primary text-white shadow-2xs font-semibold"
                          : "bg-canvas text-foreground-secondary hover:bg-surface-muted hover:text-primary"
                      )}
                      aria-pressed={isActive}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Empty Filter State */}
            {filteredItems.length === 0 ? (
              <div className="mt-10 rounded-2xl border border-dashed border-border bg-surface px-6 py-12 text-center">
                <p className="text-base font-semibold text-foreground">
                  No events found matching your filters
                </p>
                <p className="mx-auto mt-2 max-w-sm text-sm text-foreground-secondary">
                  Try adjusting your search terms or clearing category filters to find upcoming
                  gatherings.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("All");
                  }}
                  className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              /* Events Grid */
              <ul
                id={GRID_ID}
                role="list"
                aria-busy={isPending}
                className="mt-8 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-10"
              >
                {filteredItems.map((event, index) => (
                  <li key={event.id}>
                    <EventCard event={event} priority={index < 3} onAction={handleAction} />
                  </li>
                ))}
              </ul>
            )}

            {/* Pagination Controls */}
            {!isFilteringActive && (
              <div className="mt-12 flex flex-col items-center gap-3">
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
            )}
          </>
        )}

        <p role="status" className="sr-only">
          {announcement}
        </p>
      </Container>

      {/* Mobile App Promotion Modal */}
      <AppActionModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState((prev) => ({ ...prev, isOpen: false }))}
        actionType={modalState.actionType}
        eventTitle={modalState.eventTitle}
      />
    </section>
  );
}

export default EventsListing;
