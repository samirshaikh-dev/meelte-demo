# Career Apply Flow — Audit & Implementation Plan

> **Requirement source:** [`new-req.md`](./new-req.md)
> **Status:** PLAN ONLY. No application-form code has been written. Three decisions below block implementation.
> **Last updated:** 6 November 2026
>
> **Context documents applied:** `AGENTS.md`, `AI_RULE.md` §2.1/§2.3/§2.6/§3, `project-context.md` §6/§12/§13, `meelTe-context.md` §3/§6/§11, `docs/target_customer.md` (no customer-facing job board claim), `docs/Design.md` (tokens), `plan.md` D1/D2/R4.
> **Skills applied:** `security-engineer` (uploads, abuse controls, authz), `backend-engineer` (route contract, status codes), `frontend-engineer` (form UX, client/security boundary), `accessibility-engineer` (form labels, error announcement, dialog/focus), `seo-engineer` (the apply route must not be indexed).

---

## 1. Audit summary

### 1.1 Current data flow

```
HR admin  ──POST /api/hr/jobs──►  Firestore `hr_jobs`  {
                                    id, slug, title, department, employmentType,
                                    workplaceType, location, experienceLevel,
                                    salaryRange|salaryMin/Max, deadline, status,
                                    applicantCount, description, responsibilities,
                                    requirements, skills[], createdAt, updatedAt }

Public    ──fetchPublicActiveJobs()  (use cache, cacheLife("minutes"))
          ──fetchPublicJobBySlugOrId()
               └─ filter: status === "Active" AND deadline >= today
               └─ toPublicJobSummary/Detail  (strips applicantCount, notes, status)

Job page  ──/careers/[slug]  (partial prerender; shell + <Suspense> content)
               └─ job-details-view.jsx  → 3 CTAs, all `mailto:hr@meelTe.com`

HR admin  ──GET /api/hr/candidates──► Firestore `hr_candidates`
          ──POST /api/hr/candidates (UNCONFIRMED AUTH — see F2)
               └─ createCandidateApplication()  → setDoc + increment(job.applicantCount)
```

There is **no** public application endpoint, **no** public write path, and **no** storage upload path outside the HR portal's own admin modal.

### 1.2 Current Candidate model (verified, not guessed)

Source of truth: `src/validation/hr/candidate-validation.js` (`candidateApplicationSchema`), `src/services/hr/candidates/hr-candidates-service.js` (`createCandidateApplication`, `normalizeCandidate`), `scripts/seed-hr-firebase.mjs`.

| Field | Type / shape | Written by | Notes |
| :--- | :--- | :--- | :--- |
| `id` | `cand-${Date.now()}` | service | Time-based, collision-prone under concurrency |
| `fullName` | string, 2–100 | form/seed | |
| `email` | string, ≤120 | form/seed | **No normalization, no uniqueness** |
| `phone` | string, 7–25 | form/seed | |
| `location` | string, 2–100 | form/seed | |
| `appliedJobId` | string | form/seed | The job reference. Named `appliedJobId`, **not** `jobId` |
| `appliedJobTitle` | string | form/seed | Denormalized at apply time |
| `experience` | string, ≤50, default `""` | form/seed | Covers "total experience" |
| `currentCompany` | string, ≤100, default `""` | form/seed | Covers "current role/company" |
| `status` | enum, default `"Applied"` | service | **Default is not a member of `CANDIDATE_STATUSES`** (F3) |
| `appliedDate` | `YYYY-MM-DD` string | service | Date only, no time. **Not** `appliedAt` |
| `resumeUrl` | string \| absent | admin upload only | Seeded docs use `"#"`; a real `getDownloadURL` is public (F4) |
| `resumeStoragePath` | string \| absent | admin upload only | `hr/resumes/{candidateId}/{ts}-{name}` |
| `resumeFileName` | string \| absent | admin upload only | |
| `notes[]` | `{id, author, date, text}` | `addCandidateNote` | |
| `createdAt` / `updatedAt` | Firestore server timestamp | service | Normalized to date strings on read |

`CANDIDATE_STATUSES` (`src/constants/hr-constants.js`): `Under Review`, `Shortlisted`, `Interview Scheduled`, `Offered`, `Rejected`.

### 1.3 Current storage setup

- `src/lib/firebase/config.js` — **browser/client** SDK (`firebase/app`, `firebase/firestore`, `firebase/storage`) initialized from `NEXT_PUBLIC_FIREBASE_CONFIG` (or `FIREBASE_CONFIG`).
- `src/services/firebase/storage.js` — `uploadFile()` → `uploadBytes` + `getDownloadURL`; `deleteStorageFile()`.
- `src/services/hr/candidates/hr-storage-service.js` — `uploadCandidateResume(candidateId, file)` uploads to `hr/resumes/{candidateId}` and returns a **tokenized download URL**.
- No `firebase-admin` import anywhere in `src/`. `firebase-admin@14.5.0` is installed but unused.
- No `firestore.rules` / `storage.rules` in the repo, so the deployed rule set is unknown and unversioned.

### 1.4 Current API + auth posture

