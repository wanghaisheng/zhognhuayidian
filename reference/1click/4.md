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

**如何使用这个泛化后的提示词：**

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