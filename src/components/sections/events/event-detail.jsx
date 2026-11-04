"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  Bookmark,
  CalendarDays,
  Heart,
  MapPin,
  MessageCircle,
  Navigation,
  Share2,
  Users,
} from "@/lib/icons";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Container } from "@/components/layout/container";
import { DetailSteps } from "@/components/sections/common/detail-steps";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { shareCurrentPage } from "@/lib/share-link";
import { formatDisplayName } from "@/lib/display-name";
import { formatCost, formatEventPlace, formatSchedule, getDirectionsHref } from "./event-formatters";
import { AppActionModal } from "./app-action-modal";

const JOIN_STEPS = [
  {
    title: "Request to join",
    detail: "Open the free meelTe app for Android or iOS and send a request to the host.",
  },
  {
    title: "Host approves",
    detail: "The host reviews each request so the group stays the size they planned for.",
  },
  {
    title: "Meet in person",
    detail: "Turn up at the time and place above. Settle any fee with the host directly.",
  },
];

/**
 * The public page for one app-shared community event.
 *
 * A shared event link is opened by someone deciding whether to go, so the two
 * facts that decision depends on — when and where — sit directly under the title,
 * before the fee and before any prompt to install the app. The photo is the only
 * framed element (AVOID.md §2); the schedule, venue, description and steps are set
 * with typography and hairlines instead of stacked cards.
 *
 * There is no "verified host" badge: the product has no consumer-facing
 * verification, so the page shows the host's public name and photo instead.
 */