| Route | Methods | Auth check |
| :--- | :--- | :--- |
| `/api/hr/auth` | GET/POST/DELETE | n/a (login) |
| `/api/hr/jobs`, `/api/hr/jobs/[id]` | GET/POST/PATCH/DELETE | `getHrSession()` ✅ |
| `/api/hr/dashboard` | GET | `getHrSession()` ✅ |
| `/api/hr/candidates` | GET | `getHrSession()` ✅ |
| `/api/hr/candidates` | **POST** | **none** ❌ |
| `/api/careers/jobs`, `/api/careers/jobs/[slug]` | GET | public by design ✅ |
| `/api/careers/jobs/[slug]/apply` | — | **does not exist** |

`src/proxy.js` matches only `["/hr", "/hr/:path*"]`. It does **not** guard `/api/hr/*`, so every API handler is responsible for its own check.

### 1.5 What the mailto flow actually does

`src/app/(site)/careers/[slug]/job-details-view.jsx`:
- `getJobApplyMailto(job)` builds `mailto:hr@meelTe.com?subject=…&body=…` with blank fields and "Please find my resume attached".
- Consumed by three CTAs: desktop header (`Apply for this position`), sidebar (`Apply Now`), sticky mobile bar (`Apply Now`).
- Nothing else in the repo references it.

---

## 2. Gap table — `new-req.md` §3

| Field required by the form / model | Exists today? | Action needed |
| :--- | :--- | :--- |
| Full name (req) | ✅ `fullName` | — |
| Email (req, validated) | ✅ `email` | Add trim+lowercase normalization; enforce uniqueness per job |
| Phone (req, validated) | ✅ `phone` | Tighten to a digit-count rule on the server |
| Current location (req) | ✅ `location` | — |
| LinkedIn URL (opt, validated) | ❌ | **Add** `linkedinUrl` (https-only, ≤200) |
| Portfolio / GitHub URL (opt, validated) | ❌ | **Add** `portfolioUrl` (https-only, ≤200) |
| Total experience / current role (opt) | ✅ `experience`, `currentCompany` | Reuse; do not add a third field |
| Notice period (opt) | ❌ | **Add** `noticePeriod` (string, ≤50) — **D-C6 decided** |
| Expected salary (opt) | ❌ | **Add** `expectedSalary` (string, ≤50) — **D-C6 decided** |
| Cover note (opt, ≤1000) | ❌ | **Add** `coverNote` (≤1000) |
| Resume upload (req, PDF/DOC/DOCX, ≤5 MB) | ⚠️ `resumeUrl`/`resumeStoragePath`/`resumeFileName` exist, but only admin-uploaded, 10 MB, public URL | **Change** limit to 5 MB; add magic-byte check; store private; add applicant upload path |
| Consent checkbox (req) | ❌ | **Add** `consentGiven: true`, `consentGivenAt` (timestamp), `consentVersion` |
| Job link (`jobId` ref) | ✅ `appliedJobId` | **Keep as-is** — see Q5. Renaming would break `candidates/page.jsx`, the filter bar, and every seeded doc |
| Status default `applied` | ⚠️ default `"Applied"`, but not in the enum | **Reconcile** the enum (F3) — **D-C2 decided**: exactly `Applied / Shortlisted / Rejected / Hired` |
| `appliedAt` | ⚠️ only `appliedDate` (date string) | **Add** `appliedAt` server timestamp; keep `appliedDate` as the derived display field |
| Resume URL **or** storage key | ✅ both exist | Keep `resumeStoragePath` as canonical; stop relying on `resumeUrl` |
| Original resume filename | ✅ `resumeFileName` | — |
| `source: "careers-page"` | ❌ | **Add** `source` |
| Dedupe key | ❌ | **Add** deterministic document id (see §5.1) — no schema field needed |
| Duplicate protection | ❌ | **Add** |
| Rate limit / honeypot / body cap | ❌ | **Add** |
| Admin applicant list per job | ⚠️ global `/hr/candidates` with a job filter only | **Extend**, do not rebuild |
| Authenticated resume access | ❌ (`window.open(resumeUrl)` on a public URL) | **Add** an authenticated download route + admin-only binding |

---

## 3. Blocking findings and conflicts (surface, do not silently resolve)

