// External API base URLs and endpoints
// All requests go to external backend as per architecture
export const API_BASE_URL = process.env.NEXT_PUBLIC_MEELTE_API_BASE_URL;

export const API_ENDPOINTS = {
  EVENTS: "/events",
  EVENT_BY_SLUG: (slug) => `/events/${slug}`,
  MERCHANT_INQUIRY: "/inquiries/merchant",
  CONTACT: "/contact",
  NEWSLETTER: "/newsletter",
  CATEGORIES: "/categories",
};
