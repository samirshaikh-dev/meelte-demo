"use client";

import { CalendarDays, Users, Bookmark, Smartphone } from "@/lib/icons";
import { AppActionDialog } from "@/components/ui/app-action-dialog";

/**
 * Copy for every in-app action the event surfaces can trigger. Titles name the
 * action the visitor was attempting; descriptions say where it actually
 * happens, so the dialog never promises a browser flow that does not exist.
 */
const ACTION_CONFIG = {
  join: {
    icon: Users,
    title: "Request to join in the app",
    description:
      "Join requests, group size and host approval are handled in the meelTe mobile app.",
  },
  save: {
    icon: Bookmark,
    title: "Save this event in the app",
    description:
      "Saved events and updates from the host are kept in the meelTe mobile app.",
  },
  host: {
    icon: CalendarDays,
    title: "Host a community event",
    description:
      "Creating events, approving join requests and notifying followers happens in the meelTe mobile app.",
  },
  default: {
    icon: Smartphone,
    title: "This feature is in the app",
    description:
      "meelTe is a hyperlocal mobile experience. Download the app to discover, join and host events near you.",
  },
};

/**
 * Accessible promotion modal triggered whenever a visitor attempts an
 * interactive in-app action on the website's event surfaces.
 *
 * The dialog itself is the shared `AppActionDialog`; this module only supplies
 * the event copy and the event title shown as context.
 */
export function AppActionModal({
  isOpen = false,
  onClose,
  actionType = "default",
  eventTitle = "",
}) {
  const config = ACTION_CONFIG[actionType] || ACTION_CONFIG.default;

  return (
    <AppActionDialog
      isOpen={isOpen}
      onClose={onClose}
      icon={config.icon}
      title={config.title}
      description={config.description}
      contextLabel="Event"
      contextValue={eventTitle}
    />
  );
}

export default AppActionModal;
