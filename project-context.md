# Project Context: Meelte (Next.js Visual & SEO Website)

> **Last Updated:** October 30, 2026  
> **Read before any change:** [`docs/target_customer.md`](./docs/target_customer.md), this file, [`meelte-context.md`](./meelte-context.md), and [`docs/Design.md`](./docs/Design.md) — all four, in full. See `AGENTS.md` Step 0.  
> **Source of Truth:** Compiled from [`docs/target_customer.md`](./docs/target_customer.md), [`docs/Design.md`](./docs/Design.md), [`meelte-context.md`](./meelte-context.md), and the current repo structure and decisions.

---

## 1. Product Overview & Identity

- **Brand:** **Meelte** (Meelte Private Limited / Meelte Technologies).
- **Repository:** `nextjs-website` (preferred project identity: `meelte-nextjs-web`).
- **Live site:** `https://meelte.com` (`APP_URL` from `NEXT_PUBLIC_SITE_URL`).
- **Product Type:** Community-driven hyper-local discovery, connection, and commerce platform.
- **Core Value Proposition:** *"Discover Opportunities. Build Connections. Create Experiences. Grow Local."*
- **Primary Geographic Focus:** India, with operational hubs in **Bengaluru, Gaya, and Ranchi** and an active pan-India expansion narrative.
- **Product Availability:** The **Android app is live on Google Play** (`com.meelte.classico`). The **web app is "coming soon"** — never imply the full web app already exists.
- **Platform Ecosystem:** Flutter mobile app + dedicated external backend (Firebase / Cloud APIs) + this **Next.js visual + technical SEO marketing website**.
- **Website Goal:** Explain the platform honestly, build brand credibility, and drive clear conversion paths for residents and merchants without claiming more than the product evidence supports.
- **Current Goal (Oct 2026):** stabilize the marketing site, close route/link parity gaps, confirm the remaining business claims and legal sign-off, and wire the live form endpoints only after the backend is actually ready.

---

## 2. Core Mission & Problem Solved

Meelte addresses four core friction points in Indian local discovery:
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

*Derived from [`docs/target_customer.md`](./docs/target_customer.md), which audits the Flutter app, Supabase migrations, edge functions, public web pages, and the app Terms & Conditions. Meelte is a **two-sided hyperlocal marketplace**: consumers come for nearby offers and events, while merchants and hosts come to reach those consumers.*

### 4.1 Segment map

| Segment | Who they are | What they need | Evidence in the product |
| :--- | :--- | :--- | :--- |
| **P1 Local consumers ("nearby discoverers")** | Smartphone users in India aged **13+** looking for offers, shops, and things to do close by. | Know what is nearby, trust the price, and get there easily. | Distance-sorted feeds, date-based offers, ₹ pricing, directions, follows, chat, and calls. |
| **P2 Local merchants ("shopkeepers")** | Independent shops, restaurants, and service businesses. | Cheap, simple local reach and repeat customers. | Shop ads, menu/photo import, AI product image help, follower notifications, in-person onboarding. |
| **S1 Community event hosts** | Individuals and small organisers running meetups or events. | Fill an event with the right people and control who joins. | Event creation, join approvals, group sizes, attendee removal, follower notifications. |
| **S2 Referral-driven early adopters ("reward seekers")** | Users motivated by coins and Amazon vouchers. | A tangible reward for inviting friends. | Referral codes, contacts/WhatsApp/SMS invites, milestone rewards, ₹100 / ₹500 voucher redemption. |
| **S3 Social connectors** | Users mainly interested in nearby conversations and connection. | Meet and talk to people nearby safely. | Friends, chat, location sharing, voice/video calls; people discovery is still not the headline feature. |

- **Web-only visitors:** people opening a shared `/ad/` or `/event/` link without the app, users deleting their account via `acc-dlt.html`, and policy readers on privacy/terms/child-safety pages.
- **Internal users (not customers):** field-acquisition staff, supervisors, HR, accounts, and admins in the separate admin panel. They matter only where their work shapes customer experience.

### 4.2 Illustrative personas

| Persona | Segment | Goal | Typical journey |
| :--- | :--- | :--- | :--- |
| **"Riya"** — deal-seeking resident | P1 | Find good offers and something to do nearby this weekend. | Install via referral or shared ad → phone OTP / Google sign-up → allow location → filter by category and distance → open a dated, priced offer → tap Directions and follow the shop. |
| **"Imran"** — neighbourhood shop owner | P2 | More walk-ins with low effort. | Field agent signs him up → creates a shop ad → imports menu photo → edits pricing and dates → publishes ad → follows likes/comments and repeats next offer. |
| **"Aman"** — community host | S1 | Run a meet-up or workshop with manageable turnout. | Create event → share link → review join requests → approve or reject people → collect any fee offline. |
| **"Sneha"** — referral enthusiast | S2, S3 | Bring friends in, earn rewards, stay connected. | Invite via contact/WhatsApp/SMS → earn coins → redeem capped voucher → chat and call nearby friends. |

