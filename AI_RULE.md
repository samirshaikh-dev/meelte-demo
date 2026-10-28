# AI Rules & Engineering Directives — Meelte Next.js Website

> **Repository:** `nextjs-website`  
> **Brand:** Meelte (Hyper-local Community Platform)  
> **Stack:** Next.js 16 (App Router), React 19, Tailwind CSS v4, npm  
> **Companion Directives:** [`context.md`](./context.md), [`AGENTS.md`](./AGENTS.md), [`docs/target_customer.md`](./docs/target_customer.md), [`docs/color-theme.md`](./docs/color-theme.md)

---

## 1. The Golden Directive: Mandatory Skills Protocol

> [!CAUTION]
> ### STRICT ENFORCEMENT: ZERO IMPLEMENTATION WITHOUT READING SKILLS
> Before proposing any changes, writing a single line of code, creating new files, or editing existing files, the AI **MUST ALWAYS load and read the applicable skill file(s) from `agents/skills/` using `view_file`**.

### Primary Discipline Routing:
- **UI & Visual Design:** [`agents/skills/ui-ux-engineer/SKILL.md`](./agents/skills/ui-ux-engineer/SKILL.md) — Layout, color tokens, typography, bento grids, responsive aesthetics.
- **Frontend & Components:** [`agents/skills/frontend-engineer/SKILL.md`](./agents/skills/frontend-engineer/SKILL.md) — Next.js 16 App Router, React 19, Server vs. Client boundaries, zero CLS, interactive forms.
- **Accessible Animation & Motion Tiering:** [`agents/skills/accessible-animation/skill.md`](./agents/skills/accessible-animation/skill.md) — WCAG 2.3.3 / C39, `prefers-reduced-motion` tiering (Tier 1 vestibular removal, Tier 2 soften/fade, Tier 3 keep feedback).
- **AI Output Judgement & Quality Review:** [`agents/skills/ai-output-judgement/skill.md`](./agents/skills/ai-output-judgement/skill.md) — Anti-slop review rubric (tokens over arbitrary hex, native semantics, intentional layout, error/loading/empty states).
- **Technical SEO & AEO:** [`agents/skills/seo-engineer/SKILL.md`](./agents/skills/seo-engineer/SKILL.md) & [`agents/skills/seo-strategy/SKILL.md`](./agents/skills/seo-strategy/SKILL.md) — Schema.org JSON-LD, sitemaps, robots.txt, metadata, `llms.txt` for AI answer engines.
- **Accessibility:** [`agents/skills/accessibility-engineer/SKILL.md`](./agents/skills/accessibility-engineer/SKILL.md) — Semantic HTML, keyboard operability, color contrast, ARIA labels.
- **Performance:** [`agents/skills/performance-engineer/SKILL.md`](./agents/skills/performance-engineer/SKILL.md) — Core Web Vitals (LCP, CLS, INP), asset optimization, code splitting.

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
- **Source of Truth:** Colors and typography MUST strictly adhere to [`docs/color-theme.md`](./docs/color-theme.md) and Tailwind CSS v4 tokens in `src/styles/globals.css`:
  - **Brand Primary (Mid Purple):** `#6D3BB3`
  - **Brand Royal/Dark Gradient:** `#5B2E91` to `#7A45C4`
  - **Accent Amber/Gold:** `#F59E0B` / `#F4B740`
  - **Canvas Background:** `#F8F5FF`
  - **Card Surface:** `#FFFFFF`
  - **Text High-Contrast:** `#1F1F28` (Primary) and `#6B7280` (Secondary)
- **Simple, Clean & Minimal UI:** Keep interfaces clean, simple, and minimal. Prioritize deliberate whitespace, calm readability, clear content hierarchy, and intuitive navigation. Avoid visual clutter, gratuitous decorative elements, dense badge stacking, and distracting animations. Every visual element must serve a concrete discovery or conversion goal.
- **Zero Fabricated Claims & Metrics Policy:** Never invent exaggerated SaaS metrics (e.g., *"50,000+ Happy Users"* or *"10,000+ Local Stores"*). Use genuine product features, real coverage areas (`Bengaluru`, `Gaya`, `Ranchi`), and authentic value propositions (*"Community Moderated"*, *"Zero Commission"*, *"Location Never Sold"*) instead of vanity numbers.
- **Centralized Vector Icons:** Never import directly from `lucide-react` across random components. Always route icon imports through the single source of truth [`src/lib/icons/index.js`](./src/lib/icons/index.js). Standardize icon sizing scale (`h-4 w-4` for inline/button, `h-5 w-5` for cards/nav, `h-6 w-6` for section headers).
- **Accessibility & Tiered Motion Standards:** 
  - Ensure full keyboard operability with explicit `focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2` on all interactive triggers.
  - Every icon-only button must declare a clear `aria-label`.
  - Respect `prefers-reduced-motion: reduce` following [`agents/skills/accessible-animation/skill.md`](./agents/skills/accessible-animation/skill.md) (Tier 1: remove vestibular triggers like parallax/continuous marquees; Tier 2: shorten/fade transitions to ≤200ms; Tier 3: preserve essential feedback like focus rings and spinners).
