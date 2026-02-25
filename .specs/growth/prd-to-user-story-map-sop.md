# 🗺️ PRD to User Story Map: The Analysis Protocol

**Objective:** To bridge the gap between a static PRD and actionable engineering tasks. This protocol transforms abstract requirements into a visual User Story Map, ensuring alignment on "The Backbone" (User Journey) and "The Slices" (Release Strategy).

**Core Philosophy:** Don't just list requirements. Map the journey.

---

## Phase 1: PRD Deconstruction (The Cast & Goals)
**Goal:** Extract the "Who" and the "Why" before getting lost in the "What".

1.  **Extract Personas (The Actors):**
    *   Scan the PRD for every user type (e.g., Admin, Guest, Subscriber).
    *   *Action:* Create a list of Actors.
2.  **Define Core Value Propositions (The Goals):**
    *   For each Actor, what is their "North Star" outcome?
    *   *Example:* "As a Creator, I want to publish a course so I can earn money."

**Output:** A list of Actors and their primary Goals.

---

## Phase 2: The Narrative Backbone (Horizontal Axis)
**Goal:** Establish the chronological flow of the user experience.

1.  **Map the User Journey:**
    *   Arrange high-level activities in time order (Left to Right).
    *   *Example:* Sign Up -> Onboarding -> Create Content -> Publish -> Analyze Stats.
2.  **Define Activities (The Backbone):**
    *   Group these steps into 5-8 major "Activities". These are your **Epics**.

**Output:** A horizontal timeline of User Activities.

---

## Phase 3: The Task Breakdown (Vertical Axis)
**Goal:** Flesh out the details. What specific tasks must the user perform to complete an activity?

1.  **Break Down Activities into User Tasks:**
    *   Under "Sign Up", list: "Enter Email", "Verify Code", "Set Password".
2.  **Draft User Stories:**
    *   Format: *“As a [Persona], I want to [Action], so that [Benefit].”*
    *   Add **Acceptance Criteria (AC)** to vague stories.
3.  **Identify Gaps:**
    *   Compare against the PRD. Did we miss edge cases? Error states? Empty states?

**Output:** A vertical column of user stories under each backbone activity.

---

## Phase 4: Slicing the Release (Strategy)
**Goal:** Define the MVP and subsequent releases.

1.  **The MVP Line:**
    *   Draw a horizontal line. Move critical "Must-Have" stories above it.
    *   *Question:* "Can the user achieve the Core Value Proposition with *only* these stories?"
2.  **Release 2 & 3:**
    *   Group remaining stories into logical future releases (e.g., "Social Features", "Advanced Analytics").
3.  **Technical Validation:**
    *   Review the MVP slice with engineering. Is it feasible within the timeline?

**Output:** A prioritized, sliced User Story Map ready for the backlog.
