# Project & Conversation Archive: Intelligent Test Plan

**Date:** November 18, 2026  
**Session ID:** `1dfb7610-826f-4ae1-92c3-f2db7c939542`  
**Live Production URL:** [https://intelligent-test-plan-opal.vercel.app](https://intelligent-test-plan-opal.vercel.app)  
**Local Development:** `http://localhost:5173` / `http://localhost:5000`

---

## 1. Summary of Tasks Completed

### A. RICEPOT Template Refinement
* Adapted the initial prompt specification against:
  * **Design Mockups:** `Design/UI Page1.png` (Generator View) and `Design/UI Page2.png` (Settings View).
  * **Quality Templates:**
    * `Template/Master_Test_Plan_Template.md` (ISO/IEC/IEEE 29119 standard)
    * `Template/Enterprise_Test_Strategy_Template.md` (Automation Pyramid, Shift-Left, CI/CD Gates)
    * `Template/Test_Cases_and_RTM_Template.md` (Atomic Test Cases & Traceability Matrix)
* Persisted to `Template/RICEPOT_Template.md`.

### B. Full-Stack Application Implementation
Built a production-grade React & Express application in `Implementation/`:
* **Frontend (`src/frontend/`):**
  * Exact cyber-slate design tokens (`#0B0F19`), checkmark brand header, 3-mode selector tabs (`Test Plan`, `Test Strategy`, `Test Cases`).
  * Jira ticket key & URL parsing (`PROJ-123` or `https://.../browse/PROJ-123`).
  * `+ Add notes` expandable input and model indicator (`Model: Groq / openai/gpt-oss-120b`).
  * Settings view with `01 Jira connection` and `02 LLM configuration` cards and `.env` loader.
  * Rendered markdown viewer with syntax formatting, copy to clipboard, and `.md` file export.
* **Backend (`src/backend/`):**
  * Atlassian Jira REST API integration with Atlassian Document Format (ADF) parser.
  * Groq LLM integration (`openai/gpt-oss-120b`) with temperature `0.1` and template adherence.
  * Deterministic missing field handling (`"Insufficient information to determine."`) and inference labeling (`"Inference (low confidence)"`).
* **Offline & Serverless Compatibility:**
  * Templates bundled locally in `src/backend/templates/`.
  * Express app exported via `api/index.js` for Vercel Serverless Functions.

### C. Live Production Deployment to Vercel
* **Production Deployment:** Deployed to Vercel project `intelligent-test-plan` under team `learner-fee9`.
* **Zero `.env` Disclosure:** 
  * `.env` blocked from uploads via `.vercelignore` and `.gitignore`.
  * All 5 environment variables (`JIRA_BASE_URL`, `JIRA_EMAIL`, `JIRA_TOKEN`, `GROQ_TOKEN`, `GROQ_MODEL`) provisioned as encrypted serverless variables.
* **Live Verification:** Verified `LPT-1` issue retrieval, API health check (`200 OK`), and public accessibility.

---

## 2. Key File Paths

| File / Artifact | Location |
| :--- | :--- |
| **Frontend Source** | `Implementation/src/frontend/` |
| **Backend Source** | `Implementation/src/backend/` |
| **Vercel Serverless Entry** | `Implementation/api/index.js` |
| **Vercel Routing Config** | `Implementation/vercel.json` |
| **Project README** | `Implementation/README.md` |
| **RICEPOT Specification** | `Template/RICEPOT_Template.md` |
