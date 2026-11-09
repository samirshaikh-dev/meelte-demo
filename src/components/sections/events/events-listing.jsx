"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Container } from "@/components/layout/container";
import { StoreButton } from "@/components/layout/store-button";
import { Button } from "@/components/ui/button";
import {
  Search,
  X,
  PlusCircle,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Check,
  ArrowUpDown,
  Calendar,
} from "@/lib/icons";
import { cn } from "@/lib/utils";
import { loadMoreEvents } from "@/utils/events/load-more-events";
import { EventCard } from "./event-card";
import { AppActionModal } from "./app-action-modal";
import {
  buildEventTaxonomyModel,
  cleanEventCategoryLabel,
  getTaxonomyGroupForEventCategory,
} from "./event-taxonomy";
import { EventFilterSheet } from "./event-filter-sheet";
import { EventSearchSuggestions } from "./search-suggestions";

const GRID_ID = "events-grid";

const EVENT_SORT_OPTIONS = [
  { value: "soonest", label: "Date: Soonest first" },
  { value: "newest", label: "Newest added" },
  { value: "cost-free", label: "Free events first" },
  { value: "cost-asc", label: "Cost: Low to High" },
  { value: "most-attendees", label: "Most attendees" },
];

/**
 * Modernized `/events` listing with:
 * - Curated 8-10 parent category taxonomy & subcategory drilling
 * - Horizontally scrolling chips with fade masks and arrow controls
 * - Bottom sheet / modal for "All categories" & multi-select filtering
 * - Search bar with live suggestions and recent searches
 * - Contextual result counts & sorting directly above the grid
 * - High-contrast WCAG 2.2 AA compliant chip styling with icons & checkmarks
 * - Sticky filter bar and keyboard accessibility
 */
