"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Download } from "../../lib/icons";
import { PLAY_STORE_URL } from "../../config/site";
import { Container } from "./container";
import { Button } from "../ui/button";
import { MobileNav } from "./mobile-nav";

const NAV_LINKS = [
  { label: "About Us", href: "/about" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "For Merchants", href: "/for-merchants" },
  { label: "Discover", href: "/discover" },
  { label: "Contact Us", href: "/contact" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-surface/90 backdrop-blur-md transition-all duration-200">
      <Container className="flex h-16 sm:h-20 items-center justify-between gap-4">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-3 sm:gap-4">
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
          className="hidden md:flex items-center gap-1.5 lg:gap-2"
          aria-label="Main Navigation"
        >
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href || pathname?.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative inline-flex items-center px-3.5 py-2 text-sm font-medium transition-colors duration-150 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
                  isActive
                    ? "text-primary"
                    : "text-foreground-secondary hover:text-primary hover:bg-surface-muted"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                <span>{link.label}</span>
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-[2px] w-8 bg-primary rounded-full" aria-hidden="true" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right: CTA Action & Mobile Menu */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Button
            as="a"
            href="/signup"
            variant="outline"
            size="md"
            className="hidden md:inline-flex"
          >
            <span>Sign Up</span>
          </Button>
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
