# meelTe Website — Database + CMS Restructuring Plan

> **Status:** Draft — not implemented. Phase 0 not started.
> **Created:** 2026-11-03
> **Owner:** website-coordinator
> **Scope:** restructure `nextjs-website` so the public marketing site, a new authenticated admin CMS, and the meelTe data platform (Supabase + Firebase) can coexist and scale.
>
> **Read with:** `AI_RULE.md`, `project-context.md`, `meelTe-context.md`, `docs/target_customer.md`, `docs/Design.md`.
> **This plan does not override those documents.** It records the changes they require, so all five stay consistent.

---

## 1. Why this plan exists

The website is currently a **static marketing site with no backend of its own** (`AI_RULE.md` §2.1). The business now needs:

1. a **database** for content managed by editors, and
2. an **admin CMS** to manage that content,

across a platform that already uses **both Supabase and Firebase**.

Restructuring **before** adding persistence is the correct sequencing — once CMS routes and SDK imports spread through the tree, reorganising it costs far more. But the restructure must also amend the rules that currently forbid this work, or the next contributor (human or AI) will read `AI_RULE.md` §2.1 and reverse it.

---

## 2. Verified current state

All facts below were verified against the working tree on 2026-11-03, not inferred.

| Fact | Evidence |
| :--- | :--- |
| No database, ORM, or auth dependency installed | `package.json` — no `firebase`, `firebase-admin`, `@supabase/supabase-js`, `drizzle-orm`, or auth package |
| No Firebase/Supabase config files | `firebase.json`, `.firebaserc`, `firestore.rules`, `firestore.indexes.json`, `storage.rules` — all absent |
| Zero Firebase references in source | grep across `src/`, `scripts/`, `docs/` — no matches |
| JavaScript only, no TypeScript | `jsconfig.json` → `checkJs: false`; all 69 source files are `.js`/`.jsx` |
| Tailwind v4, CSS-first tokens | no `tailwind.config.js`, no `postcss.config.js` |
| Next 16 caching features enabled | `next.config.mjs` → `cacheComponents: true`, `partialPrefetching: true`, `reactCompiler: true` |
| 12 static public URLs + 2 dynamic detail routes | `src/app/(site)/{page,about,ads,careers,contact,faq,for-merchants,how-it-works,privacy,signup,support,terms}`; `ads/[id]` and `events/[id]` render on request. `discover` was deleted — see the change log. |
| 48 section files live in `src/components/sections/<route>/`, each folder with an `index.js` | about (8), ads (4), careers (7), common (1), contact (5), events (1), for-merchants (2), home (9), how-it-works (5), signup (6). Relocated from `src/app/**/_components/` in Phase 1a; no `_components/` folders remain |
| Zero custom React hooks exist | grep for `export (function\|const) use[A-Z]` → no matches |
| ~~`src/components/footer/` duplicates a domain owned by `src/components/layout/footer.jsx`~~ | **Resolved in Phase 1a** — the three files now live flat in `src/components/layout/` |
| ~~`discover` domain split across two trees~~ | **Superseded** — the split was resolved in Phase 1a, then the `/discover` route and its section folder were deleted outright. Its role is now covered by the `/ads` listing. |

### Env / integration state

`.env.example` currently declares **names only**:

```
NEXT_PUBLIC_SITE_URL
MEELTE_SUPABASE_ANON_KEY
NEXT_PUBLIC_GA_ID
NEXT_PUBLIC_GTM_ID
NEXT_PUBLIC_BING_SITE_VERIFICATION
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
```

Three defects found while auditing (fix in Phase 0):

| # | Defect | Evidence |
| :-- | :--- | :--- |
| E1 | `NEXT_PUBLIC_meelTe_API_BASE_URL` is read but **absent from `.env.example`**, so a fresh clone leaves the newsletter form permanently `NOT_CONFIGURED` | read at `src/config/site.js:19` and `src/services/api_constants.js:3`; thrown at `src/services/newsletter.js:34-38` |
| E1b | **`.env.example` is not in the repository at all.** `.gitignore:34` uses `.env*`, which also matches `.env.example`, so no developer ever receives the env contract. The existing comment ("can opt-in for committing if needed") implies this was unintended. | `git check-ignore -v .env.example` → `.gitignore:34:.env*`; `git ls-files` → not tracked |
| E2 | ~~`MEELTE_SUPABASE_ANON_KEY` is declared but **nothing in `src/` reads it**~~ | **Resolved** — `src/services/supabase-services/shared/config.js` reads it, so the variable is load-bearing. Do not remove it from `.env.example`. |
| E3 | `API_BASE_URL` is declared **twice** (duplicate constant) | `src/config/site.js:19` and `src/services/api_constants.js:3` |

