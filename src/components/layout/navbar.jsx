"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Download, ChevronDown } from "../../lib/icons";
import { PLAY_STORE_URL } from "../../config/site";
import { Container } from "./container";
import { Button } from "../ui/button";
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
  {
    label: "Case Studies",
    href: "/case-studies",
    description: "See how local shops grow with Meelte",
  },
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
    <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-surface/90 backdrop-blur-md transition-all duration-200">
      <Container className="flex h-16 sm:h-20 items-center justify-between gap-4">
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
          className="hidden md:flex items-center gap-1.5 lg:gap-2 flex-1 justify-center"
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
              className={`relative inline-flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors duration-150 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
                isProductActive || productOpen
                  ? "text-primary"
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
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-[2px] w-8 bg-primary rounded-full" aria-hidden="true" />
              )}
            </button>

            {productOpen && (
              <div
                className="absolute left-1/2 -translate-x-1/2 top-full mt-1 w-72 rounded-xl bg-surface shadow-lg border border-border/80 p-2 z-50"
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
                        className={`flex flex-col gap-0.5 px-3 py-2.5 rounded-lg transition-colors ${
                          isActive
                            ? "bg-surface-muted"
                            : "hover:bg-surface-muted"
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
            className={`relative inline-flex items-center px-3 py-2 text-sm font-medium transition-colors duration-150 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
              isForMerchantsActive
                ? "text-primary"
                : "text-foreground-secondary hover:text-primary hover:bg-surface-muted"
            }`}
            aria-current={isForMerchantsActive ? "page" : undefined}
          >
            <span>For Merchants</span>
            {isForMerchantsActive && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-[2px] w-8 bg-primary rounded-full" aria-hidden="true" />
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
              className={`relative inline-flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors duration-150 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
                isCompanyActive || companyOpen
                  ? "text-primary"
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
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-[2px] w-8 bg-primary rounded-full" aria-hidden="true" />
              )}
            </button>

            {companyOpen && (
              <div
                className="absolute left-1/2 -translate-x-1/2 top-full mt-1 w-64 rounded-xl bg-surface shadow-lg border border-border/80 p-2 z-50"
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
                        className={`flex flex-col gap-0.5 px-3 py-2.5 rounded-lg transition-colors ${
                          isActive
                            ? "bg-surface-muted"
                            : "hover:bg-surface-muted"
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

        {/* Right: CTA Action & Mobile Menu */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-muted/80 border border-border/60">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
            <span className="text-[11px] font-medium text-foreground-secondary">Mobile App Live • Web App Coming Soon</span>
          </div>
          <Button
            as="a"
            href={PLAY_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            variant="primary"
            size="md"
            className="hidden sm:inline-flex shadow-soft"
          >
            <Download className="h-4 w-4" aria-hidden="true" />
            <span>Get the App</span>
          </Button>

          <Button
            as="a"
            href={PLAY_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            variant="primary"
            size="md"
            className="sm:hidden shadow-soft"
          >
            <Download className="h-3.5 w-3.5" aria-hidden="true" />
            <span>App</span>
          </Button>

          {/* Mobile Sheet Drawer */}
          <MobileNav />
        </div>
      </Container>
    </header>
  );
}

export default Navbar;
