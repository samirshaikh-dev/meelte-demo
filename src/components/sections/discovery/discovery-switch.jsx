"use client";

import { useState } from "react";
import { AdsListing } from "@/components/sections/ads";
import { EventsListing } from "@/components/sections/events";
import { DiscoveryToggle } from "./discovery-toggle";

/**
 * Client-side view manager for the unified discovery page (/).
 *
 * Defaults to "ads" to match the prerendered static shell.
 * Unmounts the inactive listing view to keep DOM lightweight and reset filters.
 */
export function DiscoverySwitch({ ads, events }) {
  const [view, setView] = useState("ads");

  const toggle = (
    <DiscoveryToggle
      value={view}
      onChange={setView}
      items={[
        { value: "ads", label: "Ads" },
        { value: "events", label: "Events" },
      ]}
    />
  );

  return (
    <div className="bg-canvas">
      {/*
        Both tabs label the single active panel container.
        Exactly one panel exists at a time; inactive listing is unmounted
        to reset filters, avoid duplicate DOM, and prevent duplicate modals.
      */}
      <div
        role="tabpanel"
        id="discovery-panel"
        aria-labelledby={`discovery-tab-${view}`}
      >
        {view === "ads" ? (
          <AdsListing
            ads={ads?.items || []}
            nextCursor={ads?.nextCursor || null}
            unavailable={Boolean(ads?.unavailable)}
            toggleControl={toggle}
            breadcrumbs={[]}
          />
        ) : (
          <EventsListing
            events={events?.items || []}
            nextCursor={events?.nextCursor || null}
            unavailable={Boolean(events?.unavailable)}
            toggleControl={toggle}
            breadcrumbs={[]}
          />
        )}
      </div>
    </div>
  );
}

