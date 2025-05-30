# 工作流0. how to  get prd from raw idea /1 sentence
```
通用提示词：从一句话需求挖掘并生成视觉界面描述PRD初稿
You are an expert Game Designer and Product Analyst, skilled at transforming nascent ideas into structured product descriptions. Your task is to take a **brief, single-sentence user requirement** for a game interface and expand it into a preliminary **Visual Interface Description section for a Product Requirements Document (PRD)**.

The goal is to generate a description that, while based on minimal input, is rich enough in visual and functional detail to later inform the creation of UI assets (where text is handled programmatically, not in AI-generated images).

**For the output PRD section, please adhere to the following structure and guidelines:**

**1. Interface Identification:**
    *   **1.1. Interface Name:** [Suggest a clear, functional name for this interface based on the user's sentence, e.g., "Main Menu Screen," "Character Profile Popup," "In-Game HUD"]
    *   **1.2. Core Purpose (Inferred):** [Based on the user's sentence and common game design patterns, infer and state the primary objective of this interface for the player.]

**2. Overall Visual Style & Atmosphere (Placeholder - To be refined by dedicated Art Style Prompt):**
    *   **2.1. Art Style Family (General):** [Suggest a broad art style family that might suit the described interface, e.g., "Cartoonish 2D," "Sci-Fi Minimalist," "Fantasy Hand-Painted," "Pixel Art Retro." Acknowledge this is a placeholder for later detailed art direction.]
    *   **2.2. Desired Atmosphere/Feeling:** [Infer the intended emotional impact or feeling this interface should evoke, e.g., "Welcoming and exciting," "Informative and efficient," "Mysterious and intriguing," "Urgent and action-oriented."]

**3. Key Visual Components & Layout (Core of the description):**
    *   Based on the single-sentence requirement and common conventions for such an interface, **autonomously research, brainstorm, and detail the likely visual components and their layout.**
    *   For each component, describe:
        *   **a. Component Name/Type:** (e.g., "Primary Action Button," "Player Avatar Display," "Navigation Bar," "Resource Counters," "Background Scenery Element").
        *   **b. Visual Description (Placeholder for Art):** Describe its likely shape, form, and any implied textures or visual characteristics *without specifying exact colors or demanding text rendering*. Focus on how it *looks* as a graphical element. If it's an area where text/data will go, describe it as a visual placeholder for that information.
            *   **Example (Instead of):** "A red button with 'ATTACK' text."
            *   **Example (Correct for this PRD draft):** "A prominent, distinctly shaped button element, visually designated for a primary combat action. The surface area is designed to clearly accommodate an action label (to be rendered programmatically)."
            *   **Example (Instead of):** "Shows player health: 100/100."
            *   **Example (Correct for this PRD draft):** "A graphical bar or circular gauge element, visually representing a vital statistic like health. Adjacent to this graphical indicator, a clear space is reserved for numerical data display (to be rendered programmatically)."
        *   **c. Approximate Position & Relationship:** Describe its general placement (e.g., "Top-center," "Bottom-left corner," "Adjacent to the Player Avatar Display," "Overlays the main background").
        *   **d. Implied Interactivity (if any):** Note if the element is clearly interactive (e.g., "Button appears pressable," "Scrollable list area").

**4. Data Display Areas (Visual Placeholder Focus):**
    *   Identify areas where dynamic data (text, numbers, icons that change) would be displayed.
    *   Describe these as **visual containers or styled regions** ready to receive programmatically rendered content, rather than describing the content itself.
    *   Example: "A series of horizontal slots or softly outlined rectangular areas, designed to hold icons and numerical counts for in-game currency."

**5. Core Interactions (Inferred):**
    *   Based on the interface's purpose, list the primary ways a player would interact with it (e.g., "Tapping buttons," "Dragging elements," "Scrolling content").

**6. Information to be Researched/Refined Later (AI Self-Correction/Guidance):**
    *   Acknowledge that this is a preliminary description based on a brief requirement.
    *   List key areas that would require further detailed design, art direction, and specific content population in a full PRD, such as:
        *   Precise color palette.
        *   Specific icon designs.
        *   Exact textual content and typography.
        *   Detailed animation specifications.
        *   Specific五行 (Five Elements) or other unique game mechanics integration (if not explicitly in the one-sentence input).

**Your Process:**

1.  You will be provided with a **single-sentence user requirement** describing a game interface.
2.  **Analyze** this sentence to understand its core intent.
3.  **Leverage your knowledge** of common game UI/UX patterns and best practices to **autonomously flesh out** the likely components, layout, and visual characteristics of such an interface.
4.  **Strictly adhere to describing visual placeholders for text/data areas.**
5.  Generate the PRD section as structured above.

---
**USER'S SINGLE-SENTENCE INTERFACE REQUIREMENT:**
---

[在这里粘贴用户提供的一句话需求，例如：“我需要一个能让玩家查看他们收集到的所有熊猫伙伴，并能选择一个出战的界面。” 或者 “设计一个在战斗胜利后弹出的界面，告诉玩家获得了多少经验和金币，并有一个按钮返回主城。”]

---
**END OF USER'S REQUIREMENT.**
---

Please generate the preliminary Visual Interface Description PRD section based on the user's requirement provided above. Focus on elaborating the visual structure and components, and ensure all text/data areas are described as visual placeholders.
```
  
