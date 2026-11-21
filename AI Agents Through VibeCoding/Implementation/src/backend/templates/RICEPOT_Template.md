# AI-Powered Jira Test Engineering Suite — RICEPOT Prompt Specification

### R — Role
Act as a senior full-stack engineer, QA automation architect, and AI systems engineer experienced in React, Node.js/Express backend development, Atlassian Jira REST API integrations, enterprise test planning (ISO/IEC/IEEE 29119), and high-performance LLM orchestration (Groq / Ollama).

---

### I — Instructions
Build a lightweight, production-grade web application named **"Intelligent Test Plan"** that connects to Jira, retrieves issue requirements and metadata, and generates enterprise-grade QA documentation across three selectable modes: **Test Plan**, **Test Strategy**, and **Test Cases & RTM**, adhering strictly to the provided UI designs and document templates.

#### 1. Review Existing Project Inputs & Architecture
* **UI Designs:** Accurately replicate `Design/UI Page1.png` (Generator View) and `Design/UI Page2.png` (Settings View).
* **QA Templates:** Enforce 100% structural fidelity with:
  * `Template/Master_Test_Plan_Template.md` (ISO/IEC/IEEE 29119 Master Test Plan)
  * `Template/Enterprise_Test_Strategy_Template.md` (Enterprise Test Strategy & Automation Pyramid)
  * `Template/Test_Cases_and_RTM_Template.md` (Test Case Specification & Requirement Traceability Matrix)
* **Configuration & Credentials:** Read Jira connection credentials (`JIRA_URL`, `JIRA_EMAIL`, `JIRA_TOKEN`) and LLM configuration (`GROQ_API_KEY`, `GROQ_MODEL`, optional `OLLAMA_BASE_URL`) from the server environment (`.env`) or dynamically loaded via the Settings interface. Never hardcode or expose secrets in frontend storage or logs.

#### 2. Create Project Structure
* Place all application code inside `implementation/` with the following clean architecture:
  ```text
  implementation/
  ├── src/
  │   ├── frontend/               # React + Tailwind CSS client application
  │   │   ├── src/
  │   │   │   ├── components/     # Header, Navigation, GeneratorCard, SettingsView, DocumentViewer, Tabs
  │   │   │   ├── services/       # API client for backend communication
  │   │   │   ├── App.jsx
  │   │   │   └── index.css
  │   │   ├── index.html
  │   │   ├── package.json
  │   │   └── vite.config.js
  │   └── backend/                # Lightweight Node.js/Express API server
  │       ├── src/
  │       │   ├── services/       # jiraService.js, llmService.js (Groq/Ollama), templateService.js
  │       │   ├── routes/         # jiraRoutes.js, generateRoutes.js, configRoutes.js
  │       │   └── server.js
  │       ├── package.json
  │       └── .env.example
  ├── .gitignore
  └── README.md
  ```

#### 3. Implement the UI Design (Dark Theme / Cyber-Slate Aesthetics)
Reproduce the exact layouts, navigation, colors, typography, spacing, and micro-interactions from the design mockups:
* **Brand & Navigation Bar (`UI Page1.png` & `UI Page2.png`):**
  * Brand logo: Purple/blue rounded square icon with a white checkmark `✓` followed by bold title **"Intelligent Test Plan"**.
  * Top-right navigation pills/links:
    * **Test Plan** (or **Generator**): Switch to the generation workspace.
    * **Settings**: Switch to the server configuration panel.
* **Generator View (`UI Page1.png`):**
  * Hero Section: Clipboard/document icon 📋, main heading **"Generate a test plan from a JIRA ticket"**, and subtitle *"Choose Test Plan, Test Strategy or Test Cases below, then enter a ticket key such as `PROJ-123` or paste the ticket URL."*
  * Generator Control Card:
    * **Artifact Tabs:** Three selectable pills with dynamic contextual descriptions:
      1. `Test Plan` — *"Scope, gaps, scenarios, risks and a human review gate"*
      2. `Test Strategy` — *"Enterprise test pyramid, quality gates, non-functional SLAs, and governance metrics"*
      3. `Test Cases` — *"Atomic test cases, positive/negative/boundary/security scenarios, and RTM matrix"*
    * **Input Row:**
      * Text input accepting either a Jira issue key (e.g., `PROJ-123`) OR a full Jira issue URL (e.g., `https://your-domain.atlassian.net/browse/PROJ-123`).
      * Action button: Dynamically labeled based on active tab (`Generate Test Plan`, `Generate Test Strategy`, `Generate Test Cases`).
    * **Card Footer:**
      * Left: `+ Add notes` button that toggles an expandable textarea for custom tester context, release notes, or specific testing focus.
      * Right: Active model indicator badge (e.g., `Model: Groq / openai/gpt-oss-120b`).
  * **Result Viewer:**
    * Render generated markdown documents with syntax highlighting, copy-to-clipboard, export/download options, and source Jira ticket reference badge.
