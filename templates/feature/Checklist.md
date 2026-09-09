# Requirement Quality Checklist — [NNN] [Feature]

**Purpose:** Validate specification quality before code implementation.  
**Reviewer:** Specification Reviewer (distinct from author).  
**Date:** [YYYY-MM-DD]  

## Intent & Scope
- [ ] CHK-001 Problem, user persona, and target outcome are clear without technical knowledge.
- [ ] CHK-002 P1 priority delivers demonstrable standalone value.
- [ ] CHK-003 Out-of-scope section explicitly guards against scope creep.

## Verifiable Behavior
- [ ] CHK-004 Each functional requirement defines an explicit trigger and observable outcome.
- [ ] CHK-005 Each functional requirement maps directly to a user story or goal.
- [ ] CHK-006 Edge cases, validations, error flows, and auth limits are covered.
- [ ] CHK-007 Success criteria are measurable.

## Risk & Feasibility
- [ ] CHK-008 Impacted schemas, APIs, and permissions are mapped.
- [ ] CHK-009 No unresolved blocker questions remain.
- [ ] CHK-010 Chosen size (S/M/L) is proportional to change complexity.

**Verdict:** `APPROVED | CHANGES REQUESTED | BLOCKED`  
**Findings:** [Notes and links]