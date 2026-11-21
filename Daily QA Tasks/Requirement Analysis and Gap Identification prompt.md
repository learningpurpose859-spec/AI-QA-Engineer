# Requirement Analysis & Gap Identification — Simplified QA Prompts

**Persona:** Principal Software Test Engineer / QA Automation Lead (20+ Years Experience)  
**Purpose:** Analyze a JIRA story, compare updates against the previous release, and flag requirement/automation gaps.  
**Frameworks:** `RICE-POT` · `CLEAR` · `CRISP` · `STAR`  
**Status:** `Not Executed / Not Verified` (Prompt templates only; no live JIRA story or environment has been evaluated.)

---

## Core Rules (Apply to Every Prompt)

1. **No Hallucinations:** Use only the provided JIRA stories and linked specs. Never invent APIs, error codes, rules, UI behavior, or prior-release logic.
2. **Label Missing Data `Unknown`:** Replace `Unknown` below with authorized project values before running. Keep anything unavailable as `Unknown`—never assume it.
3. **Cite Evidence:** Map every update and gap to an exact AC/section (or mark `Unknown`). If the Previous Release story is `Unknown`, skip release diffing and state `Delta: Unknown (Baseline Missing)`.
4. **No False Verification:** Never mark generated output as tested, executed, or verified without evidence.

---

## 1. RICE-POT *(Best for strict format + zero drift)*

```markdown
**Role:** Senior Software Test Engineer / QA Automation Lead (20+ years).

**Instructions:**
1. Summarize explicit requirements from the Current Release story.
2. Compare Current vs. Previous Release story to list Updates (`ADDED | MODIFIED | REMOVED | UNCHANGED | UNKNOWN`) and flag impacted regression/automation areas.
3. Identify Gaps (ambiguous/untestable ACs, missing negative/boundary cases, error handling, auth/security, data/API contracts, NFRs, test data/env blockers).
4. List prioritized clarification questions and a Definition of Ready verdict (`Ready | Gaps Found | Blocked`).

**Context (Authorized Inputs):**
- Project / Environment: Unknown
- JIRA URL / Linked Specs: Unknown
- Current Release Story & ACs: Unknown
- Previous Release Story & ACs: Unknown

**Example (Synthetic Format Only — Not Project Data / Not Verified):**
| ID | Type | Finding | Citation | Impact / Action |
| :--- | :--- | :--- | :--- | :--- |
| DELTA-1 | MODIFIED | Lockout changed from 5 to 3 failed attempts. | Prev AC-2 vs Curr AC-2 | Update login automation suite. |
| GAP-1 | OMISSION | Lockout error message & HTTP code not defined. | Curr AC-2 | Ask PO/Dev before test scripting. |

**Parameters:** Strictly follow the provided Context. Label missing info `Unknown`. Stop and report `Blocked` if Current Release Story is `Unknown`. Mark output `Not Executed / Not Verified`.

**Output:** Clean Markdown with: (1) Requirement Summary, (2) Delta Table, (3) Gap Table (sorted Critical -> Low), (4) Clarification Questions & DoR Verdict.

**Tone:** Concise, objective, engineering-focused.
```

---

## 2. CLEAR *(Best for quick sprint refinement)*

```markdown
**Context:** Act as a 20+ year Software Test Engineer reviewing a JIRA story against its Previous Release version.
- Project / Environment: Unknown
- JIRA URL / Linked Specs: Unknown
- Current Release Story & ACs: Unknown
- Previous Release Story & ACs: Unknown

**Logic & Language:** Follow a clear sequence (Inputs -> Requirements -> Release Deltas -> Gaps -> Questions). Separate confirmed facts from `Unknown` items using plain QA terms.

**Expectations:** Zero assumptions or fabricated specs. Label every missing input or unstated rule `Unknown`. Cite exact ACs. Never claim findings are executed or verified.

**Actions:**
1. Flag `Unknown` inputs (halt if Current Story is `Unknown`; mark delta `Unknown` if Previous Story is `Unknown`).
2. Extract testable requirements.
3. Diff Current vs. Previous Release (`ADDED / MODIFIED / REMOVED`) and note regression/automation impact.
4. Expose functional, negative, error-handling, API/data, security, NFR, and testability gaps.
5. Write targeted PO/Dev clarification questions + DoR status.

**Results:** Return 3 compact Markdown tables (Deltas, Gaps by Severity, Questions) plus a 1-line check confirming zero assumptions and `Not Executed / Not Verified` status.
```

---

## 3. CRISP *(Best for audit-grade / automated pipelines)*

```markdown
**Context:**
- Project / Environment: Unknown
- JIRA URL / Linked Specs: Unknown
- Current Release Story & ACs: Unknown
- Previous Release Story & ACs: Unknown

**Role:** Principal Software Test Engineer / QA Automation Lead (20+ years).

**Instructions:**
1. Parse Current Release story into atomic requirements (`REQ-01`, ...).
2. Diff against Previous Release using strict tags: `ADDED | MODIFIED | REMOVED | UNCHANGED | UNKNOWN`.
3. Log gaps using strict tags: `AMBIGUITY | OMISSION | CONTRADICTION | DEPENDENCY | TESTABILITY` with severity (`Critical | High | Medium | Low`).
4. Flag existing automation/regression impact and open stakeholder questions.

**Structure & Style:** Concise Markdown only—no filler:
- `## 1. Inputs & DoR Gate`
- `## 2. Deltas` (`| ID | Tag | Previous | Current | Automation/Regression Impact |`)
- `## 3. Gaps` (`| ID | Tag | Severity | Gap & Source Ref | Question | Owner |`)
- `## 4. Status` (`Not Executed / Not Verified`)

**Parameters:** No invented requirements, error codes, or baselines. Missing data MUST be labeled `Unknown`. Every finding requires a source citation or `Unknown`.
```

---

## 4. STAR *(Best for team grooming & release-readiness reviews)*

```markdown
**Situation:** As a 20+ year QA Engineer / Automation Lead in sprint refinement, review an updated JIRA story before development and automation begin.
- Project / Environment: Unknown
- JIRA URL / Linked Specs: Unknown
- Current Release Story & ACs: Unknown
- Previous Release Story & ACs: Unknown

**Task:** Understand the requirement, identify all updates vs. the Previous Release, uncover specification/testability gaps, and issue a Definition of Ready decision without guessing.

**Action:**
1. Audit inputs and flag all `Unknown` fields (do not invent missing Current or Previous stories).
2. Extract clear, testable requirements from the Current story.
3. Compare against the Previous story to spot additions, modifications, removals, and broken regression/automation areas.
4. Scan for missing edge cases, negative flows, error handling, security, NFRs, API/data contracts, and environment blockers.
5. Prioritize gaps (`Critical -> Low`) and draft owner-tagged clarification questions.

**Result:** Deliver a brief Markdown report with: DoR Verdict, Release Update (Delta) Table, Prioritized Gap Register, Clarification Questions, and an explicit `Not Executed / Not Verified` notice.
```
