# AGENTS.md — Halall (Web App Scanner)

## Purpose
Halall es una web app PWA sin anuncios ni login, orientada al viajero musulmán en España.
Proporciona el escaneo ultrarrápido de ingredientes y dictamen de halal / dudoso / haram de los supermercados españoles con OCR AI como fallback, respetando la estricta certificación de carnes.

## Instruction Priority
1. Explicit user instructions and safety constraints.
2. This guide, `docs/constitution.md`, and the active spec.
3. Existing codebase conventions and patterns.
4. Agent heuristic preferences.

If two sources conflict: stop, quote the conflict, and request a human decision. Never invent requirements.

## Sources of Truth
- Behavior: `specs/NNN-slug/spec.md`.
- Decisions: `clarify.md` and `plan.md` for that feature.
- Implementation State: Git, `tasks.md`, CI, and `verify.md`; never chat context alone.
- Marketing & Growth Playbooks: `/data/ai-studio/vault/1-wiki/marketing/playbooks/` (consult index at `/data/ai-studio/vault/1-wiki/marketing/AGENTS.md` for CRO, onboarding, copy, SEO, and launch).
- Secrets: Secret manager or environment variables; never versioned files or logs.

## Stack & Key Directories
- Language/Runtime: TypeScript 5 / Node.js
- Framework: Next.js 16.3.4 (App Router) + React 19.2.8 + Tailwind CSS 4
- Data Store: Supabase (PostgreSQL) + Drizzle ORM
- Testing: Vitest 5.0.0
- Key Paths: `src/` (source code), `specs/` (SDD features), `docs/` (constitution)

## Mandatory Commands
| Phase | Command | Scope S (Trivial/Fix/Docs) | Scope M / L (Feature/Refactor) |
|---|---|---|---|
| Dependencies | `npm install` | Si cambian dependencias | Si cambian dependencias |
| Tests | `npm run test` | Test del archivo modificado | Suite completa (`npm run test`) |
| Lint / Format | `npm run lint` | Opcional si solo toca docs | Sí (`npm run lint`) |
| Typecheck | `npx tsc --noEmit` | Sí (si toca código TypeScript) | Sí (`npx tsc --noEmit`) |
| Build | `npm run build` | Opcional (solo si toca config/rutas) | Sí (`npm run build` obligatorio) |
| DB Generate | `npm run db:generate` | Autónomo (genera SQL local en drizzle/) | Autónomo (genera SQL local en drizzle/) |
| DB Migrate | `npm run db:migrate` | Requiere Aprobación (DDL Supabase) | Requiere Aprobación (DDL Supabase) |

Never output "passed" without providing the executed command and its raw output.

## Working Protocol
- Classify the change as S, M, or L before touching code.
- Use one branch or worktree per change; do not disturb unrelated work.
- For M and L, read the specification and resolve open artifacts before implementing.
- Keep tasks atomic, reviewable, and tied to concrete file paths.
- Update tests and code in lockstep when behavior changes.
- Record any decision impacting scope, data, security, or public API before implementation.

## Project Conventions
- Naming: kebab-case for files and folders; PascalCase for React components; camelCase for functions, hooks, and database schemas.
- Tests: Unit tests in `tests/` with `*.test.ts` pattern using Vitest. Domain logic and classification rules must have 100% test coverage.
- Errors & Logs: Tolerant domain error handling returning typed results `{ success, data, error }`; never crash the UI on barcode or OCR network failures.
- Dependencies: 0,00 € operating cost policy (Phase 1). Prefer pure TypeScript and Web standard APIs over external packages.
- Compatibility & Migrations: Drizzle ORM on Supabase PostgreSQL. Schema changes must be generated via Drizzle-Kit and committed to `drizzle/`.

## Hard Boundaries
- Do not add dependencies, alter public contracts, migrate schemas, or change infrastructure without a plan and explicit approval.
- Do not expose secrets, credentials, or personal data in code, documentation, or tests.
- Do not disable tests, linters, or security checks to force a build to pass.
- Do not declare a change completed with pending or failing checks.

## Actions Requiring Human Approval
- Deploying, publishing, sending external messages, or incurring monetary costs.
- Deleting or migrating persistent data non-reversibly.
- Modifying permissions, rotating secrets, or changing access control policies.