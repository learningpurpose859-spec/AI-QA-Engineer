# Test Case Specification & Requirement Traceability Matrix (RTM)

**Suite ID:** `[TS-MOD01-001]`  
**Module / Feature:** `[User Authentication & Checkout]`  
**Author:** `[Senior QA Engineer]`  
**Last Updated:** `[YYYY-MM-DD]`  

---

## 1. QA Authoring Standards & Field Definitions
* **Atomic & Deterministic:** Each test case validates one clear behavior and produces an unambiguous `Pass` or `Fail` result.
* **Independent Execution:** Test cases must manage their own preconditions/data and avoid chaining dependencies on prior test cases.
* **Coverage Balance:** Every feature must include **Positive (Happy Path)**, **Negative (Error Handling)**, **Boundary Value**, and **Security/Permissions** scenarios.

| Field | Description | Allowed Values |
| :--- | :--- | :--- |
| **Test Case ID** | Unique identifier following `TC-<MODULE>-<NNN>` | e.g., `TC-AUTH-001` |
| **Req / Story ID** | Linked PRD requirement or Jira user story ID | e.g., `REQ-101`, `JIRA-402` |
| **Test Type** | Classification of testing technique | `Positive`, `Negative`, `Boundary`, `Security`, `Integration` |
| **Priority** | Execution criticality | `P1 (Critical)`, `P2 (High)`, `P3 (Medium)`, `P4 (Low)` |
| **Automation Status** | Current state in automation framework | `Automated`, `Candidate`, `Manual Only` |

---

## 2. Test Case Repository

### TC-AUTH-001: Valid User Login with Registered Credentials
* **Requirement ID:** `REQ-101` | **Type:** `Positive` | **Priority:** `P1 (Critical)` | **Automation:** `Automated`
* **Preconditions:** Active user account exists (`qa.user@example.com`) with verified email and known password.
* **Test Data:** `Email: qa.user@example.com`, `Password: ValidPass@2026`
* **Execution Steps:**
  1. Navigate to `/login`.
  2. Enter valid registered email into the **Email** field.
  3. Enter valid password into the **Password** field.
  4. Click the **Sign In** button.
* **Expected Result:** User is authenticated (`HTTP 200`), session JWT is issued with `HttpOnly` flag, and browser redirects to `/dashboard`.
* **Actual Result:** `[To be populated during execution]`
* **Status:** `[Not Run | Pass | Fail | Blocked]`

---

### TC-AUTH-002: Login Rejected with Invalid Password & Account Lockout Threshold
* **Requirement ID:** `REQ-102` | **Type:** `Negative / Security` | **Priority:** `P1 (Critical)` | **Automation:** `Automated`
* **Preconditions:** Active user account exists (`qa.user@example.com`) with `0` failed login attempts.
* **Test Data:** `Email: qa.user@example.com`, `Password: WrongPass#999`
* **Execution Steps:**
  1. Navigate to `/login`.
  2. Enter `qa.user@example.com` and `WrongPass#999`, then click **Sign In** (Repeat 4 times).
  3. Observe error message on attempts 1–4.
  4. Attempt a 5th consecutive failed login.
* **Expected Result:** Attempts 1–4 return generic error `"Invalid email or password"` without revealing account existence. On the 5th failure, account locks for 15 minutes (`HTTP 429`) and triggers security alert email.
* **Actual Result:** `[To be populated during execution]`
* **Status:** `[Not Run | Pass | Fail | Blocked]`

---

### TC-AUTH-003: Password Field Boundary Length Validation (Min 8 / Max 64 Chars)
* **Requirement ID:** `REQ-103` | **Type:** `Boundary` | **Priority:** `P2 (High)` | **Automation:** `Automated`
* **Preconditions:** User is on `/register` page.
* **Test Data:** `7-char string (Ab1@567)`, `8-char string (Ab1@5678)`, `64-char string`, `65-char string`
* **Execution Steps:**
  1. Submit registration form with a **7-character** password (below minimum).
  2. Submit registration form with an **8-character** valid password (exact lower boundary).
  3. Submit registration form with a **64-character** valid password (exact upper boundary).
  4. Submit registration form with a **65-character** password (above maximum).
* **Expected Result:** `7-char` and `65-char` inputs are rejected with clear inline validation messages; `8-char` and `64-char` inputs succeed (`HTTP 201`).
* **Actual Result:** `[To be populated during execution]`
* **Status:** `[Not Run | Pass | Fail | Blocked]`

---

### TC-PAY-004: Checkout Order Total Calculation & Promo Code Discount
* **Requirement ID:** `REQ-205` | **Type:** `Integration / Positive` | **Priority:** `P1 (Critical)` | **Automation:** `Automated`
* **Preconditions:** User is logged in with 2 items in cart (`$100.00` subtotal); promo code `SAVE20` (`20%` off) is active.
* **Test Data:** `Cart Subtotal: $100.00`, `Promo: SAVE20`, `Tax Rate: 10%`
* **Execution Steps:**
  1. Navigate to `/checkout`.
  2. Apply promo code `SAVE20` and click **Apply**.
  3. Verify discounted subtotal (`$80.00`) and calculated tax (`$8.00`).
  4. Submit payment using test sandbox card.
* **Expected Result:** Order total charges exactly `$88.00`, payment gateway returns transaction ID, order status updates to `Confirmed`, and inventory decrements by 2.
* **Actual Result:** `[To be populated during execution]`
* **Status:** `[Not Run | Pass | Fail | Blocked]`

---

### TC-SEC-005: Unauthorized Access Prevention (IDOR Check on Order Details API)
* **Requirement ID:** `REQ-301` | **Type:** `Security` | **Priority:** `P1 (Critical)` | **Automation:** `Automated`
* **Preconditions:** `User A` owns `Order #9001`; `User B` is authenticated with a valid bearer token.
* **Test Data:** `Endpoint: GET /api/v1/orders/9001`, `Auth Header: Bearer <User_B_Token>`
* **Execution Steps:**
  1. Send `GET /api/v1/orders/9001` authenticated as `User B`.
  2. Inspect HTTP response status code and payload body.
* **Expected Result:** API rejects the request with `HTTP 403 Forbidden` (or `404 Not Found`) and returns zero order details belonging to `User A`.
* **Actual Result:** `[To be populated during execution]`
* **Status:** `[Not Run | Pass | Fail | Blocked]`

---

## 3. Requirement Traceability Matrix (RTM)
| Requirement ID | Requirement Description | Priority | Linked Test Case ID(s) | Execution Status | Defect ID(s) | Coverage Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `REQ-101` | User login with valid credentials | P1 | `TC-AUTH-001` | Not Run | None | Covered (100%) |
| `REQ-102` | Brute-force protection & account lockout | P1 | `TC-AUTH-002` | Not Run | None | Covered (100%) |
| `REQ-103` | Password length & complexity rules | P2 | `TC-AUTH-003` | Not Run | None | Covered (100%) |
| `REQ-205` | Checkout discount & tax calculation | P1 | `TC-PAY-004` | Not Run | None | Covered (100%) |
| `REQ-301` | Cross-user data isolation (RBAC/IDOR) | P1 | `TC-SEC-005` | Not Run | None | Covered (100%) |