### 4.3 Positioning guardrails

- Meelte is not a generic social feed. It is positioned as a local discovery and connection platform for India.
- It is not a marketplace that sells goods or routes transactions in-app; purchases and event fees settle offline.
- It does not offer a verified-business claim that the product code does not support.
- It does not claim a jobs board or any unverified merchant performance metrics.

---

## 5. Brand Identity & Visual System

*Reflected from [`docs/Design.md`](./docs/Design.md) and `src/app/globals.css`:*

- **Brand Primary (Mid Purple):** `#6D3BB3`.
- **Brand Primary States:** `#5B2E91` (hover), `#4A247A` (active), plus purple gradient tokens.
- **Accent Amber / Gold:** `#F59E0B`, used for CTA and merchant-facing emphasis.
- **Canvas & Surfaces:** page canvas `#F8F5FF`, cards `#FFFFFF`, purple-tinted shadows.
- **Typography:** primary body / headings `#1F1F28`, secondary text `#4B5563`, muted text `#9CA3AF` (decorative only).
- **Theme mode:** **Light only**; no dark mode implementation or theme provider.
- **Typography stack:** Geist Sans + Geist Mono.
- **Motion & accessibility:** reduce motion via `prefers-reduced-motion`, clear focus rings, skip links, labelled controls, and aria semantics.

---

## 6. Architecture & Engineering Boundaries

### 6.1 Strict constraints
- **No local backend:** no DB, ORM, session store, or local `app/api/**` route handlers.
- **Dedicated external backend:** dynamic leads, newsletter actions, and any future app data stay in the external system behind `NEXT_PUBLIC_MEELTE_API_BASE_URL`.
- **Static-first marketing build:** content pages are static and prerendered unless a future route genuinely needs fresh server data.
- **Forms today:** the newsletter form is live; contact and merchant inquiry CTAs remain honest mailto or placeholder flows until the backend endpoint exists.

### 6.2 Website mission
1. **Visual clarity & reusable UI:** clean marketing layout, trust cues, and a minimal component system.
2. **Technical SEO & AEO:** metadata, structured data, AI-readable endpoints, and crawlable routes.
3. **Conversion without over-claiming:** send visitors to the app or to the merchant inquiry path without inventing traffic, numbers, or proof that the app does not show.

### 6.3 Routing & rendering conventions
- Pages are server components by default.
- Client components are used only where interactivity is required: nav, forms, mobile nav, and motion-based hero sections.
- Each page owns its own navigation shell, skip link, and JSON-LD metadata.
- `src/app/` is the App Router entry point; route-level components are colocated in `_components/` folders when relevant.
- `next.config.mjs` enables the App Router and Tailwind Turbopack integration; `jsconfig.json` provides `@/*` aliasing.

---

## 7. Tech Stack & Packages