| # | Finding | Impact | Required decision |
| :--- | :--- | :--- | :--- |
| **F1** | **No server-side Firebase credential exists.** All Firestore/Storage access is the browser client SDK initialized from `NEXT_PUBLIC_FIREBASE_CONFIG`. A public `POST` route cannot write files or documents with the client SDK unless the security rules permit unauthenticated writes. | Blocked §4 of `new-req.md` | **Resolved by D-C1** (server-only `firebase-admin`) |
| **F2** | **`plan.md` D2 says "install neither … `firebase-admin`"** — but `firebase` and `firebase-admin` are both in `package.json`, and the whole HR portal is client-SDK. `AI_RULE.md` §2.1 repeats the "REST, not SDK" rule. The documentation is already stale relative to the code. | Decision made; the docs still contradict it | **Resolved by D-C1** — amend `AI_RULE.md` §2.1 and `plan.md` D2 in Phase 0 |
| **F3** | **Status vocabulary clash.** Schema/service default is `"Applied"`; `CANDIDATE_STATUSES` has no `"Applied"` (starts at `"Under Review"`); `new-req.md` asks for a 4-state flow `Applied / Shortlisted / Rejected / Hired`. `"Hired"` also does not exist. Any applicant created today renders as an unstyled grey badge and is invisible to the status filter. | Every new application would land in a state the admin UI cannot filter | **Resolved by D-C2** — four-state enum + lossy-map backfill (§8) |
| **F4** | **Resumes are not private today.** `getDownloadURL()` returns a tokenized public URL that anyone holding it can fetch, forever. `new-req.md` §4.4 explicitly requires non-public, signed/authenticated access. | Requirement conflict | Covered by D-C1 |
| **F5** | **Upload limit mismatch.** `HR_FILE_UPLOAD_CONSTRAINTS.MAX_RESUME_SIZE_BYTES` = 10 MB; requirement is 5 MB. | Validation must be tightened, and the admin modal's message must change with it | None — implement as 5 MB |
| **F6** | **Firestore has no migrations.** `new-req.md` §3 asks for "a proper migration" with backfill. The repo has no migration runner; the analogue is a script in `scripts/` (pattern: `scripts/seed-hr-firebase.mjs`, `scripts/empty-hr-firebase.mjs`). | Deliverable must be a backfill script, not a migration | None — see §8 |
| **F7** | **`applicantCount` is already unreliable.** `scripts/seed-hr-firebase.mjs` hardcodes invented counts (`0, 14, 18, 27, 31, 42`) against only six seeded candidates. `hr-context.jsx:154` forces `applicantCount: 0` on admin-created jobs. `createCandidateApplication` increments best-effort inside a `try/catch` that only warns. | "Real count" cannot be shown while seeded counts remain | Recommend: recount from `hr_candidates` for the admin column, or reset seeded counts in the backfill |
| **F8** | **No email provider is configured** and there is no test runner (`package.json` has no `test` script). | `new-req.md` §4 "optional email" is blocked; deliverable 5's "tests" can only mean lint + build + the manual checklist | Mark email as out of scope until a provider is chosen |
| **F9** | **`POST /api/hr/candidates` is unauthenticated and unvalidated** — it passes `request.json()` straight into `createCandidateApplication`, which spreads it into `setDoc`. Anyone can forge a candidate, choose their own `id` (overwriting an existing record), and bump any job's `applicantCount`. | Live security defect, adjacent to this feature | Recommend fixing in Phase 0 (it is the same trust boundary the new endpoint opens)
| **F10** | **`AI_RULE.md` §2.1 says public marketing routes fetch nothing**, while `/careers`, `/careers/[slug]`, `/api/careers/*` already read Firestore. The documentation has not been updated for this feature. | Doc drift only | Follow-up: add the careers routes to the documented exception list
| **F11** | **A 5 MB upload is larger than a typical serverless request-body cap.** Vercel documents 4.5 MB for Functions; a 5 MB PDF plus multipart overhead would be rejected by the platform before the route handler runs. (Verify the actual cap for this deployment before relying on this.) | Breaks a literal single-`multipart/form-data` implementation of §4.3/§4.4 on the live deployment | **D-C3** |

---

## 4. Decisions

> **Settled 2026-11-06:** D-C1 (`firebase-admin`), D-C2 (four-state pipeline), D-C6 (add notice period + expected salary).
> **Still open:** D-C3 (upload transport), D-C4 (form location), D-C5 (job-reference field name).

### D-C1 — How does the server write to Firestore and Storage? — **DECIDED: `firebase-admin`**

**Decision (user, 2026-11-06): use `firebase-admin` server-side.** The package is already at `firebase-admin@14.5.0` in `package.json` and unused; this is its first real use.

| Option | Verdict |
| :--- | :--- |
| **A. `firebase-admin` in a server-only module** | **CHOSEN.** Only option that gives genuine private storage (`getSignedUrl`), atomic `create()` for dedupe, and a transaction for `applicantCount`. |
| B. Client SDK + permissive security rules | Rejected — would make `hr_candidates` publicly writable and resumes publicly readable, exactly what `new-req.md` §4.4 forbids. |
| C. Hand-rolled Firebase REST + OAuth2 | Not needed now that A is chosen. |

**Implementation notes (matter for correctness):**

- `src/services/firebase/admin.js` must open with `import "server-only"` and initialize once behind a `getApps().length` guard, mirroring the pattern already in `src/lib/firebase/config.js:33` — otherwise every hot reload re-initializes the app.
- Use `initializeFirestore(app, { preferRest: true })`, not `getFirestore(app)`. Verified in `node_modules/firebase-admin/lib/firestore/index.d.ts:100,109` — `preferRest` switches Firestore to the HTTP/1.1 transport and avoids gRPC, which is the fragile path on serverless.
- Credential from `FIREBASE_SERVICE_ACCOUNT` (single-line JSON; `JSON.parse` handles escaped `\n` in `private_key` correctly, a split `FIREBASE_PRIVATE_KEY` var does not).
- Bucket from `FIREBASE_STORAGE_BUCKET` (server-only — **not** `NEXT_PUBLIC_`).
- If the build tries to bundle the package instead of externalizing it, add `serverExternalPackages: ["firebase-admin"]` to `next.config.mjs`. Check the build output before adding it pre-emptively.
- **Documentation debt this creates:** `AI_RULE.md` §2.1 and `plan.md` D2 both say "do not add `firebase-admin`". That is now contradicted by code that already exists *and* by this decision. Amend both to "server-only admin SDK permitted inside `src/services/`, gated by `server-only`, with authorization enforced in the route" — `plan.md` D2 already anticipates this wording in its §5 note. Do not leave the rule and the code disagreeing.

