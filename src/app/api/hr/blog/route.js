import { NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { getHrSession } from "@/services/hr/auth";
import { fetchHrBlogPosts, createHrBlogPost } from "@/services/hr/server";
import {
  blogPostDraftSchema,
  blogPostPublishSchema,
  getFirstValidationMessage,
} from "@/validation/hr/blog-validation";

/**
 * /api/hr/blog
 *
 * Blog CMS API (session-guarded like every /api/hr route):
 *   - GET:  Lists all blog posts — drafts and archived included
 *   - POST: Creates a blog post; the body is validated with zod, and a
 *           `published` post must additionally satisfy the publish schema
 *           (AI_RULE.md §2.1: validation is the schema at write boundaries).
 */

export async function GET() {
  try {
    const session = await getHrSession();
    if (!session?.authenticated) {
      return NextResponse.json(
        { success: false, error: "Authentication required." },
        { status: 401 }
      );
    }

    const posts = await fetchHrBlogPosts();
    return NextResponse.json({ success: true, data: posts });
  } catch (error) {
    logger.error(
      { err: error, operation: "fetch_hr_blog_posts" },
      "Failed to retrieve blog posts"
    );
    return NextResponse.json(
      { success: false, error: "Failed to retrieve blog posts." },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const session = await getHrSession();
    if (!session?.authenticated) {
      return NextResponse.json(
        { success: false, error: "Authentication required." },
        { status: 401 }
      );
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid JSON request body." },
        { status: 400 }
      );
    }

    // Every write is a valid draft first…
    const draftCheck = blogPostDraftSchema.safeParse(body);
    if (!draftCheck.success) {
      return NextResponse.json(
        { success: false, error: getFirstValidationMessage(draftCheck) },
        { status: 400 }
      );
    }

    // …and publishing demands the complete, public-ready story.
    if (draftCheck.data.status === "published") {
      const publishCheck = blogPostPublishSchema.safeParse(draftCheck.data);
      if (!publishCheck.success) {
        return NextResponse.json(
          { success: false, error: getFirstValidationMessage(publishCheck) },
          { status: 400 }
        );
      }
    }

    const newPost = await createHrBlogPost(draftCheck.data);
    logger.info(
      { operation: "create_hr_blog_post", postId: newPost?.id },
      "Blog post created successfully"
    );
    return NextResponse.json({ success: true, data: newPost }, { status: 201 });
  } catch (error) {
    logger.error(
      { err: error, operation: "create_hr_blog_post" },
      "Failed to create blog post"
    );
    return NextResponse.json(
      { success: false, error: "Failed to create blog post." },
      { status: 500 }
    );
  }
}