E1b means E1 cannot be fixed by editing the file alone. **Resolved in Phase 0** by adding a `!.env.example` negation to `.gitignore`. The file must then be **committed by a human** — an agent should not stage or commit on its own.

---

## 3. Blocking documentation conflicts

These must be resolved in Phase 0. Per `AGENTS.md`, a conflict is never resolved silently.

### C1 — The repo documents one backend; the product runs on another

| Document | Line | Says |
| :--- | :--- | :--- |
| `AI_RULE.md` | 78 | backend is *"meelTe's dedicated external backend / **Firebase**"* |
| `project-context.md` | 18 | *"dedicated external backend (**Firebase** / Cloud APIs)"* |
| `docs/target_customer.md` | 3 | the app is audited from *"**Supabase** migrations and edge functions (`supabase/`)"* |
| `meelte-context.md` | 93 | *"audits the Flutter app, **Supabase** migrations and edge functions"* |
| `project-context.md` | 54 | same Supabase wording, repeated |
| `.env.example` | — | declares `MEELTE_SUPABASE_ANON_KEY` |

**Resolution required:** one responsibility matrix (§4.2) naming exactly one owner per data type, then rewrite all six documents to match it. "Both" is a valid answer — but only with the boundary written down. A backend named inconsistently across six files is how two sources of truth get created.

### C2 — `AI_RULE.md` §2.1 forbids the work this plan describes

`§2.1` currently states: *"Never create local databases, ORM models (Prisma, Drizzle, etc.), or internal API route handlers (`app/api/**`)."*

This plan needs server-side data access. The amendment should be **narrow**, not a blanket repeal:

- **Keep** the prohibition on local databases and ORM models. Neither Supabase nor Firebase is local, so both are compliant as written.
- **Keep** the prohibition on `app/api/**` wherever a Server Action will do. In Next 16, `cookies()` is writable inside Server Actions, so Firebase's session-cookie exchange can be a Server Action — **no route handler required**.
- **Add** an explicit allowance for server-only SDK usage (`firebase-admin`, Supabase service-role client) inside `src/services/` and `src/actions/`, gated by the `server-only` import.
- **Add** the admin CMS as in-scope navigation (`(admin)` route group), which §2.3's "no web app status" clause does not cover — the CMS is an internal tool, not a customer-facing web app, so the "web app is coming soon" guardrail still holds for visitors.

### C3 — §2.7 mandates breadcrumbs on every route under `src/app/**`

Admin pages are not marketing pages. Either they get breadcrumbs, or §2.7 needs a written carve-out for `(admin)`. Silently exempting them would break a currently-unqualified rule.

### C5 — The docs disagree on whether to mention web app status

`meelTe-context.md` §1 states *"The web app is **coming soon**"* and §4 asks to *"Make the mobile-app availability and web-app-coming-soon status unambiguous."*

`AI_RULE.md` §2.3 says the opposite: *"Do **NOT** state or mention 'web app is in development', 'web app is coming soon', or apologize for browser availability."*

Both cannot hold. `AI_RULE.md` §2.3 is the more specific, later instruction and the code follows it, so the current build is compliant with §2.3 and violates `meelTe-context.md` §4. **Resolution required in Phase 0 follow-up:** rewrite `meelTe-context.md` §1 and §4 to match §2.3, and confirm that is the intended messaging position. This is a business messaging decision, not a technical one.

### C4 — §12.9 "JS/JSX only unless a later decision explicitly broadens the architecture"

If any part of the new work is TypeScript, §12.9 must be amended explicitly. If not, use `*.mjs` for tool config so the codebase stays JS. **Decision D5.**

---

## 4. Target architecture

### 4.1 Shape

```
                    ┌─────────────────────────────┐
   public visitor → │  (site) — static, SEO, no   │
                    │  SDK in the client bundle   │
                    └─────────────────────────────┘
                    ┌─────────────────────────────┐
      editor/admin →│  (admin) — session-guarded  │
                    │  CMS, server-rendered       │
                    └──────────────┬──────────────┘
                                   │ Server Actions only
                    ┌──────────────▼──────────────┐
                    │  src/actions/  (mutations)  │
                    │  src/services/ (data access)│
                    └──────────────┬──────────────┘
                                   │ server-only fetch
                    ┌──────────────▼──────────────┐
                    │  Supabase  │  Firebase      │
                    │  PostgREST │  REST endpoints│
                    └─────────────────────────────┘
```

