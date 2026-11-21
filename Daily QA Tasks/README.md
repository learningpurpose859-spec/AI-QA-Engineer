# Daily QA Tasks — AI Prompt Engineering Pack

A structured, end-to-end **Software Testing Lifecycle (STLC)** prompt library designed from the perspective of a **Principal Software Test Engineer / QA Automation Lead (20+ Years Experience)**.

Every prompt file in this workspace covers a core daily QA activity using four standardized prompt engineering frameworks (**`RICE-POT`** · **`CLEAR`** · **`CRISP`** · **`STAR`**) and enforces strict **anti-hallucination**, **zero-placeholder (`Unknown`)**, and **evidence-first** governance rules.

> **Repository Status:** `Not Executed / Not Verified` — Contains reusable QA prompt templates only. No live JIRA story, organization coding standard, environment, test case, or automation script has been executed or verified in this repository.

---

## End-to-End QA Workflow

```text
[1. Requirement Analysis & Gaps]
              |
              v
[2. Functional Testcase Generation]
              |
              v
[3. Automation Script Generation]  --->  [4. Automation Script Review]
              |                                     |
              +------------------+------------------+
                                 |
                                 v
                [5. Bug Report & Defect Analysis]
```

---

## Prompt Library Index

| # | STLC Stage | File | Purpose & Scope | Key Deliverables |
| :-: | :--- | :--- | :--- | :--- |
| 1 | **Requirement Review** | [Requirement Analysis and Gap Identification prompt.md](./Requirement%20Analysis%20and%20Gap%20Identification%20prompt.md) | Analyze a JIRA story, compare updates against the previous release (`ADDED / MODIFIED / REMOVED`), and flag requirement & automation/regression gaps. | Requirement Summary, Release Delta Table, Prioritized Gap Register, Clarification Questions, DoR Verdict |
| 2 | **Test Design** | [Functional Testcase Generation.md](./Functional%20Testcase%20Generation.md) | Derive traceable functional test cases (Positive, Negative, Boundary/EP, Edge, Security, Regression) grounded in JIRA ACs and release deltas. | Delta & Gap Summary, Traceable Functional Test Cases Table, Open Questions (`Execution Status: Not Executed`) |
| 3 | **Test Automation** | [Automation Script generation.md](./Automation%20Script%20generation.md) | Generate modular, Page-Object-based UI/functional automation scripts for **Robot Framework (Python + SeleniumLibrary)**, **Playwright (JavaScript)**, or **Both**. | AC-to-Test Traceability, `Unknown` Locators/Data Checklist, Modular POM & Test Scripts |
| 4 | **Code / PR Review** | [Automation Script review.md](./Automation%20Script%20review.md) | Review dual-stack automation scripts against JIRA ACs, organization coding standards, false-green risks, flakiness/waits, locators, and parallel-run readiness. | Merge Verdict & Scorecard, AC Coverage Matrix, Prioritized Findings (`Blocker -> Nit`), Before/After Refactor Snippets |
| 5 | **Defect Triage** | [Bug Report Generation and Defect Analysis.md](./Bug%20Report%20Generation%20and%20Defect%20Analysis.md) | Isolate the exact failing step and observed issue (Actual vs. Expected), perform evidence-backed defect analysis, and draft a JIRA-ready bug ticket. | Defect Analysis Summary, Copy-Paste JIRA Bug Report, Missing Evidence (`Unknown`) Checklist |

---

## Supported Automation Technologies

Files **3** and **4** are designed to work generically across either or both of the following automation stacks:

- **Robot Framework + Python + SeleniumLibrary**
  - `.robot` suites, `.resource` Page Objects, and `.py` helper libraries
  - Explicit `SeleniumLibrary` waits (no fixed `Sleep`), centralized locators, Setup/Teardown, tags, and `Pabot` parallel-run safety
- **Playwright + JavaScript (`@playwright/test`)**
  - `.spec.js` test files and `.page.js` Page Objects
  - Resilient user-facing `getBy*` locators, web-first `await expect(...)` assertions (flagging non-retrying `isVisible()` bugs), strict `async`/`await` hygiene, worker isolation, and no `waitForTimeout`

---

## Choosing a Prompt Framework Variant

All five files include the same four standalone prompt variants so you can pick the format that best fits your workflow:

| Framework | Structure | Best Used For |
| :--- | :--- | :--- |
| **RICE-POT** | Role · Instructions · Context · Example · Parameters · Output · Tone | Strict output schema compliance, few-shot format accuracy, and minimal LLM drift. |
| **CLEAR** | Context · Logic & Language · Expectations · Actions · Results | Fast, high-signal daily sprint refinement, scripting, PR reviews, and bug triage. |
| **CRISP** | Context · Role · Instructions · Structure & Style · Parameters | Audit-grade governance, test-management imports, and standardized CI/PR quality gates. |
| **STAR** | Situation · Task · Action · Result | Cross-functional walkthroughs, team mentoring, and release-readiness handoffs. |

---

## Quick-Start Usage

1. **Select the STLC file** matching your current daily QA task from the index above.
2. **Pick one framework variant** (`RICE-POT`, `CLEAR`, `CRISP`, or `STAR`) and copy the prompt block.
3. **Populate authorized project inputs:** Replace each relevant **`Unknown`** field (such as JIRA Story & ACs, Previous Release Story, Target Stack, Environment/URL, Organization Coding Standards, Locators, or Failure Evidence) with verified project data.
4. **Keep unavailable details as `Unknown`:** Never fill missing facts with guesses—leaving them as `Unknown` forces the AI to flag gaps instead of hallucinating.
5. **Review outputs before sharing or executing:** Verify all AC citations, locators, and findings against your real application and run scripts/linters in your environment before marking anything verified.

---

## Shared Governance & Anti-Hallucination Standards

Every file in this project enforces four non-negotiable rules:

1. **Strict Source Grounding:** Never invent requirements, API endpoints, DOM locators, error codes, stack traces, internal coding standards, or prior-release behaviors.
2. **Zero-Placeholder (`Unknown`) Policy:** Unpopulated template placeholders are prohibited; any missing project value is explicitly labeled **`Unknown`**.
3. **Evidence & Citation Discipline:** Every delta, gap, test case, review finding, and defect claim must cite an exact AC, file/line, or log reference (or explicitly state `Unknown`).
4. **No Unverified Claims:** Generated analyses, test cases, automation scripts, code reviews, and bug drafts must never be represented as executed, passing, linted, or verified without direct evidence.
