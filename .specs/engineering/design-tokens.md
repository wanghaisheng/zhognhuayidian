# 🎨 Engineering Spec: Design Tokens & Visual Alchemy

**Philosophy:** Content dictates form. Colors are semantic tokens, not static hex codes.

## 1. The Palette (Semantic Tokens)
We use a semantic token system mapped in `tailwind.config.js`. This allows the entire site to "shed its skin" via AI prompts while maintaining structural integrity.

| Token | Class Name | Logic |
| :--- | :--- | :--- |
| **Canvas** | `bg-background` | The infinite void behind the content. |
| **Surface** | `bg-surface` | Cards, Sticky Headers, Modals. |
| **Primary** | `bg-primary` | Call-to-Actions (CTAs), Highlights, Brand Logos. |
| **Text** | `text-foreground` | Headings, Body text (High contrast). |
| **Muted** | `text-muted` | Meta data, secondary labels (Low contrast). |
| **Border** | `border-border` | Subtle dividers, card outlines. |

## 2. Usage Rules (Strict)
*   **❌ FORBIDDEN:** Hardcoded hex values (e.g., `#1e293b`, `#fff`).
*   **❌ FORBIDDEN:** Color names (e.g., `bg-blue-500`) unless generating a specific illustration.
*   **✅ REQUIRED:** Use semantic classes (`bg-primary`, `text-muted-foreground`) for all layout elements.

## 3. Visual Alchemy Protocol
To re-skin the app:
1.  Upload an image to AI Studio.
2.  Prompt: *"Extract the semantic color palette from this image."*
3.  Update `tailwind.config.js` with the new hex codes mapping to the semantic names above.