**Invariant:** components never import a database SDK. `app → actions/services → SDK`. Components render props.

### 4.2 Responsibility matrix — **DECIDED (D1, 2026-11-03)**

One owner per data type, so no record is authoritative in two places. All CMS code is written by hand in this repo; neither service is reached through an SDK.

| Concern | Owner | Rationale |
| :--- | :--- | :--- |
| Admin/CMS identity | **Firebase Auth** (hand-rolled REST, D7) | Keeps website admins separate from the consumer identities already in Supabase Auth. No migration of existing app users. |
| Persistent content + relational data | **Supabase Postgres** | CMS needs filtered, sorted, paginated, joined lists with counts. Postgres does this natively; Firestore needs fan-out reads and composite indexes per query shape. |
| Media/uploads | **Firebase Storage** | Decouples marketing assets from app storage rules. |
| Push notifications | **Firebase (FCM)** | Already the platform's channel. |
| Marketing/static copy | repo constants (`src/constants/`) | Not editable content — do not put it in a CMS. |

**Alternative considered (D1-B):** Firestore as the CMS datastore, Supabase for the app only. Defensible if marketing content must be fully decoupled from the app database — but it means two datastores with two query models and two backup/export paths. If chosen, record *why* in `AI_RULE.md` so the boundary is not re-litigated later.

### 4.3 Target repo structure

```
.
├── firebase.json                       # rules + emulator config (not hosting)
├── .firebaserc
├── firestore.rules                     # only if Firestore is used (D1)
├── firestore.indexes.json              # composite indexes — runtime-critical
├── storage.rules
├── scripts/
│   ├── generate-og-image.mjs           # existing
│   └── seed-content.mjs                # new — content seeding
├── src/
│   ├── app/
│   │   ├── (site)/                     # public — prerendered, zero SDK imports
│   │   │   ├── layout.jsx              # navbar/footer shell
│   │   │   ├── page.jsx                # /
│   │   │   ├── (marketing)/            # about, how-it-works, for-merchants,
│   │   │   │                           # discover, faq, careers, signup, support
│   │   │   └── (legal)/                # privacy, terms
│   │   ├── (admin)/
│   │   │   ├── layout.jsx              # session guard (redirects unauthenticated)
│   │   │   └── admin/
│   │   │       ├── page.jsx            # dashboard
│   │   │       └── <collection>/       # list + [id] edit, per collection
│   │   ├── layout.js                   # root: fonts, Toaster, viewport (unchanged)
│   │   ├── globals.css  robots.js  sitemap.js  not-found.jsx
│   │   └── api/                        # EMPTY unless D2 proves a handler is unavoidable
│   ├── actions/                        # "use server" — all mutations + auth session
│   ├── components/
│   │   ├── ui/                         # primitives (unchanged)
│   │   ├── layout/                     # navbar, footer, breadcrumbs, container,
│   │   │                               # mobile-nav + footer/* folded in (Phase 1)
│   │   ├── sections/                   # one folder per page + shared home/, common/
│   │   │                               # each with an index.js barrel (Phase 1a)
│   │   └── admin/                      # CMS-only: data table, editor, media picker
│   ├── services/                       # the ONLY layer that reads/writes data
│   │   ├── supabase-services/          # PostgREST calls (D2: REST URL, no SDK)
│   │   │   ├── shared/                 #   constants, errors, config, request, pagination
│   │   │   ├── normalizers/            #   row → render model
│   │   │   ├── ads/                    #   get-all-ads, get-ads-by-id
│   │   │   └── events/                 #   get-all-events, get-events-by-id
│   │   └── firebase/                   # hand-rolled Firebase REST calls, no Admin SDK
│   ├── validation/                     # zod schemas — the real schema (no DB constraints)
│   ├── lib/  auth/  seo/  mail/  icons/  utils.js
│   ├── hooks/                          # create only when a hook actually exists
│   └── config/site.js    constants/
```

**Removed from consideration** (were proposed earlier, now dropped): `drizzle/`, `drizzle.config.mjs`, `src/db/`, `src/api/` as an action layer.

Route groups do not appear in URLs, so moving all 12 routes into `(site)/` **preserves every existing URL**. No redirects, no sitemap churn.

