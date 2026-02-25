# 🧠 Product Spec: Core User Flows

**Role:** Product Manager
**Context:** Defining the "Critical Path" for testing and implementation.

## 1. The "Discovery" Flow (Public)
*   **Goal**: Visitor becomes a Lead.
*   **Path**: Landing Page -> Pricing Section -> Documentation (Proof of Capability) -> Sign Up.
*   **Constraint**: LCP < 1.2s on Landing Page.

## 2. The "Activation" Flow (User)
*   **Goal**: Lead becomes Active User.
*   **Path**: Dashboard -> Create Project -> Success State.
*   **Constraint**: Zero "Empty States". If no data exists, show a "Get Started" template or demo data.

## 3. The "Retention" Flow (Loop)
*   **Goal**: User returns.
*   **Mechanism**: Blog/Changelog updates pushed via RSS/Newsletter -> Deep link to Article.
