# Project Context: meelTe (Next.js Visual & SEO Website)

> **Last Updated:** November 5, 2026  
> **Read before any change:** [`docs/target_customer.md`](./docs/target_customer.md), this file, [`meelTe-context.md`](./meelTe-context.md), and [`docs/Design.md`](./docs/Design.md) — all four, in full. See `AGENTS.md` Step 0.  
> **Source of Truth:** Compiled from [`docs/target_customer.md`](./docs/target_customer.md), [`docs/Design.md`](./docs/Design.md), [`meelTe-context.md`](./meelTe-context.md), `AVOID.md`, and the current repo structure and decisions.

---

## 1. Product Overview & Identity

- **Brand:** **meelTe** (meelTe Private Limited / meelTe Technologies).
- **Repository:** `nextjs-website` (preferred project identity: `meelTe-nextjs-web`).
- **Live site:** `https://meelTe.com` (`APP_URL` from `NEXT_PUBLIC_SITE_URL`).
- **Product Type:** Community-driven hyper-local discovery, connection, and commerce platform.
- **Core Value Proposition:** *"Discover Opportunities. Build Connections. Create Experiences. Grow Local."*
- **Primary Geographic Focus:** India, with operational hubs in **Bengaluru, Gaya, and Ranchi** and an active pan-India expansion narrative.
- **Product Availability:** The app is **live on Google Play** (`com.meelTe.classico`) **and the App Store** (`id6792304887`), and both listings are promoted together everywhere the app is offered. The **web app is "coming soon"** — never imply the full web app already exists.
- **Platform Ecosystem:** Flutter mobile app + managed platform services (**Supabase** for Postgres, migrations, and edge functions; **Firebase** for Auth, Storage, and push) + this **Next.js visual + technical SEO marketing website**, which also hosts an internal **HR portal** (`/hr`) with secure authentication, job requisition, and candidate tracking workflows, alongside future internal admin CMS capabilities. The ownership boundary between external services is tracked as decision **D1** in [`plan.md`](./plan.md).
- **Website Goal:** Explain the platform honestly, build brand credibility, and drive clear conversion paths for residents and merchants without claiming more than the product evidence supports.
- **Current Goal (Nov 2026):** Enforce strict UI/UX anti-patterns guidelines (`AVOID.md`) across all components and pages, eliminate generic AI-slop visual artifacts (decorative floating orbs, gradient mesh clutter, fake phone chassis with invented businesses), maintain Next.js 16 Cache Components and SSG prerender determinism (clock-free render paths, deferred date initialization, `export const instant = false` for dynamic layouts), standardize HR portal candidate and job management interfaces with rich-text editing and client sanitization (`dompurify`, `@tiptap`), and wire live form endpoints only after the external backend is ready.

---

## 2. Core Mission & Problem Solved

meelTe addresses four core friction points in Indian local discovery:
1. **Information overload:** generic social apps bury useful local opportunities in noise.
2. **Short-lived local opportunities:** offers, garage sales, and local meetups disappear quickly before neighbors find them.
3. **Urban isolation / relocation friction:** new residents need trusted local context and social connection.
4. **Low-visibility local merchants:** small businesses struggle to reach nearby consumers without expensive or impersonal ad inventory.

The `/about` narrative is grounded in two real stories: an offer lost because it was only shared in a phone conversation, and feeling disconnected after moving to a new city. The site should remain grounded in these exact user problems rather than generic startup language.

---

## 3. The 4 Product Pillars

1. **Discover:** Hyper-local discovery across 5 core categories:
   - **Food**
   - **Fashion**
   - **Events**
   - **Services**
   - **Health**
2. **Connect:** Help residents meet people with shared language, culture, hobbies, and goals.
3. **Create:** Let local organisers and community hosts publish and manage events.
4. **Grow (Commerce):** Give local SMBs and merchants direct local visibility with simple promotion flows and minimal friction.

> **There is no local jobs board.** The product evidence does not show an in-app hiring feature, and `/careers` is explicitly company recruitment rather than a jobs portal. Do not present it as a local marketplace job board.

---

## 4. Target Customers & Personas

