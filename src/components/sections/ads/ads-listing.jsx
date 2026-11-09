"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Container } from "@/components/layout/container";
import { StoreButton } from "@/components/layout/store-button";
import { Button } from "@/components/ui/button";
import { ChevronDown, Search, X, PlusCircle } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { loadMoreAds } from "@/utils/ads/load-more-ads";
import { AdCard } from "./ad-card";
import { AppActionModal } from "./app-action-modal";
import { formatDisplayName } from "./ad-formatters";

const GRID_ID = "ads-grid";
const MAX_VISIBLE_CATEGORIES = 6;

/**
 * The `/ads` listing grid with live search, API category filtering, on-demand
 * pagination, and mobile app action gating.
 *
 * Browsing is open and crawlable: the first 20 offers arrive server-rendered.
 * Category filtering calls the Web API with `p_category` via Server Action.
 */
export function AdsListing({
  ads = [],
  categories = [],
  breadcrumbs = [],
  unavailable = false,
  nextCursor = null,
  showHeading = true,
  toggleControl = null,
  className,
}) {
  const [items, setItems] = useState(ads);
  const [cursor, setCursor] = useState(nextCursor);
  const [error, setError] = useState("");
  const [announcement, setAnnouncement] = useState("");
  const [isPending, startTransition] = useTransition();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showAllCategories, setShowAllCategories] = useState(false);

  // Cache fetched results per category in memory for instant switching
  const categoryCacheRef = useRef(new Map());

  // Initialize/sync "All" category cache with props
  useEffect(() => {
    categoryCacheRef.current.set("All", {
      items: ads,
      nextCursor,
    });
  }, [ads, nextCursor]);

  // App Action Modal state
  const [modalState, setModalState] = useState({
    isOpen: false,
    actionType: "default",
    offerTitle: "",
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

  /**
   * Category list derived from the API (`web_list_ad_categories`).
   * Fallback to extracting from loaded items if category endpoint data is absent.
   */
  const categoryNames = useMemo(() => {
    if (Array.isArray(categories) && categories.length > 0) {
      return categories
        .map((c) => (typeof c === "string" ? c : c?.category))
        .filter(Boolean);
    }
    const set = new Set();
    items.forEach((ad) => {
      if (ad.category) set.add(ad.category);
    });
    return Array.from(set);
  }, [categories, items]);

  const categoryGroups = useMemo(() => {
    const all = categoryNames;
    let visible = all.slice(0, MAX_VISIBLE_CATEGORIES);

    // A filter hidden behind "More" must stay reachable while it is active.
    const active = all.find(
      (name) => selectedCategory !== "All" && name.toLowerCase() === selectedCategory.toLowerCase()
    );

    if (active && !visible.includes(active)) {
      visible = [active, ...visible.slice(0, MAX_VISIBLE_CATEGORIES - 1)];
    }

    const visibleSet = new Set(visible);
    const hidden = all.filter((name) => !visibleSet.has(name));

    return {
      all,
      visible,
      hidden,
    };
  }, [categoryNames, selectedCategory]);

  function handleCategorySelect(catName) {
    if (catName === selectedCategory || isPending) return;
    setSelectedCategory(catName);
    setError("");

    // Check if we have cached results for this category
    const cached = categoryCacheRef.current.get(catName);
    if (cached) {
      setItems(cached.items);
      setCursor(cached.nextCursor);
      setAnnouncement(
        cached.items.length === 0
          ? `No offers found in ${catName}.`
          : `Showing ${cached.items.length} offers in ${catName}.`
      );
      return;
    }

    // Otherwise, fetch from API via Server Action
    startTransition(async () => {
      const result = await loadMoreAds({
        category: catName === "All" ? undefined : catName,
      });

      if (!result.ok) {
        setError("Could not load offers for this category. Please try again.");
        setAnnouncement("Could not load offers.");
        return;
      }

      setItems(result.items);
      setCursor(result.nextCursor);
      categoryCacheRef.current.set(catName, {
        items: result.items,
        nextCursor: result.nextCursor,
      });
      setAnnouncement(
        result.items.length === 0
          ? `No offers found in ${catName}.`
          : `Showing ${result.items.length} offers in ${catName}.`
      );
    });
  }

  function handleResetFilters() {
    setSearchQuery("");
    handleCategorySelect("All");
  }

  function renderCategoryChip(label) {
    const isActive = selectedCategory.toLowerCase() === label.toLowerCase();

    return (
      <button
        key={label}
        type="button"
        onClick={() => handleCategorySelect(label)}
        aria-pressed={isActive}
        className={cn(
          "shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70",
          isActive
            ? "bg-primary font-semibold text-white shadow-2xs"
            : "bg-canvas text-foreground-secondary hover:bg-surface-muted hover:text-primary"
        )}
      >
        {label === "All" ? "All" : formatDisplayName(label)}
      </button>
    );
  }

  // Client-side text search across items returned by the API
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return items;

    const q = searchQuery.toLowerCase().trim();
    return items.filter((ad) => {
      const nameMatch = ad.productName?.toLowerCase().includes(q);
      const brandMatch = ad.brandName?.toLowerCase().includes(q);
      const categoryMatch = ad.category?.toLowerCase().includes(q);
      const locationMatch = ad.locationName?.toLowerCase().includes(q);

      return nameMatch || brandMatch || categoryMatch || locationMatch;
    });
  }, [items, searchQuery]);

  function handleAction(actionType, ad) {
    setModalState({
      isOpen: true,
      actionType,
      offerTitle: ad?.productName || "",
    });
  }

  function handleLoadMore() {
    if (!cursor || isPending) return;
    setError("");

    startTransition(async () => {
      const result = await loadMoreAds({
        category: selectedCategory === "All" ? undefined : selectedCategory,
        beforeCreatedAt: cursor.beforeCreatedAt,
        beforeId: cursor.beforeId,
      });

      if (!result.ok) {
        setError(
          result.error === "INVALID_CURSOR"
            ? "This list could not continue from where it stopped. Reload the page to start again."
            : "Could not load more offers. Please try again."
        );
        setAnnouncement("Could not load more offers.");
        return;
      }

      // Guard against overlapping IDs
      const seen = new Set(items.map((ad) => ad.id));
      const fresh = result.items.filter((ad) => !seen.has(ad.id));
      const nextItems = [...items, ...fresh];

      setItems(nextItems);
      setCursor(result.nextCursor);
      categoryCacheRef.current.set(selectedCategory, {
        items: nextItems,
        nextCursor: result.nextCursor,
      });

      setAnnouncement(
        fresh.length === 0
          ? "No further offers were found."
          : `${fresh.length} more offers loaded. ${nextItems.length} offers shown.`
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
  const isFilteringActive = searchQuery.trim() !== "" || selectedCategory !== "All";

  return (
    <section
      aria-labelledby="offers-heading"
      className={cn(
        "border-b border-border/80 bg-canvas py-8 sm:py-12 lg:py-16",
        className
      )}
    >
      <Container>
        <Breadcrumbs items={breadcrumbs} className="mb-5" />

        {/* Accessible hidden heading for section aria-labelledby */}
        <h2 id="offers-heading" className="sr-only">
          Local offers nearby
        </h2>

        {/* Top Control Bar: Toggle (flex: 1 1 auto) + Add an ads button (flex: 0 0 auto) on md+, stacked on mobile */}
        <div className="flex w-full flex-col md:flex-row md:items-center gap-4">
          {toggleControl && (
            <div className="w-full md:flex-[1_1_auto] md:min-w-0">
              {toggleControl}
            </div>
          )}
          <div className="w-full md:w-auto md:flex-[0_0_auto]">
            <button
              type="button"
              onClick={() => handleAction("post", null)}
              className="inline-flex h-12 w-full md:w-auto items-center justify-center gap-1.5 whitespace-nowrap rounded-xl border border-primary/25 bg-surface-muted px-5 text-xs font-semibold text-primary transition-colors hover:border-primary/50 hover:bg-primary hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
            >
              <PlusCircle className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Add an ads</span>
            </button>
          </div>
        </div>

        {unavailable ? (
          <div className="mt-10 rounded-2xl border border-border/80 bg-surface px-6 py-12 text-center shadow-soft">
            <p className="text-base font-semibold text-foreground">
              Offers are temporarily unavailable
            </p>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-foreground-secondary">
              Please try again shortly, or browse the same offers in the app.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <StoreButton type="google" variant="brand" />
              <StoreButton type="apple" variant="brand" />
            </div>
          </div>
        ) : showEmptyState ? (
          <div className="mt-10 rounded-2xl border border-border/80 bg-surface px-6 py-12 text-center shadow-soft">
            <p className="text-base font-semibold text-foreground">No live offers right now</p>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-foreground-secondary">
              New offers appear here as soon as shops publish them in the app.
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
                  <label htmlFor="offers-search" className="sr-only">
                    Search offers by product, brand, or location
                  </label>
                  <Search
                    className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-secondary"
                    aria-hidden="true"
                  />
                  <input
                    id="offers-search"
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search offers, products, or shops…"
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

                {/* Offer count & Reset */}
                <div className="flex items-center justify-between sm:justify-end gap-3 text-xs text-foreground-secondary">
                  <span>
                    Showing <strong className="text-foreground">{filteredItems.length}</strong> of {items.length} offers
                  </span>
                  {isFilteringActive && (
                    <button
                      type="button"
                      onClick={handleResetFilters}
                      className="font-semibold text-primary hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/70"
                    >
                      Reset filters
                    </button>
                  )}
                </div>
              </div>

              {/* Category row: one scannable line, long tail behind "More" */}
              <div className="mt-3.5 flex items-center gap-2 border-t border-border/60 pt-3">
                <div className="relative min-w-0 flex-1">
                  <div
                    role="group"
                    aria-label="Filter offers by category"
                    className="flex items-center gap-1.5 overflow-x-auto pr-10 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                  >
                    {["All", ...categoryGroups.visible].map(renderCategoryChip)}
                  </div>
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-surface to-transparent"
                  />
                </div>

                {categoryGroups.hidden.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setShowAllCategories((open) => !open)}
                    aria-expanded={showAllCategories}
                    aria-controls="all-categories-panel"
                    className="inline-flex shrink-0 items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-primary transition-colors hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
                  >
                    <span>
                      {showAllCategories ? "Less" : `More (${categoryGroups.hidden.length})`}
                    </span>
                    <ChevronDown
                      className={cn(
                        "h-3.5 w-3.5 transition-transform duration-200",
                        showAllCategories && "rotate-180"
                      )}
                      aria-hidden="true"
                    />
                  </button>
                )}
              </div>

              {showAllCategories && categoryGroups.hidden.length > 0 && (
                <div
                  id="all-categories-panel"
                  className="mt-3 flex flex-wrap gap-1.5 border-t border-border/60 pt-3"
                >
                  {["All", ...categoryGroups.all].map(renderCategoryChip)}
                </div>
              )}
            </div>

            {/* Empty Filter State */}
            {!isPending && filteredItems.length === 0 ? (
              <div className="mt-10 rounded-2xl border border-dashed border-border bg-surface px-6 py-12 text-center">
                <p className="text-base font-semibold text-foreground">
                  No offers found matching your filters
                </p>
                <p className="mx-auto mt-2 max-w-sm text-sm text-foreground-secondary">
                  Try adjusting your search terms or clearing category filters to see more results.
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              /* Offers Grid */
              <ul
                id={GRID_ID}
                role="list"
                aria-busy={isPending}
                className={cn(
                  "mt-8 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-10 transition-opacity duration-200",
                  isPending && "opacity-60 pointer-events-none"
                )}
              >
                {filteredItems.map((ad, index) => (
                  <li key={ad.id}>
                    <AdCard ad={ad} priority={index < 3} onAction={handleAction} />
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
                    {isPending ? "Loading offers…" : "Load more offers"}
                  </Button>
                ) : (
                  <p
                    ref={endRef}
                    tabIndex={-1}
                    className="rounded-xl px-3 py-2 text-sm text-foreground-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2"
                  >
                    You have reached the end of the offers.
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
        offerTitle={modalState.offerTitle}
      />
    </section>
  );
}

export default AdsListing;