* **Settings View (`UI Page2.png`):**
  * Header: Neon green uppercase category tag `CONFIGURATION`, large heading `Settings.`, and subtitle *"Connections are read from the server environment."*
  * Status Cards:
    * **`01 Jira connection`**:
      * `Base URL`: Displays configured Jira base URL (e.g., `https://arvindalagesan.atlassian.net/`).
      * `Credentials`: Read-only field displaying `"Configured securely on server"`.
      * Status indicator: `● Ready` (green dot) or `● Not Configured` / `● Disconnected`.
    * **`02 LLM configuration`**:
      * `Optional provider`: Displays `"Groq configured on server"` (or active provider).
      * `Local Ollama`: Displays `"Insufficient information to determine."` or local server status.
      * Status indicator: `● Server-only configuration`.
  * Ingestion / Update Panel:
    * Section Label: `Paste .env file contents`.
    * Textarea pre-populated or accepting `.env` format:
      ```env
      JIRA_URL=https://your-domain.atlassian.net
      JIRA_EMAIL=you@example.com
      JIRA_TOKEN=...
      GROQ_API_KEY=...
      GROQ_MODEL=openai/gpt-oss-120b
      ```
    * Action button: `Load configuration ↗` (light green button with black text and arrow).
    * Security notice below button: *"Values are sent to the backend and are not stored in browser storage."*

#### 4. Backend Jira Integration
* **Input Parsing:** Extract the valid Jira issue key from either raw keys (`PROJ-123`, `QA-42`) or URLs (`https://org.atlassian.net/browse/PROJ-123`).
* **API Retrieval:** Call Jira REST API v2/v3 endpoint (`GET /rest/api/3/issue/{issueKey}`) with Basic Auth (`email:api_token` encoded in Base64).
* **Metadata Extraction:** Extract Summary, Description (parsing Atlassian Document Format ADF nodes into clean text), Acceptance Criteria (custom fields or description headings), Issue Type, Priority, Status, Components, Labels, and Reporter/Assignee.
* **Fallback / Offline Mock Mode:** When Jira is unreachable or unconfigured, provide clean mock responses for demonstration and local testing, with explicit indicators that mock data is in use.

#### 5. AI Generation Engine (Artifact Alignment)
Orchestrate high-speed LLM generation using Groq (`openai/gpt-oss-120b` or current Groq models such as `llama-3.3-70b-versatile` / `llama3-70b-8192`) or local Ollama. Enforce the exact structure of the selected template:
* **Mode 1 — Test Plan (`Master_Test_Plan_Template.md`):**
  * Section 1: Introduction & Objectives (1.1 Purpose [ISO/IEC/IEEE 29119], 1.2 Test Objectives, 1.3 Reference Documents table)
  * Section 2: Scope of Testing (2.1 In-Scope Features & Modules table, 2.2 Out-of-Scope Items)
  * Section 3: Test Approach & Execution Levels table (Unit, Integration & API, System & Functional, E2E, Non-Functional, UAT)
  * Section 4: Quality Gates (4.1 Entry Criteria, 4.2 Suspension & Resumption Criteria, 4.3 Exit Criteria)
  * Section 5: Test Environment & Test Data Management (5.1 Environment Matrix table, 5.2 Supported Browsers & Devices, 5.3 Test Data Strategy)
  * Section 6: Defect Management & Severity SLAs (6.1 Defect Lifecycle, 6.2 Severity & Resolution SLAs table [S1–S4])
  * Section 7: Roles, Schedule & Deliverables (7.1 Roles & Responsibilities table, 7.2 Milestone Schedule table)
  * Section 8: Risk Register & Mitigation Plan table (Risk ID, Description, Likelihood, Impact, Mitigation Strategy)
  * Section 9: Stakeholder Sign-Off table
* **Mode 2 — Test Strategy (`Enterprise_Test_Strategy_Template.md`):**
  * Section 1: Executive Summary & Quality Philosophy (1.1 Vision, 1.2 Core Principles: Shift-Left, Risk-Based, Automation-First, Continuous Feedback)
  * Section 2: Test Automation Pyramid & Architecture (ASCII Pyramid, Target share: Unit 65%, API & Contract 25%, E2E UI 10%, tooling table)
  * Section 3: Shift-Left & Agile Ceremonies Integration (Three Amigos / BDD Given-When-Then, Architecture reviews, PR quality gates)
  * Section 4: Non-Functional Testing Strategy (4.1 Performance & SLAs, 4.2 DevSecOps SAST/SCA/DAST/AuthZ, 4.3 Accessibility WCAG 2.1 AA & Cross-Platform)
  * Section 5: CI/CD Pipeline Quality Gates (Pipeline flow & Quality Gates table)
  * Section 6: Defect Triage & Root Cause Analysis (Daily triage cadence, 5-Whys RCA)
  * Section 7: Quality Engineering Metrics & KPIs table (DDE, Defect Escape Rate, Automation Pass Rate, MTTD, MTTR, Requirement Coverage)