*Derived from [`docs/target_customer.md`](./docs/target_customer.md), which audits the Flutter app, Supabase migrations, edge functions, public web pages, and the app Terms & Conditions. meelTe is a **two-sided hyperlocal marketplace**: consumers come for nearby offers and events, while merchants and hosts come to reach those consumers.*

### 4.1 Segment map

| Segment | Who they are | What they need | Evidence in the product |
| :--- | :--- | :--- | :--- |
| **P1 Local consumers ("nearby discoverers")** | Smartphone users in India aged **13+** looking for offers, shops, and things to do close by. | Know what is nearby, trust the price, and get there easily. | Distance-sorted feeds, date-based offers, ₹ pricing, directions, follows, chat, and calls. |
| **P2 Local merchants ("shopkeepers")** | Independent shops, restaurants, and service businesses. | Cheap, simple local reach and repeat customers. | Shop ads, menu/photo import, AI product image help, follower notifications, in-person onboarding. |
| **S1 Community event hosts** | Individuals and small organisers running meetups or events. | Fill an event with the right people and control who joins. | Event creation, join approvals, group sizes, attendee removal, follower notifications. |
| **S2 Referral-driven early adopters ("reward seekers")** | Users motivated by coins and Amazon vouchers. | A tangible reward for inviting friends. | Referral codes, contacts/WhatsApp/SMS invites, milestone rewards, ₹100 / ₹500 voucher redemption. |
| **S3 Social connectors** | Users mainly interested in nearby conversations and connection. | Meet and talk to people nearby safely. | Friends, chat, location sharing, voice/video calls; people discovery is still not the headline feature. |

- **Web-only visitors:** people opening a shared `/ads/` or `/events/` link without the app, users deleting their account via `acc-dlt.html`, and policy readers on privacy/terms/child-safety pages.
- **Internal users (not customers):** field-acquisition staff, supervisors, HR, accounts, and admins in the separate admin panel. They matter only where their work shapes customer experience.

### 4.2 Illustrative personas

| Persona | Segment | Goal | Typical journey |
| :--- | :--- | :--- | :--- |
| **"Riya"** — deal-seeking resident | P1 | Find good offers and something to do nearby this weekend. | Install via referral or shared ad → phone OTP / Google sign-up → allow location → filter by category and distance → open a dated, priced offer → tap Directions and follow the shop. |
| **"Imran"** — neighbourhood shop owner | P2 | More walk-ins with low effort. | Field agent signs him up → creates a shop ad → imports menu photo → edits pricing and dates → publishes ad → follows likes/comments and repeats next offer. |
| **"Aman"** — community host | S1 | Run a meet-up or workshop with manageable turnout. | Create event → share link → review join requests → approve or reject people → collect any fee offline. |
| **"Sneha"** — referral enthusiast | S2, S3 | Bring friends in, earn rewards, stay connected. | Invite via contact/WhatsApp/SMS → earn coins → redeem capped voucher → chat and call nearby friends. |

### 4.3 Positioning guardrails

- meelTe is not a generic social feed. It is positioned as a local discovery and connection platform for India.
- It is not a marketplace that sells goods or routes transactions in-app; purchases and event fees settle offline.
- It does not offer a verified-business claim that the product code does not support.
- It does not claim a jobs board or any unverified merchant performance metrics.

---

## 5. Brand Identity & Visual System

*Reflected from [`docs/Design.md`](./docs/Design.md), `AVOID.md`, and `src/app/globals.css`:*

