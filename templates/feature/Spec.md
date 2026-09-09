# Specification: [NNN] — [Feature Name]

## User Stories & Acceptance Criteria
### US-1: [Title] (Priority: P1)
- **Independent Validation:** [Concrete steps proving value independently].
- **Acceptance Scenarios:**
  - **GIVEN** [initial context],
  - **WHEN** [action triggers],
  - **THEN** [verifiable result].

## Functional Requirements (EARS)
- **RF-001 [US-1]:** WHEN [event], THE SYSTEM SHALL [observable behavior].
- **RF-002 [US-1]:** WHILE [system state], THE SYSTEM SHALL [continuous behavior].
- **RF-003 [US-1]:** IF [error condition], THEN THE SYSTEM SHALL [recovery / safe failure].
- **RF-004 [US-1]:** THE SYSTEM SHALL [ubiquitous capability].

## Non-Functional Requirements
- **RNF-001 Performance:** [Latency / throughput thresholds].
- **RNF-002 Security:** [Auth, sensitive data, sanitization].
- **RNF-003 Compatibility:** [Platforms, browser matrix, runtime].

## Data, Integrations & Permissions
- Data Entities: [Domain rules and mutations].
- Integrations: [APIs, file exports, external services].
- Permissions: [Access control constraints].

## Edge Cases & Error Handling
- [Empty states, timeouts, duplicates, unauthorized access, concurrent edits].

## Success Criteria & Definition of Done
- **SC-001:** [Measurable outcome independent of tech stack].
- Mandatory commands in `AGENTS.md` exit with code 0.
- All applicable requirements have recorded evidence in `Verify.md`.