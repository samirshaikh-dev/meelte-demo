import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Clock, ArrowRight } from "@/lib/icons";

/**
 * Formats a stored ISO timestamp as a compact en-IN date ("Nov 4, 2026").
 * Deterministic for a fixed input — it never reads the current clock, so it
 * is safe during prerender (AI_RULE.md §2.6).
 */
function formatCardDate(iso) {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Compact blog story card for the `/blog` grid and the "Related Stories"
 * section of an article — one clickable destination (`/blog/[slug]`), carried
 * by the headline link and a trailing "Read story" link.
 *
 * Remote cover images from Firebase Storage are optimized by Next.js Image
 * via `images.remotePatterns` in `next.config.mjs`.
 */
export function BlogCard({ post }) {
  const postUrl = `/blog/${post.slug}`;
  const formattedDate = formatCardDate(post.publishedAt);

  return (
    <Card className="group flex h-full flex-col overflow-hidden rounded-2xl p-5 shadow-none transition-colors duration-200 hover:border-primary/40 hover:shadow-soft">
      {post.coverImage ? (
        <div className="relative mb-4 aspect-[16/9] w-full overflow-hidden rounded-xl bg-surface-muted">
          <Image
            src={post.coverImage}
            alt={post.coverImageAlt || post.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      ) : null}

      <div className="flex items-center justify-between gap-2 text-xs">
        <span className="inline-flex shrink-0 items-center rounded-md border border-primary/20 bg-surface-muted px-2.5 py-0.5 font-semibold text-primary">
          {post.category}
        </span>
        <span className="inline-flex items-center gap-1 text-foreground-muted">
          {post.readingTime ? (
            <>
              <Clock className="h-3 w-3" aria-hidden="true" />
              <span>{post.readingTime} min read</span>
            </>
          ) : formattedDate ? (
            <span>{formattedDate}</span>
          ) : null}
        </span>
      </div>

      <h2 className="mt-2.5 text-lg font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
        <Link
          href={postUrl}
          className="rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2"
        >
          {post.title}
        </Link>
      </h2>

      {post.excerpt ? (
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-foreground-secondary">
          {post.excerpt}
        </p>
      ) : null}

      <div className="mt-auto flex items-center justify-between gap-3 border-t border-border/60 pt-3 text-xs text-foreground-secondary">
        {formattedDate ? (
          <span className="text-foreground-muted text-[11px] tabular-nums">
            {formattedDate}
          </span>
        ) : (
          <span />
        )}

        <Link
          href={postUrl}
          className="inline-flex shrink-0 items-center gap-1 rounded-md py-1 font-semibold text-primary transition-colors hover:text-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
          aria-label={`Read full story: ${post.title}`}
        >
          <span>Read story</span>
          <ArrowRight
            className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </Link>
      </div>
    </Card>
  );
}

export default BlogCard;