- **Framework:** Next.js 16.4.3 (App Router)
- **Runtime / Language:** React 19.3.0, JavaScript / JSX
- **Styling:** Tailwind CSS v4 and CSS-variable design tokens in `src/app/globals.css`
- **Animation:** `framer-motion@14.7.1`
- **Icons:** `lucide-react`, routed via `src/lib/icons/index.js`
- **Interactive primitives:** `@radix-ui/react-accordion`, `@radix-ui/react-dialog`
- **Feedback:** `sonner` for toast notifications
- **Utilities:** `clsx`, `tailwind-merge`, `react-hook-form`, `@hookform/resolvers`, `zod`
- **Data source:** FAQ content in `src/data/faq.json`, re-exported via constants modules
- **SEO tooling:** per-page metadata helpers and JSON-LD generation in `src/lib/seo/*`
- **OG tooling:** `scripts/generate-og-image.mjs` creates the social preview image
- **Dev tooling:** ESLint + Next.js config

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
│   ├── app/
│   │   ├── about/
│   │   ├── careers/
│   │   ├── contact/
│   │   ├── discover/
│   │   ├── faq/
│   │   ├── for-merchants/
│   │   ├── how-it-works/
│   │   ├── privacy/
│   │   ├── signup/
│   │   ├── support/
│   │   ├── terms/
│   │   ├── globals.css
│   │   ├── layout.js
│   │   ├── manifest.js
│   │   ├── not-found.jsx
│   │   ├── page.js
│   │   ├── robots.js
│   │   └── sitemap.js
│   ├── components/
│   │   ├── layout/
│   │   ├── sections/
│   │   ├── footer/
│   │   └── ui/
│   ├── config/
│   ├── constants/
│   ├── data/
│   ├── lib/
│   └── services/
├── .agents/skills/
├── .opencode/agents/
├── .github/agents/
├── AGENTS.md
├── AI_RULE.md
├── project-context.md
├── meelte-context.md
├── README.md
├── CLAUDE.md
├── gemini.md
├── next.config.mjs
├── jsconfig.json
├── eslint.config.mjs
├── package.json
├── package-lock.json
├── .env.example
└── ...
```

> Note: `visual.md` and `homepage-plan.md` are not source-of-truth and are not relied on. Visual direction lives in `docs/Design.md`, `meelte-context.md`, and the token definitions in `src/app/globals.css`.

---

## 9. Current Status & Progress

**Completed routes (all static, metadata + JSON-LD in place):**

| Route | Purpose | Schema |
| :--- | :--- | :--- |
| `/` | Homepage: resident-first hero, product walkthrough, FAQ teaser, dual-audience CTA | FAQPage |
| `/about` | Mission, story, vision, why Meelte | AboutPage + BreadcrumbList |
| `/how-it-works` | Product roles, walkthrough, trust, FAQ | HowTo + ItemList + BreadcrumbList |
| `/for-merchants` | Merchant landing, onboarding, FAQ, inquiry CTA | HowTo + Service + FAQPage + BreadcrumbList |
| `/discover` | Capability explainer: offers / events / people | CollectionPage + FAQPage + BreadcrumbList |
| `/faq` | FAQ page over `src/data/faq.json` | FAQPage + BreadcrumbList |
| `/careers` | Company recruitment page | BreadcrumbList |
| `/contact` | Contact support / office info + form | ContactPage + BreadcrumbList |
| `/signup` | App download / onboarding page | BreadcrumbList |
| `/support` | Support desk | BreadcrumbList |
| `/privacy` | Privacy policy | BreadcrumbList |
| `/terms` | Terms & Conditions | BreadcrumbList |

**Shared infrastructure delivered:**
- Brand tokens, light-only visual system, and reduced-motion support.
- Shared UI primitives and a consistent page shell.
- Centralised FAQ copy and FAQ JSON-LD generation.
- Static sitemap, robots file, and llms endpoints.
- Root SEO graph and per-page metadata helpers.
- `npm run build` is the current milestone gate; the site is prerendered and static.

---

## 10. Active Tasks & Next Steps

1. **Route parity and broken links:** fix the `/case-studies` references that currently 404.
2. **Add the missing OG regeneration script alias:** keep docs and package scripts aligned (`node scripts/generate-og-image.mjs` is the reliable path today).
3. **Wire forms to the external backend:** only do this when the API contract is stable and the business owner is ready.
4. **Confirm business claims:** revisit “0% commission”, direct-contact claims, merchant price model, and any wording that has not been verified in the product code.
5. **Legal review:** ensure privacy and terms copy is owner-approved and dates remain accurate.
6. **Analytics and tracking:** implement only when a clear tracking requirement exists; do not add placeholder instrumentation.
7. **Cleanup:** remove or adopt unused dependencies and keep the project free of stale, unapproved references.

---

## 11. Environment & Setup Notes

- **Package manager:** `npm`.
- **Development command:** `npm run dev`
- **Build command:** `npm run build`
- **Start command:** `npm run start`
- **Lint command:** `npm run lint`
- **Node version:** Next.js 16 + React 19, Node 20+ recommended.
- **Local environment variables:** keep `.env` local and never print secrets. At minimum, the site expects the public site URL and external backend base URL; analytics / verification IDs should only be added when required.
- **Determinism:** static routes must not depend on runtime-generated dates or random values.
- **OG image regeneration:** use `node scripts/generate-og-image.mjs` to refresh the asset; the public image is a committed artifact that must remain consistent with the design tokens.

---

## 12. Key Decisions & Constraints

1. **Marketing site only.** No local DB, auth flow, or local API layers.
2. **No fabricated claims.** Keep all claims traceable to product evidence or explicit business sign-off.
3. **Careers ≠ jobs board.** The `/careers` page is company recruitment, not a marketplace jobs board.
4. **Single source of truth for brand metadata:** `src/config/site.js`, `src/constants/*`, `src/lib/seo/*`, and `src/data/faq.json`.
5. **Plain, honest copy wins over marketing filler.** Avoid repeated claims and invented metrics.
6. **All structured data must match rendered content.** Do not add schema just because a type exists in the codebase.
7. **Do not reintroduce mock data as if it were live product data.** Anything shown on the marketing site must be clearly conceptual or must match real product evidence.
8. **JS/JSX only** unless a later decision explicitly broadens the architecture.

---

## 13. Known Issues & Gotchas

- **Broken `/case-studies` navigation:** still present in some nav config and should be removed or replaced with a real route.
- **OG script alias mismatch:** documentation mentions `npm run og:image`, but the package scripts do not currently define it. Use the direct Node command instead.
- **Unverified merchant claims:** pricing, fees, and “0% commission” language must be treated as pending business confirmation.
- **Root layout shell rule:** every page must import and render the required shell pieces itself; the root layout is not a page wrapper.
- **Static-only marketing site:** do not assume a browser-based app is live; the site should consistently frame the web surface as a landing and marketing layer for the mobile app.
- **Dependency drift:** some form-related packages are installed but not currently used in the live flow; remove or adopt as appropriate.
- **Windows / Turbopack restart issues:** stale module graphs after refactors are a known local-development issue; restarting the dev server is often the fastest fix.
