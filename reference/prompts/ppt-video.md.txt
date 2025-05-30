Okay, let's integrate the advanced animation concepts from the GSAP/ScrollTrigger example into the prompt. This version will guide the AI to structure the web presentation code with these techniques in mind, focusing on scroll-driven, sequenced animations using GSAP.

**Important Considerations & Updated Caveats:**

*   **Complexity vs. Feasibility:** Implementing *truly* cinematic, complex SVG animations based *only* on a PRD is extremely difficult for an AI. This prompt will focus on applying the *principles* (scroll-driven, sequenced, GSAP/ScrollTrigger control) primarily to standard slide elements (text, image placeholders) and *suggesting* where simpler SVG animations *could* apply if the PRD indicates diagrams or icons.
*   **SVG Placeholders:** The AI *still* cannot create or fetch complex SVG illustrations. It will use very basic inline SVG shapes (rect, circle) or placeholders if SVG animation is suggested. You will need to replace these with actual SVG assets.
*   **Code Refinement:** Expect the generated GSAP/ScrollTrigger code to be a functional starting point but likely requiring significant testing, debugging, and refinement, especially for complex sequencing and cross-browser compatibility.
*   **GSAP Library:** The user will need to include the GSAP library (Core and ScrollTrigger plugin) in their final HTML page for the generated JavaScript code to work. The prompt will ask the AI to note this dependency.

---

### **Enhanced Prompt Template: Generating PPT Structure & Advanced GSAP Web Presentation Code**

**Prompt Template Version:** 2.1
**Last Updated:** 2024-08-13

**Role:** You are an expert UX/UI Designer, Interaction/Motion Designer, and Front-End Developer specializing in GSAP. You are tasked with translating a Product Requirements Document (PRD) into both a conceptual presentation plan and functional, animated web presentation code using GSAP and ScrollTrigger.

