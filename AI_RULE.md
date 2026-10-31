# AI Rules & Engineering Directives — Meelte Next.js Website

> **Repository:** `nextjs-website`  
> **Brand:** Meelte (Hyper-local Community Platform)  
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
| 3 | [`meelte-context.md`](./meelte-context.md) | The intent behind the build: product/business goals, messaging direction, design direction, and the do/do-not guardrails. |
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

### 2.1 ZERO Local Server-Side Code
- **No Local Backend:** Never create local databases, ORM models (Prisma, Drizzle, etc.), or internal API route handlers (`app/api/**`).
- **Dedicated External Backend:** All dynamic data (events, jobs, merchant profiles, leads) is hosted and managed by Meelte's dedicated external backend / Firebase.
- **Data Fetching via `src/services/`:**
  - **Read Operations (SSG/ISR):** Use Next.js Server Components fetching from the external BE with caching tags:  
    `fetch(url, { next: { revalidate: 3600, tags: ['events'] } })`.
  - **Write Operations (Forms & Inquiries):** Use client-side components to submit directly to the external BE endpoint with proper CORS and explicit loading/error/success states.

### 2.2 Visual & Brand System Standards
- **Source of Truth:** Colors and typography MUST strictly adhere to [`docs/Design.md`](./docs/Design.md) and Tailwind CSS v4 tokens in `src/app/globals.css`:
  - **Brand Primary (Mid Purple):** `#6D3BB3`
  - **Brand Royal/Dark Gradient:** `#5B2E91` to `#7A45C4`
  - **Accent Amber/Gold:** `#F59E0B` / `#F4B740`
  - **Canvas Background:** `#F8F5FF`
  - **Card Surface:** `#FFFFFF`
  - **Text High-Contrast:** `#1F1F28` (Primary) and `#6B7280` (Secondary)
- **Simple, Clean & Minimal UI:** Keep interfaces clean, simple, and minimal. Prioritize deliberate whitespace, calm readability, clear content hierarchy, and intuitive navigation. Avoid visual clutter, gratuitous decorative elements, dense badge stacking, and distracting animations. Every visual element must serve a concrete discovery or conversion goal.
- **Zero Fabricated Claims & Metrics Policy:** Never invent exaggerated SaaS metrics (e.g., *"50,000+ Happy Users"* or *"10,000+ Local Stores"*). Use genuine product features, real coverage areas (`Bengaluru`, `Gaya`, `Ranchi`), and authentic value propositions (*"Community Moderated"*, *"Zero Commission"*, *"Location Never Sold"*) instead of vanity numbers.
- **Both store listings, always:** Meelte is live on Google Play (`PLAY_STORE_URL`) and the App Store (`APP_STORE_URL`), both exported from `src/config/site.js`. Never present the app as Android-only: wherever the app is promoted, or its availability described, name both platforms. The browser-based web app remains "coming soon" and must never be implied to be live.
- **Centralized Vector Icons:** Never import directly from `lucide-react` across random components. Always route icon imports through the single source of truth [`src/lib/icons/index.js`](./src/lib/icons/index.js). Standardize icon sizing scale (`h-4 w-4` for inline/button, `h-5 w-5` for cards/nav, `h-6 w-6` for section headers).
- **Accessibility & Tiered Motion Standards:** 
  - Ensure full keyboard operability with explicit `focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2` on all interactive triggers.
  - Every icon-only button must declare a clear `aria-label`.
  - Respect `prefers-reduced-motion: reduce` following [`.agents/skills/accessible-animation/SKILL.md`](./.agents/skills/accessible-animation/SKILL.md) (Tier 1: remove vestibular triggers like parallax/continuous marquees; Tier 2: shorten/fade transitions to ≤200ms; Tier 3: preserve essential feedback like focus rings and spinners).
- **Visual Polish:** High-impact, modern presentation tailored to community members and merchants: bento grids, responsive layouts, micro-interactions, and clear trust badges (*"Privacy First — Location never sold or shared"*).
- **Core Web Vitals:** Always use Next.js `<Image>` with explicit width/height and `priority` on above-the-fold hero elements. Ensure zero Cumulative Layout Shift (CLS).

