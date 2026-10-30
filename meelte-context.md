# Meelte Context

> **Purpose:** This document is the shared product and project context
> for developers and AI coding assistants working on the Meelte website.
>
> **Repository:** `nextjs-website` (intended project naming:
> `meelte-nextjs-web`) **Live website:** https://meelte.com/ **Project
> type:** Website redesign and rebuild **Last updated:** 29 October 2026
>
> **Read before any change:** `docs/target_customer.md`,
> `project-context.md`, this file, and `docs/Design.md` --- all four, in
> full. See `AGENTS.md` Step 0.

------------------------------------------------------------------------

## 1. What Is Meelte?

Meelte is both a **company/brand** and a **hyper-local community
platform**. Keep those two meanings distinct:

-   **Meelte the company** is the brand behind the product and needs a
    credible, clear digital presence.
-   **Meelte the platform** helps people discover and connect with their
    local community, nearby opportunities, services, businesses, and
    relevant local activity.

Do not describe Meelte only as an app or only as a generic community
feed. The website must explain the platform while also presenting the
company as trustworthy and capable.

### Product availability

-   The Meelte mobile app is currently available.
-   The web app is **coming soon**.
-   Never imply that the full web app is already available.
-   Make the current mobile experience easy to understand and provide a
    clear path for visitors who want to get started.

If exact supported features, app-store links, audience numbers,
testimonials, locations, or business outcomes are not documented in the
repository, do not invent them. Check the existing project content or
ask for confirmation.

------------------------------------------------------------------------

## 2. What We Are Doing

