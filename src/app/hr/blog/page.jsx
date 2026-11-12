"use client";

import React, { useState, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Plus, ArrowUpRight, AlertCircle, RotateCcw } from "@/lib/icons";
import { Button } from "@/components/ui/button";
import {
  BlogFilterBar,
  BlogTable,
  DeleteBlogDialog,
  useHr,
} from "@/components/hr";

function BlogManagementContent() {
  const searchParams = useSearchParams();
  const urlStatusParam = searchParams.get("status");

  const {
    blogPosts,
    updateBlogPostStatus,
    deletingBlogPostId,
    setDeletingBlogPostId,
    deleteBlogPost,
    isLoading,
    error,
    refetchData,
  } = useHr();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedStatusTab, setSelectedStatusTab] = useState(null);

  // Status filter derived from tab selection or URL query
  const statusFilter = useMemo(() => {
    if (selectedStatusTab) return selectedStatusTab;
    if (urlStatusParam) {
      const matched = ["All", "Published", "Draft", "Archived"].find(
        (s) => s.toLowerCase() === urlStatusParam.toLowerCase()
      );
      if (matched) return matched;
    }
    return "All";
  }, [selectedStatusTab, urlStatusParam]);

  // Client-side filtering across title, tags, category, and status
  const filteredPosts = useMemo(() => {
    return blogPosts.filter((post) => {
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        post.title?.toLowerCase().includes(query) ||
        (Array.isArray(post.tags) &&
          post.tags.some((t) => t.toLowerCase().includes(query))) ||
        post.slug?.toLowerCase().includes(query);

      const matchesCategory =
        selectedCategory === "All Categories" ||
        post.category === selectedCategory;

      const matchesStatus =
        statusFilter === "All" ||
        (post.status || "").toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [blogPosts, searchQuery, selectedCategory, statusFilter]);

  const targetDeletingPost = useMemo(() => {
    if (!deletingBlogPostId) return null;
    return blogPosts.find((p) => p.id === deletingBlogPostId) || null;
  }, [blogPosts, deletingBlogPostId]);

  return (
    <main className="flex-1 p-4 sm:p-5 lg:p-6 flex flex-col gap-6 max-w-7xl w-full mx-auto">
      {/* Page Title & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-border/80">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Blogs Managment
          </h1>
        </div>

        <div className="flex items-center gap-2.5">

          <Button
            as={Link}
            href="/hr/blog/new"
            variant="primary"
            size="sm"
            className="gap-1.5 rounded-xl shadow-2xs font-semibold focus-visible:ring-primary/70"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            <span>Create New Story</span>
          </Button>
        </div>
      </div>

      {/* Warning Notice if partial error occurred while displaying cached data */}
      {error && (
        <div
          role="alert"
          className="flex items-center justify-between gap-3 rounded-xl border border-warning-border bg-warning-bg px-4 py-2.5 text-xs text-warning"
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{error} Showing cached stories.</span>
          </div>
          <button
            type="button"
            onClick={refetchData}
            className="font-semibold underline hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warning"
          >
            Retry
          </button>
        </div>
      )}

      {/* Filter & Search Bar */}
      <BlogFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        statusFilter={statusFilter}
        onStatusChange={setSelectedStatusTab}
        blogPosts={blogPosts}
      />

      {/* Blog Management Table */}
      <BlogTable
        blogPosts={filteredPosts}
        statusFilter={statusFilter}
        onUpdateStatus={updateBlogPostStatus}
        onDeletePostClick={setDeletingBlogPostId}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteBlogDialog
        isOpen={Boolean(deletingBlogPostId)}
        postTitle={targetDeletingPost?.title}
        onClose={() => setDeletingBlogPostId(null)}
        onConfirm={async () => {
          if (deletingBlogPostId) {
            await deleteBlogPost(deletingBlogPostId);
          }
        }}
      />
    </main>
  );
}

export default function BlogManagementPage() {
  return (
    <Suspense
      fallback={
        <main className="flex-1 p-4 sm:p-5 lg:p-6 max-w-7xl w-full mx-auto flex items-center justify-center min-h-[50vh]">
          <p className="text-xs text-foreground-muted">Loading stories...</p>
        </main>
      }
    >
      <BlogManagementContent />
    </Suspense>
  );
}