- **Design Anti-Patterns Governance:** Strict adherence to `AVOID.md` to prevent generic AI-slop, gratuitous glowing backgrounds, floating orb gradients, nested cards, and decorative noise.
- **Brand Primary (Mid Purple):** `#6D3BB3`.
- **Brand Primary States:** `#5B2E91` (hover), `#4A247A` (active), plus purple gradient tokens.
- **Accent Amber / Gold:** `#F59E0B`, used for CTA and merchant-facing emphasis.
- **Canvas & Surfaces:** page canvas `#F8F5FF`, cards `#FFFFFF`, purple-tinted shadows (`--shadow-soft`, `--shadow-card`). Decorative orb tokens (`--orb-glow-*`, `--shadow-orb-*`) have been removed from `globals.css`.
- **Typography:** primary body / headings `#1F1F28`, secondary text `#4B5563`, muted text `#9CA3AF` (decorative only).
- **Theme mode:** **Light only**; no dark mode implementation or theme provider.
- **Typography stack:** Geist Sans + Geist Mono.
- **Interactive Primitives:**
  - `Button`: Standardized on `rounded-xl` (`md`/`lg`) and `rounded-lg` (`sm`); arbitrary pill sizes (`pill`, `pillLg`) removed per AVOID.md §6. High-contrast focus rings (`focus-visible:ring-primary/70` at ≈3.6:1 ratio) comply with WCAG 2.2 AA. Supports clean polymorphism via `as={Link}` and `as="a"`.
  - `Badge`: Strict mapping to design tokens (`accent` uses `bg-accent/15 text-accent-foreground border-accent/40`, `success` uses `bg-success-bg text-success border-success-border`).
- **Motion & accessibility:** subtle and purposeful animations, honoring `prefers-reduced-motion`, clear focus rings, skip links, labelled controls, and aria semantics.

---

## 6. Architecture & Engineering Boundaries

### 6.1 Strict constraints
- **No local backend:** no in-repo DB, ORM, database migrations, or persisted session store. `app/api/**` route handlers are permitted for server-only concerns (`AI_RULE.md` §2.1); the only ones that exist are the internal HR auth endpoints at `/api/hr/{login,logout,session}`. There is no customer-facing API surface.
- **Managed data services only:** Supabase and Firebase are both permitted, because both are managed and external. Access them server-side only, through `src/services/`; Server Actions live under `src/utils/<resource>/` (for example `src/utils/ads/load-more-ads.js`). The ownership boundary is `plan.md` **D1**; client-vs-server access is **D2**.
- **Credentials stay server-only:** service-role and service-account keys never reach the browser and are never prefixed `NEXT_PUBLIC_`.
- **External API layer today:** `NEXT_PUBLIC_meelTe_API_BASE_URL` still fronts `/newsletter`, `/contact`, `/inquiries/merchant`, and `/events`. Whether it is retired or kept alongside the CMS is `plan.md` **D3** — do not grow it further until that is decided.
- **Static-first marketing build:** content pages under `(site)` are static and prerendered unless a route genuinely needs fresh server data. The shared-link routes `/ads/[id]` and `/events/[id]` are the deliberate server-only ISR exception and use only the documented read-only Web API client; no public route imports a data SDK.
- **Forms today:** there is no newsletter signup. The unused `newsletter-form.jsx` and its newsletter-only toast copy were removed in Nov 2026. Contact and merchant inquiry CTAs remain honest mailto/phone or placeholder flows until the endpoint exists.
- **Internal HR Portal & CMS boundary:** the `/hr` and `(admin)` route groups are staff-only. They are never linked from public navigation and never presented as a customer web app.
- **Next.js 16 Prerender Determinism & Cache Components:**
  - Client Components must never read unstable clocks (`new Date()`, `Date.now()`) during render; use post-mount effects (`setValue(..., { shouldDirty: false })`) or `useSyncExternalStore` with empty server snapshots to avoid `blocking-prerender-current-time-client` failures.
  - Dynamic routes that read runtime URL state (e.g. `usePathname()`) cannot prerender dynamic segments without opting out via `export const instant = false` inside a Server Component layout segment (`src/app/hr/jobs/[id]/edit/layout.jsx`).
- **UI/UX design discipline:** adhere strictly to `AVOID.md`. Avoid excessive card containers, artificial phone mockups with fake merchants, and arbitrary gradient overlays.

### 6.2 Website mission
1. **Visual clarity & reusable UI:** clean marketing layout, trust cues, and a minimal component system.
2. **Technical SEO & AEO:** metadata, structured data, AI-readable endpoints, and crawlable routes.
3. **Conversion without over-claiming:** send visitors to the app (App Store & Google Play) or to the merchant inquiry path without inventing traffic, numbers, or proof that the app does not show.

