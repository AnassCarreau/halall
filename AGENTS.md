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
- Secrets: Secret manager or environment variables; never versioned files or logs.

## Stack & Key Directories
- Language/Runtime: [VERSION]
- Framework: [NAME]
- Data Store: [NAME or N/A]
- Testing: [NAME]
- Key Paths: [PATH — Purpose]

## Mandatory Commands
| Phase | Command | Mandatory Before Declaring Done |
|---|---|---|
| Dependencies | `[command]` | If dependencies change |
| Tests | `[command]` | Yes |
| Lint / Format | `[command]` | Yes |
| Typecheck | `[command]` | If applicable |
| Build | `[command]` | Yes |
| Smoke / Manual Test | `[command or steps]` | If applicable |

Never output "passed" without providing the executed command and its raw output.

## Working Protocol
- Classify the change as S, M, or L before touching code.
- Use one branch or worktree per change; do not disturb unrelated work.
- For M and L, read the specification and resolve open artifacts before implementing.
- Keep tasks atomic, reviewable, and tied to concrete file paths.
- Update tests and code in lockstep when behavior changes.
- Record any decision impacting scope, data, security, or public API before implementation.

## Project Conventions
- Naming: [CONVENTIONS]
- Tests: [LOCATION AND PATTERN]
- Errors & Logs: [CONVENTIONS]
- Dependencies: [POLICY]
- Compatibility & Migrations: [POLICY]

## Hard Boundaries
- Do not add dependencies, alter public contracts, migrate schemas, or change infrastructure without a plan and explicit approval.
- Do not expose secrets, credentials, or personal data in code, documentation, or tests.
- Do not disable tests, linters, or security checks to force a build to pass.
- Do not declare a change completed with pending or failing checks.

## Actions Requiring Human Approval
- Deploying, publishing, sending external messages, or incurring monetary costs.
- Deleting or migrating persistent data non-reversibly.
- Modifying permissions, rotating secrets, or changing access control policies.