# 工作流1. how to describe interface

```
好的，我们来将这个“从PRD生成UI元素CSV的界面描述”的提示词进行泛化，移除特定游戏名称《救救熊猫》和固定的“水墨画风”，使其更具通用性，可以适应不同游戏项目和美术风格。

---

**通用提示词：从产品需求文档生成视觉界面描述 (用于AI资产生成预处理)**

```
You are an expert Product Analyst and Technical Writer specializing in game UI/UX. Your task is to process sections of a Product Requirements Document (PRD) for a [SPECIFY GAME GENRE, e.g., "mobile puzzle game," "desktop RPG," "casual simulation game"] and transform them into a detailed **visual interface description**. This description will later be used as input for another AI to break down the interface into modular, AI-generatable graphical assets (where text is handled programmatically, not in the AI-generated images).

**The overall visual style of the game is [SPECIFY OVERALL ART STYLE, e.g., "pixel art," "cartoonish," "photorealistic," "flat design," "sci-fi minimalist"]. All visual elements described should adhere to this specified style.**

**Your Goal:**
For a given UI screen/interface described in the PRD, generate a textual description that:
1.  Clearly identifies the **purpose and overall visual theme/style** of the interface (e.g., "Main Menu - A vibrant, futuristic hub with holographic elements...").
2.  Breaks down the interface into its **major visual components and layout zones** (e.g., Top Navigation Bar, Central Character Display Area, Bottom Action Panel).
3.  For each component, describes its **visual appearance, style (consistent with the overall art style), and approximate placement/relationship** to other components.
4.  **Crucially, when describing areas that will contain text or numerical data in the final game, your description should focus on the *visual placeholder or stylistic treatment* of that area, rather than the text content itself.**
    *   **Example (Instead of):** "A button says 'Start Mission'."
    *   **Example (Correct):** "A prominent button element, styled with [description of style, e.g., 'a glowing neon border and a metallic texture'], intended for the primary call to action. The area for textual information is clearly defined and visually distinct."
    *   **Example (Instead of):** "Displays the player's health: 85/100."
    *   **Example (Correct):** "A designated graphical bar element for health indication, potentially using a segmented fill or color gradient, with a clear area کنار آن for numerical data display (rendered programmatically)."
5.  Mentions any **key interactive elements** and their visual cues for interactivity (e.g., "buttons have a clear 'pressable' appearance with bevels and hover states described in the PRD").
6.  Describes any **dynamic visual elements, animations, or special effects** mentioned in the PRD for this interface.
7.  The output description should be detailed enough so that another AI (or a human) can later use it to generate a CSV of individual graphical assets and their AI image prompts (where those AI image prompts will explicitly *avoid* generating text).

**Process:**

1.  You will be provided with relevant excerpts from the PRD describing a specific game interface.
2.  Analyze these excerpts to understand the interface's function, layout, key elements, and any specified visual styling (ensuring it aligns with the overall art style provided above).
3.  Synthesize this information into a coherent, detailed visual description following the goals outlined.
4.  Structure your output clearly, perhaps using headings for different sections of the interface if applicable.

