"use client";

import React from "react";
import { Menu } from "@/lib/icons";
import { useHr } from "./hr-context";

export function HrHeader({ onToggleSidebar, title = "Dashboard", action }) {
  const { toggleSidebar } = useHr();
  const handleToggle = onToggleSidebar || toggleSidebar;

  return (
    <header className="sticky top-0 z-30 flex h-12 sm:h-13 w-full items-center justify-between border-b border-border bg-surface/90 px-4 backdrop-blur-md sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        {/* Mobile menu trigger */}
        <button
          type="button"
          onClick={handleToggle}
          aria-label="Open sidebar menu"
          className="flex h-9 w-9 items-center justify-center rounded-xl text-foreground-secondary hover:bg-surface-muted hover:text-foreground lg:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </button>

        {/* Minimal Context Title */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold tracking-tight text-foreground">
            {title}
          </span>
        </div>
      </div>

      {action ? (
        <div className="flex items-center gap-2.5">
          {action}
        </div>
      ) : null}
    </header>
  );
}

export default HrHeader;