export function EventsListing({
  events = [],
  categories = [],
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
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [selectedParentIds, setSelectedParentIds] = useState(["all"]);
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);
  const [sortBy, setSortBy] = useState("soonest");
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);

  // Horizontal scroll container ref
  const chipsScrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Cache fetched results per filter key in memory
  const categoryCacheRef = useRef(new Map());

  // Initialize/sync "All" category cache with props
  useEffect(() => {
    categoryCacheRef.current.set("all", {
      items: events,
      nextCursor,
    });
  }, [events, nextCursor]);

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

  // Event Taxonomy model derived from API categories and loaded items
  const taxonomyGroups = useMemo(() => {
    return buildEventTaxonomyModel(categories, items);
  }, [categories, items]);

  const totalAllCount = useMemo(() => {
    return taxonomyGroups.reduce((acc, g) => acc + g.count, 0) || items.length;
  }, [taxonomyGroups, items]);

  const updateScrollButtons = () => {
    const el = chipsScrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 5);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 5);
  };

  useEffect(() => {
    updateScrollButtons();
    window.addEventListener("resize", updateScrollButtons);
    return () => window.removeEventListener("resize", updateScrollButtons);
  }, [taxonomyGroups]);

  const scrollChips = (direction) => {
    const el = chipsScrollRef.current;
    if (!el) return;
    const amount = direction === "left" ? -240 : 240;
    el.scrollBy({ left: amount, behavior: "smooth" });
  };

  function handleParentChipClick(groupId) {
    if (groupId === "all") {
      setSelectedParentIds(["all"]);
      setSelectedSubcategories([]);
      return;
    }

    setSelectedParentIds((prev) => {
      if (prev.includes("all")) {
        return [groupId];
      }
      if (prev.includes(groupId)) {
        const next = prev.filter((id) => id !== groupId);
        const group = taxonomyGroups.find((g) => g.id === groupId);
        if (group) {
          const subKeys = new Set(group.subcategories.map((s) => s.raw));
          setSelectedSubcategories((subs) => subs.filter((s) => !subKeys.has(s)));
        }
        return next.length === 0 ? ["all"] : next;
      } else {
        return [...prev, groupId];
      }
    });
  }

  function handleSubcategoryClick(groupId, rawSub) {
    setSelectedSubcategories((prev) => {
      const exists = prev.includes(rawSub);
      const next = exists ? prev.filter((s) => s !== rawSub) : [...prev, rawSub];

      if (!exists && !selectedParentIds.includes(groupId)) {
        setSelectedParentIds((parents) =>
          parents.includes("all") ? [groupId] : [...parents, groupId]
        );
      }
      return next;
    });
  }

  const activeSingleParent = useMemo(() => {
    if (selectedParentIds.length === 1 && selectedParentIds[0] !== "all") {
      return taxonomyGroups.find((g) => g.id === selectedParentIds[0]) || null;
    }
    return null;
  }, [selectedParentIds, taxonomyGroups]);

  function removeFilterPill(filter) {
    if (filter.type === "parent") {
      handleParentChipClick(filter.id);
    } else if (filter.type === "sub") {
      setSelectedSubcategories((prev) => prev.filter((s) => s !== filter.raw));
    } else if (filter.type === "search") {
      setSearchQuery("");
    }
  }

  function handleResetFilters() {
    setSearchQuery("");
    setSelectedParentIds(["all"]);
    setSelectedSubcategories([]);
    setError("");
  }

  // Combined client filtering
  const filteredItems = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    const isAll = selectedParentIds.includes("all");

    return items.filter((event) => {
      // 1. Category matching
      if (!isAll) {
        const eventCategory = (event.category || "").toLowerCase().trim();
        const parentGroup = getTaxonomyGroupForEventCategory(eventCategory);

        if (selectedSubcategories.length > 0) {
          const matchesSub = selectedSubcategories.some((sub) => {
            return eventCategory === sub || eventCategory.includes(sub) || sub.includes(eventCategory);
          });
          if (!matchesSub) return false;
        } else {
          const matchesParent = selectedParentIds.includes(parentGroup.id);
          if (!matchesParent) return false;
        }
      }

      // 2. Search query matching
      if (q) {
        const titleMatch = event.title?.toLowerCase().includes(q);
        const hostMatch = event.creatorName?.toLowerCase().includes(q);
        const categoryMatch = event.category?.toLowerCase().includes(q);
        const locationMatch =
          event.locationName?.toLowerCase().includes(q) ||
          event.city?.toLowerCase().includes(q) ||
          event.address?.toLowerCase().includes(q);

        if (!titleMatch && !hostMatch && !categoryMatch && !locationMatch) {
          return false;
        }
      }

      return true;
    });
  }, [items, searchQuery, selectedParentIds, selectedSubcategories]);

  // Client sorting
  const sortedAndFilteredItems = useMemo(() => {
    const list = [...filteredItems];

    switch (sortBy) {
      case "newest":
        return list.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        });

      case "cost-free":
        return list.sort((a, b) => {
          const costA = a.cost || 0;
          const costB = b.cost || 0;
          if (costA === 0 && costB > 0) return -1;
          if (costB === 0 && costA > 0) return 1;
          return costA - costB;
        });

      case "cost-asc":
        return list.sort((a, b) => (a.cost || 0) - (b.cost || 0));

      case "most-attendees":
        return list.sort((a, b) => (b.attendeesCount || 0) - (a.attendeesCount || 0));

      case "soonest":
      default:
        return list.sort((a, b) => {
          const timeA = a.startTime ? new Date(a.startTime).getTime() : Infinity;
          const timeB = b.startTime ? new Date(b.startTime).getTime() : Infinity;
          return timeA - timeB;
        });
    }
  }, [filteredItems, sortBy]);

  const activeFilterPills = useMemo(() => {
    const pills = [];

    if (searchQuery.trim()) {
      pills.push({
        id: "search",
        type: "search",
        label: `"${searchQuery.trim()}"`,
      });
    }

    if (!selectedParentIds.includes("all")) {
      selectedParentIds.forEach((id) => {
        const group = taxonomyGroups.find((g) => g.id === id);
        if (group) {
          pills.push({
            id: group.id,
            type: "parent",
            label: group.label,
          });
        }
      });

      selectedSubcategories.forEach((raw) => {
        pills.push({
          id: raw,
          raw,
          type: "sub",
          label: cleanEventCategoryLabel(raw),
        });
      });
    }

    return pills;
  }, [searchQuery, selectedParentIds, selectedSubcategories, taxonomyGroups]);

  const resultSummaryText = useMemo(() => {
    const count = sortedAndFilteredItems.length;
    let categoryPart = "";

    if (!selectedParentIds.includes("all")) {
      if (selectedSubcategories.length === 1) {
        categoryPart = ` in ${cleanEventCategoryLabel(selectedSubcategories[0])}`;
      } else if (selectedParentIds.length === 1) {
        const group = taxonomyGroups.find((g) => g.id === selectedParentIds[0]);
        if (group) categoryPart = ` in ${group.label}`;
      } else {
        categoryPart = ` across ${selectedParentIds.length} categories`;
      }
    }

    const searchPart = searchQuery.trim() ? ` for "${searchQuery.trim()}"` : "";

    return `Showing ${count} ${count === 1 ? "event" : "events"}${searchPart}${categoryPart}`;
  }, [sortedAndFilteredItems.length, selectedParentIds, selectedSubcategories, taxonomyGroups, searchQuery]);

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

    const singleCategoryParam =
      selectedSubcategories.length === 1
        ? selectedSubcategories[0]
        : undefined;

    startTransition(async () => {
      const result = await loadMoreEvents({
        category: singleCategoryParam,
        beforeCreatedAt: cursor.beforeCreatedAt,
        beforeId: cursor.beforeId,
      });

      if (!result.ok) {
        setError(
          result.error === "INVALID_CURSOR"
            ? "This list could not continue from where it stopped. Reload the page to start again."
            : "Could not load more events. Please try again."
        );
        setAnnouncement("Could not load more events.");
        return;
      }

      const seen = new Set(items.map((event) => event.id));
      const fresh = result.items.filter((event) => !seen.has(event.id));
      const nextItems = [...items, ...fresh];

      setItems(nextItems);
      setCursor(result.nextCursor);

      setAnnouncement(
        fresh.length === 0
          ? "No further events were found."
          : `${fresh.length} more events loaded. ${nextItems.length} events shown.`
      );

      if (result.nextCursor) {
        setCursor(result.nextCursor);
      } else {
        focusEndOnExhaust.current = true;
        setCursor(null);
      }
    });
  }

  const showEmptyState = items.length === 0 && !cursor && !isPending;
  const isFilteringActive = activeFilterPills.length > 0;

  return (
    <section
      aria-labelledby="events-heading"
      className={cn(
        "border-b border-border/80 bg-canvas py-6 sm:py-10 lg:py-12",
        className
      )}
    >
      <Container>
        <Breadcrumbs items={breadcrumbs} className="mb-5" />

        <h2 id="events-heading" className="sr-only">
          Community events nearby
        </h2>

        {/* Top Control Bar: Toggle + Host an event button */}
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
              Please try again shortly, or browse community gatherings in the app.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <StoreButton type="google" variant="brand" />
              <StoreButton type="apple" variant="brand" />
            </div>
          </div>
        ) : showEmptyState ? (
          <div className="mt-10 rounded-2xl border border-border/80 bg-surface px-6 py-12 text-center shadow-soft">
            <p className="text-base font-semibold text-foreground">No upcoming events right now</p>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-foreground-secondary">
              New community gatherings appear here as soon as hosts create them in the app.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <StoreButton type="google" variant="brand" />
              <StoreButton type="apple" variant="brand" />
            </div>
          </div>
        ) : (
          <>
            {/* STICKY SEARCH & CATEGORY FILTER CONTROL BAR */}
            <div className="sticky top-2 z-30 mt-6 rounded-2xl border border-border/80 bg-surface/95 p-3.5 shadow-soft backdrop-blur-md transition-shadow">
              {/* Row 1: Search input + Filter Trigger */}
              <div className="relative flex items-center gap-2.5">
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
                    onFocus={() => setIsSearchFocused(true)}
                    placeholder="Search events, meetups, or hosts…"
                    autoComplete="off"
                    className="w-full rounded-xl border border-border/80 bg-canvas py-2.5 pl-10 pr-10 text-sm text-foreground placeholder:text-foreground-secondary focus:border-primary focus:bg-surface focus:outline-none focus:ring-2 focus:ring-primary/40 transition-colors"
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

                  <EventSearchSuggestions
                    query={searchQuery}
                    items={items}
                    taxonomyGroups={taxonomyGroups}
                    isOpen={isSearchFocused}
                    onClose={() => setIsSearchFocused(false)}
                    onSelectSearch={(term) => setSearchQuery(term)}
                    onSelectCategory={(groupId, rawSub) => {
                      setSelectedParentIds([groupId]);
                      if (rawSub) {
                        setSelectedSubcategories([rawSub]);
                      } else {
                        setSelectedSubcategories([]);
                      }
                    }}
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setIsFilterSheetOpen(true)}
                  aria-label="Open event filter panel"
                  className={cn(
                    "inline-flex h-10 shrink-0 items-center gap-1.5 rounded-xl border px-3.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70",
                    isFilteringActive
                      ? "border-primary bg-primary text-white shadow-2xs"
                      : "border-border/80 bg-canvas text-foreground-secondary hover:border-primary/40 hover:bg-surface-muted hover:text-primary"
                  )}
                >
                  <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden="true" />
                  <span className="hidden sm:inline">All Categories</span>
                  <span className="sm:hidden">Filters</span>
                  {activeFilterPills.length > 0 && (
                    <span
                      className={cn(
                        "ml-0.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-2xs font-bold",
                        isFilteringActive
                          ? "bg-white text-primary"
                          : "bg-primary text-white"
                      )}
                    >
                      {activeFilterPills.length}
                    </span>
                  )}
                </button>
              </div>

              {/* Row 2: HORIZONTALLY SCROLLABLE PARENT CATEGORY CHIPS */}
              <div className="relative mt-3 flex items-center border-t border-border/60 pt-2.5">
                {canScrollLeft && (
                  <button
                    type="button"
                    onClick={() => scrollChips("left")}
                    aria-label="Scroll categories left"
                    className="absolute -left-1 z-10 flex h-7 w-7 items-center justify-center rounded-full border border-border/80 bg-surface text-foreground shadow-2xs hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                )}

                <div
                  ref={chipsScrollRef}
                  onScroll={updateScrollButtons}
                  role="group"
                  aria-label="Filter events by category"
                  className="flex flex-1 items-center gap-2 overflow-x-auto scroll-smooth py-1 px-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                >
                  {(() => {
                    const isAll = selectedParentIds.includes("all");
                    return (
                      <button
                        type="button"
                        onClick={() => handleParentChipClick("all")}
                        aria-pressed={isAll}
                        className={cn(
                          "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70",
                          isAll
                            ? "border-primary bg-primary text-white shadow-xs"
                            : "border-border/80 bg-surface text-foreground-secondary hover:border-primary/40 hover:bg-surface-subtle hover:text-foreground"
                        )}
                      >
                        {isAll && (
                          <Check className="h-3 w-3 stroke-[2.5]" aria-hidden="true" />
                        )}
                        <span>All</span>
                        <span
                          className={cn(
                            "rounded-full px-1.5 py-0.2 text-2xs font-medium",
                            isAll ? "bg-white/20 text-white" : "bg-surface-muted text-foreground-secondary"
                          )}
                        >
                          {totalAllCount}
                        </span>
                      </button>
                    );
                  })()}

                  {taxonomyGroups.map((group) => {
                    const Icon = group.Icon;
                    const isActive = selectedParentIds.includes(group.id);
                    const isEmpty = group.count === 0;

                    return (
                      <button
                        key={group.id}
                        type="button"
                        onClick={() => handleParentChipClick(group.id)}
                        aria-pressed={isActive}
                        className={cn(
                          "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70",
                          isActive
                            ? "border-primary bg-primary font-semibold text-white shadow-xs"
                            : "border-border/80 bg-surface font-medium text-foreground-secondary hover:border-primary/40 hover:bg-surface-subtle hover:text-foreground",
                          isEmpty && !isActive && "opacity-60"
                        )}
                      >
                        {isActive ? (
                          <Check className="h-3 w-3 stroke-[2.5]" aria-hidden="true" />
                        ) : (
                          <Icon className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                        )}
                        <span>{group.label}</span>
                        <span
                          className={cn(
                            "rounded-full px-1.5 py-0.2 text-2xs font-medium",
                            isActive
                              ? "bg-white/20 text-white"
                              : "bg-surface-muted text-foreground-secondary"
                          )}
                        >
                          {group.count}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {canScrollRight && (
                  <button
                    type="button"
                    onClick={() => scrollChips("right")}
                    aria-label="Scroll categories right"
                    className="absolute -right-1 z-10 flex h-7 w-7 items-center justify-center rounded-full border border-border/80 bg-surface text-foreground shadow-2xs hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
                  >
                    <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                )}
              </div>

              {/* Row 3: SUBCATEGORY DRILL-DOWN ROW */}
              {activeSingleParent && activeSingleParent.subcategories.length > 1 && (
                <div className="mt-2.5 flex items-center gap-1.5 overflow-x-auto border-t border-border/60 pt-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  <span className="shrink-0 text-2xs font-semibold uppercase tracking-wider text-foreground-secondary/70 mr-1">
                    Subcategories:
                  </span>
                  {activeSingleParent.subcategories.map((sub) => {
                    const isSubSelected = selectedSubcategories.includes(sub.raw);
                    return (
                      <button
                        key={sub.raw}
                        type="button"
                        onClick={() => handleSubcategoryClick(activeSingleParent.id, sub.raw)}
                        className={cn(
                          "inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-0.5 text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70",
                          isSubSelected
                            ? "bg-primary font-semibold text-white shadow-2xs"
                            : "bg-canvas text-foreground-secondary hover:bg-surface-muted hover:text-primary"
                        )}
                      >
                        {isSubSelected && (
                          <Check className="h-3 w-3 stroke-[2.5]" aria-hidden="true" />
                        )}
                        <span>{sub.label}</span>
                        <span className="text-2xs opacity-75">({sub.count})</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Row 4: ACTIVE FILTER REMOVABLE PILLS */}
              {isFilteringActive && (
                <div className="mt-2.5 flex flex-wrap items-center gap-1.5 border-t border-border/60 pt-2 text-xs">
                  <span className="font-semibold text-foreground-secondary mr-1">Active filters:</span>
                  {activeFilterPills.map((pill) => (
                    <button
                      key={`${pill.type}-${pill.id}`}
                      type="button"
                      onClick={() => removeFilterPill(pill)}
                      aria-label={`Remove filter ${pill.label}`}
                      className="group inline-flex items-center gap-1 rounded-full border border-primary/30 bg-surface-muted px-2.5 py-0.5 text-xs font-semibold text-primary transition-colors hover:border-error hover:bg-error/10 hover:text-error focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/70"
                    >
                      <span>{pill.label}</span>
                      <X className="h-3 w-3 opacity-60 group-hover:opacity-100" aria-hidden="true" />
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="ml-auto text-xs font-semibold text-primary hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/70"
                  >
                    Clear all
                  </button>
                </div>
              )}
            </div>

            {/* RESULTS HEADER & SORTING TOOLBAR */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border/60 pb-3">
              <div
                role="status"
                aria-live="polite"
                className="text-sm font-semibold text-foreground"
              >
                <span>{resultSummaryText}</span>
              </div>

              <div className="flex items-center gap-2 text-xs text-foreground-secondary">
                <ArrowUpDown className="h-3.5 w-3.5 text-foreground-secondary shrink-0" aria-hidden="true" />
                <label htmlFor="events-sort" className="shrink-0 font-medium">
                  Sort by:
                </label>
                <select
                  id="events-sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="rounded-xl border border-border/80 bg-surface py-1.5 pl-2.5 pr-8 text-xs font-semibold text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
                >
                  {EVENT_SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* EMPTY FILTER STATE */}
            {!isPending && sortedAndFilteredItems.length === 0 ? (
              <div className="mt-8 rounded-2xl border border-dashed border-border bg-surface px-6 py-12 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-muted text-primary">
                  <Search className="h-6 w-6" aria-hidden="true" />
                </div>
                <p className="mt-4 text-base font-semibold text-foreground">
                  No events match your search criteria
                </p>
                <p className="mx-auto mt-2 max-w-sm text-sm text-foreground-secondary">
                  We couldn&rsquo;t find any events matching your current filters. Try searching for another term or clearing filters.
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 shadow-soft"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              /* EVENTS GRID */
              <ul
                id={GRID_ID}
                role="list"
                aria-busy={isPending}
                className={cn(
                  "mt-6 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-10 transition-opacity duration-200",
                  isPending && "opacity-60 pointer-events-none"
                )}
              >
                {sortedAndFilteredItems.map((event) => (
                  <li key={event.id}>
                    <EventCard event={event} onAction={handleAction} />
                  </li>
                ))}
              </ul>
            )}

            {/* PAGINATION CONTROLS */}
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

      {/* FULL GROUPED CATEGORIES MODAL & MOBILE BOTTOM SHEET */}
      <EventFilterSheet
        isOpen={isFilterSheetOpen}
        onClose={() => setIsFilterSheetOpen(false)}
        taxonomyGroups={taxonomyGroups}
        selectedParentIds={selectedParentIds.filter((id) => id !== "all")}
        selectedSubcategories={selectedSubcategories}
        totalMatchingEvents={sortedAndFilteredItems.length}
        onApplyFilters={({ parentIds, subcategories }) => {
          if (parentIds.length === 0 && subcategories.length === 0) {
            setSelectedParentIds(["all"]);
            setSelectedSubcategories([]);
          } else {
            setSelectedParentIds(parentIds);
            setSelectedSubcategories(subcategories);
          }
        }}
        onResetFilters={handleResetFilters}
      />

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
