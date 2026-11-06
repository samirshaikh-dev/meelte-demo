# AI Rules & Engineering Directives — meelTe Next.js Website

> **Repository:** `nextjs-website`  
> **Brand:** meelTe (Hyper-local Community Platform)  
> **Stack:** Next.js 16 (App Router), React 19, Tailwind CSS v4, npm  
> **Companion Directives:** [`project-context.md`](./project-context.md), [`AGENTS.md`](./AGENTS.md), [`docs/target_customer.md`](./docs/target_customer.md), [`docs/Design.md`](./docs/Design.md)

---

## 1. The Golden Directive: Mandatory Context & Skills Protocol

### 1.1 Mandatory Context Reading (Before Skills)

> [!CAUTION]
> ### STRICT ENFORCEMENT: ZERO IMPLEMENTATION WITHOUT READING THE PROJECT CONTEXT DOCUMENTS
> Before proposing any changes, writing a single line of code, creating new files, or editing existing files, the AI **MUST ALWAYS read all four documents below in full**. No exceptions, no partial reads, no relying on memory from an earlier session.

| # | Document | Why it is mandatory |
| :--- | :--- | :--- |
| 1 | [`docs/target_customer.md`](./docs/target_customer.md) | The evidence base for every audience claim: P1/P2/S1/S2/S3 segments, personas, pain points, product facts, and the open questions the code cannot answer. |
| 2 | [`project-context.md`](./project-context.md) | The current implementation: routes, component registry, architecture boundaries, tech stack, environment setup, known issues, and active next steps. |
| 3 | [`meelTe-context.md`](./meelTe-context.md) | The intent behind the build: product/business goals, messaging direction, design direction, and the do/do-not guardrails. |
| 4 | [`docs/Design.md`](./docs/Design.md) | The design contract: the 24 color tokens in `src/app/globals.css` with their values and usage counts, typography, shadows and radii, measured WCAG contrast ratios, and the documented inconsistencies. Mandatory before any color, spacing, or component-styling change. |

**Required step:** read all four, then state which parts of the requested change they govern, before reading skills or touching code.

**Conflict rule:** if these documents disagree with each other or with the code, surface the conflict explicitly and resolve it deliberately. Never silently pick one, and never let "the website says it" override what the product actually does.

### 1.2 Mandatory Skills Protocol

> [!CAUTION]
> ### STRICT ENFORCEMENT: ZERO IMPLEMENTATION WITHOUT READING SKILLS
> Before proposing any changes, writing a single line of code, creating new files, or editing existing files, the AI **MUST ALWAYS load and read the applicable skill file(s) from `.agents/skills/` using `view_file`**.

### Skill & Agent Locations
- **Skills:** `.agents/skills/<skill-id>/SKILL.md` — 16 discipline skills (note the leading dot). OpenCode also discovers this path automatically.
- **OpenCode agents:** `.opencode/agents/<agent-id>.md` — V2 frontmatter (`description`, `mode`, `permissions`); the ID comes from the filename.
- **GitHub Copilot agents:** `.github/agents/<agent-id>.agent.md` — same six roles, keep in sync with the OpenCode copies.

### Primary Discipline Routing:
- **UI & Visual Design:** [`.agents/skills/ui-ux-engineer/SKILL.md`](./.agents/skills/ui-ux-engineer/SKILL.md) — Layout, color tokens, typography, bento grids, responsive aesthetics.
- **Frontend & Components:** [`.agents/skills/frontend-engineer/SKILL.md`](./.agents/skills/frontend-engineer/SKILL.md) — Next.js 16 App Router, React 19, Server vs. Client boundaries, zero CLS, interactive forms.
- **Accessible Animation & Motion Tiering:** [`.agents/skills/accessible-animation/SKILL.md`](./.agents/skills/accessible-animation/SKILL.md) — WCAG 2.3.3 / C39, `prefers-reduced-motion` tiering (Tier 1 vestibular removal, Tier 2 soften/fade, Tier 3 keep feedback).
- **AI Output Judgement & Quality Review:** [`.agents/skills/ai-output-judgement/SKILL.md`](./.agents/skills/ai-output-judgement/SKILL.md) — Anti-slop review rubric (tokens over arbitrary hex, native semantics, intentional layout, error/loading/empty states).
- **Technical SEO & AEO:** [`.agents/skills/seo-engineer/SKILL.md`](./.agents/skills/seo-engineer/SKILL.md) & [`.agents/skills/seo-strategy/SKILL.md`](./.agents/skills/seo-strategy/SKILL.md) — Schema.org JSON-LD, sitemaps, robots.txt, metadata, `llms.txt` for AI answer engines.
- **Accessibility:** [`.agents/skills/accessibility-engineer/SKILL.md`](./.agents/skills/accessibility-engineer/SKILL.md) — Semantic HTML, keyboard operability, color contrast, ARIA labels.
- **Performance:** [`.agents/skills/performance-engineer/SKILL.md`](./.agents/skills/performance-engineer/SKILL.md) — Core Web Vitals (LCP, CLS, INP), asset optimization, code splitting.

### 1.3 Code Review Graph — Primary Codebase Intelligence

Code Review Graph is the primary codebase intelligence tool for this project. See `code-review-install-guide.txt` for setup and usage.