### 6.3 Routing & rendering conventions
- Pages are server components by default.
- Client components are used only where interactivity is required: nav, forms, mobile nav, portal state management, and motion-based interactive sections.
- Each page owns its own navigation shell, skip link, and JSON-LD metadata.
- `src/app/` is the App Router entry point. Public routes live in the `(site)` route group, which adds no URL segment. Page-specific components live in `src/components/sections/<route>/` with an `index.js` barrel.
- HR portal components live in `src/components/hr/<module>/` (`candidates/`, `dashboard/`, `jobs/`, `login/`, `shared/`).
- `src/proxy.js` is the Next.js 16 pre-request guard protecting `/hr` and its subpaths.
- `next.config.mjs` enables App Router, Turbopack, Cache Components, and Partial Prefetching; `jsconfig.json` provides `@/*` aliasing.

---

## 7. Tech Stack & Packages

- **Framework:** Next.js 16.4.3 (App Router with Turbopack, Cache Components, Partial Prefetching)
- **Runtime / Language:** React 19.3.0, JavaScript / JSX
- **Styling:** Tailwind CSS v4 and CSS-variable design tokens in `src/app/globals.css`
- **Animation:** `framer-motion@14.7.1`
- **Icons:** `lucide-react@1.62.0`, routed via `src/lib/icons/index.js` and dedicated SVG icon components
- **Interactive primitives:** `@radix-ui/react-accordion@1.3.1`, `@radix-ui/react-dialog@1.3.1`
- **Carousel:** `embla-carousel-react@8.6.0`
- **Rich Text & Sanitization:** `@tiptap/react@3.32.2`, `@tiptap/starter-kit@3.32.2`, `@tiptap/extension-placeholder@3.32.2`, `@tiptap/pm@3.32.2`, `dompurify@3.2.4`
- **Feedback:** `sonner@2.0.8` for toast notifications
- **Utilities & Forms:** `clsx@2.1.1`, `tailwind-merge@3.7.0`, `react-hook-form@7.91.0`, `@hookform/resolvers@6.0.1`, `zod@4.6.7`, `server-only@0.0.1`
- **Data sources:** FAQ content in `src/data/faq.json`, HR mock records in `src/data/hr-mock-data.js`
- **SEO tooling:** per-page metadata helpers and JSON-LD generation in `src/lib/seo/*`
- **OG tooling:** `scripts/generate-og-image.mjs` creates the social preview image
- **Dev tooling:** ESLint 9 (`eslint-config-next@16.4.3`), `@tailwindcss/turbopack@4`, `babel-plugin-react-compiler@1.0.0`

---

## 8. Directory Map