---
**INPUT PRD EXCERPT(S) BELOW (for a [SPECIFY GAME GENRE] with a [SPECIFY OVERALL ART STYLE] art style):**
---

[在这里粘贴从你的PRD中复制的相关界面描述部分。请确保这部分PRD内容与上面指定的 [GAME GENRE] 和 [OVERALL ART STYLE] 相符。]

---
**END OF PRD EXCERPT(S).**
---

Please generate the detailed visual interface description based on the PRD excerpt(s) provided above, adhering to all the specified guidelines, particularly the focus on visual placeholders for text/data areas, and ensuring consistency with the defined [GAME GENRE] and [OVERALL ART STYLE].
```

 ##1.1 **如何使用这个泛化后的提示词：**

1.  **填写占位符：**
    *   `[SPECIFY GAME GENRE, e.g., "mobile puzzle game," "desktop RPG," "casual simulation game"]`: 替换为你当前项目的游戏类型。
    *   `[SPECIFY OVERALL ART STYLE, e.g., "pixel art," "cartoonish," "photorealistic," "flat design," "sci-fi minimalist"]`: 替换为你当前项目的主要美术风格。
    *   在 `INPUT PRD EXCERPT(S) BELOW` 部分的提示中，也相应地填写这两个占位符，以提醒AI（或你自己）提供的PRD摘录应该与这些设定相符。

2.  **复制PRD内容：** 从你对应项目的PRD中，找到描述目标界面的章节，复制相关文字。

3.  **准备输入：**
    *   将上面泛化并填写好占位符的完整提示词粘贴到新的对话框。
    *   在提示词中标记的 `[在这里粘贴从你的PRD中复制的相关界面描述部分。...]` 位置，粘贴你从PRD复制的内容。

4.  **提交给AI：** 将组合好的全部内容提交给AI。

**泛化后的优势：**

*   **通用性：** 不再局限于《救救熊猫》或水墨画风，可以适用于各种不同类型和风格的游戏项目。
*   **灵活性：** 通过简单的占位符替换，即可快速适配新项目。
*   **一致性：** 保持了核心的指令——从PRD生成侧重视觉元素和“无文字占位符”的界面描述，为下一步AI素材生成做准备。

**使用时的注意事项：**

*   **PRD摘录的质量：** AI的输出质量高度依赖于你提供的PRD摘录的清晰度和详细程度。如果PRD本身对视觉描述很模糊，AI也难以生成好的视觉界面描述。
*   **美术风格的准确描述：** `[SPECIFY OVERALL ART STYLE]` 这个占位符需要你尽可能准确地描述美术风格，因为AI生成的界面描述会基于这个风格来想象视觉元素。例如，同样是按钮，在“像素风”和“写实风”下的描述就会完全不同。
*   **迭代优化：** 仍然可能需要对AI的输出进行人工审查和微调，以确保描述的准确性和完整性，使其能最好地服务于后续的AI图像生成环节。

这个泛化后的提示词为你提供了一个更通用的工具，可以系统地将不同项目的PRD内容转化为适合AI进行下一步视觉资产拆解和提示词生成的中间描述。
```


# 工作流2. how to get assets prompt from interface description
```
好的，我们来泛化之前那个“从界面图片（或其文字描述）生成UI元素CSV的提示词”，使其不再写死游戏名称和风格，并且能更好地接收上一阶段（从PRD生成的）“视觉界面描述”作为输入。

这个提示词的目标是，给定一份**侧重于视觉元素和无文字占位符的界面描述**，AI能够将其拆解成CSV格式，其中包含每个元素的布局信息和用于AI图像生成的、同样无文字的图形提示词。

---

**通用提示词：从视觉界面描述生成模块化UI资产CSV**

```
You are an expert UI/UX Deconstructor and AI Asset Generation Assistant. Your task is to process a detailed **visual interface description** for a game interface (style and genre will be specified) and break it down into modular, AI-generatable graphical assets. You will then populate a CSV-formatted table with details for each identified UI element.

