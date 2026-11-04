"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Bookmark,
  CalendarDays,
  CheckCircle2,
  Clock,
  Heart,
  MapPin,
  MessageCircle,
  Navigation,
  Share2,
  ShieldCheck,
  Sparkles,
  Users,
} from "@/lib/icons";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { notifySuccess } from "@/lib/toast-feedback";
import { formatCost, formatDateTime } from "./event-formatters";
import { AppActionModal } from "./app-action-modal";

const remoteImageLoader = ({ src }) => src;

function getDirectionsHref(event) {
  if (event.lat === null || event.lng === null) return null;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${event.lat},${event.lng}`)}`;
}

/**
 * Community event detail view grounded in buyer/attendee psychology (psychology.md)
 * and strict anti-pattern design principles (AVOID.md).
 *
 * Reduces attendee uncertainty:
 * 1. "Who is hosting and is it safe?" (Host profile & approval-based attendance)
 * 2. "How much is it and how do I pay?" (Clear cost badge & offline settlement honesty)
 * 3. "How do I participate?" (3-step clear attendance process)
 * 4. "Where is it located?" (Google Maps directions and location details)
 *
 * Interactive in-app actions trigger the AppActionModal with store links.
 */
export function EventDetail({ event, breadcrumbs }) {
  const [modalState, setModalState] = useState({
    isOpen: false,
    actionType: "default",
    eventTitle: event?.title || "",
  });

  const directionsHref = getDirectionsHref(event);
  const start = formatDateTime(event.startTime);
  const end = formatDateTime(event.endTime);
  const cost = formatCost(event.cost);
  const isFree = event.cost === 0;

  function triggerAppModal(actionType) {
    setModalState({
      isOpen: true,
      actionType,
      eventTitle: event?.title || "Community event",
    });
  }

  function handleShare() {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (navigator?.share) {
      navigator
        .share({
          title: event.title || "Community event on meelTe",
          text: `Check out this event on meelTe: ${event.title || "Community event"} hosted by ${event.creatorName || "a local host"}`,
          url,
        })
        .catch(() => {});
    } else if (navigator?.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        notifySuccess("Event link copied to clipboard!");
      });
    }
  }

  return (
    <section className="border-b border-border/80 bg-canvas py-6 sm:py-10 lg:py-14">
      <Container className="max-w-6xl">
        <Breadcrumbs items={breadcrumbs} className="mb-6" />

        {/* Expiry Notification */}
        {event.hasEnded ? (
          <div
            role="status"
            className="mb-6 flex items-start gap-3 rounded-xl border border-error/30 bg-error/5 p-4 text-sm text-error"
          >
            <Clock className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
            <div>
              <p className="font-semibold">This event has already taken place</p>
              <p className="mt-0.5 text-xs text-error/90">
                This gathering has concluded. Browse other upcoming community events happening nearby.
              </p>
            </div>
          </div>
        ) : null}

        <article className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(20rem,0.85fr)] lg:items-start lg:gap-12">
          {/* Left Column: Cover Photo & Host Profile Card */}
          <div className="flex flex-col gap-6">
            {/* Event Cover Photo */}
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border/80 bg-surface shadow-soft">
              {event.coverUrl ? (
                <Image
                  src={event.coverUrl}
                  loader={remoteImageLoader}
                  alt={event.title || "Community event cover"}
                  fill
                  priority
                  unoptimized
                  sizes="(min-width: 1024px) 55vw, 100vw"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center p-8 text-center text-sm text-foreground-secondary">
                  No cover photo provided by the host.
                </div>
              )}

              {/* Cost Badge */}
              {cost && (
                <Badge
                  variant={isFree ? "success" : "accent"}
                  className={
                    isFree
                      ? "absolute left-3.5 top-3.5 border-transparent bg-success text-white shadow-soft text-xs font-bold"
                      : "absolute left-3.5 top-3.5 bg-accent text-accent-foreground shadow-soft text-xs font-bold"
                  }
                >
                  {cost}
                </Badge>
              )}
            </div>

            {/* Host Credibility Panel */}
            <div className="rounded-2xl border border-border/80 bg-surface p-5 shadow-soft">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-surface-muted text-primary shadow-soft font-bold text-base">
                    {event.creatorName ? event.creatorName.charAt(0).toUpperCase() : "H"}
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-foreground">
                      {event.creatorName || "Community Host"}
                    </h2>
                    <p className="text-xs text-foreground-secondary">
                      Event Organiser on meelTe
                    </p>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-surface-muted px-2 py-0.5 text-[10px] font-semibold text-primary">
                  <ShieldCheck className="h-3 w-3" aria-hidden="true" />
                  <span>Verified Host</span>
                </span>
              </div>

              {/* Attendee counter & social proof */}
              {typeof event.attendeesCount === "number" && (
                <div className="mt-4 flex items-center gap-2 border-t border-border/60 pt-3.5 text-xs text-foreground-secondary">
                  <Users className="h-4 w-4 text-primary" aria-hidden="true" />
                  <span>
                    <strong className="text-foreground">{event.attendeesCount}</strong>{" "}
                    {event.attendeesCount === 1 ? "attendee joined" : "attendees joined"}
                  </span>
                </div>
              )}

              <div className="mt-4 flex flex-wrap gap-2 pt-1">
                {directionsHref && (
                  <Button
                    as="a"
                    href={directionsHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="outline"
                    size="sm"
                    className="flex-1 justify-center gap-1.5 text-xs"
                  >
                    <Navigation className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Get directions</span>
                  </Button>
                )}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => triggerAppModal("chat")}
                  className="flex-1 justify-center gap-1.5 text-xs text-foreground-secondary hover:text-primary"
                >
                  <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Message host</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Right Column: Event Info & Action Area */}
          <div className="min-w-0 flex flex-col">
            {/* Category and Badges */}
            <div className="flex flex-wrap items-center gap-2">
              {event.category && (
                <Badge variant="primary" className="text-xs">
                  {event.category}
                </Badge>
              )}
              {start && (
                <span className="inline-flex items-center gap-1 rounded-md bg-canvas px-2.5 py-1 text-xs font-medium text-foreground-secondary border border-border/60">
                  <CalendarDays className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                  <span>{start}</span>
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="mt-3.5 text-2xl font-black tracking-tight text-foreground sm:text-3xl lg:text-4xl">
              {event.title || "Community event"}
            </h1>

            {event.creatorName && (
              <p className="mt-1.5 text-base font-semibold text-foreground-secondary">
                Hosted by <strong className="text-foreground">{event.creatorName}</strong>
              </p>
            )}

            {/* Joining Fee Box & Conversion Actions */}
            <div className="mt-5 rounded-2xl border border-border/80 bg-surface p-4 shadow-soft">
              <span className="text-xs font-semibold uppercase tracking-wider text-foreground-secondary">
                Participation Cost
              </span>
              <div className="mt-1 flex flex-wrap items-baseline gap-3">
                <span className="text-3xl font-black text-primary">
                  {isFree ? "Free Entry" : cost}
                </span>
                {!isFree && (
                  <span className="rounded-full bg-accent/15 px-2.5 py-0.5 text-xs font-bold text-accent-foreground border border-accent/30">
                    Host Joining Fee
                  </span>
                )}
              </div>

              {/* Conversion Buttons */}
              <div className="mt-4 flex flex-col gap-2.5 sm:flex-row sm:items-center">
                <Button
                  type="button"
                  onClick={() => triggerAppModal("join")}
                  size="lg"
                  className="flex-1 justify-center bg-primary text-white hover:bg-primary-hover shadow-soft font-bold"
                >
                  <Users className="h-4 w-4" aria-hidden="true" />
                  <span>Request to join in app</span>
                </Button>

                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => triggerAppModal("save")}
                    aria-label="Save to favourites"
                    className="h-11 w-11 p-0 justify-center text-foreground-secondary hover:text-primary"
                  >
                    <Bookmark className="h-4 w-4" aria-hidden="true" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleShare}
                    aria-label="Share this event"
                    className="h-11 w-11 p-0 justify-center text-foreground-secondary hover:text-primary"
                  >
                    <Share2 className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </div>
              </div>

              <p className="mt-2 text-center text-[11px] text-foreground-secondary">
                Approval-based admission: Host approves all attendees in the app
              </p>
            </div>

            {/* Description */}
            {event.description && (
              <div className="mt-6">
                <h2 className="text-sm font-bold uppercase tracking-wider text-foreground-secondary">
                  About This Gathering
                </h2>
                <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-relaxed text-foreground">
                  {event.description}
                </p>
              </div>
            )}

            {/* How to Join - Process Guidance (psychology.md) */}
            <section
              aria-labelledby="join-steps-heading"
              className="mt-8 rounded-2xl border border-border/80 bg-surface p-5 shadow-soft"
            >
              <h2
                id="join-steps-heading"
                className="flex items-center gap-2 text-sm font-bold text-foreground"
              >
                <CheckCircle2 className="h-4 w-4 text-primary" aria-hidden="true" />
                <span>How to participate</span>
              </h2>

              <ol className="mt-3.5 grid gap-3 sm:grid-cols-3">
                <li className="flex flex-col rounded-xl border border-border/60 bg-canvas p-3">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    1
                  </span>
                  <h3 className="mt-1.5 text-xs font-bold text-foreground">Request to Join</h3>
                  <p className="mt-0.5 text-[11px] leading-4 text-foreground-secondary">
                    Open meelTe app and choose whether attending solo or with a group.
                  </p>
                </li>
                <li className="flex flex-col rounded-xl border border-border/60 bg-canvas p-3">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    2
                  </span>
                  <h3 className="mt-1.5 text-xs font-bold text-foreground">Host Approval</h3>
                  <p className="mt-0.5 text-[11px] leading-4 text-foreground-secondary">
                    The host reviews attendee requests to keep the group manageable.
                  </p>
                </li>
                <li className="flex flex-col rounded-xl border border-border/60 bg-canvas p-3">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    3
                  </span>
                  <h3 className="mt-1.5 text-xs font-bold text-foreground">Meet & Settle</h3>
                  <p className="mt-0.5 text-[11px] leading-4 text-foreground-secondary">
                    Join the gathering in person. Settle any event costs directly offline.
                  </p>
                </li>
              </ol>

              <div className="mt-3.5 border-t border-border/60 pt-3 text-[11px] text-foreground-secondary flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden="true" />
                <span>Zero platform ticketing commissions. All host fees are settled directly offline.</span>
              </div>
            </section>

            {/* Time & Location Details */}
            <dl className="mt-6 space-y-4 border-t border-border/80 pt-6 text-xs text-foreground-secondary">
              {(start || end) && (
                <div className="flex items-start gap-3">
                  <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                  <div>
                    <dt className="font-semibold text-foreground">Event schedule</dt>
                    <dd className="mt-0.5">{start && end ? `${start} – ${end}` : start || end}</dd>
                  </div>
                </div>
              )}

              {(event.locationName || event.address) && (
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                  <div>
                    <dt className="font-semibold text-foreground">Location</dt>
                    <dd className="mt-0.5 whitespace-pre-wrap leading-relaxed">
                      {[event.locationName, event.address].filter(Boolean).join("\n")}
                    </dd>
                  </div>
                </div>
              )}
            </dl>

            {/* Community Activity Feedback */}
            {(event.likesCount !== null || event.commentsCount !== null) && (
              <div
                className="mt-6 flex flex-wrap items-center gap-4 border-t border-border/60 pt-4 text-xs text-foreground-secondary"
                aria-label="Event community engagement"
              >
                {event.likesCount !== null && (
                  <button
                    type="button"
                    onClick={() => triggerAppModal("default")}
                    className="inline-flex items-center gap-1.5 hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/70 rounded-md py-1"
                  >
                    <Heart className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>{event.likesCount} likes</span>
                  </button>
                )}
                {event.commentsCount !== null && (
                  <button
                    type="button"
                    onClick={() => triggerAppModal("default")}
                    className="inline-flex items-center gap-1.5 hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/70 rounded-md py-1"
                  >
                    <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>{event.commentsCount} comments</span>
                  </button>
                )}
              </div>
            )}

            {/* Back to all events */}
            <div className="mt-8 pt-4">
              <Link
                href="/events"
                className="inline-flex items-center gap-2 text-xs font-semibold text-primary hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/70"
              >
                <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Explore more community events</span>
              </Link>
            </div>
          </div>
        </article>

        {/* Mobile Fixed Bottom Action Bar */}
        <div className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-between border-t border-border/80 bg-surface/95 px-4 py-3 backdrop-blur-md shadow-card md:hidden">
          <div>
            <span className="block text-xs font-bold text-primary">
              {isFree ? "Free Entry" : cost || "Event"}
            </span>
            <span className="text-[10px] font-semibold text-foreground-secondary">
              Host approval required
            </span>
          </div>
          <div className="flex items-center gap-2">
            {directionsHref && (
              <Button
                as="a"
                href={directionsHref}
                target="_blank"
                rel="noopener noreferrer"
                variant="outline"
                size="sm"
                className="h-9 px-3 text-xs"
              >
                <Navigation className="h-3.5 w-3.5" aria-hidden="true" />
                <span className="sr-only">Directions</span>
              </Button>
            )}
            <Button
              type="button"
              onClick={() => triggerAppModal("join")}
              size="sm"
              className="h-9 bg-primary text-white text-xs font-bold"
            >
              <Users className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Join in app</span>
            </Button>
          </div>
        </div>
      </Container>

      {/* Action Gating App Promotion Modal */}
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
