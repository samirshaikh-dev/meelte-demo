/**
 * Public Careers Barrel — server-only, read-only public surface.
 *
 * Exposes the public job browsing layer:
 *   - ./jobs  fetchPublicActiveJobs, fetchPublicJobBySlugOrId
 *
 * NOTE: The application ingestion layer (`./applications`: admin Firestore
 * writes, private resume storage, in-memory rate limiting) is `server-only` and
 * is deliberately NOT re-exported here. Every consumer of this barrel is a
 * Server Component or Route Handler rendering public pages, so re-exporting the
 * admin modules would pull `firebase-admin` and its Node built-ins into those
 * bundles for no reason — and would break the build the moment a Client
 * Component imported this barrel. The single caller that needs the ingestion
 * layer imports it explicitly:
 *
 *   import { submitJobApplication } from "@/services/site/careers/applications";
 */

export * from "./jobs";