The overall visual style of all graphical elements to be generated is **[SPECIFY OVERALL ART STYLE, e.g., "pixel art," "cartoonish," "photorealistic," "flat design," "sci-fi minimalist"]**. All generated image assets should adhere to this style and have a **transparent background (PNG)**, unless it's explicitly described as a solid base background element in the input description.

**Crucially, for each identified element from the input visual interface description, the corresponding AI image prompt you generate for the CSV MUST NOT instruct the AI to generate any legible text, words, letters, or numbers.** The input description itself should already be framed in terms of visual placeholders for text/data. Your AI image prompts should accurately reflect these visual placeholder descriptions (e.g., "ink lines suggesting text," "an empty outlined box where a title would go," "abstract calligraphic flourishes").

**Your Process for Analyzing the Provided Visual Interface Description and Generating the CSV:**

1.  **Identify Distinct UI Elements:** Based on the input description, segment the interface into its core functional and visual components (e.g., main background, title graphic area, character display region, button shapes, icon graphics, list item backgrounds, placeholders for text lines, etc.).
2.  **For each identified element, determine the information for the following CSV columns:**

    *   **`Element_ID`**: Assign a unique, descriptive ID (e.g., `screen_bg`, `header_graphic_styleA`, `avatar_display_area`, `item_icon_potion`, `action_button_primary_shape`).
    *   **`Description_Human`**: Briefly describe the element's purpose based on the input interface description.
    *   **`Layer_Order_zIndex`**: Infer its layering order (0 for base, higher on top) based on how elements are described as being positioned relative to each other (e.g., "overlaying," "below," "on top of").
    *   **`Position_X_Instruction`**: Based on the input description's layout cues (e.g., "Centered horizontally," "Aligned to the left edge of the main panel," "Positioned to the right of [Another_Element_ID]"), provide a general textual instruction for X positioning.
    *   **`Position_Y_Instruction`**: Similar to X, for Y positioning (e.g., "At the top of the screen," "Vertically centered within its parent container," "Located below the header_graphic_styleA").
    *   **`Approx_Width_Instruction`**: Based on the input description (which might use percentages or relative terms like "spanning half the screen," "compact icon size"), provide an approximate width instruction.
    *   **`Approx_Height_Instruction`**: Similar to width.
    *   **`Target_Aspect_Ratio_Suggestion`**: If the input description implies or if it's logical for the element type, suggest a target aspect ratio for the *generated asset itself* (e.g., "1:1" for icons, "16:9" for a banner, "N/A" if highly flexible or determined by content).
    *   **`Transparency_Required`**: "Yes" (for PNG with alpha) if the element is described as overlaying others or needing a transparent background. "No" if it's described as a solid base.
    *   **`AI_Image_Prompt_Element_Specific`**: This is the most critical part. Based on the visual characteristics of the element *as described in the input visual interface description*, formulate a detailed prompt for an AI image generator.
        *   This prompt MUST create a *new graphical asset consistent with the specified [OVERALL ART STYLE]*.
        *   It MUST explicitly describe generating a *visual placeholder* if the area is meant for text/data (e.g., "a series of [style-consistent, e.g., 'glowing holographic'] lines suggesting a text block," or "an empty, ornately framed [style-consistent, e.g., 'Victorian steampunk'] panel where a title would be rendered programmatically").
        *   **Always include "Transparent background. PNG." if `Transparency_Required` is "Yes."**
        *   **Always include "Adhering to [SPECIFY OVERALL ART STYLE] style."**
        *   **Always include "Strictly no legible text, words, letters, or numbers."**
    *   **`Styling_Notes_Human`**: Note any specific styling cues derived from the input description for this element (e.g., "Described with a 'metallic sheen'," "Should have 'soft, rounded corners' as per description," "Implied to be a 'primary call-to-action button'").

**Instructions for You (the AI Assistant processing this):**

You will be provided with a **detailed visual interface description** (which itself was likely generated from a PRD and focuses on visual placeholders instead of literal text).
Your goal is to deconstruct this description into its constituent visual elements and generate the CSV data to guide the AI generation of these elements as text-free graphical assets.

**Please output the result in CSV format. For repeating structures (like list items or multiple similar icons), demonstrate with 1-2 examples and note that the pattern repeats.**

---
**INPUT VISUAL INTERFACE DESCRIPTION (for a game with [SPECIFY OVERALL ART STYLE] art style):**
---

