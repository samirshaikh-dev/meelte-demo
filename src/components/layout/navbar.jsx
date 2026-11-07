"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  Compass,
  Store,
  Users,
  Mail,
  HelpCircle,
  Home,
} from "../../lib/icons";
import { PLAY_STORE_URL, APP_STORE_URL } from "../../config/site";
import { Container } from "./container";
import { StoreButton } from "./store-button";
import { MobileNav } from "./mobile-nav";

const PRODUCT_LINKS = [
  {
    label: "How It Works",
    href: "/how-it-works",
    description: "Roles, app experience & platform flow",
    icon: Compass,
  },
  {
    label: "For Merchants",
    href: "/for-merchants",
    description: "Promote your shop & local offers",
    icon: Store,
  },
];

const COMPANY_LINKS = [
  // {
  //   label: "Home",
  //   href: "/",
  //   description: "Explore offers and community events",
  //   icon: Home,
  // },
  {
    label: "About Us",
    href: "/about",
    description: "Our mission, pillars & story",
    icon: Users,
  },
  {
    label: "Contact Us",
    href: "/contact",
    description: "Support, partnerships & queries",
    icon: Mail,
  },
  {
    label: "FAQ",
    href: "/faq",
    description: "Common questions & answers",
    icon: HelpCircle,
  },
];