- **Visual Polish:** High-impact, modern presentation tailored to community members and merchants: bento grids, responsive layouts, micro-interactions, and clear trust badges (*"Privacy First — Location never sold or shared"*).
- **Core Web Vitals:** Always use Next.js `<Image>` with explicit width/height and `priority` on above-the-fold hero elements. Ensure zero Cumulative Layout Shift (CLS).

### 2.3 SEO & Domain Constants Standardization
- **Single Source of Truth for Geo & Taxonomy:** Centralize site name, base URL, social handles, and default metadata in `src/config/site.js`. Focus coverage cities (`TARGET_CITIES`) and categories (`CATEGORIES`) must be imported from `src/constants/app-constants.js`. Never hardcode city or category lists across components.
- **Keep SEO Schema Synchronized:** When modifying categories or coverage areas, update both [`src/constants/app-constants.js`](./src/constants/app-constants.js) and [`src/lib/seo/structured-data.js`](./src/lib/seo/structured-data.js) to keep metadata and structured data in parity.
- **JSON-LD Structured Data:** Maintain valid Schema.org schemas (`Organization`, `WebSite`, `BreadcrumbList`, `Event`, `JobPosting`, `LocalBusiness`, `FAQPage`).
- **Discovery Infrastructure:**
  - Dynamic XML sitemap at `src/app/sitemap.js` (stable release date for static routes; real `modifiedDate` for external BE slugs; never `new Date()`).
  - Search crawler directives at `src/app/robots.js`.
  - Dynamic 1200x630 OpenGraph cards via `src/app/opengraph-image.jsx`.
  - Machine-readable knowledge file at `public/llms.txt` for AI search engines (Perplexity, ChatGPT, Claude).

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

1. **Package Manager:** Always use **`npm`** (`npm run dev`, `npm run build`, `npm run lint`). **NEVER** run `pnpm` or `yarn`.
2. **Environment Secrets:** Never print, log, or commit secret keys from `.env`.
3. **No Destructive Commands:** Never execute destructive operations (`rm -rf`, `git reset --hard`) without explicit user direction.
4. **Follow Established Patterns:** Keep file and folder names lowercase with kebab-case or standard Next.js conventions (`page.jsx`, `layout.jsx`, `route.js`).
5. **Explain Your Work:** Always cite which skill guided the work, explain what changed, and state why.
6. **Clean Edits & Export Verification:** When editing files, verify that no duplicate component blocks or duplicate `export default` statements remain at the end of the file. Always review the full file structure after editing.
7. **Turbopack Stale Cache Awareness & Dev Server Restarts:** Next.js 16 with Turbopack can occasionally retain stale compiled module graphs in memory during active component restructuring. If compile errors persist for a file verified clean on disk, restart the dev server (`Ctrl+C` then `npm run dev`) before making speculative code changes.
8. **Production Build Validation:** Validate major milestones with `npm run build` to confirm zero lint/type errors, valid server/client boundaries, and clean static generation.
9. **Repository Structure & Documentation Maintenance:**
   - **Descriptive Naming:** Every new file and folder must have a clear, meaningful, self-explanatory name that helps any developer understand its purpose without opening it.
   - **Mandatory `AI_rule.md` Updates:** Whenever you create, rename, move, restructure, or delete a file or folder, update `AI_rule.md` in the same task to reflect the change.
   - **Document Responsibilities:** For new files and folders, document their purpose, responsibilities, location, and relationship to other modules wherever relevant.
   - **Follow Existing Conventions:** Inspect the existing repository structure before introducing new files or folders. Follow established naming conventions, Next.js App Router patterns, and architectural boundaries.
   - **Keep References Accurate:** Update outdated file paths, folder references, and architectural descriptions. Remove documentation for deleted files and avoid duplicate entries.
   - **No Unnecessary Files:** Before creating a new file or folder, check whether an existing module can accommodate the requirement without compromising separation of concerns.
   - **Final Verification:** Before completing the task, verify that `AI_rule.md` accurately reflects all structural changes and that documented paths exist.
   - **Core Principle:** A developer should be able to understand the repository's structure, navigate to the correct location, and identify each file's responsibility through descriptive naming and `AI_rule.md` documentation.

---

## 4. Current Component Registry & Homepage Architecture

