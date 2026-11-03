// Shared tunables for the read-only Supabase PostgREST client.
// Every value here is a module constant so ISR windows and sitemap output stay
// deterministic (AI_RULE.md §2.6).

export const DEFAULT_PAGE_SIZE = 50;
export const MAX_PAGE_SIZE = 50;

// The `/ads` listing shows a short first page and appends on demand, so it asks
// for fewer rows than DEFAULT_PAGE_SIZE. Kept separate on purpose: `allPages()`
// in shared/pagination.js stops when a page is shorter than DEFAULT_PAGE_SIZE,
// so lowering that value would silently truncate the sitemap to one page.
export const LISTING_PAGE_SIZE = 20;

// 15 minutes for lists, 30 minutes for detail pages, 60 minutes for the sitemap.
export const LIST_REVALIDATE_SECONDS = 900;
export const DETAIL_REVALIDATE_SECONDS = 1800;
export const SITEMAP_REVALIDATE_SECONDS = 3600;

// Safety cap on the cursor walk so a misbehaving upstream cannot loop forever.
export const MAX_SITEMAP_PAGES = 1000;

// Cache tags shared by the read paths. Any future mutation of offers or events
// must revalidate these exact strings.
export const CACHE_TAGS = {
  ads: "meelte-public-ads",
  events: "meelte-public-events",
};
