# CLAUDE.md — Claude Code Operating Guide

> Companion to [`AGENTS.md`](./AGENTS.md) and [`AI_RULE.md`](./AI_RULE.md). Read both before any task.

## Mandatory Protocol: Read Project Context First

> [!CAUTION]
> ### STRICT ENFORCEMENT: ZERO IMPLEMENTATION WITHOUT READING PROJECT CONTEXT
> Before proposing any changes, writing a single line of code, creating new files, or editing existing files, the AI **MUST ALWAYS read all four documents below in full**. No exceptions, no partial reads, no relying on memory from an earlier session.

1. [`docs/target_customer.md`](./docs/target_customer.md) — real audience segments, personas, pain points, and the product facts behind them. Every claim, CTA, and keyword must be traceable here.
2. [`project-context.md`](./project-context.md) — current routes, components, architecture boundaries, tech stack, known issues, and next steps.
3. [`meelte-context.md`](./meelte-context.md) — product/business intent, messaging and design direction, and the do/do-not guardrails.
4. [`docs/Design.md`](./docs/Design.md) — the design contract for anything visual: the 24 color tokens and their values, typography, shadows and radii, measured contrast ratios, and the inconsistencies you must not extend. Read it before any color, spacing, or component-styling change.

If these documents disagree with each other or with the code, surface the conflict and resolve it deliberately — never silently pick one.

## Project

**nextjs-website** — Next.js App Router starter.

- Stack: Next.js 16.4.3, React 19.3.0, Tailwind CSS v4
- Scripts: `npm run dev`, `npm run build`, `npm run start`, `npm run lint`

## Mandatory Protocol: Skills First

> [!CAUTION]
> ### STRICT ENFORCEMENT: ZERO IMPLEMENTATION WITHOUT READING SKILLS
> Before proposing any changes, writing a single line of code, creating new files, or editing existing files, the AI **MUST ALWAYS load and read the applicable skill file(s) from `.agents/skills/` using `view_file`**.

Read relevant skill files in `.agents/skills/<skill-id>/SKILL.md` (24 discipline skills — note the leading dot) before making changes. Skills: `accessibility-engineer`, `accessible-animation`, `ai-engineer`, `ai-output-judgement`, `animate`, `application-security`, `api-security`, `backend-engineer`, `backend-security`, `database-engineer`, `dependency-security`, `devops-engineer`, `frontend-engineer`, `frontend-security`, `infrastructure-security`, `performance-engineer`, `personal-seo-profile-optimizer`, `security-audit`, `security-engineer`, `seo-engineer`, `seo-keyword-research-implementation`, `seo-strategy`, `ui-ux-engineer`, `ux-pattern-researcher`. Shared role agents live in `.opencode/agents/<agent-id>.md` (loaded by OpenCode) and `.github/agents/<agent-id>.agent.md` (GitHub Copilot); keep the pairs in sync. Agents: `accessibility-engineer`, `ai-engineer`, `application-security`, `api-security`, `backend-security`, `dependency-security`, `frontend-engineer`, `frontend-security`, `infrastructure-security`, `performance-engineer`, `seo-engineer`, `security-audit`, `ux-pattern-researcher`, `website-coordinator`. Cite which skill guided the change if applicable.

## Rules

1. Read `docs/target_customer.md`, `project-context.md`, `meelte-context.md`, and `docs/Design.md` in full before any change.
2. Use the package manager in `package.json` (`npm`).
3. Never expose or commit `.env` secrets.
4. Follow existing code patterns and structure.
5. Never run destructive commands without explicit user authorization.
6. Explain what changed and why, citing the context documents and skills applied.

## Code Review Graph — Primary Codebase Intelligence

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