### D-C2 — Status vocabulary — **DECIDED: exactly four states**

`CANDIDATE_STATUSES` becomes exactly:

```js
["Applied", "Shortlisted", "Rejected", "Hired"]
```

`candidate-detail-modal.jsx:163` maps the enum into the status control and `candidates-filter-bar.jsx:62,67` builds its chips and counts from it, so both pick the change up with no edits. `candidateApplicationSchema`'s `.default("Applied")` becomes valid, which closes **F3** at the schema level. Verified: no dashboard metric filters on a candidate status (`/api/hr/dashboard` counts job statuses and `candidates.length` only), so nothing else breaks.

**The existing five values are not a subset of the new four, so the backfill must remap them.** `candidate-detail-modal.jsx` renders a `<select>` from the enum, so a record left on `"Offered"` would silently change status the next time an admin opened and saved it.

| Existing value | New value | Note |
| :--- | :--- | :--- |
| `Under Review` | `Applied` | Lossless enough |
| `Shortlisted` | `Shortlisted` | Unchanged |
| `Interview Scheduled` | `Shortlisted` | **Lossy** |
| `Offered` | `Shortlisted` | **Lossy** — an offer is not a hire, so `Hired` would be wrong |
| `Rejected` | `Rejected` | Unchanged |
| *(new)* | `Applied` | New public applications |
| *(new)* | `Hired` | Set by an admin only |

Because two mappings are lossy, the backfill writes the previous value to `statusLegacy` before overwriting (see §8). That keeps the recruiting history auditable without keeping a state the UI cannot render.

### D-C3 — Upload transport

| Option | Shape | Verdict |
| :--- | :--- | :--- |
| **A. Two-phase signed upload** | `POST …/apply/upload-url` → validates job + dedupe + honeypot + rate limit, returns a 5-minute signed `PUT` URL scoped to a random object name with `content-length-range` and `contentType` conditions. Browser PUTs the file straight to Storage. `POST …/apply` then sends metadata + `uploadToken`. The server re-checks the object (existence, size ≤5 MB, content-type) and reads the first 8 bytes via the admin SDK to confirm the magic number, deleting the object on mismatch. | **Recommended.** Keeps the request body at a few KB, so the route is unaffected by any platform request-body cap. **Confirm the deployment's actual cap before choosing** — Vercel's serverless limit is documented at 4.5 MB, which a 5 MB PDF plus multipart overhead exceeds. |
| B. Single-phase multipart | One `POST` with `multipart/form-data` | Simpler and matches the requirement text literally, but only works if the host accepts ≥6 MB bodies. Choose this if the deployment is not Vercel serverless, or if the limit is lowered to 4 MB. |

**`multer` is not an option here** and should not be added. It is Connect/Express middleware that parses from a Node `IncomingMessage`; App Router handlers receive a Web `Request` and `await request.formData()` already parses multipart natively. Its only real advantage — streaming with an early `limits.fileSize` cutoff — does not help, because a platform body cap is enforced before the handler runs. `diskStorage` additionally writes to an ephemeral `/tmp` on serverless. The bytes should travel browser → Storage, never browser → handler → Storage.

If the user insists on the literal single multipart endpoint, that is fine — pick B and record the body-limit caveat in the route file header.

### D-C4 — Where does the form live?

**Recommendation: a dedicated route `/careers/[slug]/apply`.**
- Eleven fields plus a drag-and-drop upload is too tall for the `AppActionDialog` panel (`max-h-[calc(100dvh-2rem)]`, `w-[min(28rem,…)]`), which exists for two-line promotional copy.
- A route keeps the three job-detail CTAs as plain `<Link>`s, so `job-details-view.jsx` gains no form state and `/careers/[slug]` stays a lightweight partial-prerender shell.
- A retryable URL is better for a failed upload than a lost dialog.
- Cost: one more dynamic segment, which (under Cache Components) needs the same proven shell pattern as `/careers/[slug]` — non-async page, `<Suspense>`-wrapped `Navbar`, `<Suspense fallback>` around the `params`-awaiting content. `export const metadata` must set `noIndex: true`.

Alternative (acceptable): Radix dialog reusing the `AppActionDialog` chrome. Then no new route, but the form lives inside `/careers/[slug]`'s client tree.

### D-C5 — Job-reference field name

`new-req.md` says "jobId". The code says `appliedJobId`, and `candidates/page.jsx:37` filters on it. **Recommendation: keep `appliedJobId`** and document it as the job reference. Adding a second `jobId` field creates two sources of truth. If the field name is a hard requirement, dual-write both for one release, migrate reads, then drop `appliedJobId`.

### D-C6 — Notice period / expected salary — **DECIDED: both are in the model**

