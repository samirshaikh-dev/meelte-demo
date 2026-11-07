"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";
import {
  Menu,
  X,
  Compass,
  Users,
  Mail,
  Store,
  ChevronDown,
  Briefcase,
  HelpCircle,
  Home,
} from "../../lib/icons";
import { PLAY_STORE_URL, APP_STORE_URL } from "../../config/site";
import { StoreButton } from "./store-button";

const PRODUCT_ITEMS = [
  { label: "How It Works", href: "/how-it-works", icon: Compass, note: "Roles, app experience & platform flow" },
  { label: "For Merchants", href: "/for-merchants", icon: Store, note: "Promote your shop & local offers" },
];

const COMPANY_ITEMS = [
  // { label: "Home", href: "/", icon: Home, note: "Explore offers and community events" },
  { label: "About Us", href: "/about", icon: Users, note: "Our mission, pillars & story" },
  { label: "Contact Us", href: "/contact", icon: Mail, note: "Support, partnerships & queries" },
  { label: "FAQ", href: "/faq", icon: HelpCircle, note: "Common questions & answers" },
];

export function MobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [productExpanded, setProductExpanded] = useState(false);
  const [companyExpanded, setCompanyExpanded] = useState(false);
  const isProductActive = PRODUCT_ITEMS.some(
    (item) => pathname === item.href || pathname?.startsWith(`${item.href}/`)
  );
  const isCompanyActive = COMPANY_ITEMS.some(
    (item) =>
      item.href !== "/" &&
      (pathname === item.href || pathname?.startsWith(`${item.href}/`))
  );
  const isCareersActive = pathname === "/careers" || pathname?.startsWith("/careers/");

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          aria-label="Open navigation menu"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-border/80 bg-surface text-foreground shadow-2xs transition-colors hover:border-primary/20 hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 lg:hidden"
        >
          <Menu className="h-5 w-5 text-foreground" aria-hidden="true" />
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs transition-opacity data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content
          aria-describedby="mobile-nav-description"
          className="fixed inset-y-0 right-0 z-50 flex w-full max-w-xs flex-col border-l border-border/80 bg-surface p-6 shadow-card transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right duration-200 focus:outline-none"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border/80 pb-5">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="group flex items-center gap-2.5 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
              aria-label="meelTe Home"
            >
              <Image
                src="/icon_only_meelte.png"
                alt="meelTe"
                width={36}
                height={36}
                className="h-9 w-9 shrink-0 rounded-xl border border-primary/10 object-contain shadow-2xs transition-transform duration-200"
              />
              <Image
                src="/only_meelte.png"
                alt="meelTe wordmark"
                width={100}
                height={28}
                className="h-6.5 w-auto shrink-0 max-w-[100px] object-contain tracking-tight"
                style={{ letterSpacing: "-0.02em" }}
                priority={false}
              />
            </Link>
            <Dialog.Close asChild>
              <button
                type="button"
                aria-label="Close navigation menu"
                className="flex h-10 w-10 items-center justify-center rounded-xl text-foreground-secondary transition-colors hover:bg-surface-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </Dialog.Close>
          </div>

          <p id="mobile-nav-description" className="sr-only">
            meelTe navigation menu with product and company links plus the Google Play and App Store downloads.
          </p>

          {/* Navigation Links */}
          <nav className="mt-5 flex flex-1 flex-col gap-1 overflow-y-auto pr-1">
            {/* Product Accordion */}
            <div className="flex flex-col">
              <button
                type="button"
                onClick={() => setProductExpanded(!productExpanded)}
                className={`flex items-center justify-between rounded-xl p-2.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-inset ${
                  isProductActive
                    ? "bg-surface-muted text-primary"
                    : "text-foreground hover:bg-surface-muted"
                }`}
                aria-expanded={productExpanded}
              >
                <span>Product</span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-200 ${
                    productExpanded ? "rotate-180" : ""
                  }`}
                  aria-hidden="true"
                />
              </button>
              {productExpanded && (
                <div className="ml-2 mt-1 flex flex-col gap-1">
                  {PRODUCT_ITEMS.map((item) => {
                    const Icon = item.icon;
                    const isActive =
                      item.href === "/"
                        ? pathname === "/"
                        : pathname === item.href || pathname?.startsWith(`${item.href}/`);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className={`group flex items-start gap-3 rounded-xl p-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-inset ${
                          isActive
                            ? "bg-surface-muted text-primary"
                            : "text-foreground hover:bg-surface-muted hover:text-primary"
                        }`}
                        aria-current={isActive ? "page" : undefined}
                      >
                        <div
                          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-primary transition-colors ${
                            isActive
                              ? "bg-primary text-white"
                              : "bg-surface-muted group-hover:bg-primary group-hover:text-white"
                          }`}
                        >
                          <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                        </div>
                        <div className="flex flex-col min-w-0 flex-1">
                          <span
                            className={`font-semibold ${
                              isActive
                                ? "text-primary"
                                : "text-foreground group-hover:text-primary"
                            }`}
                          >
                            {item.label}
                          </span>
                          <span className="text-[10px] text-foreground-secondary">
                            {item.note}
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Careers - Direct Link */}
            <Link
              href="/careers"
              onClick={() => setOpen(false)}
              className={`group flex items-center gap-3 rounded-xl p-2.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-inset ${
                isCareersActive
                  ? "bg-surface-muted text-primary"
                  : "text-foreground hover:bg-surface-muted hover:text-primary"
              }`}
              aria-current={isCareersActive ? "page" : undefined}
            >
              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-primary transition-colors ${
                  isCareersActive
                    ? "bg-primary text-white"
                    : "bg-surface-muted group-hover:bg-primary group-hover:text-white"
                }`}
              >
                <Briefcase className="h-3.5 w-3.5" aria-hidden="true" />
              </div>
              <span>Careers</span>
            </Link>

            {/* Company Accordion */}
            <div className="flex flex-col">
              <button
                type="button"
                onClick={() => setCompanyExpanded(!companyExpanded)}
                className={`flex items-center justify-between rounded-xl p-2.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-inset ${
                  isCompanyActive
                    ? "bg-surface-muted text-primary"
                    : "text-foreground hover:bg-surface-muted"
                }`}
                aria-expanded={companyExpanded}
              >
                <span>Company</span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-200 ${
                    companyExpanded ? "rotate-180" : ""
                  }`}
                  aria-hidden="true"
                />
              </button>
              {companyExpanded && (
                <div className="ml-2 mt-1 flex flex-col gap-1">
                  {COMPANY_ITEMS.map((item) => {
                    const Icon = item.icon;
                    const isActive =
                      item.href === "/"
                        ? pathname === "/"
                        : pathname === item.href || pathname?.startsWith(`${item.href}/`);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className={`group flex items-start gap-3 rounded-xl p-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-inset ${
                          isActive
                            ? "bg-surface-muted text-primary"
                            : "text-foreground hover:bg-surface-muted hover:text-primary"
                        }`}
                        aria-current={isActive ? "page" : undefined}
                      >
                        <div
                          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-primary transition-colors ${
                            isActive
                              ? "bg-primary text-white"
                              : "bg-surface-muted group-hover:bg-primary group-hover:text-white"
                          }`}
                        >
                          <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                        </div>
                        <div className="flex flex-col min-w-0 flex-1">
                          <span
                            className={`font-semibold ${
                              isActive
                                ? "text-primary"
                                : "text-foreground group-hover:text-primary"
                            }`}
                          >
                            {item.label}
                          </span>
                          <span className="text-[10px] text-foreground-secondary">
                            {item.note}
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </nav>

          {/* Bottom actions */}
          <div className="mt-auto flex flex-col gap-2.5 border-t border-border/80 pt-5">
            <span className="text-[11px] font-semibold text-foreground-secondary">
              Get the app
            </span>
            <StoreButton type="google" href={PLAY_STORE_URL} variant="brand" />
            <StoreButton type="apple" href={APP_STORE_URL} variant="brand" />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default MobileNav;