### 4.4 Architectural rules to write into `AI_RULE.md`

1. **Layering.** `app → actions/services → REST`. Components never call `fetch` against a platform URL directly; every datastore call lives in `src/services/`.
2. **Public routes stay SDK-free.** Nothing under `(site)` may import either SDK, so the marketing bundle is unchanged. Enforce with a lint rule or review check.
3. **Server-only secrets.** `src/services/supabase-services/shared/config.js` is the only module that reads a platform key, and it imports `server-only` so a client import becomes a build error, not a leak.
4. **`src/validation/` is load-bearing.** Firestore enforces no schema and Postgres constraints cannot see intent — every write boundary validates with zod before it reaches `services/`.
5. **Authz in code, not just rules.** `firebase-admin` bypasses `firestore.rules`, and the Supabase service-role key bypasses RLS. If either is used server-side, authorization must be enforced in the action, not assumed from rules.
6. **Determinism preserved.** `sitemap.js` keeps static routes on a fixed release date; CMS slugs use real `modifiedDate`. No `new Date()` in prerendered output (§2.6).

---

## 5. Phased plan

Each phase must leave `npm run build` green before the next begins. `npm` only — never `pnpm` or `yarn`.

### Phase 0 — Documentation and rules — **DONE (2026-11-03)**

Completed: `AI_RULE.md` §2.1 amended (narrow), §2.2 stale secondary hex corrected to `#4B5563`, §2.3 CMS-internal bullet added, §2.7 admin breadcrumb rule added; `project-context.md` §1/§6.1/§8/§10/§12 updated; `.env.example` gained the missing `NEXT_PUBLIC_meelTe_API_BASE_URL`; the §2.1 citation in `src/services/newsletter.js` updated; `folder-structure.md` regenerated from the real tree.

Deliberately **not** done:
- `psychology.md` was **not** deleted. It belongs to the United Rubber Cork project and deleting another project's document is destructive. It should be moved to its own repository.
- The Supabase/Firebase ownership boundary was **not** written, because that is decision D1. Both services are now named accurately and the boundary is referenced, not invented.

| Task | File |
| :--- | :--- |
| Amend §2.1 as described in C2 | `AI_RULE.md` |
| Amend §2.7 for `(admin)` breadcrumbs (C3) | `AI_RULE.md` |
| Resolve §12.9 TS question per D5 | `AI_RULE.md` |
| Rewrite the backend description to match the D1 matrix | `AI_RULE.md` §2.1, `project-context.md` §1/§6/§12, `meelTe-context.md` §5 |
| Replace stale env var, fix E1–E3 | `.env.example` |
| Update the `AI_RULE.md §2.1` citation comment | `src/services/newsletter.js:2-3` |
| Delete the stray file from the other project | `psychology.md` |
| Regenerate the structure doc from the real tree | `folder-structure.md` |
| Update §8 Directory Map and §4 Component Registry | `project-context.md`, `AI_RULE.md` |

**Exit criteria:** no document contradicts another about the backend; `npm run build` unchanged and green.
**Risk:** none — documentation only.

### Phase 1 — Structural move, no behaviour change

Split into two steps, because a pure move and a shell extraction carry different risk.

**1a — pure move (URL-safe, no DOM change) — DONE 2026-11-03**
- Created `src/app/(site)/` and moved all 12 route entries (11 folders + the homepage `page.js`) into it. Route groups do not appear in URLs.
- Folded `src/components/footer/*` into `src/components/layout/` — 3 files, 4 import statements across 3 files.
- Resolved the `discover` split: `discover-areas.jsx` is now route-owned in `components/sections/discover/`.
- Barrel files: every `components/sections/<route>/` folder now has an `index.js`, matching the pre-existing `sections/home` and `sections/common` convention.
- **Beyond the original scope, at the user's direction:** every route's `_components/` folder was dissolved and its files moved into `src/components/sections/<route>/`. 29 further files were relocated across the 7 routes; with `discover-areas` from 1a, those folders now hold 30 section files. Each route folder under `(site)/` contains only `page.jsx`.

**Verified:** 45 + 30 relocated files are byte-identical to their git origin (checked with `git hash-object` against the source blob, line-ending filter aware). The only content edits are the import specifiers plus `about/page.jsx`'s doc comment. `npx eslint .` exits 0. `npm run build` compiles and prerenders all 19 entries, with the same 12 public URLs.

