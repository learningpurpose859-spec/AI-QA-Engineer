# Intelligent Test Plan — AI-Powered Jira Quality Engineering Suite

An enterprise-grade, lightweight React application that accepts a Jira issue ID or ticket URL, retrieves requirements and acceptance criteria directly from Jira, and synthesizes structured QA documentation (Master Test Plan, Enterprise Test Strategy, or Test Cases & RTM) using Groq LLM acceleration (`openai/gpt-oss-120b`).

---

## 🌐 Live Production Deployment

* **Production URL:** [https://intelligent-test-plan-opal.vercel.app](https://intelligent-test-plan-opal.vercel.app)
* **API Health Check:** `https://intelligent-test-plan-opal.vercel.app/api/health`
* **Vercel Project:** `intelligent-test-plan`

---

## 📸 Key Features & Architecture

* **Three Generation Modes:**
  1. **Test Plan:** Generates an ISO/IEC/IEEE 29119 standard Master Test Plan (Scope, Execution Levels, Quality Gates, Environments, Defect SLAs, Roles & Schedule, Risk Register).
  2. **Test Strategy:** Generates an Enterprise Test Strategy (Automation Pyramid distribution 65% Unit / 25% API / 10% E2E, Shift-Left ceremonies, Non-functional performance/security SLAs, CI/CD Gates, Metrics & KPIs).
  3. **Test Cases & RTM:** Generates atomic test cases (Positive, Negative, Boundary, Security) and a complete Requirement Traceability Matrix (RTM).
* **Direct Jira Integration:**
  * Supports Jira issue keys (e.g., `LPT-1`) or full Jira ticket URLs (`https://your-org.atlassian.net/browse/LPT-1`).
  * Parses Atlassian Document Format (ADF) and extracts summaries, descriptions, and acceptance criteria.
* **Server-Side Security:**
  * Credentials (`JIRA_URL`, `JIRA_EMAIL`, `JIRA_TOKEN`, `GROQ_TOKEN`) stay strictly on the server backend.
  * Settings page displays masked statuses and allows pasting `.env` configuration securely.
* **Factual Grounding & Determinism:**
  * Missing information is explicitly marked as `"Insufficient information to determine."`
  * Technical inferences are explicitly marked as `"Inference (low confidence)"`.
  * Proposed test cases are designated as proposals.

---

## 🚀 Getting Started

### 1. Prerequisites
* Node.js v18+ (tested on v18.14.0)
* Active Jira Cloud instance with an API Token
* Groq API Key

### 2. Environment Configuration
Create or configure `.env` in the root or `Implementation/`:
```env
JIRA_BASE_URL=https://your-domain.atlassian.net/
JIRA_EMAIL=your-email@example.com
JIRA_TOKEN=your_jira_api_token
GROQ_TOKEN=your_groq_api_key
GROQ_MODEL=openai/gpt-oss-120b
```

### 3. Running the Application
From `Implementation/`:

#### Option A: Run Full Production App on Port 5000 (Backend + Pre-built Frontend)
```bash
cd Implementation
node src/backend/src/server.js
```
Then open `http://localhost:5000` in your browser.

#### Option B: Run Frontend Dev Server (Vite HMR on Port 5173 with proxy to 5000)
Terminal 1:
```bash
cd Implementation/src/backend
npm start
```
Terminal 2:
```bash
cd Implementation/src/frontend
npm run dev
```
Then open `http://localhost:5173` in your browser.

---

## 🛠️ Verification & Testing
* Tested live with Jira project `LPT` (Issue `LPT-1`: *"User Password Reset via Email"*).
* Verified Groq AI synthesis using `openai/gpt-oss-120b`.
* Verified Settings configuration viewer and dynamic loading.
