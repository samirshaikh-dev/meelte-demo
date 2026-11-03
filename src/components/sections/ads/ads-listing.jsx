"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Container } from "@/components/layout/container";
import { StoreButton } from "@/components/layout/store-button";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { loadMoreAds } from "@/actions/ads/load-more-ads";
import { AdCard } from "./ad-card";

const GRID_ID = "ads-grid";

/**
 * The `/ads` listing grid with on-demand pagination.
 *
 * The first page is server-rendered and passed in as `ads`, so the initial 20
 * offers are present in the prerendered HTML and stay crawlable. Further pages
 * are appended by the `loadMoreAds` Server Action (`app/api/**` is forbidden by
 * `AI_RULE.md` §2.1), which keeps the anon key server-side.
 *
 * Four states are rendered rather than thrown: a live grid, an honest empty
 * state, a temporary-unavailable state when the read-only API cannot be
 * reached, and an inline retry when a "load more" round-trip fails.
 */
export function AdsListing({
  ads = [],
  breadcrumbs,
  unavailable = false,
  nextCursor = null,
}) {
  const [items, setItems] = useState(ads);
  const [cursor, setCursor] = useState(nextCursor);
  const [error, setError] = useState("");
  const [announcement, setAnnouncement] = useState("");
  const [isPending, startTransition] = useTransition();

  const endRef = useRef(null);
  const focusEndOnExhaust = useRef(false);

  // When the last page arrives the button unmounts, which would drop focus to
  // <body> and send the next Tab back to the top of the document. Move focus to
  // the end-of-list message instead — but only when the user actually loaded a
  // page, never on first paint.
  useEffect(() => {
    if (focusEndOnExhaust.current && !cursor) {
      focusEndOnExhaust.current = false;
      endRef.current?.focus();
    }
  }, [cursor]);

  function handleLoadMore() {
    if (!cursor || isPending) return;
    setError("");

    startTransition(async () => {
      const result = await loadMoreAds(cursor);

      if (!result.ok) {
        setError(
          result.error === "INVALID_CURSOR"
            ? "This list could not continue from where it stopped. Reload the page to start again."
            : "Could not load more offers. Please try again."
        );
        setAnnouncement("Could not load more offers.");
        return;
      }

      // Guard against a cursor that overlaps the previous page, so a repeated
      // id can never render twice or duplicate a React key.
      const seen = new Set(items.map((ad) => ad.id));
      const fresh = result.items.filter((ad) => !seen.has(ad.id));

      setItems([...items, ...fresh]);
      setAnnouncement(
        fresh.length === 0
          ? "No further offers were found."
          : `${fresh.length} more offers loaded. ${items.length + fresh.length} offers shown.`
      );

      if (result.nextCursor) {
        setCursor(result.nextCursor);
      } else {
        focusEndOnExhaust.current = true;
        setCursor(null);
      }
    });
  }

  const showEmptyState = items.length === 0 && !cursor;

  return (
    <section className="border-b border-border/80 bg-canvas py-6 sm:py-10 lg:py-14">
      <Container className="max-w-6xl">
        <Breadcrumbs items={breadcrumbs} className="mb-6" />

        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Local offers nearby
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-foreground-secondary">
          Offers shared by nearby shops on the meelTe app. Open one for the full details.
        </p>

        {unavailable ? (
          <div className="mt-8 rounded-2xl border border-border/80 bg-surface p-8 text-center">
            <p className="text-base font-semibold text-foreground">
              Offers are temporarily unavailable
            </p>
            <p className="mt-2 text-sm text-foreground-secondary">
              Please try again shortly, or browse the same offers in the app.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <StoreButton type="google" variant="brand" />
              <StoreButton type="apple" variant="brand" />
            </div>
          </div>
        ) : showEmptyState ? (
          <div className="mt-8 rounded-2xl border border-border/80 bg-surface p-8 text-center">
            <p className="text-base font-semibold text-foreground">No live offers right now</p>
            <p className="mt-2 text-sm text-foreground-secondary">
              New offers appear here as soon as shops publish them in the app.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <StoreButton type="google" variant="brand" />
              <StoreButton type="apple" variant="brand" />
            </div>
          </div>
        ) : (
          <>
            <ul
              id={GRID_ID}
              role="list"
              aria-busy={isPending}
              className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
            >
              {items.map((ad, index) => (
                <li key={ad.id}>
                  <AdCard ad={ad} priority={index < 3} />
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-col items-center gap-3">
              {cursor ? (
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={handleLoadMore}
                  aria-disabled={isPending}
                  aria-controls={GRID_ID}
                  className={cn(isPending && "cursor-progress opacity-60")}
                >
                  {isPending ? "Loading offers…" : "Load more offers"}
                </Button>
              ) : (
                <p
                  ref={endRef}
                  tabIndex={-1}
                  className="rounded-xl px-3 py-2 text-sm text-foreground-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2"
                >
                  You have reached the end of the offers.
                </p>
              )}

              {error ? (
                <p
                  role="alert"
                  className="rounded-xl border-l-4 border-error bg-error/5 px-4 py-3 text-sm font-semibold text-error"
                >
                  {error}
                </p>
              ) : null}
            </div>
          </>
        )}

        <p role="status" className="sr-only">
          {announcement}
        </p>
      </Container>
    </section>
  );
}

export default AdsListing;