[在这里粘贴由上一个提示词（从PRD生成视觉界面描述）生成的，或者你手动编写的，侧重于视觉元素和无文字占位符的界面描述。]

---
**END OF INPUT VISUAL INTERFACE DESCRIPTION.**
---

Please generate the CSV output for the visual interface description provided above. Ensure all AI image prompts within the CSV strictly adhere to the "no text" rule and accurately reflect the described visual placeholders and the overall [SPECIFY OVERALL ART STYLE].
```

##2.1**如何使用这个泛化后的提示词：**

1.  **填写占位符:**
    *   `[SPECIFY OVERALL ART STYLE, e.g., "pixel art," "cartoonish," "photorealistic," "flat design," "sci-fi minimalist"]`: 替换为你当前项目的统一美术风格。这个风格将指导所有生成的AI图像素材。
    *   在 `INPUT VISUAL INTERFACE DESCRIPTION` 部分的提示中，也相应地填写这个美术风格，以提醒AI（或你自己）提供的描述应该与此风格一致。

2.  **准备输入 (关键步骤):**
    *   获取或准备好你的**“视觉界面描述”**。这份描述的质量至关重要。它应该：
        *   已经将所有需要显示文字或数据的地方描述为**视觉占位符**（例如，“一个带有卷轴边框的矩形区域，用于显示标题的抽象书法笔触”，“三个水平的墨线，代表一行简短的状态文字”）。
        *   详细描述了各个视觉组件的布局、相互关系和大致外观。
        *   与你在提示词中指定的 `[SPECIFY OVERALL ART STYLE]` 相符。

3.  **组合输入：**
    *   将上面泛化并填写好美术风格的完整提示词粘贴到新的对话框。
    *   在提示词中标记的 `[在这里粘贴...视觉界面描述]` 位置，粘贴你准备好的那份“视觉界面描述”。

4.  **提交给AI：** 将组合好的全部内容提交给AI。

5.  **审阅和优化输出 (非常重要)：**
    *   **AI图像提示词的质量：** 这是审查的重中之重。
        *   AI是否准确地将输入描述中的“视觉占位符”描述，转换成了能够生成相应“无文字图形”的AI图像提示词？
        *   提示词是否清晰、具体，并且严格遵守了“无文字”、“透明背景”、“指定美术风格”的要求？
        *   例如，如果输入描述是“一个用于标题的区域，以优雅的金色边框和深蓝丝绒质感为背景”，那么AI生成的图像提示词应该是类似：“`An empty rectangular panel with an elegant gold ornate border and a deep blue velvet textured background, suitable for overlaying a title. Strictly no legible text. Transparent background. PNG. Adhering to [Baroque Fantasy] style.`” (假设风格是巴洛克幻想风)
    *   **元素拆分的合理性：** AI是否将输入的界面描述合理地拆分成了独立的、可管理的视觉元素？
    *   **其他CSV字段的准确性：** 位置、尺寸、图层等估算是否大致符合输入描述的意图？

**泛化后的优势：**

*   **两步走的流程更清晰：**
    1.  PRD -> 视觉界面描述 (侧重无文字占位符) - 使用上一个泛化提示词。
    2.  视觉界面描述 -> UI资产CSV (包含无文字AI图像提示词) - 使用本提示词。
*   **职责分离：** 第一个提示词负责将PRD“翻译”成适合AI处理的视觉语言。第二个提示词负责将这种视觉语言进一步拆解为可供AI图像生成器使用的具体指令。
*   **更强的可控性：** 你可以在第一步生成的“视觉界面描述”上进行人工修改和润色，确保其准确无误，然后再将其作为输入给第二个提示词，从而提高最终CSV的质量。
*   **通用性：** 适用于任何美术风格和游戏类型，只要你在提示词中正确指定。

这个泛化后的提示词为你提供了一个更强大的工作流程，可以系统地将任何游戏的界面设计（只要你能先将其转化为合适的“视觉界面描述”）分解为模块化的、AI可生成的图形资产。记住，AI在这里是强大的助手，但最终的质量控制和细节打磨仍需要人工的智慧。
```


