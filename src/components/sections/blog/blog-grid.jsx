import React from "react";
import { Container } from "@/components/layout/container";
import { BlogCard } from "@/components/sections/blog/blog-card";
import { Newspaper } from "@/lib/icons";

/**
 * Blog story grid for the `/blog` hub.
 *
 * Receives the already-filtered post list from `BlogExplorer` — filtering is
 * client-side, so every published post is in the prerendered HTML for crawlers
 * and the category pills act as an instant progressive enhancement.
 *
 * Empty state honours the zero-local-fallback contract: a missing or empty
 * Firestore collection renders honest copy, never mock content.
 */
export function BlogGrid({ posts = [], activeCategory }) {
  if (posts.length === 0) {
    return (
      <section aria-label="Blog stories" className="bg-canvas py-10 sm:py-14">
        <Container>
          <div className="mx-auto max-w-md rounded-2xl border border-dashed border-border bg-surface p-8 text-center">
            <Newspaper
              className="mx-auto h-8 w-8 text-foreground-muted"
              aria-hidden="true"
            />
            <h2 className="mt-3 text-base font-bold text-foreground">
              No stories published yet
            </h2>
            <p className="mt-1.5 text-sm leading-relaxed text-foreground-secondary">
              {activeCategory && activeCategory !== "All Stories"
                ? `There are currently no articles in the "${activeCategory}" category.`
                : "Check back soon for neighbourhood insights and merchant guides."}
            </p>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section aria-label="Blog stories" className="bg-canvas py-10 sm:py-14">
      <Container>
        {/*
         * `role="list"` is explicit because Tailwind preflight removes list
         * markers and WebKit then drops list semantics (see breadcrumbs.jsx).
         */}
        <ul role="list" className="grid list-none gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <li key={post.id} className="flex">
              <BlogCard post={post} />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

export default BlogGrid;