* **Mode 3 — Test Cases & RTM (`Test_Cases_and_RTM_Template.md`):**
  * Section 1: QA Authoring Standards & Field Definitions (Atomic & Deterministic, Independent, Positive/Negative/Boundary/Security balance)
  * Section 2: Test Case Repository (`TC-<MODULE>-<NNN>` items with Requirement ID, Type, Priority, Automation Status, Preconditions, Test Data, numbered Execution Steps, Expected Result, Actual Result, Status)
  * Section 3: Requirement Traceability Matrix (RTM) table (Requirement ID, Description, Priority, Linked Test Case IDs, Execution Status, Defect IDs, Coverage Status)

#### 6. Application States & Error Handling
* **Loading States:** Display clear visual skeletons or spinner indicators while retrieving from Jira or streaming/awaiting LLM generation.
* **Error Handling:** Safely handle and display human-readable alerts for:
  * Malformed Jira ticket key or invalid URL.
  * Jira authentication failures (401), insufficient permissions (403), or issue not found (404).
  * Missing or invalid LLM API key / rate limits.
  * Network disconnects or backend timeouts.
* **Input Retention & Idempotency:** Prevent duplicate submissions while a request is in progress; preserve the ticket key, active tab, and custom notes if generation fails.

#### 7. Security & Compliance (Do NOT Rules)
* **Do NOT** expose API tokens, credentials, or private headers in client-side code, browser storage (`localStorage`, `sessionStorage`, cookies), client console logs, or screenshots.
* **Do NOT** commit `.env` or real secrets into version control.
* **Do NOT** execute write operations (mutation, creation, deletion) against Jira — this system is strictly read-only.
* **Do NOT** hallucinate unstated product requirements or arbitrary test environments.
* **Do NOT** alter, reorder, or omit template sections or column definitions.
* **Do NOT** disguise mock fallback data as authenticated live Jira data.

---

### C — Context
* **Project Name:** **Intelligent Test Plan** (AI-Powered Jira Quality Engineering Suite).
* **Primary Users:** QA Engineers, SDETs, Quality Architects, and Engineering Leads requiring automated, ISO/IEEE-compliant test plans, enterprise test strategies, and comprehensive test case suites with traceability matrices from Jira user stories.
* **Visual Reference Files:**
  * `Design/UI Page1.png`: Main Generator interface featuring dark theme `#0B0F19`, brand header `Intelligent Test Plan`, 3-mode selector tabs (`Test Plan`, `Test Strategy`, `Test Cases`), Jira ticket/URL input, `+ Add notes` toggle, and model badge `Model: Groq / openai/gpt-oss-120b`.
  * `Design/UI Page2.png`: Settings interface featuring `01 Jira connection` card, `02 LLM configuration` card, `Paste .env file contents` input area, and `Load configuration ↗` trigger.
* **Document Template Files:**
  * `Template/Master_Test_Plan_Template.md`
  * `Template/Enterprise_Test_Strategy_Template.md`
  * `Template/Test_Cases_and_RTM_Template.md`
* **Configuration Sources:**
  * Server `.env` file containing `JIRA_URL`, `JIRA_EMAIL`, `JIRA_TOKEN`, `GROQ_API_KEY`, `GROQ_MODEL`.
  * Dynamic ingestion via the Settings UI (sent directly to the backend memory/server environment without storing in browser storage).
* **Implementation Target:** `implementation/src/frontend/` (React) and `implementation/src/backend/` (Node.js/Express).

---

### E — Example

#### 1. Illustrative User Interaction:
* **Selected Tab:** `Test Plan`
* **User Input:** `PROJ-101` (or `https://company.atlassian.net/browse/PROJ-101`)
* **Optional Notes:** *"Targeting Q4 release candidate. Payment gateway sandbox is active. Focus heavily on negative checkout scenarios."*
* **Execution Flow:**
  1. User clicks **Generate Test Plan**.
  2. Frontend validates ticket string, disables input, and shows loading state.
  3. Backend fetches Jira story `PROJ-101` (`"Guest Checkout via Stripe and PayPal"`).
  4. Backend prompts LLM with `PROJ-101` requirements + custom notes + `Master_Test_Plan_Template.md` structure.
  5. LLM returns structured ISO 29119 test plan.
  6. Frontend displays formatted markdown with copy/export actions.

