"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, Check, Search, RotateCcw } from "@/lib/icons";
import { cn } from "@/lib/utils";

export function EventFilterSheet({
  isOpen = false,
  onClose,
  taxonomyGroups = [],
  selectedParentIds = [],
  selectedSubcategories = [],
  onApplyFilters,
  onResetFilters,
  totalMatchingEvents = 0,
}) {
  const [draftParents, setDraftParents] = useState(selectedParentIds);
  const [draftSubs, setDraftSubs] = useState(selectedSubcategories);
  const [filterQuery, setFilterQuery] = useState("");

  const handleOpenChange = (open) => {
    if (open) {
      setDraftParents(selectedParentIds);
      setDraftSubs(selectedSubcategories);
      setFilterQuery("");
    } else {
      onClose?.();
    }
  };

  const toggleParent = (groupId) => {
    setDraftParents((prev) => {
      if (prev.includes(groupId)) {
        const group = taxonomyGroups.find((g) => g.id === groupId);
        if (group) {
          const groupSubKeys = new Set(group.subcategories.map((s) => s.raw));
          setDraftSubs((currentSubs) => currentSubs.filter((s) => !groupSubKeys.has(s)));
        }
        return prev.filter((id) => id !== groupId);
      } else {
        return [...prev, groupId];
      }
    });
  };

  const toggleSubcategory = (groupId, rawSub) => {
    setDraftSubs((prev) => {
      const exists = prev.includes(rawSub);
      const next = exists ? prev.filter((s) => s !== rawSub) : [...prev, rawSub];

      if (!exists && !draftParents.includes(groupId)) {
        setDraftParents((p) => [...p, groupId]);
      }
      return next;
    });
  };

  const handleApply = () => {
    onApplyFilters?.({
      parentIds: draftParents,
      subcategories: draftSubs,
    });
    onClose?.();
  };

  const handleReset = () => {
    setDraftParents([]);
    setDraftSubs([]);
    onResetFilters?.();
    onClose?.();
  };

  const q = filterQuery.toLowerCase().trim();
  const visibleGroups = taxonomyGroups.filter((g) => {
    if (!q) return true;
    const matchGroup = g.label.toLowerCase().includes(q);
    const matchSub = g.subcategories.some((s) => s.label.toLowerCase().includes(q));
    return matchGroup || matchSub;
  });

  const totalSelectedCount = draftParents.length + draftSubs.length;

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-xs transition-opacity duration-150 ease-out starting:opacity-0" />

        <Dialog.Content className="fixed inset-x-0 bottom-0 z-50 flex max-h-[85vh] w-full flex-col rounded-t-3xl border-t border-border/80 bg-surface p-0 shadow-card transition duration-150 ease-out starting:translate-y-8 sm:inset-x-auto sm:bottom-auto sm:left-1/2 sm:top-1/2 sm:max-h-[85vh] sm:w-[92vw] sm:max-w-2xl sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-2xl sm:border sm:border-border/80 sm:starting:translate-y-0 sm:starting:scale-95 focus-visible:outline-none">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border/80 px-6 py-4">
            <div>
              <Dialog.Title className="text-lg font-bold text-foreground sm:text-xl">
                Filter Events by Category
              </Dialog.Title>
              <Dialog.Description className="text-xs text-foreground-secondary">
                Select one or more categories to filter upcoming community events
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <button
                type="button"
                aria-label="Close event filters"
                className="flex h-9 w-9 items-center justify-center rounded-xl text-foreground-secondary transition-colors hover:bg-surface-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </Dialog.Close>
          </div>

          {/* Search within categories */}
          <div className="border-b border-border/60 px-6 py-3">
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-foreground-secondary"
                aria-hidden="true"
              />
              <input
                type="text"
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                placeholder="Find an event category or activity…"
                className="w-full rounded-xl border border-border/80 bg-canvas py-2 pl-9 pr-8 text-xs text-foreground placeholder:text-foreground-secondary focus:border-primary focus:bg-surface focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
              {filterQuery && (
                <button
                  type="button"
                  onClick={() => setFilterQuery("")}
                  aria-label="Clear category search"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-foreground-secondary hover:text-foreground"
                >
                  <X className="h-3 w-3" aria-hidden="true" />
                </button>
              )}
            </div>
          </div>

          {/* Grouped Categories List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {visibleGroups.length === 0 ? (
              <div className="py-8 text-center text-xs text-foreground-secondary">
                No categories match &ldquo;{filterQuery}&rdquo;.
              </div>
            ) : (
              visibleGroups.map((group) => {
                const Icon = group.Icon;
                const isParentSelected = draftParents.includes(group.id);
                const hasSubSelected = group.subcategories.some((s) => draftSubs.includes(s.raw));
                const isGroupActive = isParentSelected || hasSubSelected;

                return (
                  <div
                    key={group.id}
                    className={cn(
                      "rounded-xl border p-3.5 transition-colors",
                      isGroupActive
                        ? "border-primary/40 bg-surface-subtle"
                        : "border-border/80 bg-surface hover:border-border"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => toggleParent(group.id)}
                        className="flex flex-1 items-center gap-2.5 text-left focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/70 rounded-lg p-0.5"
                      >
                        <div
                          className={cn(
                            "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition-colors",
                            isParentSelected
                              ? "border-primary bg-primary text-white"
                              : "border-border/80 bg-surface-muted text-primary"
                          )}
                        >
                          {isParentSelected ? (
                            <Check className="h-4 w-4 stroke-[2.5]" aria-hidden="true" />
                          ) : (
                            <Icon className="h-4 w-4" aria-hidden="true" />
                          )}
                        </div>
                        <div>
                          <span className="text-sm font-semibold text-foreground">
                            {group.label}
                          </span>
                          <span className="ml-2 inline-flex items-center rounded-full bg-surface-muted px-2 py-0.5 text-2xs font-semibold text-primary">
                            {group.count}
                          </span>
                        </div>
                      </button>
                    </div>

                    {group.subcategories.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5 border-t border-border/60 pt-2.5">
                        {group.subcategories.map((sub) => {
                          const isSubSelected = draftSubs.includes(sub.raw);
                          return (
                            <button
                              key={sub.raw}
                              type="button"
                              onClick={() => toggleSubcategory(group.id, sub.raw)}
                              className={cn(
                                "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70",
                                isSubSelected
                                  ? "bg-primary font-semibold text-white shadow-2xs"
                                  : "bg-canvas text-foreground-secondary hover:bg-surface-muted hover:text-primary"
                              )}
                            >
                              {isSubSelected && (
                                <Check className="h-3 w-3 stroke-[2.5]" aria-hidden="true" />
                              )}
                              <span>{sub.label}</span>
                              <span
                                className={cn(
                                  "text-2xs",
                                  isSubSelected ? "text-white/80" : "text-foreground-secondary/70"
                                )}
                              >
                                ({sub.count})
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between border-t border-border/80 bg-surface px-6 py-4">
            <button
              type="button"
              onClick={handleReset}
              disabled={totalSelectedCount === 0}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-foreground-secondary hover:text-error transition-colors disabled:opacity-40 disabled:hover:text-foreground-secondary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/70"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Reset all</span>
            </button>

            <button
              type="button"
              onClick={handleApply}
              className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-white shadow-soft transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
            >
              Apply filters {totalMatchingEvents > 0 ? `(${totalMatchingEvents} events)` : ""}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default EventFilterSheet;

