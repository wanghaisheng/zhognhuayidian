# ☁️ Engineering Guide: Zero IDE Protocol

## 1. Architecture Essence: Decoupling Local Env
**Instant Ship™** is not a traditional "Repo + Backend" template. It is a **"Cloud Toolchain Protocol"**.

We ditch local editors (VSCode/Cursor), complex Node runtimes, and local builds. The core is leveraging top-tier online multimodal platforms for the shortest path from "Idea to Product".

## 2. The Trinity: Synergy Formula

### A. Visual Brain: Google AI Studio (Free/Online/Multimodal)
*   **Role**: Solving UI/UX from 0 to 1.
*   **Edge**: Gemini 2.0/3.0 has the strongest visual parsing. Upload a sketch, get React 19 code in the browser.
*   **Diff**: Completely free, unlimited dev quota.

### B. Logic Spine: Lovable (Logic Injection)
*   **Role**: Solving the "hollow shell" problem, giving logic life.
*   **Capabilities**:
    *   **DB**: Auto-create Supabase tables.
    *   **Logic**: Natural language to "connect AI chat" or "implement user auth".
    *   **Payments**: Native Stripe/Creem integration.
*   **Cost**: Pay-as-you-go, nearly zero during dev.

### C. Physical Body: Cloudflare (Edge/Auto)
*   **Role**: Solving global access & SEO.
*   **Protocol**: Push to GitHub -> Cloudflare Pages auto-builds & deploys.
*   **SEO**: Built-in `sitemap`, `robots`, `llms.txt` automation.

## 3. Core Advantage
1.  **Break "Toy Site" Limits**: Unlike Lovart (static snapshots), connecting Lovable gives you full-stack data flow.
2.  **Robust Customization**: Sandbox logic often breaks; our scaffold + TanStack Router allows precise "injection" by Lovable.
3.  **Zero Friction**: Code from AI Studio goes directly into `routes/`, auto-matched by routing & i18n.
