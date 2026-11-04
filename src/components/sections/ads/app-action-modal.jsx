"use client";

import { Tag, Bookmark, Store, Smartphone } from "@/lib/icons";
import { AppActionDialog } from "@/components/ui/app-action-dialog";

/**
 * Copy for every in-app action the offer surfaces can trigger. Titles name the
 * action the visitor was attempting; descriptions say where it actually
 * happens, so the dialog never promises a browser flow that does not exist.
 */
const ACTION_CONFIG = {
  claim: {
    icon: Tag,
    title: "Claim this offer in the app",
    description:
      "Claim the deal in the meelTe mobile app, then show it at the shop. Payment still happens in person.",
  },
  save: {
    icon: Bookmark,
    title: "Save this offer in the app",
    description:
      "Saved offers and updates from this shop are kept in the meelTe mobile app.",
  },
  post: {
    icon: Store,
    title: "Post offers as a shop",
    description:
      "Shops publish offers, photo menus and discounts through the meelTe mobile app.",
  },
  default: {
    icon: Smartphone,
    title: "This feature is in the app",
    description:
      "meelTe is a hyperlocal mobile experience. Download the app to claim deals, follow nearby shops and see what is on around you.",
  },
};

const MERCHANT_LINK = {
  href: "/for-merchants",
  label: "How meelTe works for local businesses",
};

/**
 * Accessible promotion modal triggered whenever a visitor attempts an
 * interactive in-app action on the website's offer surfaces.
 *
 * The dialog itself is the shared `AppActionDialog`; this module only supplies
 * the offer copy and the offer title shown as context.
 */
export function AppActionModal({
  isOpen = false,
  onClose,
  actionType = "default",
  offerTitle = "",
}) {
  const config = ACTION_CONFIG[actionType] || ACTION_CONFIG.default;

  return (
    <AppActionDialog
      isOpen={isOpen}
      onClose={onClose}
      icon={config.icon}
      title={config.title}
      description={config.description}
      contextLabel="Offer"
      contextValue={offerTitle}
      footerLink={actionType === "post" ? MERCHANT_LINK : null}
    />
  );
}

export default AppActionModal;
