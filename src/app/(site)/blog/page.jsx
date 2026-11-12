import React from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { BlogExplorer } from "@/components/sections/blog";
import { buildPageMetadata } from "@/lib/seo/metadata";
import {
  getBreadcrumbsJsonLd,
  getCollectionPageJsonLd,
} from "@/lib/seo/structured-data";
import { fetchPublicBlogPosts } from "@/services/site/blog";
import { BLOG_DIRECT_ANSWER } from "@/constants/blog-constants";

const BLOG_BREADCRUMBS = [
  { name: "Home", path: "/" },
  { name: "Blog", path: "/blog" },
];

const PAGE_PATH = "/blog";
const PAGE_TITLE = "meelTe Blog: Hyperlocal Guides, Community Stories & Merchant Growth";

/*
 * Freshness lives on the cached read function (`cacheLife("minutes")` —
 * revalidate 60s, expire 1h), matching `/careers`. `export const revalidate`
 * is rejected under Cache Components (`next.config.mjs` → `cacheComponents:
 * true`), and category filtering is a client-side progressive enhancement, so
 * this route reads no request URL data and prerenders with the full post list.
 */

export const metadata = buildPageMetadata({
  title: PAGE_TITLE,
  description: BLOG_DIRECT_ANSWER,
  path: PAGE_PATH,
  keywords: [
    "meelTe blog",
    "hyperlocal community news",
    "neighbourhood stories India",
    "local merchant tips",
    "local event guides",
    "hyperlocal marketplace insights",
  ],
});

export default async function BlogHubPage() {
  const posts = await fetchPublicBlogPosts();

  // CollectionPage is emitted only when stories actually render, so the
  // ItemList always matches the page (AI_RULE.md §2.4).
  const jsonLd = [
    posts.length > 0 &&
      getCollectionPageJsonLd({
        name: PAGE_TITLE,
        description: BLOG_DIRECT_ANSWER,
        path: PAGE_PATH,
        items: posts.map((post) => ({
          name: post.title,
          path: `/blog/${post.slug}`,
        })),
      }),
    getBreadcrumbsJsonLd(BLOG_BREADCRUMBS),
  ].filter(Boolean);

  return (
    <div className="flex min-h-screen flex-col bg-canvas selection:bg-primary/20 selection:text-primary">
      {jsonLd.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
      )}

      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-xl focus:bg-primary focus:px-4 focus:py-2.5 focus:font-bold focus:text-white focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-white"
      >
        Skip to main content
      </a>

      <Navbar />

      <main id="main-content" className="flex-1">
        <BlogExplorer posts={posts} breadcrumbs={BLOG_BREADCRUMBS} />
      </main>

      <Footer />
    </div>
  );
}
