import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { getHrSession } from "@/services/hr/auth";
import { getAdminBucket } from "@/services/firebase/admin";
import { logger } from "@/lib/logger";

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

const ALLOWED_IMAGE_TYPES = Object.freeze([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
]);

/**
 * POST /api/hr/blog/upload
 * Session-guarded server-side upload for blog cover images.
 * Uses Firebase Admin Storage (getAdminBucket) so client-side storage permissions
 * are never exposed, and authorization is enforced via HttpOnly session cookies.
 */
export async function POST(request) {
  try {
    const session = await getHrSession();
    if (!session?.authenticated) {
      return NextResponse.json(
        { success: false, error: "Authentication required." },
        { status: 401 }
      );
    }

    const formData = await request.formData().catch(() => null);
    if (!formData) {
      return NextResponse.json(
        { success: false, error: "Invalid form data payload." },
        { status: 400 }
      );
    }

    const file = formData.get("file");
    if (!file || typeof file === "string") {
      return NextResponse.json(
        { success: false, error: "Please select an image file to upload." },
        { status: 400 }
      );
    }

    const mimeType = file.type?.toLowerCase();
    if (!ALLOWED_IMAGE_TYPES.includes(mimeType)) {
      return NextResponse.json(
        {
          success: false,
          error: "Unsupported file format. Please upload a JPG, PNG, WEBP, or GIF image.",
        },
        { status: 400 }
      );
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      return NextResponse.json(
        {
          success: false,
          error: "Image file exceeds 5 MB. Please select a smaller image file.",
        },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Sanitize filename and create storage path
    const sanitizedName = (file.name || "cover.png").replace(/[^a-zA-Z0-9._-]/g, "_");
    const storagePath = `blog/covers/${Date.now()}-${sanitizedName}`;

    const bucket = getAdminBucket();
    const bucketName = bucket.name;
    const downloadToken = crypto.randomUUID();
    const bucketFile = bucket.file(storagePath);

    await bucketFile.save(buffer, {
      contentType: mimeType,
      resumable: false,
      metadata: {
        metadata: {
          firebaseStorageDownloadTokens: downloadToken,
        },
        cacheControl: "public, max-age=31536000, immutable",
      },
    });

    try {
      await bucketFile.makePublic();
    } catch {
      // Non-fatal if uniform bucket-level access prevents object ACLs
    }

    const downloadUrl = `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodeURIComponent(
      storagePath
    )}?alt=media&token=${downloadToken}`;

    logger.info(
      { operation: "upload_blog_cover", storagePath },
      "Blog cover image uploaded successfully via server admin bucket"
    );

    return NextResponse.json({
      success: true,
      data: {
        downloadUrl,
        storagePath,
      },
    });
  } catch (error) {
    logger.error(
      { err: error, operation: "upload_blog_cover" },
      "Failed to upload blog cover image"
    );
    return NextResponse.json(
      { success: false, error: error.message || "Failed to upload cover image." },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/hr/blog/upload
 * Session-guarded file deletion for blog cover images.
 */
export async function DELETE(request) {
  try {
    const session = await getHrSession();
    if (!session?.authenticated) {
      return NextResponse.json(
        { success: false, error: "Authentication required." },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { storagePath } = body;

    if (!storagePath || typeof storagePath !== "string" || !storagePath.startsWith("blog/covers/")) {
      return NextResponse.json(
        { success: false, error: "Invalid storage path." },
        { status: 400 }
      );
    }

    const bucket = getAdminBucket();
    await bucket.file(storagePath).delete({ ignoreNotFound: true });

    logger.info(
      { operation: "delete_blog_cover", storagePath },
      "Blog cover image removed from storage"
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error(
      { err: error, operation: "delete_blog_cover" },
      "Failed to delete blog cover image"
    );
    return NextResponse.json(
      { success: false, error: "Failed to delete cover image." },
      { status: 500 }
    );
  }
}

