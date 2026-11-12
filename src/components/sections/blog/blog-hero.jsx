"use client";

import React from "react";
import { Container } from "@/components/layout/container";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { BLOG_CATEGORIES, BLOG_DIRECT_ANSWER } from "@/constants/blog-constants";

/**
 * Blog hub hero: single authoritative `<h1>` (no eyebrow chip stacked above
 * it, per AI_RULE.md §2.3), the AEO direct-answer lede directly beneath it,
 * and the category filter pills.
 *
 * The pill bar is a labelled group of `aria-pressed` toggle buttons, not a
 * `tablist`: the pills filter one grid in place (no per-category panels), so
 * pressed-button semantics describe the behaviour truthfully and every pill
 * stays in the natural tab order. Each button keeps the standard 40px+ touch
 * target and a visible `focus-visible` ring.
 */
export function BlogHero({
  activeCategory = "All Stories",
  onSelectCategory,
  breadcrumbs = [],
}) {
  return (
    <section className="relative overflow-hidden border-b border-border/80 bg-canvas pb-8 pt-8 sm:pb-10 sm:pt-12">
      <Container>
        <Breadcrumbs items={breadcrumbs} className="mb-5 sm:mb-6" />

        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl xl:text-5xl">
            Stories, Insights &amp; Neighbourhood Guides
          </h1>
        </div>

      </Container>
    </section>
  );
}

export default BlogHero;
