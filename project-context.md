# Project Context: Meelte (Next.js Visual & SEO Website)

> **Last Updated:** October 29, 2026  
> **Read before any change:** [`docs/target_customer.md`](./docs/target_customer.md), this file, [`meelte-context.md`](./meelte-context.md), and [`docs/Design.md`](./docs/Design.md) — all four, in full. See `AGENTS.md` Step 0.  
> **Source of Truth:** Compiled from [`docs/target_customer.md`](./docs/target_customer.md), [`docs/Design.md`](./docs/Design.md), [`meelte-context.md`](./meelte-context.md), and project architectural directives.

---

## 1. Product Overview & Identity

- **Brand:** **Meelte** (Meelte Private Limited / Meelte Technologies).
- **Repository:** `nextjs-website` (preferred project identity: `meelte-nextjs-web`).
- **Live site:** `https://meelte.com` (`APP_URL` from `NEXT_PUBLIC_SITE_URL`).
- **Product Type:** Community-driven hyper-local discovery, connection, and commerce platform.
- **Core Value Proposition:** *"Discover Opportunities. Build Connections. Create Experiences. Grow Local."*
- **Primary Geographic Focus:** India, with operational hubs in **Bengaluru, Gaya, and Ranchi** and an active pan-India expansion narrative.
- **Product Availability:** The **Android app is live on Google Play** (`com.meelte.classico`). The **web app is "coming soon"** — never imply the full web app already exists.
- **Platform Ecosystem:** Flutter mobile app + dedicated external backend (Firebase/Cloud APIs) + this **Next.js Visual & Technical SEO Marketing Website**.
- **Website Goal:** Rebuild the marketing site for clarity, conversion, and organic growth — explaining the platform honestly while presenting the company as credible.
- **Current Goal (Oct 2026):** all twelve marketing routes are built, prerendered, and SEO-complete; remaining work is closing route/link parity gaps, wiring the forms to the external backend when endpoints exist, and finishing legal/asset sign-off.

---

## 2. Core Mission & Problem Solved

Meelte was founded to solve critical hyper-local pain points:
1. **Information Overload:** Traditional global social networks overwhelm users with irrelevant, distant content.
2. **Fleeting Local Opportunities:** High-value local offers, garage sales, and community gatherings often disappear before neighbors discover them.
3. **Urban Isolation / Relocation Friction:** When individuals relocate to a new city (such as tech newcomers in Bengaluru), finding like-minded people with shared languages, culture, and interests is difficult.
4. **Local Merchant Visibility:** Small neighborhood businesses (cafes, boutiques, clinics, service providers) cannot afford expensive, untargeted ad platforms and face heavy delivery middleman fees.

The brand story on `/about` is grounded in two real experiences: a local offer lost to a phone call, and struggling to find culturally similar people after moving to a new city.

---

## 3. The 4 Product Pillars

1. **Discover:** Hyper-local search across 5 core categories:
   - **Food** (local dining, artisan food, neighborhood specialties)
   - **Fashion** (local boutiques, apparel, accessories)
   - **Events** (meetups, workshops, cultural festivals, sports)
   - **Services** (home services, repairs, professional assistance)
   - **Health** (clinics, fitness, wellness centers)
2. **Connect:** Social feature helping residents build meaningful relationships with peers sharing language, culture, hobbies, and goals.
3. **Create:** Empowering neighborhood organizers, clubs, and hosts to organize and publish community events.
4. **Grow (Commerce):** Giving local SMBs and shopkeepers a platform to promote products and services directly to nearby consumers with **0% commission** and direct phone/WhatsApp contact. *(Site copy today; merchant pricing and direct-contact handling are unconfirmed in the product code — see §13.)*

> **There is no local jobs board.** `docs/target_customer.md` finds no hiring feature, and the jobs copy, `/jobs` route, `JobsPreview`, and `getJobPostingJsonLd()` are all gone. The `/careers` page is **company recruitment** (working at Meelte, `HR_EMAIL` mailto handoff) and must never be presented as a local hiring feature for app users.

---

## 4. Target Customers & Personas

*Derived from [`docs/target_customer.md`](./docs/target_customer.md), which audits the Flutter app, Supabase migrations and edge functions, public web pages, and the in-app Terms & Conditions. Meelte is a **two-sided hyperlocal marketplace**: consumers come for nearby offers and events, merchants and hosts come to reach those consumers.*

### 4.1 Segment map

