"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "@/lib/icons";
import { useHr, BlogForm } from "@/components/hr";

export default function CreateBlogPostPage() {
  const { createBlogPost } = useHr();

  const handleSavePost = async (postData) => {
    return createBlogPost(postData);
  };

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
            Create New Story
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-foreground-secondary">
            Draft a new article, guide, or announcement for the meelTe publication.
          </p>
        </div>
      </div>

      {/* Editor Form */}
      <BlogForm onSavePost={handleSavePost} />
    </main>
  );
}

