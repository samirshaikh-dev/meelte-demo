/**
 * Public Blog Barrel — server-only, read-only public surface.
 *
 * Exposes the public blog browsing layer:
 *   - ./blog-service  fetchPublicBlogPosts, fetchPublicBlogPostBySlugOrId,
 *                     fetchRelatedBlogPosts
 *
 * Mirrors `src/services/site/careers/index.js`: every consumer is a Server
 * Component (`/blog`, `/blog/[slug]`, `sitemap.js`) or Route Handler
 * (`/feed.xml`) rendering public pages. The module imports `server-only`, so
 * a Client Component importing this barrel fails the build rather than
 * leaking Firestore credentials into the browser bundle.
 *
 * Firestore reads go through the Firebase client SDK (getFirebaseDb) exactly
 * like the HR jobs service — `firebase-admin` is never introduced on the
 * public read path (decision D-C1).
 */

export * from "./blog-service";
