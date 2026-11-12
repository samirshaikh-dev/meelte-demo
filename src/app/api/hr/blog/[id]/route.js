import { NextResponse } from "next/server";
import { getHrSession } from "@/services/hr/auth";
import { getAdminBucket } from "@/services/firebase/admin";
import {
  fetchHrBlogPostById,
  updateHrBlogPost,
  deleteHrBlogPost,
} from "@/services/hr/server";
import {
  blogPostDraftSchema,
  blogPostPublishSchema,
  getFirstValidationMessage,
} from "@/validation/hr/blog-validation";

/**
 * /api/hr/blog/[id]
 *
 * Blog post by ID API (session-guarded):
 *   - GET:    Retrieves a single blog post, any status
 *   - PATCH:  Updates fields; zod-validated. When the merged result is a
 *             published post (either because the patch publishes a draft or
 *             because an already-published post is edited), the merged
 *             document must satisfy the publish schema — an edit can never
 *             leave a half-empty story live on /blog.
 *   - DELETE: Deletes a blog post
 */

export async function GET(request, { params }) {
  try {
    const session = await getHrSession();
    if (!session?.authenticated) {
      return NextResponse.json(
        { success: false, error: "Authentication required." },
        { status: 401 }
      );
    }

    const { id } = await params;
    const post = await fetchHrBlogPostById(id);

    if (!post) {
      return NextResponse.json(
        { success: false, error: "Blog post not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: post });
  } catch (error) {
    console.error("[HR Blog API GET Error]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve blog post." },
      { status: 500 }
    );
  }
}

export async function PATCH(request, { params }) {
  try {
    const session = await getHrSession();
    if (!session?.authenticated) {
      return NextResponse.json(
        { success: false, error: "Authentication required." },
        { status: 401 }
      );
    }

    const { id } = await params;

    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid JSON body." },
        { status: 400 }
      );
    }

    const draftCheck = blogPostDraftSchema.safeParse(body);
    if (!draftCheck.success) {
      return NextResponse.json(
        { success: false, error: getFirstValidationMessage(draftCheck) },
        { status: 400 }
      );
    }

    // If this patch publishes the post — or edits one already published —
    // the merged document must be publish-complete before it goes live.
    const existingPost = await fetchHrBlogPostById(id);
    if (!existingPost) {
      return NextResponse.json(
        { success: false, error: "Blog post not found." },
        { status: 404 }
      );
    }

    const nextStatus = draftCheck.data.status || existingPost.status;
    if (nextStatus === "published") {
      const publishCheck = blogPostPublishSchema.safeParse({
        ...existingPost,
        ...draftCheck.data,
        status: "published",
      });
      if (!publishCheck.success) {
        return NextResponse.json(
          { success: false, error: getFirstValidationMessage(publishCheck) },
          { status: 400 }
        );
      }
    }

    const updatedPost = await updateHrBlogPost(id, draftCheck.data);
    return NextResponse.json({ success: true, data: updatedPost });
  } catch (error) {
    console.error("[HR Blog API PATCH Error]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update blog post." },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getHrSession();
    if (!session?.authenticated) {
      return NextResponse.json(
        { success: false, error: "Authentication required." },
        { status: 401 }
      );
    }

    const { id } = await params;
    const existingPost = await fetchHrBlogPostById(id);
    await deleteHrBlogPost(id);

    // Best-effort cleanup of the cover image in Firebase Storage
    if (existingPost?.coverImage) {
      try {
        const match = existingPost.coverImage.match(/\/o\/([^?]+)/);
        const decodedPath = match?.[1] ? decodeURIComponent(match[1]) : null;
        if (decodedPath && decodedPath.startsWith("blog/covers/")) {
          const bucket = getAdminBucket();
          await bucket.file(decodedPath).delete({ ignoreNotFound: true });
        }
      } catch {
        // Non-fatal storage cleanup
      }
    }

    return NextResponse.json({ success: true, message: "Blog post deleted successfully." });
  } catch (error) {
    console.error("[HR Blog API DELETE Error]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete blog post." },
      { status: 500 }
    );
  }
}