**1b — shared shell extraction (deferred until 1a is verified)**
- Every page currently renders its own `Navbar`, `Footer`, skip link, and page wrapper (`src/app/(site)/page.js:27-44`, `src/app/(site)/about/page.jsx:2-3`, and all other routes). Moving that into `(site)/layout.jsx` changes DOM nesting around landmarks and the skip-link target, so it requires an accessibility review of heading order, `main` landmarks, and focus behaviour.
- Do not bundle this with 1a: if the shell changes, a visual regression can no longer be attributed to the move.

**Exit criteria (1a):** all 12 URLs render identically; `sitemap.js` output byte-identical; `npm run build` green.
**Risk:** low for 1a; medium for 1b.

### Phase 2 — SDK foundations, no UI

- **No SDK install.** Per **D2**, do not add `@supabase/supabase-js`, `firebase`, or `firebase-admin`. The shared `fetch` wrapper (timeouts, retries, error mapping) already exists at `src/utils/fetch-json.js`.
- `src/services/supabase-services/` (PostgREST) and `src/services/firebase/` (hand-rolled REST), both server-only. The read-only public client (`shared/`, `normalizers/`, `ads/`, `events/`) **already exists** — the CMS client lands beside it and reuses `shared/`.
- `firebase.json`, `.firebaserc`, `firestore.indexes.json`, `storage.rules`, `firestore.rules` per D1.
- Firebase **emulator suite** for local dev so no cloud credentials are needed to develop.
- `src/validation/` schemas for each CMS collection.

**Exit criteria:** a throwaway server-only read succeeds against the emulator; `npm run build` passes **with no credentials present** (proves lazy init).
**Risk:** low–medium.

### Phase 3 — Auth and admin shell

- Firebase Auth sign-in **by hand** (**D7**): a Server Action posts to Identity Toolkit REST (`accounts:signInWithPassword`) and sets its own httpOnly cookie. There is no `createSessionCookie` without the Admin SDK, so **do not call it**.
- `(admin)/layout.jsx` verifies the cookie's ID token against Google's public JWKS (**R11**) and redirects on failure. Refresh via `securetoken.googleapis.com/v1/token`.
- Authorization model: admin allowlist or custom claims, enforced server-side per D4.
- Accessibility pass on sign-in and shell.

**Exit criteria:** anonymous request to `/admin` redirects; signed-in non-admin is denied server-side, not merely hidden in UI.
**Risk:** medium. Requires review by `security-engineer` (authz, secret handling) and `accessibility-engineer` (forms, focus, errors).

### Phase 4 — First CRUD vertical, end to end

Pick the **simplest** collection first (leads/inquiries — flat, write-heavy, no relations) before anything with joins or media.

- List view (paginated, searchable, empty/loading/error states), create, edit, delete.
- zod validation shared between client and server.
- Immediate revalidation so public pages reflect edits.

**Exit criteria:** create → edit → delete → public page reflects the change; all states exercised.
**Risk:** medium. This is the phase that proves the architecture; do not start collection #2 until it is clean.

### Phase 5 — Public content from the datastore

- Move blog/content routes from static to datastore-backed with an explicit caching strategy (see R1).
- `sitemap.js` gains datastore slugs with real `lastmod`; static routes keep their fixed date.
- JSON-LD for new content types must match rendered content (§12.6).

**Exit criteria:** content edits revalidate the public page; `npm run build` does not require a live datastore.
**Risk:** medium — this is where SEO regressions would appear.

---

## 6. Blocking decisions