```
nextjs-website/
├── docs/
│   ├── Design.md
│   ├── target_customer.md
│   └── ...
├── public/
│   ├── llms.txt
│   ├── llms-full.txt
│   ├── og-image.png
│   ├── about.md, services.md, faq.md, for-merchants.md, how-it-works.md, coverage.md
│   ├── contact.md, careers.md
│   └── ...
├── scripts/
│   └── generate-og-image.mjs
├── src/
│   ├── proxy.js                      # Next 16 request entry (replaces middleware.js)
│   │                                 # — the sole pre-request guard; owns /hr auth
│   ├── app/
│   │   ├── (site)/                   # route group — resolves to /, no URL segment
│   │   │   ├── about/page.jsx
│   │   │   ├── ads/page.jsx          # live offers grid (API-backed)
│   │   │   ├── ads/[id]/page.jsx     # API-backed shared offer detail
│   │   │   ├── careers/page.jsx
│   │   │   ├── contact/page.jsx
│   │   │   ├── events/[id]/page.jsx  # API-backed shared event detail
│   │   │   ├── faq/page.jsx
│   │   │   ├── for-merchants/page.jsx
│   │   │   ├── how-it-works/page.jsx
│   │   │   ├── privacy/page.jsx
│   │   │   ├── signup/page.jsx
│   │   │   ├── support/page.jsx
│   │   │   ├── terms/page.jsx
│   │   │   └── page.js               # homepage → /
│   │   ├── api/hr/                   # HR auth REST endpoints (internal only)
│   │   │   ├── login/route.js
│   │   │   ├── logout/route.js
│   │   │   └── session/route.js
│   │   ├── hr/                       # internal HR portal (prerendered; dynamic segments partial-prerender)
│   │   │   ├── layout.jsx            # portal layout (sidebar, header, HRContext)
│   │   │   ├── page.jsx              # redirects to /hr/dashboard
│   │   │   ├── dashboard/page.jsx    # HR metrics, recent candidates & jobs cards
│   │   │   ├── jobs/page.jsx         # job requisitions table & filters
│   │   │   ├── jobs/new/page.jsx     # multi-step job creation wizard
│   │   │   ├── jobs/[id]/edit/layout.jsx  # exports `instant = false` (route segment config)
│   │   │   ├── jobs/[id]/edit/page.jsx    # job requisition editor
│   │   │   ├── candidates/page.jsx   # candidate tracking table & modal
│   │   │   └── login/page.jsx        # HR portal login page
│   │   ├── globals.css
│   │   ├── layout.js                 # root layout, wraps (site), (admin), and hr
│   │   ├── manifest.js
│   │   ├── not-found.jsx
│   │   ├── robots.js
│   │   └── sitemap.js
│   ├── components/
│   │   ├── hr/                       # internal HR portal component system
│   │   │   ├── candidates/           # CandidateDetailModal, CandidatesFilterBar, CandidatesTable
│   │   │   ├── dashboard/            # DashboardStats, RecentCandidatesCard, RecentJobsCard
│   │   │   ├── jobs/                 # JobsTable, JobsFilterBar, DeleteJobDialog
│   │   │   │   └── job-form/         # JobMultiStepForm, RichTextEditor, JobStepper, steps, TagInput
│   │   │   ├── login/                # HRLoginForm
│   │   │   └── shared/               # HRSidebar, HRContext, HRBadge
│   │   ├── layout/                   # navbar, mobile-nav, footer, footer-column,
│   │   │                             # store-button, breadcrumbs, container
│   │   ├── sections/                 # one folder per marketing page, each with an index.js barrel
│   │   │   ├── about/  ads/  careers/  common/  contact/
│   │   │   ├── events/  for-merchants/  home/  how-it-works/  signup/
│   │   └── ui/                       # button, badge, card, app-action-dialog, etc.
│   ├── config/
│   ├── constants/                    # api-constants, app-constants, faq-constants, service-constants
│   ├── data/                         # faq.json, hr-mock-data.js
│   ├── lib/
│   │   ├── display-name.js
│   │   ├── sanitize-html.js          # DOMPurify HTML sanitizer for rich text review/preview
│   │   ├── share-link.js
│   │   ├── toast-feedback.js
│   │   ├── utils.js
│   │   ├── icons/
│   │   └── seo/
│   ├── services/
│   │   ├── hr/                       # internal HR portal auth
│   │   │   ├── index.js              # barrel — re-exports login/session surface
│   │   │   ├── login.js              # loginHr + getClientIdentifier
│   │   │   ├── password.js           # verifyPassword + safeStringCompare
│   │   │   ├── rate-limit.js         # per-process sliding window limiter
│   │   │   └── session.js            # cookie issue/read/clear, 8h TTL
│   │   └── supabase-services/        # ads/events read services
│   ├── utils/
│   │   ├── fetch-json.js
│   │   ├── ads/                      # load-more-ads.js
│   │   ├── events/                   # load-more-events.js
│   │   └── hr/                       # auth-crypto.js, env.js, session-cookie.js
│   └── validation/
│       ├── ads/                      # ads-cursor-validation.js
│       ├── contacts/                 # contact-validation.js
│       ├── events/                   # events-cursor-validation.js
│       └── hr/                       # auth-validation.js, job-validation.js
├── .agents/skills/
├── .opencode/agents/
├── .github/agents/
├── AGENTS.md
├── AI_RULE.md
├── AVOID.md
├── plan.md
├── folder-structure.md
├── project-context.md
├── meelTe-context.md
├── README.md
├── next.config.mjs
├── jsconfig.json
├── eslint.config.mjs
├── package.json
├── package-lock.json
├── .env.example
└── ...
```