New fields on `hr_candidates`:

| Field | Type | Bounds | Why a string, not a number |
| :--- | :--- | :--- | :--- |
| `noticePeriod` | string | trim, ≤50 | Indian answers are free text — "Immediate", "30 days", "2 months" — and a number would force a unit decision the product has not made |
| `expectedSalary` | string | trim, ≤50 | Expectations are quoted as ranges or LPA ("₹12–15 LPA"), matching how `hr_jobs.salaryRange` already stores a display string |

Both optional, both `""` when blank, both sent as form strings (not coerced). Neither is used in any filter, sort, or metric, so no index change is needed.

---

## 5. Target design

### 5.1 Model decision — one record per application

The existing model is **one `hr_candidates` doc per application**: it carries `appliedJobId`, `appliedJobTitle`, `status`, and `appliedDate` on the person record. There is no separate person/application split, and the admin UI assumes the flat shape everywhere (`candidates-table.jsx`, `candidate-detail-modal.jsx`, `hr-context.jsx` stats).

**Recommendation: keep one doc per application.** It already supports multiple jobs per person (two applications = two docs), requires no schema split, and needs no migration of existing records. The cost is duplicated personal data per application, which is acceptable at this scale and consistent with the current design. A person/application split is the cleaner long-term model but is a much larger change than `new-req.md` asks for; note it as a future refactor, not part of this work.

**Dedupe key:** derive the document id deterministically —
`cand_<first 24 hex of sha256(normalizedEmail + "|" + appliedJobId)>`.
Then `db.collection("hr_candidates").doc(id).create(payload)` fails with `ALREADY_EXISTS` on a second application for the same email+job, which is mapped to a friendly 409. No query, no race, no extra field. Trade-off: the same email can never re-apply to a job after a rejection unless an admin deletes the record — acceptable, and documented in the route.

### 5.2 Proposed candidate document (additions in **bold**)

```jsonc
{
  "id": "cand_9f2c…",                 // deterministic hash, not `cand-${Date.now()}`
  "fullName": "…", "email": "lower@example.com", "phone": "…", "location": "…",
  "appliedJobId": "job-1793946625996", "appliedJobTitle": "Software Engineer",
  "experience": "", "currentCompany": "",
  "status": "Applied",                // exactly: Applied | Shortlisted | Rejected | Hired
  "statusLegacy": "Interview Scheduled", // backfill only; previous value, kept for audit
  "appliedDate": "2026-11-06",        // kept: the admin table renders this
  "appliedAt": "<serverTimestamp>",   // added
  "source": "careers-page",           // added
  "resumeStoragePath": "hr/resumes/cand_9f2c…/<random>.pdf",
  "resumeFileName": "cv.pdf",
  "resumeSizeBytes": 482113,          // added
  "resumeMimeType": "application/pdf",// added
  "linkedinUrl": "", "portfolioUrl": "",   // added
  "noticePeriod": "", "expectedSalary": "",// added — D-C6 decided
  "coverNote": "",                          // added
  "consentGiven": true, "consentGivenAt": "<serverTimestamp>", "consentVersion": "2026-11",
  "notes": [], "createdAt": "<serverTimestamp>", "updatedAt": "<serverTimestamp>"
}
```

`resumeUrl` is **no longer written** for new applications. It stays readable for legacy/seeded docs (`"#"`), and the admin action treats its absence as "use the authenticated route".

### 5.3 Storage layout

```
hr/resumes/<candidateId>/<32-hex-random>.<ext>     ← private, no public URL persisted
```
- Random object name; the original filename is stored only in `resumeFileName`.
- No `getDownloadURL()` result is ever written to the document.
- Admin read path: `GET /api/hr/candidates/[id]/resume` → `getHrSession()` → admin SDK `getSignedUrl({ action: "read", expires: 60_000 })` → `302`. Authorization lives in the app, not in URL secrecy, and every fetch is attributable.
- Retention: note in the plan/PR that resumes should be purged on rejection after N days — out of scope, no scheduler exists.

### 5.4 API contract

**`POST /api/careers/jobs/[slug]/apply`** — public, `multipart/form-data` (D-C3 A or B)

Request fields: `fullName, email, phone, location, linkedinUrl?, portfolioUrl?, experience?, currentCompany?, noticePeriod?, expectedSalary?, coverNote?, consent ("true"), website (honeypot — must be empty), uploadToken (phase A only), resume (phase B only)`.

| Outcome | Status | Body |
| :--- | :--- | :--- |
| created | `201` | `{ success: true, data: { appliedAt, jobTitle } }` — no candidate id, no storage path, no PII echo |
| validation failed | `400` | `{ success: false, error: "…", code: "VALIDATION_FAILED", fieldErrors: { email: "…" } }` |
| job missing/draft/expired/archived | `410` | `{ success: false, error: "This role is no longer accepting applications.", code: "JOB_CLOSED" }` |
| duplicate email+job | `409` | `{ success: false, error: "You've already applied for this role.", code: "ALREADY_APPLIED" }` |
| honeypot tripped | `400` (generic, no detail) | `{ success: false, error: "We couldn't submit your application.", code: "INVALID_REQUEST" }` |
| rate limited | `429` + `Retry-After` | `{ success: false, error: "Too many applications from this network. Please try again later.", code: "RATE_LIMITED" }` |
| bad file (type/size/magic) | `400` | `{ success: false, error: "<specific reason>", code: "INVALID_RESUME" }` |
| storage/DB failure | `500` | `{ success: false, error: "We couldn't save your application. Please try again." }` — generic; real cause logged server-side **without** PII |

