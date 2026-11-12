"use client";

import React, { useState } from "react";
import { BlogHero } from "@/components/sections/blog/blog-hero";
import { BlogGrid } from "@/components/sections/blog/blog-grid";

/**
 * Client view coordinator for the `/blog` hub — owns the active category
 * state and composes the hero pill bar with the filtered story grid, in the
 * role `DiscoverySwitch` plays on the homepage.
 *
 * The full post list is rendered by the server, so the prerendered HTML and
 * the `CollectionPage` ItemList stay identical, and the pills are a pure
 * progressive enhancement: pressing one re-filters the grid instantly with no
 * navigation or refetch.
 *
 * A polite live region announces the result count whenever the filter changes
 * so screen-reader users hear that the grid updated without scanning it.
 */
export function BlogExplorer({ posts = [], breadcrumbs = [] }) {
  const [activeCategory, setActiveCategory] = useState("All Stories");

  const visiblePosts =
    activeCategory === "All Stories"
      ? posts
      : posts.filter((post) => post.category === activeCategory);

  return (
    <>
      <BlogHero
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        breadcrumbs={breadcrumbs}
      />

      <p role="status" aria-live="polite" className="sr-only">
        {visiblePosts.length}{" "}
        {visiblePosts.length === 1 ? "story" : "stories"} in {activeCategory}
      </p>

      <BlogGrid posts={visiblePosts} activeCategory={activeCategory} />
    </>
  );
}

export default BlogExplorer;
