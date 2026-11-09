"use client";

import { useState, useRef, useEffect } from "react";
import { Search, History, Calendar, User, ArrowRight } from "@/lib/icons";

const STORAGE_KEY = "meelte_recent_event_searches";
const MAX_RECENTS = 5;

export function EventSearchSuggestions({
  query = "",
  items = [],
  taxonomyGroups = [],
  isOpen = false,
  onClose,
  onSelectSearch,
  onSelectCategory,
}) {
  const containerRef = useRef(null);

  // Load recents on initial render
  const [recents, setRecents] = useState(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed.slice(0, MAX_RECENTS);
        }
      }
    } catch {
      // Safe fallback
    }
    return [];
  });

  const saveRecentSearch = (term) => {
    if (!term || typeof term !== "string" || !term.trim()) return;
    const clean = term.trim();
    setRecents((prev) => {
      const updated = [clean, ...prev.filter((item) => item.toLowerCase() !== clean.toLowerCase())].slice(
        0,
        MAX_RECENTS
      );
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // Safe fallback
      }
      return updated;
    });
  };

  const clearRecents = () => {
    setRecents([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Safe fallback
    }
  };

  useEffect(() => {
    function handlePointerDown(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        onClose?.();
      }
    }
    if (isOpen) {
      document.addEventListener("pointerdown", handlePointerDown);
      return () => document.removeEventListener("pointerdown", handlePointerDown);
    }
  }, [isOpen, onClose]);

  const cleanQ = query.trim().toLowerCase();

  const suggestions = (() => {
    if (!cleanQ) return { categories: [], hosts: [], events: [] };

    // 1. Categories
    const matchingCats = [];
    taxonomyGroups.forEach((group) => {
      if (group.label.toLowerCase().includes(cleanQ)) {
        matchingCats.push({ type: "category", label: group.label, id: group.id });
      }
      group.subcategories.forEach((sub) => {
        if (sub.label.toLowerCase().includes(cleanQ) && !matchingCats.some((c) => c.label === sub.label)) {
          matchingCats.push({ type: "category", label: sub.label, id: group.id, raw: sub.raw });
        }
      });
    });

    // 2. Hosts
    const hostMap = new Map();
    items.forEach((event) => {
      if (event.creatorName && event.creatorName.toLowerCase().includes(cleanQ)) {
        const key = event.creatorName.trim();
        hostMap.set(key, (hostMap.get(key) || 0) + 1);
      }
    });

    // 3. Event Titles
    const titleMap = new Map();
    items.forEach((event) => {
      if (event.title && event.title.toLowerCase().includes(cleanQ)) {
        const key = event.title.trim();
        titleMap.set(key, (titleMap.get(key) || 0) + 1);
      }
    });

    return {
      categories: matchingCats.slice(0, 3),
      hosts: Array.from(hostMap.entries())
        .map(([name, count]) => ({ name, count }))
        .slice(0, 3),
      events: Array.from(titleMap.entries())
        .map(([name, count]) => ({ name, count }))
        .slice(0, 4),
    };
  })();

  if (!isOpen) return null;

  const hasSuggestions =
    suggestions.categories.length > 0 ||
    suggestions.hosts.length > 0 ||
    suggestions.events.length > 0;

  return (
    <div
      ref={containerRef}
      className="absolute left-0 right-0 top-full z-40 mt-2 overflow-hidden rounded-2xl border border-border/80 bg-surface p-2 shadow-card transition-all"
    >
      {cleanQ ? (
        hasSuggestions ? (
          <div className="space-y-2 py-1 text-xs">
            {/* Category matches */}
            {suggestions.categories.length > 0 && (
              <div>
                <p className="px-3 py-1 font-semibold uppercase tracking-wider text-foreground-secondary/70">
                  Categories
                </p>
                <div className="space-y-0.5">
                  {suggestions.categories.map((cat, idx) => (
                    <button
                      key={`cat-${idx}`}
                      type="button"
                      onClick={() => {
                        saveRecentSearch(cat.label);
                        onSelectCategory?.(cat.id, cat.raw);
                        onClose?.();
                      }}
                      className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm text-foreground transition-colors hover:bg-surface-muted hover:text-primary focus-visible:outline-none focus-visible:bg-surface-muted focus-visible:text-primary"
                    >
                      <span className="flex items-center gap-2 font-medium">
                        <Calendar className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                        <span>{cat.label}</span>
                      </span>
                      <span className="text-xs text-foreground-secondary">Filter events</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Host matches */}
            {suggestions.hosts.length > 0 && (
              <div>
                <p className="px-3 py-1 font-semibold uppercase tracking-wider text-foreground-secondary/70">
                  Hosts & Organizers
                </p>
                <div className="space-y-0.5">
                  {suggestions.hosts.map((host, idx) => (
                    <button
                      key={`host-${idx}`}
                      type="button"
                      onClick={() => {
                        saveRecentSearch(host.name);
                        onSelectSearch?.(host.name);
                        onClose?.();
                      }}
                      className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm text-foreground transition-colors hover:bg-surface-muted hover:text-primary focus-visible:outline-none focus-visible:bg-surface-muted focus-visible:text-primary"
                    >
                      <span className="flex items-center gap-2 font-medium">
                        <User className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                        <span>{host.name}</span>
                      </span>
                      <span className="text-xs text-foreground-secondary">{host.count} events</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Event matches */}
            {suggestions.events.length > 0 && (
              <div>
                <p className="px-3 py-1 font-semibold uppercase tracking-wider text-foreground-secondary/70">
                  Events
                </p>
                <div className="space-y-0.5">
                  {suggestions.events.map((ev, idx) => (
                    <button
                      key={`ev-${idx}`}
                      type="button"
                      onClick={() => {
                        saveRecentSearch(ev.name);
                        onSelectSearch?.(ev.name);
                        onClose?.();
                      }}
                      className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm text-foreground transition-colors hover:bg-surface-muted hover:text-primary focus-visible:outline-none focus-visible:bg-surface-muted focus-visible:text-primary"
                    >
                      <span className="flex items-center gap-2 font-medium">
                        <Search className="h-3.5 w-3.5 text-foreground-secondary" aria-hidden="true" />
                        <span>{ev.name}</span>
                      </span>
                      <ArrowRight className="h-3 w-3 text-foreground-secondary/60" aria-hidden="true" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="px-4 py-3 text-center text-xs text-foreground-secondary">
            Press <strong className="text-foreground">Enter</strong> to search for &ldquo;{query}&rdquo;
          </div>
        )
      ) : recents.length > 0 ? (
        <div className="py-1">
          <div className="flex items-center justify-between px-3 py-1">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-foreground-secondary">
              <History className="h-3.5 w-3.5 text-foreground-secondary" aria-hidden="true" />
              Recent searches
            </span>
            <button
              type="button"
              onClick={clearRecents}
              className="text-xs font-medium text-foreground-secondary hover:text-primary hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/70"
            >
              Clear
            </button>
          </div>
          <div className="mt-1 space-y-0.5">
            {recents.map((item, idx) => (
              <button
                key={`recent-${idx}`}
                type="button"
                onClick={() => {
                  onSelectSearch?.(item);
                  onClose?.();
                }}
                className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm text-foreground transition-colors hover:bg-surface-muted hover:text-primary focus-visible:outline-none focus-visible:bg-surface-muted focus-visible:text-primary"
              >
                <span className="flex items-center gap-2">
                  <History className="h-3.5 w-3.5 text-foreground-secondary/70" aria-hidden="true" />
                  <span>{item}</span>
                </span>
                <span className="text-xs text-foreground-secondary/60">Search</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="px-4 py-3 text-center text-xs text-foreground-secondary">
          Type to search events by title, host, or category.
        </div>
      )}
    </div>
  );
}

export default EventSearchSuggestions;

