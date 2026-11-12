"use client";

import React, { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import LinkExtension from "@tiptap/extension-link";
import {
  Bold,
  Italic,
  Strikethrough,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Minus,
  Link as LinkIcon,
  Unlink,
  Undo2,
  Redo2,
  Clock,
  FileText,
} from "@/lib/icons";
import { isRichTextEmpty } from "@/validation/hr/job-validation";

/**
 * Accessible Toolbar Button for Tiptap
 */
function ToolbarButton({
  onClick,
  isActive = false,
  disabled = false,
  ariaLabel,
  title,
  children,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      title={title || ariaLabel}
      className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 disabled:opacity-40 disabled:cursor-not-allowed ${
        isActive
          ? "bg-surface-muted text-primary font-semibold border border-primary/20 shadow-xs"
          : "text-foreground-secondary hover:bg-surface-muted hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

/**
 * Calculate editorial reading statistics from rich text HTML
 */
export function calculateTextStats(html) {
  if (!html) return { words: 0, characters: 0, readTimeMinutes: 0 };
  const clean = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  if (!clean) return { words: 0, characters: 0, readTimeMinutes: 0 };
  const words = clean.split(/\s+/).filter(Boolean).length;
  const characters = clean.length;
  const readTimeMinutes = Math.max(1, Math.ceil(words / 200));
  return { words, characters, readTimeMinutes };
}

/**
 * Editorial Blog Canvas Rich Text Editor
 * Meets meelTe design tokens & accessible editorial guidelines:
 * - Flat writing canvas (Medium / Substack feel)
 * - Sticky toolbar with horizontal scroll on mobile
 * - Extended formatting: Bold, Italic, Strikethrough, H2, H3, Lists, Blockquote, Divider, Link
 * - Live word count and estimated reading time
 * - High-contrast focus state and full keyboard accessibility
 */
export function BlogEditor({
  value = "",
  onChange,
  placeholder = "Write your story here... Use # for headings, > for quotes, or - for lists.",
  id = "blog-article-editor",
  hasError = false,
  ariaDescribedBy,
}) {
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
          HTMLAttributes: {
            class: "font-bold text-foreground tracking-tight my-4",
          },
        },
        bulletList: {
          HTMLAttributes: {
            class: "list-disc pl-5 my-3 space-y-1 text-foreground",
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: "list-decimal pl-5 my-3 space-y-1 text-foreground",
          },
        },
        blockquote: {
          HTMLAttributes: {
            class: "border-l-4 border-primary/60 pl-4 py-1.5 my-4 italic text-foreground-secondary font-medium",
          },
        },
        horizontalRule: {
          HTMLAttributes: {
            class: "border-t border-border my-6",
          },
        },
      }),
      LinkExtension.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary underline font-medium hover:text-primary-hover transition-colors",
          rel: "noopener noreferrer",
          target: "_blank",
        },
      }),
      Placeholder.configure({
        placeholder,
        emptyEditorClass:
          "before:content-[attr(data-placeholder)] before:text-foreground-secondary/40 before:float-left before:pointer-events-none before:h-0",
      }),
    ],
    content: value || "",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        id,
        class:
          "min-h-[380px] px-5 py-4 text-sm sm:text-base text-foreground focus:outline-none leading-relaxed",
        "aria-describedby": ariaDescribedBy,
      },
      transformPastedHTML(html) {
        return html
          .replace(/style="[^"]*"/gi, "")
          .replace(/class="[^"]*"/gi, "");
      },
    },
    onUpdate({ editor: currentEditor }) {
      const html = currentEditor.getHTML();
      if (currentEditor.isEmpty || isRichTextEmpty(html)) {
        onChange?.("");
      } else {
        onChange?.(html);
      }
    },
  });

  // Sync external value changes
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      if (!value) {
        editor.commands.setContent("");
      } else if (isRichTextEmpty(value) && editor.isEmpty) {
        // Both empty
      } else {
        editor.commands.setContent(value);
      }
    }
  }, [value, editor]);

  if (!editor) {
    return (
      <div className="min-h-[420px] w-full animate-pulse rounded-2xl border border-border bg-surface-subtle" />
    );
  }

  const stats = calculateTextStats(value);

  const handleSetLink = () => {
    if (!linkUrl.trim()) {
      editor.chain().focus().unsetLink().run();
    } else {
      let formattedUrl = linkUrl.trim();
      if (!/^https?:\/\//i.test(formattedUrl)) {
        formattedUrl = `https://${formattedUrl}`;
      }
      editor.chain().focus().extendMarkRange("link").setLink({ href: formattedUrl }).run();
    }
    setLinkModalOpen(false);
    setLinkUrl("");
  };

  const handleOpenLinkModal = () => {
    const previousUrl = editor.getAttributes("link").href || "";
    setLinkUrl(previousUrl);
    setLinkModalOpen(true);
  };

  return (
    <div
      className={`relative rounded-2xl border bg-surface transition-all shadow-soft focus-within:ring-2 focus-within:ring-primary/70 focus-within:border-primary ${
        hasError
          ? "border-error ring-1 ring-error/50"
          : "border-border hover:border-border/90"
      }`}
    >
      {/* Sticky Editor Toolbar */}
      <div
        role="toolbar"
        aria-label="Story formatting options"
        className="sticky top-14 z-20 flex items-center justify-between border-b border-border bg-surface/95 backdrop-blur-md px-3 py-2 rounded-t-2xl gap-2 overflow-x-auto no-scrollbar"
      >
        <div className="flex items-center gap-1 shrink-0">
          {/* Headings */}
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            isActive={editor.isActive("heading", { level: 2 })}
            ariaLabel="Heading 2"
          >
            <Heading2 className="h-4 w-4" aria-hidden="true" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            isActive={editor.isActive("heading", { level: 3 })}
            ariaLabel="Heading 3"
          >
            <Heading3 className="h-4 w-4" aria-hidden="true" />
          </ToolbarButton>

          <div className="h-4 w-px bg-border mx-1 shrink-0" aria-hidden="true" />

          {/* Inline Styles */}
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive("bold")}
            ariaLabel="Bold (Ctrl+B)"
          >
            <Bold className="h-3.5 w-3.5" aria-hidden="true" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive("italic")}
            ariaLabel="Italic (Ctrl+I)"
          >
            <Italic className="h-3.5 w-3.5" aria-hidden="true" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            isActive={editor.isActive("strike")}
            ariaLabel="Strikethrough"
          >
            <Strikethrough className="h-3.5 w-3.5" aria-hidden="true" />
          </ToolbarButton>

          <div className="h-4 w-px bg-border mx-1 shrink-0" aria-hidden="true" />

          {/* Lists */}
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive("bulletList")}
            ariaLabel="Bullet list"
          >
            <List className="h-3.5 w-3.5" aria-hidden="true" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive("orderedList")}
            ariaLabel="Numbered list"
          >
            <ListOrdered className="h-3.5 w-3.5" aria-hidden="true" />
          </ToolbarButton>

          <div className="h-4 w-px bg-border mx-1 shrink-0" aria-hidden="true" />

          {/* Blockquote & Divider */}
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            isActive={editor.isActive("blockquote")}
            ariaLabel="Blockquote (>)"
          >
            <Quote className="h-3.5 w-3.5" aria-hidden="true" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            ariaLabel="Insert divider (---)"
          >
            <Minus className="h-3.5 w-3.5" aria-hidden="true" />
          </ToolbarButton>

          <div className="h-4 w-px bg-border mx-1 shrink-0" aria-hidden="true" />

          {/* Link */}
          <ToolbarButton
            onClick={handleOpenLinkModal}
            isActive={editor.isActive("link")}
            ariaLabel="Add or edit link"
          >
            <LinkIcon className="h-3.5 w-3.5" aria-hidden="true" />
          </ToolbarButton>

          {editor.isActive("link") && (
            <ToolbarButton
              onClick={() => editor.chain().focus().unsetLink().run()}
              ariaLabel="Remove link"
            >
              <Unlink className="h-3.5 w-3.5 text-error" aria-hidden="true" />
            </ToolbarButton>
          )}

          <div className="h-4 w-px bg-border mx-1 shrink-0" aria-hidden="true" />

          {/* Undo / Redo */}
          <ToolbarButton
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            ariaLabel="Undo (Ctrl+Z)"
          >
            <Undo2 className="h-3.5 w-3.5" aria-hidden="true" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            ariaLabel="Redo (Ctrl+Y)"
          >
            <Redo2 className="h-3.5 w-3.5" aria-hidden="true" />
          </ToolbarButton>
        </div>

        {/* Read stats badge on the right of toolbar */}
        <div className="hidden sm:flex items-center gap-3 text-xs font-medium text-foreground-secondary shrink-0 pl-2">
          <span className="flex items-center gap-1">
            <FileText className="h-3 w-3 text-primary" aria-hidden="true" />
            <span>{stats.words} words</span>
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3 text-primary" aria-hidden="true" />
            <span>~{stats.readTimeMinutes} min read</span>
          </span>
        </div>
      </div>

      {/* Inline Link Prompt Modal/Popover */}
      {linkModalOpen && (
        <div className="border-b border-border bg-surface-subtle p-3 flex flex-wrap items-center gap-2 text-xs">
          <span className="font-semibold text-foreground">Insert link URL:</span>
          <input
            type="url"
            placeholder="https://example.com"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSetLink();
              } else if (e.key === "Escape") {
                setLinkModalOpen(false);
              }
            }}
            className="h-8 flex-1 min-w-[200px] rounded-lg border border-border bg-surface px-2.5 text-xs text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
            autoFocus
          />
          <button
            type="button"
            onClick={handleSetLink}
            className="h-8 px-3 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary-hover transition-colors"
          >
            Apply
          </button>
          <button
            type="button"
            onClick={() => setLinkModalOpen(false)}
            className="h-8 px-3 rounded-lg border border-border bg-surface text-foreground-secondary text-xs font-semibold hover:bg-surface-muted transition-colors"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Writing Canvas */}
      <EditorContent editor={editor} />

      {/* Bottom Canvas Stats Bar on Mobile */}
      <div className="sm:hidden flex items-center justify-between border-t border-border/80 px-4 py-2 text-xs text-foreground-secondary bg-surface-subtle/50 rounded-b-2xl">
        <span>{stats.words} words</span>
        <span>~{stats.readTimeMinutes} min read</span>
      </div>
    </div>
  );
}

