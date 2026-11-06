/**
 * HR Service Master Barrel (Client-Safe Data Services)
 *
 * Consolidates partitioned HR domain data services safe for both
 * Client Components and Server Components:
 *   - Job Requisitions:    ./jobs
 *   - Candidate Pipeline:  ./candidates
 *
 * NOTE: Server-only authentication services (login, session, rate-limit, password)
 * are intentionally isolated in `@/services/hr/login` to prevent leaking
 * `server-only`, `node:crypto`, or `next/headers` dependencies into Client Component bundles.
 */

export * from "./jobs";
export * from "./candidates";