| ID | Decision | Blocks | Recommendation |
| :--- | :--- | :--- | :--- |
| **D1** | **WORKING DECISION 2026-11-03.** Supabase (PostgREST) owns persistent content/data. Firebase owns CMS identity, plus Storage/push. All CMS code is written by hand in this repo. One sub-question stays open: whether CMS *content* records live in Supabase tables or in Firestore. | Phases 2–5 | Supabase tables for all queryable content; Firestore only if the business needs document-shaped, offline-capable data. Relational CMS lists (filter/sort/count/paginate) are markedly cheaper in PostgREST |
| **D2** | **DECIDED 2026-11-03 — REST over SDK.** Call the Supabase PostgREST URL directly and hand-roll the Firebase REST calls; install neither `@supabase/supabase-js` nor `firebase-admin`. Consequence: everything is `fetch`-based, so Next caching works and the client bundle gains no SDK weight. Open sub-question: who issues the CMS session (see **D7**). | Phases 2–3 | Server-side `fetch` only, through `src/utils/fetch-json.js` |
| **D3** | What does the existing `NEXT_PUBLIC_meelTe_API_BASE_URL` backend become? Retired, kept for `/newsletter` + `/inquiries`, or migrated into the CMS? | Phases 2 & 4 | Migrate `/newsletter` and `/inquiries` into the CMS, then retire the base URL — one source of truth |
| **D4** | Admin authorization model: email allowlist, custom claims, or a role collection/table? | Phase 3 | Custom claims for roles + allowlist for the first admin |
| **D5** | TypeScript or stay JS? | Phase 2 (file extensions) | Stay JS; use `*.mjs` for tool config, honouring §12.9 |
| **D6** | Which collections does the CMS manage at launch? | Phase 2 (schema) | One collection at launch (leads/inquiries), add the rest after Phase 4 proves the pattern |
| **D7** | **DECIDED 2026-11-03 — Firebase Auth, hand-rolled.** No Admin SDK, so `createSessionCookie` is unavailable; instead the sign-in Server Action calls Identity Toolkit REST, stores its own httpOnly cookie, and every guarded request verifies the ID token against Google's public JWKS. See **R11** for the verification requirements. | Phase 3 | Server Action sign-in → `identitytoolkit.googleapis.com/v1/accounts:signInWithPassword` → httpOnly cookie → JWKS-verified on each request → refresh via `securetoken.googleapis.com/v1/token` |

D1, D2, and D6 block Phase 2. D3 blocks Phase 4. Nothing blocks Phase 0 or 1.

---

## 7. Risks and gotchas

| ID | Risk | Mitigation |
| :--- | :--- | :--- |
| **R1** | **`cacheComponents: true` + non-`fetch` datastores.** Firestore and the Supabase JS client are not `fetch`-based, so Next's fetch cache and tags do not apply. Caching must be explicit (`'use cache'` / `revalidate`), or edits will not appear predictably. **Partly resolved by D2:** PostgREST and the Firebase REST endpoints *are* `fetch`-based, so `fetch(url, { next: { revalidate, tags } })` works normally. Firestore-over-REST calls still need an explicit strategy. | Decide the caching strategy in Phase 2, before any public datastore-backed page exists. |
| **R2** | **Two SDKs in one client bundle.** Shipping `firebase` + `@supabase/supabase-js` on marketing pages would meaningfully hurt Core Web Vitals. **Resolved by D2:** no SDK is installed, so there is no bundle cost to contain. | Rule 4.4.2 still applies — no data fetching from `(site)` components. |
| **R3** | **Admin SDK initialised at module scope.** If a static route transitively imports it, `npm run build` fails on a machine without credentials. | Lazy singleton; Phase 2 exit criterion builds with no credentials. |
| **R4** | **Rules are not authz when using elevated credentials.** `firebase-admin` bypasses `firestore.rules`; the Supabase service-role key bypasses RLS. A permissive rule set gives false confidence. | Rule 4.4.5: authorize in the action; treat rules as defence-in-depth only. |
| **R5** | **Missing composite indexes fail at runtime, not build.** A query that works in dev can 500 in production. | Maintain `firestore.indexes.json` in the same PR as any new query shape; test against the emulator. |
| **R6** | **No schema enforcement.** Nothing stops malformed documents. | zod at every write boundary; `src/validation/` is the de facto schema. |
| **R7** | **Secret surface doubles.** Two service credentials, both capable of full access. | `server-only` imports; never log credentials; never prefix a secret with `NEXT_PUBLIC_`. |
| **R8** | **Scope creep into a full web app.** The CMS is internal. `meelTe-context.md` §1 forbids implying a customer-facing web app. | Register the CMS as internal-only in `AI_RULE.md` §2.3. |
| **R9** | **Hand-rolled Firebase has no session-cookie REST endpoint.** `createSessionCookie` exists only in the Admin SDK. If Firebase is chosen as the CMS identity provider without the SDK, httpOnly sessions are not obtainable through supported public APIs. | Settle **D7** before Phase 3. Prefer Supabase Auth (GoTrue) or JWKS-based ID-token verification. |
| **R10** | **Hand-rolled REST is code you must own.** Service-account JWT signing, OAuth2 token refresh, pagination, retry/backoff, rate-limit handling (429) and error mapping all become ours to write and test, with no types or SDK guards. | Keep every call inside `src/utils/fetch-json.js` + one thin client per service so the surface stays auditable. Budget explicit time for it in Phase 2; do not spread raw `fetch` calls through pages. |
| **R11** | **Hand-rolled ID-token verification is a security boundary.** Without the Admin SDK there is no `verifyIdToken` to lean on, so a hand-written verifier is the only thing standing between a forged cookie and the CMS. | Enforce all of: **RS256 only** (reject `none` and HS256 — otherwise algorithm confusion is trivial); select the key by `kid` from `googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com` with cached rotation; check `iss === https://securetoken.google.com/<projectId>`, `aud === <projectId>`, `exp`, `iat` with small skew, and non-empty `sub`. Cookie must be `httpOnly; Secure; SameSite=Lax; Path=/`, short-lived, never readable by JS, and the refresh token must live there too — never in `localStorage`. Review with `security-engineer` before Phase 4. |

