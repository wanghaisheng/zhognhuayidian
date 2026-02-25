
# 💰 Growth Spec: Digital Asset Packaging & Backend Setup

**Objective:** To define the structural standards for a professional-grade digital product delivery via Gumroad.

---

## 1. 📦 The Asset Bundle Standard
Every high-velocity digital asset must be packaged with a focus on "Time to Value" (TTV).

### Standard Directory Structure:
1.  **`/src` (The Engine)**: The actual code, templates, or prompts.
2.  **`/automation` (The Scripts)**: Build-time tools for SEO, cleaning, or deployment.
3.  **`/docs` (The Rituals)**: The "Manual" explaining how to execute the workflow.
4.  **`READ_ME_FIRST.md`**: The entry point for the user.

---

## 2. 🟢 Gumroad Backend Configuration

### Tab: Product Basics
- **Thumbnail**: 600x600px. Should show the "Result" (Live App/Money) not just code.
- **Summary**: A one-sentence value-first summary.
- **Call to Action**: Prefer `I want this!` or `Pay`.

### Tab: Content (The Delivery)
- **Archive Format**: `.zip` or `.7z`.
- **Naming**: `[Product_Name]_v[Version]_[Date].zip`.
- **Update Protocol**: When updating, do not delete the old version; prefix it with `[OLD]`.

### Tab: Checkout Settings
- **Custom Fields**:
    - `Discord Handle` (Optional - for community access).
    - `Domain Name` (Optional - for license tracking).
- **License Keys**: **Required**. 
    - *Policy*: One key per purchase. 
    - *Verification*: Must be verifiable via the Product API if used for gated updates.

---

## 3. 🟢 Post-Purchase Optimization (CRO)

### The "Instant Success" Note
*The automated email receipt must include:*
1.  **Direct Download Link**: Immediate access to the archive.
2.  **The 2-Hour Ritual Link**: Link to the "Getting Started" guide.
3.  **Support Channel**: How to get help if the "G+L+C" bridge fails.
4.  **Affiliate Upsell**: Invitation to join the partner program.

---

## 4. 🧪 Quality Assurance (The Final Check)
- [ ] Test the download on a clean machine.
- [ ] Verify license key generation is active.
- [ ] Ensure `site.config.ts` (or equivalent) in the bundle is ready for white-labeling.
