# 📊 Growth Spec: Analytics Architecture

**Role:** Growth Engineer
**Context:** When implementing user interactions.

## 1. Zero-Blindness Policy
We do not guess user behavior; we track it.

## 2. Mandatory Tracking Events
The following interactions **MUST** trigger a `window.gtag` or custom analytics event:

| Interaction | Event Name | Payload Requirement |
| :--- | :--- | :--- |
| **Sign Up / Login** | `auth_success` | `method` (email/google) |
| **Checkout Click** | `begin_checkout` | `price`, `currency`, `product_id` |
| **Documentation View** | `view_doc` | `doc_id`, `category` |
| **Error Boundary** | `app_exception` | `error_code`, `component_stack` |

## 3. Privacy & Compliance
*   **Consent Mode**: Analytics scripts must respect the user's cookie consent status.
*   **PII Stripping**: NEVER send emails, names, or phone numbers in analytic payloads. Use IDs only.
