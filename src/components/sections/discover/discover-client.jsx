"use client";

import React, { useState, useMemo } from "react";
import {
  UtensilsCrossed,
  Shirt,
  CalendarDays,
  Wrench,
  HeartPulse,
  Compass,
  ArrowRight,
  MapPin,
  Download,
  CheckCircle2,
  Sparkles,
  Search,
  X,
} from "@/lib/icons";
import { PLAY_STORE_URL } from "@/config/site";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { TOAST_COPY, TOAST_ID, notifyInfo } from "@/lib/toast-feedback";
import { DISCOVERY_CATEGORIES } from "./constants";

export { DISCOVERY_CATEGORIES };

const CITIES = ["All Cities", "Bengaluru", "Gaya", "Ranchi"];

/**
 * Pure filter used by both the render memo and the filter-change announcement, so the
 * spoken result count can never drift from what is actually on screen.
 */
function filterListings(listings, { categoryId, city, query }) {
  const search = query.trim().toLowerCase();

  return listings.filter((item) => {
    const matchesCategory = categoryId === "all" || item.categoryId === categoryId;
    const matchesCity = city === "All Cities" || item.city === city;
    const matchesSearch =
      !search ||
      item.title.toLowerCase().includes(search) ||
      item.location.toLowerCase().includes(search) ||
      item.tag.toLowerCase().includes(search) ||
      item.category.toLowerCase().includes(search);

    return matchesCategory && matchesCity && matchesSearch;
  });
}

