import React from "react";
import { Apple, Play } from "@/lib/icons";
import { APP_STORE_URL, PLAY_STORE_URL } from "@/config/site";
import { Container } from "@/components/layout/container";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Button } from "@/components/ui/button";

/**
 * Breadcrumb trail for /how-it-works.
 *
 * Exported so `page.jsx` can emit the matching `BreadcrumbList` through
 * `getBreadcrumbsJsonLd()` — the visible trail and the structured data are built
 * from one array and cannot drift (AI_RULE.md §2.6).
 */
export const HOW_IT_WORKS_BREADCRUMBS = [
  { name: "Home", path: "/" },
  { name: "How It Works", path: "/how-it-works" },
];

/**
 * Hero for /how-it-works.
 *
 * Server component on purpose (no `framer-motion`): this is the LCP region, the
 * content is identical for every visitor, and the page's job is to explain the
 * product, not to perform motion.
 *
 * Two store actions, deliberately weighted: the Google Play button stays primary and
 * the App Store button sits beside it in the outlined variant.
 */
export function HowItWorksHero() {
  return (
    <section className="relative overflow-hidden border-b border-border/80 bg-canvas">
      {/* Soft brand wash. Purely decorative, no motion, sits behind the content. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-canvas to-canvas"
      />

      <Container>
        <div className="max-w-3xl py-8 sm:py-12 lg:py-14">
          <Breadcrumbs items={HOW_IT_WORKS_BREADCRUMBS} className="mb-3.5 sm:mb-4" />

          <h1 className="text-[2.4rem] font-black leading-[1.06] tracking-tight text-foreground sm:text-5xl lg:text-[3.4rem]">
            How meelTe works
          </h1>

          <p className="mt-3.5 sm:mt-4 text-base leading-relaxed text-foreground-secondary sm:text-lg">
            Shops and event hosts post what is on nearby. The app sorts it by
            distance from where you are, and you deal with the shop or host
            directly — meelTe does not sit in the middle of the transaction.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button
              as="a"
              href={PLAY_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              variant="primary"
              size="lg"
              className="w-full justify-center rounded-xl px-6 sm:w-auto"
            >
              <Play className="h-5 w-5 shrink-0 fill-current" aria-hidden="true" />
              <span>Get it on Google Play</span>
            </Button>

            <Button
              as="a"
              href={APP_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              variant="outline"
              size="lg"
              className="w-full justify-center rounded-xl px-6 sm:w-auto"
            >
              <Apple className="h-5 w-5 shrink-0 fill-current" aria-hidden="true" />
              <span>Download on the App Store</span>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default HowItWorksHero;
