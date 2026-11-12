"use client";

import React, { use, useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, AlertCircle, Loader2 } from "@/lib/icons";
import { Button } from "@/components/ui/button";
import { useHr, BlogForm } from "@/components/hr";
import { fetchHrBlogPostById } from "@/services/hr/blog";

export default function EditBlogPostPage({ params }) {
  const unwrappedParams = use(params);
  const postId = unwrappedParams.id;

  const { getBlogPostById, updateBlogPost, isLoading: isContextLoading } = useHr();
  const [fetchedPost, setFetchedPost] = useState(null);
  const [isDirectFetchComplete, setIsDirectFetchComplete] = useState(false);

  const contextPost = getBlogPostById(postId);
  const existingPost = contextPost || fetchedPost;

  useEffect(() => {
    let ignore = false;

    if (!contextPost && !isContextLoading) {
      fetchHrBlogPostById(postId)
        .then((post) => {
          if (!ignore) {
            setFetchedPost(post || null);
            setIsDirectFetchComplete(true);
          }
        })
        .catch(() => {
          if (!ignore) {
            setIsDirectFetchComplete(true);
          }
        });
    }

    return () => {
      ignore = true;
    };
  }, [postId, contextPost, isContextLoading]);

  const handleSavePost = async (postData) => {
    return updateBlogPost(postId, postData);
  };

  const isStillLoading =
    isContextLoading || (!contextPost && !isDirectFetchComplete && !existingPost);

  if (isStillLoading) {
    return (
      <main className="flex-1 p-4 sm:p-5 lg:p-6 max-w-7xl w-full mx-auto flex flex-col items-center justify-center min-h-[50vh] text-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden="true" />
        <p className="mt-3 text-xs sm:text-sm text-foreground-muted">
          Loading story details...
        </p>
      </main>
    );
  }

  if (!existingPost) {
    return (
      <main className="flex-1 p-4 sm:p-5 lg:p-6 max-w-4xl w-full mx-auto space-y-6">
        <Link
          href="/hr/blog"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-foreground-secondary hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 rounded-md py-1"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Back to Story Directory</span>
        </Link>

        <div className="rounded-2xl border border-border bg-surface p-8 text-center shadow-soft space-y-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-surface-muted text-primary">
            <AlertCircle className="h-6 w-6" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">Story Not Found</h1>
            <p className="mt-1 text-xs text-foreground-secondary">
              The requested story ID &ldquo;{postId}&rdquo; could not be located in records.
            </p>
          </div>
          <div>
            <Button as={Link} href="/hr/blog" variant="primary" size="sm">
              Return to Stories List
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto space-y-6">
      {/* Navigation Breadcrumb / Back Link */}
      <div>
        <Link
          href="/hr/blog"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-foreground-secondary hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 rounded-md py-1"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Back to Story Directory</span>
        </Link>

        <div className="mt-2">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Edit Story: {existingPost.title}
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-foreground-secondary">
            Update content, excerpt, category taxonomy, or publish status.
          </p>
        </div>
      </div>

      {/* Editor Form prefilled with existing post */}
      <BlogForm existingPost={existingPost} onSavePost={handleSavePost} />
    </main>
  );
}

