import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/layout/container";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Card } from "@/components/ui/card";
import { StoreButton } from "@/components/layout/store-button";
import { BlogCard } from "@/components/sections/blog/blog-card";
import { sanitizeArticleHtml } from "@/lib/sanitize-html";
import { Calendar, Clock, ArrowLeft } from "@/lib/icons";

/**
 * Formats a stored ISO timestamp as a long en-IN date ("November 4, 2026").
 * Deterministic for a fixed input — never reads the current clock during
 * prerender (AI_RULE.md §2.6).
 */
function formatArticleDate(iso) {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("en-IN", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * The public view of one blog story on `/blog/[slug]`.
 *
 * Reading order mirrors the offer/event detail pages: breadcrumb → back link
 * → category chip → `<h1>` → excerpt → author/date row → cover photo → body
 * → store CTA → related stories. The cover is the only framed element
 * (AVOID.md §2); the body flows as unframed prose inside
 * `max-w-3xl` for calm readability.
 *
 * The HTML body is sanitized with `sanitizeArticleHtml` before
 * `dangerouslySetInnerHTML` — staff-authored Firestore content rendered with
 * a tag/attribute allowlist as defence-in-depth.
 *
 * The closing CTA promotes both store listings through the shared
 * `StoreButton`, so availability copy can never drift toward Android-only
 * (AI_RULE.md §2.2).
 */
export function BlogArticle({ post, breadcrumbs = [], relatedPosts = [] }) {
  const formattedDate = formatArticleDate(post.publishedAt);
  const sanitizedBody = sanitizeArticleHtml(post.content);

  return (
    <div className="pb-16 lg:pb-24">
      <Container className="py-8 sm:py-10">
        <Breadcrumbs items={breadcrumbs} className="mb-5" />

        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 rounded-md py-1 text-xs font-semibold text-foreground-secondary transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 sm:text-sm"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Back to all stories</span>
        </Link>

        {/* Article header */}
        <header className="mt-6 max-w-3xl">
          <span className="inline-flex items-center rounded-md border border-primary/20 bg-surface-muted px-3 py-1 text-xs font-semibold text-primary">
            {post.category}
          </span>

          <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-foreground text-balance sm:text-4xl lg:text-5xl">
            {post.title}
          </h1>

          {post.excerpt ? (
            <p className="mt-4 text-base font-medium leading-relaxed text-foreground-secondary sm:text-lg">
              {post.excerpt}
            </p>
          ) : null}

          <div className="mt-6 flex flex-wrap items-center gap-4 border-y border-border py-4 text-xs text-foreground-muted">
            {formattedDate ? (
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                <span>{formattedDate}</span>
              </span>
            ) : null}
            {post.readingTime ? (
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                <span>{post.readingTime} min read</span>
              </span>
            ) : null}
          </div>
        </header>

        {/* Featured image — the only framed element on the page */}
        {post.coverImage ? (
          <div className="relative mt-8 aspect-[16/9] w-full overflow-hidden rounded-2xl border border-border bg-surface-muted">
            <Image
              src={post.coverImage}
              alt={post.coverImageAlt || post.title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 896px) 100vw, 896px"
            />
          </div>
        ) : null}

        {/* Sanitized article body */}
        {sanitizedBody ? (
          <article className="mt-10 max-w-3xl">
            <div
              className="article-body text-base leading-relaxed text-foreground-secondary sm:text-lg"
              dangerouslySetInnerHTML={{ __html: sanitizedBody }}
            />
          </article>
        ) : null}

        {/* Bottom conversion CTA — both store listings, always */}
        <Card className="mt-14 max-w-3xl border-primary/20 p-6 sm:p-8">
          <div className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
            <div className="space-y-1">
              <h2 className="text-xl font-extrabold tracking-tight text-foreground">
                Experience hyperlocal discovery with meelTe
              </h2>
              <p className="text-sm leading-relaxed text-foreground-secondary">
                Explore live offers and community events near you on the meelTe
                app — free to download on Google Play and the App Store.
              </p>
            </div>
            <div className="flex shrink-0 gap-3">
              <StoreButton type="google" variant="brand" />
              <StoreButton type="apple" variant="brand" />
            </div>
          </div>
        </Card>

        {/* Related stories */}
        {relatedPosts.length > 0 ? (
          <section aria-labelledby="related-stories-heading" className="mt-16 max-w-5xl border-t border-border pt-12">
            <h2
              id="related-stories-heading"
              className="text-2xl font-extrabold tracking-tight text-foreground"
            >
              Related stories in {post.category}
            </h2>
            <ul role="list" className="mt-6 grid list-none gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.map((related) => (
                <li key={related.id} className="flex">
                  <BlogCard post={related} />
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </Container>
    </div>
  );
}

export default BlogArticle;