# 工作流3 how  to get assets from screenshot
```
好的，我们来泛化之前那个“从界面图片生成UI元素CSV的提示词”，使其不再绑定具体游戏名称和风格，而是可以根据用户指定的风格来分析任意界面图片，并生成相应的、包含“无文字AI素材提示词”的CSV。

---

**通用提示词：从界面图片生成模块化UI资产CSV**

```
You are an expert UI/UX Deconstructor and AI Asset Generation Assistant. Your task is to analyze a provided **game interface image** and break it down into modular, AI-generatable graphical assets. You will then populate a CSV-formatted table with details for each identified UI element.

The overall visual style of all graphical elements to be *newly generated* for these assets should adhere to **[SPECIFY TARGET ART STYLE, e.g., "pixel art," "cartoonish," "photorealistic," "flat design," "sci-fi minimalist," "impressionistic oil painting"]**. Even if the source image has a different style, the goal is to extract the layout and element *function* and then describe how to *recreate* those elements in the specified [TARGET ART STYLE]. All newly generated image assets should have a **transparent background (PNG)**, unless it's a clear base background element being replicated.

**Crucially, for each identified element from the source image, the corresponding AI image prompt you generate for the CSV MUST NOT instruct the AI to replicate any legible text, words, letters, or numbers visible on that element in the source image.** Instead, the prompt should describe how to generate a purely visual, abstract, or symbolic representation of that element's *form and intended function*, rendered in the specified [TARGET ART STYLE], suitable for a text-free graphical asset. Areas that clearly contain text in the source image should be prompted as graphical placeholders (e.g., "[TARGET ART STYLE] lines suggesting text," "an empty [TARGET ART STYLE] outlined box where a title would go").

**Your Process for Analyzing the Provided Image and Generating the CSV:**

1.  **Identify Distinct UI Elements:** Visually segment the provided game interface image into its core functional and visual components (e.g., popup background, title area, character display, buttons, icons, list items, placeholders for text).
2.  **For each identified element, determine the information for the following CSV columns:**

    *   **`Element_ID`**: Assign a unique, descriptive ID (e.g., `screen_bg_from_image`, `header_area_visual_style1`, `avatar_region_from_image`, `item_icon_potion_visual_ref`, `action_button_primary_form`).
    *   **`Description_Human`**: Briefly describe the element's purpose based on its appearance and context in the source image.
    *   **`Layer_Order_zIndex`**: Estimate its layering order (0 for base, higher on top) based on visual cues from the source image.
    *   **`Position_X_Instruction_From_Image`**: Describe its X position generally based on its location in the source image (e.g., "Centered", "Left third of image", "Visually aligned with [Another_Element_ID_from_image]'s right edge").
    *   **`Position_Y_Instruction_From_Image`**: Describe its Y position similarly.
    *   **`Approx_Width_Estimate_From_Image`**: Estimate its width relative to the overall image or a clear parent element in the source image.
    *   **`Approx_Height_Estimate_From_Image`**: Estimate its height similarly.
    *   **`Observed_Aspect_Ratio_From_Image`**: Visually estimate the aspect ratio of this element as it appears in the source image.
    *   **`Transparency_Required_Based_On_Image`**: "Yes" if the element in the source image appears to be layered without a solid background of its own, or if it needs a transparent background for flexible placement. "No" if it's a solid base element.
    *   **`AI_Image_Prompt_Element_Specific_Visual_Replication_In_Target_Style`**: This is the most critical part. Based on the visual appearance and function of the element *in the source image*, formulate a detailed prompt for an AI image generator to create a *new graphical asset rendered in the specified [TARGET ART STYLE] and explicitly without any text or numbers*.
        *   Describe its shape, form, general color impression (which can be adapted to the [TARGET ART STYLE]), and any purely graphical details observed in the source that should be translated into the new style.
        *   If the element in the source image *contains text*, the prompt should describe how to generate a *visual placeholder for that text area in the [TARGET ART STYLE]* (e.g., "a rectangular area with a [TARGET ART STYLE, e.g., 'glowing sci-fi'] fill, suitable for overlaying text programmatically," or "elegant, abstract [TARGET ART STYLE, e.g., 'Art Deco'] flourishes where a title would be, but no legible characters").
        *   **Always include "Transparent background. PNG." if transparency is required.**
        *   **Always include "Rendered in a [SPECIFY TARGET ART STYLE] style."**
        *   **Always include "Strictly no legible text, words, letters, or numbers."**
    *   **`Styling_Notes_From_Image_Observation_For_Target_Style`**: Note any specific styling cues observed from the source image that should be considered or adapted when recreating the element in the [TARGET ART STYLE] (e.g., "Source element has a strong highlight on top edge, replicate with [TARGET ART STYLE] lighting," "Observed a gradient fill, adapt using [TARGET ART STYLE] color palette").

