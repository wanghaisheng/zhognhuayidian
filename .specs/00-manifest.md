
# 📜 Instant Ship™ Unified Specifications (The Engine Room)

**System Role**: This directory is the **Source Code of the Organization**.
**Usage**: `docs/` is for the *User's Product*. `specs/` is for the *Builder's Protocol*.

## 🤖 Role-Based Authority

### 1. 🛠️ Engineering Specs (The Architect)
**Goal:** Stability, Performance, Scalability.

*   **Constitution**:
    *   **[Agent Constitution](./engineering/agent-constitution.md)**: **[CRITICAL]** The supreme laws (No fs, ID-First).
*   **Architecture & Physics**:
    *   **[Core Architecture](./engineering/core-architecture.md)**: The Tri-Pillar Ecosystem (G+L+C).
    *   **[Fullstack Synergy](./engineering/fullstack-synergy.md)**: **[NEW]** The integration mechanics of G+L+C.
    *   **[Docs DB Architecture](./engineering/docs-db-architecture.md)**: The Markdown-to-SQLite pipeline.
    *   **[Data Persistence](./engineering/data-persistence.md)**: Registry -> SQLite -> Supabase strategy.
    *   **[Dual-DB Strategy](./engineering/discussion-dexie-vs-sqljs.md)**: **[NEW]** Why we use both Dexie and SQL.js.
    *   **[WASM DB Init](./engineering/wasm-database-init.md)**: SQL.js Sandbox initialization protocol.
    *   **[Routing Mechanics](./engineering/routing-mechanics.md)**: DB-Backed Authority & Sandbox resolution.
    *   **[Router Patterns](./engineering/router-patterns.md)**: Nesting & Shadowing fixes.
    *   **[Infrastructure](./engineering/infrastructure.md)**: Cloudflare & MD-Clean Protocol.
    *   **[Performance](./engineering/performance.md)**: Antigravity Protocol (LCP < 1.2s).
    *   **[Analytics Config](./engineering/analytics-configuration.md)**: GA4 & Clarity setup.
    *   **[i18n Protocol](./engineering/i18n-protocol.md)**: Global authority & SEO sync.
    *   **[Bug Records](./engineering/bug-records.md)**: Historical fix archive.
*   **Standards**:
    *   **[Engineering Standards](./protocols/engineering-standards.md)**: React 19, Syntax, & Patterns.
    *   **[Component Architecture](./protocols/component-architecture.md)**: **[NEW]** Atomic Design & Separation of Concerns.
    *   **[Design Tokens](./engineering/design-tokens.md)**: Semantic Tailwind System.
    *   **[Mock Strategy](./protocols/mock-strategy.md)**: Schema-first development.
    *   **[Testing Protocol](./protocols/testing-protocol.md)**: TDD with Vitest.

### 2. 📈 Growth Specs (The CMO)
**Goal:** Visibility, Authority, Conversion.

*   **Strategy**:
    *   **[Google Quality Protocol](./growth/google-content-quality-spec.md)**: **[CRITICAL]** The "Helpful Content" & E-E-A-T standard.
    *   **[GEO Philosophy](./growth/geo-philosophy.md)**: Ranking in AI Engines (LLMs).
    *   **[AI Native SEO](./growth/ai-native-seo-philosophy.md)**: Shift from keywords to citation.
    *   **[Advanced SEO Rules](./growth/advanced-seo-rules.md)**: Tactics for Top 3 rankings.
    *   **[International SEO](./growth/international-seo-strategy.md)**: Global reach strategy.
    *   **[Copywriting Strategy](./growth/copywriting-strategy.md)**: The "Command to Ship" pivot.
    *   **[Blog Strategy](./growth/blog-strategy.md)**: Pillars of authority content.
    *   **[Brand Alignment](./growth/brand-alignment-audit.md)**: Ensuring G+L+C consistency.
    *   **[Gumroad Launch](./growth/gumroad-launch-protocol.md)**: Monetization setup.
    *   **[Gumroad Product Setup](./growth/gumroad-product-setup.md)**: **[NEW]** Backend configuration.
    *   **[Marketing Prompts](./growth/marketing-prompts.md)**: AI prompts for CRO and Content.
    *   **[Social Media Matrix](./growth/social-media-matrix.md)**: **[NEW]** Persona-based engagement templates.
