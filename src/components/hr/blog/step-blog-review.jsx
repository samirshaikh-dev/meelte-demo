"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Eye,
  CheckCircle2,
  AlertCircle,
  Edit2,
  Globe,
  Sparkles,
  Share2,
} from "@/lib/icons";
import { isRichTextEmpty } from "@/validation/hr/job-validation";

/**
 * Step 3: Review & Publish (Same structure as Job Review)
 * - Live Metadata Previews (Google Result & Social Share Card)
 * - Publication Checklist
 * - Rendered Article Reader View
 * - Jump back to Step 1 or Step 2 to edit
 */
export function StepBlogReview({
  formData,
  featured,
  activeSlug,
  onJumpToStep,
  headingRef,
}) {
  const [previewTab, setPreviewTab] = useState("google"); // 'google' | 'social'

  const checklist = [
    {
      label: "Story Title",
      valid: formData.title.trim().length >= 3,
      desc: formData.title.trim().length >= 3 ? formData.title : "Must be at least 3 characters",
      step: 1,
    },
    {
      label: "Article Body",
      valid: Boolean(formData.content) && !isRichTextEmpty(formData.content),
      desc:
        Boolean(formData.content) && !isRichTextEmpty(formData.content)
          ? "Ready for publication"
          : "Article body is empty",
      step: 1,
    },
    {
      label: "Category",
      valid: Boolean(formData.category),
      desc: formData.category || "No category selected",
      step: 2,
    },
    {
      label: "Story Excerpt",
      valid: formData.excerpt.trim().length >= 20,
      desc:
        formData.excerpt.trim().length >= 20
          ? `${formData.excerpt.length} characters`
          : "Must be at least 20 characters",
      step: 2,
    },
    {
      label: "Cover Image",
      valid: Boolean(formData.coverImage),
      desc: formData.coverImage ? "Uploaded (16:9)" : "Optional (recommended)",
      step: 1,
      optional: true,
    },
  ];

  const allRequiredValid = checklist
    .filter((c) => !c.optional)
    .every((c) => c.valid);

  return (
    <section aria-labelledby="step-review-heading" className="space-y-6">
      <div className="border-b border-border pb-4">
        <h2
          id="step-review-heading"
          ref={headingRef}
          tabIndex={-1}
          className="text-lg sm:text-xl font-bold tracking-tight text-foreground focus:outline-none"
        >
          Review & Publish Story
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-foreground-secondary">
          Review your search metadata previews, publication checklist, and rendered story before publishing.
        </p>
      </div>

      {/* 1. LIVE METADATA PREVIEW (GOOGLE & SOCIAL SHARE CARD) */}
      <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6 shadow-soft space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2 border-b border-border/70 pb-3">
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4 text-primary" aria-hidden="true" />
            <span className="text-sm font-bold text-foreground">
              Live Metadata Preview
            </span>
          </div>

          {/* Toggle between Google Result and Social Share Card */}
          <div className="flex items-center rounded-lg border border-border bg-surface-subtle p-0.5 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setPreviewTab("google")}
              className={`px-3 py-1 rounded-md transition-colors ${
                previewTab === "google"
                  ? "bg-surface text-primary shadow-xs"
                  : "text-foreground-secondary hover:text-foreground"
              }`}
            >
              Google Result
            </button>
            <button
              type="button"
              onClick={() => setPreviewTab("social")}
              className={`px-3 py-1 rounded-md transition-colors ${
                previewTab === "social"
                  ? "bg-surface text-primary shadow-xs"
                  : "text-foreground-secondary hover:text-foreground"
              }`}
            >
              Social Share Card
            </button>
          </div>
        </div>

        {/* Preview Container */}
        {previewTab === "google" ? (
          /* Google Desktop Search Result */
          <div className="bg-white p-4 sm:p-5 rounded-xl border border-border/80 shadow-2xs max-w-2xl">
            <div className="text-[12px] text-[#202124] flex items-center gap-1.5 truncate">
              <span className="font-semibold text-[#202124]">meelte.com</span>
              <span className="text-foreground-secondary">
                › blog › {activeSlug || "story-slug"}
              </span>
            </div>
            <div className="text-lg font-medium text-[#1a0dab] hover:underline cursor-pointer mt-0.5 line-clamp-1">
              {formData.title || "Story Headline Preview"} | meelTe
            </div>
            <p className="text-xs sm:text-sm text-[#4d5156] line-clamp-2 mt-1 leading-relaxed">
              {formData.excerpt ||
                "Your compelling story excerpt will appear here in Google search engine result snippets."}
            </p>
          </div>
        ) : (
          /* Social OpenGraph Share Card Preview */
          <div className="bg-surface rounded-xl border border-border overflow-hidden shadow-2xs max-w-lg">
            {formData.coverImage ? (
              <div className="relative aspect-16/9 w-full bg-surface-muted">
                <Image
                  src={formData.coverImage}
                  alt={formData.coverImageAlt || "Social card preview"}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            ) : (
              <div className="aspect-16/9 w-full bg-surface-muted flex flex-col items-center justify-center text-xs text-foreground-secondary gap-1">
                <Share2 className="h-6 w-6 text-foreground-secondary/40" />
                <span>Upload a cover image in Step 1 for social previews</span>
              </div>
            )}
            <div className="p-3.5 space-y-1 bg-surface border-t border-border/80">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-foreground-secondary">
                meelte.com
              </p>
              <p className="text-sm font-bold text-foreground line-clamp-1">
                {formData.title || "Story Headline"}
              </p>
              <p className="text-xs text-foreground-secondary line-clamp-2 leading-relaxed">
                {formData.excerpt ||
                  "Story excerpt displayed across WhatsApp, LinkedIn, X, and Facebook shares."}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 2. PUBLICATION READINESS CHECKLIST */}
      <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6 shadow-soft space-y-3">
        <h3 className="text-sm font-bold text-foreground">Publication Checklist</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {checklist.map((item) => (
            <div
              key={item.label}
              className={`flex items-start justify-between p-3 rounded-xl border transition-colors ${
                item.valid
                  ? "border-emerald-500/20 bg-emerald-500/5 text-foreground"
                  : item.optional
                  ? "border-border bg-surface-subtle text-foreground-secondary"
                  : "border-error/20 bg-error/5 text-foreground"
              }`}
            >
              <div className="space-y-0.5 pr-2">
                <div className="flex items-center gap-1.5">
                  {item.valid ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  ) : item.optional ? (
                    <span className="h-2 w-2 rounded-full bg-foreground-secondary shrink-0" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-error shrink-0" />
                  )}
                  <span className="text-xs font-bold text-foreground">
                    {item.label}
                  </span>
                </div>
                <p className="text-[11px] text-foreground-secondary line-clamp-1">
                  {item.desc}
                </p>
              </div>

              <button
                type="button"
                onClick={() => onJumpToStep(item.step)}
                className="text-[11px] font-semibold text-primary hover:underline shrink-0"
              >
                Edit
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 3. FULL RENDERED STORY PREVIEW */}
      <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8 shadow-soft space-y-6">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-bold text-foreground">Story Article View</h3>
          </div>
          <button
            type="button"
            onClick={() => onJumpToStep(1)}
            className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
          >
            <Edit2 className="h-3 w-3" />
            <span>Edit Content</span>
          </button>
        </div>

        {/* Category & Featured badge */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-2.5 py-1 rounded-md bg-surface-muted text-primary text-xs font-semibold border border-primary/20">
            {formData.category || "Uncategorized"}
          </span>
          {featured && (
            <span className="px-2.5 py-1 rounded-md bg-accent/15 text-accent-foreground text-xs font-semibold flex items-center gap-1 border border-accent/20">
              <Sparkles className="h-3 w-3 text-accent" /> Featured Article
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-foreground tracking-tight leading-tight">
          {formData.title || <span className="text-error italic">Untitled Story</span>}
        </h1>

        {/* Excerpt */}
        {formData.excerpt && (
          <p className="text-base sm:text-lg text-foreground-secondary font-medium leading-relaxed italic border-l-4 border-primary/40 pl-4 py-1">
            {formData.excerpt}
          </p>
        )}

        {/* Cover Image */}
        {formData.coverImage && (
          <div className="relative aspect-16/9 w-full rounded-2xl overflow-hidden border border-border bg-surface-muted shadow-2xs">
            <Image
              src={formData.coverImage}
              alt={formData.coverImageAlt || formData.title || "Story cover"}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        )}

        {/* Article Body */}
        <div
          className="prose prose-purple max-w-none text-foreground leading-relaxed text-sm sm:text-base space-y-4"
          dangerouslySetInnerHTML={{
            __html:
              formData.content ||
              "<p class='italic text-foreground-secondary'>No article body written yet.</p>",
          }}
        />

        {/* Tags */}
        {formData.tags.length > 0 && (
          <div className="pt-4 border-t border-border flex flex-wrap gap-1.5 items-center">
            <span className="text-xs font-semibold text-foreground-secondary mr-1">
              Tags:
            </span>
            {formData.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-lg bg-surface-muted text-primary text-xs font-semibold border border-primary/20"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

