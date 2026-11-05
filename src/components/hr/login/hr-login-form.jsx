"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Loader2,
} from "@/lib/icons";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { notifySuccess, notifyError } from "@/lib/toast-feedback";
import { REGEX } from "@/constants/service-constants";

const BREADCRUMBS = [
  { name: "Home", path: "/" },
  { name: "HR Portal", path: "/hr" },
  { name: "Sign In", path: "/hr/login" },
];

export function HrLoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [clientErrors, setClientErrors] = useState({});

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
      const response = await fetch("/api/hr/login", {
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
    <div className="flex min-h-screen flex-col justify-between bg-canvas px-4 py-8 sm:px-6 lg:px-8">
      {/* Top Header & Breadcrumbs */}
      <div className="mx-auto w-full max-w-md">
        <Breadcrumbs items={BREADCRUMBS} className="mb-6 justify-center sm:justify-start" />
      </div>

      {/* Main Login Card */}
      <div className="mx-auto w-full max-w-md">
        <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8 shadow-card">
          {/* Brand Wordmark & Title */}
          <div className="text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white font-extrabold text-lg shadow-soft">
                m
              </span>
              <span className="text-2xl font-extrabold tracking-tight text-foreground">
                meelTe
              </span>
            </Link>

            <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-surface-muted px-3 py-1 text-xs font-semibold text-primary">
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
              <span>HR Recruitment Portal</span>
            </div>

            <h1 className="mt-3 text-lg sm:text-xl font-bold tracking-tight text-foreground">
              Sign in to your account
            </h1>
            <p className="mt-1 text-xs text-foreground-secondary">
              Authorized Meelte HR operations personnel only.
            </p>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div
              role="alert"
              className="mt-5 flex items-start gap-2.5 rounded-xl border border-error-border bg-error-bg p-3.5 text-xs text-error"
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
                  className={`w-full rounded-xl border bg-surface pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-foreground placeholder:text-foreground-muted transition-colors ${
                    clientErrors.email
                      ? "border-error focus-visible:ring-error"
                      : "border-border focus-visible:border-primary"
                  } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 disabled:opacity-50`}
                />
              </div>
              {clientErrors.email && (
                <p className="mt-1 text-xs text-error font-medium">{clientErrors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="hr-password"
                  className="block text-xs font-semibold text-foreground"
                >
                  Password
                </label>
              </div>

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
                  className={`w-full rounded-xl border bg-surface pl-10 pr-10 py-2.5 text-xs sm:text-sm text-foreground placeholder:text-foreground-muted transition-colors ${
                    clientErrors.password
                      ? "border-error focus-visible:ring-error"
                      : "border-border focus-visible:border-primary"
                  } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 disabled:opacity-50`}
                />

                {/* Show/Hide Password Toggle */}
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  disabled={isLoading}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-muted hover:text-foreground transition-colors p-1 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <Eye className="h-4 w-4" aria-hidden="true" />
                  )}
                </button>
              </div>
              {clientErrors.password && (
                <p className="mt-1 text-xs text-error font-medium">{clientErrors.password}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={isLoading}
                className="w-full justify-center text-sm font-semibold gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </>
                )}
              </Button>
            </div>
          </form>

          {/* Secure Note */}
          <div className="mt-6 border-t border-border pt-4 text-center">
            <p className="text-[11px] text-foreground-muted">
              Credentials are validated server-side using secure cryptographic hashing. Sessions expire after 8 hours of inactivity.
            </p>
          </div>
        </div>
      </div>

      {/* Footer link */}
      <div className="mx-auto w-full max-w-md text-center">
        <Link
          href="/"
          className="text-xs text-foreground-secondary hover:text-primary hover:underline transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 rounded"
        >
          ← Return to Meelte Homepage
        </Link>
      </div>
    </div>
  );
}

export default HrLoginForm;