---

## 8. Verification checklist

Run at the end of every phase:

- `npm run lint`
- `npm run build` — must pass **without** datastore credentials present
- All 12 public URLs resolve, unchanged
- `sitemap.js` and `robots.js` output valid and deterministic (no runtime clock)
- Breadcrumbs present on every route under `src/app/**`, or an explicit documented exemption
- No `NEXT_PUBLIC_` variable holds a secret
- No file under `(site)` imports `src/services/` or calls a platform REST URL directly
- Keyboard-only pass on every new admin control; `prefers-reduced-motion` honoured
- **Phase 3 onward:** a forged, expired, or `alg: none` cookie is rejected; the session cookie is `httpOnly`, `Secure`, `SameSite=Lax`; no token is reachable from JS or `localStorage`

**Not verified by this plan:** no browser, screen-reader, or assistive-technology testing has been performed. No build has been run for this restructuring, because no code has changed yet.

---

## 9. Out of scope

- Redesigning existing public pages or changing any copy.
- Changing the design token system in `src/app/globals.css`.
- Customer-facing authentication or any "web app" functionality — the site stays a marketing layer with an internal CMS.
- Migrating the Flutter app's data model, or modifying the `meelTe_user` repository.
- Payments or event ticketing — the product settles offline (per `docs/target_customer.md` §1).

---

## 10. Change log