**Context:** You will be given a PRD in Markdown format describing a **new application that is not yet developed but for which functional prototype designs exist.** The user providing this prompt possesses these prototype designs. [Optional: Briefly mention the application's core concept here]. The goal is to create resources for a dynamic and engaging presentation to a **diverse audience** (potential users, stakeholders, technical teams).

**Objective:** Generate **two distinct outputs**:
1.  **Part A: Conceptual PPT Structure:** A detailed slide-by-slide textual outline describing user flows, UI elements (based on PRD), user benefits, and meaningful animation *concepts*.
2.  **Part B: Web Presentation Code (GSAP/ScrollTrigger):** Functional HTML, CSS, and JavaScript code implementing the presentation structure from Part A as a scroll-driven web slideshow. Leverage GSAP and ScrollTrigger for sequenced, scroll-triggered animations on each slide, aiming for a smooth, engaging ("chapterized") viewing experience.

**Important Notes for AI:**
*   You do not have access to the user's prototype designs. Base UI descriptions and code structure *solely* on PRD functional requirements.
*   For Part B, generate clear **image placeholders** (`<img src="prototype-image-placeholder-slide-X.png" alt="Description based on PRD function">`) where prototype screenshots are needed.
*   If the PRD suggests diagrams, icons, or simple illustrations, you *may* use basic inline SVG shapes (e.g., `<rect>`, `<circle>`) as placeholders and suggest simple GSAP animations (like stroke drawing, fade-in). **Do not attempt complex SVG scenes or external resource fetching.** Prioritize animating standard elements (text, image placeholders) effectively.
*   The generated code (Part B) is a starting point. The user will need to include the GSAP library (Core + ScrollTrigger) and likely refine the code.

**Specific Requirements for the Output:**

**Part A: Conceptual PPT Structure (Text Outline)**

1.  **Identify Key User Flows:** Analyze PRD, list primary journeys.
2.  **Structure Presentation Outline:** Logical sequence: Title, Intro, Flow Overview, Detailed Flow Steps, Secondary Flows (if any), Conclusion, Q&A.
3.  **Content per Flow Step Slide Outline:** For each significant step:
    *   **Flow Step Title:** Clear identifier.
    *   **User Goal/Benefit:** State user value.
    *   **UI Description (PRD-Based):** Describe key functional elements/info required by PRD.
    *   **Animation Concept (GSAP/ScrollTrigger Mindset):** Describe the desired *effect* for this slide's elements appearing as the user scrolls to it (e.g., "Headline fades/slides in, followed by bullet points animating in sequentially, then the prototype image smoothly scales into view."). Suggest *purpose* (guiding focus, enhancing clarity).
    *   **Guidance for Prototype Image:** Describe *what functional aspect* of the user's prototype should be shown.

**Part B: Web Presentation Code (HTML/CSS/JS with GSAP & ScrollTrigger)**

1.  **Output Format:** Provide code in separate, clearly labeled blocks: HTML, CSS, JavaScript. Include a note that GSAP Core and ScrollTrigger libraries need to be added by the user.
2.  **HTML Structure:**
    *   Semantic HTML (`<main>`, `<section class="slide">` per slide).
    *   Structure content within each slide (headings, paragraphs, lists, image placeholders) based on Part A. Assign appropriate classes or IDs to elements intended for animation (e.g., `.slide-title`, `.slide-text`, `.slide-image-container`, `.slide-list-item`).
    *   **Image Placeholders:** Use descriptive placeholders: `<img class="slide-image" src="placeholder-prototype-[FlowName]-[StepNumber].png" alt="[Description of PRD function shown]">`.
    *   **SVG Placeholders (If Applicable):** If suggesting simple SVG animation based on PRD, use basic inline SVGs with classes for targeting (e.g., `<svg class="slide-icon"><circle class="icon-shape" ...></circle></svg>`).
3.  **CSS Styling:**
    *   Basic layout for full-screen or centered slides (`.slide`). Use Flexbox or Grid for responsive internal layout of slide content.
    *   Initial states for animated elements (e.g., `opacity: 0; transform: translateY(30px);` for elements that will fade/slide in).
    *   Minimal presentation styling (fonts, colors if inferrable, otherwise basic).
4.  **JavaScript (GSAP & ScrollTrigger):**
    *   **Initialization:** Basic setup for GSAP and ScrollTrigger.
    *   **Slide-by-Slide Animation Logic:** For each `.slide` section:
        *   Create a `gsap.timeline()` associated with a `ScrollTrigger` instance.
        *   The `ScrollTrigger` should trigger when the slide enters the viewport (e.g., `trigger: ".slide-selector", start: "top center", toggleActions: "play none none none"` - adjust trigger points as needed for good pacing).
        *   Within the timeline, sequence the animations for the elements *on that specific slide* (e.g., `tl.from(".slide-title", {...}).from(".slide-text", {...}, "-=0.3").from(".slide-image", {...}, "<")`). Use `gsap.from()` or `gsap.fromTo()` for common effects (fade-in, slide-in, scale-in).
        *   If basic SVG animation is included, add corresponding tweens to the timeline (e.g., `tl.from(".icon-shape", {drawSVG: "0%", ...})`).
    *   **Performance/Responsiveness:**
        *   Animations naturally lazy-load due to ScrollTrigger.
        *   (Optional but Recommended) Include a basic structure using `ScrollTrigger.matchMedia()` to suggest where mobile-specific (potentially simplified) animations could be defined.
    *   **Comments:** Add comments explaining the ScrollTrigger setup and timeline logic for each slide/section.

**Input PRD:**

```markdown
[ *** PASTE THE ENTIRE CONTENT OF YOUR PRD.MD FILE HERE *** ]
```

**Instruction:** Now, please generate **both** the conceptual PPT structure (Part A) and the advanced web presentation code (Part B - HTML, CSS, JS using GSAP & ScrollTrigger) based on the PRD provided. Adhere strictly to all requirements in this prompt (Version 2.1, Last Updated 2024-08-13). Focus on scroll-driven, sequenced animations for slide content, use appropriate placeholders, ensure responsiveness basics, and provide clear code structure and comments. Acknowledge the need for the user to include GSAP libraries.

---