| Module / Component | Path | Responsibility & Purpose |
| :--- | :--- | :--- |
| **Class Merger** | `src/lib/utils.js` | Exports `cn()` combining `clsx` and `tailwind-merge` for conflict-free dynamic styling. |
| **Centralized Icons** | `src/lib/icons/index.js` | Single source of truth for all vector icons across the platform, re-exporting standardized icons from `lucide-react`. |
| **Toast Feedback Contract** | `src/lib/toast-feedback.js` | Centralised `sonner` helpers (`notifySuccess`, `notifyError`, `notifyInfo`) plus `TOAST_COPY` (canonical copy) and `TOAST_ID` (dedupe ids). Components **must not** import `toast` from `sonner` directly; this module owns durations, copy, and single-announcement behaviour. |
| **Toast Surface** | `src/app/layout.js` + `src/app/globals.css` | Single `Toaster` mount for the whole app (bottom-right, light theme, close button, labelled live region). Brand styling is applied through sonner's CSS custom properties in the `Sonner toast tokens` block of `globals.css`, because sonner's injected CSS is unlayered and cannot be overridden by Tailwind utilities. |
| **Newsletter Service** | `src/services/newsletter.js` | Browser client for the external backend newsletter endpoint (`API_ENDPOINTS.NEWSLETTER` in `src/services/api_constants.js`). Exposes `submitNewsletterSubscription(email)` and honest error codes (`NOT_CONFIGURED`, `ALREADY_SUBSCRIBED`, `FAILED`) so the footer form never claims a subscription that did not happen. |
| **Container Primitive** | `src/components/layout/container.jsx` | Standardized `max-w-7xl` wrapper with 4pt rhythmic responsive horizontal padding. |
| **Breadcrumbs Primitive** | `src/components/layout/breadcrumbs.jsx` | Shared breadcrumb trail (`nav[aria-label="Breadcrumb"]` + `<ol>`, `items`-driven, `aria-current="page"` on the final item). **Every page must render it** so navigation and `BreadcrumbList` schema stay consistent — see §2.6. |
| **Button Primitive** | `src/components/ui/button.jsx` | Accessible brand button supporting `primary`, `secondary`, `accent`, `outline`, `ghost`, and `pill` variants with focus rings. |
| **Card Primitive** | `src/components/ui/card.jsx` | Soft community card container (`rounded-2xl`, `shadow-soft`, `hover:shadow-card`) and semantic subcomponents (`CardHeader`, `CardTitle`, etc.). |
| **Badge Primitive** | `src/components/ui/badge.jsx` | Pill tag for category chips, verified store badges, and city indicators. |
| **Navbar Header** | `src/components/layout/navbar.jsx` | Responsive sticky header with brand identity, city coverage badge, desktop nav links, and Play Store CTA. |
| **Mobile Drawer** | `src/components/layout/mobile-nav.jsx` | Accessible slide-over drawer built with `@radix-ui/react-dialog` with focus containment and touch-friendly links. |
| **Hero Bento Grid** | `src/components/sections/home/hero-section.jsx` | High-impact above-the-fold value proposition with 4-pillar bento grid (Discover, Connect, Create, Grow). |
| **Ecosystem Map** | `src/components/sections/home/ecosystem-section.jsx` | Interactive tabbed explorer for Residents, Local Merchants, Job Seekers, and Event Hosts. |
| **Consumer Journey** | `src/components/sections/home/consumer-journey-section.jsx` | Category-driven interactive walkthrough (Food, Fashion, Events, Services, Health). |
| **Business Acquisition** | `src/components/sections/home/business-acquisition-section.jsx` | Direct comparison table (Meelte vs Traditional Aggregators) & modal inquiry form. |
| **Product Experience** | `src/components/sections/home/product-experience-section.jsx` | Visual app preview showcasing discovery radar, instant verification, and direct chat. |
| **Hyperlocal Hubs** | `src/components/sections/home/hyperlocal-discovery-section.jsx` | Neighborhood directory across operational launch hubs (Bengaluru, Gaya, Ranchi). |
| **Final Conversion CTA** | `src/components/sections/home/final-conversion-cta.jsx` | Dual-audience bottom CTA driving mobile app downloads and merchant onboarding. |
| **Categories Grid** | `src/components/sections/home/categories-section.jsx` | Hyperlocal 5-category showcase (Food, Fashion, Events, Services, Health) with real neighborhood listings. |
| **FAQ Accordion** | `src/components/sections/common/faq-section.jsx` | AEO-optimized FAQ accordion built with `@radix-ui/react-accordion` addressing privacy, merchant setup, and city coverage. |
| **Trust Credibility** | `src/components/sections/common/trust-credibility-section.jsx` | Zero-compromise institutional trust guarantees, verification badges, and privacy standards. |
| **Trust Badges Strip** | `src/components/sections/common/trust-strip.jsx` | Directly below-hero credibility badges ("Privacy First", "Community Moderated", "Zero Commission", "Built for India"). |
| **Proof Bar** | `src/components/sections/common/proof-bar.jsx` | Platform credibility principles, zero-fabrication metrics, and neighborhood focus. |
| **App Download Banner** | `src/components/sections/common/app-download-cta.jsx` | High-contrast brand purple call-to-action banner with Play Store download link. |
| **Jobs Preview** | `src/components/sections/jobs/jobs-preview.jsx` | Curated local job listings with employer badges, transparent salary, and HR recruiter callout. |
| **Merchant Spotlight** | `src/components/sections/business/merchant-cta.jsx` | "Grow with Meelte" 3-step SMB pathway, value props, and enquiry modal dialog. |
| **Global Footer** | `src/components/layout/footer.jsx` | Multi-column directory footer with social links, categories, legal links, and privacy promise. |
| **Homepage Assembly** | `src/app/page.js` | Top-to-bottom page assembly integrating all sections, skip-to-content accessibility link, and FAQPage JSON-LD. |