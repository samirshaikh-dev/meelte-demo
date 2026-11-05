"use client";

import React, { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Undo2,
  Redo2,
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
      className={`inline-flex h-8 w-8 items-center justify-center rounded-lg text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 disabled:opacity-40 disabled:cursor-not-allowed ${
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
 * Accessible Tiptap Rich Text Editor
 * Complies with docs/Design.md and AVOID.md:
 * - High-contrast focus states (ring-primary/70)
 * - Coerces empty markup to "" for Zod validation
 * - Accessible toolbar with aria-labels and keyboard navigation
 * - Clean semantic typography without decorative visual clutter
 */
export function RichTextEditor({
  value = "",
  onChange,
  placeholder = "Write details here...",
  id,
  hasError = false,
  ariaDescribedBy,
}) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
        bulletList: {
          HTMLAttributes: {
            class: "list-disc pl-5 my-2 space-y-1",
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: "list-decimal pl-5 my-2 space-y-1",
          },
        },
      }),
      Placeholder.configure({
        placeholder,
        emptyEditorClass:
          "before:content-[attr(data-placeholder)] before:text-foreground-secondary/50 before:float-left before:pointer-events-none before:h-0",
      }),
    ],
    content: value || "",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        id: id || undefined,
        class:
          "min-h-[140px] max-h-[360px] overflow-y-auto px-3.5 py-2.5 text-sm text-foreground focus:outline-none leading-relaxed",
        "aria-describedby": ariaDescribedBy,
      },
      // Clean pasted content to supported formatting only
      transformPastedHTML(html) {
        // Basic cleanup of word/web styles
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

  // Sync value if updated externally (e.g. form reset or draft restore)
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      if (!value) {
        editor.commands.setContent("");
      } else if (isRichTextEmpty(value) && editor.isEmpty) {
        // Both are effectively empty, do nothing
      } else {
        editor.commands.setContent(value);
      }
    }
  }, [value, editor]);

  if (!editor) {
    return (
      <div className="min-h-[180px] w-full animate-pulse rounded-xl border border-border bg-surface-subtle" />
    );
  }

  return (
    <div
      className={`group rounded-xl border bg-surface transition-all focus-within:ring-2 focus-within:ring-primary/70 focus-within:border-primary ${
        hasError ? "border-error ring-1 ring-error/50" : "border-border hover:border-foreground-muted/40"
      }`}
    >
      {/* Editor Toolbar */}
      <div
        role="toolbar"
        aria-label="Formatting options"
        className="flex flex-wrap items-center gap-1 border-b border-border bg-surface-subtle/80 px-2.5 py-1.5 rounded-t-xl"
      >
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
          ariaLabel="Bold"
        >
          <Bold className="h-3.5 w-3.5" aria-hidden="true" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
          ariaLabel="Italic"
        >
          <Italic className="h-3.5 w-3.5" aria-hidden="true" />
        </ToolbarButton>

        <div className="mx-1 h-4 w-px bg-border" aria-hidden="true" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive("heading", { level: 2 })}
          ariaLabel="Heading 2"
        >
          <Heading2 className="h-3.5 w-3.5" aria-hidden="true" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          isActive={editor.isActive("heading", { level: 3 })}
          ariaLabel="Heading 3"
        >
          <Heading3 className="h-3.5 w-3.5" aria-hidden="true" />
        </ToolbarButton>

        <div className="mx-1 h-4 w-px bg-border" aria-hidden="true" />

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

        <div className="mx-1 h-4 w-px bg-border" aria-hidden="true" />

        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          ariaLabel="Undo"
        >
          <Undo2 className="h-3.5 w-3.5" aria-hidden="true" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          ariaLabel="Redo"
        >
          <Redo2 className="h-3.5 w-3.5" aria-hidden="true" />
        </ToolbarButton>
      </div>

      {/* Editable Content */}
      <EditorContent editor={editor} />
    </div>
  );
}