export function DiscoverClient() {
  const [selectedCatId, setSelectedCatId] = useState("all");
  const [selectedCity, setSelectedCity] = useState("All Cities");
  const [searchQuery, setSearchQuery] = useState("");
  const [deepDiveCatId, setDeepDiveCatId] = useState("food");
  // Polite live region for discrete filter changes. Typing in search is NOT announced per
  // keystroke (accessibility-engineer: no per-keystroke announcement spam).
  const [filterAnnouncement, setFilterAnnouncement] = useState("");

  // Flatten all highlights for global discovery grid
  const allListings = useMemo(() => {
    return DISCOVERY_CATEGORIES.flatMap((cat) =>
      cat.highlights.map((item) => ({
        ...item,
        categoryIcon: cat.icon,
      }))
    );
  }, []);

  // Filter listings based on active category, city, and search query
  const filteredListings = useMemo(() => {
    return filterListings(allListings, {
      categoryId: selectedCatId,
      city: selectedCity,
      query: searchQuery,
    });
  }, [allListings, selectedCatId, selectedCity, searchQuery]);

  const announceFilterChange = (categoryId, city) => {
    const count = filterListings(allListings, {
      categoryId,
      city,
      query: searchQuery,
    }).length;

    if (count === 0) {
      setFilterAnnouncement("No listings match the selected filters.");
      return;
    }

    setFilterAnnouncement(
      `Showing ${count} verified offering${count === 1 ? "" : "s"}${
        city !== "All Cities" ? ` in ${city}` : ""
      }.`
    );
  };

  const resetFilters = () => {
    setSelectedCatId("all");
    setSelectedCity("All Cities");
    setSearchQuery("");
    setFilterAnnouncement("");
    notifyInfo(TOAST_COPY.filtersReset(allListings.length), {
      id: TOAST_ID.discover,
    });
  };

  const activeDeepDiveCategory =
    DISCOVERY_CATEGORIES.find((c) => c.id === deepDiveCatId) ||
    DISCOVERY_CATEGORIES[0];

  return (
    <div className="py-10 sm:py-16">
      <Container>
        {/* ── Search & Filters ── */}
        <div className="max-w-4xl mx-auto mb-10 sm:mb-12">
          <div className="relative">
            <div className="relative flex items-center">
              <Search
                className="absolute left-4 h-5 w-5 text-foreground-muted pointer-events-none"
                aria-hidden="true"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search cafes, runs, tailors, services, or localities..."
                className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-surface border border-border/80 shadow-soft text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                aria-label="Search discovery listings"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 p-1 rounded-lg text-foreground-muted hover:text-foreground hover:bg-surface-muted transition-colors"
                  aria-label="Clear search input"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs font-semibold text-foreground-secondary mr-1 flex items-center gap-1">
              <MapPin className="h-3 w-3 text-primary" aria-hidden="true" />
              City:
            </span>
            {CITIES.map((city) => (
              <button
                key={city}
                type="button"
                aria-pressed={selectedCity === city}
                onClick={() => {
                  setSelectedCity(city);
                  announceFilterChange(selectedCatId, city);
                }}
                className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-all ${
                  selectedCity === city
                    ? "bg-primary text-white border-primary shadow-2xs font-semibold"
                    : "bg-surface text-foreground-secondary border-border/80 hover:border-primary/40 hover:text-foreground"
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        </div>

        {/* Filter-change announcements (polite; exists in DOM before content is injected) */}
        <p className="sr-only" role="status" aria-live="polite">
          {filterAnnouncement}
        </p>

        {/* ── Category Filters Strip ── */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 no-scrollbar" role="tablist" aria-label="Discovery Categories">
          <button
            type="button"
            role="tab"
            aria-selected={selectedCatId === "all"}
            onClick={() => {
              setSelectedCatId("all");
              announceFilterChange("all", selectedCity);
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
              selectedCatId === "all"
                ? "bg-primary text-white border-primary shadow-soft"
                : "bg-surface text-foreground-secondary border-border/80 hover:bg-surface-subtle hover:text-foreground"
            }`}
          >
            <Sparkles className={`h-4 w-4 ${selectedCatId === "all" ? "text-white" : "text-primary"}`} aria-hidden="true" />
            <span>All Categories</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${selectedCatId === "all" ? "bg-white/20 text-white" : "bg-surface-muted text-foreground-muted"}`}>
              {allListings.length}
            </span>
          </button>

          {DISCOVERY_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCatId === cat.id;

            return (
              <button
                key={cat.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => {
                  setSelectedCatId(cat.id);
                  announceFilterChange(cat.id, selectedCity);
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
                  isSelected
                    ? "bg-primary text-white border-primary shadow-soft"
                    : "bg-surface text-foreground-secondary border-border/80 hover:bg-surface-subtle hover:text-foreground"
                }`}
              >
                <Icon className={`h-4 w-4 ${isSelected ? "text-white" : "text-primary"}`} aria-hidden="true" />
                <span>{cat.name}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${isSelected ? "bg-white/20 text-white" : "bg-surface-muted text-foreground-muted"}`}>
                  {cat.highlights.length}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── Active Result Count & Filter Reset ── */}
        <div className="flex items-center justify-between mb-6 px-1">
          <p className="text-xs sm:text-sm text-foreground-secondary">
            Showing <strong className="text-foreground font-semibold">{filteredListings.length}</strong> verified offerings{" "}
            {selectedCity !== "All Cities" && (
              <span>
                in <strong className="text-primary">{selectedCity}</strong>
              </span>
            )}
          </p>

          {(selectedCatId !== "all" || selectedCity !== "All Cities" || searchQuery) && (
            <button
              type="button"
              onClick={resetFilters}
              className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
            >
              Reset all filters
            </button>
          )}
        </div>

        {/* ── Listings Grid ── */}
        {filteredListings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 mb-16">
            {filteredListings.map((item) => {
              const Icon = item.categoryIcon;
              return (
                <div
                  key={item.id}
                  className="bg-surface rounded-2xl border border-border/80 shadow-2xs hover:shadow-card hover:border-primary/40 transition-all duration-200 p-5 flex flex-col justify-between group"
                >
                  <div>
                    {/* Category & City Pills */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-primary bg-primary/8 px-2.5 py-0.5 rounded-lg border border-primary/10">
                        <Icon className="h-3 w-3" aria-hidden="true" />
                        <span>{item.category}</span>
                      </span>
                      <span className="text-[10px] font-medium text-foreground-muted bg-surface-muted px-2 py-0.5 rounded-md">
                        {item.city}
                      </span>
                    </div>

                    {/* Listing Title */}
                    <h3 className="text-base sm:text-lg font-bold text-foreground tracking-tight group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>

                    {/* Tag / Subtitle */}
                    <p className="text-xs text-foreground-secondary font-medium mt-1">
                      {item.tag}
                    </p>

                    {/* Location with Pin */}
                    <div className="mt-2.5 flex items-center gap-1.5 text-xs text-foreground-muted">
                      <MapPin className="h-3.5 w-3.5 text-primary shrink-0" aria-hidden="true" />
                      <span className="truncate">{item.location}</span>
                    </div>
                  </div>

                  {/* Perk / Trust Footer & Action */}
                  <div className="mt-5 pt-3.5 border-t border-border/60 flex items-center justify-between gap-2">
                    <div className="text-xs text-emerald-800 font-medium flex items-center gap-1.5 truncate">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" aria-hidden="true" />
                      <span className="truncate">{item.perk}</span>
                    </div>

                    <a
                      href={PLAY_STORE_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 text-xs font-bold text-primary hover:text-primary-hover hover:underline inline-flex items-center gap-0.5"
                      aria-label={`Connect with ${item.title} on Meelte App`}
                    >
                      <span>Connect</span>
                      <ArrowRight className="h-3 w-3" aria-hidden="true" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-12 rounded-3xl bg-surface border border-border/80 text-center max-w-lg mx-auto mb-16">
            <Compass className="h-10 w-10 text-primary mx-auto mb-3" aria-hidden="true" />
            <h3 className="text-lg font-bold text-foreground">No listings found</h3>
            <p className="mt-1.5 text-xs sm:text-sm text-foreground-secondary">
              We couldn&apos;t find any offerings matching &quot;{searchQuery}&quot; in {selectedCity}. Try adjusting your keywords or clearing the category filter.
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={resetFilters}
              className="mt-4"
            >
              Reset Filters
            </Button>
          </div>
        )}

        {/* ── Featured Category Deep Dive (Original Showcase from Consumer Journey) ── */}
        <div className="mt-8 pt-12 border-t border-border/80">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                Category Deep Dive
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight mt-1">
                Explore by Category Focus
              </h2>
            </div>

            {/* Sub-tabs for Deep Dive */}
            <div className="flex flex-wrap gap-1.5">
              {DISCOVERY_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setDeepDiveCatId(cat.id)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all ${
                    deepDiveCatId === cat.id
                      ? "bg-primary text-white shadow-2xs"
                      : "bg-surface text-foreground-secondary hover:text-foreground border border-border/70"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-surface rounded-3xl border border-border/80 shadow-card p-6 sm:p-8 lg:p-10">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-border/70">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold text-primary uppercase tracking-wider">
                    {activeDeepDiveCategory.name}
                  </span>
                  <span className="text-xs text-foreground-muted">•</span>
                  <span className="text-xs text-foreground-secondary font-medium">
                    Verified Neighborhood Examples
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
                  {activeDeepDiveCategory.tagline}
                </h3>
                <p className="mt-2 text-sm text-foreground-secondary leading-relaxed max-w-2xl">
                  {activeDeepDiveCategory.description}
                </p>
              </div>

              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-surface-muted text-primary text-xs font-bold self-start lg:self-auto border border-primary/10">
                <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                <span>Direct connect with zero commission</span>
              </div>
            </div>

            {/* 3 Real Listing Samples */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-5">
              {activeDeepDiveCategory.highlights.map((item) => (
                <div
                  key={item.id}
                  className="p-5 rounded-2xl bg-canvas border border-border/70 flex flex-col justify-between hover:border-primary/30 transition-all hover:shadow-soft"
                >
                  <div>
                    <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-primary bg-surface px-2.5 py-1 rounded-md border border-primary/10 mb-2.5">
                      {item.tag}
                    </span>
                    <h4 className="font-bold text-base text-foreground tracking-tight">
                      {item.title}
                    </h4>
                    <div className="mt-1 flex items-center gap-1.5 text-xs text-foreground-secondary">
                      <MapPin className="h-3.5 w-3.5 text-primary shrink-0" aria-hidden="true" />
                      <span className="truncate">{item.location}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-border/50 text-xs text-emerald-800 font-medium flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" aria-hidden="true" />
                    <span>{item.perk}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer note inside panel */}
            <div className="mt-8 pt-5 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-foreground-secondary">
              <span>
                All listings are community-moderated and verified by physical local presence.
              </span>
              <a
                href={PLAY_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-primary hover:underline inline-flex items-center gap-1 shrink-0"
              >
                <span>Explore more {activeDeepDiveCategory.name} on Meelte App</span>
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>

        {/* ── App Download Conversion Banner ── */}
        <div className="mt-16 p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-primary to-primary-hover text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-card">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-bold bg-white/15 px-3 py-1 rounded-full mb-3">
              <Sparkles className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
              Live Proximity Radar on Mobile
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Filter by walking distance on the Meelte App
            </h3>
            <p className="mt-2 text-sm text-white/85 leading-relaxed">
              Use on-device GPS to discover offers within 1 to 5 km of your current
              location with zero privacy tracking or middleman surcharges.
            </p>
          </div>

          <Button
            as="a"
            href={PLAY_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            variant="outline"
            size="lg"
            className="bg-white text-primary border-white hover:bg-white/90 hover:text-primary-hover font-bold shadow-soft shrink-0"
          >
            <Download className="h-5 w-5" aria-hidden="true" />
            <span>Download Meelte on Play Store</span>
          </Button>
        </div>
      </Container>
    </div>
  );
}

export default DiscoverClient;