Response format matches the existing `/api/careers/*` routes (`{ success, data }` / `{ success, error }`) with a stable `code` added for client branching.

### 5.5 Validation rules (server, `zod`, in `src/validation/careers/`)

| Field | Rule |
| :--- | :--- |
| `fullName` | trim, 2–100 |
| `email` | trim, lowercase, valid, ≤120 |
| `phone` | trim, 7–15 digits after stripping spaces/`+`/`-`, ≤25 raw |
| `location` | trim, 2–100 |
| `linkedinUrl` / `portfolioUrl` | optional; empty string allowed; if present must parse as `https:` and ≤200. **Never fetched server-side** (no SSRF surface) |
| `experience`, `currentCompany` | optional, ≤50 / ≤100 (existing bounds) |
| `noticePeriod`, `expectedSalary` | optional, ≤50 |
| `coverNote` | optional, ≤1000 |
| `consent` | must be `"true"` |
| `website` (honeypot) | must be absent or empty; a filled value aborts before any write |
| resume | `.pdf/.doc/.docx`; ≤5 MB; real type from magic bytes (`%PDF-`, `\xD0\xCF\x11\xE0` for DOC, `PK\x03\x04` + `[Content_Types].xml` for DOCX); reject otherwise and delete the object |

Client-side validation mirrors these rules as UX only, never as the boundary (`frontend-engineer` rule).

### 5.6 Abuse controls

- Honeypot field `website`, visually hidden and `aria-hidden`, `tabIndex={-1}`.
- Per-IP sliding window: 5 submissions/hour → `429` + `Retry-After`. New `src/services/careers/apply-rate-limit.js`, modelled on `src/services/hr/login/rate-limit.js`. **It is per-process** — a speed bump on Vercel, not a global control, exactly like the existing login limiter. Document that; do not claim otherwise.
- Hard body cap: reject `content-length` > 6 MB before parsing; in phase-A mode the cap is 64 KB.
- No CAPTCHA (the project has none, and `new-req.md` says only add it if it exists).
- Never log request bodies, emails, phones, filenames, or storage paths. Log only `code` + hashed IP prefix.

### 5.7 Public UI

- `src/app/(site)/careers/[slug]/apply/page.jsx` — server shell + `noIndex` metadata + breadcrumbs (`Home → Careers → <job> → Apply`), `<Suspense>` around the `params`-awaiting content, job title + department at the top of the form.
- `src/components/sections/careers/apply/apply-form.jsx` — `"use client"`, `react-hook-form` + `zodResolver` (both already installed), or the repo's existing controlled-state style from `contact-form.jsx`. Prefer `react-hook-form` since the schema already exists.
- Fields per §2; resume dropzone with drag/drop, filename + size preview, remove button; `aria-describedby` errors, `aria-invalid`, `role="alert"` error summary, focus moved to the first invalid field; submit disabled + spinner while pending; success panel that names the job and says what happens next; error panel with retry that keeps every typed value.
- Remove `getJobApplyMailto` and the `Mail` icon import; the three CTAs become `<Link href={`/careers/${job.slug}/apply`}>`. Keep the existing `Button as={Link}` polymorphism.

### 5.8 Admin side (extend, do not rebuild)

1. `jobs-table.jsx` — the Applicants cell becomes a link to `/hr/candidates?jobId=<id>`; count read from the real candidate collection (§8 backfill) rather than trusting the stored field.
2. `src/app/hr/candidates/page.jsx` — accept an initial job filter from `?jobId=`. Under Cache Components, `useSearchParams()` requires a `<Suspense>` boundary, so wrap the page body or read the param in a thin client wrapper.
3. `candidate-detail-modal.jsx` — `handleDownloadResume` opens `/api/hr/candidates/{id}/resume` instead of `candidate.resumeUrl`; remove the "not downloadable in this preview yet" fallback for records that have a `resumeStoragePath`.
4. `CandidateStatusBadge` + `CANDIDATE_STATUSES` per D-C2.

---

## 6. Files

### Added

| Path | Why |
| :--- | :--- |
| `src/services/firebase/admin.js` | Single `server-only` admin app + `getAdminDb()` / `getAdminBucket()` (D-C1 decided) |
| `src/services/careers/apply-service.js` | Job-liveness check (uncached), dedupe, transactional create, `applicantCount` increment, orphan cleanup |
| `src/services/careers/apply-rate-limit.js` | Per-IP sliding window for the public apply route |
| `src/services/careers/apply-storage.js` | Signed upload URL, post-upload verification, magic-byte check, delete |
| `src/validation/careers/application-validation.js` | `zod` schema + resume checks (5 MB, magic bytes) |
| `src/app/api/careers/jobs/[slug]/apply/route.js` | Public `POST` |
| `src/app/api/careers/jobs/[slug]/apply/upload-url/route.js` | Phase-A signed upload URL (only if D-C3 A) |
| `src/app/api/hr/candidates/[id]/resume/route.js` | Authenticated resume download (302 to a 60 s signed URL) |
| `src/app/(site)/careers/[slug]/apply/page.jsx` | The form route + `noIndex` metadata |
| `src/components/sections/careers/apply/apply-form.jsx` | Client form (fields, dropzone, states) |
| `src/components/sections/careers/apply/apply-success.jsx` | Success panel |
| `src/components/sections/careers/apply/index.js` | Barrel, matching `sections/<route>/index.js` convention |
| `scripts/backfill-hr-candidates.mjs` | Backfill (`appliedAt`, `source`, `consent*`, **`status` remap + `statusLegacy`**) + recount `applicantCount` |
| `career-plan.md` | This file |

