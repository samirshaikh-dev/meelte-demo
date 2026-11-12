"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import {
  Image as ImageIcon,
  UploadCloud,
  Trash2,
  Loader2,
} from "@/lib/icons";
import { Button } from "@/components/ui/button";
import { uploadBlogCoverImage } from "@/services/hr/blog";
import { notifySuccess, notifyError } from "@/lib/toast-feedback";

// Client-only dynamic import of BlogEditor prevents Math.random() SSR prerender errors
const BlogEditor = dynamic(
  () => import("./blog-editor").then((mod) => mod.BlogEditor),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-[380px] w-full animate-pulse rounded-2xl border border-border bg-surface-subtle" />
    ),
  }
);

/**
 * Step 1: Story Editorial Content
 * - Hero borderless story title (Medium / Notion style)
 * - Cover image upload with 16:9 ratio, dropzone, and SEO alt text
 * - Flattened editorial canvas with rich text editing
 */
export function StepStoryContent({
  formData,
  onChangeField,
  errors = {},
  headingRef,
}) {
  const [isTitleFocused, setIsTitleFocused] = useState(false);
  const fileInputRef = useRef(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleImageUpload = async (file) => {
    if (!file) return;
    setIsUploadingImage(true);
    try {
      const { downloadUrl } = await uploadBlogCoverImage(file);
      onChangeField("coverImage", downloadUrl);
      notifySuccess("Cover image uploaded successfully.");
    } catch (err) {
      notifyError(err.message || "Failed to upload image.");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleRemoveImage = () => {
    onChangeField("coverImage", "");
    onChangeField("coverImageAlt", "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <section aria-labelledby="step-content-heading" className="space-y-6">
      {/* Invisible heading for accessibility focus management */}
      <h2
        id="step-content-heading"
        ref={headingRef}
        tabIndex={-1}
        className="sr-only"
      >
        Step 1: Story Content
      </h2>

      {/* Main Canvas Card */}
      <div className="rounded-2xl border border-border bg-surface p-5 sm:p-7 shadow-soft space-y-6">
        {/* Title: Medium / Notion Style Hero Input */}
        <div>
          <label htmlFor="blog-title-input" className="sr-only">
            Story Title
          </label>
          <textarea
            id="blog-title-input"
            rows={2}
            placeholder="Story Title..."
            value={formData.title}
            onChange={(e) => onChangeField("title", e.target.value)}
            onFocus={() => setIsTitleFocused(true)}
            onBlur={() => setIsTitleFocused(false)}
            maxLength={120}
            className={`w-full resize-none border-0 bg-transparent p-0 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground placeholder:text-foreground-secondary/40 focus:outline-none focus:ring-0 leading-tight ${
              errors.title ? "text-error" : ""
            }`}
          />
          <div className="mt-2 flex items-center justify-between text-xs text-foreground-secondary">
            <span
              className={
                isTitleFocused || errors.title
                  ? "opacity-100"
                  : "opacity-0 sm:opacity-80 transition-opacity"
              }
            >
              {errors.title ? (
                <span className="text-error font-semibold">{errors.title}</span>
              ) : (
                <span>Engaging headline (3–120 characters)</span>
              )}
            </span>
            {(isTitleFocused || formData.title.length > 0) && (
              <span className="font-mono text-xs text-foreground-secondary">
                {formData.title.length}/120
              </span>
            )}
          </div>
        </div>

        {/* Cover Image in Main Column */}
        <div id="blog-cover-section" className="space-y-3 pt-2 border-t border-border/80">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4 text-primary" aria-hidden="true" />
              <span className="text-sm font-bold text-foreground">Cover Image</span>
              <span className="inline-flex items-center rounded-md bg-surface-muted px-2 py-0.5 text-xs font-medium text-foreground-secondary border border-border/80">
                Recommended: 1200 × 630 px (16:9)
              </span>
            </div>
            {formData.coverImage && (
              <button
                type="button"
                onClick={handleRemoveImage}
                className="inline-flex items-center gap-1 text-xs font-semibold text-error hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-error rounded"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Remove image</span>
              </button>
            )}
          </div>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp,image/avif"
            onChange={handleFileChange}
            className="sr-only"
            id="blog-cover-file-input"
          />

          {formData.coverImage ? (
            <div className="space-y-3">
              <div className="relative aspect-16/9 w-full overflow-hidden rounded-xl border border-border bg-surface-muted shadow-2xs">
                <Image
                  src={formData.coverImage}
                  alt={formData.coverImageAlt || formData.title || "Story cover"}
                  fill
                  className="object-cover"
                  unoptimized
                />
                {isUploadingImage && (
                  <div className="absolute inset-0 bg-black/50 backdrop-blur-xs flex flex-col items-center justify-center text-white text-xs gap-1.5">
                    <Loader2 className="h-6 w-6 animate-spin text-white" />
                    <span className="font-semibold">Replacing cover image...</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isUploadingImage}
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs font-semibold h-8"
                >
                  <UploadCloud className="h-3.5 w-3.5 mr-1.5 text-foreground-secondary" />
                  <span>Change Image</span>
                </Button>
              </div>

              {/* Alt Text Field */}
              <div className="pt-2">
                <label
                  htmlFor="blog-cover-alt"
                  className="block text-xs font-semibold text-foreground mb-1"
                >
                  Cover Image Alt Text{" "}
                  <span className="text-foreground-secondary font-normal">
                    (for SEO & Screen Readers)
                  </span>
                </label>
                <input
                  id="blog-cover-alt"
                  type="text"
                  placeholder="e.g., Freshly baked filter coffee and pastries on a wooden table in Malleshwaram"
                  value={formData.coverImageAlt || ""}
                  onChange={(e) => onChangeField("coverImageAlt", e.target.value)}
                  maxLength={160}
                  className="h-9 w-full rounded-lg border border-border bg-surface px-3 text-xs text-foreground placeholder:text-foreground-secondary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
                />
              </div>
            </div>
          ) : (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => !isUploadingImage && fileInputRef.current?.click()}
              className={`flex flex-col items-center justify-center p-8 text-center rounded-xl border-2 border-dashed cursor-pointer transition-colors ${
                isDragging
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50 hover:bg-surface-subtle"
              } ${errors.coverImage ? "border-error bg-error/5" : ""}`}
            >
              {isUploadingImage ? (
                <div className="flex flex-col items-center justify-center py-2 text-foreground-secondary text-xs gap-2">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  <span className="font-semibold">Uploading cover image...</span>
                </div>
              ) : (
                <>
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-surface-muted text-primary mb-2.5">
                    <UploadCloud className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-foreground">
                    Click to upload cover image from computer
                  </p>
                  <p className="mt-1 text-xs text-foreground-secondary">
                    Drag & drop PNG, JPG, or WEBP (1200×630 recommended, max 5 MB)
                  </p>
                </>
              )}
            </div>
          )}
          {errors.coverImage && (
            <p className="text-xs text-error font-medium">{errors.coverImage}</p>
          )}
        </div>

        {/* Upgraded Flattened Editor Canvas */}
        <div className="space-y-2 pt-2 border-t border-border/80">
          <div className="flex items-center justify-between">
            <label
              htmlFor="blog-article-editor"
              className="text-sm font-bold text-foreground flex items-center gap-1.5"
            >
              <span>Article Body</span>
              <span className="text-error">*</span>
            </label>
            <span className="text-xs text-foreground-secondary">
              Markdown shortcuts supported (# headings, &gt; quotes, - lists)
            </span>
          </div>

          <BlogEditor
            id="blog-article-editor"
            value={formData.content}
            onChange={(html) => onChangeField("content", html)}
            hasError={Boolean(errors.content)}
          />
          {errors.content && (
            <p className="text-xs text-error font-medium">{errors.content}</p>
          )}
        </div>
      </div>
    </section>
  );
}

