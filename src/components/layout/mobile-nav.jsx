"use client";

import React, { useState } from "react";
import Link from "next/link";
import * as Dialog from "@radix-ui/react-dialog";
import {
  Menu,
  X,
  Download,
  Compass,
  Users,
  Mail,
  MapPin,
  Lightbulb,
  Store,
  ChevronDown,
  Briefcase,
  FileText,
} from "../../lib/icons";
import { PLAY_STORE_URL } from "../../config/site";
import { Button } from "../ui/button";

const PRODUCT_ITEMS = [
  { label: "How It Works", href: "/how-it-works", icon: Lightbulb, note: "Roles, app experience & platform flow" },
  { label: "Discover Nearby", href: "/discover", icon: Compass, note: "Find local shops, events & services" },
  { label: "Case Studies", href: "/case-studies", icon: FileText, note: "See how local shops grow with Meelte" },
];

const COMPANY_ITEMS = [
  { label: "About Us", href: "/about", icon: Users, note: "Our mission, pillars & story" },
  { label: "Careers", href: "/careers", icon: Briefcase, note: "Join the Meelte team" },
  { label: "Contact Us", href: "/contact", icon: Mail, note: "Support, partnerships & queries" },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const [productExpanded, setProductExpanded] = useState(false);
  const [companyExpanded, setCompanyExpanded] = useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          aria-label="Open navigation menu"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface text-foreground shadow-2xs transition-colors hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 md:hidden"
        >
          <Menu className="h-5 w-5 text-foreground" aria-hidden="true" />
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs transition-opacity data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content
          aria-describedby="mobile-nav-description"
          className="fixed inset-y-0 right-0 z-50 flex w-full max-w-xs flex-col bg-surface p-6 shadow-2xl transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right duration-200 focus:outline-none"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-border">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-hover text-white font-bold text-lg shadow-soft">
                M
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-base text-foreground tracking-tight leading-none">Meelte</span>
                <span className="text-[10px] text-primary font-semibold tracking-wider uppercase mt-0.5">Community</span>
              </div>
            </div>
            <Dialog.Close asChild>
              <button
                type="button"
                aria-label="Close navigation menu"
                className="flex h-9 w-9 items-center justify-center rounded-xl text-foreground-secondary hover:bg-surface-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </Dialog.Close>
          </div>

          <p id="mobile-nav-description" className="sr-only">
            Meelte mobile navigation menu with direct links to ecosystem, discovery categories, merchant desk, trust guidelines, and app downloads.
          </p>

          {/* Active Cities Pill */}
          <div className="mt-3 py-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-muted text-primary text-xs font-medium border border-primary/10">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
              <MapPin className="h-3 w-3" aria-hidden="true" />
              <span>Bengaluru · Gaya · Ranchi</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="mt-3 flex flex-col gap-1 flex-1 overflow-y-auto pr-1">
            {/* Product Accordion */}
            <div className="flex flex-col">
              <button
                type="button"
                onClick={() => setProductExpanded(!productExpanded)}
                className="flex items-center justify-between p-2.5 rounded-xl text-sm font-semibold text-foreground hover:bg-surface-muted transition-colors"
                aria-expanded={productExpanded}
              >
                <span>Product</span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-200 ${productExpanded ? "rotate-180" : ""}`}
                  aria-hidden="true"
                />
              </button>
              {productExpanded && (
                <div className="flex flex-col gap-1 ml-2 mt-1">
                  {PRODUCT_ITEMS.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className="flex items-start gap-3 p-2 rounded-xl text-sm font-medium text-foreground hover:bg-surface-muted hover:text-primary transition-colors group"
                      >
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-surface-muted text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                          <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                        </div>
                        <div className="flex flex-col min-w-0 flex-1">
                          <span className="font-semibold text-foreground group-hover:text-primary">{item.label}</span>
                          <span className="text-[10px] text-foreground-secondary">{item.note}</span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* For Merchants - Direct Link */}
            <Link
              href="/for-merchants"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 p-2.5 rounded-xl text-sm font-semibold text-foreground hover:bg-surface-muted hover:text-primary transition-colors group"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-muted text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                <Store className="h-4 w-4" aria-hidden="true" />
              </div>
              <span>For Merchants</span>
            </Link>

            {/* Company Accordion */}
            <div className="flex flex-col">
              <button
                type="button"
                onClick={() => setCompanyExpanded(!companyExpanded)}
                className="flex items-center justify-between p-2.5 rounded-xl text-sm font-semibold text-foreground hover:bg-surface-muted transition-colors"
                aria-expanded={companyExpanded}
              >
                <span>Company</span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-200 ${companyExpanded ? "rotate-180" : ""}`}
                  aria-hidden="true"
                />
              </button>
              {companyExpanded && (
                <div className="flex flex-col gap-1 ml-2 mt-1">
                  {COMPANY_ITEMS.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className="flex items-start gap-3 p-2 rounded-xl text-sm font-medium text-foreground hover:bg-surface-muted hover:text-primary transition-colors group"
                      >
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-surface-muted text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                          <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                        </div>
                        <div className="flex flex-col min-w-0 flex-1">
                          <span className="font-semibold text-foreground group-hover:text-primary">{item.label}</span>
                          <span className="text-[10px] text-foreground-secondary">{item.note}</span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </nav>

          {/* Bottom Actions */}
          <div className="pt-4 border-t border-border mt-auto flex flex-col gap-2.5">
            <Button
              as="a"
              href={PLAY_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              variant="primary"
              size="md"
              className="w-full justify-center shadow-soft"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              <span>Get the App</span>
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default MobileNav;