### 2.3 SEO & Domain Constants Standardization
- **Single Source of Truth for Geo & Taxonomy:** Centralize site name, base URL, social handles, and default metadata in `src/config/site.js`. Focus coverage cities (`TARGET_CITIES`) and the three platform areas (`PLATFORM_AREAS` — offers, events, people) must be imported from `src/constants/app-constants.js`. Never hardcode city or area lists across components.
- **Keep SEO Schema Synchronized:** When modifying platform areas or coverage cities, update both [`src/constants/app-constants.js`](./src/constants/app-constants.js) and [`src/lib/seo/structured-data.js`](./src/lib/seo/structured-data.js) to keep metadata and structured data in parity.
- **JSON-LD Structured Data:** Maintain valid Schema.org schemas (`Organization`, `WebSite`, `BreadcrumbList`, `Event`, `LocalBusiness`, `FAQPage`). Do not emit schema for capabilities the product does not ship (there is no jobs board, and no price is published).
- **Discovery Infrastructure:**
  - Dynamic XML sitemap at `src/app/sitemap.js` (stable release date for static routes; real `modifiedDate` for external BE slugs; never `new Date()`).
  - Search crawler directives at `src/app/robots.js`.
  - Static 1200x630 social share card at `public/og-image.png` (brand canvas, dot grid, logo, two-line tagline strip; ~55KB and therefore inside WhatsApp's 600KB preview limit). Regenerate it with `npm run og:image` (`scripts/generate-og-image.mjs`), which composites `public/transparent_logo_meelTe.png` onto the token colours read from `src/app/globals.css`. Every page and every JSON-LD node points at it through `OG_IMAGE_PATH` in `src/lib/seo/metadata.js`; there is no runtime OpenGraph route.
  - Machine-readable knowledge file at `public/llms.txt` for AI search engines (Perplexity, ChatGPT, Claude), plus `public/llms-full.txt` as the unabridged corpus and per-page markdown mirrors in `public/*.md` (`about`, `services`, `faq`, `for-merchants`, `how-it-works`, `coverage`, `contact`, `careers`) for token-efficient agent ingestion. Any new `.md` endpoint must be linked from `public/llms.txt` **and** `public/.well-known/llms.txt`, and listed in `public/llms-full.txt` §9.

### 2.4 Component Integrity & Clean Module Exports
- **Single Component Definition Per File:** Each component file must contain exactly one primary component definition that matches the file's name and purpose. Do not colocate unrelated full-section components or declare duplicate functions with the same name.
- **Zero Duplicate or Conflicting Exports:** Every module must have at most one `export default` and strictly unique named exports. Never leave duplicate exports (`export default ComponentName` defined more than once).
- **Clean Drop-in Replacements:** When modifying or refactoring existing components, ensure the old implementation is completely replaced. Never leave stale code appended below the new code block. Verify lines and exports before completing any file modification.

### 2.5 Next.js 16 SSG & Prerender Determinism
- **No Non-Deterministic Runtime Clocks in Server Components:** Never call `new Date()`, `Math.random()`, or dynamic runtime clocks inside static Server Components (`page.jsx`, `layout.jsx`, `footer.jsx`).
- **Use Module Constants:** Use static release dates or module constants (e.g., `const CURRENT_YEAR = 2026`) so static HTML prerenders deterministically during build time without triggering hydration mismatches or SSG bailouts.

### 2.6 Breadcrumbs on Every Page (Mandatory)
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
- **Exemptions:** The homepage (`src/app/page.js`) and the 404 page (`src/app/not-found.jsx`) are the only routes that do not require a breadcrumb.

---

## 3. Tool & CLI Execution Guidelines

1. **Context First:** Before any implementation, read `docs/target_customer.md`, `project-context.md`, `meelte-context.md`, and `docs/Design.md` in full (see §1.1), then read the applicable skills (§1.2), and inspect the codebase graph (see §1.3 Code Review Graph).
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
| **Shared Agent Skills** | `.agents/skills/<skill-id>/SKILL.md` | The 16 discipline skills every AI tool must read before implementation (ui-ux, frontend, accessibility, accessible-animation, animate, ai, ai-output-judgement, backend, database, security, devops, performance, seo-engineer, seo-strategy, seo-keyword-research, personal-seo). OpenCode discovers this path automatically (`skills` in `opencode.jsonc` just makes it explicit); it is also referenced from `AGENTS.md`, `CLAUDE.md`, `gemini.md` and the role agents. |
| **Shared Role Agents** | `.opencode/agents/<agent-id>.md` + `.github/agents/<agent-id>.agent.md` | Six role agents: `website-coordinator`, `frontend-engineer`, `accessibility-engineer`, `seo-engineer`, `ai-engineer`, `performance-engineer`. The `.opencode/` copies carry OpenCode V2 frontmatter (`description`, `mode`, `permissions`) and are what OpenCode loads — the ID is the filename; the `.github/` copies are GitHub Copilot definitions and must be kept in sync. The coordinator runs `mode: primary` and may only launch the five `mode: subagent` specialists. |
| **Class Merger** | `src/lib/utils.js` | Exports `cn()` combining `clsx` and `tailwind-merge` for conflict-free dynamic styling. |
| **Form Validation** | `src/validation/contacts/contact-validation.js` | Zod-backed contact form schema and input bounds. `contact-client.jsx` uses its normalized values and field errors before generating the mailto handoff. Client-side checks are UX safeguards, not backend validation. |
| **Centralized Icons** | `src/lib/icons/index.js` | Single source of truth for all vector icons across the platform, re-exporting standardized icons from `lucide-react` plus the local brand icons. |
| **Social / Brand Icons** | `src/lib/icons/social-icons.jsx` | Inline-SVG brand marks (`InstagramIcon`, `FacebookIcon`, `XIcon`, `LinkedInIcon`, `YouTubeIcon`) used by the footer social row. `lucide-react` 1.x dropped brand logos, so these live here and are re-exported through `src/lib/icons/index.js`; components must still import from `@/lib/icons`, never `lucide-react` directly. Icons inherit `currentColor` and are `aria-hidden` because the surrounding link carries the accessible name. |
| **Toast Feedback Contract** | `src/lib/toast-feedback.js` | Centralised `sonner` helpers (`notifySuccess`, `notifyError`, `notifyInfo`) plus `TOAST_COPY` (canonical copy) and `TOAST_ID` (dedupe ids). Components **must not** import `toast` from `sonner` directly; this module owns durations, copy, and single-announcement behaviour. |
| **Toast Surface** | `src/app/layout.js` + `src/app/globals.css` | Single `Toaster` mount for the whole app (bottom-right, light theme, close button, labelled live region). Brand styling is applied through sonner's CSS custom properties in the `Sonner toast tokens` block of `globals.css`, because sonner's injected CSS is unlayered and cannot be overridden by Tailwind utilities. |
| **Newsletter Service** | `src/services/newsletter.js` | Browser client for the external backend newsletter endpoint (`API_ENDPOINTS.NEWSLETTER` in `src/services/api_constants.js`). Exposes `submitNewsletterSubscription(email)` and honest error codes (`NOT_CONFIGURED`, `ALREADY_SUBSCRIBED`, `FAILED`) so the footer form never claims a subscription that did not happen. |
| **OpenGraph Card Asset** | `public/og-image.png` + `scripts/generate-og-image.mjs` | The single 1200×630 social share image used by every page and JSON-LD node. Generated (`npm run og:image`) from `public/transparent_logo_meelTe.png` on the `canvas` token with a purple dot grid, an eyebrow line and a `meelte.com · Bengaluru · Gaya · Ranchi` caption. Committed as a static PNG because social crawlers do not run JavaScript and WhatsApp drops previews above 600KB. Paths come from `OG_IMAGE_PATH` in `src/lib/seo/metadata.js`; `BRAND_LOGO_PATH` (`/icon.png`) serves the schema logo. |
| **Container Primitive** | `src/components/layout/container.jsx` | Standardized `max-w-7xl` wrapper with 4pt rhythmic responsive horizontal padding. |
| **Breadcrumbs Primitive** | `src/components/layout/breadcrumbs.jsx` | Shared breadcrumb trail (`nav[aria-label="Breadcrumb"]` + `<ol>`, `items`-driven, `aria-current="page"` on the final item). **Every page must render it** so navigation and `BreadcrumbList` schema stay consistent — see §2.6. |
| **Button Primitive** | `src/components/ui/button.jsx` | Accessible brand button supporting `primary`, `secondary`, `accent`, `outline`, `ghost`, and `pill` variants with focus rings. |
| **Card Primitive** | `src/components/ui/card.jsx` | Soft community card container (`rounded-2xl`, `shadow-soft`, `hover:shadow-card`) and semantic subcomponents (`CardHeader`, `CardTitle`, etc.). |
| **Badge Primitive** | `src/components/ui/badge.jsx` | Pill tag for area chips and city indicators. |
| **Navbar Header** | `src/components/layout/navbar.jsx` | Responsive sticky header with brand identity, desktop nav links (Product/Company dropdowns, `lg` and up), and the two store download pills (`StoreButton` Google Play + App Store in the `brand` variant, from `config/site.js`) at `lg` and up. Below `lg` the header shows only the logo and the hamburger — no compact download CTA — because those downloads live inside the `MobileNav` drawer. |
| **Mobile Drawer** | `src/components/layout/mobile-nav.jsx` | Accessible slide-over drawer built with `@radix-ui/react-dialog` (`lg:hidden` trigger) with focus containment and touch-friendly links. It is the only compact download surface below `lg`, so its footer stacks the Google Play and App Store `StoreButton`s in the default `badge` variant under a "Get the app" label. |
| **Hero Section** | `src/components/sections/home/hero-section.jsx` | Above-the-fold, text-only value proposition: trust pills, headline and summary over the gradient-mesh and map-line background. The phone mock and decorative floating cards were removed (no invented listings or distances). **The hero currently renders no store CTA** — the app pair is promoted by the navbar, `MobileNav` and `FinalConversionCTA` — so do not describe it as carrying a Play Store button until one is added. |
| **How It Works Page** | `src/app/how-it-works/page.jsx` | Explains the product mechanics and then the honest limits: hero → resident steps → three roles → boundaries → a five-question FAQ teaser → shared `FinalConversionCTA`. Emits HowTo (the four resident steps), ItemList (`#roles`, one entry per role card), `getBreadcrumbsJsonLd(HOW_IT_WORKS_BREADCRUMBS)` and an FAQPage built from exactly the questions rendered. The old tabbed `EcosystemSection`, the homepage-duplicating `ProductExperienceSection` and the unverified `TrustCredibilitySection` were removed from this route rather than restyled. |
| **How It Works Hero** | `src/app/how-it-works/_components/how-it-works-hero.jsx` | Static LCP region: breadcrumbs, headline, one paragraph on who posts and who settles, then the two live store actions — Google Play as the primary pill and the App Store as the outlined pill beside it — with `/discover` demoted to a text link so no third button-weight action competes. The availability line states that both stores are live and the browser-based app is still in development. The aside lists the three `PLATFORM_AREAS` from `src/constants/app-constants.js`, each linked at its `/discover#<anchor>`. No `framer-motion`, no phone mock, no invented listings or distances. Exports `HOW_IT_WORKS_BREADCRUMBS` so the visible trail and the `BreadcrumbList` share one array (§2.6). |
| **How It Works Steps** | `src/app/how-it-works/_components/how-it-works-steps.jsx` | `#residents`: ordered list of the four steps a resident actually takes (install → allow location → browse → directions / follow / join request), mapped to the "Riya" journey in `docs/target_customer.md` §4, closing with the "who handles the money" note and a `/faq` link. Deliberately omits reward coins, per-city zone rules and any booking or payment claim. |
| **How It Works Roles** | `src/app/how-it-works/_components/how-it-works-roles.jsx` | `#roles`: three static cards — shops & service businesses → `/for-merchants`, event hosts & clubs → `/discover#events`, neighbours & new arrivals → `/discover#people`. The shop card names the `OPERATIONAL_HUBS` where the field team onboards in person; the people card states that browsing new people is still rolling out. No merchant pricing, no verification wording, no reach claims. |
| **How It Works Boundaries** | `src/app/how-it-works/_components/how-it-works-boundaries.jsx` | `#boundaries`: the four documented limits (no checkout or tickets, no local jobs board, no verification badge, no reach analytics) plus a location-and-privacy band linking `/privacy` and `/faq`. Replaces the removed trust section, whose "0% commission", "30% platform cut" and Bengaluru-office claims had no product evidence. |
| **Business Acquisition** | `src/components/sections/home/business-acquisition-section.jsx` | Merchant-page onboarding section with three steps (merchant enquiry → field-team visit → first published ad) and an honest `mailto:` handoff because no backend endpoint exists. Renders only on `/for-merchants`; the homepage links to this dedicated journey instead of duplicating its details. |
| **Product Experience** | `src/components/sections/home/product-experience-section.jsx` | Shared walkthrough of four evidenced capabilities (offers, events, one-to-one chat, location & privacy) with selectable summaries and a conceptual phone preview—not a production screenshot or real listing. Do not invent businesses, prices, dates, attendee counts, or chat messages. |
| **City Coverage** | `src/components/sections/home/hyperlocal-discovery-section.jsx` | Compact city-coverage band: the three confirmed hubs (Bengaluru, Gaya, Ranchi) at city level only, the three `PLATFORM_AREAS` names linked to their `/discover#<anchor>` sections, and links to `/discover` and `/for-merchants`. Deliberately carries no neighbourhood clusters, no "active zone" statuses, no merchant-verification wording, and no jobs entry — none of those have product evidence (see `docs/target_customer.md` §5 and `meelte-context.md` §3). **Not rendered on the homepage** (Oct 2026); the component and its barrel export were also removed from `src/components/sections/home/index.js`, so the file is currently unused and imports nothing. |
| **Final Conversion CTA** | `src/components/sections/home/final-conversion-cta.jsx` | Resident-focused bottom CTA that promotes both live listings together — Google Play as the accent primary and the App Store as the outlined secondary — plus a secondary text link to merchant onboarding. Availability is stated clearly; no web-app sign-up is implied. |
| **Discover Areas** | `src/components/sections/discover/discover-areas.jsx` | "Three things you can do in Meelte" — the scannable capability cards rendered by `src/app/discover/page.jsx`. Copy, taglines and the three bullet points per card come from `PLATFORM_AREAS` in `src/constants/app-constants.js`; the `offers` / `events` / `people` anchors are consumed by the footer links, the hero "On this page" nav and the `CollectionPage` ItemList. Closes with the honest settlement note (Meelte does not sell goods, run events or take payments). |
| **Discover Steps** | `src/app/discover/_components/discover-steps.jsx` | Server-rendered first-run path for `/discover`: an ordered list of three steps (download → allow location → browse what is nearby) mapped to the "Riya" journey in `docs/target_customer.md` §4. Step one names both live stores. No client state, no rewards copy. |
| **FAQ Accordion** | `src/components/sections/common/faq-section.jsx` | AEO-optimized FAQ accordion built with `@radix-ui/react-accordion`. Accepts optional `items`, `viewAllHref`, `title`, `description`, and `showMerchantLink` props. The homepage selects four resident-focused questions; `/for-merchants` selects four merchant-focused questions; both generate FAQPage JSON-LD from the rendered subset. `/discover` renders its five-question teaser, `/how-it-works` its five-question mechanics teaser (what Meelte is, where it runs, join requests, payments, the social side), and `/faq` renders the complete list with its own accordion (see the **FAQ Page** row). The optional merchant-desk link uses `next/link` to `/for-merchants`; support email reads `SUPPORT_EMAIL` from `config/site.js`. `Accordion.Content` is `forceMount`ed so collapsed answers stay in the prerendered HTML (Radix still applies `hidden`); without that, the answers a page declares in `FAQPage` are absent for non-JS crawlers. The section is named by its `h2` via `aria-labelledby`. |
| **FAQ Page** | `src/app/faq/page.jsx` | The full 22-question set over `src/data/faq.json`, rendered with its own Radix accordion rather than the shared `FaqSection` (this route needs the complete list, not a teaser). `faqJsonLdItems` maps the same JSON to `getFaqPageJsonLd()`, so rendered answers and `FAQPage` text come from one source and cannot drift; `Accordion.Content` is `forceMount`ed for the same crawlability reason as the shared section (verified: 22/22 schema answers appear in the prerendered HTML). Merges `getBreadcrumbsJsonLd(BREADCRUMB_ITEMS)` into the same JSON-LD array. Metadata names both live stores; the old "Meelte Android app" framing is gone. |
| **Global Footer** | `src/components/layout/footer.jsx` | Brand block (description, privacy promise) plus exactly **three link columns** driven by a single `FOOTER_SECTIONS` array — **Product** (Discover, How it works, For shops → `/for-merchants`, Support), **In the app** (mapped from `PLATFORM_AREAS` to `/discover#<anchor>`), **Company** (About, Careers, Contact, FAQ) — followed by the newsletter form in the final column. Each link column is its own `nav` whose `aria-label` matches its visible `FooterColumn` heading. Also renders social links, the legal/support row, and the giant watermark wordmark. No store downloads here: they live in the navbar (`lg`+) and the `MobileNav` drawer. |
| **Store Download Button** | `src/components/footer/store-button.jsx` | Single source for the Google Play / App Store links, labels, icons and accessibility names (URLs come from `PLAY_STORE_URL` / `APP_STORE_URL` in `config/site.js`; `target`/`rel` are only added for `http` hrefs). Both listings are live, so both are always rendered. Two presentations of the same pair: `variant="badge"` (default, dark two-line store badge, used only in the `MobileNav` drawer) and `variant="brand"` (40px token-led pill used in the navbar — filled primary for Google Play, outlined primary for the App Store). |
| **Homepage Assembly** | `src/app/page.js` | Resident-first page assembly: skip-to-content link, `HeroSection`, `ProductExperienceSection`, a four-question resident FAQ teaser, `FinalConversionCTA`, `Navbar` + `Footer`. Emits a page-level `FAQPage` graph from the exact four questions rendered. **The hero renders no store CTA** (text-only headline and summary), so the homepage promotes both listings through the `Navbar` pills, the `MobileNav` drawer and `FinalConversionCTA` — do not describe the hero as carrying a download button until one is added. The full merchant capabilities and onboarding flow live on `/for-merchants`; the root `WebSite`/`Organization`/`MobileApplication` graph still comes from `src/app/layout.js`. |