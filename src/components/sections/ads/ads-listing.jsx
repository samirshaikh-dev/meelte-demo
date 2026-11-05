"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Container } from "@/components/layout/container";
import { StoreButton } from "@/components/layout/store-button";
import { Button } from "@/components/ui/button";
import { ChevronDown, MapPin, Search, X, PlusCircle } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { loadMoreAds } from "@/utils/ads/load-more-ads";
import { AdCard } from "./ad-card";
import { AppActionModal } from "./app-action-modal";
import { formatDisplayName, getListingAreaLabel } from "./ad-formatters";

const GRID_ID = "ads-grid";

// Canonical shop categories stay ahead of merchant-typed free text.
const CORE_CATEGORIES = ["Food", "Fashion", "Services", "Health"];
const MAX_VISIBLE_CATEGORIES = 6;

/**
 * The `/ads` listing grid with live search, category filtering, on-demand
 * pagination, and mobile app action gating.
 *
 * Browsing is open and crawlable: the first 20 offers arrive server-rendered.
 * In-app actions (claiming deals, chatting with shops, saving offers, or setting
 * alerts) trigger the AppActionModal directing visitors to the mobile app.
 */
export function AdsListing({
  ads = [],
  breadcrumbs,
  unavailable = false,
  nextCursor = null,
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
   * Categories ranked for a single row: canonical shop categories first, then
   * merchant-typed values by how many offers they actually carry. Free-text
   * categories the app lets shops invent are real data, but they are not
   * navigation — they belong behind "More" rather than in the first row.
   */
  const categoryGroups = useMemo(() => {
    const counts = new Map();

    items.forEach((ad) => {
      const label = formatDisplayName(ad.category);
      if (!label) return;
      counts.set(label, (counts.get(label) || 0) + 1);
    });

    const core = [];
    const other = [];

    counts.forEach((count, label) => {
      const coreIndex = CORE_CATEGORIES.findIndex(
        (name) => name.toLowerCase() === label.toLowerCase()
      );
      if (coreIndex === -1) {
        other.push([label, count]);
      } else {
        core.push([coreIndex, label, count]);
      }
    });

    core.sort((a, b) => a[0] - b[0]);
    other.sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));

    const all = [...core.map(([, label, count]) => [label, count]), ...other];
    let visible = all.slice(0, MAX_VISIBLE_CATEGORIES);

    // A filter hidden behind "More" must stay reachable while it is active.
    const active = all.find(
      ([label]) => selectedCategory !== "All" && label.toLowerCase() === selectedCategory.toLowerCase()
    );

    if (active && !visible.includes(active)) {
      visible = [active, ...visible.slice(0, MAX_VISIBLE_CATEGORIES - 1)];
    }

    const visibleLabels = new Set(visible.map(([label]) => label));

    return {
      all,
      visible,
      hidden: all.filter(([label]) => !visibleLabels.has(label)),
    };
  }, [items, selectedCategory]);

  // Where the loaded offers actually are. The API sends addresses, not
  // distances, so the page names the area instead of inventing "X km away".
  const areaLabel = useMemo(() => getListingAreaLabel(items), [items]);

  function renderCategoryChip(label) {
    const isActive = selectedCategory.toLowerCase() === label.toLowerCase();

    return (
      <button
        key={label}
        type="button"
        onClick={() => setSelectedCategory(label)}
        aria-pressed={isActive}
        className={cn(
          "shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70",
          isActive
            ? "bg-primary font-semibold text-white shadow-2xs"
            : "bg-canvas text-foreground-secondary hover:bg-surface-muted hover:text-primary"
        )}
      >
        {label}
      </button>
    );
  }

  // Client-side filtering across current items
  const filteredItems = useMemo(() => {
    return items.filter((ad) => {
      const matchesCategory =
        selectedCategory === "All" ||
        ad.category?.toLowerCase() === selectedCategory.toLowerCase();

      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase().trim();
      const nameMatch = ad.productName?.toLowerCase().includes(q);
      const brandMatch = ad.brandName?.toLowerCase().includes(q);
      const categoryMatch = ad.category?.toLowerCase().includes(q);
      const locationMatch = ad.locationName?.toLowerCase().includes(q);

      return nameMatch || brandMatch || categoryMatch || locationMatch;
    });
  }, [items, selectedCategory, searchQuery]);

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
      const result = await loadMoreAds(cursor);

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

      setItems([...items, ...fresh]);
      setAnnouncement(
        fresh.length === 0
          ? "No further offers were found."
          : `${fresh.length} more offers loaded. ${items.length + fresh.length} offers shown.`
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
      aria-labelledby="offers-heading"
      className="border-b border-border/80 bg-canvas py-8 sm:py-12 lg:py-16"
    >
      <Container>
        <Breadcrumbs items={breadcrumbs} className="mb-5" />

        {/* Header & Sub-banner */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <h1
              id="offers-heading"
              className="text-3xl font-black leading-[1.1] tracking-tight text-foreground sm:text-4xl text-balance"
            >
              Local offers nearby
            </h1>
            <p className="mt-3 text-base leading-7 text-foreground-secondary">
              Browse live offers and discounts from neighbourhood shops. Claim vouchers and chat
              directly with merchants on the meelTe mobile app.
            </p>
          </div>


          {/* Action Triggers: Host & Alerts */}
          <div className="flex flex-wrap items-center gap-2.5 pt-2 lg:pt-0">

            <button
              type="button"
              onClick={() => handleAction("post", null)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-primary/25 bg-surface-muted px-3.5 py-2 text-xs font-semibold text-primary transition-colors hover:border-primary/50 hover:bg-primary hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
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

              {/* Category row: one scannable line, long tail behind "More" */}
              <div className="mt-3.5 flex items-center gap-2 border-t border-border/60 pt-3">
                <div className="relative min-w-0 flex-1">
                  <div
                    role="group"
                    aria-label="Filter offers by category"
                    className="flex items-center gap-1.5 overflow-x-auto pr-10 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                  >
                    {["All", ...categoryGroups.visible.map(([label]) => label)].map(
                      renderCategoryChip
                    )}
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
                  {categoryGroups.all.map(([label]) => renderCategoryChip(label))}
                </div>
              )}
            </div>

            {/* Empty Filter State */}
            {filteredItems.length === 0 ? (
              <div className="mt-10 rounded-2xl border border-dashed border-border bg-surface px-6 py-12 text-center">
                <p className="text-base font-semibold text-foreground">
                  No offers found matching your filters
                </p>
                <p className="mx-auto mt-2 max-w-sm text-sm text-foreground-secondary">
                  Try adjusting your search terms or clearing category filters to see more results.
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
              /* Offers Grid */
              <ul
                id={GRID_ID}
                role="list"
                aria-busy={isPending}
                className="mt-8 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-10"
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