#### 2. Handling Missing Information:
If the Jira issue does not specify staging URLs or hardware configurations, the output must populate those fields exactly with:
```text
Insufficient information to determine.
```

#### 3. Handling Technical Inferences:
If non-functional load SLAs are derived from industry standards rather than an explicit Jira acceptance criterion, the output must mark them as:
```text
Inference (low confidence): API p95 response time target set to < 300ms based on standard REST benchmarks.
```

#### 4. Settings Configuration Interaction:
User pastes into Settings:
```env
JIRA_URL=https://arvindalagesan.atlassian.net/
JIRA_EMAIL=arvind.qa@example.com
JIRA_TOKEN=ATATT3xFfGF0...
GROQ_API_KEY=gsk_...
GROQ_MODEL=openai/gpt-oss-120b
```
Upon clicking **Load configuration ↗**:
* Backend updates server memory / `.env` safely.
* Card `01 Jira connection` updates to: `Base URL: https://arvindalagesan.atlassian.net/`, `Credentials: Configured securely on server`, status `● Ready`.
* Card `02 LLM configuration` updates to: `Optional provider: Groq configured on server`, status `● Server-only configuration`.

---

### P — Parameters
* **Frontend Tech Stack:** React 18+ (Vite), Tailwind CSS, Lucide React (for icons matching the designs: `ClipboardList`, `CheckSquare`, `Settings`, `FileText`, `ExternalLink`, etc.).
* **Backend Tech Stack:** Node.js, Express, Axios/Fetch, dotenv, CORS.
* **Color Palette & Design Tokens:**
  * Background: Slate-950 (`#0B0F19` / `#0D1117`).
  * Surface / Cards: Dark slate (`#131B2E` / `#161F30`), borders (`#1E293B` / `#334155`).
  * Accents: Primary Blue (`#3B82F6` / `#2563EB`), Emerald Green (`#10B981` / `#22C55E` for ready status and Settings CTA), Muted Gray (`#94A3B8`).
* **Strict Template Compliance:** Zero deviation from section numbering, heading titles, ASCII diagrams, and table columns specified in the 3 template markdown files.
* **Data Grounding & Factual Traceability:**
  * Every requirement must link to a retrieved Jira requirement ID or description item.
  * Every proposed test case must be explicitly flagged as a proposal.
  * Missing parameters must strictly output: `"Insufficient information to determine."`
  * Inferred statements must strictly output: `"Inference (low confidence)"`.
* **Determinism & Stability:** Use temperature `0.1`–`0.2` for LLM generation to ensure reproducible, deterministic structure.
* **Security & Isolation:** Absolute zero token exposure to the client; all Jira and Groq API calls originate server-side.

---

### O — Output
Deliver a fully functional, self-contained implementation inside `implementation/`:

#### 1. Source Code Files
* **Frontend (`implementation/src/frontend/`):**
  * `src/components/Header.jsx`: Brand icon `✓`, `Intelligent Test Plan` title, `Test Plan` & `Settings` navigation.
  * `src/components/GeneratorCard.jsx`: Mode tabs (`Test Plan`, `Test Strategy`, `Test Cases`), ticket input, `+ Add notes` expandable area, model badge, generate button.
  * `src/components/SettingsView.jsx`: `01 Jira connection` card, `02 LLM configuration` card, `.env` textarea, `Load configuration ↗` button.
  * `src/components/DocumentViewer.jsx`: Rendered markdown viewer with copy, download, and ticket metadata banner.
  * Supporting React files, Tailwind configuration, and Vite configuration.
* **Backend (`implementation/src/backend/`):**
  * `src/server.js`: Express server setup and middleware.
  * `src/services/jiraService.js`: Issue fetching, ADF parser, ticket key / URL validator, mock provider.
  * `src/services/llmService.js`: Groq SDK / REST client, prompt builder using the 3 markdown templates.
  * `src/services/configService.js`: In-memory and `.env` loader and status reporter.
  * `src/routes/api.js`: REST endpoints (`/api/jira/issue`, `/api/generate`, `/api/config/status`, `/api/config/load`).

#### 2. Tooling & Documentation
* `implementation/.gitignore`: Ensuring `.env`, `node_modules`, and build artifacts are ignored.
* `implementation/README.md`:
  * Project overview and architecture.
  * Prerequisites and installation commands for frontend and backend.
  * Configuration instructions (setting up Jira API Token and Groq API Key).
  * Run commands (`npm run dev` / `npm start`).
  * End-to-end usage walkthrough.
  * Verification steps, mock mode instructions, and limitations.

---

### T — Tone
Authoritative, technical, clear, and objective. Prioritize software design rigor, deterministic QA practices, robust error handling, and security hygiene. Avoid extraneous fluff or speculative claims.
