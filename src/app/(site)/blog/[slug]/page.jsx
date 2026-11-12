import React, { Suspense } from "react";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/layout/container";
import { BlogArticle } from "@/components/sections/blog";
import { buildArticleMetadata, buildPageMetadata } from "@/lib/seo/metadata";
import {
  getArticleJsonLd,
  getBreadcrumbsJsonLd,
  mergeJsonLd,
} from "@/lib/seo/structured-data";
import {
  fetchPublicBlogPostBySlugOrId,
  fetchRelatedBlogPosts,
} from "@/services/site/blog";

/*
 * Freshness is set on the cached read functions in `@/services/site/blog` via
 * `cacheLife("minutes")`. `export const revalidate` is rejected under Cache
 * Components, and the slug only exists at request time, so this route builds
 * as a partial-prerender page — the shell (header, skeleton, footer) is static
 * and the story streams in behind the Suspense boundary, exactly like
 * `/careers/[slug]`, `/events/[id]` and `/ads/[id]`.
 */

/**
 * Dynamic SEO metadata for /blog/[slug].
 * Generates title, description and article Open Graph tags from real post
 * data; a missing post gets a noindex page instead of fabricated content.
 */
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await fetchPublicBlogPostBySlugOrId(slug);

  if (!post) {
    return buildPageMetadata({
      title: "Story Not Found | meelTe",
      description:
        "This meelTe Blog story is no longer available. Browse all hyperlocal guides, community stories and merchant playbooks.",
      path: `/blog/${slug}`,
      noIndex: true,
    });
  }

  return buildArticleMetadata({
    title: `${post.title} | meelTe Blog`,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
    keywords: [post.category, ...(post.tags || []), "meelTe blog"],
    image: post.coverImage || undefined,
    authors: ["meelTe"],
    publishedTime: post.publishedAt || undefined,
    modifiedTime: post.updatedAt || undefined,
  });
}

function BlogArticleFallback() {
  return (
    <section
      aria-busy="true"
      aria-label="Loading story"
      className="pb-16 lg:pb-24"
    >
      <Container className="py-8 sm:py-10">
        <div className="h-4 w-36 animate-pulse rounded-md bg-surface-muted" />
        <div className="mt-8 max-w-3xl">
          <div className="h-6 w-24 animate-pulse rounded-md bg-surface-muted" />
          <div className="mt-4 h-10 w-3/4 animate-pulse rounded-lg bg-surface-muted" />
          <div className="mt-3 h-4 w-1/2 animate-pulse rounded-md bg-surface-muted" />
          <div className="mt-6 h-10 w-full animate-pulse rounded-md bg-surface-muted" />
        </div>
        <div className="mt-8 aspect-[16/9] w-full animate-pulse rounded-2xl bg-surface-muted" />
        <div className="mt-10 max-w-3xl space-y-3">
          <div className="h-4 w-full animate-pulse rounded-md bg-surface-muted" />
          <div className="h-4 w-11/12 animate-pulse rounded-md bg-surface-muted" />
          <div className="h-4 w-10/12 animate-pulse rounded-md bg-surface-muted" />
        </div>
      </Container>
    </section>
  );
}

async function BlogPostContent({ params }) {
  const { slug } = await params;
  const post = await fetchPublicBlogPostBySlugOrId(slug);

  // Zero local fallback: an unknown, draft or archived slug is a real 404 so
  // the canonical URL dies with the story instead of serving empty content.
  if (!post) {
    notFound();
  }

  const relatedPosts = await fetchRelatedBlogPosts(post.id, post.category, 3);

  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: post.title, path: `/blog/${post.slug}` },
  ];

  const jsonLd = mergeJsonLd(
    getArticleJsonLd({
      title: post.title,
      description: post.excerpt,
      url: `/blog/${post.slug}`,
      image: post.coverImage,
      datePublished: post.publishedAt || undefined,
      dateModified: post.updatedAt || undefined,
      author: "meelTe",
    }),
    getBreadcrumbsJsonLd(breadcrumbs)
  );

  return (
    <>
      {jsonLd.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
      )}

      <BlogArticle post={post} breadcrumbs={breadcrumbs} relatedPosts={relatedPosts} />
    </>
  );
}

export default function BlogPostPage({ params }) {
  return (
    <div className="flex min-h-screen flex-col bg-canvas selection:bg-primary/20 selection:text-primary">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-xl focus:bg-primary focus:px-4 focus:py-2.5 focus:font-bold focus:text-white focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-white"
      >
        Skip to main content
      </a>

      <Suspense
        fallback={
          <div className="h-16 border-b border-border/80 bg-surface" aria-hidden="true" />
        }
      >
        <Navbar />
      </Suspense>

      <main id="main-content" className="flex-1">
        <Suspense fallback={<BlogArticleFallback />}>
          <BlogPostContent params={params} />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