---

## 9. Current Status & Progress

**Completed routes (all static or partial-prerender, metadata + JSON-LD in place):**

| Route | Purpose | Schema |
| :--- | :--- | :--- |
| `/` | Unified discovery page: live local offers (Ads default) and community events with accessible segmented toggle; parallel server fetch (`listPublicAds` + `listPublicEvents`); previous marketing sections parked | CollectionPage |
| `/about` | Mission, story, vision, why meelTe | AboutPage + BreadcrumbList |
| `/how-it-works` | Resident path, three roles, honest limits, FAQ | HowTo + ItemList + FAQPage + BreadcrumbList |
| `/for-merchants` | Merchant landing, onboarding, FAQ, inquiry CTA | HowTo + Service + FAQPage + BreadcrumbList |
| `/faq` | Categorized FAQ page over `src/data/faq.json` with search & filters | FAQPage + BreadcrumbList |
| `/careers` | Company recruitment page | BreadcrumbList |
| `/contact` | Contact support / office info + form | ContactPage + BreadcrumbList |
| `/signup` | App download / onboarding page | BreadcrumbList |
| `/support` | Support desk with direct email & helpline actions | BreadcrumbList |
| `/privacy` | Privacy policy | BreadcrumbList |
| `/terms` | Terms & Conditions | BreadcrumbList |
| `/ads` | 308 permanent redirect to `/` (Offers discovery consolidated on homepage) | Redirect (308) |
| `/ads/{id}` | Public app-shared offer detail from the read-only Web API | Product + BreadcrumbList |
| `/events` | Live community events grid (1/2/3-column) over read-only Web API, 20 per page with "load more" Server Action | CollectionPage + BreadcrumbList |
| `/events/{id}` | Public app-shared event detail from the read-only Web API | Event + BreadcrumbList |
| `/hr/login` | HR authentication portal: email + password with rate limiting | Internal / NoIndex |
| `/hr/dashboard` | HR metrics overview, recent candidates & job requisitions | Internal / Protected |
| `/hr/jobs` | Job requisitions management table, search, filters & actions | Internal / Protected |
| `/hr/jobs/new` | Multi-step job posting wizard with rich text editor & autosave | Internal / Protected |
| `/hr/jobs/[id]/edit` | Dynamic job editing flow with `export const instant = false` | Internal / Protected |
| `/hr/candidates` | Candidate applications tracker with search, filters & detail modal | Internal / Protected |

**Recent Milestones & Refactors (Early Nov 2026):**
- **Homepage Discovery Unification (Ads / Events) (Nov 5 2026):**
  - **Unified `/` Discovery Surface:** Made `/` the consolidated local discovery page with a compact segmented toggle (`DiscoveryToggle`) switching between live shop offers (default) and community events (`DiscoverySwitch`). Data is fetched in parallel via `Promise.allSettled([listPublicAds, listPublicEvents])` inside a Suspense boundary in the static shell. Emits `CollectionPage` schema for the rendered offers.
  - **Parked Marketing Sections:** Unmounted narrative sections (`HeroSection`, `HyperlocalDifferenceSection`, `HomeJourneySection`, `ProductExperienceSection`, `TrustBoundariesSection`, `HomeFaq`) from `/`, preserving them in `src/components/sections/home/` for future reference while the narrative remains served by `/about`, `/how-it-works`, `/for-merchants`, and `/faq`.
  - **Route & Navigation Cleanup:** Removed Ads and Events from desktop navbar and mobile drawer; permanently 308-redirected `/ads` to `/`; updated footer `Ads` link to `/`; updated `/ads/[id]` detail breadcrumbs and back links; updated `public/llms.txt` and `public/llms-full.txt` to remove obsolete `/discover` URLs.
