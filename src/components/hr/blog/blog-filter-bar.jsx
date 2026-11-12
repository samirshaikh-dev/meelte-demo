"use client";

import React from "react";
import { Search, ChevronDown } from "@/lib/icons";
import { BLOG_POST_CATEGORIES } from "@/constants/blog-constants";

/** Category options for the filter select — "All Categories" matches every post. */
const CATEGORY_FILTER_OPTIONS = ["All Categories", ...BLOG_POST_CATEGORIES];

/** Status tabs mirroring the lowercase BLOG_STATUSES values. */
const BLOG_STATUS_TABS = ["All", "Published", "Draft", "Archived"];

export function BlogFilterBar({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  statusFilter,
  onStatusChange,
  blogPosts = [],
}) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-4 shadow-soft">
      {/* Controls Row: Search & Category Dropdown */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-muted"
          />
          <input
            type="text"
            placeholder="Search stories by title or tag..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Search blog stories"
            className="h-10 w-full rounded-xl border border-border bg-surface pl-10 pr-3.5 text-xs sm:text-sm text-foreground placeholder:text-foreground-secondary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 transition-colors"
          />
        </div>

        {/* Category Dropdown */}
        <div className="relative w-full sm:w-56 shrink-0">
          <label htmlFor="blog-category-filter" className="sr-only">
            Filter by category
          </label>
          <select
            id="blog-category-filter"
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full appearance-none h-10 rounded-xl border border-border bg-surface pl-3 pr-9 text-xs sm:text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 transition-colors cursor-pointer"
          >
            {CATEGORY_FILTER_OPTIONS.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <ChevronDown
            aria-hidden="true"
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-muted"
          />
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 border-t border-border/80 pt-2.5 mt-0.5">
        {BLOG_STATUS_TABS.map((st) => {
          const isSelected =
            statusFilter.toLowerCase() === st.toLowerCase();
          const count =
            st === "All"
              ? blogPosts.length
              : blogPosts.filter(
                  (p) => (p.status || "").toLowerCase() === st.toLowerCase()
                ).length;

          return (
            <button
              key={st}
              type="button"
              onClick={() => onStatusChange(st)}
              className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 ${
                isSelected
                  ? "bg-primary text-white font-semibold"
                  : "bg-transparent text-foreground-secondary hover:bg-surface-muted/60 hover:text-foreground font-medium"
              }`}
            >
              <span>{st}</span>
              <span
                className={`rounded-full px-1.5 py-0.5 text-[10px] tabular-nums ${
                  isSelected
                    ? "bg-white/20 text-white font-semibold"
                    : count === 0
                    ? "text-foreground-muted/50 font-normal"
                    : "bg-surface-muted text-foreground-secondary font-medium"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default BlogFilterBar;