### Changed

| Path | Change |
| :--- | :--- |
| `src/app/(site)/careers/[slug]/job-details-view.jsx` | Delete `getJobApplyMailto`; 3 CTAs → links to `/careers/[slug]/apply` |
| `src/constants/hr-constants.js` | `CANDIDATE_STATUSES` → exactly `Applied / Shortlisted / Rejected / Hired` (D-C2); resume cap → 5 MB |
| `src/validation/hr/candidate-validation.js` | Import the 5 MB cap; add `noticePeriod`, `expectedSalary`, `linkedinUrl`, `portfolioUrl`, `coverNote`, consent + `source` (D-C6) |
| `src/components/hr/shared/hr-badge.jsx` | Replace the `under review` / `interview scheduled` / `offered` branches with `applied` and `hired` |
| `src/components/hr/candidates/candidate-detail-modal.jsx` | Authenticated resume link |
| `src/components/hr/candidates/candidates-table.jsx` | (if needed) surface `Applied` in the filter |
| `src/app/hr/candidates/page.jsx` | `?jobId=` deep link |
| `src/components/hr/jobs/jobs-table.jsx` | Applicants → link |
| `src/app/api/hr/candidates/route.js` | **Add `getHrSession()` to POST** and validate the body (F9) |
| `.env.example` | New server-only vars (§7) |
| `AI_RULE.md`, `project-context.md` | Register the new files/routes; add `/careers` to the documented public-data exception list; record the D2 amendment |

---

## 7. Environment variables

| Variable | Scope | Required | Purpose |
| :--- | :--- | :--- | :--- |
| `FIREBASE_SERVICE_ACCOUNT` | **server-only** | **Yes — required** (D-C1 decided) | Single-line service-account JSON for `firebase-admin` |
| `FIREBASE_STORAGE_BUCKET` | server-only | Yes | Bucket name for admin Storage calls (not `NEXT_PUBLIC_`) |
| `HR_NOTIFICATION_EMAIL` | server-only | Only if email is enabled | Recipient for the "new application" notice; falls back to `HR_EMAIL` in `src/config/site.js`. `new-req.md` requires this not be hardcoded |
| `RESEND_API_KEY` (or chosen provider) | server-only | No — **no provider configured today** | Confirmation + notification email (F8) |
| `NEXT_PUBLIC_SITE_URL` | public | already set | Admin deep link inside the notification email |

`NEXT_PUBLIC_FIREBASE_CONFIG` stays as-is for the admin browser SDK. **Never** add a service-account value to a `NEXT_PUBLIC_*` variable, and never print these.

---

## 8. Migration / backfill

Firestore is schemaless and the repo has no migration runner (F6). Deliverable: `scripts/backfill-hr-candidates.mjs`, modelled on `scripts/seed-hr-firebase.mjs`, run once per environment with `node scripts/backfill-hr-candidates.mjs`:

1. For every `hr_candidates` doc missing them, set `appliedAt` (from `appliedDate`), `source: "legacy"`, `consentGiven: true` (flag: legacy records predate the checkbox — confirm this is acceptable), `consentVersion: "legacy"`.
2. Recompute each `hr_jobs.applicantCount` from the candidate collection when the stored value disagrees, so the admin count stops being invented (F7).
3. Dry-run flag (`--dry-run`) that prints counts only — no PII in output.
4. Idempotent: re-running changes nothing.

---

## 9. Phased implementation

| Phase | Work | Gate |
| :--- | :--- | :--- |
| **0** | Answer D-C1…D-C5. Fix F9 (`POST /api/hr/candidates` auth + validation). Record the D2 amendment. | User sign-off |
| **1** | Constants + validation + backfill script + admin status vocabulary (D-C2). | `npm run lint` |
| **2** | `firebase/admin.js`, storage service, apply service, rate limit. | Unit-checkable in a scratch script |
| **3** | `POST …/apply` (+ `…/upload-url` if D-C3 A), full error matrix. | Manual curl matrix (§10 rows 1–7) |
| **4** | Public apply route + form + success/error states; delete the mailto helper. | Manual §10 rows 1–3, 5–6; keyboard-only pass |
| **5** | Admin: authenticated resume route, `?jobId=` deep link, real count. | Manual §10 row 7; `npm run build` |

Do not start Phase 4 before Phase 3 is green: the form must not exist without a working endpoint, or it becomes another honest-CTA problem like the contact form's mailto handoff.

