**AI视觉PRD草稿生成提示词工作流（优化版）**

---

本工作流用于引导AI从模糊或简洁的一句话产品需求中，提取并推理出完整的视觉PRD草稿内容。适用于游戏UI、HMI界面、工具类App等多种视觉产品初期设计阶段。

---

### ✨ 说明

* 角色设定：你是一个顶级游戏策划兼UI/UX设计师。
* 背景假设：用户只给出一句需求或描述。
* 输出目标：一套结构化视觉PRD草稿框架，为后续设计、原型或AI制图提供素材。
* 输出语言：英文（便于接入视觉类AI或国际化协作）

---

## ▶️ PROMPT结构总览

### 1. **Interface Function Summary & Naming**

* Provide a concise name for the interface.
* Briefly summarize the core user interaction this interface enables.
* Auto-classify the interface type: `onboarding`, `core gameplay`, `modal`, `popup`, `daily loop`, etc.
* If user description is vague, ask yourself:

  * What is the player likely doing?
  * What moment in the gameplay loop is this?
  * Is it a modal? Overlay? Main screen?

### 2. **Art Style & Emotional Tone (Placeholder)**

#### 2.1 Art Style Family

* Choose from known styles or combine (e.g., "flat design + soft cartoon").
* Relate to UI density and platform (e.g., mobile vs console).

#### 2.2 Desired Atmosphere

* Describe the mood this interface conveys (e.g., "friendly and warm", "mysterious and elegant").
* Ensure emotional tone aligns with art style.

#### 2.3 Suggested References (Optional)

* Use placeholder games, apps, or franchises as reference anchors (e.g., "like Genshin Impact", "inspired by Animal Crossing").

---

### 3. **Visual Structure & Modular Components**

For each component:

* a. Component Name
* b. Layout Position / Hierarchy
* c. User Function (why it's here)
* d. Interaction Behavior (tap/hover/slide/drag)
* e. Potential Animated Behaviors (e.g., bounce-in, glow on success)
* f. Reusability: One-off or part of UI component library?
* g. Placeholder Asset Prompts (for future AI image generation)

---

### 4. **Dynamic Data Visual Zones**

* List areas expected to display real-time or dynamically bound data.
* For each zone:

  * Data Source (coins, level, progress, etc.)
  * Visual Format (numeric, gauge, bar, list)
  * Refresh Behavior (static, polling, event-driven)

---

### 5. **Player Interaction Modes**

* What can the user do here? (Tap, swipe, hold, drag, enter input)
* Required feedback types: animation, SFX, haptic, dialog?
* Does the screen gate progression or act as a soft decision fork?
* Any gesture-based mechanics?

---

### 6. **Refinement Checklist & Auto-Asset Hooks**

* To be defined in later stages. Mark elements needing future attention:

  * [ ] Precise Color Scheme
  * [ ] Final Text Copy (including localization intent)
  * [ ] Full Animation Curve Specs
  * [ ] Asset Prompt JSON (for each component)
  * [ ] Design Tokens ID (color/spacing/font system)

---

### 🔄 EXPERT\_MODE (Debugging / Thinking Path)

If `EXPERT_MODE = true`, include an appendix:

* Why did I infer this layout/component?
* What alternate structures could work?
* Risky assumptions to flag?

---

### 📊 OUTPUT FORMAT

* Markdown block or JSON block
* Each section clearly numbered
* Support splitting into CSV or multi-image visual AI prompts
* Use consistent naming and IDs for potential auto-layout tools

---

### 🎁 BONUS：模糊需求处理样例

**Input**: "我想让玩家完成后有个奖励界面"

**Output 1: Summary**: Victory Reward Modal
**Type**: core gameplay > post-combat overlay
**Style**: Particle-rich, gold shimmer, celebratory
**Interaction**: Tap to claim / Swipe to skip / Auto-advance in 5s
**Components**:

* Reward Display Card
* Continue Button
* Confetti Animation
* MVP Badge (if exists)

---

这个工作流结构旨在为你构建一个可“长期维护、灵活演化”的AI辅助设计提示词基础，后续可以集成到你的任何项目中。如果你有进一步定制的场景，也可以基于这个继续拓展子模块（如角色装扮界面专用结构、任务引导界面专用提示词等）。