- **Internal HR Portal Implementation (`/hr`):**
  - **Secure Auth Pipeline:** Implemented `/hr/login` with `HRLoginForm`, backed by Web Crypto HS256 tokens (`auth-crypto.js`), sliding-window IP rate limiting (`rate-limit.js`, 5 failed attempts per 15 min), and an 8-hour session cookie (`hr_session`). `src/proxy.js` intercepts all `/hr` subpaths, seamlessly redirecting unauthenticated requests to login while routing authenticated staff to `/hr/dashboard`.
  - **Comprehensive HR Dashboard & Metrics:** Built `DashboardStats` showing active requisitions, candidate pipeline counts, pending reviews, and hiring rates. Integrated `RecentCandidatesCard` and `RecentJobsCard` with live status badges.
  - **Full Candidate Management Workflow:** Developed `CandidatesTable`, `CandidatesFilterBar`, and `CandidateDetailModal` (dialog drawer supporting stage transitions: Applied, Reviewing, Shortlisted, Interviewed, Offered, Hired, Rejected; resume viewing; and note taking).
  - **Multi-Step Job Requisition Wizard (`/hr/jobs/new` & `.../[id]/edit`):** Created 4-step wizard (`JobMultiStepForm`, `JobStepper`, `StickyActionBar`): Step 1 Basics (title, department, employment type, experience), Step 2 Location & Pay (workplace type, salary ranges, application deadline, openings), Step 3 Details (rich-text requirements and responsibilities via Tiptap and tag input for skills), Step 4 Review & Preview with sanitized HTML rendering via `DOMPurify` (`sanitize-html.js`). Features automatic draft recovery from localStorage and draft clearance on submit.
- **Next.js 16 Cache Components & Prerender Determinism Build Fixes (Nov 5 2026):**
  - Resolved `blocking-prerender-current-time-client` on `/hr/jobs/new`: `getInitialJobFormValues()` in `job-validation.js` now initializes pure clock-free defaults (`deadline: ""`), deferring the today+30 day suggested default to a mount effect (`setValue(..., { shouldDirty: false })`) to protect static prerender and avoid tripping unsaved-changes dirty flags.
  - Resolved dynamic date hydration constraints in `StepLocationPay`: wrapped deadline minimum constraints in `useSyncExternalStore` with an empty server snapshot, eliminating `setState`-in-effect compiler violations and hydration mismatches.
  - Resolved `blocking-prerender-client-hook` on dynamic `/hr/jobs/[id]/edit`: because `usePathname()` cannot resolve dynamic segments during prerender, added pass-through Server Component layout `src/app/hr/jobs/[id]/edit/layout.jsx` exporting `export const instant = false`, allowing routes to build safely as partial-prerender pages while `src/proxy.js` enforces auth.
- **Dependency Hygiene & Vercel CI Alignment:**
  - Resolved build module resolution requirements by adding `@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/extension-placeholder`, `@tiptap/pm`, and `dompurify` directly to `dependencies` in `package.json` and synchronizing `package-lock.json` to prevent `npm ci` failures in production CI environments.
- **iOS App Store & Google Play Parity:** Dual-store buttons, metadata, and schema `operatingSystem` aligned across `site.js` and all page touchpoints.
- **UI/UX Anti-Pattern & AI-Slop Cleanup (`AVOID.md`):** Homepage hero, capability previews, support desk, 404 page, and detail pages cleaned of generic decorative orbs, fake device chassis, and arbitrary gradients. Standardized `Button` and `Badge` primitives on strict tokens.

---

## 10. Active Tasks & Next Steps

1. **Verify Cloud CI Deployments:** Ensure Vercel build pipelines with `npm ci` execute cleanly with all recently locked dependencies (`@tiptap/*`, `dompurify`, `server-only`).
2. **Database + CMS restructuring (Phase 2):** Progress through [`plan.md`](./plan.md) decisions **D1** (Supabase vs Firebase ownership), **D2** (client vs server access), and **D6** (launch collections) before wiring live CMS collections.
3. **Wire forms to managed data layer:** Await confirmation on `plan.md` **D3** (`NEXT_PUBLIC_meelTe_API_BASE_URL` retirement or retention) before wiring contact and merchant inquiry forms to external production endpoints.
4. **Confirm business claims:** Revisit "0% commission", direct-contact claims, merchant pricing model, and verify all copy against product facts in `docs/target_customer.md`.
5. **Tokenize remaining semantic-pass colors:** Reconcile JS mirror `BRAND_COLORS` in `app-constants.js` with CSS tokens in `globals.css` and map raw palette utilities.
6. **Continuous AVOID.md compliance:** Keep all future portal and marketing components free of gratuitous decorations, nested cards, or AI-slop patterns.

