import { NextResponse, connection } from "next/server";
import { logger } from "@/lib/logger";
import { fetchPublicBlogPosts } from "@/services/site/blog";
import { DEFAULT_BLOG_PAGE_SIZE } from "@/constants/blog-constants";

/**
 * GET /api/site/blog
 *
 * Public unauthenticated endpoint listing published blog posts, newest first.
 * Supports query parameters:
 *   - category: string (optional, defaults to "All Stories")
 *   - pageSize (or limit): number (optional, default 12, max 100)
 */
export async function GET(request) {
  // Cache Components prerenders Route Handlers at build time. This handler answers a
  // filtered listing (`?category=…&pageSize=…`), so it only has a meaningful result for
  // an actual request. `connection()` states that requirement explicitly: it never
  // resolves during prerender, which marks the route dynamic, and resolves immediately
  // at request time. Without it, reading `request.url` raises the framework's
  // "bail out of prerendering" signal, and the `catch` below would swallow that signal
  // and log it as an application error on every build.
  await connection();

  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || "All Stories";
    const rawLimit = searchParams.get("pageSize") || searchParams.get("limit");
    const pageSize = rawLimit
      ? Math.min(Math.max(1, parseInt(rawLimit, 10) || DEFAULT_BLOG_PAGE_SIZE), 100)
      : DEFAULT_BLOG_PAGE_SIZE;

    const posts = await fetchPublicBlogPosts({ category, pageSize });

    return NextResponse.json({
      success: true,
      data: posts,
    });
  } catch (error) {
    logger.error(
      { err: error, operation: "fetch_public_blog_posts" },
      "Failed to retrieve public blog posts"
    );
    return NextResponse.json(
      { success: false, error: "Failed to retrieve blog posts." },
      { status: 500 }
    );
  }
}

