# Gemini Context & System Directives

## Project Overview
Next.js App Router starter project.

- Stack: Next.js 16.4.3, React 19.3.0, Tailwind CSS v4
- App Router code lives in `src/app/`

## Mandatory Pre-Implementation Protocol: ALWAYS Read Project Context First

> [!CAUTION]
> ### STRICT ENFORCEMENT: ZERO IMPLEMENTATION WITHOUT READING PROJECT CONTEXT
> Before proposing any changes, writing a single line of code, creating new files, or editing existing files, the AI **MUST ALWAYS read all four documents below in full**. No exceptions, no partial reads, no relying on memory from an earlier session.

| Order | Document | Read it for |
| :--- | :--- | :--- |
| 1 | [`docs/target_customer.md`](./docs/target_customer.md) | Real audience segments, personas, pain points, and the product facts they are derived from. Every claim, CTA, and keyword choice must be traceable to this file. |
| 2 | [`project-context.md`](./project-context.md) | Current routes, components, architecture boundaries, tech stack, known issues, and active next steps. |
| 3 | [`meelte-context.md`](./meelte-context.md) | Product/business intent, messaging direction, design direction, and the do/do-not guardrails. |
| 4 | [`docs/Design.md`](./docs/Design.md) | The design contract for anything visual: 24 color tokens and their values, typography, shadows and radii, measured contrast ratios, and the documented inconsistencies you must not extend. Read it before any color, spacing, or component-styling change. |

If these documents disagree with each other or with the code, **surface the conflict** and resolve it deliberately — never silently pick one.

## Mandatory Pre-Implementation Protocol: ALWAYS Load & Use Agents Skills

> [!CAUTION]
> ### STRICT ENFORCEMENT: ZERO IMPLEMENTATION WITHOUT READING SKILLS
> Before proposing any changes, writing a single line of code, creating new files, or editing existing files, the AI **MUST ALWAYS load and read the applicable skill file(s) from `.agents/skills/` using `view_file`**.

Skill paths: `.agents/skills/<skill-id>/SKILL.md` (24 discipline skills, note the leading dot). Shared role agents live in `.opencode/agents/<agent-id>.md` (loaded by OpenCode) and `.github/agents/<agent-id>.agent.md` (GitHub Copilot) — keep the pairs in sync. Skills: `accessibility-engineer`, `accessible-animation`, `ai-engineer`, `ai-output-judgement`, `animate`, `application-security`, `api-security`, `backend-engineer`, `backend-security`, `database-engineer`, `dependency-security`, `devops-engineer`, `frontend-engineer`, `frontend-security`, `infrastructure-security`, `performance-engineer`, `personal-seo-profile-optimizer`, `security-audit`, `security-engineer`, `seo-engineer`, `seo-keyword-research-implementation`, `seo-strategy`, `ui-ux-engineer`, `ux-pattern-researcher`. Agents: `accessibility-engineer`, `ai-engineer`, `application-security`, `api-security`, `backend-security`, `dependency-security`, `frontend-engineer`, `frontend-security`, `infrastructure-security`, `performance-engineer`, `seo-engineer`, `security-audit`, `ux-pattern-researcher`, `website-coordinator`.

## Rules

1. **Context Docs First:** Always read `docs/target_customer.md`, `project-context.md`, `meelte-context.md`, and `docs/Design.md` in full before proposing changes or writing code.
2. **Skills First:** Always read relevant skill files in `.agents/skills/` before proposing changes or writing code.
3. **Use the right package manager:** Use the package manager defined in `package.json` (`npm`).
4. **No Secret Commits:** Never expose or log `.env` values.
5. **Follow existing patterns:** Keep changes consistent with the current structure and style.
6. **Explain Your Work:** Clearly state what changed and why. Cite the context documents and skills applied.

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