We are redesigning and rebuilding the existing Meelte website at
[meelte.com](https://meelte.com/) from scratch using a modern Next.js
application.

The current working repository is `nextjs-website`; the preferred
project identity/name is `meelte-nextjs-web`.

The immediate focus is the **homepage**, followed by supporting pages
such as the signup/onboarding page and other essential company/product
pages. The goal is not simply to make the existing site look newer. We
want a clearer message, a stronger first impression, better conversion
paths, and a foundation for organic search growth.

### Main business objectives

1.  **Attract users** by explaining the value of joining and using
    Meelte.
2.  **Attract businesses** by showing how Meelte can help them reach and
    engage with their local community.
3.  **Grow organic traffic** with clear page structure, useful content,
    strong metadata, crawlable links, and good technical SEO.
4.  **Build trust in the company** through a polished, consistent,
    credible brand presence.
5.  **Drive meaningful actions** rather than merely collecting page
    views.

### What success should look like

A first-time visitor should quickly understand:

-   What Meelte is.
-   Who it is for.
-   Why it is useful to them.
-   Whether they should explore the mobile app or learn more as a
    business.
-   What to do next.

The website should give users and businesses distinct, obvious paths
without making the homepage feel like two unrelated websites.

------------------------------------------------------------------------

## 3. Audience and Messaging

Audience definitions below are derived from `docs/target_customer.md`,
which audits the Flutter app, Supabase migrations and edge functions,
public web pages, and the in-app Terms & Conditions. Meelte is a
**two-sided hyper-local marketplace**: consumers come for nearby offers
and events, while merchants and event hosts come to reach those
consumers. Keep website messaging consistent with these segments and
the product evidence behind them.

### Primary audiences

**P1 --- Local consumers ("nearby discoverers").** Smartphone users in
India aged 13+ who are looking for offers, shops, and things to do
close by. They want to know what is on nearby right now, trust the
price, and get there easily. Product evidence: distance-sorted feeds
(default 60 km radius), rupee pricing, discount badges, one-tap Google
Maps directions, follow-a-shop updates, friends, chat, and calls.

**Messaging direction:** local relevance, recency, and ease. Talk about
what is happening near the visitor now, not about a global social feed.

**P2 --- Local merchants ("shopkeepers").** Independent shops,
restaurants, and service businesses that want local visibility without
running digital marketing. They need cheap, simple reach, a way to show
their whole menu or stock, and repeat customers. Product evidence: shop
ads with up to 100 products, menu-photo import (AI vision), AI product
images, discount formats, follower notifications, and in-person field
onboarding by Meelte staff.

**Messaging direction:** local visibility and low effort, with a
straightforward next step. Do not promise specific reach, leads,
revenue, footfall, or performance.

### Secondary audiences

**S1 --- Community event hosts.** Individuals, clubs, and small
organisers running local gatherings, activities, or paid meet-ups. They
need to fill an event with the right people and control who joins.
Product evidence: event creation, rupee joining cost, public/private
visibility, approval-based join requests with group size, attendee
removal, and follower notifications.

**S2 --- Referral-driven early adopters ("reward seekers").** Users
motivated by coins and Amazon vouchers for inviting friends. Product
evidence: referral codes, invites via contacts/WhatsApp/SMS, 30-coin
signup and referral bonuses, 10/50/100 milestones, and ₹100/₹500
voucher redemption with a ₹500 lifetime cap.

**S3 --- Social connectors.** Users who mainly want to meet and talk to
people nearby. Product evidence: friends, follows, 1:1 chat (text,
emoji, documents, location), Agora audio-video calls, block and report.
People discovery is still "coming soon", so treat social as supporting
evidence rather than a headline claim.

### Other readers of the website

**Web-only visitors.** People opening a shared ad or event link without
the app (routed to a download page), users deleting their account, and
policy readers such as parents, app-store reviewers, and partners on
the privacy, terms, and child-safety pages. Keep these journeys honest:
no non-functional signup flow and no implied live web app.

**Company evaluators.** Prospective partners, hires, and press who need
a coherent overview of the company, its product, and its direction.

**Messaging direction:** clear, professional, credible, and product-led.

**Internal users (out of website scope).** Field-acquisition staff,
supervisors, HR, accounts, and admins work in a separate admin panel.
They matter only where their work shapes the customer experience, for
example in-person merchant onboarding.

### Claim guardrails

-   Meelte does not sell goods, run events, take payments, or broker
    transactions; purchases and event fees settle offline between the
    two parties.
-   Merchant pricing is not confirmed in the product code. Before
    publishing "free listing", "0% commission", or any price claim,
    confirm it with the business team; no paid placement, subscription,
    commission, or in-app purchase exists in the product today.
-   The product has no consumer-visible merchant verification today.
    "Verified listing" or "verified business" style copy is unsupported
    and should be reviewed or removed.
-   No reach, views, or footfall analytics exist for merchants. Do not
    present analytics, dashboards, or reporting as a feature.
-   The jobs board has no product evidence yet. Do not describe local
    hiring as a shipped capability.
-   Keep segment names, persona stories, and any numbers within what
    `docs/target_customer.md` supports.

### Content principles

-   Use plain, specific language rather than vague marketing slogans.
-   Lead with visitor value, not a long company story.
-   Keep copy concise and scannable.
-   Explain benefits in context; avoid walls of feature lists and
    excessive cards.
-   Avoid duplicate headlines, repeated calls to action, and information
    repeated in multiple sections.
-   Do not make unsupported claims or invent testimonials, metrics,
    customer logos, or product capabilities.

------------------------------------------------------------------------

## 4. Design Direction

The site should be **conversion-focused, client-friendly, modern, and
memorable at first glance**.

### Visual principles

-   Make the primary message and main action immediately obvious.
-   Establish a clear hierarchy through typography, spacing, layout, and
    contrast.
-   Use a restrained visual system rather than adding decoration to
    every section.
-   Prefer a few strong, purposeful sections over a long stack of
    generic feature cards.
-   Use intentional asymmetry and balanced layouts where they improve
    comprehension.
-   Reduce empty space that feels accidental, while preserving breathing
    room.
-   Align related content consistently and remove duplicate information.
-   Make the design feel like a credible company website as well as a
    product website.
-   Use authentic product or brand assets where available; do not
    fabricate app screens that could be mistaken for the real product.
-   Design mobile-first and verify tablet and desktop layouts.

### Layout and conversion principles

-   Give the homepage a clear first-screen message, supporting
    explanation, and primary call to action.
-   Provide a visible, understandable path for users and another for
    businesses.
-   Make the mobile-app availability and web-app-coming-soon status
    unambiguous.
-   Place supporting proof and details near the claims they explain.
-   Keep navigation focused on the most important destinations.
-   Use consistent button labels and avoid competing primary actions.
-   Ensure every section has a clear purpose; remove a section if it
    repeats an earlier point without adding value.

### Signup / onboarding page

The signup-related page should explain the benefit of Meelte before
asking visitors to act. It should answer "Why should I choose Meelte?"
without becoming a feature-heavy sales page.

Clearly communicate:

-   The mobile app is currently available.
-   The web app is coming soon.
-   What the visitor can do next today.

Do not present a non-functional web signup or app flow as live. Make
sure navigation and calls to action lead to real, appropriate
destinations.

### Existing design guidance

Consult `docs/Design.md` and `project-context.md` before making design
decisions. Use the current repository's visual references and
established tokens rather than inventing a competing theme. If a
requested design direction conflicts with documented brand guidance,
identify the conflict and resolve it deliberately.

------------------------------------------------------------------------

## 5. Technology Stack

The current project stack is:

-   **Next.js 16** using the App Router
-   **React 19**
-   **Tailwind CSS v4**
-   **npm**
-   **JavaScript / JSX** in the existing implementation unless the
    repository establishes otherwise

Use the installed versions and current repository conventions. Do not
assume APIs from older Next.js or Tailwind releases are valid.

### Engineering principles

-   Prefer Next.js and React built-in capabilities before adding
    dependencies.
-   Add a package only when it solves a real requirement and is better
    than a small, maintainable existing solution.
-   Reuse existing components, design tokens, and utilities.
-   Keep components focused and composable.
-   Avoid unnecessary client components; use server components by
    default where appropriate.
-   Use semantic HTML, accessible controls, and meaningful labels.
-   Handle loading, empty, error, and responsive states where relevant.
-   Avoid duplicate dependencies or multiple libraries that solve the
    same problem.
-   Keep implementation maintainable for future contributors.

------------------------------------------------------------------------

## 6. SEO, Performance, and Accessibility

Organic traffic is a primary business objective, so SEO must be part of
implementation rather than a final checklist.

### SEO

-   Use a meaningful page title and meta description for each route.
-   Use a clear heading hierarchy with one main page heading.
-   Write useful, original copy that explains the product and its value.
-   Use descriptive internal link text and crawlable navigation.
-   Add canonical URLs, Open Graph metadata, sitemap, and robots
    configuration where appropriate.
-   Use structured data only when it accurately represents the company
    or page.
-   Ensure important information is available as crawlable text rather
    than only inside images.
-   Avoid keyword stuffing, duplicate copy, and unsupported
    location-specific claims.
-   Verify production URLs and metadata before considering SEO work
    complete.

### Performance

-   Optimize images and use appropriate image formats and sizing.
-   Minimize unnecessary JavaScript and client-side state.
-   Avoid layout shifts and oversized media.
-   Keep dependencies lean.
-   Test the production build, not only the development server.

### Accessibility

-   Use semantic landmarks and a logical heading order.
-   Ensure keyboard navigation and visible focus states.
-   Provide accessible names for icon-only controls.
-   Maintain sufficient text and control contrast.
-   Respect reduced-motion preferences for non-essential animation.
-   Do not use color alone to communicate important information.

------------------------------------------------------------------------

## 7. Repository Documentation and AI Instructions

The repository contains or is expected to use these project documents:

-   `project-context.md` --- existing project context; read it before major
    changes.
-   `AGENTS.md` --- agent/developer instructions; follow its
    requirements.
-   `docs/target_customer.md` --- audience and customer context.
-   `docs/Design.md` --- brand design system: colors, tokens, typography, and visual theme.
-   `AI_RULE.md` --- project-specific AI and engineering rules.
-   `meelte-context.md` --- this document; high-level product purpose,
    business goals, design direction, stack, and current work.

These documents have different roles. Keep them consistent and avoid
copying large sections into every file. If instructions conflict,
surface the conflict rather than silently inventing a rule.

### Documentation maintenance

When adding a new file, folder, package, major component, or
architectural pattern:

1.  Check `AI_RULE.md` and `AGENTS.md` for the required conventions.
2.  Update the relevant documentation if the change affects
    architecture, reusable patterns, setup, or workflow.
3.  Keep documentation accurate to the implementation.
4.  Do not claim that a feature or integration exists until it has
    actually been implemented and verified.

------------------------------------------------------------------------

## 8. Current Work and Known Issues

### Active priorities

1.  Redesign the homepage around the business objectives and the
    primary audiences: local consumers (P1) and local merchants (P2),
    with event hosts (S1), referral-driven early adopters (S2), and
    social connectors (S3) as secondary.
2.  Improve the first-screen impact, hierarchy, spacing, alignment, and
    conversion paths.
3.  Remove repeated information and unnecessary cards or sections.
4.  Ensure the signup/onboarding experience explains the product value
    and accurately communicates app availability.
5.  Maintain consistency with repository documentation and the existing
    design system.
6.  Validate responsive layouts, accessibility, SEO, and the production
    build.

### Known issue previously encountered

A build error was reported in `src/components/layout/footer.jsx` because
`Facebook` was imported from `lucide-react`, but that export was not
available in the installed package. Verify the current package exports
and use a valid icon or a dedicated social-brand icon component. Do not
assume this issue remains unresolved; check the current code before
acting.

### Project-status caution

This file records the known direction and reported issue, not a live
audit of the repository. Before editing, inspect the current branch,
working tree, files, installed packages, and build output. Do not assume
a previously discussed issue is still present.

------------------------------------------------------------------------

## 9. Working Workflow for AI Coding Assistants

Before making a significant change:

1.  Read `meelte-context.md`, `AGENTS.md`, `AI_RULE.md`,
    `project-context.md`, and the relevant files under `docs/`.
2.  Inspect the existing implementation and identify the actual source
    files and components involved.
3.  State the user/business problem the change is intended to solve.
4.  Prefer a cohesive, complete implementation over superficial visual
    patches.
5.  Reuse the established design system and avoid introducing duplicate
    content.
6.  Make only changes that are relevant to the requested outcome.
7.  Run appropriate linting, type checks (if configured), and production
    build checks.
8.  Report what changed, what was verified, and any remaining
    limitations.

Do not overwrite unrelated work, remove functioning behavior without a
reason, or claim checks passed unless they were run successfully.

------------------------------------------------------------------------

## 10. Definition of Done

A homepage or page redesign is ready for review when:

-   The page clearly communicates what Meelte is.
-   Both users and businesses can identify a relevant next step.
-   Mobile app availability and web app status are accurate.
-   The visual hierarchy is clear at a glance.
-   Layouts work across mobile, tablet, and desktop.
-   Repeated content and unnecessary whitespace have been addressed.
-   Components follow the established project conventions.
-   Links, navigation, and calls to action work as intended.
-   SEO metadata and semantic structure are present.
-   Accessibility and performance have been considered.
-   The production build succeeds, or any existing failure is documented
    accurately.
-   The relevant project documentation has been updated.

------------------------------------------------------------------------

## 11. Guardrails: Do and Do Not

### Do

-   Think like a product designer and engineer, not just a code
    generator.
-   Prioritize user understanding, business conversion, and organic
    discovery.
-   Keep the design minimal but not empty; use visual emphasis
    intentionally.
-   Make the company and platform relationship clear.
-   Use real product facts and assets.
-   Ask for clarification when a business claim, product capability, or
    destination is unknown.
-   Keep the implementation and documentation aligned.

### Do not

-   Treat Meelte as only a generic social-media app.
-   Treat Meelte as only a company brochure and hide the platform value.
-   Invent features, statistics, reviews, customer logos, or app-store
    links.
-   Suggest that the web app is already live.
-   add sections merely to make the page longer.
-   Repeat the same benefits in the hero, feature cards, and footer.
-   Add animations, gradients, shadows, or decorative elements without a
    clear purpose.
-   Install packages without checking whether the existing stack already
    solves the problem.
-   Claim the build, SEO, accessibility, or responsiveness has been
    verified without testing it.

------------------------------------------------------------------------

## 12. One-Sentence Project Brief

**Rebuild Meelte's website as a clear, memorable, conversion-focused
company and product experience that attracts local users and businesses,
explains the mobile platform honestly, and establishes a strong
foundation for organic growth.**