| Segment | Who they are | What they need | Evidence in the product |
| :--- | :--- | :--- | :--- |
| **P1 Local consumers ("nearby discoverers")** | Smartphone users in India aged **13+** looking for offers, shops, and things to do close by. | Know what is on nearby right now, trust the price, get there easily. | Distance-sorted feeds (default **60 km** radius), ₹ pricing, discount badges, one-tap Google Maps directions, follow-a-shop updates, friends/chat/calls. |
| **P2 Local merchants ("shopkeepers")** | Independent shops, restaurants, and service businesses wanting local visibility without running digital marketing. | Cheap, simple local reach; show the whole menu or stock; repeat customers. | Shop ads with up to 100 products, menu-photo import (AI vision), AI product images, discount formats, follower notifications, **in-person field onboarding**. |
| **S1 Community event hosts** | Individuals, clubs, and small organisers running local gatherings, activities, or paid meet-ups. | Fill an event with the right people, control who joins, plan for group sizes. | Event creation, ₹ joining cost, public/private visibility, approval-based join requests with group size, remove attendees, follower notifications. |
| **S2 Referral-driven early adopters ("reward seekers")** | Users motivated to invite friends in exchange for coins and Amazon vouchers. | A tangible reward for referrals. | Referral codes, invites via contacts/WhatsApp/SMS, 30-coin signup and referral bonuses, 10/50/100 milestones, ₹100/₹500 voucher redemption (**₹500 lifetime cap**). |
| **S3 Social connectors** | Users who mainly want to meet and talk to people nearby. | Meet and talk to people around them safely. | Friends, follows, 1:1 chat (text/emoji/documents/location), Agora audio-video calls, block and report. *(People discovery is still "coming soon".)* |

