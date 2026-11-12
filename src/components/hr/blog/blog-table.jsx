"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  MoreVertical,
  Edit2,
  Trash2,
  Archive,
  Clock,
  CheckCircle2,
  XCircle,
  RefreshCw,
  FileText,
  Newspaper,
  Plus,
  Image as ImageIcon,
} from "@/lib/icons";
import { Button } from "@/components/ui/button";
import { BlogStatusBadge } from "@/components/hr/blog/blog-status-badge";
import { BLOG_STATUSES } from "@/constants/blog-constants";

/**
 * Formats a stored ISO timestamp as a compact en-IN date ("Nov 4, 2026").
 * The table only renders after the client-side fetch resolves, so this never
 * runs during prerender and cannot read the build clock (AI_RULE.md §2.6).
 */
function formatTableDate(iso) {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function BlogTable({
  blogPosts = [],
  statusFilter = "All",
  onUpdateStatus,
  onDeletePostClick,
}) {
  const [activeMenuPostId, setActiveMenuPostId] = useState(null);

  const toggleActionsMenu = (id) => {
    setActiveMenuPostId((prev) => (prev === id ? null : id));
  };

  // Close dropdown on click outside or Escape key
  useEffect(() => {
    if (!activeMenuPostId) return;

    const handleClickOutside = (e) => {
      if (!e.target.closest('[data-actions-menu="true"]')) {
        setActiveMenuPostId(null);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setActiveMenuPostId(null);
      }
    };

    document.addEventListener("pointerdown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeMenuPostId]);

  // Render contextual empty state
  const renderEmptyState = () => {
    const normalizedFilter = (statusFilter || "All").toLowerCase();

    let title = "No stories matched your criteria";
    let message =
      "Try adjusting your search terms or filters, or create a new story.";
    let IconComponent = Newspaper;

    if (normalizedFilter === BLOG_STATUSES.DRAFT) {
      title = "No drafts yet";
      message =
        "Stories saved as drafts from the editor are safely stored here until you publish them.";
      IconComponent = FileText;
    } else if (normalizedFilter === BLOG_STATUSES.PUBLISHED) {
      title = "No published stories";
      message = "Publishing a story from the editor makes it live on /blog.";
      IconComponent = Newspaper;
    } else if (normalizedFilter === BLOG_STATUSES.ARCHIVED) {
      title = "No archived stories";
      message = "Archived stories are kept here without appearing on /blog.";
      IconComponent = Archive;
    }

    return (
      <div className="flex flex-col items-center justify-center py-14 sm:py-16 px-4 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-muted text-primary mb-3">
          <IconComponent className="h-6 w-6" aria-hidden="true" />
        </div>
        <h3 className="text-sm sm:text-base font-bold text-foreground">
          {title}
        </h3>
        <p className="mt-1 max-w-sm text-xs text-foreground-muted leading-relaxed">
          {message}
        </p>
        <div className="mt-5">
          <Button
            as={Link}
            href="/hr/blog/new"
            variant="primary"
            size="sm"
            className="gap-1.5 rounded-xl font-semibold shadow-2xs"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            <span>Create New Story</span>
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-soft">
      {/* Container with min-height ensures dropdown menus on 1-2 rows never get clipped */}
      <div className="overflow-x-auto min-h-[250px]">
        <table className="w-full min-w-[860px] text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-border/80 bg-surface-subtle/80 text-foreground-muted uppercase tracking-wider text-[11px]">
              <th className="w-[36%] px-5 py-3 font-semibold">Story</th>
              <th className="w-[18%] px-4 py-3 font-semibold">Category</th>
              <th className="w-[14%] px-4 py-3 font-semibold">Published</th>
              <th className="w-[12%] px-4 py-3 font-semibold">Status</th>
              <th className="w-[20%] px-5 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {blogPosts.length > 0 ? (
              blogPosts.map((post) => {
                const status = (post.status || BLOG_STATUSES.DRAFT).toLowerCase();
                const isDraft = status === BLOG_STATUSES.DRAFT;
                const isPublished = status === BLOG_STATUSES.PUBLISHED;
                const lastEditedDate = formatTableDate(
                  post.updatedAt || post.createdAt
                );
                const publishedDate = formatTableDate(post.publishedAt);

                return (
                  <tr
                    key={post.id}
                    className="h-16 hover:bg-surface-subtle/60 transition-colors"
                  >
                    {/* Cover Thumbnail, Title & Slug */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3.5">
                        <div className="relative flex h-11 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border/80 bg-surface-muted">
                          {post.coverImage ? (
                            <Image
                              src={post.coverImage}
                              alt={post.coverImageAlt || post.title}
                              fill
                              sizes="64px"
                              className="object-cover"
                              unoptimized
                            />
                          ) : (
                            <ImageIcon
                              className="h-4 w-4 text-foreground-muted"
                              aria-hidden="true"
                            />
                          )}
                        </div>

                        <div className="min-w-0">
                          <div className="font-bold text-foreground text-sm truncate max-w-[260px]">
                            {post.title}
                          </div>
                          <div className="text-[11px] text-foreground-muted mt-0.5 truncate max-w-[260px]">
                            /blog/{post.slug}
                          </div>
                          {/* Last edited timestamp for drafts */}
                          {isDraft && lastEditedDate && (
                            <div className="mt-1 flex items-center gap-1 text-[10px] text-foreground-muted/90">
                              <Clock className="h-2.5 w-2.5 shrink-0" aria-hidden="true" />
                              <span>Last edited {lastEditedDate}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-4 py-3.5 text-foreground-secondary font-medium">
                      {post.category || "—"}
                    </td>

                    {/* Published date — never fabricated (AI_RULE.md §2.6) */}
                    <td className="px-4 py-3.5 text-foreground-secondary tabular-nums">
                      {publishedDate || (
                        <span className="text-foreground-muted select-none">—</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3.5">
                      <BlogStatusBadge status={status} />
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-3.5 text-right relative">
                      <div className="flex items-center justify-end gap-1.5 whitespace-nowrap">
                        {isDraft ? (
                          <Button
                            as={Link}
                            href={`/hr/blog/${post.id}/edit`}
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2.5 text-xs font-semibold text-primary hover:bg-primary/10 hover:text-primary transition-colors whitespace-nowrap shrink-0 rounded-lg"
                            aria-label={`Continue editing ${post.title}`}
                          >
                            <Edit2 className="h-3.5 w-3.5 mr-1 shrink-0" aria-hidden="true" />
                            <span>Continue Editing</span>
                          </Button>
                        ) : (
                          <Button
                            as={Link}
                            href={`/hr/blog/${post.id}/edit`}
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2.5 text-xs font-medium text-foreground-secondary hover:text-foreground whitespace-nowrap shrink-0 rounded-lg"
                            aria-label={`Edit ${post.title}`}
                          >
                            <Edit2 className="h-3.5 w-3.5 mr-1 text-foreground-muted shrink-0" aria-hidden="true" />
                            <span>Edit</span>
                          </Button>
                        )}

                        {/* Dropdown Menu */}
                        <div
                          data-actions-menu="true"
                          className="relative inline-block text-left shrink-0"
                        >
                          <button
                            type="button"
                            onClick={() => toggleActionsMenu(post.id)}
                            aria-label="More story actions"
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-foreground-secondary hover:bg-surface-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </button>

                          {activeMenuPostId === post.id && (
                            <div className="absolute right-0 top-9 z-30 w-44 rounded-xl border border-border bg-surface p-1 shadow-card">
                              {isDraft && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    onUpdateStatus(post.id, BLOG_STATUSES.PUBLISHED);
                                    setActiveMenuPostId(null);
                                  }}
                                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-medium text-success hover:bg-success-bg transition-colors cursor-pointer"
                                >
                                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                                  <span>Publish Story</span>
                                </button>
                              )}

                              {isPublished && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    onUpdateStatus(post.id, BLOG_STATUSES.DRAFT);
                                    setActiveMenuPostId(null);
                                  }}
                                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-medium text-foreground-secondary hover:bg-surface-muted transition-colors cursor-pointer"
                                >
                                  <XCircle className="h-3.5 w-3.5 shrink-0" />
                                  <span>Unpublish to Draft</span>
                                </button>
                              )}

                              {!isPublished && !isDraft && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    onUpdateStatus(post.id, BLOG_STATUSES.DRAFT);
                                    setActiveMenuPostId(null);
                                  }}
                                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-medium text-primary hover:bg-surface-muted transition-colors cursor-pointer"
                                >
                                  <RefreshCw className="h-3.5 w-3.5 shrink-0" />
                                  <span>Restore to Draft</span>
                                </button>
                              )}

                              {isPublished && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    onUpdateStatus(post.id, BLOG_STATUSES.ARCHIVED);
                                    setActiveMenuPostId(null);
                                  }}
                                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-medium text-foreground-secondary hover:bg-surface-muted transition-colors cursor-pointer"
                                >
                                  <Archive className="h-3.5 w-3.5 shrink-0" />
                                  <span>Archive Story</span>
                                </button>
                              )}

                              <div className="my-1 border-t border-border" />

                              <button
                                type="button"
                                onClick={() => {
                                  onDeletePostClick(post.id);
                                  setActiveMenuPostId(null);
                                }}
                                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-medium text-error hover:bg-error-bg transition-colors cursor-pointer"
                              >
                                <Trash2 className="h-3.5 w-3.5 shrink-0" />
                                <span>{isDraft ? "Delete Draft" : "Delete Story"}</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className="p-0">
                  {renderEmptyState()}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default BlogTable;
