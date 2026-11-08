/**
 * HR Service Master Barrel
 *
 * Consolidates partitioned HR domain data services:
 *   - Job Requisitions:    ./jobs
 *   - Candidate Pipeline:  ./candidates
 *
 * NOTE: Server-only authentication services (login, session, rate-limit, password)
 * live in `@/services/hr/auth` to prevent leaking `server-only` dependencies.
 */

export * from "./jobs";
export * from "./candidates";
