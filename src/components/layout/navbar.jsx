"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ChevronDown } from "../../lib/icons";
import { PLAY_STORE_URL, APP_STORE_URL } from "../../config/site";
import { Container } from "./container";
import { StoreButton } from "./store-button";
import { MobileNav } from "./mobile-nav";

const PRODUCT_LINKS = [
  {
    label: "How It Works",
    href: "/how-it-works",
    description: "Roles, app experience & platform flow",
  },
  {
    label: "For Merchants",
    href: "/for-merchants",
    description: "Promote your shop & local offers",
  },
];

const COMPANY_LINKS = [
  {
    label: "About Us",
    href: "/about",
    description: "Our mission, pillars & story",
  },
  {
    label: "Contact Us",
    href: "/contact",
    description: "Support, partnerships & queries",
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
        productRef.current && !productRef.current.contains(event.target) &&
        companyRef.current && !companyRef.current.contains(event.target)
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
    (link) => pathname === link.href || pathname?.startsWith(`${link.href}/`)
  );
  const isAdsActive = pathname === "/ads" || pathname?.startsWith("/ads/");
  const isEventsActive = pathname === "/events" || pathname?.startsWith("/events/");
  const isCareersActive = pathname === "/careers" || pathname?.startsWith("/careers/");

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-surface/95 shadow-soft backdrop-blur-md transition-colors duration-200">
      <Container className="flex h-16 sm:h-18 items-center justify-between gap-4">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          <Link
            href="/"
            className="flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded-xl"
            aria-label="meelTe Home"
          >
            <Image
              src="/icon_only_meelte.png"
              alt="meelTe"
              width={40}
              height={40}
              className="h-10 w-10 shrink-0 rounded-xl object-contain shadow-soft transition-transform duration-200"
            />
            <Image
              src="/only_meelte.png"
              alt="meelTe wordmark"
              width={110}
              height={32}
              className="h-7 w-auto shrink-0 max-w-[110px] object-contain tracking-tight"
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
              className={`relative inline-flex items-center gap-1 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-surface ${isProductActive || activeDropdown === "product"
                ? "bg-surface-muted/80 text-primary"
                : "text-foreground-secondary hover:text-primary hover:bg-surface-muted"
                }`}
              aria-expanded={activeDropdown === "product"}
              aria-haspopup="true"
            >
              <span>Product</span>
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform duration-200 ${activeDropdown === "product" ? "rotate-180" : ""
                  }`}
                aria-hidden="true"
              />
              {(isProductActive || activeDropdown === "product") && (
                <span className="absolute bottom-0 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-primary" aria-hidden="true" />
              )}
            </button>

            {activeDropdown === "product" && (
              <div
                className="absolute left-0 top-full z-50 mt-2 w-72 rounded-2xl border border-border/80 bg-surface p-2.5 shadow-card"
                onMouseEnter={() => handleMouseEnter("product")}
                onMouseLeave={handleMouseLeave}
              >
                <div className="flex flex-col">
                  {PRODUCT_LINKS.map((link) => {
                    const isActive = pathname === link.href || pathname?.startsWith(`${link.href}/`);
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setActiveDropdown(null)}
                        className={`flex flex-col gap-0.5 rounded-xl px-3.5 py-3 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-inset ${isActive
                          ? "bg-surface-muted"
                          : "hover:bg-surface-muted focus-visible:bg-surface-muted"
                          }`}
                        aria-current={isActive ? "page" : undefined}
                      >
                        <span className={`text-sm font-semibold ${isActive ? "text-primary" : "text-foreground"}`}>
                          {link.label}
                        </span>
                        <span className="text-xs text-foreground-secondary">{link.description}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Ads - Direct Link */}
          <Link
            href="/ads"
            onMouseEnter={() => handleMouseEnter(null)}
            className={`relative inline-flex items-center rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-surface ${isAdsActive
              ? "bg-surface-muted/80 text-primary"
              : "text-foreground-secondary hover:text-primary hover:bg-surface-muted"
              }`}
            aria-current={isAdsActive ? "page" : undefined}
          >
            <span>Ads</span>
            {isAdsActive && (
              <span className="absolute bottom-0 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-primary" aria-hidden="true" />
            )}
          </Link>

          {/* Events - Direct Link */}
          <Link
            href="/events"
            onMouseEnter={() => handleMouseEnter(null)}
            className={`relative inline-flex items-center rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-surface ${isEventsActive
              ? "bg-surface-muted/80 text-primary"
              : "text-foreground-secondary hover:text-primary hover:bg-surface-muted"
              }`}
            aria-current={isEventsActive ? "page" : undefined}
          >
            <span>Events</span>
            {isEventsActive && (
              <span className="absolute bottom-0 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-primary" aria-hidden="true" />
            )}
          </Link>

          {/* Careers - Direct Link */}
          <Link
            href="/careers"
            onMouseEnter={() => handleMouseEnter(null)}
            className={`relative inline-flex items-center rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-surface ${isCareersActive
              ? "bg-surface-muted/80 text-primary"
              : "text-foreground-secondary hover:text-primary hover:bg-surface-muted"
              }`}
            aria-current={isCareersActive ? "page" : undefined}
          >
            <span>Careers</span>
            {isCareersActive && (
              <span className="absolute bottom-0 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-primary" aria-hidden="true" />
            )}
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
              className={`relative inline-flex items-center gap-1 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-surface ${isCompanyActive || activeDropdown === "company"
                ? "bg-surface-muted/80 text-primary"
                : "text-foreground-secondary hover:text-primary hover:bg-surface-muted"
                }`}
              aria-expanded={activeDropdown === "company"}
              aria-haspopup="true"
            >
              <span>Company</span>
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform duration-200 ${activeDropdown === "company" ? "rotate-180" : ""
                  }`}
                aria-hidden="true"
              />
              {(isCompanyActive || activeDropdown === "company") && (
                <span className="absolute bottom-0 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-primary" aria-hidden="true" />
              )}
            </button>

            {activeDropdown === "company" && (
              <div
                className="absolute right-0 top-full z-50 mt-2 w-64 rounded-2xl border border-border/80 bg-surface p-2.5 shadow-card"
                onMouseEnter={() => handleMouseEnter("company")}
                onMouseLeave={handleMouseLeave}
              >
                <div className="flex flex-col">
                  {COMPANY_LINKS.map((link) => {
                    const isActive = pathname === link.href || pathname?.startsWith(`${link.href}/`);
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setActiveDropdown(null)}
                        className={`flex flex-col gap-0.5 rounded-xl px-3.5 py-3 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-inset ${isActive
                          ? "bg-surface-muted"
                          : "hover:bg-surface-muted focus-visible:bg-surface-muted"
                          }`}
                        aria-current={isActive ? "page" : undefined}
                      >
                        <span className={`text-sm font-semibold ${isActive ? "text-primary" : "text-foreground"}`}>
                          {link.label}
                        </span>
                        <span className="text-xs text-foreground-secondary">{link.description}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </nav>
        
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="hidden lg:flex items-center gap-2">
            <StoreButton type="google" href={PLAY_STORE_URL} variant="brand" />
            <StoreButton type="apple" href={APP_STORE_URL} variant="brand" />
          </div>

          {/* Mobile Sheet Drawer */}
          <MobileNav />
        </div>
      </Container>
    </header>
  );
}

export default Navbar;
