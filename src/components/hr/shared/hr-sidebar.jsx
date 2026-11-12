"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Newspaper,
  LogOut,
  X,
  Loader2,
} from "@/lib/icons";
import { cn } from "@/lib/utils";
import { notifySuccess, notifyError } from "@/lib/toast-feedback";

const NAV_ITEMS = [
  {
    name: "Dashboard",
    href: "/hr/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Jobs Management",
    href: "/hr/jobs",
    icon: Briefcase,
  },
  {
    name: "Candidates",
    href: "/hr/candidates",
    icon: Users,
  },
  {
    name: "Blog",
    href: "/hr/blog",
    icon: Newspaper,
  },
];

export function HrSidebar({ isOpen, onClose }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const response = await fetch("/api/hr/auth", { method: "DELETE" });
      const result = await response.json();
      notifySuccess("Signed out successfully.");
      router.push(result?.redirectUrl || "/hr/login");
      router.refresh();
    } catch {
      notifyError("Failed to sign out. Please try again.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-foreground/40 backdrop-blur-sm lg:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-surface transition-transform duration-200 ease-out lg:static lg:translate-x-0 shadow-2xs",
          isOpen ? "translate-x-0 shadow-card" : "-translate-x-full"
        )}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between border-b border-border/80 px-5">
          <div className="flex items-center gap-2.5">
            <Image
              src="/icon_only_meelte.png"
              alt="meelTe Logo"
              width={32}
              height={32}
              className="h-8 w-8 shrink-0 rounded-lg object-contain"
            />
            <span className="font-extrabold text-base tracking-tight text-foreground">
              HR Ops
            </span>
          </div>

          {/* Close button on mobile */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close sidebar navigation"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-foreground-secondary hover:bg-surface-muted hover:text-foreground lg:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        {/* Navigation Links (aligned with logo left edge at 20px) */}
        <div className="flex-1 overflow-y-auto px-3 py-4">
          <nav className="space-y-1.5">
            {NAV_ITEMS.map((item) => {
              const isActive =
                item.href === "/hr/dashboard"
                  ? pathname === "/hr/dashboard" || pathname === "/hr"
                  : pathname.startsWith(item.href);

              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex h-10 items-center gap-3 rounded-xl px-2.5 text-xs font-semibold transition-colors duration-150 select-none",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-1",
                    isActive
                      ? "bg-primary/10 text-primary font-bold"
                      : "text-foreground-secondary hover:bg-surface-muted/60 hover:text-foreground font-medium"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-4 w-4 shrink-0 transition-colors",
                      isActive ? "text-primary" : "text-foreground-muted"
                    )}
                    aria-hidden="true"
                  />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Card & Sign Out (Single consolidated card) */}
        <div className="border-t border-border/80 p-3.5">
          <div className="overflow-hidden rounded-xl border border-border bg-surface-subtle divide-y divide-border/60">
            {/* User Profile */}
            <div className="px-3.5 py-2.5">
              <p className="truncate text-xs font-semibold text-foreground">
                meelTe HR Ops
              </p>
              <p className="truncate text-[11px] text-foreground-muted">
                hr@meelte.com
              </p>
            </div>

            {/* Ghost Sign Out Action */}
            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex w-full items-center gap-2 px-3.5 py-2 text-xs font-medium text-foreground-secondary hover:text-error hover:bg-error/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 disabled:opacity-50"
            >
              {isLoggingOut ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-foreground-muted" aria-hidden="true" />
                  <span>Signing out...</span>
                </>
              ) : (
                <>
                  <LogOut className="h-3.5 w-3.5 text-foreground-muted group-hover:text-error" aria-hidden="true" />
                  <span>Sign Out</span>
                </>
              )}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

export default HrSidebar;