---

## 11. Environment & Setup Notes

- **Package manager:** `npm`.
- **Development command:** `npm run dev`
- **Build command:** `npm run build`
- **Start command:** `npm run start`
- **Lint command:** `npm run lint`
- **Node version:** Next.js 16 + React 19, Node 20+ recommended.
- **Local environment variables:** keep `.env` local and never print secrets. At minimum, the site expects `NEXT_PUBLIC_SITE_URL`, external API base URL, and HR portal credentials (`HR_EMAIL`, `HR_PASSWORD_HASH`, `HR_SESSION_SECRET`).
- **Determinism:** static routes must not depend on runtime-generated dates or random values.
- **OG image regeneration:** use `node scripts/generate-og-image.mjs` to refresh the asset.

---

## 12. Key Decisions & Constraints

1. **Marketing site + internal HR portal + future CMS only.** No in-repo database or ORM. Data lives in Supabase and Firebase, reached server-side through `src/services/`. The only `app/api/**` routes are the internal HR auth endpoints; there is no customer-facing auth flow and no customer-facing web app.
2. **Pre-request guarding via `src/proxy.js`:** Next.js 16 deprecates `middleware.js`; `src/proxy.js` is the sole pre-request router and gate for `/hr`.
3. **Cache Components & SSG determinism:** Pure initializers for Client Component forms during render; seed dynamic values post-mount with `{ shouldDirty: false }`. Dynamic layout segments use `export const instant = false`.
4. **HTML Sanitization boundary:** All rich text content rendered in review and preview modes must be sanitized via `DOMPurify` (`src/lib/sanitize-html.js`).
5. **No fabricated claims.** Keep all claims traceable to product evidence or explicit business sign-off.
6. **Careers ≠ jobs board.** The `/careers` page is company recruitment, not a marketplace jobs board.
7. **Single source of truth for brand metadata:** `src/config/site.js`, `src/constants/*`, `src/lib/seo/*`, and `src/data/faq.json`.
8. **Strict adherence to AVOID.md:** No generic AI templates, floating blobs, glowing orbs, or nested card spam.
9. **Consistent Primitive APIs:** `Button` uses `rounded-xl`/`rounded-lg` with `ring-primary/70` and polymorphism (`as={Link}` or `as="a"`); `Badge` maps to tokens.
10. **JS/JSX only** unless a later decision explicitly broadens the architecture.

---

## 13. Known Issues & Gotchas

- **Vercel `npm ci` Dependency Synchronization:** Whenever new packages are added (such as `@tiptap/*` or `dompurify`), both `package.json` and `package-lock.json` must be strictly synchronized and committed to prevent `Module not found` failures during cloud CI installations.
- **Cache Components prerender clock restrictions:** Never call `new Date()` or `Date.now()` during render of Client Components; use post-mount effects (`setValue(..., { shouldDirty: false })`) or `useSyncExternalStore` with empty server snapshots.
- **Dynamic segment prerendering:** Client layouts calling `usePathname()` cannot prerender dynamic routes unless guarded by `export const instant = false` in a Server Component layout segment (`src/app/hr/jobs/[id]/edit/layout.jsx`).
- **Unverified merchant claims:** pricing, fees, and "0% commission" language must be treated as pending business confirmation.
- **Button primitive polymorphism:** use `as={Link}` or `as="a"` on `Button` rather than `asChild`.
- **Static-only marketing site:** do not assume a browser-based app is live; the site should consistently frame the web surface as a landing and marketing layer for the mobile app.
- **Windows / Turbopack restart issues:** stale module graphs after refactors are a known local-development issue; restarting the dev server is often the fastest fix.