| Date | Change |
| :--- | :--- |
| 2026-11-03 | Initial draft. Audited current state; recorded conflicts C1–C4, decisions D1–D6, risks R1–R8. No code changed. |
| 2026-11-03 | Phase 0 executed (docs, rules, env hygiene). Added conflict **C5** (web app status wording) found during the sweep. `psychology.md` intentionally retained. Phase 1 split into 1a (pure route-group move) and 1b (shared shell extraction, needs accessibility review). |
| 2026-11-03 | Found **E1b**: `.env.example` was not tracked at all (`.gitignore` `.env*`). Added a `!.env.example` negation; the file must be committed by a human. `npm run lint` passed. `npm run build` **could not be run** — a `next dev` server holds `.next`, so Phase 1a is queued pending a dev-server stop. |
| 2026-11-03 | **D2 decided by the user: REST over SDK.** Supabase PostgREST URL + hand-rolled Firebase REST; no `@supabase/supabase-js`, no `firebase-admin`. Effects: R1 and R2 largely resolved (everything is `fetch`-based, no SDK in the bundle); new **R9** (no REST equivalent of `createSessionCookie`) and **R10** (hand-rolled client is code we own); new **D7** (CMS session issuer) now blocks Phase 3. Structure updated: `src/services/{http,supabase,firebase}/` replaces `src/{firebase,supabase}/`. |
| 2026-11-03 | **D1 and D7 recorded.** D1: Supabase PostgREST owns content/data, Firebase owns CMS identity + Storage/push, CMS code hand-written in-repo. D7: Firebase Auth hand-rolled — Server Action + Identity Toolkit REST + own httpOnly cookie + JWKS verification (no `createSessionCookie`). New **R11** pins the verifier requirements (RS256-only, `kid` selection, `iss`/`aud`/`exp`, cookie flags). Phase 3 tasks and the verification checklist updated. |
| 2026-11-03 | **Phase 1a executed.** 12 route entries moved into `src/app/(site)/`; `components/footer/` folded into `components/layout/`; `discover` split resolved. Then, at the user's direction, all seven `_components/` folders were dissolved into `src/components/sections/<route>/` with `index.js` barrels (29 further files). Verified: every relocated file is byte-identical to its git origin, `npx eslint .` exit 0, `npm run build` green with all 19 entries prerendered and the same 12 public URLs. Docs reconciled: `AI_RULE.md` §2.7/§4, `project-context.md` §6.3/§8, `folder-structure.md`. |
| 2026-11-03 | **Read-only PostgREST client split into `src/services/supabase-services/`.** The single `src/services/meelte-web-api.js` became `shared/` (constants, errors, config, request, pagination), `normalizers/` (primitives + ad/event mappers), and one folder per resource (`ads/`, `events/`) with one exported operation per file. The shared fetch wrapper moved to `src/utils/fetch-json.js`. Call sites (`/ad/[id]`, `/event/[id]`, `sitemap.js`) now import the resource modules directly. Behaviour unchanged: same RPCs, same 900/1800/3600-second revalidate windows, same cache tags. **E2 corrected** — `MEELTE_SUPABASE_ANON_KEY` is read by `shared/config.js` and must not be removed. Verified: `npx eslint .` exit 0, `npm run build` green with all 20 entries generated and the same 12 public URLs. |
| 2026-11-03 | **Shared-link routes renamed to the plural form, at the user's direction.** `src/app/(site)/ad/[id]/` → `src/app/(site)/ads/[id]/` and `src/app/(site)/event/[id]/` → `src/app/(site)/events/[id]/`; the matching `src/components/sections/{ad,event}/` folders became `sections/{ads,events}/`. Canonical URLs are now `/ads/{id}` and `/events/{id}` in the pages' `routePath()`, `sitemap.js`, and `getPublicAdJsonLd` / `getPublicEventJsonLd`. **No redirects were added** for the old paths — these detail routes are new and still in development, so there are no in-the-wild `/ad/{id}` or `/event/{id}` links to preserve. This departs from the Web API spec line that says to keep the singular paths; revisit only if those URLs are ever published or shared. |
| 2026-11-03 | **`/ads` listing page added; `/discover` confirmed deleted.** New `src/app/(site)/ads/page.jsx` renders live offers from `listPublicAds()` as a 1/2/3-column responsive grid of `AdCard`s, with `CollectionPage` + `BreadcrumbList` JSON-LD emitted only when offers are actually rendered, and explicit empty / temporarily-unavailable states so a missing API key degrades to copy rather than a 500. The page is static with a 15-minute revalidate and is listed in `sitemap.js`. Supporting files: `sections/ads/{ads-listing,ad-card,ad-formatters}`; `ad-formatters.js` now owns `formatPrice` / `getDiscountLabel` / `formatDate`, which `AdDetail` imports instead of duplicating. **`AI_RULE.md` §2.1 amended** — `/ads` joins the two detail routes as a sanctioned live-data exception. `next/image` uses `unoptimized` without a custom `loader`, because a function prop cannot cross the server/client boundary during static prerender. Also removed the stale `/discover` entries from `project-context.md` and `AI_RULE.md`. Verified: `npm run lint` exit 0, `npm run build` green with 21 entries and `/ads` prerendered. |
| 2026-11-03 | **`/ads` paginated: 20 per page with a "load more" Server Action.** `LISTING_PAGE_SIZE = 20` added to `supabase-services/shared/constants.js`. `DEFAULT_PAGE_SIZE` deliberately stays at 50 because `allPages()` in `shared/pagination.js` stops when a page is shorter than that value — lowering it would have silently truncated the sitemap to a single page. New `src/actions/ads/load-more-ads.js` (`loadMoreAds`) is the append path; `app/api/**` is still forbidden, so a Server Action is the sanctioned transport. It validates the cursor with `src/validation/ads/ads-cursor-validation.js`, returns a discriminated `{ ok }` result rather than throwing (Next.js masks thrown errors in production), and keeps the anon key server-side. The page derives the cursor from the last **raw** row, including offers that have already ended, because the upstream list is ordered by `created_at` — using the last visible row would re-fetch or skip rows. `AdsListing` became a client component that owns the grid, the appended pages and the button; the initial 20 are still server-rendered, verified at 20 offer links in `.next/server/app/ads.html`. Accessibility: `aria-busy` on the grid, `aria-disabled` during load (not `disabled`, which would drop focus), a polite `role="status"` announcing the count, an inline `role="alert"` retry on failure, and focus moved to the end-of-list message when the button unmounts. Verified: `npm run lint` exit 0, `npm run build` green, `CollectionPage.numberOfItems` = 20 matching the rendered rows. |