export function Navbar() {
  const pathname = usePathname();
  const [activeDropdown, setActiveDropdown] = useState(null); // 'product' | 'company' | null
  const productRef = useRef(null);
  const companyRef = useRef(null);
  const timeoutRef = useRef(null);

  const handleMouseEnter = (menu) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveDropdown(menu);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        productRef.current &&
        !productRef.current.contains(event.target) &&
        companyRef.current &&
        !companyRef.current.contains(event.target)
      ) {
        setActiveDropdown(null);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setActiveDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const isProductActive = PRODUCT_LINKS.some(
    (link) => pathname === link.href || pathname?.startsWith(`${link.href}/`)
  );
  const isCompanyActive = COMPANY_LINKS.some(
    (link) =>
      link.href !== "/" &&
      (pathname === link.href || pathname?.startsWith(`${link.href}/`))
  );
  const isCareersActive = pathname === "/careers" || pathname?.startsWith("/careers/");

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-surface/90 shadow-2xs backdrop-blur-md transition-colors duration-200">
      <Container className="flex h-16 items-center justify-between gap-4">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/"
            className="group flex items-center gap-2.5 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
            aria-label="meelTe Home"
          >
            <Image
              src="/icon_only_meelte.png"
              alt="meelTe"
              width={36}
              height={36}
              className="h-9 w-9 shrink-0 rounded-xl border border-primary/10 object-contain shadow-2xs transition-transform duration-200 group-hover:scale-105"
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
        </div>

        {/* Center: Desktop Navigation Links */}
        <nav
          className="hidden lg:flex flex-1 items-center justify-center gap-1"
          aria-label="Main Navigation"
        >
          {/* Product Dropdown */}
          <div
            className="relative"
            ref={productRef}
            onMouseEnter={() => handleMouseEnter("product")}
            onMouseLeave={handleMouseLeave}
          >
            <button
              type="button"
              onClick={() => {
                setActiveDropdown(activeDropdown === "product" ? null : "product");
              }}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 ${
                isProductActive || activeDropdown === "product"
                  ? "bg-surface-muted text-primary font-semibold"
                  : "text-foreground-secondary hover:text-foreground hover:bg-surface-muted/60"
              }`}
              aria-expanded={activeDropdown === "product"}
              aria-haspopup="true"
            >
              <span>Product</span>
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform duration-200 ${
                  activeDropdown === "product" ? "rotate-180" : ""
                }`}
                aria-hidden="true"
              />
            </button>

            {activeDropdown === "product" && (
              <div
                className="absolute left-0 top-full z-50 mt-2 w-72 rounded-2xl border border-primary/15 bg-surface/98 p-2 shadow-card backdrop-blur-md"
                onMouseEnter={() => handleMouseEnter("product")}
                onMouseLeave={handleMouseLeave}
              >
                <div className="flex flex-col gap-1">
                  {PRODUCT_LINKS.map((link) => {
                    const Icon = link.icon;
                    const isActive =
                      link.href === "/"
                        ? pathname === "/"
                        : pathname === link.href || pathname?.startsWith(`${link.href}/`);
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setActiveDropdown(null)}
                        className={`group flex items-start gap-3 rounded-xl p-2.5 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 ${
                          isActive
                            ? "bg-surface-muted text-primary"
                            : "text-foreground hover:bg-surface-muted/70 hover:text-primary"
                        }`}
                        aria-current={isActive ? "page" : undefined}
                      >
                        <div
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors ${
                            isActive
                              ? "bg-primary text-white"
                              : "bg-surface-muted text-primary group-hover:bg-primary group-hover:text-white"
                          }`}
                        >
                          <Icon className="h-4 w-4" aria-hidden="true" />
                        </div>
                        <div className="flex flex-col min-w-0 flex-1">
                          <span
                            className={`text-sm font-semibold transition-colors ${
                              isActive
                                ? "text-primary"
                                : "text-foreground group-hover:text-primary"
                            }`}
                          >
                            {link.label}
                          </span>
                          <span className="text-xs text-foreground-secondary line-clamp-1">
                            {link.description}
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Careers - Direct Link */}
          <Link
            href="/careers"
            onMouseEnter={() => handleMouseEnter(null)}
            className={`inline-flex items-center rounded-lg px-3 py-1.5 text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 ${
              isCareersActive
                ? "bg-surface-muted text-primary font-semibold"
                : "text-foreground-secondary hover:text-foreground hover:bg-surface-muted/60"
            }`}
            aria-current={isCareersActive ? "page" : undefined}
          >
            <span>Careers</span>
          </Link>

          {/* Company Dropdown */}
          <div
            className="relative"
            ref={companyRef}
            onMouseEnter={() => handleMouseEnter("company")}
            onMouseLeave={handleMouseLeave}
          >
            <button
              type="button"
              onClick={() => {
                setActiveDropdown(activeDropdown === "company" ? null : "company");
              }}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 ${
                isCompanyActive || activeDropdown === "company"
                  ? "bg-surface-muted text-primary font-semibold"
                  : "text-foreground-secondary hover:text-foreground hover:bg-surface-muted/60"
              }`}
              aria-expanded={activeDropdown === "company"}
              aria-haspopup="true"
            >
              <span>Company</span>
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform duration-200 ${
                  activeDropdown === "company" ? "rotate-180" : ""
                }`}
                aria-hidden="true"
              />
            </button>

            {activeDropdown === "company" && (
              <div
                className="absolute right-0 top-full z-50 mt-2 w-72 rounded-2xl border border-primary/15 bg-surface/98 p-2 shadow-card backdrop-blur-md"
                onMouseEnter={() => handleMouseEnter("company")}
                onMouseLeave={handleMouseLeave}
              >
                <div className="flex flex-col gap-1">
                  {COMPANY_LINKS.map((link) => {
                    const Icon = link.icon;
                    const isActive =
                      link.href === "/"
                        ? pathname === "/"
                        : pathname === link.href || pathname?.startsWith(`${link.href}/`);
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setActiveDropdown(null)}
                        className={`group flex items-start gap-3 rounded-xl p-2.5 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 ${
                          isActive
                            ? "bg-surface-muted text-primary"
                            : "text-foreground hover:bg-surface-muted/70 hover:text-primary"
                        }`}
                        aria-current={isActive ? "page" : undefined}
                      >
                        <div
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors ${
                            isActive
                              ? "bg-primary text-white"
                              : "bg-surface-muted text-primary group-hover:bg-primary group-hover:text-white"
                          }`}
                        >
                          <Icon className="h-4 w-4" aria-hidden="true" />
                        </div>
                        <div className="flex flex-col min-w-0 flex-1">
                          <span
                            className={`text-sm font-semibold transition-colors ${
                              isActive
                                ? "text-primary"
                                : "text-foreground group-hover:text-primary"
                            }`}
                          >
                            {link.label}
                          </span>
                          <span className="text-xs text-foreground-secondary line-clamp-1">
                            {link.description}
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Right: Store Downloads & Mobile Menu */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          <div className="hidden lg:flex items-center gap-2">
            <StoreButton type="google" href={PLAY_STORE_URL} variant="brand" />
            <StoreButton type="apple" href={APP_STORE_URL} variant="brand" />
          </div>

          {/* Mobile Sheet Drawer Trigger */}
          <MobileNav />
        </div>
      </Container>
    </header>
  );
}

export default Navbar;
