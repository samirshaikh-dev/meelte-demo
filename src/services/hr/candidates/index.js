/**
 * HR Candidate Pipeline Barrel
 *
 * Client-safe candidate data services only:
 *   - ./candidates-service  Firestore reads/writes via the Firebase client SDK
 *   - ./storage-service     Resume upload/delete via the Firebase client SDK
 *
 * NOTE: Server-only helpers that depend on `firebase-admin` live in
 * `./signed-url-service.js` and are deliberately NOT re-exported here. This
 * barrel is imported by the `HrProvider` Client Component, so re-exporting a
 * `server-only` module from it would break the build.
 */

export * from "./candidates-service";
export * from "./storage-service";
