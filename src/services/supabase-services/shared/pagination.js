import { DEFAULT_PAGE_SIZE, MAX_SITEMAP_PAGES } from "./constants";

/**
 * Walk a cursor-paginated list function until the API returns a short page or
 * the safety cap is reached.
 *
 * `listPage` receives `{ beforeCreatedAt, beforeId }` (or `undefined` on the
 * first call) and returns one normalised page. Keeping the walk here — and the
 * list function in the caller — avoids a circular import between the walk and
 * the resource modules it paginates.
 */
export async function allPages(listPage) {
  const items = [];
  let cursor;

  for (let pageNumber = 0; pageNumber < MAX_SITEMAP_PAGES; pageNumber += 1) {
    const page = await listPage(cursor);
    items.push(...page);
    if (page.length < DEFAULT_PAGE_SIZE) break;

    const last = page[page.length - 1];
    if (!last?.createdAt || !last?.id) break;
    cursor = { beforeCreatedAt: last.createdAt, beforeId: last.id };
  }

  return items;
}
