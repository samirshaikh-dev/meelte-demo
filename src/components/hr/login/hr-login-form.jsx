"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  Shield,
  Loader2,
} from "@/lib/icons";
import { Button } from "@/components/ui/button";
import { notifySuccess, notifyError } from "@/lib/toast-feedback";
import { REGEX } from "@/constants/service-constants";

/**
 * Redesigned HR Portal Login Form
 * - Uses official meelTe brand icon (/icon_only_meelte.png)
 * - Clean, intentional, modern layout free from AI-slop / decorative clutter
 * - Accessible inputs with high-contrast focus rings (focus-visible:ring-primary/70)
 * - Strict adherence to AVOID.md and docs/Design.md tokens
 */
export function HrLoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [clientErrors, setClientErrors] = useState({});

  useEffect(() => {
    // If client holds an active refresh token, silently rotate and route to dashboard
    fetch("/api/hr/auth/refresh", {
      method: "POST",
      headers: { "X-Requested-With": "XMLHttpRequest" },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.ok) {
          router.replace("/hr/dashboard");
        }
      })
      .catch(() => {});
  }, [router]);

  const validateForm = () => {
    const errors = {};
    if (!email.trim()) {
      errors.email = "Email address is required.";
    } else if (!REGEX.EMAIL.test(email.trim())) {
      errors.email = "Please enter a valid email address.";
    }

    if (!password) {
      errors.password = "Password is required.";
    }

    setClientErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/hr/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const result = await response.json();

      if (!result.ok) {
        setErrorMessage(result.error || "Invalid email or password");
        notifyError(result.error || "Invalid email or password");
        setIsLoading(false);
        return;
      }

      notifySuccess("Signed in successfully. Redirecting to dashboard...");
      router.push(result.redirectUrl || "/hr/dashboard");
      router.refresh();
    } catch {
      setErrorMessage("An unexpected error occurred. Please try again.");
      notifyError("Sign in failed. Please check your credentials.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas px-4 py-12 sm:px-6">
      <div className="w-full max-w-[400px]">
        {/* Authentication Card */}
        <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8 shadow-soft">
          {/* Brand Header */}
          <div className="flex flex-col items-center text-center">
            <Link
              href="/"
              className="group flex flex-col items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 rounded-2xl p-1"
              aria-label="meelTe Home"
            >
              <div className="relative h-12 w-12 overflow-hidden rounded-2xl border border-primary/15 bg-surface-muted p-1.5 shadow-2xs transition-transform duration-200 group-hover:scale-105">
                <Image
                  src="/icon_only_meelte.png"
                  alt="meelTe Icon"
                  width={48}
                  height={48}
                  priority
                  className="h-full w-full object-contain"
                />
              </div>

            </Link>

            <h1 className="mt-4 text-lg font-bold tracking-tight text-foreground">
              Sign in to your account
            </h1>

          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div
              role="alert"
              className="mt-5 flex items-start gap-2.5 rounded-xl border border-error/20 bg-error/10 p-3 text-xs text-error"
            >
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" aria-hidden="true" />
              <div className="font-medium leading-relaxed">{errorMessage}</div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
            {/* Email Field */}
            <div>
              <label
                htmlFor="hr-email"
                className="block text-xs font-semibold text-foreground"
              >
                Email Address
              </label>
              <div className="relative mt-1.5">
                <Mail
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-muted"
                  aria-hidden="true"
                />
                <input
                  id="hr-email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="hr@meelte.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (clientErrors.email) {
                      setClientErrors((prev) => ({ ...prev, email: null }));
                    }
                  }}
                  disabled={isLoading}
                  className={`w-full rounded-xl border bg-surface pl-10 pr-3.5 py-2.5 text-sm text-foreground placeholder:text-foreground-muted/50 transition-colors ${
                    clientErrors.email
                      ? "border-error focus-visible:ring-error"
                      : "border-border hover:border-foreground-muted/40 focus-visible:border-primary"
                  } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 disabled:opacity-50`}
                />
              </div>
              {clientErrors.email && (
                <p className="mt-1.5 text-xs text-error font-medium" role="alert">
                  {clientErrors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="hr-password"
                className="block text-xs font-semibold text-foreground"
              >
                Password
              </label>

              <div className="relative mt-1.5">
                <Lock
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-muted"
                  aria-hidden="true"
                />
                <input
                  id="hr-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (clientErrors.password) {
                      setClientErrors((prev) => ({ ...prev, password: null }));
                    }
                  }}
                  disabled={isLoading}
                  className={`w-full rounded-xl border bg-surface pl-10 pr-10 py-2.5 text-sm text-foreground placeholder:text-foreground-muted/50 transition-colors ${
                    clientErrors.password
                      ? "border-error focus-visible:ring-error"
                      : "border-border hover:border-foreground-muted/40 focus-visible:border-primary"
                  } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 disabled:opacity-50`}
                />

                {/* Show/Hide Password Toggle */}
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  disabled={isLoading}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-foreground-muted hover:text-foreground transition-colors p-1.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <Eye className="h-4 w-4" aria-hidden="true" />
                  )}
                </button>
              </div>
              {clientErrors.password && (
                <p className="mt-1.5 text-xs text-error font-medium" role="alert">
                  {clientErrors.password}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={isLoading}
                className="w-full justify-center text-sm font-semibold gap-2 h-10 rounded-xl"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-white" aria-hidden="true" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="h-4 w-4 text-white" aria-hidden="true" />
                  </>
                )}
              </Button>
            </div>
          </form>

          {/* Secure System Note */}
          <div className="mt-6 border-t border-border pt-4 flex items-center justify-center gap-1.5 text-center">
            <Shield className="h-3.5 w-3.5 text-foreground-muted" aria-hidden="true" />
            <span className="text-[11px] text-foreground-muted">
              Secure operations login · 8-hour session validity
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HrLoginForm;
