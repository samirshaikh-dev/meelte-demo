"use client";

import React, { useState } from "react";
import { X, Plus } from "@/lib/icons";

/**
 * Accessible Tag/Skill Input Primitive
 * Follows meelTe design tokens (bg-surface-muted, text-primary, border-primary/20)
 * Complies with AVOID.md: clean chips, no excessive shadows or gradients.
 */
export function TagInput({
  tags = [],
  onChange,
  placeholder = "Add a skill (e.g. React, Next.js) and press Enter...",
  id = "job-skills",
  ariaDescribedBy,
}) {
  const [inputValue, setInputValue] = useState("");

  const addTag = (text) => {
    const trimmed = text.trim().replace(/^,+|,+$/g, "");
    if (!trimmed) return;

    // Prevent duplicates (case-insensitive check)
    const exists = tags.some(
      (t) => t.toLowerCase() === trimmed.toLowerCase()
    );
    if (!exists) {
      onChange([...tags, trimmed]);
    }
    setInputValue("");
  };

  const removeTag = (indexToRemove) => {
    onChange(tags.filter((_, idx) => idx !== indexToRemove));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === "Backspace" && !inputValue && tags.length > 0) {
      e.preventDefault();
      removeTag(tags.length - 1);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-1.5 min-h-[44px] rounded-xl border border-border bg-surface p-2 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/70 transition-all">
        {tags.map((tag, idx) => (
          <span
            key={`${tag}-${idx}`}
            className="inline-flex items-center gap-1 rounded-lg bg-surface-muted px-2.5 py-1 text-xs font-medium text-primary border border-primary/20"
          >
            <span>{tag}</span>
            <button
              type="button"
              onClick={() => removeTag(idx)}
              aria-label={`Remove skill ${tag}`}
              className="inline-flex h-3.5 w-3.5 items-center justify-center rounded-full text-primary hover:bg-primary/15 hover:text-primary-dark transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
            >
              <X className="h-2.5 w-2.5" aria-hidden="true" />
            </button>
          </span>
        ))}

        <div className="flex-1 min-w-[160px] flex items-center">
          <input
            id={id}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={() => {
              if (inputValue.trim()) {
                addTag(inputValue);
              }
            }}
            placeholder={tags.length === 0 ? placeholder : "Add another skill..."}
            aria-describedby={ariaDescribedBy}
            className="w-full bg-transparent px-1.5 py-1 text-sm text-foreground placeholder:text-foreground-secondary/60 focus:outline-none"
          />
          {inputValue.trim() && (
            <button
              type="button"
              onClick={() => addTag(inputValue)}
              className="mr-1 inline-flex items-center gap-1 rounded-md bg-surface-muted px-2 py-0.5 text-xs font-medium text-primary hover:bg-primary/20 transition-colors"
            >
              <Plus className="h-3 w-3" />
              <span>Add</span>
            </button>
          )}
        </div>
      </div>
      <p className="text-[11px] text-foreground-secondary">
        Press <kbd className="rounded border border-border bg-surface-subtle px-1 py-0.5 font-mono text-[10px]">Enter</kbd> or comma to add a skill tag.
      </p>
    </div>
  );
}