Before making any change:
1. Inspect the existing codebase graph (`.code-review-graph/graph.db`).
2. Understand the architecture, modules, dependencies, and execution flows relevant to the task.
3. Identify affected components and dependencies before modifying files.
4. Use graph-based context to avoid unnecessary repository-wide exploration.

When making changes:
1. Consider the impact on dependent components.
2. Identify potentially affected tests.
3. Follow the existing architecture and coding conventions.
4. Avoid unnecessary refactoring.

After making changes:
1. Update the code graph if needed.
2. Analyze the change impact and potential regressions.
3. Report affected files, dependencies, and testing recommendations.

Do not assume the graph contains up-to-date information. Check its status when necessary.

---

## 2. Non-Negotiable Architectural Rules

### 2.1 Server-Side Architecture — Managed Data Services & API Routes
- **No Local Database Backend:** Never create local databases, ORM models (Prisma, Drizzle, etc.), or in-repo database migrations.
- **Managed Data Services:** All dynamic data (content, events, merchant profiles, leads) lives in meelTe's managed platform services — **Supabase** (Postgres, migrations, edge functions) and **Firebase** (Auth, Storage, push). Neither is a local database, so both are permitted. Read `plan.md` decisions **D1** (ownership matrix) and **D2** (client vs server access) before adding any new data path.
- **Server-side access only:** Elevate permissions strictly inside `src/services/`,  and `src/app/api/`, and import `server-only` in the module that reads the service-role key or any Firebase credential. Never let a secret reach the browser, and never prefix one with `NEXT_PUBLIC_`.
- **REST, not SDK (decision D2):** Call the Supabase PostgREST URL and the Firebase REST endpoints with `fetch`. Do not add `@supabase/supabase-js`, `firebase`, or `firebase-admin`. Keep every call behind the shared `src/utils/fetch-json.js` helper plus one thin client per service, so pagination, retries, 429 handling, and error mapping live in one auditable place.
- **API Routes & Server Actions:** Internal API route handlers (`src/app/api/**`) are permitted for server-side endpoints (such as authentication, session management, rate limiting, webhooks, and REST services). Server Actions in `src/actions/` remain preferred for standard form mutations and ISR data revalidation where appropriate.
- **Data Fetching via `src/services/`:**
  - **Read Operations (SSG/ISR):** Server Components read through `src/services/`. Because decision **D2** makes every call `fetch`-based, the standard caching contract applies:  
    `fetch(url, { next: { revalidate: 3600, tags: ['events'] } })`. Tag the call and revalidate it from the action that mutates the data.
  - **Write Operations (Forms & Inquiries):** Submit through Server Actions in `src/actions/`, with explicit loading, error, and success states.
- **Authorization is server-side.** A PostgREST call made with the service-role key bypasses RLS entirely, so RLS is not your authorization boundary on that path. Authorize inside the action; treat RLS and `firestore.rules` as defence-in-depth for the anon-key path only.
- **Validation is the schema.** Neither datastore can enforce intent, so every write boundary validates with `zod` from `src/validation/`.
- **Public marketing routes fetch nothing.** Static pages under `src/app/(site)/` must not import `src/services/` or call a platform URL directly. The deliberate exceptions are the server-rendered shared-link routes `src/app/(site)/ads/[id]/` and `src/app/(site)/events/[id]/`, plus the `/` (homepage) and `/events` listings that render live offers and community events, which use only the read-only meelTe Web API client for SEO detail and listing pages; the API key and upstream response never reach the browser as a direct request. Any further public route that needs live data must be added to this list first.

### 2.2 Visual & Brand System Standards
- **Source of Truth:** Colors and typography MUST strictly adhere to [`docs/Design.md`](./docs/Design.md) and Tailwind CSS v4 tokens in `src/app/globals.css`:
  - **Brand Primary (Mid Purple):** `#6D3BB3`
  - **Brand Royal/Dark Gradient:** `#5B2E91` to `#7A45C4`
  - **Accent Amber/Gold:** `#F59E0B` / `#F4B740`
  - **Canvas Background:** `#F8F5FF`
  - **Card Surface:** `#FFFFFF`
  - **Text High-Contrast:** `#1F1F28` (Primary) and `#4B5563` (Secondary) — see `docs/Design.md` §9.4; the older `#6B7280` value is stale
- **Simple, Clean & Minimal UI:** Keep interfaces clean, simple, and minimal. Prioritize deliberate whitespace, calm readability, clear content hierarchy, and intuitive navigation. Avoid visual clutter, gratuitous decorative elements, dense badge stacking, and distracting animations. Every visual element must serve a concrete discovery or conversion goal.
- **Zero Fabricated Claims & Metrics Policy:** Never invent exaggerated SaaS metrics (e.g., *"50,000+ Happy Users"* or *"10,000+ Local Stores"*). Use genuine product features, Pan-India neighbourhood scope, and authentic value propositions (*"Community Moderated"*, *"Zero Commission"*, *"Location Never Sold"*) instead of vanity numbers.
- **Both store listings, always:** meelTe is live on Google Play (`PLAY_STORE_URL`) and the App Store (`APP_STORE_URL`), both exported from `src/config/site.js`. Never present the app as Android-only: wherever the app is promoted, or its availability described, name both platforms.
- **Centralized Vector Icons:** Never import directly from `lucide-react` across random components. Always route icon imports through the single source of truth [`src/lib/icons/index.js`](./src/lib/icons/index.js). Standardize icon sizing scale (`h-4 w-4` for inline/button, `h-5 w-5` for cards/nav, `h-6 w-6` for section headers).
- **Accessibility & Tiered Motion Standards:** 
  - Ensure full keyboard operability with explicit `focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2` on all interactive triggers.
  - Every icon-only button must declare a clear `aria-label`.
  - Respect `prefers-reduced-motion: reduce` following [`.agents/skills/accessible-animation/SKILL.md`](./.agents/skills/accessible-animation/SKILL.md) (Tier 1: remove vestibular triggers like parallax/continuous marquees; Tier 2: shorten/fade transitions to ≤200ms; Tier 3: preserve essential feedback like focus rings and spinners).