---

## 10. Manual test checklist (maps to `new-req.md` §4)

| # | Step | Expected |
| :--- | :--- | :--- |
| 1 | Click each of the 3 Apply CTAs on an active job | Navigates to `/careers/<slug>/apply`; **no mail client opens**; job title + department shown |
| 2 | Submit empty | Inline errors on every required field; `aria-invalid`; focus moves to the first invalid field; no request sent |
| 3 | Enter `not-an-email`, `abc` as phone, `javascript:alert(1)` as portfolio | Client errors; then repeat against the API with `curl` and confirm the **server** also rejects all three |
| 4 | Rename `evil.exe` → `evil.pdf` and upload | Rejected by magic-byte check; object deleted from Storage |
| 5 | Upload a 6 MB PDF | Rejected client-side (5 MB) **and** server-side with `INVALID_RESUME` |
| 6 | Submit a valid application | Success panel names the job; candidate doc has `appliedJobId` = the job, `status: "Applied"`, `source: "careers-page"`, `resumeStoragePath`; `hr_jobs.applicantCount` +1 (verify in console, not in logs) |
| 7 | Apply again, same email + same job | `409` / "You've already applied for this role" |
| 8 | Set the job to `Archived` (then `Expired`, then a past `deadline`) and re-post to the API directly | `410 JOB_CLOSED` / "no longer accepting applications" |
| 9 | Open a resume from the HR candidate drawer while logged out | Redirected to `/hr/login`; never a public Storage URL |
| 10 | Open a resume while logged in | File downloads/opens via the 60-second signed URL |
| 11 | Submit 6 applications from one IP within an hour | 6th returns `429` with `Retry-After` |
| 12 | Fill the honeypot via `curl` | Generic `400`, nothing written to Firestore or Storage |
| 13 | Keyboard-only pass on the form (including the dropzone and remove button) | Every control reachable, visible focus, dropzone has an accessible name and a keyboard-activatable file input |
| 14 | Check the response bodies of rows 1–12 | No candidate id, storage path, email, phone, or stack trace in any public response |
| 15 | `grep` the built client bundle for the service-account value | Absent |

---

## 11. Verification commands

```powershell
npm run lint
npm run build
node scripts/backfill-hr-candidates.mjs --dry-run
```

- `npm run build` must still show `/careers` static and `/careers/[slug]` partial prerender (`◐`), plus the new `ƒ /api/careers/jobs/[slug]/apply`.
- No test runner exists (F8), so deliverables cannot include automated tests unless one is added first — say so in the final report rather than implying tests ran.
- No browser or assistive-technology claim may be made unless it is actually performed.

---

## 12. Risks

| # | Risk | Mitigation |
| :--- | :--- | :--- |
| R1 | Service-account key leaks into a client bundle | `import "server-only"` in `firebase/admin.js`; verify the built bundle (test 15) |
| R2 | Firebase rules stay permissive, so direct-to-Storage writes bypass the app | Signed upload URLs are scoped, short-lived, size- and type-conditioned; rules must deny public listing regardless |
| R3 | `request.formData()` buffers the whole body | Body cap before parse + D-C3 A preferred |
| R4 | In-process rate limit is per instance | Documented as a speed bump; a shared store is a follow-up, same as the login limiter |
| R5 | Deterministic candidate id blocks legitimate re-application | Documented; admin can delete the record |
| R6 | `applicantCount` drifts again if a create succeeds and the increment fails | Single transaction (admin SDK) instead of best-effort `try/catch` |
| R7 | Orphaned Storage objects on validation failure | Delete-on-reject in the apply service; a sweep script is a follow-up |
| R8 | New dynamic segment breaks the build under Cache Components | Copy the proven `/careers/[slug]` shell: non-async page, `Navbar` inside `<Suspense>`, content inside `<Suspense fallback>` |
| R9 | Editing `CANDIDATE_STATUSES` breaks the filter's `"ALL"` handling | Only append; verify `candidates-filter-bar.jsx` still renders |

---

## 13. Open questions for the user

1. **D-C1:** approve `firebase-admin` server-side (and the `plan.md` D2 amendment), or prefer the hand-rolled REST option?
2. **D-C3:** is the deployment Vercel serverless (→ two-phase signed upload), or are ≥6 MB request bodies acceptable (→ single multipart route)?
3. **D-C2:** is `Under Review / Interview Scheduled / Offered` kept alongside the requested `Applied / Shortlisted / Rejected / Hired`, or should the pipeline be collapsed to exactly four states?
4. **Notice period / expected salary:** the model has no such fields; add them, or drop them from the form?
5. **D-C5:** must the field be literally named `jobId`, or is `appliedJobId` (as the existing code and filters use) acceptable?
6. **Legacy consent:** may the backfill set `consentGiven: true` for seeded candidates that were never shown a checkbox?
7. **Seeded applicant counts:** reset them to the real candidate count during backfill (recommended), or leave the seeded numbers?

---

## 14. Change log

| Date | Change |
| :--- | :--- |
| 2026-11-06 | Initial audit + plan. No code written. Findings F1–F11, decisions D-C1…D-C5, 5-phase plan, 15-step manual test matrix. |
