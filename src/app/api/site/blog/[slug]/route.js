import { NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { fetchPublicBlogPostBySlugOrId } from "@/services/site/blog";

/**
 * GET /api/site/blog/[slug]
 *
 * Public unauthenticated endpoint retrieving a single published blog post by slug or ID.
 * Returns 404 if the post does not exist, is a draft, or is archived.
 */
export async function GET(request, { params }) {
  try {
    const { slug } = await params;
    const post = await fetchPublicBlogPostBySlugOrId(slug);

    if (!post) {
      return NextResponse.json(
        { success: false, error: "Blog post not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: post,
    });
  } catch (error) {
    logger.error(
      { err: error, operation: "fetch_public_blog_post_by_slug" },
      "Failed to retrieve blog post details"
    );
    return NextResponse.json(
      { success: false, error: "Failed to retrieve blog post." },
      { status: 500 }
    );
  }
}