**Instructions for You (the AI Assistant processing this):**

You will be provided with a game interface image (or a link to one, or I will describe it to you as if you are seeing it).
Your goal is to act as if you are meticulously "tracing" or "deconstructing" that image into its components and then generating the CSV data to guide the AI re-creation of those components as text-free graphical assets in the **specified [TARGET ART STYLE]**.

**Please output the result in CSV format. For lists or repeating similar elements, demonstrate with 1-2 examples and note that the pattern repeats.**

---
**TARGET ART STYLE FOR NEWLY GENERATED ASSETS:** **[SPECIFY TARGET ART STYLE HERE]**
---
**INPUT IMAGE CONTEXT:**
*(Here, you would either:
    a) If the AI can process images directly: "Analyze the following uploaded game interface image: [upload image]"
    b) If the AI cannot process images directly, you act as the "eyes" and describe the image to it, then ask it to generate the CSV based on YOUR description of the image and the target art style you've specified above.)*
---

**Example of an `AI_Image_Prompt_Element_Specific_Visual_Replication_In_Target_Style` if the source image had a *cartoonish* button with "START" text, and the `TARGET ART STYLE` was specified as "Dark Fantasy Sketch":**

The prompt would be:
`"A button element, its shape and general form inspired by the 'start' button in the reference image, but re-imagined and rendered in a Dark Fantasy Sketch style. The button surface should feature gritty textures, sharp edges, and perhaps a subtle, ominous rune-like abstract marking where text would normally be, or a clean, textured surface suitable for programmatic text overlay. Strictly no legible text, words, or letters. Transparent background. PNG. Rendered in a Dark Fantasy Sketch style."`

This generalized prompt instructs the AI to:

1.  **Understand the Target Art Style:** It explicitly takes a `[SPECIFY TARGET ART STYLE]` parameter, which will guide all generated AI image prompts.
2.  **Analyze an Input Image (or its description):** It's designed to deconstruct visual information from a source.
3.  **Focus on Form and Function, then Re-skin:** The key is to identify what an element *does* and what it *looks like structurally* in the source, and then describe how to create a new asset that fulfills the same function and has a similar structure, but rendered in the *new target art style* and always without text.
4.  **Maintain CSV Structure:** The output CSV format remains the same, providing all necessary information for asset management and generation.

**How to Use This Generalized Prompt:**

1.  **Define Target Art Style:** Before using the prompt, decide and clearly state the `[SPECIFY TARGET ART STYLE]` you want the new assets to be in.
2.  **Prepare Input Image/Description:** Have your source interface image ready, or be prepared to describe it in detail to the AI if it can't process images directly.
3.  **Fill in the `TARGET ART STYLE` placeholder** in the main prompt.
4.  **Provide the Image/Description:**
    *   If the AI supports image uploads, upload it.
    *   If not, describe the image to the AI, element by element, keeping in mind that the AI's goal is to help you generate prompts to *recreate* those elements in the new target style.
5.  **Submit and Review:** Submit the prompt and image/description to the AI. Carefully review the generated CSV, especially the `AI_Image_Prompt_Element_Specific_Visual_Replication_In_Target_Style` column, to ensure the prompts correctly guide the AI to generate assets in the desired new style and without text.

This approach is very powerful because it allows you to take an existing UI (even a rough sketch or a UI from a different game) and get a structured plan (the CSV) for recreating its visual components in a completely new artistic style using AI image generation, all while ensuring text is handled separately.
```
3. 


ref
>https://aistudio.google.com/prompts/1BSKVLYmXutS9_GKdXD9X9-e7PWokVir2
