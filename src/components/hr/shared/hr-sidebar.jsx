"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  ShieldCheck,
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
];

export function HrSidebar({ isOpen, onClose }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const response = await fetch("/api/hr/logout", { method: "POST" });
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
          "fixed top-0 bottom-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-surface transition-transform duration-200 ease-out lg:static lg:translate-x-0",
          isOpen ? "translate-x-0 shadow-card" : "-translate-x-full"
        )}
      >
        {/* Brand / Logo Area */}
        <div className="flex h-16 items-center justify-between border-b border-border px-5">
          <Link
            href="/hr/dashboard"
            className="flex items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white font-bold text-base">
              m
            </span>
            <div className="flex flex-col">
              <span className="font-extrabold text-base tracking-tight text-foreground">
                meelTe
              </span>
              <span className="text-[10px] font-medium tracking-wide uppercase text-primary">
                HR Recruitment
              </span>
            </div>
          </Link>

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

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto px-3.5 py-4">
          <div className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-wider text-foreground-muted">
            Main Menu
          </div>

          <nav className="space-y-1">
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
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition-colors duration-150 select-none",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70",
                    isActive
                      ? "bg-surface-muted text-primary font-bold shadow-xs"
                      : "text-foreground-secondary hover:bg-surface-subtle hover:text-foreground"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-4 w-4 shrink-0 transition-colors",
                      isActive ? "text-primary" : "text-foreground-secondary"
                    )}
                    aria-hidden="true"
                  />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Card & Sign Out */}
        <div className="border-t border-border p-3.5 space-y-2">
          <div className="flex items-center gap-3 rounded-xl border border-border bg-surface-subtle p-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-muted text-primary">
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-foreground">
                Meelte HR Ops
              </p>
              <p className="truncate text-[11px] text-foreground-muted">
                hr@meelte.com
              </p>
            </div>
          </div>

          {/* Logout Action */}
          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-surface px-3 py-2 text-xs font-semibold text-foreground-secondary hover:bg-error-bg hover:text-error hover:border-error-border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 disabled:opacity-50"
          >
            {isLoggingOut ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                <span>Signing out...</span>
              </>
            ) : (
              <>
                <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Sign Out</span>
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}

export default HrSidebar;
