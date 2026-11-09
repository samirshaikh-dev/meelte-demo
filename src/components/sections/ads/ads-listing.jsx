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
  Tag,
} from "@/lib/icons";
import { cn } from "@/lib/utils";
import { loadMoreAds } from "@/utils/ads/load-more-ads";
import { AdCard } from "./ad-card";
import { AppActionModal } from "./app-action-modal";
import {
  buildTaxonomyModel,
  cleanCategoryLabel,
  getTaxonomyGroupForCategory,
} from "./category-taxonomy";
import { CategoryFilterSheet } from "./category-filter-sheet";
import { SearchSuggestions } from "./search-suggestions";

const GRID_ID = "ads-grid";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "ending-soon", label: "Ending soon" },
  { value: "highest-discount", label: "Highest discount" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

/**
 * Modernized `/ads` listing with:
 * - Curated 8-10 parent category taxonomy & subcategory drilling
 * - Horizontally scrolling chips with fade masks and arrow controls
 * - Bottom sheet / modal for "All categories" & multi-select filtering
 * - Search bar with live suggestions and recent searches
 * - Contextual result counts & sorting directly above the grid
 * - High-contrast WCAG 2.2 AA compliant chip styling with icons & checkmarks
 * - Sticky filter bar and keyboard accessibility
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
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [selectedParentIds, setSelectedParentIds] = useState(["all"]);
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);
  const [sortBy, setSortBy] = useState("newest");
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

  // Taxonomy model derived from API categories and loaded items
  const taxonomyGroups = useMemo(() => {
    return buildTaxonomyModel(categories, items);
  }, [categories, items]);

  // Total count for "All"
  const totalAllCount = useMemo(() => {
    return taxonomyGroups.reduce((acc, g) => acc + g.count, 0) || items.length;
  }, [taxonomyGroups, items]);

  // Check scroll positions for chip container
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

  // Handle parent category click on horizontal bar
  function handleParentChipClick(groupId) {
    if (groupId === "all") {
      setSelectedParentIds(["all"]);
      setSelectedSubcategories([]);
      return;
    }

    setSelectedParentIds((prev) => {
      // If "all" was selected, replace with this group
      if (prev.includes("all")) {
        return [groupId];
      }
      // Toggle
      if (prev.includes(groupId)) {
        const next = prev.filter((id) => id !== groupId);
        // Clear subcategories of this group
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

  // Handle subcategory click
  function handleSubcategoryClick(groupId, rawSub) {
    setSelectedSubcategories((prev) => {
      const exists = prev.includes(rawSub);
      const next = exists ? prev.filter((s) => s !== rawSub) : [...prev, rawSub];

      // Ensure parent is selected
      if (!exists && !selectedParentIds.includes(groupId)) {
        setSelectedParentIds((parents) =>
          parents.includes("all") ? [groupId] : [...parents, groupId]
        );
      }
      return next;
    });
  }

  // Active single parent group for showing secondary subcategory row
  const activeSingleParent = useMemo(() => {
    if (selectedParentIds.length === 1 && selectedParentIds[0] !== "all") {
      return taxonomyGroups.find((g) => g.id === selectedParentIds[0]) || null;
    }
    return null;
  }, [selectedParentIds, taxonomyGroups]);

  // Remove a specific active filter pill
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

    return items.filter((ad) => {
      // 1. Category matching
      if (!isAll) {
        const adCategory = (ad.category || "").toLowerCase().trim();
        const parentGroup = getTaxonomyGroupForCategory(adCategory);

        // If specific subcategories are selected, must match one of them
        if (selectedSubcategories.length > 0) {
          const matchesSub = selectedSubcategories.some((sub) => {
            return adCategory === sub || adCategory.includes(sub) || sub.includes(adCategory);
          });
          if (!matchesSub) return false;
        } else {
          // Otherwise must match one of selected parent groups
          const matchesParent = selectedParentIds.includes(parentGroup.id);
          if (!matchesParent) return false;
        }
      }

      // 2. Search query matching
      if (q) {
        const nameMatch = ad.productName?.toLowerCase().includes(q);
        const brandMatch = ad.brandName?.toLowerCase().includes(q);
        const categoryMatch = ad.category?.toLowerCase().includes(q);
        const locationMatch = ad.locationName?.toLowerCase().includes(q);
        const cityMatch = ad.city?.toLowerCase().includes(q);

        if (!nameMatch && !brandMatch && !categoryMatch && !locationMatch && !cityMatch) {
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
      case "ending-soon":
        return list.sort((a, b) => {
          const dateA = a.endAt ? new Date(a.endAt).getTime() : Infinity;
          const dateB = b.endAt ? new Date(b.endAt).getTime() : Infinity;
          return dateA - dateB;
        });

      case "highest-discount":
        return list.sort((a, b) => {
          const discA = a.discountPercentage || 0;
          const discB = b.discountPercentage || 0;
          return discB - discA;
        });

      case "price-asc":
        return list.sort((a, b) => {
          const priceA = a.finalPrice ?? Infinity;
          const priceB = b.finalPrice ?? Infinity;
          return priceA - priceB;
        });

      case "price-desc":
        return list.sort((a, b) => {
          const priceA = a.finalPrice ?? -Infinity;
          const priceB = b.finalPrice ?? -Infinity;
          return priceB - priceA;
        });

      case "newest":
      default:
        return list.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        });
    }
  }, [filteredItems, sortBy]);

  // List of active filter pills for display
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
          label: cleanCategoryLabel(raw),
        });
      });
    }

    return pills;
  }, [searchQuery, selectedParentIds, selectedSubcategories, taxonomyGroups]);

  // Result context string (e.g. "Showing 12 offers in Food & Grocery")
  const resultSummaryText = useMemo(() => {
    const count = sortedAndFilteredItems.length;
    let categoryPart = "";

    if (!selectedParentIds.includes("all")) {
      if (selectedSubcategories.length === 1) {
        categoryPart = ` in ${cleanCategoryLabel(selectedSubcategories[0])}`;
      } else if (selectedParentIds.length === 1) {
        const group = taxonomyGroups.find((g) => g.id === selectedParentIds[0]);
        if (group) categoryPart = ` in ${group.label}`;
      } else {
        categoryPart = ` across ${selectedParentIds.length} categories`;
      }
    }

    const searchPart = searchQuery.trim() ? ` for "${searchQuery.trim()}"` : "";

    return `Showing ${count} ${count === 1 ? "offer" : "offers"}${searchPart}${categoryPart}`;
  }, [sortedAndFilteredItems.length, selectedParentIds, selectedSubcategories, taxonomyGroups, searchQuery]);

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

    // If a single subcategory is selected, pass it to Server Action
    const singleCategoryParam =
      selectedSubcategories.length === 1
        ? selectedSubcategories[0]
        : undefined;

    startTransition(async () => {
      const result = await loadMoreAds({
        category: singleCategoryParam,
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

      const seen = new Set(items.map((ad) => ad.id));
      const fresh = result.items.filter((ad) => !seen.has(ad.id));
      const nextItems = [...items, ...fresh];

      setItems(nextItems);
      setCursor(result.nextCursor);

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
  const isFilteringActive = activeFilterPills.length > 0;

  return (
    <section
      aria-labelledby="offers-heading"
      className={cn(
        "border-b border-border/80 bg-canvas py-6 sm:py-10 lg:py-12",
        className
      )}
    >
      <Container>
        <Breadcrumbs items={breadcrumbs} className="mb-5" />

        {/* Accessible hidden heading for section aria-labelledby */}
        <h2 id="offers-heading" className="sr-only">
          Local offers nearby
        </h2>

        {/* Top Control Bar: Toggle + Add an ads button */}
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
            {/* STICKY SEARCH & CATEGORY FILTER CONTROL BAR */}
            <div className="sticky top-2 z-30 mt-6 rounded-2xl border border-border/80 bg-surface/95 p-3.5 shadow-soft backdrop-blur-md transition-shadow">
              {/* Row 1: Search input + Mobile Filter Trigger */}
              <div className="relative flex items-center gap-2.5">
                {/* Search Field */}
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
                    onFocus={() => setIsSearchFocused(true)}
                    placeholder="Search offers, products, or shops…"
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

                  {/* Autocomplete & Recent Search suggestions */}
                  <SearchSuggestions
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

                {/* "All Categories / Filters" Trigger Button */}
                <button
                  type="button"
                  onClick={() => setIsFilterSheetOpen(true)}
                  aria-label="Open category filter panel"
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
                {/* Scroll Left Button */}
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

                {/* Scrollable Container with Fade Masks */}
                <div
                  ref={chipsScrollRef}
                  onScroll={updateScrollButtons}
                  role="group"
                  aria-label="Filter offers by category"
                  className="flex flex-1 items-center gap-2 overflow-x-auto scroll-smooth py-1 px-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                >
                  {/* "All" Category Pill */}
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
                      </button>
                    );
                  })()}

                  {/* Taxonomy Parent Category Pills */}
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
                      </button>
                    );
                  })}
                </div>

                {/* Scroll Right Button */}
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

              {/* Row 3: SECONDARY SUBCATEGORY ROW (When exactly 1 parent is selected and has subcategories) */}
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

            {/* RESULTS HEADER & SORTING TOOLBAR (Positioned directly above the grid) */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border/60 pb-3">
              {/* Dynamic Live Result Count with aria-live */}
              <div
                role="status"
                aria-live="polite"
                className="text-sm font-semibold text-foreground"
              >
                <span>{resultSummaryText}</span>
              </div>

              {/* Sort Selector Dropdown */}
              <div className="flex items-center gap-2 text-xs text-foreground-secondary">
                <ArrowUpDown className="h-3.5 w-3.5 text-foreground-secondary shrink-0" aria-hidden="true" />
                <label htmlFor="offers-sort" className="shrink-0 font-medium">
                  Sort by:
                </label>
                <select
                  id="offers-sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="rounded-xl border border-border/80 bg-surface py-1.5 pl-2.5 pr-8 text-xs font-semibold text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
                >
                  {SORT_OPTIONS.map((opt) => (
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
                  No offers match your search criteria
                </p>
                <p className="mx-auto mt-2 max-w-sm text-sm text-foreground-secondary">
                  We couldn&rsquo;t find any offers matching your current filters. Try searching for another term or clearing filters.
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
              /* OFFERS GRID */
              <ul
                id={GRID_ID}
                role="list"
                aria-busy={isPending}
                className={cn(
                  "mt-6 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-10 transition-opacity duration-200",
                  isPending && "opacity-60 pointer-events-none"
                )}
              >
                {sortedAndFilteredItems.map((ad, index) => (
                  <li key={ad.id}>
                    <AdCard ad={ad} priority={index < 3} onAction={handleAction} />
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

      {/* FULL GROUPED CATEGORIES MODAL & MOBILE BOTTOM SHEET */}
      <CategoryFilterSheet
        isOpen={isFilterSheetOpen}
        onClose={() => setIsFilterSheetOpen(false)}
        taxonomyGroups={taxonomyGroups}
        selectedParentIds={selectedParentIds.filter((id) => id !== "all")}
        selectedSubcategories={selectedSubcategories}
        totalMatchingOffers={sortedAndFilteredItems.length}
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
        offerTitle={modalState.offerTitle}
      />
    </section>
  );
}

export default AdsListing;
