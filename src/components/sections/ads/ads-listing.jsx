"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Container } from "@/components/layout/container";
import { StoreButton } from "@/components/layout/store-button";
import { Button } from "@/components/ui/button";
import { Bell, Search, Sparkles, Store, X } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { loadMoreAds } from "@/actions/ads/load-more-ads";
import { AdCard } from "./ad-card";
import { AppActionModal } from "./app-action-modal";

const GRID_ID = "ads-grid";

const CORE_CATEGORIES = ["All", "Food", "Fashion", "Services", "Health"];

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

  // Compute available categories dynamically from incoming items combined with core categories
  const categories = useMemo(() => {
    const fromItems = new Set();
    items.forEach((ad) => {
      if (ad.category) {
        fromItems.add(ad.category.trim());
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
      <Container className="max-w-6xl">
        <Breadcrumbs items={breadcrumbs} className="mb-5" />

        {/* Header & Sub-banner */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">

            <h1
              id="offers-heading"
              className="text-3xl font-black leading-[1.1] tracking-tight text-foreground sm:text-4xl"
            >
              Local offers nearby
            </h1>
            <p className="mt-3 text-base leading-7 text-foreground-secondary">
              Browse live offers and discounts from neighbourhood shops. Claim vouchers and chat
              directly with merchants on the meelTe mobile app.
            </p>
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