export function EventDetail({ event, breadcrumbs }) {
  const [modalState, setModalState] = useState({
    isOpen: false,
    actionType: "default",
    eventTitle: formatDisplayName(event?.title) || "",
  });
  const [avatarFailed, setAvatarFailed] = useState(false);

  const eventTitle = formatDisplayName(event.title) || "Community event";
  const hostName = formatDisplayName(event.creatorName);
  const categoryLabel = formatDisplayName(event.category);
  const schedule = formatSchedule(event.startTime, event.endTime);
  const cost = formatCost(event.cost);
  const isFree = event.cost === 0;
  const place = formatEventPlace(event.locationName, event.address);
  const directionsHref = getDirectionsHref(event);

  const attendeesCount = typeof event.attendeesCount === "number" ? event.attendeesCount : 0;
  const likesCount = typeof event.likesCount === "number" ? event.likesCount : 0;
  const commentsCount = typeof event.commentsCount === "number" ? event.commentsCount : 0;
  const hasEngagement = likesCount > 0 || commentsCount > 0;

  const showAvatar = Boolean(event.creatorPhotoUrl) && !avatarFailed;

  function triggerAppModal(actionType) {
    setModalState({
      isOpen: true,
      actionType,
      eventTitle,
    });
  }

  function handleShare() {
    shareCurrentPage({
      title: `${eventTitle} on meelTe`,
      text: `Check out this event on meelTe: ${eventTitle}${hostName ? `, hosted by ${hostName}` : ""}.`,
      successMessage: "Event link copied to your clipboard.",
    });
  }

  return (
    <section
      className={`border-b border-border/80 bg-canvas pt-6 sm:pt-8 lg:pb-16 ${
        event.hasEnded ? "pb-12" : "pb-24"
      }`}
    >
      <Container className="max-w-6xl">
        <Breadcrumbs items={breadcrumbs} className="mb-5" />

        <article className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:items-start lg:gap-12 xl:gap-16">
          {/* Media: the one framed element on the page */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-surface-muted">
              <div className="relative aspect-[4/3] lg:aspect-square">
                {event.coverUrl ? (
                  <Image
                    src={event.coverUrl}
                    alt={eventTitle}
                    fill
                    priority
                    unoptimized
                    sizes="(min-width: 1024px) 46vw, 100vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center px-8 text-center text-sm text-foreground-secondary">
                    This host did not add a cover photo.
                  </div>
                )}

                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent"
                />
              </div>

              {cost && (
                <Badge
                  size="sm"
                  variant={isFree ? "success" : "accent"}
                  className={
                    isFree
                      ? "pointer-events-none absolute left-3 top-3 border-transparent bg-success text-white shadow-soft"
                      : "pointer-events-none absolute left-3 top-3 bg-accent text-accent-foreground shadow-soft"
                  }
                >
                  {cost}
                </Badge>
              )}

              {categoryLabel && (
                <span className="pointer-events-none absolute bottom-3 left-3 max-w-[70%] truncate rounded-lg bg-black/45 px-2 py-0.5 text-[11px] font-semibold text-white ring-1 ring-white/25 ring-inset">
                  {categoryLabel}
                </span>
              )}
            </div>
          </div>

          {/* Everything that explains and converts */}
          <div className="min-w-0">
            <h1 className="text-3xl font-black leading-[1.1] tracking-tight text-balance text-foreground sm:text-4xl">
              {eventTitle}
            </h1>

            {hostName && (
              <div className="mt-3 flex items-center gap-2.5">
                {showAvatar ? (
                  <Image
                    src={event.creatorPhotoUrl}
                    alt=""
                    width={36}
                    height={36}
                    unoptimized
                    onError={() => setAvatarFailed(true)}
                    className="h-9 w-9 shrink-0 rounded-full border border-border/80 object-cover"
                  />
                ) : (
                  <span
                    aria-hidden="true"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-muted text-sm font-bold text-primary"
                  >
                    {hostName.charAt(0).toUpperCase()}
                  </span>
                )}

                <p className="min-w-0 text-sm text-foreground-secondary">
                  Hosted by <span className="font-semibold text-foreground">{hostName}</span>
                  {attendeesCount > 0 && (
                    <>
                      {" · "}
                      <span>
                        {attendeesCount} {attendeesCount === 1 ? "person going" : "people going"}
                      </span>
                    </>
                  )}
                </p>
              </div>
            )}

            {event.hasEnded && (
              <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1.5 rounded-xl border border-border bg-surface px-4 py-3">
                <p className="text-sm text-foreground-secondary">
                  <span className="font-semibold text-foreground">This event has ended.</span> It
                  has already taken place.
                </p>
                <Link
                  href="/events"
                  className="rounded-sm text-sm font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
                >
                  Browse upcoming events
                </Link>
              </div>
            )}

            {/* When and where decide attendance, so they come before the fee */}
            {(schedule || place) && (
              <dl className="mt-6 divide-y divide-border/60 border-y border-border/60">
                {schedule && (
                  <div className="flex items-start gap-3 py-3.5">
                    <CalendarDays
                      className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                      aria-hidden="true"
                    />
                    <div className="min-w-0">
                      <dt className="text-xs font-semibold text-foreground-secondary">When</dt>
                      <dd className="mt-0.5 text-sm leading-6 text-foreground">{schedule}</dd>
                    </div>
                  </div>
                )}

                {place && (
                  <div className="flex items-start gap-3 py-3.5">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                    <div className="min-w-0">
                      <dt className="text-xs font-semibold text-foreground-secondary">Where</dt>
                      <dd className="mt-0.5 whitespace-pre-wrap break-words text-sm leading-6 text-foreground">
                        {place}
                      </dd>
                    </div>
                  </div>
                )}
              </dl>
            )}

            <div className="mt-6">
              <p className="text-xs font-semibold text-foreground-secondary">Joining fee</p>
              <p className="mt-0.5 text-3xl font-black tracking-tight text-foreground sm:text-4xl">
                {isFree ? "Free entry" : cost || "Ask the host"}
              </p>
              {!isFree && cost ? (
                <p className="mt-1 text-sm text-foreground-secondary">
                  Paid to the host directly, not through the app.
                </p>
              ) : null}
            </div>

            {/* The one action a browser visitor can complete without the app */}
            {!event.hasEnded && (
              <div className="mt-6 flex flex-col gap-2.5">
                <Button
                  type="button"
                  size="lg"
                  onClick={() => triggerAppModal("join")}
                  className="w-full justify-center"
                >
                  <Users className="h-4 w-4" aria-hidden="true" />
                  <span>Request to join in app</span>
                </Button>

                <div className="flex items-center gap-2">
                  {directionsHref && (
                    <Button
                      as="a"
                      href={directionsHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="outline"
                      size="md"
                      className="flex-1 justify-center"
                    >
                      <Navigation className="h-4 w-4" aria-hidden="true" />
                      <span>Get directions</span>
                      <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                      <span className="sr-only"> (opens Google Maps in a new tab)</span>
                    </Button>
                  )}

                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => triggerAppModal("save")}
                    aria-label={`Save ${eventTitle} to favourites`}
                    className="text-foreground-secondary hover:text-primary"
                  >
                    <Bookmark className="h-4 w-4" aria-hidden="true" />
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={handleShare}
                    aria-label={`Share ${eventTitle}`}
                    className="text-foreground-secondary hover:text-primary"
                  >
                    <Share2 className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </div>

                <p className="text-xs leading-5 text-foreground-secondary">
                  The host approves every request in the app before you attend.
                </p>
              </div>
            )}

            {!event.hasEnded && (
              <DetailSteps
                id="join-steps-heading"
                title="How to join this event"
                steps={JOIN_STEPS}
                footnote="meelTe does not collect the joining fee. Pay the host directly when you meet."
              />
            )}

            {event.description && (
              <div className="mt-8">
                <h2 className="text-sm font-semibold text-foreground">About this event</h2>
                <p className="mt-2 max-w-prose whitespace-pre-wrap break-words text-base leading-7 text-foreground">
                  {event.description}
                </p>
              </div>
            )}

            {hasEngagement && (
              <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-border/60 pt-4 text-sm text-foreground-secondary">
                {likesCount > 0 && (
                  <button
                    type="button"
                    onClick={() => triggerAppModal("default")}
                    aria-label={`${likesCount} likes — open this event in the app`}
                    className="inline-flex items-center gap-1.5 rounded-md py-1 transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
                  >
                    <Heart className="h-4 w-4" aria-hidden="true" />
                    <span>{likesCount} likes</span>
                  </button>
                )}

                {commentsCount > 0 && (
                  <button
                    type="button"
                    onClick={() => triggerAppModal("default")}
                    aria-label={`${commentsCount} comments — open this event in the app`}
                    className="inline-flex items-center gap-1.5 rounded-md py-1 transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
                  >
                    <MessageCircle className="h-4 w-4" aria-hidden="true" />
                    <span>{commentsCount} comments</span>
                  </button>
                )}
              </div>
            )}

            <div className="mt-8">
              <Link
                href="/events"
                className="inline-flex items-center gap-2 rounded-sm text-sm font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                <span>Explore more community events</span>
              </Link>
            </div>
          </div>
        </article>
      </Container>

      {/* Phones only: keeps the fee and the primary action reachable while reading */}
      {!event.hasEnded && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border/80 bg-surface/95 px-4 pt-2.5 pb-[calc(0.625rem+env(safe-area-inset-bottom))] backdrop-blur-md lg:hidden">
          <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-foreground">
                {isFree ? "Free entry" : cost || eventTitle}
              </p>
              <p className="truncate text-[11px] text-foreground-secondary">
                {schedule || "Host approval required"}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              {directionsHref && (
                <Button
                  as="a"
                  href={directionsHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="outline"
                  size="icon"
                  aria-label="Get directions to this event"
                >
                  <Navigation className="h-4 w-4" aria-hidden="true" />
                </Button>
              )}

              <Button type="button" size="md" onClick={() => triggerAppModal("join")}>
                <Users className="h-4 w-4" aria-hidden="true" />
                <span>Join in app</span>
              </Button>
            </div>
          </div>
        </div>
      )}

      <AppActionModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState((prev) => ({ ...prev, isOpen: false }))}
        actionType={modalState.actionType}
        eventTitle={modalState.eventTitle}
      />
    </section>
  );
}

export default EventDetail;