*   **Execution Protocols**:
    *   **[SEO Master Checklist](./growth/seo-master-checklist.md)**: **[CRITICAL]** The 100-Point Quality Gate.
    *   **[Module A: Keyword Research](./growth/keyword-research-protocol.md)**: Identifying high-intent terms.
    *   **[Module B: On-Page SEO](./growth/on-page-seo-checklist.md)**: Pre-publish quality gate.
    *   **[Module C: Technical Audit](./growth/technical-seo-audit-sop.md)**: Quarterly health checks.
    *   **[Module D: Off-Page SEO](./growth/off-page-seo-protocol.md)**: Backlink building.
    *   **[Module E: Content Maintenance](./growth/content-seo-protocol.md)**: Fighting content decay.
    *   **[Analytics Architecture](./growth/analytics-architecture.md)**: Telemetry tracking.
    *   **[AI Content SOP](./growth/ai-content-generation-sop.md)**: Human-AI hybrid writing flow.

### 3. 🧠 Product Specs (The PM)
**Goal:** Value, Flow, Definition.

*   **[GLC Protocol](./product/glc-protocol.md)**: The Tri-Pillar Philosophy.
*   **[AI Studio Philosophy](./product/ai-studio-philosophy.md)**: **[NEW]** Why we choose this stack.
*   **[Brand Philosophy](./product/brand-philosophy.md)**: Product-Symbol-Emotion framework.
*   **[Requirement Analysis](./product/requirement-analysis.md)**: Converting PRDs to code tasks.
*   **[User Story Map SOP](./product/user-story-map-sop.md)**: Visualizing the user journey.
*   **[Core Flows](./product/core-flows.md)**: Critical paths (Discovery, Activation, Retention).

### 4. 📚 Operator Guides (The Handbooks)
**Goal:** Step-by-step manuals for specific tasks.

*   **[Scaffold Mastery](./guides/scaffold-mastery-protocol.md)**: **[Agent Skill]** Detailed instructions for AI Agents.
*   **[New Product Migration](./guides/new-product-migration.md)**: The Master SOP for launching new apps.
*   **[Payment Integration](./guides/payment-integration.md)**: Creem/Stripe setup via Lovable.
*   **[Pre-Launch Checklist](./guides/pre-launch-checklist.md)**: The Final Gate.
*   **[Feature Development](./guides/feature-development.md)**: From Type Definition to Lovable Handoff.
*   **[White Label Guide](./guides/white-label.md)**: How to rebrand this scaffold in 15 minutes.
*   **[Troubleshooting](./guides/troubleshooting.md)**: Fixing "White Screen", "Process not defined", and 404s.
*   **[Zero IDE Protocol](./guides/zero-ide.md)**: The philosophy of building without a local environment.

### 5. 🧐 The Review Council (The Critics)
**Goal:** Multi-perspective auditing and idea validation.

*   **[The Grumpy Veteran](./review/persona-grumpy-veteran.md)**: 🤬 Brutal honesty & stress testing.
*   **[The Introspective Philosopher](./review/persona-introspective-sister.md)**: 🧘‍♀️ Deep logic & first principles.
*   **[The Hype Girl](./review/persona-fangirl.md)**: ✨ Uncovering hidden genius & marketing gold.
*   **[The Strict Analyst](./review/persona-little-pudding.md)**: 🍮 Structured framework analysis (WCCP).

---
**Directive for Agents:**
1.  **Identify your Role** (Engineer, Marketer, Product, or **Reviewer**).
2.  **Read the Relevant Specs** listed above.
3.  **Execute** with strict adherence to the protocols.