- **Visual Polish:** High-impact, modern presentation tailored to community members and merchants: bento grids, responsive layouts, micro-interactions, and clear trust badges (*"Privacy First — Location never sold or shared"*).
- **Core Web Vitals:** Always use Next.js `<Image>` with explicit width/height and `priority` on above-the-fold hero elements. Ensure zero Cumulative Layout Shift (CLS).

### 2.3 Mandatory Content & Copy Directives (Strict Enforcement)
- **No Need to Mention Web App Status:** Do **NOT** state or mention *"web app is in development"*, *"web app is coming soon"*, or apologize for browser availability. Simply present the live mobile applications on Google Play (`PLAY_STORE_URL`) and the App Store (`APP_STORE_URL`) directly without distracting status qualifiers.
- **No 60 km or Specific Kilometer Radius Mentions:** Do **NOT** state *"60 km radius"*, *"60 km sorted"*, or hardcode specific distance kilometer figures in user-facing copy. Frame discovery simply as *"nearby"*, *"distance-sorted"*, or *"hyperlocal proximity for your neighbourhood"*.
- **Zero Local City Names (Pan-India Framing):** Do **NOT** mention or hardcode specific city names like **Bengaluru**, **Ranchi**, or **Gaya** in marketing copy, headlines, trust pills, metadata keywords, or constants. Always refer broadly to **India** / **Indian neighbourhoods** instead (e.g., *"Hyperlocal community platform across India"*, *"Indian neighbourhoods"*).
- **Minimal Copy & No Redundant Descriptions Below Headings:** Keep copy concise, clean, and minimal. Avoid heavy explanatory paragraph blocks under headings (such as redundant card descriptions or long preamble paragraphs). Rely on clear, descriptive headings and concise labels rather than blocks of repetitive text.
- **No Double Headings:** Avoid stacking an uppercase eyebrow/tag immediately above an `<h1>` or `<h2>` heading (e.g. stacking *"In-App Capabilities"* or *"The Hyperlocal Difference"* on top of the actual title). Use a single, clean, authoritative heading rather than repetitive or decorative double headings.
- **The admin CMS is internal, not a customer-facing web app:** The `(admin)` route group exists to let meelTe staff manage content. Never link to it from public navigation, never market it, and never use it to imply a customer web app has launched. The "no web app status qualifier" rule above still governs every public page.

