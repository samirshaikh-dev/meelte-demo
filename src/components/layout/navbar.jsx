"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ChevronDown } from "../../lib/icons";
import { PLAY_STORE_URL, APP_STORE_URL } from "../../config/site";
import { Container } from "./container";
import { StoreButton } from "../footer/store-button";
import { MobileNav } from "./mobile-nav";

const PRODUCT_LINKS = [
  {
    label: "How It Works",
    href: "/how-it-works",
    description: "Roles, app experience & platform flow",
  },
  {
    label: "Discover Nearby",
    href: "/discover",
    description: "Find local shops, events & services",
  },
  // {
  //   label: "Case Studies",
  //   href: "/case-studies",
  //   description: "See how local shops grow with Meelte",
  // },
];

const COMPANY_LINKS = [
  {
    label: "About Us",
    href: "/about",
    description: "Our mission, pillars & story",
  },
  {
    label: "Careers",
    href: "/careers",
    description: "Join the Meelte team",
  },
  {
    label: "Contact Us",
    href: "/contact",
    description: "Support, partnerships & queries",
  },
];

export function Navbar() {
  const pathname = usePathname();
  const [productOpen, setProductOpen] = useState(false);
  const [companyOpen, setCompanyOpen] = useState(false);
  const productRef = useRef(null);
  const companyRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (productRef.current && !productRef.current.contains(event.target)) {
        setProductOpen(false);
      }
      if (companyRef.current && !companyRef.current.contains(event.target)) {
        setCompanyOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setProductOpen(false);
        setCompanyOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const isProductActive = PRODUCT_LINKS.some(
    (link) => pathname === link.href || pathname?.startsWith(`${link.href}/`)
  );
  const isCompanyActive = COMPANY_LINKS.some(
    (link) => pathname === link.href || pathname?.startsWith(`${link.href}/`)
  );
  const isForMerchantsActive = pathname === "/for-merchants" || pathname?.startsWith("/for-merchants/");

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-surface/95 shadow-soft backdrop-blur-md transition-colors duration-200">
      <Container className="flex h-16 sm:h-18 items-center justify-between gap-4">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          <Link
            href="/"
            className="flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded-xl"
            aria-label="Meelte Home"
          >
            <Image
              src="/icon_only_meelte.png"
              alt="Meelte"
              width={40}
              height={40}
              className="h-10 w-10 shrink-0 rounded-xl object-contain shadow-soft group-hover:scale-105 transition-transform duration-200"
            />
            <Image
              src="/only_meelte.png"
              alt="Meelte wordmark"
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
          <div className="relative" ref={productRef}>
            <button
              type="button"
              onClick={() => {
                setProductOpen(!productOpen);
                setCompanyOpen(false);
              }}
              onMouseEnter={() => setProductOpen(true)}
              className={`relative inline-flex items-center gap-1 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-surface ${
                isProductActive || productOpen
                  ? "bg-surface-muted/80 text-primary"
                  : "text-foreground-secondary hover:text-primary hover:bg-surface-muted"
              }`}
              aria-expanded={productOpen}
              aria-haspopup="true"
            >
              <span>Product</span>
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform duration-200 ${
                  productOpen ? "rotate-180" : ""
                }`}
                aria-hidden="true"
              />
              {(isProductActive || productOpen) && (
                <span className="absolute bottom-0 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-primary" aria-hidden="true" />
              )}
            </button>

            {productOpen && (
              <div
                className="absolute left-1/2 top-full z-50 mt-2 w-72 -translate-x-1/2 rounded-2xl border border-border/80 bg-surface p-2.5 shadow-card"
                onMouseEnter={() => setProductOpen(true)}
                onMouseLeave={() => setProductOpen(false)}
              >
                <div className="flex flex-col">
                  {PRODUCT_LINKS.map((link) => {
                    const isActive = pathname === link.href || pathname?.startsWith(`${link.href}/`);
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setProductOpen(false)}
                        className={`flex flex-col gap-0.5 rounded-xl px-3.5 py-3 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-inset ${
                          isActive
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

          {/* For Merchants - Direct Link */}
          <Link
            href="/for-merchants"
            className={`relative inline-flex items-center rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-surface ${
              isForMerchantsActive
                ? "bg-surface-muted/80 text-primary"
                : "text-foreground-secondary hover:text-primary hover:bg-surface-muted"
            }`}
            aria-current={isForMerchantsActive ? "page" : undefined}
          >
            <span>For Merchants</span>
            {isForMerchantsActive && (
              <span className="absolute bottom-0 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-primary" aria-hidden="true" />
            )}
          </Link>

          {/* Company Dropdown */}
          <div className="relative" ref={companyRef}>
            <button
              type="button"
              onClick={() => {
                setCompanyOpen(!companyOpen);
                setProductOpen(false);
              }}
              onMouseEnter={() => setCompanyOpen(true)}
              className={`relative inline-flex items-center gap-1 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-surface ${
                isCompanyActive || companyOpen
                  ? "bg-surface-muted/80 text-primary"
                  : "text-foreground-secondary hover:text-primary hover:bg-surface-muted"
              }`}
              aria-expanded={companyOpen}
              aria-haspopup="true"
            >
              <span>Company</span>
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform duration-200 ${
                  companyOpen ? "rotate-180" : ""
                }`}
                aria-hidden="true"
              />
              {(isCompanyActive || companyOpen) && (
                <span className="absolute bottom-0 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-primary" aria-hidden="true" />
              )}
            </button>

            {companyOpen && (
              <div
                className="absolute left-1/2 top-full z-50 mt-2 w-64 -translate-x-1/2 rounded-2xl border border-border/80 bg-surface p-2.5 shadow-card"
                onMouseEnter={() => setCompanyOpen(true)}
                onMouseLeave={() => setCompanyOpen(false)}
              >
                <div className="flex flex-col">
                  {COMPANY_LINKS.map((link) => {
                    const isActive = pathname === link.href || pathname?.startsWith(`${link.href}/`);
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setCompanyOpen(false)}
                        className={`flex flex-col gap-0.5 rounded-xl px-3.5 py-3 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-inset ${
                          isActive
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

        {/* Right: store downloads above `lg`, hamburger drawer below it.
            The two downloads live in the navbar only from `lg` up; every smaller
            breakpoint gets them inside the MobileNav drawer, which is now the single
            place a compact CTA is offered. */}
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
