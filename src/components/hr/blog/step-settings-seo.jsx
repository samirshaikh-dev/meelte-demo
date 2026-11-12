"use client";

import React from "react";
import {
  FileText,
  Globe,
  Sparkles,
  ChevronDown,
  Wand2,
} from "@/lib/icons";
import { TagInput } from "@/components/hr/jobs/job-form/tag-input";
import { BLOG_POST_CATEGORIES } from "@/constants/blog-constants";
import { isRichTextEmpty } from "@/validation/hr/job-validation";
import { notifySuccess, notifyError } from "@/lib/toast-feedback";

const POPULAR_TAG_SUGGESTIONS = [
  "Food & Bakeries",
  "Local Guides",
  "Bangalore",
  "Local Deals",
  "Merchants",
  "Hidden Gems",
  "Community Events",
  "Heritage",
];

/**
 * Step 2: Settings, Taxonomy & SEO
 * - Category selection (deliberate, no preselection)
 * - Tags & topics with chips, suggestions, and max limits
 * - Permalink slug editor
 * - Excerpt with one-click generation from story body
 */
export function StepSettingsSeo({
  formData,
  onChangeField,
  featured,
  onToggleFeatured,
  isCustomSlug,
  onToggleCustomSlug,
  activeSlug,
  errors = {},
  headingRef,
}) {
  const handleGenerateExcerpt = () => {
    if (!formData.content || isRichTextEmpty(formData.content)) {
      notifyError("Write some content in Step 1 (Story Content) first.");
      return;
    }
    const cleanText = formData.content
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    if (!cleanText) return;

    let generated = cleanText.slice(0, 180);
    const lastSpace = generated.lastIndexOf(" ");
    if (lastSpace > 120) {
      generated = generated.slice(0, lastSpace);
    }
    onChangeField("excerpt", `${generated}...`);
    notifySuccess("Excerpt generated from article text.");
  };

  return (
    <section aria-labelledby="step-settings-heading" className="space-y-6">
      <h2
        id="step-settings-heading"
        ref={headingRef}
        tabIndex={-1}
        className="sr-only"
      >
        Step 2: Settings & SEO
      </h2>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left Column: Category & Taxonomy */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6 shadow-soft space-y-5">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" aria-hidden="true" />
              <span>Category & Promotion</span>
            </h3>

            {/* Category Select */}
            <div>
              <label
                htmlFor="blog-category"
                className="block text-xs font-semibold text-foreground mb-1.5"
              >
                Category <span className="text-error">*</span>
              </label>
              <div className="relative">
                <select
                  id="blog-category"
                  value={formData.category}
                  onChange={(e) => onChangeField("category", e.target.value)}
                  className={`w-full appearance-none h-11 rounded-xl border bg-surface pl-3 pr-9 text-xs sm:text-sm font-medium text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 transition-colors cursor-pointer ${
                    errors.category ? "border-error ring-1 ring-error" : "border-border"
                  } ${!formData.category ? "text-foreground-secondary" : ""}`}
                >
                  <option value="" disabled>
                    Select a category...
                  </option>
                  {BLOG_POST_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  aria-hidden="true"
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-secondary"
                />
              </div>
              {errors.category && (
                <p className="mt-1 text-xs text-error font-medium">{errors.category}</p>
              )}
            </div>

            {/* Featured Post Checkbox */}
            <div className="pt-3 border-t border-border/80">
              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => onToggleFeatured(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-border text-primary focus:ring-primary/70"
                />
                <div>
                  <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
                    <span>Featured Article</span>
                  </span>
                  <p className="text-xs text-foreground-secondary leading-tight mt-0.5">
                    Highlight this story at the top of the blog directory and recommendations.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Tags & Topics */}
          <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6 shadow-soft space-y-4">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Globe className="h-4 w-4 text-primary" aria-hidden="true" />
              <span>Tags & Topics</span>
            </h3>

            <TagInput
              id="blog-tags"
              noun="tag"
              tags={formData.tags}
              maxTags={8}
              suggestions={POPULAR_TAG_SUGGESTIONS}
              onChange={(newTags) => onChangeField("tags", newTags)}
              placeholder="e.g. Bangalore, Food, Deals"
            />
            {errors.tags && (
              <p className="text-xs text-error font-medium">{errors.tags}</p>
            )}
          </div>
        </div>

        {/* Right Column: URL Slug & Excerpt */}
        <div className="space-y-6">
          {/* Permalink / URL Slug */}
          <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6 shadow-soft space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Globe className="h-4 w-4 text-primary" aria-hidden="true" />
                <span>URL Permalink</span>
              </h3>
              <button
                type="button"
                onClick={() => onToggleCustomSlug((prev) => !prev)}
                className="text-xs font-semibold text-primary hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded"
              >
                {isCustomSlug ? "Auto-derive from Title" : "Customize Slug"}
              </button>
            </div>

            <div className="rounded-xl border border-border/80 bg-surface-subtle p-3.5 text-xs space-y-2">
              <div className="flex items-center gap-1.5 text-foreground-secondary truncate">
                <span className="font-semibold text-foreground">Live URL:</span>
                <span className="font-mono text-primary font-medium truncate">
                  meelte.com/blog/{activeSlug || "your-story-title"}
                </span>
              </div>

              {isCustomSlug && (
                <div className="pt-2 border-t border-border/70">
                  <label htmlFor="blog-slug-input" className="sr-only">
                    Custom Slug
                  </label>
                  <input
                    id="blog-slug-input"
                    type="text"
                    placeholder="custom-story-slug"
                    value={formData.slug}
                    onChange={(e) => onChangeField("slug", e.target.value)}
                    className="h-9 w-full rounded-lg border border-border bg-surface px-3 font-mono text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
                  />
                  <p className="mt-1 text-xs text-foreground-secondary">
                    Use lowercase letters, numbers, and hyphens only.
                  </p>
                </div>
              )}
            </div>
            {errors.slug && (
              <p className="text-xs text-error font-medium">{errors.slug}</p>
            )}
          </div>

          {/* Excerpt */}
          <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6 shadow-soft space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <label
                htmlFor="blog-excerpt"
                className="text-sm font-bold text-foreground flex items-center gap-1.5"
              >
                <span>Story Excerpt</span>
                <span className="text-error">*</span>
              </label>
              <button
                type="button"
                onClick={handleGenerateExcerpt}
                disabled={!formData.content || isRichTextEmpty(formData.content)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Wand2 className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Generate from article</span>
              </button>
            </div>

            <textarea
              id="blog-excerpt"
              rows={4}
              placeholder="A compelling 1-2 sentence summary displayed on card previews, social shares, and Google snippets..."
              value={formData.excerpt}
              onChange={(e) => onChangeField("excerpt", e.target.value)}
              maxLength={280}
              className={`w-full rounded-xl border bg-surface p-3 text-xs sm:text-sm text-foreground placeholder:text-foreground-secondary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 transition-colors leading-relaxed ${
                errors.excerpt ? "border-error ring-1 ring-error" : "border-border"
              }`}
            />
            <div className="flex items-center justify-between text-xs text-foreground-secondary">
              <span>Shown in social cards & Google snippets (20–280 chars)</span>
              <span className="font-mono">{formData.excerpt.length}/280</span>
            </div>
            {errors.excerpt && (
              <p className="text-xs text-error font-medium">{errors.excerpt}</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

