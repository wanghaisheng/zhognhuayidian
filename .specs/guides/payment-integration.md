# 💳 Guide: Payment Integration Protocol (Creem/Stripe)

**Objective:** To monetize the application instantly using Creem (or Stripe) via Lovable.

---

## 1. The Strategy: "Lock & Key"
*   **The Lock:** A UI state that restricts access to premium features (e.g., "Export Code", "Save Project").
*   **The Key:** A payment success signal that updates the user's status in the database.

## 2. Integration Workflow (Lovable Prompting)

Use the following natural language prompts in Lovable to generate the payment infrastructure.

### Step 1: The UI Trigger
> "Add a 'Pricing' section to the landing page. Create a 'Subscribe' button ($9/month) and a 'Lifetime' button ($49). When clicked, if the user is not logged in, show the Auth modal. If logged in but not paid, trigger the checkout."

### Step 2: The Checkout Logic (Creem)
> "Integrate Creem payments.
> 1. Use `createCheckout` to generate a payment URL.
> 2. Redirect the user to this URL.
> 3. API Key is in `process.env.CREEM_API_KEY`.
> 4. Product ID is `process.env.CREEM_PRODUCT_ID`."

### Step 3: The Webhook (The Handshake)
> "Create a Supabase Edge Function to handle the Creem webhook.
> 1. Listen for `checkout.success`.
> 2. Verify the signature.
> 3. Update the `users` table: set `subscription_status` to 'active' and `plan` to the purchased product.
> 4. Add a record to the `payments` table."

## 3. Environment Variables
Ensure these are set in `.env` (local) and Cloudflare Pages (Production):
*   `CREEM_API_KEY`
*   `CREEM_WEBHOOK_SECRET`
*   `NEXT_PUBLIC_CREEM_PRODUCT_ID`

## 4. Testing
*   **Sandbox**: Use the Creem Test API URL (`https://test-api.creem.io`).
*   **Flow**: Click Buy -> Enter Test Card -> Redirect to Success URL -> Verify DB Update.
