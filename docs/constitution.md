# Constitution — Halall

**Version:** 1.0.0  
**Ratified:** 2026-09-09  
**Last Modified:** 2026-09-09  

## I. Explicit Value and Scope
Every feature must address a verifiable problem for a concrete actor. Deliver the minimum viable slice first and explicitly declare out-of-scope items. Unplanned complexity requires written rationale.

## II. Behavior Over Implementation
Requirements must be stated using EARS syntax and verifiable acceptance scenarios. The specification details what happens; the technical plan determines how.

## III. Risk-Proportional Evidence
Every modified or new behavior requires automated tests, contract validations, or reproducible evidence. Passing lint, type checks, tests, and build are strict exit conditions.

## IV. Atomic and Reversible Changes
Tasks must be reviewable and reversible in isolation. Favor simple contracts, minimal dependencies, and non-breaking migrations.

## V. Bound Autonomy and Human Oversight
Agents may analyze, propose, implement, and verify within their boundaries. Irreversible, external, or high-risk actions strictly demand human confirmation.