- **Web-only visitors** (today's thin web surface): people opening a shared `/ad/` or `/event/` link without the app (routed to a download page), users deleting their account via `acc-dlt.html`, and policy readers (parents, app-store reviewers, partners) on the privacy, terms, and child-safety pages.
- **Internal users (not customers, out of website scope):** field-acquisition staff, supervisors, HR, accounts, and admins in the separate admin panel — they moderate content, verify referrals and merchants, manage city zones, and process payouts. They matter only where their work shapes the customer experience (e.g. in-person onboarding).

### 4.2 Illustrative personas

*Names and personal details are illustrative; goals and journeys are taken from the product.*

| Persona | Segment | Goal | Typical journey |
| :--- | :--- | :--- | :--- |
| **"Riya"** — deal-seeking resident | P1 | Find good offers and something to do nearby this weekend. | Installs from a shared ad or referral → phone OTP / Google sign-up (30 coins) → allows location (ads tab only inside an active city zone) → filters by category and distance → opens a dated, priced ad → taps Directions, shares, follows the shop → notified on updates. |
| **"Imran"** — neighbourhood shop/restaurant owner | P2 | More walk-ins at low cost and effort. | A field agent signs him up with their referral code → creates a shop ad, photographs the menu, "Import from Photos" fills names and prices, AI generates missing product photos → sets discount and date range, pins location → ad goes live at midnight (may be admin-reviewed) → watches likes/comments, repeats next offer. |
| **"Aman"** — community event host | S1 | Run a meet-up, game, or workshop with a manageable headcount. | Creates the event (category, ₹ cost, time, cover, location, public/private) → shares the link → reviews "Request to Join" entries with group sizes → approves, rejects, or removes → collects any fee offline. |
| **"Sneha"** — referral enthusiast / social connector | S2, S3 | Bring friends on, earn rewards, stay in touch. | Invites via contacts/WhatsApp/SMS → 30 coins per referral, tracks milestones → completes profile, redeems ₹100/₹500 (₹500 cap) → chats, shares location, calls friends. |

### 4.3 Value proposition by segment

| Segment | Why they choose Meelte | Strength of evidence |
| :--- | :--- | :--- |
| **P1 Local consumers** | One place to see what is on offer and happening **near me, right now** — dated, priced deals and joinable events with directions, plus chat and calls in the same app. | Strong |
| **P2 Merchants** | Local visibility with almost no effort: catalogue from a menu photo, AI product images, follower notifications, and a person who sets it up in person. | Strong on features; **cost to merchant unconfirmed** (no pricing in code) |
| **S1 Event hosts** | Controlled attendance and local reach without building ticketing. | Moderate (no payments or check-in) |
| **S2 Reward seekers** | Real rewards for inviting friends (Amazon vouchers). | Strong but time-limited (₹500 lifetime cap) |
| **S3 Social connectors** | Chat, location sharing, and voice/video calls with people met through local content. | Weak to moderate (people discovery unbuilt) |

**Positioning in one line:** a hyperlocal "discover and connect" app for Indian cities — more relevant than generic social feeds (distance + time-boxed offers), more social than listing directories. Its defensible edge is **in-person merchant acquisition**. In-app tagline: *"Real Reach • Real Rapport."*

**What Meelte is not:** it does not sell goods, run events, take payments, or broker transactions — purchases and event fees settle offline between the two parties.

### 4.4 Open questions for the business team

1. **Revenue model** — do merchants or hosts pay, and for what? No paid placement, subscription, commission, or in-app purchase exists in the product code.
2. **Launch cities and active ad zones** — the product repo only confirms a Gaya, Bihar legal jurisdiction.
3. **Core age group** — only a 13+ floor is enforced.
4. **Scope of hosts and brands** — professional organisers and larger brands, or local independents only?
5. **Merchant success metrics** — no reach, views, or footfall analytics exist yet.

---

## 5. Brand Identity & Visual System

*Reflected from [`docs/Design.md`](./docs/Design.md) and `src/app/globals.css`:*

- **Brand Primary (Mid Purple):** `#6D3BB3` (Warm, approachable, community-oriented).
- **Brand Primary States:** Hover `#5B2E91`, Active `#4A247A`, plus gradient tokens (`primary-hover`, `primary-dark`, `primary-royal` `#6B2C70`, `primaryLight` `#7A45C4`).
- **Accent Amber / Gold:** `#F59E0B` (`--color-accent`), hover `#D97706`, text-on-accent `#1F1F28` (`accent-foreground`).
- **Surfaces & Canvas:**
  - Page Canvas: `#F8F5FF` (`bg-canvas`).
  - Cards & Containers: `#FFFFFF` (`bg-surface`) with `shadow-soft` / `shadow-card` (both purple-tinted).
  - Muted & Subtle Surfaces: `bg-surface-muted` (`#F3EEFF`), `bg-surface-subtle` (`#FAF8FF`).
- **Typography & High-Contrast Colors (WCAG AA Compliant for primary and secondary text):**
  - Primary Headings & Body: `#1F1F28` (`text-foreground`)
  - Secondary / Meta Text: `#4B5563` (`text-foreground-secondary`)
  - Muted / Decorative Text: `#9CA3AF` (`text-foreground-muted`) — fails AA on all three light surfaces; decorative use only.
  - Subtle Borders & Dividers: `border-border` (`#ECECEC`) / focus ring `primary/40`.
- **Theme mode:** **Light only.** `html { color-scheme: light }`, no `.dark` block, no theme provider, no `prefers-color-scheme` query. See [`docs/Design.md` §6](./docs/Design.md#6-theme-modes).
- **Typography:** Geist Sans (`--font-geist-sans`) + Geist Mono (`--font-geist-mono`).
- **Motion & Accessibility:**
  - `framer-motion` drives every hero: homepage `HeroSection` (entrance fade/stagger only — the pointer-parallax floating cards have been removed), plus the `/about`, `/contact`, `/for-merchants` and `/how-it-works` heroes. `/discover`'s hero is now a static server component (no motion).
  - Radix accordion transitions on the FAQ surfaces; Radix dialog only for `MobileNav`.
  - All motion must respect `@media (prefers-reduced-motion: reduce)` (see `.agents/skills/accessible-animation/SKILL.md`).
  - Consistent skip-to-content link, `aria-current`, visible focus rings, and labelled live regions.

---

## 6. Architecture & Engineering Boundaries

### 6.1 Strict Architectural Constraints
- **Zero Local Server-Side Logic:** No local database, ORM, session store, or `app/api/**` route handlers anywhere in this repo.
- **Dedicated External Backend:** All dynamic data (events, merchant profiles, leads, newsletter) is handled by the external backend at `NEXT_PUBLIC_MEELTE_API_BASE_URL`.
- **Client & Jamstack Model:**
  - **Read Operations:** Static rendering (SSG) from in-repo constants today; external BE fetching via `src/services/` when endpoints are provisioned. **No `revalidate`/ISR directives exist** — `npm run build` prerenders all 12 routes as static (verified Oct 29, 2026).
  - **Write Operations:** Direct client-side `fetch` with CORS for inquiries, merchant leads, and newsletter signups.
- **Forms Today:** No form fakes a submission. The newsletter form is wired to the external endpoint through `src/services/newsletter.js`; the contact form, merchant enquiry CTAs, careers resume CTA, and FAQ support CTA all compose a `mailto:` message and state plainly that nothing is sent until the user sends it.

### 6.2 Primary Mission: High-Impact Visuals & Comprehensive Technical SEO
1. **Visual Excellence & Component Primitives:**
   - Responsive hero with trust pills ("Hyperlocal", "Shop Offers", "Direct Chat") and the Play Store / merchant CTAs. The hero is text-only — the phone mock and floating cards were removed, so there are no invented listings, business names or distances to caption.
   - Three-area capability explainer for `/discover` (`offers`, `events`, `people`) — a capability page, not a directory of invented businesses.
   - Merchant comparison table (Meelte vs aggregators), 3-step onboarding, and a `mailto:` enquiry handoff on `/for-merchants` and the homepage (the former Radix enquiry dialog has been replaced by this direct handoff).
   - Trust/credibility section, FAQ accordion (trimmed to a 4-question teaser on the homepage, full set on `/faq`), dual-audience conversion CTA, dedicated `/faq` and `/careers` pages.
2. **Technical SEO & AEO (Answer Engine Optimization):**
   - Centralized JSON-LD generators (`Organization`, `WebSite`, `MobileApplication`, `BreadcrumbList`, `FAQPage`, `HowTo`, `Service`, `CollectionPage`, `ContactPage`, `AboutPage`, `WebPage`, `SpeakableSpecification`, plus dormant `Event`/`LocalBusiness`/`Article`/`Person` helpers).
   - Per-page metadata via `buildPageMetadata()` with canonical URLs, OpenGraph, Twitter cards, and keyword sets.
   - Static XML sitemap (`src/app/sitemap.js`, 12 routes) and robots (`src/app/robots.js`) with explicit allowances for ~31 AI/search crawlers.
   - Static 1200×630 social share card at `public/og-image.png` (~135KB, still inside WhatsApp's 600KB preview ceiling), produced by `node scripts/generate-og-image.mjs` from `public/transparent_logo_meelTe.png` on the `canvas` token. Every page and JSON-LD node references it via `OG_IMAGE_PATH` (`src/lib/seo/metadata.js`); there is no runtime OpenGraph route, so one file serves `og:image` and `twitter:image` everywhere.
   - Machine-readable AI endpoints: `public/llms.txt` (curated index), `public/llms-full.txt` (unabridged corpus), `public/.well-known/llms.txt`, and the per-page markdown mirrors `public/about.md`, `public/services.md`, `public/faq.md`, `public/for-merchants.md`, `public/how-it-works.md`, `public/coverage.md`, `public/contact.md`, `public/careers.md`.

### 6.3 Routing & Rendering Conventions
- Pages are Server Components. Client components: `Navbar`, `MobileNav`, `ContactClient`, `SignupClient`, `HeroSection`, `EcosystemSection`, `ProductExperienceSection`, `BusinessAcquisitionSection`, and the `about` / `contact` / `for-merchants` / `how-it-works` hero components (because they use `framer-motion`).
- **The root layout renders only** `<html>/<body>`, fonts, the root JSON-LD graph (`WebSite`, `Organization`, `MobileApplication`) and the single `Toaster`. **Every page renders its own `<Navbar />` and `<Footer />`**, its own skip-link, and its own page-level JSON-LD.
- **Breadcrumbs are rendered inside page heroes** (`about`, `contact`, `discover`, `for-merchants`, `how-it-works`, `signup`) or inline in the page (`faq`, `careers`, `privacy`, `terms`, `support`); `/` and 404 have none.
- Per-route components are colocated in `_components/` folders inside the route (e.g. `src/app/about/_components/about-hero.jsx`).
- No `next/dynamic` / `ssr:false` boundary file exists (the former `LazyClientComponents` pattern is not in use).
- `next.config.mjs` enables `cacheComponents`, `partialPrefetching`, `reactCompiler`, and the `@tailwindcss/turbopack` CSS rule.
- Path alias `@/*` → `./src/*` (`jsconfig.json`); JavaScript/JSX only, no TypeScript.

---

## 7. Tech Stack & Packages

- **Framework:** Next.js 16.4.3 (App Router, Turbopack, React Compiler enabled)
- **Runtime / Language:** React 19.3.0, React DOM 19.3.0, JavaScript (ESNext, `.js`/`.jsx`)
- **Styling:** Tailwind CSS v4 (`tailwindcss@4`, `@tailwindcss/turbopack@4`), CSS-variable `@theme` design tokens in `src/app/globals.css`
- **Animation:** `framer-motion@14.7.1` (actively used in five hero components)
- **Icons:** `lucide-react@1.62.0`, funnelled through the `src/lib/icons/index.js` barrel
- **Interactive UI Primitives:** `@radix-ui/react-accordion@1.3.1` (FAQ), `@radix-ui/react-dialog@1.3.1` (mobile nav only)
- **Feedback & Notifications:** `sonner@2.0.8` (single `Toaster` mount in `src/app/layout.js`, brand tokens in `globals.css`)
- **Carousel & Sliders:** `embla-carousel-react@8.6.0` (installed; not used anywhere)
- **Utilities & Forms:** `clsx@2.1.1`, `tailwind-merge@3.7.0`, `react-hook-form@7.91.0`, `@hookform/resolvers@6.0.1`, `zod@4.6.7` (installed; forms use local `useState` validation)
- **Content data:** `src/data/faq.json` (single source of FAQ copy), consumed by `src/constants/faq-constants.js`
- **OG card tooling:** `scripts/generate-og-image.mjs` uses `sharp` (present transitively via Next.js; not a declared dependency). **There is no `og:image` npm script** — run the file with `node scripts/generate-og-image.mjs`.
- **Fonts:** Geist Sans & Geist Mono via `next/font/google`
- **Dev Tooling:** `eslint@9` + `eslint-config-next@16.4.3`, `babel-plugin-react-compiler@1.0.0`

---

## 8. Directory Map

```
nextjs-website/
├── docs/
│   ├── Design.md               # Canonical palette, token & visual design reference
│   └── target_customer.md      # Customer segments, personas, market focus
├── public/
│   ├── llms.txt, llms-full.txt # Machine-readable brand knowledge for AI engines
│   ├── about.md, services.md   # Markdown endpoints referenced by llms.txt
│   ├── faq.md                  # Every FAQ question with a direct, quotable answer (AEO)
│   ├── for-merchants.md        # Merchant onboarding guide for answer engines
│   ├── how-it-works.md         # Step-by-step walkthrough for residents, hosts, shops
│   ├── coverage.md             # Coverage model: pan-India + the three onboarding hubs
│   ├── contact.md              # Support/merchant/careers contacts and hours
│   ├── careers.md              # Company recruitment (explicitly not a jobs board)
│   ├── .well-known/            # security.txt + llms.txt
│   ├── og-image.png            # Committed 1200×630 social share card (og:image / twitter:image)
│   └── icon_only_meelte.png, only_meelte.png, transparent_logo_meelTe.png
├── scripts/
│   └── generate-og-image.mjs   # Builds public/og-image.png from the logo + globals.css tokens
├── src/
│   ├── app/                    # Next.js App Router (every route prerendered)
│   │   ├── layout.js           # Fonts, root metadata/viewport, root JSON-LD, Toaster (no Navbar/Footer)
│   │   ├── page.js             # Homepage assembly (5 sections: hero, merchant acquisition, trust, FAQ teaser, final CTA)
│   │   ├── globals.css         # Tailwind v4 @theme tokens, Radix keyframes, toast tokens
│   │   ├── about/              # Brand story, mission, vision, "why choose" (+ _components/about-hero)
│   │   ├── careers/            # Company recruitment page (values, benefits, HR mailto)
│   │   ├── contact/            # Contact hero + contact-client form (+ ContactPage JSON-LD)
│   │   ├── discover/           # Capability explainer hero + discover-areas (offers/events/people)
│   │   ├── faq/                # Dedicated FAQ page (FAQPage + BreadcrumbList JSON-LD)
│   │   ├── for-merchants/      # Merchant landing (HowTo + Service JSON-LD)
│   │   ├── how-it-works/       # Roles, ecosystem + product walkthrough (HowTo + ItemList JSON-LD)
│   │   ├── privacy/            # Privacy Policy (effective October 2026)
│   │   ├── terms/              # Terms & Conditions (effective October 2026)
│   │   ├── support/            # Support desk (email / phone, 9AM–6PM IST)
│   │   ├── signup/             # Signup/onboarding page (app download, web "coming soon")
│   │   ├── not-found.jsx       # Custom 404
│   │   ├── icon.png, apple-icon.png
│   │   └── manifest.js, robots.js, sitemap.js
│   ├── components/
│   │   ├── layout/             # navbar (Product/Company dropdowns), mobile-nav (Radix dialog),
│   │   │                       # footer, container, breadcrumbs
│   │   ├── footer/             # footer-column, newsletter-form, store-button
│   │   ├── sections/
│   │   │   ├── home/           # hero, ecosystem, business-acquisition, product-experience,
│   │   │   │                   # final-conversion-cta (+ index.js barrel; hyperlocal-discovery
│   │   │   │                   # still exists but is no longer rendered on the homepage)
│   │   │   ├── common/         # faq-section, trust-credibility (+ index.js barrel)
│   │   │   ├── discover/       # discover-areas (offers / events / people explainer)
│   │   │   └── contact/        # contact-client form (mailto handoff)
│   │   └── ui/                 # button, card, badge primitives
│   ├── config/site.js          # Brand, URLs, SUPPORT_EMAIL, HR_EMAIL, phone, socials, Play Store
│   ├── constants/              # app-constants (cities, OPERATIONAL_HUBS, PLATFORM_AREAS, colors, pillars),
│   │                           # faq-constants (re-exports src/data/faq.json), service-constants, index
│   ├── data/faq.json           # Single source of truth for all FAQ copy (12 entries)
│   ├── lib/
│   │   ├── seo/                # metadata.js (buildPageMetadata/buildArticle/buildCollection),
│   │   │                       # structured-data.js (JSON-LD generators), index.js
│   │   ├── icons/index.js      # Single icon entrypoint (re-exports lucide-react)
│   │   ├── toast-feedback.js   # notifySuccess/notifyError/notifyInfo + TOAST_COPY/TOAST_ID
│   │   └── utils.js            # cn() (clsx + tailwind-merge)
│   └── services/               # api_constants.js (endpoints), newsletter.js (browser client)
├── .agents/skills/             # 16 discipline skills (must be read before implementation)
├── .opencode/agents/           # OpenCode role agents (V2 frontmatter; coordinator + 5 specialists)
├── .github/agents/             # GitHub Copilot copies of the same six role agents
├── AGENTS.md, AI_RULE.md       # Agent directives & engineering rules
├── project-context.md          # This file (single source of truth for ongoing context)
├── meelte-context.md           # Product/business brief, design direction, guardrails
├── README.md, CLAUDE.md, gemini.md, opencode.jsonc
├── next.config.mjs, jsconfig.json, eslint.config.mjs
└── package.json, package-lock.json, .env.example
```

> Note: `visual.md` and `homepage-plan.md` have been removed. Visual direction now lives in `docs/Design.md`, `meelte-context.md`, and the token definitions in `globals.css`. `page-feel.txt` is an **untracked, unimplemented** motion/UX brief — not a spec that has been applied.

---

## 9. Current Status & Progress

**Completed pages (all static, all with metadata + JSON-LD):**

| Route | Purpose | Schema |
| :--- | :--- | :--- |
| `/` | Homepage: hero, merchant acquisition, trust, FAQ teaser (first 4 of 12 questions), final CTA (5 sections) | FAQPage (those same 4 items, emitted by `page.js`) |
| `/about` | Origin story, mission, vision, what we do, why choose Meelte | AboutPage + BreadcrumbList |
| `/how-it-works` | 4 evidence-backed roles, ecosystem + app walkthrough, trust, FAQ, CTA | HowTo + ItemList + BreadcrumbList |
| `/for-merchants` | 0% commission pitch, comparison table, 3-step onboarding, mailto enquiry | HowTo + Service + BreadcrumbList |
| `/discover` | Conversion-focused capability explainer: hero → three areas → 3-step first run → 5-question FAQ → dual CTA | CollectionPage + FAQPage + BreadcrumbList |
| `/faq` | Dedicated FAQ page over `src/data/faq.json` | FAQPage + BreadcrumbList |
| `/careers` | Company recruitment: values, benefits, "no open roles", HR mailto | BreadcrumbList |
| `/contact` | Support/office/hours cards + message form with validation and focus management | ContactPage + BreadcrumbList |
| `/signup` | Value-first onboarding page; mobile app available, web "coming soon" | BreadcrumbList |
| `/support` | Minimal support desk with email/phone | BreadcrumbList |
| `/privacy`, `/terms` | Legal pages (effective October 2026) | BreadcrumbList |

**Shared infrastructure delivered:**
- Design system: WCAG-AA tokens, gradient/border/shadow scales, Radix keyframes, reduced-motion handling.
- UI primitives: `Button` (primary/secondary/accent/outline/ghost/link/pill), `Card`, `Badge`, `Container`, `Breadcrumbs`.
- Global shell: sticky `Navbar` with Product and Company dropdowns (`lg` and up) plus the Google Play + App Store download pills (`StoreButton` `brand` variant) at the same breakpoint; below `lg` the header is logo + hamburger, and the `MobileNav` drawer carries both store badges (`badge` variant) under a "Get the app" label. Radix `MobileNav`, a `Footer` with a brand block (description, privacy promise) plus three link columns — **Product**, **In the app** (the three `PLATFORM_AREAS` anchors on `/discover`) and **Company** — with the newsletter form in the final column, then socials, legal links, and giant watermark wordmark.
- Toast contract (`lib/toast-feedback.js`): centralized copy, durations, dedupe IDs; single `Toaster` in root layout.
- SEO: root JSON-LD graph (`WebSite`, `Organization`, `MobileApplication`), `buildPageMetadata()`, breadcrumb schema helper, static sitemap, robots (AI crawler allowances), committed OG image, and the machine-readable endpoint set (`llms.txt`, `llms-full.txt`, `about.md`, `services.md`, `faq.md`, `for-merchants.md`, `how-it-works.md`, `coverage.md`, `contact.md`, `careers.md`).
- FAQ architecture: `src/data/faq.json` as the only copy source, re-exported by `src/constants/faq-constants.js` for the homepage teaser JSON-LD (`FAQ_ITEMS.slice(0, HOMEPAGE_FAQ_COUNT)`), the `/faq` page JSON-LD, the `/discover` teaser (five ids filtered out of the same array → `FAQPage` built from exactly those five), and every `FaqSection` accordion (`/`, `/faq`, `/how-it-works`, `/for-merchants`, `/discover`). `FaqSection` accepts optional `title` / `description` so a narrow teaser does not inherit the full-page heading.
- Accessibility: skip links, `aria-current`, focus rings, labelled icon-only buttons, single-announcement validation, focus re-anchoring after submit.
- Build status: `npm run build` passes (Next.js 16.4.3, Turbopack) and prerenders all 12 routes as static content.

---

## 10. Active Tasks & Next Steps

1. **Fix the broken `/case-studies` links (highest priority):** `src/components/layout/navbar.jsx` (`PRODUCT_LINKS`) and `src/components/layout/mobile-nav.jsx` (`PRODUCT_ITEMS`) both link to `/case-studies`, which has no route — every click 404s. Either build the page (real, evidenced merchant stories only) or remove the entries.
2. **Restore the OG regeneration command:** `AI_RULE.md` §2.3, `docs/Design.md` §2.1, and this file all document `npm run og:image`, but `package.json` only has `dev`/`build`/`start`/`lint`. Add `"og:image": "node scripts/generate-og-image.mjs"` (and consider declaring `sharp`) or correct the docs.
3. **Wire forms to the external backend** (`AI_RULE.md` §2.1):
   - `ContactClient` → `POST API_ENDPOINTS.CONTACT` (currently composes a `mailto:` message).
   - Merchant enquiry CTAs (`business-acquisition-section`, `final-conversion-cta`) → `POST API_ENDPOINTS.MERCHANT_INQUIRY`.
   - Pattern to follow: `src/services/newsletter.js` (typed error codes + honest failure copy).
4. **Sitemap/route parity:** `src/app/sitemap.js` lists exactly the 12 existing routes (`/`, `/discover`, `/for-merchants`, `/how-it-works`, `/about`, `/signup`, `/contact`, `/faq`, `/careers`, `/support`, `/privacy`, `/terms`). Re-check it whenever a route is added or renamed — it must stay in lockstep with the navbar and footer.
5. **Jobs board:** not a shipped product capability. Do not reintroduce `/jobs`, jobs features, or `JobPosting` schema. `/careers` stays company-only recruitment.
6. **Discovery data source:** `/discover` is a capability explainer (`PLATFORM_AREAS`), not a listing page. Real nearby listings stay in the app; if a live feed is ever added, fetch it from the external backend and never present sample businesses as real.
7. **Legal review:** `/privacy` and `/terms` content needs owner/legal sign-off; keep effective date accurate.
8. **Analytics:** `NEXT_PUBLIC_GA_ID` / `NEXT_PUBLIC_GTM_ID` exist in `.env.example` but no analytics component is implemented.
9. **Store links:** the App Store button (footer **and** navbar) points at the `#` placeholder held in `APP_STORE_URL` (`src/config/site.js`) — owner decision (Oct 2026): keep it until the app developer supplies the iOS listing URL, then change that single constant. `StoreButton` only adds `target`/`rel` once the href starts with `http`, so the placeholder does not open a blank tab.
10. **Motion brief decision:** `page-feel.txt` (untracked, repo root) proposes entrance animations, floating hero cards, scroll reveals and Motion/Framer guidance. None of it is implemented or approved; if adopted, keep `framer-motion` (already installed), respect `prefers-reduced-motion`, and delete the scratch file once its content is captured in `docs/Design.md`.
11. **Optional cleanup:** unused deps (`embla-carousel-react`, `react-hook-form`, `zod`, `@hookform/resolvers`) should be either adopted or removed.

---

## 11. Environment & Setup Notes

- **Package Manager:** **npm** only (`npm run dev`, `npm run build`, `npm run start`, `npm run lint`). Never use `pnpm` or `yarn` (lockfile: `package-lock.json`).
- **Node:** Next.js 16 + React 19 (Node 20+ recommended).
- **Dev Server:** `npm run dev` → `http://localhost:3000` (Turbopack; restart if a stale module graph causes phantom errors).
- **Build:** `npm run build` (`next build`, Turbopack) — run before considering a milestone done. Current result: compiled successfully, 19 static outputs (12 pages + `_not-found`, icons, manifest, robots, sitemap).
- **Social card asset:** regenerate with `node scripts/generate-og-image.mjs` (see §10 item 2 — the documented `npm run og:image` alias does not exist yet). It reads the `@theme` colours from `globals.css`, trims `public/transparent_logo_meelTe.png`, and fails the run if the PNG exceeds 600KB. Re-scrape the URL in the Facebook Sharing Debugger afterwards to clear WhatsApp/Facebook caches.
- **Environment Variables** (`.env` locally — only two are set today — mirrored in `.env.example`):
  - `NEXT_PUBLIC_SITE_URL` — canonical site URL (`APP_URL`, fallback `https://meelte.com`)
  - `NEXT_PUBLIC_MEELTE_API_BASE_URL` — external backend base (`API_BASE_URL`, fallback `https://api.meelte.com`)
  - `NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_GTM_ID` — analytics (unused so far)
  - `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`, `NEXT_PUBLIC_BING_SITE_VERIFICATION` — search console verification
- **Never print, log, or commit secrets** from `.env`.
- **Determinism:** no `new Date()`/`Math.random()` in static server components. Use `CURRENT_YEAR = 2026` (footer) and `STABLE_RELEASE_DATE = "2026-08-01T00:00:00.000Z"` (sitemap).

---

## 12. Key Decisions & Constraints

1. **Marketing site only.** No local API routes, no DB, no auth. Every dynamic capability belongs to the external backend.
2. **No fabricated claims.** No invented user counts, testimonials, ratings, customer logos, or case studies. Only verifiable value props: privacy-first location handling, 0% commission (pending business sign-off), community moderation, in-person merchant onboarding, real hubs (Bengaluru, Gaya, Ranchi).
3. **Careers ≠ jobs board.** `/careers` is company recruitment; local hiring for app users is not a product capability.
4. **Single source of truth for brand/metadata:** `src/config/site.js` (includes `SUPPORT_EMAIL`, `HR_EMAIL`, `CONTACT_PHONE`); cities/`OPERATIONAL_HUBS`/`PLATFORM_AREAS`/colors/pillars in `src/constants/app-constants.js`; SEO generators in `src/lib/seo/*`; FAQ copy in `src/data/faq.json` only.
5. **Breadcrumbs are mandatory on every page except `/` and 404** — always via `src/components/layout/breadcrumbs.jsx`, with a matching `BreadcrumbList` in JSON-LD (`AI_RULE.md` §2.6).
6. **One visual breadcrumb + one schema graph per page**, merged into a single JSON-LD payload where other schema exists.
7. **All structured data must match rendered content.** Dormant generators (`getEventJsonLd`, `getLocalBusinessJsonLd`, `getArticleJsonLd`, `getPersonJsonLd`) exist for future routes only.
8. **Feedback discipline:** components must import `notifySuccess`/`notifyError`/`notifyInfo` from `lib/toast-feedback.js`, never `toast` from `sonner` directly.
9. **Icons** are imported from `@/lib/icons` (barrel), not `lucide-react` directly, so the icon surface stays swappable.
10. **Plain, honest copy** over marketing filler; each section must justify itself and avoid repeating earlier claims.
11. **JS/JSX only.** Do not introduce TypeScript into app or component files without an explicit decision.

---

## 13. Known Issues & Gotchas

- **Broken `/case-studies` navigation (open):** both `navbar.jsx` and `mobile-nav.jsx` advertise a Case Studies page that does not exist. It is also absent from the sitemap, so the link is the only exposure.
- **`npm run og:image` is documented but missing (open):** the script file exists and works via `node scripts/generate-og-image.mjs`; the npm alias was dropped from `package.json`. Docs in `AI_RULE.md`, `docs/Design.md`, and this file still reference it.
- **OG image size drifted:** `public/og-image.png` is now ~135KB (documented as ~55KB) at 1200×630. Still under the 600KB WhatsApp ceiling, but recompress if the asset is regenerated.
- **Sitemap drift (resolved):** `src/app/sitemap.js` lists only the 12 routes that exist (`/jobs`, `/merchant`, `/case-studies`, `/category/*` and `/sitemap` are not implemented).
- **City-coverage model (answered by the business, Oct 2026):** Meelte is expanding to all of India; today three cities are actively worked by field executives — **Bengaluru, Gaya and Ranchi** — and those are the only places where in-person shop onboarding happens. `TARGET_CITIES` / `ALL_COVERED_AREAS` stay at country level on purpose so `areaServed` never implies a Chennai resident is onboarded in person today; the three hubs are exported separately as `OPERATIONAL_HUBS`. If either side changes, change both the constants and the "onboarded in person" copy together.
- **Radius (resolved):** the canonical figure is the product's **60 km** default distance sort. The old "3 km" and "1–5 km" copy, plus the invented metre-scale distances in the hero/product mocks, are gone.
- **Hero mockups removed (resolved):** the decorative floating cards and phone-preview compositions are gone from `hero-section.jsx`, `how-it-works-hero.jsx` (four floating cards + phone mock) and `for-merchants-hero.jsx` (`MerchantPreview`), because simulated screens invited invented listings, distances and counts. Those three heroes are now single-column, text-first layouts (`mx-auto max-w-3xl`, centered, entrance fade only) with breadcrumbs centered. `/about`, `/contact` and `/discover` never had a mock. The one remaining illustrative phone screen is `src/components/sections/home/product-experience-section.jsx`, which is captioned "Illustrative interface — sample content, not a real listing." Do not reintroduce hero mocks without real product screenshots.
- **Unsourced merchant claims (owner decision: keep for now):** "0% commission" stays site-wide (`/for-merchants`, homepage comparison table, FAQ, final CTA, trust section) — the owner has accepted it as the current merchant pitch even though no commission, subscription or paid placement exists in the product code. Revisit only on an explicit business decision. "Free listing", "free onboarding", "direct phone & WhatsApp" and "community verification" are removed and must not come back. Note `src/data/faq.json` also asserts that browsing, hosting events and creating events are "free … no subscription or app fee" — same open question.
- **Jobs board (resolved):** there was never a hiring feature. Jobs copy, `/jobs` links, `/jobs` sitemap entries, `JobsPreview`, the `JobPosting` schema generator and the jobs API constants have been deleted.
- **Web-app status (resolved):** FAQ #7 now says the browser-based web experience is in development, matching `/signup`.
- **Forms (resolved, no backend):** contact, merchant enquiry, careers and FAQ support no longer fake a submission. They compose a `mailto:` message and say plainly that nothing is sent until the user sends it. Wire them to the external backend when endpoints exist.
- **Discovery listings (resolved):** the invented `DISCOVERY_CATEGORIES` businesses are gone. `/discover` is a capability explainer over `PLATFORM_AREAS`; real listings live in the app.
- **FAQ copy drift risk:** edit `src/data/faq.json` only. `src/constants/faq-constants.js` merely re-exports it; duplicating strings there would fork the JSON-LD from the accordion copy. The homepage renders `FAQ_ITEMS.slice(0, 4)` (`HOMEPAGE_FAQ_COUNT` in `src/app/page.js`), so **order matters** — the first entries are the ones the homepage shows and marks up. The file currently holds 12 entries (ids `faq-1`–`faq-13` with `faq-6` removed).
- **Duplicated breadcrumb arrays:** `src/app/discover/page.jsx` and `src/app/discover/_components/discover-hero.jsx` each declare their own `DISCOVER_BREADCRUMBS`. Update both or hoist one constant.
- **Root layout does not render the shell:** `layout.js` has no `Navbar`/`Footer`. Any new route must import both itself (plus the skip link and page JSON-LD), or it will render bare.
- **Icon barrel is a pass-through** (`export * from 'lucide-react'`): the documented "curated allow-list" behaviour does not exist, so any lucide export can be imported through it.
- **Unused dependencies** (`embla-carousel-react`, `react-hook-form`, `@hookform/resolvers`, `zod`) increase install size without current usage.
- **Raw palette leaks (design):** `docs/Design.md` §3.4 documents ~115 raw Tailwind palette utilities and 7 arbitrary hex values — notably the hero headline gradients (`via-indigo-500 to-violet-500`), the emerald "0% commission / verified" chips plus the live dot in `trust-credibility-section.jsx` (`bg-emerald-500`), the `bg-black` store badge (`components/footer/store-button.jsx`, `badge` variant only, used just in the `MobileNav` drawer — the navbar uses the token-led `brand` variant, and the footer carries no store links), and `src/app/support/page.jsx` (`bg-blue-50`, `bg-red-400`, emoji illustration). Token-first is the standard; these are known exceptions.
- **`BRAND_COLORS` has drifted from `globals.css`:** `textSecondary` (`#6B7280` vs `#4B5563`) and `accentHover` (`#F4B740` vs `#D97706`). Anything rendered outside CSS (manifest, `theme-color`, OG card) uses the older values.
- **Windows/PowerShell + Turbopack:** stale compile errors after refactors usually require a dev-server restart, not speculative code changes.