### 2.4 SEO & Domain Constants Standardization
- **Single Source of Truth for Geo & Taxonomy:** Centralize site name, base URL, social handles, and default metadata in `src/config/site.js`. Focus coverage countries (`TARGET_CITIES = ["India"]`) and the three platform areas (`PLATFORM_AREAS` — offers, events, people) must be imported from `src/constants/app-constants.js`. Never hardcode city or area lists across components.
- **Keep SEO Schema Synchronized:** When modifying platform areas or coverage scopes, update both [`src/constants/app-constants.js`](./src/constants/app-constants.js) and [`src/lib/seo/structured-data.js`](./src/lib/seo/structured-data.js) to keep metadata and structured data in parity.
- **JSON-LD Structured Data:** Maintain valid Schema.org schemas (`Organization`, `WebSite`, `BreadcrumbList`, `Event`, `LocalBusiness`, `FAQPage`). Do not emit schema for capabilities the product does not ship (there is no jobs board, and no price is published).
- **Discovery Infrastructure:**
  - Dynamic XML sitemap at `src/app/sitemap.js` (stable release date for static routes; real `modifiedDate` for external BE slugs; never `new Date()`; `/ads` permanently 308-redirected to `/`).
  - Search crawler directives at `src/app/robots.js`.
  - Static 1200x630 social share card at `public/og-image.png` (brand canvas, dot grid, logo, two-line tagline strip; ~55KB and therefore inside WhatsApp's 600KB preview limit). Regenerate it with `node scripts/generate-og-image.mjs`, which composites `public/transparent_logo_meelTe.png` onto the token colours read from `src/app/globals.css`. Every page and every JSON-LD node points at it through `OG_IMAGE_PATH` in `src/lib/seo/metadata.js`; there is no runtime OpenGraph route.
  - Machine-readable knowledge file at `public/llms.txt` for AI search engines (Perplexity, ChatGPT, Claude), plus `public/llms-full.txt` as the unabridged corpus and per-page markdown mirrors in `public/*.md` (`about`, `services`, `faq`, `for-merchants`, `how-it-works`, `coverage`, `contact`, `careers`) for token-efficient agent ingestion. Any new `.md` endpoint must be linked from `public/llms.txt` **and** `public/.well-known/llms.txt`, and listed in `public/llms-full.txt` §9.

### 2.5 Component Integrity & Clean Module Exports
- **Single Component Definition Per File:** Each component file must contain exactly one primary component definition that matches the file's name and purpose. Do not colocate unrelated full-section components or declare duplicate functions with the same name.
- **Zero Duplicate or Conflicting Exports:** Every module must have at most one `export default` and strictly unique named exports. Never leave duplicate exports (`export default ComponentName` defined more than once).
- **Clean Drop-in Replacements:** When modifying or refactoring existing components, ensure the old implementation is completely replaced. Never leave stale code appended below the new code block. Verify lines and exports before completing any file modification.

### 2.6 Next.js 16 SSG & Prerender Determinism
- **No Non-Deterministic Runtime Clocks in Server Components:** Never call `new Date()`, `Math.random()`, or dynamic runtime clocks inside static Server Components (`page.jsx`, `layout.jsx`, `footer.jsx`).
- **No Runtime Clock Reads During Render in Client Components Either:** `next.config.mjs` has `cacheComponents: true`, so `new Date()` / `Date.now()` read while a Client Component renders is treated as an unstable value and fails the build (`blocking-prerender-current-time-client`). This applies to anything reached during prerender — `useForm({ defaultValues })`, `useState` initializers and render-body helpers included. Use the deferral patterns below instead of wrapping the component in `<Suspense>` (which would drop the page out of the static shell).
  - **Clock-free initial state:** value factories that run during render must be pure. `getInitialJobFormValues()` in `src/validation/hr/job-validation.js` returns `deadline: ""`; the suggested deadline is seeded after mount in `JobMultiStepForm` via `setValue(..., { shouldDirty: false })`, so it never marks the form dirty or trips the autosave/unsaved-changes guards.
  - **Client-only display values:** use `useSyncExternalStore` with a server snapshot (`StepLocationPay`'s `min` date), not `useState` + `setState` inside an effect — the React Compiler lint rule `react-hooks/set-state-in-effect` rejects the latter.
  - **Event-time clocks are fine:** `new Date()` inside event handlers, `setTimeout` callbacks, `superRefine` validators and route handlers never runs during prerender, so it is allowed.
- **Dynamic Routes That Read Runtime URL Data:** `usePathname()` in a Client Component layout cannot resolve for a dynamic segment during prerender. Such segments opt out with `export const instant = false` in a **Server Component** module (`src/app/hr/jobs/[id]/edit/layout.jsx`) — route segment config is rejected inside `"use client"` files. They build as partial-prerender routes and the proxy at `src/proxy.js` stays the auth gate.
- **Use Module Constants:** Use static release dates or module constants (e.g., `const CURRENT_YEAR = 2026`) so static HTML prerenders deterministically during build time without triggering hydration mismatches or SSG bailouts.

### 2.7 Breadcrumbs on Every Page (Mandatory)
- **Rule:** Every page/route created under `src/app/**` **MUST** render a breadcrumb. No new page ships without one, and existing pages must never have theirs removed.
- **Use the shared primitive:** Render breadcrumbs via [`src/components/layout/breadcrumbs.jsx`](./src/components/layout/breadcrumbs.jsx). Never hand-roll inline `<nav aria-label="Breadcrumb">` markup, and never duplicate the trail markup inside a page or hero component.
- **Define the trail as a module constant** in the page (or its hero component) and pass it in:
  ```jsx
  const BREADCRUMBS = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
  ];
  // ...
  <Breadcrumbs items={BREADCRUMBS} className="mb-4" />
  ```
- **Trail shape:** Always start at `Home` (`/`) and end at the current page. The last item is rendered as plain text with `aria-current="page"`; every earlier item is a link. Use `listClassName="justify-center"` only where the surrounding layout is centered.
- **Keep the schema synchronized:** Emit a matching `BreadcrumbList` in the same page's JSON-LD graph via `getBreadcrumbsJsonLd(BREADCRUMBS)` from [`src/lib/seo/structured-data.js`](./src/lib/seo/structured-data.js), so the visible trail and the structured data never diverge. Where a page already emits other schema (`AboutPage`, `ContactPage`, etc.), merge both into one JSON-LD array.
- **Admin routes are not exempt.** `(admin)` pages use the same primitive with a CMS trail (e.g. Admin → Leads → Edit lead). Breadcrumbs are more useful in a CMS, not less; do not drop them there.
- **Exemptions:** The homepage (`src/app/(site)/page.js`) and the 404 page (`src/app/not-found.jsx`) are the only routes that do not require a breadcrumb.

---

## 3. Tool & CLI Execution Guidelines

1. **Context First:** Before any implementation, read `docs/target_customer.md`, `project-context.md`, `meelTe-context.md`, and `docs/Design.md` in full (see §1.1), then read the applicable skills (§1.2), and inspect the codebase graph (see §1.3 Code Review Graph).
2. **Package Manager:** Always use **`npm`** (`npm run dev`, `npm run build`, `npm run lint`). **NEVER** run `pnpm` or `yarn`.
3. **Environment Secrets:** Never print, log, or commit secret keys from `.env`.
4. **No Destructive Commands:** Never execute destructive operations (`rm -rf`, `git reset --hard`) without explicit user direction.
5. **Follow Established Patterns:** Keep file and folder names lowercase with kebab-case or standard Next.js conventions (`page.jsx`, `layout.jsx`, `route.js`).
6. **Explain Your Work:** Always state which context documents and which skill guided the work, explain what changed, and why.
7. **Clean Edits & Export Verification:** When editing files, verify that no duplicate component blocks or duplicate `export default` statements remain at the end of the file. Always review the full file structure after editing.
8. **Turbopack Stale Cache Awareness & Dev Server Restarts:** Next.js 16 with Turbopack can occasionally retain stale compiled module graphs in memory during active component restructuring. If compile errors persist for a file verified clean on disk, restart the dev server (`Ctrl+C` then `npm run dev`) before making speculative code changes.
9. **Production Build Validation:** Validate major milestones with `npm run build` to confirm zero lint/type errors, valid server/client boundaries, and clean static generation.
10. **Repository Structure & Documentation Maintenance:**
    - **Descriptive Naming:** Every new file and folder must have a clear, meaningful, self-explanatory name that helps any developer understand its purpose without opening it.
    - **Mandatory `AI_RULE.md` Updates:** Whenever you create, rename, move, restructure, or delete a file or folder, update `AI_RULE.md` in the same task to reflect the change.
    - **Document Responsibilities:** For new files and folders, document their purpose, responsibilities, location, and relationship to other modules wherever relevant.
    - **Follow Existing Conventions:** Inspect the existing repository structure before introducing new files or folders. Follow established naming conventions, Next.js App Router patterns, and architectural boundaries.
    - **Keep References Accurate:** Update outdated file paths, folder references, and architectural descriptions. Remove documentation for deleted files and avoid duplicate entries.
    - **No Unnecessary Files:** Before creating a new file or folder, check whether an existing module can accommodate the requirement without compromising separation of concerns.
    - **Final Verification:** Before completing the task, verify that `AI_RULE.md` accurately reflects all structural changes and that documented paths exist.
    - **Core Principle:** A developer should be able to understand the repository's structure, navigate to the correct location, and identify each file's responsibility through descriptive naming and `AI_RULE.md` documentation.

---

## 4. Current Component Registry & Homepage Architecture

| Module / Component | Path | Responsibility & Purpose |
| :--- | :--- | :--- |
| **Shared Agent Skills** | `.agents/skills/<skill-id>/SKILL.md` | The 16 discipline skills every AI tool must read before implementation (ui-ux, frontend, accessibility, accessible-animation, animate, ai, ai-output-judgement, backend, database, security, devops, performance, seo-engineer, seo-strategy, seo-keyword-research, personal-seo). |
| **Shared Role Agents** | `.opencode/agents/<agent-id>.md` + `.github/agents/<agent-id>.agent.md` | Six role agents: `website-coordinator`, `frontend-engineer`, `accessibility-engineer`, `seo-engineer`, `ai-engineer`, `performance-engineer`. |
| **Class Merger** | `src/lib/utils.js` | Exports `cn()` combining `clsx` and `tailwind-merge` for conflict-free dynamic styling. |
| **Display Name Casing** | `src/lib/display-name.js` | `formatDisplayName` — title-cases names typed entirely in lowercase by merchants and event hosts (`twoweelar garege` → `Twoweelar Garege`) while returning anything that already contains an uppercase letter untouched. Lives in `src/lib` because offer and event surfaces must present the same name; `ad-formatters.js` re-exports it so offer components keep one import site. |
| **Validation Schemas** | `src/validation/contacts/contact-validation.js`, `src/validation/ads/ads-cursor-validation.js` | Zod-backed schemas and input bounds: the contact form fields, and the offer pagination cursor a browser may submit to the `loadMoreAds` Server Action (length-capped, single-line, rejected before it reaches PostgREST). |
| **Centralized Icons** | `src/lib/icons/index.js` | Single source of truth for all vector icons across the platform, re-exporting standardized icons from `lucide-react` plus the local brand icons. |
| **Social / Brand Icons** | `src/lib/icons/social-icons.jsx` | Inline-SVG brand marks (`InstagramIcon`, `FacebookIcon`, `XIcon`, `LinkedInIcon`, `YouTubeIcon`) used by the footer social row. |
| **Toast Feedback Contract** | `src/lib/toast-feedback.js` | Centralised `sonner` helpers (`notifySuccess`, `notifyError`, `notifyInfo`) plus `TOAST_COPY` and `TOAST_ID`. |
| **Toast Surface** | `src/app/layout.js` + `src/app/globals.css` | Single `Toaster` mount for the whole app. |
| **Server-only fetch helper** | `src/utils/fetch-json.js` | Shared GET wrapper with bounded timeouts, retries for 429/5xx responses, and generic upstream errors. Every `supabase-services/` call goes through it. |
| **Supabase services — shared** | `src/services/supabase-services/shared/` | `constants.js` (page-size caps, 15/30/60-minute revalidate windows, cache tags), `errors.js` (`MeelteWebApiError` + codes), `config.js` (the only module reading `MEELTE_API_BASE` / `MEELTE_SUPABASE_ANON_KEY`), `request.js` (URL building, anon-key headers, error mapping, single-object unwrap), `pagination.js` (cursor walk). |
| **Supabase services — normalizers** | `src/services/supabase-services/normalizers/` | `primitives.js` value guards (length caps, coordinate ranges, HTTPS-only media URLs) plus `ad.js` / `event.js` row mappers that drop every non-public field before it can reach a page or a JSON-LD node. |
| **Supabase services — ads** | `src/services/supabase-services/ads/` | `get-all-ads.js` exports `listPublicAds` (one cursor page) and `allLiveAds` (the sitemap walk); `get-ads-by-id.js` exports `getPublicAd`, returning `null` for a missing or malformed id. |
| **Supabase services — events** | `src/services/supabase-services/events/` | `get-all-events.js` exports `listPublicEvents` and `allLiveEvents`; `get-events-by-id.js` exports `getPublicEvent`, with the same not-found contract as offers. |
| **Public shared-link pages** | `src/app/(site)/ads/[id]/page.jsx` and `src/app/(site)/events/[id]/page.jsx` | ISR detail pages for app-shared offers and events. They render ended items with `noindex`, emit public-field JSON-LD only for live items, and own the canonical `/ads/{id}` and `/events/{id}` URLs. The ads wrapper normalises merchant casing once (`displayAd()`) so the `<h1>`, breadcrumb, `<title>` and JSON-LD `Product.name` can never disagree. Both wrappers render a skeleton `DetailFallback` inside `<Container className="max-w-6xl">` that matches the real grid. |
| **OpenGraph Card Asset** | `public/og-image.png` + `scripts/generate-og-image.mjs` | The single 1200×630 social share image used by every page and JSON-LD node. |
| **Container Primitive** | `src/components/layout/container.jsx` | Standardized `max-w-[1440px]` wrapper with 4pt rhythmic responsive horizontal padding. It is the single page width: header, footer, and listing pages all use it, so their left edges align. Narrow reading surfaces (FAQ, legal, detail pages) may still narrow via a `max-w-*` override. |
| **Breadcrumbs Primitive** | `src/components/layout/breadcrumbs.jsx` | Shared breadcrumb trail (`nav[aria-label="Breadcrumb"]` + `<ol>`). |
| **Button Primitive** | `src/components/ui/button.jsx` | Accessible brand button supporting `primary`, `secondary`, `accent`, `outline`, `ghost` variants with high-contrast focus rings. |
| **Navbar Header** | `src/components/layout/navbar.jsx` | Responsive sticky header with a bold text wordmark (icon-only mark + Geist extrabold "meelTe", replacing the low-contrast `only_meelte.png` artwork), nav links, and dual store download pills. |
| **Mobile Drawer** | `src/components/layout/mobile-nav.jsx` | Accessible slide-over drawer built with `@radix-ui/react-dialog`, using the same icon + bold text wordmark as the header. |
| **Hero Section** | `src/components/sections/home/hero-section.jsx` | Above-the-fold, text-first, buyer-centred value proposition with dual store buttons and trust pills. |
| **Hyperlocal Difference** | `src/components/sections/home/hyperlocal-difference-section.jsx` | Compact 2×2 card grid answering why meelTe differs from viral feeds, undated WhatsApp deals, open-invite events, and middleman fees: 40px icon tile + one-line takeaway + muted detail + sentence-case contrast tag. Cards are static and shadowless (no hover, since nothing is clickable); purple is limited to the icon tile and tag. |
| **Home Journey Section** | `src/components/sections/home/home-journey-section.jsx` | Predictable 3-step process for Residents and Merchants with accessible tablist. |
| **Product Experience** | `src/components/sections/home/product-experience-section.jsx` | Compact 2×2 capability grid (offers, events, 1:1 chat, location privacy): 40px icon tile inline beside a 16px semibold title and 14px muted description, on `bg-canvas` cards with a `primary/15` border and no resting shadow. Cards are static and shadowless (no hover, since nothing is clickable). |
| **Trust Boundaries** | `src/components/sections/home/trust-boundaries-section.jsx` | Minimal, high-signal trust commitments (offline settlement, no tracking, in-person verification) without verbose paragraphs. |
| **Final Conversion CTA** | `src/components/sections/home/final-conversion-cta.jsx` | Dual-audience closing block: store downloads for residents + direct merchant desk inquiry. |
| **FAQ Accordion** | `src/components/sections/common/faq-section.jsx` | Accessible accordion with `forceMount` for SEO. |
| **Global Footer** | `src/components/layout/footer.jsx` | Multi-column directory footer with category links, social row, and legal links. It carries **no** newsletter signup: the unused `layout/newsletter-form.jsx` and its newsletter-only toast copy were deleted in Nov 2026, after `src/services/newsletter.js` had already been removed and left the component importing a missing module. |
| **Discovery Toggle** | `src/components/sections/discovery/discovery-toggle.jsx` | Segmented toggle control (`role="tablist"`) with roving tabindex, arrow navigation, Home/End jump keys, focus visibility ring, and 40px touch targets. |
| **Discovery Switch** | `src/components/sections/discovery/discovery-switch.jsx` | Client view coordinator mounting either `AdsListing` or `EventsListing` under a single labelled `tabpanel`, unmounting the inactive panel to prevent duplicate DOM and stale filters. |
| **Discovery Listing Fallback** | `src/components/sections/discovery/listing-fallback.jsx` | Reusable skeleton fallback section with `aria-busy="true"` and customizable aria-label for Suspense boundaries. |
| **Homepage Assembly** | `src/app/(site)/page.js` | Assembles the unified discovery page (`/`) with parallel server fetch (`listPublicAds` + `listPublicEvents`), `DiscoverySwitch` toggle, and `CollectionPage` JSON-LD for server-rendered offers. Previous marketing sections are parked. |
| **Dynamic sitemap entries** | `src/app/sitemap.js` + `src/services/supabase-services/ads/get-all-ads.js` and `.../events/get-all-events.js` | Adds live ad and event URLs from the list endpoints with hourly revalidation while retaining static routes when the API is unavailable or unconfigured. |
| **Page Sections (`sections/<route>/`)** | `src/components/sections/{about,ads,careers,contact,events,for-merchants,how-it-works,signup}/` | One folder per public route, each with an `index.js` barrel, holding the sections that route renders. `home/` and `common/` are shared across routes and stay in `sections/`. Route folders under `(site)/` contain only `page.jsx`, so a page never ships its own component tree. |
| **Offer detail page** | `src/components/sections/ads/ad-detail.jsx` | The public view of one app-shared offer. Media-led two-column grid on `lg`, with the photo (`aspect-[4/3]` → `lg:aspect-square`) pinned as a sticky left column and one unframed information flow on the right — the photo is the only framed element, replacing four nested shadow cards (AVOID.md §2). Order: `h1` → "From {shop}" → location → ended notice → price (with struck original) → CTA row → steps → description → `dl` (Offer valid, Listed by) → engagement → back link. The photo badge repeats only `discountLabel` when a price is already shown below; category is a glass chip matching `AdCard`. Primary CTA is `Claim deal in app` (opens `AppActionModal`), and `Get directions` is promoted to a real secondary link because it is the only action a browser visitor can complete. Ended offers hide the CTA, steps and mobile bar and instead show an inline notice linking to `/ads`. |
| **Event detail page** | `src/components/sections/events/event-detail.jsx` | Same shell and framing rules as the offer detail. Order: `h1` → host (avatar with initials fallback) + "N people going" → ended notice → `dl` (When, Where) → joining fee → CTA row → steps → description → engagement → back link, because when and where decide attendance before cost does. Primary CTA is `Request to join in app`. The host's public name is shown without any "Verified Host" badge or shield chip — the product has no consumer-visible verification, so claiming one would be an unsupported claim. |
| **Detail Steps Strip** | `src/components/sections/common/detail-steps.jsx` | `DetailSteps` — the borderless numbered strip shared by both detail pages ("How to redeem this deal" / "How to join this event"). A hairline rule plus small numerals group the three beats instead of a third bordered card, so the honest offline-settlement message survives without adding container noise. Exported from `sections/common/index.js`. |
| **Share helper** | `src/lib/share-link.js` | `shareCurrentPage({ title, text, successMessage })` — uses the native share sheet where available, otherwise copies the canonical URL and confirms through `notifySuccess`. A dismissed sheet (`AbortError`) and a blocked clipboard are treated as user intent, never as errors, so the two detail pages cannot drift on fallback order or copy. |
| **App action dialog** | `src/components/ui/app-action-dialog.jsx` + `src/components/sections/{ads,events}/app-action-modal.jsx` | The single shell behind every "this happens in the app" promotion dialog on `/ads`, `/ads/[id]`, `/events` and `/events/[id]`: `AppActionDialog` owns the Radix scrim, panel, close control, `Title`/`Description` wiring, the dual Google Play + App Store badges and the one-line signup note; the two `app-action-modal.jsx` files only supply copy (`ACTION_CONFIG`) and the offer/event title shown as context, so the surfaces can never drift. Panel is `w-[min(28rem,calc(100vw-2rem))]` with `max-h-[calc(100dvh-2rem)] overflow-y-auto` so it survives short viewports; motion is a 150 ms fade plus a 2% scale via Tailwind's `starting:` variant (no `tailwindcss-animate` dependency) and the global reduced-motion rule neutralises it. No icon tile, no badge eyebrow, no nested benefits card and no `backdrop-blur` — AVOID.md §2, §4, §7 and §9. |
| **Offers listing page** | `src/app/(site)/ads/page.jsx` + `src/components/sections/ads/{ads-listing,ad-card,ad-formatters}.jsx` | `/ads` grid of live offers in a 1/2/3-column responsive grid, with explicit empty and temporarily-unavailable states so a missing API key degrades to copy instead of a 500. The first `LISTING_PAGE_SIZE` (20) offers are server-rendered and crawlable; the rest load through the `loadMoreAds` Server Action, with an inline retry and a polite live region. Categories render as a single horizontally scrollable chip row (canonical `Food`/`Fashion`/`Services`/`Health` first, merchant free text by volume after) with a right-edge fade and a `More (N)` disclosure for the long tail; an active filter is always promoted into the visible row. `AdCard` uses a fixed `aspect-[16/10]` photo with a bottom gradient, the deal value (`FLAT 20% OFF`, `₹600 → ₹50`, or the plain price) top-left, and category + area glass chips bottom, so the offer is legible before scrolling. Because the Web API returns addresses but no distance, `ad-formatters.js` derives a readable area label from `locationName` (skipping house numbers and plus codes) and only renders the header "Offers around {area}" pill when one locality covers ≥50% of loaded offers — no km claims, no radius control. `ad-formatters.js` is also the single source for price (`formatPrice` drops `.00` on whole amounts), discount, date and the `getDirectionsHref` Maps link shared with `AdDetail`, and it re-exports `formatDisplayName` from `src/lib/display-name.js` for card casing. Emits `CollectionPage` + `BreadcrumbList` only when items are actually rendered, and the `ItemList` count matches the rows on the page. |
| **Server Actions** | `src/utils/ads/load-more-ads.js` | `loadMoreAds` — the only server entry point outside `src/services/`. Validates the cursor, fetches the next `LISTING_PAGE_SIZE` offers, and returns a discriminated `{ ok: true, items, nextCursor }` / `{ ok: false, error }` result. It never throws, because Next.js replaces thrown errors with an opaque digest in production. This is why `app/api/**` is not needed for pagination. |
| **HR Master Service Barrel** | `src/services/hr/index.js` | The client-safe import site for HR data services: job requisitions (`src/services/hr/jobs/`) and candidate pipeline & document storage (`src/services/hr/candidates/`). Server-only authentication (`src/services/hr/login/`) is isolated to prevent `server-only` bundler leakage into Client Components. |
| **HR Domain Data Services** | `src/services/hr/jobs/hr-jobs-service.js`, `src/services/hr/candidates/{hr-candidates-service,hr-storage-service}.js` | Cloud Firestore & Firebase Storage business logic for HR jobs, candidate applications, evaluation notes, and resume uploads. |
| **HR Login & Session Services** | `src/services/hr/login/{login,password,rate-limit,session}.js` | Core authentication service functions: rate limiting, password verification with constant-time hashing, and session issuance/cookie lifecycle. |
| **HR Constants & Validation** | `src/constants/hr-constants.js`, `src/validation/hr/candidate-validation.js` | Single source of truth for Firestore collection names (`hr_jobs`, `hr_candidates`), Storage folder paths, status enums, 10MB file bounds, allowed resume MIME types, and Zod applicant schemas. |
| **Firebase Primitives Layer** | `src/lib/firebase/config.js`, `src/services/firebase/{firestore,storage,index}.js` | Client configuration parser with user-friendly error messages, Firestore generic CRUD helpers, and Storage upload/deletion utilities. |
| **HR REST API Routes** | `src/app/api/hr/auth/route.js`, `src/app/api/hr/jobs/route.js`, `src/app/api/hr/candidates/route.js`, `src/app/api/hr/dashboard/route.js` | Partitioned Next.js App Router API endpoints for HR: consolidated session auth (GET check, POST login, DELETE logout), job requisitions CRUD, candidate applications, and authenticated dashboard metrics aggregator. |
| **HR Route Guard (Proxy)** | `src/proxy.js` | The Next 16 request entry point (`proxy.js` replaces `middleware.js`, which is deprecated since 16.0). Exports one async function named `proxy` plus `config.matcher = ["/hr", "/hr/:path*"]`; it verifies the session cookie with the shared Web Crypto primitive, redirects unauthenticated requests to `/hr/login`, and sends an authenticated visitor who lands on `/hr/login` to `/hr/dashboard`. This file is the **only** place Next runs pre-request logic — there is no `src/middleware.js` and no `src/middleware/` folder, and deleting this file does not relocate the guard, it disables it. Because every `/hr/*` page is prerendered (the dynamic job-edit segment as partial prerender), the proxy is the sole auth gate for the portal. Runs on the Node.js runtime by default; `export const runtime` is rejected here. |
| **HR Portal & Dashboard Pages** | `src/app/hr/` | `layout.jsx` (session shell), `page.jsx` (redirects to `/hr/dashboard`), `dashboard/page.jsx` (main overview), `jobs/page.jsx` (job requisitions table & actions), `candidates/page.jsx` (applicant directory & drawer), `login/page.jsx` (secure sign-in with show/hide password and rate limiting). |
| **HR Dynamic Route Segment Config** | `src/app/hr/jobs/[id]/edit/layout.jsx` | Pass-through Server Component layout that exists only to export `instant = false` for the dynamic job-edit segment. The HR portal layout reads `usePathname()` (runtime URL data) to decide whether to render the portal chrome, and the job id only exists at request time, so this segment cannot join the static shell — it builds as a partial-prerender route. Route segment config is rejected in the sibling `page.jsx`, which is a Client Component. |
| **HR Modularized Components** | `src/components/hr/` | Modular component tree with centralized barrel export (`index.js`): `shared/` (`hr-context`, `hr-badge`, `hr-sidebar`, `hr-header`), `dashboard/` (`dashboard-stats`, `recent-candidates-card`, `recent-jobs-card`), `jobs/` (`jobs-filter-bar`, `jobs-table`, `job-modal`, `delete-job-dialog`), `candidates/` (`candidates-filter-bar`, `candidates-table`, `candidate-detail-modal`). |
| **Restructuring Plan** | `plan.md` | The live plan for adding the database + admin CMS and restructuring the tree for scale. Holds the verified current state, the documentation conflicts to resolve (C1–C4), the target structure, the phased work, the open decisions (D1–D6), and the risks (R1–R8). Update it as decisions land — it is not a substitute for §2.1, §2.7, or §12 and must be kept consistent with them. |
| **FAQ Accordion Root Cause** | `root-cause-faq.md` | The investigation record for the FAQ accordion toggle/collapse defect: reported symptoms, the `forceMount` + `scaleY` animation root cause (with Radix `react-collapsible@1.2.1` source evidence), why each requirement failed, the proposed `faq-panel` CSS fix, rejected alternatives, regression surface, the open `/faq` per-topic-group decision, and the verification log. Read it before changing accordion behaviour; append results rather than rewriting the analysis. |
