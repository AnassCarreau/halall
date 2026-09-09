# Tasks — [NNN] [Feature]

**Input:** `Spec.md`, `Plan.md`, and approved decisions.  
**Rule:** Every task produces an atomic, reviewable change with explicit paths and evidence.

## Syntax
`- [ ] T001 [P?] [US-1] [RF-001] Action description in \`exact/path\``

## Preparation
- [ ] T001 Create worktree or feature branch `[branch]`; ensure clean working tree.
- [ ] T002 Baseline check: execute quality commands from `AGENTS.md`.

## Implementation (US-1 — P1)
- [ ] T010 [US-1] [RF-001] Write failing test in `[path/to/test]`.  
  - *Dependencies:* T002.  
  - *Done when:* Test fails on missing implementation.
- [ ] T011 [US-1] [RF-001] Implement behavior in `[path/to/code]`.  
  - *Dependencies:* T010.  
  - *Done when:* `[test command]` passes with exit code 0.

## Finalization
- [ ] T900 Run all mandatory checks from `AGENTS.md` and log evidence in `Verify.md`.
- [ ] T901 Submit diff and residual risk report to independent reviewer.