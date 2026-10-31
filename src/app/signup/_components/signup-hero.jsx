import React from "react";
import Link from "next/link";
import { Apple, ArrowRight, Download, Monitor, Play, Smartphone, Sparkles } from "@/lib/icons";
import { APP_STORE_URL, PLAY_STORE_URL } from "@/config/site";
import { Container } from "@/components/layout/container";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

/**
 * /signup hero.
 *
 * Two columns: what Meelte is and the two live store actions on the left, and an
 * honest availability card on the right. The card exists because the most common
 * misunderstanding about this route is that it is a web sign-up — it is not.
 * Meelte creates the account inside the mobile app, so the page states where
 * joining is possible today and where it is not.
 *
 * Copy rules applied (docs/target_customer.md §1 "Product availability",
 * meelte-context.md §3 "Claim guardrails"):
 * - both listings are live (Google Play and the App Store); the web app is in
 *   development, and the site never promotes one platform without the other,
 * - the 13+ age floor is the product's real policy (T&C §14),
 * - "location is never sold or shared" is an approved trust claim,
 * - no rating, user count or sign-up form is invented.
 *
 * `SIGNUP_BREADCRUMBS` is exported from here so the visible trail and the page's
 * BreadcrumbList JSON-LD are built from one array instead of two copies.
 */
export const SIGNUP_BREADCRUMBS = [
  { name: "Home", path: "/" },
  { name: "Sign Up", path: "/signup" },
];

/**
 * The two live listings shown in the availability card. Both are rendered from one
 * shape so neither platform can drift in status wording or markup.
 */
const LIVE_STORES = [
  {
    name: "Android app",
    icon: Smartphone,
    status: "Live on Google Play",
    href: PLAY_STORE_URL,
  },
  {
    name: "iPhone app",
    icon: Apple,
    status: "Live on the App Store",
    href: APP_STORE_URL,
  },
];

export function SignupHero() {
  return (
    <section
      aria-labelledby="signup-hero-heading"
      className="border-b border-border/80 bg-canvas pt-8 pb-14 sm:pt-10 sm:pb-20"
    >
      <Container>
        <Breadcrumbs items={SIGNUP_BREADCRUMBS} className="mb-6" />

        <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left — what the app is and the primary action */}
          <div className="lg:col-span-7">
            <Badge variant="primary" className="mb-4 gap-1.5">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Join Meelte</span>
            </Badge>

            <h1
              id="signup-hero-heading"
              className="max-w-2xl text-3xl font-black leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-[3.4rem]"
            >
              Your neighborhood has more to offer.
            </h1>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-foreground-secondary sm:text-lg">
              Meelte is a nearby-first app: offers from local shops, events you can join,
              and one-to-one chat with the people you meet. Signing up happens inside
              the app on Android or iPhone. There is no account to create on this website.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                as="a"
                href={PLAY_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                variant="primary"
                size="lg"
                className="justify-center font-semibold"
              >
                <Play className="h-5 w-5 fill-current" aria-hidden="true" />
                <span>Get it on Google Play</span>
              </Button>

              <Button
                as="a"
                href={APP_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                variant="outline"
                size="lg"
                className="justify-center font-medium"
              >
                <Apple className="h-5 w-5 fill-current" aria-hidden="true" />
                <span>Download for iPhone</span>
              </Button>

              <Button
                as={Link}
                href="/discover"
                variant="outline"
                size="lg"
                className="justify-center font-medium"
              >
                <span>See what is in the app</span>
              </Button>
            </div>

            <p className="mt-5 text-sm leading-relaxed text-foreground-secondary">
              Free to browse nearby listings. Your location is never sold or shared.
            </p>
          </div>

          {/* Right — availability, stated plainly */}
          <div className="lg:col-span-5">
            <div className="rounded-3xl border border-primary/15 bg-surface p-6 shadow-card lg:sticky lg:top-24 lg:p-8">
              <h2 className="mt-3 text-2xl font-bold leading-tight tracking-tight text-foreground">
                Where you can join today
              </h2>

              <ul role="list" className="mt-5 space-y-5">
                {LIVE_STORES.map((store) => {
                  const StoreIcon = store.icon;
                  return (
                    <li key={store.name} className="flex gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-muted text-primary">
                        <StoreIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-foreground">{store.name}</p>
                        <p className="mt-1 flex items-center gap-2 text-sm text-foreground-secondary">
                          <span
                            className="h-1.5 w-1.5 shrink-0 rounded-full bg-success"
                            aria-hidden="true"
                          />
                          <span>{store.status}</span>
                        </p>
                        <a
                          href={store.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-1 inline-flex min-h-6 items-center gap-1 rounded py-1 text-xs font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2"
                        >
                          <span>Open listing</span>
                          <span className="sr-only"> for the {store.name}</span>
                          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                        </a>
                      </div>
                    </li>
                  );
                })}

                <li className="flex gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-muted text-primary">
                    <Monitor className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-foreground">Web app</p>
                    <p className="mt-1 flex items-center gap-2 text-sm text-foreground-secondary">
                      <span
                        className="h-1.5 w-1.5 shrink-0 rounded-full bg-foreground-muted"
                        aria-hidden="true"
                      />
                      <span>In development</span>
                    </p>
                  </div>
                </li>
              </ul>

              <p className="mt-6 border-t border-border/70 pt-4 text-sm leading-relaxed text-foreground-secondary">
                Meelte creates your account inside the app, and it is for ages 13
                and over.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default SignupHero;
